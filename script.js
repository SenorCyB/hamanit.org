/* ================================================================
   HAMAN IT — interactions.js
   Cyber Dashboard Interactivity Layer
   Add: <script src="interactions.js" defer></script> before </body>
   ================================================================ */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════════
     1.  CYBER CANVAS
         Fixed background — circuit-grid nodes + flowing packets.
         Mouse proximity brightens nearby nodes/edges.
         Scroll speed spawns burst of packets.
  ══════════════════════════════════════════════════════════════ */
  class CyberCanvas {
    constructor () {
      this.canvas = document.getElementById('cyber-canvas');
      if (!this.canvas) return;
      this.ctx         = this.canvas.getContext('2d');
      this.nodes       = [];
      this.edges       = [];   // each edge: [idxA, idxB]
      this.packets     = [];
      this.mouse       = { x: -9999, y: -9999 };
      this.lastScrollY = 0;
      this.frame       = 0;
      this._setup();
    }

    _setup () {
      this._resize();
      window.addEventListener('resize', () => {
        clearTimeout(this._rt);
        this._rt = setTimeout(() => this._resize(), 250);
      });
      window.addEventListener('scroll', () => this._onScroll(), { passive: true });
      document.addEventListener('mousemove', e => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
      });
      this._tick();
    }

    _resize () {
      this.canvas.width  = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this._buildCircuit();
    }

    /* Build a circuit-board style grid of nodes + edges */
    _buildCircuit () {
      const W    = this.canvas.width;
      const H    = this.canvas.height;
      const CELL = 135;
      const JITTER = CELL * 0.32;
      const cols = Math.ceil(W / CELL);
      const rows = Math.ceil(H / CELL);

      this.nodes   = [];
      this.edges   = [];
      this.packets = [];

      /* Place nodes at jittered grid positions */
      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          this.nodes.push({
            x: c * CELL + (Math.random() - 0.5) * JITTER * 2,
            y: r * CELL + (Math.random() - 0.5) * JITTER * 2,
          });
        }
      }

      const idx = (r, c) => r * (cols + 1) + c;

      /* Connect with circuit-style paths (80% horizontal/vertical, rare diagonal) */
      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          if (c < cols && Math.random() > 0.14)
            this.edges.push([idx(r, c), idx(r, c + 1)]);
          if (r < rows && Math.random() > 0.14)
            this.edges.push([idx(r, c), idx(r + 1, c)]);
          if (c < cols && r < rows && Math.random() > 0.87)
            this.edges.push([idx(r, c), idx(r + 1, c + 1)]);
        }
      }
    }

    _onScroll () {
      const delta = Math.abs(window.scrollY - this.lastScrollY);
      this.lastScrollY = window.scrollY;
      if (delta > 2) {
        const burst = Math.min(Math.floor(delta / 7) + 1, 7);
        for (let i = 0; i < burst; i++) this._spawn();
      }
    }

    _spawn () {
      if (!this.edges.length) return;
      const edge = this.edges[Math.floor(Math.random() * this.edges.length)];
      /* Occasionally reverse direction for variety */
      const rev = Math.random() > 0.5;
      this.packets.push({
        a    : rev ? edge[1] : edge[0],
        b    : rev ? edge[0] : edge[1],
        t    : 0,
        speed: 0.005 + Math.random() * 0.011,
        size : 2   + Math.random() * 1.8,
        glow : 7   + Math.random() * 10,
      });
    }

    _palette () {
      const lm = document.documentElement.getAttribute('data-theme') === 'light';
      return {
        lm,
        edge : lm ? 'rgba(37,88,212,'   : 'rgba(107,164,255,',
        node : lm ? 'rgba(37,88,212,'   : 'rgba(107,164,255,',
        pCore: lm ? '#4a7de8'           : '#c8dcff',
        pGlow: lm ? 'rgba(37,88,212,'   : 'rgba(107,164,255,',
      };
    }

    _tick () {
      this.frame++;
      const ctx  = this.ctx;
      const W    = this.canvas.width;
      const H    = this.canvas.height;
      const pal  = this._palette();
      const MR   = 175;   /* mouse influence radius */

      ctx.clearRect(0, 0, W, H);

      /* ── Draw edges ── */
      this.edges.forEach(([ai, bi]) => {
        const a = this.nodes[ai];
        const b = this.nodes[bi];
        if (!a || !b) return;
        /* Mouse boost on edge midpoint */
        const mx   = (a.x + b.x) / 2 - this.mouse.x;
        const my   = (a.y + b.y) / 2 - this.mouse.y;
        const dist = Math.sqrt(mx * mx + my * my);
        const mb   = dist < MR ? (1 - dist / MR) * 0.30 : 0;
        const base = pal.lm ? 0.045 : 0.065;

        ctx.beginPath();
        ctx.strokeStyle = pal.edge + (base + mb) + ')';
        ctx.lineWidth   = 0.65;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      });

      /* ── Draw nodes ── */
      this.nodes.forEach(n => {
        const dx   = n.x - this.mouse.x;
        const dy   = n.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const mb   = dist < MR ? (1 - dist / MR) * 0.6 : 0;
        const al   = (pal.lm ? 0.14 : 0.20) + mb;
        const r    = 1.2 + mb * 2.8;

        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, 6.283);
        ctx.fillStyle = pal.node + al + ')';
        ctx.fill();

        /* Small pulsing halo on mouse-near nodes */
        if (mb > 0.35) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, r + 3 + mb * 4, 0, 6.283);
          ctx.fillStyle = pal.node + (mb * 0.25) + ')';
          ctx.fill();
        }
      });

      /* ── Idle trickle ── */
      if (this.frame % 50 === 0 && this.packets.length < 20) this._spawn();

      /* ── Draw & update packets ── */
      this.packets = this.packets.filter(p => {
        p.t += p.speed;
        if (p.t >= 1) return false;

        const a = this.nodes[p.a];
        const b = this.nodes[p.b];
        if (!a || !b) return false;

        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;

        /* Glow halo */
        const g = ctx.createRadialGradient(x, y, 0, x, y, p.glow);
        g.addColorStop(0,    pal.pGlow + '0.80)');
        g.addColorStop(0.40, pal.pGlow + '0.32)');
        g.addColorStop(1,    pal.pGlow + '0)');
        ctx.beginPath();
        ctx.arc(x, y, p.glow, 0, 6.283);
        ctx.fillStyle = g;
        ctx.fill();

        /* Solid core */
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, 6.283);
        ctx.fillStyle = pal.pCore;
        ctx.fill();

        return true;
      });

      requestAnimationFrame(() => this._tick());
    }
  }

  /* ══════════════════════════════════════════════════════════════
     2.  CUSTOM CURSOR
         Instant dot + lerped ring.
         Expands on hover, snaps on click, crosshair appears.
  ══════════════════════════════════════════════════════════════ */
  class CustomCursor {
    constructor () {
      this.dot  = document.getElementById('cursor-dot');
      this.ring = document.getElementById('cursor-ring');
      if (!this.dot || !this.ring) return;
      this.mx = 0; this.my = 0;
      this.rx = 0; this.ry = 0;
      this._bind();
      this._loop();
    }

    _bind () {
      /* Instant dot follows mouse precisely */
      document.addEventListener('mousemove', e => {
        this.mx = e.clientX;
        this.my = e.clientY;
        this.dot.style.transform = `translate(${this.mx}px,${this.my}px)`;
      });

      document.addEventListener('mousedown',  () => {
        this.ring.classList.add('ring--click');
        this.dot.classList.add('dot--click');
      });
      document.addEventListener('mouseup', () => {
        this.ring.classList.remove('ring--click');
        this.dot.classList.remove('dot--click');
      });
      document.addEventListener('mouseleave', () => {
        this.dot.style.opacity  = '0';
        this.ring.style.opacity = '0';
      });
      document.addEventListener('mouseenter', () => {
        this.dot.style.opacity  = '1';
        this.ring.style.opacity = '0.65';
      });

      /* Hover detection */
      const sel = 'a, button, .service-card, .skill-card, .project-row, ' +
                  'input, textarea, label, .nav-cta, .btn-primary, .btn-ghost, ' +
                  '.contact-link-item, .theme-toggle, .nav-hamburger';

      /* Use event delegation for performance */
      document.addEventListener('mouseover', e => {
        if (e.target.closest(sel)) this.ring.classList.add('ring--hover');
      });
      document.addEventListener('mouseout', e => {
        if (e.target.closest(sel)) this.ring.classList.remove('ring--hover');
      });
    }

    _loop () {
      /* Lerp ring toward dot position */
      this.rx += (this.mx - this.rx) * 0.115;
      this.ry += (this.my - this.ry) * 0.115;
      this.ring.style.transform = `translate(${this.rx}px,${this.ry}px)`;
      requestAnimationFrame(() => this._loop());
    }
  }

  /* ══════════════════════════════════════════════════════════════
     3.  CLICK RIPPLE
         Expanding ring at click coordinates.
  ══════════════════════════════════════════════════════════════ */
  function initRipple () {
    document.addEventListener('click', e => {
      const r = document.createElement('span');
      r.className = 'click-ripple';
      r.style.left = e.clientX + 'px';
      r.style.top  = e.clientY + 'px';
      document.body.appendChild(r);
      r.addEventListener('animationend', () => r.remove());
    });
  }

  /* ══════════════════════════════════════════════════════════════
     4.  SECTION LABEL GLITCH
         On hover, characters scramble then resolve back.
  ══════════════════════════════════════════════════════════════ */
  function initGlitch () {
    const CHARS = '!<>-_\\/[]{}—=+*^?#@~|';

    document.querySelectorAll('.section-label').forEach(el => {
      /* Strip the ::after line — only scramble the text node */
      const orig = el.firstChild ? el.firstChild.textContent.trim() : el.textContent.trim();
      let timer  = null;

      el.addEventListener('mouseenter', () => {
        clearInterval(timer);
        let iter = 0;
        timer = setInterval(() => {
          const scrambled = orig
            .split('')
            .map((ch, i) => {
              if (ch === ' ') return ' ';
              if (i < iter)   return orig[i];
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join('');
          /* Update only the text node, leave ::after intact */
          if (el.firstChild && el.firstChild.nodeType === 3) {
            el.firstChild.textContent = scrambled;
          } else {
            el.textContent = scrambled;
          }
          if (iter >= orig.length) {
            if (el.firstChild && el.firstChild.nodeType === 3) {
              el.firstChild.textContent = orig;
            } else {
              el.textContent = orig;
            }
            clearInterval(timer);
          }
          iter += 1.6;
        }, 36);
      });

      el.addEventListener('mouseleave', () => {
        clearInterval(timer);
        if (el.firstChild && el.firstChild.nodeType === 3) {
          el.firstChild.textContent = orig;
        } else {
          el.textContent = orig;
        }
      });
    });
  }

  /* ══════════════════════════════════════════════════════════════
     5.  STAT COUNTER ANIMATION
         Numbers count up when scrolled into view.
  ══════════════════════════════════════════════════════════════ */
  function initCounters () {
    const els = document.querySelectorAll('.stat-num');
    if (!els.length) return;

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el  = entry.target;
        const raw = el.textContent.trim();
        const num = parseFloat(raw.replace(/[^\d.]/g, ''));
        const sfx = raw.replace(/[\d.]/g, '');  /* preserve +, % etc. */
        if (isNaN(num)) return;

        const dur = 1500;
        const t0  = performance.now();
        const tick = now => {
          const progress = Math.min((now - t0) / dur, 1);
          /* Ease out cubic */
          const ease = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(num * ease) + sfx;
          if (progress < 1) {
            requestAnimationFrame(tick);
          } else {
            el.classList.add('counted');
          }
        };
        requestAnimationFrame(tick);
        io.unobserve(el);
      });
    }, { threshold: 0.6 });

    els.forEach(el => io.observe(el));
  }

  /* ══════════════════════════════════════════════════════════════
     6.  CARD SCAN-LINE SWEEP
         Inject a sweep div into skill + service cards so
         CSS can animate it without pseudo-element conflicts.
  ══════════════════════════════════════════════════════════════ */
  function initScanLines () {
    document.querySelectorAll('.skill-card, .service-card').forEach(card => {
      const sweep = document.createElement('div');
      sweep.className = 'card-sweep';
      card.appendChild(sweep);
    });
  }

  /* ══════════════════════════════════════════════════════════════
     7.  HERO NAME  — staggered letter highlight on load
  ══════════════════════════════════════════════════════════════ */
  function initHeroLetters () {
    /* Wrap each letter in a span so we can animate hover individually */
    document.querySelectorAll('.hero-name-line').forEach(line => {
      const text = line.textContent;
      line.innerHTML = text
        .split('')
        .map(ch => ch === ' '
          ? ' '
          : `<span class="h-letter">${ch}</span>`)
        .join('');
    });

    /* Add hover listeners for individual letter glow */
    document.querySelectorAll('.h-letter').forEach(span => {
      span.addEventListener('mouseenter', () => {
        span.style.color      = 'var(--accent)';
        span.style.textShadow = '0 0 20px var(--accent)';
        span.style.transition = 'color 0.15s, text-shadow 0.15s';
        setTimeout(() => {
          span.style.color      = '';
          span.style.textShadow = '';
        }, 500);
      });
    });
  }

  /* ══════════════════════════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', () => {
    new CyberCanvas();
    new CustomCursor();
    initRipple();
    initGlitch();
    initCounters();
    initScanLines();
    initHeroLetters();
  });

})();
