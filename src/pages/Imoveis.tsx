import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Plus,
  Search,
  Filter,
  MapPin,
  Bed,
  Bath,
  Maximize,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Home,
  X,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  Star,
  Camera,
  Video,
  Phone,
  Mail,
  Share2,
  Heart,
  BarChart3,
  Building,
  Key,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Grid3x3,
  List,
  ArrowUpDown,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ConfirmDeleteModal } from '@/components/modals/ConfirmDeleteModal';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';

const imoveis = [
  {
    id: '1',
    titulo: 'Apartamento 2 Quartos - Centro',
    tipo: 'Apartamento',
    endereco: 'Rua das Flores, 123 - Centro, São Paulo',
    valor: 'R$ 350.000',
    valorAluguel: 'R$ 1.800',
    quartos: 2,
    banheiros: 1,
    vagas: 1,
    area: '65m²',
    areaUtil: '58m²',
    status: 'Disponível',
    finalidade: 'Venda e Aluguel',
    anoConstrucao: 2015,
    andar: 3,
    totalAndares: 8,
    condominio: 'R$ 320',
    iptu: 'R$ 85',
    imagem: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
    imagens: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
    ],
    proprietario: 'João Silva',
    corretorResponsavel: 'Maria Santos',
    dataCadastro: '15/01/2025',
    visualizacoes: 245,
    contatos: 18,
    favoritos: 12,
    destaque: true,
    caracteristicas: ['Sacada', 'Armários embutidos', 'Portaria 24h', 'Elevador'],
    proximidades: ['Metro 500m', 'Supermercado 100m', 'Escola 200m', 'Hospital 800m'],
    descricao: 'Excelente apartamento no centro de São Paulo, próximo a comércio e transporte público.',
  },
  {
    id: '2',
    titulo: 'Casa 3 Quartos - Jardim América',
    tipo: 'Casa',
    endereco: 'Av. Brasil, 456 - Jardim América, Santos',
    valor: 'R$ 580.000',
    valorAluguel: 'R$ 2.500',
    quartos: 3,
    banheiros: 2,
    vagas: 2,
    area: '120m²',
    areaUtil: '110m²',
    areaTerreno: '250m²',
    status: 'Disponível',
    finalidade: 'Venda',
    anoConstrucao: 2010,
    condominio: 'N/A',
    iptu: 'R$ 180',
    imagem: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop',
    imagens: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
    ],
    proprietario: 'Carlos Oliveira',
    corretorResponsavel: 'Pedro Santos',
    dataCadastro: '10/01/2025',
    visualizacoes: 189,
    contatos: 14,
    favoritos: 8,
    destaque: false,
    caracteristicas: ['Piscina', 'Jardim', 'Garagem coberta', 'Churrasqueira'],
    proximidades: ['Praia 1km', 'Shopping 2km', 'Escola 500m', 'Hospital 1,5km'],
    descricao: 'Casa espaçosa em bairro nobre, perfeita para famílias.',
  },
  {
    id: '3',
    titulo: 'Cobertura Duplex - Beira Mar',
    tipo: 'Cobertura',
    endereco: 'Av. Atlântica, 789 - Beira Mar, Guarujá',
    valor: 'R$ 1.200.000',
    quartos: 4,
    banheiros: 3,
    area: '200m²',
    status: 'Reservado',
    imagem: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
  },
  {
    id: '4',
    titulo: 'Apartamento 3 Quartos - Vila Mariana',
    tipo: 'Apartamento',
    endereco: 'Rua Domingos de Morais, 321 - Vila Mariana, São Paulo',
    valor: 'R$ 450.000',
    quartos: 3,
    banheiros: 2,
    area: '85m²',
    status: 'Disponível',
    imagem: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
  },
  {
    id: '5',
    titulo: 'Casa em Condomínio - Alphaville',
    tipo: 'Casa',
    endereco: 'Rua das Acácias, 100 - Alphaville, Barueri',
    valor: 'R$ 720.000',
    quartos: 3,
    banheiros: 3,
    area: '180m²',
    status: 'Vendido',
    imagem: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
  },
  {
    id: '6',
    titulo: 'Apartamento 4 Quartos - Morumbi',
    tipo: 'Apartamento',
    endereco: 'Av. Giovanni Gronchi, 555 - Morumbi, São Paulo',
    valor: 'R$ 650.000',
    quartos: 4,
    banheiros: 2,
    area: '110m²',
    status: 'Disponível',
    imagem: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
  },
];

