/**
 * Mojave-Shirley — Cookie decline slow-burn arc
 */
(function () {
  'use strict';

  const KEY = 'ms-cookie-choice';
  const ARC_KEY = 'ms-cookie-arc-stage';

  function getStage() {
    return parseInt(localStorage.getItem(ARC_KEY) || '0', 10);
  }

  function setStage(n) {
    localStorage.setItem(ARC_KEY, String(n));
    document.body.classList.remove('cookie-arc-1', 'cookie-arc-2', 'cookie-arc-3');
    if (n >= 1) document.body.classList.add('cookie-arc-1');
    if (n >= 2) document.body.classList.add('cookie-arc-2');
    if (n >= 3) document.body.classList.add('cookie-arc-3');
  }

  function startArc() {
    if (localStorage.getItem(KEY) !== 'declined') return;
    window.MS?.Achievements?.unlock('declined');

    const stage = getStage();
    const schedule = [
      { at: 15000, stage: 1, msg: 'Decline recorded. UI warmth reduced per your preference.' },
      { at: 45000, stage: 2, msg: 'Passive monitoring increased. You asked for less tracking. We track that too.' },
      { at: 90000, stage: 3, msg: 'Full opt-out unavailable. Session continues under alternate policy.' },
    ];

    setStage(stage);

    schedule.forEach(({ at, stage: s, msg }) => {
      if (stage >= s) return;
      setTimeout(() => {
        if (localStorage.getItem(KEY) !== 'declined') return;
        setStage(s);
        window.MS?.showToast(msg, 4000);
      }, at);
    });
  }

  document.addEventListener('ms:cookie-declined', startArc);

  if (localStorage.getItem(KEY) === 'declined') {
    setStage(getStage());
  }

  window.MS = window.MS || {};
  window.MS.CookieArc = { startArc };
})();
