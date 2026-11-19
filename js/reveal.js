/* =========================================================
   reveal.js — scroll reveals, count-up numbers, headline wave.
   Loaded with `defer` on every page. Content is fully visible
   without JS; this only adds motion (transform/opacity).

   Markup hooks
   - .reveal                    fades/slides in when scrolled into view
   - [data-reveal-group]        children with .reveal get a stagger (--reveal-i)
   - [data-count]               number counts up from 0 to the value already
                                written in the HTML (e.g. <span data-count>11,000</span>)
   - [data-split]               heading characters rise in one after another
                                (transform only, so text is never hidden)
   ========================================================= */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* ---------- Stagger groups ---------- */
  document.querySelectorAll('[data-reveal-group]').forEach(function (group) {
    group.querySelectorAll('.reveal').forEach(function (el, i) {
      el.style.setProperty('--reveal-i', String(i));
    });
  });

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (!hasIO) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Count-up ---------- */
  var counters = document.querySelectorAll('[data-count]');
  if (!reduce && hasIO && counters.length) {
    var format = function (n, template) {
      // keep thousands separators if the original used them
      return template.indexOf(',') > -1 ? n.toLocaleString('en-US') : String(n);
    };
    var run = function (el) {
      var original = el.textContent.trim();
      var target = parseInt(original.replace(/[^\d]/g, ''), 10);
      if (!target) return;
      // Lock the width so the count never shifts the layout
      el.style.display = 'inline-block';
      el.style.minWidth = el.getBoundingClientRect().width + 'px';
      el.style.fontVariantNumeric = 'tabular-nums';
      // Grow the digits from the side the currency sits on: "11,000円" → right, "¥11,000" → left
      var before = el.previousSibling ? el.previousSibling.textContent || '' : '';
      el.style.textAlign = /[¥$]\s*$/.test(before) ? 'left' : 'right';
      var start = null;
      var duration = 1100;
      var step = function (t) {
        if (start === null) start = t;
        var p = Math.min(1, (t - start) / duration);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = format(Math.round(target * eased), original);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = original;
      };
      requestAnimationFrame(step);
    };
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        cio.unobserve(entry.target);
        run(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- Headline wave (character by character) ---------- */
  if (!reduce) {
    document.querySelectorAll('[data-split]').forEach(function (heading) {
      var i = 0;
      var walk = function (node) {
        Array.prototype.slice.call(node.childNodes).forEach(function (child) {
          if (child.nodeType === 3) {
            var frag = document.createDocumentFragment();
            Array.from(child.textContent).forEach(function (ch) {
              if (/\s/.test(ch)) { frag.appendChild(document.createTextNode(ch)); return; }
              var span = document.createElement('span');
              span.className = 'split-char';
              span.style.setProperty('--char-i', String(i++));
              span.textContent = ch;
              frag.appendChild(span);
            });
            child.parentNode.replaceChild(frag, child);
          } else if (child.nodeType === 1) {
            walk(child);
          }
        });
      };
      walk(heading);
      heading.classList.add('is-split');
    });
  }
})();
