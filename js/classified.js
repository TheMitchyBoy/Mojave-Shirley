/**
 * Mojave-Shirley — Classified overlay
 */
(function () {
  'use strict';

  const classifiedOverlay = document.getElementById('classified-overlay');
  const classifiedClose = document.getElementById('classified-close');
  let isClosing = false;
  let unlocked = false;
  let releaseFocus = null;

  function show() {
    if (!classifiedOverlay || isClosing) return;

    const firstUnlock = !unlocked && !window.MS?.Achievements?.isUnlocked('classified');
    unlocked = true;
    document.body.classList.add('classified-mode');
    document.dispatchEvent(new CustomEvent('ms:classifier-unlocked'));
    window.MS?.ContentSwap?.applyClassifiedMode();
    window.MS?.Achievements?.unlock('classified');
    if (firstUnlock) {
      window.MS?.showToast('CLASSIFIED ACCESS GRANTED', 4000);
    }

    classifiedOverlay.classList.remove('dismiss-glitch');
    classifiedOverlay.hidden = false;

    const content = classifiedOverlay.querySelector('.classified-content');
    if (content) {
      content.style.animation = 'none';
      void content.offsetHeight;
      content.style.animation = '';
    }

    if (releaseFocus) releaseFocus();
    releaseFocus = window.MS?.trapFocus(classifiedOverlay);
  }

  function close() {
    if (!classifiedOverlay || classifiedOverlay.hidden || isClosing) return;

    isClosing = true;
    if (classifiedClose) classifiedClose.disabled = true;

    const scanlines = document.querySelector('.scanlines');
    const useGlitch = !window.MS?.prefersReducedMotion;

    if (useGlitch) {
      document.body.classList.add('glitch-mode');
      classifiedOverlay.classList.add('dismiss-glitch');
      scanlines?.classList.add('intense');
    }

    const delay = useGlitch ? 800 : 100;

    setTimeout(() => {
      classifiedOverlay.hidden = true;
      classifiedOverlay.classList.remove('dismiss-glitch');
      document.body.classList.remove('glitch-mode');
      scanlines?.classList.remove('intense');
      if (classifiedClose) classifiedClose.disabled = false;
      isClosing = false;
      if (releaseFocus) releaseFocus();
      releaseFocus = null;
      window.MS?.showToast('Memory wipe failed. Session retained.');
    }, delay);
  }

  classifiedClose?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    close();
  });

  classifiedOverlay?.addEventListener('click', (e) => {
    if (e.target === classifiedOverlay) close();
  });

  document.querySelectorAll('.redacted').forEach((el) => {
    el.addEventListener('click', () => {
      el.textContent = el.dataset.reveal;
      el.classList.add('revealed');
    });
  });

  window.MS = window.MS || {};
  window.MS.Classified = { show, close, isUnlocked: () => unlocked };
})();
