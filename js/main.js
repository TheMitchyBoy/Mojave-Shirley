/**
 * Mojave-Shirley — Main site interactions
 */

(function () {
  'use strict';

  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const yearEl = document.getElementById('year');
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  const cookieDecline = document.getElementById('cookie-decline');
  const contactForm = document.getElementById('contact-form');
  const finePrint = document.getElementById('fine-print');
  const projectCards = document.querySelectorAll('.project-card');
  const infraVisual = document.getElementById('infra-visual');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Scroll header state
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    header?.classList.toggle('scrolled', y > 40);
    lastScroll = y;
  }, { passive: true });

  // Mobile menu
  menuToggle?.addEventListener('click', () => {
    const open = navLinks?.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => navLinks?.classList.remove('open'));
  });

  // Cookie banner
  const COOKIE_KEY = 'ms-cookie-choice';
  if (localStorage.getItem(COOKIE_KEY)) {
    cookieBanner?.classList.add('hidden');
  }

  cookieAccept?.addEventListener('click', () => {
    localStorage.setItem(COOKIE_KEY, 'accepted');
    cookieBanner?.classList.add('hidden');
    window.EasterEggs?.showToast('Preferences saved. Thank you for your compliance.');
  });

  cookieDecline?.addEventListener('click', () => {
    localStorage.setItem(COOKIE_KEY, 'declined');
    cookieBanner?.classList.add('hidden');
    window.EasterEggs?.showToast('Decline logged. Tracking continues.');
  });

  // Fine print reveal on hover (long enough to read)
  finePrint?.addEventListener('mouseenter', () => {
    finePrint.classList.add('revealed');
  });

  // Project card spotlight glow
  projectCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });

    card.addEventListener('click', () => {
      const project = card.dataset.project;
      window.EasterEggs?.openProjectModal(project);
    });
  });

  // Infrastructure visual — eyes follow scroll
  const infraSection = document.getElementById('infrastructure');
  if (infraSection && infraVisual) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        infraVisual.classList.toggle('watching', entry.isIntersecting && entry.intersectionRatio > 0.5);
      },
      { threshold: [0, 0.5, 1] }
    );
    observer.observe(infraSection);
  }

  // Contact form
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const name = formData.get('name');

    window.EasterEggs?.showToast(`Inquiry received, ${name}. We'll be in touch.`);
    contactForm.reset();

    setTimeout(() => {
      window.EasterEggs?.showToast('Your message has been queued for review. And retention.');
    }, 2500);
  });

  // Smooth anchor offset handled via scroll-padding-top in CSS

  // Console greeting (subtle easter egg seed)
  const styles = [
    'color: #6ee7b7',
    'color: #8b909a',
    'color: #f87171',
  ];
  console.log('%cMojave-Shirley', styles[0] + '; font-size: 24px; font-weight: bold;');
  console.log('%cBuilding tomorrow\'s infrastructure. Today. Quietly.', styles[1]);
  console.log('%cTip: try typing "help" in the terminal. Or the Konami code. Or click the logo three times.', styles[1]);
  console.log('%cWe see you looking.', styles[2]);
})();
