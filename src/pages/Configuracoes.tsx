import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TwoFactorSetupModal } from '@/components/modals/TwoFactorSetupModal';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import {
  Settings, Bell, Shield, Palette, Globe, Save, Check, User, Users,
  Key, Mail, ExternalLink, Zap, Receipt, Smartphone,
  Lock, Layout, HelpCircle, LogOut, Trash2, Edit, Plus, Search,
  Instagram, Facebook, MessageSquare, CreditCard, Share2, Database,
  ChevronRight, Camera, SmartphoneIcon, Monitor, Clock, Calendar,
  CreditCardIcon, Wallet, ArrowUpRight, CheckCircle2, ShieldCheck,
  Building, MapPin, Phone, Briefcase, MoreVertical, DollarSign, Download, Home
} from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useTheme } from '@/contexts/theme-context';
import { useToast } from '@/hooks/use-toast';

export function Configuracoes() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('geral');
  const [saved, setSaved] = useState(false);
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handleSave = () => {
    setSaved(true);
    toast({
      title: "Configurações salvas!",
      description: "Suas alterações foram aplicadas com sucesso.",
      variant: "success",
    });
    setTimeout(() => setSaved(false), 2000);
  };

  const menuItems = [
    { id: 'geral', label: 'Dados da Imobiliária', icon: Building },
    { id: 'perfil', label: 'Meu Perfil', icon: User },
    { id: 'equipe', label: 'Equipe e Permissões', icon: Users },
    { id: 'notificacoes', label: 'Notificações', icon: Bell },
    { id: 'seguranca', label: 'Segurança e Login', icon: Lock },
    { id: 'branding', label: 'Identidade Visual', icon: Palette },
    { id: 'integracoes', label: 'Hub de Integrações', icon: Zap },
    { id: 'financeiro', label: 'Plano e Cobrança', icon: CreditCard },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'geral':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Dados Institucionais</CardTitle>
                <CardDescription>Gerencie as informações públicas da sua agência.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-bold">Razão Social</Label>
                    <Input placeholder="Minha Imobiliária LTDA" className="bg-slate-50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">Nome Fantasia</Label>
                    <Input placeholder="ESI Imóveis" className="bg-slate-50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">CNPJ</Label>
                    <Input placeholder="00.000.000/0001-00" className="bg-slate-50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">CRECI Jurídico</Label>
                    <Input placeholder="12345-J" className="bg-slate-50" />
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="font-bold">Telefone</Label>
                    <Input placeholder="(11) 9999-9999" className="bg-slate-50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">E-mail Comercial</Label>
                    <Input placeholder="contato@esi.chat" className="bg-slate-50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">Site</Label>
                    <Input placeholder="www.esi.app" className="bg-slate-50" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-bold">Endereço Completo</Label>
                  <Input placeholder="Av. Paulista, 1000 - São Paulo, SP" className="bg-slate-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Configurações de Lead</CardTitle>
                <CardDescription>Defina como os novos leads do esi.chat são distribuídos.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="space-y-0.5">
                    <Label className="font-bold text-slate-800">Distribuição Round-Robin</Label>
                    <p className="text-sm text-slate-500 font-medium">Os leads são distribuídos igualmente entre corretores ativos.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="space-y-0.5">
                    <Label className="font-bold text-slate-800">Forçar Atendimento Humano</Label>
                    <p className="text-sm text-slate-500 font-medium">O chatbot transfere imediatamente para um humano após a primeira interação.</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'perfil':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>Mantenha seus dados de contato sempre atualizados.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <Avatar className="h-24 w-24 border-4 border-slate-50 shadow-md">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <button className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="h-6 w-6 text-white" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-800 text-lg">Jefferson Jr.</h3>
                    <p className="text-sm text-slate-500 font-medium">Administrador da Conta</p>
                    <Button variant="outline" size="sm" className="h-8 text-[11px] font-bold uppercase tracking-wider">Trocar Foto</Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-bold">Nome Completo</Label>
                    <Input defaultValue="Jefferson Jr." className="bg-slate-50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">E-mail Profissional</Label>
                    <Input defaultValue="jefferson@esi.chat" className="bg-slate-50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">WhatsApp</Label>
                    <Input defaultValue="(11) 98888-8888" className="bg-slate-50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">CRECI</Label>
                    <Input defaultValue="12345-F" className="bg-slate-50" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-bold">Bio Profissional</Label>
                  <Textarea
                    placeholder="Conte um pouco sobre sua experiência..."
                    className="bg-slate-50 min-h-[100px]"
                    defaultValue="Especialista em imóveis de alto padrão na região dos Jardins."
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'equipe':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">Membros da Equipe</h3>
                <p className="text-sm text-slate-500 font-medium">Gerencie o acesso e as permissões dos seus corretores.</p>
              </div>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-10 px-6">
                <Plus className="h-4 w-4 mr-2" /> Convidar Membro
              </Button>
            </div>

            <Card className="border-none shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Membro</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Último Acesso</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { nome: 'Ana Souza', email: 'ana@esi.chat', cargo: 'Admin', acesso: 'Hoje, 14:20', status: 'Ativo' },
                    { nome: 'João Silva', email: 'joao@esi.chat', cargo: 'Corretor', acesso: '22/05/2024', status: 'Ativo' },
                    { nome: 'Beatriz Lima', email: 'bia@esi.chat', cargo: 'Corretor', acesso: 'Nunca', status: 'Pendente' },
                  ].map((membro, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border border-slate-100">
                            <AvatarFallback className="bg-indigo-50 text-indigo-700 font-bold text-xs">{membro.nome.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-800 text-sm truncate">{membro.nome}</p>
                            <p className="text-[10px] text-slate-400 font-medium truncate">{membro.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-bold text-slate-600">{membro.cargo}</TableCell>
                      <TableCell className="text-xs text-slate-500 font-medium">{membro.acesso}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={membro.status === 'Ativo' ? 'bg-emerald-50 text-emerald-700 border-none font-black text-[10px]' : 'bg-amber-50 text-amber-700 border-none font-black text-[10px]'}>
                          {membro.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-indigo-600" />
                <div className="min-w-0">
                  <p className="font-bold text-indigo-900 text-sm">Matriz de Permissões</p>
                  <p className="text-xs text-indigo-600 font-medium">Personalize detalhadamente o que cada cargo pode acessar.</p>
                </div>
              </div>
              <Button variant="link" className="text-indigo-600 font-black text-xs uppercase tracking-wider">Configurar <ChevronRight className="h-3 w-3 inline ml-1" /></Button>
            </div>
          </div>
        );

      case 'notificacoes':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Preferências de Notificações</CardTitle>
                <CardDescription>Escolha como e quando deseja ser alertado sobre eventos no sistema.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { title: 'Novos Leads', desc: 'Notificar quando um novo lead entrar via esi.chat.', icon: MessageSquare },
                  { title: 'Agendamentos', desc: 'Alertar sobre visitas e reuniões confirmadas.', icon: Calendar },
                  { title: 'Financeiro', desc: 'Repasses recebidos ou faturas pendentes.', icon: DollarSign },
                  { title: 'Atualizações de Sistema', desc: 'Novas funcionalidades e manutenções.', icon: Zap },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between gap-4 py-2">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 text-sm">{item.title}</p>
                        <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[9px] font-black uppercase text-slate-400">Email</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[9px] font-black uppercase text-slate-400">Push</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[9px] font-black uppercase text-slate-400">WhatsApp</span>
                        <Switch />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        );

      case 'seguranca':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Segurança da Conta</CardTitle>
                <CardDescription>Gerencie sua senha e métodos de autenticação.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="font-bold">Senha Atual</Label>
                    <Input type="password" placeholder="••••••••" className="bg-slate-50" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-bold">Nova Senha</Label>
                      <Input type="password" placeholder="••••••••" className="bg-slate-50" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">Confirmar Senha</Label>
                      <Input type="password" placeholder="••••••••" className="bg-slate-50" />
                    </div>
                  </div>
                  <Button variant="outline" className="font-bold text-xs h-9">Alterar Senha</Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-indigo-900 text-sm">Autenticação em Dois Fatores (2FA)</p>
                      <p className="text-xs text-indigo-600 font-medium">Adicione uma camada extra de proteção via App ou SMS.</p>
                    </div>
                  </div>
                  <Button
                    variant="default"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-9 px-4"
                    onClick={() => setTwoFactorModalOpen(true)}
                  >
                    Ativar 2FA
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm">Dispositivos Conectados</CardTitle>
                <CardDescription>Sessões ativas em outros navegadores ou aparelhos.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { device: 'MacBook Pro · Chrome', location: 'São Paulo, Brasil', active: true },
                  { device: 'iPhone 15 · Safari', location: 'São Paulo, Brasil', active: false },
                ].map((session, i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      {session.device.includes('iPhone') ? <SmartphoneIcon className="h-5 w-5 text-slate-400" /> : <Monitor className="h-5 w-5 text-slate-400" />}
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{session.device} {session.active && <Badge className="bg-emerald-100 text-emerald-700 border-none ml-2 text-[8px] font-black uppercase">Atual</Badge>}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{session.location}</p>
                      </div>
                    </div>
                    {!session.active && <Button variant="ghost" className="text-rose-500 font-bold text-xs h-8">Encerrar</Button>}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        );

      case 'branding':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Identidade Visual da Agência</CardTitle>
                <CardDescription>Personalize o sistema com as cores e logo da sua marca.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <Label className="font-bold">Logo Oficial</Label>
                    <div className="w-full aspect-[4/3] max-w-[280px] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors group cursor-pointer">
                      <Camera className="h-8 w-8 text-slate-400 mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fazer Upload</p>
                      <p className="text-[9px] text-slate-400 mt-1">PNG ou SVG (Fundo transparente)</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full max-w-[280px] font-bold text-xs h-9">Remover Atual</Button>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <Label className="font-bold">Cores da Marca</Label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-indigo-600 shadow-sm" />
                            <span className="text-sm font-bold text-slate-700">Cor Primária</span>
                          </div>
                          <Input defaultValue="#4F46E5" className="w-24 font-mono text-xs font-bold h-8" />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-orange-500 shadow-sm" />
                            <span className="text-sm font-bold text-slate-700">Cor de Destaque</span>
                          </div>
                          <Input defaultValue="#F97316" className="w-24 font-mono text-xs font-bold h-8" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="font-bold">Tema do Sistema</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {['light', 'dark', 'system'].map((t) => (
                          <button
                            key={t}
                            onClick={() => setTheme(t as any)}
                            className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${theme === t ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                          >
                            <div className={`h-8 w-full rounded-md ${t === 'dark' ? 'bg-slate-900' : t === 'light' ? 'bg-slate-100' : 'bg-gradient-to-r from-slate-100 to-slate-900'}`} />
                            <span className="text-[10px] font-black uppercase text-slate-600">{t === 'light' ? 'Claro' : t === 'dark' ? 'Escuro' : 'Auto'}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-slate-900 text-white overflow-hidden relative">
              <div className="p-6">
                <Badge className="bg-emerald-500/20 text-emerald-400 border-none mb-4 font-black text-[10px]">PREVIEW EM TEMPO REAL</Badge>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-4 w-4 rounded-full bg-indigo-500" />
                  <div className="h-1.5 w-32 bg-slate-800 rounded" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-20 bg-slate-800/50 rounded-2xl border border-slate-800" />
                  <div className="h-20 bg-indigo-500/10 rounded-2xl border border-indigo-500/20" />
                </div>
              </div>
            </Card>
          </div>
        );

      case 'integracoes':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">Hub de Integrações</h3>
                <p className="text-sm text-slate-500 font-medium">Conecte sua agência com as principais plataformas do mercado.</p>
              </div>
              <Button variant="outline" className="font-bold text-xs h-10 border-slate-200 bg-white">
                <Plus className="h-4 w-4 mr-2" /> Novo Webhook
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { nome: 'WhatsApp Business API', status: 'Ativo', icon: MessageSquare, color: 'text-green-600 bg-green-50', desc: 'Sincronização oficial de mensagens esi.chat.' },
                { nome: 'ZAP / VivaReal', status: 'Ativo', icon: Globe, color: 'text-orange-600 bg-orange-50', desc: 'Envio automático de anúncios para os portais.' },
                { nome: 'Asaas Financial', status: 'Configurar', icon: Receipt, color: 'text-blue-600 bg-blue-50', desc: 'Gestão de boletos, Pix e repasses de locação.' },
                { nome: 'Google Agenda', status: 'Ativo', icon: Calendar, color: 'text-blue-500 bg-blue-50', desc: 'Sincronia real-time de visitas e vistorias.' },
                { nome: 'Zapier / Integromat', status: 'Inativo', icon: Database, color: 'text-orange-500 bg-orange-50', desc: 'Automações via triggers e webhooks customizados.' },
                { nome: 'Imovelweb', status: 'Configurar', icon: Layout, color: 'text-rose-600 bg-rose-50', desc: 'Sincronização de catálogo com o portal Imovelweb.' },
              ].map((item, i) => (
                <Card key={i} className="group border-none shadow-sm hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-5 flex gap-4">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${item.color}`}>
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-800 text-sm truncate">{item.nome}</h4>
                        <Badge variant="outline" className={item.status === 'Ativo' ? 'bg-emerald-50 text-emerald-700 border-none font-black text-[9px] uppercase' : item.status === 'Inativo' ? 'bg-slate-100 text-slate-400 border-none font-black text-[9px] uppercase' : 'bg-amber-50 text-amber-700 border-none font-black text-[9px] uppercase'}>
                          {item.status}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium mt-1 line-clamp-2">{item.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'financeiro':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-sm bg-indigo-600 text-white overflow-hidden relative">
                <CardHeader>
                  <CardTitle className="text-indigo-100 uppercase tracking-widest text-[10px] font-black">Plano Atual</CardTitle>
                  <h3 className="text-3xl font-black mt-2">Plano Pro Agency</h3>
                  <CardDescription className="text-indigo-100 font-medium">Renova em 22 de Junho, 2024</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-indigo-100">Uso de Usuários</span>
                      <span>8 de 15</span>
                    </div>
                    <Progress value={53} className="h-1.5 bg-indigo-700" />
                  </div>
                  <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white font-bold h-10">Mudar de Plano</Button>
                </CardContent>
                <Wallet className="absolute -bottom-6 -right-6 h-32 w-32 opacity-10" />
              </Card>

              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-slate-800">Método de Pagamento</CardTitle>
                  <CardDescription>Cartão padrão para cobrança mensal.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-16 bg-slate-900 rounded-lg flex items-center justify-center text-[8px] font-black text-white italic">VISA</div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">•••• 8502</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Exp: 08/27</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-slate-400"><Edit className="h-4 w-4" /></Button>
                  </div>
                  <Button variant="outline" className="w-full font-bold text-xs h-10 border-dashed border-2 border-slate-200 text-slate-500 hover:border-slate-300">
                    <Plus className="h-3 w-3 mr-2" /> Adicionar Novo Cartão
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-800">Histórico de Faturas</CardTitle>
                <CardDescription>Consulte e baixe seus comprovantes de pagamento.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">PDF</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { data: '22/Mai, 2024', desc: 'Assinatura Mensal - ESI Pro', valor: 'R$ 299,00', status: 'Pago' },
                      { data: '22/Abr, 2024', desc: 'Assinatura Mensal - ESI Pro', valor: 'R$ 299,00', status: 'Pago' },
                      { data: '22/Mar, 2024', desc: 'Assinatura Mensal - ESI Pro', valor: 'R$ 299,00', status: 'Pago' },
                    ].map((fat, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-xs font-bold text-slate-800">{fat.data}</TableCell>
                        <TableCell className="text-xs text-slate-600 font-medium">{fat.desc}</TableCell>
                        <TableCell className="text-xs font-black text-slate-800">{fat.valor}</TableCell>
                        <TableCell><Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[9px] uppercase">PAGO</Badge></TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400"><Download className="h-4 w-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return <div className="p-12 text-center text-slate-400 font-medium italic border-2 border-dashed border-slate-200 rounded-2xl bg-white">Módulo em desenvolvimento...</div>;
    }
  };

  return (
    <div className="mx-auto font-sans flex flex-col overflow-hidden bg-slate-50/30">
      <Breadcrumb className="mb-4 sm:mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="flex items-center gap-1">
              <Home className="h-4 w-4" /> Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Configurações</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Configurações</h1>
            <p className="text-slate-500 mt-1 font-medium">Ajustes gerais, equipe, marca e faturamento.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="font-bold text-slate-400 hover:text-slate-800"
            onClick={() => setActiveTab('geral')}
          >
            Descartar
          </Button>
          <Button
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-8 shadow-lg shadow-indigo-100 h-12 rounded-2xl"
          >
            {saved ? <CheckCircle2 className="h-5 w-5 mr-2" /> : <Save className="h-5 w-5 mr-2" />}
            {saved ? 'Salvo com sucesso' : 'Salvar Alterações'}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex gap-8 overflow-hidden">

        {/* Left Rail Navigation */}
        <aside className="w-72 flex flex-col shrink-0">
          <ScrollArea className="flex-1">
            <nav className="space-y-1.5 p-1 pr-4">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl font-bold text-sm transition-all
                    ${activeTab === item.id
                      ? 'bg-white text-indigo-600 shadow-md shadow-indigo-100/50 border border-indigo-100 translate-x-1'
                      : 'text-slate-400 hover:bg-white/50 hover:text-slate-600 hover:shadow-sm'}`}
                >
                  <div className={`h-8 w-8 rounded-xl flex items-center justify-center transition-colors ${activeTab === item.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    <item.icon className="h-4 w-4 shrink-0" />
                  </div>
                  {item.label}
                </button>
              ))}
            </nav>
          </ScrollArea>

          <div className="mt-6 p-5 bg-white rounded-3xl border border-slate-100 shadow-sm mb-4">
            <div className="flex items-center gap-3 mb-6">
              <Avatar className="h-12 w-12 border-2 border-indigo-50 shadow-sm">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback className="bg-indigo-50 text-indigo-700 font-bold uppercase">AD</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-black text-slate-800 text-sm truncate">Jefferson Jr.</p>
                <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-none font-black text-[9px] uppercase tracking-widest mt-0.5">ADMIN MASTER</Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full text-rose-500 border-rose-50 hover:bg-rose-50 hover:border-rose-100 hover:text-rose-600 font-black text-xs h-11 rounded-xl group">
              <LogOut className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" /> Sair do Painel
            </Button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto px-1 pr-4 pb-20 custom-scrollbar">
          {renderContent()}
        </main>

      </div>

      <TwoFactorSetupModal
        open={twoFactorModalOpen}
        onClose={() => {
          setTwoFactorModalOpen(false);
          setTwoFactorEnabled(true);
        }}
      />
    </div>
  );
}
