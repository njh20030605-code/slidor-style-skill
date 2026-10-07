# PPTX: building Slidor-style decks with pptxgenjs

Use this when the deliverable is an editable .pptx (also read the `pptx` skill's gotchas — they all
still apply). The kit `assets/slidor_pptx_kit.js` designs in the same 1920×1080 px space as the HTML
engine (÷144 → inches, ×0.5 → pt) on `LAYOUT_WIDE` 13.333×7.5in.

## Run
```bash
NODE_PATH=$(npm root -g) node build.js        # pptxgenjs is installed globally
~/.claude/skills/slidor-style/scripts/render_pptx.sh deck.pptx _render   # PNGs + _sheet.jpg
python3 <pptx-skill>/scripts/office/validate.py deck.pptx
```
`assets/pptx_example.js` is a complete 9-slide worked example (cover, agenda, chapter numeral,
interlock, stats on photo cards, 4 cards, native chart, ghost statement, outline closing).

## API (all coordinates/sizes in px)
```js
const K = require(process.env.HOME + '/.claude/skills/slidor-style/assets/slidor_pptx_kit.js');
const d = K.createDeck({ preset:'maison', platform:'mac'|'win', title, overrides:{ accent:'C8102E' } });
const s = d.slide({ bg:'bg'|'alt'|'panel'|'dark'|'accent'|'RRGGBB', image:'bg.jpg' });
s.chrome({ l:'01 — Brand', c:'BRAND', r:'page', brand:true, rule:true, bottom:false, color })
s.title([{t:'Income',w:'lt'},{t:'the scene',w:'b',accent:true},{t:'Outline',outline:true}], {x,y,w,size,inline,align,upper,color})
s.text(str, {x,y,w,h,size,weight:'lt'|'rg'|'md'|'b'|'xb',font:'display'|'sans'|'cond'|'serif'|'mono',track,upper,align,valign,lh,lines,color})
s.kicker(str,{x,y,plain}) · s.pill(str,{x,y,solid|accent|glass,w,h}) · s.ring({x,y})
s.giant('3',{x,y,size,outline,ghost,color,name:'!!num'}) · s.ghost('Word',{x,y,size})
s.photo(file,{x,y,w,h,contain}) · s.overlay(scrimPng,{…})
s.stat('94','%','label',{x,y,size,color,lw}) · s.card({x,y,w,h,image|accent,idx,title,body,stat})
s.bars(labels, values, {x,y,w,h,key}) · s.rect({x,y,w,h,radius,fill,line}) · s.hline/vline · s.marks()
s.notes('speaker notes') · s.soft(0.3) → fg blended toward bg (use instead of text transparency)
await d.save('deck.pptx', { morph:'all'|'2,3,7'|false, fade:'rest', dur:1.2 })
```
`save()` runs `scripts/pptx_finish.py`: Morph/Fade transitions, outline-text fix, CJK `lang` + theme East-Asian font.

## Images — always prep first (`scripts/prep_images.py`)
pptxgenjs has no gradients, no clipping masks and only circular image rounding, so bake effects in:
```bash
P=~/.claude/skills/slidor-style/scripts/prep_images.py
python3 $P cover in.jpg cover.jpg --w 1920 --h 1080 --scrim left:0.7          # full-bleed + legibility scrim
python3 $P cover in.jpg card.png --w 417 --h 670 --radius 14 --scrim bottom:0.8 # rounded photo card
python3 $P cover in.jpg arch.png --w 420 --h 660 --arch                         # arch frame (bottle/window)
python3 $P split arch.png --cut 0.52 --part top arch_front.png                  # interlock top piece
python3 $P cover in.jpg bw.jpg --w 640 --h 1080 --gray --darken 0.35            # triptych column
python3 $P scrim s.png --w 1920 --h 1080 --dir bottom --alpha 0.7               # separate overlay
python3 $P noise paper.jpg --color F6F2EC --amount 8                            # paper grain bg
python3 $P glow stage.jpg --color D9C38A --at 0.7,0.4                           # stage light pool
python3 $P mesh mesh.jpg                                                        # gradient world bg
```
Frame sizes in px = the size you place them at → no distortion, no surprise crops.

## Interlock in PPTX
Stack order: full object image → word (text) → top piece from `split --part top` at the same x/y with
`h = H × cut`. The word's lower half then sits in front of the object and its upper half behind it.

## Morph
- Consecutive slides only. Give the shared object the same `name` starting with `!!` (`giant(...,{name:'!!num'})`, `photo(...,{name:'!!hero'})`).
- Good morph pairs: chapter numeral that moves/scales, product that travels from hero to detail, highlighted card that grows into a full slide, spine line.
- Needs PowerPoint 2019/365 (Mac/Win). Keynote/WPS/older PowerPoint play the Fade fallback.

## Fonts (live text) — platform sets in the kit
| role | mac | win |
|---|---|---|
| sans light / regular / bold / heavy | Avenir Next Ultra Light / Avenir Next / Avenir Next (bold) / Avenir Next Heavy | Segoe UI Light / Segoe UI / Segoe UI (bold) / Segoe UI Black |
| condensed | Avenir Next Condensed (+ Ultra Light / Heavy) | Bahnschrift Condensed family |
| serif numerals | Didot | Bodoni MT |
| mono | Menlo | Consolas |
| Chinese | PingFang SC Light / Hiragino Sans GB (+bold) | Microsoft YaHei Light / Microsoft YaHei |
- Pick `platform` by **who opens the file**: the user presenting from their Mac → `mac`; sent to Windows colleagues/clients → `win`.
- Verified in LibreOffice on this Mac: plain `"PingFang SC"` and `"Songti SC"` do **not** resolve (fallback = a handwriting face) and `"… Thin"` faces fall back too — the kit avoids them.
- If a deck must look identical everywhere and uses a brand/Google font, render only the decorative display words (giant numerals, interlock word) as transparent PNGs (headless Chrome screenshot of an HTML snippet) and keep titles/body as live text.

## Known renderer differences (LibreOffice preview vs PowerPoint)
- Outline-only text shows **solid** in LibreOffice; PowerPoint/Keynote draw the stroke. Trust the XML (`<a:noFill/>` + `<a:ln>`), not the preview.
- Text `transparency` + letter-spacing gets clipped in LibreOffice/WPS → use `s.soft(t)` / `K.mix()` solid colors; keep transparency only for ghost words and numerals.
- Morph is ignored by LibreOffice (renders static slides).

## Editability
- Every element gets an `objectName`; titles are single text boxes with runs (editable in place).
- Charts are native (`bars()`), data editable in PowerPoint.
- If the user needs a re-usable template (master/layouts/placeholders), follow the pptx skill's "structured decks" section and carry the preset tokens into `THEME` — then compose Slidor elements on top of the title-only layout.
