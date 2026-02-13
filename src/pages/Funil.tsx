import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Filter, X, Search } from 'lucide-react';
import { LeadCard } from '@/components/LeadCard';
import { LeadDetailsModal } from '@/components/modals/LeadDetailsModal';
import { LeadFormModal } from '@/components/modals/LeadFormModal';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { useMediaQuery } from '@/hooks';
import { ScheduleVisitModal } from '@/components/modals/ScheduleVisitModal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
  value: string;
  source: string;
  assignedTo: string;
  notes?: string;
  stage?: string;
  lastContact?: string;
  nextAction?: string;
  tags?: string[];
  temperature?: 'cold' | 'warm' | 'hot';
}

const stages = [
  { id: 'new', title: 'Novo Lead', color: 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100' },
  { id: 'contact', title: 'Contato Realizado', color: 'bg-accent/10 text-accent dark:bg-accent/20' },
  { id: 'visit', title: 'Visita Agendada', color: 'bg-warning/10 text-warning dark:bg-warning/20' },
  { id: 'proposal', title: 'Proposta Enviada', color: 'bg-primary/10 text-primary dark:bg-primary/20' },
  { id: 'negotiation', title: 'Negociação', color: 'bg-accent/20 text-accent dark:bg-accent/30' },
  { id: 'closed', title: 'Fechado', color: 'bg-success/10 text-success dark:bg-success/20' },
  { id: 'lost', title: 'Perdido', color: 'bg-destructive/10 text-destructive dark:bg-destructive/20' },
];

const initialLeads: Lead[] = [
  {
    id: '1',
    name: 'João Silva',
    emails: [{ type: 'email', value: 'joao.silva@email.com', isPrimary: true }],
    phones: [{ type: 'phone', value: '(11) 98765-4321', isPrimary: true }],
    property: 'Apartamento 2 quartos - Centro',
    value: 'R$ 350.000',
    source: 'Facebook',
    assignedTo: 'JS',
    stage: 'new',
    tags: ['Hot Lead', 'VIP'],
    temperature: 'hot'
  },
  {
    id: '2',
    name: 'Maria Santos',
    emails: [
      { type: 'email', value: 'maria.santos@email.com', isPrimary: true },
      { type: 'email', value: 'maria.santos2@email.com', isPrimary: false }
    ],
    phones: [
      { type: 'mobile', value: '(11) 91234-5678', isPrimary: true },
      { type: 'phone', value: '(11) 3456-7890', isPrimary: false }
    ],
    property: 'Casa 3 quartos - Vila Mariana',
    value: 'R$ 750.000',
    source: 'Instagram',
    assignedTo: 'MR',
    stage: 'contact',
    tags: ['Primeira Compra', 'Financiamento'],
    temperature: 'warm'
  },
  {
    id: '3',
    name: 'Pedro Costa',
    emails: [{ type: 'email', value: 'pedro.costa@email.com', isPrimary: true }],
    phones: [{ type: 'mobile', value: '(11) 99876-5432', isPrimary: true }],
    property: 'Studio - Pinheiros',
    value: 'R$ 280.000',
    source: 'Indicação',
    assignedTo: 'PC',
    stage: 'visit',
    tags: ['Investidor'],
    temperature: 'cold'
  },
  {
    id: '4',
    name: 'Ana Oliveira',
    emails: [
      { type: 'email', value: 'ana.oliveira@email.com', isPrimary: true },
      { type: 'email', value: 'ana.contato@email.com', isPrimary: false },
      { type: 'email', value: 'ana.negocios@email.com', isPrimary: false }
    ],
    phones: [
      { type: 'mobile', value: '(11) 97654-3210', isPrimary: true },
      { type: 'phone', value: '(11) 2345-6789', isPrimary: false },
      { type: 'mobile', value: '(11) 98765-4321', isPrimary: false }
    ],
    property: 'Cobertura - Moema',
    value: 'R$ 450.000',
    source: 'Site',
    assignedTo: 'JS',
    stage: 'proposal',
    tags: ['Aluguel', 'Urgente'],
    temperature: 'hot'
  },
  {
    id: '5',
    name: 'Carlos Ferreira',
    emails: [{ type: 'email', value: 'carlos.ferreira@email.com', isPrimary: true }],
    phones: [{ type: 'mobile', value: '(11) 95432-1098', isPrimary: true }],
    property: 'Kitnet - Bela Vista',
    value: 'R$ 180.000',
    source: 'Portal Imóveis',
    assignedTo: 'MR',
    stage: 'negotiation',
    tags: ['Follow-up Necessário'],
    temperature: 'warm'
  }
];

export function Funil() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Record<string, Lead[]>>({
    new: initialLeads.filter(lead => lead.stage === 'new'),
    contact: initialLeads.filter(lead => lead.stage === 'contact'),
    visit: initialLeads.filter(lead => lead.stage === 'visit'),
    proposal: initialLeads.filter(lead => lead.stage === 'proposal'),
    negotiation: initialLeads.filter(lead => lead.stage === 'negotiation'),
    closed: initialLeads.filter(lead => lead.stage === 'closed'),
    lost: initialLeads.filter(lead => lead.stage === 'lost'),
  });

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
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

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceStage = source.droppableId;
    const destStage = destination.droppableId;

    if (sourceStage === destStage) return;

    const sourceLeads = Array.from(leads[sourceStage] || []);
    const destLeads = Array.from(leads[destStage] || []);
    const [movedLead] = sourceLeads.splice(source.index, 1);
    
    const updatedLead = { ...movedLead, stage: destStage };
    destLeads.splice(destination.index, 0, updatedLead);

    setLeads(prev => ({
      ...prev,
      [sourceStage]: sourceLeads,
      [destStage]: destLeads
    }));

    toast({
      title: "Lead movido",
      description: `${movedLead.name} foi movido para ${stages.find(s => s.id === destStage)?.title}`,
    });
  };

  const handleOpenDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setDetailsOpen(true);
  };

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setFormOpen(true);
  };

  const handleDeleteLead = (leadId: string) => {
    setLeads(prev => {
      const newLeads = { ...prev };
      Object.keys(newLeads).forEach(stage => {
        newLeads[stage] = newLeads[stage].filter(lead => lead.id !== leadId);
      });
      return newLeads;
    });

    toast({
      title: "Lead excluído",
      description: "O lead foi removido com sucesso.",
    });
  };

  const handleSaveLead = (leadData: Lead) => {
    if (editingLead) {
      // Update existing lead
      setLeads(prev => {
        const newLeads = { ...prev };
        Object.keys(newLeads).forEach(stage => {
          newLeads[stage] = newLeads[stage].map(lead => 
            lead.id === editingLead.id ? { ...leadData, id: editingLead.id } : lead
          );
        });
        return newLeads;
      });

      toast({
        title: "Lead atualizado",
        description: `${leadData.name} foi atualizado com sucesso.`,
      });
    } else {
      // Add new lead
      const newLead = { ...leadData, id: Date.now().toString() };
      setLeads(prev => ({
        ...prev,
        new: [...(prev.new || []), newLead]
      }));

      toast({
        title: "Lead adicionado",
        description: `${leadData.name} foi adicionado com sucesso.`,
      });
    }

    setFormOpen(false);
    setEditingLead(null);
  };

  const handleScheduleVisit = (lead: Lead) => {
    setSelectedLead(lead);
    setScheduleOpen(true);
  };

  const handleSendEmail = (lead: Lead) => {
    const primaryEmail = lead.emails?.find(email => email.isPrimary)?.value || lead.emails?.[0]?.value || '';
    window.open(`mailto:${primaryEmail}`, '_blank');
  };

  const handleWhatsApp = (lead: Lead) => {
    const primaryPhone = lead.phones?.find(phone => phone.isPrimary)?.value || lead.phones?.[0]?.value || '';
    const message = encodeURIComponent(`Olá ${lead.name}!`);
    window.open(`https://wa.me/${primaryPhone.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  const handleCreateActivity = (lead: Lead) => {
    handleScheduleVisit(lead);
  };

  const handleConfirmVisit = (data: { date: string; time: string; notes: string; activity: string }) => {
    if (selectedLead) {
      setLeads(prev => {
        const newLeads = { ...prev };
        Object.keys(newLeads).forEach(stage => {
          newLeads[stage] = newLeads[stage].map(lead => 
            lead.id === selectedLead.id 
              ? { 
                  ...lead, 
                  stage: 'visit',
                  lastContact: new Date().toLocaleDateString('pt-BR'),
                  nextAction: `Visita agendada para ${data.date} às ${data.time}`
                }
              : lead
          );
        });
        return newLeads;
      });

      toast({
        title: "Visita agendada",
        description: `Visita agendada para ${selectedLead.name}`,
      });
    }
    setScheduleOpen(false);
  };

  const getFilteredLeads = () => {
    let filteredLeads = { ...leads };

    // Apply search
    if (searchTerm) {
      filteredLeads = Object.keys(filteredLeads).reduce((acc, stage) => {
        const primaryEmail = (lead: Lead) => lead.emails?.find(email => email.isPrimary)?.value || lead.emails?.[0]?.value || '';
        const primaryPhone = (lead: Lead) => lead.phones?.find(phone => phone.isPrimary)?.value || lead.phones?.[0]?.value || '';
        
        acc[stage] = filteredLeads[stage].filter(lead =>
          lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          primaryEmail(lead).toLowerCase().includes(searchTerm.toLowerCase()) ||
          primaryPhone(lead).toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.property.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return acc;
      }, {} as Record<string, Lead[]>);
    }

    // Apply filters
    if (filters.nomeLead || filters.corretor || filters.valorMin || filters.valorMax || filters.regiao || filters.imovel) {
      filteredLeads = Object.keys(filteredLeads).reduce((acc, stage) => {
        acc[stage] = filteredLeads[stage].filter(lead => {
          const primaryEmail = lead.emails?.find(email => email.isPrimary)?.value || lead.emails?.[0]?.value || '';
          const primaryPhone = lead.phones?.find(phone => phone.isPrimary)?.value || lead.phones?.[0]?.value || '';
          
          return (
            (!filters.nomeLead || lead.name.toLowerCase().includes(filters.nomeLead.toLowerCase())) &&
            (!filters.corretor || lead.assignedTo.toLowerCase().includes(filters.corretor.toLowerCase())) &&
            (!filters.valorMin || parseInt(lead.value.replace(/\D/g, '')) >= parseInt(filters.valorMin.replace(/\D/g, ''))) &&
            (!filters.valorMax || parseInt(lead.value.replace(/\D/g, '')) <= parseInt(filters.valorMax.replace(/\D/g, ''))) &&
            (!filters.regiao || lead.property.toLowerCase().includes(filters.regiao.toLowerCase())) &&
            (!filters.imovel || lead.property.toLowerCase().includes(filters.imovel.toLowerCase()))
          );
        });
        return acc;
      }, {} as Record<string, Lead[]>);
    }

    return filteredLeads;
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
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Funil de Vendas</h1>
          <p className="text-muted-foreground">Gerencie seus leads e acompanhe o progresso</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setFilterModalOpen(true)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
          <Button
            onClick={() => setFormOpen(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Novo Lead
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar leads..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Funil */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {stages.map((stage) => (
            <div key={stage.id} className="space-y-3">
              <div className={`p-3 rounded-lg ${stage.color}`}>
                <h3 className="font-semibold text-sm">{stage.title}</h3>
                <p className="text-xs opacity-75">{getFilteredLeads()[stage.id]?.length || 0} leads</p>
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
                    {getFilteredLeads()[stage.id]?.map((lead) => (
                      <LeadCard
                        key={lead.id}
                        lead={lead}
                        isMobile={isMobile}
                        onOpenDetails={handleOpenDetails}
                        onEdit={handleEditLead}
                        onScheduleVisit={handleScheduleVisit}
                        onSendEmail={handleSendEmail}
                        onWhatsApp={handleWhatsApp}
                        onDelete={handleDeleteLead}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Modals */}
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
            handleDeleteLead(selectedLead.id);
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
                  <SelectItem value="JS">João Silva</SelectItem>
                  <SelectItem value="MR">Maria Rocha</SelectItem>
                  <SelectItem value="PC">Pedro Costa</SelectItem>
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
    </div>
  );
}