export function Imoveis() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [imovelToDelete, setImovelToDelete] = useState<any>(null);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    tipo: '',
    status: '',
    quartos: '',
    banheiros: '',
    valorMin: '',
    valorMax: ''
  });

  const handleEdit = (imovel: any) => {
    navigate(`/imoveis/editar/${imovel.id}`);
  };

  const handleDelete = (imovel: any) => {
    setImovelToDelete(imovel);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    // In a real app, this would call an API to delete the imovel
    console.log('Deleting imovel:', imovelToDelete);
    setDeleteModalOpen(false);
    setImovelToDelete(null);
    // Here you would also update the imoveis array to remove the deleted item
  };

  const handleViewDetails = (imovel: any) => {
    navigate(`/imoveis/detalhes/${imovel.id}`);
  };


  const handleOpenLink = (imovelId: string) => {
    const url = `https://seusite.com/imovel/${imovelId}`;
    window.open(url, '_blank');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const filteredImoveis = imoveis.filter((imovel) => {
    // Filtro de busca
    const matchesSearch = searchTerm === '' || 
      imovel.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      imovel.endereco.toLowerCase().includes(searchTerm.toLowerCase()) ||
      imovel.tipo.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtros específicos
    const matchesTipo = filters.tipo === '' || imovel.tipo === filters.tipo;
    const matchesStatus = filters.status === '' || imovel.status === filters.status;
    const matchesQuartos = filters.quartos === '' || imovel.quartos === parseInt(filters.quartos);
    const matchesBanheiros = filters.banheiros === '' || imovel.banheiros === parseInt(filters.banheiros);
    
    // Filtro de valor
    let matchesValor = true;
    if (filters.valorMin || filters.valorMax) {
      const valorNumerico = parseInt(imovel.valor.replace(/[^0-9]/g, ''));
      if (filters.valorMin) {
        matchesValor = valorNumerico >= parseInt(filters.valorMin.replace(/[^0-9]/g, ''));
      }
      if (filters.valorMax) {
        matchesValor = matchesValor && valorNumerico <= parseInt(filters.valorMax.replace(/[^0-9]/g, ''));
      }
    }
    
    return matchesSearch && matchesTipo && matchesStatus && matchesQuartos && matchesBanheiros && matchesValor;
  });

  const handleClearFilters = () => {
    setFilters({
      tipo: '',
      status: '',
      quartos: '',
      banheiros: '',
      valorMin: '',
      valorMax: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponível':
        return 'border-success text-success';
      case 'Reservado':
        return 'border-warning text-warning';
      case 'Vendido':
        return 'border-muted-foreground text-muted-foreground';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Imóveis</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Imóveis</h1>
          <p className="text-muted-foreground">Gerencie seu portfólio de imóveis</p>
        </div>
        <Button className="gap-2" onClick={() => navigate('/imoveis/cadastrar')}>
          <Plus className="h-4 w-4" />
          Cadastrar Imóvel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título, endereço ou tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2" onClick={() => setFilterModalOpen(true)}>
              <Filter className="h-4 w-4" />
              Filtros
              {hasActiveFilters && (
                <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                  {Object.values(filters).filter(value => value !== '').length}
                </span>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImoveis.map((imovel, index) => (
              <Card
                key={imovel.id}
                className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md hover:-translate-y-1"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => handleViewDetails(imovel)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={imovel.imagem}
                    alt={imovel.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge variant="outline" className={`bg-background/90 backdrop-blur-sm ${getStatusColor(imovel.status)}`}>
                      {imovel.status}
                    </Badge>
                  </div>
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm">
                      {imovel.tipo}
                    </Badge>
                  </div>
                  {/* Overlay gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors duration-200">
                      {imovel.titulo}
                    </h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-muted"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleViewDetails(imovel); }} className="gap-2">
                          <Eye className="h-4 w-4" />
                          Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEdit(imovel); }} className="gap-2">
                          <Edit className="h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive gap-2" onClick={(e) => { e.stopPropagation(); handleDelete(imovel); }}>
                          <Trash2 className="h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="flex items-start gap-2 text-sm text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5 text-primary" />
                    <span className="line-clamp-2">{imovel.endereco}</span>
                  </div>
                  
                  <div className="text-2xl font-bold text-primary mb-4">{imovel.valor}</div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-muted/50 rounded-lg border border-border/50">
                      <Bed className="h-3.5 w-3.5 text-primary" />
                      <span className="font-medium text-foreground">{imovel.quartos}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-muted/50 rounded-lg border border-border/50">
                      <Bath className="h-3.5 w-3.5 text-primary" />
                      <span className="font-medium text-foreground">{imovel.banheiros}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-muted/50 rounded-lg border border-border/50">
                      <Maximize className="h-3.5 w-3.5 text-primary" />
                      <span className="font-medium text-foreground">{imovel.area}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <ConfirmDeleteModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setImovelToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Excluir Imóvel"
        description={`Tem certeza que deseja excluir o imóvel "${imovelToDelete?.titulo || ''}"? Esta ação não pode ser desfeita.`}
      />

      {/* Modal de Filtros */}
      <Dialog open={filterModalOpen} onOpenChange={setFilterModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros de Imóveis
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tipo">Tipo</Label>
                <Select value={filters.tipo} onValueChange={(value) => setFilters({...filters, tipo: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="Apartamento">Apartamento</SelectItem>
                    <SelectItem value="Casa">Casa</SelectItem>
                    <SelectItem value="Cobertura">Cobertura</SelectItem>
                    <SelectItem value="Studio">Studio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="Disponível">Disponível</SelectItem>
                    <SelectItem value="Reservado">Reservado</SelectItem>
                    <SelectItem value="Vendido">Vendido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quartos">Quartos</Label>
                <Select value={filters.quartos} onValueChange={(value) => setFilters({...filters, quartos: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Qualquer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Qualquer</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="banheiros">Banheiros</Label>
                <Select value={filters.banheiros} onValueChange={(value) => setFilters({...filters, banheiros: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Qualquer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Qualquer</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="valorMin">Valor Mínimo</Label>
                <Input
                  id="valorMin"
                  placeholder="R$ 0"
                  value={filters.valorMin}
                  onChange={(e) => setFilters({...filters, valorMin: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="valorMax">Valor Máximo</Label>
                <Input
                  id="valorMax"
                  placeholder="R$ 0"
                  value={filters.valorMax}
                  onChange={(e) => setFilters({...filters, valorMax: e.target.value})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleClearFilters} className="gap-2">
              <X className="h-4 w-4" />
              Limpar Filtros
            </Button>
            <Button onClick={() => setFilterModalOpen(false)}>
              Aplicar Filtros
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
