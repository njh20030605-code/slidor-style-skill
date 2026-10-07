# Visual worlds (presets) and how to build a custom one

A preset is a **brand world**: palette + type pairing + image direction + one signature device.
Slidor never ships a generic template — every deck derives from the client's universe. Presets are
starting points; always re-tune `--accent` (and often the base) to the actual brand.

Token names are identical in HTML (`--bg`, `--accent` …) and the PPTX kit (`bg`, `accent` …).

| Preset | Base / ink / accent | Display type (web · mac · win) | Signature device | Use for |
|---|---|---|---|---|
| **atelier** | cream `#EFE8DF` · espresso `#231B15` · caramel `#A2713F` | Archivo 300/700 caps · Avenir Next UL/Bold · Segoe UI Light/Bold | giant white chapter numerals behind the subject; pill + ring buttons | lifestyle, F&B, skincare rituals, warm premium |
| **lumiere** | white `#FFFFFF` / off-white `#F9F8F6` · ink `#1A1A1A` · gold `#B08D57` (text `#8A6A3A`) | Archivo **125 %** caps 300/600 · Avenir Next UL/Bold · Segoe UI Light/Semibold | "[" ornament, gold dash, text card on photo, inner white frame, pointer lines, circle crops | skincare, beauty, fragrance — Lucile Mennessier's L'Oréal/Guerlain restraint |
| **maison** | ivory paper `#F6F2EC` · ink `#141414` · maison red `#9E1B22` / gold `#B08D57` | Archivo **expanded 118 %** caps tracked .12em + Playfair/Didot numerals | paper grain, product cut-outs, interlock words, crop marks, drop caps | luxury, beauty, fragrance, jewellery (Cartier, Chanel, Lucile) |
| **editorial** | white/black · `#0A0A0A` · yellow `#FFC21A` + violet `#9B8CFF` | Archivo 112 % 800 caps + Playfair numerals | inset rounded full-bleed photos, co-brand header bar, accent word in titles | fashion, luxury groups, trend reports (LVMH×Dior, Lacoste) |
| **stage** | black `#07090C` · `#F3F1EC` · champagne `#D9C38A` (+ mint glow) | Archivo **condensed 72 %** caps, outline+solid | light pools/flares, glass pills, one phrase per slide | keynotes, launches, LED walls (Dom Pérignon, Regnology, Toyota) |
| **sport** | navy `#0F1C4D` / off-white · lime `#D7F20B` | Archivo condensed 75 % 800 caps | outline repeated words, cut-out athletes breaking frames, icon tiles | sport, energy, youth, entertainment (Ligue 1, Puma, Shift) |
| **grid** | light grey `#E8E8E4` / black · lime `#CFEA5B` (+ red `#EE2737`) | JetBrains Mono caps · Menlo · Consolas | visible 1px module grid, [bracket] labels, `date /// venue` meta bar, spine line | tech, fintech, crypto, product specs (Ledger, Hyperloop) |
| **corporate** | pale blue `#F3F6FB` · navy `#0D1B3E` · blue `#1F5BFF` (+ orange) | Inter 400/700 sentence case | white rounded cards with one highlighted card, breadcrumb chips, logo-derived motif | corporate overviews, templates, B2B (Tencent, Air France-KLM, Rakuten) |
| **studio** | black `#000` ramp `#0B0B0B/#151515/#262626` · white · coral `#FF4835` + violet `#3E1DCE` | Inter 200/500 tight (−.035em), JetBrains Mono labels | hairline display type, one coral→violet gradient word, glass, mono buttons | Slidor's own house look (slidor.agency) — creative/agency/pitch |
| **gradient** | white · aubergine `#2A1661` · violet `#8B4DFF` + pink `#FF4F9A` | Inter 400/800 sentence case | mesh gradient panels, 3D characters, chapter nav with faded inactive steps | apps, HR/fintech startups, friendly B2C (Swile) |

Switch live in the HTML template with **P**, or `?preset=maison` in the URL.

---

