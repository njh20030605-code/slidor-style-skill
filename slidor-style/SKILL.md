---
name: slidor-style
description: Premium presentation and HTML page design in the style of Paris presentation studio Slidor (Chanel, Cartier, LVMH, Nespresso) plus luxury freelance designer Lucile Mennessier (L'Oréal, Guerlain, Dom Pérignon) — brand-world method, 10 visual presets, 24 layout archetypes, an HTML deck engine, a responsive page template, a pptxgenjs kit with Morph transitions, sharp vector-text PPTX export and render QA. Use whenever the user asks for slides, a deck, a presentation, a .pptx, a keynote, a pitch, a report page, a landing page or any HTML page (PPT / 幻灯片 / 汇报 / 提案 / 网页 / 落地页 / H5), or asks to make an existing deck or page look premium (好看 / 高级 / 重新设计) — even if they don't mention Slidor, style or design.
---

# Slidor Style — 品牌大片级的 PPT 与网页

The goal: every slide or page looks like it came out of a Paris presentation studio — a brand
campaign, not a template. Slidor's own line is "composition is king": a system of tokens and
devices, but each slide composed for its content.

## The essence — read this before touching a component
Components (giant numerals, chrome, pills, cards) are the *skin*. A deck built from them still looks
like a report if these decisions are wrong — learned the hard way on a real client review deck
(verdict on the first draft: "只抄了皮毛，一点没有高级感，封面丑"). The decisions that make it Slidor:

1. **One hero per slide, ≥ 50 % of the canvas.** A number, a word, a photo or a drawn chart — one. Everything else is ≤ 1/5 of its size. If a slide has kicker + title + stat + chart + footnote at similar weights, it is a report page: cut.
2. **Delete before you design.** No explanatory grey sentences under every element, no footnotes on content slides (put them in an appendix), no boxes around numbers. Two-thirds empty is normal.
3. **There is always a picture world.** If the brand has no usable photography, *build one*: macro textures of the category (cream, serum, silk, water for skincare), product renders, or a pure-typographic world. Never let screenshots be the hero — UI screenshots (TikTok live, dashboards) only appear as evidence, framed, small or in pairs.
4. **The cover is a campaign image or pure type** — never a screenshot, never a busy photo. Texture + one huge numeral/word + tiny refined text.
5. **Chinese typography decides "高级".** Display in a real serif (Noto Serif SC / 思源宋体, weight 200–400, tracking .04–.12em), body in a light sans (Noto Sans SC 300), Latin numerals in a high-contrast Didone (Bodoni Moda, opsz 96). System fonts (Hiragino/PingFang/YaHei) for titles = template look. Never letter-space a sentence of Chinese like Latin caps.
6. **Accent = a whisper.** Brand red on one hairline, one number, one dot per slide. A red block covering 30 % of a slide reads as a government report.
7. **Draw charts, don't insert them.** Hairline axes, one highlighted segment, values set in the display numeral font. Default Office/LibreOffice charts look like Excel.
8. **Didone hairlines vanish.** Signs (+ − %) in Bodoni at opsz 96 nearly disappear — set them at low optical size / heavier weight, or −68.7 % reads as 68.7 %.
9. **Pick the pipeline that can deliver the type.** When the look depends on web fonts (Chinese serif, Didone), design in HTML and export with `scripts/html_to_pptx_vector.py` — per slide a 4K JPEG background + a vector SVG text layer (PNG fallback), so text stays sharp at any zoom (pure image export looked "糊" to the user). Needs the deck's `?print` / `?layer=bg|text` modes (built into `assets/deck-template.html`). `scripts/html_to_pptx.sh` = image-only fallback. Body text in light (300) weights reads as blurry on screen — use 400 for anything under ~28px. Use the pptxgenjs kit only when editability matters more than typography, and say so.
10. **Show a direction before building 20 slides.** For any deck where taste matters, render 4–6 key slides (cover, overview, one data, one image, one statement), get a yes, then build the rest.
11. **No default palette.** Warm cream `#F5F2ED` + warm greys is the generic "AI/Claude" look (feedback: "还是 Claude 的经典配色，和品牌元素不一致"). Sample light/dark grounds and greys from the brand's own imagery (e.g. a whitening skincare line: cool pearl `#F4F6F9`, cool black `#0B0C0E`, greys `#4E545D/#8A919B`).
12. **Faces only from official retouched key visuals.** A video frame of a celebrity (mid-speech mouth, motion blur, ungraded) is ugly even in 4K — use video frames only for wide/atmosphere shots (sets, products, silhouettes). Extend a KV's own background gradient to make room for the title instead of cropping the person.
13. **Screenshots are evidence, not décor.** Crop each to the exact UI card (no slivers of the neighbouring page), show it whole inside a uniform neutral frame, never `object-fit: cover`. Drop spreadsheet/table screenshots (they look like Excel) — mention them in a line instead.
14. **Delivery hygiene.** Export image decks as 4K JPEG (PNG pages are 5–10 MB and WPS shows them blank), check every page for blanks, and never overwrite a file the user may have open — write `_v2`.

**Scope**
- Applies to: every new deck (.pptx or HTML), every new HTML page, and redesign requests.
- Does not override: existing apps/pages that already have their own UI (study apps, dashboards in use) — restyle only if asked; Feishu docs/Bases (no layout control).
- Works with other skills: `pptx` skill = file mechanics & validation; Artifact Slides type / `artifact-design` = publishing contract. **This skill decides how it looks.** If both apply, follow their mechanics and this skill's design.

## Workflow

1. **Brief in one line** — audience, setting (laptop / projector / LED stage / email PDF), length, language (中 / EN / Tiếng Việt), deliverable (`.pptx`, HTML deck, HTML page). Infer from context; ask only if the deliverable format is truly unclear.
2. **Brand world** — beauty/skincare/fragrance/jewellery → start from Lucile's restraint (`lumiere`/`maison`, `references/lucile-mennessier.md`) and add one Slidor move per chapter; keynotes/launches/sport/tech → Slidor first. Collect the brand's logo, colors, fonts, product shots, campaign imagery. Pick the nearest preset and override its accent/base with the brand's real colors (`references/presets.md`; brand-specific notes in `references/brand-*.md` if present). Choose **one signature device** that recurs on every slide (chapter numerals, chrome bar, spine line, tape frame, brackets, crop marks, logo-derived motif).
3. **Storyline as action titles** — write the slide list first: each title states the takeaway, not the topic. One message per slide (~30 s of talk). Tag each slide with a rhythm: **B**reath / **I**nfo / **D**ata / **T**ransition; never more than two I/D in a row; open chapters with T slides.
4. **Pick layouts** from `references/layouts.md` (24 archetypes, with px specs and the matching HTML class / kit call). Vary composition — no two consecutive slides with the same layout.
5. **Imagery** — the user's own assets first (product shots, campaign photos); otherwise licensed stock (Unsplash/Pexels), one consistent grade. Cut-outs for products. Never reuse Slidor/Lucile/client images.
6. **Build**
   - HTML deck → copy `assets/deck-template.html`, keep its engine, replace the slides (`references/html-engine.md`).
   - HTML page → copy `assets/page-template.html` (`references/html-engine.md` §B).
   - PPTX → `assets/slidor_pptx_kit.js` + `scripts/prep_images.py` (`references/pptx-kit.md`; worked example `assets/pptx_example.js`). `save()` adds Morph/Fade transitions and CJK/outline fixes.
7. **Render and look** — `scripts/render_html.sh deck.html out [preset]` or `scripts/render_pptx.sh deck.pptx out` → read `_sheet.jpg` and the slides that matter at full size. Run the QA checklist below; fix; re-render. Never deliver unseen slides.
8. **Deliver** — files on the Desktop (or where asked); for decks also offer a PDF export. Mention the preset used and how to switch (HTML: **P** key / `?preset=`).

## The signature moves (use several per deck)
1. **Brand world first** — the whole system grows from the client's universe (Cartier paper & red, Tencent pixel motif, Lacoste court-line tape, Ledger brackets).
2. **Mixed-weight titles** — light line + bold line ("INCOME / THE SCENE"), or one accent-colored word, or outline line + solid line.
3. **Type as architecture** — giant chapter numerals 900–1200 px cropped by the canvas; ghost words at 5–8 % behind statements; outline echoes.
4. **Depth through layering** — product/person passes through a word (interlock), numeral behind the subject, cut-outs breaking frames, cards overlapping photos.
5. **Cinematic imagery** — full-bleed or inset-rounded photos, one subject, text in negative space over a 30–50 % scrim, one grade for the whole deck.
6. **Editorial chrome** — micro-caps header/footer on every slide (section · brand · page), hairlines, crop marks, rails — the magazine polish.
7. **UI micro-components** — pills, glass capsules, ring arrows, chapter chips; website-style nav inside slides.
8. **Data as hero** — one huge number with a tiny label; charts stripped bare with one key bar/series in accent; product-as-chart for luxury.
9. **Restraint** — 60-30-10 color, accent on ≤ 10 % of the surface, 40–60 % empty space, one or two type families.
10. **Rhythm** — alternate breath and dense slides; chapter openers; agenda re-used as divider with the active chapter highlighted.
11. **Motion with meaning** — staggered ease-out build-ins (0.3–1 s), Morph of one persistent object between slides; never bounce/spin/cube.
12. **Template craft** — when the deliverable is a template: master + 3–5 layouts + a 10–15-slide library, icon page, chart page.

## Hard numbers (1920×1080 canvas; 1 pt = 2 px; HTML px = kit px)
- Margins 96 px (140 px for airy/formal). Chrome at y = 44 (top) / 1040 (bottom), 14 px micro caps tracked .16em.
- Type scale: micro 14 · caption 18–20 · body **28** (14 pt; never < 24 except chrome/labels) · lead 34–36 · section title 52–64 · display 110–170 · hero KPI 260–440 · giant numeral 700–1200.
- Projected decks: body ≥ 36 px; LED/event: body ≥ 72 px, titles ≥ 120 px, one phrase per slide.
- Display leading 0.85–0.95, body 1.3–1.5 (CJK 1.5–1.6). Left-aligned by default; never justify.
- Lines ≤ 60–70 Latin / ≤ 35 CJK characters. Body ≤ 40 words / ≤ 80 汉字 per slide; cover ≤ 50 words.
- Contrast: body ≥ 4.5:1, large ≥ 3:1. Use `--accent-text` (darker) for accent-colored text on light backgrounds; bright accents (lime, yellow) only as fills or on dark/photo.
- Images ≥ 1920 px wide for full-bleed; scrim 30–50 % behind text.
- Charts: no gridlines, borders, legends (label directly); one highlighted series; pies 3–5 slices.

## Typography
- Web: Archivo (variable width 62–125 % → condensed or expanded caps), Inter, Playfair Display (Didone numerals/serif statements), JetBrains Mono (labels), Noto Sans SC / Noto Serif SC (Chinese). All support Vietnamese except the Noto CJK families (which cover Chinese).
- PPTX: platform font sets in the kit (Mac: Avenir Next / Didot / Menlo / PingFang SC Light + Hiragino Sans GB; Win: Segoe UI / Bahnschrift / Bodoni MT / Consolas / Microsoft YaHei). Choose by who opens the file.
- Chinese titles: keep the light/bold contrast (Noto Sans SC 200–300 vs 800–900; PingFang Light vs Hiragino bold), letter-spacing .02–.06em on display, no faux italics; put the English keyword as ghost word or kicker for the luxury feel.
- Never: Calibri, default Arial-everything, more than two families (+ mono labels), text shadows, gradient text (except one hero word in `studio`).

## Anti-patterns (instant "template" tells)
Bullet-point walls · topic titles ("市场分析") instead of conclusions · clip-art or mixed icon sets · handshake/business stock photos · every slide the same title+bullets layout · five accent colors · default chart styling · centered everything · drop shadow + border + radius on the same box · decorative shapes with no brand meaning (confetti triangles) · emoji in corporate decks · tiny logos everywhere · text on busy photo areas without scrim.

## QA checklist (run on the rendered images)
- [ ] Every title is a takeaway; one message per slide; rhythm alternates.
- [ ] The signature device appears on every slide; chrome present and aligned.
- [ ] Nothing touches the edges unintentionally; one alignment axis per slide; 40–60 % empty space.
- [ ] Text legible: sizes ≥ minimums, contrast passes, scrims under text on photos, no clipped/overflowing text boxes.
- [ ] Accent ≤ 10 % of surface; at most one highlighted item per group.
- [ ] Images sharp, consistently graded, no distortion; cut-outs clean.
- [ ] Giant numerals/ghost words crop deliberately (not accidentally) and don't collide with copy.
- [ ] Chinese/Vietnamese characters render in the intended font (no fallback faces).
- [ ] PPTX: `validate.py` passes; Morph names (`!!…`) match on consecutive slides. HTML: no console errors, keys work, print/PDF ok.

## References
- `references/case-library.md` — 25 Slidor cases + what to steal from each (Tier 1 = 2023–2025 featured).
- `references/lucile-mennessier.md` — the luxury/beauty restraint layer (L'Oréal, Guerlain, Dom Pérignon, Shiseido…).
- `references/slidor-methodology.md` — Slidor's blog rules, animation grammar, viral patterns, house tokens.
- `references/presets.md` — 10 worlds with tokens, image direction, devices, custom-brand recipe.
- `references/brand-*.md` — per-brand notes (assets, colors, sources) when they exist; read the one matching the client.
- `references/layouts.md` — 24 archetypes with px specs.
- `references/html-engine.md` — deck engine + page template usage, motion, export.
- `references/pptx-kit.md` — kit API, image prep, fonts, renderer caveats, Morph.

## Assets & scripts
| File | Purpose |
|---|---|
| `assets/deck-template.html` | HTML deck engine + 10 presets + 13-slide specimen (P cycles presets) |
| `assets/page-template.html` | responsive scrolling page in the same system |
| `assets/slidor_pptx_kit.js` | pptxgenjs helper kit (same px space and presets) |
| `assets/pptx_example.js` | 9-slide worked PPTX example |
| `scripts/prep_images.py` | crop-to-frame, rounded/arch corners, scrims, interlock split, paper/glow/mesh backgrounds |
| `scripts/html_to_pptx_vector.py` | HTML deck → PPTX with 4K picture layer + vector SVG text layer (sharp at any zoom) |
| `scripts/html_to_pptx.sh` | HTML deck → PPTX of 4K JPEG slides (fallback) |
| `scripts/pptx_finish.py` | Morph/Fade transitions, outline-text and CJK fixes (called by `save()`) |
| `scripts/render_html.sh` / `render_pptx.sh` | PNG per slide + contact sheet for visual QA |
