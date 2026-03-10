import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Plus, Users, MoreVertical, Edit, Trash2, Search, Grid, List as ListIcon,
  Home, TrendingUp, UserCheck, SlidersHorizontal, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { EquipeSheet } from '@/components/sheets/EquipeSheet';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
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

const equipesData = [
  { id: '1', nome: 'Vendas Centro', descricao: 'Equipe responsável pela região central', membros: ['João Silva', 'Maria Rodrigues', 'Pedro Santos'], cor: 'bg-primary' },
  { id: '2', nome: 'Vendas Zona Sul', descricao: 'Equipe responsável pela zona sul', membros: ['Ana Costa', 'Carlos Oliveira'], cor: 'bg-accent' },
  { id: '3', nome: 'Empreendimentos', descricao: 'Equipe de vendas de lançamentos', membros: ['Fernanda Lima', 'Roberto Alves', 'Juliana Rocha'], cor: 'bg-warning' },
];

// High-contrast color mapping for team badges (WCAG compliant)
const corBgSolid: Record<string, string> = {
  'bg-primary': 'bg-blue-600',
  'bg-accent': 'bg-violet-600',
  'bg-warning': 'bg-amber-500',
  'bg-success': 'bg-emerald-600',
};
const corTextContrast: Record<string, string> = {
  'bg-primary': 'text-blue-700 dark:text-blue-300',
  'bg-accent': 'text-violet-700 dark:text-violet-300',
  'bg-warning': 'text-amber-700 dark:text-amber-300',
  'bg-success': 'text-emerald-700 dark:text-emerald-300',
};
const corBgLight: Record<string, string> = {
  'bg-primary': 'bg-blue-50 dark:bg-blue-950/40',
  'bg-accent': 'bg-violet-50 dark:bg-violet-950/40',
  'bg-warning': 'bg-amber-50 dark:bg-amber-950/40',
  'bg-success': 'bg-emerald-50 dark:bg-emerald-950/40',
};
const corLabel: Record<string, string> = {
  'bg-primary': 'Azul', 'bg-accent': 'Roxo', 'bg-warning': 'Laranja', 'bg-success': 'Verde',
};

// Unique cities/members for filter options  
const TEAM_COR_OPTIONS = ['bg-primary', 'bg-accent', 'bg-warning', 'bg-success'];

interface AdvancedFilters { cor: string; minMembros: string; }
const defaultAdvanced: AdvancedFilters = { cor: 'Todos', minMembros: '' };

