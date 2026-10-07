# HTML: deck engine + non-deck pages

## A. HTML decks — `assets/deck-template.html`
Single self-contained file: engine CSS + 8 presets + components + a 12-slide specimen. Copy it, keep
sections 1–9 of the `<style>` and the `<script>`, replace the `<section class="slide">` elements.

### Structure
```html
<main class="deck" data-preset="maison">            <!-- remove data-presets to disable the P key -->
  <section class="slide [slide--dark|slide--alt|slide--accent] [on-photo] [paper|glow|mesh]">
    <header class="chrome"><span>01 — Section</span><span class="brandmark">Brand</span><span data-page></span></header>
    … absolutely positioned content …
    <footer class="chrome chrome--b">…<span><span data-page></span> / <span data-total></span></span></footer>
    <aside class="notes">speaker notes (N key)</aside>
  </section>
</main>
```
- Canvas is fixed 1920×1080 and scaled to the window → design in px, never in vw.
- Position with `.abs` + inline custom properties: `style="--x:var(--m);--y:330px;--w:900px"` (also `--r`, `--b`, `--h`).
- `data-page` / `data-total` are filled automatically.

### Component cheat-sheet
| Need | Markup |
|---|---|
| Mixed-weight title | `<h1 class="t-display" style="--fs:130px"><span class="lt">Light line</span><b>Bold line</b></h1>` — `<em>` = accent word, `<i>` = outline line |
| Section title | `<h2 class="t-h" style="--fs:56px"><span class="lt">…</span> <em>…</em></h2>` |
| Kicker / micro | `<span class="kicker">Label</span>` · `<p class="micro">` |
| Lead / body | `<p class="lead">` (34px light) · `<p class="body">` (23px muted) |
| Serif statement | `<blockquote class="quote" style="--fs:84px">… <em>word</em></blockquote>` |
| Photo | `<figure class="ph ph--full scrim-l"><img src=…></figure>` · `ph--inset` · `ph--arch` · `ph--bw` · `ph--warm` · `--pos:70% 30%` |
| Giant numeral | `<div class="giant [giant--outline|giant--ghost|giant--accent]" data-morph="num" style="--r:-60px;--y:40px;--size:1100px">3</div>` |
| Ghost word / echo | `<div class="ghost" style="--y:120px;--size:440px">Word</div>` · `<div class="echo"><span>Word</span>×4</div>` |
| Interlock | `.interlock > .interlock__word + figure.interlock__obj + .interlock__word.interlock__front` (`--cut`, `--ow`, `--oh`, `--oy`, `--size`) |
| Pills | `.pill` · `.pill--solid` · `.pill--accent` · `.pill--glass` · `.pill--sm` · ring arrow `.ring>svg` |
| Stat | `<div class="stat__v" style="--fs:170px">94<small>%</small></div><div class="stat__l">label</div>` |
| Cards | `<div class="cards" style="--n:4;--y:300px;--b:110px">` + `.card.card--photo` / `.card--accent` / `.card--dark` / `.card--line` |
| Agenda | `<ol class="agenda"><li class="is-on"><span class="n">01</span><span>Title</span><span class="m">03</span></li>…` |
| Bars | `<div class="bars" data-in="grow" style="--x;--y;--w;--h"><div class="bar is-key" style="--v:86"><b>86</b><i></i><em>Q4</em></div>…` |
| Swiss modules | `<div class="modules" style="--cols:1.25fr 1fr 1fr">` + `.module(--accent|--dark|--panel)` |
| Triptych | `<div class="tri"><figure><img><figcaption>Word<small>sub</small></figcaption></figure>×3` |
| Table | `<table class="tbl">` with `th.num`, `td.num`, `tr.is-key` |
| Frame devices | `.marks` (crop marks) · `.bracket` · `.rail>span` · `.spine` (`--sx`) · `.chapters>span.is-on` |
| Backgrounds | `.paper` (grain) · `.glow` (`--gx`,`--gy`) · `.mesh` |

### Motion
- Build-ins: add `data-in` (`up` default, `fade`, `left`, `right`, `wipe`, `rise`, `zoom`, `blur`, `grow` for bars). Stagger is automatic in DOM order (110 ms); override with `data-i="3"`.
- Never put `data-in` on an element that already uses `transform` for positioning (wrap it instead).
- **Morph**: give an element `data-morph="name"` on two consecutive slides → the View Transitions API animates position/size/shape between them (Chrome/Edge/Safari 18+). Good candidates: chapter numeral, product cut-out, logo, spine line, highlighted card. Names must be unique within a slide.
- Timing: transitions .55 s crossfade + .9 s morph; build-ins .9–1.3 s `cubic-bezier(.2,.7,.1,1)`. No bounce, spin, or fly-in from outside the canvas.

### Keys & modes
←/→/space/PgUp/PgDn · Home/End · **F** fullscreen · **G** grid overview · **N** notes · **P** cycle presets ·
`#7` opens slide 7 · `?static` (no build-ins) · `?print` (all slides stacked) · `?preset=stage`.

### Export & QA
- **PPTX with sharp text (default)**: `python3 scripts/html_to_pptx_vector.py deck.html out.pptx` — 4K picture layer (`?layer=bg`) + vector SVG text layer (`?layer=text`, printed via `?print`). Text that must sit *between* images (interlock words, a word behind a cut-out) gets class `raster` (`.interlock` is raster by default) so it stays in the picture layer. Image-only fallback: `scripts/html_to_pptx.sh`.
- Screenshots + contact sheet: `scripts/render_html.sh deck.html outdir [preset]` (headless Chrome, `?static`).
- PDF: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --no-pdf-header-footer --print-to-pdf=deck.pdf "file:///abs/deck.html?print"` (page size = 1920×1080).
- Portable single file: download images next to the HTML (`img/…`) or inline them as base64 when the file must travel alone (keep under ~15 MB). Fonts come from Google Fonts; if the deck must work offline, also bundle the woff2 files with `@font-face`.
- Read the rendered PNGs before delivering — never ship unseen slides.

---

## B. Non-deck HTML (landing pages, report pages, dashboards, H5, one-pagers)
Same brand world, translated to a scrolling page. Use `assets/page-template.html` (same tokens and
components as the deck, responsive, scroll-reveal).

Rules:
- **Hero** = cover archetype: full-bleed image or flat brand field, mixed-weight title 8–11vw (clamp 56–180px), kicker, pill CTA, chrome bar on top (brand · nav · index).
- **Sections open like chapters**: giant numeral or ghost word + section title; alternate background tones (`bg` → `alt` → `dark`) for rhythm, never more than two dense sections in a row.
- **Sticky chrome**: thin top bar with micro caps (section name updates on scroll), hairline under it.
- **Grids**: 12-col, max content width 1440px, side gutter `clamp(16px,5vw,96px)`; cards with photo + bottom scrim; one highlighted card.
- **Data**: big numbers band; charts with one key series in accent; tables `.tbl`.
- **Motion**: IntersectionObserver adds `.is-in` → same keyframes as the deck; respect `prefers-reduced-motion`.
- **Mobile**: stack to one column below 760px; titles keep the light/bold contrast; giant numerals scale with `vw` and stay cropped; no horizontal scroll.
- **Dark mode**: only if the deliverable needs it (Artifacts do — map `--bg/--ink` swaps under `prefers-color-scheme: dark` as the artifact contract requires); a `stage` world is already dark.
- **Existing apps with their own UI** (e.g. study apps, dashboards already in use): don't restyle unless asked; new pages/features may adopt the tokens.
