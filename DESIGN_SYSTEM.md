# MarkDocs — Sistema de design do site

Este documento descreve a linguagem visual da landing page do MarkDocs: o conceito, os princípios, as cores, a tipografia, os elementos gráficos, os componentes e as regras de movimento. Ele serve de referência para evoluir o site sem perder coerência.

Os valores citados aqui existem como tokens em [`src/styles/tokens.css`](src/styles/tokens.css). Quando este documento e o código divergirem, o código é a fonte de verdade e este documento deve ser corrigido.

---

## 1. Conceito: Papel & Chumbo

O MarkDocs é uma máquina tipográfica: recebe o markdown que a IA escreve e devolve uma folha A4 composta com precisão. O site traduz essa ideia em duas matérias que dialogam o tempo todo.

| | **Papel** | **Chumbo** |
|---|---|---|
| Representa | o documento, o resultado, o mundo formal | a máquina, a IA, os controles, a precisão |
| Temperatura | quente: bege, marfim | fria: chumbo, grafite, prata, azul aço |
| Tipografia | Libertinus Serif, a voz do documento | Hanken Grotesk e IBM Plex Mono, a voz da máquina |
| Onde aparece | fundo do site, folhas A4, cartões | ícone, painel de markdown, botões primários, faixa “Sua chave”, placa da licença |

O nome vem do próprio ícone, uma placa escovada “de chumbo a prata”. Chumbo também é o metal dos tipos móveis da tipografia tradicional. A tensão entre o calor do papel e o frio do metal é o que dá identidade ao site, e cada decisão visual deve pertencer claramente a uma das duas matérias.

---

## 2. Princípios

1. **Mostrar a transformação, não descrevê-la.** O visitante deve entender o problema e a solução em segundos. Por isso o herói mostra o markdown cru virando uma folha A4, com o mesmo conteúdo dos dois lados.
2. **Precisão visível.** Usamos unidades reais (mm, pt, em), cotas, marcas de corte e rótulos técnicos. A confiança vem de ver que o produto mede as coisas, e não de dizer que ele é confiável.
3. **Uma folha A4 é uma folha A4.** Toda página exibida no site respeita a proporção 210 × 297 e escala fisicamente. As margens são calculadas em milímetros e os corpos em pontos (ver §7.3).
4. **Dois idiomas tipográficos, com uma regra clara.** A sans é a máquina e a serifa é o papel. Nos títulos, a primeira frase (o fato ou o problema) fica em sans, e a segunda (a consequência ou a promessa) fica em serifa itálica.
5. **Um único acento.** O azul aço (`--steel`) é a única cor de destaque. Vermelho e verde aparecem apenas com função semântica (erro ou diferença).
6. **Movimento com propósito.** Toda animação demonstra algo do produto: o markdown sendo composto, um controle recompondo a página, a “face” do app girando. Não há animação decorativa.
7. **Silêncio generoso.** Espaços amplos, poucas linhas e pouca cor. O minimalismo aqui é o de um instrumento bem calibrado, sem nada de frio ou vazio.
8. **Solidez sem alarde.** A sensação de um ativo durável vem de materiais (metal escovado, placa gravada), de números concretos e do acabamento, nunca de adjetivos.

---

## 3. Cores

### 3.1 Papel (superfícies)

| Token | Hex | Uso |
|---|---|---|
| `--paper-0` | `#FDFCF9` | cartões elevados, inspetor |
| `--paper-1` | `#F5F3EC` | **fundo do site**, um bege sutil próximo ao do app Claude |
| `--paper-2` | `#ECE9DF` | faixas rebaixadas (demonstração, rodapé) |
| `--paper-3` | `#E1DDD0` | divisórias fortes, barras de esqueleto |
| `--sheet` | `#FFFEFB` | folha A4 renderizada |

### 3.2 Tinta (texto)

