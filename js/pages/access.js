/* access.js: route draw + trial form validation/fetch submit. Works without JS. */
(function () {
  'use strict';
  var each = function (l, f) { Array.prototype.forEach.call(l, f); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Route: dots appear one by one, then the pin bounces
  var route = document.querySelector('[data-route]');
  if (route && !reduce && 'IntersectionObserver' in window) {
    var dots = route.querySelectorAll('.route__dot');
    for (var d = 0; d < dots.length; d++) dots[d].style.setProperty('--i', String(d));
    route.style.setProperty('--n', String(dots.length));
    route.classList.add('route--ready');
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      route.classList.add('route--drawn');
      io.disconnect();
    }, { threshold: 0.35 });
    io.observe(route);
  }
  // Trial form (messages come from data-msg-* in the HTML, so /en/ can reuse this file)
  var form = document.querySelector('form[name="trial"]');
  if (!form) return;
  var status = form.querySelector('.form__status');
  var submit = form.querySelector('[type="submit"]');
  var submitLabel = form.querySelector('[data-submit-label]');
  var T = form.dataset;
  function showOk(scroll) {
    status.textContent = ''; // re-announce on repeat
    status.classList.add('form__status--ok');
    setTimeout(function () {
      status.textContent = T.msgOk;
      if (scroll) status.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
    }, 60);
  }
  if (/[?&]sent=1(&|$)/.test(location.search)) showOk();
  form.noValidate = true;
  function toHalfWidth(v) {
    return v.replace(/[０-９]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0xFEE0); })
            .replace(/[ー－‐−]/g, '-').replace(/（/g, '(').replace(/）/g, ')').trim();
  }
  function check(el) {
    var err = document.getElementById(el.getAttribute('data-error'));
    if (!err) return true;
    var msg = '';
    var targets = [el];
    if (el.type === 'radio') {
      targets = [].slice.call(form.querySelectorAll('input[name="' + el.name + '"]'));
      if (!targets.some(function (r) { return r.checked; })) msg = T.msgChoose;
    } else {
      if (el.type === 'tel' && el.value) el.value = toHalfWidth(el.value);
      if (el.validity.valueMissing) msg = el.getAttribute('data-msg') || T.msgRequired;
      else if (el.validity.typeMismatch) msg = T.msgEmail;
      else if (el.validity.patternMismatch) msg = T.msgTel;
    }
    err.textContent = msg;
    targets.forEach(function (t) {
      if (msg) t.setAttribute('aria-invalid', 'true');
      else t.removeAttribute('aria-invalid');
    });
    return !msg;
  }
  var fields = form.querySelectorAll('[data-error]');
  each(fields, function (el) {
    el.addEventListener('blur', function () {
      if (el.type === 'radio' || el.type === 'checkbox') return;
      if (el.value || el.getAttribute('aria-invalid')) check(el);
    });
    var again = function () { if (el.getAttribute('aria-invalid')) check(el); };
    el.addEventListener('input', again);
    el.addEventListener('change', again);
  });
  each(form.querySelectorAll('input[type="radio"]'), function (r) {
    r.addEventListener('change', function () {
      var first = form.querySelector('input[name="' + r.name + '"][data-error]');
      if (first && first.getAttribute('aria-invalid')) check(first);
    });
  });
  // Coming back with the browser's Back button: reset the button
  var idleLabel = submitLabel.textContent;
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) { submit.disabled = false; submitLabel.textContent = idleLabel; }
  });
  form.addEventListener('submit', function (e) {
    var firstBad = null;
    each(fields, function (el) {
      if (!check(el) && !firstBad) firstBad = el;
    });
    if (firstBad) {
      e.preventDefault();
      firstBad.focus();
      return;
    }
    if (!window.fetch || !window.URLSearchParams) return; // normal POST
    e.preventDefault();
    submit.disabled = true;
    var label = submitLabel.textContent;
    submitLabel.textContent = T.msgSending;
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString()
    }).then(function (res) {
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      submit.disabled = false;
      submitLabel.textContent = label;
      showOk(true);
    }).catch(function () {
      submit.disabled = false;
      submitLabel.textContent = label;
      form.submit(); // fall back to a normal submit
    });
  });
})();
