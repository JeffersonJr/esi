import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  MessageCircle,
  Send,
  Search,
  Bot,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Paperclip,
  Smile,
  Mic,
  Sparkles,
  TrendingUp,
  Clock,
  Filter,
  CheckCheck,
  Image as ImageIcon,
  FileText,
  Home,
  UserPlus,
  ArrowRight,
  ChevronRight,
  Check,
  Building
} from 'lucide-react';

interface Chat {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  time: string;
  unread: number;
  status: 'active' | 'waiting' | 'bot';
  phone: string;
  email: string;
  interest: string;
  budget: string;
  timeline: string;
}

const chats: Chat[] = [
  {
    id: '1', name: 'Maria Santos', lastMessage: 'Gostaria de agendar uma visita para sábado.', time: '10:30', unread: 2, status: 'active',
    phone: '(11) 98765-4321', email: 'maria.santos@email.com', interest: 'Apartamento 3 Quartos, Pinheiros', budget: 'Até R$ 850.000', timeline: 'Imediato'
  },
  {
    id: '2', name: 'Carlos Oliveira', lastMessage: 'Obrigado pelas informações!', time: '09:45', unread: 0, status: 'active',
    phone: '(11) 91234-5678', email: 'carlos.oliveira@email.com', interest: 'Casa em Condomínio, Alphaville', budget: 'R$ 1.5M - R$ 2M', timeline: 'Em 3 meses'
  },
  {
    id: '3', name: 'Juliana Costa', lastMessage: 'Qual o valor do condomínio daquele em Moema?', time: 'Ontem', unread: 1, status: 'waiting',
    phone: '(11) 99988-7766', email: 'juliana.c@email.com', interest: 'Studio, Moema ou Itaim', budget: 'Até R$ 500.000', timeline: 'Investimento'
  },
  {
    id: '4', name: 'Lead Site #4092', lastMessage: 'Olá, tenho interesse no imóvel código 8821.', time: 'Ontem', unread: 0, status: 'bot',
    phone: 'Não informado', email: 'contato4092@gmail.com', interest: 'Indefinido (Origem: Site)', budget: 'Não informado', timeline: 'Não informado'
  },
];

