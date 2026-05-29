# Rumo-website · Projectcontext voor Claude Code

> **Claude, lees dit eerst volledig.** Dit bespaart een hoop briefen en voorkomt dat je dingen uitvindt die al gedefinieerd zijn.

---

## Inhoudsopgave

1. [Wat dit project is](#1-wat-dit-project-is)
2. [File-inventaris](#2-file-inventaris)
3. [Design system — kleuren](#3-design-system--kleuren)
4. [Design system — typografie](#4-design-system--typografie)
5. [Design system — layout &amp; spacing](#5-design-system--layout--spacing)
6. [Componenten met code-voorbeelden](#6-componenten-met-code-voorbeelden)
7. [SVG-illustratie-stijl](#7-svg-illustratie-stijl)
8. [Tone of voice — dvdb-geïnspireerd](#8-tone-of-voice--dvdb-geïnspireerd)
9. [Werkwijze](#9-werkwijze)
10. [DOs en DON'Ts cheat-sheet](#10-dos-en-donts-cheat-sheet)
11. [Openstaande punten](#11-openstaande-punten)

---

## 1. Wat dit project is

Marketingwebsite voor **Rumo** — hotelsoftware voor onafhankelijke hotels en B&B's. Doelgroep: hoteliers die hun eigen winkel runnen, 5–55 kamers, geen IT-afdeling, geen enterprise-budget.

**Product:** PMS + channel manager + booking engine + facturatie (Peppol) + handboek + AI-assistent (Rudy) + guest portal. Alles in één, `€12/kamer/maand`.

**Deploy:** GitHub Pages (statisch). Geen build-proces, geen framework, geen bundler. Platte HTML + CSS + vanilla JS. Direct editeren, direct zichtbaar.

**Folder:** `/Users/jeffrey/Projecten/rumo-website/`

**Positionering:** challenger-PMS. Tegenover logge enterprise-systemen (Mews, Cloudbeds, Opera), tegenover "consultants met dashboards". Voor mensen die liever met gasten bezig zijn dan met software.

---

## 2. File-inventaris

### Actieve pagina's — "-sfeer" versie (canoniek)

| Pagina | File | Nav-label | Url-pad |
|---|---|---|---|
| Home | `index-sfeer.html` | (logo) | `/` |
| Features | `features-sfeer.html` | Features | `/features-sfeer.html` |
| Integraties | `integraties-sfeer.html` | Integraties | `/integraties-sfeer.html` |
| Prijzen | `prijzen-sfeer.html` | En euh, wat kost dat? | `/prijzen-sfeer.html` |
| FAQ | `faq-sfeer.html` | FAQ | `/faq-sfeer.html` |
| Over ons | `over-ons-sfeer.html` | Over ons | `/over-ons-sfeer.html` |

### Gedeelde assets

| File | Doel |
|---|---|
| `shared-sfeer.css` | Kleuren, typografie, nav, buttons, page-header, trust, final-CTA, footer, fade-up, responsive base |
| `img/sfeer.mp4` (2.9MB) | Full-bleed hero-video op `index-sfeer.html` |
| `img/persona-resort.jpg` | "Hotel Chamade" persona (51 kamers) |
| `img/persona-carlton.jpg` | "Carlton Hotel" persona (22 kamers) |
| `img/persona-georgie.jpg` | "Georgie B&B" persona (5 kamers) |
| `img/automatisering.mp4` | **Niet meer in gebruik** in -sfeer (was in makkelijk-sectie, vervangen door SVG-illustratie) |

### Oude site (nog niet verwijderd, mag zodra user OK geeft)

`index.html`, `features.html`, `faq.html`, `prijzen.html`, `integraties.html`, `over-ons.html` + `shared.css` + `rudy-widget.css` / `.js` + `en/` folder (6 pages) + `fr/` folder (6 pages).

### Research / experimenteel (mag weg)

- `moodboard.html` — visueel moodboard met 7 referentiesites
- `opties.html` — 3 hero-varianten naast elkaar
- `referenties.html` — 50 referentiesites + dvdb analyse
- `index-a.html` — verlaten "stilleven"-experiment
- `index-klei.html` — verlaten "klei"-experiment

### Extern (shared.css oude site)

`rudy-widget.css`, `rudy-widget.js` — AI-widget voor oude site, **nog niet geïntegreerd in -sfeer**.

### Git

`.git/` is aanwezig, deploy gaat via GitHub Pages. `.claude/settings.local.json` is al geconfigureerd.

---

## 3. Design system — kleuren

### CSS custom properties (gedefinieerd in `shared-sfeer.css`)

```css
:root {
  /* Neutralen */
  --ink:         #1B1917;  /* warm near-black — alle tekst */
  --ink-soft:    #3a3531;  /* body-tekst, lopende alinea's */
  --paper:       #F5EEE2;  /* cream basis — body background */
  --paper-deep:  #ECE3D1;  /* alternerende sectie-achtergrond */
  --paper-panel: #FAF5EA;  /* cards, panelen, faq-items */
  --sand:        #E3D8C3;  /* tags, fills, calc-result bg */
  --line:        #1B191712; /* subtle borders (12 = 7% opacity) */
  --muted:       #8d8378;  /* secundaire tekst, kickers, meta */

  /* Accenten */
  --terra:       #D68F6F;  /* warme accent — italics, dots, chips */
  --terra-dark:  #b96b4a;  /* primary accent — em emphasis, CTA hover */
  --forest:      #5F7A55;  /* success, positief, live-indicators */
  --forest-soft: #E3EADE;  /* success backgrounds */
  --butter:      #F4D98F;  /* warm secundair — highlights op donker */
  --rose-soft:   #FBE1D2;  /* warme accent-backgrounds */
}
```

### Gebruiksregels

- **90% canvas** is `--paper` (body) of `--paper-deep` (alternerende secties).
- **Cards/panels** zijn altijd `--paper-panel` met `border: 1px solid var(--line)`.
- **Accent per element** is één. Niet terra + forest + butter tegelijk in één card.
- **Terra-dark** is de primary emphasis (italics, hover states, links).
- **Forest** is alleen voor positieve indicators (live, checks, success).
- **Butter** is alleen voor highlight op donkere achtergronden (ink canvas, final-CTA).
- **Nooit puur zwart (#000) of puur wit (#fff).** Gebruik `--ink` en `--paper`.

---

## 4. Design system — typografie

### Font-stack

```html
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,300;1,9..144,400&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### Gebruik per family

| Family | Waar |
|---|---|
| **Fraunces** (serif display) | h1, h2, h3, h4, prijzen, card-titels, pull-quotes, logo |
| **Inter** (sans) | body, buttons, bullets, navigatie |
| **JetBrains Mono** | kickers, labels, meta, chips, prijslabels, dateline |
| **Caveat** (cursive) | handgeschreven accenten, **spaarzaam** (max 1 per sectie) |

### Heading-regels

```css
h1, h2, h3, h4 {
  font-family: 'Fraunces', Georgia, serif;
  font-weight: 400;          /* NIET bold */
  letter-spacing: -0.025em;  /* altijd negatieve tracking */
  line-height: 1.02;         /* tight */
  color: var(--ink);
  text-wrap: balance;        /* STAAT GLOBAAL — vertrouwen */
}

h1 { font-size: clamp(2.6rem, 6vw, 5rem); }
h2 { font-size: clamp(2.2rem, 4.5vw, 3.8rem); letter-spacing: -0.028em; line-height: 1.04; }
h3 { font-size: clamp(1.6rem, 3vw, 2.3rem); }
```

**Belangrijk:**
- **`text-wrap: balance` staat globaal.** Harde `<br>` in koppen is zelden nodig en breekt meestal de balance.
- Alleen `<br>` gebruiken bij 2–4 woorden per regel (hero, final-CTA short titles).
- `<em>` = Fraunces italic + `color: var(--terra-dark)` + `font-weight: 300`.

### Body-regels

```css
body {
  font-family: 'Inter', -apple-system, sans-serif;
  line-height: 1.65;
  color: var(--ink);
  background: var(--paper);
}
p { font-size: 1rem; color: var(--ink-soft); max-width: 62ch; }
.lead { font-size: 1.15rem; color: var(--ink-soft); max-width: 58ch; line-height: 1.55; }
```

### Kicker-pattern (herhalend)

```html
<span class="kicker">Wat doet rumo</span>
```

```css
.kicker {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
  display: inline-flex; align-items: center; gap: 0.55em;
  margin-bottom: 1.25rem;
}
.kicker::before {
  content: ''; width: 6px; height: 6px; border-radius: 50%;
  background: var(--terra);
}
```

### Handwrite-accent (spaarzaam)

```html
<h2>Je <span class="handwrite">zondag</span> terug.</h2>
```

```css
.handwrite {
  font-family: 'Caveat', cursive;
  font-weight: 500;
  color: var(--terra-dark);
  font-style: normal;
  display: inline-block;
  transform: rotate(-3deg);
}
```

---

## 5. Design system — layout & spacing

### Grid / wrap

```css
.wrap { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
section { padding: 6rem 0; position: relative; }
```

### Breakpoints

- Desktop: default
- Tablet/small: `@media (max-width: 960px)` — nav collapses, grid → 1col
- Mobile: `@media (max-width: 560px)` — CTAs stack, footer 1col

### Border-radius conventies

- Buttons/pills: `100px` (fully rounded)
- Cards: `12–20px`
- Chips: `100px`
- Small badges: `6–8px`

### Schaduwen

```css
/* Cards */
box-shadow: 0 16px 40px rgba(27,25,23,0.05);

/* Hover-lift */
box-shadow: 0 20px 40px -15px rgba(27,25,23,0.1);

/* Mockup / visual */
box-shadow: 0 30px 60px -20px rgba(27,25,23,0.15), 0 0 0 1px rgba(27,25,23,0.04);
```

---

## 6. Componenten met code-voorbeelden

### 6.1 Nav

Alle -sfeer pagina's hebben **identieke** nav-structuur. Actieve pagina krijgt `class="active"` op haar eigen link. Op `index-sfeer.html` heeft nav extra JS om tussen transparent-on-video en scrolled-state te wisselen.

```html
<nav>
  <a href="index-sfeer.html" class="nav-logo">rumo<em>.</em></a>
  <button class="nav-toggle" aria-label="Menu" onclick="this.classList.toggle('active');document.querySelector('.nav-links').classList.toggle('open')">
    <span></span><span></span><span></span>
  </button>
  <ul class="nav-links">
    <li><a href="index-sfeer.html#pijlers">Wat doet rumo?</a></li>
    <li><a href="features-sfeer.html">Features</a></li>
    <li><a href="integraties-sfeer.html">Integraties</a></li>
    <li><a href="prijzen-sfeer.html">En euh, wat kost dat?</a></li>
    <li><a href="faq-sfeer.html">FAQ</a></li>
    <li><a href="over-ons-sfeer.html">Over ons</a></li>
    <li><a href="index-sfeer.html#demo" class="nav-cta">Probeer gratis →</a></li>
    <li class="nav-lang">
      <a href="[current-page]-sfeer.html" class="active">NL</a>
      <a href="en/[page].html">EN</a>
      <a href="fr/[page].html">FR</a>
    </li>
  </ul>
</nav>
```

### 6.2 Page-header (voor alle non-home pagina's)

```html
<div class="page-header">
  <div class="page-header-inner fade-up">
    <div>
      <span class="kicker">Over ons</span>
      <h1>Gebouwd door een hotelier en een <em>engineer.</em></h1>
      <p class="lead">Eén of twee zinnen context.</p>
    </div>
    <div class="page-header-side">
      Meta links<br>
      <strong>Belangrijke stat</strong>
    </div>
  </div>
  <div class="page-header-ribbon">
    <span>Tag 1</span>
    <span>Tag 2</span>
    <span>Tag 3</span>
  </div>
</div>
```

### 6.3 Buttons

```html
<!-- Primary CTA (ink pill) -->
<a href="#" class="btn-ink">Probeer 14 dagen gratis <span>→</span></a>

<!-- Secondary (paper pill, voor op donker) -->
<a href="#" class="btn-paper">Start meteen <span>→</span></a>

<!-- Ghost (text-link met underline) -->
<a href="#" class="btn-ghost">Hoe het werkt <span class="arr">→</span></a>

<!-- Ghost white (voor op donker/video) -->
<a href="#" class="btn-ghost-white btn-ghost">Meer info <span class="arr">→</span></a>
```

### 6.4 Final CTA-sectie (onderaan elke pagina)

Identiek op alle pagina's, kicker mag variëren ("Ben je niet zo'n babbelaar?" / "Zelf proberen" / "Overtuigd?"):

```html
<section class="final" id="demo">
  <div class="final-inner fade-up">
    <span class="kicker">Zelf proberen</span>
    <h2>Geen demo-gesprek.<br>Gewoon <em>14 dagen</em> spelen.</h2>
    <p>Geen creditcard, geen verplichtingen. ...</p>
    <a href="index-sfeer.html#demo" class="btn-paper">Probeer 14 dagen gratis <span>→</span></a>
    <p class="final-fine">Geen credit card · Na 6 maanden maandelijks opzegbaar · Gratis datamigratie</p>
  </div>
</section>
```

### 6.5 Footer

Identiek op alle pagina's, vier kolommen: brand + tagline · Product · Rumo · Integraties.

```html
<footer>
  <div class="footer-grid">
    <div>
      <div class="footer-brand">rumo<em>.</em></div>
      <p class="footer-tagline">Hotelsoftware voor onafhankelijke hoteliers. Zonder gedoe.</p>
    </div>
    <div>
      <div class="footer-label">Product</div>
      <ul class="footer-links">
        <li><a href="features-sfeer.html">Features</a></li>
        <li><a href="integraties-sfeer.html">Integraties</a></li>
        <li><a href="prijzen-sfeer.html">En euh, wat kost dat?</a></li>
        <li><a href="faq-sfeer.html">FAQ</a></li>
      </ul>
    </div>
    <div>
      <div class="footer-label">Rumo</div>
      <ul class="footer-links">
        <li><a href="https://wa.me/32485382828">WhatsApp</a></li>
        <li><a href="mailto:hello@rumo.eu">Stuur ons een mailtje</a></li>
        <li><a href="over-ons-sfeer.html">Over ons</a></li>
      </ul>
    </div>
    <div>
      <div class="footer-label">Integraties</div>
      <ul class="footer-links">
        <li><a href="integraties-sfeer.html">Booking.com</a></li>
        <li><a href="integraties-sfeer.html">Airbnb</a></li>
        <li><a href="integraties-sfeer.html">Exact Online</a></li>
        <li><a href="integraties-sfeer.html">Peppol</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <span>© 2026 Rumo · Gent, BE</span>
    <span>Direction · Sfeer</span>
  </div>
</footer>
```

### 6.6 Fade-up scroll animation

```html
<div class="fade-up">...</div>
```

```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
```

### 6.7 Hero (alleen index-sfeer)

Full-bleed video, gradient overlay, noise grain, centered copy bottom-aligned.

```html
<section class="hero">
  <video class="hero-video" autoplay loop muted playsinline preload="auto">
    <source src="img/sfeer.mp4" type="video/mp4">
  </video>
  <div class="hero-overlay"></div>
  <div class="hero-grain"></div>
  <div class="hero-inner">
    <div class="hero-copy">
      <h1>Je hotel runnen<br><em>zonder gedoe.</em></h1>
      <p class="hero-sub">Subzin.</p>
      <div class="hero-ctas">
        <a href="#demo" class="btn-ink">Probeer 14 dagen gratis <span>→</span></a>
        <a href="#pijlers" class="btn-ghost-white btn-ghost">Hoe het werkt <span class="arr">→</span></a>
      </div>
    </div>
  </div>
  <div class="hero-scroll">scroll</div>
</section>
```

### 6.8 Pijler-visual (index-sfeer)

**Géén UI-screenshot grids** (eerder experiment, werkte niet zichtbaar genoeg). Wel SVG lijn-illustratie in cream paneel + `.pijler-chip` linksonder + optionele `.pijler-note` rechtsboven.

```html
<div class="pijler-visual">
  <svg class="illus" viewBox="0 0 400 320" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <!-- Lijn-illustratie, max 2 fill-accents in terra/forest/butter -->
  </svg>
  <div class="pijler-chip live">Week 16 · 47% bezet</div>

  <!-- Optioneel: handgeschreven annotatie -->
  <div class="pijler-note-wrap">
    <span class="pijler-note">antwoord<br>binnen 20 sec</span>
    <svg class="pijler-note-arrow" viewBox="0 0 50 30">...</svg>
  </div>
</div>
```

### 6.9 Feature-module (features-sfeer)

Grote alternerende sectie met icon-tag + titel + bullets links en Granola-stijl mockup rechts.

```html
<section class="feature" id="rudy">
  <div class="wrap">
    <div class="feature-inner fade-up">
      <div class="feature-text">
        <div class="feature-tag">
          <div class="ic" style="background: var(--rose-soft); color: var(--terra-dark);">
            <svg viewBox="0 0 24 24">...</svg>
          </div>
          <span class="lbl">Rudy</span>
        </div>
        <h2>Titel met <em>italic</em></h2>
        <p>Body.</p>
        <ul class="feature-bullets">
          <li>Bullet 1</li>
          <li>Bullet 2</li>
        </ul>
      </div>
      <div class="feature-visual">
        <div class="mockup mk-[naam]">
          <div class="mockup-head">
            <h5>Titel</h5>
            <span class="badge live">Live</span>
          </div>
          <!-- Mockup content -->
        </div>
      </div>
    </div>
  </div>
</section>
```

### 6.10 FAQ-accordion

```html
<details class="faq-item">
  <summary>Vraag?</summary>
  <div class="faq-body">
    <p>Antwoord.</p>
  </div>
</details>
```

Gestyled met `<details>`/`<summary>` + `+/−` indicator in terra-dark.

---

## 7. SVG-illustratie-stijl

**Stijl-referentie:** energie.be — simpele lijn-illustraties, 1.5px stroke, ink color met 1–2 fill-accenten.

### Regels

- `viewBox="0 0 400 320"` (of vergelijkbaar 5:4 aspect)
- `fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"`
- **Kleur komt van parent** (`color: var(--ink)`), géén hard-coded `#1B1917` op stroke
- **Fill-accenten** mogen hardcoded hex zijn voor performance: `fill="#D68F6F"` (terra), `fill="#5F7A55"` (forest), `fill="#F4D98F"` (butter)
- Max 2–3 fill-accenten per illustratie
- `aria-hidden="true"` op decoratieve SVG

### Voorbeeld — agenda-illustratie (pijler 1 PMS)

```html
<svg class="illus" viewBox="0 0 400 320" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <!-- Open agenda -->
  <path d="M60,70 L60,270 L200,275 L200,75 Z"/>
  <path d="M200,75 L200,275 L340,270 L340,70 Z"/>
  <line x1="200" y1="75" x2="200" y2="275"/>
  <!-- Spiral binding dots -->
  <circle cx="200" cy="100" r="3"/>
  <circle cx="200" cy="130" r="3"/>
  <!-- Terra-kleur cellen als accent -->
  <rect x="248" y="100" width="24" height="20" rx="2" fill="#D68F6F" stroke="none"/>
  <rect x="304" y="100" width="24" height="20" rx="2" fill="#5F7A55" stroke="none"/>
  <!-- Pencil accent -->
  <line x1="340" y1="295" x2="380" y2="258" stroke-width="2.5"/>
  <line x1="380" y1="258" x2="385" y2="253" stroke="#D68F6F" stroke-width="2.5"/>
</svg>
```

### Waar ze staan

- `index-sfeer.html` — 3× pijler-visual (PMS/agenda, Handboek/boek, Rudy/chat) + 1× makkelijk-sectie (desk-scene)
- `over-ons-sfeer.html` — hotel-illustratie in page-header side

---

## 8. Tone of voice — dvdb-geïnspireerd

Stem gebaseerd op **dievandeboekhouding.be** (Vlaamse challenger-toon), aangepast voor hotelier-publiek.

### Kernprincipes

1. **"jij", nooit "u"**
2. Merknaam **lowercase**: `rumo`, ook mid-sentence
3. **Spreektaal-tussenwerpsels** als kopjes / scharnieren
4. **Haakjes voor knipoog** (zakelijk zinnetje → *(haakjes-grap)*)
5. **"zonder gedoe"** is de signature-belofte
6. **Cursief spaarzaam** — max 1 woord per alinea, altijd voor emphasis
7. **Drieklappers** zonder en-en: "Slimmer, eenvoudiger, goedkoper."
8. **Korte zinnen bij de belofte**, ademruimte bij de uitleg

### Signature zinnen en varianten

| Context | Voorbeeld |
|---|---|
| Belofte-kapstok | "Je hotel runnen zonder gedoe." |
| Opening | "Goh, en wat is rumo nu juist?" / "Awel, wij bouwen hotelsoftware." |
| Wie-sectie | "Hmm oké, maar wie zijn die van rumo nu?" |
| Prijzen menu | "En euh, wat kost dat?" |
| Final contact | "Ben je niet zo'n babbelaar?" |
| CTA (primary) | "Probeer 14 dagen gratis" |
| CTA (contact) | "Plan een babbelke" / "Stuur ons een mailtje" |
| Eind-gerust | "No hard feelings." / "Dan verdwijnt het stilletjes." / "(Jup, écht.)" |

### Vijand-frames (waar rumo *tegen* is)

- Logge enterprise-PMS (niet bij naam)
- OTA-commissies ("de 12-21% die je anders betaalt")
- "Consultants met dashboards"
- Opleidingen van 3 dagen, handleidingen van 200 pagina's
- Chatbots die halverwege vastlopen
- Account managers die wekelijks bellen

### CTA-strategie

- **Primary conversie** (hero, final): *"Probeer 14 dagen gratis"* — direct, professioneel, dvdb maar niet Vlaams
- **Secundair/contextueel** (contact, FAQ, footer): *"Stuur ons een mailtje"*, *"Plan een babbelke"*, *"Kom eens op de koffie"*
- **Never**: "Vraag offerte aan", "Neem contact op", "Plan een demo met een account manager"

### Concrete voorbeeldcopy

**Hero:**
```
Je hotel runnen zonder gedoe.

rumo is gemaakt voor hoteliers die nog elke dag in hun eigen hotel staan.
PMS, channel manager, facturatie en handboek in één. Plus een slimme collega.
Niets meer.
```

**Intro na hero ("Goh, wat is rumo?"):**
```
Awel, we zijn hotelsoftware. Maar niet zoals je denkt. Geen enterprise platform
van tweeduizend euro per maand waar je dan nog eens drie dagen opleiding voor
nodig hebt. Gewoon één systeem dat doet wat het moet doen. Je opent het
's morgens en je weet wat er vandaag moet gebeuren. Dat was eigenlijk het
hele idee.
```

**Final-CTA:**
```
Geen demo-gesprek. Gewoon 14 dagen spelen.

Geen creditcard, geen verplichtingen, geen "account manager" die je elke
week opbelt. Een demo-omgeving vol nepreservaties. Bevalt het niet?
Dan verdwijnt het stilletjes. No hard feelings.
```

**Prijs-kicker:**
```
En euh, wat kost dat?

Vanaf €12
per kamer · per maand

PMS, channel manager, booking engine, Rudy en het handboek. Alles inbegrepen.
(Dat zijn veel vinkjes. Dus… is dan écht alles inbegrepen? Jup, écht.)
```

### Niet doen

- ❌ "oplossingen", "synergieën", "kwalitatieve dienstverlening"
- ❌ "marktleider", "de beste", "#1 in België"
- ❌ Fake urgentie: "nog 3 plaatsen!", countdowns
- ❌ Hoofdletter-titelcase ("Onze Oplossingen")
- ❌ Humor *over gasten* (wel over software/admin/OTAs)
- ❌ Overmatig emoji-gebruik
- ❌ "Klik hier", "meer info" als CTA

---

## 9. Werkwijze

### Hoe de user meestal werkt

- Screenshots of PDF met annotaties per sectie
- "Op pagina X, sectie Y, kan dit beter zo en zo"
- Iteraties zijn klein en frequent — liever 5 kleine rondes dan 1 grote
- User wil graag snel kunnen zien hoe iets eruit ziet, dus werkende code > perfecte code

### Voor je begint met een edit

1. **Lees de huidige pagina.** Gebruik `Read` of `Grep`. Er kan sinds vorige sessie al iets veranderd zijn.
2. **Check of het patroon al bestaat** in een andere -sfeer pagina. Consistentie > creativiteit.
3. **Check `shared-sfeer.css`** voordat je nieuwe CSS-klassen toevoegt — hergebruik waar mogelijk.

### Tijdens de edit

- Page-specifieke CSS inline in `<style>` van de pagina zelf.
- Globale/herbruikbare CSS in `shared-sfeer.css`.
- Bij nieuwe sectie-type: eerst vraag jezelf "kan ik een bestaand patroon hergebruiken?"
- Vermijd JavaScript tenzij nodig (fade-up animation en calculator zijn de enige JS-patterns nu).

### Verifiëren na edit

```bash
# Section-structuur intact?
grep -c '^<section' file.html && grep -c '^</section>' file.html

# Images bestaan nog?
grep -oE 'src="img/[^"]+"' file.html | sed 's/src="//' | sed 's/"//' | xargs -I {} test -f {} && echo "OK"

# shared-sfeer.css gelinkt?
grep -c 'shared-sfeer.css' file.html

# Oude rommel (moet 0 zijn)?
grep -c 'Playfair' file.html
grep -ciE 'sage|--sage' file.html
```

### Testen in browser

Geen build-step: open direct met `open file.html` (macOS) of via live server. GitHub Pages deployt automatisch bij push naar `main`.

---

## 10. DOs en DON'Ts cheat-sheet

### ✅ DO

- Gebruik CSS custom properties (`var(--ink)`), geen hardcoded hex in CSS (behalve in SVG fill-accenten)
- Fraunces 400 voor koppen, NOOIT bold
- `text-wrap: balance` vertrouwen, géén `<br>` in koppen tenzij *zeer* kort
- `<em>` voor emphasis — wordt automatisch Fraunces italic terra-dark
- `.kicker` class voor sectie-labels (mono, terra dot)
- `.fade-up` voor scroll-reveal
- Lowercase `rumo` altijd
- Images in `img/`, nooit elders

### ❌ DON'T

- ~~Playfair Display~~ → Fraunces
- ~~Sage-groen (#7a8c6e)~~ → Forest (#5F7A55) als positive
- ~~Terracotta (#c4653a) oude~~ → Terra (#D68F6F) / Terra-dark (#b96b4a)
- ~~Kobaltblauw~~ → geen blauw in palet
- ~~Multi-mockup UI grids in hero~~ → SVG line-illustrations
- ~~Harde `<br>` voor regelafbreking in koppen~~ → vertrouwen op `text-wrap: balance`
- ~~"Rumo" met hoofdletter in body~~ → `rumo` lowercase
- ~~"U" formeel~~ → "jij"
- ~~Emoji-opsmuk~~ → spaarzaam, alleen als knipoog

---

## 11. Openstaande punten

- [ ] EN en FR vertaling van -sfeer pagina's (6 pagina's × 2 talen = 12 files, in `en/` en `fr/` folders)
- [ ] Echte Rumo-hotelsfeer video voor hero (nu nog Chamade `sfeer.mp4`)
- [ ] Oude niet-sfeer pagina's opruimen + oude `shared.css` + oude `en/` `fr/` verwijderen (wanneer user OK geeft)
- [ ] Rudy chat-widget (`rudy-widget.css` + `.js`) integreren in -sfeer pagina's (nu alleen op oude pagina's actief)
- [ ] Favicon / social preview images updaten naar nieuwe stijl
- [ ] Performance check op mobiel (vooral hero-video — poster fallback voor slow connections)
- [ ] Research / experimenteel bestanden opruimen: `moodboard.html`, `opties.html`, `referenties.html`, `index-a.html`, `index-klei.html` (wanneer user OK geeft)
- [ ] Meta-tags: OG-images, description checken voor elke -sfeer pagina
- [ ] `robots.txt` en sitemap checken na cleanup

---

## Korte prompt-templates voor de user

### Bij een specifieke feedback-ronde

```
Lees CLAUDE.md. Ik heb feedback op [pagina-sfeer.html]:

1. [feedback item 1]
2. [feedback item 2]

Pas de pagina aan volgens de design-regels in CLAUDE.md. Vat kort samen wat je veranderd hebt.
```

### Bij nieuwe sectie/component

```
Lees CLAUDE.md. Voeg op [pagina-sfeer.html] een nieuwe sectie toe tussen [sectie A] en [sectie B] met:

- [inhoud]
- [visueel type]

Volg de design-regels uit CLAUDE.md (kleurpalet, typografie, dvdb-toon, layout).
```

### Bij opruiming

```
Lees CLAUDE.md sectie 11. Ruim [specifiek item] op. Laat me weten wat er precies verwijderd wordt voor je het doet.
```
