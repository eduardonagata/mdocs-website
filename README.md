# mdocs-website

Landing page do **MarkDocs**, a máquina tipográfica para macOS e iOS que transforma o markdown escrito pela IA em PDFs A4 com margens, tipografia e papel timbrado.

Feito com [Astro](https://astro.build) e React (TypeScript). As partes interativas (o herói “markdown → A4” e a demonstração animada do app) são ilhas React; o restante é HTML estático.

## Começando

```bash
npm install
npm run dev       # http://localhost:4321
npm run check     # verificação de tipos (astro check)
npm run build     # gera o site estático em dist/
npm run preview   # serve o build localmente
```

## Estrutura

```
src/
  pages/index.astro          página única, compõe as seções
  layouts/Base.astro         <head>, fontes, revelação ao rolar
  components/                seções estáticas (.astro)
    Nav, Hero, Problem, Demo, HowItWorks, Features, Byok, Pricing, Faq, FinalCta, Footer
  react/
    AppIcon.tsx              ícone “Recorte em contra-grão” em SVG
    a4/                      folha A4 em escala física + parâmetros de formatação
    hero/                    herói interativo: markdown → folha A4 + mini-inspetor
    demo/                    demonstração animada do app (motor + roteiro)
  data/
    contract.ts              o markdown de exemplo (contrato de locação)
    site.ts                  nome, links, preços (PROVISÓRIOS)
  lib/markdown.ts            parser mínimo: markdown → blocos tipados
  styles/                    tokens e estilos globais
DESIGN_SYSTEM.md             cores, fontes, princípios e componentes
```

## Onde editar

| Quero mudar… | Arquivo |
|---|---|
| preços, link de download, e-mail | `src/data/site.ts` |
| o documento de exemplo | `src/data/contract.ts` |
| o roteiro da demonstração animada | `src/react/demo/timeline.ts` |
| cores, espaçamentos, tipografia | `src/styles/tokens.css` |

Antes de publicar, consulte a seção **Itens provisórios** em [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md#13-itens-provisórios-revisar-antes-de-publicar).
