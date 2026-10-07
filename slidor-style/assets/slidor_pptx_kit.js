/* Slidor-style helper kit for pptxgenjs.
 * Design in the SAME 1920×1080 px space as the HTML engine; the kit converts px → inches (÷144)
 * and px font sizes → pt (×0.5). Canvas = LAYOUT_WIDE 13.333×7.5in.
 *
 *   const K = require(process.env.HOME + '/.claude/skills/slidor-style/assets/slidor_pptx_kit.js');
 *   const d = K.createDeck({ preset:'maison', platform:'mac', title:'Q4 Brand Review' });
 *   const s = d.slide({ bg:'bg' });
 *   s.chrome({ l:'01 — Brand', c:'BRAND', r:'page' });
 *   s.title([{t:'Income',w:'lt'},{t:'the scene',w:'b'}], { x:96, y:320, w:1100, size:130 });
 *   await d.save('out.pptx', { morph:'all' });   // writes, then adds Morph transitions
 *
 * Run with: NODE_PATH=$(npm root -g) node build.js
 * Images: pre-crop with scripts/prep_images.py (cover/scrim/split) — pptxgenjs has no gradients,
 * no clipping and only circular image rounding.
 */
const { execFileSync, execSync } = require('child_process');
let PptxGenJS;   // resolve pptxgenjs from local node_modules, NODE_PATH, or the global npm root
try { PptxGenJS = require('pptxgenjs'); }
catch { PptxGenJS = require(require('path').join(execSync('npm root -g').toString().trim(), 'pptxgenjs')); }
const path = require('path');

const IN = v => v / 144;          // px → inch
const PT = v => v * 0.5;          // px → pt
const CJK = /[⺀-鿿豈-﫿＀-￯]/;
/** blend two hex colors: t=0 → a, t=1 → b. Use instead of text transparency (LibreOffice/WPS clip tracked transparent text) */
const mix = (a, b, t) => [0, 2, 4].map(k => Math.round(parseInt(a.substr(k, 2), 16) * (1 - t) + parseInt(b.substr(k, 2), 16) * t).toString(16).padStart(2, '0')).join('').toUpperCase();

/* ---------- fonts per platform (all verified to resolve; avoid "Thin", "Songti SC") ---------- */
const FONTSETS = {
  mac: {
    sans: { lt: 'Avenir Next Ultra Light', rg: 'Avenir Next', md: 'Avenir Next Medium', b: 'Avenir Next', bBold: true, xb: 'Avenir Next Heavy' },
    cond: { lt: 'Avenir Next Condensed Ultra Light', rg: 'Avenir Next Condensed', md: 'Avenir Next Condensed Medium', b: 'Avenir Next Condensed', bBold: true, xb: 'Avenir Next Condensed Heavy' },
    serif: { lt: 'Didot', rg: 'Didot', md: 'Didot', b: 'Didot', bBold: true, xb: 'Didot' },
    mono: { lt: 'Menlo', rg: 'Menlo', md: 'Menlo', b: 'Menlo', bBold: true, xb: 'Menlo' },
    cjk: { lt: 'PingFang SC Light', rg: 'Hiragino Sans GB', md: 'Hiragino Sans GB', b: 'Hiragino Sans GB', bBold: true, xb: 'Hiragino Sans GB' },   // plain "PingFang SC" is not resolved by LibreOffice/WPS
  },
  win: {
    sans: { lt: 'Segoe UI Light', rg: 'Segoe UI', md: 'Segoe UI Semibold', b: 'Segoe UI', bBold: true, xb: 'Segoe UI Black' },
    cond: { lt: 'Bahnschrift Light Condensed', rg: 'Bahnschrift Condensed', md: 'Bahnschrift SemiBold Condensed', b: 'Bahnschrift Condensed', bBold: true, xb: 'Bahnschrift Bold Condensed' },
    serif: { lt: 'Bodoni MT', rg: 'Bodoni MT', md: 'Bodoni MT', b: 'Bodoni MT', bBold: true, xb: 'Bodoni MT Black' },
    mono: { lt: 'Consolas', rg: 'Consolas', md: 'Consolas', b: 'Consolas', bBold: true, xb: 'Consolas' },
    cjk: { lt: 'Microsoft YaHei Light', rg: 'Microsoft YaHei', md: 'Microsoft YaHei', b: 'Microsoft YaHei', bBold: true, xb: 'Microsoft YaHei' },
  },
};

