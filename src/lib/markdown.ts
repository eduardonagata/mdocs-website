/**
 * Um parser de markdown mínimo e determinístico — o suficiente para que o site
 * mostre a mesma ideia do app: o markdown é decomposto em blocos tipados
 * (títulos, parágrafos, listas) e cada tipo recebe a sua regra tipográfica.
 *
 * O texto de origem é escrito UMA vez (src/data/contract.ts); tanto a coluna
 * "markdown" quanto a página A4 renderizada derivam dele.
 */

export interface Inline {
  text: string;
  bold?: boolean;
  italic?: boolean;
}

export type BlockKind = 'h1' | 'h2' | 'h3' | 'p' | 'ul';

export interface Block {
  kind: BlockKind;
  /** Linhas originais em markdown, exatamente como a IA escreveu. */
  source: string[];
  /** Conteúdo inline (para títulos e parágrafos). */
  inlines: Inline[];
  /** Itens de lista (somente para `ul`). */
  items: Inline[][];
}

const INLINE_RE = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;

export function parseInline(text: string): Inline[] {
  const out: Inline[] = [];
  for (const part of text.split(INLINE_RE)) {
    if (!part) continue;
    if (part.startsWith('**') && part.endsWith('**')) {
      out.push({ text: part.slice(2, -2), bold: true });
    } else if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      out.push({ text: part.slice(1, -1), italic: true });
    } else {
      out.push({ text: part });
    }
  }
  return out;
}

export function parseBlocks(markdown: string): Block[] {
  const blocks: Block[] = [];
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n');
  let list: Block | null = null;

  const closeList = () => {
    if (list) blocks.push(list);
    list = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!.trimEnd();
    if (!line.trim()) {
      closeList();
      continue;
    }

    const heading = /^(#{1,3})\s+(.*)$/.exec(line);
    if (heading) {
      closeList();
      const level = heading[1]!.length as 1 | 2 | 3;
      blocks.push({
        kind: `h${level}`,
        source: [line],
        inlines: parseInline(heading[2]!),
        items: [],
      });
      continue;
    }

    const item = /^[-*]\s+(.*)$/.exec(line);
    if (item) {
      if (!list) list = { kind: 'ul', source: [], inlines: [], items: [] };
      list.source.push(line);
      list.items.push(parseInline(item[1]!));
      continue;
    }

    closeList();
    const prev = blocks[blocks.length - 1];
    // Linhas consecutivas sem linha em branco formam um único parágrafo.
    if (prev && prev.kind === 'p' && i > 0 && lines[i - 1]!.trim()) {
      prev.source.push(line);
      prev.inlines.push({ text: ' ' }, ...parseInline(line));
      continue;
    }
    blocks.push({ kind: 'p', source: [line], inlines: parseInline(line), items: [] });
  }
  closeList();
  return blocks;
}

/** Texto plano de uma sequência inline (útil para rótulos acessíveis). */
export function plain(inlines: Inline[]): string {
  return inlines.map((i) => i.text).join('');
}
