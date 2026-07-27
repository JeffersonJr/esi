import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Building, MapPin, Phone, Briefcase, MoreVertical, DollarSign, Download, Home, Repeat, Link2, Copy, Eye, EyeOff
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
import { useTheme } from '@/contexts/theme-context';
import { useLayout } from '@/contexts/layout-context';
import { useToast } from '@/hooks/use-toast';

export function Configuracoes() {
  const { theme, setTheme } = useTheme();
  const { layout, setLayout } = useLayout();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('geral');
  const [saved, setSaved] = useState(false);
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const [telefones, setTelefones] = useState([{ id: 1, nome: '', numero: '', tipo: 'celular', exibicao: 'padrao' }]);
  const [ips, setIps] = useState([{ id: 1, nome: 'Escritório Principal', ip: '192.168.1.100' }]);
  const [novoIpNome, setNovoIpNome] = useState('');
  const [novoIp, setNovoIp] = useState('');

  const handleAddTelefone = () => setTelefones([...telefones, { id: Date.now(), nome: '', numero: '', tipo: 'celular', exibicao: 'padrao' }]);
  const handleRemoveTelefone = (id: number) => setTelefones(telefones.filter(t => t.id !== id));

  const handleAddIp = () => {
    if (novoIpNome && novoIp) {
      setIps([...ips, { id: Date.now(), nome: novoIpNome, ip: novoIp }]);
      setNovoIpNome('');
      setNovoIp('');
    }
  };

  const handleRemoveIp = (id: number) => setIps(ips.filter(i => i.id !== id));


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
    { id: 'equipe', label: 'Equipe e Permissões', icon: Users },
    { id: 'notificacoes', label: 'Notificações', icon: Bell },
    { id: 'rodizio', label: 'Rodízio de Mensagens', icon: Repeat },
    { id: 'imoveis', label: 'Imóveis', icon: Home },
    { id: 'conexoes', label: 'Conexões', icon: Link2 },
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-bold">E-mail Comercial</Label>
                    <Input placeholder="contato@esi.chat" className="bg-slate-50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">Site</Label>
                    <Input placeholder="www.esi.app" className="bg-slate-50" />
                  </div>
                </div>


                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="font-bold text-lg">Telefones</Label>
                    <Button variant="outline" size="sm" onClick={handleAddTelefone}><Plus className="w-4 h-4 mr-2" /> Adicionar Telefone</Button>
                  </div>
                  {telefones.map((tel, index) => (
                    <div key={tel.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="md:col-span-3 space-y-2">
                        <Label className="font-bold text-xs">Nome (Identificação)</Label>
                        <Input placeholder="Ex: Plantão Vendas" value={tel.nome} onChange={(e) => {
                          const newTels = [...telefones];
                          newTels[index].nome = e.target.value;
                          setTelefones(newTels);
                        }} />
                      </div>
                      <div className="md:col-span-3 space-y-2">
                        <Label className="font-bold text-xs">Número</Label>
                        <Input placeholder="+55 11 99999-9999" value={tel.numero} onChange={(e) => {
                          const newTels = [...telefones];
                          newTels[index].numero = e.target.value;
                          setTelefones(newTels);
                        }} />
                      </div>
                      <div className="md:col-span-3 space-y-2">
                        <Label className="font-bold text-xs">Tipo</Label>
                        <Select value={tel.tipo} onValueChange={(val) => {
                          const newTels = [...telefones];
                          newTels[index].tipo = val;
                          setTelefones(newTels);
                        }}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="celular">Celular</SelectItem>
                            <SelectItem value="residencial">Residencial</SelectItem>
                            <SelectItem value="trabalho">Trabalho</SelectItem>
                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label className="font-bold text-xs">Exibição</Label>
                        <Select value={tel.exibicao} onValueChange={(val) => {
                          const newTels = [...telefones];
                          newTels[index].exibicao = val;
                          setTelefones(newTels);
                        }}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="padrao">Padrão</SelectItem>
                            <SelectItem value="principal">Principal</SelectItem>
                            <SelectItem value="secundario">Secundário</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-1">
                        <Button variant="ghost" className="text-red-500 w-full" onClick={() => handleRemoveTelefone(tel.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="font-bold text-lg">Endereço Completo</Label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-3 space-y-2">
                      <Label className="font-bold text-xs">CEP</Label>
                      <div className="flex gap-2">
                        <Input placeholder="00000-000" className="bg-slate-50" />
                        <Button variant="secondary"><Search className="w-4 h-4" /></Button>
                      </div>
                    </div>
                    <div className="md:col-span-7 space-y-2">
                      <Label className="font-bold text-xs">Rua / Logradouro</Label>
                      <Input placeholder="Av. Paulista" className="bg-slate-50" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label className="font-bold text-xs">Número</Label>
                      <Input placeholder="1000" className="bg-slate-50" />
                    </div>
                    <div className="md:col-span-4 space-y-2">
                      <Label className="font-bold text-xs">Complemento</Label>
                      <Input placeholder="Sala 42" className="bg-slate-50" />
                    </div>
                    <div className="md:col-span-3 space-y-2">
                      <Label className="font-bold text-xs">Bairro</Label>
                      <Input placeholder="Bela Vista" className="bg-slate-50" />
                    </div>
                    <div className="md:col-span-3 space-y-2">
                      <Label className="font-bold text-xs">Cidade</Label>
                      <Input placeholder="São Paulo" className="bg-slate-50" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label className="font-bold text-xs">Estado (UF)</Label>
                      <Input placeholder="SP" className="bg-slate-50" />
                    </div>
                  </div>
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
                        <Badge variant="outline" className={membro.status === 'Ativo' ? 'bg-emerald-50 text-emerald-700 border-none font-semibold text-[10px]' : 'bg-amber-50 text-amber-700 border-none font-semibold text-[10px]'}>
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
              <Button variant="link" className="text-indigo-600 font-semibold text-xs tracking-tight">Configurar <ChevronRight className="h-3 w-3 inline ml-1" /></Button>
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
                        <span className="text-[9px] font-semibold text-slate-400">Email</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[9px] font-semibold text-slate-400">Push</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[9px] font-semibold text-slate-400">WhatsApp</span>
                        <Switch />
                      </div>
                    </div>
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
                      <p className="text-[10px] font-semibold text-slate-400 tracking-tight">Fazer Upload</p>
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
                            <span className="text-[10px] font-semibold text-slate-600">{t === 'light' ? 'Claro' : t === 'dark' ? 'Escuro' : 'Auto'}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <Label className="font-bold">Disposição do Menu</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'sidebar', label: 'Lateral', icon: <Layout className="w-4 h-4" /> },
                          { id: 'topbar', label: 'Superior', icon: <Monitor className="w-4 h-4" /> },
                          { id: 'dock', label: 'Dock (Mac)', icon: <SmartphoneIcon className="w-4 h-4" /> },
                        ].map((l) => (
                          <button
                            key={l.id}
                            onClick={() => setLayout(l.id as any)}
                            className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${layout === l.id ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                          >
                            <div className="h-8 w-full rounded-md bg-slate-100 flex items-center justify-center text-slate-400">
                              {l.icon}
                            </div>
                            <span className="text-[10px] font-semibold text-slate-600">{l.label}</span>
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
                <Badge className="bg-emerald-500/20 text-emerald-400 border-none mb-4 font-semibold text-[10px]">PREVIEW EM TEMPO REAL</Badge>
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
                        <Badge variant="outline" className={item.status === 'Ativo' ? 'bg-emerald-50 text-emerald-700 border-none font-semibold text-[9px]' : item.status === 'Inativo' ? 'bg-slate-100 text-slate-400 border-none font-semibold text-[9px]' : 'bg-amber-50 text-amber-700 border-none font-semibold text-[9px]'}>
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


      case 'rodizio':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Rodízio de Mensagens</CardTitle>
                <CardDescription>Configurações gerais do rodízio de atendimento de clientes.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="space-y-0.5 max-w-[80%]">
                    <Label className="font-bold text-slate-800">O corretor receberá leads de imóveis que ele não possui vinculo como criador ou captador?</Label>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="space-y-0.5 max-w-[80%]">
                    <Label className="font-bold text-slate-800">Habilitar encaminhamento de e-mails recebidos nas caixas dos portais</Label>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <Label className="font-bold text-slate-800">E-mail que receberá os e-mails encaminhados das caixas dos portais</Label>
                  <Input placeholder="contato@imobiliaria.com.br" defaultValue="contato@imobiliaria.com.br" />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="space-y-0.5 max-w-[80%]">
                    <Label className="font-bold text-slate-800">Permitir que um cliente seja atendido por mais de um corretor</Label>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="space-y-0.5 max-w-[80%]">
                    <Label className="font-bold text-slate-800">Habilitar sistema de pré-vendas</Label>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="space-y-0.5 max-w-[80%]">
                    <Label className="font-bold text-slate-800">Forçar o corretor a ser responsável pelo negócio, mesmo que haja duplicatas de atendimento</Label>
                  </div>
                  <Switch />
                </div>

                <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <Label className="font-bold text-slate-800">Caso o cliente esteja fiel a um usuário desativado, que ação deve ser tomada?</Label>
                  <Select defaultValue="continuar">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="continuar">Continuar seguindo rodízio</SelectItem>
                      <SelectItem value="remover">Remover fidelidade</SelectItem>
                      <SelectItem value="transferir">Transferir para o corretor da vez</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <Label className="font-bold text-slate-800">Adicionar uma das tags irá acionar o rodízio imediatamente</Label>
                  <Input placeholder="Ex: urgente, prioridade, vip" />
                  <p className="text-xs text-muted-foreground">Separe as tags por vírgula.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'imoveis':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Imóveis</CardTitle>
                <CardDescription>Configurações referentes aos imóveis do sistema.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <Label className="font-bold text-slate-800 max-w-[80%]">Requer aprovação antes de aceitar imóvel?</Label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <Label className="font-bold text-slate-800 max-w-[80%]">Utilizar código alternativo? (Exibição e busca no site/portais)</Label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <Label className="font-bold text-slate-800 max-w-[80%]">Gerar código alternativo automaticamente, quando não fornecido?</Label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <Label className="font-bold text-slate-800 max-w-[80%]">Tornar obrigatório valor de área?</Label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <Label className="font-bold text-slate-800 max-w-[80%]">Enviar imóveis para pré-seleção ao invés de Seleção ao mandar a um portal?</Label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <Label className="font-bold text-slate-800 max-w-[80%]">Tornar obrigatório preenchimento de toda composição?</Label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <Label className="font-bold text-slate-800 max-w-[80%]">Tornar obrigatório os proprietários?</Label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <Label className="font-bold text-slate-800 max-w-[80%]">Tornar obrigatório fotos?</Label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <Label className="font-bold text-slate-800 max-w-[80%]">Tornar obrigatório descrição do imóvel para divulgação?</Label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <Label className="font-bold text-slate-800 max-w-[80%]">Tornar obrigatória a situação da escritura?</Label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <Label className="font-bold text-slate-800 max-w-[80%]">Tornar obrigatório o título do imóvel?</Label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <Label className="font-bold text-slate-800 max-w-[80%]">Tornar obrigatório a razão de troca de status?</Label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <Label className="font-bold text-slate-800 max-w-[80%]">Tornar obrigatório o ano de construção?</Label>
                  <Switch />
                </div>

                <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <Label className="font-bold text-slate-800">Deverá ser adicionado um vídeo ao imóvel quando ele for salvo, caso nenhum seja fornecido?</Label>
                  <Input placeholder="URL do YouTube ou link direto do vídeo" />
                </div>

                <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <Label className="font-bold text-slate-800">Marcar imóveis como desatualizados após X dias</Label>
                  <Input type="number" defaultValue={30} min={30} />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <Label className="font-bold text-slate-800 max-w-[80%]">Permitir Albert solicitar informações a respeito de imóveis desatualizados?</Label>
                  <Switch />
                </div>

                <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <Label className="font-bold text-slate-800">Quantidade mínima para cadastro de fotos nos imóveis (Alerta durante cadastro)</Label>
                  <Input type="number" defaultValue={0} min={0} />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'conexoes':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Conexões Externas</CardTitle>
                <CardDescription>Configurações de integração externa e chaves de API.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4 p-5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 text-indigo-600 mb-2">
                    <Key className="w-5 h-5" />
                    <Label className="font-bold text-lg text-indigo-900">Token de Integração Externa</Label>
                  </div>
                  <p className="text-sm text-slate-600">Este token é utilizado para autenticar requisições de sistemas de terceiros na sua conta ESI. Mantenha em segurança.</p>

                  <div className="flex gap-2 mt-4">
                    <Input readOnly value="esi_live_qk7X9Lm2B4pRvN8jHwcYtF5Z0" className="font-mono text-sm bg-white" />
                    <Button variant="secondary" onClick={() => {
                      navigator.clipboard.writeText("esi_live_qk7X9Lm2B4pRvN8jHwcYtF5Z0");
                      toast({ title: 'Token copiado', description: 'O token foi copiado para sua área de transferência.', variant: 'success' });
                    }}>
                      <Copy className="w-4 h-4 mr-2" /> Copiar
                    </Button>
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button variant="destructive" size="sm" className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-none shadow-none">
                      <Repeat className="w-4 h-4 mr-2" /> Gerar novo token
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'financeiro':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-sm bg-indigo-600 text-white overflow-hidden relative">
                <CardHeader>
                  <CardTitle className="text-indigo-100 tracking-tight text-[10px] font-semibold">Plano Atual</CardTitle>
                  <h3 className="text-3xl font-semibold mt-2">Plano Pro Agency</h3>
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
                      <div className="h-10 w-16 bg-slate-900 rounded-lg flex items-center justify-center text-[8px] font-semibold text-white italic">VISA</div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">•••• 8502</p>
                        <p className="text-[10px] text-slate-500 font-bold tracking-tight">Exp: 08/27</p>
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
                        <TableCell className="text-xs font-semibold text-slate-800">{fat.valor}</TableCell>
                        <TableCell><Badge className="bg-emerald-50 text-emerald-600 border-none font-semibold text-[9px]">PAGO</Badge></TableCell>
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
      <PageHeader
        title="Configurações"
        subtitle="Ajustes gerais, equipe, marca e faturamento."
        icon={<Settings />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Configurações' }
        ]}
        actions={
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
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 shadow-lg shadow-indigo-100 h-9 rounded-xl"
            >
              {saved ? <CheckCircle2 className="h-5 w-5 mr-2" /> : <Save className="h-5 w-5 mr-2" />}
              {saved ? 'Salvo com sucesso' : 'Salvar Alterações'}
            </Button>
          </div>
        }
      />

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
