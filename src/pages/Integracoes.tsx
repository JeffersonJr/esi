import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Network, Globe, Share2, Megaphone, CheckCircle2, Settings, AlertCircle, Building2, Smartphone, Code } from 'lucide-react';
import { cn } from '@/lib/utils';

// Dados mockados
const portais = [
  { id: 'zap', name: 'ZAP Imóveis', desc: 'Maior portal imobiliário do Brasil', active: true, color: 'bg-[#F26522]', icon: Building2 },
  { id: 'imovelweb', name: 'Imovelweb', desc: 'Portal com grande alcance nacional', active: true, color: 'bg-[#E3000F]', icon: Building2 },
  { id: 'vivareal', name: 'Viva Real', desc: 'Especializado em aluguel e venda', active: false, color: 'bg-[#003B70]', icon: Building2 },
  { id: 'orulo', name: 'Órulo', desc: 'Plataforma líder em lançamentos imobiliários', active: true, color: 'bg-[#7E3AF2]', icon: Building2 },
  { id: 'chavesnamao', name: 'Chaves na Mão', desc: 'Portal em grande crescimento', active: true, color: 'bg-[#FF9100]', icon: Building2 },
  { id: 'olx', name: 'OLX', desc: 'Maior site de classificados', active: false, color: 'bg-[#6E0AD6]', icon: Building2 },
  { id: 'ml', name: 'Mercado Livre', desc: 'Classificados Mercado Livre', active: true, color: 'bg-[#FFE600] text-blue-900', icon: Building2 },
  { id: 'xmlevolves', name: 'XML Evolves', desc: 'Link XML padrão Evolves para portais diversos', active: false, color: 'bg-primary', icon: Code, emBreve: true },
];

const redesSociais = [
  { id: 'facebook', name: 'Facebook Ads', desc: 'Anúncios na rede Meta', active: true, color: 'bg-blue-600', icon: Share2 },
  { id: 'google', name: 'Google Ads', desc: 'Rede de pesquisa e display', active: true, color: 'bg-emerald-600', icon: Globe },
  { id: 'instagram', name: 'Instagram', desc: 'Catálogo de imóveis e stories', active: false, color: 'bg-pink-600', icon: Share2 },
  { id: 'tiktok', name: 'TikTok Ads', desc: 'Vídeos curtos de imóveis', active: false, color: 'bg-black dark:bg-white dark:text-black', icon: Smartphone },
];

