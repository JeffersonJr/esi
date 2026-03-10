import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Plus, Edit, Home, MoreVertical, Trash2, Users,
  Search, Grid, List as ListIcon, Mail,
  Briefcase, Shield, CheckCircle2, XCircle, UserCheck, Crown,
  SlidersHorizontal, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { UserSheet } from '@/components/sheets/UserSheet';

const usuariosData = [
  { id: '1', nome: 'João Silva', email: 'joao@empresa.com', cargo: 'Corretor', nivel: 'Admin', status: 'Ativo' },
  { id: '2', nome: 'Maria Rodrigues', email: 'maria@empresa.com', cargo: 'Corretora', nivel: 'Normal', status: 'Ativo' },
  { id: '3', nome: 'Pedro Santos', email: 'pedro@empresa.com', cargo: 'Corretor', nivel: 'Normal', status: 'Ativo' },
  { id: '4', nome: 'Ana Costa', email: 'ana@empresa.com', cargo: 'Assistente', nivel: 'Normal', status: 'Inativo' },
];

type NivelFilter = 'Todos' | 'Admin' | 'Normal';

// High-contrast badge classes (WCAG AA compliant)
const statusBadge = (status: string) =>
  status === 'Ativo'
    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';

const nivelBadge = (nivel: string) =>
  nivel === 'Admin'
    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';

interface AdvancedFilters {
  status: string;
  cargo: string;
}
const defaultAdvanced: AdvancedFilters = { status: 'Todos', cargo: '' };

