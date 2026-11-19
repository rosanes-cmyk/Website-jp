/* =========================================================
   about.js — About page motion (transform/opacity only).
   [data-tree] grows step by step while its section scrolls by
   (IntersectionObserver gates a passive scroll listener).
   [data-history] dots light up in order; the line fills.
   No JS / no IO / reduced motion: final state is shown.
   ========================================================= */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;
  var animate = !reduce && hasIO;

  /* ---------- Maple tree ---------- */
  var tree = document.querySelector('[data-tree]');
  var section = document.querySelector('[data-tree-section]');
  if (tree && section && animate) {
    var parts = Array.prototype.slice.call(tree.querySelectorAll('[data-step]'));
    var maxStep = 0;
    parts.forEach(function (p) { maxStep = Math.max(maxStep, +p.getAttribute('data-step')); });
    var stage = 0;
    var ticking = false;

    tree.classList.add('tree-anim');

    var grow = function (to) {
      if (to <= stage) return;           // only ever grows
      stage = to;
      parts.forEach(function (p) {
        if (+p.getAttribute('data-step') <= stage) p.classList.add('is-grown');
      });
      if (stage >= maxStep) stop();
    };

    var measure = function () {
      ticking = false;
      var vh = window.innerHeight;
      var r = section.getBoundingClientRect();
      var span = Math.max(300, Math.min(r.height * 0.55, vh * 0.8));
      var p = (vh * 0.85 - r.top) / span;
      p = Math.max(0, Math.min(1, p));
      grow(Math.ceil(p * maxStep));
    };
    var onScroll = function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(measure); }
    };
    var listening = false;
    var start = function () {
      if (listening) return;
      listening = true;
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      onScroll();
    };
    var stop = function () {
      if (!listening) return;
      listening = false;
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };

    var treeIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (stage >= maxStep) { treeIO.disconnect(); return; }
        if (e.isIntersecting) start(); else stop();
      });
    });
    treeIO.observe(section);
  }

  /* ---------- Timeline ---------- */
  var list = document.querySelector('[data-history]');
  if (list && animate) {
    var items = Array.prototype.slice.call(list.querySelectorAll('.timeline__item'));
    var lit = 0;       // items lit (or queued) so far
    var shown = 0;     // items actually lit, for the line fill
    list.classList.add('history--anim');

    var light = function (item) {
      item.classList.add('is-lit');
      shown += 1;
      // Line reaches the centre of the last lit dot
      var fill = items.length > 1 ? (shown - 1) / (items.length - 1) : 1;
      list.style.setProperty('--history-fill', String(fill));
    };
    // Light every item up to `index`, in order, 220 ms apart
    var nextAt = 0;    // time the next queued item lights (keeps order across batches)
    var lightUpTo = function (index) {
      while (lit <= index) {
        var now = Date.now();
        nextAt = Math.max(now, nextAt);
        window.setTimeout(light.bind(null, items[lit]), nextAt - now);
        nextAt += 220;
        lit += 1;
      }
    };

    var itemIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var idx = items.indexOf(e.target);
        if (idx >= lit) lightUpTo(idx);
        itemIO.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -20% 0px', threshold: 0.5 });
    items.forEach(function (it) { itemIO.observe(it); });
  }
})();
