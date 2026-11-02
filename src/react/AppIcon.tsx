import { useId } from 'react';

/**
 * Ícone do MarkDocs — conceito "Recorte em contra-grão".
 * Uma placa escovada de chumbo a prata, com um pequeno recorte da mesma chapa
 * girado no canto. Sem contorno nem sombra: o recorte só aparece porque o grão
 * e a luz correm em outra direção.
 *
 * Cores amostradas do arquivo de design do ícone (gradiente a 135°).
 */

const STOPS: [number, string][] = [
  [0.08, '#dee4eb'],
  [0.2, '#d0d7e0'],
  [0.35, '#a0aab9'],
  [0.5, '#6f7d90'],
  [0.65, '#4f5a69'],
  [0.8, '#323945'],
  [0.92, '#252b35'],
];

/** Superelipse (n = 5) — aproxima o "squircle" contínuo dos ícones da Apple. */
function squircle(size: number, n = 5, steps = 96): string {
  const r = size / 2;
  const pts: string[] = [];
  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const c = Math.cos(t);
    const s = Math.sin(t);
    const x = r + r * Math.sign(c) * Math.abs(c) ** (2 / n);
    const y = r + r * Math.sign(s) * Math.abs(s) ** (2 / n);
    pts.push(`${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return `M${pts.join('L')}Z`;
}

const PLATE = squircle(100);

interface Props {
  size?: number;
  className?: string;
  /** Rótulo acessível; se ausente o ícone é decorativo. */
  title?: string;
  /** Intensidade do escovado (0–1). */
  grain?: number;
}

export default function AppIcon({ size = 64, className, title, grain = 0.14 }: Props) {
  const raw = useId();
  const id = `mdi${raw.replace(/[^a-zA-Z0-9]/g, '')}`;
  // Recorte: 23% do lado, 21% da borda, cantos de 18%.
  const cut = { size: 23, x: 100 - 21 - 23, y: 21, r: 23 * 0.24 };

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <linearGradient id={`${id}-plate`} x1="0" y1="0" x2="1" y2="1">
          {STOPS.map(([o, c]) => (
            <stop key={o} offset={o} stopColor={c} />
          ))}
        </linearGradient>
        {/* O recorte é a mesma chapa, comprimida no próprio quadro */}
        <linearGradient id={`${id}-cut`} x1="0" y1="0" x2="1" y2="1">
          {STOPS.map(([o, c]) => (
            <stop key={o} offset={o} stopColor={c} />
          ))}
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <path d={PLATE} />
        </clipPath>
        <clipPath id={`${id}-cutclip`}>
          <rect x={cut.x} y={cut.y} width={cut.size} height={cut.size} rx={cut.r} />
        </clipPath>
        {/* Escovado: ruído anisotrópico — fibras longas numa só direção */}
        <filter id={`${id}-grain`} x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.004 1.3" numOctaves="2" seed="7" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 1.6 -0.55"
          />
        </filter>
        <filter id={`${id}-grain-dark`} x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.004 1.3" numOctaves="2" seed="13" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.08
                    0 0 0 0 0.1
                    0 0 0 0 0.14
                    0 0 0 1.6 -0.62"
          />
        </filter>
        <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <g clipPath={`url(#${id}-clip)`}>
        <rect width="100" height="100" fill={`url(#${id}-plate)`} />
        <g transform="rotate(-38 50 50)" opacity={grain}>
          <rect x="-40" y="-40" width="180" height="180" filter={`url(#${id}-grain)`} />
          <rect x="-40" y="-40" width="180" height="180" filter={`url(#${id}-grain-dark)`} />
        </g>
        <rect width="100" height="100" fill={`url(#${id}-sheen)`} />

        <g clipPath={`url(#${id}-cutclip)`}>
          <rect x={cut.x} y={cut.y} width={cut.size} height={cut.size} fill={`url(#${id}-cut)`} />
          <g transform={`rotate(48 ${cut.x + cut.size / 2} ${cut.y + cut.size / 2})`} opacity={grain * 0.8}>
            <rect x={cut.x - 20} y={cut.y - 20} width={cut.size + 40} height={cut.size + 40} filter={`url(#${id}-grain)`} />
            <rect x={cut.x - 20} y={cut.y - 20} width={cut.size + 40} height={cut.size + 40} filter={`url(#${id}-grain-dark)`} />
          </g>
        </g>
      </g>
      {title && <title>{title}</title>}
    </svg>
  );
}
