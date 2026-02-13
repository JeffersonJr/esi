import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Home, 
  User, 
  Clock, 
  FileText, 
  MessageCircle,
  Edit,
  Trash2,
  Eye,
  Download,
  Send,
  History,
  Building,
  DollarSign,
  Star,
  TrendingUp,
  Activity,
  Target,
  Plus,
  UserCheck
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  property: string;
  value: string;
  source: string;
  assignedTo: string;
  notes?: string;
  stage?: string;
  lastContact?: string;
  nextAction?: string;
  createdAt?: string;
  address?: string;
  city?: string;
  state?: string;
  cep?: string;
  budget?: string;
  financing?: boolean;
  timeline?: string;
  priorities?: string[];
}

interface HistoricoAtendimento {
  id: string;
  data: string;
  tipo: 'ligacao' | 'email' | 'visita' | 'proposta' | 'reuniao' | 'whatsapp' | 'followup';
  descricao: string;
  usuario: string;
  duracao?: string;
  resultado?: string;
  proximoPasso?: string;
  anexos?: string[];
}

interface ImovelInteresse {
  id: string;
  titulo: string;
  tipo: string;
  endereco: string;
  valor: string;
  area: string;
  quartos: number;
  banheiros: number;
  vagas: number;
  descricao: string;
  status: string;
  match: number;
  imagens: string[];
}

const mockLead: Lead = {
  id: '1',
  name: 'Maria Santos',
  email: 'maria.santos@email.com',
  phone: '(11) 99999-0001',
  property: 'Apartamento 2 quartos',
  value: 'R$ 350.000',
  source: 'Website',
  assignedTo: 'JS',
  notes: 'Cliente muito interessado, já visitou 2 imóveis. Busca apartamento com 2 quartos, próximo ao metrô. Prefere região central ou zona sul.',
  stage: 'visit',
  lastContact: '2024-12-18T14:30:00',
  nextAction: 'Visita agendada para 20/12/2024 às 15:00',
  createdAt: '2024-12-01T09:00:00',
  address: 'Rua das Flores, 123',
  city: 'São Paulo',
  state: 'SP',
  cep: '01234-567',
  budget: 'R$ 300.000 - R$ 400.000',
  financing: true,
  timeline: '1-2 meses',
  priorities: ['Localização', 'Segurança', 'Transporte', 'Área']
};

const historicoAtendimento: HistoricoAtendimento[] = [
  {
    id: '1',
    data: '2024-12-18T14:30:00',
    tipo: 'ligacao',
    descricao: 'Cliente ligou para confirmar visita do dia 20/12. Confirmou presença e perguntou sobre estacionamento.',
    usuario: 'João Silva',
    duracao: '15 minutos',
    resultado: 'Visita confirmada',
    proximoPasso: 'Realizar visita no dia 20/12',
    anexos: ['proposta_apartamento.pdf']
  },
  {
    id: '2',
    data: '2024-12-17T10:15:00',
    tipo: 'whatsapp',
    descricao: 'Enviado fotos do apartamento da Vila Mariana. Cliente demonstrou interesse.',
    usuario: 'João Silva',
    resultado: 'Cliente interessado',
    proximoPasso: 'Agendar visita'
  },
  {
    id: '3',
    data: '2024-12-15T16:00:00',
    tipo: 'visita',
    descricao: 'Visita ao apartamento no Centro. Cliente gostou mas achou pequeno.',
    usuario: 'Maria Rodrigues',
    duracao: '45 minutos',
    resultado: 'Imóvel não atende 100%',
    proximoPasso: 'Apresentar outras opções'
  },
  {
    id: '4',
    data: '2024-12-12T14:20:00',
    tipo: 'email',
    descricao: 'Envio de catálogo com 5 opções de imóveis dentro do perfil do cliente.',
    usuario: 'João Silva',
    resultado: 'Cliente analisando opções',
    proximoPasso: 'Follow-up em 2 dias'
  },
  {
    id: '5',
    data: '2024-12-10T11:30:00',
    tipo: 'ligacao',
    descricao: 'Primeiro contato. Cliente buscando apartamento 2 quartos, orçamento até R$ 400k.',
    usuario: 'João Silva',
    duracao: '20 minutos',
    resultado: 'Lead qualificado',
    proximoPasso: 'Enviar opções de imóveis'
  }
];

