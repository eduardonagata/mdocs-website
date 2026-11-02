/** Ícones de linha no estilo SF Symbols, desenhados para 16–18 px. */
import type { SVGProps } from 'react';

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export const SidebarIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" width="18" height="18" {...base} {...p}>
    <rect x="2.75" y="4" width="14.5" height="12" rx="2.5" />
    <path d="M7.5 4v12M4.6 7h1.2M4.6 9.2h1.2" />
  </svg>
);

export const FolderIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" width="18" height="18" {...base} {...p}>
    <path d="M2.75 6.25a1.5 1.5 0 0 1 1.5-1.5h3.3l1.6 1.6h6.6a1.5 1.5 0 0 1 1.5 1.5v6.9a1.5 1.5 0 0 1-1.5 1.5H4.25a1.5 1.5 0 0 1-1.5-1.5V6.25Z" />
  </svg>
);

export const ChatIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" width="16" height="16" {...base} {...p}>
    <path d="M4.5 4h11a1.5 1.5 0 0 1 1.5 1.5v6.5a1.5 1.5 0 0 1-1.5 1.5H9l-3.5 2.75V13.5h-1A1.5 1.5 0 0 1 3 12V5.5A1.5 1.5 0 0 1 4.5 4Z" />
    <path d="M6.5 7.5h7M6.5 10h4.5" />
  </svg>
);

export const DocIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" width="16" height="16" {...base} {...p}>
    <path d="M5.5 2.75h6l3.75 3.75v10a.75.75 0 0 1-.75.75H5.5a.75.75 0 0 1-.75-.75V3.5a.75.75 0 0 1 .75-.75Z" />
    <path d="M11.5 2.75V6.5h3.75M7.5 10h5M7.5 12.5h5M7.5 15h3" />
  </svg>
);

export const SlidersIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" width="18" height="18" {...base} {...p}>
    <path d="M3 5.5h8M14.5 5.5H17M3 10h2.5M9 10h8M3 14.5h7M13.5 14.5H17" />
    <circle cx="12.75" cy="5.5" r="1.75" />
    <circle cx="7.25" cy="10" r="1.75" />
    <circle cx="11.75" cy="14.5" r="1.75" />
  </svg>
);

export const ShareIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" width="18" height="18" {...base} {...p}>
    <path d="M10 2.75v9.5M6.75 6 10 2.75 13.25 6" />
    <path d="M7 8.5H5.75a1 1 0 0 0-1 1v6.75a1 1 0 0 0 1 1h8.5a1 1 0 0 0 1-1V9.5a1 1 0 0 0-1-1H13" />
  </svg>
);

export const PlusIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" width="16" height="16" {...base} {...p}>
    <path d="M10 4.5v11M4.5 10h11" />
  </svg>
);

export const ArrowUpIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" width="14" height="14" {...base} strokeWidth={2} {...p}>
    <path d="M10 15.5v-11M5.5 9 10 4.5 14.5 9" />
  </svg>
);

export const ChevronsIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 12 12" width="10" height="10" {...base} strokeWidth={1.4} {...p}>
    <path d="M3.5 4.5 6 2l2.5 2.5M3.5 7.5 6 10l2.5-2.5" />
  </svg>
);

export const CheckIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 12 12" width="11" height="11" {...base} strokeWidth={1.6} {...p}>
    <path d="m2.5 6.3 2.2 2.2 4.8-5" />
  </svg>
);

export const KeyIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" width="13" height="13" {...base} {...p}>
    <circle cx="7" cy="12.5" r="3.25" />
    <path d="m9.4 10.2 6.1-6.1M13.2 6.4l1.8 1.8M11.6 8l1.4 1.4" />
  </svg>
);

export const PlayIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" width="14" height="14" {...p}>
    <path d="M5 3.4v9.2a.6.6 0 0 0 .9.5l7.3-4.6a.6.6 0 0 0 0-1L5.9 2.9a.6.6 0 0 0-.9.5Z" fill="currentColor" />
  </svg>
);

export const PauseIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" width="14" height="14" {...p}>
    <rect x="4" y="3" width="2.6" height="10" rx="0.8" fill="currentColor" />
    <rect x="9.4" y="3" width="2.6" height="10" rx="0.8" fill="currentColor" />
  </svg>
);

export const Pointer = () => (
  <svg viewBox="0 0 22 28" width="22" height="28" aria-hidden="true">
    <path
      d="M3 2.6v19.6c0 .5.6.8 1 .4l4.6-4.4 3.3 7.5c.2.4.6.6 1 .4l2.5-1.1c.4-.2.6-.6.4-1l-3.3-7.4h6.3c.5 0 .8-.6.4-1L4 2.2c-.4-.4-1-.1-1 .4Z"
      fill="#111"
      stroke="#fff"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);
