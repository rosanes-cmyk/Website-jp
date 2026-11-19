# Maple Sakura School website / メイプルサクラスクール ウェブサイト

Static website for Maple Sakura School, a small English conversation school in Tsukuba, Ibaraki.
Japanese is the main language (`/`); an English mirror lives under `/en/`.

Plain HTML, CSS and vanilla JavaScript. **No framework, no build step.** What you see in the folder is what gets deployed.

> **Before launch:** every business fact is still a placeholder until the owner confirms it.
> Search for `TODO: confirm` (facts) and `JP-REVIEW` (Japanese copy to be checked by a native speaker).
> Text shown with a yellow highlight on the page (`class="tbd"`) is a visible placeholder.
> See PLAN.md section 8 for the list of open items, and RESEARCH.md for what the old website said.

---

## Preview on your computer

You need Python (already installed on most computers). In this folder, run:

```powershell
python -m http.server 8123
```

Then open <http://localhost:8123/>. Stop it with `Ctrl+C`.

(Opening `index.html` directly by double-clicking will not work properly, because the pages use links like `/css/base.css`.)

---

## Folder structure

```text
index.html, about/, programs/, fees/, gallery/, access/, news/   Japanese pages
en/                      English mirror of the same seven pages
css/base.css             colours, fonts, spacing, season colours
css/layout.css           header, menu, footer, phone bottom bar
css/components.css       buttons, cards, tables, accordion, form, lightbox...
css/animations.css       scroll reveals, page transitions, reduced motion
css/pages/*.css          styles used by one page (shared by its JA and EN versions)
js/main.js               menu, season, language switch (every page)
js/reveal.js             scroll reveals and number count-up (every page)
js/transitions.js        page-to-page transition and prefetching (every page)
js/petals.js             falling petals/leaves on the Home hero
js/pages/*.js            behaviour for one page (filter, lightbox, form...)
assets/svg/              logo, maple leaf, sakura petal, icon sprite (icons.svg)
assets/og/               share image (1200x630) and logo PNGs
assets/img/              photos (WebP) go here
data/site.json           all business facts in one place (see below)
sitemap.xml, robots.txt  for search engines
_redirects               Netlify redirects from the old site's URLs
```

---

## Change prices or other facts

There is no build step, so facts are written in **two places**:

1. `data/site.json`: the single list of facts (name, address, phone, hours, prices, terms). Update it first, so it stays the reference.
2. The HTML pages, so the site works without JavaScript. Use your editor's "Find in files" for the old value and replace it everywhere.

Example: Kids English Club goes from ¥10,000 + tax to ¥11,000 + tax.

- Tax-inclusive price (what the pages show): 11,000円 → 12,100円. Before-tax note: 税抜10,000円 → 税抜11,000円.
- Search all `.html` files for `11,000` and update each Kids price. In English pages, search for `¥11,000`.
- Update the **worked first-year example** on `fees/index.html` and `en/fees/index.html` (enrolment + 12 months, and the 3-month payments).
- Update the structured data (the `<script type="application/ld+json">` near the top of `programs/index.html` and `en/programs/index.html`): the `"price"` of that course, and `"priceRange"` in the school block if the lowest or highest price changed. The school block is identical on every page, so a `priceRange` change must be made in all 14 pages (Find and Replace in files).
- Japanese law requires prices to be shown **including tax** (総額表示). Keep the tax-inclusive price as the big number.

The same approach works for the phone number, address, email and opening hours. The footer must be identical on every page (search engines compare it).

When everything is confirmed, remove the yellow highlights by deleting `class="tbd"` spans (or the `.tbd` rule in `css/base.css`).

---

## Seasons

`js/main.js` adds a class to `<body>` from the current month:

| Months | Class | Look |
| --- | --- | --- |
| Mar–May | `season-spring` | sakura pink accents, mostly petals falling |
| Jun–Aug | `season-summer` | light blue-green accents |
| Sep–Nov | `season-autumn` | maple accents, mostly leaves falling |
| Dec–Feb | `season-winter` | cool indigo accents |

- **Preview another season:** add `?season=spring` (or `summer`, `autumn`, `winter`) to any page URL, e.g. <http://localhost:8123/?season=autumn>.
- **Change which months belong to which season:** edit the `SEASONS` list at the top of `js/main.js` (12 entries, January first).
- **Change the season colours:** edit the `.season-*` rules in `css/base.css`.
- **Force one season for the whole site** (e.g. for an April campaign): in `js/main.js`, replace `SEASONS[new Date().getMonth()]` with `'spring'`.

