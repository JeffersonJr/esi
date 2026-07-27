import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Plus, Search, MapPin, Bed, Bath, Maximize, MoreVertical, Edit, Trash2, Eye,
  Building, Grid, List as ListIcon, X, Car, Home, HardHat, Pickaxe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

// ─── Data ───────────────────────────────────────────────────────────
const empreendimentosData = [
  {
    id: '1',
    titulo: 'Reserva das Águas',
    construtora: 'Construtora Tenda',
    endereco: 'Rua das Orquídeas, 100 - Centro, São Paulo',
    valor: 'A partir de R$ 350.000',
    estagio: 'Em Obras',
    progressoObra: 65,
    unidadesTotal: 120,
    unidadesDisponiveis: 45,
    dataEntrega: 'Dez/2026',
    imagem: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop',
  },
  {
    id: '2',
    titulo: 'Vila Flora',
    construtora: 'MRV Engenharia',
    endereco: 'Av. Brasil, 456 - Jardim América, Santos',
    valor: 'A partir de R$ 280.000',
    estagio: 'Lançamento',
    progressoObra: 10,
    unidadesTotal: 200,
    unidadesDisponiveis: 150,
    dataEntrega: 'Jun/2027',
    imagem: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop',
  },
  {
    id: '3',
    titulo: 'Jardim Paulista',
    construtora: 'Cyrela',
    endereco: 'Av. Paulista, 1000 - Bela Vista, São Paulo',
    valor: 'A partir de R$ 1.200.000',
    estagio: 'Pronto',
    progressoObra: 100,
    unidadesTotal: 80,
    unidadesDisponiveis: 5,
    dataEntrega: 'Mar/2024',
    imagem: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop',
  },
  {
    id: '4',
    titulo: 'Edifício Horizonte',
    construtora: 'Gafisa',
    endereco: 'Av. Beira Mar, 200 - Guarujá',
    valor: 'A partir de R$ 850.000',
    estagio: 'Planta',
    progressoObra: 0,
    unidadesTotal: 60,
    unidadesDisponiveis: 58,
    dataEntrega: 'Dez/2028',
    imagem: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop',
  },
];

const estagioBadge: Record<string, string> = {
  'Pronto': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  'Em Obras': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  'Lançamento': 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  'Planta': 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
};

const ESTAGIO_FILTERS = ['Todos', 'Planta', 'Lançamento', 'Em Obras', 'Pronto'];

