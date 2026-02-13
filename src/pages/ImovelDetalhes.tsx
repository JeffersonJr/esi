import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  Edit, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize, 
  Calendar,
  Home,
  Building,
  Settings,
  FileText,
  Globe,
  CreditCard,
  Calculator,
  Info,
  User,
  Phone,
  Mail,
  Link,
  Download,
  Eye,
  Printer,
  QrCode
} from 'lucide-react';

// Mock data - in a real app, this would come from an API
const mockImovel = {
  id: '1',
  titulo: 'Apartamento 2 Quartos - Centro',
  tipo: 'Apartamento',
  finalidade: 'Residencial',
  endereco: 'Rua das Flores, 123 - Centro, São Paulo',
  valor: 'R$ 350.000',
  valorCondominio: 'R$ 450',
  valorIptu: 'R$ 180',
  quartos: 2,
  suites: 1,
  banheiros: 1,
  salas: 1,
  cozinhas: 1,
  vagasGaragem: 1,
  area: '65m²',
  areaTotal: '75m²',
  status: 'Disponível',
  situacao: 'Vago',
  descricao: 'Excelente apartamento no centro de São Paulo, próximo a comércios, transporte e serviços. Imóvel bem conservado com acabamentos de qualidade.',
  imagem: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
  imagens: [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
  ],
  caracteristicas: [
    'Ar Condicionado',
    'Armários Embutidos',
    'Varanda Gourmet',
    'Piscina no Condomínio',
    'Academia',
    'Portaria 24h',
    'Segurança 24h',
    'Elevador'
  ],
  proximidades: [
    'Supermercado',
    'Farmácia',
    'Escola',
    'Metrô',
    'Hospital',
    'Shopping'
  ],
  proprietario: {
    nome: 'Carlos Oliveira',
    email: 'carlos@email.com',
    telefone: '(11) 99999-0002'
  },
  captador: 'João Silva',
  dataCadastro: '15/12/2024',
  codigo: 'APT-001',
  formasPagamento: ['À vista', 'Financiamento', 'Entrada + Parcelas'],
  autorizacaoVenda: true,
  autorizacaoLocacao: false,
  autorizacaoVendaLocacao: false,
  contratoExclusividade: true,
  contratoExclusividadeLocacao: false,
  observacoesInternas: 'Cliente muito exigente, priorizar visitas finais de semana.',
  videoUrl: 'https://youtube.com/watch?v=example',
  tour360Url: 'https://tour360.com/example',
  // Links
  landingPageUrl: 'https://seusite.com/imovel/123',
  linkAnuncio: 'https://seusite.com/anuncio/123',
  // Additional registration data
  matriculaNumero: '12345',
  energiaNumero: '67890',
  aguaNumero: '54321',
  incraNumero: '98765',
  iptuNumero: '24680',
  cartorio: 'Cartório de Registro de Imóveis - 1º Ofício',
  situacaoEscritura: 'No Cartório',
  chaveDisponivel: true,
  localChaves: 'Com o porteiro do condomínio',
  captador1: 'João Silva',
  captador2: 'Maria Santos',
  filialImovel: 'São Paulo - Centro',
  indicador1: 'Pedro Costa',
  indicador2: '',
  contratoVendaPeriodo: { from: '2024-01-01', to: '2024-12-31' },
  contratoLocacaoPeriodo: null,
  // Payment options
  fgts: true,
  cartaCredito: true,
  financiamentoBancario: true,
  financiamentoDireto: false,
  minhaCasaMinhaVida: false,
  permuta: false,
  seguroFianca: false,
  fiador: false,
  deposito: false,
  exigeEscrituraFiador: false,
  tituloCapitalizacao: false,
  // Promotion and SEO
  destaquePaginaInicial: true,
  destaqueBanner: false,
  oportunidade: false,
  seoTitulo: 'Apartamento 2 Quartos em São Paulo - Centro - R$ 350.000',
  seoKeywords: 'apartamento, são paulo, centro, 2 quartos, venda, imóvel',
  seoDescricao: 'Excelente apartamento de 2 quartos no centro de São Paulo. Próximo a metrô, comércios e serviços. R$ 350.000.',
  // Portals
  portais: ['ZAP Imóveis', 'OLX Imóveis', 'ImovelWeb', 'Viva Real']
};

