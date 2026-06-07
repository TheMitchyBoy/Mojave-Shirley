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

  function unlock(id) {
    if (!DEFINITIONS[id] || unlocked.has(id)) return false;
    unlocked.add(id);
    save();
    updatePanel();
    const total = Object.keys(DEFINITIONS).length;
    window.MS?.showToast(`Directive found: ${DEFINITIONS[id].label} (${unlocked.size}/${total})`);
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
  }

  function togglePanel() {
    const panel = document.getElementById('achievement-panel');
    if (!panel) return;
    const open = panel.hidden;
    panel.hidden = !open;
    if (open) {
      unlock('achievements');
      updatePanel();
      window.MS?.trapFocus(panel);
    }
  }

  document.getElementById('achievement-toggle')?.addEventListener('click', togglePanel);
  document.getElementById('achievement-close')?.addEventListener('click', () => {
    const panel = document.getElementById('achievement-panel');
    if (panel) panel.hidden = true;
  });

  function restoreState() {
    updatePanel();
    if (unlocked.has('fifth_vertical')) {
      const stat = document.getElementById('stat-projects');
      const card = document.getElementById('project-redacted');
      if (stat) stat.textContent = '5';
      if (card) card.hidden = false;
    }
    if (unlocked.has('classified')) {
      document.body.classList.add('classified-mode');
      window.MS?.ContentSwap?.applyClassifiedMode();
    }
    if (unlocked.has('transparency')) {
      document.getElementById('footer-coords')?.classList.add('visible');
    }
  }

  window.MS = window.MS || {};
  window.MS.Achievements = { unlock, isUnlocked, getProgress, updatePanel, togglePanel, restoreState, DEFINITIONS };
})();
