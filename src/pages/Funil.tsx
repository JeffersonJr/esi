import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Filter, X, Search } from 'lucide-react';
import { LeadDetailsModal } from '@/components/modals/LeadDetailsModal';
import { LeadFormModal } from '@/components/modals/LeadFormModal';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { LeadCard } from '@/components/LeadCard';
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
import { Label } from '@/components/ui/label';

interface ContactInfo {
  type: 'email' | 'phone' | 'mobile';
  value: string;
  isPrimary?: boolean;
}

interface LeadData {
  name: string;
  emails: ContactInfo[];
  phones: ContactInfo[];
  property: string;
  value: string;
  source: string;
  notes: string;
  stage: string;
  assignedTo: string;
  tags: string[];
}

interface Lead extends LeadData {
  id: string;
  lastContact?: string;
  nextAction?: string;
}

interface VisitData {
  date: string;
  time: string;
  type: string;
  notes?: string;
}

const stages = [
  { id: 'new', title: 'Novo Lead', color: 'bg-blue-100 text-blue-800' },
  { id: 'contact', title: 'Contato Realizado', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'visit', title: 'Visita Agendada', color: 'bg-purple-100 text-purple-800' },
  { id: 'proposal', title: 'Proposta Enviada', color: 'bg-orange-100 text-orange-800' },
  { id: 'negotiation', title: 'Negociação', color: 'bg-red-100 text-red-800' },
  { id: 'closed', title: 'Fechado', color: 'bg-green-100 text-green-800' },
];