export default function ImovelDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedQRCode, setSelectedQRCode] = useState<string>('');

  const imovel = mockImovel; // In a real app, fetch based on id

  const handleEdit = () => {
    navigate(`/imoveis/editar/${id}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const generateQRCode = () => {
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://seusite.com/imovel/${imovel.id}`;
    return url;
  };

  const handleViewQR = () => {
    const qrCode = generateQRCode();
    setSelectedQRCode(qrCode);
    setShowQRModal(true);
  };

  const handleDownloadQR = async () => {
    const qrCode = generateQRCode();
    
    try {
      // Fetch the QR code image
      const response = await fetch(qrCode);
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qrcode-imovel-${imovel.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? imovel.imagens.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === imovel.imagens.length - 1 ? 0 : prev + 1
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponível':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Reservado':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Vendido':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return '';
    }
  };

  return (
    <>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
          .print-break {
            page-break-inside: avoid;
          }
        }
      `}</style>
      
      <div className="min-h-screen bg-gray-50 print-area">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 no-print">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/imoveis')} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{imovel.titulo}</h1>
              <p className="text-sm text-gray-500">Código: {imovel.codigo}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button onClick={handleEdit} className="gap-2">
              <Edit className="h-4 w-4" />
              Editar Imóvel
            </Button>
            <Button variant="outline" onClick={handlePrint} className="gap-2">
              <Printer className="h-4 w-4" />
              Imprimir Ficha
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={imovel.imagens[currentImageIndex]}
                      alt={imovel.titulo}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Image Navigation */}
                  {imovel.imagens.length > 1 && (
                    <>
                      <button
                        onClick={handlePreviousImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
                      >
                        <ArrowLeft className="h-4 w-4 rotate-180" />
                      </button>
                    </>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge className={getStatusColor(imovel.status)}>
                      {imovel.status}
                    </Badge>
                  </div>
                </div>

                {/* Thumbnail Gallery */}
                {imovel.imagens.length > 1 && (
                  <div className="flex gap-2 p-4 border-t">
                    {imovel.imagens.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded overflow-hidden border-2 ${
                          index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Imagem ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Descrição</h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{imovel.descricao}</p>
              </CardContent>
            </Card>

            {/* Characteristics */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Características
                </h3>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {imovel.caracteristicas.map((caracteristica, index) => (
                    <Badge key={index} variant="secondary">
                      {caracteristica}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Proximities */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Proximidades
                </h3>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {imovel.proximidades.map((proximidade, index) => (
                    <Badge key={index} variant="outline">
                      {proximidade}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Administrative Information */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Informações Administrativas
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Documentação</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Matrícula Nº:</span>
                        <span className="font-medium">{imovel.matriculaNumero || 'Não informado'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Energia Nº:</span>
                        <span className="font-medium">{imovel.energiaNumero || 'Não informado'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Água Nº:</span>
                        <span className="font-medium">{imovel.aguaNumero || 'Não informado'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>INCRA Nº:</span>
                        <span className="font-medium">{imovel.incraNumero || 'Não informado'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>IPTU Nº:</span>
                        <span className="font-medium">{imovel.iptuNumero || 'Não informado'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Cartório e Escritura</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Cartório:</span>
                        <span className="font-medium">{imovel.cartorio || 'Não informado'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Situação Escritura:</span>
                        <span className="font-medium">{imovel.situacaoEscritura || 'Não informado'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Chaves e Acesso</h4>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${imovel.chaveDisponivel ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-sm">Chave {imovel.chaveDisponivel ? 'disponível' : 'indisponível'}</span>
                  </div>
                  {imovel.chaveDisponivel && imovel.localChaves && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Local das chaves:</span> {imovel.localChaves}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Team and Responsibilities */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Equipe e Responsáveis
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Captadores</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Captador 1:</span>
                        <span className="font-medium">{imovel.captador1 || 'Não informado'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Captador 2:</span>
                        <span className="font-medium">{imovel.captador2 || 'Não informado'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Indicadores</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Indicador 1:</span>
                        <span className="font-medium">{imovel.indicador1 || 'Não informado'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Indicador 2:</span>
                        <span className="font-medium">{imovel.indicador2 || 'Não informado'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Filial do Imóvel:</span>
                  <span className="font-medium">{imovel.filialImovel || 'Não informado'}</span>
                </div>
              </CardContent>
            </Card>

            {/* Contracts and Authorizations */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Contratos e Autorizações
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Autorizações</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${imovel.autorizacaoVenda ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className="text-sm">Venda</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${imovel.autorizacaoLocacao ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className="text-sm">Locação</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${imovel.autorizacaoVendaLocacao ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className="text-sm">Venda e Locação</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Contratos de Exclusividade</h4>
                  <div className="space-y-2">
                    {imovel.contratoExclusividade && (
                      <div className="text-sm">
                        <span className="font-medium">Contrato de Exclusividade:</span> Ativo
                        {imovel.contratoVendaPeriodo && (
                          <div className="text-xs text-gray-600 ml-4">
                            Período: {imovel.contratoVendaPeriodo.from} a {imovel.contratoVendaPeriodo.to}
                          </div>
                        )}
                      </div>
                    )}
                    {imovel.contratoExclusividadeLocacao && (
                      <div className="text-sm">
                        <span className="font-medium">Contrato de Exclusividade de Locação:</span> Ativo
                        {imovel.contratoLocacaoPeriodo && (
                          <div className="text-xs text-gray-600 ml-4">
                            Período: {imovel.contratoLocacaoPeriodo.from} a {imovel.contratoLocacaoPeriodo.to}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Options */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Opções de Pagamento
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Formas de Pagamento</h4>
                  <div className="flex flex-wrap gap-2">
                    {imovel.formasPagamento.map((forma, index) => (
                      <Badge key={index} variant="outline">
                        {forma}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {(imovel.autorizacaoVenda || imovel.autorizacaoVendaLocacao) && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Opções para Venda</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${imovel.fgts ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span>Aceita FGTS</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${imovel.cartaCredito ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span>Carta de Crédito</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${imovel.financiamentoBancario ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span>Financiamento Bancário</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${imovel.financiamentoDireto ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span>Financiamento Direto</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${imovel.minhaCasaMinhaVida ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span>Minha Casa Minha Vida</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${imovel.permuta ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span>Aceita Permuta</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {(imovel.autorizacaoLocacao || imovel.autorizacaoVendaLocacao) && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Opções para Locação</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${imovel.seguroFianca ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span>Seguro Fiança</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${imovel.fiador ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span>Aceita Fiador</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${imovel.deposito ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span>Depósito</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${imovel.exigeEscrituraFiador ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span>Exige Escritura do Fiador</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${imovel.tituloCapitalizacao ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span>Título de Capitalização</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* QR Code e Links */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  QR Code e Links
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">QR Code do Imóvel</Label>
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <img
                        src={generateQRCode()}
                        alt="QR Code do Imóvel"
                        className="w-16 h-16"
                      />
                      <div>
                        <p className="text-sm font-medium">QR Code do Imóvel</p>
                        <p className="text-xs text-muted-foreground">QR Code para acesso rápido</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleViewQR}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Visualizar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleDownloadQR}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Baixar
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Link da Landing Page</Label>
                    <div className="flex gap-2">
                      <Input
                        value={imovel.landingPageUrl}
                        readOnly
                        className="text-sm"
                      />
                      <Button variant="outline" size="sm" className="gap-1">
                        <Link className="h-3 w-3" />
                        Copiar
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Link do Anúncio</Label>
                    <div className="flex gap-2">
                      <Input
                        value={imovel.linkAnuncio}
                        readOnly
                        className="text-sm"
                      />
                      <Button variant="outline" size="sm" className="gap-1">
                        <Link className="h-3 w-3" />
                        Copiar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Promotion and SEO */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Divulgação e SEO
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Destaque no Website</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${imovel.destaquePaginaInicial ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className="text-sm">Destaque na Página Inicial</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${imovel.destaqueBanner ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className="text-sm">Destaque no Banner</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${imovel.oportunidade ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className="text-sm">Oportunidade</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Otimização para Buscadores (SEO)</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Título SEO:</span>
                      <span className="font-medium text-right max-w-xs">{imovel.seoTitulo}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Palavras-chave:</span>
                      <span className="font-medium text-right max-w-xs">{imovel.seoKeywords}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Descrição SEO:</span>
                      <span className="font-medium text-right max-w-xs">{imovel.seoDescricao}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Divulgação nos Portais</h4>
                  <div className="flex flex-wrap gap-2">
                    {imovel.portais.map((portal, index) => (
                      <Badge key={index} variant="secondary">
                        {portal}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Media */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Mídia</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {imovel.videoUrl && (
                  <div>
                    <h4 className="font-medium mb-2">Vídeo</h4>
                    <a 
                      href={imovel.videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Ver vídeo no YouTube
                    </a>
                  </div>
                )}
                {imovel.tour360Url && (
                  <div>
                    <h4 className="font-medium mb-2">Tour Virtual</h4>
                    <a 
                      href={imovel.tour360Url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Fazer tour 360°
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price and Quick Info */}
            <Card>
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-blue-600 mb-4">{imovel.valor}</div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Bed className="h-4 w-4" />
                    <span>{imovel.quartos} quartos</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Bath className="h-4 w-4" />
                    <span>{imovel.banheiros} banheiros</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Maximize className="h-4 w-4" />
                    <span>{imovel.area}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Home className="h-4 w-4" />
                    <span>{imovel.vagasGaragem} vagas</span>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Condomínio:</span>
                    <span className="font-medium">{imovel.valorCondominio}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>IPTU:</span>
                    <span className="font-medium">{imovel.valorIptu}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Localização
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{imovel.endereco}</p>
              </CardContent>
            </Card>

            {/* Property Info */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Informações do Imóvel
                </h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Tipo:</span>
                  <span className="font-medium">{imovel.tipo}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Finalidade:</span>
                  <span className="font-medium">{imovel.finalidade}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Situação:</span>
                  <span className="font-medium">{imovel.situacao}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Área Total:</span>
                  <span className="font-medium">{imovel.areaTotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Data do Cadastro:</span>
                  <span className="font-medium">{imovel.dataCadastro}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Captador:</span>
                  <span className="font-medium">{imovel.captador}</span>
                </div>
              </CardContent>
            </Card>

            {/* Authorizations */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Autorizações
                </h3>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${imovel.autorizacaoVenda ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="text-sm">Venda</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${imovel.autorizacaoLocacao ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="text-sm">Locação</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${imovel.contratoExclusividade ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="text-sm">Contrato de Exclusividade</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Formas de Pagamento
                </h3>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {imovel.formasPagamento.map((forma, index) => (
                    <Badge key={index} variant="outline">
                      {forma}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Owner Contact */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Proprietário
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{imovel.proprietario.nome}</p>
                  {showContactInfo && (
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{imovel.proprietario.telefone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span>{imovel.proprietario.email}</span>
                      </div>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowContactInfo(!showContactInfo)}
                    className="w-full"
                  >
                    {showContactInfo ? 'Ocultar' : 'Ver'} Contato
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Internal Notes */}
            {imovel.observacoesInternas && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Observações Internas
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded border border-yellow-200">
                    {imovel.observacoesInternas}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      </div>

      {/* Modal QR Code */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  Visualizar QR Code
                </h2>
                <Button variant="ghost" onClick={() => setShowQRModal(false)}>
                  ×
                </Button>
              </div>
            </div>

            <div className="p-6 text-center">
              <div className="w-64 h-64 mx-auto bg-white rounded-lg border-2 border-gray-200 flex items-center justify-center mb-4">
                <img
                  src={selectedQRCode}
                  alt="QR Code do Imóvel"
                  className="w-64 h-64"
                />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                QR Code para acesso rápido ao imóvel
              </p>
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={handleDownloadQR}
              >
                <Download className="h-4 w-4" />
                Baixar QR Code
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
