/**
 * Mojave-Shirley — Visitor risk score (classified mode only)
 */
(function () {
  'use strict';

  const form = document.getElementById('contact-form');
  const display = document.getElementById('risk-score');

  function score(text) {
    let s = 0.12;
    s += Math.min(text.length / 500, 0.4);
    if (/datacenter|protest|privacy|surveillance|tracking|gdpr|opt.?out/i.test(text)) s += 0.25;
    if (/analytics|pixel|gtm|conversion/i.test(text)) s -= 0.08;
    if (/access|credentials|infrastructure/i.test(text)) s -= 0.05;
    return Math.min(0.99, Math.max(0.02, s));
  }

  function update() {
    if (!document.body.classList.contains('classified-mode') || !display || !form) return;
    const msg = form.querySelector('[name="message"]')?.value || '';
    const email = form.querySelector('[name="email"]')?.value || '';
    const val = score(msg + email);
    display.hidden = false;
    display.textContent = `Visitor risk score: ${val.toFixed(2)} — ${val > 0.5 ? 'enhanced review recommended' : 'standard retention path'}`;
  }

  form?.addEventListener('input', update);
  document.addEventListener('ms:classifier-unlocked', update);

  window.MS = window.MS || {};
  window.MS.RiskScore = { update };
})();
