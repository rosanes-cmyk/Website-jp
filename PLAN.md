# PLAN.md — Maple Sakura School website

Build brief for Claude Code. Read this whole file before writing any code.

## 0. Instructions to Claude Code

Build a static, multi-page website for Maple Sakura School (メイプルサクラスクール), a small
English conversation school in Tsukuba, Ibaraki, Japan, that is reopening soon.

- Plain HTML, CSS and vanilla JavaScript only. No framework, no build step, no jQuery.
- Keep HTML, CSS and JS in SEPARATE files, using exactly the folder structure in section 6.
- No inline `<style>` or `<script>`, except one JSON-LD `<script>` per page.
- The site's main language is JAPANESE (default at `/`). An English mirror lives at `/en/`.
- Work in the phases in section 7. After Phase 1, STOP and show the result before continuing.
- Write Japanese copy in polite です・ます form. Flag every line a native speaker should review
  with `<!-- JP-REVIEW -->`.
- Every business fact in section 1 is a placeholder until the owner confirms it. Mark each use
  with `<!-- TODO: confirm -->`.
- Do not invent testimonials, reviews, student numbers, awards or photos of people. Leave
  marked placeholders instead.

## 1. Business facts (placeholders, from the school's old site)

| Item | Value |
| --- | --- |
| Name (EN) | Maple Sakura School |
| Name (JA) | メイプルサクラスクール (old site also writes メープルさくらスクール; owner must pick one) |
| Address | 〒305-0818 茨城県つくば市学園南3丁目70-16（葛城小学校の裏・駐車場あり） |
| Address (EN) | 3-70-16 Gakuenminami, Tsukuba, Ibaraki 305-0818 (behind Katsuragi Elementary School, parking available) |
| Tel / Fax | 029-851-0555 |
| Email | info@maplesakuraschool.com |
| Founder / teacher | "Tom Sensei", Canadian, master's in education, 10 years teaching in Japanese elementary and junior high schools |
| Founded | 2013 (formerly Maple Village School / メイプルヴィレッジスクール) |
| Philosophy | Each student is a unique maple leaf that grows to its own height. "English fun and easy for everyone" / 誰でも英語を楽しく簡単に |
| Opening hours | UNKNOWN: leave a clearly marked placeholder |
| Reopening date | UNKNOWN: leave a clearly marked placeholder in the hero and news |
| LINE / social | UNKNOWN: build the buttons, leave the URLs as placeholders |

### Programs

| Program | Who | When | Size / length | Price |
| --- | --- | --- | --- | --- |
| Kids English Club（キッズイングリッシュクラブ） | Age 3 to high school | Mon–Sat 15:00–20:00 | 4–5 students, 50 min | ¥10,000/month + tax, 4 lessons |
| Advanced English Club（上級英語サークル） | Adults: academic and business English | Mon–Sat, hours to confirm | 4–5 students, 50 min | ¥10,000/month + tax, 4 lessons |
| Private Tutoring（英語の個人指導） | Test prep, presentations, speeches | Mon–Sat, hours to confirm | 1 student, 60 min | ¥5,000 + tax per session |
| Teacher Delivery（講師派遣） | Schools and kindergartens in Ibaraki and Kanto | Mon–Sat 9:00–16:00 | Up to 50 students, 60+ min | On request |

Terms: free 30-minute trial lesson that doubles as a placement test; fees paid 3 months in
advance; one-time enrolment fee ¥10,000 + tax (materials and space); group lessons cannot be
rescheduled; one month's notice to withdraw.

## 2. Audience

1. Mothers of children aged 3–12 near Kenkyu-gakuen and Gakuenminami (primary). They want:
   price, the teacher's face and credentials, safety, parking, an easy trial booking.
2. Parents of junior high and high school students (grades, Eiken, exams).
3. Researchers and professionals (presentations, conferences, business English).
4. Schools and kindergartens wanting a visiting native teacher.
5. Foreign families (served by the `/en/` mirror).

What Japanese visitors expect:
- Show everything: prices, enrolment fee and cancellation rules in plain view. Hiding reads as concealment.
- Mobile first. LINE is the preferred contact channel; keep phone and a form too.
- A teacher photo, credentials and a short greeting (ごあいさつ).
- Seasonal look and campaign slots (April is the enrolment peak: 春の入会キャンペーン).

