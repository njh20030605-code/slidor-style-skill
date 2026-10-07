# Layout archetypes (24)

All coordinates are on the 1920×1080 canvas (HTML px = kit px). Margins `M = 96`. Chrome top at y=44, bottom at y=1040.
"HTML" = classes in `assets/deck-template.html`; "Kit" = calls in `assets/slidor_pptx_kit.js`.
Rhythm tag: **B** breath · **I** info · **D** data · **T** transition. Never put more than two I/D slides in a row without a B or T.

---

## Openers & transitions

### 1. Cinematic cover — B (Nespresso, Toyota, Hyperloop)
Full-bleed photo, scrim on the text side, mixed-weight title at x=M, y≈330–380, title 110–140px, one-line lead under it, pill + ring CTA, chrome top and bottom.
- HTML: `.ph--full.scrim-l` + `.t-display>.lt+b` + `.pill.pill--glass` + `.ring`
- Kit: `d.slide({image})` (photo pre-baked with `prep cover --scrim left:0.7`) + `title([{w:'lt'},{w:'b'}])` + `pill({glass})` + `ring()`
- Variant (Nespresso): giant chapter numeral 900–1100px in white behind/right of the subject.

### 2. Product-hero cover — B (Hyperloop, Ariane, Dom Pérignon)
Flat brand-color or black field; product cut-out entering from an edge (pod from the top, rocket on the right in a white rounded panel); title stack left. Logo small, bottom-left.

### 3. Chapter opener with cropped giant numeral — T (Nespresso 1/3/4/5, LVMH "08", Asmodee "01")
Numeral 900–1200px, `line-height .74`, bleeding off the top/right edge; serif (Didone) for luxury, heavy grotesk for lifestyle, outline for stage. Title 100–120px left; a pill "Chapter 0N". Give the numeral the same morph name on consecutive openers so it slides/scales between chapters.
- HTML: `.giant[data-morph="chapter-num"]` · Kit: `giant('3',{name:'!!num'})`

### 4. Statement + ghost word — T (Shift "CONCEPT", Ariane echoes, LFP "TOURISM")
A 380–460px word at 5–8 % opacity (or outline at ~20 %) behind a serif or light statement (72–90px). The ghost word is the English keyword of the chapter even in a Chinese deck.
- HTML: `.ghost` or `.echo` (repeated outline lines) · Kit: `ghost('Restraint')`

### 5. Outline + solid title — T/B (Dom Pérignon "THE BEGINNING / OF A NEW CHAPTER", Puma "CORE / APPAREL")
First line stroke-only (2px), second line solid bold, condensed caps, centered on black with a light pool or prismatic flare.
- HTML: `<h2 class="t-display"><i class="lt">…</i><b>…</b></h2>` · Kit: `title([{t,outline:true},{t,w:'b'}])`

### 6. Interlock word — B (Chanel PEARLS / STYLE / 1921 / BIGGER, Nespresso numeral behind the cup)
One 300–360px word, product/hand/portrait passing *through* it: upper part of the letters behind the object, lower part in front (or vice-versa). Pale background, nothing else but a micro kicker above and one caption line below.
- HTML: `.interlock` (word, object, `.interlock__front` clipped at `--cut`)
- Kit: full image → word → `prep split --part top --cut 0.5` piece on top at the same x/y.
- Needs a cut-out PNG (product) or an arch/rounded portrait crop.

### 7. Triptych keywords — T (Dom Pérignon ELEVATION / ASPIRATION / EMOTION, Lacoste triptychs)
Three full-height photo columns (grayscale + dark), one keyword per column at y≈900, optional centered overlay title.
- HTML: `.tri` · Kit: three `photo()` + `text()`.

### 8. Agenda with active chapter — I/T (Nespresso "TODAY'S INITIATED", Swile 01–04 nav, Tencent breadcrumb)
Left 45 %: title + numbered rows (number · title · time/page) separated by hairlines; right 46 % photo full-height. Re-use as a section divider with the current row in accent and the rest at 40 % opacity.
- HTML: `.agenda li.is-on` · Kit: loop of `hline` + `text`.

---

## Information

### 9. Four portrait photo cards — I (Nespresso "Why is it speaking?", LVMH Running Beauty, Toyota)
3–5 cards in a row, h≈620–700, radius = preset radius, scrim bottom, index top-left, title + 1-line text bottom-left. Optional: one card is a solid accent card carrying a number instead of a photo.
- HTML: `.cards[--n:4]>.card.card--photo` / `.card--accent` · Kit: `card({image|accent, idx, title, body, stat})`

