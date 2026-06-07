/**
 * Mojave-Shirley — Global config & shared utilities
 */
(function () {
  'use strict';

  const ASSET_VERSION = '2';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => { toast.hidden = true; }, 300);
    }, duration);
  }

  function trapFocus(container) {
    const focusable = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    function handleTab(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }

    container.addEventListener('keydown', handleTab);
    first?.focus();
    return () => container.removeEventListener('keydown', handleTab);
  }

  function closeOnEscape(handler) {
    function onKey(e) {
      if (e.key === 'Escape') handler();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }

  window.MS = {
    ASSET_VERSION,
    prefersReducedMotion,
    showToast,
    trapFocus,
    closeOnEscape,
  };
})();
