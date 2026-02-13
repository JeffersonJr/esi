import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Bot,
  Zap,
  Settings,
  Play,
  Pause,
  Edit,
  Trash2,
  MoreVertical,
  Plus,
  Search,
  Filter,
  Clock,
  Calendar,
  Mail,
  MessageSquare,
  Phone,
  FileText,
  Home,
  Users,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Activity,
  Target,
  Bell,
  Database,
  Globe,
  Smartphone,
  CreditCard,
  Key,
  Lock,
  Unlock,
  RefreshCw,
  Download,
  Upload,
  Link,
  Copy,
  Eye,
  EyeOff,
  Star,
} from 'lucide-react';

interface Automacao {
  id: string;
  nome: string;
  descricao: string;
  gatilho: string;
  acao: string;
  status: 'ativo' | 'inativo' | 'erro';
  frequencia: string;
  ultimaExecucao: string;
  proximaExecucao: string;
  sucesso: number;
  falhas: number;
  categoria: string;
}

interface Integracao {
  id: string;
  nome: string;
  descricao: string;
  status: 'conectado' | 'desconectado' | 'erro';
  tipo: string;
  ultimaSincronizacao: string;
  dadosSincronizados: number;
  apiKey?: string;
  webhookUrl?: string;
}

interface Template {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  popularidade: number;
  dificuldade: 'iniciante' | 'intermediario' | 'avancado';
  icone: React.ReactNode;
}

const automacoes: Automacao[] = [
  {
    id: '1',
    nome: 'Boas-vindas Novos Leads',
    descricao: 'Envia mensagem automática de boas-vindas para novos leads',
    gatilho: 'Novo lead cadastrado',
    acao: 'Enviar e-mail + WhatsApp',
    status: 'ativo',
    frequencia: 'Imediato',
    ultimaExecucao: '15/01/2025 10:30',
    proximaExecucao: 'Aguardando gatilho',
    sucesso: 98,
    falhas: 2,
    categoria: 'CRM',
  },
  {
    id: '2',
    nome: 'Lembretes de Visita',
    descricao: 'Envia lembretes automáticos de visitas agendadas',
    gatilho: 'Visita agendada',
    acao: 'Enviar SMS 24h antes',
    status: 'ativo',
    frequencia: 'Diário',
    ultimaExecucao: '14/01/2025 18:00',
    proximaExecucao: '15/01/2025 18:00',
    sucesso: 95,
    falhas: 5,
    categoria: 'Agenda',
  },
  {
    id: '3',
    nome: 'Atualização de Status',
    descricao: 'Atualiza status de imóveis nos portais automaticamente',
    gatilho: 'Status alterado',
    acao: 'Sincronizar com portais',
    status: 'inativo',
    frequencia: 'A cada 30 minutos',
    ultimaExecucao: '10/01/2025 14:20',
    proximaExecucao: 'Inativo',
    sucesso: 88,
    falhas: 12,
    categoria: 'Marketing',
  },
  {
    id: '4',
    nome: 'Relatório Mensal',
    descricao: 'Gera e envia relatório mensal de performance',
    gatilho: 'Todo dia 1 do mês',
    acao: 'Gerar PDF + Enviar e-mail',
    status: 'ativo',
    frequencia: 'Mensal',
    ultimaExecucao: '01/01/2025 08:00',
    proximaExecucao: '01/02/2025 08:00',
    sucesso: 100,
    falhas: 0,
    categoria: 'Relatórios',
  },
];

const integracoes: Integracao[] = [
  {
    id: '1',
    nome: 'Google Sheets',
    descricao: 'Sincronização de dados com planilhas',
    status: 'conectado',
    tipo: 'API',
    ultimaSincronizacao: '15/01/2025 10:45',
    dadosSincronizados: 1234,
  },
  {
    id: '2',
    nome: 'WhatsApp Business',
    descricao: 'Envio de mensagens automáticas',
    status: 'conectado',
    tipo: 'Webhook',
    ultimaSincronizacao: '15/01/2025 10:30',
    dadosSincronizados: 567,
  },
  {
    id: '3',
    nome: 'Zapier',
    descricao: 'Conexão com milhares de aplicativos',
    status: 'desconectado',
    tipo: 'API',
    ultimaSincronizacao: 'N/A',
    dadosSincronizados: 0,
  },
  {
    id: '4',
    nome: 'Mailchimp',
    descricao: 'Campanhas de e-mail marketing',
    status: 'erro',
    tipo: 'API',
    ultimaSincronizacao: '14/01/2025 09:15',
    dadosSincronizados: 89,
  },
];

