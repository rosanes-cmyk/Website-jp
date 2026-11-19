/* gallery.js: staggered masonry fade-in, category filter, lightbox
   (<dialog>, soft zoom, prev/next, arrows, Esc, focus returns).
   Without JS every tile simply shows. */
(function () {
  'use strict';
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var tiles = $$('.gtile');
  if (!tiles.length) return;
  var en = document.documentElement.lang === 'en';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var stagger = function (t, n) { t.style.setProperty('--i', String(Math.min(n, 5))); };

  /* Staggered fade-in */
  var io = null;
  if ('IntersectionObserver' in window) {
    $$('[data-masonry]').forEach(function (m) { m.classList.add('is-armed'); });
    io = new IntersectionObserver(function (entries) {
      var n = 0;
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        stagger(e.target, n++);
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -5% 0px', threshold: 0.05 });
    tiles.forEach(function (t) { io.observe(t); });
  }

  /* Filter */
  var filter = document.querySelector('[data-gfilter]');
  var groups = $$('.gallery-group');
  if (filter) {
    var chips = $$('[data-filter]', filter);
    var status = filter.querySelector('[data-gfilter-status]');
    filter.hidden = false;
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var key = chip.getAttribute('data-filter'), shown = [];
        chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
        groups.forEach(function (g) {
          g.hidden = !(key === 'all' || g.getAttribute('data-cat') === key);
          if (!g.hidden) shown = shown.concat($$('.gtile', g));
        });
        shown.forEach(function (t, n) { t.classList.remove('is-in'); stagger(t, n); if (io) io.unobserve(t); });
        void document.body.offsetWidth; // restart the stagger
        shown.forEach(function (t) { t.classList.add('is-in'); });
        if (status) status.textContent = en ? shown.length + ' photos shown' : shown.length + '枚の写真を表示しています';
      });
    });
  }

  /* Lightbox */
  var dlg = document.querySelector('[data-lightbox]');
  if (!dlg || typeof dlg.showModal !== 'function') return;
  var media = dlg.querySelector('[data-lb-media]');
  var cap = dlg.querySelector('[data-lb-caption]');
  var count = dlg.querySelector('[data-lb-count]');
  var list = [], idx = 0, opener = null, timer = 0;

  function show(i, swap) {
    idx = (i + list.length) % list.length;
    var t = list[idx], ph = t.querySelector('.ph').cloneNode(true);
    if (swap && !reduce.matches) ph.classList.add('is-swapping');
    media.replaceChildren(ph);
    cap.textContent = t.getAttribute('data-caption');
    count.textContent = (idx + 1) + ' / ' + list.length;
  }

  // Cleanup runs synchronously; the async 'close' event only covers forced closes
  function after() {
    dlg.removeEventListener('animationend', onEnd);
    clearTimeout(timer);
    dlg.classList.remove('is-closing');
    if (dlg.open) dlg.close();
    if (!opener) return;
    var o = opener;
    opener = null;
    media.replaceChildren();
    o.focus();
  }
  function onEnd(e) { if (e.target === dlg && e.animationName === 'lb-out') after(); }

  function close() {
    if (!dlg.open || dlg.classList.contains('is-closing')) return;
    if (reduce.matches) { after(); return; }
    dlg.classList.add('is-closing');
    dlg.addEventListener('animationend', onEnd);
    timer = setTimeout(after, 400);
  }

  tiles.forEach(function (t) {
    t.addEventListener('click', function () {
      list = tiles.filter(function (x) { return !x.closest('[hidden]'); });
      opener = t;
      show(list.indexOf(t), false);
      dlg.showModal();
    });
  });

  dlg.querySelector('[data-lb-close]').addEventListener('click', close);
  dlg.querySelector('[data-lb-prev]').addEventListener('click', function () { show(idx - 1, true); });
  dlg.querySelector('[data-lb-next]').addEventListener('click', function () { show(idx + 1, true); });
  dlg.addEventListener('cancel', function (e) { e.preventDefault(); close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) close(); });
  dlg.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(idx - 1, true); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); show(idx + 1, true); }
  });
  dlg.addEventListener('close', after);
})();
