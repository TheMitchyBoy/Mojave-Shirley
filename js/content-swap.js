/**
 * Mojave-Shirley — Progressive disclosure after classified unlock
 */
(function () {
  'use strict';

  const SWAPS = [
    { selector: '[data-swap="nav-cta"]', defaultText: 'Partner With Us', classifiedText: 'Submit Credentials' },
    { selector: '[data-swap="contact-title"]', defaultText: 'enduring', classifiedText: 'irreversible' },
    { selector: '[data-swap="contact-sub"]', defaultText: "Need a site, a web app, or a tracking setup that survives iOS updates? Tell us what you're measuring.", classifiedText: 'We already have your funnel map. Confirm pixel access.' },
    { selector: '[data-swap="footer-tagline"]', defaultText: 'Sites shipped. Events tracked. Opt-out remembered.', classifiedText: 'Sites shipped. Events tracked. You are in the cohort.' },
  ];

  function applyClassifiedMode() {
    document.body.classList.add('content-classified');
    SWAPS.forEach(({ selector, classifiedText }) => {
      const el = document.querySelector(selector);
      if (el) el.textContent = classifiedText;
    });
  }

  function init() {
    if (document.body.classList.contains('classified-mode')) {
      applyClassifiedMode();
    }
  }

  document.addEventListener('ms:classifier-unlocked', applyClassifiedMode);
  init();

  window.MS = window.MS || {};
  window.MS.ContentSwap = { applyClassifiedMode };
})();
