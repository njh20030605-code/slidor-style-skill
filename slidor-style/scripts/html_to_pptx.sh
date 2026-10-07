#!/usr/bin/env bash
# HTML deck → .pptx made of full-bleed slide images (exact typography, text not editable).
# Each <section class="slide"> is screenshotted at 3840×2160 (?static#N), saved as high-quality JPEG
# (PNG 4K pages are 5–10 MB each and WPS may fail to load them → blank pages), and every page is
# checked: a near-uniform image (blank/unloaded) is re-rendered up to 3 times, else the export fails.
# <aside class="notes"> becomes speaker notes.
# usage: html_to_pptx.sh deck.html out.pptx [scale=2]
set -euo pipefail
DECK="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"; OUTP="$2"; SCALE="${3:-2}"
TMP=$(mktemp -d); CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
N=$(grep -o '<section class="slide' "$DECK" | wc -l | tr -d ' ')
shot(){ "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor="$SCALE" \
  --window-size=1920,1080 --virtual-time-budget=12000 --run-all-compositor-stages-before-draw \
  --screenshot="$TMP/$(printf %02d "$1").png" "file://$DECK?static#$1" >/dev/null 2>&1; }
for i in $(seq 1 "$N"); do shot "$i" & while [ "$(jobs -r | wc -l)" -ge 3 ]; do sleep 0.3; done; done; wait
for attempt in 1 2 3; do
  BAD=$(python3 - "$TMP" "$N" <<'PY'
import sys,os
from PIL import Image, ImageStat
d,n=sys.argv[1],int(sys.argv[2]); bad=[]
for i in range(1,n+1):
    f=f'{d}/{i:02d}.png'
    try: ok=ImageStat.Stat(Image.open(f).convert('L').resize((480,270))).stddev[0]>6
    except Exception: ok=False
    if not ok: bad.append(str(i))
print(' '.join(bad))
PY
)
  [ -z "$BAD" ] && break
  echo "re-rendering blank/failed pages: $BAD (attempt $attempt)" >&2
  for i in $BAD; do shot "$i"; done
done
[ -n "$BAD" ] && { echo "ERROR: pages still blank after retries: $BAD" >&2; exit 1; }
python3 - "$DECK" "$TMP" <<'PY'
import sys,re,json,html,glob
from PIL import Image
src=open(sys.argv[1],encoding='utf8').read(); d=sys.argv[2]
notes=[]
for s in re.split(r'<section class="slide',src)[1:]:
    m=re.search(r'<aside class="notes">(.*?)</aside>',s,re.S)
    notes.append(html.unescape(re.sub(r'<[^>]+>','',m.group(1))).strip() if m else '')
json.dump(notes,open(d+'/notes.json','w'),ensure_ascii=False)
for f in sorted(glob.glob(d+'/[0-9][0-9].png')):
    Image.open(f).convert('RGB').save(f[:-4]+'.jpg',quality=92,subsampling=0,optimize=True)
PY
NODE_PATH=$(npm root -g) node - "$TMP" "$OUTP" <<'JS'
const P=require('pptxgenjs'),fs=require('fs'),path=require('path');
const [dir,out]=process.argv.slice(2); const notes=JSON.parse(fs.readFileSync(dir+'/notes.json','utf8'));
const p=new P(); p.layout='LAYOUT_WIDE';
fs.readdirSync(dir).filter(f=>/^\d+\.jpg$/.test(f)).sort().forEach((f,i)=>{
  const s=p.addSlide(); s.addImage({path:path.join(dir,f),x:0,y:0,w:13.333,h:7.5});
  if(notes[i]) s.addNotes(notes[i]);
});
p.writeFile({fileName:out}).then(()=>console.log('wrote',out));
JS
python3 "$(dirname "$0")/pptx_finish.py" "$OUTP" --morph none --fade rest --dur 0.8 >/dev/null
rm -rf "$TMP"