export function Equipes() {
  const { toast } = useToast();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedEquipe, setSelectedEquipe] = useState<any>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [equipeToDelete, setEquipeToDelete] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
  const [advanced, setAdvanced] = useState<AdvancedFilters>(defaultAdvanced);
  const [filterOpen, setFilterOpen] = useState(false);
  const [equipes, setEquipes] = useState(equipesData);

  const openSheet = (e: any) => { setSelectedEquipe(e); setSheetOpen(true); };
  const handleSheetSave = (updated: any) => {
    setEquipes(prev => prev.map(e => e.id === updated.id ? updated : e));
    setSelectedEquipe(updated);
    toast({ title: 'Equipe salva!', description: `${updated.nome} atualizada com sucesso.`, variant: 'success' });
  };
  const handleSheetDelete = (e: any) => { setEquipeToDelete(e); setSheetOpen(false); setDeleteOpen(true); };
  const handleNew = () => { setSelectedEquipe(null); setSheetOpen(true); };
  const handleDelete = (e: any) => { setEquipeToDelete(e); setDeleteOpen(true); };

  const confirmDelete = () => {
    setEquipes(prev => prev.filter(e => e.id !== equipeToDelete?.id));
    toast({ title: 'Equipe removida!', description: `${equipeToDelete?.nome} foi removida.`, variant: 'success' });
    setDeleteOpen(false); setEquipeToDelete(null);
  };

  const clearAdvanced = () => setAdvanced(defaultAdvanced);
  const hasActiveAdvanced = advanced.cor !== 'Todos' || advanced.minMembros !== '';

  const filteredEquipes = equipes.filter(e => {
    const q = searchTerm.toLowerCase();
    const matchSearch = e.nome.toLowerCase().includes(q) || e.descricao.toLowerCase().includes(q) || e.membros.some(m => m.toLowerCase().includes(q));
    const matchCor = advanced.cor === 'Todos' || e.cor === advanced.cor;
    const matchMembros = !advanced.minMembros || e.membros.length >= Number(advanced.minMembros);
    return matchSearch && matchCor && matchMembros;
  });

  const totalMembros = equipes.reduce((acc, e) => acc + e.membros.length, 0);
  const maxEquipe = equipes.reduce((max, e) => e.membros.length > max.membros.length ? e : max, equipes[0]);

  const stats = [
    { label: 'Equipes', value: equipes.length, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Total Membros', value: totalMembros, icon: UserCheck, color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
    { label: 'Maior Equipe', value: maxEquipe?.membros.length || 0, icon: TrendingUp, color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="flex items-center gap-1">
              <Home className="h-4 w-4" /> Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Equipes</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Equipes</h1>
            <p className="text-slate-500 mt-1 font-medium">Organize seus colaboradores em equipes</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-muted/50 rounded-xl p-1 border border-border/50">
            <Button variant={viewMode === 'table' ? 'secondary' : 'ghost'} size="sm" className="h-9 w-9 p-0 rounded-lg" onClick={() => setViewMode('table')}>
              <ListIcon className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="sm" className="h-9 w-9 p-0 rounded-lg" onClick={() => setViewMode('grid')}>
              <Grid className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleNew} className="bg-primary hover:bg-primary/90 text-white font-black px-8 shadow-lg shadow-primary/20 h-12 rounded-2xl">
            <Plus className="h-4 w-4 mr-2" /> Novo Equipe
          </Button>
        </div>
      </div>

      {/* KPI Bar */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} whileHover={{ y: -2 }} className={cn('rounded-2xl p-3 sm:p-4 flex items-center gap-3 border border-border/40', stat.bg)}>
              <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-background/70 shrink-0">
                <Icon className={cn('h-5 w-5', stat.color)} />
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-black tracking-tight leading-none">{stat.value}</p>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mt-0.5 truncate">{stat.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Search & Filter */}
      <Card className="border-none shadow-sm bg-muted/30">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input placeholder="Buscar por nome, descrição ou membro..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-background border-none shadow-sm" />
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {hasActiveAdvanced && (
                  <button onClick={clearAdvanced} className="h-9 px-2 rounded-lg text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20 flex items-center gap-1 hover:bg-destructive/20 transition-colors">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
                <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                  <PopoverTrigger asChild>
                    <button className={cn(
                      'h-9 px-3 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all',
                      hasActiveAdvanced ? 'bg-primary/10 text-primary border-primary/30' : 'bg-background text-foreground border-border hover:border-primary/60'
                    )}>
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Filtros</span>
                      {hasActiveAdvanced && <span className="h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-black">!</span>}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-4" align="end">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm">Filtros Avançados</h4>
                        {hasActiveAdvanced && <button onClick={clearAdvanced} className="text-xs text-destructive hover:underline font-semibold">Limpar</button>}
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cor da Equipe</Label>
                        <Select value={advanced.cor} onValueChange={(v) => setAdvanced(a => ({ ...a, cor: v }))}>
                          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Todos">Todos</SelectItem>
                            {TEAM_COR_OPTIONS.map(cor => (
                              <SelectItem key={cor} value={cor}>
                                <div className="flex items-center gap-2">
                                  <div className={cn('h-3 w-3 rounded-full', cor)} />
                                  {corLabel[cor]}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Mínimo de Membros</Label>
                        <Input type="number" placeholder="Ex: 2" min={1} value={advanced.minMembros} onChange={(e) => setAdvanced(a => ({ ...a, minMembros: e.target.value }))} className="h-9" />
                      </div>
                      <Button className="w-full" size="sm" onClick={() => setFilterOpen(false)}>
                        Aplicar ({filteredEquipes.length} equipe{filteredEquipes.length !== 1 ? 's' : ''})
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            {filteredEquipes.length < equipes.length && (
              <p className="text-xs text-muted-foreground">
                Mostrando <span className="font-bold text-foreground">{filteredEquipes.length}</span> de {equipes.length} equipes
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {viewMode === 'table' ? (
          <motion.div key="table" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-bold pl-4 sm:pl-6 min-w-[200px]">Equipe</TableHead>
                    <TableHead className="font-bold">Membros</TableHead>
                    <TableHead className="font-bold hidden sm:table-cell">Cor</TableHead>
                    <TableHead className="w-[50px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEquipes.length === 0 ? (
                    <tr><td colSpan={4} className="py-16 text-center">
                      <Search className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-foreground font-medium">Nenhuma equipe encontrada.</p>
                    </td></tr>
                  ) : filteredEquipes.map((equipe) => (
                    <TableRow key={equipe.id} className="group hover:bg-muted/40 transition-colors">
                      <TableCell className="pl-4 sm:pl-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn('h-9 w-9 rounded-xl flex items-center justify-center shrink-0', corBgSolid[equipe.cor] || 'bg-primary')}>
                            <Users className="h-4 w-4 text-white" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-sm group-hover:text-primary transition-colors">{equipe.nome}</div>
                            <div className="text-xs text-muted-foreground truncate mt-0.5">{equipe.descricao}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {equipe.membros.slice(0, 3).map((membro, idx) => (
                              <Avatar key={idx} className="h-7 w-7 border-2 border-background">
                                <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-bold">
                                  {membro.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {equipe.membros.length > 3 && (
                              <div className="h-7 w-7 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                                +{equipe.membros.length - 3}
                              </div>
                            )}
                          </div>
                          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">{equipe.membros.length} membros</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold', corBgLight[equipe.cor], corTextContrast[equipe.cor])}>
                          <div className={cn('h-2.5 w-2.5 rounded-full', corBgSolid[equipe.cor])} />
                          {corLabel[equipe.cor] || equipe.cor}
                        </span>
                      </TableCell>
                      <TableCell className="pr-4 sm:pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openSheet(equipe)} className="gap-2"><Edit className="h-4 w-4" /> Ver / Editar</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(equipe)} className="text-destructive gap-2"><Trash2 className="h-4 w-4" /> Deletar</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        ) : (
          <motion.div key="grid" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {filteredEquipes.length > 0 ? filteredEquipes.map((equipe) => (
              <Card key={equipe.id} className="group hover:border-primary/40 transition-all cursor-pointer overflow-hidden shadow-none hover:shadow-md" onClick={() => openSheet(equipe)}>
                <CardContent className="p-0">
                  <div className={cn('h-1.5 w-full', corBgSolid[equipe.cor] || 'bg-primary')} />
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className={cn('h-11 w-11 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 shrink-0', corBgSolid[equipe.cor] || 'bg-primary')}>
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex items-center gap-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openSheet(equipe); }} className="gap-2"><Edit className="h-4 w-4" /> Ver / Editar</DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDelete(equipe); }} className="text-destructive gap-2"><Trash2 className="h-4 w-4" /> Deletar</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <h3 className="font-bold group-hover:text-primary transition-colors">{equipe.nome}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{equipe.descricao}</p>
                    <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between gap-2">
                      <div className="flex -space-x-1.5">
                        {equipe.membros.slice(0, 4).map((membro, idx) => (
                          <Avatar key={idx} className="h-7 w-7 border-2 border-background">
                            <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-bold">
                              {membro.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {equipe.membros.length > 4 && (
                          <div className="h-7 w-7 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                            +{equipe.membros.length - 4}
                          </div>
                        )}
                      </div>
                      <span className={cn('inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md', corBgLight[equipe.cor], corTextContrast[equipe.cor])}>
                        {equipe.membros.length} membros
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-border/40 rounded-2xl px-4">
                <Search className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-foreground font-medium">Nenhuma equipe encontrada.</p>
                <Button className="mt-4 gap-2 shadow-lg shadow-primary/20" onClick={handleNew}>
                  <Plus className="h-4 w-4" /> Nova Equipe
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <EquipeSheet
        equipe={selectedEquipe}
        open={sheetOpen}
        allUsers={['João Silva', 'Maria Rodrigues', 'Pedro Santos', 'Ana Costa', 'Carlos Oliveira', 'Fernanda Lima']}
        onClose={() => setSheetOpen(false)}
        onSave={handleSheetSave}
        onDelete={handleSheetDelete}
      />

      {/* Delete Confirmation */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>Esta ação não pode ser desfeita.</DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
            <p className="text-sm font-medium mb-2">Você está prestes a deletar a equipe:</p>
            <div className="flex items-center gap-3">
              <div className={cn('h-9 w-9 rounded-xl flex items-center justify-center shrink-0', corBgSolid[equipeToDelete?.cor] || 'bg-primary')}>
                <Users className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-semibold">{equipeToDelete?.nome}</p>
                <p className="text-sm text-muted-foreground">{equipeToDelete?.membros?.length || 0} membros serão afetados</p>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 flex-col sm:flex-row">
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => setDeleteOpen(false)}>Cancelar</Button>
            <Button variant="destructive" className="w-full sm:w-auto" onClick={confirmDelete}>
              <Trash2 className="h-4 w-4 mr-2" /> Confirmar Exclusão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
