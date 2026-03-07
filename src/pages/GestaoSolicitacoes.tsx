import { useState } from 'react';
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
}

const solicitacoesMock: Solicitacao[] = [
  { id: 'OS-1042', imovel: 'Apto 302 - Centro', inquilino: 'João Silva', titulo: 'Curto Circuito Chuveiro', descricao: 'O disjuntor desarma sempre que ligo o chuveiro no quente.', categoria: 'Elétrica', prioridade: 'Alta', slaHoras: 24, horasPassadas: 18, data: 'Hoje, 08:30', status: 'Novo' },
  { id: 'OS-1043', imovel: 'Casa 5 - Cond. Ipê', inquilino: 'Maria Alves', titulo: 'Infiltração Teto Banheiro', descricao: 'Mancha amarela crescendo no gesso.', categoria: 'Infraestrutura', prioridade: 'Média', slaHoras: 72, horasPassadas: 12, data: 'Ontem', status: 'Novo' },
  { id: 'OS-1039', imovel: 'Cobertura 10 - Jardins', inquilino: 'Carlos Souza', titulo: 'Vazamento Pia Cozinha', descricao: 'Sifão quebrado, vazando muita água.', categoria: 'Hidráulica', prioridade: 'Urgente', slaHoras: 12, horasPassadas: 8, data: 'Hoje, 10:15', prestador: { nome: 'José Encanador', especialidade: 'Hidráulica' }, status: 'Atribuído' },
  { id: 'OS-1035', imovel: 'Conjunto 401 Comercial', inquilino: 'Empresa XYZ', titulo: 'Ar Condicionado Não Gela', descricao: 'Máquina liga, mas não sai ar frio.', categoria: 'Eletrodomésticos', prioridade: 'Média', slaHoras: 72, horasPassadas: 48, data: 'Há 2 dias', prestador: { nome: 'ClimaTec', especialidade: 'Refrigeração' }, status: 'Em Andamento' },
  { id: 'OS-1020', imovel: 'Apto 101 - Bela Vista', inquilino: 'Fernanda Lima', titulo: 'Fechadura Emperrando', descricao: 'Chave não gira direito.', categoria: 'Geral', prioridade: 'Baixa', slaHoras: 120, horasPassadas: 110, data: 'Na semana passada', prestador: { nome: 'Chaveiro Rápido', especialidade: 'Geral' }, status: 'Resolvido' },
];