const initialLeads: Lead[] = [
  {
    id: '1',
    name: 'João Silva',
    emails: [
      { type: 'email', value: 'joao.silva@email.com', isPrimary: true },
      { type: 'email', value: 'joao.silva2@email.com', isPrimary: false }
    ],
    phones: [
      { type: 'phone', value: '(11) 98765-4321', isPrimary: true },
      { type: 'mobile', value: '(11) 91234-5678', isPrimary: false }
    ],
    property: 'Apartamento 2 quartos - Brooklin',
    value: 'R$ 450.000',
    source: 'Facebook',
    assignedTo: 'JS',
    stage: 'new',
    tags: ['Hot Lead', 'VIP'],
    notes: ''
  },
  {
    id: '2',
    name: 'Maria Santos',
    emails: [
      { type: 'email', value: 'maria.santos@email.com', isPrimary: true }
    ],
    phones: [
      { type: 'mobile', value: '(11) 99876-5432', isPrimary: true }
    ],
    property: 'Casa 3 quartos - Moema',
    value: 'R$ 750.000',
    source: 'Instagram',
    assignedTo: 'MR',
    stage: 'contact',
    tags: ['Primeira Compra'],
    notes: ''
  },
  {
    id: '3',
    name: 'Pedro Costa',
    emails: [
      { type: 'email', value: 'pedro.costa@email.com', isPrimary: true }
    ],
    phones: [
      { type: 'phone', value: '(11) 3456-7890', isPrimary: true },
      { type: 'mobile', value: '(11) 98765-4321', isPrimary: false }
    ],
    property: 'Studio - Vila Madalena',
    value: 'R$ 280.000',
    source: 'Site',
    assignedTo: 'PC',
    stage: 'visit',
    tags: ['Investidor'],
    notes: ''
  },
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
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [filters, setFilters] = useState({
    nomeLead: '',
    corretor: '',
    valorMin: '',
    valorMax: '',
    regiao: '',
    imovel: '',
  });

  const isMobile = useMediaQuery('(max-width: 768px)');

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
            lead.id === editingLead.id ? leadData : lead
          );
        });
        return newLeads;
      });
      toast({
        title: "Lead atualizado",
        description: "As alterações foram salvas com sucesso.",
      });
    } else {
      // Add new lead
      const newLead = { ...leadData, id: Date.now().toString() };
      setLeads(prev => ({
        ...prev,
        new: [...prev.new, newLead]
      }));
      toast({
        title: "Lead criado",
        description: "Novo lead adicionado com sucesso.",
      });
    }
    setFormOpen(false);
    setEditingLead(null);
  };

  const handleSendEmail = (lead: Lead) => {
    const primaryEmail = lead.emails?.find(email => email.isPrimary)?.value || lead.emails?.[0]?.value || '';
    window.location.href = `mailto:${primaryEmail}`;
  };

  const handleWhatsApp = (lead: Lead) => {
    const primaryPhone = lead.phones?.find(phone => phone.isPrimary)?.value || lead.phones?.[0]?.value || '';
    const message = `Olá ${lead.name}, tudo bem?`;
    window.open(`https://wa.me/${primaryPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleScheduleVisit = (lead: Lead) => {
    setSelectedLead(lead);
    setScheduleOpen(true);
  };

  const handleConfirmVisit = (data: { date: string; time: string; notes: string; activity: string; }) => {
    if (selectedLead) {
      // Move lead to visit stage
      setLeads(prev => {
        const newLeads = { ...prev };
        Object.keys(newLeads).forEach(stage => {
          newLeads[stage] = newLeads[stage].filter(lead => lead.id !== selectedLead.id);
        });
        newLeads.visit = [...newLeads.visit, { ...selectedLead, stage: 'visit' }];
        return newLeads;
      });
      
      toast({
        title: "Visita agendada",
        description: `Visita agendada para ${selectedLead.name} em ${data.date} às ${data.time}`,
      });
      
      setScheduleOpen(false);
      setSelectedLead(null);
    }
  };

  const handleCreateActivity = (lead: Lead) => {
    handleScheduleVisit(lead);
  };

  const getFilteredLeads = useCallback(() => {
    const filteredLeads: Record<string, Lead[]> = {};
    
    stages.forEach(stage => {
      let stageLeads = leads[stage.id] || [];
      
      // Apply search filter
      if (searchTerm) {
        const primaryEmail = stageLeads.map(lead => 
          lead.emails?.find(email => email.isPrimary)?.value || lead.emails?.[0]?.value || ''
        );
        const primaryPhone = stageLeads.map(lead => 
          lead.phones?.find(phone => phone.isPrimary)?.value || lead.phones?.[0]?.value || ''
        );
        
        stageLeads = stageLeads.filter(lead => 
          lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          primaryEmail.some(email => email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          primaryPhone.some(phone => phone.includes(searchTerm)) ||
          lead.property.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Apply additional filters
      if (filters.nomeLead) {
        stageLeads = stageLeads.filter(lead =>
          lead.name.toLowerCase().includes(filters.nomeLead.toLowerCase())
        );
      }
      
      if (filters.corretor) {
        stageLeads = stageLeads.filter(lead =>
          lead.assignedTo === filters.corretor
        );
      }
      
      if (filters.valorMin) {
        stageLeads = stageLeads.filter(lead => {
          const value = parseInt(lead.value.replace(/\D/g, ''));
          return value >= parseInt(filters.valorMin.replace(/\D/g, ''));
        });
      }
      
      if (filters.valorMax) {
        stageLeads = stageLeads.filter(lead => {
          const value = parseInt(lead.value.replace(/\D/g, ''));
          return value <= parseInt(filters.valorMax.replace(/\D/g, ''));
        });
      }
      
      if (filters.regiao) {
        stageLeads = stageLeads.filter(lead =>
          lead.property.toLowerCase().includes(filters.regiao.toLowerCase())
        );
      }
      
      if (filters.imovel) {
        stageLeads = stageLeads.filter(lead =>
          lead.property.toLowerCase().includes(filters.imovel.toLowerCase())
        );
      }
      
      if (stageLeads.length > 0) {
        filteredLeads[stage.id] = stageLeads;
      }
    });
    
    return filteredLeads;
  }, [leads, searchTerm, filters]);

  const handleClearFilters = () => {
    setFilters({
      nomeLead: '',
      corretor: '',
      valorMin: '',
      valorMax: '',
      regiao: '',
      imovel: '',
    });
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
            onClick={() => setFilterModalOpen(true)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
          <Button
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

      <div className="flex-1 overflow-x-auto pb-6">
        <div className="flex gap-4 h-full overflow-x-auto pb-4">
          {stages.map((stage) => (
            <div key={stage.id} className="flex-shrink-0 w-72 md:w-80 flex flex-col">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-semibold text-sm px-3 py-1 rounded-full ${stage.color}`}>
                    {stage.title}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {getFilteredLeads()[stage.id]?.length || 0}
                  </span>
                </div>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto">
                {getFilteredLeads()[stage.id]?.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onOpenDetails={handleOpenDetails}
                    onEdit={handleEditLead}
                    onScheduleVisit={handleScheduleVisit}
                    onSendEmail={handleSendEmail}
                    onWhatsApp={handleWhatsApp}
                    onDelete={handleDeleteLead}
                    isMobile={isMobile}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <LeadDetailsModal
        lead={selectedLead}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        onEdit={() => {
          setDetailsOpen(false);
          handleEditLead(selectedLead!);
        }}
        onDelete={() => {
          if (selectedLead) {
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
