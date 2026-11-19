/* =========================================================
   news.js — News & FAQ page
   Smooth accordion on native <details>:
   - on open, the answer fades in and slides down a little
     (CSS class .is-opening; opacity + transform only, no height)
   - closing is instant
   - optional "only one open": add data-faq-single to [data-faq]
   - a link to #faq-xxx opens that question
   Without JS, <details> still opens and closes normally.
   ========================================================= */
(function () {
  'use strict';

  var faq = document.querySelector('[data-faq]');
  if (!faq) return;

  var items = Array.prototype.slice.call(faq.querySelectorAll('details.accordion__item'));
  var single = faq.hasAttribute('data-faq-single');

  function play(item) {
    item.classList.remove('is-opening');
    void item.offsetWidth; // restart the animation
    item.classList.add('is-opening');
  }

  items.forEach(function (item) {
    var answer = item.querySelector('.faq__answer');
    if (answer) {
      answer.addEventListener('animationend', function () {
        item.classList.remove('is-opening');
      });
    }

    item.addEventListener('toggle', function () {
      if (!item.open) {
        item.classList.remove('is-opening');
        return;
      }
      play(item);
      if (single) {
        items.forEach(function (other) {
          if (other !== item && other.open) other.open = false;
        });
      }
    });
  });

  // Open the question named in the URL hash (e.g. /news/#faq-parking)
  function openFromHash() {
    var id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    var target = document.getElementById(id);
    if (target && target.tagName === 'DETAILS' && faq.contains(target) && !target.open) {
      target.open = true;
    }
  }
  openFromHash();
  window.addEventListener('hashchange', openFromHash);
})();
