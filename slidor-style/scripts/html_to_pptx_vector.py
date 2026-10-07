#!/usr/bin/env python3
"""HTML deck → PPTX whose TEXT IS VECTOR (sharp at any zoom), pictures stay 4K raster.

Each slide = 2 stacked pictures:
  1. background layer: the slide with all text made transparent  → 4K JPEG
  2. text layer: the slide with images/backgrounds hidden → SVG (glyphs as outlines, from Chrome's
     vector PDF via pdftocairo) + transparent 4K PNG fallback, linked the Office way (a:blip + asvg:svgBlip)
PowerPoint 2016+/365 and current WPS draw the SVG; older apps draw the PNG. Text is not editable.

Deck requirements (assets/deck-template.html has them):
  ?static            freeze build-ins            ?print   all slides stacked, @page 1920×1080
  ?layer=bg          html.layer-bg  → text color transparent, inline <svg> hidden
  ?layer=text        html.layer-text → img/figure/.shade/slide backgrounds hidden, transparent page
usage: html_to_pptx_vector.py deck.html out.pptx
"""
import sys, os, re, json, html, shutil, subprocess, tempfile, zipfile, glob
from concurrent.futures import ThreadPoolExecutor
from PIL import Image, ImageStat

CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
deck = os.path.abspath(sys.argv[1]); out = os.path.abspath(sys.argv[2])
src = open(deck, encoding='utf8').read()
N = src.count('<section class="slide')
T = tempfile.mkdtemp()
url = lambda q: f'file://{deck}?{q}'

def chrome(args):
    subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--run-all-compositor-stages-before-draw',
                    '--virtual-time-budget=14000'] + args, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def shot(i, layer):
    f = f'{T}/{layer}_{i:02d}.png'
    extra = ['--default-background-color=00000000'] if layer == 'text' else []
    chrome(['--force-device-scale-factor=2', '--window-size=1920,1080', f'--screenshot={f}'] + extra + [url(f'static&layer={layer}#{i}')])
    return f

def empty(i):
    """a slide failed only if BOTH layers are empty (a text-only slide has a flat bg layer; an image-only one has no text)"""
    try:
        bg = ImageStat.Stat(Image.open(f'{T}/bg_{i:02d}.png').convert('L').resize((480, 270))).stddev[0] < 3
        t = Image.open(f'{T}/text_{i:02d}.png')
        tx = t.mode != 'RGBA' or t.getchannel('A').getextrema()[1] == 0
        return bg and tx
    except Exception:
        return True

with ThreadPoolExecutor(3) as ex:
    list(ex.map(lambda a: shot(*a), [(i, l) for i in range(1, N + 1) for l in ('bg', 'text')]))
for _ in range(3):
    bad = [i for i in range(1, N + 1) if empty(i)]
    if not bad: break
    for i in bad: shot(i, 'bg'); shot(i, 'text')
if bad: raise SystemExit(f'slides still empty after retries: {bad}')
for i in range(1, N + 1):
    Image.open(f'{T}/bg_{i:02d}.png').convert('RGB').save(f'{T}/bg_{i:02d}.jpg', quality=92, subsampling=0, optimize=True)

# vector text layer: one PDF, one SVG per page
chrome(['--no-pdf-header-footer', f'--print-to-pdf={T}/text.pdf', url('print&layer=text')])
for i in range(1, N + 1):
    subprocess.run(['pdftocairo', '-svg', '-f', str(i), '-l', str(i), f'{T}/text.pdf', f'{T}/text_{i:02d}.svg'], check=True)

notes = []
for s in re.split(r'<section class="slide', src)[1:]:
    m = re.search(r'<aside class="notes">(.*?)</aside>', s, re.S)
    notes.append(html.unescape(re.sub(r'<[^>]+>', '', m.group(1))).strip() if m else '')
json.dump(notes, open(f'{T}/notes.json', 'w'), ensure_ascii=False)

