/**
 * Mojave-Shirley — Ops speedrun mode (?ops)
 */
(function () {
  'use strict';

  const params = new URLSearchParams(location.search);
  if (!params.has('ops')) return;

  const HUD = document.createElement('div');
  HUD.className = 'speedrun-hud';
  HUD.innerHTML = '<span>OPS MODE</span><span id="speedrun-timer">00:00</span>';
  document.body.appendChild(HUD);

  let start = null;
  let interval = null;

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    if (!start) return;
    const s = Math.floor((Date.now() - start) / 1000);
    const m = Math.floor(s / 60);
    document.getElementById('speedrun-timer').textContent = `${pad(m)}:${pad(s % 60)}`;
  }

  function begin() {
    if (start) return;
    start = Date.now();
    interval = setInterval(tick, 1000);
    window.MS?.Achievements?.unlock('speedrun');
    window.MS?.showToast('Ops mode engaged. Discover all directives.');
  }

  ['click', 'keydown'].forEach((e) => {
    document.addEventListener(e, begin, { once: true });
  });

  document.addEventListener('ms:finale-unlocked', () => {
    if (!start) return;
    clearInterval(interval);
    const elapsed = Math.floor((Date.now() - start) / 1000);
    const best = parseInt(localStorage.getItem('ms-ops-best') || '99999', 10);
    if (elapsed < best) {
      localStorage.setItem('ms-ops-best', String(elapsed));
      window.MS?.showToast(`New best ops time: ${pad(Math.floor(elapsed / 60))}:${pad(elapsed % 60)}`, 5000);
    } else {
      window.MS?.showToast(`Ops complete in ${pad(Math.floor(elapsed / 60))}:${pad(elapsed % 60)}`, 5000);
    }
  });

  window.MS = window.MS || {};
  window.MS.Speedrun = { active: true };
})();
