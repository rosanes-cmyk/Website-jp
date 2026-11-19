/* =========================================================
   main.js — season class, mobile menu, language switch,
   placeholder links. Loaded with `defer` on every page.
   All content works without this file; it only adds behaviour.
   ========================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  /* ---------- Web fonts without blocking the first paint ----------
     The Google Fonts stylesheet is linked with media="print" (downloads
     without blocking rendering); switch it on now. System fonts show
     until then (font-display: swap). <noscript> covers no-JS visitors. */
  document.querySelectorAll('link[data-font-css]').forEach(function (l) { l.media = 'all'; });

  /* ---------- Season class on <body> ----------
     Spring: Mar–May, Summer: Jun–Aug, Autumn: Sep–Nov, Winter: Dec–Feb.
     Override for testing with ?season=autumn (also handy for screenshots). */
  var SEASONS = ['winter', 'winter', 'spring', 'spring', 'spring', 'summer',
                 'summer', 'summer', 'autumn', 'autumn', 'autumn', 'winter'];
  var forced = new URLSearchParams(location.search).get('season');
  var season = SEASONS.indexOf(forced) > -1 ? forced : SEASONS[new Date().getMonth()];
  document.body.classList.remove('season-spring', 'season-summer', 'season-autumn', 'season-winter');
  document.body.classList.add('season-' + season);
  root.dataset.season = season;

  /* ---------- Mobile menu ----------
     Without JS the toggle is a plain link to the footer sitemap.
     With JS it opens the off-canvas header nav. */
  var toggle = document.querySelector('[data-menu-toggle]');
  var nav = document.getElementById('global-nav');
  var backdrop = document.querySelector('[data-nav-close]');
  var desktop = window.matchMedia('(min-width: 1120px)');

  if (toggle && nav) {
    toggle.setAttribute('role', 'button');
    toggle.setAttribute('aria-expanded', 'false');
    if (backdrop) backdrop.hidden = false;

    // While the drawer is open, everything outside it (except the toggle) is inert,
    // so Tab cannot reach links hidden behind the backdrop.
    var outside = document.querySelectorAll('.skip-link, main, .site-footer, .bottom-bar, .brand, .lang-switch, .header-cta');

    var setOpen = function (open, returnFocus) {
      nav.classList.toggle('is-open', open);
      outside.forEach(function (el) { el.inert = open; });
      toggle.setAttribute('aria-expanded', String(open));
      var label = toggle.querySelector('.menu-toggle__label');
      if (label) label.textContent = open ? (root.lang === 'en' ? 'Close' : '閉じる')
                                          : (root.lang === 'en' ? 'Menu' : 'メニュー');
      if (open) {
        document.dispatchEvent(new CustomEvent('menu:open')); // chat.js closes itself
        var first = nav.querySelector('a');
        if (first) first.focus({ preventScroll: true });
      } else if (returnFocus) {
        toggle.focus();
      }
    };

    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    toggle.addEventListener('keydown', function (e) {
      if (e.key === ' ') { e.preventDefault(); if (!e.repeat) toggle.click(); } // role=button: Space activates
    });
    if (backdrop) backdrop.addEventListener('click', function () { setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { e.preventDefault(); setOpen(false, true); }
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    desktop.addEventListener('change', function (e) { if (e.matches) setOpen(false); });
  }

  /* ---------- Language switch ----------
     The HTML already links to the matching page. This keeps the
     #hash so a visitor lands on the same section in the other language. */
  document.querySelectorAll('[data-lang-link]').forEach(function (link) {
    link.addEventListener('click', function () {
      if (location.hash) link.href = link.getAttribute('href').split('#')[0] + location.hash;
    });
  });

  /* ---------- Placeholder links (LINE / social not yet confirmed) ---------- */
  document.querySelectorAll('a[data-placeholder]').forEach(function (link) {
    if (link.getAttribute('href') !== '#') return;
    link.setAttribute('aria-disabled', 'true');
    link.title = root.lang === 'en' ? 'Coming soon' : '準備中です';
    link.addEventListener('click', function (e) { e.preventDefault(); });
  });
})();
