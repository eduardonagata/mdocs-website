import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import A4Page from '../a4/A4Page';
import AppIcon from '../AppIcon';
import { parseBlocks, type Block } from '../../lib/markdown';
import { FULL_MARKDOWN, PAGE_TWO_MARKDOWN, CONTRACT_DOC_NAME, CONTRACT_TITLE } from '../../data/contract';
import { HEADING_COLORS, fmt } from '../a4/docStyle';
import {
  INITIAL_STATE,
  SELECTS,
  SLIDERS,
  type DemoState,
  type Face,
  type SelectId,
  type SliderId,
  type ToggleId,
} from './model';
import { CHAPTERS, applyInstant, estimate, type Action } from './timeline';
import {
  ArrowUpIcon,
  ChatIcon,
  CheckIcon,
  ChevronsIcon,
  FolderIcon,
  KeyIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  Pointer,
  ShareIcon,
  SidebarIcon,
  SlidersIcon,
} from './icons';
import s from './AppDemo.module.css';

/** Tamanho de projeto da janela; ela é escalada para caber na página. */
const W_FULL = 1200;
/** Em telas estreitas a barra lateral sai e a janela fica mais estreita (e maior). */
const W_COMPACT = 880;
const H = 760;

const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

function snapshot(chapterIndex: number): DemoState {
  let st = INITIAL_STATE;
  for (let c = 0; c < chapterIndex; c++) for (const a of CHAPTERS[c]!.actions) st = applyInstant(st, a);
  return { ...st, focus: null, menu: null, exportMenu: false, exportHover: false, toast: false, thinking: false };
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

const unitFmt = (v: number, unit: string) => `${fmt(v)} ${unit}`;

/* ─────────────────────────────────────────────────────────────────── */

export default function AppDemo() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const inspScrollRef = useRef<HTMLDivElement>(null);
  const runId = useRef(0);
  const chapterRef = useRef(0);
  const stateRef = useRef<DemoState>(INITIAL_STATE);

  const [scale, setScale] = useState(0);
  const [compact, setCompact] = useState(false);
  const W = compact ? W_COMPACT : W_FULL;
  const wRef = useRef(W_FULL);
  wRef.current = W;
  const [state, setStateRaw] = useState<DemoState>(INITIAL_STATE);
  const [chapter, setChapterRaw] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [playKey, setPlayKey] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();
  const visibleRef = useRef(false);

  const setState = (fn: (prev: DemoState) => DemoState) =>
    setStateRaw((prev) => {
      const next = fn(prev);
      stateRef.current = next;
      return next;
    });
  const patch = (p: Partial<DemoState>) => setState((prev) => ({ ...prev, ...p }));
  const setChapter = (c: number) => {
    chapterRef.current = c;
    setChapterRaw(c);
  };

  const blocks = useMemo(() => parseBlocks(FULL_MARKDOWN), []);
  const blocks2 = useMemo(() => parseBlocks(PAGE_TWO_MARKDOWN), []);

  /* ── Escala ─────────────────────────────────────────────────────── */
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const ro = new ResizeObserver(() => {
      const isCompact = vp.clientWidth < 640;
      setCompact(isCompact);
      setScale(vp.clientWidth / (isCompact ? W_COMPACT : W_FULL));
    });
    ro.observe(vp);
    return () => ro.disconnect();
  }, []);

  /* ── Cursor ─────────────────────────────────────────────────────── */
  const cursor = useRef({ x: W_FULL * 0.62, y: H * 0.86 });
  const placeCursor = (x: number, y: number, ms: number) => {
    const el = cursorRef.current;
    if (!el) return;
    el.style.transitionDuration = `${ms}ms`;
    el.style.transform = `translate(${x}px, ${y}px)`;
    cursor.current = { x, y };
  };
  const target = (name: string) => rootRef.current?.querySelector<HTMLElement>(`[data-t="${name}"]`) ?? null;
  const rectOf = (el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    const R = rootRef.current!.getBoundingClientRect();
    const k = R.width / wRef.current || 1;
    return { x: (r.left - R.left) / k, y: (r.top - R.top) / k, w: r.width / k, h: r.height / k };
  };
  const moveTo = async (name: string, ms = 600) => {
    const el = target(name);
    if (!el) return;
    const r = rectOf(el);
    placeCursor(r.x + r.w / 2, r.y + r.h / 2, ms);
    await sleep(ms);
  };
  const press = async () => {
    cursorRef.current?.classList.add(s.down!);
    await sleep(130);
    cursorRef.current?.classList.remove(s.down!);
    await sleep(50);
  };

  /* ── Execução das ações ─────────────────────────────────────────── */
  const exec = async (a: Action, alive: () => boolean) => {
    switch (a.t) {
      case 'wait':
        await sleep(a.ms);
        return;
      case 'cursor':
        if (cursorRef.current) cursorRef.current.style.opacity = a.visible ? '1' : '0';
        return;
      case 'move':
        await moveTo(a.to, a.ms);
        return;
      case 'click':
        if (a.to) await moveTo(a.to);
        await press();
        return;
      case 'set':
        setState((prev) => ({ ...prev, ...a.patch(prev) }));
        await sleep(40);
        return;
      case 'type': {
        const step = 1000 / (a.cps ?? 40);
        for (let i = 1; i <= a.text.length; i += 2) {
          if (!alive()) return;
          patch({ composer: a.text.slice(0, i) });
          await sleep(step * 2);
        }
        patch({ composer: a.text });
        return;
      }
      case 'stream': {
        const words = a.text.split(/(?<=\s)/);
        let acc = '';
        for (const w of words) {
          if (!alive()) return;
          acc += w;
          patch({ agentText: acc });
          await sleep((w.length / (a.cps ?? 90)) * 1000);
        }
        return;
      }
      case 'slide': {
        const def = SLIDERS[a.control];
        const track = target(`slider:${a.control}`);
        if (!track) return;
        const r = rectOf(track);
        const xOf = (v: number) => r.x + ((v - def.min) / (def.max - def.min)) * r.w;
        const from = def.get(stateRef.current.style);
        patch({ focus: a.control });
        placeCursor(xOf(from), r.y + r.h / 2, 650);
        await sleep(650);
        if (!alive()) return;
        cursorRef.current?.classList.add(s.down!);
        await sleep(180);
        const dur = a.ms ?? 900;
        const t0 = performance.now();
        await new Promise<void>((resolve) => {
          const tick = (now: number) => {
            if (!alive()) return resolve();
            const t = Math.min(1, (now - t0) / dur);
            const raw = from + (a.to - from) * easeInOut(t);
            const v = Math.round(raw / def.step) * def.step;
            placeCursor(xOf(raw), r.y + r.h / 2, 0);
            setState((prev) => ({ ...prev, style: def.set(prev.style, Number(v.toFixed(2))) }));
            if (t < 1) requestAnimationFrame(tick);
            else resolve();
          };
          requestAnimationFrame(tick);
        });
        cursorRef.current?.classList.remove(s.down!);
        await sleep(120);
        patch({ focus: null });
        return;
      }
      case 'choose': {
        const def = SELECTS[a.control];
        patch({ focus: a.control });
        await moveTo(`select:${a.control}`, 650);
        if (!alive()) return;
        await press();
        patch({ menu: { control: a.control, hover: def.get(stateRef.current.style) } });
        await sleep(420);
        if (!alive()) return;
        await moveTo(`option:${a.control}:${a.value}`, 380);
        patch({ menu: { control: a.control, hover: a.value } });
        await press();
        setState((prev) => ({
          ...prev,
          style: def.set ? def.set(prev.style, a.value) : prev.style,
          menu: null,
          focus: null,
        }));
        await sleep(300);
        return;
      }
      case 'toggle':
        patch({ focus: a.control });
        await moveTo(`toggle:${a.control}`, 650);
        await press();
        setState((prev) => ({ ...prev, style: { ...prev.style, [a.control]: a.value }, focus: null }));
        await sleep(200);
        return;
      case 'color':
        await moveTo(`color:${a.value}`, 650);
        await press();
        setState((prev) => ({ ...prev, style: { ...prev.style, headingColor: a.value } }));
        await sleep(200);
        return;
      case 'scroll': {
        const box = inspScrollRef.current;
        const sec = box?.querySelector<HTMLElement>(`[data-section="${a.section}"]`);
        if (box && sec) box.scrollTo({ top: sec.offsetTop - 4, behavior: 'smooth' });
        await sleep(520);
        return;
      }
    }
  };

  const stop = () => {
    runId.current++;
    setPlaying(false);
  };

  const run = async (from: number) => {
    const id = ++runId.current;
    const alive = () => id === runId.current;
    const snap = snapshot(from);
    stateRef.current = snap;
    setStateRaw(snap);
    inspScrollRef.current?.scrollTo({ top: 0 });
    setPlaying(true);
    await sleep(80);
    for (let c = from; c < CHAPTERS.length; c++) {
      if (!alive()) return;
      setChapter(c);
      setPlayKey((k) => k + 1);
      for (const a of CHAPTERS[c]!.actions) {
        if (!alive()) return;
        await exec(a, alive);
      }
    }
    if (!alive()) return;
    await sleep(1400);
    if (alive()) void run(0);
  };

  /* ── Reprodução: só quando visível, nunca com movimento reduzido ── */
  useEffect(() => {
    if (reduced) {
      stop();
      const snap = snapshot(CHAPTERS.length - 1);
      stateRef.current = snap;
      setStateRaw(snap);
      setChapter(CHAPTERS.length - 2);
      return;
    }
    const vp = viewportRef.current;
    if (!vp) return;
    const io = new IntersectionObserver(
      ([e]) => {
        const vis = !!e?.isIntersecting;
        visibleRef.current = vis;
        if (vis && !paused) void run(chapterRef.current);
        if (!vis) stop();
      },
      { threshold: 0.35 },
    );
    io.observe(vp);
    return () => {
      io.disconnect();
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, paused]);

  const goTo = (i: number) => {
    if (reduced || paused) {
      stop();
      const snap = snapshot(i + 1);
      stateRef.current = snap;
      setStateRaw(snap);
      setChapter(i);
      return;
    }
    setChapter(i);
    void run(i);
  };

  const togglePause = () => {
    if (paused) {
      setPaused(false); // o efeito retoma a reprodução
    } else {
      setPaused(true);
      stop();
    }
  };

  /* ── Render ─────────────────────────────────────────────────────── */
  const st = state.style;
  const docName = state.face === 'chat' ? 'Conversa' : CONTRACT_DOC_NAME;

  return (
    <div className={s.demo}>
      <div className={s.viewport} ref={viewportRef} style={{ aspectRatio: `${W} / ${H}` }}>
        <div
          className={s.window}
          ref={rootRef}
          aria-hidden="true"
          data-face={state.face}
          data-compact={compact || undefined}
          style={{ width: W, transform: `scale(${scale})`, opacity: scale ? 1 : 0 }}
        >
          {/* Conteúdo principal (atrás dos painéis de vidro) */}
          <div className={s.main} data-inspector={state.inspector || undefined}>
            <div className={s.titlebar}>
              <span className={s.title}>{docName}</span>
            </div>
            <Faces
              face={state.face}
              render={(f) =>
                f === 'chat' ? (
                  <ChatFace state={state} />
                ) : f === 'doc' ? (
                  <DocFace blocks={blocks} selected={state.docSelect} />
                ) : (
                  <PdfFace st={st} blocks={blocks} blocks2={blocks2} />
                )
              }
            />
            {state.face !== 'chat' && (
              <div className={s.segmented}>
                <span data-t="seg-doc" data-on={state.face === 'doc' || undefined}>
                  Documento
                </span>
                <span data-t="seg-pdf" data-on={state.face === 'pdf' || undefined}>
                  PDF
                </span>
              </div>
            )}
            {state.toast && (
              <div className={s.toast}>
                <span className={s.toastCheck}>
                  <CheckIcon />
                </span>
                <strong>{CONTRACT_TITLE}.pdf</strong>
                <span>exportado · A4 · 2 páginas</span>
              </div>
            )}
          </div>

          {/* Barra lateral */}
          <aside className={`${s.glass} ${s.sidebar}`}>
            <div className={s.sideTop}>
              <span className={s.lights}>
                <i />
                <i />
                <i />
              </span>
              <span className={s.toolBtn}>
                <SidebarIcon />
              </span>
              <span className={s.toolBtn}>
                <FolderIcon />
              </span>
            </div>
            <div className={s.sideItem} data-t="nav-chat" data-on={state.sidebar === 'chat' || undefined}>
              <ChatIcon /> Conversa
            </div>
            <div className={s.sideLabel}>Documentos</div>
            {state.hasDoc ? (
              <div className={`${s.sideItem} ${s.sideDoc}`} data-t="doc-item" data-on={state.sidebar === 'doc' || undefined}>
                <span className={s.thumb} />
                <span className={s.ellipsis}>{CONTRACT_DOC_NAME}</span>
              </div>
            ) : (
              <div className={s.sideEmpty}>Nenhum documento ainda</div>
            )}
            <div className={s.sideFoot}>
              <KeyIcon />
              <span>Anthropic · sua chave</span>
            </div>
          </aside>

          {/* Inspetor — um painel contínuo, sem faixas */}
          <aside className={`${s.glass} ${s.inspector}`} data-open={state.inspector || undefined}>
            <div className={s.inspScroll} ref={inspScrollRef}>
              <Section id="pagina" title="Página">
                <SelectRow id="pageSize" state={state} />
                <SliderRow id="marginTop" state={state} />
                <SliderRow id="marginBottom" state={state} />
                <SliderRow id="marginLeft" state={state} />
                <SliderRow id="marginRight" state={state} />
              </Section>
              <Section id="timbre" title="Timbre">
                <ToggleRow id="letterhead" label="Papel timbrado" state={state} hint="ferraz-lima.timbre" />
                <div className={s.row}>
                  <span>Cor institucional</span>
                  <span className={s.swatches}>
                    {HEADING_COLORS.map((c) => (
                      <i
                        key={c.value}
                        data-t={`color:${c.value}`}
                        data-on={st.headingColor === c.value || undefined}
                        style={{ background: c.value }}
                      />
                    ))}
                  </span>
                </div>
              </Section>
              <Section id="texto" title="Texto">
                <SelectRow id="bodyFont" state={state} />
                <SliderRow id="bodySize" state={state} />
                <ToggleRow id="justify" label="Justificar" state={state} />
                <SliderRow id="leading" state={state} />
                <SliderRow id="spacing" state={state} />
              </Section>
              <Section id="titulo1" title="Título 1">
                <SelectRow id="h1Font" state={state} />
                <SliderRow id="h1Size" state={state} />
                <SelectRow id="h1Align" state={state} />
                <SelectRow id="h1Caps" state={state} />
              </Section>
              <Section id="titulo2" title="Título 2">
                <SelectRow id="h2Font" state={state} />
                <SliderRow id="h2Size" state={state} />
                <SelectRow id="h2Align" state={state} />
                <SelectRow id="h2Caps" state={state} />
              </Section>
              <div className={s.inspSpacer} />
            </div>
          </aside>

          {/* Botões da barra de ferramentas, flutuando sobre o conteúdo */}
          <div className={s.toolsRight}>
            <span className={s.toolBtn} data-t="inspector-toggle" data-on={state.inspector || undefined}>
              <SlidersIcon />
            </span>
            <span className={s.toolBtn} data-t="share" data-on={state.exportMenu || undefined}>
              <ShareIcon />
            </span>
          </div>

          {state.exportMenu && (
            <div className={s.exportMenu}>
              <div data-t="export-pdf" data-on={state.exportHover || undefined}>
                Exportar PDF…
              </div>
              <div>Copiar como markdown</div>
              <hr />
              <div>Compartilhar…</div>
            </div>
          )}

          <div className={s.cursor} ref={cursorRef} style={{ transform: `translate(${W_FULL * 0.62}px, ${H * 0.86}px)` }}>
            <Pointer />
          </div>
        </div>
      </div>

      {/* Capítulos */}
      <div className={s.chapters}>
        <div className={s.chapterList} role="tablist" aria-label="Capítulos da demonstração">
          {CHAPTERS.map((c, i) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={i === chapter}
              className={s.chapterBtn}
              onClick={() => goTo(i)}
            >
              <span className={s.chNum}>{String(i + 1).padStart(2, '0')}</span>
              <span className={s.chTitle}>{c.title}</span>
              <span className={s.chBar}>
                <span
                  key={i === chapter ? `a${playKey}` : `i${i}`}
                  className={s.chFill}
                  data-state={i < chapter ? 'done' : i === chapter ? (playing ? 'active' : 'held') : 'todo'}
                  style={{ animationDuration: `${estimate(c)}ms` }}
                />
              </span>
            </button>
          ))}
        </div>
        {!reduced && (
          <button
            type="button"
            className={s.playBtn}
            onClick={togglePause}
            aria-label={paused ? 'Reproduzir demonstração' : 'Pausar demonstração'}
          >
            {paused ? <PlayIcon /> : <PauseIcon />}
          </button>
        )}
      </div>
      <p className={s.caption} aria-live="polite">
        <span key={chapter}>{CHAPTERS[chapter]!.caption}</span>
      </p>
    </div>
  );
}

