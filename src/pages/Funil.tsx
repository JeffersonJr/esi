import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MoreVertical, Mail, Calendar, GripVertical, Trash2, Edit, Eye, MessageCircle, Filter, X, Search } from 'lucide-react';
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
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
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

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  property: string;
  value: string;
  source: string;
  assignedTo: string;
  notes?: string;
  stage?: string;
  lastContact?: string;
  nextAction?: string;
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

const initialLeads: Record<string, Lead[]> = {
  new: [
    { id: '1', name: 'Maria Santos', email: 'maria@email.com', phone: '11 99999-0001', property: 'Apt 2 quartos', value: 'R$ 350.000', source: 'Site', assignedTo: 'JS' },
    { id: '2', name: 'Carlos Oliveira', email: 'carlos@email.com', phone: '11 99999-0002', property: 'Casa 3 quartos', value: 'R$ 580.000', source: 'Facebook', assignedTo: 'MR' },
  ],
  contact: [
    { id: '3', name: 'João Silva', email: 'joao@email.com', phone: '11 99999-0003', property: 'Cobertura', value: 'R$ 1.200.000', source: 'Indicação', assignedTo: 'JS' },
  ],
  visit: [
    { id: '4', name: 'Ana Costa', email: 'ana@email.com', phone: '11 99999-0004', property: 'Apt 3 quartos', value: 'R$ 450.000', source: 'Instagram', assignedTo: 'MR' },
    { id: '5', name: 'Pedro Souza', email: 'pedro@email.com', phone: '11 99999-0005', property: 'Casa condomínio', value: 'R$ 720.000', source: 'Site', assignedTo: 'JS' },
  ],
  proposal: [
    { id: '6', name: 'Fernanda Lima', email: 'fernanda@email.com', phone: '11 99999-0006', property: 'Apt 4 quartos', value: 'R$ 650.000', source: 'Portal', assignedTo: 'MR' },
  ],
  negotiation: [
    { id: '7', name: 'Roberto Alves', email: 'roberto@email.com', phone: '11 99999-0007', property: 'Casa térrea', value: 'R$ 480.000', source: 'Site', assignedTo: 'JS' },
  ],
  closed: [
    { id: '8', name: 'Juliana Rocha', email: 'juliana@email.com', phone: '11 99999-0008', property: 'Cobertura duplex', value: 'R$ 950.000', source: 'Indicação', assignedTo: 'MR' },
  ],
  lost: [
    { id: '9', name: 'Lucas Mendes', email: 'lucas@email.com', phone: '11 99999-0009', property: 'Kitnet', value: 'R$ 180.000', source: 'Telefone', assignedTo: 'JS' },
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

  const handleDeleteLead = (leadId: string) => {
    setLeads(prevLeads => {
      const newLeads = { ...prevLeads };
      for (const stage in newLeads) {
        newLeads[stage] = newLeads[stage].filter(lead => lead.id !== leadId);
      }
      toast({
        title: "Lead removido",
        description: "O lead foi removido do funil com sucesso.",
      });
      return newLeads;
    });
  };

  const handleSaveLead = (leadData: any) => {
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

  const handleConfirmVisit = (visitData: any) => {
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
    window.location.href = `mailto:${lead.email}?subject=Contato sobre o imóvel ${lead.property}`;
  };

  const handleWhatsApp = (phone: string) => {
    // Remove non-digits from phone number
    const cleanPhone = phone.replace(/\D/g, '');
    // Open WhatsApp with the phone number
    window.open(`https://wa.me/55${cleanPhone}`, '_blank');
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
        const matchesSearch = searchTerm === '' || 
          lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    // Adiciona ao estágio de destino
    destLeads.splice(destination.index, 0, removed);

    // Atualiza o estado
    newLeads[sourceStage] = sourceLeads;
    newLeads[destStage] = destLeads;

    setLeads(newLeads);
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
                    <span className="text-xs text-muted-foreground">
                      {getFilteredLeads()[stage.id]?.length || 0}
                    </span>
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
                              className={`hover:shadow-lg transition-all cursor-pointer ${
                                snapshot.isDragging ? 'shadow-2xl rotate-2 scale-105' : ''
                              }`}
                              onClick={() => handleOpenDetails(lead)}
                            >
                              <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center gap-2">
                                    <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing">
                                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
                                        {lead.name.split(' ').map(n => n[0]).join('')}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <CardTitle className="text-sm">{lead.name}</CardTitle>
                                      <Badge variant="outline" className="mt-1 text-xs">
                                        {lead.source}
                                      </Badge>
                                    </div>
                                  </div>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={(e) => {
                                          e.stopPropagation();
                                          handleOpenDetails(lead);
                                        }}>
                                        <span className="flex items-center gap-2">
                                          <span className="h-4 w-4"><Eye className="h-4 w-4" /></span>
                                          Ver detalhes
                                        </span>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={(e) => {
                                          e.stopPropagation();
                                          handleEditLead(lead);
                                        }}>
                                        <span className="flex items-center gap-2">
                                          <Edit className="h-4 w-4" />
                                          Editar
                                        </span>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={(e) => {
                                          e.stopPropagation();
                                          handleScheduleVisit(lead);
                                        }}>
                                        <span className="flex items-center gap-2">
                                          <Calendar className="h-4 w-4" />
                                          Agendar atividade
                                        </span>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem 
                                        className="text-destructive"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (confirm('Tem certeza que deseja excluir este lead?')) {
                                            handleDeleteLead(lead.id);
                                          }
                                        }}
                                      >
                                        <span className="flex items-center gap-2">
                                          <Trash2 className="h-4 w-4" />
                                          Excluir
                                        </span>
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                <div className="text-sm">
                                  <div className="font-medium text-foreground">{lead.property}</div>
                                  <div className="text-primary font-semibold mt-1">{lead.value}</div>
                                </div>
                                <div className="flex gap-2 pt-2">
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
                                      handleWhatsApp(lead.phone);
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
                                <div className="flex items-center gap-2 pt-2 border-t border-border">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback className="bg-muted text-xs">{lead.assignedTo}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs text-muted-foreground">Responsível</span>
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
    </div>
  );
}
