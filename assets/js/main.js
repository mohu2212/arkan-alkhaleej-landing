/* ============================================================
   أركان الخليج — Landing page interactions (vanilla JS)
   ============================================================ */
(function () {
  'use strict';
  const WA_NUMBER = '966552171713';
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- Year ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky header shadow ---------- */
  const header = $('#header');
  const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 10);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile nav ---------- */
  const nav = $('#nav');
  const toggle = $('#navToggle');
  const closeNav = () => {
    nav.classList.remove('is-open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  };
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('nav-open', open);
    });
    $$('.nav__link', nav).forEach(a => a.addEventListener('click', closeNav));
    document.addEventListener('click', e => {
      if (nav.classList.contains('is-open') && !nav.contains(e.target) && !toggle.contains(e.target)) closeNav();
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Animated counters ---------- */
  const counters = $$('.stat__num[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const target = parseInt(el.dataset.count, 10);
        const dur = 1400; const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cio.observe(c));
  }

  /* ---------- Gallery filter ---------- */
  const filters = $$('.filter');
  const items = $$('.gitem');
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(f => f.classList.remove('is-active'));
      btn.classList.add('is-active');
      const cat = btn.dataset.filter;
      items.forEach(it => {
        const show = cat === 'all' || it.dataset.cat === cat;
        it.classList.toggle('is-hidden', !show);
      });
    });
  });

  /* ---------- Lightbox ---------- */
  const lb = $('#lightbox');
  const lbImg = $('#lbImg');
  const lbWebp = $('#lbWebp');
  const lbCap = $('#lbCap');
  let visible = [];
  let current = 0;

  const visibleItems = () => items.filter(it => !it.classList.contains('is-hidden'));

  const show = (i) => {
    visible = visibleItems();
    if (!visible.length) return;
    current = (i + visible.length) % visible.length;
    const img = $('img', visible[current]);
    const full = img.dataset.full;            // e.g. assets/img/gallery/01-lg
    lbImg.src = full + '.jpg';
    lbWebp.srcset = full + '.webp';
    lbImg.alt = img.alt;
    lbCap.textContent = ($('figcaption', visible[current]) || {}).textContent || img.alt;
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  items.forEach((it) => it.addEventListener('click', () => {
    const vis = visibleItems();
    show(vis.indexOf(it));
  }));
  if (lb) {
    $('#lbClose').addEventListener('click', close);
    $('#lbNext').addEventListener('click', () => show(current + 1));
    $('#lbPrev').addEventListener('click', () => show(current - 1));
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(current + 1);   // RTL: left = next
      if (e.key === 'ArrowRight') show(current - 1);
    });
  }

  /* ---------- Lead form -> WhatsApp ---------- */
  const form = $('#leadForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#name'), ptype = $('#ptype');
      let ok = true;
      [name, ptype].forEach(el => {
        const bad = !el.value.trim();
        el.classList.toggle('invalid', bad);
        if (bad) ok = false;
      });
      if (!ok) { name.value.trim() || name.focus(); return; }

      const city = $('#city').value.trim();
      const note = $('#note').value.trim();
      const lines = [
        'السلام عليكم، أرغب في طلب معاينة مجانية لمشروعي من شركة أركان الخليج.',
        '',
        '• الاسم: ' + name.value.trim(),
        '• نوع المشروع: ' + ptype.value,
      ];
      if (city) lines.push('• المدينة: ' + city);
      if (note) lines.push('• تفاصيل: ' + note);
      const url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
      window.open(url, '_blank', 'noopener');
    });
    // remove invalid state on input
    $$('#leadForm input, #leadForm select').forEach(el =>
      el.addEventListener('input', () => el.classList.remove('invalid')));
  }
})();
