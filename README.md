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
