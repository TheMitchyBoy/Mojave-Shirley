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
  const commentBanner = document.getElementById('comment-banner');
  const infraSection = document.getElementById('infrastructure');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 40);

    // Rack LEDs intensify with scroll depth in infra section
    if (infraSection && infraVisual) {
      const rect = infraSection.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, 1 - rect.top / window.innerHeight));
      infraVisual.style.setProperty('--rack-intensity', progress.toFixed(2));
    }

  }, { passive: true });

  menuToggle?.addEventListener('click', () => {
    const open = navLinks?.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => navLinks?.classList.remove('open'));
  });

  const COOKIE_KEY = 'ms-cookie-choice';
  if (localStorage.getItem(COOKIE_KEY)) cookieBanner?.classList.add('hidden');

  cookieAccept?.addEventListener('click', () => {
    localStorage.setItem(COOKIE_KEY, 'accepted');
    cookieBanner?.classList.add('hidden');
    window.MS?.showToast('Preferences stored. Thank you for opting in.');
  });

  cookieDecline?.addEventListener('click', () => {
    localStorage.setItem(COOKIE_KEY, 'declined');
    cookieBanner?.classList.add('hidden');
    window.MS?.showToast('Decline noted. Session persistence unchanged.');
    document.dispatchEvent(new CustomEvent('ms:cookie-declined'));
  });

  finePrint?.addEventListener('mouseenter', () => finePrint.classList.add('revealed'));

  projectCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
      card.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
    });
    card.addEventListener('click', () => {
      window.MS?.Modals?.openProject(card.dataset.project);
    });
  });

  if (infraSection && infraVisual) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        infraVisual.classList.toggle('watching', entry.isIntersecting && entry.intersectionRatio > 0.5);
        if (entry.isIntersecting && commentBanner) {
          commentBanner.classList.add('visible');
        }
      },
      { threshold: [0, 0.3, 0.5, 1] }
    );
    observer.observe(infraSection);
  }

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = new FormData(contactForm).get('name');
    window.MS?.showToast(`Inquiry logged, ${name}. Review has begun.`);
    contactForm.reset();
    setTimeout(() => {
      window.MS?.Modals?.showTicket(name);
    }, 1200);
  });

  // Console greeting
  const v = window.MS?.ASSET_VERSION || '2';
  console.log('%cMojave-Shirley', 'color: #6ee7b7; font-size: 24px; font-weight: bold;');
  console.log('%cSites shipped. Stack maintained. Datacenters optional.', 'color: #8b909a');
  console.log('%cHints: triple-click logo · Konami · type datacenter or mojave', 'color: #8b909a');
  console.log('%cnode-id: edge-7-mojave', 'color: #5c616b; font-size: 10px');
  console.log('%cThis console is also logged.', 'color: #f87171');

  window.MS?.Achievements?.restoreState?.();
})();