/* ---------- presets: same worlds as the HTML engine (hex, no #) ---------- */
const PRESETS = {
  atelier:   { bg: 'EFE8DF', alt: 'E5D9CB', panel: 'F7F2EC', dark: '211913', onDark: 'F7F1EA', ink: '231B15', muted: '6B5B4E', line: 'CDBFAF', mute: 'D6C8B8', accent: 'A2713F', accent2: '3B2A20', onAccent: 'FFF8F0', accentText: '83582F', display: 'sans', num: 'sans', numW: 'xb', numColor: 'FBF8F4', upper: true, track: 0.01, radius: 14 },
  maison:    { bg: 'F6F2EC', alt: 'ECE5DA', panel: 'FFFFFF', dark: '141414', onDark: 'F6F2EC', ink: '141414', muted: '6E675F', line: 'D2CBC1', mute: 'DCD5CB', accent: '9E1B22', accent2: 'B08D57', onAccent: 'FFFFFF', display: 'sans', num: 'serif', numW: 'rg', numColor: 'FFFFFF', upper: true, track: 0.14, radius: 4 },
  editorial: { bg: 'FFFFFF', alt: 'F1F1F1', panel: 'F4F4F4', dark: '0A0A0A', onDark: 'FFFFFF', ink: '0A0A0A', muted: '5F5F5F', line: 'D8D8D8', mute: 'D9D9D9', accent: 'FFC21A', accent2: '9B8CFF', onAccent: '0A0A0A', accentText: '5B4BD8', display: 'sans', num: 'serif', numW: 'rg', numColor: 'FFFFFF', upper: true, track: 0, radius: 18 },
  stage:     { bg: '07090C', alt: '10151B', panel: '121820', dark: '07090C', onDark: 'F3F1EC', ink: 'F3F1EC', muted: '8E969E', line: '2C333B', mute: '2A323B', accent: 'D9C38A', accent2: '3DE59B', onAccent: '07090C', display: 'cond', num: 'cond', numW: 'xb', numColor: 'F3F1EC', upper: true, track: 0.01, radius: 14 },
  sport:     { bg: 'F1F1EE', alt: 'E4E4DF', panel: 'FFFFFF', dark: '0F1C4D', onDark: 'FFFFFF', ink: '0F1C4D', muted: '5B6488', line: 'C9CCD8', mute: 'C9CCD8', accent: 'D7F20B', accent2: '2E6BFF', onAccent: '0F1C4D', accentText: '1F55D6', display: 'cond', num: 'cond', numW: 'xb', numColor: 'D7F20B', upper: true, track: 0, radius: 10 },
  grid:      { bg: 'E8E8E4', alt: 'DCDCD6', panel: 'FAFAF8', dark: '0C0C0C', onDark: 'F4F4F0', ink: '0C0C0C', muted: '5E5E58', line: 'B5B5AE', mute: 'C8C8C0', accent: 'CFEA5B', accent2: 'EE2737', onAccent: '0C0C0C', accentText: '0C0C0C', display: 'mono', num: 'sans', numW: 'lt', numColor: '0C0C0C', upper: true, track: 0.02, radius: 0 },
  corporate: { bg: 'F3F6FB', alt: 'E7EDF8', panel: 'FFFFFF', dark: '0B2FA8', onDark: 'FFFFFF', ink: '0D1B3E', muted: '5B6782', line: 'D5DCEA', mute: 'CDD6E8', accent: '1F5BFF', accent2: 'FF7A1A', onAccent: 'FFFFFF', display: 'sans', num: 'sans', numW: 'b', numColor: 'FFFFFF', upper: false, track: -0.01, radius: 18 },
  lumiere:   { bg: 'FFFFFF', alt: 'F9F8F6', panel: 'FFFFFF', dark: '1B1D1A', onDark: 'F9F8F6', ink: '1A1A1A', muted: '6B6B6B', line: 'DAD7D0', mute: 'E4E1DA', accent: 'B08D57', accent2: '152845', onAccent: 'FFFFFF', accentText: '8A6A3A', display: 'sans', num: 'sans', numW: 'lt', numColor: 'FFFFFF', upper: true, track: 0.08, radius: 0 },
  studio:    { bg: '000000', alt: '0B0B0B', panel: '151515', dark: '000000', onDark: 'FFFFFF', ink: 'FFFFFF', muted: 'A6A6A6', line: '2E2E2E', mute: '262626', accent: 'FF4835', accent2: '3E1DCE', onAccent: 'FFFFFF', display: 'sans', num: 'sans', numW: 'lt', numColor: 'FFFFFF', upper: false, track: -0.03, radius: 10 },
  gradient:  { bg: 'FFFFFF', alt: 'F6F1FF', panel: 'FFFFFF', dark: '2A1661', onDark: 'FFFFFF', ink: '2A1661', muted: '6F6390', line: 'E2DAF5', mute: 'E2DAF5', accent: '8B4DFF', accent2: 'FF4F9A', onAccent: 'FFFFFF', display: 'sans', num: 'sans', numW: 'xb', numColor: 'FFFFFF', upper: false, track: -0.02, radius: 24 },
};

