/**
 * Mojave-Shirley — Optional ambient sound (off by default)
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'ms-sound-enabled';
  let enabled = localStorage.getItem(STORAGE_KEY) === 'true';
  let audioCtx = null;
  let humNode = null;
  let humGain = null;

  function getContext() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }

  function startHum() {
    if (!enabled || window.MS?.prefersReducedMotion) return;
    const ctx = getContext();
    if (humNode) return;

    humGain = ctx.createGain();
    humGain.gain.value = 0.03;
    humGain.connect(ctx.destination);

    humNode = ctx.createOscillator();
    humNode.type = 'sawtooth';
    humNode.frequency.value = 58;
    humNode.connect(humGain);
    humNode.start();

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.15;
    lfoGain.gain.value = 8;
    lfo.connect(lfoGain);
    lfoGain.connect(humNode.frequency);
    lfo.start();
  }

  function stopHum() {
    if (humNode) {
      try { humNode.stop(); } catch { /* already stopped */ }
      humNode = null;
    }
  }

  function playKeystroke() {
    if (!enabled || window.MS?.prefersReducedMotion) return;
    const ctx = getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 800 + Math.random() * 400;
    gain.gain.value = 0.02;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }

  function toggle() {
    enabled = !enabled;
    localStorage.setItem(STORAGE_KEY, String(enabled));
    const btn = document.getElementById('sound-toggle');
    if (btn) {
      btn.textContent = enabled ? 'Sound: On' : 'Sound: Off';
      btn.setAttribute('aria-pressed', String(enabled));
    }
    if (enabled) {
      getContext().resume();
      startHum();
      window.MS?.showToast('Facility ambience enabled.');
    } else {
      stopHum();
      window.MS?.showToast('Audio off. Observation unchanged.');
    }
  }

  const btn = document.getElementById('sound-toggle');
  if (btn) {
    btn.textContent = enabled ? 'Sound: On' : 'Sound: Off';
    btn.setAttribute('aria-pressed', String(enabled));
    btn.addEventListener('click', toggle);
    if (enabled) startHum();
  }

  window.MS = window.MS || {};
  window.MS.Sounds = { playKeystroke, toggle, isEnabled: () => enabled };
})();
