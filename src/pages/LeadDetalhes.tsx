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
  UserCheck,
  MoreVertical,
  Car
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

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
  tags?: string[];
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
  notaAtividade?: string;
  avaliacao?: 'boa' | 'ruim' | null;
  editavel?: boolean;
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

interface Documento {
  id: string;
  nome: string;
  tamanho: string;
  data: string;
  tipo: string;
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
  priorities: ['Localização', 'Segurança', 'Transporte', 'Área'],
  tags: ['prioridade-alta', 'financiamento', 'zona-sul']
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
    anexos: ['proposta_apartamento.pdf'],
    notaAtividade: 'Cliente parece muito comprometido com a compra',
    avaliacao: 'boa',
    editavel: false
  },
  {
    id: '2',
    data: '2024-12-17T10:15:00',
    tipo: 'whatsapp',
    descricao: 'Enviado fotos do apartamento da Vila Mariana. Cliente demonstrou interesse.',
    usuario: 'João Silva',
    resultado: 'Cliente interessado',
    proximoPasso: 'Agendar visita',
    notaAtividade: 'Respondeu rapidamente às fotos',
    avaliacao: 'boa',
    editavel: false
  },
  {
    id: '3',
    data: '2024-12-15T16:00:00',
    tipo: 'visita',
    descricao: 'Visita ao apartamento no Centro. Cliente gostou mas achou pequeno.',
    usuario: 'Maria Rodrigues',
    duracao: '45 minutos',
    resultado: 'Imóvel não atende 100%',
    proximoPasso: 'Apresentar outras opções',
    notaAtividade: 'Gostou da localização mas precisa de mais espaço',
    avaliacao: 'ruim',
    editavel: false
  },
  {
    id: '4',
    data: '2024-12-12T14:20:00',
    tipo: 'email',
    descricao: 'Envio de catálogo com 5 opções de imóveis dentro do perfil do cliente.',
    usuario: 'João Silva',
    resultado: 'Cliente analisando opções',
    proximoPasso: 'Follow-up em 2 dias',
    editavel: false
  },
  {
    id: '5',
    data: '2024-12-10T11:30:00',
    tipo: 'ligacao',
    descricao: 'Primeiro contato. Cliente buscando apartamento 2 quartos, orçamento até R$ 400k.',
    usuario: 'João Silva',
    duracao: '20 minutos',
    resultado: 'Lead qualificado',
    proximoPasso: 'Enviar opções de imóveis',
    editavel: false
  }
];

