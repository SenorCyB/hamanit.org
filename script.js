/* ================================================================
   HAMAN IT — script.js
   Add these lines to the TOP of your existing script.js
   (or paste the full block, then append your existing code below)
   ================================================================ */

/* ── Theme Toggle ──────────────────────────────────────────────── */
(function () {
  const root   = document.documentElement;
  const toggle = document.getElementById('themeToggle');

  // Apply saved preference before first paint (avoids flash)
  const saved = localStorage.getItem('hamanit-theme') || 'dark';
  root.setAttribute('data-theme', saved);

  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('hamanit-theme', next);
  });
})();

/* ================================================================
   ↓↓ PASTE YOUR EXISTING script.js CODE BELOW THIS LINE ↓↓
   ================================================================ */

/* ── Nav scroll + hamburger ──────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

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

const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
}

/* ── Scroll-reveal ───────────────────────────────────────────── */
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

/* ── Contact form → mailto ───────────────────────────────────── */
function handleSubmit(e) {
  e.preventDefault();
  const name    = document.getElementById('name').value;
  const email   = document.getElementById('email').value;
  const message = document.getElementById('message').value;
  const subject = encodeURIComponent('Portfolio Contact from ' + name);
  const body    = encodeURIComponent('From: ' + name + '\nEmail: ' + email + '\n\n' + message);
  window.location.href = 'mailto:joshham364@gmail.com?subject=' + subject + '&body=' + body;
  const success = document.getElementById('formSuccess');
  if (success) success.classList.add('show');
}
