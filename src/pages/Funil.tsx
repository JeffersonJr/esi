import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar,
  Mail,
  Phone,
  MessageSquare,
  MessageCircle,
  User,
  MapPin,
  Home,
  DollarSign,
  Building,
  Clock,
  MoreHorizontal,
  MoreVertical,
  Plus,
  Search,
  Filter,
  X,
  Edit,
  Trash2,
  ChevronDown,
  Eye
} from 'lucide-react';
import { LeadDetailsModal } from '@/components/modals/LeadDetailsModal';
import { LeadFormModal } from '@/components/modals/LeadFormModal';
import { DeleteReasonModal } from '@/components/modals/DeleteReasonModal';
import { LeadTransferModal } from '@/components/modals/LeadTransferModal';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useMediaQuery } from '@/hooks';
import { ScheduleVisitModal } from '@/components/modals/ScheduleVisitModal';
// import { FilterModal } from '@/components/modals/FilterModal'; // Commented out - file doesn't exist
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

import { Lead, DeleteReason, DeletedLead } from '@/types/lead';

const stages = [
  { id: 'new', title: 'Novo Lead', color: 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100' },
  { id: 'contact', title: 'Contato Realizado', color: 'bg-accent/10 text-accent dark:bg-accent/20' },
  { id: 'visit', title: 'Visita Agendada', color: 'bg-warning/10 text-warning dark:bg-warning/20' },
  { id: 'proposal', title: 'Proposta Enviada', color: 'bg-primary/10 text-primary dark:bg-primary/20' },
  { id: 'negotiation', title: 'Negociação', color: 'bg-accent/20 text-accent dark:bg-accent/30' },
  { id: 'closed', title: 'Fechado', color: 'bg-success/10 text-success dark:bg-success/20' },
  { id: 'lost', title: 'Perdido', color: 'bg-destructive/10 text-destructive dark:bg-destructive/20' },
];

const AGENTS = [
  { id: 'JS', name: 'João Silva', avatar: 'JS', color: 'bg-blue-500' },
  { id: 'MR', name: 'Maria Rocha', avatar: 'MR', color: 'bg-pink-500' },
  { id: 'PC', name: 'Pedro Costa', avatar: 'PC', color: 'bg-green-500' },
];

const createLeadWithDates = (lead: Omit<Lead, 'createdAt' | 'updatedAt'>): Lead => ({
  ...lead,
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-20T15:30:00Z'
});

const initialLeads: Record<string, Lead[]> = {
  new: [
    createLeadWithDates({ 
      id: '1', 
      name: 'Maria Santos', 
      emails: [{ type: 'email', value: 'maria@email.com', isPrimary: true }], 
      phones: [{ type: 'phone', value: '11 99999-0001', isPrimary: true }], 
      property: 'Apt 2 quartos', 
      location: 'Vila Mariana',
      searchType: 'compra',
      value: 'R$ 350.000', 
      source: 'Site', 
      assignedTo: 'JS',
      tags: ['Hot Lead', 'Primeira Compra']
    }),
    createLeadWithDates({ 
      id: '2', 
      name: 'Carlos Oliveira', 
      emails: [{ type: 'email', value: 'carlos@email.com', isPrimary: true }], 
      phones: [{ type: 'mobile', value: '11 99999-0002', isPrimary: true }], 
      property: 'Casa 3 quartos', 
      location: 'Moema',
      searchType: 'investimento',
      value: 'R$ 580.000', 
      source: 'Facebook', 
      assignedTo: 'MR',
      tags: ['Investidor']
    }),
  ],
  contact: [
    createLeadWithDates({ 
      id: '3', 
      name: 'João Silva', 
      emails: [{ type: 'email', value: 'joao@email.com', isPrimary: true }], 
      phones: [{ type: 'phone', value: '11 99999-0003', isPrimary: true }], 
      property: 'Cobertura', 
      location: 'Alto de Pinheiros',
      searchType: 'venda',
      value: 'R$ 1.200.000', 
      source: 'Indicação', 
      assignedTo: 'JS',
      tags: ['VIP']
    }),
  ],
  visit: [
    createLeadWithDates({ 
      id: '4', 
      name: 'Ana Costa', 
      emails: [{ type: 'email', value: 'ana@email.com', isPrimary: true }], 
      phones: [{ type: 'mobile', value: '11 99999-0004', isPrimary: true }], 
      property: 'Apt 3 quartos', 
      location: 'Brooklin',
      searchType: 'compra',
      value: 'R$ 450.000', 
      source: 'Instagram', 
      assignedTo: 'MR',
      tags: ['Aluguel']
    }),
    createLeadWithDates({ 
      id: '5', 
      name: 'Pedro Souza', 
      emails: [{ type: 'email', value: 'pedro@email.com', isPrimary: true }], 
      phones: [{ type: 'phone', value: '11 99999-0005', isPrimary: true }], 
      property: 'Casa condomínio', 
      location: 'Santo Amaro',
      searchType: 'compra',
      value: 'R$ 720.000', 
      source: 'Site', 
      assignedTo: 'JS',
      tags: ['Financiamento']
    }),
  ],
  proposal: [
    createLeadWithDates({ 
      id: '6', 
      name: 'Fernanda Lima', 
      emails: [{ type: 'email', value: 'fernanda@email.com', isPrimary: true }], 
      phones: [{ type: 'mobile', value: '11 99999-0006', isPrimary: true }], 
      property: 'Apt 4 quartos', 
      location: 'Pinheiros',
      searchType: 'compra',
      value: 'R$ 650.000', 
      source: 'Portal', 
      assignedTo: 'MR',
      tags: ['Interesse Alto']
    }),
  ],
  negotiation: [
    createLeadWithDates({ 
      id: '7', 
      name: 'Roberto Alves', 
      emails: [{ type: 'email', value: 'roberto@email.com', isPrimary: true }], 
      phones: [{ type: 'phone', value: '11 99999-0007', isPrimary: true }], 
      property: 'Casa térrea', 
      location: 'Jabaquara',
      searchType: 'venda',
      value: 'R$ 480.000', 
      source: 'Site', 
      assignedTo: 'JS',
      tags: ['Follow-up Necessário']
    }),
  ],
  closed: [
    createLeadWithDates({ 
      id: '8', 
      name: 'Juliana Rocha', 
      emails: [{ type: 'email', value: 'juliana@email.com', isPrimary: true }], 
      phones: [{ type: 'mobile', value: '11 99999-0008', isPrimary: true }], 
      property: 'Cobertura duplex', 
      location: 'Morumbi',
      searchType: 'investimento',
      value: 'R$ 950.000', 
      source: 'Indicação', 
      assignedTo: 'MR',
      tags: ['VIP', 'Hot Lead']
    }),
  ],
  lost: [
    createLeadWithDates({ 
      id: '9', 
      name: 'Lucas Mendes', 
      emails: [{ type: 'email', value: 'lucas@email.com', isPrimary: true }], 
      phones: [{ type: 'phone', value: '11 99999-0009', isPrimary: true }], 
      property: 'Kitnet', 
      location: 'São Caetano',
      searchType: 'compra',
      value: 'R$ 180.000', 
      source: 'Telefone', 
      assignedTo: 'JS',
      tags: []
    }),
  ],
};

export function Funil() {
  const [leads, setLeads] = useState<Record<string, Lead[]>>(initialLeads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [deleteReasonModalOpen, setDeleteReasonModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [deletedLeads, setDeletedLeads] = useState<DeletedLead[]>([]);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [leadToTransfer, setLeadToTransfer] = useState<{
    lead: Lead;
    sourceStage: string;
    destStage: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    nomeLead: '',
    corretor: '',
    valorMin: '',
    valorMax: '',
    regiao: '',
    imovel: ''
  });
  const isMobile = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();

  const handleOpenDetails = useCallback((lead: Lead) => {
    navigate(`/leads/${lead.id}`);
  }, [navigate]);

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setFormOpen(true);
  };

  const handleDeleteLead = (lead: Lead) => {
    setLeadToDelete(lead);
    setDeleteReasonModalOpen(true);
  };

  const handleConfirmDelete = async (reason: DeleteReason, customReason?: string) => {
    if (!leadToDelete) return;

    try {
      // Criar registro do lead excluído
      const deletedLead: DeletedLead = {
        id: `del_${Date.now()}`,
        originalLead: leadToDelete,
        deletedAt: new Date().toISOString(),
        deletedBy: 'currentUser', // Em produção: ID do usuário atual
        deleteReason: reason,
        customReason
      };

      // Adicionar à lista de excluídos
      setDeletedLeads(prev => [...prev, deletedLead]);

      // Remover do funil
      setLeads(prevLeads => {
        const newLeads = { ...prevLeads };
        for (const stage in newLeads) {
          newLeads[stage] = newLeads[stage].filter(lead => lead.id !== leadToDelete.id);
        }
        return newLeads;
      });

      toast({
        title: "Lead movido para a lixeira",
        description: `${leadToDelete.name} foi excluído e ficará na lixeira por 30 dias.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao excluir lead",
        description: "Não foi possível excluir o lead. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleSaveLead = (leadData: Lead) => {
    if (editingLead) {
      // Update existing lead
      setLeads(prevLeads => {
        const newLeads = { ...prevLeads };
        
        // Remove from current stage
        for (const stage in newLeads) {
          newLeads[stage] = newLeads[stage].filter(l => l.id !== editingLead.id);
        }
        
        // Add to new stage (or same stage if not changed)
        const stage = leadData.stage || 'new';
        const updatedLead = { ...editingLead, ...leadData };
        
        if (!newLeads[stage]) {
          newLeads[stage] = [];
        }
        
        newLeads[stage].push(updatedLead);
        
        toast({
          title: "Lead atualizado com sucesso!",
          description: `As alterações em ${leadData.name} foram salvas.`,
          variant: "success",
        });
        
        return newLeads;
      });
    } else {
      // Add new lead
      const newLead = {
        ...leadData,
        id: Date.now().toString(),
        stage: leadData.stage || 'new',
      };
      
      setLeads(prevLeads => {
        const stage = newLead.stage || 'new';
        return {
          ...prevLeads,
          [stage]: [...(prevLeads[stage] || []), newLead],
        };
      });
      
      toast({
        title: "Lead adicionado com sucesso!",
        description: `${leadData.name} foi adicionado ao funil.`,
        variant: "success",
      });
    }
    
    setFormOpen(false);
    setEditingLead(null);
  };

  const handleScheduleVisit = (lead: Lead) => {
    setSelectedLead(lead);
    setScheduleOpen(true);
  };

  const handleCreateActivity = (lead: Lead) => {
    setSelectedLead(lead);
    setScheduleOpen(true);
  };

  interface VisitData {
  activity: string;
  date: string;
  time: string;
}

const handleConfirmVisit = (visitData: VisitData) => {
    // Update lead with visit information
    if (selectedLead) {
      const updatedLead = {
        ...selectedLead,
        nextAction: `${visitData.activity} agendada para ${visitData.date} às ${visitData.time}`,
        lastContact: new Date().toISOString(),
      };
      
      // Update the lead in the appropriate stage
      setLeads(prev => ({
        ...prev,
        [selectedLead.stage || 'new']: prev[selectedLead.stage || 'new'].map(lead => 
          lead.id === selectedLead.id ? updatedLead : lead
        )
      }));
      
      // Show success message
      alert(`${visitData.activity} agendada com sucesso para ${selectedLead.name}!`);
    }
    
    setScheduleOpen(false);
  };

  const handleSendEmail = (lead: Lead) => {
    // In a real app, this would open the default email client
    const primaryEmail = lead.emails?.find(email => email.isPrimary)?.value || lead.emails?.[0]?.value;
    if (primaryEmail) {
      window.location.href = `mailto:${primaryEmail}?subject=Contato sobre o imóvel ${lead.property}`;
    }
  };

  const handleWhatsApp = (lead: Lead) => {
    // Get primary phone or first phone
    const primaryPhone = lead.phones?.find(phone => phone.isPrimary)?.value || lead.phones?.[0]?.value;
    if (primaryPhone) {
      // Remove non-digits from phone number
      const cleanPhone = primaryPhone.replace(/\D/g, '');
      // Open WhatsApp with phone number
      window.open(`https://wa.me/55${cleanPhone}`, '_blank');
    }
  };

  const handleClearFilters = () => {
    setFilters({
      nomeLead: '',
      corretor: '',
      valorMin: '',
      valorMax: '',
      regiao: '',
      imovel: ''
    });
    setSearchTerm('');
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '') || searchTerm !== '';

  const getFilteredLeads = () => {
    const filteredLeads = Object.entries(leads).reduce((acc, [stage, stageLeads]) => {
      const filteredStageLeads = stageLeads.filter(lead => {
        // Filtro de busca
        const primaryEmail = lead.emails?.find(email => email.isPrimary)?.value || lead.emails?.[0]?.value || '';
        const primaryPhone = lead.phones?.find(phone => phone.isPrimary)?.value || lead.phones?.[0]?.value || '';
        
        const matchesSearch = searchTerm === '' || 
          lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          primaryEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.property.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Filtros específicos
        const matchesNome = filters.nomeLead === '' || lead.name.toLowerCase().includes(filters.nomeLead.toLowerCase());
        const matchesCorretor = filters.corretor === '' || lead.assignedTo === filters.corretor;
        const matchesRegiao = filters.regiao === '' || lead.property.toLowerCase().includes(filters.regiao.toLowerCase());
        const matchesImovel = filters.imovel === '' || lead.property.toLowerCase().includes(filters.imovel.toLowerCase());
        
        // Filtro de valor
        let matchesValor = true;
        if (filters.valorMin || filters.valorMax) {
          const valorNumerico = parseInt(lead.value.replace(/[^0-9]/g, ''));
          if (filters.valorMin) {
            matchesValor = valorNumerico >= parseInt(filters.valorMin.replace(/[^0-9]/g, ''));
          }
          if (filters.valorMax) {
            matchesValor = matchesValor && valorNumerico <= parseInt(filters.valorMax.replace(/[^0-9]/g, ''));
          }
        }
        
        return matchesSearch && matchesNome && matchesCorretor && matchesRegiao && matchesImovel && matchesValor;
      });
      
      if (filteredStageLeads.length > 0) {
        acc[stage] = filteredStageLeads;
      }
      return acc;
    }, {} as Record<string, Lead[]>);
    
    return filteredLeads;
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // Se não houver destino válido, cancela
    if (!destination) return;

    // Se soltou no mesmo lugar, cancela
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceStage = source.droppableId;
    const destStage = destination.droppableId;

    // Obtém os dados filtrados atuais
    const filteredLeadsData = getFilteredLeads();
    
    // Se não houver leads no estágio de origem nos dados filtrados, cancela
    if (!filteredLeadsData[sourceStage] || filteredLeadsData[sourceStage].length === 0) {
      return;
    }

    // Cria cópias dos arrays
    const newLeads = { ...leads };
    const sourceLeads = [...newLeads[sourceStage]];
    const destLeads = [...newLeads[destStage]];

    // Remove do estágio de origem
    const [removed] = sourceLeads.splice(source.index, 1);
    
    // Verifica se está mudando de corretor (diferente assignedTo)
    const isChangingAgent = destLeads.length > 0 && destLeads[0].assignedTo !== removed.assignedTo;
    
    if (isChangingAgent) {
      // Abre modal de transferência
      setLeadToTransfer({
        lead: removed,
        sourceStage,
        destStage
      });
      setTransferModalOpen(true);
    } else {
      // Move normalmente (mesmo corretor)
      destLeads.splice(destination.index, 0, removed);
      
      // Atualiza o estado
      newLeads[sourceStage] = sourceLeads;
      newLeads[destStage] = destLeads;
      
      setLeads(newLeads);

      // Mostra toast de sucesso simples
      const sourceStageName = stages.find(s => s.id === sourceStage)?.title;
      const destStageName = stages.find(s => s.id === destStage)?.title;
      
      toast({
        title: "Lead movido com sucesso!",
        description: `${removed.name} foi movido(a) de "${sourceStageName}" para "${destStageName}".`,
        variant: "success",
      });
    }
  };

  // Handle transfer confirmation
  const handleTransferConfirm = (newAgentId: string) => {
    if (!leadToTransfer) return;

    const { lead, sourceStage, destStage } = leadToTransfer;
    
    // Atualiza o lead com o novo corretor
    const updatedLead = { ...lead, assignedTo: newAgentId };
    
    // Cria cópias dos arrays
    const newLeads = { ...leads };
    const sourceLeads = [...newLeads[sourceStage]];
    const destLeads = [...newLeads[destStage]];

    // Remove do estágio de origem
    const leadIndex = sourceLeads.findIndex(l => l.id === lead.id);
    if (leadIndex !== -1) {
      sourceLeads.splice(leadIndex, 1);
    }
    
    // Adiciona ao estágio de destino com o novo corretor
    destLeads.splice(0, 0, updatedLead);

    // Atualiza o estado
    newLeads[sourceStage] = sourceLeads;
    newLeads[destStage] = destLeads;

    setLeads(newLeads);

    // Mostra toast detalhado com animação
    const sourceStageName = stages.find(s => s.id === sourceStage)?.title;
    const destStageName = stages.find(s => s.id === destStage)?.title;
    const oldAgent = AGENTS.find(agent => agent.id === lead.assignedTo);
    const newAgent = AGENTS.find(agent => agent.id === newAgentId);
    
    // Cria elemento de animação visual
    const createTransferAnimation = () => {
      const animation = document.createElement('div');
      animation.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2';
      animation.innerHTML = `
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span class="text-sm font-medium">Transferindo lead...</span>
        </div>
      `;
      document.body.appendChild(animation);
      
      // Remove após 2 segundos
      setTimeout(() => {
        animation.style.transition = 'opacity 0.3s ease-out';
        animation.style.opacity = '0';
        setTimeout(() => document.body.removeChild(animation), 300);
      }, 2000);
    };
    
    // Dispara animação
    createTransferAnimation();
    
    // Mostra toast detalhado após um pequeno delay
    setTimeout(() => {
      toast({
        title: "🎯 Lead transferido com sucesso!",
        description: (
          <div className="space-y-1">
            <p><strong>{lead.name}</strong> foi transferido(a) com sucesso!</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>De:</span>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">{oldAgent?.name}</span>
              <span className="text-green-500">→</span>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded">{newAgent?.name}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Estágio:</span>
              <span>{sourceStageName}</span>
              <span>→</span>
              <span className="font-medium">{destStageName}</span>
            </div>
          </div>
        ),
        variant: "success",
        duration: 5000,
      });
    }, 500);
  };

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Funil de Vendas</h1>
          <p className="text-muted-foreground text-sm md:text-base">Gerencie seus leads e oportunidades</p>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            variant="outline"
            className="gap-2"
            onClick={() => setFilterModalOpen(true)}
          >
            <Filter className="h-4 w-4" />
            Filtros
            {hasActiveFilters && (
              <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                {Object.values(filters).filter(value => value !== '').length + (searchTerm !== '' ? 1 : 0)}
              </span>
            )}
          </Button>
          <Button 
            className="gap-2"
            onClick={() => {
              setEditingLead(null);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Novo Lead
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 overflow-x-auto pb-6">
          <div className="flex gap-4 h-full overflow-x-auto pb-4">
            {stages.map((stage) => (
              <div key={stage.id} className="flex-shrink-0 w-72 md:w-80 flex flex-col">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-semibold text-sm px-3 py-1 rounded-full ${stage.color}`}>
                      {stage.title}
                    </h3>
                    <Badge variant="secondary" className="rounded-full text-xs px-2 py-0.5 h-5 flex items-center justify-center">
                      {getFilteredLeads()[stage.id]?.length || 0}
                    </Badge>
                  </div>
                </div>
                <Droppable droppableId={stage.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-3 flex-1 overflow-y-auto rounded-lg p-2 transition-colors ${
                        snapshot.isDraggingOver ? 'bg-primary/5 border-2 border-dashed border-primary' : ''
                      }`}
                    >
                      {getFilteredLeads()[stage.id]?.map((lead, index) => (
                        <Draggable key={lead.id} draggableId={lead.id} index={index}>
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`hover:shadow-lg transition-all cursor-grab active:cursor-grabbing group relative ${
                                snapshot.isDragging ? 'shadow-2xl rotate-2 scale-105' : ''
                              }`}
                              onClick={() => handleOpenDetails(lead)}
                            >
                              <CardHeader className="pb-3">
                                <div className="flex items-start justify-between relative">
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <Avatar className="h-8 w-8 flex-shrink-0">
                                      <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
                                        {lead.name.split(' ').map(n => n[0]).join('')}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                      <CardTitle className="text-sm truncate">{lead.name}</CardTitle>
                                      <Badge variant="outline" className="mt-1 text-xs">
                                        {lead.source}
                                      </Badge>
                                      {/* Tags */}
                                      {lead.tags && lead.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {lead.tags.slice(0, 2).map((tag) => {
                                            // Define colors for common tags
                                            const getTagColor = (tagName: string) => {
                                              const tagColors: Record<string, string> = {
                                                'Hot Lead': 'bg-red-500',
                                                'VIP': 'bg-purple-500',
                                                'Primeira Compra': 'bg-blue-500',
                                                'Investidor': 'bg-green-500',
                                                'Financiamento': 'bg-orange-500',
                                                'Aluguel': 'bg-yellow-500',
                                                'Interesse Alto': 'bg-red-500',
                                                'Follow-up Necessário': 'bg-orange-500',
                                                'Urgente': 'bg-red-500',
                                              };
                                              return tagColors[tagName] || 'bg-gray-500';
                                            };
                                            
                                            return (
                                              <Badge key={tag} className={`${getTagColor(tag)} text-white text-xs`}>
                                                {tag}
                                              </Badge>
                                            );
                                          })}
                                          {lead.tags.length > 2 && (
                                            <Badge variant="secondary" className="text-xs">
                                              +{lead.tags.length - 2}
                                            </Badge>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  {/* Hover Actions - Posicionados absolutamente sobre o conteúdo */}
                                  <div className="absolute top-0 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm rounded-md p-1 shadow-lg z-10">
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-7 w-7"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenDetails(lead);
                                      }}
                                      title="Ver detalhes"
                                    >
                                      <Eye className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-7 w-7"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditLead(lead);
                                      }}
                                      title="Editar"
                                    >
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-7 w-7"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleScheduleVisit(lead);
                                      }}
                                      title="Agendar atividade"
                                    >
                                      <Calendar className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-7 w-7 text-destructive hover:text-destructive"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteLead(lead);
                                      }}
                                      title="Excluir"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                <div className="text-sm">
                                  <div className="font-medium text-foreground">{lead.property}</div>
                                  <div className="text-primary font-semibold mt-1">{lead.value}</div>
                                </div>
                                <div className="flex gap-2 pt-2 justify-between items-center">
                                  <div className="flex gap-2">
                                    <Button 
                                      variant="outline" 
                                      size={isMobile ? 'sm' : 'icon'} 
                                      className={`${isMobile ? 'gap-2' : 'h-8 w-8'}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSendEmail(lead);
                                      }}
                                    >
                                      <Mail className="h-4 w-4" />
                                      {isMobile && <span>E-mail</span>}
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size={isMobile ? 'sm' : 'icon'} 
                                      className={`${isMobile ? 'gap-2' : 'h-8 w-8'}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleWhatsApp(lead);
                                      }}
                                    >
                                      <MessageCircle className="h-4 w-4" />
                                      {isMobile && <span>WhatsApp</span>}
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size={isMobile ? 'sm' : 'icon'} 
                                      className={`${isMobile ? 'gap-2' : 'h-8 w-8'}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCreateActivity(lead);
                                      }}
                                    >
                                      <Calendar className="h-4 w-4" />
                                      {isMobile && <span>Atividade</span>}
                                    </Button>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 pt-2 border-t border-border">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback className="bg-muted text-xs">{lead.assignedTo}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs text-muted-foreground">Responsável</span>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </div>
      </DragDropContext>

      <LeadDetailsModal
        lead={selectedLead}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        onEdit={() => {
          setDetailsOpen(false);
          handleEditLead(selectedLead!);
        }}
        onDelete={() => {
          if (selectedLead && confirm('Tem certeza que deseja excluir este lead?')) {
            handleDeleteLead(selectedLead);
            setDetailsOpen(false);
          }
        }}
        onScheduleVisit={() => {
          setDetailsOpen(false);
          handleScheduleVisit(selectedLead!);
        }}
      />
      
      <LeadFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingLead(null);
        }}
        onSubmit={handleSaveLead}
        lead={editingLead}
      />
      
      <ScheduleVisitModal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        onConfirm={handleConfirmVisit}
        lead={selectedLead}
      />

      {/* Modal de Filtros */}
      <Dialog open={filterModalOpen} onOpenChange={setFilterModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros do Funil de Vendas
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="nomeLead">Nome do Lead</Label>
              <Input
                id="nomeLead"
                placeholder="Buscar por nome..."
                value={filters.nomeLead}
                onChange={(e) => setFilters({...filters, nomeLead: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="corretor">Corretor Responsável</Label>
              <Select value={filters.corretor} onValueChange={(value) => setFilters({...filters, corretor: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="JS">JS</SelectItem>
                  <SelectItem value="MR">MR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="valorMin">Valor Mínimo</Label>
                <Input
                  id="valorMin"
                  placeholder="R$ 0"
                  value={filters.valorMin}
                  onChange={(e) => setFilters({...filters, valorMin: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="valorMax">Valor Máximo</Label>
                <Input
                  id="valorMax"
                  placeholder="R$ 0"
                  value={filters.valorMax}
                  onChange={(e) => setFilters({...filters, valorMax: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="regiao">Região de Interesse</Label>
              <Input
                id="regiao"
                placeholder="Ex: Centro, Zona Sul..."
                value={filters.regiao}
                onChange={(e) => setFilters({...filters, regiao: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="imovel">Tipo de Imóvel</Label>
              <Input
                id="imovel"
                placeholder="Ex: Apartamento, Casa..."
                value={filters.imovel}
                onChange={(e) => setFilters({...filters, imovel: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleClearFilters} className="gap-2">
              <X className="h-4 w-4" />
              Limpar Filtros
            </Button>
            <Button onClick={() => setFilterModalOpen(false)}>
              Aplicar Filtros
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteReasonModal
        open={deleteReasonModalOpen}
        onClose={() => {
          setDeleteReasonModalOpen(false);
          setLeadToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        leadName={leadToDelete?.name || ''}
      />

      <LeadTransferModal
        open={transferModalOpen}
        onClose={() => {
          setTransferModalOpen(false);
          setLeadToTransfer(null);
        }}
        onConfirm={handleTransferConfirm}
        leadName={leadToTransfer?.lead.name || ''}
        currentAgent={leadToTransfer?.lead.assignedTo || ''}
        sourceStage={stages.find(s => s.id === leadToTransfer?.sourceStage)?.title || ''}
        destStage={stages.find(s => s.id === leadToTransfer?.destStage)?.title || ''}
      />
    </div>
  );
}