| Token | Hex | Uso |
|---|---|---|
| `--ink-1` | `#16181B` | títulos, texto principal (amostrado do PDF do ícone) |
| `--ink-2` | `#4A4F57` | texto corrido, lead |
| `--ink-3` | `#5B616A` | legendas e rótulos (amostrado do PDF do ícone) |
| `--ink-4` | `#8B9098` | marcas de corte, numeração, desativado |
| `--line` | `rgb(22 24 27 / .10)` | linhas finas |
| `--line-strong` | `rgb(22 24 27 / .18)` | linhas de seção |

### 3.3 Chumbo → prata (metal do ícone)

Gradiente a 135°, amostrado diretamente do arquivo de design do ícone:

| Parada | Hex | Token |
|---|---|---|
| 8 % | `#DEE4EB` | `--metal-100` |
| 20 % | `#D0D7E0` | `--metal-200` |
| 35 % | `#A0AAB9` | `--metal-300` |
| 50 % | `#6F7D90` | `--metal-500` |
| 65 % | `#4F5A69` | `--metal-600` |
| 80 % | `#323945` | `--metal-700` |
| 92 % | `#252B35` | `--metal-800` |

O gradiente completo está disponível como `--metal-gradient`. Ele é reservado ao ícone, a pequenos marcadores e à placa da licença; nunca deve ser usado como fundo de grandes áreas de texto.

### 3.4 Acento

| Token | Hex | Uso |
|---|---|---|
| `--steel` | `#3F5F8C` | **acento único**: preenchimento de sliders, links, rótulos de destaque, cor institucional padrão dos documentos (cor dos sliders do PDF do ícone) |
| `--steel-strong` | `#2F4B75` | estados pressionados; cor “Azul aço” nos documentos de exemplo |
| `--steel-soft` | `rgb(63 95 140 / .10)` | fundos de foco e realce |
| `--steel-on-dark` | `#9FB8DC` | acento sobre superfícies de chumbo |

### 3.5 Cores funcionais (nunca decorativas)

| Token | Hex | Única função |
|---|---|---|
| `--proof` | `#B4442E` | **Vermelho de revisão**: aponta problemas (marcas de revisor na seção “Hoje”) |
| `--diff-add` | `#2F6B4F` | inserções no histórico de versões |
| `--diff-del` | `#9A3B2B` | remoções no histórico de versões |

### 3.6 Modo escuro

O site é sempre claro, porque é papel. A única superfície escura é a faixa de chumbo da seção “Sua chave”, que redefine localmente as variáveis de tinta (`--ink-*`, `--line`). A decisão é deliberada: a página inteira se comporta como um documento impresso.

---

## 4. Tipografia

### 4.1 Famílias

| Família | Papel | Por quê |
|---|---|---|
| **Hanken Grotesk** (variável, 100–900) | Voz da máquina: interface, títulos, texto corrido | Grotesca geométrica e aberta, a mais próxima da sans usada no PDF do ícone (métricas e desenho comparados) |
| **Libertinus Serif** (400, 400 itálico, 600, 700) | Voz do papel: documentos A4, a segunda frase dos títulos, trechos “impressos” | É a fonte padrão dos documentos gerados pelo app via Typst, de modo que o site fala com a voz do produto final |
| **IBM Plex Mono** (400, 500) | Voz do instrumento: rótulos técnicos, medidas, markdown, valores de controles | É a mono usada no PDF do ícone (`A · RECORTE QUADRADO`, `METAL`) |

Todas são servidas localmente via `@fontsource`, apenas nos subconjuntos latinos. Não usamos Google Fonts em tempo de execução, o que evita rastreamento de terceiros e combina com a mensagem de privacidade do produto.

### 4.2 Escala

