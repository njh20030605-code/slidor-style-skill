#!/usr/bin/env python3
"""Post-process a .pptx written by pptxgenjs so Slidor-style details survive in PowerPoint/Keynote/WPS.

usage: pptx_finish.py deck.pptx [--morph all|2,3,7|none] [--fade rest|none] [--dur 1.2]
                      [--cjk "Hiragino Sans GB"] [-o out.pptx]

1. Transitions — pptxgenjs can't write them. Morph pairs objects on consecutive slides by NAME
   (pptxgenjs `objectName`; prefix "!!" e.g. "!!num" to force a match). Needs PowerPoint 2019/365;
   older apps get the Fade inside mc:Fallback.
2. Outline-only text — pptxgenjs writes a 0%-alpha fill, which LibreOffice/WPS paint solid.
   Rewritten as <a:noFill/> so only the stroke shows everywhere.
3. CJK — runs containing Chinese get lang="zh-CN" and the theme's East-Asian font is set
   (otherwise the app picks a random fallback, often a handwriting face).
"""
import argparse, re, zipfile, shutil, tempfile

MC = 'xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"'
P159 = 'xmlns:p159="http://schemas.microsoft.com/office/powerpoint/2015/09/main"'
P14 = 'xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main"'
CJK = re.compile(r'[⺀-鿿豈-﫿＀-￯]')

def morph_xml(ms):
    return (f'<mc:AlternateContent {MC}><mc:Choice {P159} Requires="p159">'
            f'<p:transition spd="slow" {P14} p14:dur="{ms}"><p159:morph option="byObject"/></p:transition>'
            f'</mc:Choice><mc:Fallback><p:transition spd="slow"><p:fade/></p:transition></mc:Fallback></mc:AlternateContent>')

def fade_xml(ms):
    return f'<p:transition spd="med" {P14} p14:dur="{ms}"><p:fade/></p:transition>'

def fix_runs(x):
    # transparent text fill -> noFill (keeps <a:ln> outline)
    x = re.sub(r'<a:solidFill><a:srgbClr val="[0-9A-Fa-f]{6}"><a:alpha val="0"/></a:srgbClr></a:solidFill>', '<a:noFill/>', x)
    # lang for CJK runs
    def run(m):
        r = m.group(0)
        if CJK.search(m.group(2)):
            r = re.sub(r'(<a:rPr\b[^>]*?)\blang="[^"]*"', r'\1lang="zh-CN"', r, count=1)
            if 'lang="zh-CN"' not in r: r = r.replace('<a:rPr', '<a:rPr lang="zh-CN"', 1)
        return r
    return re.sub(r'<a:r>(<a:rPr\b.*?)<a:t>(.*?)</a:t></a:r>', run, x, flags=re.S)

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('pptx')
    ap.add_argument('--morph', default='all'); ap.add_argument('--fade', default='rest')
    ap.add_argument('--dur', type=float, default=1.2); ap.add_argument('--cjk', default='Hiragino Sans GB'); ap.add_argument('-o')
    a = ap.parse_args(); out = a.o or a.pptx; ms = int(a.dur * 1000)
    src = zipfile.ZipFile(a.pptx)
    nums = sorted(int(m.group(1)) for n in src.namelist() if (m := re.fullmatch(r'ppt/slides/slide(\d+)\.xml', n)))
    morph = set() if a.morph == 'none' else set(nums) if a.morph == 'all' else {int(v) for v in a.morph.split(',') if v}
    tmp = tempfile.mktemp(suffix='.pptx'); dst = zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED); log = []
    for item in src.infolist():
        data = src.read(item.filename); name = item.filename
        if (m := re.fullmatch(r'ppt/slides/slide(\d+)\.xml', name)):
            k = int(m.group(1)); x = fix_runs(data.decode('utf8'))
            x = re.sub(r'<mc:AlternateContent[^>]*>\s*<mc:Choice[^>]*Requires="p159".*?</mc:AlternateContent>', '', x, flags=re.S)
            x = re.sub(r'<p:transition\b.*?(?:/>|</p:transition>)', '', x, flags=re.S)
            t = morph_xml(ms) if k in morph else (fade_xml(int(ms * .6)) if a.fade == 'rest' else '')
            if t:
                x = x.replace('</p:clrMapOvr>', '</p:clrMapOvr>' + t, 1) if '</p:clrMapOvr>' in x else x.replace('</p:cSld>', '</p:cSld>' + t, 1)
                log.append(f'{k}:{"morph" if k in morph else "fade"}')
            data = x.encode('utf8')
        elif re.fullmatch(r'ppt/(slideLayouts/slideLayout|slideMasters/slideMaster|notesSlides/notesSlide)\d+\.xml', name):
            data = fix_runs(data.decode('utf8')).encode('utf8')
        elif re.fullmatch(r'ppt/theme/theme\d+\.xml', name) and a.cjk:
            x = data.decode('utf8')
            x = re.sub(r'(<a:(?:major|minor)Font>\s*<a:latin [^>]*/>\s*)<a:ea typeface="[^"]*"\s*/>', rf'\1<a:ea typeface="{a.cjk}"/>', x)
            x = re.sub(r'<a:font script="Hans" typeface="[^"]*"\s*/>', f'<a:font script="Hans" typeface="{a.cjk}"/>', x)
            data = x.encode('utf8')
        dst.writestr(item, data)
    dst.close(); src.close(); shutil.move(tmp, out)
    print(out, ' '.join(log))

if __name__ == '__main__': main()
