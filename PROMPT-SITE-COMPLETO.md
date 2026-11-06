# Prompt completo — Catálogo virtual "Leilão Praia do Forte"

Use este documento como especificação para construir (ou reconstruir) o site. Uma versão pronta já existe na pasta `public/` deste projeto; este texto descreve **o que** o site precisa ser e **as regras** que não podem ser quebradas.

---

## 1. Objetivo

Landing page que funciona como **catálogo virtual de leilão de gado de elite (Nelore)**. O público é criador e investidor de alto padrão: o site precisa impressionar, ser didático e levar o cliente rápido ao animal, ao vídeo e ao WhatsApp da assessoria.

- **Evento:** Leilão Praia do Forte — Nelore Jacuricy e Nelore Trento & Convidados
- **Data:** 06 de novembro de 2026, às 19h (horário da Bahia, UTC-3)
- **Local:** Villa Global Education · Praia do Forte / Bahia
- **Transmissão:** Canal Rural · Retransmissão: Lance Rural e Remate Web
- **Assessoria (marca que apresenta o site):** Valor Assessoria Pecuária
- **WhatsApp:** +55 62 99811-9850 → `https://wa.me/5562998119850`
- **Total:** 25 lotes

## 2. Identidade visual (seguir o catálogo impresso)

- **Cores:** creme `#FDF9ED` (fundo claro), azul-marinho `#16275C` (texto/ícones), dourado `#9C7B2C` / `#E2C36F` (destaques), azul do céu das artes. Modo escuro automático: fundo `#0E1736`, texto creme `#F4EEDB`, dourado `#E2C36F`.
- **Tipografia (Google Fonts):** Playfair Display (títulos e números), Pinyon Script (nome dos animais e modalidades, como no catálogo), Jost (textos e botões). Sempre com fontes de reserva.
- **Moldura dupla** fina em volta da tela, como as páginas do catálogo.
- **Artes do catálogo:** cena da Praia do Forte (capa) intacta e sem animação; céu em arco, grama, ilha com farol e igrejinha compondo o "palco" de cada animal.
- **Logo da Valor** sem fundo: letras na cor do tema (azul no claro, creme no escuro) e o símbolo "VA" em dourado.

## 3. Estrutura da página (ordem obrigatória)

1. **Barra do topo** (fixa, uma linha): "Praia do Forte" + logo Valor pequena + WhatsApp (no celular, só ícone).
2. **Abas de seção:** Lotes · Local e transmissão · Como ler o catálogo.
3. **Abertura (centralizada):** logo Valor → "apresenta" (cursiva dourada) → logo "Leilão Praia do Forte" → "Nelore Jacuricy e Nelore Trento & Convidados" → "06 de novembro | 19h" entre fios → "PRAIA DO FORTE / BAHIA" → contagem regressiva → botões "Ver os 25 lotes" e "Falar no WhatsApp" → cena da praia.
4. **Os lotes:** selo pulsante "Toque no animal para assistir ao vídeo" → busca → **faixa fixa** (abas de seção + barra de filtros: Todos · 50% À venda · Animal · Aspiração · Prenhez · Pacote duplo, com contagem) → grade de cartões na ordem do catálogo.
5. **Local e transmissão** (faixa de cor diferente): logo Valor, "Dúvidas sobre os lotes ou cadastro para lances?", botão WhatsApp, data/local/transmissão em texto pequeno. **Sem** logos de patrocinadores/assessorias e sem logo grande do local.
6. **Como ler o catálogo** (outra faixa de cor), em perguntas que abrem/fecham: modalidades (cada uma com link "Ver X lotes" que filtra a lista), como ler a genealogia, siglas (FIV, TE, TN, oócitos, kg/dia, parida, prev. parto).
7. Rodapé curto.

## 4. Cartão do lote

Número do lote (pílula) + modalidade (cursiva dourada) · criador(es) · nome em cursiva + afixo espaçado · RG, nascimento, sexo · **palco** (céu em arco + ilha + grama + igrejinha, animal recortado por cima, rompendo o arco) com botão "VÍDEO" · genealogia (Pai × Mãe, com avô materno acima e avó materna abaixo) · destaques em etiquetas · botões "Ficha completa" e "Tenho interesse" (WhatsApp com mensagem pronta: "Olá! Tenho interesse no Lote XX – Nome Afixo, do Leilão Praia do Forte.").

## 5. Interações

