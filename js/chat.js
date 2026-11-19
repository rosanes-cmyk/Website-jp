/* =========================================================
   chat.js — question-button helper ("chatbot" without AI).
   Loaded with `defer` on every page. Visitors tap a question
   and get an instant answer written by the school; no free
   text, no server, nothing is stored or sent anywhere.
   Without JS the helper simply does not appear (all answers
   are also on the normal pages and in the FAQ).

   TO EDIT AN ANSWER: change the text in QA below (JA and EN).
   Every fact here must match the pages, data/site.json and the
   FAQ. Facts are placeholders until the owner confirms them.
   TODO: confirm every answer below (PLAN.md section 8).
   ========================================================= */
(function () {
  'use strict';

  /* LINE Official Account URL. Leave empty until confirmed:
     the "Ask on LINE" button only appears once this is set. */
  var LINE_URL = ''; // TODO: LINE Official Account URL
  var TEL = { href: 'tel:+81298510555', text: '029-851-0555' }; // TODO: confirm phone

  var en = document.documentElement.lang === 'en';
  var P = en ? '/en' : '';

  var UI = en ? {
    open: 'Questions', title: 'Ask Maple Sakura School', close: 'Close',
    hello: 'Hello! Tap a question below and we will answer right away.',
    more: 'Anything else?', trial: 'Book a free trial', line: 'Ask on LINE', tel: 'Call',
    more_link: 'More details'
  } : {
    open: '質問する', title: 'メイプルサクラスクールへの質問', close: '閉じる',
    hello: 'こんにちは！下の質問をタップすると、すぐにお答えします。',
    more: 'ほかにご質問はありますか？', trial: '無料体験を申し込む', line: 'LINEで質問する', tel: '電話する',
    more_link: '詳しく見る'
  };

  // [question, answer, link]
  var QA = en ? [
    ['How much are lessons?', 'Group classes (Kids English Club and Advanced English Club) are ¥11,000 a month including tax, for 4 lessons. Private tutoring is ¥5,500 per 60-minute lesson. The enrolment fee is ¥11,000, paid once. Monthly fees are paid 3 months in advance.', '/fees/'],
    ['Is there a free trial?', 'Yes. The trial lesson is free and takes 30 minutes. It also works as a level check, so we can suggest the right class. Book with the form or by phone.', '/access/#trial'],
    ['Which classes are there?', 'Four programs: Kids English Club (age 3 to high school), Advanced English Club (adults), Private Tutoring, and Teacher Delivery for schools and kindergartens. Group classes have only 4–5 students.', '/programs/'],
    ['What days and times?', 'Kids English Club runs Monday to Saturday, 15:00–20:00. Times for the adult class and private tutoring are still being confirmed.', '/programs/'],
    ['Where is the school? Is there parking?', '3-70-16 Gakuenminami, Tsukuba, behind Katsuragi Elementary School. Parking is available. The nearest station is Kenkyu-gakuen on the Tsukuba Express.', '/access/'],
    ['Who is the teacher?', 'Tom Sensei, a native English speaker from Canada. He has a master\'s degree in education and taught English in Japanese elementary and junior high schools for 10 years.', '/about/'],
    ['Make-up lessons and leaving', 'Missed group lessons cannot be rescheduled. If you want to leave, please tell us at least one month before.', '/fees/#rules'],
    ['Another question', 'Please contact us by LINE, phone or the form. We are happy to help.', '/access/']
  ] : [
    ['料金はいくらですか？', 'グループレッスン（キッズイングリッシュクラブ・上級英語サークル）は月謝11,000円（税込）で月4回です。個人指導は1回60分5,500円（税込）です。入会金は11,000円（税込・初回のみ）。月謝は3か月分を前払いでお願いしています。', '/fees/'],
    ['無料体験はありますか？', 'はい。30分の無料体験レッスンがあります。レベルチェックも兼ねているので、お子さまに合ったクラスをご提案できます。フォームまたはお電話でお申し込みください。', '/access/#trial'],
    ['どんなコースがありますか？', 'キッズイングリッシュクラブ（3歳〜高校生）、上級英語サークル（大人の方）、英語の個人指導、学校・幼稚園への講師派遣の4つです。グループは1クラス4〜5名の少人数制です。', '/programs/'],
    ['曜日と時間は？', 'キッズイングリッシュクラブは月〜土の15:00〜20:00です。大人のクラスと個人指導の時間は、現在確認中です。', '/programs/'],
    ['場所と駐車場は？', 'つくば市学園南3丁目70-16、葛城小学校の裏です。駐車場があります。最寄り駅はつくばエクスプレスの研究学園駅です。', '/access/'],
    ['先生はどんな方ですか？', 'カナダ出身のネイティブ講師、トム先生が教えます。教育学修士で、日本の小学校・中学校で10年間英語を教えてきました。', '/about/'],
    ['振替・退会について', 'グループレッスンの振替はできません。退会をご希望の場合は、1か月前までにお知らせください。', '/fees/#rules'],
    ['そのほかの質問', 'LINE・お電話・フォームから、お気軽にお問い合わせください。', '/access/']
  ];

  var el = function (tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };
  var icon = function (id) {
    var ns = 'http://www.w3.org/2000/svg';
    var s = document.createElementNS(ns, 'svg'); s.setAttribute('aria-hidden', 'true');
    var u = document.createElementNS(ns, 'use'); u.setAttribute('href', '/assets/svg/icons.svg#' + id);
    s.appendChild(u); return s;
  };

  /* ---------- Build ---------- */
  var root = el('div', 'chat');
  var launcher = el('button', 'chat__launcher');
  launcher.type = 'button';
  launcher.setAttribute('aria-expanded', 'false');
  launcher.setAttribute('aria-controls', 'chat-panel');
  launcher.appendChild(icon('i-chat'));
  launcher.appendChild(el('span', 'chat__launcher-label', UI.open));

  var panel = el('section', 'chat__panel');
  panel.id = 'chat-panel';
  panel.hidden = true;
  panel.setAttribute('aria-labelledby', 'chat-title');

  var head = el('div', 'chat__head');
  var title = el('h2', 'chat__title', UI.title); title.id = 'chat-title';
  var close = el('button', 'chat__close'); close.type = 'button';
  close.setAttribute('aria-label', UI.close);
  close.appendChild(el('span', null, '×')).setAttribute('aria-hidden', 'true');
  head.appendChild(title); head.appendChild(close);

  var log = el('div', 'chat__log');
  log.setAttribute('role', 'log');
  log.setAttribute('aria-live', 'polite');
  var choices = el('div', 'chat__choices');
  choices.setAttribute('role', 'group');
  choices.setAttribute('aria-label', UI.more);

  panel.appendChild(head); panel.appendChild(log); panel.appendChild(choices);
  root.appendChild(panel); root.appendChild(launcher);
  document.body.appendChild(root);

  /* ---------- Conversation ---------- */
  var say = function (who, text) {
    var b = el('p', 'chat__msg chat__msg--' + who, text);
    log.appendChild(b);
    return b;
  };
  var contactRow = function (link) {
    var row = el('div', 'chat__actions');
    var add = function (href, text, cls) {
      var a = el('a', 'chat__action' + (cls ? ' ' + cls : ''), text); a.href = href; row.appendChild(a);
    };
    if (link) add(P + link, UI.more_link + ' →');
    add(P + '/access/#trial', UI.trial, 'chat__action--primary');
    if (LINE_URL) add(LINE_URL, UI.line, 'chat__action--line');
    add(TEL.href, UI.tel + ' ' + TEL.text);
    log.appendChild(row);
  };
  var showChoices = function () {
    choices.replaceChildren();
    QA.forEach(function (qa) {
      var c = el('button', 'chip chat__chip', qa[0]); c.type = 'button';
      c.addEventListener('click', function () { ask(qa); });
      choices.appendChild(c);
    });
  };
  var ask = function (qa) {
    var q = say('me', qa[0]);
    say('bot', qa[1]);
    contactRow(qa[2]);
    say('bot', UI.more);
    // Show the start of the answer, not the end (small phones)
    log.scrollTop = q.offsetTop - 8;
  };

  var started = false;
  var setOpen = function (open) {
    panel.hidden = !open;
    launcher.setAttribute('aria-expanded', String(open));
    root.classList.toggle('is-open', open);
    if (open) {
      if (!started) { started = true; say('bot', UI.hello); showChoices(); }
      var first = choices.querySelector('button');
      if (first) first.focus({ preventScroll: true });
    }
  };
  launcher.addEventListener('click', function () { setOpen(panel.hidden); });
  close.addEventListener('click', function () { setOpen(false); launcher.focus(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !panel.hidden) { setOpen(false); launcher.focus(); }
  });
})();
