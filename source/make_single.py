# Gera extras/catalogo-arquivo-unico.html: o mesmo site em UM arquivo (CSS, JS, fontes, imagens e trechos de 6 s dos vídeos embutidos),
# ideal para enviar por WhatsApp/e-mail ou abrir com duplo clique. Não inclui o áudio ambiente nem os vídeos completos (ficariam pesados demais).
# Uso: python3 source/make_single.py   (rode depois de source/build.py; requer ffmpeg para gerar os trechos)
import base64, mimetypes, os, re, subprocess, tempfile
HERE=os.path.dirname(os.path.abspath(__file__)); ROOT=os.path.dirname(HERE); PUB=os.path.join(ROOT,'public')
mimetypes.add_type('font/woff2','.woff2'); mimetypes.add_type('image/webp','.webp')
rd=lambda p:open(os.path.join(PUB,*p.split('/')),encoding='utf-8').read()
def uri(rel):
    p=os.path.join(PUB,*rel.split('/')); m=mimetypes.guess_type(p)[0] or 'application/octet-stream'
    return f'data:{m};base64,'+base64.b64encode(open(p,'rb').read()).decode()
html=rd('index.html')
# sem CSP por meta (o arquivo único precisa de estilos/scripts inline), sem preloads, sem og:image relativa, sem áudio
html=re.sub(r'<meta http-equiv="Content-Security-Policy"[^>]*>\n?','',html)
html=re.sub(r'<link rel="preload"[^>]*>\n?','',html)
html=re.sub(r'<meta property="og:image"[^>]*>\n?','',html)
html=re.sub(r'<script src="assets/js/ambient.js"[^>]*></script>\n?','',html)
# CSS com url(...) embutidas
css=rd('assets/css/styles.css')
css=re.sub(r'url\(\.\./((?:img|fonts)/[^)]+)\)',lambda m:f'url({uri("assets/"+m.group(1))})',css)
html=html.replace('<link rel="stylesheet" href="assets/css/styles.css">','<style>'+css+'</style>')
# JS inline
for name in ('boot','app'):
    js=rd(f'assets/js/{name}.js'); assert '</script' not in js
    html=re.sub(rf'<script src="assets/js/{name}.js"[^>]*></script>',lambda m:'<script>'+js+'</script>',html)
# vídeos: troca o <video> do site (prévia + completo em arquivos) por um trecho de 6 s embutido, mudo e em loop
tmp=tempfile.mkdtemp()
def mini(m):
    tag=m.group(0); k=re.search(r'data-prev="assets/video/previa/(lote-[^"]+)\.mp4"',tag).group(1)
    out=os.path.join(tmp,k+'.mp4')
    subprocess.run(['ffmpeg','-v','error','-y','-i',os.path.join(PUB,'assets','video','previa',k+'.mp4'),'-t','6','-an','-vf','scale=480:270',
        '-c:v','libx264','-preset','veryfast','-crf','36','-pix_fmt','yuv420p','-movflags','+faststart',out],check=True)
    lab=re.search(r'aria-label="([^"]*)"',tag).group(1)
    return f'<video class="vid-el" muted loop playsinline autoplay preload="auto" aria-label="{lab}" disablepictureinpicture src="data:video/mp4;base64,'+base64.b64encode(open(out,'rb').read()).decode()+'"></video>'
html=re.sub(r'<video class="vid-el"[^>]*>(?:</video>)?',mini,html)
# imagens e ícones
html=re.sub(r'(src|href)="(assets/img/[^"]+)"',lambda m:f'{m.group(1)}="{uri(m.group(2))}"',html)
assert 'assets/' not in html, re.findall(r'.{30}assets/.{30}',html)[:3]
out=os.path.join(ROOT,'extras','catalogo-arquivo-unico.html'); os.makedirs(os.path.dirname(out),exist_ok=True)
open(out,'w',encoding='utf-8',newline='\n').write(html)
print('extras/catalogo-arquivo-unico.html', round(len(html)/1e6,2),'MB')
