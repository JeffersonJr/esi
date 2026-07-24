import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Network, Globe, Share2, Megaphone, CheckCircle2, Settings, AlertCircle, Building2, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';

// Dados mockados
const portais = [
  { id: 'zap', name: 'ZAP Imóveis', desc: 'Maior portal imobiliário do Brasil', active: true, color: 'bg-orange-500', icon: Building2 },
  { id: 'imovelweb', name: 'Imovelweb', desc: 'Portal com grande alcance nacional', active: true, color: 'bg-red-500', icon: Building2 },
  { id: 'vivareal', name: 'Viva Real', desc: 'Especializado em aluguel e venda', active: false, color: 'bg-blue-600', icon: Building2 },
  { id: 'chavesnamao', name: 'Chaves na Mão', desc: 'Portal em grande crescimento', active: true, color: 'bg-yellow-500', icon: Building2 },
  { id: 'olx', name: 'OLX', desc: 'Maior site de classificados', active: false, color: 'bg-purple-600', icon: Building2 },
  { id: 'ml', name: 'Mercado Livre', desc: 'Classificados Mercado Livre', active: true, color: 'bg-yellow-400', icon: Building2 },
  { id: 'properati', name: 'Properati', desc: 'Portal focado na américa latina', active: false, color: 'bg-slate-800', icon: Building2 },
  { id: 'trovit', name: 'Trovit', desc: 'Buscador de anúncios classificados', active: false, color: 'bg-blue-400', icon: Building2 },
  { id: 'mitula', name: 'Mitula', desc: 'Agregador global de anúncios', active: false, color: 'bg-emerald-500', icon: Building2 },
  { id: 'imovelguide', name: 'ImovelGuide', desc: 'Guia de imóveis e corretores', active: false, color: 'bg-blue-800', icon: Building2 },
  { id: 'dfimoveis', name: 'DFImóveis', desc: 'Líder no Distrito Federal', active: false, color: 'bg-cyan-600', icon: Building2 },
];

const redesSociais = [
  { id: 'facebook', name: 'Facebook Ads', desc: 'Anúncios na rede Meta', active: true, color: 'bg-blue-600', icon: Share2 },
  { id: 'google', name: 'Google Ads', desc: 'Rede de pesquisa e display', active: true, color: 'bg-emerald-600', icon: Globe },
  { id: 'instagram', name: 'Instagram', desc: 'Catálogo de imóveis e stories', active: false, color: 'bg-pink-600', icon: Share2 },
  { id: 'tiktok', name: 'TikTok Ads', desc: 'Vídeos curtos de imóveis', active: false, color: 'bg-black dark:bg-white dark:text-black', icon: Smartphone },
];

