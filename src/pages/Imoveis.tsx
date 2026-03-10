import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Plus, Search, MapPin, Bed, Bath, Maximize, MoreVertical, Edit, Trash2, Eye,
  Home, Grid, List as ListIcon, SlidersHorizontal, X, Building, Car,
  TrendingUp, DollarSign, CheckCircle, Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ImovelDetailsDrawer } from '@/components/modals/ImovelDetailsDrawer';

// ─── Data ───────────────────────────────────────────────────────────
const imoveisData = [
  {
    id: '1',
    titulo: 'Apartamento 2 Quartos - Centro',
    tipo: 'Apartamento',
    endereco: 'Rua das Flores, 123 - Centro, São Paulo',
    valor: 'R$ 350.000',
    valorAluguel: 'R$ 1.800',
    quartos: 2, banheiros: 1, vagas: 1, area: '65m²',
    status: 'Disponível', finalidade: 'Venda e Aluguel',
    proprietario: 'João Silva', corretorResponsavel: 'Maria Santos',
    dataCadastro: '15/01/2025', visualizacoes: 245, contatos: 18, favoritos: 12,
    destaque: true,
    caracteristicas: ['Sacada', 'Armários embutidos', 'Portaria 24h', 'Elevador'],
    descricao: 'Excelente apartamento no centro de São Paulo, próximo a comércio e transporte público.',
    imagem: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
    condominio: 'R$ 320', iptu: 'R$ 85',
  },
  {
    id: '2',
    titulo: 'Casa 3 Quartos - Jardim América',
    tipo: 'Casa',
    endereco: 'Av. Brasil, 456 - Jardim América, Santos',
    valor: 'R$ 580.000',
    valorAluguel: 'R$ 2.500',
    quartos: 3, banheiros: 2, vagas: 2, area: '120m²',
    status: 'Disponível', finalidade: 'Venda',
    proprietario: 'Carlos Oliveira', corretorResponsavel: 'Pedro Santos',
    dataCadastro: '10/01/2025', visualizacoes: 189, contatos: 14, favoritos: 8,
    destaque: false,
    caracteristicas: ['Piscina', 'Jardim', 'Garagem coberta', 'Churrasqueira'],
    descricao: 'Casa espaçosa em bairro nobre, perfeita para famílias.',
    imagem: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop',
    condominio: 'N/A', iptu: 'R$ 180',
  },
  {
    id: '3',
    titulo: 'Cobertura Duplex - Beira Mar',
    tipo: 'Cobertura',
    endereco: 'Av. Atlântica, 789 - Beira Mar, Guarujá',
    valor: 'R$ 1.200.000',
    quartos: 4, banheiros: 3, vagas: 3, area: '200m²',
    status: 'Reservado', finalidade: 'Venda',
    proprietario: 'Fernando Lima', corretorResponsavel: 'Ana Rocha',
    dataCadastro: '05/01/2025', visualizacoes: 412, contatos: 32, favoritos: 27,
    imagem: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop',
    condominio: 'R$ 1.200', iptu: 'R$ 450',
  },
  {
    id: '4',
    titulo: 'Apartamento 3 Quartos - Vila Mariana',
    tipo: 'Apartamento',
    endereco: 'Rua Domingos de Morais, 321 - Vila Mariana, São Paulo',
    valor: 'R$ 450.000',
    quartos: 3, banheiros: 2, vagas: 1, area: '85m²',
    status: 'Disponível', finalidade: 'Venda e Aluguel',
    proprietario: 'Roberto Alves', corretorResponsavel: 'Maria Santos',
    dataCadastro: '08/01/2025', visualizacoes: 156, contatos: 9, favoritos: 5,
    imagem: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop',
    condominio: 'R$ 480', iptu: 'R$ 120',
  },
  {
    id: '5',
    titulo: 'Casa em Condomínio - Alphaville',
    tipo: 'Casa',
    endereco: 'Rua das Acácias, 100 - Alphaville, Barueri',
    valor: 'R$ 720.000',
    quartos: 3, banheiros: 3, vagas: 2, area: '180m²',
    status: 'Vendido', finalidade: 'Venda',
    proprietario: 'Patricia Nunes', corretorResponsavel: 'Pedro Santos',
    dataCadastro: '02/01/2025', visualizacoes: 320, contatos: 28, favoritos: 19,
    imagem: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop',
    condominio: 'R$ 900', iptu: 'R$ 210',
  },
  {
    id: '6',
    titulo: 'Apartamento 4 Quartos - Morumbi',
    tipo: 'Apartamento',
    endereco: 'Av. Giovanni Gronchi, 555 - Morumbi, São Paulo',
    valor: 'R$ 650.000',
    quartos: 4, banheiros: 2, vagas: 2, area: '110m²',
    status: 'Disponível', finalidade: 'Venda',
    proprietario: 'Marcos Ferreira', corretorResponsavel: 'Ana Rocha',
    dataCadastro: '12/01/2025', visualizacoes: 201, contatos: 16, favoritos: 11,
    imagem: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop',
    condominio: 'R$ 650', iptu: 'R$ 175',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────
const statusBadge: Record<string, string> = {
  'Disponível': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  'Reservado': 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  'Vendido': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  'Alugado': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
};

const TIPO_FILTERS = ['Todos', 'Apartamento', 'Casa', 'Cobertura', 'Studio', 'Comercial'];
const STATUS_FILTERS = ['Todos', 'Disponível', 'Reservado', 'Vendido', 'Alugado'];

interface Filters {
  tipo: string; status: string; quartos: string;
  banheiros: string; valorMin: string; valorMax: string;
}
const defaultFilters: Filters = { tipo: '', status: '', quartos: '', banheiros: '', valorMin: '', valorMax: '' };

// ─── Component ────────────────────────────────────────────────────────
export function Imoveis() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [imoveis, setImoveis] = useState<any[]>(imoveisData);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [tipoFilter, setTipoFilter] = useState('Todos');
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedImovel, setSelectedImovel] = useState<any>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [imovelToDelete, setImovelToDelete] = useState<any>(null);


  // ── Handlers
  const openSheet = (i: any) => {
    setSelectedImovel(i);
    setSheetOpen(true);
  };

  const handleDelete = (i: any) => { setImovelToDelete(i); setDeleteOpen(true); };
  const confirmDelete = () => {
    setImoveis(prev => prev.filter(i => i.id !== imovelToDelete?.id));
    toast({ title: 'Imóvel excluído', description: `${imovelToDelete?.titulo} foi removido.`, variant: 'success' });
    setDeleteOpen(false); setImovelToDelete(null);
  };



  const clearAdvanced = () => setFilters(defaultFilters);
  const hasActive = Object.values(filters).some(v => v !== '');

  // ── Filtering (fully defensive — never crashes on undefined fields)
  const filteredImoveis = imoveis.filter(i => {
    try {
      const q = searchTerm.toLowerCase();
      const matchSearch = !q ||
        (i.titulo ?? '').toLowerCase().includes(q) ||
        (i.endereco ?? '').toLowerCase().includes(q) ||
        (i.tipo ?? '').toLowerCase().includes(q);
      const matchTipo = tipoFilter === 'Todos' || i.tipo === tipoFilter;
      const matchAdvTipo = !filters.tipo || i.tipo === filters.tipo;
      const matchStatus = !filters.status || i.status === filters.status;
      const matchQ = !filters.quartos || (i.quartos ?? 0) >= parseInt(filters.quartos);
      const matchB = !filters.banheiros || (i.banheiros ?? 0) >= parseInt(filters.banheiros);
      let matchVal = true;
      if (filters.valorMin || filters.valorMax) {
        const rawVal = (i.valor ?? '').replace(/[^0-9]/g, '');
        const v = rawVal ? parseInt(rawVal) : 0;
        if (filters.valorMin) {
          const min = parseInt((filters.valorMin).replace(/[^0-9]/g, '') || '0');
          matchVal = v >= min;
        }
        if (filters.valorMax) {
          const max = parseInt((filters.valorMax).replace(/[^0-9]/g, '') || '9999999999');
          matchVal = matchVal && v <= max;
        }
      }
      return matchSearch && matchTipo && matchAdvTipo && matchStatus && matchQ && matchB && matchVal;
    } catch {
      return true; // never hide an item due to a filter crash
    }
  });


  // ── KPIs
  const total = imoveis.length;
  const disponiveis = imoveis.filter(i => i.status === 'Disponível').length;
  const reservados = imoveis.filter(i => i.status === 'Reservado').length;
  const vendidos = imoveis.filter(i => i.status === 'Vendido').length;

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="flex items-center gap-1">
              <Home className="h-4 w-4" /> Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Imóveis</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20">
            <Building className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Imóveis</h1>
            <p className="text-slate-500 mt-1 font-medium">Gerencie seu portfólio de imóveis</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-muted/50 rounded-xl p-1 border border-border/50">
            <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="sm" className="h-9 w-9 p-0 rounded-lg" onClick={() => setViewMode('grid')}>
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === 'table' ? 'secondary' : 'ghost'} size="sm" className="h-9 w-9 p-0 rounded-lg" onClick={() => setViewMode('table')}>
              <ListIcon className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={() => navigate('/imoveis/cadastrar')} className="bg-primary hover:bg-primary/90 text-white font-black px-8 shadow-lg shadow-primary/20 h-12 rounded-2xl">
            <Plus className="h-4 w-4 mr-2" /> Novo Imóvel
          </Button>
        </div>
      </div>

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', val: total, icon: Building, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Disponíveis', val: disponiveis, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
          { label: 'Reservados', val: reservados, icon: Tag, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/40' },
          { label: 'Vendidos', val: vendidos, icon: TrendingUp, color: 'text-slate-600', bg: 'bg-slate-100 dark:bg-slate-800/60' },
        ].map(({ label, val, icon: Icon, color, bg }) => (
          <Card key={label} className="border-none shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center shrink-0', bg)}>
                <Icon className={cn('h-5 w-5', color)} />
              </div>
              <div>
                <p className="text-2xl font-black leading-none">{val}</p>
                <p className="text-xs text-muted-foreground font-semibold mt-0.5">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Search + Filters ── */}
      <Card className="border-none shadow-sm bg-muted/30">
        <CardContent className="p-3 sm:p-4 space-y-3">
          {/* Row 1 — Search + Popover button */}
          <div className="flex gap-2">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Buscar por título, endereço ou tipo..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 bg-background border-none shadow-sm h-9"
              />
            </div>

            <Popover open={filterOpen} onOpenChange={setFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className={cn('gap-2 h-9 px-3 text-xs font-semibold shrink-0 relative', hasActive && 'border-primary/50 text-primary bg-primary/5')}>
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Filtros</span>
                  {hasActive && (
                    <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[9px] font-black flex items-center justify-center">
                      {Object.values(filters).filter(v => v !== '').length}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-black">Filtros Avançados</p>
                  {hasActive && (
                    <button onClick={clearAdvanced} className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors">
                      <X className="h-3 w-3" /> Limpar
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5 col-span-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</Label>
                    <div className="flex flex-wrap gap-1.5">
                      {STATUS_FILTERS.map(s => (
                        <button key={s} onClick={() => setFilters(f => ({ ...f, status: s === 'Todos' ? '' : s }))}
                          className={cn('px-2.5 py-1 rounded-md text-xs font-semibold border transition-all',
                            (s === 'Todos' ? !filters.status : filters.status === s)
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-background border-border hover:border-primary/40')}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Quartos (mín.)</Label>
                    <Select value={filters.quartos} onValueChange={v => setFilters(f => ({ ...f, quartos: v }))}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Qualquer" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Qualquer</SelectItem>
                        {['1', '2', '3', '4'].map(v => <SelectItem key={v} value={v}>{v}+</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Banheiros (mín.)</Label>
                    <Select value={filters.banheiros} onValueChange={v => setFilters(f => ({ ...f, banheiros: v }))}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Qualquer" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Qualquer</SelectItem>
                        {['1', '2', '3'].map(v => <SelectItem key={v} value={v}>{v}+</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Valor mín.</Label>
                    <Input placeholder="R$ 0" value={filters.valorMin} onChange={e => setFilters(f => ({ ...f, valorMin: e.target.value }))} className="h-8 text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Valor máx.</Label>
                    <Input placeholder="R$ ∞" value={filters.valorMax} onChange={e => setFilters(f => ({ ...f, valorMax: e.target.value }))} className="h-8 text-xs" />
                  </div>
                </div>
                <Button size="sm" className="w-full" onClick={() => setFilterOpen(false)}>
                  Ver {filteredImoveis.length} resultado{filteredImoveis.length !== 1 ? 's' : ''}
                </Button>
              </PopoverContent>
            </Popover>
          </div>

          {/* Row 2 — Tipo quick chips (horizontal scroll, no wrap) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {TIPO_FILTERS.map(t => (
              <button
                key={t}
                onClick={() => setTipoFilter(t)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wide transition-all border shrink-0',
                  tipoFilter === t
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
                )}
              >
                {t}
              </button>
            ))}
            {hasActive && (
              <button onClick={clearAdvanced} className="shrink-0 ml-2 text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors whitespace-nowrap">
                <X className="h-3 w-3" /> Limpar filtros
              </button>
            )}
          </div>

          {filteredImoveis.length < imoveis.length && (
            <p className="text-xs text-muted-foreground">
              Mostrando <span className="font-bold text-foreground">{filteredImoveis.length}</span> de {imoveis.length} imóveis
            </p>
          )}
        </CardContent>
      </Card>

      {/* ── Content ── */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div key="grid" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            {filteredImoveis.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                {filteredImoveis.map(imovel => (
                  <Card
                    key={imovel.id}
                    className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-border/50 shadow-none hover:-translate-y-1 relative"
                    onClick={() => openSheet(imovel)}
                  >
                    {/* Image */}
                    <div className="relative h-48 sm:h-52 overflow-hidden">
                      {imovel.imagem ? (
                        <img
                          src={imovel.imagem}
                          alt={imovel.titulo}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Home className="h-12 w-12 text-muted-foreground/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                      {/* Status badge */}
                      <div className="absolute top-3 right-3">
                        <span className={cn('inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold shadow-sm backdrop-blur-sm', statusBadge[imovel.status] ?? statusBadge['Disponível'])}>
                          {imovel.status}
                        </span>
                      </div>

                      {/* Tipo badge */}
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/90 dark:bg-black/60 backdrop-blur-sm text-[10px] font-bold text-foreground shadow-sm">
                          <Building className="h-2.5 w-2.5" /> {imovel.tipo}
                        </span>
                      </div>

                      {/* Price */}
                      <div className="absolute bottom-3 left-4">
                        <div className="text-white font-black text-xl drop-shadow">{imovel.valor}</div>
                        {imovel.valorAluguel && (
                          <div className="text-white/75 text-[11px] font-semibold">{imovel.valorAluguel}/mês</div>
                        )}
                      </div>

                      {/* Dropdown */}
                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white border-none" onClick={e => e.stopPropagation()}>
                              <MoreVertical className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openSheet(imovel); }} className="gap-2"><Eye className="h-4 w-4" /> Ver detalhes</DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/imoveis/editar/${imovel.id}`); }} className="gap-2"><Edit className="h-4 w-4" /> Editar</DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDelete(imovel); }} className="text-destructive gap-2"><Trash2 className="h-4 w-4" /> Excluir</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-black text-base tracking-tight group-hover:text-primary transition-colors line-clamp-1 mb-1">
                        {imovel.titulo}
                      </h3>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground font-medium mb-4 line-clamp-1">
                        <MapPin className="h-3 w-3 shrink-0 text-primary/60" />
                        {imovel.endereco.split(',').slice(1).join(',').trim() || imovel.endereco}
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 border-t border-border/40 pt-3">
                        {[
                          { icon: Bed, val: imovel.quartos ?? '—', label: 'Quartos' },
                          { icon: Bath, val: imovel.banheiros ?? '—', label: 'Banheiros' },
                          { icon: Maximize, val: imovel.area ?? '—', label: 'Área' },
                        ].map(({ icon: Icon, val, label }) => (
                          <div key={label} className="flex flex-col items-center gap-0.5">
                            <Icon className="h-3.5 w-3.5 text-primary/50" />
                            <span className="text-xs font-black">{val}</span>
                            <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          /* ── TABLE VIEW ── */
          <motion.div key="table" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            {filteredImoveis.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-bold pl-5 min-w-[220px]">Imóvel</TableHead>
                      <TableHead className="font-bold hidden sm:table-cell">Tipo</TableHead>
                      <TableHead className="font-bold hidden md:table-cell">Detalhes</TableHead>
                      <TableHead className="font-bold">Valor</TableHead>
                      <TableHead className="font-bold">Status</TableHead>
                      <TableHead className="w-[50px]" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredImoveis.map(imovel => (
                      <TableRow key={imovel.id} className="group cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => openSheet(imovel)}>
                        <TableCell className="pl-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-16 rounded-lg overflow-hidden shrink-0 shadow-sm">
                              {imovel.imagem ? (
                                <img src={imovel.imagem} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                  <Home className="h-5 w-5 text-muted-foreground/30" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-sm group-hover:text-primary transition-colors truncate">{imovel.titulo}</div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5 truncate">
                                <MapPin className="h-2.5 w-2.5 shrink-0" /> {imovel.endereco.split('-')[0]?.trim()}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/8 text-primary text-xs font-semibold border border-primary/15">
                            <Building className="h-3 w-3" /> {imovel.tipo}
                          </span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                            {imovel.quartos !== undefined && <span className="flex items-center gap-1"><Bed className="h-3 w-3 text-primary/50" />{imovel.quartos}</span>}
                            {imovel.banheiros !== undefined && <span className="flex items-center gap-1"><Bath className="h-3 w-3 text-primary/50" />{imovel.banheiros}</span>}
                            {imovel.area && <span className="flex items-center gap-1"><Maximize className="h-3 w-3 text-primary/50" />{imovel.area}</span>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-black text-sm text-primary">{imovel.valor}</div>
                          {imovel.valorAluguel && <div className="text-[10px] text-muted-foreground font-medium">{imovel.valorAluguel}/mês</div>}
                        </TableCell>
                        <TableCell>
                          <span className={cn('inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold', statusBadge[imovel.status] ?? statusBadge['Disponível'])}>
                            {imovel.status}
                          </span>
                        </TableCell>
                        <TableCell className="pr-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openSheet(imovel); }} className="gap-2"><Eye className="h-4 w-4" /> Ver detalhes</DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/imoveis/editar/${imovel.id}`); }} className="gap-2"><Edit className="h-4 w-4" /> Editar</DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDelete(imovel); }} className="text-destructive gap-2"><Trash2 className="h-4 w-4" /> Excluir</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete Confirm ── */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Excluir imóvel</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir <strong>"{imovelToDelete?.titulo}"</strong>? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 flex-col sm:flex-row">
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => setDeleteOpen(false)}>Cancelar</Button>
            <Button variant="destructive" className="w-full sm:w-auto gap-2" onClick={confirmDelete}>
              <Trash2 className="h-4 w-4" /> Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ImovelDetailsDrawer
        imovel={selectedImovel}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onEdit={() => {
          setSheetOpen(false);
          navigate(`/imoveis/editar/${selectedImovel?.id}`);
        }}
      />


    </div>
  );
}

function EmptyState() {
  const navigate = useNavigate();
  return (
    <div className="py-20 text-center border-2 border-dashed border-border/40 rounded-2xl px-4">
      <Building className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
      <p className="text-foreground font-semibold">Nenhum imóvel encontrado</p>
      <p className="text-sm text-muted-foreground mt-1">Ajuste os filtros ou cadastre um novo imóvel.</p>
      <Button className="mt-4 gap-2 shadow-lg shadow-primary/20" onClick={() => navigate('/imoveis/cadastrar')}>
        <Plus className="h-4 w-4" /> Novo Imóvel
      </Button>
    </div>
  );
}