export function GestaoSolicitacoes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [colunas] = useState(['Novo', 'Atribuído', 'Em Andamento', 'Resolvido']);
  const [modalAberto, setModalAberto] = useState<Solicitacao | null>(null);

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
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col h-full overflow-hidden">
      <div className="max-w-[1600px] mx-auto w-full flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Breadcrumb className="mb-4 sm:mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="flex items-center gap-1">
                <Home className="h-4 w-4" /> Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Solicitações de Manutenção</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Manutenção e Chamados</h1>
            <p className="text-slate-500 mt-1 font-medium">Gestão de incidentes, prestadores de serviço e acompanhamento de SLA.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Buscar OS, imóvel..." className="pl-9 bg-white" />
            </div>
            <Button variant="outline" className="bg-white"><Filter className="h-4 w-4 mr-2" /> Filtros</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white"><Plus className="h-4 w-4 mr-2" /> Novo Ticket</Button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
          {colunas.map((colunaLabel) => {
            const itensColuna = solicitacoesMock.filter(s => s.status === colunaLabel);

            return (
              <div key={colunaLabel} className="min-w-[320px] max-w-[350px] w-full flex flex-col bg-slate-100/50 rounded-2xl p-4 border border-slate-200">
                <div className="flex items-center justify-between mb-4 px-1">
                  <h3 className="font-bold text-slate-700">{colunaLabel}</h3>
                  <Badge variant="secondary" className="bg-slate-200 text-slate-600 font-bold">{itensColuna.length}</Badge>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
                  {itensColuna.map(ticket => (
                    <Card
                      key={ticket.id}
                      className="border-none shadow-sm cursor-pointer hover:ring-2 hover:ring-indigo-400 hover:shadow-md transition-all group"
                      onClick={() => setModalAberto(ticket)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-bold text-slate-400">{ticket.id}</span>
                          {getPrioridadeBadge(ticket.prioridade)}
                        </div>

                        <h4 className="font-bold text-slate-800 leading-tight mb-1">{ticket.titulo}</h4>
                        <p className="text-xs text-slate-500 font-medium mb-3 flex items-center gap-1.5"><Home className="h-3 w-3" /> {ticket.imovel}</p>

                        {/* SLA / Tempo */}
                        {ticket.status !== 'Resolvido' && (
                          <div className="mb-3 space-y-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                              <span className="text-slate-500">SLA: {ticket.slaHoras}h</span>
                              <span className={getUrgencyColor(ticket.slaHoras, ticket.horasPassadas)}>
                                Falta {ticket.slaHoras - ticket.horasPassadas}h
                              </span>
                            </div>
                            <Progress value={(ticket.horasPassadas / ticket.slaHoras) * 100} className={`h-1.5 bg-slate-200 ${getProgressColor(ticket.slaHoras, ticket.horasPassadas)}`} />
                          </div>
                        )}

                        <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-3">
                          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase">
                            {getCategoriaIcon(ticket.categoria)}
                            <span className="ml-1">{ticket.categoria}</span>
                          </div>

                          {ticket.prestador ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold text-slate-500">{ticket.prestador.nome.split(' ')[0]}</span>
                              <Avatar className="h-5 w-5 border border-white shadow-sm"><AvatarFallback className="text-[8px] bg-indigo-100 text-indigo-700">{ticket.prestador.nome.substring(0, 2)}</AvatarFallback></Avatar>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium flex items-center"><Clock className="h-3 w-3 mr-1" /> {ticket.data}</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Empty state per column */}
                  {itensColuna.length === 0 && (
                    <div className="h-24 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-sm font-medium">
                      Nenhum chamado
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TICKET MODAL (Rich Ticket) */}
      <Dialog open={!!modalAberto} onOpenChange={() => setModalAberto(null)}>
        {modalAberto && (
          <DialogContent className="sm:max-w-[900px] h-[85vh] p-0 flex flex-col overflow-hidden bg-slate-50">
            {/* Header da Modal */}
            <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-start justify-between shrink-0">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <Badge variant="outline" className="text-slate-500 font-mono tracking-wider">{modalAberto.id}</Badge>
                  {getPrioridadeBadge(modalAberto.prioridade)}
                  <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-none">{modalAberto.status}</Badge>
                </div>
                <h2 className="text-2xl font-bold text-slate-800">{modalAberto.titulo}</h2>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="font-semibold text-slate-600">Editar</Button>
                {modalAberto.status !== 'Resolvido' && (
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"><CheckCircle2 className="h-4 w-4 mr-1.5" /> Resolver Chamado</Button>
                )}
              </div>
            </div>

            {/* Corpo (Duas colunas) */}
            <div className="flex-1 flex overflow-hidden">

              {/* Esquerda: Detalhes do chamado */}
              <div className="w-1/2 overflow-y-auto p-6 space-y-6 border-r border-slate-200 custom-scrollbar">

                {/* Info Card */}
                <Card className="shadow-sm border-none">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <Home className="h-5 w-5 text-slate-500" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{modalAberto.imovel}</p>
                        <p className="text-sm text-slate-500">Inquilino: {modalAberto.inquilino}</p>
                      </div>
                    </div>
                    <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 flex items-start gap-3 text-sm">
                      <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-rose-800">SLA Correndo (Prazo: {modalAberto.slaHoras}h)</p>
                        <p className="text-rose-600/80 font-medium">Restam {modalAberto.slaHoras - modalAberto.horasPassadas} horas para o prazo limite do proprietário.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Descrição e Fotos */}
                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-2 uppercase tracking-wider">Descrição do Problema</h3>
                  <div className="p-4 bg-white rounded-xl border border-slate-200 text-sm text-slate-600 shadow-sm">
                    {modalAberto.descricao}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-2 uppercase tracking-wider flex items-center gap-2"><Images className="h-4 w-4 text-slate-400" /> Anexos do Inquilino</h3>
                  <div className="flex gap-2">
                    <div className="w-24 h-24 bg-slate-200 rounded-lg flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
                      <Images className="h-6 w-6 text-slate-400" />
                    </div>
                    <div className="w-24 h-24 bg-slate-200 rounded-lg flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
                      <Images className="h-6 w-6 text-slate-400" />
                    </div>
                  </div>
                </div>

                {/* Prestador */}
                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-2 uppercase tracking-wider">Prestador Atribuído</h3>
                  {modalAberto.prestador ? (
                    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Avatar><AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">{modalAberto.prestador.nome.substring(0, 2)}</AvatarFallback></Avatar>
                        <div>
                          <p className="font-bold text-slate-800">{modalAberto.prestador.nome}</p>
                          <p className="text-xs text-slate-500">{modalAberto.prestador.especialidade} • WhatsApp: (11) 9999-9999</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Trocar</Button>
                    </div>
                  ) : (
                    <div className="p-4 bg-white rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center">
                      <User className="h-8 w-8 text-slate-300 mb-2" />
                      <p className="text-sm font-medium text-slate-600">Nenhum prestador acionado ainda.</p>
                      <Button variant="outline" className="mt-2" size="sm">Acionar Prestador</Button>
                    </div>
                  )}
                </div>

              </div>

              {/* Direita: Chat / Histórico */}
              <div className="w-1/2 flex flex-col bg-slate-100/50 relative">
                <div className="p-4 font-bold text-slate-800 border-b border-slate-200 bg-white shadow-sm z-10 text-sm flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-indigo-500" /> Histórico de Comunicação
                </div>

                {/* Área de mensagens */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">

                  {/* Msg Sistema */}
                  <div className="flex justify-center">
                    <span className="bg-slate-200 text-slate-500 text-[10px] uppercase font-bold px-3 py-1 rounded-full">Ontem</span>
                  </div>

                  {/* Inquilino */}
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8 mt-1"><AvatarImage src="https://i.pravatar.cc/100?img=1" /><AvatarFallback>IN</AvatarFallback></Avatar>
                    <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 text-sm text-slate-700 max-w-[85%]">
                      <p className="font-bold text-xs text-slate-800 mb-0.5">{modalAberto.inquilino}</p>
                      Oi, abri o chamado porque de repente a chave não quis virar de jeito nenhum.
                      <p className="text-[10px] text-slate-400 mt-1 text-right">09:12</p>
                    </div>
                  </div>

                  {/* Agência */}
                  <div className="flex gap-3 justify-end">
                    <div className="bg-indigo-600 p-3 rounded-2xl rounded-tr-sm shadow-sm text-sm text-white max-w-[85%]">
                      <p className="font-bold text-xs text-indigo-200 mb-0.5">Você (Agência)</p>
                      Olá {modalAberto.inquilino.split(' ')[0]}, já recebemos a notificação. Estamos acionando o chaveiro parceiro para ir aí ainda hoje na parte da tarde. Tudo bem?
                      <p className="text-[10px] text-indigo-200 mt-1 text-right">09:15</p>
                    </div>
                  </div>

                  {/* Sistema Update */}
                  <div className="flex justify-center my-4">
                    <span className="bg-indigo-50/80 border border-indigo-100 text-indigo-600 text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <User className="h-3 w-3" /> Prestador "Chaveiro Rápido" foi atribuído ao chamado.
                    </span>
                  </div>

                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-200 shrink-0">
                  <div className="relative">
                    <Textarea
                      placeholder="Mande uma mensagem para inquilino, proprietário ou prestador..."
                      className="resize-none pr-12 text-sm bg-slate-50 min-h-[60px]"
                    />
                    <div className="absolute right-2 bottom-2 flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 rounded-full"><Paperclip className="h-4 w-4" /></Button>
                      <Button size="icon" className="h-8 w-8 rounded-full bg-indigo-600 hover:bg-indigo-700"><Send className="h-4 w-4" /></Button>
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
