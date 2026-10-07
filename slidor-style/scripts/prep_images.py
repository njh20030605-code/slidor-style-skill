#!/usr/bin/env python3
"""Image prep for Slidor-style PPTX (pptxgenjs can't do gradients, rounded photo corners or clipping).

  cover   IN OUT --w 1000 --h 1200 [--pos 0.5,0.3] [--radius 24] [--arch] [--gray] [--warm]
          [--scrim bottom|left|right|top|all:0.7] [--darken 0.15]
          Crop-to-fill at exact size (no distortion in PPT), optional rounded/arch corners,
          grading and a baked-in scrim for text legibility.
  scrim   OUT --w 1920 --h 1080 --dir left --alpha 0.65 [--color 000000] [--stop 0.62]
          Transparent gradient PNG to lay over a photo (keeps the photo swappable).
  split   IN --cut 0.5 [--part top|bottom] OUT_FRONT
          Interlock effect (object passes through a word). Stack: full image → word → this piece.
          --part top (default): top piece placed at the same x/y, h*cut tall → word's lower half sits
          in front of the object, upper half behind it (matches the HTML .interlock).
          --part bottom: piece placed at y + h*cut → the reverse.
  noise   OUT --w 1920 --h 1080 [--color F6F2EC] [--amount 10]
          Paper/grain background texture.
  mesh    OUT --w 1920 --h 1080 [--colors FF5DA2,9B5CFF,4FE3D6,FFB36B]
          Soft mesh-gradient background (Swile-style).
  glow    OUT --w 1920 --h 1080 [--color D9C38A] [--at 0.7,0.4] [--bg 07090C]
          Dark stage background with a soft light pool.
"""
import argparse, random
from PIL import Image, ImageDraw, ImageFilter, ImageOps, ImageChops

def hexrgb(h): h=h.lstrip('#'); return tuple(int(h[i:i+2],16) for i in (0,2,4))

def cover(a):
    im=Image.open(a.inp); im=ImageOps.exif_transpose(im).convert('RGB')
    W,H=a.w,a.h; px,py=(float(v) for v in a.pos.split(','))
    s=max(W/im.width,H/im.height); im=im.resize((round(im.width*s),round(im.height*s)),Image.LANCZOS)
    x=round((im.width-W)*px); y=round((im.height-H)*py); im=im.crop((x,y,x+W,y+H))
    if a.gray: im=ImageOps.grayscale(im).convert('RGB'); im=ImageOps.autocontrast(im,cutoff=1)
    if a.warm:
        r,g,b=im.split(); r=r.point(lambda v:min(255,int(v*1.06))); b=b.point(lambda v:int(v*.9)); im=Image.merge('RGB',(r,g,b))
    if a.darken: im=Image.blend(im,Image.new('RGB',im.size,(0,0,0)),a.darken)
    im=im.convert('RGBA')
    if a.scrim:
        d,al=a.scrim.split(':') if ':' in a.scrim else (a.scrim,'0.7')
        im=Image.alpha_composite(im,grad(W,H,d,float(al),(0,0,0),0.62))
    if a.radius or a.arch:
        m=Image.new('L',(W*2,H*2),0); dr=ImageDraw.Draw(m)
        if a.arch: dr.rounded_rectangle((0,0,W*2,H*2+W*2),radius=W,fill=255)
        else: dr.rounded_rectangle((0,0,W*2,H*2),radius=a.radius*2,fill=255)
        im.putalpha(ImageChops.multiply(im.getchannel('A'),m.resize((W,H),Image.LANCZOS)))
    out=a.out
    if out.lower().endswith(('.jpg','.jpeg')) and not (a.radius or a.arch): im.convert('RGB').save(out,quality=90)
    else: im.save(out)
    print(out,im.size)

def grad(W,H,d,alpha,color,stop):
    g=Image.new('L',(256,1))
    for i in range(256):
        t=i/255
        v= max(0.0,1-t/stop) if stop>0 else 1-t
        g.putpixel((i,0),int(255*alpha*(v**1.25)))
    if d=='all': mask=Image.new('L',(W,H),int(255*alpha))
    else:
        mask=g.resize((W,H)) if d in('left','right') else g.rotate(-90,expand=True).resize((W,H))
        if d=='right': mask=ImageOps.mirror(mask)
        if d=='bottom': mask=ImageOps.flip(mask)
    layer=Image.new('RGBA',(W,H),color+(0,)); layer.putalpha(mask); return layer

