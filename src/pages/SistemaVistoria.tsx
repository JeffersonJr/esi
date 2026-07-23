import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Camera, Plus, Search, Filter, Calendar, MapPin, Home, CheckCircle,
  AlertCircle, Clock, FileText, Download, Upload, Eye, Edit, Trash2,
  MoreVertical, Star, Images, Key, ShieldCheck, PenTool, CheckCircle2, ChevronRight,
  FileSignature
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

const vistorias = [
  { id: 'VST-501', imovel: 'Apto 2 Quartos - Centro', endereço: 'Rua das Flores, 123', tipo: 'Entrada', inquilino: 'Maria Alves', vistoriador: 'Pedro Oliveira', data: '20/Jan - 14:00', status: 'Agendado', fotos: 0 },
  { id: 'VST-502', imovel: 'Casa Cond. Ipê', endereço: 'Av Principal, 400', tipo: 'Saída', inquilino: 'João Silva', vistoriador: 'Pedro Oliveira', data: '18/Jan - 10:00', status: 'Em Análise', fotos: 145 },
  { id: 'VST-498', imovel: 'Cobertura Jardins', endereço: 'Rua Augusta, 1000', tipo: 'Entrada', inquilino: 'Ana Souza', vistoriador: 'Larissa Costa', data: '10/Jan', status: 'Concluído', fotos: 210 },
  { id: 'VST-495', imovel: 'Sala Comercial', endereço: 'Av Faria Lima, 3000', tipo: 'Manutenção', inquilino: 'Startup XYZ', vistoriador: 'Larissa Costa', data: '05/Jan', status: 'Aprovado (Assinado)', fotos: 35 }
];

const comodosCompletos = [
  { nome: 'Sala de Estar', status: 'Concluído', problemas: 0 },
  { nome: 'Cozinha', status: 'Com Ressalvas', problemas: 2 },
  { nome: 'Banheiro Social', status: 'Pendente', problemas: 0 },
  { nome: 'Quarto 1 (Suíte)', status: 'Pendente', problemas: 0 },
  { nome: 'Varanda', status: 'Pendente', problemas: 0 }
];

const itensCozinha = [
  { nome: 'Pintura (Paredes/Teto)', condition: 'Bom', obs: 'Pequenos riscos na parede abaixo da janela.' },
  { nome: 'Piso e Rodapés', condition: 'Excelente', obs: '' },
  { nome: 'Armários Embutidos', condition: 'Regular', obs: 'Porta sob a pia está levemente desalinhada.' },
  { nome: 'Pia e Torneira', condition: 'Bom', obs: 'Sem vazamentos. Pressão ok.' },
  { nome: 'Tomadas e Interruptores', condition: 'Ruim', obs: 'Uma tomada 220v sem espelho.' },
];

