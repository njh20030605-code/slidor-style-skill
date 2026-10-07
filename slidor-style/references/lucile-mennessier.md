# Lucile Mennessier — the luxury/beauty restraint layer (→ preset `lumiere`)

French freelance presentation designer (LISAA 2008, freelance since 2009/10, Rennes), PowerPoint &
Keynote, mostly **editable master templates** for luxury houses. Source: 13 project pages (EN+FR), her
2023 and 2025 portfolio books, blog before/after GIFs, her site CSS (Oct 2026). All her published slides
are anonymised (lorem / "XX"). Hex values sampled from images (±5).

Clients on site: **L'Oréal** (Skin Summit, 51 animated slides), **Guerlain** (Abeille Royale, 53 slides, custom animation), **Shiseido** (2×80), **Serge Lutens** (60+120), **Dom Pérignon** (80-slide template), **Cartier** (~45), Eric Bompard, Vintega, Conjecto, Détectio, Crazy Horse, France Galop, WhistlePig. In the books: Tiffany, Clé de Peau, Rubel & Ménasché, Ardbeg, Galoupet, French Bloom, Phytomer…

## How she differs from Slidor (use both, knowingly)
| | Slidor (agency) | Lucile (luxury freelance) |
|---|---|---|
| Source of the look | own concept per project, trend-aware | the client's brand book, executed with restraint |
| Color | base + saturated accent, gradients allowed | neutral ground; color comes **from photography** |
| Graphics | 3D, cut-outs, giant type, motion design | photos + hairlines + one tiny ornament |
| Data | infographic-rich | one key figure per slide |
| Motion | showy Morph sequences | simple fades/wipes timed to the speech |
| Density | composed, often full | ≈ 65–72 % empty |
| Deliverable | finished show deck | editable masters + layout families |

**Rule of thumb**: beauty / skincare / fragrance / jewellery / spirits → start from Lucile's restraint
(`lumiere` or `maison`) and add *one* Slidor move per chapter (interlock word, giant numeral, morph).
Keynotes, launches, sport, tech → Slidor first.

## Her 12 signature moves
1. **One idea per slide**, text block fixed in one spot (≈ 6 % margins), 65–72 % empty.
2. **Split pages** (50/50 or 40/60) as the default; photos bleed off the outer edges.
3. **Contrast inside the headline**: bold line vs light caps (L'Oréal), Didone serif vs thin sans in the same line (Guerlain), roman vs italic (Rubel & Ménasché).
4. **One tiny ornament repeated on every slide**: "[" before titles (L'Oréal), short gold dash (Guerlain), ◆ on a vertical hairline (Serge Lutens), red tabs (Shiseido), ◆◆◆ divider (France Galop), "— 18 —" page numbers (WhistlePig).
5. **Hairlines only** (0.5–0.75 pt): column dividers, caption lines, pointer lines that end in a small open circle.
6. **Color from texture close-ups** — cream swirl, oil drop, honeycomb, skin-tone rings, knit — on white/off-white/charcoal/black grounds.
7. **Text on photos only inside a solid card**, often centered on a two-photo split, with a **thin white frame inset** in the photo.
8. **Brand-shaped crops**: circles (L'Oréal, Vintega), diamonds (France Galop), diagonal cuts (Serge Lutens), arches, hard blocks (Shiseido).
9. **One-color overlay** to unify mismatched photos (brand color at 60–80 %).
10. **Numbers as typography**: one big figure with the unit/currency lighter (`€XXM` with a pale €), "01"/"#1" overlapping the corner of its photo.
11. **Constant footer**: wordmark · deck title in small spaced caps · page number (≤ 8 pt).
12. **Master families**: title, section, agenda, 1–4 images, key figure, quote, phone row, thank-you.

## Beauty decks specifically (L'Oréal, Guerlain, Shiseido, Serge Lutens, Clé de Peau)
- Pure white or near-white (#FFFFFF / #F9F8F6), the cleanest and most empty of all her work.
- Macro textures and product cut-outs with **pointer lines to ingredient labels** (thin line → open circle).
- All-caps wide grotesk (Gotham/Halvar-like) with weight contrast; or Didone + thin sans for the heritage houses.
- Animated event decks — builds paced to the speaker, nothing flashy.

## 15 rules (apply in `lumiere`, and to any beauty brief)
1. Start from the brand book: its typeface, one primary + one accent, one device taken from the brand.
2. Neutral grounds (#FFFFFF–#F9F8F6, charcoal #1B1D1A, black); let photos carry the color.
3. ≈ two-thirds empty; text block fixed at ≈ 6 % margins.
4. Split layouts by default; photos run off the outer edges.
5. Headlines = 2–3 short caps lines with contrast inside; never bold whole paragraphs.
6. Small caps tracked wide (+150 to +300 ≈ .15–.3em); large caps at normal tracking.
7. One tiny ornament, repeated on every slide.
8. All structure in 0.5–0.75 pt lines; pointer lines end in a ~4–5 pt open circle.
9. Crop photos to texture and detail; products as cut-outs on #F7F7F7 tiles with ~1 % gaps.
10. Text on photos only via a solid card (optionally centered on a two-photo split with a white inner frame).
11. Unify section/cover photos with a one-color brand overlay.
12. Key-figure slide = one number, unit lighter, one-line label, footnote; charts minimal (thin bars, tinted rings, grey dot map).
13. Numbers overlap the corner of their photo.
14. Constant footer: wordmark, title in small caps, page number, ≤ 8 pt (16 px).
15. Build master layout families; animate only with fades/wipes timed to speech.

## Her own brand (useful as a palette reference)
Halvar Breitschrift (wide grotesk; Regular mixed with Thin in one headline) + Halyard Display; champagne gold `#C8AD7F`, light gold `#DED3B7`, navy `#152845` / `#0B1A33`, off-white `#F9F8F6`; square-cornered 1 px gold outline buttons tracked 1.8 px. Web substitutes: Archivo at 125 % width (200/300 vs 600) + Inter.

## Implementation in this skill
- HTML: `data-preset="lumiere"` · `.brk` (bracket ornament) · `.dash` · `.textcard` · `.frame-in` · `.pointer` · `.wide-caps` · `.ph--circle` · `.unit-light`.
- PPTX kit: `preset:'lumiere'` · `title(…, {bracket:true})` · `dash()` · `frame()` · `pointer()` · `textcard()`.
- Gold on white fails contrast as text — `--accent-text: #8A6A3A` for text, `#B08D57` only for dashes/fills.
