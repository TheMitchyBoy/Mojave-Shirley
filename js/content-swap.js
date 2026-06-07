/**
 * Mojave-Shirley — Progressive disclosure after classified unlock
 */
(function () {
  'use strict';

  const SWAPS = [
    { selector: '[data-swap="nav-cta"]', defaultText: 'Partner With Us', classifiedText: 'Submit Access Credentials' },
    { selector: '[data-swap="contact-title"]', defaultText: 'enduring', classifiedText: 'permanent' },
    { selector: '[data-swap="contact-sub"]', defaultText: "Tell us about your project. We'll tell you what we need access to.", classifiedText: 'Tell us what you have. We already know what we need.' },
    { selector: '[data-swap="footer-tagline"]', defaultText: "Building tomorrow's infrastructure. Today. Quietly.", classifiedText: "Building tomorrow's infrastructure. Today. Everywhere." },
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
