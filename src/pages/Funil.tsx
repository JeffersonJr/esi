import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Eye,
  TrendingUp,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { TagManager } from '@/components/shared/TagManager';
import { useAnimation } from '@/components/shared/ActionAnimation';
import { DEFAULT_TAGS } from '@/components/shared/tagConstants';

import { Lead, DeleteReason, DeletedLead } from '@/types/lead';

const stages = [
  { id: 'new', title: 'Novo Lead', color: 'bg-primary-500/10 text-primary-600 dark:bg-primary-500/20 dark:text-primary-400' },
  { id: 'contact', title: 'Contato Realizado', color: 'bg-accent/10 text-accent dark:bg-accent/20 dark:text-accent' },
  { id: 'visit', title: 'Visita Agendada', color: 'bg-warning/10 text-warning dark:bg-warning/20 dark:text-warning' },
  { id: 'proposal', title: 'Proposta Enviada', color: 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary' },
  { id: 'negotiation', title: 'Negociação', color: 'bg-accent/20 text-accent dark:bg-accent/30 dark:text-accent' },
  { id: 'closed', title: 'Fechado', color: 'bg-success/10 text-success dark:bg-success/20 dark:text-success' },
  { id: 'lost', title: 'Perdido', color: 'bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive' },
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
  const { triggerAnimation } = useAnimation();
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
  const [filters, setFilters] = useState<{
    nomeLead: string;
    corretor: string;
    valorMin: string;
    valorMax: string;
    regiao: string;
    imovel: string;
    origem: string;
    tags: string[];
    stage: string;
    dataMin: string;
    dataMax: string;
    contatoRealizado: boolean;
    searchType: string;
  }>({
    nomeLead: '',
    corretor: 'all',
    valorMin: '',
    valorMax: '',
    regiao: '',
    imovel: '',
    origem: 'all',
    tags: [],
    stage: 'all',
    dataMin: '',
    dataMax: '',
    contatoRealizado: false,
    searchType: 'all',
  });
  const isMobile = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const action = params.get('action');
    if (action === 'novo-lead' || action === 'nova-proposta') {
      const initialStage = action === 'nova-proposta' ? 'proposal' : 'new';
      setEditingLead({
        id: '',
        name: '',
        emails: [{ type: 'email', value: '', isPrimary: true }],
        phones: [{ type: 'phone', value: '', isPrimary: true }],
        property: '',
        location: '',
        searchType: 'compra',
        value: '',
        source: '',
        assignedTo: 'JS',
        stage: initialStage,
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      setFormOpen(true);
      // Clean up the URL
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

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

    // Trigger delete animation
    const cardElement = document.querySelector(`[data-lead-id="${leadToDelete.id}"]`);
    const rect = cardElement?.getBoundingClientRect();
    if (rect) {
      triggerAnimation({
        type: 'delete',
        startX: rect.left + rect.width / 2,
        startY: rect.top + rect.height / 2
      });
    }

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
      corretor: 'all',
      valorMin: '',
      valorMax: '',
      regiao: '',
      imovel: '',
      origem: 'all',
      tags: [],
      stage: 'all',
      dataMin: '',
      dataMax: '',
      contatoRealizado: false,
      searchType: 'all',
    });
    setSearchTerm('');
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'tags') return (value as string[]).length > 0;
    if (typeof value === 'boolean') return value === true;
    return value !== '' && value !== 'all';
  }) || searchTerm !== '';

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
        const matchesCorretor = filters.corretor === 'all' || lead.assignedTo === filters.corretor;
        const matchesRegiao = filters.regiao === '' || lead.property.toLowerCase().includes(filters.regiao.toLowerCase());
        const matchesImovel = filters.imovel === '' || lead.property.toLowerCase().includes(filters.imovel.toLowerCase());
        const matchesOrigem = filters.origem === 'all' || lead.source === filters.origem;
        const matchesStage = filters.stage === 'all' || stage === filters.stage;
        const matchesSearchType = filters.searchType === 'all' || lead.searchType === filters.searchType;
        const matchesTags = filters.tags.length === 0 || (lead.tags && filters.tags.some(tag => lead.tags.includes(tag)));
        const matchesContato = !filters.contatoRealizado || (filters.contatoRealizado && lead.lastContact && lead.lastContact !== '');

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

        // Filtro de data
        let matchesData = true;
        if (filters.dataMin || filters.dataMax) {
          const leadDate = new Date(lead.createdAt);
          if (filters.dataMin) {
            matchesData = leadDate >= new Date(filters.dataMin);
          }
          if (filters.dataMax) {
            matchesData = matchesData && leadDate <= new Date(filters.dataMax);
          }
        }

        return matchesSearch && matchesNome && matchesCorretor && matchesRegiao && matchesImovel &&
          matchesOrigem && matchesStage && matchesTags && matchesContato && matchesValor && matchesData && matchesSearchType;
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

    // Move normalmente - não há verificação de transferência ao mover entre colunas
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

    // Trigger success ping at destination
    const dropzone = document.querySelector(`[data-droppable-id="${destStage}"]`);
    const dropRect = dropzone?.getBoundingClientRect();
    if (dropRect) {
      triggerAnimation({
        type: 'success',
        startX: dropRect.left + dropRect.width / 2,
        startY: dropRect.top + dropRect.height / 2,
        endX: dropRect.left + dropRect.width / 2,
        endY: dropRect.top + dropRect.height / 2
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

    // Trigger transfer animation (User icon moving)
    const cardElement = document.querySelector(`[data-lead-id="${lead.id}"]`);
    const rect = cardElement?.getBoundingClientRect();
    if (rect) {
      triggerAnimation({
        type: 'change-broker',
        startX: rect.left + rect.width / 2,
        startY: rect.top + rect.height / 2,
        icon: User
      });
    }

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
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="flex items-center gap-1">
              <Home className="h-4 w-4" /> Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Esi.leads</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Esi.leads</h1>
            <p className="text-slate-500 mt-1 font-medium">Gerencie seus leads e oportunidades em tempo real</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
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
                {Object.entries(filters).filter(([key, value]) => {
                  if (key === 'tags') return (value as string[]).length > 0;
                  if (key === 'contatoRealizado') return value === true;
                  return value !== '' && value !== 'all';
                }).length + (searchTerm !== '' ? 1 : 0)}
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
            {stages.map((stage) => {
              const stageLeads = getFilteredLeads()[stage.id] || [];
              const totalValue = stageLeads.reduce((sum, lead) => {
                const val = parseInt(lead.value.replace(/[^0-9]/g, '')) || 0;
                return sum + val;
              }, 0);

              return (
                <div key={stage.id} className="flex-shrink-0 w-72 md:w-80 flex flex-col h-full">
                  <div className="mb-4 bg-card/40 p-3 rounded-xl border border-border/50 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider ${stage.color}`}>
                        {stage.title}
                      </h3>
                      <Badge variant="secondary" className="rounded-full text-[10px] font-bold px-2 py-0.5 h-5 flex items-center justify-center bg-background/50">
                        {stageLeads.length}
                      </Badge>
                    </div>
                    <div className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(totalValue)}
                    </div>
                  </div>
                  <Droppable droppableId={stage.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        data-droppable-id={stage.id}
                        className={`space-y-3 flex-1 overflow-y-auto rounded-lg p-2 transition-colors ${snapshot.isDraggingOver ? 'bg-primary/5 border-2 border-dashed border-primary' : ''
                          }`}
                      >
                        {stageLeads.map((lead, index) => (
                          <Draggable key={lead.id} draggableId={lead.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="group focus:outline-none"
                                data-lead-id={lead.id}
                              >
                                <motion.div
                                  layout
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.2, delay: index * 0.05 }}
                                >
                                  <Card
                                    className={cn(
                                      "hover:shadow-xl transition-all cursor-grab active:cursor-grabbing relative overflow-hidden border-border/50",
                                      snapshot.isDragging ? 'shadow-2xl rotate-2 scale-105 z-50 ring-2 ring-primary' : '',
                                      "hover:border-primary/30"
                                    )}
                                    onClick={() => handleOpenDetails(lead)}
                                  >
                                    {/* Progress gradient top border */}
                                    {stage.id === 'closed' && (
                                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-success via-emerald-400 to-success" />
                                    )}

                                    <CardHeader className="pb-3 pt-4">
                                      <div className="flex items-start justify-between relative">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                          <Avatar className="h-9 w-9 flex-shrink-0 ring-2 ring-background shadow-sm">
                                            <AvatarFallback className="bg-gradient-to-br from-primary to-primary-700 text-white text-xs font-bold">
                                              {lead.name.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div className="flex-1 min-w-0">
                                            <CardTitle className="text-sm font-bold truncate group-hover:text-primary transition-colors">{lead.name}</CardTitle>
                                            <div className="flex items-center gap-2 mt-1">
                                              <Badge variant="outline" className="text-[9px] font-bold h-4 px-1 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                                                {lead.source}
                                              </Badge>
                                              <div className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                {index + 1}d
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Hover Actions */}
                                        <div className="absolute top-0 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0 translate-x-4 bg-background/95 backdrop-blur-sm rounded-lg p-1 shadow-xl z-10 border border-border">
                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleOpenDetails(lead);
                                            }}
                                          >
                                            <Eye className="h-4 w-4" />
                                          </Button>
                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleEditLead(lead);
                                            }}
                                          >
                                            <Edit className="h-4 w-4" />
                                          </Button>
                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDeleteLead(lead);
                                            }}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3 pb-4">
                                      <div className="space-y-1">
                                        <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                          <Home className="h-3 w-3" />
                                          {lead.property}
                                        </div>
                                        <div className="text-lg font-extrabold text-primary tracking-tight">
                                          {lead.value}
                                        </div>
                                      </div>

                                      <div className="flex gap-1 pt-1">
                                        <Button
                                          variant="secondary"
                                          size="icon"
                                          className="h-8 w-8 rounded-lg hover:bg-success hover:text-white transition-all shadow-none ring-0 border border-border/50 bg-muted/80 text-foreground/80"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleWhatsApp(lead);
                                          }}
                                        >
                                          <MessageCircle className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="secondary"
                                          size="icon"
                                          className="h-8 w-8 rounded-lg hover:bg-primary hover:text-white transition-all shadow-none ring-0 border border-border/50 bg-muted/80 text-foreground/80"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleSendEmail(lead);
                                          }}
                                        >
                                          <Mail className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="secondary"
                                          size="icon"
                                          className="h-8 w-8 rounded-lg hover:bg-warning hover:text-white transition-all shadow-none ring-0 border border-border/50 bg-muted/80 text-foreground/80"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleScheduleVisit(lead);
                                          }}
                                        >
                                          <Calendar className="h-4 w-4" />
                                        </Button>
                                      </div>

                                      {/* Tags */}
                                      {lead.tags && lead.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                          {lead.tags.slice(0, 2).map((tag) => (
                                            <Badge
                                              key={tag}
                                              className="bg-primary/10 text-primary-600 dark:text-primary-400 border border-primary/20 text-[9px] font-bold hover:bg-primary/20 transition-colors shadow-none"
                                            >
                                              {tag}
                                            </Badge>
                                          ))}
                                        </div>
                                      )}
                                    </CardContent>
                                  </Card>
                                </motion.div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              )
            })}
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
        onSave={handleSaveLead}
        lead={editingLead}
      />

      <ScheduleVisitModal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        onConfirm={handleConfirmVisit}
        lead={selectedLead}
      />

      {/* Modal de Filtros (Drawer Lateral) */}
      <Sheet open={filterModalOpen} onOpenChange={setFilterModalOpen}>
        <SheetContent side="right" className="sm:max-w-md w-full flex flex-col p-0">
          <SheetHeader className="p-6 border-b">
            <SheetTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              Filtros do Esi.leads
            </SheetTitle>
          </SheetHeader>

          <ScrollArea className="flex-1 px-6 py-4">
            <div className="space-y-6 pb-10">
              <div className="space-y-2">
                <Label htmlFor="nomeLead">Nome do Lead</Label>
                <Input
                  id="nomeLead"
                  placeholder="Buscar por nome..."
                  value={filters.nomeLead}
                  onChange={(e) => setFilters({ ...filters, nomeLead: e.target.value })}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="corretor">Corretor Responsável</Label>
                <Select value={filters.corretor} onValueChange={(value) => setFilters({ ...filters, corretor: value })}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="JS">João Silva (JS)</SelectItem>
                    <SelectItem value="MR">Maria Rocha (MR)</SelectItem>
                    <SelectItem value="PC">Pedro Costa (PC)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="origem">Origem do Lead</Label>
                <Select value={filters.origem} onValueChange={(value) => setFilters({ ...filters, origem: value })}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Todas as origens" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as origens</SelectItem>
                    <SelectItem value="Site">Site</SelectItem>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                    <SelectItem value="Indicação">Indicação</SelectItem>
                    <SelectItem value="Telefone">Telefone</SelectItem>
                    <SelectItem value="E-mail">E-mail</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="searchType">Tipo de Negócio</Label>
                <Select value={filters.searchType} onValueChange={(value) => setFilters({ ...filters, searchType: value })}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Todos os tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="compra">Compra</SelectItem>
                    <SelectItem value="venda">Venda</SelectItem>
                    <SelectItem value="investimento">Investimento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stage">Estágio do Funil</Label>
                <Select value={filters.stage} onValueChange={(value) => setFilters({ ...filters, stage: value })}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Todos os estágios" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os estágios</SelectItem>
                    <SelectItem value="new">Novo Lead</SelectItem>
                    <SelectItem value="contact">Contato Realizado</SelectItem>
                    <SelectItem value="visit">Visita Agendada</SelectItem>
                    <SelectItem value="proposal">Proposta Enviada</SelectItem>
                    <SelectItem value="negotiation">Em Negociação</SelectItem>
                    <SelectItem value="closed">Fechado</SelectItem>
                    <SelectItem value="lost">Perdido</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valorMin">Valor Mínimo</Label>
                  <Input
                    id="valorMin"
                    placeholder="R$ 0"
                    value={filters.valorMin}
                    onChange={(e) => setFilters({ ...filters, valorMin: e.target.value })}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="valorMax">Valor Máximo</Label>
                  <Input
                    id="valorMax"
                    placeholder="R$ 0"
                    value={filters.valorMax}
                    onChange={(e) => setFilters({ ...filters, valorMax: e.target.value })}
                    className="h-11"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataMin">Data Inicial</Label>
                  <Input
                    id="dataMin"
                    type="date"
                    value={filters.dataMin}
                    onChange={(e) => setFilters({ ...filters, dataMin: e.target.value })}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataMax">Data Final</Label>
                  <Input
                    id="dataMax"
                    type="date"
                    value={filters.dataMax}
                    onChange={(e) => setFilters({ ...filters, dataMax: e.target.value })}
                    className="h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="regiao">Região de Interesse</Label>
                <Input
                  id="regiao"
                  placeholder="Ex: Centro, Zona Sul..."
                  value={filters.regiao}
                  onChange={(e) => setFilters({ ...filters, regiao: e.target.value })}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imovel">Tipo de Imóvel</Label>
                <Input
                  id="imovel"
                  placeholder="Ex: Apartamento, Casa..."
                  value={filters.imovel}
                  onChange={(e) => setFilters({ ...filters, imovel: e.target.value })}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Tags do Lead</Label>
                <TagManager
                  selectedTags={filters.tags}
                  availableTags={DEFAULT_TAGS}
                  onUpdate={(tags) => setFilters({ ...filters, tags })}
                  onUpdateAvailableTags={() => { }} // No active editing in filter modal
                  showEditMode={false}
                />
              </div>

              <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg border border-border/50">
                <input
                  type="checkbox"
                  id="contatoRealizado"
                  checked={filters.contatoRealizado}
                  onChange={(e) => setFilters({ ...filters, contatoRealizado: e.target.checked })}
                  className="h-5 w-5 rounded border-input text-primary focus:ring-primary"
                />
                <Label htmlFor="contatoRealizado" className="text-sm cursor-pointer select-none">
                  Apenas leads com contato realizado
                </Label>
              </div>
            </div>
          </ScrollArea>

          <SheetFooter className="p-6 border-t flex-col sm:flex-row gap-3 bg-muted/20">
            <Button variant="outline" onClick={handleClearFilters} className="w-full sm:w-auto h-11 gap-2 border-slate-200">
              <X className="h-4 w-4" />
              Limpar Filtros
            </Button>
            <Button onClick={() => setFilterModalOpen(false)} className="w-full sm:w-auto h-11 px-8 bg-indigo-600 hover:bg-indigo-700">
              Aplicar Filtros
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

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
