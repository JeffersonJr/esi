import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Save, Search, Upload, User, Plus, Calendar, Building, MapPin, Home, Settings, CreditCard, DollarSign, Calculator, FileText, Globe, Info, QrCode, Eye, Search as SearchIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import { UnsavedChangesModal } from '@/components/modals/UnsavedChangesModal';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ImovelFormModalProps {
  open: boolean;
  onClose: () => void;
  imovel?: any; // Optional imovel data for editing
}

interface Proprietario {
  id: string;
  nome: string;
  email: string;
  telefone: string;
}

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

const proprietariosCadastrados: Proprietario[] = [
  { id: '1', nome: 'Carlos Oliveira', email: 'carlos@email.com', telefone: '(11) 99999-0002' },
  { id: '2', nome: 'Pedro Souza', email: 'pedro@email.com', telefone: '(11) 99999-0005' },
  { id: '3', nome: 'Roberto Silva', email: 'roberto@email.com', telefone: '(11) 99999-0008' },
  { id: '4', nome: 'Mariana Costa', email: 'mariana@email.com', telefone: '(11) 99999-0010' },
];

const tiposPorFinalidade = {
  'Comercial': [
    'Armazém/Barracão', 'Casa', 'Conjunto Comercial', 'Fundo de comércio', 'Galeria', 'Galpão',
    'Garagem', 'Laje Corporativa', 'Loja', 'Loteamento', 'Prédio', 'Sala', 'Salão',
    'Sobrado', 'Sobreloja', 'Terreno', 'Área'
  ],
  'Industrial': [
    'Armazém/Barracão', 'Conjunto Industrial', 'Galpão', 'Galpão em Condomínio', 'Indústria',
    'Jazidas', 'Loteamento', 'Mineradora', 'PCH', 'Pedreira', 'Prédio', 'Terreno',
    'UHE', 'Usina', 'Área'
  ],
  'Residencial': [
    'Apartamento', 'Casa', 'Casa de Condomínio', 'Casa de Vila', 'Chácara', 'Chácara em Condomínio',
    'Cobertura', 'Flat', 'Garagem', 'Kitnet', 'Loft', 'Loteamento', 'Penthouse', 'Prédio',
    'Sala Living', 'Sobrado', 'Sobrado de Condomínio', 'Sobrado de Vila', 'Studio', 'Terreno',
    'Terreno de Condomínio', 'Área'
  ],
  'Rural': [
    'Chácara', 'Chácara em Condomínio', 'Fazenda', 'Haras', 'Loteamento', 'Rancho', 'Sítio', 'Terreno'
  ]
};

const proximidades = [
  'Academia', 'Banca de Jornal', 'Banco', 'Barbearia', 'Bar e Choperia', 'Centro', 'Centro Esportivo',
  'Cinema', 'Clínica Veterinária', 'Clínica de Saúde', 'Delegacia', 'Dentista', 'Escola', 'Escola de Idioma',
  'Estacionamento', 'Estação Rodoviária', 'Estação de Metrô', 'Estação de Trem', 'Estação de VLT',
  'Faculdade', 'Farmácia', 'Feira Livre', 'Hospital', 'Igreja', 'Indústria', 'Lotérica', 'Padaria',
  'Parque e Praça', 'Petshop', 'Ponto de Táxi', 'Ponto de ônibus', 'Posto de Combustível', 'Posto de Saúde',
  'Praia', 'Restaurante', 'Salão de Beleza', 'Shopping', 'Supermercado', 'Universidade'
];

