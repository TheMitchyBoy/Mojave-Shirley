/**
 * Mojave-Shirley — Progressive disclosure after classified unlock
 */
(function () {
  'use strict';

  const SWAPS = [
    { selector: '[data-swap="nav-cta"]', defaultText: 'Partner With Us', classifiedText: 'Submit Credentials' },
    { selector: '[data-swap="contact-title"]', defaultText: 'enduring', classifiedText: 'irreversible' },
    { selector: '[data-swap="contact-sub"]', defaultText: "Need a site, a web app, or a full product stack? Tell us what you're building.", classifiedText: 'We already have your scope. Confirm repository access.' },
    { selector: '[data-swap="footer-tagline"]', defaultText: 'Sites shipped. Stack maintained. Datacenters optional.', classifiedText: 'Sites shipped. Stack maintained. You are inside the perimeter.' },
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
