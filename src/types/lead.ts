export interface ContactInfo {
  type: 'email' | 'phone' | 'mobile';
  value: string;
  isPrimary?: boolean;
}

export interface Lead {
  id: string;
  name: string;
  emails: ContactInfo[];
  phones: ContactInfo[];
  property: string;
  location: string;
  searchType: 'compra' | 'venda' | 'investimento';
  value: string;
  source: string;
  assignedTo: string;
  notes?: string;
  stage?: string;
  lastContact?: string;
  nextAction?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DeleteReason {
  id: string;
  label: string;
  description?: string;
}

export interface DeletedLead {
  id: string;
  originalLead: Lead;
  deletedAt: string;
  deletedBy: string;
  deleteReason: DeleteReason;
  customReason?: string;
  restoredAt?: string;
  restoredBy?: string;
}

export interface LeadActivity {
  id: string;
  leadId: string;
  type: 'created' | 'updated' | 'deleted' | 'restored' | 'contacted' | 'visit_scheduled' | 'proposal_sent';
  timestamp: string;
  userId: string;
  description: string;
  metadata?: Record<string, unknown>;
}

export const DELETE_REASONS: DeleteReason[] = [
  { id: 'duplicate', label: 'Lead Duplicado', description: 'Lead já existente no sistema' },
  { id: 'not_interested', label: 'Sem Interesse', description: 'Lead perdeu o interesse' },
  { id: 'invalid_contact', label: 'Contato Inválido', description: 'Informações de contato incorretas' },
  { id: 'budget_mismatch', label: 'Incompatibilidade de Orçamento', description: 'Orçamento incompatível com imóveis' },
  { id: 'moved_to_other', label: 'Mudou para Outra Imobiliária', description: 'Lead fechou com concorrente' },
  { id: 'test_lead', label: 'Lead de Teste', description: 'Lead utilizado para testes' },
  { id: 'other', label: 'Outro Motivo', description: 'Motivo personalizado' }
];

export interface HistoricoAtendimento {
  id: string;
  data: string;
  tipo: 'ligacao' | 'email' | 'visita' | 'proposta' | 'reuniao' | 'whatsapp' | 'followup';
  descricao: string;
  usuario: string;
  duracao?: string;
  resultado?: string;
  proximoPasso?: string;
  anexos?: string[];
  notaAtividade?: string;
  avaliacao?: 'boa' | 'ruim' | null;
  editavel?: boolean;
  tags?: string[];
  noShow?: boolean;
  nextActivity?: string;
}

export interface ImovelInteresse {
  id: string;
  titulo: string;
  tipo: string;
  endereco: string;
  valor: string;
  area: string;
  quartos: number;
  banheiros: number;
  vagas: number;
  descricao: string;
  imagens: string[];
}

export interface Documento {
  id: string;
  nome: string;
  tamanho: string;
  data: string;
  tipo: string;
}