export function Integracoes() {
  const [activeTab, setActiveTab] = useState('portais');
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [selectedPortal, setSelectedPortal] = useState<any>(null);
  
  // Estado para simular as configurações
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [valorMinimo, setValorMinimo] = useState('');

  const handleConfigurar = (portal: any) => {
    setSelectedPortal(portal);
    setConfigModalOpen(true);
  };

  const renderCard = (item: any) => (
    <Card key={item.id} className="border-border/50 shadow-sm hover:shadow-md transition-all duration-200 bg-card overflow-hidden flex flex-col">
      <CardHeader className="pb-4 relative">
        <div className="flex justify-between items-start mb-2">
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm", item.color)}>
            <item.icon className="h-6 w-6" />
          </div>
          <Switch checked={item.active} className="data-[state=checked]:bg-emerald-500" />
        </div>
        <CardTitle className="text-lg">{item.name}</CardTitle>
        <CardDescription className="text-sm line-clamp-1">{item.desc}</CardDescription>
      </CardHeader>
      <CardContent className="pb-4 pt-0 flex-1">
        <div className="flex items-center gap-2 mt-2">
          {item.active ? (
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800">
              <CheckCircle2 className="w-3 h-3 mr-1" /> Ativo
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800">
              <AlertCircle className="w-3 h-3 mr-1" /> Inativo
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-4">
        <Button 
          variant="secondary" 
          className="w-full bg-muted/50 hover:bg-muted font-medium"
          onClick={() => handleConfigurar(item)}
        >
          <Settings className="w-4 h-4 mr-2 text-muted-foreground" /> Configurar Regras
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="flex flex-col min-h-full">
      <div className="max-w-[1400px] w-full mx-auto px-6 pt-4">
        <PageHeader
          title="Canais & Integrações"
          subtitle="Gerencie a distribuição dos seus imóveis em portais e redes sociais"
          icon={<Network />}
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Integrações' }
          ]}
        />
      </div>

      <div className="max-w-[1400px] w-full mx-auto px-6 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
          <TabsList className="bg-muted/50 p-1 border border-border/50 rounded-xl h-auto flex-wrap">
            <TabsTrigger value="portais" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Building2 className="w-4 h-4 mr-2" />
              Portais Imobiliários
            </TabsTrigger>
            <TabsTrigger value="ads" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Megaphone className="w-4 h-4 mr-2" />
              Redes e Ads
            </TabsTrigger>
          </TabsList>

          <TabsContent value="portais" className="m-0 focus-visible:outline-none space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-primary/5 border border-primary/20 p-4 rounded-2xl gap-4">
              <div>
                <h3 className="font-bold text-primary text-lg">Distribuição Automática</h3>
                <p className="text-sm text-muted-foreground">Seus imóveis ativos são enviados a cada 4 horas para os portais configurados.</p>
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20 shrink-0">
                Forçar Sincronização
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {portais.map(renderCard)}
            </div>
          </TabsContent>

          <TabsContent value="ads" className="m-0 focus-visible:outline-none space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {redesSociais.map(renderCard)}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de Configuração de Regras */}
      <Dialog open={configModalOpen} onOpenChange={setConfigModalOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-border/50">
          <div className="p-6 bg-muted/30 border-b border-border/50">
            <div className="flex items-center gap-4">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md", selectedPortal?.color)}>
                {selectedPortal?.icon && <selectedPortal.icon className="h-7 w-7" />}
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">{selectedPortal?.name}</DialogTitle>
                <DialogDescription>Regras de publicação automática</DialogDescription>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="space-y-3">
              <Label className="text-base font-semibold">Quais imóveis enviar?</Label>
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger className="w-full bg-background">
                  <SelectValue placeholder="Selecione uma regra" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os imóveis ativos</SelectItem>
                  <SelectItem value="exclusivos">Apenas imóveis exclusivos</SelectItem>
                  <SelectItem value="venda">Apenas imóveis para Venda</SelectItem>
                  <SelectItem value="locacao">Apenas imóveis para Locação</SelectItem>
                  <SelectItem value="valor_minimo">Filtrar por Valor Mínimo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filtroTipo === 'valor_minimo' && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                <Label className="text-sm font-medium">Valor mínimo do imóvel (R$)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">R$</span>
                  <input 
                    type="number"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
                    placeholder="500.000"
                    value={valorMinimo}
                    onChange={(e) => setValorMinimo(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="space-y-4 pt-4 border-t border-border/50">
              <h4 className="font-semibold text-sm">Opções Adicionais</h4>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enviar Empreendimentos</Label>
                  <p className="text-xs text-muted-foreground">Publicar também os lançamentos.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Ocultar Endereço</Label>
                  <p className="text-xs text-muted-foreground">Não enviar rua e número exato.</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Marca d'água nas fotos</Label>
                  <p className="text-xs text-muted-foreground">Aplicar sua logo automaticamente.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
          
          <DialogFooter className="p-6 pt-2 bg-muted/10 border-t border-border/50">
            <Button variant="outline" onClick={() => setConfigModalOpen(false)}>Cancelar</Button>
            <Button onClick={() => setConfigModalOpen(false)} className="bg-primary hover:bg-primary/90 text-white">
              Salvar Regras
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
