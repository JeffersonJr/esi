import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  MessageCircle, 
  Home, 
  FileText, 
  Users, 
  ArrowRight,
  Edit,
  Trash2,
  Plus,
  Eye,
  Send,
  DollarSign,
  Car,
  MoreVertical,
  UserCheck,
  MessageSquare,
  Tag,
  StickyNote,
  X,
  AlertTriangle
} from 'lucide-react';

// Importar os novos componentes
import { ActivityEditModal } from '@/components/leads/ActivityEditModal';
import { LeadTabAtividades } from '@/components/leads/LeadTabAtividades';
import { LeadTabDocumentos } from '@/components/leads/LeadTabDocumentos';
import { LeadTabImoveis } from '@/components/leads/LeadTabImoveis';

import { Lead, HistoricoAtendimento, ImovelInteresse, Documento } from '@/types/lead';

const LeadDetalhes: React.FC = () => {
  const navigate = useNavigate();
  const { id: leadId } = useParams();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('atividades');
  
  // Estados para modais
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showActivityEditModal, setShowActivityEditModal] = useState(false);
  const [showActivityDetailsModal, setShowActivityDetailsModal] = useState(false);
  const [showNoteEditModal, setShowNoteEditModal] = useState(false);
  const [showAddDocumentModal, setShowAddDocumentModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showChangeAgentModal, setShowChangeAgentModal] = useState(false);
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [showDeleteActivityModal, setShowDeleteActivityModal] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<HistoricoAtendimento | null>(null);
  
  // Estados para dados
  const [historico, setHistorico] = useState<HistoricoAtendimento[]>([]);
  const [imoveisInteresse, setImoveisInteresse] = useState<ImovelInteresse[]>([]);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<HistoricoAtendimento | null>(null);
  const [activityNote, setActivityNote] = useState('');
  const [activityRating, setActivityRating] = useState<'boa' | 'ruim' | null>(null);
  const [activityTags, setActivityTags] = useState<string[]>([]);
  const [isActivityShowcased, setIsActivityShowcased] = useState(false);
  const [nextActivity, setNextActivity] = useState('');
  const [newDocument, setNewDocument] = useState({nome: '', arquivo: null as File | null});
  const [sendMethods, setSendMethods] = useState<{email: boolean, whatsapp: boolean}>({email: true, whatsapp: false});
  
  // Estados para edição do lead
  const [editLead, setEditLead] = useState({
    name: '',
    emails: [] as any[],
    phones: [] as any[],
    property: '',
    location: '',
    searchType: 'compra' as any,
    value: '',
    source: '',
    notes: '',
    tags: [] as string[]
  });
  
  // Estados para mudança de corretor
  const [selectedAgent, setSelectedAgent] = useState('');
  
  // Estados para tags
  const [newTag, setNewTag] = useState('');
  const [availableTags] = useState([
    'prioridade-alta', 'prioridade-media', 'prioridade-baixa',
    'financiamento', 'vista', 'troca',
    'zona-sul', 'zona-norte', 'zona-oeste', 'centro',
    'apartamento', 'casa', 'cobertura', 'kitnet',
    'primeira-compra', 'investidor', 'moradia'
  ]);
  
  // Estados para upload
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  
  // Estados para nota
  const [noteText, setNoteText] = useState('');
  const [noteFile, setNoteFile] = useState<File | null>(null);
  const [noteName, setNoteName] = useState('');
  
  // Estados para edição de nota
  const [editingNoteText, setEditingNoteText] = useState('');
  const [editingNoteFiles, setEditingNoteFiles] = useState<File[]>([]);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteName, setEditingNoteName] = useState('');
  
  // Estados para nova atividade
  const [newActivity, setNewActivity] = useState({
    tipo: 'ligacao',
    data: new Date().toISOString().split('T')[0],
    hora: new Date().toTimeString().slice(0, 5),
    descricao: ''
  });
  
  // Ref para o checkbox master
  const masterCheckboxRef = useRef<HTMLInputElement>(null);

  // Dados mockados para demonstração
  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setLead({
        id: leadId,
        name: 'João Silva',
        emails: [{ type: 'email', value: 'joao.silva@email.com', isPrimary: true }],
        phones: [{ type: 'phone', value: '11987654321', isPrimary: true }],
        property: 'Apartamento 3 quartos',
        location: 'São Paulo - SP',
        searchType: 'compra',
        value: 'R$ 500.000 - R$ 700.000',
        source: 'Website',
        assignedTo: 'Maria Santos',
        notes: 'Cliente interessado em imóveis na zona sul',
        stage: 'Negociação',
        lastContact: '2024-01-15',
        nextAction: 'Agendar visita',
        tags: ['prioridade-alta', 'zona-sul'],
        createdAt: '2024-01-10',
        updatedAt: '2024-01-15'
      });
      
      setHistorico([
        {
          id: '1',
          data: '2024-01-15',
          tipo: 'ligacao',
          descricao: 'Contato inicial para apresentação de imóveis',
          usuario: 'Maria Santos',
          duracao: '15 min',
          resultado: 'Cliente interessado em agendar visita',
          proximoPasso: 'Enviar proposta de visita',
          editavel: true
        },
        {
          id: '2',
          data: '2024-01-14',
          tipo: 'email',
          descricao: 'Envio de catálogo de imóveis disponíveis',
          usuario: 'Maria Santos',
          resultado: 'Cliente respondeu positivamente',
          editavel: true
        }
      ]);
      
      setImoveisInteresse([
        {
          id: '1',
          titulo: 'Apartamento 3 quartos - Moema',
          tipo: 'apartamento',
          endereco: 'Rua Moema, 123 - São Paulo, SP',
          valor: 'R$ 650.000',
          area: '120m²',
          quartos: 3,
          banheiros: 2,
          vagas: 2,
          descricao: 'Excelente apartamento em Moema, com 3 quartos, sala ampla, cozinha planejada e 2 vagas de garagem.',
          imagens: ['https://via.placeholder.com/300x200']
        },
        {
          id: '2',
          titulo: 'Casa 4 quartos - Vila Mariana',
          tipo: 'casa',
          endereco: 'Rua Vila Mariana, 456 - São Paulo, SP',
          valor: 'R$ 750.000',
          area: '200m²',
          quartos: 4,
          banheiros: 3,
          vagas: 3,
          descricao: 'Casa espaçosa em Vila Mariana, com 4 quartos, jardim, piscina e 3 vagas de garagem.',
          imagens: ['https://via.placeholder.com/300x200']
        }
      ]);
      
      setDocumentos([
        {
          id: '1',
          nome: 'Proposta_Comercial_001.pdf',
          tamanho: '2.5 MB',
          data: '15/01/2024',
          tipo: 'pdf'
        },
        {
          id: '2',
          nome: 'Contrato_Proposta.docx',
          tamanho: '1.2 MB',
          data: '14/01/2024',
          tipo: 'docx'
        }
      ]);
      
      setLoading(false);
    }, 1000);
  }, [leadId]);

  // Estados computados
  const isAllPropertiesSelected = selectedProperties.length === imoveisInteresse.length && imoveisInteresse.length > 0;
  const isSomePropertiesSelected = selectedProperties.length > 0 && selectedProperties.length < imoveisInteresse.length;

  // Atualizar estado indeterminado do checkbox master
  useEffect(() => {
    if (masterCheckboxRef.current) {
      masterCheckboxRef.current.indeterminate = isSomePropertiesSelected;
    }
  }, [selectedProperties, imoveisInteresse, isSomePropertiesSelected]);

  // Handlers
  const handlePropertySelection = (propertyId: string) => {
    setSelectedProperties(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handleSelectAllProperties = (checked: boolean) => {
    if (checked) {
      setSelectedProperties(imoveisInteresse.map(imovel => imovel.id));
    } else {
      setSelectedProperties([]);
    }
  };

  const handleViewProperty = (propertyId: string) => {
    window.open(`/imoveis/detalhes/${propertyId}`, '_blank');
  };

  const handleScheduleVisit = (imovel: ImovelInteresse) => {
    // Implementar lógica de agendar visita
    toast({
      title: "Visita agendada",
      description: `Visita para ${imovel.titulo} foi agendada com sucesso!`,
    });
  };

  const handleScheduleMultipleVisits = () => {
    const selectedImoveis = imoveisInteresse.filter(imovel => 
      selectedProperties.includes(imovel.id)
    );
    
    if (selectedImoveis.length === 0) {
      toast({
        title: "Nenhum imóvel selecionado",
        description: "Selecione pelo menos um imóvel para agendar visitas.",
        variant: "destructive"
      });
      return;
    }
    
    // Implementar lógica de agendar múltiplas visitas
    toast({
      title: "Visitas agendadas",
      description: `${selectedImoveis.length} visitas foram agendadas com sucesso!`,
    });
  };

  const handleSendProperties = () => {
    if (!sendMethods.email && !sendMethods.whatsapp) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um método de envio.",
        variant: "destructive"
      });
      return;
    }
    
    const selectedImoveis = imoveisInteresse.filter(imovel => 
      selectedProperties.includes(imovel.id)
    );
    
    const imoveisText = selectedImoveis.map(imovel => `${imovel.titulo} - ${imovel.valor}`).join('\n');
    const message = `Olá ${lead?.name}, aqui estão os imóveis que selecionei para você:\n\n${imoveisText}`;
    
    if (sendMethods.email && lead?.emails[0]) {
      window.open(`mailto:${lead.emails[0].value}?subject=Imóveis de Interesse&body=${encodeURIComponent(imoveisText)}`);
    }
    
    if (sendMethods.whatsapp && lead?.phones[0]) {
      window.open(`https://wa.me/55${lead.phones[0].value.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`);
    }
    
    setShowSendModal(false);
  };

  const handleActivityDetails = (activity: HistoricoAtendimento) => {
    setSelectedActivity(activity);
    setActivityNote(activity.notaAtividade || '');
    setActivityRating(activity.avaliacao || null);
    setActivityTags(activity.tags || []);
    setIsActivityShowcased(activity.noShow || false);
    setNextActivity(activity.nextActivity || '');
    setShowActivityDetailsModal(true);
  };

  const handleSaveActivityDetails = () => {
    if (selectedActivity) {
      setHistorico(historico.map(item =>
        item.id === selectedActivity.id
          ? {
              ...item,
              notaAtividade: activityNote,
              avaliacao: activityRating,
              tags: activityTags,
              noShow: isActivityShowcased,
              nextActivity: nextActivity
            }
          : item
      ));
      setShowActivityDetailsModal(false);
      setSelectedActivity(null);
      setActivityNote('');
      setActivityRating(null);
      setActivityTags([]);
      setIsActivityShowcased(false);
      setNextActivity('');
    }
  };

  const handleViewDocument = (document: Documento) => {
    // Implementar visualização de documento
    toast({
      title: "Abrindo documento",
      description: `Visualizando ${document.nome}...`,
    });
  };

  const handleDownloadDocument = (document: Documento) => {
    // Implementar download de documento
    toast({
      title: "Baixando documento",
      description: `Baixando ${document.nome}...`,
    });
  };

  const handleDeleteDocument = (id: string, nome: string) => {
    setDocumentos(documentos.filter(doc => doc.id !== id));
    toast({
      title: "Documento excluído",
      description: `${nome} foi excluído com sucesso!`,
    });
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
      toast({
        title: "Documento adicionado",
        description: `${documento.nome} foi adicionado com sucesso!`,
      });
    }
  };

  const handleScheduleActivity = () => {
    setShowActivityModal(true);
  };

  const handleSaveNewActivity = () => {
    if (newActivity.descricao.trim()) {
      const activity: HistoricoAtendimento = {
        id: Date.now().toString(),
        data: newActivity.data,
        tipo: newActivity.tipo as 'ligacao' | 'email' | 'visita' | 'proposta' | 'reuniao' | 'whatsapp' | 'followup',
        descricao: newActivity.descricao,
        usuario: 'Usuário Atual',
        editavel: true
      };
      
      setHistorico([activity, ...historico]);
      setNewActivity({
        tipo: 'ligacao',
        data: new Date().toISOString().split('T')[0],
        hora: new Date().toTimeString().slice(0, 5),
        descricao: ''
      });
      setShowActivityModal(false);
      
      toast({
        title: "Atividade adicionada",
        description: "Nova atividade foi registrada com sucesso.",
      });
    }
  };

  const handleWhatsApp = () => {
    if (lead && lead.phones && lead.phones.length > 0) {
      const primaryPhone = lead.phones.find(phone => phone.isPrimary)?.value || lead.phones[0].value;
      const cleanPhone = primaryPhone.replace(/\D/g, '');
      window.open(`https://wa.me/55${cleanPhone}`, '_blank');
    }
  };

  const handleChangeAgent = () => {
    if (lead) {
      setSelectedAgent(lead.assignedTo || '');
      setShowChangeAgentModal(true);
    }
  };

  const handleManageTags = () => {
    if (lead) {
      setNewTag('');
      setShowTagsModal(true);
    }
  };

  const handleUploadFile = () => {
    setUploadFile(null);
    setShowUploadModal(true);
  };

  const handleAddNote = () => {
    setNoteText('');
    setNoteFile(null);
    setShowAddNoteModal(true);
  };

  const handleSaveUpload = () => {
    if (uploadFile && lead) {
      const documento: Documento = {
        id: Date.now().toString(),
        nome: uploadFile.name,
        tamanho: `${(uploadFile.size / 1024 / 1024).toFixed(1)} MB`,
        data: new Date().toLocaleDateString('pt-BR'),
        tipo: uploadFile.name.split('.').pop() || 'unknown'
      };
      
      setDocumentos([documento, ...documentos]);
      setUploadFile(null);
      setShowUploadModal(false);
      
      toast({
        title: "Arquivo enviado",
        description: `${uploadFile.name} foi adicionado com sucesso.`,
      });
    }
  };

  const handleAddNoteSave = () => {
    if (noteText.trim() && lead) {
      const now = new Date();
      const noteDescription = noteName.trim() 
        ? `**${noteName}**\n\n${noteText}`
        : noteText;
      
      const note: HistoricoAtendimento = {
        id: Date.now().toString(),
        data: now.toISOString(),
        tipo: 'followup',
        descricao: noteDescription,
        usuario: 'Usuário Atual',
        editavel: true
      };
      
      setHistorico([note, ...historico]);
      
      // Se houver arquivo, adiciona também aos documentos com o mesmo timestamp
      if (noteFile) {
        const documento: Documento = {
          id: Date.now().toString(),
          nome: noteFile.name,
          tamanho: `${(noteFile.size / 1024 / 1024).toFixed(1)} MB`,
          data: now.toISOString(), // Usar timestamp completo em vez de data formatada
          tipo: noteFile.name.split('.').pop() || 'unknown'
        };
        setDocumentos([documento, ...documentos]);
      }
      
      setNoteText('');
      setNoteFile(null);
      setNoteName('');
      setShowAddNoteModal(false);
      
      toast({
        title: "Nota adicionada",
        description: noteFile 
          ? `Nota "${noteName || 'Sem nome'}" e arquivo "${noteFile.name}" foram adicionados com sucesso.`
          : `Nota "${noteName || 'Sem nome'}" foi adicionada ao histórico com sucesso.`,
      });
    }
  };

  const handleSaveNoteEdit = () => {
    if (editingNoteId && editingNoteText.trim() && lead) {
      // Atualizar o texto da nota no histórico
      const noteDescription = editingNoteName.trim() 
        ? `**${editingNoteName}**\n\n${editingNoteText}`
        : editingNoteText;
      
      setHistorico(historico.map(item => 
        item.id === editingNoteId 
          ? { ...item, descricao: noteDescription }
          : item
      ));
      
      // Remover documentos antigos relacionados a esta nota
      const activityTimestamp = new Date(historico.find(item => item.id === editingNoteId)?.data || '').getTime();
      const filteredDocs = documentos.filter(doc => {
        const docDate = new Date(doc.data);
        const docTimestamp = docDate.getTime();
        return Math.abs(docTimestamp - activityTimestamp) >= 5000;
      });
      
      // Adicionar novos arquivos (se houver)
      const newDocs = editingNoteFiles.map(file => ({
        id: Date.now().toString() + Math.random(),
        nome: file.name,
        tamanho: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        data: new Date(activityTimestamp).toISOString(),
        tipo: file.name.split('.').pop() || 'unknown'
      }));
      
      setDocumentos([...filteredDocs, ...newDocs]);
      
      // Limpar estados
      setEditingNoteId(null);
      setEditingNoteText('');
      setEditingNoteName('');
      setEditingNoteFiles([]);
      setShowNoteEditModal(false);
      
      toast({
        title: "Nota atualizada",
        description: `Nota "${editingNoteName || 'Sem nome'}" foi atualizada com sucesso${editingNoteFiles.length > 0 ? ` com ${editingNoteFiles.length} arquivo${editingNoteFiles.length > 1 ? 's' : ''} anexado${editingNoteFiles.length > 1 ? 's' : ''}` : '.'}`,
      });
    }
  };

  const handleAddNoteFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setEditingNoteFiles([...editingNoteFiles, ...files]);
  };

  const handleRemoveNoteFile = (index: number) => {
    setEditingNoteFiles(editingNoteFiles.filter((_, i) => i !== index));
  };

  const handleDeleteActivity = (activity: HistoricoAtendimento) => {
    setActivityToDelete(activity);
    setShowDeleteActivityModal(true);
  };

  const handleConfirmDelete = () => {
    if (activityToDelete) {
      setHistorico(historico.filter(item => item.id !== activityToDelete.id));
      // Se houver arquivos relacionados, remove também
      const activityTimestamp = new Date(activityToDelete.data).getTime();
      const filteredDocs = documentos.filter(doc => {
        const docDate = new Date(doc.data);
        const docTimestamp = docDate.getTime();
        return Math.abs(docTimestamp - activityTimestamp) >= 5000;
      });
      setDocumentos(filteredDocs);
      
      setActivityToDelete(null);
      setShowDeleteActivityModal(false);
      
      toast({
        title: "Atividade excluída",
        description: `A atividade "${activityToDelete.descricao.substring(0, 50)}..." foi excluída com sucesso.`,
        variant: "destructive",
      });
    }
  };

  const handleEditLead = () => {
    if (lead) {
      setShowEditModal(true);
    }
  };

  const handleSaveLead = () => {
    if (lead) {
      setShowEditModal(false);
      
      toast({
        title: "Lead atualizado",
        description: "As informações do lead foram atualizadas com sucesso.",
      });
    }
  };

  const handleChangeAgentSave = () => {
    if (lead && selectedAgent && selectedAgent !== lead.assignedTo) {
      const oldAgent = lead.assignedTo || 'Nenhum';
      const updatedLead = {
        ...lead,
        assignedTo: selectedAgent
      };
      setLead(updatedLead);
      setShowChangeAgentModal(false);
      
      toast({
        title: "👥 Corretor alterado com sucesso!",
        description: (
          <div className="space-y-2">
            <p><strong>{lead.name}</strong> foi reatribuído(a)!</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>De:</span>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">{oldAgent}</span>
              <span className="text-green-500">→</span>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded">{selectedAgent}</span>
            </div>
          </div>
        ),
        variant: "success",
        duration: 4000,
      });
    }
  };

  const handleAddTag = () => {
    if (lead && newTag.trim() && !lead.tags?.includes(newTag.trim())) {
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

  const handleEditActivity = (activity: HistoricoAtendimento) => {
    if (activity.tipo === 'followup') {
      // É uma nota - abrir modal de edição de nota
      setEditingNoteId(activity.id);
      setEditingNoteText(activity.descricao);
      
      // Buscar arquivos relacionados à nota
      const activityTimestamp = new Date(activity.data).getTime();
      const relatedDocs = documentos.filter(doc => {
        const docDate = new Date(doc.data);
        const docTimestamp = docDate.getTime();
        return Math.abs(docTimestamp - activityTimestamp) < 5000;
      });
      
      // Converter documentos para File objects (simulação)
      setEditingNoteFiles(relatedDocs.map(doc => new File([], doc.nome, { type: doc.tipo })));
      setShowNoteEditModal(true);
    } else {
      // É uma atividade normal - abrir modal de edição de atividade
      setSelectedActivity(activity);
      setShowActivityEditModal(true);
    }
  };

  const handleSaveActivity = (activity: {
    id: string;
    tipo: 'ligacao' | 'email' | 'visita' | 'proposta' | 'reuniao' | 'whatsapp' | 'followup';
    data: string;
    descricao: string;
    usuario: string;
    proximoPasso?: string;
  }) => {
    if (selectedActivity) {
      setHistorico(historico.map(item =>
        item.id === selectedActivity.id ? activity : item
      ));
    } else {
      setHistorico([activity, ...historico]);
    }
    setSelectedActivity(null);
    setShowActivityEditModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Lead não encontrado</h2>
          <Button onClick={() => navigate('/leads')}>
            Voltar para Leads
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">{lead.name}</h1>
          <div className="flex items-center gap-4 mt-2 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              {lead.phones[0]?.value}
            </span>
            <span className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              {lead.emails[0]?.value}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {lead.location}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleChangeAgent}>
                <UserCheck className="h-4 w-4 mr-2" />
                Mudar Corretor
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleWhatsApp}>
                <MessageSquare className="h-4 w-4 mr-2" />
                WhatsApp
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleScheduleActivity}>
                <Calendar className="h-4 w-4 mr-2" />
                Agendar Atividade
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleAddNote}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Nota
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleManageTags}>
                <Tag className="h-4 w-4 mr-2" />
                Tags
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowDeleteModal(true)} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Layout Lado a Lado */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LADO ESQUERDO - Informações do Lead (Fixo) */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Informações do Lead</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Tipo de Busca</Label>
                <p className="capitalize">{lead.searchType}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Faixa de Valor</Label>
                <p>{lead.value}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Origem</Label>
                <p>{lead.source}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Responsável</Label>
                <p>{lead.assignedTo}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Estágio</Label>
                <Badge variant="secondary">{lead.stage}</Badge>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Último Contato</Label>
                <p>{lead.lastContact}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Data de Entrada</Label>
                <p>{new Date(lead.createdAt).toLocaleDateString('pt-BR', { 
                  day: '2-digit', 
                  month: '2-digit', 
                  year: 'numeric' 
                })}</p>
              </div>
              {lead.notes && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Observações</Label>
                  <p className="mt-1 text-sm">{lead.notes}</p>
                </div>
              )}
              {lead.tags && lead.tags.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Tags</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {lead.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* LADO DIREITO - Abas (Conteúdo Dinâmico) */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="atividades">Atividades</TabsTrigger>
              <TabsTrigger value="imoveis">Imóveis de Interesse</TabsTrigger>
              <TabsTrigger value="documentos">Documentos</TabsTrigger>
              <TabsTrigger value="propostas">Propostas</TabsTrigger>
            </TabsList>

            {/* Tab Atividades */}
            <TabsContent value="atividades">
              <LeadTabAtividades
                historico={historico}
                documentos={documentos}
                onScheduleActivity={handleScheduleActivity}
                onActivityDetails={handleActivityDetails}
                onEditActivity={handleEditActivity}
                onDeleteActivity={handleDeleteActivity}
              />
            </TabsContent>

            {/* Tab Imóveis */}
            <TabsContent value="imoveis">
              <LeadTabImoveis
                imoveisInteresse={imoveisInteresse}
                selectedProperties={selectedProperties}
                isAllPropertiesSelected={isAllPropertiesSelected}
                isSomePropertiesSelected={isSomePropertiesSelected}
                masterCheckboxRef={masterCheckboxRef}
                onPropertySelection={handlePropertySelection}
                onSelectAllProperties={handleSelectAllProperties}
                onViewProperty={handleViewProperty}
                onScheduleVisit={handleScheduleVisit}
                onScheduleMultipleVisits={handleScheduleMultipleVisits}
                onSendProperties={handleSendProperties}
              />
            </TabsContent>

            {/* Tab Documentos */}
            <TabsContent value="documentos">
              <LeadTabDocumentos
                documentos={documentos}
                onAddDocument={() => setShowAddDocumentModal(true)}
                onViewDocument={handleViewDocument}
                onDownloadDocument={handleDownloadDocument}
                onDeleteDocument={handleDeleteDocument}
              />
            </TabsContent>

            {/* Tab Propostas */}
            <TabsContent value="propostas">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nenhuma proposta enviada</h3>
                    <p className="text-muted-foreground mb-4">
                      Este lead ainda não recebeu nenhuma proposta comercial.
                    </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Proposta
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
        </div>
      </div>

      {/* Modals */}
      <ActivityEditModal
        open={showActivityEditModal}
        onClose={() => setShowActivityEditModal(false)}
        activity={selectedActivity || undefined}
        onSave={handleSaveActivity}
      />

      {/* Modal de Nova Atividade */}
      <Dialog open={showActivityModal} onOpenChange={setShowActivityModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Agendar Atividade</DialogTitle>
            <DialogDescription>
              Registre uma nova atividade para {lead?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="activityType">Tipo de Atividade</Label>
              <Select value={newActivity.tipo} onValueChange={(value) => setNewActivity({...newActivity, tipo: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ligacao">Ligação Telefônica</SelectItem>
                  <SelectItem value="email">Envio de E-mail</SelectItem>
                  <SelectItem value="visita">Visita ao Imóvel</SelectItem>
                  <SelectItem value="reuniao">Reunião Presencial</SelectItem>
                  <SelectItem value="proposta">Apresentar Proposta</SelectItem>
                  <SelectItem value="whatsapp">Contato via WhatsApp</SelectItem>
                  <SelectItem value="followup">Follow-up</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="activityDate">Data</Label>
                <Input 
                  type="date" 
                  value={newActivity.data}
                  onChange={(e) => setNewActivity({...newActivity, data: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="activityTime">Hora</Label>
                <Input 
                  type="time" 
                  value={newActivity.hora}
                  onChange={(e) => setNewActivity({...newActivity, hora: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="activityDescription">Descrição</Label>
              <Textarea 
                placeholder="Descreva a atividade..."
                rows={3}
                value={newActivity.descricao}
                onChange={(e) => setNewActivity({...newActivity, descricao: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActivityModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveNewActivity} disabled={!newActivity.descricao.trim()}>
              Salvar Atividade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Detalhes da Atividade */}
      <Dialog open={showActivityDetailsModal} onOpenChange={setShowActivityDetailsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes da Atividade</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="activityNote">Nota da Atividade</Label>
              <Textarea
                id="activityNote"
                value={activityNote}
                onChange={(e) => setActivityNote(e.target.value)}
                rows={3}
                placeholder="Adicione notas sobre esta atividade..."
              />
            </div>
            <div>
              <Label>Avaliação</Label>
              <div className="flex gap-2 mt-2">
                <Button
                  variant={activityRating === 'boa' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActivityRating('boa')}
                >
                  😊 Boa
                </Button>
                <Button
                  variant={activityRating === 'ruim' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActivityRating('ruim')}
                >
                  😞 Ruim
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="nextActivity">Próxima Atividade</Label>
              <Input
                id="nextActivity"
                value={nextActivity}
                onChange={(e) => setNextActivity(e.target.value)}
                placeholder="Descreva a próxima atividade..."
              />
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

      {/* Modal de Adicionar Documento */}
      <Dialog open={showAddDocumentModal} onOpenChange={setShowAddDocumentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Documento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="documentName">Nome do Documento</Label>
              <Input
                id="documentName"
                value={newDocument.nome}
                onChange={(e) => setNewDocument({...newDocument, nome: e.target.value})}
                placeholder="Digite o nome do documento..."
              />
            </div>
            <div>
              <Label htmlFor="documentFile">Arquivo</Label>
              <Input
                id="documentFile"
                type="file"
                onChange={(e) => setNewDocument({...newDocument, arquivo: e.target.files?.[0] || null})}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Formatos permitidos: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, PNG, JPG, JPEG
                <br />
                Tamanho máximo: 10MB
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDocumentModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddDocument}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Envio */}
      <Dialog open={showSendModal} onOpenChange={setShowSendModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Imóveis</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Métodos de Envio</Label>
              <div className="space-y-2 mt-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="email"
                    checked={sendMethods.email}
                    onChange={(e) => setSendMethods({...sendMethods, email: e.target.checked})}
                  />
                  <Label htmlFor="email">E-mail</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="whatsapp"
                    checked={sendMethods.whatsapp}
                    onChange={(e) => setSendMethods({...sendMethods, whatsapp: e.target.checked})}
                  />
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSendModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSendProperties}>
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Editar Lead */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Lead</DialogTitle>
            <DialogDescription>
              Edite as informações de {lead?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="leadBudget">Orçamento</Label>
                <Input 
                  id="leadBudget"
                  placeholder="Ex: R$ 300.000 - R$ 400.000"
                  value={lead?.value || ''}
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="leadDeadline">Prazo</Label>
                <Input 
                  id="leadDeadline"
                  placeholder="Ex: 1-2 meses"
                  disabled
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="leadSource">Origem</Label>
                <Input 
                  id="leadSource"
                  value={lead?.source || ''}
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="leadAgent">Responsável</Label>
                <Input 
                  id="leadAgent"
                  value={lead?.assignedTo || ''}
                  disabled
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="financing"
                disabled
              />
              <Label htmlFor="financing">Financiamento</Label>
            </div>

            <div>
              <Label>Tags</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Adicionar nova tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <Button onClick={handleAddTag} disabled={!newTag.trim()}>
                    Adicionar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {lead?.tags?.map((tag, index) => (
                    <Badge key={index} variant="default" className="cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                      {tag} <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableTags.filter(tag => !lead?.tags?.includes(tag)).map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      onClick={() => {
                        setNewTag(tag);
                        handleAddTag();
                      }}
                    >
                      + {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Label>Prioridades</Label>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="cursor-pointer hover:bg-green-100 hover:text-green-700">Localização</Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-green-100 hover:text-green-700">Segurança</Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-green-100 hover:text-green-700">Transporte</Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-green-100 hover:text-green-700">Área</Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-green-100 hover:text-green-700">Preço</Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-green-100 hover:text-green-700">Conservação</Badge>
              </div>
            </div>

            <div>
              <Label htmlFor="leadNotes">Observações</Label>
              <Textarea 
                id="leadNotes"
                placeholder="Adicione observações sobre este lead..."
                rows={3}
                value={lead?.notes || ''}
                disabled
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveLead}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Mudar Corretor */}
      <Dialog open={showChangeAgentModal} onOpenChange={setShowChangeAgentModal}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Mudar Corretor</DialogTitle>
            <DialogDescription>
              Altere o corretor responsável por {lead?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Corretor Atual</Label>
              <div className="p-3 bg-gray-100 rounded-md">
                <p className="font-medium">{lead?.assignedTo || 'Nenhum'}</p>
              </div>
            </div>
            <div>
              <Label htmlFor="newAgent">Novo Corretor</Label>
              <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o novo corretor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="JS">João Silva</SelectItem>
                  <SelectItem value="MR">Maria Rodrigues</SelectItem>
                  <SelectItem value="PC">Pedro Costa</SelectItem>
                  <SelectItem value="AC">Ana Costa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowChangeAgentModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleChangeAgentSave} disabled={!selectedAgent || selectedAgent === lead?.assignedTo}>
              Mudar Corretor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Gerenciar Tags */}
      <Dialog open={showTagsModal} onOpenChange={setShowTagsModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Gerenciar Tags</DialogTitle>
            <DialogDescription>
              Adicione ou remova tags de {lead?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tags Atuais</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {lead?.tags?.map((tag, index) => (
                  <Badge key={index} variant="default" className="cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                    {tag} <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
                {(!lead?.tags || lead.tags.length === 0) && (
                  <p className="text-muted-foreground">Nenhuma tag cadastrada</p>
                )}
              </div>
            </div>
            <div>
              <Label>Adicionar Nova Tag</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Digite uma nova tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <Button onClick={handleAddTag} disabled={!newTag.trim()}>
                  Adicionar
                </Button>
              </div>
            </div>
            <div>
              <Label>Tags Disponíveis</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableTags.filter(tag => !lead?.tags?.includes(tag)).map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => {
                      setNewTag(tag);
                      handleAddTag();
                    }}
                  >
                    + {tag}
                  </Badge>
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

      {/* Modal de Adicionar Nota */}
      <Dialog open={showAddNoteModal} onOpenChange={setShowAddNoteModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Adicionar Nota</DialogTitle>
            <DialogDescription>
              Adicione uma nota ao histórico de {lead?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="noteName">Nome da Nota (Opcional)</Label>
              <Input
                id="noteName"
                placeholder="Ex: Contato inicial, Follow-up importante"
                value={noteName}
                onChange={(e) => setNoteName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="noteText">Nota</Label>
              <Textarea 
                id="noteText"
                placeholder="Digite sua nota aqui..."
                rows={4}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="noteFile">Anexar Arquivo (Opcional)</Label>
              <Input
                id="noteFile"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setNoteFile(file);
                  }
                }}
                className="cursor-pointer"
              />
            </div>
            {noteFile && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{noteFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Tamanho: {noteFile.size > 1024 * 1024 
                        ? `${(noteFile.size / (1024 * 1024)).toFixed(1)} MB`
                        : `${noteFile.size} KB`
                      }
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Tipo: {noteFile.type || 'Desconhecido'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddNoteModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddNoteSave} disabled={!noteText.trim()}>
              Adicionar Nota
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Editar Nota */}
      <Dialog open={showNoteEditModal} onOpenChange={setShowNoteEditModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Nota</DialogTitle>
            <DialogDescription>
              Edite a nota e gerencie os arquivos anexados
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editingNoteName">Nome da Nota (Opcional)</Label>
              <Input
                id="editingNoteName"
                placeholder="Ex: Contato inicial, Follow-up importante"
                value={editingNoteName}
                onChange={(e) => setEditingNoteName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="editingNoteText">Nota</Label>
              <Textarea 
                id="editingNoteText"
                placeholder="Edite sua nota aqui..."
                rows={4}
                value={editingNoteText}
                onChange={(e) => setEditingNoteText(e.target.value)}
              />
            </div>
            <div>
              <Label>Arquivos Anexados</Label>
              <div className="space-y-2">
                <Input
                  type="file"
                  multiple
                  onChange={handleAddNoteFile}
                  className="cursor-pointer"
                />
                {editingNoteFiles.length > 0 && (
                  <div className="space-y-2">
                    {editingNoteFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-8 w-8 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {file.size > 1024 * 1024 
                                ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
                                : `${file.size} KB`
                              }
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveNoteFile(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNoteEditModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveNoteEdit} disabled={!editingNoteText.trim()}>
              Salvar Nota
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={showDeleteActivityModal} onOpenChange={setShowDeleteActivityModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta {activityToDelete?.tipo === 'followup' ? 'nota' : 'atividade'}?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium">Atenção!</p>
                  <p className="text-sm text-red-700">
                    Esta ação não pode ser desfeita.
                  </p>
                </div>
              </div>
            </div>
            {activityToDelete && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium mb-2">
                  {activityToDelete.tipo === 'followup' ? 'Nota' : 'Atividade'}:
                </p>
                <p className="text-sm text-muted-foreground mb-1">
                  {activityToDelete.descricao}
                </p>
                <p className="text-xs text-muted-foreground">
                  Por {activityToDelete.usuario} em {new Date(activityToDelete.data).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteActivityModal(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default LeadDetalhes;
