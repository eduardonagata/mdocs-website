import { useEffect, useLayoutEffect, useRef, type CSSProperties, type ReactNode, type RefObject } from 'react';
import type { Block, Inline } from '../../lib/markdown';
import { CAPS_LABEL, ALIGN_LABEL, HEADING_COLORS, fmt, type DocStyle } from './docStyle';
import s from './A4Page.module.css';

export interface A4PageProps {
  style: DocStyle;
  blocks: Block[];
  pageNumber?: number;
  pageCount?: number;
  /** Cabeçalho corrido (aparece a partir da 2ª página). */
  runningHeader?: string;
  /** Índice do bloco destacado (herói / anatomia). */
  active?: number | null;
  /** Mostra a etiqueta com a regra tipográfica do bloco ativo. */
  showRule?: boolean;
  onBlockEnter?: (index: number) => void;
  signatures?: [string, string][];
  className?: string;
  ariaHidden?: boolean;
}

function Inlines({ inlines }: { inlines: Inline[] }) {
  return (
    <>
      {inlines.map((i, k) =>
        i.bold ? <strong key={k}>{i.text}</strong> : i.italic ? <em key={k}>{i.text}</em> : <span key={k}>{i.text}</span>,
      )}
    </>
  );
}

const COLOR_NAME: Record<string, string> = Object.fromEntries(HEADING_COLORS.map((c) => [c.value, c.name.toLowerCase()]));

/** Descrição legível da regra tipográfica aplicada a um bloco. */
export function ruleFor(block: Block, st: DocStyle): string {
  const color = COLOR_NAME[st.headingColor] ?? 'cor própria';
  switch (block.kind) {
    case 'h1':
      return `Título 1 · ${fmt(st.h1.size)} pt · ${CAPS_LABEL[st.h1.caps].toLowerCase()} · ${ALIGN_LABEL[st.h1.align].toLowerCase()} · ${color}`;
    case 'h2':
    case 'h3':
      return `Título 2 · ${fmt(st.h2.size)} pt · ${CAPS_LABEL[st.h2.caps].toLowerCase()} · ${color}`;
    case 'ul':
      return `Lista · ${fmt(st.bodySize)} pt · marcador • · recuo 5 mm`;
    default: {
      const hasBold = block.inlines.some((i) => i.bold);
      return `Parágrafo · Libertinus Serif ${fmt(st.bodySize)} pt · ${st.justify ? 'justificado' : 'à esquerda'}${hasBold ? ' · negrito' : ''}`;
    }
  }
}

/** O pedaço de sintaxe markdown que origina o bloco. */
export function syntaxFor(block: Block): string {
  switch (block.kind) {
    case 'h1':
      return '# título';
    case 'h2':
    case 'h3':
      return '## título';
    case 'ul':
      return '- item';
    default:
      return block.inlines.some((i) => i.bold) ? '**negrito**' : 'parágrafo';
  }
}

function Letterhead() {
  return (
    <>
      <div className={s.letterhead} aria-hidden="true">
        <div className={s.lhMark}>
          <span>F</span>
          <span>L</span>
        </div>
        <div className={s.lhName}>
          <strong>Ferraz Lima</strong>
          <span>Advocacia imobiliária</span>
        </div>
        <div className={s.lhAddress}>
          Rua das Acácias, 120 — 8º andar
          <br />
          São Paulo · SP · 01449-000
        </div>
      </div>
      <div className={s.lhFooter} aria-hidden="true">
        ferrazlima.example · (11) 3000-0000 · contato@ferrazlima.example
      </div>
    </>
  );
}

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Paginação simplificada: blocos que não cabem inteiros na área útil são
 * ocultados (no app, o Typst os levaria para a página seguinte). Como tudo na
 * folha escala com a largura, o resultado só depende dos parâmetros.
 */