# base deck with pptxgenjs: bg JPEG + text PNG (named TEXTLAYER) per slide
js = r'''
const P=require('pptxgenjs'),fs=require('fs');const [d,o,n]=process.argv.slice(2);const notes=JSON.parse(fs.readFileSync(d+'/notes.json','utf8'));
const p=new P();p.layout='LAYOUT_WIDE';
for(let i=1;i<=+n;i++){const k=String(i).padStart(2,'0');const s=p.addSlide();
 s.addImage({path:`${d}/bg_${k}.jpg`,x:0,y:0,w:13.333,h:7.5,objectName:'BGLAYER',altText:'slide background'});
 s.addImage({path:`${d}/text_${k}.png`,x:0,y:0,w:13.333,h:7.5,objectName:'TEXTLAYER',altText:'slide text'});
 if(notes[i-1]) s.addNotes(notes[i-1]);}
p.writeFile({fileName:o}).then(()=>console.log('base ok'));'''
open(f'{T}/build.js', 'w').write(js)
env = dict(os.environ, NODE_PATH=subprocess.check_output(['npm', 'root', '-g']).decode().strip())
subprocess.run(['node', f'{T}/build.js', T, f'{T}/base.pptx', str(N)], check=True, env=env)

# inject SVG into each TEXTLAYER picture
zin = zipfile.ZipFile(f'{T}/base.pptx'); zout = zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED)
SVGNS = 'http://schemas.microsoft.com/office/drawing/2016/SVG/main'
for item in zin.infolist():
    data = zin.read(item.filename); name = item.filename
    m = re.fullmatch(r'ppt/slides/slide(\d+)\.xml', name)
    if m:
        k = int(m.group(1)); x = data.decode('utf8')
        rels = zin.read(f'ppt/slides/_rels/slide{k}.xml.rels').decode('utf8')
        rid_new = 'rIdSvg1'
        # the TEXTLAYER pic: <p:cNvPr ... name="TEXTLAYER"> ... <a:blip r:embed="rIdN"/>
        pic = re.search(r'name="TEXTLAYER".*?<a:blip r:embed="(rId\d+)"\s*(/>|></a:blip>)', x, re.S)
        if not pic: raise SystemExit(f'no TEXTLAYER blip on slide {k}')
        blip_new = (f'<a:blip r:embed="{pic.group(1)}"><a:extLst><a:ext uri="{{96DAC541-7B7A-43D3-8B79-37D633B846F1}}">'
                    f'<asvg:svgBlip xmlns:asvg="{SVGNS}" r:embed="{rid_new}"/></a:ext></a:extLst></a:blip>')
        whole = pic.group(0); blip_old = whole[whole.index('<a:blip'):]
        x = x.replace(whole, whole[:whole.index('<a:blip')] + blip_new, 1)
        data = x.encode('utf8')
    elif re.fullmatch(r'ppt/slides/_rels/slide(\d+)\.xml\.rels', name):
        k = int(re.search(r'slide(\d+)\.xml\.rels', name).group(1))
        x = data.decode('utf8').replace('</Relationships>',
            f'<Relationship Id="rIdSvg1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/textlayer-{k}.svg"/></Relationships>')
        data = x.encode('utf8')
        zout.writestr(f'ppt/media/textlayer-{k}.svg', open(f'{T}/text_{k:02d}.svg', 'rb').read())
    elif name == '[Content_Types].xml':
        x = data.decode('utf8')
        if 'Extension="svg"' not in x:
            x = x.replace('<Default Extension="xml"', '<Default Extension="svg" ContentType="image/svg+xml"/><Default Extension="xml"', 1)
        data = x.encode('utf8')
    zout.writestr(item, data)
zout.close(); zin.close()
here = os.path.dirname(os.path.abspath(__file__))
subprocess.run(['python3', f'{here}/pptx_finish.py', out, '--morph', 'none', '--fade', 'rest', '--dur', '0.8'], stdout=subprocess.DEVNULL, check=True)
shutil.rmtree(T)
print('wrote', out, f'({N} slides, vector text layer)')
