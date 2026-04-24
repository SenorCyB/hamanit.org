/* ==========================================================================
   HAMAN IT SOLUTIONS — interactions.js
   Expandable service rows · Mobile menu · Smooth anchor focus
   ========================================================================== */

(() => {
  'use strict';

  /* ---------- EXPANDABLE SERVICE ROWS -------------------------------- */
  const rows = document.querySelectorAll('.service-row');

  const setHeight = (row, open) => {
    const body = row.querySelector('.service-body');
    const inner = row.querySelector('.service-body-inner');
    if (!body || !inner) return;

    if (open) {
      const h = inner.getBoundingClientRect().height;
      body.style.height = h + 'px';
      // settle to auto after transition so resizes don't break layout
      const onEnd = (e) => {
        if (e.propertyName !== 'height') return;
        body.style.height = 'auto';
        body.removeEventListener('transitionend', onEnd);
      };
      body.addEventListener('transitionend', onEnd);
    } else {
      // if currently auto, lock to pixel value first so the transition runs
      const current = body.getBoundingClientRect().height;
      body.style.height = current + 'px';
      // force reflow
      void body.offsetHeight;
      body.style.height = '0px';
    }
  };

  const closeRow = (row) => {
    if (!row.classList.contains('is-open')) return;
    row.classList.remove('is-open');
    const head = row.querySelector('.service-head');
    if (head) head.setAttribute('aria-expanded', 'false');
    setHeight(row, false);
  };
  const openRow = (row) => {
    if (row.classList.contains('is-open')) return;
    row.classList.add('is-open');
    const head = row.querySelector('.service-head');
    if (head) head.setAttribute('aria-expanded', 'true');
    setHeight(row, true);
  };

  rows.forEach(row => {
    const head = row.querySelector('.service-head');
    if (!head) return;
    head.addEventListener('click', () => {
      const isOpen = row.classList.contains('is-open');
      // accordion behavior: close siblings
      rows.forEach(r => { if (r !== row) closeRow(r); });
      isOpen ? closeRow(row) : openRow(row);
    });
  });

  // recompute open row on resize (responsive width changes wrap copy)
  let rT;
  window.addEventListener('resize', () => {
    clearTimeout(rT);
    rT = setTimeout(() => {
      rows.forEach(row => {
        if (row.classList.contains('is-open')) {
          const body = row.querySelector('.service-body');
          if (body) body.style.height = 'auto';
        }
      });
    }, 120);
  });

  // open first row by default for affordance
  if (rows[0]) {
    requestAnimationFrame(() => openRow(rows[0]));
  }

  /* ---------- MOBILE MENU -------------------------------------------- */
  const menuBtn = document.getElementById('navMenuBtn');
  const menu    = document.getElementById('mobileMenu');

  const closeMenu = () => {
    if (!menu || !menuBtn) return;
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
  };
  const openMenu = () => {
    if (!menu || !menuBtn) return;
    menu.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = 'hidden';
  };

  if (menuBtn && menu) {
    menuBtn.addEventListener('click', () => {
      menu.classList.contains('open') ? closeMenu() : openMenu();
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) closeMenu();
    });
  }

  /* ---------- ANCHOR FOCUS HANDOFF ----------------------------------- */
  // When a same-page anchor is clicked, move focus to the target after scroll
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (!id || id === '#' || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    // let smooth-scroll happen, then focus
    setTimeout(() => {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }, 500);
  });

  /* ---------- CURRENT-YEAR SAFETY NET -------------------------------- */
  // (footer is hard-coded © 2026 — leave alone unless you swap to data-year)
})();
