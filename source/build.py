# Gera public/index.html, public/404.html, assets/css/styles.css e copia assets/js/*.js a partir de source/.
# Uso: python3 source/build.py            (requer Python 3.9+ e Pillow)
#      SITE_URL=https://seu-site.netlify.app python3 source/build.py   (URLs absolutas para WhatsApp/Facebook: og:image, canonical)
import json, html, data, base64, io, re
from urllib.parse import quote, urlparse, parse_qs
from PIL import Image
import os
HERE=os.path.dirname(os.path.abspath(__file__)); ROOT=os.path.dirname(HERE); PUB=os.path.join(ROOT,'public')
os.chdir(HERE)
J=json.load(open('assets-map.json',encoding='utf-8')); IMG=J['IMG']; D=J['D']
SITE_URL=os.environ.get('SITE_URL','').rstrip('/')
def dim(path):
    i=Image.open(os.path.join(PUB,'assets','img',path)); return i.width,i.height
def ar(path):
    i=Image.open(os.path.join(PUB,'assets','img',path)); return f'{i.width}/{i.height}'
C=lambda p:'../img/'+p   # caminho visto pelo CSS
H=lambda p:'assets/img/'+p  # caminho visto pelo HTML
E=lambda s: html.escape(str(s or ''),quote=True)
WA_NUM="5562998119850"
NEWTAB='<span class="sr"> (abre em nova aba)</span>'
WAICON='<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.2A9.7 9.7 0 0 0 3.7 16.9L2.3 21.8l5-1.3A9.7 9.7 0 1 0 12 2.2Zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.6.3 2.7 2.7 0 0 0-.9 2c0 1.2.9 2.4 1 2.5.1.2 1.8 2.7 4.3 3.8 1.6.7 2.2.7 3 .6.5-.1 1.4-.6 1.6-1.2.2-.6.2-1.1.1-1.2l-.6-.4Z"/></svg>'
WA_GEN=f"https://wa.me/{WA_NUM}?text="+quote("Olá! Vim pelo catálogo do Leilão Praia do Forte.")
MODS={
 'venda50':("50% À venda","Você compra metade do animal e vira sócio do criador. Crias e embriões são divididos conforme o contrato."),
 'animal':("Animal","O animal é vendido por inteiro e vai para a sua fazenda."),
 'aspiracao':("Aspiração","Você leva uma aspiração da doadora: os oócitos coletados são fecundados com o touro que você escolher."),
 'prenhez':("Prenhez","Você leva uma gestação confirmada do acasalamento indicado, com previsão de parto."),
 'pacote':("Pacote duplo de aspiração","Uma aspiração de cada uma das duas doadoras do lote, em um só lance.")}
short=lambda m: MODS[m][0].replace("Pacote duplo de aspiração","Pacote duplo")
slug=lambda l:"lote-"+l['num'].lower()
lab=lambda l:"Praia do Forte" if l['num']=="PF" else l['num']
def ytid(u): return parse_qs(urlparse(u).query)['v'][0]
def wa(l):
    n=" e ".join(a['name']+" "+a['affix'] for a in l['animals'])
    return f"https://wa.me/{WA_NUM}?text="+quote(f"Olá! Tenho interesse no Lote {lab(l)} – {n}, do Leilão Praia do Forte.")
def title(l):
    a=l['animals']; return E(a[0]['name']+(" & "+a[1]['name'] if len(a)>1 else ""))
def ped(a):
    return f'<div class="ped"><div class="s">{E(a["sire"])}</div><div class="x">×</div><div class="dwrap"><span class="gp">{E(a["ds"])}</span><span class="d">{E(a["dam"])}</span><span class="gp">{E(a["dd"])}</span></div></div>'
def herd(l,link=True):
    two=len(l['animals'])>1; out=[]
    for a in l['animals']:
        inner=f'<span class="cimg i-m{a["main"]}" role="img" aria-label="{E(a["name"]+" "+a["affix"])}"></span>'
        out.append(f'<label class="cow" for="o-v-{slug(l)}" aria-label="Assistir ao vídeo de {E(a["name"])}">{inner}</label>' if link else f'<span class="cow">{inner}</span>')
    return f'<div class="herd{" two" if two else ""}">{"".join(out)}</div>'
def stage(l,first=False):
    return (f'<div class="stage"><div class="sky"></div><div class="isle" aria-hidden="true"></div><div class="grass"></div>{herd(l)}<div class="church" aria-hidden="true"></div>'
            f'<label class="vid" for="o-v-{slug(l)}">VÍDEO <span class="play" aria-hidden="true"></span></label>'+('<span class="tap">Toque no animal</span>' if first else '')+'</div>')