/* ── Faces ──────────────────────────────────────────────────────────── */

function Faces({ face, render }: { face: Face; render: (f: Face) => ReactNode }) {
  const [prev, setPrev] = useState<Face | null>(null);
  const last = useRef(face);
  useEffect(() => {
    if (last.current === face) return;
    setPrev(last.current);
    last.current = face;
    const t = window.setTimeout(() => setPrev(null), 760);
    return () => window.clearTimeout(t);
  }, [face]);
  return (
    <div className={s.stage}>
      {prev && (
        <div key={`out-${prev}`} className={`${s.face} ${s.faceOut}`}>
          {render(prev)}
        </div>
      )}
      <div key={`in-${face}`} className={`${s.face} ${prev ? s.faceIn : ''}`}>
        {render(face)}
      </div>
    </div>
  );
}

function ChatFace({ state }: { state: DemoState }) {
  const typing = state.composer.length > 0;
  return (
    <div className={s.chat}>
      <div className={s.thread}>
        {!state.userText && (
          <div className={s.empty}>
            <AppIcon size={52} grain={0.14} />
            <p>O que vamos redigir hoje?</p>
          </div>
        )}
        {state.userText && <div className={s.userMsg}>{state.userText}</div>}
        {state.thinking && (
          <div className={s.thinking}>
            <i />
            <i />
            <i />
          </div>
        )}
        {state.agentText && (
          <div className={s.agentMsg}>
            <div className={s.agentHead}>
              <AppIcon size={18} grain={0.1} />
              <span>Agente</span>
              <em>claude · via sua chave</em>
            </div>
            <p>{state.agentText}</p>
            {state.agentDone && (
              <div className={s.docCard}>
                <span className={s.docThumb}>
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
                <span className={s.docMeta}>
                  <strong>{CONTRACT_DOC_NAME}</strong>
                  <span>Documento criado · A4 · 2 páginas</span>
                </span>
              </div>
            )}
          </div>
        )}
      </div>
      <div className={s.composer} data-t="composer" data-active={typing || undefined}>
        <span className={s.plus}>
          <PlusIcon />
        </span>
        <div className={s.composerText}>
          {state.composer ? (
            <>
              {state.composer}
              <span className={s.caret} />
            </>
          ) : (
            <span className={s.placeholder}>Peça um documento ao agente…</span>
          )}
        </div>
        <span className={s.modelChip}>
          <KeyIcon /> Claude
        </span>
        <span className={s.send} data-t="send" data-on={typing || undefined}>
          <ArrowUpIcon />
        </span>
      </div>
    </div>
  );
}