const imoveisInteresse: ImovelInteresse[] = [
  {
    id: '1',
    titulo: 'Apartamento 2 Quartos - Vila Mariana',
    tipo: 'Apartamento',
    endereco: 'Rua Vergueiro, 1500 - Vila Mariana, São Paulo',
    valor: 'R$ 380.000',
    area: '65m²',
    quartos: 2,
    banheiros: 1,
    vagas: 1,
    descricao: 'Excelente apartamento reformado, próximo ao metrô Vila Mariana.',
    status: 'Disponível',
    match: 95,
    imagens: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop']
  },
  {
    id: '2',
    titulo: 'Apartamento 2 Quartos - Paraíso',
    tipo: 'Apartamento',
    endereco: 'Rua da Consolação, 200 - Paraíso, São Paulo',
    valor: 'R$ 420.000',
    area: '70m²',
    quartos: 2,
    banheiros: 2,
    vagas: 1,
    descricao: 'Amplo apartamento com vista livre, 2 vagas na garagem.',
    status: 'Disponível',
    match: 88,
    imagens: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop']
  },
  {
    id: '3',
    titulo: 'Apartamento 2 Quartos - Centro',
    tipo: 'Apartamento',
    endereco: 'Rua São Bento, 500 - Centro, São Paulo',
    valor: 'R$ 350.000',
    area: '60m²',
    quartos: 2,
    banheiros: 1,
    vagas: 0,
    descricao: 'Apartamento em excelente localização, reformado recentemente.',
    status: 'Disponível',
    match: 82,
    imagens: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop']
  }
];

const getTipoIcon = (tipo: string) => {
  switch (tipo) {
    case 'ligacao': return Phone;
    case 'email': return Mail;
    case 'visita': return Home;
    case 'proposta': return FileText;
    case 'reuniao': return User;
    case 'whatsapp': return MessageCircle;
    case 'followup': return Clock;
    default: return Activity;
  }
};

