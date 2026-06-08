/**
 * Mojave-Shirley — Easter egg orchestration
 */
(function () {
  'use strict';

  const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;
  let logoClicks = 0;
  let logoClickTimer = null;
  let logoPressTimer = null;
  let typedBuffer = '';
  let idleTimer;
  let idleWarned = false;
  let hintShown = false;

  const logo = document.getElementById('logo');
  const heroAccent = document.getElementById('hero-accent');
  const statProjects = document.getElementById('stat-projects');
  const footerEasterEgg = document.getElementById('footer-easter-egg');
  const footerCoords = document.getElementById('footer-coords');
  const uptimeCounter = document.getElementById('uptime-counter');
  const surveillanceGrid = document.getElementById('surveillance-grid');

  const heroAccentWords = ['runs on', 'watches you', 'logs you', 'never sleeps', 'stays installed'];
  let accentIndex = 0;

  // Global Escape — close topmost layer
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const classified = document.getElementById('classified-overlay');
    if (classified && !classified.hidden) {
      window.MS?.Classified?.close();
      return;
    }
    const terminal = document.getElementById('terminal');
    if (terminal && !terminal.hidden) {
      window.MS?.Terminal?.hide();
      return;
    }
    document.querySelector('.project-modal')?.remove();
    const achievementPanel = document.getElementById('achievement-panel');
    if (achievementPanel && !achievementPanel.hidden) {
      achievementPanel.hidden = true;
    }
  });

  // Konami code
  document.addEventListener('keydown', (e) => {
    if (e.key === KONAMI[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === KONAMI.length) {
        konamiIndex = 0;
        window.MS?.Achievements?.unlock('konami');
        if (!window.MS?.prefersReducedMotion) {
          document.body.classList.add('glitch-mode');
          window.MS?.showToast('DIRECTIVE UNLOCKED');
          setTimeout(() => {
            document.body.classList.remove('glitch-mode');
            window.MS?.Classified?.show();
          }, 1500);
        } else {
          window.MS?.Classified?.show();
        }
      }
    } else {
      konamiIndex = 0;
    }
  });

  // Logo triple-click → terminal
  logo?.addEventListener('click', (e) => {
    e.preventDefault();
    logoClicks++;
    logo.classList.add('glitching');
    setTimeout(() => logo.classList.remove('glitching'), 300);
    clearTimeout(logoClickTimer);
    logoClickTimer = setTimeout(() => { logoClicks = 0; }, 600);

    if (logoClicks >= 3) {
      logoClicks = 0;
      window.MS?.Terminal?.show();
      window.MS?.Terminal?.print(['', '>>> auth: failed', '>>> access: granted anyway', ''], 'line-warn');
      window.MS?.showToast('Shell session opened');
    }
  });

  // Logo long-press → surveillance grid
  logo?.addEventListener('mousedown', () => {
    logoPressTimer = setTimeout(() => {
      surveillanceGrid?.classList.add('active');
      window.MS?.showToast('Perimeter grid visible.');
      window.MS?.Achievements?.unlock('surveillance');
      setTimeout(() => surveillanceGrid?.classList.remove('active'), 5000);
    }, 800);
  });
  logo?.addEventListener('mouseup', () => clearTimeout(logoPressTimer));
  logo?.addEventListener('mouseleave', () => clearTimeout(logoPressTimer));
  logo?.addEventListener('touchstart', (e) => {
    e.preventDefault();
    logoPressTimer = setTimeout(() => {
      surveillanceGrid?.classList.add('active');
      window.MS?.Achievements?.unlock('surveillance');
      setTimeout(() => surveillanceGrid?.classList.remove('active'), 5000);
    }, 800);
  }, { passive: false });
  logo?.addEventListener('touchend', () => clearTimeout(logoPressTimer));

  // Keyword typing
  document.addEventListener('keypress', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      if (e.target.id !== 'terminal-input') return;
    }

    typedBuffer += e.key.toLowerCase();
    if (typedBuffer.length > 24) typedBuffer = typedBuffer.slice(-24);

    if (typedBuffer.includes('datacenter')) {
      typedBuffer = '';
      window.MS?.Terminal?.show();
      window.MS?.Terminal?.print(['', 'Keyword recognized: datacenter', 'Routing to infrastructure node...', ''], 'line-dim');
      window.MS?.Terminal?.runCommand('datacenter');
    }

    if (typedBuffer.includes('mojave')) {
      typedBuffer = '';
      window.MS?.Terminal?.runCommand('mojave');
    }

    if (typedBuffer.includes('edge-7-mojave')) {
      typedBuffer = '';
      window.MS?.Achievements?.unlock('node_inspect');
      window.MS?.showToast('Node ID verified. Source inspection logged.');
    }
  });

  // Fifth vertical
  statProjects?.classList.add('cursor-easter-egg');
  statProjects?.addEventListener('click', () => {
    statProjects.textContent = '5';
    const card = document.getElementById('project-redacted');
    if (card) card.hidden = false;
    window.MS?.Achievements?.unlock('fifth_vertical');
    window.MS?.Terminal?.print(['', '[REDACTED] vertical status: ACTIVE', 'Classification: EYES ONLY'], 'line-warn');
  });

  // Footer transparency
  footerEasterEgg?.addEventListener('click', (e) => {
    e.preventDefault();
    window.MS?.showToast('Transparency report: 0 public pages. 847 internal binders.');
    footerCoords?.classList.add('visible');
    window.MS?.Achievements?.unlock('transparency');
  });

  footerCoords?.addEventListener('click', () => {
    if (footerCoords.classList.contains('visible')) {
      window.MS?.Modals?.openFacility();
    }
  });

  // Hero accent rotation
  if (heroAccent && !window.MS?.prefersReducedMotion) {
    setInterval(() => {
      accentIndex = (accentIndex + 1) % heroAccentWords.length;
      heroAccent.style.opacity = '0';
      setTimeout(() => {
        heroAccent.textContent = heroAccentWords[accentIndex];
        heroAccent.style.opacity = '1';
      }, 300);
    }, 8000);
    heroAccent.style.transition = 'opacity 0.3s ease';
  }

  // Uptime drift + mini-game trigger
  if (uptimeCounter && !window.MS?.prefersReducedMotion) {
    setInterval(() => {
      if (Math.random() < 0.15) {
        uptimeCounter.textContent = (99.9 + Math.random() * 0.09).toFixed(2) + '%';
        document.dispatchEvent(new CustomEvent('ms:uptime-dip'));
        setTimeout(() => {
          uptimeCounter.textContent = '99.97%';
          document.dispatchEvent(new CustomEvent('ms:uptime-recover'));
        }, 4000);
      }
    }, 12000);
  }

  // Idle watcher + logo hint
  let hintTimer;
  function resetIdle() {
    clearTimeout(idleTimer);
    clearTimeout(hintTimer);
    hintTimer = setTimeout(() => {
      if (!hintShown) {
        hintShown = true;
        logo?.classList.add('logo-hint');
        setTimeout(() => logo?.classList.remove('logo-hint'), 4000);
      }
    }, 30000);
    idleTimer = setTimeout(() => {
      if (!idleWarned) {
        idleWarned = true;
        window.MS?.showToast('Idle detected. Observation continues.');
        const scanlines = document.querySelector('.scanlines');
        if (scanlines) {
          scanlines.style.opacity = '0.7';
          setTimeout(() => { scanlines.style.opacity = '0.4'; }, 3000);
        }
      }
    }, 60000);
  }

  ['mousemove', 'keydown', 'scroll', 'click'].forEach((evt) => {
    document.addEventListener(evt, resetIdle, { passive: true });
  });
  resetIdle();

  document.querySelectorAll('.footer-link-decoy').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.MS?.showToast('Document withheld. Request archived.');
    });
  });

  // Public API (legacy)
  window.EasterEggs = {
    showToast: (...args) => window.MS?.showToast(...args),
    showTerminal: () => window.MS?.Terminal?.show(),
    unlockClassified: () => window.MS?.Classified?.show(),
    openProjectModal: (id) => window.MS?.Modals?.openProject(id),
  };
})();