const caracteristicasGerais = [
  '2 Entradas', '110v', '220v', '330v', 'Academia', 'Academia ao Ar Livre', 'Aceita Pet', 'Acessibilidade',
  'Acesso para deficientes', 'Acesso por Biometria', 'Adega', 'Alarme Monitorado', 'Alto padrão',
  'Ambientes Integrados', 'Andar Inteiro', 'Antena Coletiva', 'Aquecimento Central', 'Aquecimento Solar',
  'Aquecimento elétrico', 'Aquário', 'Arandelas', 'Armário de Cozinha', 'Armários Individuais',
  'Armários na Lavanderia', 'Arroio', 'Aspiração Central', 'Atelier', 'Ateliê', 'Auditório',
  'Balaústre', 'Bangalô', 'Banheira', 'Banheiro Social', 'Banheiro de Serviço', 'Bar', 'Beauty hair',
  'Beira-mar', 'Biblioteca', 'Bicicletário', 'Bifásico', 'Boliche', 'Bosque', 'Brinquedoteca',
  'CDHU', 'CFTV', 'Cabeamento Estruturado', 'Cabine de Segurança', 'Café', 'Calefação', 'Camareira',
  'Campo de Futebol', 'Campo de golfe', 'Carpete', 'Carregador de Carro Elétrico', 'Central Telefônica',
  'Central de Gás', 'Centro de Convenções', 'Cerca elétrica', 'Children Care', 'Churrasqueira',
  'Churrasqueira Coletiva', 'Churrasqueira Privativa', 'Churrasqueira a Gás', 'Churrasqueira na Sacada',
  'Ciclovia', 'Cimento Queimado', 'Cinema', 'Circuito Interno de TV', 'Circuito de Segurança',
  'Cisterna', 'Clube', 'Coleta de Lixo', 'Conexão à internet', 'Conjunto fechado', 'Coworking',
  'Cozinha Grande', 'Câmera de Vigilância', 'De campo', 'Deck Molhado', 'Deck de Madeira', 'Decorado',
  'Depósito Privativo', 'Depósito Privativo no Subsolo', 'Depósito na Garagem', 'Divisória',
  'Dormitório reversível', 'Drywall', 'Elevador Cadeirante', 'Elevador Cod. Segurança', 'Elevador Panorâmico',
  'Elevador Social', 'Elevador de Carga', 'Elevador de Serviço', 'Elevador privativo', 'Em Área de Preservação',
  'Energia Elétrica', 'Energia Pública', 'Energia Solar', 'Entrada Lateral', 'Entrada de Serviço',
  'Entrada para Carro', 'Escada', 'Escritório', 'Espaço Gourmet', 'Espaço Grill', 'Espaço Juvenil',
  'Espaço Kids', 'Espaço Leitura', 'Espaço Motos', 'Espaço Mulher', 'Espaço Pilates', 'Espaço Zen',
  'Espelhos D\'água', 'Esquadria em Alumínio', 'Esquadria em Madeira', 'Esquadria em PVC', 'Esquadria em ferro',
  'Estacionamento', 'Estacionamento Rotativo', 'Estação de Gás', 'Fechadura Eletrônica', 'Fogão a Lenha',
  'Fora', 'Forno a Lenha', 'Forno de Pizza', 'Forro de Gesso', 'Forro de Madeira', 'Forro de PVC',
  'Fraldário', 'Frente para o Mar', 'Garage Band', 'Garagem Ar Livre', 'Garagem Coberta',
  'Garagem Coletiva', 'Garagem Coletiva Insuficiente', 'Garagem Coletiva Suficiente', 'Garagem Demarcada',
  'Garagem Escriturada', 'Garagem Fechada', 'Garagem Privativa', 'Gerador de Emergência', 'Gerador elétrico',
  'Gesso', 'Grade', 'Grades de Alumínio', 'Grades de Ferro', 'Grama', 'Guarita', 'Gás Encanado',
  'Gás Individual', 'Hall de Entrada', 'Heliponto', 'Home Office', 'Home cinema', 'Iluminação Pública',
  'Incorporação', 'Interfone', 'Isolamento Acústico', 'Isolamento Térmico', 'Jacuzzi', 'Janela Automatizada',
  'Janela de Vidro', 'Janelas Grandes', 'Janelas de Alumínio', 'Janelas de Ferro', 'Janelas de Madeira',
  'Jardim', 'Jardim de inverno', 'Lago', 'Lan House', 'Lareira a Gás', 'Lavanderia', 'Lazer na Cobertura',
  'Litoral', 'Manobrista', 'Medidores de Água Individuais', 'Meio Andar', 'Mezanino', 'Mini Mercado',
  'Mini Quadra', 'Mirante', 'Mobiliado', 'Monofásico', 'Moradia', 'Muro', 'Muro de Vidro', 'Móveis Planejados',
  'Office', 'Ofurô', 'Orquidário', 'Parabólica', 'Parede de Vidro', 'Parque Aquático', 'Parque Infantil',
  'Perfil de Estudantes', 'Perfil de Investimento', 'Pergolado', 'Persiana Elétrica', 'Pet Place', 'Pilotis',
  'Piscina', 'Piscina Aquecida', 'Piscina Coberta', 'Piscina Coberta Climatizada', 'Piscina Coletiva',
  'Piscina Infantil', 'Piscina Privativa', 'Piscina adulto', 'Piscina com Cascata', 'Piscina com Hidromassagem',
  'Piscina com Raia', 'Piscina com borda infinita', 'Piscina da Cobertura', 'Piso Vinílico', 'Piso ardósia',
  'Piso de taco', 'Pista de Bocha', 'Pista de Caminhada', 'Pista de Skate', 'Platibanda', 'Playground',
  'Pomar', 'Pool', 'Port Cochere', 'Porta de Aço', 'Porta de Segurança', 'Portaria', 'Portaria 24 horas',
  'Portaria Virtual', 'Porteira Fechada', 'Porteiro Eletrônico', 'Portão Eletrônico', 'Portão Simples',
  'Portão tipo Clausura', 'Praça de Convivencia', 'Praça de fogo', 'Prendido Inteiramente', 'Pátio Privativo',
  'Pé direito duplo', 'Pé na Areia', 'Quadra Gramada', 'Quadra Poliesportiva', 'Quadra de Areia',
  'Quadra de Squash', 'Quadra de Tênis', 'Quadra de Vôlei', 'Quintal', 'Quiosque', 'Rampas', 'Recepção',
  'Rede Pública', 'Rede de Transporte Coletivo', 'Redário', 'Refeitório', 'Reformado', 'Reservatório de Água',
  'Restaurante', 'Rooftop', 'Rua asfaltada', 'Rua sem pavimento', 'SPA', 'Sacada', 'Sacada Gourmet',
  'Sacada Panorâmica', 'Sacada Técnica', 'Sacada com Envidraçamento', 'Sala Fitness', 'Sala Grande',
  'Sala Massagem', 'Sala Pequena', 'Sala de Ginástica', 'Sala de Jantar', 'Sala de TV', 'Sala de descanso',
  'Sala de espera', 'Sala para Estudo', 'Sala Íntima', 'Salão', 'Salão de Festas', 'Salão de Jogos',
  'Salão de Jogos Adulto', 'Salão de Jogos Juvenil', 'Sauna', 'Sauna Seca', 'Sauna Úmida', 'Segurança 24 horas',
  'Segurança Interna', 'Segurança Patrimonial', 'Self Delivery', 'Sem Elevador', 'Sem condomínio',
  'Semi Mobiliado', 'Serviço de Praia', 'Serviço de Quarto', 'Serviços Pay Per Use', 'Serviços de Limpeza',
  'Serviços pay-per-use', 'Sistema de Aquecimento de Água à Gás', 'Sistema de Esgoto', 'Sistema de Incendio',
  'Sistema de Refrigeração Central - Tipo Split', 'Sistema de Segurança', 'Sistema de alarme', 'Sistema de Água',
  'Solarium', 'TV Assinatura', 'TV a cabo', 'Telefonia PABX', 'Terraço', 'Terraço Gourmet', 'Teto Rebaixado',
  'Tipo casa', 'Trifásico', 'Vaga anti-sequestro', 'Vaga para Visita', 'Varanda', 'Varanda Gourmet',
  'Ventilação Natural', 'Vestiario para diaristas', 'Vigia', 'Vigilancia 24h', 'Vista Panorâmica',
  'Vista exterior', 'Vista para a montanha', 'Vista para lago', 'Vista para o Mar', 'WC Empregada', 'Zelador',
  'Área de Lazer', 'Área de Luz', 'Área de Serviço'
];

const formasPagamento = [
  'Entrada', 'Mensal', 'Trimestral', 'Semestral', 'Anual', 'Chaves'
];