### 10. Split editorial — I (Cartier "Stones are the tallied point", Nespresso "Home responsive")
Left 50 %: kicker, title with an accent phrase, two short text columns, optional drop cap; right 50 % full-height photo or product on texture.
- Luxury variant: product cut-out on paper texture, red serif statement with highlighted words.

### 11. Photo + side spec list — I (Toyota Lexus, Air France A220, Hyperloop "How it works")
Hero product photo; 3–5 specs on the right separated by a thin vertical rule, or callouts with 1px leader lines pointing at product parts.

### 12. Logo / partner wall — I (Rakuten partners, Air France brands)
White rounded tiles (radius 12–16, soft shadow 0 10 30 rgba(0,0,0,.06)), logos centered at 50 % tile width, grid that bleeds off the right edge to suggest "more".

### 13. Swiss modules — I/D (Ledger, Shift timeline, Rules slide)
Visible 1px grid of modules (2×3 or 3×2), one accent module, one dark module, mono micro labels "Rule 01", big numbers bottom-left inside modules.
- HTML: `.modules>.module(--accent|--dark|--panel)` · Kit: `rect` grid + `text`.

### 14. Process / timeline — I (Hyperloop spine, Shift timeline, Criteo journey)
A single horizontal or vertical rule with nodes; labels alternate above/below; the current step in accent; one continuous accent line (the "spine") that persists across slides at the same x.

### 15. Before / after or two-column compare — I (Cartier "Out / Book case", Swile two offers)
Two panels; left muted, right highlighted (accent border or fill); identical internal structure so the eye compares rows.

### 16. Quote / testimonial — B (Cartier red serif statement)
Serif 64–90px, 2–3 lines, key words in accent (italic serif or colored), attribution micro caps below. Paper texture or flat alt background.

### 17. Map — I/D (Hyperloop global, LFP French clubs, Regnology dotted world)
Dotted or flat mono map (one tone darker than background); 4–10 pins with leader lines to micro labels; flags only as 16px chips.

### 18. Mockup / screen — I (Rakuten, Ledger, Swile, USC)
Device mockups (phone/laptop) on a flat color or gradient field, slightly overlapping a rounded color panel; 3-step explanation beside it.

---

## Data

### 19. Hero KPI — D (Rakuten "8/10", Chanel "#1", Ariane "98 launches")
One number 260–440px in accent or ink, a one-sentence label under it, optionally a ring/arc diagram on the right. Nothing else.
- HTML: `.stat__v` with `--fs:300–440px` · Kit: `stat(v, unit, label, {size:300})`

### 20. Stats on photo cards — D (LVMH 94 % / 20 %, LFP 99 %)
2–3 tall photo cards (inset rounded frame), each with a big number (150–180px) + 2-line label bottom-left and a glass pill tag top-left.

### 21. One-key-bar chart — D (Air France fleet, Cartier stacked boxes, Shift waterfall)
Column/bar chart, no gridlines/axis/legend/border, value labels on bars, all bars `--fill-mute` except the key one in accent. Title states the takeaway; a big delta stat on the left.
- HTML: `.bars>.bar(.is-key)` · Kit: `bars(labels, values, {key})` (native chart).
- Luxury variant: product-as-chart (Cartier stacked gift boxes) — use product cut-outs as bar ends.

### 22. Stat row / KPI band — D (Tencent 15/20/57 %, Hyperloop 28–50 / 160,000+)
3–4 equal cards, one highlighted (accent fill), number 96–120px italic or bold, label 18–20px, short text.

### 23. Minimal table — D (Nespresso brand table, USC pricing)
Micro-caps header, hairline rows, numbers right-aligned in display font, the key row in accent, delta chips (+12 %) in green/red small caps. Max 7 rows × 5 cols per slide.
- HTML: `.tbl` (`tr.is-key`, `td.num`)

---

## Closing

### 24. Thank-you / contact — B (Dom Pérignon, Lacoste)
Outline + solid "THANK / YOU" or a single serif word; giant outline numeral (the slide count) fading in a corner; brand mark centered in the top chrome; contact micro line.

---

## Composition rules that apply to every archetype
- **Alignment**: everything hangs off x=M or the center axis; never invent a third alignment line on one slide.
- **Thirds**: titles start at y≈ 1/3 (330–380) on breath slides, at y≈150–200 on info slides.
- **Whitespace**: content occupies ≤ 60 % of the canvas on B/T slides, ≤ 80 % on I/D slides.
- **Depth**: at least one layering effect per 3 slides (interlock, numeral behind subject, card overlapping a photo, cut-out breaking a frame).
- **Continuity**: one recurring device across the deck (chrome bar, spine line, chapter numerals, tape frame, bracket labels) — this is what makes 40 slides read as one object.
