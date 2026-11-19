/* =========================================================
   petals.js — Home hero canvas: slowly drifting sakura petals
   and maple leaves. Loaded with `defer` on the Home pages only.

   - Disabled with prefers-reduced-motion
   - Max 20 particles on phones (< 768px), 34 on larger screens
   - Pauses when the tab is hidden or the hero is off screen
   - Spring: mostly petals; autumn: mostly leaves; else a mix
   ========================================================= */
(function () {
  'use strict';

  var canvas = document.querySelector('.hero__canvas');
  if (!canvas || !canvas.getContext) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var ctx = canvas.getContext('2d');
  var hero = canvas.parentElement;
  var MAPLE = new Path2D('M50 4L56 24 66 17 63 38 80 30 76 43 93 45 80 55 86 61 64 63 66 73 53 67 52 96 48 96 47 67 34 73 36 63 14 61 20 55 7 45 24 43 20 30 37 38 34 17 44 24Z');
  var PETAL = new Path2D('M50 95C22 76 10 47 28 21c8-11 16-10 22 1 6-11 14-12 22-1 18 26 6 55-22 74Z');
  var COLORS = { petal: ['#F4C9D1', '#F7D6DC', '#EFB8C3'], leaf: ['#C8442B', '#D9653F', '#E08A3C'] };

  var season = document.documentElement.dataset.season || 'spring';
  var leafShare = { spring: 0.15, summer: 0.35, autumn: 0.8, winter: 0.4 }[season] || 0.3;

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var w = 0, h = 0, particles = [], running = false, visible = true, raf = 0, last = 0;

  // Deterministic pseudo-random so the layout is stable between loads
  var seed = 7;
  var rand = function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

  var make = function (anywhere) {
    var leaf = rand() < leafShare;
    var size = leaf ? 14 + rand() * 12 : 10 + rand() * 9;
    var palette = leaf ? COLORS.leaf : COLORS.petal;
    return {
      leaf: leaf,
      x: rand() * w,
      y: anywhere ? rand() * h : -size - rand() * 60,
      size: size,
      vy: 0.25 + rand() * 0.45,          // px per frame at 60fps
      vx: -0.15 + rand() * 0.3,
      swing: 0.6 + rand() * 1.2,
      phase: rand() * Math.PI * 2,
      rot: rand() * Math.PI * 2,
      vr: (-0.5 + rand()) * 0.02,
      color: palette[Math.floor(rand() * palette.length)],
      alpha: leaf ? 0.55 + rand() * 0.25 : 0.7 + rand() * 0.25
    };
  };

  var resize = function () {
    var r = hero.getBoundingClientRect();
    w = r.width; h = r.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var max = w < 768 ? 20 : 34;
    while (particles.length < max) particles.push(make(true));
    particles.length = max;
  };

  var draw = function (t) {
    var dt = last ? Math.min(3, (t - last) / 16.67) : 1;
    last = t;
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.phase += 0.012 * dt;
      p.y += p.vy * dt;
      p.x += (p.vx + Math.sin(p.phase) * p.swing * 0.35) * dt;
      p.rot += p.vr * dt;
      if (p.y > h + p.size || p.x < -40 || p.x > w + 40) { particles[i] = make(false); continue; }
      var s = p.size / 100;
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      // fake 3D flutter: squash on one axis
      ctx.scale(s, s * (0.55 + 0.45 * Math.abs(Math.cos(p.phase * 1.3))));
      ctx.translate(-50, -50);
      ctx.fillStyle = p.color;
      ctx.fill(p.leaf ? MAPLE : PETAL);
      ctx.restore();
    }
    raf = requestAnimationFrame(draw);
  };

  var start = function () {
    if (running || document.hidden || !visible) return;
    running = true; last = 0;
    raf = requestAnimationFrame(draw);
  };
  var stop = function () {
    running = false;
    cancelAnimationFrame(raf);
  };

  resize();
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      visible ? start() : stop();
    }).observe(hero);
  }
  // Start after the page has painted so the canvas never competes with LCP
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
})();
