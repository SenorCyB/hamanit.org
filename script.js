/* ==========================================================================
   HAMAN IT SOLUTIONS — script.js
   Theme · Particles · Scroll reveals · Nav scroll · Formspree submit
   ========================================================================== */

(() => {
  'use strict';

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- THEME --------------------------------------------------- */
  const STORAGE_KEY = 'hamit-theme';
  const themeBtn = document.getElementById('themeToggle');

  const applyTheme = (mode) => {
    root.setAttribute('data-theme', mode);
    if (themeBtn) themeBtn.setAttribute('aria-pressed', String(mode === 'dark'));
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', mode === 'dark' ? '#111112' : '#f5f5f7');
  };

  const stored = (() => {
    try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
  })();
  const initial = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(initial);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch {}
      // notify other modules (e.g. particle network) to recolor
      window.dispatchEvent(new CustomEvent('themechange', { detail: { mode: next } }));
    });
  }

  /* ---------- NAV SCROLL STATE --------------------------------------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (!nav) return;
    if (window.scrollY > 12) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- SCROLL REVEAL ------------------------------------------ */
  const revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion) {
    revealEls.forEach(el => el.classList.add('in'));
  } else if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- FORMSPREE SUBMIT --------------------------------------- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  if (form && status) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.removeAttribute('data-state');
      status.textContent = '';

      // honeypot
      const hp = form.querySelector('input[name="_gotcha"]');
      if (hp && hp.value) return;

      // basic native validity
      if (!form.checkValidity()) {
        status.dataset.state = 'err';
        status.textContent = 'Please fill out the required fields.';
        form.reportValidity();
        return;
      }

      form.classList.add('is-loading');
      status.textContent = 'Sending…';

      try {
        const data = new FormData(form);
        const res = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          form.reset();
          form.classList.remove('is-loading');
          form.classList.add('is-success');
          status.dataset.state = 'ok';
          status.textContent = 'Thanks — message sent. I’ll be in touch shortly.';
        } else {
          let msg = 'Something went wrong. Email support@hamanit.org and I’ll get back to you.';
          try {
            const json = await res.json();
            if (json && json.errors && json.errors.length) {
              msg = json.errors.map(x => x.message).join(' ');
            }
          } catch {}
          form.classList.remove('is-loading');
          status.dataset.state = 'err';
          status.textContent = msg;
        }
      } catch (err) {
        form.classList.remove('is-loading');
        status.dataset.state = 'err';
        status.textContent = 'Network error. Try again or email support@hamanit.org.';
      }
    });
  }

  /* ---------- PARTICLE NETWORK --------------------------------------- */
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });

  let DPR = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
  let W = 0, H = 0;
  let particles = [];
  let mouse = { x: -9999, y: -9999, active: false };
  let rafId = null;
  let running = false;

  const colorForTheme = () => root.getAttribute('data-theme') === 'dark'
    ? { r: 229, g: 229, b: 234 }
    : { r: 44,  g: 44,  b: 46 };

  let dotColor = colorForTheme();

  const sizeCanvas = () => {
    const rect = canvas.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    canvas.width  = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  };

  const targetCount = () => {
    const area = W * H;
    // density tuned: ~1 particle per 12000 px², capped
    const n = Math.round(area / 12000);
    return Math.max(40, Math.min(120, n));
  };

  const seed = () => {
    const n = targetCount();
    particles = new Array(n).fill(0).map(() => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: 1.2 + Math.random() * 1.1
    }));
  };

  const linkDist = () => Math.min(150, Math.max(90, Math.hypot(W, H) * 0.07));

  const step = () => {
    ctx.clearRect(0, 0, W, H);
    const LD = linkDist();
    const c = dotColor;

    // update + draw dots
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;

      // mouse repulse
      if (mouse.active) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        const range = 130;
        if (d2 < range * range) {
          const d = Math.sqrt(d2) || 1;
          const force = (range - d) / range * 0.6;
          p.x += (dx / d) * force;
          p.y += (dy / d) * force;
        }
      }

      ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.55)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // links
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < LD * LD) {
          const alpha = (1 - Math.sqrt(d2) / LD) * 0.32;
          ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${alpha.toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // mouse link
      if (mouse.active) {
        const dx = a.x - mouse.x;
        const dy = a.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        const MR = 170;
        if (d2 < MR * MR) {
          const alpha = (1 - Math.sqrt(d2) / MR) * 0.45;
          ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${alpha.toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }

    rafId = requestAnimationFrame(step);
  };

  const start = () => {
    if (running || reduceMotion) return;
    running = true;
    sizeCanvas();
    seed();
    rafId = requestAnimationFrame(step);
  };
  const stop = () => {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  };

  // events
  let resizeT;
  window.addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => {
      DPR = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
      sizeCanvas();
      seed();
    }, 120);
  });

  canvas.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });
  canvas.addEventListener('pointerleave', () => { mouse.active = false; mouse.x = -9999; mouse.y = -9999; });

  window.addEventListener('themechange', () => { dotColor = colorForTheme(); });

  // pause when hero scrolled out of view
  if ('IntersectionObserver' in window) {
    const heroIO = new IntersectionObserver((entries) => {
      entries.forEach(e => { e.isIntersecting ? start() : stop(); });
    }, { threshold: 0.01 });
    heroIO.observe(canvas);
  } else {
    start();
  }

  if (reduceMotion) {
    // single static frame
    sizeCanvas();
    seed();
    step();
    cancelAnimationFrame(rafId);
    rafId = null;
    running = false;
  }
})();
