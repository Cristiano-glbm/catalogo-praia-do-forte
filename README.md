# Catálogo virtual — Leilão Praia do Forte

Site estático (HTML + CSS + JS puro, sem frameworks) do catálogo do **Leilão Praia do Forte – Nelore Jacuricy e Nelore Trento & Convidados**, apresentado pela **Valor Assessoria Pecuária**.

## Estrutura

```
catalogo-praia-do-forte/
├── public/                  ← PASTA PUBLICADA (é isso que vai ao ar)
│   ├── index.html
│   ├── 404.html             página de erro com a identidade do site
│   ├── robots.txt
│   ├── _headers             cabeçalhos de segurança (CSP, HSTS…) e cache
│   └── assets/
│       ├── css/styles.css
│       ├── js/
│       │   ├── boot.js      remove a classe "no-js" (roda no <head>)
│       │   ├── app.js       contagem, busca, janelas, teclado, vídeo   (opcional: o site funciona sem JS)
│       │   └── ambient.js   som ambiente + controle de volume/mudo
│       ├── video/
│       │   ├── completo/    vídeo completo de cada lote (720p, com som): lote-pf, lote-01 … lote-27
│       │   ├── previa/      trecho de 8 s em loop, sem som, para o quadro do animal
│       │   └── capas/       imagem de capa de cada vídeo
│       ├── audio/ambiente.m4a    trilha de fundo (extraída do vídeo enviado)
│       ├── fonts/           Playfair Display, Jost e Pinyon Script (hospedadas aqui, sem Google Fonts)
│       └── img/
│           ├── animais/     fotos principais recortadas (m<id>.webp)
│           ├── familia/     fotos de mãe/avó/filhas (r<id>.webp)
│           └── ui/          logo, cena da praia, céu, grama, ícones, og-image
├── source/                  ← fontes para regerar o site
│   ├── build.py             gerador de public/
│   ├── make_single.py       gera a versão de arquivo único (extras/)
│   ├── data.py              dados dos 25 lotes (edite aqui)
│   ├── assets-map.json      mapa chave → arquivo de imagem
│   ├── templates/           page.html e 404.html
│   ├── styles/              base.css, extra.css, a11y.css, ambient.css
│   └── scripts/             boot.js, app.js, ambient.js  (copiados para public/assets/js/)
├── extras/
│   └── catalogo-arquivo-unico.html   versão em 1 arquivo (imagens, fontes e trechos de 6 s dos vídeos embutidos), sem áudio nem vídeos completos — p/ WhatsApp/e-mail/duplo clique
├── netlify.toml             configuração do deploy (publish = public)
├── PROMPT-SITE-COMPLETO.md  especificação completa do projeto
└── README.md
```

## Deploy na Netlify

Não há etapa de build obrigatória: a pasta `public/` já está pronta.

**Atenção ao tamanho:** os vídeos somam ~255 MB. Prefira a opção B (Git) ou C (CLI); o arrastar e soltar pode demorar ou falhar.

**Opção A — arrastar e soltar:** acesse https://app.netlify.com/drop e arraste a pasta **`public`**.
> Os cabeçalhos de segurança e cache ficam em `public/_headers`, que a Netlify aplica em qualquer tipo de deploy (inclusive este).

**Opção B — via Git (recomendada):** suba esta pasta para um repositório → Netlify: *Add new site → Import an existing project*. Os campos vêm do `netlify.toml` (publish: `public`, sem build).

**Opção C — Netlify CLI**
```bash
npm i -g netlify-cli && netlify login
netlify deploy --dir=public          # prévia
netlify deploy --dir=public --prod   # produção
```

**Domínio próprio:** *Site configuration → Domain management → Add a domain* (HTTPS automático).

**Depois de publicar**, regere com o endereço final para que o WhatsApp/Facebook mostrem a imagem de prévia (o `og:image` precisa ser absoluto):
```bash
SITE_URL=https://seu-site.netlify.app python3 source/build.py
```

