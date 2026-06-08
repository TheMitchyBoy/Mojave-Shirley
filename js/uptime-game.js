/**
 * Mojave-Shirley — Uptime stabilization mini-game
 */
(function () {
  'use strict';

  let dipActive = false;

  document.addEventListener('ms:uptime-dip', () => {
    dipActive = true;
    const el = document.getElementById('uptime-counter');
    el?.classList.add('uptime-dip', 'cursor-easter-egg');
  });

  document.addEventListener('ms:uptime-recover', () => {
    dipActive = false;
    document.getElementById('uptime-counter')?.classList.remove('uptime-dip');
  });

  document.getElementById('uptime-counter')?.addEventListener('click', () => {
    if (!dipActive) return;
    dipActive = false;
    const el = document.getElementById('uptime-counter');
    if (el) {
      el.textContent = '99.97%';
      el.classList.remove('uptime-dip');
    }
    window.MS?.Achievements?.unlock('uptime_fix');
    window.MS?.showToast('Thank you for your involuntary participation.');
  });

  window.MS = window.MS || {};
  window.MS.UptimeGame = { setDipActive: (v) => { dipActive = v; } };
})();
