/**
 * Roteiro da demonstração.
 *
 * A animação é inteiramente declarativa: cada capítulo é uma lista de ações
 * (mover o cursor, clicar, digitar, arrastar um controle…). Para trocar ou
 * estender a demonstração quando o app evoluir, basta editar este arquivo —
 * o motor (AppDemo.tsx) não precisa mudar.
 */
import { SELECTS, SLIDERS, type DemoState, type SelectId, type SliderId, type ToggleId } from './model';

export type Action =
  | { t: 'wait'; ms: number }
  | { t: 'move'; to: string; ms?: number }
  | { t: 'click'; to?: string }
  | { t: 'set'; patch: (s: DemoState) => Partial<DemoState> }
  | { t: 'type'; text: string; cps?: number }
  | { t: 'stream'; text: string; cps?: number }
  | { t: 'slide'; control: SliderId; to: number; ms?: number }
  | { t: 'choose'; control: SelectId; value: string }
  | { t: 'toggle'; control: ToggleId; value: boolean }
  | { t: 'color'; value: string }
  | { t: 'scroll'; section: string }
  | { t: 'cursor'; visible: boolean };

export interface Chapter {
  id: string;
  title: string;
  caption: string;
  actions: Action[];
}

const PROMPT =
  'Redija um contrato de locação residencial entre Pedro de Pacas (locador) e João da Silva (locatário), por 24 meses, com aluguel de R$ 1.560,00.';

const REPLY =
  'Pronto. Redigi o contrato com as partes, o objeto, a vigência de 24 meses, o valor de R$ 1.560,00, as obrigações de cada parte e o depósito caução. Os campos a completar ficaram entre colchetes.';

export const CHAPTERS: Chapter[] = [
  {
    id: 'converse',
    title: 'Converse',
    caption:
      'Peça o documento ao agente. Ele redige em markdown — o formato nativo da IA — com o modelo e a chave de API que você escolheu.',
    actions: [
      { t: 'cursor', visible: true },
      { t: 'move', to: 'composer', ms: 700 },
      { t: 'click' },
      { t: 'type', text: PROMPT, cps: 52 },
      { t: 'move', to: 'send', ms: 420 },
      { t: 'click' },
      { t: 'set', patch: (s) => ({ userText: s.composer, composer: '', thinking: true }) },
      { t: 'wait', ms: 900 },
      { t: 'set', patch: () => ({ thinking: false }) },
      { t: 'stream', text: REPLY, cps: 120 },
      { t: 'set', patch: () => ({ agentDone: true, hasDoc: true }) },
      { t: 'wait', ms: 1400 },
    ],
  },
  {
    id: 'revise',
    title: 'Revise',
    caption: 'Abra o documento e edite como texto formatado. Você nunca precisa ver um asterisco.',
    actions: [
      { t: 'move', to: 'doc-item', ms: 650 },
      { t: 'click' },
      { t: 'set', patch: () => ({ sidebar: 'doc', face: 'doc' }) },
      { t: 'wait', ms: 900 },
      { t: 'move', to: 'doc-word', ms: 700 },
      { t: 'click' },
      { t: 'set', patch: () => ({ docSelect: true }) },
      { t: 'wait', ms: 1600 },
    ],
  },
  {
    id: 'compose',
    title: 'Componha',
    caption:
      'Um clique e o markdown vira uma folha A4 composta pelo motor Typst: hifenização, justificação e paginação de verdade.',
    actions: [
      { t: 'move', to: 'seg-pdf', ms: 750 },
      { t: 'click' },
      { t: 'set', patch: () => ({ face: 'pdf', docSelect: false }) },
      { t: 'wait', ms: 2200 },
    ],
  },
  {
    id: 'adjust',
    title: 'Ajuste',
    caption:
      'Margens em milímetros, corpo em pontos, entrelinha em em. Cada controle recompõe a página no mesmo instante — no seu Mac, sem servidor no meio.',
    actions: [
      { t: 'move', to: 'inspector-toggle', ms: 700 },
      { t: 'click' },
      { t: 'set', patch: () => ({ inspector: true }) },
      { t: 'wait', ms: 700 },
      { t: 'scroll', section: 'pagina' },
      { t: 'slide', control: 'marginLeft', to: 32, ms: 1300 },
      { t: 'slide', control: 'marginRight', to: 22, ms: 900 },
      { t: 'scroll', section: 'texto' },
      { t: 'slide', control: 'bodySize', to: 11, ms: 1100 },
      { t: 'slide', control: 'leading', to: 0.8, ms: 900 },
      { t: 'wait', ms: 500 },
    ],
  },
  {
    id: 'hierarchy',
    title: 'Hierarquia',
    caption:
      'Cada tipo de elemento markdown tem sua regra: tamanho, caixa e alinhamento dos títulos valem para o documento inteiro.',
    actions: [
      { t: 'scroll', section: 'titulo1' },
      { t: 'choose', control: 'h1Align', value: 'center' },
      { t: 'choose', control: 'h1Caps', value: 'versais' },
      { t: 'slide', control: 'h1Size', to: 16, ms: 900 },
      { t: 'scroll', section: 'titulo2' },
      { t: 'slide', control: 'h2Size', to: 11, ms: 1100 },
      { t: 'choose', control: 'h2Caps', value: 'versais' },
      { t: 'wait', ms: 700 },
    ],
  },
  {
    id: 'letterhead',
    title: 'Timbre',
    caption: 'Ative o papel timbrado e a cor institucional. Todas as páginas acompanham, do cabeçalho ao rodapé.',
    actions: [
      { t: 'scroll', section: 'timbre' },
      { t: 'toggle', control: 'letterhead', value: true },
      { t: 'wait', ms: 500 },
      { t: 'color', value: '#2f4b75' },
      { t: 'scroll', section: 'pagina' },
      { t: 'slide', control: 'marginTop', to: 36, ms: 1000 },
      { t: 'wait', ms: 900 },
    ],
  },
  {
    id: 'export',
    title: 'Exporte',
    caption: 'Exporte o PDF pronto para assinar: em A4, idêntico ao que você vê, quantas vezes precisar.',
    actions: [
      { t: 'move', to: 'share', ms: 700 },
      { t: 'click' },
      { t: 'set', patch: () => ({ exportMenu: true }) },
      { t: 'wait', ms: 500 },
      { t: 'move', to: 'export-pdf', ms: 450 },
      { t: 'set', patch: () => ({ exportHover: true }) },
      { t: 'wait', ms: 250 },
      { t: 'click' },
      { t: 'set', patch: () => ({ exportMenu: false, exportHover: false, toast: true }) },
      { t: 'move', to: 'page', ms: 900 },
      { t: 'wait', ms: 2600 },
      { t: 'set', patch: () => ({ toast: false }) },
      { t: 'wait', ms: 600 },
    ],
  },
];