- **Toque no animal / VÍDEO → tela do vídeo:** fundo da página desfocado e sem cor; o animal recortado surge crescendo (≈0,65 s, mola suave) com contorno levemente brilhante; **sem círculo/anel**. Abaixo: painel creme com nome, afixo, RG/nasc./peso, genealogia e destaque principal; depois o vídeo (capa do YouTube com botão de play pulsante — em navegador normal toca ali mesmo; em visualizadores sem JavaScript abre o YouTube); botões "Tenho interesse" e "Ficha completa".
- **Ficha completa:** janela que sobe de baixo (estilo iOS) com dados, árvore genealógica (pai, mãe, avô e avó maternos), destaques, família (fotos em arco com legenda), setas para lote anterior/próximo e fechar.
- **Filtros:** funcionam sem JavaScript (`:target`), preservam o estado ao abrir/fechar janelas.
- **Janelas (vídeo/ficha):** funcionam sem JavaScript (rádio + label). Ao fechar, a lista volta exatamente para onde estava.
- **Chamadas pulsantes:** selo "Toque no animal…", etiqueta "Toque no animal" do primeiro lote, botão flutuante do WhatsApp (ondas) e o play do vídeo.

## 6. Regras de qualidade (não negociáveis)

1. **Pernas nunca cortadas soltas:** o recorte do animal sempre termina apoiado na grama do palco ou encostado no topo do painel de informações.
2. **A tela do vídeo cabe inteira no celular** (do iPhone SE ao Pro Max) sem rolagem e sem nada cortado.
3. **Funciona sem JavaScript** (o visualizador de arquivos do app no iPhone não executa JS). JS só melhora: contagem regressiva, busca, parar o vídeo ao fechar, Esc, link direto `#lote-01`.
4. **Sem menu de "pressionar e segurar"** nos animais e botões (nada de links nesses elementos; `-webkit-touch-callout:none`).
5. **Sem rolagem lateral**, sem saltos de página, foco visível, `prefers-reduced-motion` respeitado (tudo para).
6. **Desempenho:** imagens WebP, cartões com `content-visibility:auto`, animações só de `transform`/`opacity`, sem bibliotecas externas.
7. Dados **idênticos ao catálogo impresso**.

## 7. Modalidades (texto exibido)

- **50% À venda:** Você compra metade do animal e vira sócio do criador. Crias e embriões são divididos conforme o contrato.
- **Animal:** O animal é vendido por inteiro e vai para a sua fazenda.
- **Aspiração:** Você leva uma aspiração da doadora: os oócitos coletados são fecundados com o touro que você escolher.
- **Prenhez:** Você leva uma gestação confirmada do acasalamento indicado, com previsão de parto.
- **Pacote duplo de aspiração:** Uma aspiração de cada uma das duas doadoras do lote, em um só lance.
- Aviso: "Condições de pagamento e regras seguem o regulamento oficial do leilão."

## 8. Dados dos lotes (ordem do catálogo)