---

## Add a news post

1. Open `news/index.html`. Find the news list (`<ol class="news-list">` / `<li class="news-item">`).
2. Copy an existing `<li class="news-item">…</li>` block and paste it **at the top** of the list.
3. Change the date (both the visible text and the `datetime="2027-04-01"` attribute), the tag, the title and the text.
4. To mark it as new, keep `<span class="ribbon-new">NEW</span>`; remove that span from older posts.
5. Do the same in `en/news/index.html` in English.
6. If the post is important (e.g. the reopening date), also update the badge at the top of the Home page (`index.html` and `en/index.html`, search for `hero__badge`).
7. Update `<lastmod>` for the news pages in `sitemap.xml`.

### Add or change an FAQ

FAQs appear twice on `news/index.html`: in the visible list (`<details class="accordion__item">`) and in the structured data (`"@type": "FAQPage"` near the top). **Keep both identical**, otherwise Google may ignore them. Do the same in `en/news/index.html`.

---

## Add photos

1. Save photos as **WebP** (e.g. with <https://squoosh.app>), about 1600px on the long side, in `assets/img/`.
2. Replace a placeholder box (`<div class="ph" role="img" aria-label="…">…</div>`) with:

   ```html
   <img src="/assets/img/classroom-1.webp" alt="明るい教室の様子" width="1600" height="1200" loading="lazy">
   ```

   Always set `width` and `height` (the real pixel size) and a Japanese `alt` (English on `/en/` pages).
   Don't use `loading="lazy"` on the first image at the top of a page.
3. **Photos showing children need written consent from their guardians** before they are published.

---

## Deploy to Netlify

The site deploys as plain files: no build command.

**Option A: connect GitHub (recommended, updates automatically)**

1. Sign in at <https://app.netlify.com> → *Add new site* → *Import an existing project* → GitHub → choose `Website-jp`.
2. Branch to deploy: `main`. Netlify reads `netlify.toml` (no build command, publish the repository root), so leave the build settings empty.
3. **Before the first deploy:** *Site configuration → Forms →* **Enable form detection**. On new Netlify sites this is off by default; without it the trial form loses submissions. (If you already deployed, enable it and click *Deploys → Trigger deploy*.)
4. Deploy. Every push to `main` now redeploys the site automatically.
5. Test the form: send a test booking from `/access/` and `/en/access/` and check that it appears under *Forms → trial*.

**Option B: drag and drop**

On the Netlify dashboard, drag this whole folder onto *Sites* → *Deploy manually*.

**What is hidden while the site is pre-launch**

- `_headers` sends `X-Robots-Tag: noindex` on every page, so Google does not index the placeholder content. **At launch, delete that one line.**
- `_redirects` returns "not found" for `PLAN.md`, `README.md`, `RESEARCH.md`, `netlify.toml` and `/data/`. These are internal files and stay hidden permanently. (They are still in the GitHub repository, so keep the repository private.)
- `404.html` is the "page not found" page Netlify shows for any address that does not exist.

**After the first deploy**

- **Domain:** *Domain management* → add `maplesakuraschool.com` (confirm who controls the domain first). If you use a different domain, replace `https://maplesakuraschool.com` everywhere (canonical links, hreflang, Open Graph, structured data, `sitemap.xml`, `robots.txt`).
- **Trial form:** the booking form on `/access/` uses **Netlify Forms**. Submissions appear under *Forms* in the Netlify dashboard; set up email notifications in *Forms → Form notifications*. (The form only works on Netlify, not on the local preview.)
- **Redirects:** `_redirects` contains rules for the old Wix page addresses, but they only work for a domain that points at Netlify. A `wixsite.com` address can't be pointed at Netlify, so for the old Wix site, add a notice there that links to the new site. Add old Maple Village School addresses to `_redirects` only if that domain is recovered.
- **Search engines (launch day only):** after removing the noindex line, submit `https://maplesakuraschool.com/sitemap.xml` in Google Search Console.
- **Google Business Profile:** make sure the name, address and phone there match the website footer exactly.

---

## Quality targets

- Lighthouse (mobile): 90+ for Performance, Accessibility and SEO. In Chrome: DevTools → *Lighthouse* → *Mobile*.
- Test at 375px, 768px and 1280px widths. Nothing should scroll sideways.
- Check structured data with Google's Rich Results Test: <https://search.google.com/test/rich-results>.
- Animations only use `transform` and `opacity`, and switch off when the visitor's device asks for reduced motion.