L=data.L
cards=[];sheets=[];players=[]
for i,l in enumerate(L):
    a=l['animals']; s=slug(l); prev=slug(L[i-1]); nxt=slug(L[(i+1)%len(L)])
    if len(a)==1:
        nm=f'<span class="nm">{E(a[0]["name"])}</span><span class="af">{E(a[0]["affix"])}</span>'
        meta=f'<p class="meta">RG <b>{E(a[0]["rg"])}</b> · Nasc. <b>{E(a[0]["nasc"])}</b>'+(f' · {E(a[0]["sexo"])}' if a[0]['sexo'] else '')+'</p>'
    else:
        af=a[0]['affix'] if a[0]['affix']==a[1]['affix'] else a[0]['affix']+' · '+a[1]['affix']
        nm=f'<span class="nm">{E(a[0]["name"])} &amp; {E(a[1]["name"])}</span><span class="af">{E(af)}</span>'
        meta=f'<p class="meta">{len(a)} animais no lote</p>'
    if l.get('extra'): nm+=f'<span class="extra">{E(l["extra"])}</span>'
    facts=([a[0]['peso']] if len(a)==1 and a[0]['peso'] else [])+l['notes']
    factsh=f'<ul class="facts">{"".join(f"<li>{E(f)}</li>" for f in facts)}</ul>'
    cards.append(f'''<article class="lot" data-mod="{l['mod']}" id="card-{s}">
<div class="lot-top"><span class="lot-no"><small>LOTE</small><b>{E(l['num'])}</b></span><span class="lot-mod">{short(l['mod'])}</span></div>
<p class="owners">{E(l['owners'])}</p><h3 class="names">{nm}</h3>{meta}
{stage(l,i==0)}
{ped(a[0]) if len(a)==1 else ''}
{factsh}
<div class="more"><label class="btn" for="o-{s}">Ficha completa</label><a class="btn wa" href="{E(wa(l))}" target="_blank" rel="noopener noreferrer">{WAICON}Tenho interesse{NEWTAB}</a></div>
</article>''')
    blocks="".join(f'''<div class="animal-block"><div class="nm">{E(x['name'])}</div><div class="af">{E(x['affix'])}</div>
<dl class="kv"><dt>RG</dt><dd>{E(x['rg'])}</dd><dt>Nascimento</dt><dd>{E(x['nasc'])}</dd>{f"<dt>Sexo</dt><dd>{E(x['sexo'])}</dd>" if x['sexo'] else ""}{f"<dt>Peso</dt><dd>{E(x['peso'])}</dd>" if x['peso'] else ""}</dl>
<div class="tree tree4"><div class="sire"><small>Pai</small>{E(x['sire'])}</div><div class="gp"><small>Avô materno</small>{E(x['ds'])}</div><div class="dam"><small>Mãe</small>{E(x['dam'])}</div><div class="gp"><small>Avó materna</small>{E(x['dd'])}</div></div></div>''' for x in a)
    rels="".join(f'<figure class="rel"><div class="st"><span class="rimg i-r{x}" role="img" aria-label="{E(n)}"></span></div><figcaption>{E(n)}{f"<span>{E(c)}</span>" if c else ""}</figcaption></figure>' for x,n,c in l['rels'])
    head=f'<span class="lot-no"><small>LOTE</small><b>{E(l["num"])}</b></span><span class="lot-mod">{short(l["mod"])}</span>'
    sheets.append(f'''<input type="radio" name="ov" class="ovr" id="o-{s}" tabindex="-1" aria-hidden="true"><div class="ov sheet" role="dialog" aria-modal="true" aria-label="Ficha do lote {lab(l)}"><label class="ov-bg" for="o-none" aria-hidden="true"></label><div class="ov-box">
<div class="dlg-head">{head}<label class="icon-btn push" for="o-{prev}" aria-label="Lote anterior">‹</label><label class="icon-btn" for="o-{nxt}" aria-label="Próximo lote">›</label><label class="icon-btn" for="o-none" aria-label="Fechar">✕</label></div>
<div class="dlg-body"><div><p class="owners first">{E(l['owners'])}</p>{f'<p class="meta gold">{E(l["extra"])}</p>' if l.get('extra') else ''}{stage(l)}
{f'<div class="dlg-notes"><h4>Destaques</h4>{factsh}</div>' if facts else ''}
<div class="dlg-cta"><label class="btn solid" for="o-v-{s}">▶ Assistir ao vídeo</label><a class="btn" href="{E(wa(l))}" target="_blank" rel="noopener noreferrer">{WAICON}Tenho interesse{NEWTAB}</a></div>
<p class="note">{MODS[l['mod']][0]}: {MODS[l['mod']][1]}</p></div>
<div>{blocks}{f'<div class="rels"><h4>Família</h4><div class="rel-row">{rels}</div></div>' if rels else ''}</div></div></div></div>''')
    vid=ytid(l['video'])
    def pinfo(x,compact):
        meta=" · ".join(v for v in [f"RG {x['rg']}",f"Nasc. {x['nasc']}",x['peso'] or ""] if v)
        if compact:
            return f'<div class="pi"><p class="pi-nm">{E(x["name"])}</p><p class="pi-af">{E(x["affix"])}</p><p class="pi-par"><b>{E(x["sire"])}</b> × <b>{E(x["dam"])}</b></p></div>'
        return (f'<div class="pi"><p class="pi-nm">{E(x["name"])}</p><p class="pi-af">{E(x["affix"])}</p><p class="pi-meta">{E(meta)}</p>'
                f'<div class="pi-ped"><div class="s"><small>Pai</small>{E(x["sire"])}</div><div class="x">×</div><div class="d"><span>{E(x["ds"])}</span><b><small>Mãe</small>{E(x["dam"])}</b><span>{E(x["dd"])}</span></div></div></div>')
    two=len(a)>1
    note=(f'<p class="pi-note">{E(l["notes"][0])}</p>' if l['notes'] else '')
    players.append(f'''<input type="radio" name="ov" class="ovr" id="o-v-{s}" tabindex="-1" aria-hidden="true"><div class="ov player" role="dialog" aria-modal="true" aria-label="Vídeo do lote {lab(l)}"><label class="ov-bg" for="o-none" aria-hidden="true"></label><div class="pl">
<div class="pl-top">{head}<label class="icon-btn push" for="o-none" aria-label="Fechar">✕</label></div>
<div class="spot">{herd(l,False)}</div>
<div class="pl-info{" two" if two else ""}"><div class="pi-row">{"".join(pinfo(x,two) for x in a)}</div>{note}</div>
<div class="vframe"><a class="vposter" href="{E(l['video'])}" target="_blank" rel="noopener noreferrer" data-yt="{vid}" aria-label="Assistir ao vídeo de {title(l)}"><img class="vthumb" src="https://i.ytimg.com/vi/{vid}/hqdefault.jpg" alt="" width="480" height="360" loading="lazy" decoding="async" referrerpolicy="no-referrer"><span class="vshade"></span><span class="vplay" aria-hidden="true"></span><span class="vlabel">Toque para assistir</span></a></div>
<div class="pl-cta"><a class="btn wa" href="{E(wa(l))}" target="_blank" rel="noopener noreferrer">{WAICON}Tenho interesse{NEWTAB}</a><label class="btn" for="o-{s}">Ficha completa</label></div>
</div></div>''')
counts={}
for l in L: counts[l['mod']]=counts.get(l['mod'],0)+1
fs="".join(f'<span class="f" id="f-{k}"></span>' for k in MODS)
chips='<a class="chip chip-all" href="#lotes">Todos<i>%d</i></a>'%len(L)+"".join(f'<a class="chip" href="#f-{k}">{m[0]}<i>{counts.get(k,0)}</i></a>' for k,m in MODS.items())
modlist="".join(f'<li><a href="#f-{k}"><b>{m[0]}</b><span>{m[1]}</span><em>Ver {counts.get(k,0)} {"lote" if counts.get(k,0)==1 else "lotes"} ›</em></a></li>' for k,m in MODS.items())
lg=D['logo']
# ---------------- CSS ----------------
FONTCSS="""/* fontes hospedadas no próprio site (sem Google Fonts: mais rápido, privado e compatível com CSP estrita) */
@font-face{font-family:"Playfair Display";font-style:normal;font-weight:400 900;font-display:swap;src:url(../fonts/playfair-display-latin-wght-normal.woff2) format("woff2")}
@font-face{font-family:"Jost";font-style:normal;font-weight:100 900;font-display:swap;src:url(../fonts/jost-latin-wght-normal.woff2) format("woff2")}
@font-face{font-family:"Pinyon Script";font-style:normal;font-weight:400;font-display:swap;src:url(../fonts/pinyon-script-latin-400-normal.woff2) format("woff2")}
"""
rd=lambda f:open(f,encoding='utf-8').read()
css=FONTCSS+rd('styles/base.css')
imgcss="".join(f".i-{k}{{background-image:url({C(v)})}}\n" for k,v in IMG.items())
css+=f"\n:root{{--skyimg:url({C(D['sky'])});--grassimg:url({C(D['grass'])});--logo:url({C(lg)});--lr:{ar(lg)};--vink:url({C(D['valor_ink'])});--vr:{D['valor_ratio']};--sr:{D['scene_ratio']};--isle:url({C(D['island'])});--isler:{ar(D['island'])};--church:url({C(D['church'])});--churchr:{ar(D['church'])}}}\n"+imgcss
css+=rd('styles/extra.css')
fil="".join(f'#f-{k}:target~.wrap .lot:not([data-mod="{k}"]){{display:none}}\n#f-{k}:target~.tools .chip[href="#f-{k}"]{{background:var(--ink);color:var(--paper);border-color:var(--ink)}}\n' for k in MODS)
css+=fil
css+=rd('styles/a11y.css')+rd('styles/ambient.css')
# ---------------- HTML ----------------
VAL=lambda cls: f'<div class="{cls}" role="img" aria-label="Valor Assessoria Pecuária"><div class="ink"></div><img src="{H(D["valor_gold"])}" alt=""></div>'
CSP=("default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' https://i.ytimg.com; font-src 'self'; media-src 'self'; "
     "frame-src https://www.youtube-nocookie.com; connect-src 'none'; manifest-src 'self'; base-uri 'none'; form-action 'none'; object-src 'none'")
