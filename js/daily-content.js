/**
 * Mojave-Shirley — Daily rotating content
 */
(function () {
  'use strict';

  const HEADLINES = [
    { neg: 'LOCAL: Noise complaint filed near Phase 2 construction site', pos: 'MS RESPONSE: Progress has a sound. So does the future.' },
    { neg: 'ACTIVISTS: "We never voted for this" — town hall packed', pos: 'MS RESPONSE: Democracy is a process. Permits are outcomes.' },
    { neg: 'UTILITY: Grid strain report cites new load in Mojave corridor', pos: 'MS RESPONSE: We invest in the grid you already depend on.' },
    { neg: 'EDITORIAL: Who invited the datacenter?', pos: 'MS RESPONSE: Invitation is a formality. Integration is inevitable.' },
    { neg: 'BREAKING: Appeal window closes at midnight', pos: 'MS RESPONSE: Thank you for your participation. Construction continues.' },
    { neg: 'WEATHER: Heat wave expected — cooling demand rising', pos: 'MS RESPONSE: Our evaporative systems are community-tested.' },
    { neg: 'LABOR: Union questions contractor hiring practices', pos: 'MS RESPONSE: 47 jobs created. Metrics available on request. Request denied.' },
  ];

  function dayIndex() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    return Math.floor(diff / 86400000);
  }

  function injectDailyTicker() {
    const el = document.getElementById('daily-ticker');
    if (!el) return;
    const h = HEADLINES[dayIndex() % HEADLINES.length];
    el.innerHTML = `
      <span class="ticker-item negative">DAILY: ${h.neg}</span>
      <span class="ticker-item positive">MS RESPONSE: ${h.pos.replace('MS RESPONSE: ', '')}</span>
    `;
  }

  injectDailyTicker();
  window.MS = window.MS || {};
  window.MS.Daily = { injectDailyTicker, dayIndex };
})();
