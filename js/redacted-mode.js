/**
 * Mojave-Shirley — sudo redacted mode
 */
(function () {
  'use strict';

  let active = false;

  function enable() {
    if (active) return;
    active = true;
    document.body.classList.add('redacted-mode');
    document.querySelectorAll('.redact-target').forEach((el) => {
      el.dataset.original = el.textContent;
      el.classList.add('redacted-blur');
      el.addEventListener('click', function reveal() {
        el.classList.remove('redacted-blur');
        el.classList.add('redacted-revealed');
        el.removeEventListener('click', reveal);
      });
    });
    window.MS?.Achievements?.unlock('sudo');
    window.MS?.showToast('Elevated access granted. Click text to unredact.');
  }

  function disable() {
    active = false;
    document.body.classList.remove('redacted-mode');
    document.querySelectorAll('.redact-target').forEach((el) => {
      el.classList.remove('redacted-blur', 'redacted-revealed');
    });
  }

  window.MS = window.MS || {};
  window.MS.Redacted = { enable, disable, isActive: () => active };
})();