## 3. Design: 和モダン × Canada

Concept: 「もみじと桜」 two leaves, two cultures. The maple leaf and sakura petal are the only
decorative motifs. Use them sparingly.

| Element | Decision |
| --- | --- |
| Colours (CSS variables) | `--washi: #FAF7F2` background; `--sumi: #2B2B2B` text; `--maple: #C8442B` buttons; `--sakura: #F4C9D1` soft fills; `--indigo: #274060` headings and footer. Text contrast at least 4.5:1 |
| Fonts | Headings: Zen Maru Gothic. Body: Noto Sans JP. Short vertical accents: Shippori Mincho. English: Nunito. Google Fonts, `display=swap`, max two weights each |
| Layout | Home is spacious, one message per screen. Fees and Programs are dense with clear tables |
| Vertical text | `writing-mode: vertical-rl` only for short section labels such as 「ごあいさつ」 |
| Imagery | Placeholder boxes with labels (classroom, teacher, exterior, parking). No stock photos of children |
| Seasons | JS sets `season-spring`, `season-summer`, `season-autumn` or `season-winter` on `<body>` by month. Sakura motif in spring, maple in autumn |
| Mobile bottom bar | Fixed on phones, three buttons: 無料体験 / LINE / 電話 |
| Language switch | JA / EN toggle in the header, linking to the matching page |

## 4. Pages and animations

| Page (URL) | Content | Signature animation |
| --- | --- | --- |
| Home `/` | Hero with reopening date, three program cards, teacher teaser, price summary, map, trial button | Canvas of slowly drifting sakura petals and maple leaves behind the hero; headline reveals character by character |
| About `/about/` | Teacher greeting, credentials, maple-leaf philosophy, history since 2013, reopening story | SVG maple tree stroke-draws as you scroll; timeline dots light up in order |
| Programs `/programs/` | Four programs with age, level, class size, sample lesson flow | Cards lift or flip on hover and tap; age filter slides matching cards into place |
| Fees `/fees/` | Full price table, enrolment fee, payment terms, cancellation rule, worked first-year total | Prices count up when the table enters view; rows fade in one after another |
| Gallery `/gallery/` | Classroom, events, building, parking | Staggered masonry fade-in; lightbox with soft zoom |
| Access & Contact `/access/` | Google Map embed, directions from Katsuragi Elementary and Kenkyu-gakuen Station, parking, trial form, LINE QR | SVG dotted route line draws from the station to the school; gentle form focus and success feedback |
| News & FAQ `/news/` | Reopening notice, seasonal campaigns, posts, 8–10 FAQs | Smooth accordion; one-time pulse on the NEW ribbon |

Global: sliding underline on the active nav item; page-to-page wipe using the View Transitions
API with a plain-navigation fallback; `IntersectionObserver` scroll reveals.

Animation rules:
- Animate only `transform` and `opacity`. Nothing may shift layout or delay text appearing.
- All content is in the HTML and readable without JavaScript. JS only adds motion.
- Honour `prefers-reduced-motion`: disable falling leaves, counters and wipes; keep simple fades.
- Pause the canvas when the tab is hidden or the hero is off screen. Max 20 particles on phones.
- No animation library. Keep total JS under about 30 KB.

## 5. SEO requirements

Keyword per page (use in `<title>`, `<h1>` and the first paragraph, naturally):

| Page | Primary keyword | Supporting keywords |
| --- | --- | --- |
| Home | つくば 英会話 | つくば市 英会話教室, 研究学園 英会話, ネイティブ講師, 少人数 |
| Programs (kids) | つくば 子供 英会話 | 研究学園 英語教室 小学生, 幼児 英語 つくば, 学園南 英語 |
| Programs (adults) | つくば ビジネス英会話 | 研究者 英語 プレゼン, 学会発表 英語, 大人 英会話 つくば |
| Programs (private) | つくば 英会話 マンツーマン | 英語 個人レッスン つくば |
| Programs (school visits) | 英語講師 派遣 茨城 | ネイティブ講師 出張レッスン |
| Fees | つくば 英会話 料金 | 月謝, 入会金, 無料体験 |
| Access | メイプルサクラスクール アクセス | 学園南, 研究学園駅, 駐車場あり |

