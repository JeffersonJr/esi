import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MessageCircle,
  Send,
  Search,
  Filter,
  Users,
  Bot,
  User,
  Phone,
  Mail,
  MapPin,
  Home,
  Clock,
  CheckCircle,
  AlertCircle,
  Archive,
  Star,
  MoreVertical,
  Paperclip,
  Smile,
  Settings,
  Headphones,
  PhoneCall,
  Video,
  Mic,
  MicOff,
  VideoOff,
  Sparkles,
  Zap,
  TrendingUp,
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent' | 'bot';
  timestamp: string;
  senderName?: string;
  senderAvatar?: string;
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
}

interface Chat {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  lastMessage: string;
  lastMessageTime: string;
  status: 'active' | 'waiting' | 'closed' | 'bot';
  unreadCount: number;
  assignedAgent?: string;
  tags: string[];
  priority: 'low' | 'medium' | 'high';
  source: 'website' | 'whatsapp' | 'email' | 'phone';
  propertyInterest?: string;
  satisfaction?: number;
  responseTime?: string;
}

const chats: Chat[] = [
  {
    id: '1',
    customerName: 'Maria Santos',
    customerEmail: 'maria@email.com',
    customerPhone: '(11) 99999-0001',
    lastMessage: 'Gostaria de saber mais sobre o apartamento no Centro',
    lastMessageTime: '10:30',
    status: 'active',
    unreadCount: 2,
    assignedAgent: 'João Silva',
    tags: ['apartamento', 'centro', 'venda'],
    priority: 'high',
    source: 'website',
    propertyInterest: 'Apt 2 quartos - Centro',
    satisfaction: 4.8,
    responseTime: '2 min',
  },
  {
    id: '2',
    customerName: 'Carlos Oliveira',
    customerEmail: 'carlos@email.com',
    customerPhone: '(11) 88888-0002',
    lastMessage: 'Qual o valor do aluguel da casa em Moema?',
    lastMessageTime: '09:45',
    status: 'waiting',
    unreadCount: 1,
    tags: ['casa', 'moema', 'aluguel'],
    priority: 'medium',
    source: 'whatsapp',
    propertyInterest: 'Casa 3 quartos - Moema',
    satisfaction: 4.5,
    responseTime: '5 min',
  },
];

const messages: Message[] = [
  {
    id: '1',
    text: 'Olá! Vi o anúncio do apartamento no Centro e gostaria de saber mais informações.',
    sender: 'user',
    timestamp: '10:25',
    senderName: 'Maria Santos',
  },
  {
    id: '2',
    text: 'Olá, Maria! Seja bem-vinda. O apartamento que você viu é excelente. Posso te ajudar com alguma informação específica?',
    sender: 'agent',
    timestamp: '10:26',
    senderName: 'João Silva',
  },
];

const agents = [
  { id: '1', name: 'João Silva', status: 'online', avatar: 'JS', rating: 4.8 },
  { id: '2', name: 'Maria Rodrigues', status: 'online', avatar: 'MR', rating: 4.9 },
  { id: '3', name: 'Pedro Santos', status: 'busy', avatar: 'PS', rating: 4.7 },
];

const quickResponses = [
  'Olá! Como posso ajudar?',
  'Qual imóvel você tem interesse?',
  'Gostaria de agendar uma visita?',
  'Posso enviar mais fotos do imóvel?',
  'Qual sua faixa de orçamento?',
  'Você já visitou outros imóveis?',
];

