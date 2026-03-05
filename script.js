/* ========================================================================
   HAMAN IT - Portfolio Scripts (SAFE VERSION)
   - Won’t crash on pages missing certain elements
   - Uses .reveal + .visible consistently
   ======================================================================== */

(() => {
  "use strict";

  // ---- Navigation: scroll background & active link ----
  const nav = document.getElementById("nav");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");

  function updateNav() {
    if (!nav) return;

    // Scrolled background
    if (window.scrollY > 30) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");

    // Active section highlighting (only works on pages with #sections)
    const scrollPos = window.scrollY + 120;
    let currentSection = "";

    sections.forEach((section) => {
      if (section.offsetTop <= scrollPos) currentSection = section.id;
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      const href = link.getAttribute("href") || "";
      if (href === `#${currentSection}`) link.classList.add("active");
    });
  }

  window.addEventListener("scroll", updateNav, { passive: true });
  updateNav();

  // ---- Mobile menu toggle ----
  const navToggle = document.getElementById("nav-toggle");
  const navMobile = document.getElementById("nav-mobile");

  if (navToggle && navMobile) {
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.classList.toggle("open");
      navMobile.classList.toggle("open", isOpen);
    });

    navMobile.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.classList.remove("open");
        navMobile.classList.remove("open");
      });
    });
  }

  // ---- Typing animation (ONLY if #typing-text exists) ----
  const typingEl = document.getElementById("typing-text");

  if (typingEl) {
    const roles = [
      "IT & Cybersecurity Student",
      "IT Support & Troubleshooting",
      "Network Security + Labs",
      "Hands-on Technical Projects",
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
        setTimeout(() => {
          isDeleting = true;
          typeStep();
        }, 1800);
      } else if (isDeleting && charIndex > 0) {
        charIndex--;
        typingEl.textContent = current.substring(0, charIndex);
        setTimeout(typeStep, 30);
      } else {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeStep, 350);
      }
    }

    typeStep();
  }

  // ---- Scroll reveal (Intersection Observer) ----
  const revealElements = document.querySelectorAll(".reveal");

  if (revealElements.length) {
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );

      revealElements.forEach((el) => observer.observe(el));
    } else {
      revealElements.forEach((el) => el.classList.add("visible"));
    }
  }

  // ---- Card mouse-tracking glow effect ----
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
      card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    });
  });

  // ---- Contact form ----
  const contactForm = document.getElementById("contact-form");
  const formSuccess = document.getElementById("form-success");

  if (contactForm && formSuccess) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("name")?.value || "";
      const email = document.getElementById("email")?.value || "";
      const message = document.getElementById("message")?.value || "";

      const subject = encodeURIComponent(`Message from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);

      window.location.href = `mailto:joshham364@gmail.com?subject=${subject}&body=${body}`;

      contactForm.style.display = "none";
      formSuccess.style.display = "flex";
    });
  }
})();