const documentosMock: Documento[] = [
  {
    id: '1',
    nome: 'Proposta Comercial.pdf',
    tamanho: '2.4 MB',
    data: '15/12/2024',
    tipo: 'pdf'
  },
  {
    id: '2',
    nome: 'Ficha Cadastral.pdf',
    tamanho: '850 KB',
    data: '10/12/2024',
    tipo: 'pdf'
  },
  {
    id: '3',
    nome: 'Documentos Necessários.docx',
    tamanho: '1.1 MB',
    data: '05/12/2024',
    tipo: 'docx'
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
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditNoteModal, setShowEditNoteModal] = useState(false);
  const [showAddDocumentModal, setShowAddDocumentModal] = useState(false);
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [showActivityDetailsModal, setShowActivityDetailsModal] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [selectedCorretor, setSelectedCorretor] = useState('');
  const [activityData, setActivityData] = useState({
    tipo: 'ligacao',
    data: new Date(),
    hora: '14:00',
    descricao: ''
  });
  const [historico, setHistorico] = useState<HistoricoAtendimento[]>(historicoAtendimento);
  const [editData, setEditData] = useState({
    budget: '',
    financing: false,
    timeline: '',
    source: '',
    assignedTo: '',
    tags: [] as string[],
    priorities: [] as string[],
    notes: ''
  });
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendMethod, setSendMethod] = useState<'email' | 'whatsapp'>('email');
  const [newEditTag, setNewEditTag] = useState('');
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{show: boolean, documentId: string, documentName: string}>({show: false, documentId: '', documentName: ''});
  const [editingNote, setEditingNote] = useState<{id: string, content: string} | null>(null);
  const [documentos, setDocumentos] = useState<Documento[]>(documentosMock);
  const [newDocument, setNewDocument] = useState({nome: '', arquivo: null as File | null});
  const [leadTags, setLeadTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<HistoricoAtendimento | null>(null);
  const [activityNote, setActivityNote] = useState('');
  const [activityRating, setActivityRating] = useState<'boa' | 'ruim' | null>(null);

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
      const novaNota: HistoricoAtendimento = {
        id: Date.now().toString(),
        data: new Date().toISOString(),
        tipo: 'followup',
        descricao: newNote,
        usuario: 'Usuário Atual',
        resultado: 'Nota adicionada',
        proximoPasso: '',
        editavel: true
      };
      
      setHistorico([novaNota, ...historico]);
      
      const updatedLead = {
        ...lead,
        notes: lead.notes ? `${lead.notes}\n\n${new Date().toLocaleDateString('pt-BR')} - ${newNote}` : `${new Date().toLocaleDateString('pt-BR')} - ${newNote}`
      };
      setLead(updatedLead);
      setShowNoteModal(false);
      setNewNote('');
    }
  };

  const handleEditNote = (noteId: string, currentContent: string) => {
    setEditingNote({id: noteId, content: currentContent});
    setShowEditNoteModal(true);
  };

  const handleSaveEditNote = () => {
    if (editingNote) {
      setHistorico(historico.map(item => 
        item.id === editingNote.id 
          ? {...item, descricao: editingNote.content}
          : item
      ));
      setShowEditNoteModal(false);
      setEditingNote(null);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    setHistorico(historico.filter(item => item.id !== noteId));
  };

  const handleAddDocument = () => {
    if (newDocument.nome && newDocument.arquivo) {
      const documento: Documento = {
        id: Date.now().toString(),
        nome: newDocument.nome,
        tamanho: `${(newDocument.arquivo.size / 1024 / 1024).toFixed(1)} MB`,
        data: new Date().toLocaleDateString('pt-BR'),
        tipo: newDocument.arquivo.name.split('.').pop() || 'unknown'
      };
      setDocumentos([documento, ...documentos]);
      setNewDocument({nome: '', arquivo: null});
      setShowAddDocumentModal(false);
    }
  };

  const handleDeleteDocument = (documentId: string, documentName: string) => {
    setDeleteConfirmModal({show: true, documentId, documentName});
  };

  const confirmDeleteDocument = () => {
    if (deleteConfirmModal.documentId) {
      setDocumentos(documentos.filter(doc => doc.id !== deleteConfirmModal.documentId));
      setDeleteConfirmModal({show: false, documentId: '', documentName: ''});
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && lead && !lead.tags?.includes(newTag.trim())) {
      const updatedLead = {
        ...lead,
        tags: [...(lead.tags || []), newTag.trim()]
      };
      setLead(updatedLead);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (lead) {
      const updatedLead = {
        ...lead,
        tags: lead.tags?.filter(tag => tag !== tagToRemove) || []
      };
      setLead(updatedLead);
    }
  };

  const handleActivityDetails = (activity: HistoricoAtendimento) => {
    setSelectedActivity(activity);
    setActivityNote(activity.notaAtividade || '');
    setActivityRating(activity.avaliacao || null);
    setShowActivityDetailsModal(true);
  };

  const handleViewProperty = (propertyId: string) => {
    navigate(`/imovel/${propertyId}`);
  };

  const handleScheduleVisit = (property: any) => {
    setActivityData({
      ...activityData,
      tipo: 'visita',
      descricao: `Visita ao imóvel: ${property.titulo}`
    });
    setShowActivityModal(true);
  };

  const handlePropertySelection = (propertyId: string) => {
    setSelectedProperties(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handleSendProperties = () => {
    if (selectedProperties.length > 0) {
      setShowSendModal(true);
    }
  };

  const handleConfirmSend = () => {
    const selectedImoveis = imoveisInteresse.filter(imovel => 
      selectedProperties.includes(imovel.id)
    );
    
    if (sendMethod === 'email') {
      window.open(`mailto:${lead.email}?subject=Imóveis de Interesse&body=${encodeURIComponent(selectedImoveis.map(imovel => `${imovel.titulo} - ${imovel.valor}`).join('\n'))}`);
    } else {
      const message = selectedImoveis.map(imovel => `${imovel.titulo} - ${imovel.valor}`).join('\n');
      window.open(`https://wa.me/55${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${lead.name}, aqui estão os imóveis que selecionei para você:\n\n${message}`)}`);
    }
    setShowSendModal(false);
  };

  const handleCreateActivityFromNextStep = (nextStep: string) => {
    // Extrair o tipo de atividade do próximo passo
    let activityType = 'ligacao'; // padrão
    
    if (nextStep.toLowerCase().includes('ligacao')) activityType = 'ligacao';
    else if (nextStep.toLowerCase().includes('email')) activityType = 'email';
    else if (nextStep.toLowerCase().includes('visita')) activityType = 'visita';
    else if (nextStep.toLowerCase().includes('reuniao')) activityType = 'reuniao';
    else if (nextStep.toLowerCase().includes('proposta')) activityType = 'proposta';
    else if (nextStep.toLowerCase().includes('whatsapp')) activityType = 'whatsapp';
    else if (nextStep.toLowerCase().includes('followup')) activityType = 'followup';
    
    setActivityData({
      ...activityData,
      tipo: activityType,
      descricao: `Realizar ${activityType} - ${nextStep}`
    });
    setShowActivityModal(true);
  };

  const handleAddEditTag = () => {
    if (newEditTag.trim() && !editData.tags.includes(newEditTag.trim())) {
      setEditData({...editData, tags: [...editData.tags, newEditTag.trim()]});
      setNewEditTag('');
    }
  };

  const handleSaveActivityDetails = () => {
    if (selectedActivity) {
      setHistorico(historico.map(item => 
        item.id === selectedActivity.id 
          ? {...item, notaAtividade: activityNote, avaliacao: activityRating}
          : item
      ));
      setShowActivityDetailsModal(false);
      setSelectedActivity(null);
      setActivityNote('');
      setActivityRating(null);
    }
  };

  const handleEditLead = () => {
    if (lead) {
      setEditData({
        budget: lead.budget || '',
        financing: lead.financing || false,
        timeline: lead.timeline || '',
        source: lead.source || '',
        assignedTo: lead.assignedTo || '',
        tags: lead.tags || [],
        priorities: lead.priorities || [],
        notes: lead.notes || ''
      });
      setShowEditModal(true);
    }
  };

  const handleSaveEdit = () => {
    if (lead) {
      const updatedLead = {
        ...lead,
        budget: editData.budget,
        financing: editData.financing,
        timeline: editData.timeline,
        source: editData.source,
        assignedTo: editData.assignedTo,
        tags: editData.tags,
        priorities: editData.priorities,
        notes: editData.notes
      };
      setLead(updatedLead);
      setShowEditModal(false);
    }
  };

  const handleScheduleActivity = () => {
    if (lead && activityData.descricao.trim()) {
      const novaAtividade: HistoricoAtendimento = {
        id: Date.now().toString(),
        data: new Date(activityData.data.getFullYear(), activityData.data.getMonth(), activityData.data.getDate(), 
                parseInt(activityData.hora.split(':')[0]), parseInt(activityData.hora.split(':')[1])).toISOString(),
        tipo: activityData.tipo as any,
        descricao: activityData.descricao,
        usuario: 'Usuário Atual',
        resultado: 'Atividade agendada',
        proximoPasso: `Realizar ${activityData.tipo} em ${activityData.data.toLocaleDateString('pt-BR')} às ${activityData.hora}`
      };
      
      setHistorico([novaAtividade, ...historico]);
      
      const updatedLead = {
        ...lead,
        nextAction: `${activityData.tipo} agendada para ${activityData.data.toLocaleDateString('pt-BR')} às ${activityData.hora}`
      };
      setLead(updatedLead);
      setShowActivityModal(false);
      setActivityData({
        tipo: 'ligacao',
        data: new Date(),
        hora: '14:00',
        descricao: ''
      });
    }
  };


  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    // Simular carregamento dos dados do lead
    setTimeout(() => {
      setLead(mockLead);
      setLoading(false);
    }, 500);
  }, [id]);

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

  if (!lead) {
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <MoreVertical className="h-4 w-4" />
                  Ações
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEditLead}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowAssignModal(true)}>
                  <UserCheck className="h-4 w-4 mr-2" />
                  Mudar Corretor
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleWhatsApp}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowActivityModal(true)}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar Atividade
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowNoteModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Nota
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowTagsModal(true)}>
                  <Target className="h-4 w-4 mr-2" />
                  Tags
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

                {lead.tags && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-1">
                        {lead.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

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
                      <p className="text-sm text-muted-foreground whitespace-pre-line">{lead.notes}</p>
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
                      {historico.map((item, index) => {
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
                                    {item.avaliacao && (
                                      <Badge variant={item.avaliacao === 'boa' ? 'default' : 'destructive'} className="text-xs">
                                        {item.avaliacao === 'boa' ? 'Boa' : 'Ruim'}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    Por {item.usuario}
                                    {item.duracao && ` • ${item.duracao}`}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleActivityDetails(item)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {item.editavel && (
                                  <>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => handleEditNote(item.id, item.descricao)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => handleDeleteNote(item.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                            
                            <p className="text-sm">{item.descricao}</p>
                            
                            {item.notaAtividade && (
                              <div className="bg-muted p-2 rounded text-sm">
                                <span className="font-medium">Nota sobre atividade:</span> {item.notaAtividade}
                              </div>
                            )}
                            
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
                                  <div className="flex items-center gap-2 mt-1">
                                    <p className="text-muted-foreground">{item.proximoPasso}</p>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => handleCreateActivityFromNextStep(item.proximoPasso!)}
                                      className="h-6 px-2 text-xs"
                                    >
                                      <Plus className="h-3 w-3 mr-1" />
                                      Criar
                                    </Button>
                                  </div>
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
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Imóveis de Interesse</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleSendProperties}
                      disabled={selectedProperties.length === 0}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Enviar ({selectedProperties.length})
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {imoveisInteresse.map((imovel) => (
                    <div key={imovel.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          checked={selectedProperties.includes(imovel.id)}
                          onChange={() => handlePropertySelection(imovel.id)}
                          className="mt-1"
                        />
                        
                        <div className="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={imovel.imagens[0]}
                            alt={imovel.titulo}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-semibold">{imovel.titulo}</h3>
                              <p className="text-sm text-muted-foreground">{imovel.endereco}</p>
                              <p className="text-lg font-bold text-primary mt-1">{imovel.valor}</p>
                              
                              <div className="flex gap-4 mt-3 text-sm">
                                <span className="flex items-center gap-1">
                                  <Home className="h-4 w-4" />
                                  {imovel.quartos} quartos
                                </span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />
                                  {imovel.area} m²
                                </span>
                                <span className="flex items-center gap-1">
                                  <Car className="h-4 w-4" />
                                  {imovel.vagas} vagas
                                </span>
                              </div>
                              
                              <p className="text-sm text-muted-foreground mt-2">{imovel.descricao}</p>
                              
                              {/* Links Section */}
                              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-semibold text-sm mb-3">Links</h4>
                                
                                <div className="space-y-3">
                                  <div className="flex items-center gap-2">
                                    <Input
                                      value={`https://seusite.com/imovel/${imovel.id}`}
                                      readOnly
                                      className="flex-1 text-xs"
                                    />
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => copyToClipboard(`https://seusite.com/imovel/${imovel.id}`)}
                                    >
                                      Copiar
                                    </Button>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <Input
                                      value={`https://seusite.com/anuncio/${imovel.id}`}
                                      readOnly
                                      className="flex-1 text-xs"
                                    />
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => copyToClipboard(`https://seusite.com/anuncio/${imovel.id}`)}
                                    >
                                      Copiar
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex gap-2 ml-4">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleViewProperty(imovel.id)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Ver
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleScheduleVisit(imovel)}
                              >
                                <Calendar className="h-4 w-4 mr-1" />
                                Visitar
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="documentos" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Documentos do Lead
                      </div>
                      <Button onClick={() => setShowAddDocumentModal(true)} size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Adicionar
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {documentos.map((doc) => (
                        <div key={doc.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-md bg-muted">
                                <FileText className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-medium">{doc.nome}</p>
                                <p className="text-sm text-muted-foreground">{doc.tamanho} • {doc.data}</p>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDeleteDocument(doc.id, doc.nome)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Modal para Mudar Corretor */}
      <Dialog open={showAssignModal} onOpenChange={setShowAssignModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mudar Corretor Responsável</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="corretor">Selecione o novo corretor</Label>
              <Select value={selectedCorretor} onValueChange={setSelectedCorretor}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um corretor" />
                </SelectTrigger>
                <SelectContent>
                  {corretores.map((corretor) => (
                    <SelectItem key={corretor.id} value={corretor.id}>
                      {corretor.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAssignCorretor} disabled={!selectedCorretor}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para Agendar Atividade */}
      <Dialog open={showActivityModal} onOpenChange={setShowActivityModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Agendar Atividade</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="tipo-atividade">Tipo de Atividade</Label>
              <Select value={activityData.tipo} onValueChange={(value) => setActivityData({...activityData, tipo: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de atividade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ligacao">Ligação telefônica</SelectItem>
                  <SelectItem value="email">Envio de e-mail</SelectItem>
                  <SelectItem value="visita">Visita ao imóvel</SelectItem>
                  <SelectItem value="reuniao">Reunião presencial</SelectItem>
                  <SelectItem value="proposta">Apresentar proposta</SelectItem>
                  <SelectItem value="whatsapp">Contato via WhatsApp</SelectItem>
                  <SelectItem value="followup">Follow-up</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="data">Data</Label>
                <Input
                  id="data"
                  type="date"
                  value={activityData.data.toISOString().split('T')[0]}
                  onChange={(e) => setActivityData({...activityData, data: new Date(e.target.value)})}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label htmlFor="hora">Hora</Label>
                <Input
                  id="hora"
                  type="time"
                  value={activityData.hora}
                  onChange={(e) => setActivityData({...activityData, hora: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                placeholder="Descreva os detalhes da atividade..."
                value={activityData.descricao}
                onChange={(e) => setActivityData({...activityData, descricao: e.target.value})}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActivityModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleScheduleActivity} disabled={!activityData.descricao.trim()}>
              Agendar Atividade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para Editar Lead */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Lead</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budget">Orçamento</Label>
                <Input
                  id="budget"
                  placeholder="Ex: R$ 300.000 - R$ 400.000"
                  value={editData.budget}
                  onChange={(e) => setEditData({...editData, budget: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="timeline">Prazo</Label>
                <Input
                  id="timeline"
                  placeholder="Ex: 1-2 meses"
                  value={editData.timeline}
                  onChange={(e) => setEditData({...editData, timeline: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="source">Origem</Label>
                <Select value={editData.source} onValueChange={(value) => setEditData({...editData, source: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a origem" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="Redes Sociais">Redes Sociais</SelectItem>
                    <SelectItem value="Indicação">Indicação</SelectItem>
                    <SelectItem value="Telefone">Telefone</SelectItem>
                    <SelectItem value="E-mail">E-mail</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="assignedTo">Responsável</Label>
                <Select value={editData.assignedTo} onValueChange={(value) => setEditData({...editData, assignedTo: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o responsável" />
                  </SelectTrigger>
                  <SelectContent>
                    {corretores.map((corretor) => (
                      <SelectItem key={corretor.id} value={corretor.id}>
                        {corretor.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="financing"
                checked={editData.financing}
                onChange={(e) => setEditData({...editData, financing: e.target.checked})}
              />
              <Label htmlFor="financing">Financiamento</Label>
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Adicionar nova tag..."
                  value={newEditTag}
                  onChange={(e) => setNewEditTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddEditTag()}
                  className="flex-1"
                />
                <Button onClick={handleAddEditTag} disabled={!newEditTag.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {editData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                    <button
                      type="button"
                      className="ml-1 text-xs hover:text-red-600"
                      onClick={() => setEditData({...editData, tags: editData.tags.filter((_, i) => i !== index)})}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="priorities">Prioridades</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {['Localização', 'Segurança', 'Transporte', 'Área', 'Preço', 'Conservação'].map((priority) => (
                  <Badge
                    key={priority}
                    variant={editData.priorities.includes(priority) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      if (editData.priorities.includes(priority)) {
                        setEditData({...editData, priorities: editData.priorities.filter(p => p !== priority)});
                      } else {
                        setEditData({...editData, priorities: [...editData.priorities, priority]});
                      }
                    }}
                  >
                    {priority}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                placeholder="Digite suas observações..."
                value={editData.notes}
                onChange={(e) => setEditData({...editData, notes: e.target.value})}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showEditNoteModal} onOpenChange={setShowEditNoteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Nota</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-nota">Editar nota</Label>
              <Textarea
                id="edit-nota"
                placeholder="Edite sua nota aqui..."
                value={editingNote?.content || ''}
                onChange={(e) => setEditingNote(editingNote ? {...editingNote, content: e.target.value} : null)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditNoteModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEditNote}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para Adicionar Documento */}
      <Dialog open={showAddDocumentModal} onOpenChange={setShowAddDocumentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Documento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="nome-documento">Nome do documento</Label>
              <Input
                id="nome-documento"
                placeholder="Digite o nome do documento..."
                value={newDocument.nome}
                onChange={(e) => setNewDocument({...newDocument, nome: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="arquivo">Arquivo</Label>
              <Input
                id="arquivo"
                type="file"
                onChange={(e) => setNewDocument({...newDocument, arquivo: e.target.files?.[0] || null})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDocumentModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddDocument} disabled={!newDocument.nome || !newDocument.arquivo}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para Gerenciar Tags */}
      <Dialog open={showTagsModal} onOpenChange={setShowTagsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerenciar Tags</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="nova-tag">Adicionar nova tag</Label>
              <div className="flex gap-2">
                <Input
                  id="nova-tag"
                  placeholder="Digite uma nova tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <Button onClick={handleAddTag} disabled={!newTag.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <Label>Tags atuais</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {lead?.tags?.map((tag, index) => (
                  <div key={index} className="flex items-center gap-1 bg-secondary rounded-full px-3 py-1">
                    <span className="text-sm">{tag}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowTagsModal(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para Detalhes da Atividade */}
      <Dialog open={showActivityDetailsModal} onOpenChange={setShowActivityDetailsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes da Atividade</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="nota-atividade">Nota sobre a atividade</Label>
              <Textarea
                id="nota-atividade"
                placeholder="Adicione uma nota sobre esta atividade..."
                value={activityNote}
                onChange={(e) => setActivityNote(e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label>Avaliação da atividade</Label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="boa"
                    checked={activityRating === 'boa'}
                    onChange={(e) => setActivityRating(e.target.value as 'boa' | 'ruim')}
                  />
                  <span>Boa</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="ruim"
                    checked={activityRating === 'ruim'}
                    onChange={(e) => setActivityRating(e.target.value as 'boa' | 'ruim')}
                  />
                  <span>Ruim</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value=""
                    checked={activityRating === null}
                    onChange={() => setActivityRating(null)}
                  />
                  <span>Não avaliada</span>
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActivityDetailsModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveActivityDetails}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    {/* Modal para Enviar Imóveis */}
      <Dialog open={showSendModal} onOpenChange={setShowSendModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Imóveis Selecionados</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Selecione o método de envio</Label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="email"
                    checked={sendMethod === 'email'}
                    onChange={(e) => setSendMethod(e.target.value as 'email' | 'whatsapp')}
                  />
                  <span>E-mail</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="whatsapp"
                    checked={sendMethod === 'whatsapp'}
                    onChange={(e) => setSendMethod(e.target.value as 'email' | 'whatsapp')}
                  />
                  <span>WhatsApp</span>
                </label>
              </div>
            </div>
            
            <div>
              <Label>Imóveis selecionados ({selectedProperties.length})</Label>
              <div className="space-y-2 mt-2 max-h-40 overflow-y-auto">
                {imoveisInteresse.filter(imovel => selectedProperties.includes(imovel.id)).map((imovel) => (
                  <div key={imovel.id} className="text-sm p-2 bg-muted rounded">
                    <span className="font-medium">{imovel.titulo}</span> - {imovel.valor}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSendModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmSend}>
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    {/* Modal para Confirmar Exclusão de Documento */}
      <Dialog open={deleteConfirmModal.show} onOpenChange={(show) => setDeleteConfirmModal({...deleteConfirmModal, show})}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Tem certeza que deseja excluir o documento <strong>"{deleteConfirmModal.documentName}"</strong>?</p>
            <p className="text-sm text-muted-foreground">Esta ação não pode ser desfeita.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmModal({show: false, documentId: '', documentName: ''})}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDeleteDocument}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    
  </div>
  );
}