| Estilo | Tamanho | Peso | Entrelinha | Tracking |
|---|---|---|---|---|
| Display (`.display`) | `clamp(2.5rem → 4.6rem)` | 560 | 0.98 | −0.038em |
| H2 (`.h2`) | `clamp(2rem → 3.4rem)` | 560 | 1.04 | −0.028em |
| H3 (`.h3`) | `clamp(1.15rem → 1.35rem)` | 620 | 1.3 | −0.012em |
| Lead (`.lead`) | `clamp(1.08rem → 1.25rem)` | 400 | 1.55 | — |
| Corpo | `1rem` | 400 | 1.6 | — |
| Rótulo (`.label`) | `0.72rem` mono, CAIXA ALTA | 500 | 1.4 | +0.14em |

### 4.3 Regras

- **Duas vozes nos títulos.** Exemplo: “A IA pensa em markdown. *Documentos formais, não.*” A segunda frase usa `.paper-voice` (Libertinus itálico, 1.06em para compensar o olho menor da serifa).
- **Caixa alta só em rótulos mono.** Nomes próprios com caixa mista (macOS, iOS, iPadOS) usam `.label--plain`, para nunca virar “MACOS”.
- **Numeração de seção** no formato `01 · O problema`, sempre em mono, com um traço de 18 px à esquerda.
- **Números** tabulares em controles e medidas; vírgula decimal (`10,5 pt`), como em pt-BR.
- `text-wrap: balance` em títulos e `pretty` em leads.

---

## 5. Espaço, grade e forma

- **Base de 4 px.** Tokens `--space-1` (4) a `--space-10` (144).
- **Largura máxima** de 1200 px de conteúdo, com calha `clamp(16px, 4vw, 40px)`.
- **Ritmo vertical das seções:** `--section-pad` = `clamp(88px → 168px)`.
- **Raios:** 4 / 8 / 12 / 20 / 28 / pílula. Botões usam pílula, cartões 20–28, a janela do app 26 e os controles 7–9.
- **Grade pontilhada** de diagramação (24 px) atrás do herói, esmaecendo nas bordas.

### Elevação

| Token | Uso |
|---|---|
| `--shadow-sheet` | folhas A4 (sombra curta e próxima, como papel sobre a mesa) |
| `--shadow-window` | janela do app (sombra longa e fria, tingida de chumbo) |
| `--shadow-control` | segmentos e controles selecionados |

---

## 6. Elementos gráficos de assinatura

| Elemento | Onde | Regra |
|---|---|---|
| **Marcas de corte** (`.crop` + `.crop-mark--*`) | em volta de folhas A4 | traço de 14 px com afastamento de 10 px, em `--ink-4`; só envolvem “impressos” |
| **Cotas** | acima da folha do herói (`210 mm`) | linha fina com terminais, rótulo mono sobre fundo de papel |
| **Placa escovada** | ícone, placa da licença, painel de markdown | grão anisotrópico sutil (≤ 14 % de opacidade no ícone) |
| **Recorte em contra-grão** | ícone e canto da placa da licença | quadrado com cantos de ~24 %, mesma chapa com o grão girado; sem contorno nem sombra |
| **Marcas de revisor** | seção “Hoje” | círculo e sublinhado ondulado em `--proof`, notas mono inclinadas de ±2–3° |
| **Leitura de regra** | sob a folha do herói | `## título → Título 2 · 11,5 pt · versais · azul aço` |

---

## 7. Componentes

### 7.1 Botões

- **Primário (`.btn--primary`)** funciona como uma tecla de chumbo: gradiente `metal-700 → metal-900`, brilho interno de 1 px no topo e sombra tingida. Use **um** por bloco.
- **Fantasma (`.btn--ghost`):** contorno de 1 px em `--line-strong`, sem fundo.
- **Tamanhos:** 48 px (padrão) e 36 px (`.btn--small`, usado na navegação).

### 7.2 Controles de inspetor (herói e demonstração)

Reproduzem a linguagem do inspetor do app, já corrigida:

- **Slider:** trilho de 4 px, preenchimento em `--steel`, botão branco de 16–18 px com sombra curta e linha de pontos de escala abaixo (como no app).
- **Segmentado:** fundo `rgb(0 0 0 / .06)`; o segmento ativo é branco com `--shadow-control`.
- **Interruptor** no estilo macOS, ligado em `--steel`.
- **Amostras de cor:** círculos de 18–22 px; a ativa ganha um anel de 2 px de papel mais um anel da própria cor.
- **Valores** sempre em mono e com unidade (`32 mm`, `11 pt`, `0,8 em`).