export function EsiChat() {
  const [selectedChat, setSelectedChat] = useState<Chat>(chats[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [mobileView, setMobileView] = useState<'list' | 'chat' | 'info'>('list');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'waiting' | 'active' | 'bot'>('todos');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChat]);

  const MetricCard = ({ title, value, subtitle, icon: Icon, color }: any) => (
    <Card className="bg-white border-slate-100 shadow-sm">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
            {subtitle && <span className="text-xs font-semibold text-emerald-500">{subtitle}</span>}
          </div>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      </CardContent>
    </Card>
  );

  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'todos') return matchesSearch;
    return matchesSearch && chat.status === statusFilter;
  });

  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb className="mb-4 sm:mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="flex items-center gap-1">
              <Home className="h-4 w-4" /> Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>esi.chat</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header & Metrics */}
      <div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 leading-tight">esi.chat</h1>
              <p className="text-sm text-slate-500">CRM Conversacional Inteligente</p>
            </div>
          </div>
          <div className="flex gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-white border-slate-200 text-slate-700 font-semibold h-10">
                  <Filter className="h-4 w-4 mr-2" />
                  {statusFilter === 'todos' ? 'Todos' : statusFilter === 'waiting' ? 'Aguardando' : statusFilter === 'active' ? 'Ativos' : 'Bot'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white border-slate-100 rounded-xl shadow-lg">
                <DropdownMenuItem onClick={() => setStatusFilter('todos')} className="cursor-pointer">Todos os contatos</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('waiting')} className="cursor-pointer text-amber-600 font-medium">Aguardando resposta</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('active')} className="cursor-pointer text-emerald-600 font-medium">Em atendimento</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('bot')} className="cursor-pointer text-blue-600 font-medium">Com o esi.chat (Bot)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-10 shadow-sm">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Nova Conversa
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Iniciar Nova Conversa</DialogTitle>
                  <DialogDescription>
                    Digite o número de WhatsApp ou busque um lead existente para iniciar um atendimento manual.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">Número ou Nome</label>
                    <Input placeholder="Ex: (11) 99999-9999" className="h-10 border-slate-200" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">Primeira Mensagem</label>
                    <textarea className="w-full h-24 p-3 border border-slate-200 rounded-lg resize-none text-sm" placeholder="Olá! Tudo bem? Sou corretor(a) e..."></textarea>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <Button variant="outline" className="border-slate-200">Cancelar</Button>
                  <Button className="bg-indigo-600 text-white hover:bg-indigo-700">Iniciar Chat</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-6 shrink-0">
          <MetricCard title="Total de Atendimentos" value="1,248" subtitle="+12% hoje" icon={MessageCircle} color="bg-blue-100 text-blue-600" />
          <MetricCard title="Taxa de Resposta" value="98.2%" subtitle="Excelente" icon={CheckCircle2} color="bg-emerald-100 text-emerald-600" />
          <MetricCard title="Tempo Médio (TMA)" value="4m 12s" subtitle="-30s esta sem" icon={Clock} color="bg-amber-100 text-amber-600" />
          <MetricCard title="Leads Convertidos" value="45" subtitle="Neste mês" icon={TrendingUp} color="bg-indigo-100 text-indigo-600" />
        </div>
      </div>

      {/* Main Chat Interface (3 Columns) */}
      <div className="h-[calc(100vh-14rem)] bg-white rounded-2xl shadow-sm border border-slate-200 flex">

        {/* Left Column: Chat List */}
        <div className={`w-full lg:w-[280px] xl:w-80 border-r border-slate-100 flex flex-col bg-slate-50/50 shrink-0 ${mobileView === 'list' ? 'flex' : 'hidden lg:flex'}`}>
          <div className="p-4 border-b border-slate-100 bg-white shrink-0 min-w-0 overflow-hidden">
            <div className="relative min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar conversas..."
                className="pl-9 h-10 w-full bg-slate-50 border-slate-200 rounded-lg focus-visible:ring-indigo-500 text-sm"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-1">
              {filteredChats.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => {
                    setSelectedChat(chat);
                    setMobileView('chat');
                  }}
                  className={`flex gap-3 p-3 rounded-xl cursor-pointer transition-all ${selectedChat.id === chat.id ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-slate-100 border border-transparent'}`}
                >
                  <div className="relative shrink-0">
                    <Avatar className="h-12 w-12 border border-white shadow-sm">
                      <AvatarFallback className={`${selectedChat.id === chat.id ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'} font-semibold`}>
                        {chat.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${chat.status === 'active' ? 'bg-emerald-500' : chat.status === 'waiting' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className="font-semibold text-sm text-slate-800 truncate pr-2">{chat.name}</h4>
                      <span className={`text-[11px] font-medium shrink-0 ${chat.unread > 0 ? 'text-indigo-600' : 'text-slate-400'}`}>{chat.time}</span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <p className={`text-[13px] truncate ${chat.unread > 0 ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>
                        {chat.lastMessage}
                      </p>
                      {chat.unread > 0 && (
                        <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-1.5 min-w-[20px] h-5 flex items-center justify-center shrink-0 border-none">
                          {chat.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Center Column: Active Chat */}
        <div className={`flex-1 flex flex-col bg-[#FDFDFD] min-w-0 ${mobileView === 'chat' ? 'flex' : 'hidden lg:flex'}`}>
          {/* Chat Header */}
          <div className="h-[72px] px-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">MS</AvatarFallback>
              </Avatar>
              <div>
                <Button variant="ghost" size="icon" className="lg:hidden mr-1 -ml-3" onClick={() => setMobileView('list')}>
                  <ChevronRight className="h-5 w-5 rotate-180" />
                </Button>
                <h2 className="font-bold text-slate-800 flex flex-wrap items-center gap-2">
                  {selectedChat.name}
                  <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-semibold text-emerald-600 border-emerald-200 bg-emerald-50">Online</Badge>
                </h2>
                <p className="text-xs text-slate-500 font-medium">{selectedChat.phone} • Origem: WhatsApp</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="lg:hidden h-9 w-9 bg-white border-slate-200 text-slate-600" onClick={() => setMobileView('info')}>
                <Sparkles className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="hidden md:flex h-9 bg-white border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-colors">
                <UserPlus className="h-4 w-4 mr-2" />
                <span className="font-semibold text-sm">Adicionar ao Funil</span>
              </Button>
            </div>
          </div>

          {/* Chat Messages Area */}
          <ScrollArea className="flex-1 p-6 relative" style={{ backgroundImage: 'radial-gradient(circle at center, #f1f5f9 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            <div className="max-w-3xl mx-auto space-y-6">

              {/* Date Separator */}
              <div className="flex justify-center my-4">
                <span className="bg-slate-100 text-slate-500 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                  Hoje
                </span>
              </div>

              {/* Bot Message */}
              <div className="flex gap-3 max-w-[85%]">
                <Avatar className="h-8 w-8 shrink-0 mt-1">
                  <AvatarFallback className="bg-blue-600 text-white"><Bot className="h-4 w-4" /></AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1 items-start">
                  <span className="text-[11px] font-semibold text-slate-500 ml-1">esi.chat (Bot) • 10:25</span>
                  <div className="bg-white border border-slate-200 text-slate-700 p-3.5 rounded-2xl rounded-tl-sm shadow-sm text-sm">
                    Olá Maria! Bom dia. Meu nome é esi.chat, sou o assistente virtual da esi. Como posso ajudar você a encontrar o imóvel ideal hoje?
                  </div>
                </div>
              </div>

              {/* User Message */}
              <div className="flex gap-3 max-w-[85%] ml-auto justify-end">
                <div className="flex flex-col gap-1 items-end">
                  <span className="text-[11px] font-semibold text-slate-500 mr-1">Maria Santos • 10:28</span>
                  <div className="bg-indigo-600 text-white p-3.5 rounded-2xl rounded-tr-sm shadow-md shadow-indigo-200/50 text-sm">
                    Bom dia. Eu vi um anúncio de vocês no Instagram sobre apartamentos no bairro Pinheiros.
                  </div>
                </div>
              </div>

              {/* User Message (Continuing) */}
              <div className="flex gap-3 max-w-[85%] ml-auto justify-end">
                <div className="flex flex-col gap-1 items-end">
                  <div className="bg-indigo-600 text-white p-3.5 rounded-2xl rounded-tr-sm shadow-md shadow-indigo-200/50 text-sm">
                    Gostaria de saber se vocês têm opções de 3 quartos com varanda gourmet. Meu orçamento é até 850 mil.
                  </div>
                </div>
              </div>

              {/* System Transfer */}
              <div className="flex justify-center my-6">
                <span className="bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium px-4 py-1.5 rounded-full flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" />
                  esi.chat transferiu o atendimento para João Silva (Corretor)
                </span>
              </div>

              {/* Agent Message (You) */}
              <div className="flex gap-3 max-w-[85%]">
                <Avatar className="h-8 w-8 shrink-0 mt-1">
                  <AvatarFallback className="bg-slate-800 text-white font-bold text-xs">JS</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1 items-start">
                  <span className="text-[11px] font-semibold text-slate-500 ml-1">Você (João Silva) • 10:32</span>
                  <div className="bg-white border border-slate-200 text-slate-700 p-3.5 rounded-2xl rounded-tl-sm shadow-sm text-sm">
                    Olá Maria! Sou o João, especialista aqui da região de Pinheiros. Temos sim ótimas opções dentro desse perfil.
                  </div>
                </div>
              </div>

              {/* Agent Message with Attachment (Mock) */}
              <div className="flex gap-3 max-w-[85%]">
                <Avatar className="h-8 w-8 shrink-0 mt-1 opacity-0">
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1 items-start">
                  <div className="bg-white border border-slate-200 text-slate-700 p-1.5 rounded-2xl rounded-tl-sm shadow-sm text-sm max-w-[320px]">
                    <div className="w-full h-36 bg-slate-100 rounded-xl mb-2 flex items-center justify-center relative overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267" alt="Imóvel" className="absolute inset-0 w-full h-full object-cover" />
                      <Badge className="absolute top-2 left-2 bg-black/50 text-white border-none backdrop-blur-sm">REF: 8821</Badge>
                    </div>
                    <div className="px-2 pb-2">
                      <div className="font-bold text-slate-800 mb-0.5">Edifício Vista Pinheiros</div>
                      <div className="text-xs text-slate-500 mb-2">3 Quartos • 95m² • 2 Vagas</div>
                      <div className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded inline-block">R$ 820.000</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Message */}
              <div className="flex gap-3 max-w-[85%] ml-auto justify-end">
                <div className="flex flex-col gap-1 items-end">
                  <span className="text-[11px] font-semibold text-slate-500 mr-1">Maria Santos • 10:35</span>
                  <div className="bg-indigo-600 text-white p-3.5 rounded-2xl rounded-tr-sm shadow-md shadow-indigo-200/50 text-sm">
                    Nossa, esse parece perfeito! Gostaria de agendar uma visita para sábado.
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <CheckCheck className="h-3 w-3 text-indigo-500" />
                  </div>
                </div>
              </div>

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Chat Input Area */}
          <div className="p-2 md:p-4 bg-white border-t border-slate-100 shrink-0">
            <div className="max-w-3xl mx-auto flex items-end gap-3 rounded-2xl bg-slate-50 border border-slate-200 p-2 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-indigo-600 shrink-0 rounded-xl">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 p-2 rounded-xl border-slate-100 shadow-xl">
                  <DropdownMenuItem className="cursor-pointer rounded-lg py-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 text-blue-600"><ImageIcon className="h-4 w-4" /></div>
                    <span className="font-medium">Foto ou Vídeo</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer rounded-lg py-2.5">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3 text-purple-600"><FileText className="h-4 w-4" /></div>
                    <span className="font-medium">Documento</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer rounded-lg py-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mr-3 text-emerald-600"><MapPin className="h-4 w-4" /></div>
                    <span className="font-medium">Localização</span>
                  </DropdownMenuItem>
                  <Separator className="my-1" />
                  <DropdownMenuItem className="cursor-pointer rounded-lg py-2.5">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3 text-orange-600"><Home className="h-4 w-4" /></div>
                    <span className="font-medium">Card de Imóvel</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex-1 min-h-[40px] flex items-center">
                <textarea
                  className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-32 text-sm text-slate-800 placeholder:text-slate-400 py-2.5"
                  placeholder="Digite uma mensagem..."
                  rows={1}
                  value={messageInput}
                  onChange={e => setMessageInput(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-1 shrink-0 pb-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-amber-500 rounded-lg">
                  <Smile className="h-5 w-5" />
                </Button>
                {messageInput.trim() ? (
                  <Button size="icon" className="h-9 w-9 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md shadow-indigo-200 shrink-0 ml-1">
                    <Send className="h-4 w-4 ml-0.5" />
                  </Button>
                ) : (
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-emerald-500 bg-slate-100 rounded-lg ml-1">
                    <Mic className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Copilot & Lead Info */}
        <div className={`w-full lg:w-[280px] xl:w-80 border-l border-slate-100 bg-white flex flex-col shrink-0 ${mobileView === 'info' ? 'flex' : 'hidden lg:flex'}`}>

          <Tabs defaultValue="copilot" className="flex-1 flex flex-col">
            <div className="px-4 pt-4 pb-2 border-b border-slate-100">
              <div className="flex items-center mb-2 lg:hidden">
                <Button variant="ghost" size="icon" onClick={() => setMobileView('chat')} className="-ml-2">
                  <ChevronRight className="h-5 w-5 rotate-180" />
                </Button>
                <span className="font-bold text-sm">Voltar ao Chat</span>
              </div>
              <TabsList className="grid w-full grid-cols-2 bg-slate-50 border border-slate-200 p-1 rounded-xl h-11">
                <TabsTrigger value="copilot" className="rounded-lg text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">Copilot IA</TabsTrigger>
                <TabsTrigger value="lead" className="rounded-lg text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-sm">Ficha do Lead</TabsTrigger>
              </TabsList>
            </div>

            {/* COPILOT TAB */}
            <TabsContent value="copilot" className="flex-1 overflow-y-auto no-scrollbar m-0 p-5 space-y-6">

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-indigo-500" />
                  <h3 className="font-bold text-sm text-slate-800">Resumo da Conversa</h3>
                </div>
                <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-2xl text-sm text-slate-700 leading-relaxed shadow-sm">
                  <ul className="space-y-2 list-disc pl-4 marker:text-indigo-400">
                    <li>Lead iniciou contato buscando apartamentos em Pinheiros.</li>
                    <li>Necessita de 3 quartos com varanda gourmet.</li>
                    <li>Orçamento máximo informado: <strong>R$ 850.000</strong>.</li>
                    <li>Agente enviou o Edifício Vista Pinheiros (Ref: 8821).</li>
                    <li>Lead demonstrou forte interesse e deseja <strong>agendar visita para sábado</strong>.</li>
                  </ul>
                </div>
              </div>

              <Separator className="bg-slate-100" />

              <div>
                <h3 className="font-bold text-sm text-slate-800 mb-3">Assistente Copilot</h3>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col gap-3 h-48 justify-between">
                  <p className="text-sm text-slate-500 text-center mt-4">Faça perguntas sobre o lead ou peça sugestões de imóveis similares.</p>
                  <div className="relative min-w-0">
                    <Input placeholder="Perguntar à IA..." className="pr-10 bg-white border-slate-200 rounded-xl" />
                    <Button size="icon" variant="ghost" className="absolute right-1 top-1 h-8 w-8 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50">
                      <Sparkles className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

            </TabsContent>

            {/* LEAD INFO TAB */}
            <TabsContent value="lead" className="flex-1 overflow-y-auto no-scrollbar m-0 p-5 space-y-6">
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <Avatar className="h-20 w-20 mb-3 border-2 border-indigo-100 shadow-sm">
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xl font-bold">MS</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold text-slate-800">{selectedChat.name}</h2>
                <p className="text-sm text-emerald-600 font-semibold mb-3 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Lead Ativo
                </p>
                <div className="flex gap-2">
                  <Button size="icon" variant="outline" className="h-9 w-9 rounded-full bg-white text-slate-600 border-slate-200 hover:text-indigo-600 hover:border-indigo-200"><Phone className="h-4 w-4" /></Button>
                  <Button size="icon" variant="outline" className="h-9 w-9 rounded-full bg-white text-slate-600 border-slate-200 hover:text-indigo-600 hover:border-indigo-200"><Mail className="h-4 w-4" /></Button>
                  <Button size="icon" variant="outline" className="h-9 w-9 rounded-full bg-white text-slate-600 border-slate-200 hover:text-indigo-600 hover:border-indigo-200"><Building className="h-4 w-4" /></Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-4">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Contato</span>
                    <p className="text-sm font-semibold text-slate-800">{selectedChat.phone}</p>
                    <p className="text-sm text-slate-600">{selectedChat.email}</p>
                  </div>
                  <Separator />
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Perfil de Busca</span>
                    <p className="text-sm font-semibold text-slate-800 flex items-start gap-2">
                      <Home className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                      {selectedChat.interest}
                    </p>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Orçamento</span>
                      <p className="text-sm font-bold text-emerald-600">{selectedChat.budget}</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Prazo</span>
                      <p className="text-sm font-bold text-slate-700">{selectedChat.timeline}</p>
                    </div>
                  </div>
                </div>
              </div>

            </TabsContent>
          </Tabs>

        </div>

      </div>

    </div>
  );
}