function DocFace({ blocks, selected }: { blocks: Block[]; selected: boolean }) {
  return (
    <div className={s.docView}>
      <div className={s.docSheet}>
        {blocks.map((b, i) => {
          const inl = b.inlines.map((x, k) =>
            x.bold ? (
              <strong
                key={k}
                data-t={i === 7 && k === 1 ? 'doc-word' : undefined}
                data-selected={(i === 7 && k === 1 && selected) || undefined}
              >
                {x.text}
              </strong>
            ) : (
              <span key={k}>{x.text}</span>
            ),
          );
          if (b.kind === 'h1') return <h1 key={i}>{inl}</h1>;
          if (b.kind === 'h2' || b.kind === 'h3') return <h2 key={i}>{inl}</h2>;
          if (b.kind === 'ul')
            return (
              <ul key={i}>
                {b.items.map((it, k) => (
                  <li key={k}>{it.map((x) => x.text).join('')}</li>
                ))}
              </ul>
            );
          return <p key={i}>{inl}</p>;
        })}
      </div>
    </div>
  );
}

function PdfFace({ st, blocks, blocks2 }: { st: DemoState['style']; blocks: Block[]; blocks2: Block[] }) {
  return (
    <div className={s.pdfView}>
      <div className={s.pages}>
        <div className={s.pageShadow} data-t="page">
          <A4Page style={st} blocks={blocks} pageNumber={1} pageCount={2} />
        </div>
        <div className={s.pageShadow}>
          <A4Page
            style={st}
            blocks={blocks2}
            pageNumber={2}
            pageCount={2}
            runningHeader={CONTRACT_TITLE}
            signatures={[
              ['Locador:', 'Pedro de Pacas'],
              ['Locatário:', 'João da Silva'],
            ]}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Controles do inspetor (somente exibição) ───────────────────────── */

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section className={s.section} data-section={id}>
      <h4 className={s.sectionTitle}>{title}</h4>
      {children}
    </section>
  );
}

