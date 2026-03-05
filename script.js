/* ========================================================================
   HAMAN IT - Portfolio Scripts
   Page-safe JavaScript for navigation, animations, and interactivity
   ======================================================================== */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    // ---- Navigation: scroll background & active link (safe) ----
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function updateNav() {
      if (!nav) return;

      // Scrolled background
      if (window.scrollY > 30) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');

      // Active section highlighting
      const scrollPos = window.scrollY + 120;

      let currentSection = '';
      sections.forEach(function (section) {
        if (section.offsetTop <= scrollPos) {
          currentSection = section.getAttribute('id');
        }
      });

      // Works for "#about" and "../index.html#about"
      navLinks.forEach(function (link) {
        link.classList.remove('active');

        const href = link.getAttribute('href') || '';
        if (currentSection && href.endsWith('#' + currentSection)) {
          link.classList.add('active');
        }
      });
    }

    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();


    // ---- Mobile menu toggle (safe) ----
    const navToggle = document.getElementById('nav-toggle');
    const navMobile = document.getElementById('nav-mobile');

    if (navToggle && navMobile) {
      navToggle.addEventListener('click', function () {
        const isOpen = navToggle.classList.toggle('open');
        navMobile.classList.toggle('open', isOpen);
      });

      // Close mobile menu on link click
      navMobile.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
          navToggle.classList.remove('open');
          navMobile.classList.remove('open');
        });
      });
    }


    // ---- Typing animation (ONLY if element exists) ----
    const typingEl = document.getElementById('typing-text');
    if (typingEl) {
      const roles = [
        'IT Infrastructure Specialist',
        'Cybersecurity Student',
        'Network Security Analyst',
        'Technical Consultant',
        'Freelance Web Developer',
      ];

      let roleIndex = 0;
      let charIndex = 0;
      let isDeleting = false;

      function typeStep() {
        const current = roles[roleIndex];

        if (!isDeleting && charIndex < current.length) {
          charIndex++;
          typingEl.textContent = current.substring(0, charIndex);
          setTimeout(typeStep, 55);
        } else if (!isDeleting && charIndex === current.length) {
          setTimeout(function () {
            isDeleting = true;
            typeStep();
          }, 2400);
        } else if (isDeleting && charIndex > 0) {
          charIndex--;
          typingEl.textContent = current.substring(0, charIndex);
          setTimeout(typeStep, 30);
        } else if (isDeleting && charIndex === 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(typeStep, 400);
        }
      }

      typeStep();
    }


    // ---- Scroll reveal (ONE system only, adds .visible) ----
    const revealElements = document.querySelectorAll('.reveal');

    if (revealElements.length) {
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );

        revealElements.forEach(function (el) {
          observer.observe(el);
        });
      } else {
        revealElements.forEach(function (el) {
          el.classList.add('visible');
        });
      }
    }


    // ---- Card mouse-tracking glow effect ----
    const cards = document.querySelectorAll('.card');
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
      });
    });


    // ---- Contact form (safe) ----
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');

    if (contactForm && formSuccess) {
      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const nameEl = document.getElementById('name');
        const emailEl = document.getElementById('email');
        const messageEl = document.getElementById('message');

        const name = nameEl ? nameEl.value : '';
        const email = emailEl ? emailEl.value : '';
        const message = messageEl ? messageEl.value : '';

        const subject = encodeURIComponent('Message from ' + name);
        const body = encodeURIComponent(
          'Name: ' + name + '\nEmail: ' + email + '\n\n' + message
        );

        window.location.href =
          'mailto:joshham364@gmail.com?subject=' + subject + '&body=' + body;

        contactForm.style.display = 'none';
        formSuccess.style.display = 'flex';
      });
    }

  });

})();

  reveals.forEach((el) => obs.observe(el));
});
