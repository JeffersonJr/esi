import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { useAnimation } from '@/components/shared/ActionAnimation';
import { useToast } from '@/hooks/use-toast';
import {
  MessageCircle,
  Send,
  Search,
  Bot,
  User,
  Phone,
  MapPin,
  CheckCircle2,
  Paperclip,
  Smile,
  Mic,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  MoreVertical,
  CheckCircle,
  Clock,
  Plus,
  Download,
  FileText,
  PieChart,
  AlertCircle,
  Edit,
  Home,
  MessageSquare,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  UserPlus,
  ArrowRight,
  CheckCheck,
  Image as ImageIcon,
  Mail,
  Building
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';

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
  const { triggerAnimation } = useAnimation();
  const { toast } = useToast();
  const [chatsList, setChatsList] = useState<Chat[]>(chats);
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
  }, [selectedChat.id]);

  const toggleCommand = (e: React.MouseEvent) => {
    const newStatus: 'bot' | 'active' = selectedChat.status === 'bot' ? 'active' : 'bot';
    const rect = e.currentTarget.getBoundingClientRect();

    triggerAnimation({
      type: 'success',
      startX: rect.left + rect.width / 2,
      startY: rect.top + rect.height / 2,
      icon: newStatus === 'bot' ? Sparkles : User
    });

    const updatedChat: Chat = { ...selectedChat, status: newStatus };
    setSelectedChat(updatedChat);
    setChatsList(prev => prev.map(c => c.id === selectedChat.id ? updatedChat : c));

    toast({
      title: newStatus === 'bot' ? "Comando para esi.bot" : "Você assumiu o comando",
      description: newStatus === 'bot'
        ? "A inteligência artificial agora conduzirá esta conversa."
        : "Você agora está no controle manual desta conversa.",
      variant: "default"
    });
  };

  const filteredChats = chatsList.filter(chat => {
    const matchesSearch = chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'todos') return matchesSearch;
    return matchesSearch && chat.status === statusFilter;
  });

  return (
    <div className="flex flex-col min-h-full">
      <div className="max-w-[1400px] w-full mx-auto px-6 pt-4">
                  Nova Conversa
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] rounded-3xl p-8">
                <DialogHeader className="mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <DialogTitle className="text-2xl font-black text-slate-800 tracking-tight">Iniciar Nova Conversa</DialogTitle>
                  <DialogDescription className="text-slate-500 font-medium pt-2">
                    Digite o número de WhatsApp ou busque um lead existente para iniciar um atendimento manual.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Número ou Nome</label>
                    <Input placeholder="Ex: (11) 99999-9999" className="h-12 border-slate-200 rounded-xl bg-slate-50 px-4 focus:ring-indigo-100" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Primeira Mensagem</label>
                    <textarea
                      className="w-full h-32 p-4 border border-slate-200 rounded-2xl resize-none text-sm bg-slate-50 focus:ring-2 focus:ring-indigo-100 focus:outline-none font-medium"
                      placeholder="Olá! Tudo bem? Sou corretor(a) e..."
                    ></textarea>
                  </div>
                </div>
                <div className="flex gap-3 mt-8">
                  <Button variant="outline" className="flex-1 h-12 rounded-xl font-bold border-slate-200 text-slate-600">Cancelar</Button>
                  <Button className="flex-1 h-12 rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-100">Iniciar Chat</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Main Interface */}
      <div className="max-w-[1400px] w-full mx-auto px-6 py-6 flex-1 flex flex-col min-h-0">
        <div className="h-[calc(100vh-14rem)] bg-white lg:rounded-3xl shadow-sm border border-slate-200 flex overflow-hidden">

          {/* Left Column: Chat List */}
          <div className={`w-full lg:w-[280px] xl:w-80 border-r border-slate-100 flex flex-col bg-slate-50/30 shrink-0 ${mobileView === 'list' ? 'flex' : 'hidden lg:flex'}`}>
            <div className="p-4 border-b border-slate-100 bg-white/50 backdrop-blur-md shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar conversas..."
                  className="pl-9 h-11 w-full bg-slate-50/50 border-slate-200 rounded-xl focus-visible:ring-indigo-100 text-sm font-medium"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-3 space-y-2">
                {filteredChats.map(chat => (
                  <div
                    key={chat.id}
                    onClick={() => {
                      setSelectedChat(chat);
                      setMobileView('chat');
                    }}
                    className={`flex gap-3 p-3 rounded-2xl cursor-pointer transition-all border ${selectedChat.id === chat.id ? 'bg-white border-indigo-100 shadow-md shadow-indigo-50' : 'hover:bg-white/50 border-transparent hover:border-slate-100'}`}
                  >
                    <div className="relative shrink-0">
                      <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                        <AvatarFallback className={`${selectedChat.id === chat.id ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'} font-black text-xs`}>
                          {chat.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${chat.status === 'active' ? 'bg-emerald-500' : chat.status === 'waiting' ? 'bg-amber-500' : 'bg-indigo-500'}`} />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h4 className="font-bold text-sm text-slate-800 truncate pr-2 tracking-tight">{chat.name}</h4>
                        <span className={`text-[10px] font-black uppercase tracking-wider shrink-0 ${chat.unread > 0 ? 'text-indigo-600' : 'text-slate-400'}`}>{chat.time}</span>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <p className={`text-[13px] truncate font-medium ${chat.unread > 0 ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                          {chat.lastMessage}
                        </p>
                        {chat.unread > 0 && (
                          <Badge className="bg-indigo-600 text-white rounded-full px-1.5 min-w-[20px] h-5 flex items-center justify-center shrink-0 border-none font-black text-[10px]">
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
            <div className="h-[72px] px-4 md:px-6 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md shrink-0">
              <div className="flex items-center gap-2 md:gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden -ml-2 h-9 w-9 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                  onClick={() => setMobileView('list')}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="relative">
                  <Avatar className="h-9 w-9 md:h-11 md:w-11 border border-slate-100 shadow-sm">
                    <AvatarFallback className="bg-indigo-50 text-indigo-700 font-black text-xs md:text-sm">
                      {selectedChat.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white bg-emerald-500" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h2 className="font-black text-slate-800 tracking-tight text-sm md:text-lg truncate max-w-[120px] sm:max-w-none">{selectedChat.name}</h2>
                    <Badge variant="outline" className="hidden sm:flex text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border-none px-2 py-0">Online</Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <AnimatePresence mode="wait">
                      {selectedChat.status === 'bot' ? (
                        <motion.div
                          key="bot-badge"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                        >
                          <Badge
                            className="text-[9px] h-5 px-2 font-black bg-indigo-600 text-white border-none flex items-center gap-1.5 cursor-pointer hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 active:scale-95 group uppercase tracking-wider"
                            onClick={(e) => toggleCommand(e)}
                          >
                            <Bot className="h-3 w-3 animate-pulse" />
                            <span>esi.bot</span>
                          </Badge>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="user-badge"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                        >
                          <Badge
                            className="text-[9px] h-5 px-2 font-black bg-slate-800 text-white border-none flex items-center gap-1.5 cursor-pointer hover:bg-slate-900 transition-all active:scale-95 uppercase tracking-wider"
                            onClick={(e) => toggleCommand(e)}
                          >
                            <User className="h-3 w-3" />
                            <span>Você</span>
                          </Badge>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider hidden sm:block">• Origem: WhatsApp</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <Button variant="ghost" size="icon" className="lg:hidden h-10 w-10 text-indigo-600 bg-indigo-50 rounded-xl" onClick={() => setMobileView('info')}>
                  <Sparkles className="h-5 w-5" />
                </Button>
                <Button variant="outline" className="hidden md:flex h-11 px-5 bg-white border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-200 hover:bg-white transition-all rounded-xl font-bold shadow-sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  <span>Mover para Leads</span>
                </Button>
              </div>
            </div>

            {/* Chat Area */}
            <ScrollArea className="flex-1 p-4 md:p-8 relative bg-slate-50/20" style={{ backgroundImage: 'radial-gradient(circle at center, #f1f5f9 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
              <div className="max-w-3xl mx-auto space-y-8">
                <div className="flex justify-center">
                  <span className="bg-white border border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-sm">Hoje</span>
                </div>

                {/* Bot Msg */}
                <div className="flex gap-4 max-w-[85%] animate-in slide-in-from-left-4 duration-300">
                  <Avatar className="h-9 w-9 shrink-0 shadow-sm">
                    <AvatarFallback className="bg-indigo-600 text-white"><Bot className="h-5 w-5" /></AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-2 items-start">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">esi.chat (Bot) • 10:25</span>
                    <div className="bg-white border border-slate-100 text-slate-700 p-4 rounded-2xl rounded-tl-sm shadow-sm text-sm font-medium leading-relaxed">
                      Olá Maria! Bom dia. Meu nome é esi.chat, sou o assistente virtual da esi. Como posso ajudar você a encontrar o imóvel ideal hoje?
                    </div>
                  </div>
                </div>

                {/* User Msg */}
                <div className="flex gap-4 max-w-[85%] ml-auto justify-end animate-in slide-in-from-right-4 duration-300">
                  <div className="flex flex-col gap-2 items-end text-right">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">Maria Santos • 10:28</span>
                    <div className="bg-indigo-600 text-white p-4 rounded-2xl rounded-tr-sm shadow-xl shadow-indigo-100/50 text-sm font-medium leading-relaxed">
                      Bom dia. Eu vi um anúncio de vocês no Instagram sobre apartamentos no bairro Pinheiros.
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 max-w-[85%] ml-auto justify-end">
                  <div className="flex flex-col gap-2 items-end text-right">
                    <div className="bg-indigo-600 text-white p-4 rounded-2xl rounded-tr-sm shadow-xl shadow-indigo-100/50 text-sm font-medium leading-relaxed">
                      Gostaria de saber se vocês têm opções de 3 quartos com varanda gourmet. Meu orçamento é até 850 mil.
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <CheckCheck className="h-4 w-4 text-indigo-500" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center my-8">
                  <span className="bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest px-5 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
                    <ArrowRight className="h-3 w-3" />
                    esi.chat transferiu o atendimento para João Silva
                  </span>
                </div>

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 md:p-6 bg-white border-t border-slate-100 shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-end gap-3 rounded-2xl bg-slate-50 border border-slate-200 p-2.5 focus-within:ring-4 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all group">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-11 w-11 text-slate-400 hover:text-indigo-600 shrink-0 rounded-xl hover:bg-white transition-all">
                        <Paperclip className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 p-2 rounded-2xl border-slate-100 shadow-2xl mb-2">
                      <DropdownMenuItem className="cursor-pointer rounded-xl py-3 px-3 focus:bg-indigo-50 transition-colors">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center mr-3 text-blue-600"><ImageIcon className="h-5 w-5" /></div>
                        <span className="font-bold text-slate-700 text-sm">Foto ou Vídeo</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer rounded-xl py-3 px-3 focus:bg-indigo-50 transition-colors">
                        <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center mr-3 text-purple-600"><FileText className="h-5 w-5" /></div>
                        <span className="font-bold text-slate-700 text-sm">Documento</span>
                      </DropdownMenuItem>
                      <Separator className="my-2" />
                      <DropdownMenuItem className="cursor-pointer rounded-xl py-3 px-3 focus:bg-indigo-50 transition-colors">
                        <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center mr-3 text-orange-600"><Home className="h-5 w-5" /></div>
                        <span className="font-bold text-slate-700 text-sm">Card de Imóvel</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <div className="flex-1 min-h-[44px] flex items-center">
                    <textarea
                      className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-40 text-sm text-slate-800 placeholder:text-slate-400 py-3 font-medium no-scrollbar"
                      placeholder="Responda para Maria Santos..."
                      rows={1}
                      value={messageInput}
                      onChange={e => setMessageInput(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-1 shrink-0 pb-1.5 grayscale group-focus-within:grayscale-0 transition-all">
                    {messageInput.trim() ? (
                      <Button
                        size="icon"
                        className="h-11 w-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 shrink-0 ml-1 transition-all active:scale-95"
                        onClick={() => setMessageInput('')}
                      >
                        <Send className="h-5 w-5 ml-0.5" />
                      </Button>
                    ) : (
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-amber-500 rounded-xl">
                          <Smile className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-emerald-500 bg-white rounded-xl shadow-sm border border-slate-100 ml-1">
                          <Mic className="h-5 w-5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Copilot */}
          <div className={`w-full lg:w-[280px] xl:w-96 border-l border-slate-100 bg-white flex flex-col shrink-0 ${mobileView === 'info' ? 'flex' : 'hidden lg:flex'}`}>
            <Tabs defaultValue="copilot" className="flex-1 flex flex-col">
              <div className="px-5 pt-5 pb-3 border-b border-slate-100 bg-white/50 backdrop-blur-md">
                <div className="flex items-center mb-4 lg:hidden">
                  <Button variant="ghost" size="icon" onClick={() => setMobileView('chat')} className="-ml-3 text-slate-500 hover:bg-slate-100 rounded-xl">
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <span className="font-black text-xs uppercase tracking-widest text-slate-400 ml-2">Atendimento</span>
                </div>
                <TabsList className="grid w-full grid-cols-2 bg-slate-50 border border-slate-200 p-1.5 rounded-2xl h-12">
                  <TabsTrigger value="copilot" className="rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md">Copilot IA</TabsTrigger>
                  <TabsTrigger value="lead" className="rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-md">Ficha Lead</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="copilot" className="flex-1 overflow-y-auto m-0 p-6 space-y-8 custom-scrollbar">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <h3 className="font-black text-xs text-slate-800 uppercase tracking-widest">Resumo Inteligente</h3>
                  </div>
                  <div className="bg-indigo-50/50 border border-indigo-100 p-5 rounded-3xl text-sm text-slate-700 leading-relaxed shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                      <Sparkles className="h-8 w-8 text-indigo-500" />
                    </div>
                    <ul className="space-y-3 relative z-10">
                      <li className="flex gap-3"><div className="h-1.5 w-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" /> <p>Interesse em <strong>Pinheiros</strong> (3 quartos + varanda).</p></li>
                      <li className="flex gap-3"><div className="h-1.5 w-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" /> <p>Budget limite de <strong>R$ 850k</strong>.</p></li>
                      <li className="flex gap-3"><div className="h-1.5 w-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" /> <p>Fase: <strong>Agendamento de Visita</strong>.</p></li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="font-black text-xs text-slate-800 uppercase tracking-widest px-1">Próximo Passo Recomendado</h3>
                  <div className="p-5 bg-white border-2 border-dashed border-slate-200 rounded-3xl hover:border-indigo-300 transition-all cursor-pointer group">
                    <p className="text-sm font-bold text-slate-700 mb-3 group-hover:text-indigo-600">Encaminhar Agenda de Sábado</p>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold h-9">Gerar Link</Button>
                      <Button variant="ghost" size="sm" className="rounded-xl font-bold h-9 text-slate-400 hover:text-slate-600">Ignorar</Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="lead" className="flex-1 overflow-y-auto m-0 p-6 space-y-8 custom-scrollbar">
                <div className="flex flex-col items-center py-4 text-center">
                  <div className="relative mb-4">
                    <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-2xl font-black">MS</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-2xl bg-white shadow-lg flex items-center justify-center border border-slate-100">
                      <MessageSquare className="h-4 w-4 text-indigo-600" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">{selectedChat.name}</h2>
                  <Badge className="mt-2 bg-emerald-50 text-emerald-600 border-none font-black text-[10px] uppercase tracking-[0.2em] px-3 py-1">Hot Lead</Badge>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <Button variant="outline" className="h-14 rounded-2xl flex flex-col gap-1 border-slate-100 hover:bg-slate-50 transition-all">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Ligar</span>
                  </Button>
                  <Button variant="outline" className="h-14 rounded-2xl flex flex-col gap-1 border-slate-100 hover:bg-slate-50 transition-all">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="text-[9px] font-black uppercase tracking-widest">E-mail</span>
                  </Button>
                  <Button variant="outline" className="h-14 rounded-2xl flex flex-col gap-1 border-slate-100 hover:bg-slate-50 transition-all">
                    <Building className="h-4 w-4 text-slate-400" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Imóveis</span>
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-50/50 border border-slate-200 p-5 rounded-3xl space-y-5 shadow-inner">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">WhatsApp</span>
                      <p className="text-sm font-bold text-slate-800">{selectedChat.phone}</p>
                    </div>
                    <Separator className="bg-slate-200/50" />
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Previsão</span>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-indigo-500" />
                        <p className="text-sm font-bold text-slate-800">{selectedChat.timeline}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
