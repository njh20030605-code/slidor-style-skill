/* Worked example: a 9-slide Slidor-style .pptx built with slidor_pptx_kit.js.
 * usage: NODE_PATH=$(npm root -g) node pptx_example.js <imgDir> <outDir> [preset] [platform]
 * <imgDir> needs: cover.jpg agenda.jpg portrait.jpg ocean.jpg branch.jpg arch-src.jpg c1.jpg c2.jpg c3.jpg texture.jpg flower.jpg
 * Every photo is first cut to its exact frame with prep_images.py — the kit never stretches images. */
const path = require('path');
const { execFileSync } = require('child_process');
const K = require('./slidor_pptx_kit.js');

const [imgDir, outDir, preset = 'atelier', platform = 'mac'] = process.argv.slice(2);
const PREP = path.join(__dirname, '..', 'scripts', 'prep_images.py');
const prep = (...a) => execFileSync('python3', [PREP, ...a.map(String)], { stdio: 'ignore' });
const I = f => path.join(imgDir, f), O = f => path.join(outDir, f);

(async () => {
  const d = K.createDeck({ preset, platform, title: 'Slidor 风格样张' });
  const T = d.T;
  // ---------- image prep (exact frames, baked radius/scrims) ----------
  prep('cover', I('cover.jpg'), O('p_cover.jpg'), '--w', 1920, '--h', 1080, '--scrim', 'left:0.7');
  prep('cover', I('agenda.jpg'), O('p_agenda.jpg'), '--w', 884, '--h', 1080);
  prep('cover', I('portrait.jpg'), O('p_portrait.jpg'), '--w', 1920, '--h', 1080, '--pos', '0.7,0.3', '--scrim', 'left:0.65');
  prep('cover', I('arch-src.jpg'), O('p_arch.png'), '--w', 420, '--h', 660, '--arch');
  prep('split', O('p_arch.png'), '--cut', 0.52, '--part', 'top', O('p_arch_front.png'));
  prep('noise', O('p_paper.jpg'), '--color', T.bg, '--amount', 8);
  const cardR = Math.max(T.radius, 2);
  prep('cover', I('ocean.jpg'), O('p_ocean.png'), '--w', 852, '--h', 864, '--radius', cardR, '--scrim', 'bottom:0.8');
  prep('cover', I('branch.jpg'), O('p_branch.png'), '--w', 852, '--h', 864, '--radius', cardR, '--scrim', 'bottom:0.8');
  prep('cover', I('texture.jpg'), O('p_texture.jpg'), '--w', 1114, '--h', 1080);
  prep('cover', I('flower.jpg'), O('p_flower.jpg'), '--w', 806, '--h', 1080);
  ['c1', 'c2', 'c3'].forEach(c => prep('cover', I(c + '.jpg'), O(`p_${c}.png`), '--w', 417, '--h', 670, '--radius', cardR, '--scrim', 'bottom:0.8'));

  // 01 · cover — full-bleed photo, mixed-weight title, pill + ring
  let s = d.slide({ image: O('p_cover.jpg') });
  s.chrome({ l: 'Slidor·Style', c: 'Visual System', r: '2026', color: 'FFFFFF' })
   .kicker('样张 · Specimen', { x: 96, y: 330, color: 'FFFFFF', plain: true })
   .title([{ t: '让每一页', w: 'lt' }, { t: '都像品牌大片', w: 'b' }], { x: 96, y: 380, w: 1100, size: 128, color: 'FFFFFF' })
   .text('从 Slidor 25 个案例与 Lucile Mennessier 的奢侈品作品中提炼的版式、字体与动效规则。', { x: 96, y: 680, w: 760, size: 32, weight: 'lt', color: 'FFFFFF', lh: 1.4, lines: 2 })
   .pill('开始', { x: 96, y: 840, glass: true, color: 'FFFFFF', w: 96 })
   .ring({ x: 208, y: 836, color: 'FFFFFF' })
   .chrome({ bottom: true, l: 'Confidential', r: 'page', color: 'FFFFFF' })
   .notes('封面：一张主图 + 一句带粗细对比的标题；文字压在照片留白区。');

  // 02 · agenda — numbered rows + half-bleed photo
  s = d.slide({ bg: 'bg' });
  s.photo(O('p_agenda.jpg'), { x: 1036, y: 0, w: 884, h: 1080 })
   .chrome({ l: 'Agenda', r: 'page' })
   .title([{ t: '今天的', w: 'lt' }, { t: '五个章节', w: 'b' }], { x: 96, y: 200, w: 820, size: 64 });
  ['品牌世界先于模板', '字体即建筑', '数据要当主角', '节奏与留白', '收尾'].forEach((t, i) => {
    const y = 420 + i * 82;
    s.hline(96, y, 820, { color: T.line });
    s.text(String(i + 1).padStart(2, '0'), { x: 96, y: y + 30, w: 60, size: 15, weight: 'md', track: 0.14, color: s.soft(0.35) });
    s.text(t, { x: 180, y: y + 22, w: 600, size: 32, weight: i === 0 ? 'b' : 'lt', color: i === 0 ? s.acc : undefined });
  });
  s.hline(96, 420 + 5 * 82, 820, { color: T.line }).chrome({ bottom: true, l: 'Slidor·Style', m: 96 });

  // 03 · chapter opener — cropped giant numeral over photo
  s = d.slide({ image: O('p_portrait.jpg') });
  s.giant('1', { x: 1500, y: -60, size: 1150, color: 'FFFFFF', transparency: 8, name: '!!num' })
   .chrome({ l: '01 — 品牌世界', r: 'page', color: 'FFFFFF' })
   .title([{ t: '品牌世界', w: 'lt' }, { t: '先于模板', w: 'b' }], { x: 96, y: 380, w: 900, size: 110, color: 'FFFFFF' })
   .text('每套稿子的视觉系统都从客户的品牌宇宙里长出来：标志、产品、材质、广告大片——而不是套一个通用模板。', { x: 96, y: 640, w: 680, size: 28, color: 'F2F2F2', lh: 1.5, lines: 3 })
   .pill('Chapter 01', { x: 96, y: 790, color: 'FFFFFF' });

  // 04 · interlock — stack: full arch photo → word → top 52% of the photo (so the word's lower half sits in front)
  s = d.slide({ image: O('p_paper.jpg') });
  const ax = 960 - 210, ay = 540 - 330;
  s.chrome({ l: '02 — 字体即建筑', c: 'Slidor·Style', r: 'page', brand: true })
   .text('New proofs of', { x: 0, y: 150, w: 1920, size: 15, weight: 'md', track: 0.16, upper: true, align: 'center', color: s.soft(0.3) })
   .photo(O('p_arch.png'), { x: ax, y: ay, w: 420, h: 660, contain: true, name: '!!hero' })
   .text('BEAUTY', { x: 0, y: 540 - 175, w: 1920, h: 340, size: 330, weight: 'rg', font: 'display', align: 'center', valign: 'middle', track: 0.04, wrap: false })
   .photo(O('p_arch_front.png'), { x: ax, y: ay, w: 420, h: Math.round(660 * 0.52), contain: true })
   .text('产品 / 人物穿过大字：上半截在字后、下半截在字前 —— 一页就有纵深。', { x: 0, y: 930, w: 1920, size: 28, align: 'center', color: T.muted })
   .chrome({ bottom: true, l: 'Interlock', r: 'Chanel · Lucile' });

  // 05 · Lucile split — two photos, inner frame, centered text card with bracket title + dash, pointer
  s = d.slide({ bg: 'bg' });
  s.photo(O('p_texture.jpg'), { x: 0, y: 0, w: 1114, h: 1080 }).frame({ x: 0, y: 0, w: 1114, h: 1080, inset: 26 })
   .photo(O('p_flower.jpg'), { x: 1114, y: 0, w: 806, h: 1080 })
   .textcard({ kicker: 'Lucile · Restraint', title: [{ t: '质地', w: 'b' }, { t: '先于颜色', w: 'lt' }], bracket: true,
     body: '颜色来自质地特写，背景只做中性；照片上的字永远放在实底卡片里。', w: 640 })
   .pointer(1490, 190, 1290, 255, { color: 'FFFFFF', fill: 'FFFFFF' })
   .text('Texture close-up', { x: 1500, y: 172, w: 360, size: 14, weight: 'md', track: 0.16, upper: true, color: 'FFFFFF' })
   .chrome({ bottom: true, l: 'Lumiere', r: 'page', color: 'FFFFFF' });

  // 05 · stats on photo cards — dark slide
  s = d.slide({ bg: 'dark' });
  s.chrome({ l: '03 — 数据要当主角', c: 'Slidor·Style', r: 'page', brand: true });
  [['p_ocean.png', '25', '个', 'Slidor 官网公开案例，覆盖奢侈品、美妆、体育、科技与金融。'],
   ['p_branch.png', '395', '页', '逐页拆解的页面截图，归纳出 10 套视觉世界与 24 种版式。']].forEach(([img, v, u, l], i) => {
    const x = 96 + i * (852 + 24);
    s.photo(O(img), { x, y: 120, w: 852, h: 864, contain: true });
    s.pill(i ? 'Slides' : 'Cases', { x: x + 30, y: 150, glass: true, color: 'FFFFFF', size: 12, h: 32 });
    s.stat(v, u, l, { x: x + 30, y: 650, size: 170, color: 'FFFFFF', lw: 600 });
  });

  // 06 · four cards — three photos + one accent card
  s = d.slide({ bg: 'bg' });
  s.chrome({ l: '04 — 节奏与留白', c: 'Slidor·Style', r: 'page', brand: true, rule: true })
   .title([{ t: '一套稿子只有', w: 'lt' }, { t: '四种节奏', w: 'b', accent: true }], { x: 96, y: 150, w: 1400, size: 58, inline: true });
  const cards = [['p_c1.png', '呼吸页', '一张图 + 一句话，章节开场。'], ['p_c2.png', '信息页', '3–5 张卡片，一张高亮。'], [null, '数据页', '一个大数字压住全场。'], ['p_c3.png', '转场页', '巨型数字 / 幽灵字过渡。']];
  cards.forEach(([img, t, b], i) => s.card({ x: 96 + i * (417 + 20), y: 300, w: 417, h: 670, image: img && O(img), accent: !img,
    idx: String(i + 1).padStart(2, '0'), title: t, body: b, bodyLines: 1, stat: img ? null : '1' }));

  // 07 · data — native chart, one key bar
  s = d.slide({ bg: 'bg' });
  s.chrome({ l: '03 — 数据', c: 'Slidor·Style', r: 'page', brand: true })
   .kicker('示例数据 · Sample', { x: 96, y: 180 })
   .title([{ t: '只高亮', w: 'lt' }, { t: '一根柱子', w: 'b', accent: true }], { x: 96, y: 230, w: 700, size: 56 })
   .text('图表去掉边框、网格和图例；结论写在标题里，其余数据降为灰色背景板。', { x: 96, y: 400, w: 640, size: 28, color: T.muted, lh: 1.5, lines: 3 })
   .stat('+38', '%', '关键柱相对均值的领先幅度（示例）', { x: 96, y: 580, size: 120 })
   .bars(['Q1', 'Q2', 'Q3', 'Q4', 'Q5'], [46, 58, 52, 86, 61], { x: 880, y: 220, w: 940, h: 700, key: 3 });

  // 08 · statement + ghost word
  s = d.slide({ bg: 'alt' });
  s.ghost('Restraint', { x: -20, y: 90, size: 440 })
   .chrome({ l: '04 — 节奏与留白', r: 'page' })
   .text('少即是多：留白不是空，', { x: 96, y: 520, w: 1400, size: 84, font: 'serif', lh: 1.15 })
   .text('是给主角让出的舞台。', { x: 96, y: 620, w: 1400, size: 84, font: 'serif', lh: 1.15 })
   .text('Principle · Restraint', { x: 96, y: 780, w: 600, size: 14, weight: 'md', track: 0.16, upper: true, color: s.soft(0.4) });

  // 09 · closing — outline + solid, giant outline number
  s = d.slide({ bg: 'dark' });
  s.giant('09', { x: -40, y: 420, size: 900, outline: 1.5, color: T.onDark, name: '!!num' })
   .chrome({ l: 'Fin', c: 'Slidor·Style', r: 'page', brand: true })
   .title([{ t: 'Thank', w: 'lt', outline: true }, { t: 'you', w: 'b' }], { x: 0, y: 360, w: 1920, size: 170, align: 'center' })
   .text('谢谢 · Merci · Cảm ơn', { x: 0, y: 740, w: 1920, size: 14, weight: 'md', track: 0.16, align: 'center', color: s.soft(0.35) });

  const file = O(`slidor-example-${preset}.pptx`);
  await d.save(file, { morph: "all" });
  console.log('wrote', file);
})();