## Image direction per world
- **atelier** — warm side light, beige/wood/stone surfaces, product in context, shallow depth of field, sepia-leaning grade.
- **lumiere** — macro textures (cream, oil, honey, skin-tone), product cut-outs on #F7F7F7, circle/arch crops, brand-color overlay to unify photos; never busy scenes.
- **studio** — dark UI-like canvases, slide mockups, device renders, light streaks; photos rare and desaturated.
- **maison** — product cut-outs on paper/ivory, macro textures (cream swirl, gem facets), archival B&W for heritage, red/gold as the only saturated colors.
- **editorial** — fashion campaign crops, faces close, surreal/AI-assisted scenes allowed, strong color fields; never small photos.
- **stage** — product glowing in the dark, light beams, prism flares, everything else nearly black.
- **sport** — athletes as cut-outs, high contrast, motion, B&W photo + single neon accent block.
- **grid** — 3D renders of devices, line-art isometric icons, UI screenshots in frames.
- **corporate** — people + product in real use, bright daylight, blue-tinted, logo-derived pixel/shape motif overlapping photo corners.
- **gradient** — 3D characters/objects, phone mockups, soft shadows.

## Signature devices catalogue (pick ONE as the deck's recurring element)
| Device | Origin | How |
|---|---|---|
| Chapter numerals | Nespresso, LVMH | 900–1200px numeral per chapter, morph between openers |
| Chrome bar | almost all | label · brand · page at 44px, micro caps |
| Spine line | Hyperloop | 2px accent vertical line at a fixed x on every slide |
| Tape frame | Lacoste | thin white strips with micro brand text dividing panels |
| Brackets | Ledger | `[LABEL]` corner brackets around labels/logo |
| Crop marks | Cartier, Regnology | L-corners at 40px inset |
| Logo-derived motif | Tencent pixels, Criteo shapes | shapes cut from the logo scattered over photo edges |
| Pill nav | Swile, Tencent | 01–05 chips, current one in accent |
| Glass capsule | Regnology | blurred translucent pill holding a single phrase |

---

## Building a custom brand world (do this whenever the brand is known)
1. **Collect**: logo (vector if possible), 3–6 campaign/product images, packaging shots, brand guideline colors & fonts, the brand's own ads.
2. **Palette**: sample the logo/packaging. Pick base (the brand's paper/packaging neutral, or black/white), ink, one accent = the brand color, one spark (often a metallic or complementary). Check accent-on-base contrast ≥ 3:1 for large text; if it fails, set `--accent-text` to a darker variant for text and keep `--accent` for fills.
3. **Type**: use the brand font if licensed and installed; otherwise match its class (geometric / grotesk / Didone / condensed) from the preset fonts. Keep the mixed-weight title move.
4. **Device**: derive one from the brand (bottle silhouette → arch frame; logo shape → motif; product color → highlight bar).
5. **Write overrides**:
   - HTML: add `.deck[data-preset="brand"]{ --bg:…; --accent:…; … }` by copying the nearest preset block.
   - PPTX: `K.createDeck({ preset:'maison', overrides:{ accent:'C8102E', bg:'F7F3EE' } })`.

### Example — a skincare brand with a celebrity ambassador
- **Brand world**: start from the ambassador campaign (TVC, key visuals) and the hero product lines. A TVC with a strong theme gives the deck its storyline and chapter titles; the product shots give the data slides their calm, clean world.
- **Palette**: sample the brand red/primary from the logo or the TVC end card (deeper than screen red is normal); pick the light ground from the product photography (cool pearl for whitening lines, warm ivory for ritual/lifestyle lines) and the dark ground from the campaign.
- **Type**: Noto Serif SC 300 for Chinese display, Bodoni Moda (optical sizing auto) for numerals, Noto Sans SC 400 body, Inter caps for chrome.
- **Rhythm that works**: cinematic campaign frames for cover / story hook / chapter openers / closing; product world for data slides; brand wordmark on every slide.
- **Faces**: only official retouched key visuals — never video frames of the ambassador.
- Keep brand-specific notes (asset folders, colors, sources) in `references/brand-<name>.md` next to this file.
