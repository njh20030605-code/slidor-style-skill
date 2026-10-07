#!/usr/bin/env bash
# Render every slide of a Slidor-style HTML deck to PNG (1920×1080) + a contact sheet, for visual QA.
# usage: render_html.sh deck.html [outdir] [preset]
#   outdir defaults to ./_render ; preset (optional) overrides data-preset, e.g. maison
set -euo pipefail
DECK="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
OUT="${2:-_render}"; PRESET="${3:-}"
mkdir -p "$OUT"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
[ -x "$CHROME" ] || CHROME="$(command -v google-chrome || command -v chromium)"
N=$(grep -o '<section class="slide' "$DECK" | wc -l | tr -d ' ')
Q="static"; [ -n "$PRESET" ] && Q="static&preset=$PRESET"
for i in $(seq 1 "$N"); do
  f=$(printf "%s/%02d.png" "$OUT" "$i")
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --window-size=1920,1080 --virtual-time-budget=9000 --run-all-compositor-stages-before-draw \
    --screenshot="$f" "file://$DECK?$Q#$i" >/dev/null 2>&1 &
  # keep at most 4 Chrome instances in flight
  while [ "$(jobs -r | wc -l)" -ge 4 ]; do sleep 0.3; done
done
wait
python3 - "$OUT" <<'EOF'
import sys,glob
from PIL import Image,ImageDraw
out=sys.argv[1]; fs=sorted(glob.glob(out+'/[0-9][0-9].png'))
W,H,c=640,360,3; r=(len(fs)+c-1)//c
s=Image.new('RGB',(c*W+(c+1)*12,r*(H+28)+12),(70,70,70)); d=ImageDraw.Draw(s)
for k,f in enumerate(fs):
    x=12+(k%c)*(W+12); y=12+(k//c)*(H+28)
    s.paste(Image.open(f).convert('RGB').resize((W,H)),(x,y+20)); d.text((x,y+4),f.split('/')[-1],fill=(255,255,0))
s.save(out+'/_sheet.jpg',quality=85); print(out+'/_sheet.jpg',len(fs),'slides')
EOF
