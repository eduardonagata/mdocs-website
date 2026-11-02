import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { parseBlocks } from '../../lib/markdown';
import { FULL_MARKDOWN } from '../../data/contract';
import A4Page, { ruleFor, syntaxFor } from '../a4/A4Page';
import { REFINED_STYLE, HEADING_COLORS, CAPS_LABEL, fmt, type Caps, type DocStyle } from '../a4/docStyle';
import s from './HeroTypeset.module.css';

const CYCLE_MS = 2600;

/** Realce de sintaxe mínimo: marcadores em azul aço, negrito realçado. */
function mdLine(line: string): ReactNode {
  const parts: ReactNode[] = [];
  let rest = line;
  const lead = /^(#{1,3}\s|-\s)/.exec(rest);
  if (lead) {
    parts.push(
      <span key="lead" className={s.mark}>
        {lead[1]}
      </span>,
    );
    rest = rest.slice(lead[1]!.length);
  }
  rest.split(/(\*\*[^*]+\*\*)/).forEach((chunk, k) => {
    if (!chunk) return;
    if (chunk.startsWith('**')) {
      parts.push(
        <span key={k} className={s.strong}>
          <span className={s.markDim}>**</span>
          {chunk.slice(2, -2)}
          <span className={s.markDim}>**</span>
        </span>,
      );
    } else {
      parts.push(<span key={k}>{chunk}</span>);
    }
  });
  return parts;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

export default function HeroTypeset() {
  const blocks = useMemo(() => parseBlocks(FULL_MARKDOWN), []);
  const [active, setActive] = useState<number>(1);
  const [hovering, setHovering] = useState(false);
  const [st, setSt] = useState<DocStyle>(REFINED_STYLE);
  const [touched, setTouched] = useState(false);
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLOListElement>(null);
  const [visible, setVisible] = useState(true);

  // Linhas do markdown, cada uma ligada ao bloco que gera.
  const lines = useMemo(() => {
    const out: { text: string; block: number | null }[] = [];
    blocks.forEach((b, i) => {
      if (i > 0) out.push({ text: '', block: null });
      b.source.forEach((t) => out.push({ text: t, block: i }));
    });
    return out;
  }, [blocks]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => setVisible(!!e?.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Mantém a linha ativa visível dentro do painel de markdown.
  useEffect(() => {
    const list = linesRef.current;
    const first = list?.querySelector<HTMLElement>('[data-active]');
    if (!list || !first) return;
    const top = first.offsetTop;
    const view = list.clientHeight;
    if (top < list.scrollTop + 24 || top > list.scrollTop + view - 96) {
      list.scrollTo({ top: Math.max(0, top - view / 3), behavior: reduced ? 'auto' : 'smooth' });
    }
  }, [active, reduced]);

  useEffect(() => {
    if (reduced || hovering || !visible) return;
    const t = window.setInterval(() => setActive((a) => (a + 1) % blocks.length), CYCLE_MS);
    return () => window.clearInterval(t);
  }, [reduced, hovering, visible, blocks.length]);

  const update = (patch: Partial<DocStyle>) => {
    setTouched(true);
    setSt((prev) => ({ ...prev, ...patch }));
  };
  const setCaps = (caps: Caps) =>
    update({ h2: { ...st.h2, caps }, h1: { ...st.h1, caps: caps === 'normal' ? 'normal' : 'versais' } });

  return (
    <div className={s.root} ref={rootRef}>
      {/* ── Entrada: markdown, como a IA escreve ─────────────── */}
      <figure className={s.source} onMouseLeave={() => setHovering(false)} aria-label="Markdown escrito pelo agente">
        <figcaption className={s.sourceHead}>
          <span className={s.fileName}>contrato.md</span>
          <span className={s.sourceTag}>escrito pelo agente</span>
        </figcaption>
        <ol className={s.lines} ref={linesRef}>
          {lines.map((l, n) => (
            <li
              key={n}
              className={s.line}
              data-active={l.block !== null && l.block === active ? '' : undefined}
              onMouseEnter={() => {
                if (l.block === null) return;
                setHovering(true);
                setActive(l.block);
              }}
            >
              <span className={s.ln} aria-hidden="true">
                {n + 1}
              </span>
              <code>{l.text ? mdLine(l.text) : ' '}</code>
            </li>
          ))}
        </ol>
      </figure>

      {/* ── Passagem pela máquina ─────────────────────────────── */}
      <div className={s.press} aria-hidden="true">
        <span className={s.pressLine}>
          <span key={active} className={s.pulse} />
        </span>
        <span className={s.pressLabel}>Typst</span>
      </div>

      {/* ── Saída: a folha A4 composta ───────────────────────── */}
      <div className={s.output}>
        <div className={s.dimTop} aria-hidden="true">
          <span>210 mm</span>
        </div>
        <div className={`crop ${s.sheet}`} onMouseLeave={() => setHovering(false)}>
          <span className="crop-mark crop-mark--tl" />
          <span className="crop-mark crop-mark--tr" />
          <span className="crop-mark crop-mark--bl" />
          <span className="crop-mark crop-mark--br" />
          <A4Page
            style={st}
            blocks={blocks}
            pageNumber={1}
            pageCount={2}
            active={active}
            onBlockEnter={(i) => {
              setHovering(true);
              setActive(i);
            }}
          />
        </div>

        <p className={s.readout} aria-live="polite">
          <code>{syntaxFor(blocks[active]!)}</code>
          <span className={s.arrow} aria-hidden="true">
            →
          </span>
          <span key={active} className={s.readoutRule}>
            {ruleFor(blocks[active]!, st)}
          </span>
        </p>

        {/* ── Mini-inspetor: experimente ─────────────────────── */}
        <div className={s.inspector} role="group" aria-label="Experimente a formatação">
          <div className={s.inspHead}>
            <span className="label">Inspetor</span>
            <span className={s.try}>{touched ? 'O PDF acompanha.' : 'Experimente →'}</span>
          </div>

          <label className={s.field}>
            <span className={s.fieldRow}>
              <span>Margens laterais</span>
              <output className={s.value}>{fmt(st.marginLeft)} mm</output>
            </span>
            <input
              type="range"
              min={14}
              max={44}
              step={1}
              value={st.marginLeft}
              onChange={(e) => {
                const v = Number(e.currentTarget.value);
                update({ marginLeft: v, marginRight: Math.max(14, v - 2) });
              }}
              className={s.range}
              style={{ ['--p' as string]: `${((st.marginLeft - 14) / 30) * 100}%` }}
            />
          </label>

          <div className={s.field}>
            <span className={s.fieldRow}>
              <span>Caixa dos títulos</span>
            </span>
            <div className={s.segmented} role="radiogroup" aria-label="Caixa dos títulos">
              {(['normal', 'versais', 'versaletes'] as Caps[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  role="radio"
                  aria-checked={st.h2.caps === c}
                  onClick={() => setCaps(c)}
                >
                  {CAPS_LABEL[c]}
                </button>
              ))}
            </div>
          </div>

          <div className={s.field}>
            <span className={s.fieldRow}>
              <span>Cor institucional</span>
            </span>
            <div className={s.swatches} role="radiogroup" aria-label="Cor institucional">
              {HEADING_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  role="radio"
                  aria-checked={st.headingColor === c.value}
                  aria-label={c.name}
                  title={c.name}
                  onClick={() => update({ headingColor: c.value })}
                  style={{ ['--sw' as string]: c.value }}
                />
              ))}
            </div>
          </div>

          <label className={`${s.field} ${s.switchRow}`}>
            <span>Papel timbrado</span>
            <input
              type="checkbox"
              className={s.switch}
              checked={st.letterhead}
              onChange={(e) =>
                update({
                  letterhead: e.currentTarget.checked,
                  marginTop: e.currentTarget.checked ? 34 : 24,
                })
              }
            />
          </label>
        </div>
      </div>
    </div>
  );
}
