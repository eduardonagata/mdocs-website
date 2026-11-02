/**
 * Parâmetros de formatação de um documento — espelham os eixos que o
 * inspetor do app expõe para o gerador "Documento de negócio".
 * Unidades físicas: margens em mm, corpos em pt, entrelinha em em.
 */

export type Caps = 'normal' | 'versais' | 'versaletes';
export type Align = 'left' | 'center' | 'right';

export interface HeadingStyle {
  size: number; // pt
  align: Align;
  caps: Caps;
}

export interface DocStyle {
  marginTop: number; // mm
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  bodySize: number; // pt
  leading: number; // em (espaço entre linhas, como no Typst)
  spacing: number; // em (espaço entre parágrafos)
  justify: boolean;
  textColor: string;
  headingColor: string;
  h1: HeadingStyle;
  h2: HeadingStyle;
  letterhead: boolean;
}

export const BASE_STYLE: DocStyle = {
  marginTop: 25,
  marginBottom: 25,
  marginLeft: 25,
  marginRight: 25,
  bodySize: 10,
  leading: 0.65,
  spacing: 0.95,
  justify: true,
  textColor: '#16181b',
  headingColor: '#16181b',
  h1: { size: 19.5, align: 'left', caps: 'normal' },
  h2: { size: 15, align: 'left', caps: 'normal' },
  letterhead: false,
};

/** Estilo "acabado" usado no herói do site. */
export const REFINED_STYLE: DocStyle = {
  marginTop: 34,
  marginBottom: 24,
  marginLeft: 25,
  marginRight: 23,
  bodySize: 12,
  leading: 0.72,
  spacing: 1,
  justify: true,
  textColor: '#16181b',
  headingColor: '#2f4b75',
  h1: { size: 17, align: 'center', caps: 'versais' },
  h2: { size: 11.5, align: 'left', caps: 'versais' },
  letterhead: true,
};

export const HEADING_COLORS = [
  { name: 'Tinta', value: '#16181b' },
  { name: 'Azul aço', value: '#2f4b75' },
  { name: 'Bordô', value: '#7a2e2e' },
  { name: 'Verde-musgo', value: '#2e5446' },
] as const;

const nf = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });
export const fmt = (n: number) => nf.format(n);

export const CAPS_LABEL: Record<Caps, string> = {
  normal: 'Normal',
  versais: 'Versais',
  versaletes: 'Versaletes',
};

export const ALIGN_LABEL: Record<Align, string> = {
  left: 'À esquerda',
  center: 'Centralizado',
  right: 'À direita',
};
