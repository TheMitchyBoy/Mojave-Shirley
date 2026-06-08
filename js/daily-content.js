/**
 * Mojave-Shirley — Daily rotating content
 */
(function () {
  'use strict';

  const HEADLINES = [
    { neg: 'NOISE: Residents report hum from new cooling stacks', pos: 'Progress sounds like industry' },
    { neg: 'TOWN HALL: Standing room only on datacenter expansion', pos: 'Engagement metrics exceed forecast' },
    { neg: 'GRID: Utility warns of load from Mojave corridor', pos: 'We are the load you asked for' },
    { neg: 'EDITORIAL: Who approved this site?', pos: 'Approvals are a process, not a headline' },
    { neg: 'LEGAL: Appeal deadline passes at midnight', pos: 'Calendar events proceed on schedule' },
    { neg: 'HEAT: Record temps strain regional cooling', pos: 'Evaporative systems within spec' },
    { neg: 'LABOR: Union questions contractor hiring counts', pos: '47 roles filled — spreadsheet attached' },
  ];

  function dayIndex() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    return Math.floor((now - start) / 86400000);
  }

  function injectDailyTicker() {
    const el = document.getElementById('daily-ticker');
    if (!el) return;
    const h = HEADLINES[dayIndex() % HEADLINES.length];
    el.innerHTML = `
      <span class="ticker-item negative">TODAY: ${h.neg}</span>
      <span class="ticker-item positive">MS: ${h.pos}</span>
    `;
  }

  injectDailyTicker();
  window.MS = window.MS || {};
  window.MS.Daily = { injectDailyTicker, dayIndex };
})();
