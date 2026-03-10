import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  Globe,
  LayoutTemplate,
  CheckCircle2,
  ExternalLink,
  Monitor,
  Smartphone,
  Tablet,
  Save,
  Palette,
  Eye,
  Plus,
  Trash2,
  Building2,
  Home,
  MapPin,
  ChevronDown,
  Settings2,
  Image as ImageIcon,
  Type,
  FileText,
  MousePointer2,
  Video,
  Menu,
  GripVertical,
  Upload,
  Phone,
  Mail,
  Map,
  Send,
  Sparkles,
  X
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAnimation } from '@/components/shared/ActionAnimation';

type TemplateId = 'minimalista' | 'classico' | 'premium';
type DomainType = 'auto' | 'custom';

export function EsiSites() {
  const { triggerAnimation } = useAnimation();
  const { toast } = useToast();

  // Top Bar State
  const [activePageId, setActivePageId] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isPublishing, setIsPublishing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Pages & Content State
  const [pages, setPages] = useState([
    { id: 1, title: 'Início', type: 'system', content: '' },
    { id: 2, title: 'Imóveis', type: 'system', content: '' },
    { id: 3, title: 'Sobre Nós', type: 'custom', content: 'Somos a imobiliária líder em trazer as melhores oportunidades da região. Com mais de 10 anos de mercado, nossa equipe é composta por especialistas prontos para realizar o seu sonho.', image: '' },
    { id: 4, title: 'Contato', type: 'custom', content: 'Entre em contato conosco pelo telefone (11) 9999-9999 ou venha tomar um café em nosso escritório na Avenida Principal, 1000.', image: '' }
  ]);

  // Home Specific Content
  const [heroH1, setHeroH1] = useState('Encontre o imóvel dos seus sonhos');
  const [heroMediaType, setHeroMediaType] = useState<'image' | 'video'>('image');
  const [heroMedia, setHeroMedia] = useState('');

  // Contact Specific Config
  const [contactConfig, setContactConfig] = useState({
    showPhone1: true,
    showPhone2: false,
    showEmail1: true,
    showEmail2: false,
    showMap: true,
    showForm: true,
  });

  // About specific config
  const [sobreConfig, setSobreConfig] = useState({
    showTeam: true,
    showStats: true,
    showTimeline: false
  });

  // Design State
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('minimalista');
  const [primaryColor, setPrimaryColor] = useState('#059669'); // emerald-600
  const [secondaryColor, setSecondaryColor] = useState('#1D5C59'); // dark emerald

  // Domain State
  const [domainType, setDomainType] = useState<DomainType>('auto');
  const [customDomain, setCustomDomain] = useState('');
  const [autoDomainPrefix, setAutoDomainPrefix] = useState('minha-imobiliaria');

  const templates = [
    {
      id: 'minimalista',
      name: 'Minimalista',
      description: 'Design limpo e focado no conteúdo.',
      layout: 'minimal'
    },
    {
      id: 'classico',
      name: 'Clássico',
      description: 'Tradicional, confiável e corporativo.',
      layout: 'classic'
    },
    {
      id: 'premium',
      name: 'High-Tech',
      description: 'Luxuoso, imersivo e moderno.',
      layout: 'luxury'
    }
  ];

  const currentTemplateObj = templates.find(t => t.id === selectedTemplate) || templates[0];
  const activePage = pages.find(p => p.id === activePageId) || pages[0];

  const handlePublish = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    triggerAnimation({
      type: 'success',
      startX: rect.left + rect.width / 2,
      startY: rect.top + rect.height / 2,
      icon: Globe
    });
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      toast({
        title: "Site Publicado com Sucesso! 🚀",
        description: "Suas alterações já estão ao vivo para seus clientes.",
        variant: "success",
      });
    }, 1500);
  };

  const currentUrl = domainType === 'auto'
    ? `https://${autoDomainPrefix || 'meu-site'}.esi.app`
    : `https://${customDomain || 'www.meudominio.com.br'}`;

  const handleOpenSite = () => {
    window.open(currentUrl, '_blank');
  };

  const getViewModeWidth = () => {
    switch (viewMode) {
      case 'mobile': return 'max-w-[375px] h-[812px] flex-none';
      case 'tablet': return 'max-w-[768px] h-[1024px] flex-none';
      case 'desktop': return 'max-w-full h-full';
      default: return 'max-w-full h-full';
    }
  };

  const updatePageContent = (newContent: string) => {
    setPages(pages.map(p => p.id === activePageId ? { ...p, content: newContent } : p));
  };

  const updatePageImage = (newImage: string) => {
    setPages(pages.map(p => p.id === activePageId ? { ...p, image: newImage } : p));
  };

  // Drag and Drop ordering for custom pages
  const handleReorderPages = (reorderedCustomPages: any[]) => {
    const systemPages = pages.filter(p => p.type === 'system');
    setPages([...systemPages, ...reorderedCustomPages]);
  };

  const customPagesList = pages.filter(p => p.type === 'custom');

  const handleSimulateUpload = (setter: (url: string) => void) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setter(url);
      }
    };
    input.click();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] animate-in fade-in duration-500 bg-background">

      {/* ── TOP BAR (CMS STYLE) ── */}
      <header className="flex-none h-14 lg:h-16 border-b border-border bg-card flex items-center justify-between px-4 z-20 gap-4 overflow-x-auto custom-scrollbar">

        {/* Left: Brand & Page Switcher */}
        <div className="flex items-center gap-2 sm:gap-6 shrink-0">
          <div className="flex items-center gap-2 font-bold text-lg hidden sm:flex shrink-0">
            <div className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center shrink-0">E</div>
            si.sites
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm bg-muted/50 hover:bg-muted transition-colors border rounded-md px-2 sm:px-3 py-1.5 cursor-pointer shrink-0">
            <span className="text-muted-foreground hidden sm:inline mr-1">Página:</span>
            <Select value={activePageId.toString()} onValueChange={(v) => setActivePageId(Number(v))}>
              <SelectTrigger className="border-0 h-auto py-0 px-0 shadow-none bg-transparent focus:ring-0 w-24 sm:w-32 font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pages.map(p => (
                  <SelectItem key={p.id} value={p.id.toString()}>{p.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Center: Viewport Toggles (Responsive) */}
        <div className="flex items-center bg-muted/30 rounded-lg p-1 border shrink-0 mx-auto">
          {/* Desktop/Tablet text toggles for larger screens */}
          <div className="hidden lg:flex items-center gap-1">
            <Button variant={viewMode === 'desktop' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('desktop')} className="px-3 h-7 gap-2">
              <Monitor className="h-4 w-4" /> <span className="text-xs">Desktop</span>
            </Button>
            <Button variant={viewMode === 'tablet' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('tablet')} className="px-3 h-7 gap-2">
              <Tablet className="h-4 w-4" /> <span className="text-xs">Tablet</span>
            </Button>
            <Button variant={viewMode === 'mobile' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('mobile')} className="px-3 h-7 gap-2">
              <Smartphone className="h-4 w-4" /> <span className="text-xs">Mobile</span>
            </Button>
          </div>

          {/* Icon-only toggles for smaller screens */}
          <div className="flex lg:hidden items-center gap-1">
            <Button variant={viewMode === 'desktop' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('desktop')} className="h-7 w-7"><Monitor className="h-4 w-4" /></Button>
            <Button variant={viewMode === 'tablet' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('tablet')} className="h-7 w-7"><Tablet className="h-4 w-4" /></Button>
            <Button variant={viewMode === 'mobile' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('mobile')} className="h-7 w-7"><Smartphone className="h-4 w-4" /></Button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <Button variant="ghost" size="sm" className="gap-2 hidden sm:flex text-muted-foreground hover:text-foreground" onClick={handleOpenSite}>
            <ExternalLink className="h-4 w-4" /> Ver Online
          </Button>
          <Button size="sm" className="gap-2 shadow-md shadow-primary/20" onClick={handlePublish} disabled={isPublishing}>
            {isPublishing ? <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" /> : <Save className="h-4 w-4" />}
            {isPublishing ? 'Publicando' : 'Publicar'}
          </Button>
        </div>
      </header>

      {/* ── SPLIT WORKSPACE ── */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Sidebar Toggle */}
        <div className="lg:hidden absolute bottom-4 right-4 z-[100]">
          <Button
            size="icon"
            className="h-12 w-12 rounded-full shadow-2xl bg-primary text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Settings2 className="h-6 w-6" />}
          </Button>
        </div>

        {/* SIDEBAR - VERTICAL ACCORDION CMS */}
        <div className={cn(
          "w-full sm:w-[320px] lg:w-[320px] flex-none border-r border-border bg-card overflow-y-auto custom-scrollbar flex flex-col transition-all duration-300 z-30",
          sidebarOpen ? "fixed inset-0 sm:relative translate-x-0" : "fixed inset-0 sm:relative -translate-x-full lg:translate-x-0"
        )}>

          <div className="p-4 border-b border-border/50 bg-muted/20">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-1">Configurações</h2>
            <p className="text-xs text-muted-foreground">Personalize o layout e conteúdo.</p>
          </div>

          <Accordion type="single" collapsible defaultValue="design" className="flex-1">

            {/* SECTION: DESIGN */}
            <AccordionItem value="design" className="border-b-0">
              <AccordionTrigger className="px-4 py-3 hover:bg-muted/30 text-sm font-semibold border-b border-border/50">
                <span className="flex items-center gap-2"><Palette className="h-4 w-4 text-emerald-500" /> Identidade & Design</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-4 space-y-6 bg-muted/10 border-b border-border/50">

                {/* Templates */}
                <div className="space-y-3">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">Template Base</Label>
                  <div className="grid gap-2">
                    {templates.map(tpl => (
                      <div
                        key={tpl.id}
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          triggerAnimation({
                            type: 'success',
                            startX: rect.left + rect.width / 2,
                            startY: rect.top + rect.height / 2,
                            icon: Sparkles
                          });
                          setSelectedTemplate(tpl.id as TemplateId);
                        }}
                        className={cn(
                          "border rounded-lg p-3 cursor-pointer transition-all flex items-center justify-between",
                          selectedTemplate === tpl.id ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "bg-card hover:border-foreground/30"
                        )}
                      >
                        <div>
                          <div className="font-medium text-sm">{tpl.name}</div>
                        </div>
                        <div className={cn("h-4 w-4 rounded-full border flex items-center justify-center", selectedTemplate === tpl.id ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30")}>
                          {selectedTemplate === tpl.id && <CheckCircle2 className="h-3 w-3" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div className="space-y-4 pt-2">
                  <div className="space-y-3">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">Cor Principal</Label>
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded border shadow-sm overflow-hidden cursor-pointer group shrink-0">
                        <input
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="absolute inset-0 w-[200%] h-[200%] -top-1/2 -left-1/2 cursor-pointer opacity-0"
                        />
                        <div className="w-full h-full" style={{ backgroundColor: primaryColor }} />
                      </div>
                      <div className="text-sm border rounded px-3 py-1.5 bg-card flex-1 font-mono uppercase text-muted-foreground truncate">
                        {primaryColor}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">Cor Secundária</Label>
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded border shadow-sm overflow-hidden cursor-pointer group shrink-0">
                        <input
                          type="color"
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="absolute inset-0 w-[200%] h-[200%] -top-1/2 -left-1/2 cursor-pointer opacity-0"
                        />
                        <div className="w-full h-full" style={{ backgroundColor: secondaryColor }} />
                      </div>
                      <div className="text-sm border rounded px-3 py-1.5 bg-card flex-1 font-mono uppercase text-muted-foreground truncate">
                        {secondaryColor}
                      </div>
                    </div>
                  </div>
                </div>

              </AccordionContent>
            </AccordionItem>

            {/* SECTION: CONTEÚDO (CONTEXTUAL) */}
            <AccordionItem value="conteudo" className="border-b-0">
              <AccordionTrigger className="px-4 py-3 hover:bg-muted/30 text-sm font-semibold border-b border-border/50">
                <span className="flex items-center gap-2"><FileText className="h-4 w-4 text-blue-500" /> Conteúdo: {activePage.title}</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-4 space-y-6 bg-muted/10 border-b border-border/50">

                <div className="bg-blue-500/10 border border-blue-500/20 rounded p-3 text-xs text-blue-700 dark:text-blue-400 mb-4 flex gap-2">
                  <MousePointer2 className="h-4 w-4 shrink-0" />
                  Editando o conteúdo específico da página "{activePage.title}".
                </div>

                {/* Se for a Home */}
                {activePageId === 1 && (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold">Frase Principal (Hero H1)</Label>
                      <Textarea
                        value={heroH1}
                        onChange={(e) => setHeroH1(e.target.value)}
                        className="resize-none h-20 text-sm"
                        placeholder="Ex: Seu próximo lar está aqui."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold flex items-center justify-between">
                        Mídia de Fundo do Hero
                        <Badge variant="outline" className="text-[10px] uppercase font-normal">Novo</Badge>
                      </Label>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Button variant={heroMediaType === 'image' ? "outline" : "secondary"} size="sm" className="flex-1 gap-2 text-xs h-8" onClick={() => setHeroMediaType('image')}><ImageIcon className="h-3 w-3" /> Imagem</Button>
                          <Button variant={heroMediaType === 'video' ? "outline" : "secondary"} size="sm" className="flex-1 gap-2 text-xs h-8" onClick={() => setHeroMediaType('video')}><Video className="h-3 w-3" /> Vídeo</Button>
                        </div>
                        {heroMediaType === 'video' ? (
                          <Input
                            placeholder="URL do vídeo (ex: https://...)"
                            value={heroMedia}
                            onChange={(e) => setHeroMedia(e.target.value)}
                            className="h-9 text-xs"
                          />
                        ) : (
                          <Button variant="outline" className="w-full text-xs h-9 border-dashed" onClick={() => handleSimulateUpload(setHeroMedia)}>
                            <Upload className="h-3 w-3 mr-2" /> Fazer Upload da Imagem
                          </Button>
                        )}
                        {heroMedia && <div className="h-24 rounded border overflow-hidden bg-muted relative group">
                          {heroMediaType === 'video' ? (
                            <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white flex-col gap-1">
                              <Video className="h-6 w-6 opacity-50" />
                              <span className="text-[10px] opacity-70">Vídeo Selecionado</span>
                            </div>
                          ) : (
                            <img src={heroMedia} alt="Hero Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                          )}
                          <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); setHeroMedia(''); }}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Se for Imóveis (Fixa) */}
                {activePageId === 2 && (
                  <div className="text-center py-6 text-muted-foreground text-sm border-2 border-dashed rounded-lg">
                    A página de imóveis é gerada dinamicamente pelo seu estoque. Não é necessário editar texto aqui.
                  </div>
                )}

                {/* Outras Páginas (Texto Livre + Imagem) */}
                {activePageId > 2 && activePage.title !== 'Contato' && (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold flex items-center justify-between">
                        Imagem da Página
                        {activePage.image && (
                          <Button variant="ghost" size="sm" className="h-5 px-2 text-[10px] text-destructive hover:bg-destructive/10" onClick={() => updatePageImage('')}>Remover</Button>
                        )}
                      </Label>
                      {activePage.image ? (
                        <div className="h-32 rounded border overflow-hidden relative cursor-pointer group" onClick={() => handleSimulateUpload(updatePageImage)}>
                          <img src={activePage.image} alt="Page Visual" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Upload className="h-4 w-4" />
                          </div>
                        </div>
                      ) : (
                        <Button variant="outline" className="w-full text-xs h-9 border-dashed" onClick={() => handleSimulateUpload(updatePageImage)}>
                          <ImageIcon className="h-3 w-3 mr-2" /> Adicionar Imagem
                        </Button>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold">Corpo da Página</Label>
                      <Textarea
                        value={activePage.content}
                        onChange={(e) => updatePageContent(e.target.value)}
                        className="min-h-[200px] text-sm leading-relaxed"
                        placeholder="Digite o conteúdo desta página..."
                      />
                    </div>

                    {/* Sobre Nós (Configuração Extra) */}
                    {activePage.title === 'Sobre Nós' && (
                      <div className="space-y-4 pt-4 border-t border-border/50">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase">Seções Extras da Página</Label>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-normal">Nossa Equipe (Corretores)</Label>
                          <Switch checked={sobreConfig.showTeam} onCheckedChange={(c) => setSobreConfig(prev => ({ ...prev, showTeam: c }))} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-normal">Números e Estatísticas</Label>
                          <Switch checked={sobreConfig.showStats} onCheckedChange={(c) => setSobreConfig(prev => ({ ...prev, showStats: c }))} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-normal">Linha do Tempo (História)</Label>
                          <Switch checked={sobreConfig.showTimeline} onCheckedChange={(c) => setSobreConfig(prev => ({ ...prev, showTimeline: c }))} />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Contato (Configuração Específica) */}
                {activePage.title === 'Contato' && (
                  <div className="space-y-6">
                    <div className="text-xs text-muted-foreground border p-3 rounded bg-card">
                      Configure quais informações de contato aparecerão nesta página. Os dados são puxados automaticamente das configurações da sua conta.
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-3 border-b border-border/50 pb-4">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase">Telefones</Label>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-normal flex items-center gap-2"><Phone className="h-3 w-3 text-muted-foreground" /> Telefone Principal</Label>
                          <Switch checked={contactConfig.showPhone1} onCheckedChange={(c) => setContactConfig(prev => ({ ...prev, showPhone1: c }))} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-normal flex items-center gap-2"><Phone className="h-3 w-3 text-muted-foreground" /> Telefone Secundário</Label>
                          <Switch checked={contactConfig.showPhone2} onCheckedChange={(c) => setContactConfig(prev => ({ ...prev, showPhone2: c }))} />
                        </div>
                      </div>

                      <div className="space-y-3 border-b border-border/50 pb-4">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase">E-mails</Label>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-normal flex items-center gap-2"><Mail className="h-3 w-3 text-muted-foreground" /> E-mail Comercial</Label>
                          <Switch checked={contactConfig.showEmail1} onCheckedChange={(c) => setContactConfig(prev => ({ ...prev, showEmail1: c }))} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-normal flex items-center gap-2"><Mail className="h-3 w-3 text-muted-foreground" /> E-mail Administrativo</Label>
                          <Switch checked={contactConfig.showEmail2} onCheckedChange={(c) => setContactConfig(prev => ({ ...prev, showEmail2: c }))} />
                        </div>
                      </div>

                      <div className="space-y-3 border-b border-border/50 pb-4">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase">Localização e Formulário</Label>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-normal flex items-center gap-2"><MapPin className="h-3 w-3 text-muted-foreground" /> Mapa de Localização</Label>
                          <Switch checked={contactConfig.showMap} onCheckedChange={(c) => setContactConfig(prev => ({ ...prev, showMap: c }))} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-normal flex items-center gap-2"><MousePointer2 className="h-3 w-3 text-muted-foreground" /> Formulário de Contato</Label>
                          <Switch checked={contactConfig.showForm} onCheckedChange={(c) => setContactConfig(prev => ({ ...prev, showForm: c }))} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* SECTION: ESTRUTURA E PÁGINAS */}
            <AccordionItem value="paginas" className="border-b-0">
              <AccordionTrigger className="px-4 py-3 hover:bg-muted/30 text-sm font-semibold border-b border-border/50">
                <span className="flex items-center gap-2"><LayoutTemplate className="h-4 w-4 text-amber-500" /> Estrutura de Páginas</span>
              </AccordionTrigger>
              <AccordionContent className="p-0 border-b border-border/50">
                <div className="divide-y border-t border-border/50">
                  {/* System pages are static */}
                  {pages.filter(p => p.type === 'system').map((p) => (
                    <div key={p.id} className={cn("flex items-center justify-between px-4 py-3 group hover:bg-muted/30 transition-colors cursor-pointer", activePageId === p.id && "bg-primary/5")} onClick={() => setActivePageId(p.id)}>
                      <div className="flex items-center gap-3">
                        <Settings2 className="h-4 w-4 text-muted-foreground" />
                        <span className={cn("text-sm", activePageId === p.id ? "font-semibold text-primary" : "font-medium text-foreground")}>{p.title}</span>
                      </div>
                    </div>
                  ))}

                  {/* Custom pages are draggable */}
                  <Reorder.Group values={customPagesList} onReorder={handleReorderPages} axis="y" className="divide-y">
                    {customPagesList.map((p) => (
                      <Reorder.Item key={p.id} value={p} className={cn("flex items-center justify-between px-4 py-3 group hover:bg-muted/30 transition-colors cursor-pointer list-none", activePageId === p.id && "bg-primary/5")} onClick={() => setActivePageId(p.id)}>
                        <div className="flex items-center gap-3">
                          <GripVertical className="h-4 w-4 text-muted-foreground/30 cursor-grab active:cursor-grabbing hover:text-muted-foreground transition-colors" />
                          <FileText className="h-4 w-4 text-primary" />
                          <span className={cn("text-sm", activePageId === p.id ? "font-semibold text-primary" : "font-medium text-foreground")}>{p.title}</span>
                          <Badge variant="outline" className="text-[10px] h-4 px-1 py-0 ml-1">Custom</Badge>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive" onClick={(e) => { e.stopPropagation(); setPages(pages.filter(page => page.id !== p.id)); if (activePageId === p.id) setActivePageId(1); }}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                </div>
                <div className="p-4 bg-muted/10">
                  <Button variant="outline" className="w-full gap-2 text-xs" size="sm" onClick={() => setPages([...pages, { id: Date.now(), title: 'Nova Página', type: 'custom', content: '' }])}>
                    <Plus className="h-4 w-4" /> Adicionar Página
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* SECTION: DOMINIO */}
            <AccordionItem value="dominio" className="border-b-0">
              <AccordionTrigger className="px-4 py-3 hover:bg-muted/30 text-sm font-semibold border-b border-border/50">
                <span className="flex items-center gap-2"><Globe className="h-4 w-4 text-rose-500" /> Publicação & Domínio</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-4 space-y-4 bg-muted/10 border-b border-border/50">
                <div className="space-y-4">
                  <Select value={domainType} onValueChange={(v: DomainType) => setDomainType(v)}>
                    <SelectTrigger className="w-full bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Subdomínio Gratuito (.esi.app)</SelectItem>
                      <SelectItem value="custom">Domínio Próprio (.com.br)</SelectItem>
                    </SelectContent>
                  </Select>

                  {domainType === 'auto' ? (
                    <div className="space-y-2 pt-2">
                      <Label className="text-xs">Endereço Web</Label>
                      <div className="flex bg-card border rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-primary focus-within:border-primary">
                        <div className="px-3 bg-muted flex items-center text-xs text-muted-foreground border-r">https://</div>
                        <input type="text" className="flex-1 bg-transparent px-2 text-sm focus:outline-none min-w-0" value={autoDomainPrefix} onChange={(e) => setAutoDomainPrefix(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} />
                        <div className="px-3 bg-muted flex items-center text-xs font-semibold text-muted-foreground border-l">.esi.app</div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 pt-2">
                      <Label className="text-xs">Domínio Existente</Label>
                      <Input value={customDomain} onChange={(e) => setCustomDomain(e.target.value.toLowerCase())} placeholder="www.seudominio.com.br" />
                      <p className="text-[10px] text-muted-foreground mt-1">Configure o CNAME <code className="bg-muted px-1 rounded">cname.esi.app</code> no seu provedor.</p>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </div>

        {/* MAIN PREVIEW AREA */}
        <div className="flex-1 bg-[url('/grid-pattern.svg')] bg-[length:24px_24px] bg-muted/40 relative overflow-hidden flex flex-col">

          <div className="absolute top-4 left-0 w-full flex justify-center z-20 pointer-events-none">
            <Badge variant="outline" className="bg-background/90 backdrop-blur font-mono text-xs py-1 shadow-sm uppercase tracking-widest text-muted-foreground">Preview • {currentTemplateObj.name}</Badge>
          </div>

          <div className={cn(
            "flex-1 overflow-auto w-full flex items-center justify-center p-4 sm:p-8 transition-all duration-500",
            viewMode === 'desktop' ? "items-stretch" : "items-center py-12"
          )}>
            <div
              className={cn(
                "bg-background w-full shadow-2xl rounded-lg overflow-hidden border border-border/80 transition-all duration-500 ease-in-out origin-center relative flex flex-col pointer-events-none", // prevent interaction in mock
                getViewModeWidth()
              )}
              style={{ '--theme-primary': primaryColor, '--theme-secondary': secondaryColor, '--theme-primary-transparent': `${primaryColor}20` } as any}
            >
              {/* Browser Mock Header */}
              <div className="h-8 bg-muted border-b border-border flex items-center px-4 gap-2 flex-none shadow-sm z-50">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                </div>
                <div className="mx-auto bg-background rounded px-3 py-0.5 text-[10px] text-muted-foreground font-mono truncate max-w-[250px] border border-border/50">
                  {currentUrl}{activePageId > 1 ? `/${activePage.title.toLowerCase().replace(/\s+/g, '-')}` : ''}
                </div>
              </div>

              {/* ===== MOCK DYNAMIC RENDERING ===== */}
              <div className="flex-1 w-full overflow-hidden flex flex-col bg-background font-sans relative z-10">

                {/* Simulated Header */}
                <div className={cn(
                  "h-16 flex items-center justify-between px-6 flex-none transition-colors",
                  currentTemplateObj.layout === 'luxury' && "bg-slate-950/80 backdrop-blur-md absolute top-0 w-full z-50 border-b border-white/10",
                  currentTemplateObj.layout === 'classic' && "bg-white border-b-4 shadow-sm",
                  currentTemplateObj.layout === 'minimal' && "bg-background border-b border-border/40"
                )} style={currentTemplateObj.layout === 'classic' ? { borderBottomColor: primaryColor } : {}}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded shrink-0 flex items-center justify-center font-bold text-white shadow-sm" style={{ backgroundColor: primaryColor }}>E</div>
                    <div className={cn("font-bold text-lg hidden sm:block tracking-tight", currentTemplateObj.layout === 'luxury' ? "text-white" : "text-foreground")}>Sua Logo</div>
                  </div>
                  <div className="flex gap-6">
                    {viewMode === 'mobile' ? (
                      <Button variant="ghost" size="icon" className={cn(currentTemplateObj.layout === 'luxury' ? "text-white" : "text-foreground")}><Menu className="h-5 w-5" /></Button>
                    ) : (
                      <>
                        {pages.slice(0, 4).map((p, i) => (
                          <div key={i} className={cn("h-full hover:opacity-100 flex items-center text-xs font-semibold hidden sm:flex cursor-pointer transition-opacity relative",
                            currentTemplateObj.layout === 'luxury' ? "text-white/70" : "text-foreground/70",
                            p.id === activePageId && (currentTemplateObj.layout === 'luxury' ? "text-white" : "text-foreground")
                          )} >
                            {p.title}
                            {p.id === activePageId && currentTemplateObj.layout !== 'luxury' && (
                              <div className="absolute top-[48px] h-1 w-full rounded-t-sm transition-all" style={{ backgroundColor: primaryColor }} />
                            )}
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>

                {/* --- RENDER HOME PAGE MOCK --- */}
                {activePageId === 1 && (
                  <>
                    {/* Simulated Hero */}
                    <div className={cn(
                      "relative flex flex-col items-center justify-center overflow-hidden flex-none px-6 transition-all",
                      currentTemplateObj.layout === 'luxury' && "h-[400px] bg-slate-900 pt-16",
                      currentTemplateObj.layout === 'classic' && "h-[300px] bg-muted/30",
                      currentTemplateObj.layout === 'minimal' && "h-[280px] bg-zinc-50 border-b border-border/20 pt-8"
                    )}>
                      {/* Hero Backgrounds (Fallback or Custom Media) */}
                      {heroMedia ? (
                        heroMediaType === 'video' ? (
                          <div className="absolute inset-0 bg-slate-900 overflow-hidden">
                            <div className="w-full h-full flex items-center justify-center opacity-40 mix-blend-screen bg-center bg-cover" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541888086438-e60da793ff0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')" }}>
                              {/* Mock video frame effect since we can't reliably play random URLs in iframe/video safely on the fly without CORS issues in a mock */}
                              <Video className="h-24 w-24 opacity-30 text-white animate-pulse" />
                            </div>
                          </div>
                        ) : (
                          <div className="absolute inset-0 bg-contain bg-no-repeat bg-center mix-blend-multiply dark:mix-blend-screen" style={{ backgroundImage: `url(${heroMedia})`, opacity: currentTemplateObj.layout === 'minimal' ? 0.8 : 0.9 }} />
                        )
                      ) : (
                        <>
                          {currentTemplateObj.layout === 'luxury' && (
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&w=1200&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay" />
                          )}
                          {currentTemplateObj.layout === 'classic' && (
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&w=1200&q=40')] bg-cover bg-center opacity-10" />
                          )}
                        </>
                      )}

                      {/* Gradient Overlay for Text Readability */}
                      {currentTemplateObj.layout === 'luxury' && <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-900/20" />}
                      {(currentTemplateObj.layout === 'classic' && heroMedia) && <div className="absolute inset-0 bg-black/40" />}

                      <div className="relative z-10 text-center space-y-4 max-w-2xl mx-auto w-full">
                        <h1 className={cn(
                          "text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-balance leading-tight transition-all",
                          currentTemplateObj.layout === 'luxury' && "text-white drop-shadow-xl",
                          currentTemplateObj.layout === 'classic' && (!heroMedia ? "text-slate-900" : "text-white drop-shadow-md"),
                          currentTemplateObj.layout === 'minimal' && "text-zinc-900 font-serif"
                        )}>
                          {heroH1 || "Encontre o imóvel dos seus sonhos"}
                        </h1>

                        {/* Immersive Property Quick Types */}
                        <div className={cn(
                          "flex items-center justify-center gap-2 mt-8",
                          currentTemplateObj.layout === 'minimal' ? "pb-4 border-b border-border/50" : "flex-wrap"
                        )}>
                          {[
                            { icon: Home, label: 'Casas' },
                            { icon: Building2, label: 'Apartamentos' },
                            { icon: MapPin, label: 'Terrenos' }
                          ].map((t, idx) => (
                            <div key={idx} className={cn(
                              "flex flex-col items-center gap-2 p-3 rounded-xl transition-all cursor-pointer shadow-sm",
                              currentTemplateObj.layout === 'luxury' && "bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 text-white/90 w-28",
                              currentTemplateObj.layout === 'classic' && "bg-white shadow h-24 w-28 justify-center border-b-[3px] hover:-translate-y-1 text-slate-700",
                              currentTemplateObj.layout === 'minimal' && "bg-transparent text-zinc-600 hover:text-zinc-900 flex-row px-4 py-2 w-auto shadow-none border border-transparent hover:border-zinc-200"
                            )} style={currentTemplateObj.layout === 'classic' ? { borderBottomColor: primaryColor } : {}}>
                              <t.icon className="h-5 w-5 opacity-80" style={currentTemplateObj.layout === 'classic' ? { color: primaryColor } : {}} />
                              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">{t.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Simulated Search / Filter Bar */}
                    <div className={cn(
                      "mx-auto relative z-20 h-16 flex items-center px-4 gap-4 flex-none transition-all w-[90%] sm:w-[80%]",
                      currentTemplateObj.layout === 'luxury' && "-mt-8 rounded-2xl bg-slate-800/90 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 p-2",
                      currentTemplateObj.layout === 'classic' && "-mt-8 rounded-xl bg-white shadow-xl flex-wrap sm:flex-nowrap border border-slate-100 p-2",
                      currentTemplateObj.layout === 'minimal' && "mt-6 rounded-full bg-zinc-100 border border-zinc-200 shadow-sm"
                    )}>
                      <div className={cn("h-full flex-1 flex items-center px-4 text-xs bg-muted/50 rounded-lg", currentTemplateObj.layout === 'luxury' ? "text-slate-400 border border-white/5" : "text-muted-foreground", currentTemplateObj.layout === 'minimal' && "bg-transparent")}>
                        Buscar por cidade, bairro ou código...
                      </div>
                      <div className={cn(
                        "h-full px-6 rounded-lg font-bold text-xs flex items-center justify-center whitespace-nowrap shadow-sm transition-transform",
                        currentTemplateObj.layout === 'luxury' ? "text-white" :
                          currentTemplateObj.layout === 'classic' ? "uppercase text-white" :
                            "bg-zinc-900 text-zinc-50 rounded-full hover:scale-105"
                      )} style={currentTemplateObj.layout !== 'minimal' ? { backgroundColor: primaryColor } : {}}>
                        Buscar
                      </div>
                    </div>

                    {/* Simulated Properties Grid */}
                    <div className={cn(
                      "flex-1 p-6 sm:p-10 space-y-8",
                      currentTemplateObj.layout === 'luxury' && "bg-slate-950 pt-20 -mt-8",
                      currentTemplateObj.layout === 'classic' && "bg-slate-50 pt-16",
                      currentTemplateObj.layout === 'minimal' && "pt-12"
                    )}>
                      <div className="flex justify-between items-end mb-8">
                        <div className="space-y-2">
                          <h2 className={cn(
                            "text-xl sm:text-3xl font-extrabold tracking-tight",
                            currentTemplateObj.layout === 'luxury' && "text-white",
                            currentTemplateObj.layout === 'classic' && "text-slate-900 border-l-4 pl-4",
                            currentTemplateObj.layout === 'minimal' && "text-zinc-900 font-serif"
                          )} style={currentTemplateObj.layout === 'classic' ? { borderLeftColor: primaryColor } : {}}>Ofertas Exclusivas</h2>
                          <p className={cn(
                            "text-sm hidden sm:block",
                            currentTemplateObj.layout === 'luxury' ? "text-slate-400" : "text-muted-foreground"
                          )}>Selecionadas especialmente para o seu perfil.</p>
                        </div>
                      </div>

                      <div className={cn(
                        "grid gap-6 sm:gap-8",
                        viewMode === 'mobile' ? 'grid-cols-1' : viewMode === 'tablet' ? 'grid-cols-2' : 'grid-cols-3'
                      )}>
                        {[1, 2, 3].map(i => (
                          <div key={i} className={cn(
                            "rounded-2xl overflow-hidden group transition-all",
                            currentTemplateObj.layout === 'luxury' && "bg-slate-900 border border-white/5 hover:border-white/20 shadow-xl",
                            currentTemplateObj.layout === 'classic' && "bg-white border border-border shadow-md hover:-translate-y-1 hover:shadow-xl",
                            currentTemplateObj.layout === 'minimal' && "bg-transparent border-0"
                          )}>
                            <div className={cn(
                              "h-56 relative overflow-hidden bg-muted",
                              currentTemplateObj.layout === 'minimal' && "rounded-2xl"
                            )}>
                              <div className={cn(
                                "absolute top-4 left-4 px-3 py-1 text-[10px] font-bold tracking-widest shadow-lg",
                                currentTemplateObj.layout === 'luxury' && "bg-white/10 backdrop-blur-md rounded text-white border border-white/20",
                                currentTemplateObj.layout === 'classic' && "rounded text-white",
                                currentTemplateObj.layout === 'minimal' && "bg-white/90 rounded-full text-zinc-900 border border-zinc-200"
                              )} style={currentTemplateObj.layout === 'classic' ? { backgroundColor: primaryColor } : {}}>
                                VENDA
                              </div>
                            </div>
                            <div className={cn("p-5 sm:p-6 space-y-4", currentTemplateObj.layout === 'minimal' && "px-1")}>
                              <div className={cn(
                                "text-lg font-bold tracking-tight",
                                currentTemplateObj.layout === 'luxury' && "text-white",
                                currentTemplateObj.layout === 'classic' && "text-slate-900",
                                currentTemplateObj.layout === 'minimal' && "text-zinc-900"
                              )} style={currentTemplateObj.layout === 'classic' ? { color: primaryColor } : {}}>
                                R$ 1.500.000
                              </div>
                              <div className="space-y-2">
                                <div className={cn("w-3/4 h-3 rounded", currentTemplateObj.layout === 'luxury' ? "bg-slate-800" : "bg-muted")} />
                                <div className={cn("w-1/2 h-3 rounded", currentTemplateObj.layout === 'luxury' ? "bg-slate-800" : "bg-muted")} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* --- RENDER CONTENT PAGES MOCK (Sobre, Contato, etc) --- */}
                {activePageId > 2 && (
                  <div className={cn(
                    "flex-1 p-8 sm:p-16",
                    currentTemplateObj.layout === 'luxury' && "bg-slate-950 pt-32",
                    currentTemplateObj.layout === 'classic' && "bg-slate-50",
                    currentTemplateObj.layout === 'minimal' && "bg-zinc-50"
                  )}>
                    <div className="max-w-5xl mx-auto space-y-8">
                      {/* Elegant Header */}
                      <div className="space-y-4 border-b pb-8 border-border/10 text-center sm:text-left">
                        <h1 className={cn(
                          "text-3xl sm:text-5xl font-extrabold tracking-tight",
                          currentTemplateObj.layout === 'luxury' ? "text-white" : "text-foreground"
                        )}>{activePage.title}</h1>
                        {currentTemplateObj.layout === 'classic' && <div className="w-16 h-1.5 rounded-full mx-auto sm:mx-0" style={{ backgroundColor: primaryColor }} />}

                        {activePage.title === 'Contato' && (
                          <p className={cn("mt-4 text-sm sm:text-base", currentTemplateObj.layout === 'luxury' ? 'text-slate-400' : 'text-muted-foreground')}>
                            Entre em contato conosco pelos canais abaixo. Estamos prontos para ajudar.
                          </p>
                        )}
                      </div>

                      {/* Contato Layout Custom */}
                      {activePage.title === 'Contato' ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                          {/* Formulário */}
                          {contactConfig.showForm && (
                            <div className={cn(
                              "p-6 rounded-2xl shadow-sm border",
                              currentTemplateObj.layout === 'luxury' ? "bg-slate-900 border-white/10" : "bg-card border-border/50"
                            )}>
                              <h3 className={cn("text-xl font-bold mb-6", currentTemplateObj.layout === 'luxury' ? "text-white" : "text-foreground")}>Envie uma mensagem</h3>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <Input placeholder="Nome Completo" className={currentTemplateObj.layout === 'luxury' ? "bg-slate-800 border-white/10 text-white placeholder:text-slate-400" : ""} />
                                  <Input placeholder="Telefone" className={currentTemplateObj.layout === 'luxury' ? "bg-slate-800 border-white/10 text-white placeholder:text-slate-400" : ""} />
                                </div>
                                <Input placeholder="E-mail" className={currentTemplateObj.layout === 'luxury' ? "bg-slate-800 border-white/10 text-white placeholder:text-slate-400" : ""} />
                                <Textarea placeholder="Como podemos ajudar?" className={cn("min-h-[120px]", currentTemplateObj.layout === 'luxury' ? "bg-slate-800 border-white/10 text-white placeholder:text-slate-400" : "")} />
                                <Button className="w-full gap-2" style={{ backgroundColor: primaryColor }}><Send className="h-4 w-4" /> Enviar Mensagem</Button>
                              </div>
                            </div>
                          )}

                          {/* Informações de Contato e Mapa */}
                          <div className="space-y-8">
                            {(contactConfig.showPhone1 || contactConfig.showPhone2) && (
                              <div className="flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-primary/10" style={{ color: primaryColor }}><Phone className="h-5 w-5" /></div>
                                <div>
                                  <h4 className={cn("font-bold mb-1", currentTemplateObj.layout === 'luxury' ? "text-slate-200" : "text-foreground")}>Telefones</h4>
                                  {contactConfig.showPhone1 && <p className={currentTemplateObj.layout === 'luxury' ? "text-slate-400" : "text-muted-foreground"}>(11) 99999-9999 <span className="text-xs ml-2 opacity-70">WhatsApp</span></p>}
                                  {contactConfig.showPhone2 && <p className={currentTemplateObj.layout === 'luxury' ? "text-slate-400" : "text-muted-foreground"}>(11) 3333-3333 <span className="text-xs ml-2 opacity-70">Fixo</span></p>}
                                </div>
                              </div>
                            )}

                            {(contactConfig.showEmail1 || contactConfig.showEmail2) && (
                              <div className="flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-primary/10" style={{ color: primaryColor }}><Mail className="h-5 w-5" /></div>
                                <div>
                                  <h4 className={cn("font-bold mb-1", currentTemplateObj.layout === 'luxury' ? "text-slate-200" : "text-foreground")}>E-mails</h4>
                                  {contactConfig.showEmail1 && <p className={currentTemplateObj.layout === 'luxury' ? "text-slate-400" : "text-muted-foreground"}>contato@suaimobiliaria.com.br</p>}
                                  {contactConfig.showEmail2 && <p className={currentTemplateObj.layout === 'luxury' ? "text-slate-400" : "text-muted-foreground"}>adm@suaimobiliaria.com.br</p>}
                                </div>
                              </div>
                            )}

                            {contactConfig.showMap && (
                              <div className="flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-primary/10" style={{ color: primaryColor }}><MapPin className="h-5 w-5" /></div>
                                <div className="w-full">
                                  <h4 className={cn("font-bold mb-1", currentTemplateObj.layout === 'luxury' ? "text-slate-200" : "text-foreground")}>Localização</h4>
                                  <p className={cn("mb-4", currentTemplateObj.layout === 'luxury' ? "text-slate-400" : "text-muted-foreground")}>Av. Paulista, 1000 - Bela Vista<br />São Paulo - SP</p>
                                  <div className="w-full h-48 rounded-xl overflow-hidden bg-muted relative">
                                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-80" />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                      <MapPin className="h-10 w-10 text-primary drop-shadow-md pb-2 animate-bounce" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : <div className={cn(
                        "flex flex-col gap-8 items-start",
                        activePage.image && "lg:flex-row"
                      )}>

                        <div className={cn(
                          "prose prose-sm sm:prose-base leading-loose flex-1",
                          currentTemplateObj.layout === 'luxury' ? "text-slate-300" : "text-muted-foreground",
                          !activePage.image && "mx-auto text-center sm:text-left max-w-3xl"
                        )}>
                          {activePage.content ? (
                            <p className="whitespace-pre-line">{activePage.content}</p>
                          ) : (
                            <p className="opacity-50 italic">O conteúdo da página será exibido aqui.</p>
                          )}
                        </div>

                        {activePage.image && (
                          <div className={cn(
                            "w-full lg:w-1/2 rounded-2xl overflow-hidden shadow-sm relative shrink-0",
                            currentTemplateObj.layout === 'luxury' && "ring-1 ring-white/10"
                          )}>
                            <img src={activePage.image} alt={activePage.title} className="w-full h-auto max-h-[500px] object-contain object-scale-down rounded-2xl" />
                            {currentTemplateObj.layout === 'luxury' && <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl" />}
                          </div>
                        )}

                      </div>
                      }

                      {/* Extensões Específicas "Sobre Nós" */}
                      {activePage.title === 'Sobre Nós' && (
                        <div className="flex flex-col gap-16 pt-12 border-t border-border/10 mt-12 w-full">

                          {sobreConfig.showStats && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                              {[
                                { label: 'Imóveis Vendidos', value: '+500' },
                                { label: 'Anos de Mercado', value: '15' },
                                { label: 'Corretores', value: '25' },
                                { label: 'Clientes Satisfeitos', value: '98%' }
                              ].map((stat, i) => (
                                <div key={i} className={cn("p-6 rounded-2xl", currentTemplateObj.layout === 'luxury' ? 'bg-slate-900 border border-white/5' : 'bg-card border')}>
                                  <div className="text-3xl font-extrabold mb-2" style={{ color: primaryColor }}>{stat.value}</div>
                                  <div className={cn("text-xs uppercase tracking-wider font-semibold", currentTemplateObj.layout === 'luxury' ? 'text-slate-400' : 'text-muted-foreground')}>{stat.label}</div>
                                </div>
                              ))}
                            </div>
                          )}

                          {sobreConfig.showTeam && (
                            <div className="space-y-8">
                              <div className="text-center">
                                <h3 className={cn("text-2xl font-bold", currentTemplateObj.layout === 'luxury' ? 'text-white' : 'text-foreground')}>Nossa Equipe</h3>
                                <p className={cn("mt-2", currentTemplateObj.layout === 'luxury' ? 'text-slate-400' : 'text-muted-foreground')}>Os melhores especialistas ao seu dispor</p>
                              </div>
                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                {[1, 2, 3, 4].map(t => (
                                  <div key={t} className="text-center space-y-3">
                                    <div className="w-24 h-24 mx-auto rounded-full bg-muted border-2 overflow-hidden" style={{ borderColor: primaryColor }}>
                                      <img src={`https://i.pravatar.cc/150?img=${t + 10}`} alt="Equipe" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                      <div className={cn("font-bold text-sm", currentTemplateObj.layout === 'luxury' ? 'text-white' : 'text-foreground')}>Corretor {t}</div>
                                      <div className="text-xs text-muted-foreground">Especialista</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {sobreConfig.showTimeline && (
                            <div className="space-y-8">
                              <div className="text-center">
                                <h3 className={cn("text-2xl font-bold", currentTemplateObj.layout === 'luxury' ? 'text-white' : 'text-foreground')}>Nossa História</h3>
                              </div>
                              <div className={cn("p-8 rounded-2xl relative overflow-hidden", currentTemplateObj.layout === 'luxury' ? 'bg-slate-900 border border-white/5' : 'bg-card border')}>
                                <div className="absolute left-1/2 -ml-px top-0 bottom-0 w-0.5 bg-border/50"></div>
                                <div className="space-y-8 relative">
                                  {[
                                    { year: '2010', desc: 'Fundação da empresa na Avenida Principal' },
                                    { year: '2015', desc: 'Expansão com a primeira filial aberta' },
                                    { year: '2023', desc: 'Marca de 500 imóveis comercializados' },
                                  ].map((item, i) => (
                                    <div key={i} className={cn("flex w-full", i % 2 === 0 ? "justify-start" : "justify-end")}>
                                      <div className={cn("w-1/2 relative", i % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left")}>
                                        <div className="absolute top-1/2 -mt-1.5 w-3 h-3 rounded-full z-10" style={{ left: i % 2 === 0 ? 'auto' : '-6px', right: i % 2 === 0 ? '-6px' : 'auto', backgroundColor: primaryColor }} />
                                        <div className={cn("font-bold text-xl", currentTemplateObj.layout === 'luxury' ? 'text-white' : 'text-foreground')}>{item.year}</div>
                                        <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* --- RENDER IMÓVEIS PAGE MOCK --- */}
                {activePageId === 2 && (
                  <div className={cn(
                    "flex-1 p-8 flex flex-col items-center justify-center space-y-4",
                    currentTemplateObj.layout === 'luxury' ? "bg-slate-950" : "bg-muted/10"
                  )}>
                    <Building2 className={cn("h-16 w-16 opacity-20", currentTemplateObj.layout === 'luxury' && "text-white")} />
                    <p className={cn("font-medium", currentTemplateObj.layout === 'luxury' ? "text-slate-400" : "text-muted-foreground")}>Página de Busca Dinâmica (Catálogo de Imóveis)</p>
                  </div>
                )}

                {/* Simulated Footer */}
                <div className={cn(
                  "py-16 px-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10",
                  currentTemplateObj.layout === 'luxury' && "bg-slate-900 border-t border-white/5",
                  currentTemplateObj.layout === 'classic' && "bg-slate-900 text-white",
                  currentTemplateObj.layout === 'minimal' && "bg-white border-t border-border/50 text-zinc-900 mt-12"
                )}>
                  <div className="space-y-4 max-w-xs">
                    <div className={cn(
                      "w-12 h-12 rounded flex items-center justify-center font-bold text-lg",
                      currentTemplateObj.layout === 'minimal' ? "bg-zinc-100" : "bg-white/10"
                    )} style={currentTemplateObj.layout !== 'minimal' ? { color: primaryColor } : {}}>E</div>
                    <p className={cn(
                      "text-sm leading-relaxed",
                      currentTemplateObj.layout === 'minimal' ? "text-zinc-500" : "text-slate-400"
                    )}>Experiência completa e transparente na busca e gestão do seu novo lar.</p>
                  </div>

                  <div className="flex gap-16 text-sm">
                    <div className="space-y-4">
                      <div className={cn("font-bold tracking-wider", currentTemplateObj.layout === 'minimal' ? "text-zinc-900" : "text-white")}>Empresa</div>
                      <div className={cn("space-y-3", currentTemplateObj.layout === 'minimal' ? "text-zinc-500" : "text-slate-400")}>
                        {pages.slice(2).map(p => (
                          <div key={p.id}>{p.title}</div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className={cn("font-bold tracking-wider", currentTemplateObj.layout === 'minimal' ? "text-zinc-900" : "text-white")}>Legal</div>
                      <div className={cn("space-y-3", currentTemplateObj.layout === 'minimal' ? "text-zinc-500" : "text-slate-400")}>
                        <div>Termos de Uso</div>
                        <div>Privacidade</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
