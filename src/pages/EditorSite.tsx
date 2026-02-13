import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Plus,
  Layout,
  Type,
  Image as ImageIcon,
  MapPin,
  Grid3x3,
  Save,
  Eye,
  Settings,
  Trash2,
  ArrowUp,
  ArrowDown,
  Monitor,
  Smartphone,
  Tablet,
  Palette,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { siteTemplates, SiteTemplate } from '@/components/site-templates';
import { SitePreview } from '@/components/site-preview';
import { TemplatePreview } from '@/components/template-preview';
import { useToast } from '@/hooks/use-toast';

export interface Block {
  id: string;
  type: string;
  content: any;
}

const blockTypes = [
  { id: 'header', name: 'Header', icon: Layout, color: 'bg-primary' },
  { id: 'hero', name: 'Hero Banner', icon: ImageIcon, color: 'bg-accent' },
  { id: 'text', name: 'Texto', icon: Type, color: 'bg-warning' },
  { id: 'properties', name: 'Grade de Imóveis', icon: Grid3x3, color: 'bg-success' },
  { id: 'map', name: 'Mapa', icon: MapPin, color: 'bg-primary' },
  { id: 'footer', name: 'Footer', icon: Layout, color: 'bg-accent' },
];

export function EditorSite() {
  const { toast } = useToast();
  const [selectedPage, setSelectedPage] = useState('home');
  const [blocks, setBlocks] = useState<Block[]>([
    {
      id: '1',
      type: 'header',
      content: { logo: 'Logo', menu: ['Início', 'Imóveis', 'Sobre', 'Contato'] },
    },
    {
      id: '2',
      type: 'hero',
      content: { title: 'Encontre seu Imóvel dos Sonhos', subtitle: 'Os melhores imóveis da região' },
    },
    {
      id: '3',
      type: 'properties',
      content: { titulo: 'Imóveis em Destaque', quantidade: 6 },
    },
  ]);
  
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'blocks' | 'templates' | 'styles'>('blocks');
  const [selectedTemplate, setSelectedTemplate] = useState<SiteTemplate | null>(null);
  const [templatePreviewOpen, setTemplatePreviewOpen] = useState(false);
  const [previewingTemplate, setPreviewingTemplate] = useState<SiteTemplate | null>(null);

  const addBlock = (type: string) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: {},
    };
    setBlocks([...blocks, newBlock]);
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= blocks.length) return;
    
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    setBlocks(newBlocks);
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const handleSave = () => {
    console.log('Salvando página:', selectedPage, blocks);
    toast({
      title: "Site salvo com sucesso!",
      description: "As alterações foram publicadas.",
      variant: "success",
    });
  };

  const handlePreview = () => {
    console.log('Abrindo preview...');
    window.open('/preview', '_blank');
  };

  const applyTemplate = (template: SiteTemplate) => {
    setBlocks(template.blocks);
    setSelectedTemplate(template);
    toast({
      title: "Template aplicado!",
      description: `Template "${template.name}" foi aplicado com sucesso.`,
      variant: "success",
    });
  };

  const getViewModeWidth = () => {
    switch (viewMode) {
      case 'mobile': return 'max-w-sm';
      case 'tablet': return 'max-w-2xl';
      case 'desktop': return 'max-w-7xl';
      default: return 'max-w-7xl';
    }
  };

  const handleTemplatePreview = (template: SiteTemplate) => {
    setPreviewingTemplate(template);
    setTemplatePreviewOpen(true);
  };

  const handleApplyTemplateFromPreview = (template: SiteTemplate) => {
    applyTemplate(template);
    setTemplatePreviewOpen(false);
    setPreviewingTemplate(null);
  };

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Editor do Site</h1>
          <p className="text-muted-foreground">Personalize seu site como no Framer</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('desktop')}
              className="h-8 w-8 p-0"
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'tablet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('tablet')}
              className="h-8 w-8 p-0"
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('mobile')}
              className="h-8 w-8 p-0"
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" className="gap-2" onClick={handlePreview}>
            <Eye className="h-4 w-4" />
            Visualizar
          </Button>
          <Button className="gap-2" onClick={handleSave}>
            <Save className="h-4 w-4" />
            Salvar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 overflow-hidden">
        {/* Sidebar Esquerda - Blocos e Templates */}
        <div className="col-span-3 space-y-4 overflow-y-auto">
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Página</h3>
              </div>
              <Select value={selectedPage} onValueChange={setSelectedPage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="imoveis">Imóveis</SelectItem>
                  <SelectItem value="sobre">Sobre Nós</SelectItem>
                  <SelectItem value="contato">Contato</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="blocks" className="text-xs">Blocos</TabsTrigger>
                  <TabsTrigger value="templates" className="text-xs">Templates</TabsTrigger>
                  <TabsTrigger value="styles" className="text-xs">Estilos</TabsTrigger>
                </TabsList>
                
                <TabsContent value="blocks" className="space-y-2 mt-4">
                  <div className="space-y-2">
                    {blockTypes.map((blockType) => {
                      const Icon = blockType.icon;
                      return (
                        <Button
                          key={blockType.id}
                          variant="outline"
                          className="w-full justify-start gap-3"
                          onClick={() => addBlock(blockType.id)}
                        >
                          <div className={`w-8 h-8 ${blockType.color} rounded flex items-center justify-center`}>
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <span>{blockType.name}</span>
                        </Button>
                      );
                    })}
                  </div>
                </TabsContent>
                
                <TabsContent value="templates" className="space-y-3 mt-4">
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {siteTemplates.map((template) => (
                      <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-3">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm">{template.name}</h4>
                              <Badge variant="outline" className="text-xs">{template.category}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{template.description}</p>
                            <div className="w-full h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded flex items-center justify-center">
                              <Sparkles className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={() => handleTemplatePreview(template)}
                              >
                                Preview
                              </Button>
                              <Button
                                size="sm"
                                className="flex-1"
                                onClick={() => applyTemplate(template)}
                              >
                                Aplicar
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="styles" className="space-y-3 mt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Cores do Tema</label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground">Primária</label>
                          <div className="w-full h-8 rounded cursor-pointer border-2 border-border" style={{ backgroundColor: '#4298B5' }}></div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground">Secundária</label>
                          <div className="w-full h-8 rounded cursor-pointer border-2 border-border" style={{ backgroundColor: '#00C389' }}></div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">Cores configuradas em Personalização → Branding da Empresa</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tipografia</label>
                      <select className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm">
                        <option value="inter">Inter</option>
                        <option value="roboto">Roboto</option>
                        <option value="opensans">Open Sans</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Espaçamento</label>
                      <select className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm">
                        <option value="compact">Compacto</option>
                        <option value="normal">Normal</option>
                        <option value="relaxed">Relaxado</option>
                      </select>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Área Central - Preview em Tempo Real */}
        <div className="col-span-6 overflow-y-auto">
          <Card className="min-h-full">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-4 flex items-center justify-between">
                <span>Preview - {selectedPage.charAt(0).toUpperCase() + selectedPage.slice(1)}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{blocks.length} blocos</Badge>
                  {selectedTemplate && (
                    <Badge variant="secondary">
                      {selectedTemplate.name}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden bg-gray-50">
                <div className={`mx-auto transition-all duration-300 ${getViewModeWidth()}`}>
                  <div className={viewMode === 'mobile' ? 'scale-75 origin-top' : ''}>
                    <SitePreview 
                      blocks={blocks} 
                      selectedPage={selectedPage}
                      selectedBlock={selectedBlock}
                      onBlockSelect={setSelectedBlock}
                      onBlockDelete={deleteBlock}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Direita - Propriedades */}
        <div className="col-span-3 overflow-y-auto">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Settings className="h-5 w-5" />
                <h3 className="font-semibold">Propriedades</h3>
              </div>
              
              {selectedBlock ? (
                <>
                  {blocks.find(b => b.id === selectedBlock)?.type === 'hero' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Título</label>
                        <Input
                          defaultValue={blocks.find(b => b.id === selectedBlock)?.content.title}
                          placeholder="Digite o título"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Subtítulo</label>
                        <Input
                          defaultValue={blocks.find(b => b.id === selectedBlock)?.content.subtitle}
                          placeholder="Digite o subtítulo"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Imagem de Fundo</label>
                        <div className="border-2 border-dashed border-border rounded-lg p-4 text-center text-sm text-muted-foreground cursor-pointer hover:border-primary transition-colors">
                          Clique para fazer upload
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {blocks.find(b => b.id === selectedBlock)?.type === 'properties' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Título da Seção</label>
                        <Input
                          defaultValue={blocks.find(b => b.id === selectedBlock)?.content.titulo}
                          placeholder="Ex: Imóveis em Destaque"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Quantidade de Imóveis</label>
                        <Input
                          type="number"
                          defaultValue={blocks.find(b => b.id === selectedBlock)?.content.quantidade}
                          placeholder="6"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Filtro</label>
                        <select className="w-full px-3 py-2 rounded-md border border-input bg-background">
                          <option value="todos">Todos os Imóveis</option>
                          <option value="destaque">Em Destaque</option>
                          <option value="recentes">Mais Recentes</option>
                          <option value="lancamentos">Lançamentos</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {blocks.find(b => b.id === selectedBlock)?.type === 'text' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Conteúdo</label>
                        <textarea
                          className="w-full min-h-[150px] px-3 py-2 rounded-md border border-input bg-background"
                          placeholder="Digite o conteúdo do texto..."
                        />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-sm text-muted-foreground">
                    Selecione um bloco para editar suas propriedades
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {previewingTemplate && (
        <TemplatePreview
          template={previewingTemplate}
          isOpen={templatePreviewOpen}
          onClose={() => {
            setTemplatePreviewOpen(false);
            setPreviewingTemplate(null);
          }}
          onApplyTemplate={handleApplyTemplateFromPreview}
        />
      )}
    </div>
  );
}