const getTipoColor = (tipo: string) => {
  switch (tipo) {
    case 'ligacao': return 'bg-blue-100 text-blue-700';
    case 'email': return 'bg-green-100 text-green-700';
    case 'visita': return 'bg-purple-100 text-purple-700';
    case 'proposta': return 'bg-orange-100 text-orange-700';
    case 'reuniao': return 'bg-red-100 text-red-700';
    case 'whatsapp': return 'bg-green-100 text-green-700';
    case 'followup': return 'bg-gray-100 text-gray-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export function LeadDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [selectedCorretor, setSelectedCorretor] = useState('');

  const corretores = [
    { id: 'JS', nome: 'João Silva' },
    { id: 'MR', nome: 'Maria Rodrigues' },
    { id: 'PS', nome: 'Pedro Santos' },
    { id: 'AC', nome: 'Ana Costa' }
  ];

  const handleWhatsApp = () => {
    if (lead) {
      const cleanPhone = lead.phone.replace(/\D/g, '');
      window.open(`https://wa.me/55${cleanPhone}`, '_blank');
    }
  };

  const handleAssignCorretor = () => {
    if (lead && selectedCorretor) {
      setLead({ ...lead, assignedTo: selectedCorretor });
      setShowAssignModal(false);
      setSelectedCorretor('');
    }
  };

  const handleAddNote = () => {
    if (lead && newNote.trim()) {
      const updatedLead = {
        ...lead,
        notes: lead.notes ? `${lead.notes}\n\n${new Date().toLocaleDateString('pt-BR')} - ${newNote}` : `${new Date().toLocaleDateString('pt-BR')} - ${newNote}`
      };
      setLead(updatedLead);
      setShowNoteModal(false);
      setNewNote('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando detalhes do lead...</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    // Simular carregamento dos dados do lead
    setTimeout(() => {
      setLead(mockLead);
      setLoading(false);
    }, 500);
  }, [id]);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Lead não encontrado</p>
          <Button onClick={() => navigate('/funil')}>
            Voltar para o Funil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/funil')} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
              <p className="text-sm text-gray-500">Detalhes completos do lead</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2" onClick={() => setShowAssignModal(true)}>
              <UserCheck className="h-4 w-4" />
              Mudar Corretor
            </Button>
            <Button variant="outline" className="gap-2" onClick={handleWhatsApp}>
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Button>
            <Button className="gap-2">
              <Calendar className="h-4 w-4" />
              Agendar Atividade
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => setShowNoteModal(true)}>
              <Plus className="h-4 w-4" />
              Adicionar Nota
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações Principais */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informações do Lead
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {lead.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{lead.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {lead.stage === 'new' && 'Novo Lead'}
                      {lead.stage === 'contact' && 'Contato Realizado'}
                      {lead.stage === 'visit' && 'Visita Agendada'}
                      {lead.stage === 'proposal' && 'Proposta Enviada'}
                      {lead.stage === 'negotiation' && 'Negociação'}
                      {lead.stage === 'closed' && 'Fechado'}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{lead.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{lead.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{lead.address}, {lead.city} - {lead.state}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{lead.property}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{lead.value}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Orçamento:</span>
                    <span className="font-medium">{lead.budget}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Financiamento:</span>
                    <span className="font-medium">{lead.financing ? 'Sim' : 'Não'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Prazo:</span>
                    <span className="font-medium">{lead.timeline}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Origem:</span>
                    <span className="font-medium">{lead.source}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Responsável:</span>
                    <span className="font-medium">{lead.assignedTo}</span>
                  </div>
                </div>

                {lead.priorities && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">Prioridades</h4>
                      <div className="flex flex-wrap gap-1">
                        {lead.priorities.map((priority, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {priority}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {lead.notes && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">Observações</h4>
                      <p className="text-sm text-muted-foreground">{lead.notes}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Próxima Ação */}
            {lead.nextAction && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Próxima Ação
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{lead.nextAction}</p>
                </CardContent>
              </Card>
            )}

            {/* Estatísticas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Estatísticas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Contatos realizados:</span>
                  <span className="font-medium">{historicoAtendimento.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Último contato:</span>
                  <span className="font-medium">
                    {lead.lastContact ? format(new Date(lead.lastContact), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) : '-'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Lead desde:</span>
                  <span className="font-medium">
                    {lead.createdAt ? format(new Date(lead.createdAt), "dd/MM/yyyy", { locale: ptBR }) : '-'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Imóveis visitados:</span>
                  <span className="font-medium">2</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Conteúdo Principal */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="historico" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="historico">Histórico</TabsTrigger>
                <TabsTrigger value="imoveis">Imóveis de Interesse</TabsTrigger>
                <TabsTrigger value="documentos">Documentos</TabsTrigger>
              </TabsList>

              <TabsContent value="historico" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <History className="h-5 w-5" />
                      Histórico de Atendimento
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {historicoAtendimento.map((item, index) => {
                        const Icon = getTipoIcon(item.tipo);
                        return (
                          <div key={item.id} className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${getTipoColor(item.tipo)}`}>
                                  <Icon className="h-4 w-4" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium capitalize">{item.tipo}</h4>
                                    <Badge variant="outline" className="text-xs">
                                      {format(new Date(item.data), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    Por {item.usuario}
                                    {item.duracao && ` • ${item.duracao}`}
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <p className="text-sm">{item.descricao}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              {item.resultado && (
                                <div>
                                  <span className="font-medium text-green-600">Resultado:</span>
                                  <p className="text-muted-foreground">{item.resultado}</p>
                                </div>
                              )}
                              {item.proximoPasso && (
                                <div>
                                  <span className="font-medium text-blue-600">Próximo passo:</span>
                                  <p className="text-muted-foreground">{item.proximoPasso}</p>
                                </div>
                              )}
                            </div>

                            {item.anexos && item.anexos.length > 0 && (
                              <div className="flex items-center gap-2 text-sm">
                                <FileText className="h-4 w-4" />
                                <span>Anexos:</span>
                                <div className="flex gap-2">
                                  {item.anexos.map((anexo, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {anexo}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="imoveis" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {imoveisInteresse.map((imovel) => (
                    <Card key={imovel.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div className="relative h-40 rounded-lg overflow-hidden">
                            <img
                              src={imovel.imagens[0]}
                              alt={imovel.titulo}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-green-500 text-white">
                                {imovel.match}% match
                              </Badge>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="font-semibold">{imovel.titulo}</h3>
                            <p className="text-sm text-muted-foreground">{imovel.endereco}</p>
                            <p className="text-lg font-bold text-primary mt-1">{imovel.valor}</p>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div className="text-center">
                              <div className="font-medium">{imovel.quartos}</div>
                              <div className="text-muted-foreground">Quartos</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium">{imovel.banheiros}</div>
                              <div className="text-muted-foreground">Banheiros</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium">{imovel.vagas}</div>
                              <div className="text-muted-foreground">Vagas</div>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground">{imovel.descricao}</p>
                          
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Eye className="h-4 w-4 mr-1" />
                              Ver
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              <Calendar className="h-4 w-4 mr-1" />
                              Visitar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="documentos" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Documentos do Lead
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-md bg-muted">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium">Proposta Comercial.pdf</p>
                              <p className="text-sm text-muted-foreground">2.4 MB • 15/12/2024</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-md bg-muted">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium">Ficha Cadastral.pdf</p>
                              <p className="text-sm text-muted-foreground">850 KB • 10/12/2024</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-md bg-muted">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium">Documentos Necessários.docx</p>
                              <p className="text-sm text-muted-foreground">1.1 MB • 05/12/2024</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
