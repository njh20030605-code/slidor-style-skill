# Slidor's own method — blog rules, popularity, house tokens

Distilled from 54 of the 77 articles on slidor.agency/blog (read in full; rest skimmed), their Dribbble
(122 shots, ≈1.62 M views), Behance (6 case boards 2025–26), Vimeo (5 reels) and the slidor.agency CSS.
Paraphrased; where articles contradict each other the stricter option is chosen.

## 1. House philosophy
- **Text first, decoration last.** Order of work: composition → hierarchy → typeface & leading → white space → color → patterns/icons.
- **"Composition is king."** Each slide is composed for its own content *inside* a system; they reject rigid consulting templates where every slide is the same box.
- **One message per slide**, ≈30 s of talk per slide → more, lighter slides.
- **Action titles**: the title states the insight/recommendation; chart titles state the takeaway.
- **White space is structural**: 40–60 % of each slide empty; titles never touch edges.
- Every deck starts from the **color theme** and **margins** (set them first).
- **Minimal master + a library of designed, duplicable slides** beats placeholder-heavy masters.
- **Vector everything** (SVG icons, logos, arrows) from one icon family.
- **Send PDF externally**, keep PPTX for editing/presenting.
- **Motion serves meaning**: fade by default, Morph when slides are built for it, one consistent animation grammar.
- AI speeds up structure but "is not a design tool" — output looks standardised unless a designer composes it. (→ this skill exists to close that gap: compose, don't template.)

## 2. Numbers worth enforcing (converted to the 1920×1080 canvas; 1 pt = 2 px)
| Rule | Value |
|---|---|
| Body minimum — read on screen / projected / event | 14 pt (28 px) / 18 pt (36 px) / 36 pt (72 px) |
| Title minimum — read / projected / event | 18 pt (36 px) / 24 pt (48 px) / 60 pt (120 px) |
| Cover title | 60–80 pt (120–160 px); cover ≤ 50 words, 4–6 elements, Z-reading order |
| Leading | body 1.2–1.3 (1.5 for CJK), display titles 0.8–0.9 |
| Margins | ≈ 1.5 cm → 85–96 px default; 2.5 cm (≈ 140 px) for airy/formal; 0.5 cm only for dense data |
| Line length | never full width; 2/3/6-col grids or 30/70 split; ≤ 60–70 Latin chars / ≤ 35 CJK chars per line |
| White space | 40–60 % empty |
| Color split | 60-30-10 (dominant / secondary / accent); accent on 5–10 % of elements |
| Contrast | ≥ 4.5:1 body, ≥ 3:1 large text; dark slides aim 7:1 (#F5F5F5 heads, #D1D1D1 body on #1A1A1A) |
| Families | 1, or 2 contrasting (serif display + sans body); hierarchy by weight |
| Alignment | left by default; center only short/symmetric content; never justify |
| Text over photo | 30–50 % black or brand overlay (scrim) |
| Images | ≥ 1920 px wide, one consistent treatment, no cliché stock |
| Pie | 2D, 3–5 slices (≤ 7), fold < 5 % into "Other", labels inside for > 15 % |
| Charts | strip gridlines/borders/redundant labels; one series in accent, rest grey; round numbers |
| Master | 3–5 layouts + 10–15-slide library; page number on every layout |
| Fonts to avoid | Calibri (the "default PowerPoint" tell). Prefer Inter, Manrope, DM Sans, Poppins, Figtree; system fallback Segoe UI (Win) / Helvetica Neue (Mac) |

## 3. Animation grammar (pick 3–4 effects per project, define once)
- Titles: appear/fade-up 0.5 s · lists: wipe from left 0.3 s, auto-sequence · images: zoom/fade 0.5 s · charts: by series 0.5 s per element.
- Transitions: **Fade 0.5 s** default; **Morph 0.7–1 s** when consecutive slides are designed as before/after (duplicate slide → move/resize/recolor → apply Morph).
- Entrances ease-out ("smooth end"), exits ease-in; curved motion paths over linear.
- ≤ 2–3 animated elements per slide; never 3D swivel/cube/bounce.
- Board/finance decks: minimal or no motion. Events: bigger, slower motion (subtle fades vanish at distance) + a no-animation backup file.
- Morph becomes a fade in Google Slides/Keynote — keep the deck readable without it.

## 4. What made their work go viral (Dribbble ranking)
Top by likes: free "Selfone" template (120 likes · 112k views), Showcase 2019 reel (105), Microsoft Experiences 2017 (91), PlayPlay (82), Hack40 (74), Accor transition (73 · 58k views), LFP 2020 (68 · 39k), Qatar 2022 (68), Alsid (65), Lacoste 2018 Morph intro (65).
Patterns behind the hits:
1. **One move per shot** — a 4–25 s loop of a single reveal: a Morph between two slides, a panel wipe, a line drawing turning into a photo, a logo build.
2. **"100 % made with PowerPoint"** — native-tool craft is the hook.
3. **Freebies** (templates) get 2–3× the views of client work.
4. **Brand halo** (Microsoft, Accor, PSG/Ligue 1, FIFA, Cartier, Lacoste).
5. Packaging: slide as a shadowed card floating over a blurred enlarged copy of itself (4:3 canvas), or a −15° tilted wall of slides.

Recent (2025–26) projects add: website-style nav bars and right-hand rails inside slides, accordion/carousel Morphs (active panel widens and turns from B&W to color), tangram/pixel masks from the brand, cream inset frames + copper bloom for watchmaking (Patek Philippe), morphing year numerals on a color band (Printemps), embossed gold serif on navy (Hilton).

## 5. slidor.agency house tokens (→ preset `studio`)
- Canvas pure black with a dark ramp `#000 / #0B0B0B / #151515 / #262626`; light sections `#F8F9FA / #EEEEEE / #E0E0E0`.
- Accents: hot coral `#FF4835`, deep violet `#3E1DCE`; coral→violet gradient only on one hero word.
- Type: NN Nouvelle Grotesk variable at **hairline weights** (wght ≈ 90–115), tight tracking (−1 % to −3 %), display leading 85–95 %, secondary text = white at 70 % / 50 % opacity; Geist Mono uppercase for buttons/labels. (Web substitutes: Inter 200–300 + JetBrains Mono.)
- Radii 5 px (tags, slide thumbnails) / 10 px; soft shadows `4px 4px 18px rgba(0,0,0,.07)`; glass `backdrop-filter: blur(45px)`.
- Motion: expo-out ≈ 1.2 s for big moves (Lenis smooth scroll), 0.2 s hovers, **bottom-up color wipe** on buttons, endless marquee of client logos, a diagonal wall of slide thumbnails drifting.
- Per-service two-stop gradients to color-code topics (e.g. sales `#9D4EE5→#3F55DD`, templates `#55B8D6→#47E48F`, pitch `#CA86FF→#FF6580`, finance `#6DF0FF→#00A1E2`, event `#E94231→#F1CC00`).
