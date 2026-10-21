# Arif Wahyudi — CV / Portfolio Landing Page

A single-page personal site generated from **Arif Wahyudi_Software Engineer Resume.pdf** and every public
repository on [github.com/arifwahh](https://github.com/arifwahh).

Static HTML + CSS + vanilla JavaScript. No build step, no framework, no CDN, no runtime dependencies.

---

## Contents

```
cv-landing-page/
├── index.html                 # the entire landing page (all sections, all 36 project cards)
├── robots.txt
├── sitemap.xml
├── assets/
│   ├── Arif Wahyudi - Software Engineer Resume.pdf   # CV used by the "Download CV" buttons
│   ├── css/styles.css         # design system: tokens, layout, components, dark/light, responsive
│   ├── js/main.js             # theme, nav, scroll reveal, project filter/search, copy-to-clipboard
│   └── img/favicon.svg
```

## Sections

| Section | Anchor | Content |
|---|---|---|
| Hero | `#top` | Name, role, location, contact chips, 4 headline stats, profile card |
| About | `#about` | Professional summary from the CV + quick-fact cards |
| Skills | `#skills` | 6 skill groups exactly as listed on the CV |
| Experience | `#experience` | 4 roles as a vertical timeline (2019 → 2026) |
| Projects | `#projects` | **5 live applications + 31 GitHub repositories = 36 cards**, filterable & searchable |
| Education | `#education` | Degrees + certifications |
| Contact | `#contact` | Email / phone / location / CV download, with copy-to-clipboard |

## Projects data

The 36 project cards live directly in `index.html` as `<article class="project">` elements.
Each card carries filter metadata:

```html
<article class="project"
         data-category="web"        <!-- web | backend | ai | automation | tools | academic | misc -->
         data-lang="PHP"
         data-name="medical record digitalization laravel tailwind">
```

`main.js` filters on `data-category` and searches `data-name` + card text. To add or edit a project,
edit the markup in `index.html` — no rebuild needed.

## Local preview

```bash
# any static server works
npx serve .
# or
python -m http.server 8000
```

Then open <http://localhost:8000>.

## Deploy

**GitHub Pages (recommended)**

```bash
cd cv-landing-page
git init
git add .
git commit -m "feat: portfolio landing page"
git branch -M main
git remote add origin https://github.com/arifwahh/arifwahh.github.io.git
git push -u origin main
```

Then in the repo: *Settings → Pages → Source: main / (root)*.

**Netlify / Vercel / Cloudflare Pages** — drag-and-drop the folder, no build command required.

## Before you publish

1. Update `<link rel="canonical">` and `og:url` in `index.html` to your real domain
   (currently `https://arifwahh.github.io/`), and the same in `robots.txt` / `sitemap.xml`.
2. Replace the GitHub-avatar image in the hero with a real photo if you prefer — the monogram
   fallback (`AW`) renders automatically if the image fails to load.
3. The `assets/` folder holds a copy of your CV; swap it for a refreshed PDF whenever the resume changes.

## Accessibility & compatibility

- Semantic landmarks, skip link, visible focus rings, `aria-*` on filters and live status
- Full keyboard support; `prefers-reduced-motion` respected
- Dark theme by default, light theme available and remembered in `localStorage`
- Verified with no horizontal overflow at 390 px (mobile) → 1440 px (desktop)
- Responsive down to 320 px; prints cleanly to PDF
