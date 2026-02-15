import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Palette, 
  Layout, 
  Database, 
  MessageSquare, 
  Copy, 
  Eye, 
  Moon, 
  Sun,
  Plus,
  X,
  Mail,
  Phone,
  Smartphone,
  Edit2,
  Trash2,
  StickyNote,
  CheckCircle,
  AlertCircle,
  Users,
  Briefcase,
  Tag,
  Activity,
  Calendar,
  Home,
  DollarSign,
  Building,
  Clock,
  Star,
  Target,
  ArrowLeft
} from 'lucide-react';
import { TagManager } from '@/components/shared/TagManager';
import { DEFAULT_TAGS, TAG_COLORS } from '@/components/shared/tagConstants';

// Exemplo de dados para demonstração
const mockStages = [
  { id: 'new', title: 'Novo Lead', count: 12 },
  { id: 'contact', title: 'Contato Realizado', count: 8 },
  { id: 'visit', title: 'Visita Agendada', count: 5 },
  { id: 'proposal', title: 'Proposta Enviada', count: 3 },
  { id: 'negotiation', title: 'Negociação', count: 2 },
  { id: 'closed', title: 'Fechado', count: 1 },
];

const mockTags = ['Hot Lead', 'VIP', 'Primeira Compra'];

export default function DesignSystem() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('foundations');
  const [showTagManagerDemo, setShowTagManagerDemo] = useState(false);
  const [showModalDemo, setShowModalDemo] = useState(false);
  const [selectedTags, setSelectedTags] = useState(mockTags);
  const [availableTags, setAvailableTags] = useState(DEFAULT_TAGS);

  const codeExamples = {
    tagManager: `import { TagManager } from '@/components/shared/TagManager';
import { DEFAULT_TAGS } from '@/components/shared/tagConstants';

function MyComponent() {
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState(DEFAULT_TAGS);

  return (
    <TagManager
      selectedTags={selectedTags}
      availableTags={availableTags}
      onUpdate={(tags) => setSelectedTags(tags)}
      onUpdateAvailableTags={setAvailableTags}
      showEditMode={true}
    />
  );
}`,

    badgeCounter: `import { Badge } from '@/components/ui/badge';

function FunilColumn({ stage, count }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <h3 className={\`font-semibold text-sm px-3 py-1 rounded-full \${stage.color}\`}>
        {stage.title}
      </h3>
      <Badge variant="secondary" className="rounded-full text-xs px-2 py-0.5 h-5 flex items-center justify-center">
        {count}
      </Badge>
    </div>
  );
}`,

    modalStructure: `import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

function ModernModal() {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[1200px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Título do Modal</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-12 gap-6 py-6">
          {/* Colunas 1-7: Conteúdo Principal */}
          <div className="col-span-7 space-y-6">
            <h3 className="text-slate-400 uppercase text-xs font-semibold mb-4">
              Informações Principais
            </h3>
            {/* Conteúdo aqui */}
          </div>
          
          {/* Colunas 8-12: Box Lateral */}
          <div className="col-span-5 bg-slate-50 rounded-lg p-6 space-y-6">
            <h3 className="text-slate-400 uppercase text-xs font-semibold mb-4">
              Configurações
            </h3>
            {/* Conteúdo lateral aqui */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}`
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const renderCodeBlock = (code: string, title: string) => (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">{title}</h4>
        <Button
          variant="outline"
          size="sm"
          onClick={() => copyToClipboard(code)}
          className="flex items-center gap-2"
        >
          <Copy className="h-3 w-3" />
          Copiar
        </Button>
      </div>
      <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
              <div className="flex items-center gap-2">
                <Palette className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold">Design System ESI</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Versão 1.0.0</span>
              <Badge variant="secondary">Internal</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="col-span-3">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="h-5 w-5" />
                  Navegação
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {[
                    { id: 'foundations', label: 'Fundações', icon: Database },
                    { id: 'forms', label: 'Formulários', icon: Layout },
                    { id: 'data', label: 'Componentes de Dados', icon: Database },
                    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                        activeTab === item.id ? 'bg-slate-100 dark:bg-slate-800 border-l-2 border-primary' : ''
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="foundations">Fundações</TabsTrigger>
                <TabsTrigger value="forms">Formulários</TabsTrigger>
                <TabsTrigger value="data">Componentes de Dados</TabsTrigger>
                <TabsTrigger value="feedback">Feedback</TabsTrigger>
              </TabsList>

              {/* Fundações */}
              <TabsContent value="foundations" className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Fundações do Design System</h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    Princípios fundamentais que guiam o design e desenvolvimento da interface do ESI.
                  </p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Princípios de Design
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">Consistência</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Elementos consistentes em toda a aplicação para criar uma experiência unificada.
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">Acessibilidade</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Interface acessível para todos os usuários, seguindo WCAG 2.1.
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">Performance</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Componentes otimizados para performance e experiência fluida.
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">Manutenibilidade</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Código limpo e documentado para facilitar manutenção e evolução.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      Cores e Tipografia
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-3">Paleta de Cores</h4>
                      <div className="grid grid-cols-4 gap-2">
                        <div className="p-4 bg-primary text-primary-foreground rounded text-center text-sm">Primary</div>
                        <div className="p-4 bg-secondary text-secondary-foreground rounded text-center text-sm">Secondary</div>
                        <div className="p-4 bg-accent text-accent-foreground rounded text-center text-sm">Accent</div>
                        <div className="p-4 bg-muted text-muted-foreground rounded text-center text-sm">Muted</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Cores Semânticas</h4>
                      <div className="grid grid-cols-6 gap-2">
                        <div className="p-3 bg-green-500 text-white rounded text-center text-xs">Success</div>
                        <div className="p-3 bg-red-500 text-white rounded text-center text-xs">Error</div>
                        <div className="p-3 bg-yellow-500 text-white rounded text-center text-xs">Warning</div>
                        <div className="p-3 bg-blue-500 text-white rounded text-center text-xs">Info</div>
                        <div className="p-3 bg-slate-500 text-white rounded text-center text-xs">Neutral</div>
                        <div className="p-3 bg-cyan-500 text-white rounded text-center text-xs">Brand</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Formulários */}
              <TabsContent value="forms" className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Formulários e Modais</h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    Padrões para formulários, modais e componentes interativos.
                  </p>
                </div>

                {/* TagManager Component */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Tag className="h-5 w-5" />
                      TagManager Component
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Componente unificado para gerenciamento de tags em todo o sistema.
                      </p>
                      <div className="flex gap-2">
                        <Button onClick={() => setShowTagManagerDemo(true)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Demonstração
                        </Button>
                      </div>
                    </div>
                    
                    {renderCodeBlock(codeExamples.tagManager, 'Implementação')}
                  </CardContent>
                </Card>

                {/* Modal Structure */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layout className="h-5 w-5" />
                      Estrutura de Modal Moderna
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Layout padrão para modais com grid 12 colunas (7+5).
                      </p>
                      <div className="flex gap-2">
                        <Button onClick={() => setShowModalDemo(true)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Exemplo
                        </Button>
                      </div>
                    </div>
                    
                    {renderCodeBlock(codeExamples.modalStructure, 'Estrutura Base')}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Componentes de Dados */}
              <TabsContent value="data" className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Componentes de Dados</h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    Componentes para exibição e organização de dados.
                  </p>
                </div>

                {/* Badge Counter */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Badge com Contador (Funil)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Badge discreto para indicadores de volume no funil de vendas.
                      </p>
                      <div className="space-y-2">
                        {mockStages.map((stage) => (
                          <div key={stage.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <h3 className="font-semibold text-sm px-3 py-1 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100">
                              {stage.title}
                            </h3>
                            <Badge variant="secondary" className="rounded-full text-xs px-2 py-0.5 h-5 flex items-center justify-center">
                              {stage.count}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {renderCodeBlock(codeExamples.badgeCounter, 'Implementação')}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Feedback */}
              <TabsContent value="feedback" className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Componentes de Feedback</h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    Componentes para feedback visual e comunicação com o usuário.
                  </p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Sistema de Feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h4 className="font-semibold">Notificações</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 p-3 border rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <div>
                              <p className="text-sm font-medium">Sucesso</p>
                              <p className="text-xs text-slate-500">Operação concluída</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 border rounded-lg">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                            <div>
                              <p className="text-sm font-medium">Erro</p>
                              <p className="text-xs text-slate-500">Falha na operação</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold">Loading States</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 p-3 border rounded-lg">
                            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                            <p className="text-sm">Carregando...</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Demo Modals */}
      <Dialog open={showTagManagerDemo} onOpenChange={setShowTagManagerDemo}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Demonstração: TagManager</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <TagManager
              selectedTags={selectedTags}
              availableTags={availableTags}
              onUpdate={setSelectedTags}
              onUpdateAvailableTags={setAvailableTags}
              showEditMode={true}
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setShowTagManagerDemo(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showModalDemo} onOpenChange={setShowModalDemo}>
        <DialogContent className="sm:max-w-[1200px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Demonstração: Modal Moderno</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-12 gap-6 py-6">
            <div className="col-span-7 space-y-6">
              <h3 className="text-slate-400 uppercase text-xs font-semibold mb-4">
                Informações Principais
              </h3>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Conteúdo Principal</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Esta área (7 colunas) contém as informações principais do modal,
                    como dados do cliente, formulários principais, etc.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-span-5 bg-slate-50 rounded-lg p-6 space-y-6">
              <h3 className="text-slate-400 uppercase text-xs font-semibold mb-4">
                Configurações
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border">
                  <h4 className="font-medium mb-2">Box Lateral</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Esta área (5 colunas) contém configurações,
                    tags, observações e metadados.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModalDemo(false)}>
              Cancelar
            </Button>
            <Button className="bg-cyan-500 hover:bg-cyan-600">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