| Lote | Modalidade | Animal | RG | Nasc. | Genealogia (avô / avó maternos) | Peso | Destaques | Vídeo |
|---|---|---|---|---|---|---|---|---|
| PF | Aspiração | Pérola FIV Sausalito | SAU 259 | 22/03/2021 | Landau da Di Genio × Egípcia FIV Machadinho (Kayak TE Mafra / Betina VI TE LRMS) | – | Média de 85 oócitos | https://www.youtube.com/watch?v=Vev2eMuIkuE&list=PLSfvKymQldIQ&index=1 |
| 01 | 50% À venda | Eudora da Mundial | MUN 4956 | 05/09/2023 | Landau da Di Genio × Naomi FIV Jacuricy (Donato de Navirai / Mogiana FIV Jacuricy) | 1.010 kg | Parida de fêmea desde 05/09, do Rima FIV Diego | https://www.youtube.com/watch?v=HN3yIMR0uDo&list=PLSfvKymQldIQ&index=2 |
| 02 | 50% À venda | Anita FIV Jacuricy | MPRF 3892 | 19/02/2024 | Opositor da Di Genio × Ogiana FIV Jacuricy (Heliaco da Java / Mogiana FIV Jacuricy) | 964 kg | Prenha do B5115 FIV da EAO; Previsão de parto: jun/27 | https://www.youtube.com/watch?v=9QN5_0RPgfQ&list=PLSfvKymQldIQ&index=3 |
| 03 | 50% À venda | Parla FIV Jacuricy | MPRF 4411 | 17/06/2025 | Landau da Di Genio × Parla da Mundial (Kayak TE Mafra / Parla FIV AJJ) | 676 kg | Prenha do Legat MJ; Previsão de parto: jun/27 | https://www.youtube.com/watch?v=eWnCLiLx_Kk&list=PLSfvKymQldIQ&index=4 |
| 04 | 50% À venda | Califórnia FIV Jacuricy | MPRF 4780 | 22/08/2026 | Boby HRO × Neve FIV Jacuricy (Rima FIV Diego / Mogiana FIV Jacuricy) | – | Livre escolha entre as duas bezerras | https://www.youtube.com/watch?v=dWjR3qhFQRc&list=PLSfvKymQldIQ&index=5 |
| 04 | 50% À venda | Raridade FIV Jacuricy | MPRF 4777 | 21/08/2026 | Landau da Di Genio × Neve FIV Jacuricy (Rima FIV Diego / Mogiana FIV Jacuricy) | – | Livre escolha entre as duas bezerras | https://www.youtube.com/watch?v=dWjR3qhFQRc&list=PLSfvKymQldIQ&index=5 |
| 05 | 50% À venda | Pintura FIV Jacuricy | MPRF 4757 | 05/03/2026 | Kayak TE Mafra × Ivi da Guanabara (Bitelo da SS / Cristalina FIV EBV S) | 385 kg | Ganho de 1,490 kg/dia | https://www.youtube.com/watch?v=2vkc7ZlhGEQ&list=PLSfvKymQldIQ&index=6 |
| 06 | Pacote duplo de aspiração | Neve FIV Jacuricy | MPRF 2303 | 16/01/2017 | Rima FIV Diego 4 × Mogiana FIV Jacuricy (Bvlgari TE da Sabia / Mogiana TE Vale) | – | Média de oócitos: Naomi 110 · Neve 80 | https://www.youtube.com/watch?v=mHYjdpdYl-k&list=PLSfvKymQldIQ&index=7 |
| 06 | Pacote duplo de aspiração | Naomi FIV Jacuricy | MPRF 2295 | 11/01/2017 | Donato de Navirai × Mogiana FIV Jacuricy (Bvlgari TE da Sabia / Mogiana TE Vale) | – | Média de oócitos: Naomi 110 · Neve 80 | https://www.youtube.com/watch?v=mHYjdpdYl-k&list=PLSfvKymQldIQ&index=7 |
| 08 | 50% À venda | Antonella FIV da Nova Delhi | GCA A6480 | 08/09/2025 | Landau da Di Genio × Mogiana FIV do Sozinho (Kayak TE Mafra / Mogiana Ourofino) | 622 kg | Ganho de 1,405 kg/dia | https://www.youtube.com/watch?v=HUvKxn92zMg&list=PLSfvKymQldIQ&index=8 |
| 09 | 50% À venda | Mogiana FIV do Sozinho | CFLR 726 | 01/01/2022 | Kayak TE Mafra × Mogiana Ourofino (Donato de Navirai / Mogiana FIV Jacuricy) | 956 kg | Média de 80 oócitos | https://www.youtube.com/watch?v=7e-4evu9RDc&list=PLSfvKymQldIQ&index=9 |
| 11 | 50% À venda | Dossier FIV Volpe | VLPE 155 | 26/07/2024 | Landau da Di Genio × Beldade FIV da Valonia (Kayak TE Mafra / Jamaya da Di Genio) | 887 kg | Parida de macho do Athila de Naviraí | https://www.youtube.com/watch?v=3PXnb27F1Z4&list=PLSfvKymQldIQ&index=10 |
| 12 | Animal | Melbourne FIV Cascão | CASC 25 | 02/12/2025 | Landau da Di Genio × Australia FIV Giber (Kayak TE Mafra / Viatina TN J.Galera Paraná) | 498 kg | Ganho de 1,540 kg/dia | https://www.youtube.com/watch?v=45NyXVWxbs8&list=PLSfvKymQldIQ&index=11 |
| 14 | 50% À venda | Izabella FIV Arrocha o Nó | ARNO 152 | 23/02/2026 | Kayak TE Mafra × Izabella FIV Sausalito (Landau da Di Genio / Izabella FIV Fort VR) | 385 kg | Ganho de 1,409 kg/dia | https://www.youtube.com/watch?v=MpiB7IIK0Xg&list=PLSfvKymQldIQ&index=12 |
| 15 | Animal | Chloe FIV CBA | CABN 312 | 27/02/2023 | Landau da Di Genio × Viatina TN J.Galera Paraná (Bitelo da SS / Ryatna 12 TE da Sab) | 866 kg | Parida de macho do Athila de Naviraí | https://www.youtube.com/watch?v=9KtWq51TsKw&list=PLSfvKymQldIQ&index=13 |
| 16 | Animal | Emppa FIV 3JR | RJJJ 759 | 07/03/2025 | Rima FIV Neru × Guapa FIV AL Canaã (Landau da Di Genio / Izabella FIV Fort VR) | – | Prenha do Star FIV do Mura; Previsão de parto: abr/27 | https://www.youtube.com/watch?v=BifKAE2MhbY&list=PLSfvKymQldIQ&index=14 |
| 17 | Prenhez | Rheliquia FIV SR da Sara | SRC 5213 | 26/02/2022 | Landau da Di Genio × Eloa SR da Sara (Bigu TE SR da Sara / Eloa do Colibri) | – | Acasalamento: Kayak TE Mafra; Previsão de parto: mai/27 | https://www.youtube.com/watch?v=aEZZFtCZM90&list=PLSfvKymQldIQ&index=15 |
| 18 | Prenhez | Parla TN2 HVP | HVP 3606 | 10/08/2016 | Bitelo da SS × Jatany TE AJJ (1646 da MN / Rinha CS) | – | Acasalamento: Landau da Di Genio; Previsão de parto: jun/27 | https://www.youtube.com/watch?v=YPFius1Qmv0&list=PLSfvKymQldIQ&index=16 |
| 19 | Aspiração | Roma Santa Irene | NMH 230 | 11/12/2022 | Kayak TE Mafra × Rima FIV Mercedes (Jeru FIV do Brumado / Rima FIV Galicia) | – | – | https://www.youtube.com/watch?v=fwNaDcoIec0&list=PLSfvKymQldIQ&index=17 |
| 20 | Prenhez | Alisha FIV Ibaneis | IRBJ 401 | 25/04/2020 | Landau da Di Genio × Viena-3 TE Guadalupe (Missoni Guadalupe / Melopeia Guadalupe) | – | Acasalamento: Bentley TE Bar; Previsão de parto: mai/27 | https://www.youtube.com/watch?v=tFgpaVs3jHM&list=PLSfvKymQldIQ&index=18 |
| 21 | Aspiração | Guta FIV da RFA | RFA 8396 | 30/08/2025 | Kayak TE Mafra × Pintura da RFA (Lastro FIV da RFA / Lusitana V da RFA) | – | Apta para aspirar em 25/11/2026 | https://www.youtube.com/watch?v=a1ObP7BHlBs&list=PLSfvKymQldIQ&index=19 |
| 22 | Aspiração | Milagres Ourofino | OURO 4295 | 02/06/2024 | Landau da Di Genio × Izabella FIV Fort VR (Enlevo da Morung. / Enddy TE da Fort.VR) | – | Última aspiração: 46 oócitos e 31 embriões com Kayak convencional | https://www.youtube.com/watch?v=r7xO6FkB7TI&list=PLSfvKymQldIQ&index=20 |
| 23 | Aspiração | Loewe02 FIV 116/22 CBNEL | CABN 116 | 13/01/2022 | Kayak TE Mafra × Donna FIV CIAV (Big Ben da S.Nice / Parla FIV AJJ) | – | Média de 134 oócitos | https://www.youtube.com/watch?v=xVOQ4ZkFGnc&list=PLSfvKymQldIQ&index=21 |
| 24 | Aspiração | Viatina-21 FIV Mara Móveis | MARA 2040 | 08/12/2020 | Kayak TE Mafra × Viatina TE J.Galera (Bitelo da SS / Ryatna 12 TE da Sab) | – | Última aspiração: 56 oócitos e 19 embriões | https://www.youtube.com/watch?v=WlSDT6FE-qY&list=PLSfvKymQldIQ&index=22 |
| 25 | Prenhez | Jupiá TN1, TN2, TN3, TN5 e TN6 Ourofino | OURO 3120 | 05/07/2018 | Bitelo da SS × Absoluta CS (Big Ben da S.Nice / Laurea da Java) | – | Acasalamento: Landau da Di Genio; Previsão de parto: mai/2027; 2 prenhezes à escolher entre os clones | https://www.youtube.com/watch?v=jaKe1mtI964&list=PLSfvKymQldIQ&index=23 |
| 26 | Pacote duplo de aspiração | Osaka da RS | RSBP 7488 | 05/07/2024 | Kayak TE Mafra × Viatina TN J.Gal Paraná (Bitelo da SS / Ryatna 12 TE Dabiá) | – | Média de oócitos: Osaka 48 · Espannha 44 | https://www.youtube.com/watch?v=O3eA_Znovu8&list=PLSfvKymQldIQ&index=24 |
| 26 | Pacote duplo de aspiração | Espannha FIV NDF | NDF 373 | 15/01/2023 | Landau da Di Genio × Cattedral TN HVP (Big Ben da S.Nice / Parla FIV AJJ) | – | Média de oócitos: Osaka 48 · Espannha 44 | https://www.youtube.com/watch?v=O3eA_Znovu8&list=PLSfvKymQldIQ&index=24 |
| 27 | Aspiração | Holambra2 FIV Monte Verde | ISPU 6705 | 09/11/2023 | Landau da Di Genio × Heringer Larrara FIV (Kayak TE Mafra / Gula Ourofino) | – | Média de 106 oócitos e 29 embriões com sêmen sexado | https://www.youtube.com/watch?v=VNzLZdakIuM&list=PLSfvKymQldIQ&index=25 |

