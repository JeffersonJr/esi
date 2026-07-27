import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  ArrowLeft,
  Search,
  CheckCircle2,
  Share2,
  CalendarDays,
  Image as ImageIcon,
  MessageSquare,
  TrendingUp,
  Settings,
  DollarSign,
  Smartphone,
  Bot
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

// Mock Socials
const redesSociais = [
  { id: 'facebook', name: 'Facebook Ads', active: true, color: 'bg-blue-600', icon: Share2 },
  { id: 'google', name: 'Google Ads', active: true, color: 'bg-emerald-600', icon: Share2 },
  { id: 'instagram', name: 'Instagram', active: false, color: 'bg-pink-600', icon: Share2 },
  { id: 'tiktok', name: 'TikTok Ads', active: false, color: 'bg-black dark:bg-white dark:text-black', icon: Smartphone },
];

const mockImoveis = [
  { id: '1', ref: 'AP001', titulo: 'Apartamento 3 Quartos em Pinheiros', tipo: 'Apartamento', valor: 'R$ 850.000', status: 'busca' },
  { id: '2', ref: 'CA045', titulo: 'Casa de Condomínio Fechado', tipo: 'Casa', valor: 'R$ 1.200.000', status: 'criacao' },
  { id: '3', ref: 'CO009', titulo: 'Cobertura Duplex Vila Nova', tipo: 'Cobertura', valor: 'R$ 3.500.000', status: 'fila', dataPublicacao: '2024-05-15 10:00', tipoPost: 'Reels' },
  { id: '4', ref: 'TE012', titulo: 'Terreno Comercial Centro', tipo: 'Terreno', valor: 'R$ 4.000.000', status: 'publicado', dataPublicacao: '2024-05-10 14:00', tipoPost: 'Feed' },
];