export function Integracoes() {
  const [activeTab, setActiveTab] = useState('portais');
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardPortal, setWizardPortal] = useState<any>(null);
  const [wizardStep, setWizardStep] = useState(1);

  const navigate = useNavigate();

  const handleConfigurar = (item: any, isSocial: boolean = false) => {
    if (item.emBreve) return;

    if (!item.active) {
      setWizardPortal({ ...item, isSocial });
      setWizardStep(1);
      setWizardOpen(true);
      return;
    }

    if (isSocial) {
      navigate(`/integracoes/redesocial/${item.id}`);
    } else {
      navigate(`/integracoes/portal/${item.id}`);
    }
  };

  const renderLogo = (item: any) => {
    const imageMap: Record<string, string> = {
      zap: 'zap.svg',
      imovelweb: 'imóvelweb.svg',
      vivareal: 'viva real.svg',
      orulo: 'órulo.svg',
      ml: 'meli.svg',
      olx: 'olx.svg',
      chavesnamao: 'chavesnamao.svg'
    };

    if (imageMap[item.id]) {
      return (
        <img
          src={`/images/portais/${imageMap[item.id]}`}
          alt={item.name}
          className="w-full h-full object-contain p-1"
        />
      );
    }

    const socialImageMap: Record<string, string> = {
      facebook: 'meta.svg',
      google: 'google.svg',
      instagram: 'instagram.svg',
      tiktok: 'tiktok.svg'
    };

    if (socialImageMap[item.id]) {
      return (
        <img
          src={`/images/social/${socialImageMap[item.id]}`}
          alt={item.name}
          className="w-full h-full object-contain p-2"
        />
      );
    }

    return <item.icon className="h-6 w-6" />;
  };

  const renderCard = (item: any, isSocial: boolean = false) => {
    const isImage = item.id !== 'properati' && item.id !== 'trovit' && item.id !== 'mitula' && item.id !== 'imovelguide' && item.id !== 'dfimoveis';

    return (
      <Card key={item.id} className="border-border/50 shadow-sm hover:shadow-md transition-all duration-200 bg-card overflow-hidden flex flex-col">
        <CardHeader className="pb-4 relative">
          <div className="flex justify-between items-start mb-2">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border border-border/50 overflow-hidden select-none", isImage ? 'bg-white' : item.color, !isImage && 'text-white shadow-md')}>
              {renderLogo(item)}
            </div>
            {item.emBreve ? (
              <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none font-bold text-[10px] uppercase">Em Breve</Badge>
            ) : (
              <Switch checked={item.active} onCheckedChange={() => !item.active && handleConfigurar(item, isSocial)} className="data-[state=checked]:bg-emerald-500" />
            )}
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
            disabled={item.emBreve}
            className={cn("w-full shadow-md font-semibold", item.active ? "bg-primary hover:bg-primary/90 text-white" : "bg-muted text-muted-foreground")}
            onClick={() => !item.emBreve && handleConfigurar(item, isSocial)}
          >
            <Settings className="w-4 h-4 mr-2" /> {item.active ? 'Configurar Regras' : (item.emBreve ? 'Em Breve' : 'Ativar Integração')}
          </Button>
        </CardFooter>
      </Card>
    );
  };

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {portais.map(p => renderCard(p, false))}
            </div>
          </TabsContent>

          <TabsContent value="ads" className="m-0 focus-visible:outline-none space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {redesSociais.map(rs => renderCard(rs, true))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* WIZARD PARA ATIVAR PORTAL OU REDE SOCIAL */}
      <Dialog open={wizardOpen} onOpenChange={setWizardOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ativar {wizardPortal?.name}</DialogTitle>
            <DialogDescription>
              {wizardPortal?.isSocial ? 'Siga os passos para conectar sua conta.' : 'Configure sua integração em 3 passos rápidos.'}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {wizardPortal?.isSocial ? (
              // WIZARD SOCIAL
              <div className="animate-in fade-in slide-in-from-right-4 space-y-4">
                {wizardPortal.id === 'google' && (
                  <>
                    <h4 className="font-bold text-lg">Conectar Google Ads</h4>
                    {wizardStep === 1 ? (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">Faça login com sua conta do Google para ter acesso às suas campanhas.</p>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setWizardStep(2)}>
                          Entrar com o Google
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">Conta conectada! Selecione a campanha padrão.</p>
                        <Select>
                          <SelectTrigger><SelectValue placeholder="Selecione uma campanha" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="c1">Campanha Lançamentos (ID: 992-123)</SelectItem>
                            <SelectItem value="c2">Campanha Remarketing (ID: 992-124)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </>
                )}
                {wizardPortal.id === 'facebook' && (
                  <>
                    <h4 className="font-bold text-lg">Conectar Facebook Ads (Meta)</h4>
                    {wizardStep === 1 ? (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">Faça login no Facebook para selecionar seu Business Manager (BM).</p>
                        <Button className="w-full bg-blue-800 hover:bg-blue-900 text-white" onClick={() => setWizardStep(2)}>
                          Entrar com Facebook
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">Selecione o seu Gerenciador de Negócios (BM).</p>
                        <Select>
                          <SelectTrigger><SelectValue placeholder="Selecione um BM" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bm1">Imobiliária Principal BM</SelectItem>
                            <SelectItem value="bm2">Corretores Parceiros BM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </>
                )}
                {(wizardPortal.id === 'instagram' || wizardPortal.id === 'tiktok') && (
                  <>
                    <h4 className="font-bold text-lg">Conectar {wizardPortal.name}</h4>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">Insira suas credenciais de acesso.</p>
                      <div className="space-y-2">
                        <Label>Nome de Usuário</Label>
                        <Input placeholder="@seu_usuario" />
                      </div>
                      <div className="space-y-2">
                        <Label>Senha</Label>
                        <Input type="password" placeholder="••••••••" />
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              // WIZARD PORTAIS (3 passos)
              <>
                <div className="flex gap-2 mb-6">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex-1">
                      <div className={cn("h-2 rounded-full", wizardStep >= step ? "bg-primary" : "bg-muted")} />
                    </div>
                  ))}
                </div>

                {wizardStep === 1 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <h4 className="font-bold text-lg">Sobre o Portal</h4>
                    <p className="text-sm text-muted-foreground">{wizardPortal?.desc}</p>
                    <div className="p-4 bg-muted/30 rounded-xl border border-border/50 flex gap-4 items-center">
                      <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center border", wizardPortal?.color)}>
                        {wizardPortal && renderLogo(wizardPortal)}
                      </div>
                      <div className="text-sm font-medium">Você está prestes a integrar seus imóveis com o portal {wizardPortal?.name}.</div>
                    </div>
                  </div>
                )}

                {wizardStep === 2 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <h4 className="font-bold text-lg">E-mail Cadastrado</h4>
                    <p className="text-sm text-muted-foreground">Insira o e-mail que você utiliza para acessar o painel do {wizardPortal?.name}. Solicitamos dupla confirmação.</p>
                    <div className="space-y-2">
                      <Label>E-mail do portal</Label>
                      <Input type="email" placeholder="contato@imobiliaria.com.br" />
                    </div>
                    <div className="space-y-2">
                      <Label>Confirme o e-mail</Label>
                      <Input type="email" placeholder="contato@imobiliaria.com.br" />
                    </div>
                  </div>
                )}

                {wizardStep === 3 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <h4 className="font-bold text-lg">Configurações de Cota</h4>
                    <p className="text-sm text-muted-foreground">Defina o volume contratado. Exemplo (Super Destaque, Destaque, Simples).</p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Simples</Label>
                        <Input type="number" defaultValue="100" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Destaque</Label>
                        <Input type="number" defaultValue="20" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Super Destaque</Label>
                        <Input type="number" defaultValue="5" />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <DialogFooter>
            {wizardPortal?.isSocial ? (
              <>
                 {((wizardPortal.id === 'google' || wizardPortal.id === 'facebook') && wizardStep === 2) && (
                   <Button variant="outline" onClick={() => setWizardStep(1)}>Voltar</Button>
                 )}
                 {((wizardPortal.id === 'google' || wizardPortal.id === 'facebook') && wizardStep === 1) ? null : (
                   <Button className="bg-primary text-white" onClick={() => {
                     setWizardOpen(false);
                     navigate(`/integracoes/redesocial/${wizardPortal?.id}`);
                   }}>Conectar Conta</Button>
                 )}
              </>
            ) : (
              <>
                {wizardStep > 1 && (
                  <Button variant="outline" onClick={() => setWizardStep(s => s - 1)}>Voltar</Button>
                )}
                {wizardStep < 3 ? (
                  <Button onClick={() => setWizardStep(s => s + 1)}>Próximo Passo</Button>
                ) : (
                  <Button className="bg-primary text-white" onClick={() => {
                    setWizardOpen(false);
                    navigate(`/integracoes/portal/${wizardPortal?.id}`);
                  }}>Finalizar e Ativar</Button>
                )}
              </>
            )}
          </DialogFooter>
        </DialogContent>

      </Dialog>
    </div>
  );
}