### Criadores / vendedores
- **Lote PF:** Nelore Trento / Miguel Pinto – Nelore Jacuricy — Lote Praia do Forte
- **Lote 01:** Miguel Pinto – Nelore Jacuricy
- **Lote 02:** Miguel Pinto – Nelore Jacuricy
- **Lote 03:** Miguel Pinto – Nelore Jacuricy
- **Lote 04:** Miguel Pinto – Nelore Jacuricy
- **Lote 05:** Miguel Pinto – Nelore Jacuricy
- **Lote 06:** Miguel Pinto – Nelore Jacuricy
- **Lote 08:** Nelore Trento
- **Lote 09:** Nelore Trento
- **Lote 11:** Nelore Trento
- **Lote 12:** Nelore Cascão
- **Lote 14:** Nelore Arrocha o Nó
- **Lote 15:** Nova Delhi Genética
- **Lote 16:** Cássio Tottene – Nelore Serilon / Hiran Alencar / Gustavo Atayde / Pecuária 3JR
- **Lote 17:** Nelore GR – Gustavo Rebucci / Nelore SR da Sara
- **Lote 18:** Nelore São Pedro / RS Agropecuária / Nelore Gibertoni — Clone de Parla FIV AJJ
- **Lote 19:** Gustavo Rebucci – Nelore GR
- **Lote 20:** Mundial Agropecuária
- **Lote 21:** Edgar Candeias – Nelore Candeias / Nelore RFA – RFA Agropecuária
- **Lote 22:** Lucente Agropecuária / Ourofino Genética Animal
- **Lote 23:** Nelore GAM / Nelore HK / Lucente Agropecuária
- **Lote 24:** Nelore Mara Móveis / Nelore J.Luz
- **Lote 25:** Ourofino Agropecuária / Querência Agropecuária — Clones de Jupiá Guadalupe
- **Lote 26:** Nelore Montana / Nelore São Pedro
- **Lote 27:** Pasu Agropecuária / João Madson / Grupo Monte Verde