### 7.3 Folha A4 (`src/react/a4/A4Page.tsx`)

- Usa `container-type: inline-size`; **1 mm = `100cqw / 210`** e **1 pt = 0,3528 mm**.
- As margens, os corpos e o timbre são definidos em unidades físicas, então a mesma folha pode ter 250 px ou 900 px de largura sem distorção.
- Faz uma paginação simplificada: blocos que não cabem inteiros na área útil são ocultados (no app, o Typst os levaria para a página seguinte).
- Os parâmetros (`DocStyle`) espelham os eixos do gerador “Documento de negócio”: margens, corpo, entrelinha, espaço entre parágrafos, justificação, tamanho, caixa e alinhamento de cada título, timbre e cor institucional.
- Mapeamento de entrelinha: `line-height = 0,68 + leading` e espaço entre parágrafos `= spacing − leading` (aproximação das regras do Typst).

### 7.4 Painel de markdown

Chapa de chumbo (`#2A303A → #1B1F26`) com fibras a 115° quase invisíveis. Os marcadores (`#`, `-`) aparecem em `--steel-on-dark`, os asteriscos de negrito são esmaecidos e o texto em negrito fica claro. A linha ativa ganha uma barra de 2 px à esquerda.

### 7.5 Janela do app (demonstração)

- É desenhada em 1200 × 760 px e escalada com `transform`. Em telas estreitas (< 640 px) entra o **modo compacto** (880 px, sem barra lateral), que fica mais legível.
- Barra lateral e inspetor são **painéis de vidro flutuantes simétricos**, com 8 px de afastamento e raio de 20 px. O inspetor ocupa a altura toda num único painel contínuo, e os botões da barra de ferramentas flutuam sobre ele. Isso **elimina a faixa estranha** entre a barra superior e o inspetor que existe no app atual.
- A fonte da janela é a do sistema (SF Pro no Mac), com Hanken Grotesk como alternativa, para parecer um app nativo.
- A troca de superfície (Conversa → Documento → PDF) usa uma **rotação de face** (`rotateY ±34°` em torno de um eixo 460 px atrás da tela), inspirada no princípio de engenharia do app: “mudar de tela é girar o objeto para ver outra face”.

### 7.6 Placa da licença

O preço principal é apresentado como uma chapa de metal escovado clara, com o preço “gravado” (`text-shadow` claro embaixo e escuro em cima) e o recorte em contra-grão no canto. É o único lugar em que o metal claro ocupa uma área grande.

---

## 8. Ícone e logotipo

- **Ícone:** conceito “Recorte em contra-grão”, uma placa escovada de chumbo a prata com um pequeno recorte da mesma chapa girado no canto superior direito (23 % do lado, a 21 % da borda). O encaixe é perfeito e não leva contorno nem sombra: o recorte só aparece porque o grão e a luz correm em outra direção.
  - O componente é `src/react/AppIcon.tsx`, um SVG gerado com superelipse n = 5 e grão por `feTurbulence` anisotrópico. A propriedade `grain` controla a intensidade: use 0,10 em tamanhos pequenos e no máximo 0,14 em tamanhos grandes.
  - O favicon (`public/favicon.svg`) é estático, sem grão, com o recorte ampliado para 29 % por legibilidade.
- **Logotipo:** ícone + “**Mark**Docs”, com “Mark” em peso 720 e “Docs” em 380, tracking −0,03em. Segue a lógica do wordmark “**M**Docs” do arquivo de design: o negrito marca o *markdown*, o leve marca os *documentos*. O afastamento entre ícone e texto é 0,36 × a altura do ícone.
- **Abreviação:** “MDocs” pode ser usado em contextos de espaço reduzido, mantendo a mesma regra de pesos (**M**Docs).

