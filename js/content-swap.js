/**
 * Mojave-Shirley — Progressive disclosure after classified unlock
 */
(function () {
  'use strict';

  const SWAPS = [
    { selector: '[data-swap="nav-cta"]', defaultText: 'Partner With Us', classifiedText: 'Submit Credentials' },
    { selector: '[data-swap="contact-title"]', defaultText: 'enduring', classifiedText: 'irreversible' },
    { selector: '[data-swap="contact-sub"]', defaultText: "Tell us what you're building. We'll tell you what we need to see.", classifiedText: 'We already have your scope. Confirm access.' },
    { selector: '[data-swap="footer-tagline"]', defaultText: "Tomorrow's infrastructure, poured today.", classifiedText: "Tomorrow's infrastructure, already inside the perimeter." },
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
