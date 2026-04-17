# Handover: Website translations EN/FR

## What's done

### NL (6/6 complete)
All 6 `-sfeer.html` pages copied to clean URLs with updated internal links:
- `index.html` — includes contact form (#contact), mobile hero fixes, Rudy widget CSS/JS
- `features.html`, `integraties.html`, `prijzen.html`, `faq.html`, `over-ons.html`

Extra changes on `index.html`:
- Contact form using Formsubmit.co → jeffrey@rumo.eu (verified)
- Mobile responsive hero (portrait/landscape)
- "drie dagen" → "drie weken" in intro
- "eigen huizen" → "zelf hotels" in wie-sectie
- Rudy widget added (CSS updated to sfeer design system, JS unchanged)

### EN (5/6 complete)
- ✓ `en/features.html`, `en/integrations.html`, `en/pricing.html`, `en/faq.html`, `en/about.html`
- ✗ `en/index.html` — still OLD design (shared.css, Playfair Display, old layout)

### FR (4/6 complete)
- ✓ `fr/integrations.html`, `fr/tarifs.html`, `fr/faq.html`, `fr/a-propos.html`
- ✗ `fr/index.html` — still OLD design
- ✗ `fr/features.html` — still OLD design

## What needs to be done

### 3 pages to translate (priority order):

1. **`en/index.html`** — Read NL `index.html`, translate to English, write to `en/index.html`
2. **`fr/index.html`** — Read NL `index.html`, translate to French, write to `fr/index.html`
3. **`fr/features.html`** — Read NL `features.html`, translate to French, write to `fr/features.html`

### Translation rules:
- Copy ALL CSS (inline + shared-sfeer.css ref as `../shared-sfeer.css`)
- Copy ALL SVGs, animations, JavaScript exactly
- Asset paths: `img/` → `../img/`
- Nav links: use target language page names
- Lang switcher: NL → `../[nl-page].html`, EN → `../en/[en-page].html`, FR → `../fr/[fr-page].html`, active = own language
- EN tone: casual, honest, "you" not "You", lowercase `rumo`
- FR tone: "tu/ton/ta" informal, Belgian French, lowercase `rumo`
- Contact form: keep Formsubmit endpoint as jeffrey@rumo.eu, translate labels + confirmation
- Rudy widget: include `<link rel="stylesheet" href="../rudy-widget.css">` and `<script src="../rudy-widget.js"></script>`

### Key phrase translations:
| NL | EN | FR |
|---|---|---|
| zonder gedoe | without the hassle | sans prise de tête |
| Plan een babbelke | Let's have a chat | Discutons-en |
| En euh, wat kost dat? | So, what does it cost? | Et euh, ça coûte combien ? |
| Ben je niet zo'n babbelaar? | Not much of a talker? | Pas très bavard ? |
| No hard feelings | No hard feelings | No hard feelings |
| Probeer 14 dagen gratis | Try 14 days free | Essaie 14 jours gratuitement |

## Other open items
- Rudy chat widget needs a public API endpoint — see issue #321 in rumo-pms
- `rudy-widget.js` API_ENDPOINT needs updating once Seba creates the public route
- Old `-sfeer.html` files can be deleted once Jeffrey confirms all is good