---

## 9. Movimento

| Token | Valor | Uso |
|---|---|---|
| `--ease-out` | `cubic-bezier(.22, 1, .36, 1)` | entradas, revelações |
| `--ease-in-out` | `cubic-bezier(.65, 0, .35, 1)` | trocas de face, painéis |
| `--dur-fast` | 160 ms | hover, pressão |
| `--dur-base` | 320 ms | estados |
| `--dur-slow` | 700 ms | trocas de superfície |

- **Revelação ao rolar:** somente opacidade e 14 px de deslocamento, uma vez por elemento.
- **Herói:** o realce percorre os blocos a cada 2,6 s, pausa ao passar o mouse e para quando sai da tela.
- **Demonstração:** só roda quando está visível; tem pausa e capítulos navegáveis.
- **`prefers-reduced-motion`:** nada se move sozinho. O herói fica estático e a demonstração mostra o estado final de cada capítulo ao clicar.

---

## 10. Voz e conteúdo

- Português do Brasil, com frases curtas e verbos no imperativo nos CTAs (“Baixar para Mac”, “Ver demonstração”).
- Mostre números concretos (mm, pt, dias, preço) em vez de adjetivos.
- Nunca diga explicitamente que o produto é “seguro”, “um investimento” ou “confiável”. Mostre isso com precisão, materiais e transparência.
- Use o vocabulário tipográfico certo: *versais* (caixa alta), *versaletes* (small caps), *entrelinha*, *corpo*, *timbre*, *fólio*.

---

## 11. Acessibilidade

- O contraste de texto corrido é ≥ 7:1 (`--ink-2` sobre `--paper-1`: 7,4:1). Os rótulos em `--ink-3` ficam em 5,6:1 e o acento `--steel` em 5,9:1. `--ink-4` (2,9:1) é reservado a elementos não essenciais, como marcas de corte e numeração redundante, e nunca deve carregar informação sozinho.
- Toda animação demonstrativa tem `aria-hidden` e uma descrição textual equivalente (`.visually-hidden`).
- Os controles do herói são elementos nativos (`input[type=range]`, `checkbox`, `radiogroup`) navegáveis por teclado.
- O foco visível é um contorno de 2 px em `--steel`, com afastamento de 3 px.
- Há um link “Pular para o conteúdo”.

---

## 12. Como evoluir a demonstração

A animação é **declarativa**. O roteiro inteiro fica em [`src/react/demo/timeline.ts`](src/react/demo/timeline.ts), como uma lista de capítulos com ações (`move`, `click`, `type`, `stream`, `slide`, `choose`, `toggle`, `color`, `scroll`, `set`, `wait`).

- **Para mudar o que acontece**, edite os capítulos. O motor (`AppDemo.tsx`) não precisa mudar.
- **Para adicionar controles**, inclua-os em `src/react/demo/model.ts` (`SLIDERS` e `SELECTS`) e no JSX do inspetor.
- **Para trocar a demo por um vídeo** gravado do app real, substitua `<AppDemo client:visible />` em `src/components/Demo.astro` por um `<video autoplay muted loop playsinline>`. Mantenha os capítulos como legendas, se fizer sentido.

---

## 13. Itens provisórios (revisar antes de publicar)

- **Preços e políticas** em `src/data/site.ts`: R$ 349 (individual), R$ 299 por licença a partir de 5, renovação de R$ 129 e teste de 14 dias.
- **Links:** `downloadUrl`, `appStoreUrl`, `supportEmail`, domínio `markdocs.app` e as páginas de Privacidade e Termos.
- **Timbre de exemplo** “Ferraz Lima — Advocacia imobiliária”: é fictício e usa domínios `.example`.
- **Afirmações sobre o produto** que convém confirmar: funcionamento offline da composição, licença valendo para Mac, iPad e iPhone, e versões fixadas no `.mdoc` (descritas no documento de arquitetura como direção do produto).