/** Aplica uma ação sem animação — usado para pular entre capítulos. */
export function applyInstant(state: DemoState, a: Action): DemoState {
  switch (a.t) {
    case 'set':
      return { ...state, ...a.patch(state) };
    case 'type':
      return { ...state, composer: a.text };
    case 'stream':
      return { ...state, agentText: a.text };
    case 'slide':
      return { ...state, style: SLIDERS[a.control].set(state.style, a.to) };
    case 'choose': {
      const def = SELECTS[a.control];
      return def.set ? { ...state, style: def.set(state.style, a.value) } : state;
    }
    case 'toggle':
      return { ...state, style: { ...state.style, [a.control]: a.value } };
    case 'color':
      return { ...state, style: { ...state.style, headingColor: a.value } };
    default:
      return state;
  }
}

/** Duração aproximada de um capítulo (para a barra de progresso). */
export function estimate(ch: Chapter): number {
  let ms = 0;
  for (const a of ch.actions) {
    switch (a.t) {
      case 'wait':
        ms += a.ms;
        break;
      case 'move':
        ms += a.ms ?? 600;
        break;
      case 'click':
        ms += 180;
        break;
      case 'type':
        ms += (a.text.length / (a.cps ?? 40)) * 1000;
        break;
      case 'stream':
        ms += (a.text.length / (a.cps ?? 90)) * 1000;
        break;
      case 'slide':
        ms += 650 + 180 + (a.ms ?? 900) + 120;
        break;
      case 'choose':
        ms += 650 + 180 + 420 + 380 + 180 + 300;
        break;
      case 'toggle':
      case 'color':
        ms += 650 + 180 + 200;
        break;
      case 'scroll':
        ms += 520;
        break;
    }
  }
  return ms;
}
