import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import {
  Search, Filter, Plus, Clock, AlertCircle, Wrench, Thermometer,
  Droplets, Zap, MessageSquare, Paperclip, Send, CheckCircle2, User, Home, Images
} from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PageHeader } from '@/components/layout/PageHeader';

// Tipagem e Mocks
type Prioridade = 'Baixa' | 'Média' | 'Alta' | 'Urgente';
type Categoria = 'Elétrica' | 'Hidráulica' | 'Infraestrutura' | 'Eletrodomésticos' | 'Geral';

interface Solicitacao {
  id: string;
  imovel: string;
  inquilino: string;
  titulo: string;
  descricao: string;
  categoria: Categoria;
  prioridade: Prioridade;
  slaHoras: number;
  horasPassadas: number;
  data: string;
  prestador?: { nome: string; especialidade: string };
  status: 'Novo' | 'Atribuído' | 'Em Andamento' | 'Resolvido';
  custoEstimado?: number;
}

const solicitacoesMock: Solicitacao[] = [
  { id: 'OS-1042', imovel: 'Apto 302 - Centro', inquilino: 'João Silva', titulo: 'Curto Circuito Chuveiro', descricao: 'O disjuntor desarma sempre que ligo o chuveiro no quente.', categoria: 'Elétrica', prioridade: 'Alta', slaHoras: 24, horasPassadas: 18, data: 'Hoje, 08:30', status: 'Novo', custoEstimado: 250 },
  { id: 'OS-1043', imovel: 'Casa 5 - Cond. Ipê', inquilino: 'Maria Alves', titulo: 'Infiltração Teto Banheiro', descricao: 'Mancha amarela crescendo no gesso.', categoria: 'Infraestrutura', prioridade: 'Média', slaHoras: 72, horasPassadas: 12, data: 'Ontem', status: 'Novo', custoEstimado: 850 },
  { id: 'OS-1039', imovel: 'Cobertura 10 - Jardins', inquilino: 'Carlos Souza', titulo: 'Vazamento Pia Cozinha', descricao: 'Sifão quebrado, vazando muita água.', categoria: 'Hidráulica', prioridade: 'Urgente', slaHoras: 12, horasPassadas: 8, data: 'Hoje, 10:15', prestador: { nome: 'José Encanador', especialidade: 'Hidráulica' }, status: 'Atribuído', custoEstimado: 120 },
  { id: 'OS-1035', imovel: 'Conjunto 401 Comercial', inquilino: 'Empresa XYZ', titulo: 'Ar Condicionado Não Gela', descricao: 'Máquina liga, mas não sai ar frio.', categoria: 'Eletrodomésticos', prioridade: 'Média', slaHoras: 72, horasPassadas: 48, data: 'Há 2 dias', prestador: { nome: 'ClimaTec', especialidade: 'Refrigeração' }, status: 'Em Andamento', custoEstimado: 400 },
  { id: 'OS-1020', imovel: 'Apto 101 - Bela Vista', inquilino: 'Fernanda Lima', titulo: 'Fechadura Emperrando', descricao: 'Chave não gira direito.', categoria: 'Geral', prioridade: 'Baixa', slaHoras: 120, horasPassadas: 110, data: 'Na semana passada', prestador: { nome: 'Chaveiro Rápido', especialidade: 'Geral' }, status: 'Resolvido', custoEstimado: 80 },
];

