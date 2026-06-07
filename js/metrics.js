/**
 * Mojave-Shirley — Live ticking metrics
 */
(function () {
  'use strict';

  let signals = 2400000;

  function formatSignals(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return String(n);
  }

  function tick() {
    signals += Math.floor(Math.random() * 120) + 20;
    const el = document.getElementById('stat-signals');
    if (el) el.textContent = formatSignals(signals);

    if (Math.random() < 0.08) {
      const inf = document.getElementById('stat-inferences');
      if (inf) {
        const base = 2.4 + (Math.random() * 0.05);
        inf.textContent = base.toFixed(2) + 'M';
      }
    }
  }

  const signalsEl = document.getElementById('stat-signals');
  if (signalsEl && !window.MS?.prefersReducedMotion) {
    setInterval(tick, 2000);
  }

  window.MS = window.MS || {};
  window.MS.Metrics = { getSignals: () => formatSignals(signals) };
})();