export function Usuarios() {
  const { toast } = useToast();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<any>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState<any>(null);
  const [selectedTransferUser, setSelectedTransferUser] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
  const [activeFilter, setActiveFilter] = useState<NivelFilter>('Todos');
  const [advanced, setAdvanced] = useState<AdvancedFilters>(defaultAdvanced);
  const [filterOpen, setFilterOpen] = useState(false);
  const [usuarios, setUsuarios] = useState(usuariosData);

  const openSheet = (u: any) => { setSelectedUsuario(u); setSheetOpen(true); };
  const handleSheetSave = (updated: any) => {
    setUsuarios(prev => prev.map(u => u.id === updated.id ? updated : u));
    setSelectedUsuario(updated);
    toast({ title: 'Usuário atualizado!', description: `${updated.nome} foi salvo.`, variant: 'success' });
  };
  const handleSheetDelete = (u: any) => {
    setUsuarioToDelete(u);
    setSheetOpen(false);
    setDeleteOpen(true);
  };

  const handleNew = () => { setSelectedUsuario(null); setSheetOpen(true); };
  const handleDelete = (u: any) => { setUsuarioToDelete(u); setDeleteOpen(true); };

  const confirmDelete = () => {
    if (!selectedTransferUser) {
      toast({ title: 'Selecione um usuário', description: 'Selecione para quem os leads serão transferidos.', variant: 'destructive' });
      return;
    }
    const dest = usuarios.find(u => u.id === selectedTransferUser);
    toast({ title: 'Usuário removido!', description: `Leads transferidos para ${dest?.nome}.`, variant: 'success' });
    setUsuarios(prev => prev.filter(u => u.id !== usuarioToDelete?.id));
    setDeleteOpen(false); setUsuarioToDelete(null); setSelectedTransferUser('');
  };

  const clearAdvanced = () => setAdvanced(defaultAdvanced);
  const hasActiveAdvanced = advanced.status !== 'Todos' || advanced.cargo !== '';

  const filteredUsuarios = usuarios.filter(u => {
    const q = searchTerm.toLowerCase();
    const matchSearch = u.nome.toLowerCase().includes(q) || u.cargo.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchNivel = activeFilter === 'Todos' || u.nivel === activeFilter;
    const matchStatus = advanced.status === 'Todos' || u.status === advanced.status;
    const matchCargo = !advanced.cargo || u.cargo.toLowerCase().includes(advanced.cargo.toLowerCase());
    return matchSearch && matchNivel && matchStatus && matchCargo;
  });

  const totalAdmins = usuarios.filter(u => u.nivel === 'Admin').length;
  const totalAtivos = usuarios.filter(u => u.status === 'Ativo').length;
  const totalInativos = usuarios.filter(u => u.status === 'Inativo').length;

  const stats = [
    { label: 'Total', value: usuarios.length, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Admins', value: totalAdmins, icon: Crown, color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40' },
    { label: 'Ativos', value: totalAtivos, icon: UserCheck, color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
    { label: 'Inativos', value: totalInativos, icon: XCircle, color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-800/40' },
  ];

  const nivelFilters: NivelFilter[] = ['Todos', 'Admin', 'Normal'];

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
            <BreadcrumbPage>Usuários</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Usuários</h1>
            <p className="text-slate-500 mt-1 font-medium">Gerencie os usuários do sistema</p>
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
            <Plus className="h-4 w-4 mr-2" /> Novo Usuário
          </Button>
        </div>
      </div>

      {/* KPI Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} whileHover={{ y: -2 }} className={cn('rounded-2xl p-3 sm:p-4 flex items-center gap-3 border border-border/40', stat.bg)}>
              <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-background/70 shrink-0">
                <Icon className={cn('h-5 w-5', stat.color)} />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black tracking-tight leading-none">{stat.value}</p>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Search & Filter */}
      <Card className="border-none shadow-sm bg-muted/30">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input placeholder="Buscar por nome, cargo ou email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-background border-none shadow-sm" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {nivelFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={cn(
                    'h-7 px-3 rounded-full text-xs font-semibold border transition-all',
                    activeFilter === f
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'bg-background text-foreground border-border hover:border-primary/60 hover:bg-primary/5'
                  )}
                >
                  {f === 'Normal' ? 'Corretores' : f}
                </button>
              ))}
              <div className="ml-auto flex items-center gap-2">
                {hasActiveAdvanced && (
                  <button onClick={clearAdvanced} className="h-7 px-2 rounded-full text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20 flex items-center gap-1 hover:bg-destructive/20 transition-colors">
                    <X className="h-3 w-3" /> Limpar
                  </button>
                )}
                <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                  <PopoverTrigger asChild>
                    <button className={cn(
                      'h-7 px-3 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition-all',
                      hasActiveAdvanced ? 'bg-primary/10 text-primary border-primary/30' : 'bg-background text-foreground border-border hover:border-primary/60'
                    )}>
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                      Filtros
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
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</Label>
                        <Select value={advanced.status} onValueChange={(v) => setAdvanced(a => ({ ...a, status: v }))}>
                          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Todos">Todos</SelectItem>
                            <SelectItem value="Ativo">Ativo</SelectItem>
                            <SelectItem value="Inativo">Inativo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cargo</Label>
                        <Input placeholder="Ex: Corretor" value={advanced.cargo} onChange={(e) => setAdvanced(a => ({ ...a, cargo: e.target.value }))} className="h-9" />
                      </div>
                      <Button className="w-full" size="sm" onClick={() => setFilterOpen(false)}>
                        Aplicar ({filteredUsuarios.length} resultado{filteredUsuarios.length !== 1 ? 's' : ''})
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            {filteredUsuarios.length < usuarios.length && (
              <p className="text-xs text-muted-foreground">
                Mostrando <span className="font-bold text-foreground">{filteredUsuarios.length}</span> de {usuarios.length} usuários
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
                    <TableHead className="font-bold pl-4 sm:pl-6 min-w-[180px]">Usuário</TableHead>
                    <TableHead className="font-bold hidden sm:table-cell">Cargo</TableHead>
                    <TableHead className="font-bold hidden md:table-cell">Nível</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="w-[50px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsuarios.length === 0 ? (
                    <tr><td colSpan={5} className="py-16 text-center text-muted-foreground font-medium"><Search className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />Nenhum usuário encontrado.</td></tr>
                  ) : filteredUsuarios.map((u) => (
                    <TableRow key={u.id} className="group cursor-pointer hover:bg-muted/40 transition-colors" onClick={() => openSheet(u)}>
                      <TableCell className="pl-4 sm:pl-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border border-border group-hover:border-primary/40 transition-all shrink-0">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">{u.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="font-semibold text-sm group-hover:text-primary transition-colors truncate">{u.nome}</div>
                            <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm font-medium">{u.cargo}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold', nivelBadge(u.nivel))}>
                          {u.nivel === 'Admin' && <Crown className="h-3 w-3" />}{u.nivel}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold', statusBadge(u.status))}>
                          {u.status}
                        </span>
                      </TableCell>
                      <TableCell className="pr-4 sm:pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openSheet(u); }} className="gap-2"><Edit className="h-4 w-4" /> Ver / Editar</DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleSheetDelete(u); }} className="text-destructive gap-2"><Trash2 className="h-4 w-4" /> Deletar</DropdownMenuItem>
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
            {filteredUsuarios.length > 0 ? filteredUsuarios.map((u) => (
              <Card key={u.id} className="group hover:border-primary/40 transition-all cursor-pointer overflow-hidden shadow-none hover:shadow-md" onClick={() => openSheet(u)}>
                <CardContent className="p-0">
                  <div className="p-4 sm:p-6 flex items-start gap-3 sm:gap-4">
                    <Avatar className="h-11 w-11 border-2 border-border group-hover:border-primary/30 transition-all shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">{u.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{u.nome}</h3>
                        <span className={cn('inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold shrink-0', statusBadge(u.status))}>{u.status}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{u.email}</p>
                      <p className="text-xs font-medium mt-2.5 flex items-center gap-1.5 text-foreground/70">
                        <Briefcase className="h-3 w-3 shrink-0 opacity-50" /> {u.cargo}
                      </p>
                    </div>
                  </div>
                  <div className="px-4 sm:px-6 py-3 bg-muted/30 border-t flex items-center justify-between">
                    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold', nivelBadge(u.nivel))}>
                      {u.nivel === 'Admin' && <Crown className="h-3 w-3" />}{u.nivel}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); openSheet(u); }}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={(e) => { e.stopPropagation(); handleSheetDelete(u); }}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-border/40 rounded-2xl px-4">
                <Search className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-foreground font-medium">Nenhum usuário encontrado.</p>
                <p className="text-sm text-muted-foreground mt-1">Tente ajustar os filtros de busca.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Detail/Edit Sheet */}
      <UserSheet
        usuario={selectedUsuario}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSave={handleSheetSave}
        onDelete={handleSheetDelete}
      />

      {/* Delete Modal */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>Selecione para qual usuário os leads serão transferidos antes de deletar.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
              <p className="text-sm font-medium mb-1">Você está prestes a deletar:</p>
              <p className="font-semibold">{usuarioToDelete?.nome}</p>
              <p className="text-sm text-muted-foreground">{usuarioToDelete?.email}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold flex items-center gap-2"><Users className="h-4 w-4" /> Transferir leads para:</Label>
              <Select value={selectedTransferUser} onValueChange={setSelectedTransferUser}>
                <SelectTrigger><SelectValue placeholder="Selecione um usuário..." /></SelectTrigger>
                <SelectContent>
                  {usuarios.filter(u => u.id !== usuarioToDelete?.id).map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6"><AvatarFallback className="text-xs">{u.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}</AvatarFallback></Avatar>
                        <div><p className="font-medium">{u.nome}</p><p className="text-xs text-muted-foreground">{u.cargo}</p></div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2 flex-col sm:flex-row">
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => { setDeleteOpen(false); setSelectedTransferUser(''); }}>Cancelar</Button>
            <Button variant="destructive" className="w-full sm:w-auto" onClick={confirmDelete} disabled={!selectedTransferUser}>
              <Trash2 className="h-4 w-4 mr-2" /> Deletar e Transferir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