const portaisDisponiveis = [
  'ZAP Imóveis', 'OLX Imóveis', 'ImovelWeb', 'Viva Real', 'Casa Mineira',
  'Imóveis Brasil', 'Net Imóveis', 'Quinto Andar', 'Loft', 'Lugares',
  'Clic Imóveis', 'Imobiliar', 'Cidade Imóveis', 'Imóveis Commercial', 'Good'
];

export function ImovelFormModal({ open, onClose, imovel }: ImovelFormModalProps) {
  const { toast } = useToast();
  const isEditing = !!imovel;
  const [formData, setFormData] = useState({
    // Informações Básicas
    titulo: imovel?.titulo || '',
    finalidade: imovel?.finalidade || 'Residencial',
    tipo: imovel?.tipo || 'Apartamento',
    valor: imovel?.valor || '',
    descricao: imovel?.descricao || '',
    proprietario: imovel?.proprietario || '',
    proprietarioId: imovel?.proprietarioId || '',
    
    // Autorizações
    autorizacaoVenda: false,
    autorizacaoLocacao: false,
    autorizacaoVendaLocacao: false,
    
    // Contratos
    contratoExclusividade: false,
    contratoExclusividadeLocacao: false,
    contratoVendaPeriodo: { from: undefined, to: undefined } as DateRange,
    contratoLocacaoPeriodo: { from: undefined, to: undefined } as DateRange,
    
    // Situação e Status
    situacao: 'Vago',
    status: 'Livre',
    
    // Composição
    dormitorios: '',
    suites: '',
    banheiros: '',
    salas: '',
    cozinhas: '',
    depEmpregada: '',
    lavabos: '',
    vagasGaragem: '',
    area: '',
    
    // Endereço
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    
    // Arrays para múltiplos itens
    proximidades: [] as string[],
    caracteristicas: [] as string[],
    empreendimentoId: '',
    
    // Formas de Pagamento
    sobConsulta: false,
    formasPagamento: [] as string[],
    
    // Opções de Venda
    fgts: false,
    cartaCredito: false,
    financiamentoBancario: false,
    financiamentoDireto: false,
    minhaCasaMinhaVida: false,
    permuta: false,
    
    // Opções de Locação
    seguroFianca: false,
    fiador: false,
    deposito: false,
    exigeEscrituraFiador: false,
    tituloCapitalizacao: false,
    
    // Valores Adicionais
    iptu: '',
    condominio: '',
    arrendamento: '',
    incra: '',
    
    // Mídia
    videoUrl: '',
    tour360Url: '',
    
    // Informações Adicionais
    observacoesInternas: '',
    chaveDisponivel: false,
    localChaves: '',
    matriculaNumero: '',
    energiaNumero: '',
    aguaNumero: '',
    incraNumero: '',
    iptuNumero: '',
    cartorio: '',
    situacaoEscritura: '',
    captador1: '',
    captador2: '',
    filialImovel: '',
    indicador1: '',
    indicador2: '',
    
    // Divulgação
    destaquePaginaInicial: false,
    destaqueBanner: false,
    oportunidade: false,
    seoTitulo: '',
    seoKeywords: '',
    seoDescricao: '',
    
    // Portais
    portais: [] as string[],
  });

  const [proprietarioOpen, setProprietarioOpen] = useState(false);
  const [showNewProprietarioForm, setShowNewProprietarioForm] = useState(false);
  const [newProprietario, setNewProprietario] = useState({
    nome: '',
    email: '',
    telefone: '',
  });

  const [proximidadeSearch, setProximidadeSearch] = useState('');
  const [caracteristicaSearch, setCaracteristicaSearch] = useState('');
  const [showNewEmpreendimentoForm, setShowNewEmpreendimentoForm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const buscarCEP = async () => {
    if (formData.cep.replace(/\D/g, '').length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${formData.cep.replace(/\D/g, '')}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          setFormData({
            ...formData,
            endereco: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf,
          });
        } else {
          alert('CEP não encontrado');
        }
      } catch (error) {
        alert('Erro ao buscar CEP');
      }
    }
  };

  // Store original data for unsaved changes detection
  const [originalData] = useState({
    // Informações Básicas
    titulo: imovel?.titulo || '',
    finalidade: imovel?.finalidade || 'Residencial',
    tipo: imovel?.tipo || 'Apartamento',
    valor: imovel?.valor || '',
    descricao: imovel?.descricao || '',
    proprietario: imovel?.proprietario || '',
    proprietarioId: imovel?.proprietarioId || '',
    
    // Autorizações
    autorizacaoVenda: false,
    autorizacaoLocacao: false,
    autorizacaoVendaLocacao: false,
    
    // Contratos
    contratoExclusividade: false,
    contratoExclusividadeLocacao: false,
    contratoVendaPeriodo: { from: undefined, to: undefined } as DateRange,
    contratoLocacaoPeriodo: { from: undefined, to: undefined } as DateRange,
    
    // Situação e Status
    situacao: 'Vago',
    status: 'Livre',
  });

  // Check if form has unsaved changes
  const hasUnsavedChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

  const {
    showModal,
    confirmNavigation,
    handleConfirm,
    handleCancel
  } = useUnsavedChanges({ hasUnsavedChanges });

  const handleClose = () => {
    if (confirmNavigation('')) {
      onClose();
    }
  };

  const handleConfirmExit = () => {
    handleCancel(); // Close the unsaved changes modal first
    onClose(); // Close the main modal
  };

  const handleSave = () => {
    console.log(isEditing ? 'Updating imovel:' : 'Saving imovel:', formData);
    
    // Show success toast
    toast({
      title: isEditing ? "Imóvel atualizado com sucesso!" : "Imóvel cadastrado com sucesso!",
      description: `${formData.titulo} foi ${isEditing ? 'atualizado' : 'cadastrado'} com sucesso.`,
      variant: "success",
    });
    
    onClose();
  };

  const handleSelectProprietario = (proprietario: Proprietario) => {
    setFormData({
      ...formData,
      proprietario: proprietario.nome,
      proprietarioId: proprietario.id,
    });
    setProprietarioOpen(false);
  };

  const handleCreateNewProprietario = () => {
    if (newProprietario.nome.trim()) {
      setFormData({
        ...formData,
        proprietario: newProprietario.nome,
        proprietarioId: '',
      });
      setShowNewProprietarioForm(false);
      setNewProprietario({ nome: '', email: '', telefone: '' });
    }
  };

  const handleDownloadQR = async () => {
    const qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://seusite.com/imovel/123';
    
    try {
      // Fetch the QR code image
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qrcode-imovel-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  };

  const handleFinalidadeChange = (finalidade: string) => {
    const tipos = tiposPorFinalidade[finalidade as keyof typeof tiposPorFinalidade];
    setFormData({
      ...formData,
      finalidade: finalidade,
      tipo: tipos[0] || '',
    });
  };

  const handleProximidadeToggle = (proximidade: string) => {
    setFormData(prev => ({
      ...prev,
      proximidades: prev.proximidades.includes(proximidade)
        ? prev.proximidades.filter(p => p !== proximidade)
        : [...prev.proximidades, proximidade]
    }));
  };

  const handleCaracteristicaToggle = (caracteristica: string) => {
    setFormData(prev => ({
      ...prev,
      caracteristicas: prev.caracteristicas.includes(caracteristica)
        ? prev.caracteristicas.filter(c => c !== caracteristica)
        : [...prev.caracteristicas, caracteristica]
    }));
  };

  const handleFormaPagamentoToggle = (forma: string) => {
    setFormData(prev => ({
      ...prev,
      formasPagamento: prev.formasPagamento.includes(forma)
        ? prev.formasPagamento.filter(f => f !== forma)
        : [...prev.formasPagamento, forma]
    }));
  };

  const filteredProprietarios = proprietariosCadastrados.filter((proprietario) =>
    proprietario.nome.toLowerCase().includes(formData.proprietario.toLowerCase())
  );

  const filteredProximidades = proximidades.filter(p =>
    p.toLowerCase().includes(proximidadeSearch.toLowerCase())
  );

  const filteredCaracteristicas = caracteristicasGerais.filter(c =>
    c.toLowerCase().includes(caracteristicaSearch.toLowerCase())
  );

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Imóvel' : 'Cadastrar Novo Imóvel'}</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="basic" className="h-full">
            <TabsList className="grid w-full grid-cols-8">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Dados
              </TabsTrigger>
              <TabsTrigger value="values" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Valores
              </TabsTrigger>
              <TabsTrigger value="info" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Informações
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Documentos
              </TabsTrigger>
              <TabsTrigger value="composition" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Composição
              </TabsTrigger>
              <TabsTrigger value="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Localização
              </TabsTrigger>
              <TabsTrigger value="additional" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Detalhes
              </TabsTrigger>
              <TabsTrigger value="promotion" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Divulgação
              </TabsTrigger>
            </TabsList>

          <div className="overflow-y-auto max-h-[80vh]">
            {/* Aba Informações Básicas */}
            <TabsContent value="basic" className="space-y-6 mt-6">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h3 className="font-semibold text-lg">Informações Principais</h3>
                  
                  <div className="space-y-2">
                    <Label>Título do Anúncio</Label>
                    <Input
                      placeholder="Ex: Apartamento 2 Quartos - Centro"
                      value={formData.titulo}
                      onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Finalidade</Label>
                      <select
                        className="w-full px-3 py-2 rounded-md border border-input bg-background"
                        value={formData.finalidade}
                        onChange={(e) => handleFinalidadeChange(e.target.value)}
                      >
                        <option value="Comercial">Comercial</option>
                        <option value="Industrial">Industrial</option>
                        <option value="Residencial">Residencial</option>
                        <option value="Rural">Rural</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>Tipo de Imóvel</Label>
                      <select
                        className="w-full px-3 py-2 rounded-md border border-input bg-background"
                        value={formData.tipo}
                        onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                      >
                        {tiposPorFinalidade[formData.finalidade as keyof typeof tiposPorFinalidade]?.map((tipo) => (
                          <option key={tipo} value={tipo}>{tipo}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Textarea
                      placeholder="Descreva o imóvel..."
                      value={formData.descricao}
                      onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h3 className="font-semibold text-lg">Autorizações</h3>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="venda"
                        checked={formData.autorizacaoVenda}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, autorizacaoVenda: checked as boolean })
                        }
                      />
                      <Label htmlFor="venda">Autorização de Venda</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="locacao"
                        checked={formData.autorizacaoLocacao}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, autorizacaoLocacao: checked as boolean })
                        }
                      />
                      <Label htmlFor="locacao">Autorização de Locação</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="vendaLocacao"
                        checked={formData.autorizacaoVendaLocacao}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, autorizacaoVendaLocacao: checked as boolean })
                        }
                      />
                      <Label htmlFor="vendaLocacao">Venda e Locação</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h3 className="font-semibold text-lg">Contratos de Exclusividade</h3>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="contratoVenda"
                          checked={formData.contratoExclusividade}
                          onCheckedChange={(checked) => 
                            setFormData({ ...formData, contratoExclusividade: checked as boolean })
                          }
                        />
                        <Label htmlFor="contratoVenda">Contrato de Exclusividade</Label>
                      </div>
                      
                      {formData.contratoExclusividade && (
                        <div className="space-y-2">
                          <Label>Período do Contrato de Venda</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              type="date"
                              placeholder="Início"
                              value={formData.contratoVendaPeriodo.from ? formData.contratoVendaPeriodo.from.toISOString().split('T')[0] : ''}
                              onChange={(e) => setFormData({
                                ...formData,
                                contratoVendaPeriodo: {
                                  ...formData.contratoVendaPeriodo,
                                  from: e.target.value ? new Date(e.target.value) : undefined
                                }
                              })}
                            />
                            <Input
                              type="date"
                              placeholder="Validade"
                              value={formData.contratoVendaPeriodo.to ? formData.contratoVendaPeriodo.to.toISOString().split('T')[0] : ''}
                              onChange={(e) => setFormData({
                                ...formData,
                                contratoVendaPeriodo: {
                                  ...formData.contratoVendaPeriodo,
                                  to: e.target.value ? new Date(e.target.value) : undefined
                                }
                              })}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="contratoLocacao"
                          checked={formData.contratoExclusividadeLocacao}
                          onCheckedChange={(checked) => 
                            setFormData({ ...formData, contratoExclusividadeLocacao: checked as boolean })
                          }
                        />
                        <Label htmlFor="contratoLocacao">Contrato de Exclusividade de Locação</Label>
                      </div>
                      
                      {formData.contratoExclusividadeLocacao && (
                        <div className="space-y-2">
                          <Label>Período do Contrato de Locação</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              type="date"
                              placeholder="Início"
                              value={formData.contratoLocacaoPeriodo.from ? formData.contratoLocacaoPeriodo.from.toISOString().split('T')[0] : ''}
                              onChange={(e) => setFormData({
                                ...formData,
                                contratoLocacaoPeriodo: {
                                  ...formData.contratoLocacaoPeriodo,
                                  from: e.target.value ? new Date(e.target.value) : undefined
                                }
                              })}
                            />
                            <Input
                              type="date"
                              placeholder="Validade"
                              value={formData.contratoLocacaoPeriodo.to ? formData.contratoLocacaoPeriodo.to.toISOString().split('T')[0] : ''}
                              onChange={(e) => setFormData({
                                ...formData,
                                contratoLocacaoPeriodo: {
                                  ...formData.contratoLocacaoPeriodo,
                                  to: e.target.value ? new Date(e.target.value) : undefined
                                }
                              })}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h3 className="font-semibold text-lg">Situação e Status</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Situação do Imóvel</Label>
                      <select
                        className="w-full px-3 py-2 rounded-md border border-input bg-background"
                        value={formData.situacao}
                        onChange={(e) => setFormData({ ...formData, situacao: e.target.value })}
                      >
                        <option value="Vago">Vago</option>
                        <option value="Com inquilino">Com inquilino</option>
                        <option value="Ocupado">Ocupado</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>Status do Imóvel</Label>
                      <select
                        className="w-full px-3 py-2 rounded-md border border-input bg-background"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      >
                        <option value="Livre">Livre</option>
                        <option value="Alugado">Alugado</option>
                        <option value="Alugado Terceiros">Alugado Terceiros</option>
                        <option value="Baixado">Baixado</option>
                        <option value="Bloqueado">Bloqueado</option>
                        <option value="Em proposta">Em proposta</option>
                        <option value="Reservado">Reservado</option>
                        <option value="Suspenso">Suspenso</option>
                        <option value="Vendido">Vendido</option>
                        <option value="Vendido Terceiros">Vendido Terceiros</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label>Proprietário</Label>
                    <div className="space-y-3">
                      <Popover open={proprietarioOpen} onOpenChange={setProprietarioOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={proprietarioOpen}
                            className="w-full justify-between h-10"
                          >
                            <span className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              {formData.proprietario || "Buscar proprietário cadastrado..."}
                            </span>
                            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <Command>
                            <CommandInput placeholder="Buscar proprietário..." />
                            <CommandList>
                              <CommandEmpty>Nenhum proprietário encontrado.</CommandEmpty>
                              <CommandGroup>
                                {filteredProprietarios.map((proprietario) => (
                                  <CommandItem
                                    key={proprietario.id}
                                    onSelect={() => handleSelectProprietario(proprietario)}
                                  >
                                    <div className="flex items-center gap-2">
                                      <User className="h-4 w-4" />
                                      <div>
                                        <div className="font-medium">{proprietario.nome}</div>
                                        <div className="text-sm text-muted-foreground">
                                          {proprietario.email} • {proprietario.telefone}
                                        </div>
                                      </div>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      
                      <div className="flex items-center gap-2">
                        <div className="h-px bg-border flex-1"></div>
                        <span className="text-xs text-muted-foreground px-2">OU</span>
                        <div className="h-px bg-border flex-1"></div>
                      </div>
                      
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full gap-2"
                        onClick={() => setShowNewProprietarioForm(!showNewProprietarioForm)}
                      >
                        <Plus className="h-4 w-4" />
                        Cadastrar Novo Proprietário
                      </Button>
                      
                      {showNewProprietarioForm && (
                        <div className="space-y-3 p-4 border border-border rounded-lg bg-muted/50">
                          <div className="space-y-2">
                            <Label>Nome do Proprietário</Label>
                            <Input
                              placeholder="Nome completo"
                              value={newProprietario.nome}
                              onChange={(e) => setNewProprietario({ ...newProprietario, nome: e.target.value })}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label>Email</Label>
                              <Input
                                type="email"
                                placeholder="email@exemplo.com"
                                value={newProprietario.email}
                                onChange={(e) => setNewProprietario({ ...newProprietario, email: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Telefone</Label>
                              <Input
                                placeholder="(00) 00000-0000"
                                value={newProprietario.telefone}
                                onChange={(e) => setNewProprietario({ ...newProprietario, telefone: e.target.value })}
                              />
                            </div>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            className="w-full"
                            onClick={handleCreateNewProprietario}
                            disabled={!newProprietario.nome.trim()}
                          >
                            Adicionar Proprietário
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba Valores */}
            <TabsContent value="values" className="space-y-6 mt-6">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Valores do Imóvel
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Valor Principal *</Label>
                      <Input
                        placeholder="R$ 0,00"
                        value={formData.valor}
                        onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>IPTU (R$)</Label>
                      <Input
                        placeholder="R$ 0,00"
                        value={formData.iptu}
                        onChange={(e) => setFormData({ ...formData, iptu: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Condomínio (R$)</Label>
                      <Input
                        placeholder="R$ 0,00"
                        value={formData.condominio}
                        onChange={(e) => setFormData({ ...formData, condominio: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Arrendamento (R$)</Label>
                      <Input
                        placeholder="R$ 0,00"
                        value={formData.arrendamento}
                        onChange={(e) => setFormData({ ...formData, arrendamento: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>INCRA (R$)</Label>
                      <Input
                        placeholder="R$ 0,00"
                        value={formData.incra}
                        onChange={(e) => setFormData({ ...formData, incra: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Formas de Pagamento
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sobConsulta"
                        checked={formData.sobConsulta}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, sobConsulta: checked as boolean })
                        }
                      />
                      <Label htmlFor="sobConsulta">Sob consulta (não exibir valor no site)</Label>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Formas de Pagamento</Label>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full gap-2"
                        onClick={() => setShowPaymentModal(true)}
                      >
                        <CreditCard className="h-4 w-4" />
                        Configurar Formas de Pagamento
                      </Button>
                      {formData.formasPagamento.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.formasPagamento.map((forma) => (
                            <Badge key={forma} variant="secondary">
                              {forma}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba Informações */}
            <TabsContent value="info" className="space-y-6 mt-6">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Informações Administrativas
                  </h3>
                  
                  <div className="space-y-2">
                    <Label>Observações Internas</Label>
                    <Textarea
                      placeholder="Observações internas sobre o imóvel..."
                      value={formData.observacoesInternas}
                      onChange={(e) => setFormData({ ...formData, observacoesInternas: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Matrícula Nº</Label>
                      <Input
                        placeholder="Número da matrícula"
                        value={formData.matriculaNumero}
                        onChange={(e) => setFormData({ ...formData, matriculaNumero: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Energia Nº</Label>
                      <Input
                        placeholder="Número da conta de energia"
                        value={formData.energiaNumero}
                        onChange={(e) => setFormData({ ...formData, energiaNumero: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Água Nº</Label>
                      <Input
                        placeholder="Número da conta de água"
                        value={formData.aguaNumero}
                        onChange={(e) => setFormData({ ...formData, aguaNumero: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>INCRA Nº</Label>
                      <Input
                        placeholder="Número do INCRA"
                        value={formData.incraNumero}
                        onChange={(e) => setFormData({ ...formData, incraNumero: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>IPTU Nº</Label>
                      <Input
                        placeholder="Número do IPTU"
                        value={formData.iptuNumero}
                        onChange={(e) => setFormData({ ...formData, iptuNumero: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Cartório</Label>
                      <Input
                        placeholder="Nome do cartório"
                        value={formData.cartorio}
                        onChange={(e) => setFormData({ ...formData, cartorio: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Chaves e Acesso
                  </h3>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="chaveDisponivel"
                      checked={formData.chaveDisponivel}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, chaveDisponivel: checked as boolean })
                      }
                    />
                    <Label htmlFor="chaveDisponivel">Chave disponível?</Label>
                  </div>
                  
                  {formData.chaveDisponivel && (
                    <div className="space-y-2">
                      <Label>Local das Chaves</Label>
                      <Input
                        placeholder="Onde as chaves estão localizadas"
                        value={formData.localChaves}
                        onChange={(e) => setFormData({ ...formData, localChaves: e.target.value })}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Equipe e Responsáveis
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Situação Escritura</Label>
                      <select
                        className="w-full px-3 py-2 rounded-md border border-input bg-background"
                        value={formData.situacaoEscritura}
                        onChange={(e) => setFormData({ ...formData, situacaoEscritura: e.target.value })}
                      >
                        <option value="">Selecione...</option>
                        <option value="na_cartorio">No Cartório</option>
                        <option value="em_andamento">Em Andamento</option>
                        <option value="concluida">Concluída</option>
                        <option value="pendente">Pendente</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Filial do Imóvel</Label>
                      <Input
                        placeholder="Filial responsável"
                        value={formData.filialImovel}
                        onChange={(e) => setFormData({ ...formData, filialImovel: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Captador 1</Label>
                      <Input
                        placeholder="Nome do captador principal"
                        value={formData.captador1}
                        onChange={(e) => setFormData({ ...formData, captador1: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Captador 2</Label>
                      <Input
                        placeholder="Nome do captador secundário"
                        value={formData.captador2}
                        onChange={(e) => setFormData({ ...formData, captador2: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Indicador 1</Label>
                      <Input
                        placeholder="Nome do indicador principal"
                        value={formData.indicador1}
                        onChange={(e) => setFormData({ ...formData, indicador1: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Indicador 2</Label>
                      <Input
                        placeholder="Nome do indicador secundário"
                        value={formData.indicador2}
                        onChange={(e) => setFormData({ ...formData, indicador2: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba Documentos */}
            <TabsContent value="documents" className="space-y-6 mt-6">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Documentos do Imóvel
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-lg font-medium mb-2">Upload de Documentos</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Arraste e solte os arquivos aqui ou clique para selecionar
                      </p>
                      <Button variant="outline" className="gap-2">
                        <Upload className="h-4 w-4" />
                        Selecionar Arquivos
                      </Button>
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          setUploadedFiles([...uploadedFiles, ...files]);
                        }}
                      />
                    </div>
                    
                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2">
                        <Label>Documentos anexados:</Label>
                        <div className="space-y-2">
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                              <span className="text-sm">{file.name}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
                                }}
                              >
                                ×
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="text-sm text-muted-foreground">
                      <p>Documentos sugeridos:</p>
                      <ul className="list-disc list-inside mt-1">
                        <li>Matrícula do Imóvel</li>
                        <li>Contrato de Compra e Venda</li>
                        <li>Escritura Pública</li>
                        <li>Certidões</li>
                        <li>Plantas e Projetos</li>
                        <li>Fotos do Imóvel</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba Composição */}
            <TabsContent value="composition" className="space-y-6 mt-6">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h3 className="font-semibold text-lg">Composição do Imóvel</h3>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Dormitórios</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={formData.dormitorios}
                        onChange={(e) => setFormData({ ...formData, dormitorios: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Suítes</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={formData.suites}
                        onChange={(e) => setFormData({ ...formData, suites: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Banheiros</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={formData.banheiros}
                        onChange={(e) => setFormData({ ...formData, banheiros: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Salas</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={formData.salas}
                        onChange={(e) => setFormData({ ...formData, salas: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Cozinhas</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={formData.cozinhas}
                        onChange={(e) => setFormData({ ...formData, cozinhas: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Dep. Empregada</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={formData.depEmpregada}
                        onChange={(e) => setFormData({ ...formData, depEmpregada: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Lavabos</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={formData.lavabos}
                        onChange={(e) => setFormData({ ...formData, lavabos: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Vagas de Garagem</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={formData.vagasGaragem}
                        onChange={(e) => setFormData({ ...formData, vagasGaragem: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Área (m²)</Label>
                      <Input
                        placeholder="0"
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba Localização */}
            <TabsContent value="location" className="space-y-6 mt-6">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h3 className="font-semibold text-lg">Endereço</h3>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>CEP</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="00000-000"
                          value={formData.cep}
                          onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                        />
                        <Button type="button" variant="outline" onClick={buscarCEP}>
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-2">
                      <Label>Endereço</Label>
                      <Input
                        placeholder="Rua, Avenida..."
                        value={formData.endereco}
                        onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Número</Label>
                      <Input
                        placeholder="123"
                        value={formData.numero}
                        onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Complemento</Label>
                      <Input
                        placeholder="Apto, Bloco..."
                        value={formData.complemento}
                        onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Bairro</Label>
                      <Input
                        placeholder="Bairro"
                        value={formData.bairro}
                        onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Cidade</Label>
                      <Input
                        placeholder="Cidade"
                        value={formData.cidade}
                        onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba Detalhes */}
            <TabsContent value="additional" className="space-y-6 mt-6">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h3 className="font-semibold text-lg">Mídia</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>URL do Vídeo</Label>
                      <Input
                        placeholder="https://youtube.com/watch?v=..."
                        value={formData.videoUrl}
                        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>URL do Tour 360</Label>
                      <Input
                        placeholder="https://tour360.com/..."
                        value={formData.tour360Url}
                        onChange={(e) => setFormData({ ...formData, tour360Url: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h3 className="font-semibold text-lg">Características Gerais</h3>
                  
                  <div className="space-y-2">
                    <Label>Buscar características...</Label>
                    <Input
                      placeholder="Digite para filtrar características"
                      value={caracteristicaSearch}
                      onChange={(e) => setCaracteristicaSearch(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                    {filteredCaracteristicas.slice(0, 30).map((caracteristica) => (
                      <div key={caracteristica} className="flex items-center space-x-2">
                        <Checkbox
                          id={`caracteristica-${caracteristica}`}
                          checked={formData.caracteristicas.includes(caracteristica)}
                          onCheckedChange={() => handleCaracteristicaToggle(caracteristica)}
                        />
                        <Label
                          htmlFor={`caracteristica-${caracteristica}`}
                          className="text-sm cursor-pointer"
                        >
                          {caracteristica}
                        </Label>
                      </div>
                    ))}
                  </div>

                  {formData.caracteristicas.length > 0 && (
                    <div className="space-y-2">
                      <Label>Características selecionadas:</Label>
                      <div className="flex flex-wrap gap-2">
                        {formData.caracteristicas.map((caracteristica) => (
                          <Badge
                            key={caracteristica}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => handleCaracteristicaToggle(caracteristica)}
                          >
                            {caracteristica} ×
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba Proximidades */}
            <TabsContent value="nearby" className="space-y-6 mt-6">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h3 className="font-semibold text-lg">Proximidades</h3>
                  
                  <div className="space-y-2">
                    <Label>Buscar proximidades...</Label>
                    <Input
                      placeholder="Digite para filtrar proximidades"
                      value={proximidadeSearch}
                      onChange={(e) => setProximidadeSearch(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                    {filteredProximidades.map((proximidade) => (
                      <div key={proximidade} className="flex items-center space-x-2">
                        <Checkbox
                          id={`proximidade-${proximidade}`}
                          checked={formData.proximidades.includes(proximidade)}
                          onCheckedChange={() => handleProximidadeToggle(proximidade)}
                        />
                        <Label
                          htmlFor={`proximidade-${proximidade}`}
                          className="text-sm cursor-pointer"
                        >
                          {proximidade}
                        </Label>
                      </div>
                    ))}
                  </div>

                  {formData.proximidades.length > 0 && (
                    <div className="space-y-2">
                      <Label>Proximidades selecionadas:</Label>
                      <div className="flex flex-wrap gap-2">
                        {formData.proximidades.map((proximidade) => (
                          <Badge
                            key={proximidade}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => handleProximidadeToggle(proximidade)}
                          >
                            {proximidade} ×
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba Empreendimento */}
            <TabsContent value="enterprise" className="space-y-6 mt-6">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h3 className="font-semibold text-lg">Empreendimento</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Vincular a Empreendimento Existente</Label>
                        <select
                          className="w-full px-3 py-2 rounded-md border border-input bg-background"
                          value={formData.empreendimentoId}
                          onChange={(e) => setFormData({ ...formData, empreendimentoId: e.target.value })}
                        >
                          <option value="">Selecione um empreendimento...</option>
                          <option value="1">Condomínio Residencial Solaris</option>
                          <option value="2">Empreendimento Comercial Center</option>
                          <option value="3">Condomínio Garden Towers</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Ou criar novo empreendimento</Label>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full gap-2"
                          onClick={() => setShowNewEmpreendimentoForm(!showNewEmpreendimentoForm)}
                        >
                          <Plus className="h-4 w-4" />
                          Novo Empreendimento
                        </Button>
                      </div>
                    </div>

                    {showNewEmpreendimentoForm && (
                      <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/50">
                        <h4 className="font-medium">Cadastro de Novo Empreendimento</h4>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Nome do Empreendimento</Label>
                            <Input placeholder="Nome do condomínio/empreendimento" />
                          </div>
                          <div className="space-y-2">
                            <Label>Tipo</Label>
                            <select className="w-full px-3 py-2 rounded-md border border-input bg-background">
                              <option value="residencial">Residencial</option>
                              <option value="comercial">Comercial</option>
                              <option value="misto">Misto</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Total de Unidades</Label>
                            <Input type="number" placeholder="0" />
                          </div>
                          <div className="space-y-2">
                            <Label>Unidades por Andar</Label>
                            <Input type="number" placeholder="0" />
                          </div>
                          <div className="space-y-2">
                            <Label>Total de Andares</Label>
                            <Input type="number" placeholder="0" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Status da Obra</Label>
                          <select className="w-full px-3 py-2 rounded-md border border-input bg-background">
                            <option value="planejado">Planejado</option>
                            <option value="em_construcao">Em Construção</option>
                            <option value="concluido">Concluído</option>
                            <option value="pronto_para_morar">Pronto para Morar</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label>Plantas Disponíveis</Label>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="planta-1" />
                              <Label htmlFor="planta-1" className="text-sm">1 Quarto</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="planta-2" />
                              <Label htmlFor="planta-2" className="text-sm">2 Quartos</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="planta-3" />
                              <Label htmlFor="planta-3" className="text-sm">3 Quartos</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="planta-4" />
                              <Label htmlFor="planta-4" className="text-sm">4+ Quartos</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="planta-studio" />
                              <Label htmlFor="planta-studio" className="text-sm">Studio</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="planta-cobertura" />
                              <Label htmlFor="planta-cobertura" className="text-sm">Cobertura</Label>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Descrição do Empreendimento</Label>
                          <Textarea
                            placeholder="Descreva as características do empreendimento..."
                            rows={3}
                          />
                        </div>

                        <Button type="button" className="w-full">
                          Criar Empreendimento
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba Divulgação */}
            <TabsContent value="promotion" className="space-y-6 mt-6">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Destaque no Website
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="destaquePaginaInicial"
                        checked={formData.destaquePaginaInicial}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, destaquePaginaInicial: checked as boolean })
                        }
                      />
                      <Label htmlFor="destaquePaginaInicial" className="text-sm">Destaque na Página Inicial</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="destaqueBanner"
                        checked={formData.destaqueBanner}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, destaqueBanner: checked as boolean })
                        }
                      />
                      <Label htmlFor="destaqueBanner" className="text-sm">Destaque no Banner</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="oportunidade"
                        checked={formData.oportunidade}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, oportunidade: checked as boolean })
                        }
                      />
                      <Label htmlFor="oportunidade" className="text-sm">Oportunidade</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <QrCode className="h-5 w-5" />
                    QR Code e Links
                  </h3>
                  
                  <div className="space-y-2">
                    <Label>QR Code do Imóvel</Label>
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <img
                          src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://seusite.com/imovel/123"
                          alt="QR Code do Imóvel"
                          className="w-16 h-16"
                        />
                        <div>
                          <p className="text-xs font-medium">QR Code do Imóvel</p>
                          <p className="text-xs text-muted-foreground">QR Code para acesso rápido</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          Visualizar
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleDownloadQR}>
                          Baixar QR Code
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Link da Landing Page</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="https://seusite.com/imovel/123"
                          value={`https://seusite.com/imovel/${Date.now()}`}
                          readOnly
                        />
                        <Button variant="outline" size="sm">
                          Copiar
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Link Direto para o Anúncio</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="https://seusite.com/anuncio/123"
                          value={`https://seusite.com/anuncio/${Date.now()}`}
                          readOnly
                        />
                        <Button variant="outline" size="sm">
                          Copiar
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <SearchIcon className="h-5 w-5" />
                    SEO e Otimização
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Título para SEO</Label>
                      <Input
                        placeholder="Título otimizado para buscadores"
                        value={formData.seoTitulo}
                        onChange={(e) => setFormData({ ...formData, seoTitulo: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Palavras-Chave (Keywords)</Label>
                      <Input
                        placeholder="apartamento, venda, centro, 2 quartos"
                        value={formData.seoKeywords}
                        onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">Separe as palavras-chave com vírgula</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Descrição para SEO</Label>
                      <Textarea
                        placeholder="Descrição que aparecerá nos resultados de busca..."
                        value={formData.seoDescricao}
                        onChange={(e) => setFormData({ ...formData, seoDescricao: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  {/* Preview do SEO */}
                  {(formData.seoTitulo || formData.seoDescricao) && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Preview nos Resultados de Busca:</Label>
                      <div className="border border-border rounded-lg p-4 bg-white">
                        <div className="space-y-2">
                          <div className="text-blue-600 text-sm hover:underline cursor-pointer">
                            https://seusite.com/imovel/123
                          </div>
                          <div className="text-lg font-medium text-blue-900 hover:underline cursor-pointer">
                            {formData.seoTitulo || 'Título do Imóvel - Apartamento 2 Quartos'}
                          </div>
                          <div className="text-sm text-gray-600">
                            {formData.seoDescricao || 'Descrição do imóvel que aparecerá no Google e outros buscadores...'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Divulgação nos Portais
                  </h3>
                  
                  <div className="space-y-2">
                    <Label>Selecione os portais para divulgação:</Label>
                    <div className="grid grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                      {portaisDisponiveis.map((portal) => (
                        <div key={portal} className="flex items-center space-x-2">
                          <Checkbox
                            id={`portal-${portal}`}
                            checked={formData.portais.includes(portal)}
                            onCheckedChange={() => {
                              setFormData(prev => ({
                                ...prev,
                                portais: prev.portais.includes(portal)
                                  ? prev.portais.filter(p => p !== portal)
                                  : [...prev.portais, portal]
                              }));
                            }}
                          />
                          <Label
                            htmlFor={`portal-${portal}`}
                            className="text-sm cursor-pointer"
                          >
                            {portal}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {formData.portais.length > 0 && (
                    <div className="space-y-2">
                      <Label>Portais selecionados:</Label>
                      <div className="flex flex-wrap gap-2">
                        {formData.portais.map((portal) => (
                          <Badge
                            key={portal}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                portais: prev.portais.filter(p => p !== portal)
                              }));
                            }}
                          >
                            {portal} ×
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                      <Upload className="h-4 w-4" />
                      Enviar para Portais Selecionados
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <SearchIcon className="h-4 w-4" />
                      Ver Status nos Portais
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>

          <div className="flex gap-3 p-6 border-t">
            <Button onClick={handleSave} className="flex-1 gap-2">
              <Save className="h-4 w-4" />
              Salvar Imóvel
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </Tabs>
        </DialogContent>
      </Dialog>
      
      <UnsavedChangesModal
        open={showModal}
        onConfirm={handleConfirmExit}
        onCancel={handleCancel}
      />
    </>
  );
}
