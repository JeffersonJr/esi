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
  QrCode,
  Share2,
  Heart,
  MessageCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
        return 'bg-success/10 text-success border-success/20';
      case 'Reservado':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'Vendido':
        return 'bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20';
      default:
        return 'bg-secondary/10 text-secondary border-secondary/20';
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

      <div className="min-h-screen bg-[#F8FAFC]">
        {/* Breadcrumb */}
        <div className="px-6 pt-4 max-w-[1400px] mx-auto no-print">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="flex items-center gap-1">
                  <Home className="h-4 w-4" /> Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/imoveis">Imóveis</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{imovel.titulo}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header */}
        <div className="bg-white border-b border-border/40 px-6 py-6 sticky top-0 z-50 backdrop-blur-md bg-white/80 no-print">
          <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/imoveis')}
                className="h-10 w-10 rounded-full hover:bg-slate-100 shrink-0"
              >
                <ArrowLeft className="h-5 w-5 hover:-translate-x-1 transition-transform" />
              </Button>
              <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
                <Building className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight truncate">{imovel.titulo}</h1>
                  <Badge variant="outline" className={cn("font-bold text-[10px] uppercase border-none shrink-0", getStatusColor(imovel.status))}>
                    {imovel.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">REF: {imovel.codigo}</span>
                  <span className="text-[10px] text-slate-300">|</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{imovel.tipo}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={handleEdit}
                className="h-12 px-6 rounded-2xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 transition-all text-xs uppercase"
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <Button
                variant="outline"
                onClick={handlePrint}
                className="h-12 px-6 rounded-2xl font-bold bg-white border-slate-200 text-slate-700 shadow-sm hover:bg-slate-50 transition-all text-xs uppercase"
              >
                <Printer className="h-4 w-4 mr-2" />
                Imprimir Ficha
              </Button>
              <div className="h-8 w-[1px] bg-slate-100 mx-1 hidden md:block" />
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto p-6 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-8">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="relative group">
                  <motion.div
                    layoutId="activeImage"
                    className="aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-2xl shadow-2xl bg-muted"
                  >
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentImageIndex}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.5 }}
                        src={imovel.imagens[currentImageIndex]}
                        alt={imovel.titulo}
                        className="w-full h-full object-cover"
                      />
                    </AnimatePresence>
                  </motion.div>

                  {/* Image Navigation */}
                  {imovel.imagens.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={(e) => { e.stopPropagation(); handlePreviousImage(); }}
                        className="h-12 w-12 rounded-full bg-white/90 backdrop-blur-md border-none shadow-xl hover:bg-white"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                        className="h-12 w-12 rounded-full bg-white/90 backdrop-blur-md border-none shadow-xl hover:bg-white"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                    </div>
                  )}

                  <div className="absolute bottom-6 left-6 flex gap-2">
                    <Badge className="bg-black/40 backdrop-blur-md text-white border-none px-3 py-1 font-bold text-xs uppercase">
                      {currentImageIndex + 1} / {imovel.imagens.length} Fotos
                    </Badge>
                    {imovel.videoUrl && (
                      <Badge className="bg-primary/90 text-primary-foreground border-none px-3 py-1 font-bold text-xs uppercase cursor-pointer hover:bg-primary">
                        Vídeo
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Thumbnail Gallery */}
                {imovel.imagens.length > 1 && (
                  <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
                    {imovel.imagens.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={cn(
                          "relative flex-shrink-0 w-32 aspect-video rounded-xl overflow-hidden transition-all duration-300",
                          index === currentImageIndex
                            ? 'ring-2 ring-primary ring-offset-2 scale-95 opacity-100'
                            : 'opacity-50 hover:opacity-80 grayscale hover:grayscale-0'
                        )}
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-border/40 flex items-center gap-4 group hover:border-primary/20 transition-colors">
                  <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Bed className="h-6 w-6 text-primary/60" />
                  </div>
                  <div>
                    <div className="text-xl font-black leading-tight">{imovel.quartos}</div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Quartos ({imovel.suites} Suíte)</div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-border/40 flex items-center gap-4 group hover:border-primary/20 transition-colors">
                  <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Bath className="h-6 w-6 text-primary/60" />
                  </div>
                  <div>
                    <div className="text-xl font-black leading-tight">{imovel.banheiros}</div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Banheiros</div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-border/40 flex items-center gap-4 group hover:border-primary/20 transition-colors">
                  <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Maximize className="h-6 w-6 text-primary/60" />
                  </div>
                  <div>
                    <div className="text-xl font-black leading-tight">{imovel.area}</div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Área Privativa</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-border/40">
                <h3 className="text-lg font-black uppercase tracking-wider mb-6 flex items-center gap-3">
                  <div className="h-8 w-[2px] bg-primary" />
                  Descrição do Imóvel
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm font-medium">{imovel.descricao}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mb-4 flex items-center gap-2">
                      <Settings className="h-3 w-3" />
                      Diferenciais e Características
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {imovel.caracteristicas.map((caracteristica, index) => (
                        <Badge key={index} variant="secondary" className="bg-muted/50 text-foreground font-bold text-[10px] uppercase border-none px-3 py-1.5 hover:bg-primary/10 transition-colors">
                          {caracteristica}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mb-4 flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      Facilidades na Região
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {imovel.proximidades.map((proximidade, index) => (
                        <Badge key={index} variant="outline" className="border-border/60 text-muted-foreground font-bold text-[10px] uppercase px-3 py-1.5 hover:bg-muted transition-colors">
                          {proximidade}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Team and Responsibilities */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-border/40">
                <h3 className="text-sm font-black uppercase tracking-wider mb-6 flex items-center gap-3">
                  <div className="h-6 w-[2px] bg-primary" />
                  Equipe e Responsáveis
                </h3>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-primary/60">Captadores</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Principal:</span>
                        <span className="font-bold">{imovel.captador1 || '---'}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Auxiliar:</span>
                        <span className="font-bold">{imovel.captador2 || '---'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-primary/60">Indicadores</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Origem 1:</span>
                        <span className="font-bold">{imovel.indicador1 || '---'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-border/30 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Unidade Negocial</span>
                  <Badge variant="secondary" className="bg-primary/5 text-primary border-none font-bold text-[10px] uppercase">
                    {imovel.filialImovel}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Business Conditions Column (Right) */}
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-border/40">
                <h3 className="text-lg font-black uppercase tracking-wider mb-8 flex items-center gap-3">
                  <div className="h-8 w-[2px] bg-primary" />
                  Condições de Negócio
                </h3>

                <div className="space-y-8">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mb-4 flex items-center gap-2">
                        <CreditCard className="h-3 w-3" />
                        Pagamento e Crédito
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {imovel.formasPagamento.map((forma, index) => (
                          <Badge key={index} variant="outline" className="border-primary/20 bg-primary/5 text-primary font-bold text-[10px] uppercase px-3 py-1.5">
                            {forma}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-border/40 bg-muted/20">
                      <div className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-4">Garantias e Facilidades</div>
                      <div className="grid grid-cols-2 gap-y-3">
                        {[
                          { label: 'Aceita FGTS', active: imovel.fgts },
                          { label: 'Carta Crédito', active: imovel.cartaCredito },
                          { label: 'Financ. Bancário', active: imovel.financiamentoBancario },
                          { label: 'Minha Casa M.V.', active: imovel.minhaCasaMinhaVida },
                          { label: 'Permuta', active: imovel.permuta },
                        ].map(opt => (
                          <div key={opt.label} className="flex items-center gap-2">
                            <div className={cn("h-1.5 w-1.5 rounded-full", opt.active ? 'bg-success' : 'bg-muted-foreground/30')} />
                            <span className={cn("text-[10px] font-bold", opt.active ? 'text-foreground' : 'text-muted-foreground/40')}>{opt.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                      <h4 className="text-sm font-black uppercase tracking-wider mb-4 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        Autorizações e Exclusividade
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground">
                          <span>Contrato de Exclusividade (Venda)</span>
                          {imovel.contratoExclusividade ? <Badge className="bg-success text-success-foreground font-black text-[9px] uppercase border-none">Sim - Ativo</Badge> : <span className="opacity-40 italic">Não</span>}
                        </div>
                        {imovel.contratoExclusividade && (
                          <div className="p-3 rounded-lg bg-white/50 border border-primary/5">
                            <div className="text-[9px] font-black uppercase tracking-wider text-primary/60 mb-1">Período de Vigência</div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-foreground">
                              <Calendar className="h-3 w-3 opacity-40 text-primary" />
                              {imovel.contratoVendaPeriodo?.from} até {imovel.contratoVendaPeriodo?.to}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Marketing and SEO Sidebar */}
              <div className="bg-[#1e293b] p-8 rounded-3xl shadow-2xl relative overflow-hidden text-white">
                <div className="absolute top-0 right-0 p-8">
                  <Globe className="h-24 w-24 text-white/5 -mr-8 -mt-8 rotate-12" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-wider mb-8 flex items-center gap-3 relative z-10">
                  <div className="h-8 w-[2px] bg-primary" />
                  Marketing Digital (SEO)
                </h3>

                <div className="space-y-8 relative z-10">
                  <div className="space-y-3">
                    <div className="text-[10px] font-black uppercase tracking-widest text-primary">Status de Vitrine</div>
                    <div className="flex flex-wrap gap-4">
                      {[
                        { label: 'Home Page', active: imovel.destaquePaginaInicial },
                        { label: 'Banner Topo', active: imovel.destaqueBanner },
                        { label: 'Oportunidade', active: imovel.oportunidade },
                      ].map(tag => (
                        <div key={tag.label} className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg border border-white/10">
                          <div className={cn("h-1.5 w-1.5 rounded-full", tag.active ? "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.8)]" : "bg-white/20")} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">{tag.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-primary">SEO Title</span>
                      <p className="text-xs font-bold leading-relaxed line-clamp-2 text-white/90 italic">"{imovel.seoTitulo}"</p>
                    </div>
                    <div className="h-[1px] bg-white/5 w-full" />
                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-primary">Meta Keywords</span>
                      <p className="text-[10px] font-medium text-white/60">{imovel.seoKeywords}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Action Cards */}
              <div className="sticky top-24 space-y-8">
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-border/40 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3">
                    <TrendingUp className="h-12 w-12 text-primary/5 opacity-10 rotate-12" />
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mb-2">Valor do Investimento</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black tracking-tighter text-foreground">{imovel.valor}</span>
                    {imovel.finalidade.includes('Aluguel') && <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest italic">/mês</span>}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-border/40">
                    <div>
                      <div className="text-[9px] font-black uppercase tracking-wider text-muted-foreground mb-1">Condomínio</div>
                      <div className="text-sm font-bold text-foreground">{imovel.valorCondominio}</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-black uppercase tracking-wider text-muted-foreground mb-1">IPTU (Anual)</div>
                      <div className="text-sm font-bold text-foreground">{imovel.valorIptu}</div>
                    </div>
                  </div>

                  <div className="space-y-3 mt-10">
                    <Button className="w-full h-14 rounded-xl font-black uppercase tracking-widest text-xs gap-3 shadow-lg shadow-primary/20">
                      <MessageCircle className="h-5 w-5" />
                      Falar com Corretor
                    </Button>
                    <Button variant="outline" className="w-full h-14 rounded-xl font-black uppercase tracking-widest text-[10px] gap-3 border-none bg-muted/50 hover:bg-muted text-muted-foreground transition-all">
                      <Download className="h-4 w-4" />
                      Baixar Book Digital (PDF)
                    </Button>
                  </div>
                </div>

                {/* Proprietary Info Preview */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-border/40 group hover:border-primary/20 transition-all">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center relative">
                      <User className="h-7 w-7 text-muted-foreground" />
                      <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-success border-2 border-white" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-wider text-primary/60 mb-0.5">Proprietário</div>
                      <div className="text-base font-black tracking-tight">{imovel.proprietario.nome}</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border/20 group-hover:bg-primary/5 group-hover:border-primary/10 transition-colors">
                      <Phone className="h-4 w-4 text-primary/60" />
                      <span className="text-xs font-bold">{imovel.proprietario.telefone}</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border/20 group-hover:bg-primary/5 group-hover:border-primary/10 transition-colors">
                      <Mail className="h-4 w-4 text-primary/60" />
                      <span className="text-xs font-bold truncate max-w-[180px]">{imovel.proprietario.email}</span>
                    </div>
                  </div>
                </div>

                {/* QR Code Action Card */}
                <div className="p-6 rounded-2xl bg-muted/30 border border-dashed border-border flex flex-col items-center text-center">
                  <div className="p-4 bg-white rounded-2xl shadow-sm mb-4">
                    <img src={generateQRCode()} alt="QR" className="h-24 w-24" />
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-wider mb-1">Acesso Rápido (QR Code)</div>
                  <p className="text-[10px] font-bold text-muted-foreground mb-4 leading-normal">Escaneie para visualizar a página oficial deste imóvel</p>
                  <Button variant="link" className="text-[10px] font-black uppercase tracking-widest text-primary h-auto p-0" onClick={handleDownloadQR}>
                    Download do QR Code
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showQRModal && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
            onClick={() => setShowQRModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[32px] max-w-sm w-full shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 text-center">
                <div className="flex justify-center mb-8">
                  <div className="p-6 bg-muted/30 rounded-3xl border-2 border-dashed border-border">
                    <img src={selectedQRCode} alt="QR Code" className="h-48 w-48" />
                  </div>
                </div>
                <h2 className="text-xl font-black tracking-tight mb-2">QR Code do Imóvel</h2>
                <p className="text-xs font-bold text-muted-foreground leading-relaxed px-6 mb-8 uppercase tracking-wider">
                  Utilize este código para compartilhar ou acessar os detalhes em dispositivos móveis.
                </p>
                <div className="grid grid-cols-1 gap-3">
                  <Button onClick={handleDownloadQR} className="h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] gap-3">
                    <Download className="h-4 w-4" />
                    Baixar QR Code
                  </Button>
                  <Button variant="ghost" onClick={() => setShowQRModal(false)} className="h-12 rounded-2xl font-bold uppercase tracking-widest text-[9px] text-muted-foreground">
                    Fechar
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