function SliderRow({ id, state }: { id: SliderId; state: DemoState }) {
  const def = SLIDERS[id];
  const v = def.get(state.style);
  const p = ((v - def.min) / (def.max - def.min)) * 100;
  return (
    <div className={s.sliderRow} data-focus={state.focus === id || undefined}>
      <div className={s.rowHead}>
        <span>{def.label}</span>
        <span className={s.val}>{unitFmt(v, def.unit)}</span>
      </div>
      <div className={s.track} data-t={`slider:${id}`}>
        <span className={s.fill} style={{ width: `${p}%` }} />
        <span className={s.knob} style={{ left: `${p}%` }} />
      </div>
      <div className={s.ticks} />
    </div>
  );
}

function SelectRow({ id, state }: { id: SelectId; state: DemoState }) {
  const def = SELECTS[id];
  const value = def.get(state.style);
  const label = def.options.find((o) => o.value === value)?.label ?? value;
  const open = state.menu?.control === id;
  return (
    <div className={s.row} data-focus={state.focus === id || undefined}>
      <span>{def.label}</span>
      <span className={s.select} data-t={`select:${id}`} data-open={open || undefined}>
        {label}
        <ChevronsIcon />
        {open && (
          <span className={s.menu}>
            {def.options.map((o) => (
              <span
                key={o.value}
                data-t={`option:${id}:${o.value}`}
                data-hover={state.menu?.hover === o.value || undefined}
              >
                <span className={s.menuCheck}>{o.value === value && <CheckIcon />}</span>
                {o.label}
              </span>
            ))}
          </span>
        )}
      </span>
    </div>
  );
}

function ToggleRow({ id, label, state, hint }: { id: ToggleId; label: string; state: DemoState; hint?: string }) {
  const on = state.style[id];
  return (
    <div className={s.row} data-focus={state.focus === id || undefined}>
      <span className={s.toggleLabel}>
        {label}
        {hint && <em>{hint}</em>}
      </span>
      <span className={s.switch} data-t={`toggle:${id}`} data-on={on || undefined}>
        <i />
      </span>
    </div>
  );
}
