import { BASE_STYLE, type Align, type Caps, type DocStyle } from '../a4/docStyle';

/** As "faces" do app: girar o objeto para ver outra superfície. */
export type Face = 'chat' | 'doc' | 'pdf';

export interface MenuState {
  control: SelectId;
  hover: string | null;
}

export interface DemoState {
  face: Face;
  sidebar: 'chat' | 'doc';
  hasDoc: boolean;
  composer: string;
  userText: string;
  thinking: boolean;
  agentText: string;
  agentDone: boolean;
  docSelect: boolean;
  inspector: boolean;
  focus: string | null;
  menu: MenuState | null;
  exportMenu: boolean;
  exportHover: boolean;
  toast: boolean;
  style: DocStyle;
}

export const INITIAL_STATE: DemoState = {
  face: 'chat',
  sidebar: 'chat',
  hasDoc: false,
  composer: '',
  userText: '',
  thinking: false,
  agentText: '',
  agentDone: false,
  docSelect: false,
  inspector: false,
  focus: null,
  menu: null,
  exportMenu: false,
  exportHover: false,
  toast: false,
  style: BASE_STYLE,
};

/* ── Controles do inspetor ──────────────────────────────────────── */

export type SliderId =
  | 'marginTop'
  | 'marginBottom'
  | 'marginLeft'
  | 'marginRight'
  | 'bodySize'
  | 'leading'
  | 'spacing'
  | 'h1Size'
  | 'h2Size';

export interface SliderDef {
  id: SliderId;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: 'mm' | 'pt' | 'em';
  get: (s: DocStyle) => number;
  set: (s: DocStyle, v: number) => DocStyle;
}

const simple = (
  id: SliderId & keyof DocStyle,
  label: string,
  min: number,
  max: number,
  step: number,
  unit: SliderDef['unit'],
): SliderDef => ({
  id,
  label,
  min,
  max,
  step,
  unit,
  get: (s) => s[id] as number,
  set: (s, v) => ({ ...s, [id]: v }),
});

export const SLIDERS: Record<SliderId, SliderDef> = {
  marginTop: simple('marginTop', 'Margem superior', 10, 60, 1, 'mm'),
  marginBottom: simple('marginBottom', 'Margem inferior', 10, 60, 1, 'mm'),
  marginLeft: simple('marginLeft', 'Margem esquerda', 10, 60, 1, 'mm'),
  marginRight: simple('marginRight', 'Margem direita', 10, 60, 1, 'mm'),
  bodySize: simple('bodySize', 'Corpo', 8, 14, 0.5, 'pt'),
  leading: simple('leading', 'Entrelinha', 0.3, 1.2, 0.05, 'em'),
  spacing: simple('spacing', 'Espaço entre parágrafos', 0.4, 2, 0.05, 'em'),
  h1Size: {
    id: 'h1Size',
    label: 'Tamanho',
    min: 10,
    max: 32,
    step: 0.5,
    unit: 'pt',
    get: (s) => s.h1.size,
    set: (s, v) => ({ ...s, h1: { ...s.h1, size: v } }),
  },
  h2Size: {
    id: 'h2Size',
    label: 'Tamanho',
    min: 8,
    max: 28,
    step: 0.5,
    unit: 'pt',
    get: (s) => s.h2.size,
    set: (s, v) => ({ ...s, h2: { ...s.h2, size: v } }),
  },
};

export type SelectId = 'pageSize' | 'bodyFont' | 'h1Font' | 'h1Align' | 'h1Caps' | 'h2Font' | 'h2Align' | 'h2Caps';

export interface SelectDef {
  id: SelectId;
  label: string;
  options: { value: string; label: string }[];
  get: (s: DocStyle) => string;
  set?: (s: DocStyle, v: string) => DocStyle;
}

const ALIGN_OPTS = [
  { value: 'left', label: 'À esquerda' },
  { value: 'center', label: 'Centralizado' },
  { value: 'right', label: 'À direita' },
];
const CAPS_OPTS = [
  { value: 'normal', label: 'Normal' },
  { value: 'versais', label: 'Versais' },
  { value: 'versaletes', label: 'Versaletes' },
];

export const SELECTS: Record<SelectId, SelectDef> = {
  pageSize: { id: 'pageSize', label: 'Tamanho', options: [{ value: 'A4', label: 'A4' }], get: () => 'A4' },
  bodyFont: {
    id: 'bodyFont',
    label: 'Fonte',
    options: [{ value: 'Libertinus Serif', label: 'Libertinus Serif' }],
    get: () => 'Libertinus Serif',
  },
  h1Font: {
    id: 'h1Font',
    label: 'Fonte',
    options: [{ value: 'inherit', label: '— herdar do corpo —' }],
    get: () => 'inherit',
  },
  h2Font: {
    id: 'h2Font',
    label: 'Fonte',
    options: [{ value: 'inherit', label: '— herdar do corpo —' }],
    get: () => 'inherit',
  },
  h1Align: {
    id: 'h1Align',
    label: 'Alinhamento',
    options: ALIGN_OPTS,
    get: (s) => s.h1.align,
    set: (s, v) => ({ ...s, h1: { ...s.h1, align: v as Align } }),
  },
  h1Caps: {
    id: 'h1Caps',
    label: 'Caixa',
    options: CAPS_OPTS,
    get: (s) => s.h1.caps,
    set: (s, v) => ({ ...s, h1: { ...s.h1, caps: v as Caps } }),
  },
  h2Align: {
    id: 'h2Align',
    label: 'Alinhamento',
    options: ALIGN_OPTS,
    get: (s) => s.h2.align,
    set: (s, v) => ({ ...s, h2: { ...s.h2, align: v as Align } }),
  },
  h2Caps: {
    id: 'h2Caps',
    label: 'Caixa',
    options: CAPS_OPTS,
    get: (s) => s.h2.caps,
    set: (s, v) => ({ ...s, h2: { ...s.h2, caps: v as Caps } }),
  },
};

export type ToggleId = 'letterhead' | 'justify';