### Família (fotos da ficha)
- **Lote PF:** Pérola Negra CTJ (Gladiador × Pérola); Egípcia FIV CTJ (Jeru × Pérola); Sarisha Ourofino (Gladiador × Pérola)
- **Lote 01:** Naomi FIV Jacuricy (Mãe); Mogiana FIV Jacuricy (Avó)
- **Lote 02:** Mogiana FIV Jacuricy (Avó)
- **Lote 03:** Parla FIV AJJ (Avó)
- **Lote 04:** Neve FIV Jacuricy (Mãe); Mogiana FIV Jacuricy (Avó)
- **Lote 06:** Eudora da Mundial (Landau × Naomi); Mogiana FIV EDAP (Irmã própria da Naomi); Mogiana FIV Jacuricy (Mãe)
- **Lote 08:** Mogiana FIV do Sozinho (Mãe); Mogiana Ourofino (Avó)
- **Lote 09:** Antonella Nova Delhi (Landau × Mogiana Sozinho); Mogiana Ourofino (Mãe)
- **Lote 11:** Jamaya da Di Genio (Avó); Parla FIV AJJ (Bisavó)
- **Lote 12:** Viatina TE J.Galera (Genética)
- **Lote 14:** Izabella FIV Sausalito (Mãe); Izabella FIV Fort VR (Avó)
- **Lote 15:** Viatina TE J.Galera (Genética)
- **Lote 16:** Guapa FIV AL Canaã (Mãe); Izabella FIV Fort VR (Avó)
- **Lote 17:** Esmeralda FIV SR da Sara (Filha); Progênie
- **Lote 18:** Valentina FIV 3JR (Filha); Inglaterra da ANP (Filha)
- **Lote 19:** Rima FIV Mercedes (Mãe); Tivoli Ourofino (Landau × Roma)
- **Lote 20:** Isha FIV Monte Verde (Kayak × Alisha); Viena 3 TE Guadalupe (Mãe)
- **Lote 21:** Amsterdam FIV Giber (Irmã própria); Pintura RFA (Mãe)
- **Lote 22:** Dama 5 FIV HRO (Irmã própria); Izabella FIV Fort VR (Mãe)
- **Lote 23:** Dominique FIV HK (Filha); Donna FIV CIAV (Mãe)
- **Lote 24:** Dinastia FIV Mara Móveis (Irmã); Viatina TE J.Galera (Mãe)
- **Lote 25:** Jupiá III Ourofino (Filha); Allegra da RS I (Família)
- **Lote 26:** Viatina TN J.Gal Paraná (Mãe da Osaka); Cattedral TN HVP (Mãe da Espanha)
- **Lote 27:** Casual FIV Monte Verde (Filho); Heringer Larrara FIV (Mãe)

