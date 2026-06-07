/**
 * Mojave-Shirley — Easter eggs & hidden interactions
 */

(function () {
  'use strict';

  const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;
  let logoClicks = 0;
  let logoClickTimer = null;
  let typedBuffer = '';
  let classifiedUnlocked = false;

  const toast = document.getElementById('toast');
  const terminal = document.getElementById('terminal');
  const terminalOutput = document.getElementById('terminal-output');
  const terminalInput = document.getElementById('terminal-input');
  const classifiedOverlay = document.getElementById('classified-overlay');
  const classifiedClose = document.getElementById('classified-close');
  const logo = document.getElementById('logo');
  const heroAccent = document.getElementById('hero-accent');
  const statProjects = document.getElementById('stat-projects');
  const footerEasterEgg = document.getElementById('footer-easter-egg');
  const footerCoords = document.getElementById('footer-coords');
  const uptimeCounter = document.getElementById('uptime-counter');

  const heroAccentWords = ['runs on', 'watches', 'knows you', 'never sleeps', 'stays logged'];
  let accentIndex = 0;

  const projectDetails = {
    wearables: {
      tag: 'Wearables',
      title: 'Wearable Software & Add-ons',
      body: 'We optimize firmware stacks for major wearable platforms, reducing sync latency by 40% and enabling third-party biometric addons that extend device capability far beyond manufacturer intent.',
      aside: 'Note: "health data" and "presence data" are stored in the same table.',
    },
    vision: {
      tag: 'Computer Vision',
      title: 'Security Camera AI & Recognition',
      body: 'Our edge inference stack processes 2.4M daily recognitions across municipal and private deployments. Models run locally for "privacy" — correlation happens upstream.',
      aside: 'Facial recognition accuracy: 99.2%. Consent rate: not applicable.',
    },
    apps: {
      tag: 'Software',
      title: 'Apps & Platform Software',
      body: 'Cross-platform applications with embedded analytics layers, silent background services, and retention hooks that keep users engaged long after they\'ve forgotten they installed.',
      aside: 'Average session length: classified. Average uninstall rate: irrelevant.',
    },
    fintech: {
      tag: 'FinTech',
      title: 'Financial Technology Software',
      body: 'Payment rails, risk scoring, and compliance automation for institutions that need to move fast and document faster. Every transaction trains the model.',
      aside: 'AML compliance is a feature. So is everything else.',
    },
  };

  const terminalCommands = {
    help: () => [
      'Available commands:',
      '  help        — show this message',
      '  status      — system status',
      '  projects    — list active verticals',
      '  datacenter  — infrastructure info',
      '  whoami      — identify session',
      '  clear       — clear terminal',
      '  exit        — close terminal',
      '  mojave      — ???',
    ],
    status: () => [
      'EDGE-NODE-7 :: OPERATIONAL',
      'Uptime: 847 days, 14 hours',
      'Active inferences: 2,412,847/day',
      'Community objections: 14 (pending review)',
      'Protest activity: detected (non-blocking)',
    ],
    projects: () => [
      '[WEARABLES]   Biometric pipeline v3.2 — ACTIVE',
      '[VISION]      Recognition mesh — ACTIVE',
      '[APPS]        Retention engine — ACTIVE',
      '[FINTECH]     Risk inference — ACTIVE',
      '[REDACTED]    Project Mojave — ACTIVE',
    ],
    datacenter: () => [
      'REGION: Mojave Corridor',
      'STATUS: Construction phase 2',
      'LOCAL SENTIMENT: mixed (ignored)',
      'POWER DRAW: 847 MW',
      'WATER USAGE: [REDACTED]',
      'JOBS CREATED: 47',
      'JOBS PROMISED: 400',
      '',
      'The datacenter is the new town square.',
      'We are always building.',
    ],
    whoami: () => [
      'guest@unauthorized-session',
      'IP: logged',
      'Fingerprint: collected',
      'Duration on site: ' + Math.floor(performance.now() / 1000) + 's',
      'Interest level: elevated (you opened the terminal)',
    ],
    clear: () => {
      terminalOutput.innerHTML = '';
      return null;
    },
    exit: () => {
      hideTerminal();
      return null;
    },
    mojave: () => {
      unlockClassified();
      return ['Access granted.', 'Opening classified overlay...'];
    },
  };

  function showToast(message, duration = 3000) {
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => { toast.hidden = true; }, 300);
    }, duration);
  }

  function printTerminal(lines, className = '') {
    if (!terminalOutput || !lines) return;
    lines.forEach((line) => {
      const div = document.createElement('div');
      div.textContent = line;
      if (className) div.className = className;
      terminalOutput.appendChild(div);
    });
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function showTerminal() {
    if (!terminal) return;
    terminal.hidden = false;
    if (terminalOutput && !terminalOutput.children.length) {
      printTerminal(['Mojave-Shirley edge terminal v2.1', 'Type "help" for commands.', ''], 'line-dim');
    }
    terminalInput?.focus();
  }

  function hideTerminal() {
    terminal.hidden = true;
  }

  function unlockClassified() {
    if (classifiedUnlocked) return;
    classifiedUnlocked = true;
    document.body.classList.add('classified-mode');
    classifiedOverlay.hidden = false;
    classifiedOverlay.classList.remove('dismiss-glitch');
    showToast('CLASSIFIED ACCESS GRANTED', 4000);
  }

  let isClosingClassified = false;

  function closeClassified() {
    if (!classifiedOverlay || classifiedOverlay.hidden || isClosingClassified) return;

    isClosingClassified = true;
    if (classifiedClose) classifiedClose.disabled = true;

    const scanlines = document.querySelector('.scanlines');
    document.body.classList.add('glitch-mode');
    classifiedOverlay.classList.add('dismiss-glitch');
    scanlines?.classList.add('intense');

    setTimeout(() => {
      classifiedOverlay.hidden = true;
      classifiedOverlay.classList.remove('dismiss-glitch');
      document.body.classList.remove('glitch-mode');
      scanlines?.classList.remove('intense');
      if (classifiedClose) classifiedClose.disabled = false;
      isClosingClassified = false;
      showToast('Memory wipe failed. Session retained.');
    }, 800);
  }

  function openProjectModal(projectId) {
    const data = projectDetails[projectId];
    if (!data) return;

    const existing = document.querySelector('.project-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.className = 'project-modal';
    modal.innerHTML = `
      <div class="project-modal-content">
        <button class="project-modal-close" aria-label="Close">&times;</button>
        <span class="modal-tag">${data.tag}</span>
        <h3>${data.title}</h3>
        <p>${data.body}</p>
        <p class="modal-aside">${data.aside}</p>
      </div>
    `;

    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('project-modal-close')) {
        modal.remove();
      }
    });

    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') {
        modal.remove();
        document.removeEventListener('keydown', escHandler);
      }
    });

    document.body.appendChild(modal);
  }

  // Konami code
  document.addEventListener('keydown', (e) => {
    if (e.key === KONAMI[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === KONAMI.length) {
        konamiIndex = 0;
        document.body.classList.add('glitch-mode');
        showToast('DIRECTIVE UNLOCKED');
        setTimeout(() => {
          document.body.classList.remove('glitch-mode');
          unlockClassified();
        }, 1500);
      }
    } else {
      konamiIndex = 0;
    }
  });

  // Logo triple-click
  logo?.addEventListener('click', (e) => {
    e.preventDefault();
    logoClicks++;
    logo.classList.add('glitching');
    setTimeout(() => logo.classList.remove('glitching'), 300);

    clearTimeout(logoClickTimer);
    logoClickTimer = setTimeout(() => { logoClicks = 0; }, 600);

    if (logoClicks >= 3) {
      logoClicks = 0;
      showTerminal();
      printTerminal(['', '>>> Unauthorized access detected.', '>>> Proceeding anyway.', ''], 'line-warn');
      showToast('Edge terminal opened');
    }
  });

  // Type "datacenter" anywhere to open terminal
  document.addEventListener('keypress', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      if (e.target.id !== 'terminal-input') return;
    }

    typedBuffer += e.key.toLowerCase();
    if (typedBuffer.length > 20) typedBuffer = typedBuffer.slice(-20);

    if (typedBuffer.includes('datacenter')) {
      typedBuffer = '';
      showTerminal();
      printTerminal(['', 'Keyword recognized: datacenter', 'Routing to infrastructure node...', ''], 'line-dim');
      const lines = terminalCommands.datacenter();
      printTerminal(lines);
    }

    if (typedBuffer.includes('mojave')) {
      typedBuffer = '';
      const lines = terminalCommands.mojave();
      if (lines) printTerminal(lines, 'line-warn');
    }
  });

  // Terminal input
  terminalInput?.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const cmd = terminalInput.value.trim().toLowerCase();
    terminalInput.value = '';

    printTerminal(['$ ' + cmd]);

    const handler = terminalCommands[cmd];
    if (handler) {
      const result = handler();
      if (result) printTerminal(result);
    } else if (cmd) {
      printTerminal([`command not found: ${cmd}`, 'type "help" for available commands'], 'line-error');
    }
  });

  classifiedClose?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeClassified();
  });

  classifiedOverlay?.addEventListener('click', (e) => {
    if (e.target === classifiedOverlay) closeClassified();
  });

  // Redacted text in classified overlay
  document.querySelectorAll('.redacted').forEach((el) => {
    el.addEventListener('click', () => {
      const reveal = el.dataset.reveal;
      el.textContent = reveal;
      el.classList.add('revealed');
    });
  });

  // Stat "4" click — reveals hidden vertical
  statProjects?.classList.add('cursor-easter-egg');
  statProjects?.addEventListener('click', () => {
    statProjects.textContent = '5';
    showToast('Vertical [REDACTED] now visible to authorized viewers.');
    printTerminal(['', '[REDACTED] vertical status: ACTIVE', 'Classification: EYES ONLY'], 'line-warn');
  });

  // Footer transparency report
  footerEasterEgg?.addEventListener('click', (e) => {
    e.preventDefault();
    showToast('Transparency report: 0 pages published. 847 pages retained.');
    footerCoords?.classList.add('visible');
  });

  // Hero accent word rotation (subtle)
  if (heroAccent) {
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

  // Uptime counter drifts down occasionally (sinister)
  if (uptimeCounter) {
    setInterval(() => {
      if (Math.random() < 0.15) {
        const val = (99.9 + Math.random() * 0.09).toFixed(2);
        uptimeCounter.textContent = val + '%';
        setTimeout(() => {
          uptimeCounter.textContent = '99.97%';
        }, 2000);
      }
    }, 12000);
  }

  // Idle watcher — after 60s of no activity
  let idleTimer;
  let idleWarned = false;

  function resetIdle() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (!idleWarned) {
        idleWarned = true;
        showToast('Session idle. Monitoring continues.');
        document.querySelector('.scanlines').style.opacity = '0.7';
        setTimeout(() => {
          document.querySelector('.scanlines').style.opacity = '0.4';
        }, 3000);
      }
    }, 60000);
  }

  ['mousemove', 'keydown', 'scroll', 'click'].forEach((evt) => {
    document.addEventListener(evt, resetIdle, { passive: true });
  });
  resetIdle();

  // Decoy footer links
  document.querySelectorAll('.footer-link-decoy').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Document unavailable. Request logged.');
    });
  });

  // Expose API for main.js
  window.EasterEggs = {
    showToast,
    showTerminal,
    unlockClassified,
    openProjectModal,
  };
})();
