/* =========================================================
   transitions.js — page-to-page wipe.
   The wipe itself is CSS (cross-document View Transitions,
   `@view-transition` in animations.css). Browsers without
   support simply navigate normally: that is the fallback.

   This file adds:
   - Prefetching of same-site pages on hover/touch, so the
     wipe plays on an already-loaded page (Speculation Rules
     where supported, <link rel=prefetch> otherwise).
   - A `vt-back` type for back navigation so CSS can reverse
     the wipe direction.
   ========================================================= */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Prefetch ---------- */
  var supportsRules = HTMLScriptElement.supports && HTMLScriptElement.supports('speculationrules');
  if (supportsRules) {
    var rules = document.createElement('script');
    rules.type = 'speculationrules';
    rules.textContent = JSON.stringify({
      prefetch: [{ source: 'document', where: { href_matches: '/*' }, eagerness: 'moderate' }]
    });
    document.head.appendChild(rules);
  } else {
    var done = {};
    var prefetch = function (e) {
      var a = e.target.closest && e.target.closest('a[href^="/"]');
      if (!a || done[a.href] || a.href === location.href) return;
      done[a.href] = true;
      var link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = a.href;
      document.head.appendChild(link);
    };
    document.addEventListener('pointerover', prefetch, { passive: true });
    document.addEventListener('touchstart', prefetch, { passive: true });
  }

  /* ---------- Quietly ignore transitions the browser aborts (e.g. fast clicks) ---------- */
  var silence = function (vt) {
    if (!vt) return;
    ['ready', 'finished', 'updateCallbackDone'].forEach(function (k) {
      if (vt[k] && vt[k].catch) vt[k].catch(function () {});
    });
  };
  window.addEventListener('pageswap', function (e) { silence(e.viewTransition); });
  window.addEventListener('pagereveal', function (e) { silence(e.viewTransition); });

  /* ---------- Direction for back navigation ---------- */
  if (!reduce) {
    window.addEventListener('pagereveal', function (e) {
      if (!e.viewTransition || !window.navigation || !navigation.activation) return;
      if (navigation.activation.navigationType === 'traverse') {
        var from = navigation.activation.from;
        if (from && from.index > navigation.activation.entry.index) {
          e.viewTransition.types.add('vt-back');
        }
      }
    });
  }
})();
