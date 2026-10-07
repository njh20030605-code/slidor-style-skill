#!/bin/bash
# 公开仓库脱敏：品牌内部资料不分发；SKILL.md 的触发描述换成通用版本；最后 grep 一遍禁用词。
set -euo pipefail
R="$(cd "$(dirname "$0")" && pwd)"; S="$R/slidor-style"
rm -f "$S"/references/brand-*.md
python3 - "$S/SKILL.md" <<'PY'
import sys,re
p=sys.argv[1]; s=open(p,encoding='utf8').read()
desc=("description: Premium presentation and HTML page design in the style of Paris presentation studio Slidor "
      "(Chanel, Cartier, LVMH, Nespresso) plus luxury freelance designer Lucile Mennessier (L'Oréal, Guerlain, Dom Pérignon) — "
      "brand-world method, 10 visual presets, 24 layout archetypes, an HTML deck engine, a responsive page template, "
      "a pptxgenjs kit with Morph transitions, sharp vector-text PPTX export and render QA. Use whenever the user asks for "
      "slides, a deck, a presentation, a .pptx, a keynote, a pitch, a report page, a landing page or any HTML page "
      "(PPT / 幻灯片 / 汇报 / 提案 / 网页 / 落地页 / H5), or asks to make an existing deck or page look premium "
      "(好看 / 高级 / 重新设计) — even if they don't mention Slidor, style or design.")
s=re.sub(r'^description: .*$',desc,s,count=1,flags=re.M)
open(p,'w',encoding='utf8').write(s)
PY
# 禁用词检查：公司 / 品牌内部 / 个人路径 / 飞书 ID
if grep -rnIiE "KANS|韩束|王嘉尔|Jackson Wang|杨佳林|Jasper|上美|chicmax|VN-TK|晋升|/Users/|Desktop/|oc_[0-9a-f]{8}|om_x[0-9a-f]{6}|ou_[0-9a-f]{8}" "$S"; then
  echo "❌ scrub: 发现不应公开的内容（见上）"; exit 1
fi
echo "✅ scrub ok"
