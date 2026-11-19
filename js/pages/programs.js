/* =========================================================
   programs.js — Programs page
   - Tap-to-flip buttons on program cards (aria-pressed)
   - Age filter chips: non-matching cards fade out, then get
     [hidden]; remaining cards slide into their new place (FLIP).
   Without JS every card shows, both faces stacked, no chips.
   Only transform and opacity animate.
   ========================================================= */
(function () {
  'use strict';

  var grid = document.querySelector('[data-pgrid]');
  if (!grid) return;
  var cards = Array.prototype.slice.call(grid.querySelectorAll('.pcard'));
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Flip buttons ---------- */
  cards.forEach(function (card) {
    var btn = card.querySelector('.pcard__flip');
    if (!btn) return;
    btn.hidden = false;
    btn.addEventListener('click', function () {
      var on = btn.getAttribute('aria-pressed') !== 'true';
      btn.setAttribute('aria-pressed', String(on));
      card.classList.toggle('is-flipped', on);
    });
  });

  /* ---------- Age filter ---------- */
  var filter = document.querySelector('[data-pfilter]');
  if (!filter) return;
  var chips = Array.prototype.slice.call(filter.querySelectorAll('[data-filter]'));
  var status = filter.querySelector('[data-pfilter-status]');
  var lang = document.documentElement.lang === 'en' ? 'en' : 'ja';
  var busy = false;
  filter.hidden = false;

  function matches(card, key) {
    return key === 'all' || (' ' + card.getAttribute('data-ages') + ' ').indexOf(' ' + key + ' ') > -1;
  }

  function announce(n) {
    if (!status) return;
    status.textContent = lang === 'en'
      ? n + (n === 1 ? ' program shown' : ' programs shown')
      : n + '件のコースを表示しています';
  }

  function apply(key) {
    var leaving = cards.filter(function (c) { return !c.hidden && !matches(c, key); });
    var staying = cards.filter(function (c) { return !c.hidden && matches(c, key); });
    var entering = cards.filter(function (c) { return c.hidden && matches(c, key); });
    var still = reduce.matches || !grid.animate;

    function layout() {
      var first = staying.map(function (c) { return c.getBoundingClientRect(); });
      leaving.forEach(function (c) { c.hidden = true; c.classList.remove('is-leaving'); });
      entering.forEach(function (c) { c.hidden = false; });
      announce(staying.length + entering.length);

      if (still) {
        entering.forEach(function (c) {
          if (c.animate) c.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250 });
        });
        busy = false;
        return;
      }
      staying.forEach(function (c, i) {
        var last = c.getBoundingClientRect();
        var dx = first[i].left - last.left;
        var dy = first[i].top - last.top;
        if (dx || dy) {
          c.animate(
            [{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }],
            { duration: 450, easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)' }
          );
        }
      });
      entering.forEach(function (c, i) {
        c.animate(
          [{ opacity: 0, transform: 'translateY(24px) scale(0.96)' }, { opacity: 1, transform: 'none' }],
          { duration: 450, delay: i * 70, easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)', fill: 'backwards' }
        );
      });
      busy = false;
    }

    if (!leaving.length) { layout(); return; }
    busy = true;
    leaving.forEach(function (c) { c.classList.add('is-leaving'); });
    window.setTimeout(layout, 260);
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      if (busy || chip.getAttribute('aria-pressed') === 'true') return;
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
      apply(chip.getAttribute('data-filter'));
    });
  });
})();