function useFitBlocks(bodyRef: RefObject<HTMLDivElement | null>) {
  const fit = () => {
    const body = bodyRef.current;
    if (!body) return;
    const limit = body.clientHeight + 0.5;
    let overflowed = false;
    for (const child of Array.from(body.children) as HTMLElement[]) {
      child.style.visibility = '';
      if (overflowed || child.offsetTop + child.offsetHeight > limit) {
        overflowed = true;
        child.style.visibility = 'hidden';
      }
    }
  };
  useIsoLayoutEffect(fit);
  useEffect(() => {
    let alive = true;
    document.fonts?.ready.then(() => alive && fit());
    return () => {
      alive = false;
    };
  }, []);
}

export default function A4Page({
  style: st,
  blocks,
  pageNumber = 1,
  pageCount = 1,
  runningHeader,
  active = null,
  showRule = false,
  onBlockEnter,
  signatures,
  className,
  ariaHidden,
}: A4PageProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  useFitBlocks(bodyRef);
  const vars = {
    '--m-top': st.marginTop,
    '--m-bottom': st.marginBottom,
    '--m-left': st.marginLeft,
    '--m-right': st.marginRight,
    '--body-size': st.bodySize,
    '--lh': (0.68 + st.leading).toFixed(3),
    '--par-gap': Math.max(0.05, st.spacing - st.leading).toFixed(3),
    '--text-color': st.textColor,
    '--heading-color': st.headingColor,
    '--h1-size': st.h1.size,
    '--h2-size': st.h2.size,
    '--h1-align': st.h1.align,
    '--h2-align': st.h2.align,
    '--body-align': st.justify ? 'justify' : 'left',
  } as CSSProperties;

  const capsClass = (c: DocStyle['h1']['caps']) =>
    c === 'versais' ? s.capsUpper : c === 'versaletes' ? s.capsSmall : '';

  const render = (b: Block, i: number): ReactNode => {
    const isActive = active === i;
    const common = {
      'data-active': isActive || undefined,
      onMouseEnter: onBlockEnter ? () => onBlockEnter(i) : undefined,
    };
    const rule = isActive && showRule ? (
      <span className={s.rule} aria-hidden="true">
        {ruleFor(b, st)}
      </span>
    ) : null;

    switch (b.kind) {
      case 'h1':
        return (
          <h1 key={i} className={`${s.block} ${s.h1} ${capsClass(st.h1.caps)}`} {...common}>
            {rule}
            <Inlines inlines={b.inlines} />
          </h1>
        );
      case 'h2':
      case 'h3':
        return (
          <h2 key={i} className={`${s.block} ${s.h2} ${capsClass(st.h2.caps)}`} {...common}>
            {rule}
            <Inlines inlines={b.inlines} />
          </h2>
        );
      case 'ul':
        return (
          <ul key={i} className={`${s.block} ${s.ul}`} {...common}>
            {rule}
            {b.items.map((it, k) => (
              <li key={k}>
                <Inlines inlines={it} />
              </li>
            ))}
          </ul>
        );
      default:
        return (
          <p key={i} className={`${s.block} ${s.p}`} {...common}>
            {rule}
            <Inlines inlines={b.inlines} />
          </p>
        );
    }
  };

  return (
    <div className={`${s.frame} ${className ?? ''}`} aria-hidden={ariaHidden || undefined}>
      <article className={s.page} style={vars} lang="pt-BR">
        {st.letterhead && <Letterhead />}
        {runningHeader && !st.letterhead && <div className={s.running}>{runningHeader}</div>}
        <div className={s.body} ref={bodyRef}>
          {blocks.map(render)}
          {signatures && (
            <div className={s.signatures}>
              {signatures.map(([role, name]) => (
                <div key={role} className={s.sig}>
                  <strong>{role}</strong>
                  <span className={s.sigLine} />
                  <span>{name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={s.folio}>
          Página {pageNumber} de {pageCount}
        </div>
      </article>
    </div>
  );
}
