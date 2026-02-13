import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon, ChevronUp, ChevronDown, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

// Shared client data from Funil de Vendas
const clientes = [
  { id: '1', name: 'Maria Santos', email: 'maria@email.com', phone: '11 99999-0001' },
  { id: '2', name: 'Carlos Oliveira', email: 'carlos@email.com', phone: '11 99999-0002' },
  { id: '3', name: 'João Silva', email: 'joao@email.com', phone: '11 99999-0003' },
  { id: '4', name: 'Ana Costa', email: 'ana@email.com', phone: '11 99999-0004' },
  { id: '5', name: 'Pedro Souza', email: 'pedro@email.com', phone: '11 99999-0005' },
  { id: '6', name: 'Fernanda Lima', email: 'fernanda@email.com', phone: '11 99999-0006' },
  { id: '7', name: 'Roberto Alves', email: 'roberto@email.com', phone: '11 99999-0007' },
  { id: '8', name: 'Juliana Rocha', email: 'juliana@email.com', phone: '11 99999-0008' },
  { id: '9', name: 'Lucas Mendes', email: 'lucas@email.com', phone: '11 99999-0009' },
];

const eventos = [
  {
    id: '1',
    titulo: 'Visita - Apt 302',
    cliente: 'João Silva',
    horario: '14:00',
    duracao: '1h',
    tipo: 'visita',
    prioridade: 'alta' as 'baixa' | 'media' | 'alta',
  },
  {
    id: '2',
    titulo: 'Reunião - Proposta Cobertura',
    cliente: 'Maria Santos',
    horario: '10:00',
    duracao: '45min',
    tipo: 'reuniao',
    prioridade: 'media' as 'baixa' | 'media' | 'alta',
  },
  {
    id: '3',
    titulo: 'Ligação - Follow-up',
    cliente: 'Carlos Oliveira',
    horario: '16:30',
    duracao: '30min',
    tipo: 'ligacao',
    prioridade: 'baixa' as 'baixa' | 'media' | 'alta',
  },
];

const proximosEventos = [
  {
    id: '4',
    titulo: 'Vistoria - Casa Jardim América',
    data: 'Amanhã',
    horario: '09:00',
    tipo: 'vistoria',
  },
  {
    id: '5',
    titulo: 'Apresentação - Empreendimento Solar',
    data: '22/12',
    horario: '15:00',
    tipo: 'apresentacao',
  },
  {
    id: '6',
    titulo: 'Assinatura de Contrato',
    data: '23/12',
    horario: '11:00',
    tipo: 'contrato',
  },
];

const getTipoColor = (tipo: string) => {
  switch (tipo) {
    case 'visita':
      return 'bg-primary/10 text-primary border-primary/20';
    case 'reuniao':
      return 'bg-accent/10 text-accent border-accent/20';
    case 'ligacao':
      return 'bg-warning/10 text-warning border-warning/20';
    case 'vistoria':
      return 'bg-success/10 text-success border-success/20';
    case 'apresentacao':
      return 'bg-primary/10 text-primary border-primary/20';
    case 'contrato':
      return 'bg-accent/10 text-accent border-accent/20';
    default:
      return '';
  }
};

const getPriorityIcon = (prioridade: 'baixa' | 'media' | 'alta') => {
  switch (prioridade) {
    case 'alta':
      return <ChevronUp className="h-3 w-3" />;
    case 'media':
      return <Minus className="h-3 w-3" />;
    case 'baixa':
      return <ChevronDown className="h-3 w-3" />;
    default:
      return null;
  }
};

const getPriorityColor = (prioridade: 'baixa' | 'media' | 'alta') => {
  switch (prioridade) {
    case 'alta':
      return 'bg-red-100 text-red-600 border-red-200';
    case 'media':
      return 'bg-yellow-100 text-yellow-600 border-yellow-200';
    case 'baixa':
      return 'bg-green-100 text-green-600 border-green-200';
    default:
      return '';
  }
};