## Testar localmente

```bash
cd public && python3 -m http.server 8080     # abra http://localhost:8080
```
Dê preferência ao servidor local. Abrir `public/index.html` com duplo clique faz o Chrome bloquear fontes e máscaras (regra do navegador para `file://`); para duplo clique use `extras/catalogo-arquivo-unico.html`.

## Som ambiente

- Arquivo: `public/assets/audio/ambiente.m4a` (AAC 72 kbps, 4 min 21 s, normalizado e com fade nas pontas para repetir sem estalo).
- **Controle no canto superior direito:** botão de alto-falante (1 clique = mudo/ativar) e barra de volume. No celular a barra abre numa bandeja ao tocar no botão e some sozinha.
- **Início:** navegadores não permitem som antes de o visitante interagir. O site tenta tocar sozinho; se for bloqueado, começa no primeiro toque/clique/tecla (o botão pulsa até lá).
- Lembra volume e "mudo" entre visitas, pausa ao trocar de aba e **pausa enquanto um vídeo do YouTube toca** (volta ao fechar).
- Sem JavaScript o controle não aparece (nada de botão morto). No iPhone o volume é feito por Web Audio (o iOS ignora `audio.volume`).
- **Trocar a música:** substitua `public/assets/audio/ambiente.m4a` (mesmo nome) — ex.: `ffmpeg -i nova.mp3 -af "loudnorm=I=-16:TP=-1.5,afade=t=in:d=1.5,afade=t=out:st=<duração-2.5>:d=2.5" -c:a aac -b:a 72k -movflags +faststart ambiente.m4a`.
- **Direitos autorais:** a trilha extraída do vídeo é uma gravação comercial. Para uso público/comercial, confirme a licença (ECAD/editora/gravadora) ou troque por uma faixa livre/licenciada.

## Segurança (resumo)

| Item | Como está |
|---|---|
| CSP | `script-src 'self'`, `style-src 'self'` (nenhum script/estilo inline), imagens, vídeos e áudio só do próprio site, `frame-src 'none'`, `connect-src 'none'`, `frame-ancestors 'none'`. Aplicada por cabeçalho (`public/_headers`) **e** por `<meta>` |
| Cabeçalhos | HSTS, `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Cross-Origin-Opener-Policy`, `Permissions-Policy` (câmera, microfone, localização, pagamento, USB desativados) |
| Terceiros | **Nenhum.** Sem Google Fonts (fontes hospedadas), sem YouTube (vídeos próprios), sem analytics, sem bibliotecas |
| Links externos | `rel="noopener noreferrer"`; nenhum `iframe` na página |
| JS | Sem `innerHTML` com dados externos, sem `eval`, sem handlers inline; `localStorage` só guarda volume/mudo (com `try/catch`) |
| Dados | Nenhum formulário, cookie ou coleta de dados pessoais. Contato é sempre via WhatsApp (link `wa.me`) |

Para validar depois do deploy: https://securityheaders.com e https://observatory.mozilla.org.

## Acessibilidade e UX

- Navegação 100% por teclado (inclusive abrir fichas/vídeos, `Esc` fecha, foco preso na janela e devolvido ao fechar); link "Ir para os lotes".
- Contraste AA em modo claro e escuro; foco visível; alvos de toque ≥ 40–44 px; `prefers-reduced-motion` desliga todas as animações; `prefers-color-scheme` automático; áreas seguras do iPhone.
- Contagem regressiva sem anúncio a cada segundo para leitores de tela; resultado da busca anunciado; filtro ativo marcado (`aria-current`).
- Funciona **sem JavaScript** (filtros por `:target`, janelas por rádio + `label`). Sem JS os botões-`label` respondem a toque/clique, não ao teclado (o teclado é melhoria do JS).

## Como editar