CSPMETA=f'<meta http-equiv="Content-Security-Policy" content="{CSP}">'
absu=lambda path:(SITE_URL+'/'+path) if SITE_URL else path
CANON=('<link rel="canonical" href="'+SITE_URL+'/">\n') if SITE_URL else ''
HEADX=f'''<link rel="icon" type="image/png" href="assets/img/ui/favicon.png">
<link rel="apple-touch-icon" href="assets/img/ui/apple-touch-icon.png">
{CANON}<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:title" content="Leilão Praia do Forte · Catálogo virtual">
<meta property="og:description" content="Nelore Jacuricy e Nelore Trento & Convidados · 06 de novembro, 19h · Praia do Forte / Bahia · Valor Assessoria Pecuária">
<meta property="og:image" content="{absu('assets/img/ui/og-image.jpg')}">
<meta name="twitter:card" content="summary_large_image">'''
tpl=rd('templates/page.html')
sw,sh=dim(D['scene2'])
rep={'__CSPMETA__':CSPMETA,'__HEADX__':HEADX,'__WAICON__':WAICON,'__NEWTAB__':NEWTAB,'__WAGEN__':E(WA_GEN),'__VAL__':VAL("valor"),'__VALMINI__':VAL("valor-mini"),'__VALTAG__':VAL("valor-tag"),'__N__':str(len(L)),
 '__SCENE__':H(D['scene2']),'__SCENEW__':str(sw),'__SCENEH__':str(sh),'__FS__':fs,'__CHIPS__':chips,'__CARDS__':"".join(cards),'__MODLIST__':modlist,
 '__SHEETS__':'<input type="radio" name="ov" class="ovr" id="o-none" checked tabindex="-1" aria-hidden="true">'+"".join(sheets),'__PLAYERS__':"".join(players),
 '__AMBIENT__':'<script src="assets/js/ambient.js" defer data-src="assets/audio/ambiente.m4a"></script>'}
for k,v in rep.items(): tpl=tpl.replace(k,v)
left=re.findall(r'__[A-Z]+__',tpl); assert not left,("placeholders sem valor",left)
# ---------------- saída ----------------
import shutil
def w(path,txt): open(os.path.join(PUB,*path.split('/')),'w',encoding='utf-8',newline='\n').write(txt)
w('assets/css/styles.css',css)
for f in ('boot.js','app.js','ambient.js'): shutil.copyfile(os.path.join('scripts',f),os.path.join(PUB,'assets','js',f))
w('index.html',tpl)
# 404 (mesmo visual, caminhos absolutos porque pode ser servida em qualquer URL)
nf=rd('templates/404.html').replace('__CSPMETA__',CSPMETA).replace('__VALTAG__',VAL("valor-mini").replace('assets/','/assets/'))
w('404.html',nf)
print('index.html',round(len(tpl)/1e3),'KB · styles.css',round(len(css)/1e3),'KB')