def scrim(a):
    grad(a.w,a.h,a.dir,a.alpha,hexrgb(a.color),a.stop).save(a.out); print(a.out)

def split(a):
    im=Image.open(a.inp); y=round(im.height*a.cut)
    if a.part=='top': im.crop((0,0,im.width,y)).save(a.out); print(a.out,'place at same x,y; height = h *',a.cut)
    else: im.crop((0,y,im.width,im.height)).save(a.out); print(a.out,'place at y + h *',a.cut)

def noise(a):
    base=Image.new('RGB',(a.w,a.h),hexrgb(a.color)); random.seed(7)
    n=Image.effect_noise((a.w,a.h),a.amount*6).filter(ImageFilter.GaussianBlur(.6))
    n=ImageOps.autocontrast(n).point(lambda v:int((v-128)*a.amount/100+128))
    im=ImageChops.overlay(base,Image.merge('RGB',(n,n,n))); im.save(a.out,quality=92); print(a.out)

def mesh(a):
    cols=[hexrgb(c) for c in a.colors.split(',')]; w,h=64,36
    im=Image.new('RGB',(w,h)); pts=[(0,0),(w,0),(w,h),(0,h)]
    for y in range(h):
        for x in range(w):
            ws=[1/((x-px)**2+(y-py)**2+40)**1.4 for px,py in pts]; s=sum(ws)
            im.putpixel((x,y),tuple(int(sum(c[k]*wt for c,wt in zip(cols,ws))/s) for k in range(3)))
    im.resize((a.w,a.h),Image.BICUBIC).filter(ImageFilter.GaussianBlur(30)).save(a.out,quality=92); print(a.out)

def glow(a):
    W,H=a.w,a.h; bg=Image.new('RGB',(W,H),hexrgb(a.bg)); gx,gy=(float(v) for v in a.at.split(','))
    m=Image.new('L',(W,H),0); d=ImageDraw.Draw(m); r=int(W*.32)
    d.ellipse((W*gx-r,H*gy-r*.8,W*gx+r,H*gy+r*.8),fill=110); m=m.filter(ImageFilter.GaussianBlur(W*.09))
    bg.paste(Image.new('RGB',(W,H),hexrgb(a.color)),(0,0),m); bg.save(a.out,quality=92); print(a.out)

p=argparse.ArgumentParser(); sp=p.add_subparsers(dest='cmd',required=True)
c=sp.add_parser('cover'); c.add_argument('inp'); c.add_argument('out'); c.add_argument('--w',type=int,required=True); c.add_argument('--h',type=int,required=True)
c.add_argument('--pos',default='0.5,0.5'); c.add_argument('--radius',type=int,default=0); c.add_argument('--arch',action='store_true')
c.add_argument('--gray',action='store_true'); c.add_argument('--warm',action='store_true'); c.add_argument('--scrim'); c.add_argument('--darken',type=float,default=0)
s=sp.add_parser('scrim'); s.add_argument('out'); s.add_argument('--w',type=int,default=1920); s.add_argument('--h',type=int,default=1080)
s.add_argument('--dir',default='left'); s.add_argument('--alpha',type=float,default=.65); s.add_argument('--color',default='000000'); s.add_argument('--stop',type=float,default=.62)
x=sp.add_parser('split'); x.add_argument('inp'); x.add_argument('--cut',type=float,required=True); x.add_argument('--part',default='top',choices=['top','bottom']); x.add_argument('out')
n=sp.add_parser('noise'); n.add_argument('out'); n.add_argument('--w',type=int,default=1920); n.add_argument('--h',type=int,default=1080); n.add_argument('--color',default='F6F2EC'); n.add_argument('--amount',type=int,default=10)
m=sp.add_parser('mesh'); m.add_argument('out'); m.add_argument('--w',type=int,default=1920); m.add_argument('--h',type=int,default=1080); m.add_argument('--colors',default='FF5DA2,9B5CFF,4FE3D6,FFB36B')
g=sp.add_parser('glow'); g.add_argument('out'); g.add_argument('--w',type=int,default=1920); g.add_argument('--h',type=int,default=1080); g.add_argument('--color',default='D9C38A'); g.add_argument('--at',default='0.7,0.4'); g.add_argument('--bg',default='07090C')
a=p.parse_args(); {'cover':cover,'scrim':scrim,'split':split,'noise':noise,'mesh':mesh,'glow':glow}[a.cmd](a)