Observações do catálogo original: lote 02 traz a mãe como "Ogiana FIV Jacuricy" (possível falta do "M"); lote 04 usa silhuetas (bezerras recém-nascidas, livre escolha).

## 9. Arquivos e pastas

Ver `README.md`. Imagens recortadas (PNG/WebP com transparência) estão em `public/assets/img/animais/` (`m<id>.webp`, foto principal) e `public/assets/img/familia/` (`r<id>.webp`); o mapeamento lote → imagem está em `source/data.py` (campo `main` e lista `rels`).

## 10. Próximos passos sugeridos

- Trocar a capa do YouTube por **vídeos MP4 próprios** (trecho de 8–10 s em loop, sem som, + vídeo completo hospedado à parte, ex.: Vimeo/Bunny Stream).
- Incluir **dados de pista** (medidas, avaliações, produção) no painel do vídeo, mantendo a regra de caber na tela.
- Domínio próprio e Google Analytics/Meta Pixel, se desejado.


## 11. Som ambiente (acrescentado na revisão v2)

- Trilha: `public/assets/audio/ambiente.m4a`, em loop, carregada só depois da interação do visitante (`preload="none"`).
- Controle no **canto superior direito** da barra do topo: botão de alto-falante (1 clique silencia/ativa) + barra de volume (no celular, a barra abre numa bandeja ao tocar no botão).
- Não toca com som antes de um gesto do visitante (regra dos navegadores); lembra volume/mudo; pausa ao trocar de aba e durante os vídeos; sem JavaScript o controle não é exibido.
- Acessível: `<button>` com rótulo dinâmico, `<input type="range">` com rótulo e `aria-valuetext`, foco visível, alvo ≥ 40 px.
- Atenção a direitos autorais da faixa usada.

## 12. Segurança e acessibilidade (revisão v2)

- CSP restritiva (sem inline), cabeçalhos de segurança no `netlify.toml`, fontes hospedadas (sem Google Fonts), `iframe` do YouTube com `sandbox` e modo privacidade, links externos com `noopener noreferrer`.
- WCAG 2.1/2.2 AA: contraste, teclado completo, foco gerenciado nas janelas (`inert` no fundo), landmarks, `prefers-reduced-motion`, contagem sem `aria-live` a cada segundo.
- Regra nova: nada de `style=""`, `<script>` inline ou `on*=""` no HTML.


## 13. Vídeos próprios e tela cheia girada (revisão v3)

- Cada lote tem vídeo próprio em `public/assets/video/`: `completo/` (720p, com som), `previa/` (8 s, loop, sem som) e `capas/` (JPG). Substituem o player do YouTube (nenhum terceiro, nenhum `iframe`).
- Na tela do animal o quadro mostra a prévia em loop; **tocar no quadro** expande com giro de 90° (estilo YouTube), troca para o vídeo completo com som e controles; ✕/`Esc` voltam. Android/desktop: tela cheia real + trava em paisagem; iPhone: giro por CSS.
- Carregam só quando o animal é aberto; com `prefers-reduced-motion` ou economia de dados só a capa aparece. O som ambiente pausa enquanto o vídeo completo toca.
- Grama também na frente das patas, como no catálogo impresso.