export function Agenda() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvento, setSelectedEvento] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showNewActivityModal, setShowNewActivityModal] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [completionNote, setCompletionNote] = useState('');
  const [activityRating, setActivityRating] = useState<'boa' | 'ruim' | 'nao-avaliada'>('nao-avaliada');
  
  // New activity form state
  const [newActivity, setNewActivity] = useState({
    titulo: '',
    clienteId: '',
    clienteNome: '',
    data: '',
    horario: '',
    duracao: '',
    tipo: 'visita',
    prioridade: 'media' as 'baixa' | 'media' | 'alta',
    descricao: ''
  });
  const [clientSelectionMode, setClientSelectionMode] = useState<'existing' | 'new'>('existing');

  const getViewModeTitle = () => {
    switch (viewMode) {
      case 'month':
        return currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      case 'week':
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return `${startOfWeek.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })} - ${endOfWeek.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })}`;
      case 'day':
        return currentDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      default:
        return '';
    }
  };

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekDays.push(day);
    }
    return weekDays;
  };

  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    switch (viewMode) {
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'day':
        newDate.setDate(newDate.getDate() - 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);
    switch (viewMode) {
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'day':
        newDate.setDate(newDate.getDate() + 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDayClick = (day: Date) => {
    setCurrentDate(day);
    setViewMode('day');
  };

  const handleViewDetails = (evento: any) => {
    // Navigate to lead activity details instead of showing modal
    const client = clientes.find(c => c.name === evento.cliente);
    if (client) {
      navigate(`/leads/${client.id}?activity=${evento.id}`);
    }
  };

  const handleViewActivityModal = (evento: any) => {
    setSelectedEvento(evento);
    setShowDetailsModal(true);
  };

  const handleReschedule = (evento: any) => {
    setSelectedEvento(evento);
    setRescheduleDate('');
    setRescheduleTime('');
    setShowRescheduleModal(true);
  };

  const handleComplete = (evento: any) => {
    setSelectedEvento(evento);
    setCompletionNote('');
    setActivityRating('nao-avaliada');
    setShowCompleteModal(true);
  };

  const confirmReschedule = () => {
    // In a real app, this would update the event in the database
    console.log('Rescheduling event:', selectedEvento, 'to:', rescheduleDate, rescheduleTime);
    
    // Show success toast
    toast({
      title: "Atividade reagendada com sucesso!",
      description: `${selectedEvento?.titulo} foi reagendada para ${rescheduleDate} às ${rescheduleTime}.`,
      variant: "success",
    });
    
    setShowRescheduleModal(false);
  };

  const confirmComplete = () => {
    // In a real app, this would mark the event as completed and save the note and rating
    console.log('Completing event:', selectedEvento, 'with note:', completionNote, 'rating:', activityRating);
    
    // Check if activity type requires contact communication
    const communicationTypes = ['visita', 'reuniao', 'vistoria', 'apresentacao'];
    const needsCommunication = selectedEvento?.tipo && communicationTypes.includes(selectedEvento.tipo);
    
    if (needsCommunication) {
      // Find client contact info
      const client = clientes.find(c => c.name === selectedEvento?.cliente);
      if (client) {
        // Simulate sending communication
        console.log('Sending communication to:', client.email, client.phone);
        
        toast({
          title: "Atividade concluída e contato comunicado!",
          description: `${selectedEvento?.titulo} foi concluída. Uma comunicação foi enviada para ${client.name} (${client.email}).`,
          variant: "success",
        });
      } else {
        toast({
          title: "Atividade concluída!",
          description: `${selectedEvento?.titulo} foi marcada como concluída.`,
          variant: "success",
        });
      }
    } else {
      toast({
        title: "Atividade concluída!",
        description: `${selectedEvento?.titulo} foi marcada como concluída.`,
        variant: "success",
      });
    }
    
    setShowCompleteModal(false);
  };

  const handleNewActivity = () => {
    setNewActivity({
      titulo: '',
      clienteId: '',
      clienteNome: '',
      data: currentDate.toISOString().split('T')[0],
      horario: '',
      duracao: '',
      tipo: 'visita',
      prioridade: 'media' as 'baixa' | 'media' | 'alta',
      descricao: ''
    });
    setClientSelectionMode('existing');
    setShowNewActivityModal(true);
  };

  const confirmNewActivity = () => {
    // In a real app, this would save the new activity to the database
    console.log('Creating new activity:', newActivity);
    
    // Show success toast
    toast({
      title: "Atividade criada com sucesso!",
      description: `${newActivity.titulo} foi agendada para ${newActivity.data} às ${newActivity.horario}.`,
      variant: "success",
    });
    
    setShowNewActivityModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Agenda</h1>
          <p className="text-muted-foreground">Gerencie seus compromissos e atividades</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={viewMode} onValueChange={(value: 'month' | 'week' | 'day') => setViewMode(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Mês</SelectItem>
              <SelectItem value="week">Semana</SelectItem>
              <SelectItem value="day">Dia</SelectItem>
            </SelectContent>
          </Select>
          <Button className="gap-2" onClick={handleNewActivity}>
            <Plus className="h-4 w-4" />
            Nova Atividade
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{getViewModeTitle()}</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={navigatePrevious}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={goToToday} className="gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Hoje
                </Button>
                <Button variant="outline" size="icon" onClick={navigateNext}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {viewMode === 'day' && (
              <>
                {eventos.map((evento, index) => (
                  <Card
                    key={evento.id}
                    className="hover:shadow-md transition-all animate-slide-up cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => handleViewDetails(evento)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="text-center min-w-[60px]">
                          <div className="text-sm font-medium text-muted-foreground">Horário</div>
                          <div className="text-lg font-bold text-primary">{evento.horario}</div>
                          <div className="text-xs text-muted-foreground">{evento.duracao}</div>
                        </div>
                        <div className="flex-1 border-l border-border pl-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold">{evento.titulo}</h3>
                              <p className="text-sm text-muted-foreground mt-1">Cliente: {evento.cliente}</p>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="outline" className={getTipoColor(evento.tipo)}>
                                {evento.tipo.charAt(0).toUpperCase() + evento.tipo.slice(1)}
                              </Badge>
                              <Badge variant="outline" className={getPriorityColor(evento.prioridade)}>
                                <div className="flex items-center gap-1">
                                  {getPriorityIcon(evento.prioridade)}
                                  <span className="text-xs">
                                    {evento.prioridade.charAt(0).toUpperCase() + evento.prioridade.slice(1)}
                                  </span>
                                </div>
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleViewActivityModal(evento); }}>
                              Ver detalhes
                            </Button>
                            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleReschedule(evento); }}>
                              Reagendar
                            </Button>
                            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleComplete(evento); }}>
                              Concluir
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}

            {viewMode === 'week' && (
              <div className="space-y-4">
                <div className="grid grid-cols-7 gap-2 text-center">
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                    <div key={day} className="text-sm font-medium text-muted-foreground p-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {getWeekDays().map((day, index) => {
                    const isToday = day.toDateString() === new Date().toDateString();
                    const dayEvents = eventos.filter(evento => {
                      // Simple check for demo - in real app would check actual event dates
                      return day.getDate() === 19 && ['visita', 'reuniao', 'ligacao'].includes(evento.tipo);
                    });
                    
                    return (
                      <div
                        key={index}
                        onClick={() => handleDayClick(day)}
                        className={`p-2 border rounded-lg min-h-[100px] hover:bg-gray-50 cursor-pointer ${
                          isToday ? 'border-primary bg-primary/5' : 'border-border bg-background'
                        }`}
                      >
                        <div className={`text-sm font-medium ${isToday ? 'text-primary' : ''}`}>
                          {day.getDate()}
                        </div>
                        <div className="mt-1 space-y-1">
                          {day.getDate() === 19 && (
                            <>
                              <div className="text-xs p-1 bg-primary/10 rounded">14:00 Visita</div>
                              <div className="text-xs p-1 bg-accent/10 rounded">10:00 Reunião</div>
                              <div className="text-xs p-1 bg-warning/10 rounded">16:30 Ligação</div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {viewMode === 'month' && (
              <div className="space-y-4">
                <div className="grid grid-cols-7 gap-2 text-center">
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                    <div key={day} className="text-sm font-medium text-muted-foreground p-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 35 }, (_, i) => {
                    const date = new Date(currentDate);
                    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
                    const dayOfWeek = startOfMonth.getDay();
                    const currentDateNum = i - dayOfWeek + 1;
                    const isCurrentMonth = currentDateNum > 0 && currentDateNum <= new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
                    const isToday = currentDateNum === new Date().getDate() && date.getMonth() === new Date().getMonth();
                    
                    const clickedDate = new Date(date.getFullYear(), date.getMonth(), currentDateNum);
                    
                    return (
                      <div
                        key={i}
                        onClick={() => isCurrentMonth && handleDayClick(clickedDate)}
                        className={`p-2 border rounded-lg min-h-[60px] ${
                          isCurrentMonth ? 'bg-background hover:bg-gray-50 cursor-pointer' : 'bg-muted/30'
                        } ${isToday ? 'border-primary' : 'border-border'}`}
                      >
                        <div className={`text-sm font-medium ${isToday ? 'text-primary' : ''}`}>
                          {isCurrentMonth ? currentDateNum : ''}
                        </div>
                        {currentDateNum === 19 && (
                          <div className="mt-1">
                            <div className="w-2 h-2 bg-primary rounded-full mx-auto"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximos Eventos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {proximosEventos.map((evento, index) => (
              <Card
                key={evento.id}
                className="hover:shadow-md transition-all cursor-pointer animate-slide-in"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => {
                  // Navigate to lead activity details
                  const client = clientes.find(c => c.name === evento.cliente);
                  if (client) {
                    navigate(`/leads/${client.id}?activity=${evento.id}`);
                  }
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-medium">{evento.titulo}</div>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <CalendarIcon className="h-3 w-3" />
                        {evento.data} - {evento.horario}
                      </div>
                    </div>
                    <Badge variant="outline" className={getTipoColor(evento.tipo)}>
                      {evento.tipo.charAt(0).toUpperCase() + evento.tipo.slice(1)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Modal Ver Detalhes */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes da Atividade</DialogTitle>
          </DialogHeader>
          {selectedEvento && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Título</Label>
                <p className="font-semibold">{selectedEvento.titulo}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Cliente</Label>
                <p>{selectedEvento.cliente}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Horário</Label>
                  <p>{selectedEvento.horario}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Duração</Label>
                  <p>{selectedEvento.duracao}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Tipo</Label>
                <Badge variant="outline" className={getTipoColor(selectedEvento.tipo)}>
                  {selectedEvento.tipo.charAt(0).toUpperCase() + selectedEvento.tipo.slice(1)}
                </Badge>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowDetailsModal(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Reagendar */}
      <Dialog open={showRescheduleModal} onOpenChange={setShowRescheduleModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reagendar Atividade</DialogTitle>
          </DialogHeader>
          {selectedEvento && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Atividade</Label>
                <p className="font-semibold">{selectedEvento.titulo}</p>
              </div>
              <div>
                <Label htmlFor="reschedule-date">Nova Data</Label>
                <Input
                  id="reschedule-date"
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="reschedule-time">Novo Horário</Label>
                <Input
                  id="reschedule-time"
                  type="time"
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRescheduleModal(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmReschedule}>
              Confirmar Reagendamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Concluir */}
      <Dialog open={showCompleteModal} onOpenChange={setShowCompleteModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Concluir Atividade</DialogTitle>
          </DialogHeader>
          {selectedEvento && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Atividade</Label>
                <p className="font-semibold">{selectedEvento.titulo}</p>
              </div>
              <div>
                <Label htmlFor="completion-note">Nota sobre a atividade</Label>
                <Textarea
                  id="completion-note"
                  placeholder="Descreva como foi a atividade..."
                  value={completionNote}
                  onChange={(e) => setCompletionNote(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Avaliação da atividade</Label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      value="nao-avaliada"
                      checked={activityRating === 'nao-avaliada'}
                      onChange={(e) => setActivityRating(e.target.value as 'boa' | 'ruim' | 'nao-avaliada')}
                      className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                    />
                    <span className="ml-2 text-sm">Não avaliada</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      value="boa"
                      checked={activityRating === 'boa'}
                      onChange={(e) => setActivityRating(e.target.value as 'boa' | 'ruim' | 'nao-avaliada')}
                      className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                    />
                    <span className="ml-2 text-sm">Boa</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      value="ruim"
                      checked={activityRating === 'ruim'}
                      onChange={(e) => setActivityRating(e.target.value as 'boa' | 'ruim' | 'nao-avaliada')}
                      className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                    />
                    <span className="ml-2 text-sm">Ruim</span>
                  </label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCompleteModal(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmComplete}>
              Concluir Atividade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Nova Atividade */}
      <Dialog open={showNewActivityModal} onOpenChange={setShowNewActivityModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Atividade</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="activity-title">Título da Atividade</Label>
              <Input
                id="activity-title"
                placeholder="Ex: Visita - Apt 302"
                value={newActivity.titulo}
                onChange={(e) => setNewActivity({...newActivity, titulo: e.target.value})}
              />
            </div>
            <div>
              <Label>Cliente</Label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={clientSelectionMode === 'existing' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setClientSelectionMode('existing')}
                  >
                    Cliente Existente
                  </Button>
                  <Button
                    type="button"
                    variant={clientSelectionMode === 'new' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setClientSelectionMode('new')}
                  >
                    Novo Cliente
                  </Button>
                </div>
                
                {clientSelectionMode === 'existing' ? (
                  <Select 
                    value={newActivity.clienteId} 
                    onValueChange={(value) => {
                      const cliente = clientes.find(c => c.id === value);
                      setNewActivity({
                        ...newActivity, 
                        clienteId: value,
                        clienteNome: cliente ? cliente.name : ''
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cliente..." />
                    </SelectTrigger>
                    <SelectContent>
                      {clientes.map((cliente) => (
                        <SelectItem key={cliente.id} value={cliente.id}>
                          {cliente.name} - {cliente.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="space-y-2">
                    <Input
                      placeholder="Nome do novo cliente"
                      value={newActivity.clienteNome}
                      onChange={(e) => setNewActivity({...newActivity, clienteNome: e.target.value})}
                    />
                    <Input
                      placeholder="Email do cliente"
                      value={newActivity.clienteId} // Using clienteId temporarily for email
                      onChange={(e) => setNewActivity({...newActivity, clienteId: e.target.value})}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="activity-date">Data</Label>
                <Input
                  id="activity-date"
                  type="date"
                  value={newActivity.data}
                  onChange={(e) => setNewActivity({...newActivity, data: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="activity-time">Horário</Label>
                <Input
                  id="activity-time"
                  type="time"
                  value={newActivity.horario}
                  onChange={(e) => setNewActivity({...newActivity, horario: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="activity-duration">Duração</Label>
                <Input
                  id="activity-duration"
                  placeholder="Ex: 1h, 30min"
                  value={newActivity.duracao}
                  onChange={(e) => setNewActivity({...newActivity, duracao: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="activity-type">Tipo</Label>
                <Select value={newActivity.tipo} onValueChange={(value) => setNewActivity({...newActivity, tipo: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visita">Visita</SelectItem>
                    <SelectItem value="reuniao">Reunião</SelectItem>
                    <SelectItem value="ligacao">Ligação</SelectItem>
                    <SelectItem value="vistoria">Vistoria</SelectItem>
                    <SelectItem value="apresentacao">Apresentação</SelectItem>
                    <SelectItem value="contrato">Contrato</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="activity-priority">Prioridade</Label>
              <Select value={newActivity.prioridade} onValueChange={(value: 'baixa' | 'media' | 'alta') => setNewActivity({...newActivity, prioridade: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="activity-description">Descrição</Label>
              <Textarea
                id="activity-description"
                placeholder="Descrição detalhada da atividade..."
                value={newActivity.descricao}
                onChange={(e) => setNewActivity({...newActivity, descricao: e.target.value})}
                className="min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewActivityModal(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmNewActivity}>
              Criar Atividade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
