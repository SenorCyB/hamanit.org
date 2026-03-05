/* ========================================================================
   HAMAN IT - Portfolio Scripts
   Minimal JavaScript for navigation, animations, and interactivity
   ======================================================================== */

(function () {
  'use strict';

  // ---- Navigation: scroll background & active link ----
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function updateNav() {
    // Scrolled background
    if (window.scrollY > 30) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Active section highlighting
    const scrollPos = window.scrollY + 120;

    let currentSection = '';
    sections.forEach(function (section) {
      if (section.offsetTop <= scrollPos) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentSection) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // ---- Mobile menu toggle ----
  const navToggle = document.getElementById('nav-toggle');
  const navMobile = document.getElementById('nav-mobile');

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

  // ---- Typing animation ----
  const typingEl = document.getElementById('typing-text');
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

  // ---- Scroll reveal (Intersection Observer) ----
  const revealElements = document.querySelectorAll('.reveal');

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
    // Fallback: show all elements immediately
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
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

  // ---- Contact form ----
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;

      const subject = encodeURIComponent('Message from ' + name);
      const body = encodeURIComponent(
        'Name: ' + name + '\nEmail: ' + email + '\n\n' + message
      );

      window.location.href = 'mailto:joshham364@gmail.com?subject=' + subject + '&body=' + body;

      // Show success state
      contactForm.style.display = 'none';
      formSuccess.style.display = 'flex';
    });
  }

})();

// ---- Reveal on scroll (works on every page) ----
document.addEventListener("DOMContentLoaded", () => {
  const reveals = document.querySelectorAll(".reveal");

  if (!reveals.length) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  reveals.forEach((el) => obs.observe(el));
});