export function SistemaVistoria() {
  const [vistoriasState, setVistoriasState] = useState(vistorias);
  const [colunas] = useState(['Agendado', 'Em Análise', 'Concluído', 'Aprovado (Assinado)']);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [showVistoriaDetalhe, setShowVistoriaDetalhe] = useState(false);
  const [comodoSelecionado, setComodoSelecionado] = useState('Cozinha');

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    setVistoriasState(prev => {
      const newArr = Array.from(prev);
      const index = newArr.findIndex(v => v.id === draggableId);
      if (index !== -1) {
        newArr[index] = { ...newArr[index], status: destination.droppableId };
      }
      return newArr;
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Agendado': return <Badge className="bg-blue-100 text-blue-800 border-none">Agendado</Badge>;
      case 'Em Análise': return <Badge className="bg-amber-100 text-amber-800 border-none">Gerando Laudo</Badge>;
      case 'Concluído': return <Badge className="bg-emerald-100 text-emerald-800 border-none">Aguardando Assinatura</Badge>;
      case 'Aprovado (Assinado)': return <Badge className="bg-emerald-600 text-white border-none"><CheckCircle2 className="h-3 w-3 mr-1" /> Assinado</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'Entrada': return <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200">Vistoria de Entrada</Badge>;
      case 'Saída': return <Badge className="bg-orange-50 text-orange-700 border-orange-200">Vistoria de Saída</Badge>;
      case 'Manutenção': return <Badge className="bg-slate-100 text-slate-700 border-slate-200">Check de Manutenção</Badge>;
      default: return <Badge>{tipo}</Badge>;
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Excelente': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Bom': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Regular': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Ruim': return 'text-rose-600 bg-rose-50 border-rose-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div>
      <div className="max-w-[1400px] mx-auto">
        <PageHeader
          title="Sistema de Vistoria"
          subtitle="Agendamento, laudos digitais e assinaturas eletrônicas"
          icon={<ShieldCheck />}
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Vistorias' }
          ]}
          actions={
            <div className="flex items-center gap-3">
              <Button
                onClick={() => { }}
                className="h-12 px-6 rounded-2xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 transition-all"
              >
                <Calendar className="h-4 w-4 mr-2" /> Agendar Vistoria
              </Button>
            </div>
          }
        />
      </div>

      <div className="max-w-[1400px] mx-auto py-8">

        {/* Dynamic Navigation Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <Card className="border-none shadow-sm bg-white overflow-hidden mb-6">
            <div className="p-2 border-b border-slate-100">
              <TabsList className="bg-slate-50 border border-slate-100 rounded-xl h-12 w-full justify-start overflow-x-auto">
                <TabsTrigger value="dashboard" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 px-6">Dashboard</TabsTrigger>
                <TabsTrigger value="vistorias" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 px-6">Todas as Vistorias</TabsTrigger>
                <TabsTrigger value="assinaturas" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 px-6">Aguardando Assinatura <Badge variant="secondary" className="ml-2 bg-emerald-50 text-emerald-600">3</Badge></TabsTrigger>
              </TabsList>
            </div>
          </Card>

          {/* DASHBOARD TAB */}
          <TabsContent value="dashboard" className="space-y-6 m-0">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-none shadow-sm">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Calendar className="h-6 w-6" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-black text-slate-800 tracking-tight mb-1">12</h3>
                  <p className="text-sm font-bold text-slate-600">Vistorias Próximas</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">Agendadas para esta semana</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <PenTool className="h-6 w-6" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-black text-slate-800 tracking-tight mb-1">4</h3>
                  <p className="text-sm font-bold text-slate-600">Laudos em Elaboração</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">Por parte dos vistoriadores</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <FileSignature className="h-6 w-6" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-black text-slate-800 tracking-tight mb-1">3</h3>
                  <p className="text-sm font-bold text-slate-600">Pendentes de Assinatura</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">Enviados via DocuSign</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-black text-slate-800 tracking-tight mb-1">98%</h3>
                  <p className="text-sm font-bold text-slate-600">Integridade dos Laudos</p>
                  <p className="text-xs text-indigo-600 font-bold mt-1">Aceites sem contestação</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-none shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-lg">Próximos Agendamentos</h3>
                <Button variant="outline" size="sm" onClick={() => setSelectedTab('vistorias')}>Ver Todas</Button>
              </div>
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-semibold text-slate-600">Imóvel</TableHead>
                    <TableHead className="font-semibold text-slate-600">Tipo</TableHead>
                    <TableHead className="font-semibold text-slate-600">Data / Vistoriador</TableHead>
                    <TableHead className="font-semibold text-slate-600">Status</TableHead>
                    <TableHead className="text-right font-semibold text-slate-600">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vistorias.map((vistoria) => (
                    <TableRow key={vistoria.id} className="hover:bg-slate-50/50">
                      <TableCell>
                        <div className="font-bold text-slate-800">{vistoria.imovel}</div>
                        <div className="text-xs text-slate-500 mt-0.5 max-w-[200px] truncate">{vistoria.endereço}</div>
                      </TableCell>
                      <TableCell>{getTipoBadge(vistoria.tipo)}</TableCell>
                      <TableCell>
                        <div className="font-bold text-slate-700">{vistoria.data}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{vistoria.vistoriador}</div>
                      </TableCell>
                      <TableCell>{getStatusBadge(vistoria.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                          onClick={() => setShowVistoriaDetalhe(true)}
                        >
                          <Eye className="h-4 w-4 mr-2" /> Laudo Digital
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="vistorias" className="m-0 bg-slate-50 rounded-2xl">
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="w-full flex gap-6 overflow-x-auto py-4">
                {colunas.map((colunaLabel) => {
                  const itensColuna = vistoriasState.filter(v => v.status === colunaLabel);

                  return (
                    <Droppable key={colunaLabel} droppableId={colunaLabel}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`min-w-[300px] max-w-[320px] w-full flex flex-col rounded-2xl p-4 border border-slate-200 transition-colors ${
                            snapshot.isDraggingOver ? 'bg-indigo-50/50 border-indigo-200' : 'bg-white shadow-sm'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-4 px-1">
                            <h3 className="font-bold text-slate-700 uppercase tracking-wider text-xs">{colunaLabel}</h3>
                            <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-bold rounded-lg">{itensColuna.length}</Badge>
                          </div>

                          <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1 min-h-[150px]">
                            {itensColuna.map((vistoria, index) => (
                              <Draggable key={vistoria.id} draggableId={vistoria.id} index={index}>
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
                                        snapshot.isDragging ? 'ring-2 ring-indigo-400 shadow-xl scale-[1.02]' : 'hover:ring-2 hover:ring-indigo-400 hover:shadow-md border border-slate-100'
                                      }`}
                                      onClick={() => setShowVistoriaDetalhe(true)}
                                    >
                                      <CardContent className="p-4 bg-slate-50/50">
                                        <div className="flex justify-between items-start mb-2">
                                          <span className="text-[10px] font-black font-mono text-slate-400 tracking-wider bg-white px-2 py-0.5 rounded-md border border-slate-100">{vistoria.id}</span>
                                          {getTipoBadge(vistoria.tipo)}
                                        </div>

                                        <h4 className="font-bold text-slate-800 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">{vistoria.imovel}</h4>
                                        <p className="text-xs text-slate-500 font-medium mb-3 flex items-center gap-1.5"><MapPin className="h-3 w-3 text-slate-400" /> {vistoria.endereço}</p>
                                        
                                        <div className="flex items-center justify-between border-t border-slate-200 pt-3 mt-1">
                                          <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-full border border-slate-100">
                                            <span className="text-[10px] font-bold text-slate-600">{vistoria.vistoriador.split(' ')[0]}</span>
                                          </div>
                                          <span className="text-[10px] text-slate-500 font-bold flex items-center"><Calendar className="h-3 w-3 mr-1" /> {vistoria.data}</span>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}

                            {itensColuna.length === 0 && (
                              <div className="h-24 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 text-sm font-bold bg-slate-50/50">
                                Vazio
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
          </TabsContent>

          <TabsContent value="assinaturas" className="m-0 p-12 text-center text-slate-500 bg-white rounded-2xl border border-dashed border-slate-200">
            Painel de envio de assinaturas eletrônicas e tracking de e-mails virá aqui.
          </TabsContent>
        </Tabs>
      </div>

      {/* MODAL: Laudo Digital de Vistoria (Split View Room by Room) */}
      <Dialog open={showVistoriaDetalhe} onOpenChange={setShowVistoriaDetalhe}>
        <DialogContent className="sm:max-w-screen-xl w-[95vw] h-[90vh] p-0 flex flex-col overflow-hidden bg-slate-50">

          {/* Top Bar */}
          <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Badge variant="outline" className="text-slate-500 font-mono tracking-wider">VST-502</Badge>
                {getTipoBadge('Saída')}
                {getStatusBadge('Em Análise')}
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Laudo de Saída: Casa Cond. Ipê</h2>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="bg-white font-semibold">
                <Download className="h-4 w-4 mr-2" /> Exportar PDF
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm">
                <Key className="h-4 w-4 mr-2" /> Aprovar e Enviar para Assinatura
              </Button>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">

            {/* Sidebar Left: Comodos Overview */}
            <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h3 className="font-bold text-slate-700 uppercase tracking-wider text-xs">Cômodos Inspecionados</h3>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                  {comodosCompletos.map((comodo, idx) => (
                    <button
                      key={idx}
                      onClick={() => setComodoSelecionado(comodo.nome)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${comodoSelecionado === comodo.nome ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 hover:text-slate-800'}`}
                    >
                      <div className="flex items-center gap-3">
                        {comodo.problemas > 0 ? (
                          <AlertCircle className={`h-4 w-4 ${comodoSelecionado === comodo.nome ? 'text-amber-500' : 'text-amber-400'}`} />
                        ) : comodo.status === 'Concluído' ? (
                          <CheckCircle2 className={`h-4 w-4 ${comodoSelecionado === comodo.nome ? 'text-emerald-500' : 'text-emerald-400'}`} />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-slate-300" />
                        )}
                        <span className="font-bold text-sm text-left">{comodo.nome}</span>
                      </div>
                      {comodo.problemas > 0 && (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">{comodo.problemas}</span>
                      )}
                    </button>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Fotos totais:</span>
                <span className="font-bold text-slate-800 text-sm">145 anexos</span>
              </div>
            </div>

            {/* Middle: Itens do Comodo */}
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
              <div className="p-6 pb-2">
                <h2 className="text-xl font-black text-slate-800">{comodoSelecionado}</h2>
                <p className="text-sm text-slate-500 font-medium">Avalie as condições de cada item registrado pelo vistoriador.</p>
              </div>

              <ScrollArea className="flex-1 p-6 pt-4">
                <div className="space-y-4">
                  {itensCozinha.map((item, idx) => (
                    <Card key={idx} className={`border-none shadow-sm transition-all ${item.condition === 'Ruim' ? 'ring-2 ring-rose-200' : ''}`}>
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h4 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                              {item.nome}
                            </h4>
                            {item.obs && (
                              <p className="text-sm text-slate-500 leading-relaxed max-w-[500px] mt-2 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                                "{item.obs}"
                              </p>
                            )}
                          </div>
                          <Badge className={`px-3 py-1 font-bold border ${getConditionColor(item.condition)}`}>
                            {item.condition}
                          </Badge>
                        </div>

                        {/* Gallery Thumbnails inside item */}
                        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                          {Array(item.condition === 'Ruim' ? 3 : 1).fill(null).map((_, i) => (
                            <div key={i} className="group relative w-24 h-24 bg-slate-200 rounded-lg shrink-0 overflow-hidden cursor-pointer">
                              <Images className="absolute inset-0 m-auto h-6 w-6 text-slate-400 group-hover:scale-110 transition-transform" />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                            </div>
                          ))}
                          <div className="w-24 h-24 bg-white border border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center shrink-0 cursor-pointer hover:bg-slate-50 transition-colors">
                            <Plus className="h-5 w-5 text-slate-400 mb-1" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Adicionar</span>
                          </div>
                        </div>

                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Right Sidebar: Resumo & Contestacao (Optional/Contextual) */}
            <div className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0">
              <div className="p-4 border-b border-slate-100 bg-indigo-600">
                <h3 className="font-bold text-white uppercase tracking-wider text-xs">Resumo do Laudo</h3>
              </div>
              <div className="p-6 space-y-6 overflow-y-auto">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Vistoriador Responsável</h4>
                  <div className="flex items-center gap-3">
                    <Avatar><AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">PO</AvatarFallback></Avatar>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">Pedro Oliveira</p>
                      <p className="text-xs text-slate-400">pedro@esi.com.br</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Apontamentos de Dano</h4>
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex gap-3 text-sm">
                    <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-amber-800">Cozinha: Tomadas</p>
                      <p className="text-amber-700/80 text-xs mt-0.5 font-medium">Espelho ausente na tomada 220v. Requer reposição antes do novo contrato.</p>
                    </div>
                  </div>
                  <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 flex gap-3 text-sm">
                    <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-rose-800">Quarto Suíte: Piso</p>
                      <p className="text-rose-700/80 text-xs mt-0.5 font-medium">Lâmina de carpete de madeira estufada por água.</p>
                    </div>
                  </div>
                </div>

              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0">
                <Button variant="outline" className="w-full text-rose-600 border-rose-200 hover:bg-rose-50 font-bold">
                  Sinalizar Contestação
                </Button>
              </div>
            </div>

          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