function createDeck({ preset = 'atelier', platform = 'mac', title = 'Deck', author = '', overrides = {} } = {}) {
  const T = { ...PRESETS[preset], ...overrides };
  const F = FONTSETS[platform];
  const pres = new PptxGenJS();
  pres.layout = 'LAYOUT_WIDE';
  pres.title = title; if (author) pres.author = author;
  pres.theme = { headFontFace: F[T.display].rg, bodyFontFace: F.sans.rg };
  const slides = [];

  const col = c => (c && PRESETS[preset][c] !== undefined ? T[c] : (T[c] || c));   // token or hex
  function face(family, w, text) {
    const fam = (text && CJK.test(text)) ? 'cjk' : family;
    const set = F[fam];
    const r = { fontFace: set[w] || set.rg, bold: (w === 'b' && set.bBold) || (w === 'xb' && fam === 'cjk') };
    if (fam === 'cjk') r.lang = 'zh-CN';
    return r;
  }

  function slide({ bg = 'bg', image = null, section } = {}) {
    const s = pres.addSlide(section ? { sectionTitle: section } : undefined);
    const idx = slides.length + 1;
    const dark = ['dark', 'stage'].includes(bg) || (['bg', 'alt', 'panel'].includes(bg) && ['stage', 'studio'].includes(preset));
    const fg = dark ? T.onDark : (bg === 'accent' ? T.onAccent : T.ink);
    const acc = (dark || image) ? T.accent : (T.accentText || T.accent);   // text-safe accent
    const bgHex = image ? (dark ? '000000' : '000000') : (bg === 'alt' ? T.alt : bg === 'panel' ? T.panel : col(bg));
    const soft = (t, c = fg) => mix(c, bgHex, t);                            // fg softened toward the background
    s.background = image ? { path: image } : { color: bg === 'alt' ? T.alt : bg === 'panel' ? T.panel : col(bg) };
    let n = 0; const nm = p => `${p}-${idx}-${++n}`;
    const api = {
      raw: s, index: idx, fg, dark, acc, soft, bgHex,
      /** generic text. weight: lt|rg|md|b|xb · font: display|sans|cond|serif|mono · track in em */
      text(str, o = {}) {
        const sizePx = o.size || 28, w = o.weight || 'rg', fam = o.font === 'display' ? T.display : (o.font || 'sans');
        const f = face(fam, w, str);
        const upper = o.upper ?? false;
        const opts = {
          x: IN(o.x || 0), y: IN(o.y || 0), w: IN(o.w || 800), h: IN(o.h || sizePx * (o.lines || 1) * (o.lh || 1.25) + 4),
          fontSize: PT(sizePx), color: col(o.color || fg), ...f, isTextBox: true, margin: 0,
          align: o.align || 'left', valign: o.valign || 'top', charSpacing: PT(sizePx) * (o.track ?? 0),
          lineSpacingMultiple: o.lh || 1.25, objectName: o.name || nm('text'), fit: 'none', wrap: o.wrap ?? true,
        };
        if (o.transparency) opts.transparency = o.transparency;
        if (o.outline) { opts.outline = { size: o.outline, color: col(o.color || fg) }; opts.transparency = 100; }
        if (o.glow) opts.glow = { size: o.glow, opacity: 0.35, color: col(o.glowColor || 'accent') };
        s.addText(upper ? str.toUpperCase() : str, opts);
        return api;
      },
      /** mixed-weight title: parts = [{t, w:'lt'|'b'|'xb', accent?, outline?}] one line each (or inline:true) */
      title(parts, o = {}) {
        const sizePx = o.size || 120, upper = o.upper ?? T.upper, lh = o.lh || 0.95;
        const runs = parts.map((p, i) => {
          const f = face(o.font || T.display, p.w || 'b', p.t);
          const ro = { ...f, fontSize: PT(p.size || sizePx), color: p.accent ? acc : col(p.color || o.color || fg),
            charSpacing: PT(p.size || sizePx) * (o.track ?? T.track), breakLine: !o.inline && i < parts.length - 1 };
          if (p.outline) { ro.outline = { size: p.outline === true ? 1.5 : p.outline, color: col(p.color || o.color || fg) }; ro.transparency = 100; }
          return { text: (upper ? p.t.toUpperCase() : p.t) + (o.inline && i < parts.length - 1 ? ' ' : ''), options: ro };
        });
        if (o.bracket) runs.unshift({ text: '[', options: { ...face(o.font || T.display, 'lt', '['), fontSize: PT(sizePx), color: acc, charSpacing: 0 } });
        const lines = o.inline ? 1 : parts.length;
        s.addText(runs, { x: IN(o.x || 96), y: IN(o.y || 300), w: IN(o.w || 1200), h: IN(o.h || sizePx * lh * lines * (o.wrapLines || 1) + 8),
          isTextBox: true, margin: 0, valign: o.valign || 'top', align: o.align || 'left', lineSpacingMultiple: lh, objectName: o.name || nm('title'), fit: 'none' });
        return api;
      },
      kicker(str, o = {}) {
        const x = o.x || 96, y = o.y || 200, c = o.color ? col(o.color) : acc;
        if (!o.plain) s.addShape(pres.shapes.LINE, { x: IN(x), y: IN(y + 10), w: IN(28), h: 0, line: { color: c, width: 1.25 }, objectName: nm('kline') });
        return api.text(str, { x: o.plain ? x : x + 42, y, w: o.w || 900, size: 15, weight: 'md', track: 0.18, upper: true, color: c, h: 24 });
      },
      /** editorial frame: section label · brand · page. r:'page' prints the slide number */
      chrome(o = {}) {
        const y = o.bottom ? 1080 - 40 - 16 : 44, c = col(o.color || fg), m = o.m || 96;
        const val = v => (v === 'page' ? String(idx).padStart(2, '0') : v);
        const base = { size: 14, weight: 'md', track: 0.16, upper: true, color: image ? c : mix(c, bgHex, 0.22), h: 20 };   // keep wrap on: LibreOffice clips tracked text in wrap=none boxes
        if (o.l) api.text(val(o.l), { ...base, x: m, y, w: 700, name: o.bottom ? undefined : `!!chrome-l` });
        if (o.c) api.text(val(o.c), { ...base, x: 960 - 400, y, w: 800, align: 'center', weight: o.brand ? 'b' : 'md', track: o.brand ? 0.2 : 0.16 });
        if (o.r) api.text(val(o.r), { ...base, x: 1920 - m - 400, y, w: 400, align: 'right' });
        if (o.rule) s.addShape(pres.shapes.LINE, { x: IN(m), y: IN(o.bottom ? y - 18 : y + 34), w: IN(1920 - 2 * m), h: 0, line: { color: c, width: 0.75, transparency: 78 }, objectName: nm('rule') });
        return api;
      },
      photo(file, o = {}) {
        s.addImage({ path: file, x: IN(o.x || 0), y: IN(o.y || 0), w: IN(o.w || 1920), h: IN(o.h || 1080),
          sizing: o.contain ? undefined : { type: 'cover', w: IN(o.w || 1920), h: IN(o.h || 1080) },
          transparency: o.transparency, objectName: o.name || nm('photo'), altText: o.alt || '' });
        return api;
      },
      /** scrim overlay PNG made by prep_images.py scrim */
      overlay(file, o = {}) { return api.photo(file, { ...o, contain: true, name: o.name || nm('scrim') }); },
      /** giant numeral / word — set name:'!!num' on consecutive slides to morph it */
      giant(str, o = {}) {
        const sizePx = o.size || 980, fam = o.font || T.num;
        const f = face(fam, o.weight || T.numW, str);
        const opts = { x: IN(o.x ?? 1100), y: IN(o.y ?? -40), w: IN(o.w || sizePx * 0.75 * String(str).length + 40), h: IN(o.h || sizePx * 0.95),
          fontSize: PT(sizePx), ...f, color: col(o.color || (o.ghost ? fg : 'numColor')), isTextBox: true, margin: 0,
          align: o.align || 'left', valign: 'top', lineSpacingMultiple: 0.8, charSpacing: PT(sizePx) * -0.03, objectName: o.name || nm('giant'), fit: 'none', wrap: false };
        if (o.ghost) opts.transparency = o.transparency ?? 92;
        else if (o.transparency) opts.transparency = o.transparency;
        if (o.outline) { opts.outline = { size: o.outline === true ? 2 : o.outline, color: opts.color }; opts.transparency = 100; }
        s.addText(String(str), opts);
        return api;
      },
      ghost(str, o = {}) { return api.giant(T.upper ? str.toUpperCase() : str, { font: T.display, weight: 'xb', ghost: true, size: 420, x: -20, y: 100, ...o }); },
      pill(str, o = {}) {
        const sizePx = o.size || 15, h = o.h || 44, w = o.w || Math.round(str.length * sizePx * (CJK.test(str) ? 1.15 : 0.82) + 48);
        const c = col(o.color || fg);
        const fill = o.solid ? { color: c } : o.accent ? { color: T.accent } : o.glass ? { color: 'FFFFFF', transparency: 84 } : undefined;
        s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: IN(o.x), y: IN(o.y), w: IN(w), h: IN(h), rectRadius: IN(h / 2),
          fill: fill || { color: 'FFFFFF', transparency: 100 }, line: { color: o.accent ? T.accent : c, width: 1.1, transparency: o.glass ? 55 : 0 }, objectName: o.name || nm('pill') });
        api.text(str, { x: o.x, y: o.y, w, h, size: sizePx, weight: 'md', track: 0.12, upper: true, align: 'center', valign: 'middle',
          color: o.solid ? (o.textColor || T.bg) : o.accent ? T.onAccent : c });
        return api;
      },
      ring(o = {}) {
        const d = o.d || 52, c = col(o.color || fg);
        s.addShape(pres.shapes.OVAL, { x: IN(o.x), y: IN(o.y), w: IN(d), h: IN(d), fill: { color: 'FFFFFF', transparency: 100 }, line: { color: c, width: 1.1 }, objectName: nm('ring') });
        api.text('→', { x: o.x, y: o.y - 2, w: d, h: d, size: 22, align: 'center', valign: 'middle', color: c });
        return api;
      },
      stat(value, unit, label, o = {}) {
        const sizePx = o.size || 150, c = col(o.color || fg);
        const f = face(o.font || T.display, o.weight || 'b', String(value));
        const runs = [{ text: String(value), options: { ...f, fontSize: PT(sizePx), color: c } }];
        if (unit) runs.push({ text: (o.tight ? '' : ' ') + unit, options: { ...face(o.font || T.display, 'lt', unit), fontSize: PT(sizePx * (o.unitScale || 0.4)), color: c } });
        s.addText(runs, { x: IN(o.x), y: IN(o.y), w: IN(o.w || 700), h: IN(sizePx * 1.0), margin: 0, isTextBox: true, valign: 'bottom', lineSpacingMultiple: 0.9, objectName: o.name || nm('stat'), fit: 'none', wrap: false });
        if (label) api.text(label, { x: o.x, y: o.y + sizePx * 1.0 + 16, w: o.lw || 420, size: o.lsize || 24, color: c, lh: 1.45, lines: o.llines || 2 });
        return api;
      },
      rect(o = {}) {
        const shape = o.radius ? pres.shapes.ROUNDED_RECTANGLE : pres.shapes.RECTANGLE;
        s.addShape(shape, { x: IN(o.x), y: IN(o.y), w: IN(o.w), h: IN(o.h), rectRadius: o.radius ? IN(o.radius) : undefined,
          fill: o.fill === 'none' ? { color: 'FFFFFF', transparency: 100 } : { color: col(o.fill || 'panel'), transparency: o.transparency || 0 },
          line: o.line ? { color: col(o.line), width: o.lineW || 0.75 } : { color: 'FFFFFF', transparency: 100 }, objectName: o.name || nm('rect') });
        return api;
      },
      hline(x, y, w, o = {}) { s.addShape(pres.shapes.LINE, { x: IN(x), y: IN(y), w: IN(w), h: 0, line: { color: col(o.color || 'line'), width: o.width || 0.75 }, objectName: o.name || nm('hl') }); return api; },
      vline(x, y, h, o = {}) { s.addShape(pres.shapes.LINE, { x: IN(x), y: IN(y), w: 0, h: IN(h), line: { color: col(o.color || 'line'), width: o.width || 0.75 }, objectName: o.name || nm('vl') }); return api; },
      /** corner crop marks */
      marks(o = {}) {
        const i = o.inset || 40, l = o.len || 22, c = o.color || fg;
        [[i, i, 1, 1], [1920 - i, i, -1, 1], [i, 1080 - i, 1, -1], [1920 - i, 1080 - i, -1, -1]].forEach(([x, y, dx, dy]) => {
          api.hline(dx > 0 ? x : x - l, y, l, { color: c, width: 1 }); api.vline(x, dy > 0 ? y : y - l, l, { color: c, width: 1 });
        });
        return api;
      },
      /** photo card with baked scrim image (prep_images.py cover --scrim bottom:0.75 --radius R) */
      card(o = {}) {
        if (o.image) api.photo(o.image, { x: o.x, y: o.y, w: o.w, h: o.h, contain: true });
        else api.rect({ x: o.x, y: o.y, w: o.w, h: o.h, radius: T.radius, fill: o.accent ? 'accent' : (o.fill || 'panel') });
        const c = o.image ? 'FFFFFF' : o.accent ? T.onAccent : fg, p = o.pad || 30;
        if (o.idx) api.text(o.idx, { x: o.x + p, y: o.y + p, w: 200, size: 14, weight: 'b', track: 0.16, color: c });
        let yb = o.y + o.h - p;
        if (o.body) { const bh = 22 * 1.5 * (o.bodyLines || 2); yb -= bh; api.text(o.body, { x: o.x + p, y: yb, w: o.w - 2 * p, size: 22, color: c, lh: 1.45, lines: o.bodyLines || 2 }); yb -= 12; }
        if (o.title) { const ts = o.titleSize || 34; yb -= ts * 1.15; api.text(o.title, { x: o.x + p, y: yb, w: o.w - 2 * p, size: ts, weight: 'b', font: 'display', upper: T.upper, track: T.track, color: c }); }
        if (o.stat) { const ss = o.statSize || 120; yb -= ss * 1.05; api.stat(o.stat, o.unit, null, { x: o.x + p, y: yb, size: ss, color: c }); }
        return api;
      },
      /** native bar chart: one key bar in accent, rest muted */
      bars(labels, values, o = {}) {
        const keys = [].concat(o.key ?? []);   // one index or an array (e.g. all Q3 months)
        const colors = values.map((_, i) => (keys.includes(i) ? T.accent : T.mute));
        s.addChart(pres.charts.BAR, [{ name: o.series || 'Series', labels, values }], {
          x: IN(o.x), y: IN(o.y), w: IN(o.w), h: IN(o.h), barDir: 'col', barGapWidthPct: 38, chartColors: colors,
          showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: o.format || 'General', valAxisMinVal: 0, dataLabelFontFace: F.sans.md, dataLabelFontSize: 12, dataLabelColor: fg,
          catAxisLabelColor: fg, catAxisLabelFontFace: F.sans.md, catAxisLabelFontSize: 11, catAxisLineShow: true, catAxisLineColor: fg,
          valAxisHidden: true, valGridLine: { style: 'none' }, catGridLine: { style: 'none' }, showLegend: false, objectName: o.name || nm('chart') });
        return api;
      },
      /** Lucile layer ------------------------------------------------------------- */
      /** short accent dash (under centered titles / before captions) */
      dash(x, y, o = {}) { s.addShape(pres.shapes.LINE, { x: IN(x), y: IN(y), w: IN(o.w || 44), h: 0, line: { color: col(o.color || 'accent'), width: o.width || 1.25 }, objectName: o.name || nm('dash') }); return api; },
      /** white inner frame inset on a photo area */
      frame(o = {}) { const i = o.inset || 26; s.addShape(pres.shapes.RECTANGLE, { x: IN(o.x + i), y: IN(o.y + i), w: IN(o.w - 2 * i), h: IN(o.h - 2 * i), fill: { color: 'FFFFFF', transparency: 100 }, line: { color: col(o.color || 'FFFFFF'), width: o.width || 1.5 }, objectName: o.name || nm('frame') }); return api; },
      /** pointer line ending in a small open circle (label → product detail) */
      pointer(x1, y1, x2, y2, o = {}) {
        const c = col(o.color || fg), d = o.d || 10;
        s.addShape(pres.shapes.LINE, { x: IN(Math.min(x1, x2)), y: IN(Math.min(y1, y2)), w: IN(Math.abs(x2 - x1)), h: IN(Math.abs(y2 - y1)), flipH: x2 < x1 !== y2 < y1 ? true : false, line: { color: c, width: 0.75 }, objectName: nm('ptr') });
        s.addShape(pres.shapes.OVAL, { x: IN(x2 - d / 2), y: IN(y2 - d / 2), w: IN(d), h: IN(d), fill: { color: o.fill || bgHex }, line: { color: c, width: 0.75 }, objectName: nm('ptrdot') });
        return api;
      },
      /** solid text card centered on a photo: kicker (wide caps) · title · dash · body */
      textcard(o = {}) {
        const w = o.w || 620, p = o.pad || 60, x = o.x ?? (960 - w / 2), ts = o.titleSize || 46;
        const lines = (o.title || []).length || 1, bodyH = o.body ? 28 * 1.45 * (o.bodyLines || 2) : 0;
        const h = o.h || (p * 2 + 24 + 22 + ts * 1.2 * lines + 40 + (o.body ? 24 + bodyH : 0));
        const y = o.y ?? (540 - h / 2);
        api.rect({ x, y, w, h, fill: o.fill || 'panel', name: o.name });
        let cy = y + p;
        if (o.kicker) { api.text(o.kicker, { x, y: cy, w, size: 15, weight: 'md', track: 0.3, upper: true, align: 'center', color: T.muted }); cy += 46; }
        if (o.title) { api.title(o.title, { x: x + 20, y: cy, w: w - 40, size: ts, lh: 1.2, align: 'center', bracket: o.bracket }); cy += ts * 1.2 * lines + 22; }
        api.dash(x + w / 2 - 22, cy); cy += 26;
        if (o.body) api.text(o.body, { x: x + p, y: cy, w: w - 2 * p, size: 24, align: 'center', color: T.muted, lh: 1.45, lines: o.bodyLines || 2 });
        return api;
      },
      notes(str) { s.addNotes(str); return api; },
    };
    slides.push(api);
    return api;
  }

  async function save(file, { morph = 'all', fade = 'rest', dur = 1.2 } = {}) {
    await pres.writeFile({ fileName: file });
    // always finish: transitions + outline-text fix + CJK lang/theme font
    const script = path.join(__dirname, '..', 'scripts', 'pptx_finish.py');
    execFileSync('python3', [script, file, '--morph', morph ? String(morph) : 'none', '--fade', fade, '--dur', String(dur), '--cjk', F.cjk.rg], { stdio: 'inherit' });
    return file;
  }

  return { pres, T, F, slide, save, IN, PT, preset, platform };
}

module.exports = { createDeck, PRESETS, FONTSETS, IN, PT, mix };