export function EsiChat() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(chats[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat]);

  const getStatusColor = (status: Chat['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'waiting': return 'bg-yellow-500';
      case 'closed': return 'bg-gray-500';
      case 'bot': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: Chat['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || chat.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      console.log('Sending message:', messageInput);
      setMessageInput('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">esi.chat</h1>
                <p className="text-gray-600 mt-1">Sistema de atendimento inteligente</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur">
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </Button>
            <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Sparkles className="h-4 w-4 mr-2" />
              Nova Conversa
            </Button>
          </div>
        </div>

        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>esi.chat</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversas Ativas</CardTitle>
              <MessageCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-gray-600">3 esperando resposta</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Resposta</CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
              <p className="text-xs text-gray-600">Tempo médio: 2min</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satisfação</CardTitle>
              <Star className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8</div>
              <p className="text-xs text-gray-600">Baseado em 156 avaliações</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agentes Online</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6/8</div>
              <p className="text-xs text-gray-600">2 ocupados</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat List */}
          <Card className="lg:col-span-1 bg-white/80 backdrop-blur border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Conversas</CardTitle>
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar conversas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/50"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="bg-white/50">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Ativos</SelectItem>
                    <SelectItem value="waiting">Aguardando</SelectItem>
                    <SelectItem value="closed">Fechados</SelectItem>
                    <SelectItem value="bot">Bot</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="space-y-1 p-2">
                  {filteredChats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`p-3 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                        selectedChat?.id === chat.id 
                          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200' 
                          : 'hover:bg-white/50'
                      }`}
                      onClick={() => setSelectedChat(chat)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                              {chat.customerName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{chat.customerName}</p>
                            <p className="text-xs text-gray-500">{chat.lastMessageTime}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(chat.status)}`} />
                          {chat.unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {chat.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 truncate mb-2">{chat.lastMessage}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Badge variant="outline" className={`text-xs ${getPriorityColor(chat.priority)}`}>
                            {chat.priority}
                          </Badge>
                          {chat.satisfaction && (
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              <span className="text-xs">{chat.satisfaction}</span>
                            </div>
                          )}
                        </div>
                        {chat.responseTime && (
                          <span className="text-xs text-gray-500">{chat.responseTime}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-3 bg-white/80 backdrop-blur border-0 shadow-lg">
            {selectedChat ? (
              <>
                <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                          {selectedChat.customerName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{selectedChat.customerName}</CardTitle>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span className={`w-2 h-2 rounded-full ${getStatusColor(selectedChat.status)}`} />
                          <span>{selectedChat.status === 'active' ? 'Ativo' : selectedChat.status === 'waiting' ? 'Aguardando' : selectedChat.status === 'bot' ? 'Bot' : 'Fechado'}</span>
                          <span>•</span>
                          <span>{selectedChat.source}</span>
                          {selectedChat.propertyInterest && (
                            <>
                              <span>•</span>
                              <span>{selectedChat.propertyInterest}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" className="bg-white/80">
                        <PhoneCall className="h-4 w-4 mr-2" />
                        Ligação
                      </Button>
                      <Button variant="outline" size="sm" className="bg-white/80" onClick={() => setIsVideoCall(!isVideoCall)}>
                        <Video className="h-4 w-4 mr-2" />
                        Vídeo
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="bg-white/80">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <User className="h-4 w-4 mr-2" />
                            Ver Perfil
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Home className="h-4 w-4 mr-2" />
                            Ver Imóveis
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Archive className="h-4 w-4 mr-2" />
                            Arquivar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>

                {/* Video Call Area */}
                {isVideoCall && (
                  <div className="border-b bg-gray-900 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-32 h-24 bg-gray-800 rounded-lg flex items-center justify-center">
                          <User className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="text-white">
                          <p className="font-medium">Chamada com {selectedChat.customerName}</p>
                          <p className="text-sm text-gray-400">00:00</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsMuted(!isMuted)}
                          className="text-white border-gray-600"
                        >
                          {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsVideoOff(!isVideoOff)}
                          className="text-white border-gray-600"
                        >
                          {isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setIsVideoCall(false)}
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Encerrar
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <CardContent className="p-0">
                  <ScrollArea className="h-[400px] p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === 'user' ? 'justify-end' : message.sender === 'bot' ? 'justify-center' : 'justify-start'}`}
                        >
                          {message.sender === 'bot' ? (
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3 max-w-md">
                              <div className="flex items-center space-x-2 mb-1">
                                <Bot className="h-4 w-4 text-blue-600" />
                                <span className="text-xs font-medium text-blue-600">Assistente Virtual</span>
                              </div>
                              <p className="text-sm">{message.text}</p>
                            </div>
                          ) : (
                            <div className={`flex items-start space-x-2 max-w-md ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                                  {message.sender === 'user' ? 'U' : message.senderAvatar || 'A'}
                                </AvatarFallback>
                              </Avatar>
                              <div className={`rounded-xl p-3 ${message.sender === 'user' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' : 'bg-white border border-gray-200'}`}>
                                {message.senderName && (
                                  <p className={`text-xs font-medium mb-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-600'}`}>
                                    {message.senderName}
                                  </p>
                                )}
                                <p className="text-sm">{message.text}</p>
                                <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                                  {message.timestamp}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Quick Responses */}
                  <div className="border-t p-3 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {quickResponses.map((response, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => setMessageInput(response)}
                          className="text-xs bg-white/80 hover:bg-white"
                        >
                          {response}
                        </Button>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="flex items-end space-x-2">
                      <Button variant="outline" size="sm" className="bg-white/80">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <div className="flex-1">
                        <Input
                          placeholder="Digite sua mensagem..."
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          className="bg-white/80"
                        />
                      </div>
                      <Button variant="outline" size="sm" className="bg-white/80">
                        <Smile className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={isRecording ? 'destructive' : 'outline'}
                        size="sm"
                        onClick={() => setIsRecording(!isRecording)}
                        className="bg-white/80"
                      >
                        <Mic className="h-4 w-4" />
                      </Button>
                      <Button 
                        onClick={handleSendMessage}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-[600px]">
                <div className="text-center">
                  <div className="p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl mb-4 inline-block">
                    <MessageCircle className="h-12 w-12 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Selecione uma conversa</h3>
                  <p className="text-gray-600">Escolha uma conversa da lista para começar a atender</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Agents Status */}
        <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              <span>Agentes Conectados</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {agents.map((agent) => (
                <div key={agent.id} className="flex items-center space-x-3 p-3 bg-white/50 rounded-xl border border-gray-200">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                        {agent.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                      agent.status === 'online' ? 'bg-green-500' :
                      agent.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{agent.name}</p>
                    <div className="flex items-center space-x-2 text-sm">
                      <p className="text-gray-600">
                        {agent.status === 'online' ? 'Online' :
                         agent.status === 'busy' ? 'Ocupado' : 'Offline'}
                      </p>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span>{agent.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Chat Modal */}
      <Dialog open={showNewChatModal} onOpenChange={setShowNewChatModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nova Conversa</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="customerName">Nome do Cliente</Label>
              <Input id="customerName" placeholder="Digite o nome do cliente" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customerEmail">E-mail</Label>
              <Input id="customerEmail" type="email" placeholder="cliente@email.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customerPhone">Telefone</Label>
              <Input id="customerPhone" placeholder="(11) 99999-0000" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="source">Origem</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a origem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="email">E-mail</SelectItem>
                  <SelectItem value="phone">Telefone</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="priority">Prioridade</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewChatModal(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setShowNewChatModal(false)} className="bg-gradient-to-r from-blue-600 to-indigo-600">
              Criar Conversa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