**Textos/dados de um lote** — edite `source/data.py` e regere:
```bash
pip install pillow
python3 source/build.py          # gera public/
python3 source/make_single.py    # (opcional) gera extras/catalogo-arquivo-unico.html
```
**Trocar a foto de um animal** — substitua o arquivo em `public/assets/img/animais/` mantendo o nome (WebP/PNG transparente, ~760 px de largura, recorte terminando nas pernas).
**WhatsApp** — `WA_NUM` em `source/build.py`.
**Data do evento** — `START` em `source/scripts/app.js` (UTC: 06/11/2026 19h BRT = 22h UTC).
**Vídeos** — ficam em `public/assets/video/` com o nome do lote (`lote-pf`, `lote-01` … `lote-27`; os lotes 07, 10 e 13 não existem no catálogo):
- `completo/lote-XX.mp4` — toca em tela cheia, com som e controles (H.264 720p + AAC, ~10 MB).
- `previa/lote-XX.mp4` — trecho de 8 s em loop, sem som, no quadro da tela do animal (640×360, ~0,5 MB).
- `capas/lote-XX.jpg` — capa exibida enquanto o vídeo carrega.

Para trocar um vídeo, substitua os três arquivos mantendo o nome. Comandos usados (ffmpeg):
```bash
# completo
ffmpeg -i original.mov -vf scale=1280:720 -c:v libx264 -preset veryfast -crf 28 -maxrate 1200k -bufsize 2400k -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart completo/lote-XX.mp4
# prévia (8 s a partir de 30% do vídeo)
ffmpeg -ss <inicio> -t 8 -i original.mov -an -vf scale=640:360,fps=30 -c:v libx264 -preset slow -crf 30 -pix_fmt yuv420p -movflags +faststart previa/lote-XX.mp4
# capa
ffmpeg -ss <inicio> -i original.mov -frames:v 1 -vf scale=960:540 -q:v 5 capas/lote-XX.jpg
```
Os vídeos só carregam quando o visitante abre o animal (nada pesa na abertura da página). Com *movimento reduzido* ou *economia de dados* ativos, o quadro mostra só a capa; o vídeo completo continua a um toque.
**Tela cheia girada** — ao tocar no quadro, o vídeo expande e gira 90° na horizontal (como o YouTube), mesmo com o celular travado na vertical; no Android/computador usa tela cheia real e trava em paisagem. `Esc` ou ✕ volta ao quadro. Enquanto o vídeo completo toca, o som ambiente pausa sozinho.
**Originais pesados** — mantenha os vídeos originais fora de `public/` (ex.: pasta `videos-originais/`, já no `.gitignore`); tudo que está em `public/` vai ao ar.
**Se o acesso crescer** — mova `assets/video/` para um CDN de vídeo (Bunny/Cloudflare Stream/S3) e troque os caminhos `data-prev` / `data-full` / `data-poster` em `source/build.py` (e o domínio em `media-src` da CSP).
> Sempre edite em `source/` e rode o build: mexer direto em `public/` é sobrescrito na próxima geração.

## Regras do projeto (manter em qualquer alteração)

1. Pernas dos animais nunca cortadas soltas (sempre apoiadas na grama ou no painel).
2. A tela do vídeo cabe inteira no celular, sem rolagem (testado de 320×568 a 430×932, nos 25 lotes); a tela cheia gira para a horizontal.
3. Tudo funciona **sem JavaScript**; o JS só melhora.
4. Nada de link (`<a>`) em animais/botões internos — evita o menu de "pressionar e segurar" do iPhone.
5. Respeitar `prefers-reduced-motion`, modo claro/escuro e áreas seguras do iPhone.
6. Dados idênticos ao catálogo impresso.
7. Nada de `style=""`, `<script>` inline ou `on*=""` no HTML: a CSP bloqueia (use classes e arquivos em `assets/`).

## Compatibilidade

Safari iOS 15.4+, Chrome, Edge, Firefox (versões atuais). Testado de 320 px a 1280 px, claro/escuro, com e sem JavaScript.
