/**
 * Dados editáveis do site num só lugar.
 *
 * ⚠️ Preços, prazos de teste e políticas de licença abaixo são PROVISÓRIOS —
 * foram definidos para o layout e devem ser revisados antes do lançamento.
 */

export const site = {
  name: 'MarkDocs',
  shortName: 'MDocs',
  tagline: 'A máquina tipográfica para documentos escritos com IA.',
  description:
    'MarkDocs é um app para macOS e iOS que transforma o markdown escrito pela IA em PDFs A4 com margens, tipografia e papel timbrado configuráveis. Licença perpétua. Traga sua própria chave de IA.',
  /** Link de download do instalador (.dmg) — substituir pelo real. */
  downloadUrl: '#preco',
  /** Link da App Store — substituir quando houver. */
  appStoreUrl: '#preco',
  supportEmail: 'contato@markdocs.app',
  trialDays: 14,
  year: new Date().getFullYear(),
} as const;

export interface PriceTier {
  id: string;
  name: string;
  price: string;
  cadence: string;
  note: string;
  features: string[];
  cta: { label: string; href: string };
  featured?: boolean;
}

export const pricing: PriceTier[] = [
  {
    id: 'individual',
    name: 'Licença individual',
    price: 'R$ 349',
    cadence: 'pagamento único',
    note: 'Para uma pessoa, em todos os seus dispositivos.',
    features: [
      'Mac, iPad e iPhone',
      '12 meses de atualizações incluídos',
      'A versão que você tem é sua para sempre',
      'Sua chave de IA — sem assinatura embutida',
      'Suporte por e-mail',
    ],
    cta: { label: 'Comprar licença', href: '#comprar' },
    featured: true,
  },
  {
    id: 'escritorio',
    name: 'Escritórios e equipes',
    price: 'R$ 299',
    cadence: 'por licença, a partir de 5',
    note: 'Para quem produz documentos em volume.',
    features: [
      'Tudo da licença individual',
      'Uma fatura para toda a equipe',
      'Licenças transferíveis entre pessoas',
      'Atendimento prioritário',
    ],
    cta: { label: 'Falar com a gente', href: 'mailto:contato@markdocs.app' },
  },
];

export const renewal = {
  price: 'R$ 129',
  text: 'Depois de 12 meses, renove as atualizações quando quiser — ou simplesmente continue usando a sua versão.',
};