export function GestaoSolicitacoes() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>(solicitacoesMock);
  const [searchTerm, setSearchTerm] = useState('');
  const [colunas] = useState(['Novo', 'Atribuído', 'Em Andamento', 'Resolvido']);
  const [modalAberto, setModalAberto] = useState<Solicitacao | null>(null);

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    setSolicitacoes(prev => {
      const newSolicitacoes = Array.from(prev);
      const index = newSolicitacoes.findIndex(s => s.id === draggableId);
      if (index !== -1) {
        newSolicitacoes[index] = { ...newSolicitacoes[index], status: destination.droppableId as any };
      }
      return newSolicitacoes;
    });
  };

  const getUrgencyColor = (horasTotais: number, horasPassadas: number) => {
    const percent = (horasPassadas / horasTotais) * 100;
    if (percent >= 90) return 'text-rose-600';
    if (percent >= 70) return 'text-amber-500';
    return 'text-emerald-500';
  };

  const getProgressColor = (horasTotais: number, horasPassadas: number) => {
    const percent = (horasPassadas / horasTotais) * 100;
    if (percent >= 90) return '[&>div]:bg-rose-500';
    if (percent >= 70) return '[&>div]:bg-amber-500';
    return '[&>div]:bg-emerald-500';
  };

  const getCategoriaIcon = (categoria: Categoria) => {
    switch (categoria) {
      case 'Elétrica': return <Zap className="h-3 w-3" />;
      case 'Hidráulica': return <Droplets className="h-3 w-3" />;
      case 'Infraestrutura': return <Home className="h-3 w-3" />;
      case 'Eletrodomésticos': return <Thermometer className="h-3 w-3" />;
      default: return <Wrench className="h-3 w-3" />;
    }
  };

  const getPrioridadeBadge = (prioridade: Prioridade) => {
    switch (prioridade) {
      case 'Urgente': return <Badge className="bg-rose-100 text-rose-800 border-rose-200">Urgente</Badge>;
      case 'Alta': return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Alta</Badge>;
      case 'Média': return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Média</Badge>;
      case 'Baixa': return <Badge className="bg-slate-100 text-slate-800 border-slate-200">Baixa</Badge>;
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="max-w-[1600px] mx-auto w-full px-6 pt-4">
        <PageHeader
          title="Manutenção e Chamados"
          subtitle="Gestão de incidentes, prestadores e acompanhamento de SLA"
          icon={<Wrench />}
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Solicitações de Manutenção' }
          ]}
          actions={
            <div className="flex items-center gap-3">
              <div className="relative md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar OS, imóvel..." className="pl-9 bg-background border-border h-10 rounded-xl" />
              </div>
              <Button variant="outline" className="h-10 px-4 rounded-xl font-semibold border-border hover:bg-muted/60 transition-all">
                <Filter className="h-4 w-4 mr-2" /> Filtros
              </Button>
              <Button className="h-10 px-4 rounded-xl font-semibold gap-2 shadow-md shadow-primary/20">
                <Plus className="h-4 w-4 mr-2" /> Novo Ticket
              </Button>
            </div>
          }
        />
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="max-w-[1600px] mx-auto w-full flex-1 flex gap-6 overflow-x-auto p-6 pb-4">
          {colunas.map((colunaLabel) => {
            const itensColuna = solicitacoes.filter(s => s.status === colunaLabel);

            return (
              <Droppable key={colunaLabel} droppableId={colunaLabel}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-w-[320px] max-w-[350px] w-full flex flex-col rounded-2xl border border-border/60 overflow-hidden transition-colors ${snapshot.isDraggingOver ? 'bg-primary/5 border-primary/30' : 'bg-muted/30 shadow-sm'}`}
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-card/40 backdrop-blur-sm">
                      <h3 className="font-semibold text-sm text-foreground">{colunaLabel}</h3>
                      <span className="flex size-6 items-center justify-center rounded-full bg-background border border-border text-[11px] font-mono font-semibold text-muted-foreground shadow-sm">{itensColuna.length}</span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar p-4 min-h-[150px]">
                      {itensColuna.map((ticket, index) => (
                        <Draggable key={ticket.id} draggableId={ticket.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                opacity: snapshot.isDragging ? 0.9 : 1
                              }}
                            >
                              <Card
                                className={`border-none shadow-sm cursor-pointer transition-all group rounded-2xl overflow-hidden ${
                                  snapshot.isDragging ? 'ring-2 ring-primary/40 shadow-xl scale-[1.02]' : 'hover:ring-2 hover:ring-primary/30 hover:shadow-md'
                                }`}
                                onClick={() => setModalAberto(ticket)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] font-black font-mono text-muted-foreground tracking-wider bg-muted/60 px-2 py-0.5 rounded-md border border-border/40">{ticket.id}</span>
                                    {getPrioridadeBadge(ticket.prioridade)}
                                  </div>

                                  <h4 className="font-semibold text-foreground leading-tight mb-2 group-hover:text-primary transition-colors">{ticket.titulo}</h4>
                                  <p className="text-xs text-muted-foreground font-medium mb-3 flex items-center gap-1.5"><Home className="h-3 w-3 text-muted-foreground/70" /> {ticket.imovel}</p>

                      {/* SLA / Tempo */}
                      {ticket.status !== 'Resolvido' && (
                        <div className="mb-3 space-y-1.5 bg-muted/50 p-3 rounded-xl border border-border/40">
                          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider">
                            <span className="text-slate-400">SLA: {ticket.slaHoras}h</span>
                            <span className={getUrgencyColor(ticket.slaHoras, ticket.horasPassadas)}>
                              Restam {ticket.slaHoras - ticket.horasPassadas}h
                            </span>
                          </div>
                          <Progress value={(ticket.horasPassadas / ticket.slaHoras) * 100} className={`h-1.5 bg-slate-200 ${getProgressColor(ticket.slaHoras, ticket.horasPassadas)}`} />
                        </div>
                      )}

                      <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-1">
                        <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {getCategoriaIcon(ticket.categoria)}
                          <span className="ml-1">{ticket.categoria}</span>
                        </div>

                        {ticket.prestador ? (
                          <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
                            <span className="text-[10px] font-bold text-slate-600">{ticket.prestador.nome.split(' ')[0]}</span>
                            <Avatar className="h-5 w-5 border border-white shadow-sm"><AvatarFallback className="text-[8px] bg-indigo-100 text-indigo-700 font-bold">{ticket.prestador.nome.substring(0, 2)}</AvatarFallback></Avatar>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-bold flex items-center uppercase tracking-wider"><Clock className="h-3 w-3 mr-1" /> {ticket.data}</span>
                        )}
                      </div>
                    </CardContent>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                      {/* Empty state per column */}
                      {itensColuna.length === 0 && (
                        <div className="h-24 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 text-sm font-bold bg-white/30">
                          Nenhum chamado
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>

      {/* TICKET MODAL (Rich Ticket) */}
      <Dialog open={!!modalAberto} onOpenChange={() => setModalAberto(null)}>
        {modalAberto && (
          <DialogContent className="sm:max-w-[900px] w-[95vw] h-[90vh] lg:h-[85vh] p-0 flex flex-col overflow-hidden bg-slate-50 rounded-3xl shadow-2xl">
            {/* Header da Modal */}
            <div className="bg-white px-4 md:px-6 py-4 md:py-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-start justify-between gap-4 shrink-0">
              <div>
                <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                  <Badge variant="outline" className="text-slate-500 font-mono tracking-wider bg-slate-50">{modalAberto.id}</Badge>
                  {getPrioridadeBadge(modalAberto.prioridade)}
                  <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-none font-bold uppercase text-[10px] tracking-widest px-3">{modalAberto.status}</Badge>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">{modalAberto.titulo}</h2>
              </div>
              <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <Button variant="outline" size="sm" className="h-10 px-4 flex-1 sm:flex-none rounded-xl font-bold text-slate-600 border-slate-200 hover:bg-slate-50 transition-all">Editar</Button>
                {modalAberto.status !== 'Resolvido' && (
                  <Button size="sm" className="h-10 px-4 flex-1 sm:flex-none rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-200 transition-all">
                    <CheckCircle2 className="h-4 w-4 md:mr-2" /> <span className="hidden md:inline">Resolver Chamado</span><span className="md:hidden">Resolver</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Corpo (Duas colunas) */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">

              {/* Esquerda: Detalhes do chamado */}
              <div className="w-full lg:w-1/2 lg:overflow-y-auto p-4 md:p-6 space-y-6 border-b lg:border-b-0 lg:border-r border-slate-200 custom-scrollbar shrink-0">

                {/* Info Card */}
                <Card className="shadow-sm border-none rounded-2xl overflow-hidden">
                  <CardContent className="p-4 md:p-5 space-y-4 bg-white">
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center shrink-0 border border-slate-100 shadow-inner">
                        <Home className="h-5 w-5 md:h-6 md:w-6" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 truncate">{modalAberto.imovel}</p>
                        <p className="text-sm text-slate-500 font-medium">Inquilino: {modalAberto.inquilino}</p>
                      </div>
                    </div>
                    <div className="p-3 md:p-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-start gap-3 text-sm shadow-sm shadow-rose-100/50">
                      <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-rose-800">SLA Crítico (Total: {modalAberto.slaHoras}h)</p>
                        <p className="text-rose-700 font-medium mt-0.5">Restam apenas {modalAberto.slaHoras - modalAberto.horasPassadas} horas para o vencimento do prazo contratual.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Descrição e Fotos */}
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Descrição do Problema</h3>
                  <div className="p-4 md:p-5 bg-white rounded-2xl border border-slate-200 text-sm text-slate-600 shadow-sm leading-relaxed font-medium">
                    {modalAberto.descricao}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                    <Images className="h-3 w-3" /> Anexos do Inquilino
                  </h3>
                  <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 custom-scrollbar">
                    <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 bg-slate-100 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-all border border-slate-200 shadow-inner group">
                      <Images className="h-6 w-6 md:h-8 md:w-8 text-slate-300 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 bg-slate-100 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-all border border-slate-200 shadow-inner group">
                      <Images className="h-6 w-6 md:h-8 md:w-8 text-slate-300 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 bg-white border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all cursor-pointer">
                      <Plus className="h-5 w-5 md:h-6 md:w-6 mb-1" />
                      <span className="text-[8px] font-black uppercase tracking-widest">Anexar</span>
                    </div>
                  </div>
                </div>

                {/* Prestador */}
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Prestador Atribuído</h3>
                  {modalAberto.prestador ? (
                    <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all hover:border-indigo-200">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 border border-slate-100 shadow-sm shrink-0">
                          <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">{modalAberto.prestador.nome.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 truncate">{modalAberto.prestador.nome}</p>
                          <p className="text-xs text-slate-500 font-medium truncate">{modalAberto.prestador.especialidade} • WhatsApp: (11) 9999-9999</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-xl font-bold h-9 w-full sm:w-auto">Trocar</Button>
                    </div>
                  ) : (
                    <div className="p-4 md:p-6 bg-white rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center shadow-inner mt-2">
                      <div className="h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-3 border border-slate-100">
                        <User className="h-5 w-5 md:h-6 md:w-6 text-slate-300" />
                      </div>
                      <p className="text-sm font-bold text-slate-700">Nenhum prestador acionado</p>
                      <p className="text-xs text-slate-400 font-medium mt-1">Selecione um profissional para resolver o chamado.</p>
                      <Button variant="outline" className="mt-4 rounded-xl font-bold bg-indigo-50 border-indigo-100 text-indigo-600 hover:bg-indigo-100 transition-all" size="sm">
                        <Plus className="h-4 w-4 mr-2" /> Acionar Prestador
                      </Button>
                    </div>
                  )}
                </div>

              </div>

              {/* Direita: Chat / Histórico */}
              <div className="w-full lg:w-1/2 flex flex-col bg-white/50 relative shrink-0 min-h-[400px] lg:min-h-0 lg:overflow-hidden">
                <div className="p-4 py-5 font-black text-slate-800 border-b border-slate-200 bg-white shadow-sm z-10 text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 shrink-0">
                  <MessageSquare className="h-4 w-4 text-indigo-500" /> Histórico de Comunicação
                </div>

                {/* Área de mensagens */}
                <div className="flex-1 lg:overflow-y-auto p-4 space-y-6 custom-scrollbar bg-slate-50/30">

                  {/* Msg Sistema */}
                  <div className="flex justify-center">
                    <span className="bg-slate-200 text-slate-500 text-[9px] uppercase font-black tracking-widest px-4 py-1.5 rounded-full shadow-sm">Ontem</span>
                  </div>

                  {/* Inquilino */}
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8 md:h-9 md:w-9 mt-1 border border-slate-100 shadow-sm shrink-0"><AvatarImage src="https://i.pravatar.cc/100?img=1" /><AvatarFallback className="font-bold">IN</AvatarFallback></Avatar>
                    <div className="bg-white p-3 md:p-4 rounded-2xl rounded-tl-sm shadow-lg shadow-slate-200/50 border border-slate-100 text-sm text-slate-700 max-w-[85%] md:max-w-[85%] leading-relaxed">
                      <p className="font-black text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">{modalAberto.inquilino}</p>
                      Oi, abri o chamado porque de repente a chave não quis virar de jeito nenhum na fechadura da porta principal.
                      <p className="text-[10px] font-bold text-slate-300 mt-2 text-right">09:12</p>
                    </div>
                  </div>

                  {/* Agência */}
                  <div className="flex gap-3 justify-end">
                    <div className="bg-indigo-600 p-3 md:p-4 rounded-2xl rounded-tr-sm shadow-xl shadow-indigo-100 text-sm text-white max-w-[85%] leading-relaxed">
                      <p className="font-black text-[10px] text-indigo-200 uppercase tracking-wider mb-1.5">Você (Agência)</p>
                      Olá {modalAberto.inquilino.split(' ')[0]}, já recebemos a notificação. Estamos acionando o chaveiro parceiro para ir aí ainda hoje na parte da tarde entre 14h e 16h. Tudo bem?
                      <p className="text-[10px] font-bold text-indigo-300/60 mt-2 text-right">09:15</p>
                    </div>
                  </div>

                  {/* Sistema Update */}
                  <div className="flex justify-center my-4">
                    <span className="bg-white border border-indigo-100 text-indigo-600 text-[9px] md:text-[10px] font-bold px-3 md:px-4 py-2 rounded-2xl flex items-center justify-center text-center gap-1.5 shadow-sm mx-4">
                      <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4 shrink-0 text-emerald-500" /> <span className="truncate whitespace-normal">Prestador <strong className="font-black px-1">Chaveiro Rápido</strong> foi atribuído.</span>
                    </span>
                  </div>

                </div>

                {/* Input Area */}
                <div className="p-4 md:p-6 bg-white border-t border-slate-200 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
                  <div className="relative">
                    <Textarea
                      placeholder="Mande uma mensagem..."
                      className="resize-none pr-14 text-sm bg-slate-50 border-slate-200 h-20 md:h-24 rounded-2xl focus:ring-indigo-100 focus:border-indigo-300 transition-all font-medium py-3 md:py-4 px-4 md:px-5"
                    />
                    <div className="absolute right-2 md:right-3 bottom-2 md:bottom-3 flex gap-1.5 md:gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10 text-slate-400 hover:text-indigo-600 rounded-xl hover:bg-slate-100 transition-all"><Paperclip className="h-4 w-4 md:h-5 md:w-5" /></Button>
                      <Button size="icon" className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"><Send className="h-4 w-4 md:h-5 md:w-5" /></Button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
