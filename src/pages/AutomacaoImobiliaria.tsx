import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Bot, Zap, Settings, Play, Edit, Trash2, MoreVertical, Plus,
  Search, Filter, Clock, Calendar, Mail, MessageSquare, Phone,
  FileText, Users, CheckCircle, Activity, Globe, Link as LinkIcon, Download, RefreshCw, X, ArrowRight, CornerDownRight, Home, AlertCircle
} from 'lucide-react';

// Types
type NodeType = 'trigger' | 'action' | 'condition';

interface FlowNode {
  id: string;
  type: NodeType;
  title: string;
  description: string;
  icon: React.FC<any>;
  color: string;
  config?: any;
}

export function AutomacaoImobiliaria() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('automacoes');

  // Builder State
  const [viewMode, setViewMode] = useState<'dashboard' | 'builder'>('dashboard');
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  // Mocked Flow Nodes (The requested example)
  const [flowNodes, setFlowNodes] = useState<FlowNode[]>([
    {
      id: 'node-1',
      type: 'trigger',
      title: 'Novo lead no funil de vendas',
      description: 'Gatilho: Quando um contato entra na etapa "Novo Lead"',
      icon: Users,
      color: 'text-indigo-600 bg-indigo-100',
      config: { funnelStage: 'Novo Lead', origin: 'Todas' }
    },
    {
      id: 'node-2',
      type: 'action',
      title: 'Mandar mensagem via chat',
      description: 'Ação: Envia saudação via WhatsApp/Chat',
      icon: MessageSquare,
      color: 'text-emerald-600 bg-emerald-100',
      config: { message: 'Olá! Tudo bem? Vi que você se interessou pelos nossos imóveis. O que você está buscando?' }
    },
    {
      id: 'node-3',
      type: 'condition',
      title: 'Aguardar primeira resposta',
      description: 'Condição: Espera até o lead responder sobre os imóveis',
      icon: Clock,
      color: 'text-amber-600 bg-amber-100',
      config: { timeoutHours: 24 }
    },
    {
      id: 'node-4',
      type: 'action',
      title: 'Encaminhar imóveis do perfil',
      description: 'Ação: esi.chat analisa a resposta e envia 3 imóveis compatíveis',
      icon: Home,
      color: 'text-blue-600 bg-blue-100',
      config: { limit: 3, includeSimilar: true }
    }
  ]);

  const activeNode = flowNodes.find(n => n.id === activeNodeId);

  // Stats
  const stats = [
    { title: 'Automações Ativas', value: '12', subtitle: '3 executadas hoje', icon: Bot, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Taxa de Sucesso', value: '94.5%', subtitle: '+2.3% vs semana anterior', icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Tempo Economizado', value: '24h', subtitle: 'Neste mês', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Integrações', value: '8', subtitle: 'Todas operacionais', icon: LinkIcon, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  const handleAddNewNode = () => {
    const newNode: FlowNode = {
      id: `node-${Date.now()}`,
      type: 'action',
      title: 'Nova Ação',
      description: 'Configure esta nova ação no painel lateral',
      icon: Zap,
      color: 'text-slate-600 bg-slate-100',
    };
    setFlowNodes([...flowNodes, newNode]);
    setActiveNodeId(newNode.id);
  };

  if (viewMode === 'builder') {
    return (
      <div className="h-[calc(100vh-4rem)] flex flex-col bg-slate-50 relative overflow-hidden">
        {/* Builder Header */}
        <div className="h-16 px-6 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setViewMode('dashboard')}>
              <X className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-lg text-slate-800">Boas-vindas Especialista</h2>
                <Badge variant="outline" className="border-emerald-200 text-emerald-600 bg-emerald-50">Ativo</Badge>
              </div>
              <p className="text-xs text-slate-500 font-medium">Última edição há 5 minutos</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-10 px-4 rounded-xl font-bold border-slate-200 text-slate-700">Testar Fluxo</Button>
            <Button className="h-10 px-4 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100 transition-all">Publicar Alterações</Button>
          </div>
        </div>

        {/* Builder Canvas Area */}
        <div className="flex-1 flex overflow-hidden">

          {/* Canvas (Diagram) */}
          <div className="flex-1 overflow-auto bg-[#f8fafc] relative" style={{ backgroundImage: 'radial-gradient(circle at center, #e2e8f0 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
            <div className="min-h-full flex flex-col items-center py-12 px-4">

              {flowNodes.map((node, index) => (
                <div key={node.id} className="relative flex flex-col items-center group w-full max-w-sm">

                  {/* Connection Line from previous */}
                  {index > 0 && (
                    <div className="w-0.5 h-12 bg-slate-300 relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-slate-300 group-hover:bg-indigo-400 transition-colors" />
                    </div>
                  )}

                  {/* Node Card */}
                  <div
                    onClick={() => setActiveNodeId(node.id)}
                    className={`w-full bg-white rounded-2xl border-2 transition-all cursor-pointer p-4 shadow-sm hover:shadow-md
                      ${activeNodeId === node.id ? 'border-indigo-500 ring-4 ring-indigo-50' : 'border-slate-200 hover:border-indigo-300'}`}
                  >
                    <div className="flex gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${node.color}`}>
                        <node.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{node.type === 'trigger' ? 'Gatilho' : node.type === 'condition' ? 'Condição' : 'Ação'}</p>
                          {node.type === 'trigger' && <Badge variant="secondary" className="bg-slate-100 text-[10px]">Início</Badge>}
                        </div>
                        <h3 className="font-bold text-slate-800 text-base truncate">{node.title}</h3>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{node.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Add Next Step Button (Only visible on hover of the space between nodes or at the end) */}
                  <div className={`relative w-full flex justify-center ${index === flowNodes.length - 1 ? 'mt-6' : 'my-2 opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-8 z-10'}`}>
                    <Button
                      variant="outline"
                      onClick={handleAddNewNode}
                      className="bg-white rounded-full h-8 w-8 p-0 border-dashed border-2 border-slate-300 hover:border-indigo-500 hover:text-indigo-600 text-slate-400"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <div className="h-24" /> {/* Bottom padding */}
            </div>
          </div>

          {/* Right Sidebar (Settings) */}
          <div className={`w-96 bg-white border-l border-slate-200 flex flex-col transition-all duration-300 ${activeNodeId ? 'translate-x-0' : 'translate-x-full absolute right-0 h-full'}`}>
            {activeNode ? (
              <>
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 shrink-0">
                  <h3 className="font-bold text-slate-800">Configurar Passo</h3>
                  <Button variant="ghost" size="icon" onClick={() => setActiveNodeId(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Node Header */}
                  <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${activeNode.color}`}>
                      <activeNode.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-1 text-[10px] uppercase font-bold text-slate-500">{activeNode.type}</Badge>
                      <h4 className="font-bold tracking-tight text-slate-800 leading-tight">{activeNode.title}</h4>
                    </div>
                  </div>

                  {/* Dynamic Form based on Type */}
                  {activeNode.type === 'trigger' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Estágio do Funil</Label>
                        <Select defaultValue="novo-lead">
                          <SelectTrigger className="bg-slate-50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="novo-lead">Novo Lead</SelectItem>
                            <SelectItem value="contato">Contato Realizado</SelectItem>
                            <SelectItem value="visita">Visita Agendada</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Origem do Lead</Label>
                        <Select defaultValue="todas">
                          <SelectTrigger className="bg-slate-50"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todas">Todas as origens</SelectItem>
                            <SelectItem value="site">Site esi</SelectItem>
                            <SelectItem value="zap">Zap Imóveis</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {activeNode.type === 'action' && activeNode.icon === MessageSquare && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Canal de Envio</Label>
                        <Select defaultValue="whatsapp">
                          <SelectTrigger className="bg-slate-50"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="whatsapp">WhatsApp Oficial</SelectItem>
                            <SelectItem value="email">E-mail</SelectItem>
                            <SelectItem value="sms">SMS</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label>Mensagem</Label>
                          <span className="text-xs text-indigo-600 font-bold cursor-pointer">{'{'} Inserir Variável {'}'}</span>
                        </div>
                        <textarea
                          className="w-full h-32 p-3 text-sm rounded-2xl border border-slate-200 bg-slate-50 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-medium"
                          defaultValue={activeNode.config?.message}
                        />
                        <p className="text-xs text-slate-500 font-medium">Dica: Use {'{nome_lead}'} para personalizar a mensagem.</p>
                      </div>
                    </div>
                  )}

                  {activeNode.type === 'action' && activeNode.icon === Home && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Quantidade de Imóveis</Label>
                        <Input type="number" defaultValue="3" className="bg-slate-50 rounded-xl" />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                        <div className="space-y-0.5">
                          <Label className="text-sm font-bold">Filtro Inteligente (esi.chat)</Label>
                          <p className="text-xs text-slate-500 font-medium">Buscar similares baseados na conversa</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  )}

                  {activeNode.type === 'condition' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Aguardar por (Horas)</Label>
                        <Input type="number" defaultValue="24" className="bg-slate-50 rounded-xl" />
                      </div>
                      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3 shadow-sm shadow-amber-100/50">
                        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                        <p className="text-xs text-amber-800 font-bold leading-relaxed">Se o lead não responder dentro deste prazo, o fluxo seguirá pelo caminho "Não Respondeu".</p>
                      </div>
                    </div>
                  )}

                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0 flex gap-3">
                  <Button variant="outline" className="w-full h-11 rounded-xl bg-white text-destructive border-destructive/20 hover:bg-destructive/10 font-bold" onClick={() => {
                    setFlowNodes(flowNodes.filter(n => n.id !== activeNode.id));
                    setActiveNodeId(null);
                  }}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </Button>
                  <Button className="w-full h-11 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-100" onClick={() => setActiveNodeId(null)}>Salvar Passo</Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-6 text-center">
                <div className="flex flex-col items-center text-slate-300">
                  <Settings className="h-12 w-12 mb-4 opacity-50" />
                  <p className="text-sm font-bold">Selecione um bloco no canvas para configurar seus parâmetros.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-[1400px] mx-auto px-6 pt-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="flex items-center gap-1">
                <Home className="h-4 w-4" /> Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Automações</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header Sticky */}
      <div className="bg-white border-b border-slate-200 px-6 py-6 sticky top-0 z-40 backdrop-blur-md bg-white/80 mt-4">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200 shrink-0">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">Automações</h1>
              <p className="text-slate-500 mt-1 font-medium">Construa fluxos inteligentes e deixe o esi trabalhar por você</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-12 px-6 rounded-2xl font-bold bg-white border-slate-200 text-slate-700 shadow-sm hover:bg-slate-50 transition-all">
              <Download className="h-4 w-4 mr-2" /> Relatórios
            </Button>
            <Button
              onClick={() => setViewMode('builder')}
              className="h-12 px-6 rounded-2xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 transition-all"
            >
              <Plus className="h-4 w-4 mr-2" /> Criar Fluxo Visual
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm bg-white overflow-hidden group rounded-2xl">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform shadow-sm`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-800 tracking-tight mb-1">{stat.value}</h3>
                  <p className="text-sm font-bold text-slate-600">{stat.title}</p>
                  <p className="text-xs text-slate-400 font-medium mt-1">{stat.subtitle}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Area */}
        <Card className="border-none shadow-sm bg-white overflow-hidden rounded-2xl">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <div className="px-6 pt-6 border-b border-slate-100">
              <TabsList className="bg-slate-50/50 p-1 border border-slate-100 rounded-xl h-12">
                <TabsTrigger value="automacoes" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 px-6">Meus Fluxos</TabsTrigger>
                <TabsTrigger value="integracoes" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 px-6">Integrações</TabsTrigger>
                <TabsTrigger value="templates" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 px-6">Galeria esi.chat</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="automacoes" className="p-0 m-0">
              {/* Toolbar */}
              <div className="px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50 border-b border-slate-100">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Buscar fluxo..."
                    className="pl-9 h-11 w-full bg-white border-slate-200 focus-visible:ring-indigo-100 rounded-xl font-medium"
                  />
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <Button variant="outline" className="bg-white w-full md:w-auto h-11 rounded-xl font-bold border-slate-200 text-slate-700 hover:bg-white/80"><Filter className="h-4 w-4 mr-2" /> Filtros</Button>
                </div>
              </div>

              {/* List */}
              <div className="divide-y divide-slate-100">
                {[
                  { name: 'Boas-vindas Especialista', trigger: 'Novo Lead', desc: 'Envia WhatsApp + Encaminha 3 imóveis', status: 'Ativo', success: '98%' },
                  { name: 'Lembrete de Visita 24h', trigger: 'Agendamento', desc: 'Envia SMS confirmando endereço', status: 'Ativo', success: '100%' },
                  { name: 'Resgate de Lead Frio', trigger: 'Inatividade > 30d', desc: 'Dispara e-mail marketing com ofertas', status: 'Pausado', success: '-' }
                ].map((item, i) => (
                  <div key={i} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors group">
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border-2 ${item.status === 'Ativo' ? 'bg-indigo-50 border-indigo-100 text-indigo-600 shadow-indigo-50' : 'bg-slate-50 border-slate-200 text-slate-400 shadow-slate-50'}`}>
                        <Zap className="h-7 w-7" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1.5">
                          <h4 className="font-black text-slate-800 text-lg tracking-tight group-hover:text-indigo-600 transition-colors">{item.name}</h4>
                          <Badge variant="outline" className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-lg ${item.status === 'Ativo' ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : 'text-slate-500 border-slate-200 bg-slate-50'}`}>{item.status}</Badge>
                        </div>
                        <p className="text-sm text-slate-500 flex items-center gap-3 font-medium">
                          <span className="font-black text-[10px] text-slate-500 bg-slate-100 px-2 py-1 rounded-md uppercase tracking-wider">{item.trigger}</span>
                          <ArrowRight className="h-3 w-3 text-slate-300" />
                          <span className="truncate max-w-[300px]">{item.desc}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Sucesso</p>
                        <p className={`text-lg font-black ${item.success === '-' ? 'text-slate-300' : 'text-slate-800'}`}>{item.success}</p>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" className="h-11 px-4 rounded-xl font-bold text-slate-600 border-slate-200 hover:text-indigo-600 hover:border-indigo-200 transition-all bg-white" onClick={() => setViewMode('builder')}>
                          <Edit className="h-4 w-4 mr-2" /> Editar Fluxo
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-11 w-11 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-all">
                              <MoreVertical className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52 p-2 rounded-2xl shadow-xl border-slate-100">
                            <DropdownMenuItem className="p-3 cursor-pointer font-bold text-slate-700 rounded-xl focus:bg-indigo-50 focus:text-indigo-600"><Play className="h-4 w-4 mr-3" /> Executar Agora</DropdownMenuItem>
                            <DropdownMenuItem className="p-3 cursor-pointer font-bold text-slate-700 rounded-xl focus:bg-indigo-50 focus:text-indigo-600"><Activity className="h-4 w-4 mr-3" /> Ver Logs de Execução</DropdownMenuItem>
                            <div className="my-1 border-t border-slate-100" />
                            <DropdownMenuItem className="p-3 cursor-pointer font-bold text-destructive rounded-xl focus:bg-destructive/10"><Trash2 className="h-4 w-4 mr-3" /> Excluir Fluxo</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="integracoes" className="p-20 text-center">
              <div className="max-w-md mx-auto space-y-4">
                <div className="h-16 w-16 bg-slate-50 text-slate-300 rounded-3xl flex items-center justify-center mx-auto border-2 border-dashed border-slate-200">
                  <LinkIcon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Novas integrações em breve</h3>
                <p className="text-slate-500 font-medium">Estamos preparando conexões com RD Station, HubSpot e outros CRMs imobiliários.</p>
              </div>
            </TabsContent>

            <TabsContent value="templates" className="p-20 text-center">
              <div className="max-w-md mx-auto space-y-4">
                <div className="h-16 w-16 bg-indigo-50 text-indigo-200 rounded-3xl flex items-center justify-center mx-auto border-2 border-dashed border-indigo-100 shadow-inner">
                  <Bot className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Galeria de IA esi.chat</h3>
                <p className="text-slate-500 font-medium">Templates inteligentes criados por nossa IA para otimizar sua conversão de leads.</p>
              </div>
            </TabsContent>

          </Tabs>
        </Card>

      </div>
    </div>
  );
}
