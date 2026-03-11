/* ================================================================
   HAMAN IT — script.js  v2
   ================================================================ */

/* ── 1. Theme Toggle (runs before paint to prevent flash) ──────── */
(function () {
  const root   = document.documentElement;
  const saved  = localStorage.getItem('hamanit-theme') || 'dark';
  root.setAttribute('data-theme', saved);

  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    toggle.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('hamanit-theme', next);
    });
  });
})();

/* ── 2. Nav: scroll shrink + hamburger ─────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  const nav       = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* ── 3. Service cards → scroll to #contact ───────────────────── */
  const contactSection = document.getElementById('contact');
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', () => {
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // After scrolling, briefly highlight the form to draw the eye
        const form = contactSection.querySelector('.contact-form, form');
        if (form) {
          form.style.transition = 'box-shadow 0.4s ease';
          form.style.boxShadow  = '0 0 0 2px var(--accent)';
          setTimeout(() => { form.style.boxShadow = ''; }, 1400);
        }
      }
    });

    // Keyboard accessibility: Enter/Space also triggers
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', card.querySelector('h3')?.textContent + ' — click to contact');
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  /* ── 4. Scroll-reveal ────────────────────────────────────────── */
  const revealEls = document.querySelectorAll(
    '.skill-card, .project-row, .service-card, .timeline-item'
  );
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  revealEls.forEach(el => io.observe(el));

  /* ── 5. Contact form → mailto ────────────────────────────────── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name    = document.getElementById('name')?.value    || '';
      const email   = document.getElementById('email')?.value   || '';
      const subject = document.getElementById('subject')?.value || 'Portfolio Inquiry';
      const message = document.getElementById('message')?.value || '';
      const sub  = encodeURIComponent(subject + ' — from ' + name);
      const body = encodeURIComponent(
        'Name: '    + name    + '\n' +
        'Email: '   + email   + '\n\n' +
        message
      );
      window.location.href = 'mailto:joshham364@gmail.com?subject=' + sub + '&body=' + body;
      const success = document.getElementById('formSuccess');
      if (success) success.classList.add('show');
    });
  }

});