// ─── Component ────────────────────────────────────────────────────────
export function Empreendimentos() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [empreendimentos, setEmpreendimentos] = useState<any[]>(empreendimentosData);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [estagioFilter, setEstagioFilter] = useState('Todos');

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [empreendimentoToDelete, setEmpreendimentoToDelete] = useState<any>(null);

  // ── Handlers
  const handleDelete = (e: any) => { setEmpreendimentoToDelete(e); setDeleteOpen(true); };
  const confirmDelete = () => {
    setEmpreendimentos(prev => prev.filter(i => i.id !== empreendimentoToDelete?.id));
    toast({ title: 'Empreendimento excluído', description: `${empreendimentoToDelete?.titulo} foi removido.`, variant: 'success' });
    setDeleteOpen(false); setEmpreendimentoToDelete(null);
  };

  const filteredEmpreendimentos = empreendimentos.filter(e => {
    try {
      const q = searchTerm.toLowerCase();
      const matchSearch = !q ||
        (e.titulo ?? '').toLowerCase().includes(q) ||
        (e.endereco ?? '').toLowerCase().includes(q) ||
        (e.construtora ?? '').toLowerCase().includes(q);
      const matchEstagio = estagioFilter === 'Todos' || e.estagio === estagioFilter;
      return matchSearch && matchEstagio;
    } catch {
      return true;
    }
  });

  const total = empreendimentos.length;
  const emObras = empreendimentos.filter(e => e.estagio === 'Em Obras').length;
  const prontos = empreendimentos.filter(e => e.estagio === 'Pronto').length;

  return (
    <div className="space-y-5 animate-fade-in pb-20">
      <PageHeader
        title="Empreendimentos"
        subtitle="Gestão de lançamentos e obras"
        icon={<Building />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Empreendimentos' }
        ]}
        actions={
          <>
            <div className="flex items-center bg-muted/50 rounded-xl p-1 border border-border/50">
              <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="sm" className="h-9 w-9 p-0 rounded-lg" onClick={() => setViewMode('grid')}>
                <Grid className="h-4 w-4" />
              </Button>
              <Button variant={viewMode === 'table' ? 'secondary' : 'ghost'} size="sm" className="h-9 w-9 p-0 rounded-lg" onClick={() => setViewMode('table')}>
                <ListIcon className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={() => navigate('/empreendimentos/cadastrar')} className="h-10 px-4 rounded-xl shadow-lg shadow-primary/20 gap-2 font-bold">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Novo Empreendimento</span>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Cadastrados', value: total, icon: Building, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Em Obras', value: emObras, icon: HardHat, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Prontos', value: prontos, icon: Home, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Lançamentos', value: empreendimentos.filter(e => e.estagio === 'Lançamento').length, icon: Pickaxe, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        ].map((kpi, idx) => (
          <Card key={idx} className="border-none shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", kpi.bg)}>
                <kpi.icon className={cn('h-5 w-5', kpi.color)} />
              </div>
              <div>
                <p className="text-2xl font-black leading-none">{kpi.value}</p>
                <p className="text-xs text-muted-foreground font-semibold mt-0.5">{kpi.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-sm bg-muted/30">
        <CardContent className="p-3 sm:p-4 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Buscar por nome, construtora ou bairro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background border-none shadow-sm h-9"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {ESTAGIO_FILTERS.map(estagio => (
              <button
                key={estagio}
                onClick={() => setEstagioFilter(estagio)}
                className={cn(
                  'h-7 px-3 rounded-full text-xs font-semibold border transition-all whitespace-nowrap shrink-0',
                  estagioFilter === estagio
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-background text-foreground border-border hover:border-primary/60 hover:bg-primary/5'
                )}
              >
                {estagio}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filteredEmpreendimentos.map((emp) => (
              <Card key={emp.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all group bg-card rounded-[24px]">
                <div className="relative h-[240px] overflow-hidden">
                  <img src={emp.imagem} alt={emp.titulo} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className={cn("border-none font-bold px-3 py-1 text-xs shadow-lg backdrop-blur-md", estagioBadge[emp.estagio])}>
                      {emp.estagio}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 border-none">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-2xl">
                        <DropdownMenuItem className="gap-2 cursor-pointer rounded-xl font-medium" onClick={() => navigate(`/empreendimentos/editar/${emp.id}`)}>
                          <Edit className="h-4 w-4 text-muted-foreground" /> Editar Empreendimento
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive rounded-xl font-medium" onClick={() => handleDelete(emp)}>
                          <Trash2 className="h-4 w-4" /> Excluir Empreendimento
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-black text-xl mb-1 truncate">{emp.titulo}</h3>
                    <p className="text-white/80 text-sm font-medium flex items-center gap-1.5 truncate">
                      <MapPin className="h-3.5 w-3.5" /> {emp.endereco}
                    </p>
                  </div>
                </div>

                <CardContent className="p-5">
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-border/50">
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Construtora</p>
                      <p className="text-sm font-bold text-foreground">{emp.construtora}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Entrega</p>
                      <p className="text-sm font-bold text-foreground">{emp.dataEntrega}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-5">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-muted-foreground">Progresso da Obra</span>
                      <span className="font-bold text-foreground">{emp.progressoObra}%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${emp.progressoObra}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-muted/30 p-3 rounded-xl mb-5">
                    <div className="flex-1 text-center border-r border-border/50">
                      <p className="text-xs text-muted-foreground font-semibold uppercase mb-0.5">Total</p>
                      <p className="font-black text-foreground">{emp.unidadesTotal}</p>
                    </div>
                    <div className="flex-1 text-center">
                      <p className="text-xs text-muted-foreground font-semibold uppercase mb-0.5">Disponíveis</p>
                      <p className="font-black text-emerald-600">{emp.unidadesDisponiveis}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5">Valor inicial</p>
                      <p className="font-black text-lg text-primary">{emp.valor}</p>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-xl font-bold h-9 border-primary/20 hover:bg-primary/5 text-primary">
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-card rounded-3xl border border-border/50 shadow-sm overflow-hidden"
          >
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b-border/50">
                    <TableHead className="font-bold text-muted-foreground">Empreendimento</TableHead>
                    <TableHead className="font-bold text-muted-foreground">Construtora</TableHead>
                    <TableHead className="font-bold text-muted-foreground">Estágio</TableHead>
                    <TableHead className="font-bold text-muted-foreground">Obra</TableHead>
                    <TableHead className="font-bold text-muted-foreground text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmpreendimentos.map((emp) => (
                    <TableRow key={emp.id} className="hover:bg-muted/30 transition-colors cursor-pointer group">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img src={emp.imagem} alt={emp.titulo} className="w-12 h-12 rounded-xl object-cover" />
                          <div>
                            <p className="font-bold text-foreground group-hover:text-primary transition-colors">{emp.titulo}</p>
                            <p className="text-xs text-muted-foreground">{emp.endereco}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">{emp.construtora}</TableCell>
                      <TableCell>
                        <Badge className={cn("border-none text-xs font-bold shadow-sm", estagioBadge[emp.estagio])}>
                          {emp.estagio}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${emp.progressoObra}%` }} />
                          </div>
                          <span className="text-xs font-bold">{emp.progressoObra}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-2xl">
                            <DropdownMenuItem className="gap-2 cursor-pointer rounded-xl font-medium" onClick={() => navigate(`/empreendimentos/editar/${emp.id}`)}>
                              <Edit className="h-4 w-4 text-muted-foreground" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive rounded-xl font-medium" onClick={() => handleDelete(emp)}>
                              <Trash2 className="h-4 w-4" /> Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-[32px] p-6">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="h-16 w-16 rounded-3xl bg-destructive/10 text-destructive flex items-center justify-center">
              <Trash2 className="h-8 w-8" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black text-foreground mb-2">Excluir Empreendimento</DialogTitle>
              <DialogDescription className="text-sm font-medium text-muted-foreground">
                Tem certeza que deseja excluir <strong>{empreendimentoToDelete?.titulo}</strong>? Esta ação não poderá ser desfeita.
              </DialogDescription>
            </div>
          </div>
          <DialogFooter className="mt-6 sm:justify-center gap-3">
            <Button variant="ghost" onClick={() => setDeleteOpen(false)} className="rounded-2xl font-bold flex-1 h-12">
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete} className="rounded-2xl font-bold flex-1 h-12 shadow-lg shadow-destructive/20">
              Sim, Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
