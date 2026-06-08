/**
 * Mojave-Shirley — Time-based copy shifts
 */
(function () {
  'use strict';

  function apply() {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 5) {
      document.body.classList.add('night-mode');
      const label = document.getElementById('hero-eyebrow-label');
      const suffix = document.getElementById('hero-eyebrow-suffix');
      const dot = document.querySelector('.hero-eyebrow .pulse-dot');
      if (label) label.textContent = 'Night shift active ·';
      if (suffix) suffix.textContent = 'availability · audit sampling reduced';
      dot?.classList.add('pulse-danger');
    }
  }

  apply();
})();
