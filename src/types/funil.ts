// ─── Funil Types ──────────────────────────────────────────────────────────────

export type EtapaFunil = {
  id: string
  title: string
  color: string // Tailwind classes for badge color
}

export type FunilDef = {
  id: string
  nome: string
  descricao: string
  cor: string // badge color class
  etapas: EtapaFunil[]
}

// ─── Default stages and funnels ───────────────────────────────────────────────

export const DEFAULT_ETAPAS: EtapaFunil[] = [
  { id: 'new', title: 'Novo Lead', color: 'bg-primary/10 text-primary border-primary/20' },
  { id: 'contact', title: 'Contato Realizado', color: 'bg-accent/10 text-accent border-accent/20' },
  { id: 'visit', title: 'Visita Agendada', color: 'bg-warning/10 text-warning border-warning/20' },
  { id: 'proposal', title: 'Proposta Enviada', color: 'bg-purple-500/10 text-purple-600 border-purple-200 dark:text-purple-400 dark:border-purple-900' },
  { id: 'negotiation', title: 'Negociação', color: 'bg-orange-500/10 text-orange-600 border-orange-200 dark:text-orange-400 dark:border-orange-900' },
  { id: 'closed', title: 'Fechado', color: 'bg-success/10 text-success border-success/20' },
  { id: 'lost', title: 'Perdido', color: 'bg-destructive/10 text-destructive border-destructive/20' },
]

export const DEFAULT_FUNIS: FunilDef[] = [
  {
    id: 'principal',
    nome: 'Principal',
    descricao: 'Funil padrão de vendas',
    cor: 'bg-primary text-primary-foreground',
    etapas: DEFAULT_ETAPAS,
  },
  {
    id: 'locacoes',
    nome: 'Locações',
    descricao: 'Contratos de locação',
    cor: 'bg-teal-600 text-white',
    etapas: [
      { id: 'new', title: 'Novo Lead', color: 'bg-primary/10 text-primary border-primary/20' },
      { id: 'visit', title: 'Visita Agendada', color: 'bg-warning/10 text-warning border-warning/20' },
      { id: 'doc', title: 'Documentação', color: 'bg-purple-500/10 text-purple-600 border-purple-200' },
      { id: 'analysis', title: 'Análise de Crédito', color: 'bg-orange-500/10 text-orange-600 border-orange-200' },
      { id: 'closed', title: 'Contrato Assinado', color: 'bg-success/10 text-success border-success/20' },
      { id: 'lost', title: 'Perdido', color: 'bg-destructive/10 text-destructive border-destructive/20' },
    ],
  },
  {
    id: 'alto-padrao',
    nome: 'Alto Padrão',
    descricao: 'Imóveis acima de R$ 1,5M',
    cor: 'bg-amber-600 text-white',
    etapas: [
      { id: 'new', title: 'Novo Lead', color: 'bg-primary/10 text-primary border-primary/20' },
      { id: 'qualify', title: 'Qualificação', color: 'bg-indigo-500/10 text-indigo-600 border-indigo-200' },
      { id: 'visit', title: 'Visita Privada', color: 'bg-warning/10 text-warning border-warning/20' },
      { id: 'proposal', title: 'Proposta', color: 'bg-purple-500/10 text-purple-600 border-purple-200' },
      { id: 'closed', title: 'Fechado', color: 'bg-success/10 text-success border-success/20' },
    ],
  },
]
