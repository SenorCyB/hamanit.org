/* =========================================================
   HAMIT — interactions.js
   Mobile menu · Formspree · Nav scroll
   ========================================================= */
(()=>{
  'use strict';

  /* NAV SCROLL */
  const nav = document.getElementById('nav');
  const onScroll = ()=>{ if(!nav) return; nav.classList.toggle('scrolled', window.scrollY > 12) };
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* THEME TOGGLE */
  const STORAGE_KEY = 'hamit-theme';
  const html = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');
  
  const applyTheme = (mode) => {
    html.setAttribute('data-theme', mode);
    try { localStorage.setItem(STORAGE_KEY, mode); } catch(e){}
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', mode === 'dark' ? '#080808' : '#f5f5f5');
    window.dispatchEvent(new CustomEvent('themechange', { detail: { mode } }));
  };

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  /* MOBILE MENU */
  const menuBtn = document.getElementById('navMenuBtn');
  const menu = document.getElementById('mobileMenu');
  const closeMenu = ()=>{
    if(!menu||!menuBtn) return;
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden','true');
    menuBtn.setAttribute('aria-expanded','false');
    document.body.style.overflow='';
  };
  const openMenu = ()=>{
    if(!menu||!menuBtn) return;
    menu.classList.add('open');
    menu.setAttribute('aria-hidden','false');
    menuBtn.setAttribute('aria-expanded','true');
    document.body.style.overflow='hidden';
  };
  menuBtn?.addEventListener('click', ()=>menu.classList.contains('open')?closeMenu():openMenu());
  menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeMenu(); });
  window.addEventListener('resize', ()=>{ if(window.innerWidth>768) closeMenu(); });

  /* FORMSPREE */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if(form && status){
    form.addEventListener('submit', async e=>{
      e.preventDefault();
      status.removeAttribute('data-state');
      status.textContent='';
      const hp = form.querySelector('input[name="_gotcha"]');
      if(hp?.value) return;
      if(!form.checkValidity()){ status.dataset.state='err'; status.textContent='Please fill out all fields.'; form.reportValidity(); return; }
      form.classList.add('is-loading');
      status.textContent='Sending…';
      try{
        const res = await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});
        if(res.ok){
          form.reset(); form.classList.remove('is-loading'); form.classList.add('is-success');
          status.dataset.state='ok'; status.textContent="Thanks — message sent. I'll be in touch shortly.";
        } else {
          let msg='Something went wrong. Email support@hamanit.org directly.';
          try{ const j=await res.json(); if(j?.errors?.length) msg=j.errors.map(x=>x.message).join(' '); }catch{}
          form.classList.remove('is-loading'); status.dataset.state='err'; status.textContent=msg;
        }
      }catch{
        form.classList.remove('is-loading'); status.dataset.state='err'; status.textContent='Network error. Try again or email support@hamanit.org.';
      }
    });
  }
})();
