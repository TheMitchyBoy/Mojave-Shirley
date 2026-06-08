/**
 * Mojave-Shirley — Achievement tracking
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'ms-achievements';

  const DEFINITIONS = {
    terminal: { label: 'Edge Access', hint: 'Open the terminal' },
    konami: { label: 'Directive Unlocked', hint: 'Enter the Konami code' },
    classified: { label: 'Eyes Only', hint: 'View classified directive' },
    datacenter: { label: 'Infrastructure Node', hint: 'Type "datacenter"' },
    mojave: { label: 'Project Mojave', hint: 'Type or run "mojave"' },
    fifth_vertical: { label: 'Fifth Vertical', hint: 'Click Active Verticals stat' },
    transparency: { label: 'Transparency Request', hint: 'Open Transparency Report' },
    coordinates: { label: 'Facility Pin', hint: 'Click Mojave coordinates' },
    surveillance: { label: 'Grid Online', hint: 'Long-press the logo' },
    municipal: { label: 'Town Hall PDF', hint: 'Open municipal partnership' },
    inquiry: { label: 'Inquiry Logged', hint: 'Submit contact form' },
    node_inspect: { label: 'Source Inspector', hint: 'Find the hidden node ID' },
    conscience: { label: 'No Conscience', hint: 'Run rm -rf conscience' },
    achievements: { label: 'Self-Aware', hint: 'Open achievement log' },
    declined: { label: 'Refusal Logged', hint: 'Decline cookies' },
    uptime_fix: { label: 'Grid Stabilizer', hint: 'Click uptime during a dip' },
    whistleblower: { label: 'Report Filed', hint: 'Submit a site report' },
    sudo: { label: 'Elevated Access', hint: 'Run sudo in terminal' },
    careers: { label: 'Pipeline Candidate', hint: 'Apply via Careers' },
    investors: { label: 'Shareholder', hint: 'Open investor deck' },
    speedrun: { label: 'Ops Mode', hint: 'Visit with ?ops' },
    glossary: { label: 'Lexicon Access', hint: 'Run glossary in terminal' },
    share: { label: 'Clearance Card', hint: 'Generate share card after finale' },
    finale: { label: 'Welcome to the Pipe', hint: 'Discover all other directives' },
  };

  let unlocked = load();

  function load() {
    try {
      return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
    } catch {
      return new Set();
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...unlocked]));
  }

  function checkFinale() {
    const keys = Object.keys(DEFINITIONS).filter((k) => k !== 'finale' && k !== 'share');
    const allFound = keys.every((k) => unlocked.has(k));
    if (allFound && !unlocked.has('finale')) {
      unlocked.add('finale');
      save();
      revealPipe();
      document.dispatchEvent(new CustomEvent('ms:finale-unlocked'));
      window.MS?.showToast('All directives found. The pipe accepts you.', 6000);
      showEpilogue();
    }
    updatePanel();
  }

  function revealPipe() {
    const card = document.getElementById('project-pipe');
    const stat = document.getElementById('stat-projects');
    if (card) card.hidden = false;
    if (stat && parseInt(stat.textContent, 10) < 6) stat.textContent = '6';
  }

  function showEpilogue() {
    const el = document.getElementById('finale-epilogue');
    if (el) {
      el.hidden = false;
      setTimeout(() => el.classList.add('visible'), 50);
    }
  }

  function unlock(id) {
    if (!DEFINITIONS[id] || unlocked.has(id)) return false;
    unlocked.add(id);
    save();
    updatePanel();
    const total = Object.keys(DEFINITIONS).length;
    window.MS?.showToast(`Directive found: ${DEFINITIONS[id].label} (${unlocked.size}/${total})`);
    if (id !== 'finale') checkFinale();
    return true;
  }

  function isUnlocked(id) {
    return unlocked.has(id);
  }

  function getProgress() {
    const total = Object.keys(DEFINITIONS).length;
    return { count: unlocked.size, total, ids: [...unlocked] };
  }

  function updatePanel() {
    const list = document.getElementById('achievement-list');
    const progress = document.getElementById('achievement-progress');
    if (!list) return;

    const { count, total } = getProgress();
    if (progress) progress.textContent = `${count} / ${total} directives discovered`;

    list.innerHTML = Object.entries(DEFINITIONS).map(([id, def]) => {
      const found = unlocked.has(id);
      return `<li class="achievement-item ${found ? 'unlocked' : 'locked'}">
        <span class="achievement-icon">${found ? '◆' : '◇'}</span>
        <span class="achievement-label">${def.label}</span>
        <span class="achievement-hint">${found ? 'Discovered' : def.hint}</span>
      </li>`;
    }).join('');

    const shareBtn = document.getElementById('share-clearance-btn');
    if (shareBtn) shareBtn.hidden = !unlocked.has('finale');
  }

  let panelFocusCleanup = null;

  function closePanel() {
    const panel = document.getElementById('achievement-panel');
    if (!panel || panel.hidden) return;
    panel.hidden = true;
    panelFocusCleanup?.();
    panelFocusCleanup = null;
    document.getElementById('achievement-toggle')?.focus();
  }

  function togglePanel() {
    const panel = document.getElementById('achievement-panel');
    if (!panel) return;
    if (!panel.hidden) {
      closePanel();
      return;
    }
    panel.hidden = false;
    unlock('achievements');
    updatePanel();
    panelFocusCleanup = window.MS?.trapFocus(panel.querySelector('.achievement-panel-inner') || panel);
  }

  document.getElementById('achievement-toggle')?.addEventListener('click', togglePanel);
  document.getElementById('achievement-close')?.addEventListener('click', closePanel);
  document.getElementById('share-clearance-btn')?.addEventListener('click', () => {
    window.MS?.Modals?.openShareCard();
    unlock('share');
  });

  function restoreState() {
    updatePanel();
    if (unlocked.has('fifth_vertical')) {
      document.getElementById('stat-projects').textContent =
        unlocked.has('finale') ? '6' : '5';
      document.getElementById('project-redacted').hidden = false;
    }
    if (unlocked.has('finale')) {
      revealPipe();
      showEpilogue();
    }
    if (unlocked.has('classified')) {
      document.body.classList.add('classified-mode');
      window.MS?.ContentSwap?.applyClassifiedMode();
    }
    if (unlocked.has('transparency')) {
      document.getElementById('footer-coords')?.classList.add('visible');
    }
    if (unlocked.has('declined')) {
      const stage = parseInt(localStorage.getItem('ms-cookie-arc-stage') || '0', 10);
      for (let i = 1; i <= stage; i++) document.body.classList.add(`cookie-arc-${i}`);
    }
  }

  window.MS = window.MS || {};
  window.MS.Achievements = { unlock, isUnlocked, getProgress, updatePanel, togglePanel, closePanel, restoreState, checkFinale, DEFINITIONS };
})();