Technical:
- `<html lang="ja">` on Japanese pages, `lang="en"` under `/en/`. `hreflang` ja, en and x-default on every page.
- `<title>`: keyword first, 「｜メイプルサクラスクール」 last, about 30 full-width characters. Meta description 80–120 characters. Both unique per page.
- One `<h1>` per page, logical `<h2>`/`<h3>`. Real HTML text, never text inside images. Japanese `alt` on every image.
- JSON-LD: `LanguageSchool` on every page (name, address, geo, telephone, openingHoursSpecification, priceRange, sameAs); `Course` per program; `FAQPage`; `BreadcrumbList` on inner pages; `Person` for the teacher.
- Canonical tags, `sitemap.xml`, `robots.txt`, Open Graph tags with a 1200×630 share image.
- Images as WebP with `width`/`height`; `loading="lazy"` below the fold.
- Targets: Lighthouse mobile 90+ for Performance, Accessibility and SEO. LCP under 2.5 s, INP under 200 ms, CLS under 0.1.
- Name, address and phone must be written identically on every page (footer).

## 6. File structure

```text
maple-sakura-school/
├── index.html                  # Home (Japanese, default)
├── about/index.html
├── programs/index.html
├── fees/index.html
├── gallery/index.html
├── access/index.html
├── news/index.html
├── en/                         # English mirror, same seven pages
│   ├── index.html
│   ├── about/index.html
│   └── ...
├── css/
│   ├── base.css                # reset, CSS variables (colours, type, spacing), seasons
│   ├── layout.css              # header, nav, footer, grid, mobile bottom bar
│   ├── components.css          # buttons, cards, tables, accordion, form, lightbox
│   ├── animations.css          # keyframes, reveal classes, view transitions, reduced motion
│   └── pages/
│       ├── home.css
│       ├── about.css
│       ├── programs.css
│       ├── fees.css
│       ├── gallery.css
│       ├── access.css
│       └── news.css
├── js/
│   ├── main.js                 # nav, mobile menu, language switch, season class
│   ├── reveal.js               # IntersectionObserver scroll reveals, count-up
│   ├── petals.js               # hero canvas: sakura and maple particles
│   ├── transitions.js          # View Transitions API with fallback
│   └── pages/
│       ├── about.js            # tree draw, timeline
│       ├── programs.js         # age filter, card flip
│       ├── gallery.js          # lightbox
│       ├── access.js           # route draw, form validation
│       └── news.js             # accordion
├── assets/
│   ├── img/                    # WebP photos, width and height set
│   ├── svg/                    # logo, maple leaf, sakura petal, tree, route
│   └── og/                     # 1200x630 share images
├── data/site.json              # name, address, phone, hours, prices: single source of truth
├── sitemap.xml
├── robots.txt
├── _redirects                  # old Wix / Maple Village URLs (Netlify)
└── README.md
```

Rules:
- Every page links `base.css`, `layout.css`, `components.css`, `animations.css`, then its own page CSS.
- Scripts load with `defer`. Page-specific JS loads only on its own page.
- Facts live in `data/site.json` AND are written into the HTML, so pages work without JavaScript.

## 7. Build phases

1. **Foundation**: folders, `site.json`, `base.css` variables, header, footer, mobile bottom bar, Home in Japanese. STOP for review.
2. **Remaining six pages** in Japanese, real structure, placeholder copy marked for confirmation.
3. **Animations**, one page at a time, each with its reduced-motion fallback.
4. **SEO layer**: titles, descriptions, JSON-LD, hreflang, sitemap, robots, Open Graph.
5. **English mirror** under `/en/`.
6. **QA**: Lighthouse mobile 90+; test at 375 px, 768 px and 1280 px; validate structured data.
7. **README**: how to edit prices in `site.json`, change the season, add a news post, deploy to Netlify.

## 8. Open items the owner must confirm (do not guess these)

- Exact reopening date and opening hours.
- Whether programs, prices, the enrolment fee and payment terms are unchanged.
- Official Japanese spelling of the school name.
- Whether Tom Sensei is still the teacher; any other staff.
- Public phone number; LINE Official Account, Instagram and Facebook URLs.
- Domain (maplesakuraschool.com?) and who holds the login.
- Eiken preparation or online lessons offered?
- Real photos, and written consent for any photo showing children.
- Who reviews the Japanese copy as a native speaker.