const templates: Template[] = [
  {
    id: '1',
    nome: 'Nutrição de Leads',
    descricao: 'Sequência automática de e-mails para leads',
    categoria: 'CRM',
    popularidade: 95,
    dificuldade: 'iniciante',
    icone: <Mail className="h-5 w-5" />,
  },
  {
    id: '2',
    nome: 'Publicação em Redes Sociais',
    descricao: 'Post automático de novos imóveis',
    categoria: 'Marketing',
    popularidade: 88,
    dificuldade: 'intermediario',
    icone: <Globe className="h-5 w-5" />,
  },
  {
    id: '3',
    nome: 'Gestão de Contratos',
    descricao: 'Controle de vencimentos e renovações',
    categoria: 'Financeiro',
    popularidade: 92,
    dificuldade: 'avancado',
    icone: <FileText className="h-5 w-5" />,
  },
  {
    id: '4',
    nome: 'Captura de Leads',
    descricao: 'Importação automática de formulários',
    categoria: 'CRM',
    popularidade: 85,
    dificuldade: 'iniciante',
    icone: <Users className="h-5 w-5" />,
  },
];

export function AutomacaoImobiliaria() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('automacoes');
  const [showNovaAutomacaoModal, setShowNovaAutomacaoModal] = useState(false);
  const [showNovaIntegracaoModal, setShowNovaIntegracaoModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [selectedAutomacao, setSelectedAutomacao] = useState<Automacao | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo':
      case 'conectado':
        return 'bg-green-500';
      case 'inativo':
      case 'desconectado':
        return 'bg-gray-500';
      case 'erro':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getDificuldadeColor = (dificuldade: string) => {
    switch (dificuldade) {
      case 'iniciante':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediario':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'avancado':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredAutomacoes = automacoes.filter(automacao =>
    automacao.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    automacao.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Automação Imobiliária</h1>
            <p className="text-gray-600 mt-1">Automatize processos e aumente sua produtividade</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar Configurações
            </Button>
            <Button onClick={() => setShowNovaAutomacaoModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Automação
            </Button>
          </div>
        </div>

        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Automação Imobiliária</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Automações Ativas</CardTitle>
              <Bot className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-gray-600">3 executadas hoje</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94.5%</div>
              <p className="text-xs text-gray-600">+2,3% vs semana anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo Economizado</CardTitle>
              <Clock className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24h</div>
              <p className="text-xs text-gray-600">Este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Integrações</CardTitle>
              <Link className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-gray-600">2 precisam atenção</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="automacoes">Automações</TabsTrigger>
            <TabsTrigger value="integracoes">Integrações</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          {/* Automações */}
          <TabsContent value="automacoes" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar automações..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-80"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
              </div>
              <Button onClick={() => setShowNovaAutomacaoModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Automação
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAutomacoes.map((automacao) => (
                <Card key={automacao.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-lg">{automacao.nome}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(automacao.status)}`} />
                      <Badge variant={automacao.status === 'ativo' ? 'default' : 'secondary'}>
                        {automacao.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{automacao.descricao}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Gatilho:</span>
                        <span className="font-medium">{automacao.gatilho}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Ação:</span>
                        <span className="font-medium">{automacao.acao}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Frequência:</span>
                        <span className="font-medium">{automacao.frequencia}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Sucesso</p>
                        <p className="font-semibold text-green-600">{automacao.sucesso}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Falhas</p>
                        <p className="font-semibold text-red-600">{automacao.falhas}%</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="text-xs text-gray-500">
                        <p>Última: {automacao.ultimaExecucao}</p>
                        <p>Próxima: {automacao.proximaExecucao}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Play className="h-4 w-4 mr-2" />
                            Executar Agora
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Activity className="h-4 w-4 mr-2" />
                            Ver Logs
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Integrações */}
          <TabsContent value="integracoes" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar integrações..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-80"
                  />
                </div>
              </div>
              <Button onClick={() => setShowNovaIntegracaoModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Integração
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {integracoes.map((integracao) => (
                <Card key={integracao.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center space-x-2">
                      <Database className="h-5 w-5 text-purple-600" />
                      <CardTitle className="text-lg">{integracao.nome}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(integracao.status)}`} />
                      <Badge variant={integracao.status === 'conectado' ? 'default' : integracao.status === 'erro' ? 'destructive' : 'secondary'}>
                        {integracao.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{integracao.descricao}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Tipo:</span>
                        <span className="font-medium">{integracao.tipo}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Última sincronização:</span>
                        <span className="font-medium">{integracao.ultimaSincronizacao}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Dados sincronizados:</span>
                        <span className="font-medium">{integracao.dadosSincronizados}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Sincronizar
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Settings className="h-4 w-4 mr-2" />
                            Configurar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Key className="h-4 w-4 mr-2" />
                            Ver API Key
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Activity className="h-4 w-4 mr-2" />
                            Ver Logs
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Desconectar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Templates */}
          <TabsContent value="templates" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-80"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        {template.icone}
                      </div>
                      <CardTitle className="text-lg">{template.nome}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{template.categoria}</Badge>
                      <Badge className={getDificuldadeColor(template.dificuldade)}>
                        {template.dificuldade}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{template.descricao}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">{template.popularidade}% popular</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">4.8</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Visualizar
                      </Button>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Usar Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Logs */}
          <TabsContent value="logs" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-80"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Automação</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Duração</TableHead>
                    <TableHead>Mensagem</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>15/01/2025 10:30:15</TableCell>
                    <TableCell>Boas-vindas Novos Leads</TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Sucesso
                      </Badge>
                    </TableCell>
                    <TableCell>2.3s</TableCell>
                    <TableCell>E-mail enviado com sucesso</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>15/01/2025 09:15:42</TableCell>
                    <TableCell>Atualização de Status</TableCell>
                    <TableCell>
                      <Badge variant="destructive">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Erro
                      </Badge>
                    </TableCell>
                    <TableCell>5.1s</TableCell>
                    <TableCell>Falha na conexão com portal</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>14/01/2025 18:00:00</TableCell>
                    <TableCell>Lembretes de Visita</TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Sucesso
                      </Badge>
                    </TableCell>
                    <TableCell>1.8s</TableCell>
                    <TableCell>3 SMS enviados</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal Nova Automação */}
      <Dialog open={showNovaAutomacaoModal} onOpenChange={setShowNovaAutomacaoModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Nova Automação</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome da Automação</Label>
              <Input id="nome" placeholder="Ex: Boas-vindas Novos Leads" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input id="descricao" placeholder="Descreva o que esta automação faz" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="gatilho">Gatilho</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o gatilho" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="novo-lead">Novo Lead</SelectItem>
                    <SelectItem value="visita-agendada">Visita Agendada</SelectItem>
                    <SelectItem value="status-alterado">Status Alterado</SelectItem>
                    <SelectItem value="contrato-assinado">Contrato Assinado</SelectItem>
                    <SelectItem value="agenda">Agendado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="acao">Ação</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a ação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Enviar E-mail</SelectItem>
                    <SelectItem value="whatsapp">Enviar WhatsApp</SelectItem>
                    <SelectItem value="sms">Enviar SMS</SelectItem>
                    <SelectItem value="notificacao">Enviar Notificação</SelectItem>
                    <SelectItem value="relatorio">Gerar Relatório</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="frequencia">Frequência</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a frequência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="imediato">Imediato</SelectItem>
                  <SelectItem value="diario">Diário</SelectItem>
                  <SelectItem value="semanal">Semanal</SelectItem>
                  <SelectItem value="mensal">Mensal</SelectItem>
                  <SelectItem value="personalizado">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="crm">CRM</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="financeiro">Financeiro</SelectItem>
                  <SelectItem value="operacional">Operacional</SelectItem>
                  <SelectItem value="relatorios">Relatórios</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="ativo" />
              <Label htmlFor="ativo">Ativar automação imediatamente</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNovaAutomacaoModal(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setShowNovaAutomacaoModal(false)}>
              Criar Automação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Nova Integração */}
      <Dialog open={showNovaIntegracaoModal} onOpenChange={setShowNovaIntegracaoModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nova Integração</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome da Integração</Label>
              <Input id="nome" placeholder="Ex: Google Sheets" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input id="descricao" placeholder="Descreva o propósito da integração" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="api">API</SelectItem>
                  <SelectItem value="webhook">Webhook</SelectItem>
                  <SelectItem value="database">Database</SelectItem>
                  <SelectItem value="file">File Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="apiKey">API Key (opcional)</Label>
              <div className="flex space-x-2">
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Digite a API key"
                  className="flex-1"
                />
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="webhookUrl">Webhook URL (opcional)</Label>
              <Input id="webhookUrl" placeholder="https://exemplo.com/webhook" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNovaIntegracaoModal(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setShowNovaIntegracaoModal(false)}>
              Criar Integração
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
