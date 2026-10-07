#!/usr/bin/env bash
# Render a .pptx to per-slide PNGs (via LibreOffice → PDF → pdftoppm) + contact sheet, for visual QA.
# LibreOffice ignores Morph and draws some fonts slightly differently from PowerPoint — it is a layout check.
# usage: render_pptx.sh deck.pptx [outdir]
set -euo pipefail
PPTX="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"; OUT="${2:-_render_pptx}"
mkdir -p "$OUT"; TMP=$(mktemp -d)
soffice --headless --convert-to pdf --outdir "$TMP" "$PPTX" >/dev/null 2>&1
pdftoppm -r 144 -png "$TMP"/*.pdf "$OUT/s"
rm -rf "$TMP"
python3 - "$OUT" <<'EOF'
import sys,glob
from PIL import Image,ImageDraw
out=sys.argv[1]; fs=sorted(glob.glob(out+'/s-*.png'))
W,H,c=640,360,3; r=(len(fs)+c-1)//c
s=Image.new('RGB',(c*W+(c+1)*12,r*(H+28)+12),(70,70,70)); d=ImageDraw.Draw(s)
for k,f in enumerate(fs):
    x=12+(k%c)*(W+12); y=12+(k//c)*(H+28)
    s.paste(Image.open(f).convert('RGB').resize((W,H)),(x,y+20)); d.text((x,y+4),f.split('/')[-1],fill=(255,255,0))
s.save(out+'/_sheet.jpg',quality=85); print(out+'/_sheet.jpg',len(fs),'slides')
EOF