export default function RedeSocialDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const redeAtual = redesSociais.find(p => p.id === id) || redesSociais[0];
  const [activeTab, setActiveTab] = useState('busca');
  const [impulsionar, setImpulsionar] = useState(false);

  const renderLogo = (item: any) => {
    if (item.id === 'facebook') return <span className="font-bold text-[18px]">f</span>;
    if (item.id === 'google') return <span className="font-bold text-[18px]">G</span>;
    if (item.id === 'instagram') return <span className="font-bold text-[18px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 text-transparent bg-clip-text drop-shadow-sm">ig</span>;
    if (item.id === 'tiktok') return <span className="font-bold text-[14px]">TikTok</span>;
    return <item.icon className="h-6 w-6" />;
  };

  const handleProgramar = () => {
    toast({
      title: 'Post Programado!',
      description: 'O anúncio foi adicionado à fila de publicações.',
    });
    setActiveTab('fila');
  };

  return (
    <div className="flex flex-col min-h-full pb-10">
      <div className="max-w-[1400px] w-full mx-auto px-6 pt-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/integracoes')} className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className={cn("w-14 h-10 rounded-2xl flex items-center justify-center text-white shadow-md select-none", redeAtual.color)}>
              {renderLogo(redeAtual)}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{redeAtual.name}</h1>
              <p className="text-sm text-muted-foreground">Criação, edição e tráfego pago</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Alternar rede:</span>
            <Select value={id} onValueChange={(val) => navigate(`/integracoes/redesocial/${val}`)}>
              <SelectTrigger className="w-[180px] bg-background">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {redesSociais.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] w-full mx-auto px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
          <TabsList className="bg-muted/50 p-1 border border-border/50 rounded-xl h-auto flex-wrap">
            <TabsTrigger value="busca" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">Busca de Imóveis</TabsTrigger>
            <TabsTrigger value="criacao" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">Criação de Anúncio</TabsTrigger>
            <TabsTrigger value="fila" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">Fila e Publicados</TabsTrigger>
            <TabsTrigger value="desempenho" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">Desempenho</TabsTrigger>
            <TabsTrigger value="config" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">Configurações</TabsTrigger>
          </TabsList>

          {/* TAB: Busca de Imóveis */}
          <TabsContent value="busca" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Selecione o Imóvel</h3>
                <p className="text-sm text-muted-foreground">Escolha um imóvel da sua carteira para criar um post ou anúncio.</p>
              </div>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Buscar por ref ou título..." className="pl-9 bg-background" />
              </div>
            </div>
            
            <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>Ref</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockImoveis.filter(i => i.status === 'busca').map(imovel => (
                    <TableRow key={imovel.id}>
                      <TableCell className="font-medium text-muted-foreground">{imovel.ref}</TableCell>
                      <TableCell className="font-semibold">{imovel.titulo}</TableCell>
                      <TableCell>{imovel.tipo}</TableCell>
                      <TableCell>{imovel.valor}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" className="h-8 rounded-full border-primary/20 text-primary hover:bg-primary/5" onClick={() => setActiveTab('criacao')}>
                          Criar Anúncio
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* TAB: Criação de Anúncio */}
          <TabsContent value="criacao" className="space-y-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Editor de Anúncio</h3>
              <p className="text-sm text-muted-foreground">Personalize o formato, legenda e impulsionamento do post para {redeAtual.name}.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form Col */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-border/50 shadow-sm">
                  <CardHeader className="pb-3 border-b border-border/40">
                    <CardTitle className="text-base flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Formato e Mídia</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    <div className="space-y-2">
                      <Label>Selecione o Formato</Label>
                      <Select defaultValue="feed_quadrado">
                        <SelectTrigger className="bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="feed_quadrado">Feed (Quadrado 1:1)</SelectItem>
                          <SelectItem value="stories">Stories / Reels (Vertical 9:16)</SelectItem>
                          <SelectItem value="carrossel">Carrossel (Múltiplas Fotos)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="h-32 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
                      <ImageIcon className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">Clique para selecionar as fotos do imóvel</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 shadow-sm">
                  <CardHeader className="pb-3 border-b border-border/40">
                    <CardTitle className="text-base flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Legenda do Post</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-2">
                    <Label className="flex justify-between">Texto do Anúncio <span className="text-muted-foreground font-normal">280 / 2200 char</span></Label>
                    <Textarea 
                      className="min-h-[120px] resize-none bg-background" 
                      defaultValue="Lindo imóvel disponível! 🏡&#10;&#10;Agende sua visita e venha conhecer seu novo lar.&#10;&#10;👉 Clique no link da bio para mais informações.&#10;#imoveis #corretor #casa"
                    />
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="rounded-full text-xs h-7"><Bot className="w-3 h-3 mr-1"/> Gerar com IA</Button>
                      <Button variant="outline" size="sm" className="rounded-full text-xs h-7">Inserir Hashtags</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 shadow-sm overflow-hidden">
                  <CardHeader className="pb-3 border-b border-border/40 bg-muted/10">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-600" /> Impulsionar Anúncio (Tráfego Pago)</CardTitle>
                        <CardDescription>Ative para definir um orçamento e alcançar mais pessoas na região.</CardDescription>
                      </div>
                      <Switch checked={impulsionar} onCheckedChange={setImpulsionar} className="data-[state=checked]:bg-emerald-600" />
                    </div>
                  </CardHeader>
                  {impulsionar && (
                    <CardContent className="pt-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Orçamento Diário (R$)</Label>
                          <Input type="number" defaultValue="20" className="bg-background" />
                        </div>
                        <div className="space-y-2">
                          <Label>Duração (Dias)</Label>
                          <Input type="number" defaultValue="7" className="bg-background" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Público Alvo (Raio em KM)</Label>
                        <Select defaultValue="10km">
                          <SelectTrigger className="bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5km">Raio de 5 KM do imóvel</SelectItem>
                            <SelectItem value="10km">Raio de 10 KM do imóvel</SelectItem>
                            <SelectItem value="cidade">Toda a cidade</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>

              {/* Preview Col */}
              <div className="space-y-4">
                <Card className="border-border/50 shadow-sm sticky top-6 bg-muted/10">
                  <CardHeader className="pb-3 border-b border-border/40">
                    <CardTitle className="text-base text-center">Preview do Anúncio</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="bg-background border border-border/50 rounded-xl overflow-hidden shadow-sm">
                      <div className="p-3 flex items-center gap-2 border-b border-border/30">
                        <div className="w-8 h-8 rounded-full bg-primary/20" />
                        <div className="flex flex-col">
                          <span className="text-xs font-bold">Sua Imobiliária</span>
                          <span className="text-[10px] text-muted-foreground">Patrocinado</span>
                        </div>
                      </div>
                      <div className="aspect-square bg-muted flex items-center justify-center">
                        <ImageIcon className="w-10 h-10 text-muted-foreground/30" />
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-foreground line-clamp-3">Lindo imóvel disponível! 🏡 Agende sua visita e venha conhecer seu novo lar...</p>
                      </div>
                      <div className="p-2 border-t border-border/30 bg-muted/20 flex justify-between items-center">
                        <span className="text-[10px] font-medium">Saiba mais</span>
                        <Button size="sm" className="h-6 text-[10px] rounded px-2">Ver Imóvel</Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex-col gap-3 pt-0">
                    <Button className="w-full rounded-full" onClick={handleProgramar}>
                      <CalendarDays className="w-4 h-4 mr-2" /> Programar Post
                    </Button>
                    <Button variant="outline" className="w-full rounded-full">
                      Postar Agora
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* TAB: Fila */}
          <TabsContent value="fila" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Fila e Publicados</h3>
              <p className="text-sm text-muted-foreground">Acompanhe as publicações programadas e o histórico recente.</p>
            </div>
            
            <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>Data / Hora</TableHead>
                    <TableHead>Imóvel</TableHead>
                    <TableHead>Formato</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockImoveis.filter(i => i.status === 'fila' || i.status === 'publicado').map(imovel => (
                    <TableRow key={imovel.id}>
                      <TableCell className="font-medium text-muted-foreground text-sm">{imovel.dataPublicacao}</TableCell>
                      <TableCell className="font-semibold">{imovel.titulo}</TableCell>
                      <TableCell>{imovel.tipoPost}</TableCell>
                      <TableCell>
                        <Badge className={imovel.status === 'publicado' ? 'bg-emerald-500/10 text-emerald-600 border-none shadow-none' : 'bg-blue-500/10 text-blue-600 border-none shadow-none'}>
                          {imovel.status === 'publicado' ? 'Publicado' : 'Agendado'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {imovel.status === 'fila' ? (
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">Cancelar</Button>
                        ) : (
                          <Button variant="ghost" size="sm">Ver Post</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* TAB: Desempenho */}
          <TabsContent value="desempenho" className="space-y-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Desempenho Geral</h3>
              <p className="text-sm text-muted-foreground">Métricas das suas campanhas em {redeAtual.name}.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground tracking-tight">Alcance Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold">45.2K</p>
                  <p className="text-xs text-emerald-500 font-bold mt-1">+12% vs mês anterior</p>
                </CardContent>
               </Card>
               <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground tracking-tight">Leads Gerados</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold">128</p>
                  <p className="text-xs text-emerald-500 font-bold mt-1">+5% vs mês anterior</p>
                </CardContent>
               </Card>
               <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground tracking-tight">Investimento</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold">R$ 850</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">Neste mês</p>
                </CardContent>
               </Card>
            </div>
          </TabsContent>

          {/* TAB: Configurações */}
          <TabsContent value="config" className="space-y-6">
            <Card className="border-border/50 shadow-sm max-w-2xl">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-base flex items-center gap-2"><Settings className="w-4 h-4 text-primary" /> Conta Conectada</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/20 border border-border/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white", redeAtual.color)}>
                      {renderLogo(redeAtual)}
                    </div>
                    <div>
                      <p className="font-bold">Imobiliária Demo Oficial</p>
                      <p className="text-xs text-muted-foreground">ID: 1092837465</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200">Conectado</Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50">Desconectar Conta</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}
