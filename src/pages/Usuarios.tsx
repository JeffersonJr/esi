import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Plus, Edit, Home, MoreVertical, Trash2, Users,
  Search, Grid, List as ListIcon, Mail, Phone,
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
  Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger,
} from '@/components/ui/drawer';
import { Label } from '@/components/ui/label';
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PageHeader } from '@/components/layout/PageHeader';
import { UserSheet, type Usuario } from '@/components/sheets/UserSheet';
import { NewUserDrawer } from '@/components/drawers/NewUserDrawer';
import { Badge } from '@/components/ui/badge';

const usuariosData = [
  { id: '1', nome: 'Jefferson Jr.', email: 'jefferson@esi.chat', telefone: '+55 11 99999-9999', cargo: 'CEO', equipe: 'Diretoria', etiqueta: 'Especialista', nivel: 'Admin', status: 'Ativo' },
  { id: '2', nome: 'Maria Rodrigues', email: 'maria@esi.chat', telefone: '+55 11 98888-8888', cargo: 'Corretora', equipe: 'Vendas', etiqueta: 'Top Broker', nivel: 'Normal', status: 'Ativo' },
  { id: '3', nome: 'Pedro Santos', email: 'pedro@esi.chat', telefone: '+55 11 97777-7777', cargo: 'Corretor', equipe: 'Vendas', etiqueta: '', nivel: 'Normal', status: 'Ativo' },
  { id: '4', nome: 'Ana Costa', email: 'ana@esi.chat', telefone: '+55 11 96666-6666', cargo: 'Assistente', equipe: 'Atendimento', etiqueta: '', nivel: 'Normal', status: 'Inativo' },
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
  funcao: string;
  equipe: string;
  filial: string;
}
const defaultAdvanced: AdvancedFilters = { status: 'Todos', funcao: 'Todas', equipe: '', filial: '' };

export function Usuarios() {
  const { toast } = useToast();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [newDrawerOpen, setNewDrawerOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<any>(null);
  const [statusConfirmDialog, setStatusConfirmDialog] = useState<{ open: boolean, user: Usuario | null, action: 'Ativo' | 'Inativo' }>({ open: false, user: null, action: 'Ativo' });
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState<any>(null);
  const [selectedTransferUser, setSelectedTransferUser] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
  const [activeFilter, setActiveFilter] = useState<NivelFilter>('Todos');
  const [advanced, setAdvanced] = useState<AdvancedFilters>(defaultAdvanced);
  const [filterOpen, setFilterOpen] = useState(false);
  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosData as Usuario[]);

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
  const hasActiveAdvanced = advanced.status !== 'Todos' || advanced.funcao !== 'Todas' || advanced.equipe !== '' || advanced.filial !== '';

  const filteredUsuarios = usuarios.filter(u => {
    const q = (searchTerm || '').toLowerCase();
    const nomeStr = (u.nome || '').toLowerCase();
    const cargoStr = (u.cargo || '').toLowerCase();
    const emailStr = (u.email || '').toLowerCase();
    const telefoneStr = (u.telefone || '').toLowerCase();
    const equipeStr = (u.equipe || '').toLowerCase();
    const filialStr = (u.filial || '').toLowerCase();

    const matchSearch = nomeStr.includes(q) || emailStr.includes(q) || telefoneStr.includes(q);
    const matchNivel = activeFilter === 'Todos' || u.nivel === activeFilter;
    const matchStatus = advanced.status === 'Todos' || u.status === advanced.status;
    const matchFuncao = advanced.funcao === 'Todas' || cargoStr === advanced.funcao.toLowerCase();
    const matchEquipe = !advanced.equipe || equipeStr.includes(advanced.equipe.toLowerCase());
    const matchFilial = !advanced.filial || filialStr.includes(advanced.filial.toLowerCase());

    return matchSearch && matchNivel && matchStatus && matchFuncao && matchEquipe && matchFilial;
  });

  const totalAtivos = usuarios.filter(u => u.status === 'Ativo').length;
  const totalInativos = usuarios.filter(u => u.status === 'Inativo').length;

  const stats = [
    { label: 'Total', value: `${usuarios.length}/10`, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Ativos', value: totalAtivos, icon: UserCheck, color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
    { label: 'Inativos', value: totalInativos, icon: XCircle, color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-800/40' },
  ];

  const nivelFilters: NivelFilter[] = ['Todos', 'Admin', 'Normal'];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Usuários"
        subtitle="Gerencie os usuários do sistema"
        icon={<UserCheck />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Usuários' }
        ]}
        actions={
          <Button className="gap-2" onClick={handleNew}>
            <Plus className="h-4 w-4" /> Novo Usuário
          </Button>
        }
      />

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
                <div className="flex items-center bg-muted/50 rounded-xl p-1 border border-border/50 mr-1">
                  <Button
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                    size="sm"
                    className="h-9 w-9 p-0 rounded-lg"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                    size="sm"
                    className="h-9 w-9 p-0 rounded-lg"
                    onClick={() => setViewMode('table')}
                  >
                    <ListIcon className="h-4 w-4" />
                  </Button>
                </div>
                {hasActiveAdvanced && (
                  <button onClick={clearAdvanced} className="h-7 px-2 rounded-full text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20 flex items-center gap-1 hover:bg-destructive/20 transition-colors">
                    <X className="h-3 w-3" /> Limpar
                  </button>
                )}
                <Drawer open={filterOpen} onOpenChange={setFilterOpen}>
                  <DrawerTrigger asChild>
                    <button className={cn(
                      'h-7 px-3 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition-all',
                      hasActiveAdvanced ? 'bg-primary/10 text-primary border-primary/30' : 'bg-background text-foreground border-border hover:border-primary/60'
                    )}>
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                      Filtros
                      {hasActiveAdvanced && <span className="h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-black">!</span>}
                    </button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <div className="mx-auto w-full max-w-lg">
                      <DrawerHeader>
                        <DrawerTitle className="flex items-center justify-between">
                          <span>Filtros Avançados</span>
                          {hasActiveAdvanced && <button onClick={clearAdvanced} className="text-xs text-destructive hover:underline font-semibold">Limpar Filtros</button>}
                        </DrawerTitle>
                        <DrawerDescription>Refine a busca de usuários com filtros específicos.</DrawerDescription>
                      </DrawerHeader>
                      <div className="p-4 pb-0">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5 col-span-2">
                            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</Label>
                            <Select value={advanced.status} onValueChange={(v) => setAdvanced(a => ({ ...a, status: v }))}>
                              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Todos">Todos</SelectItem>
                                <SelectItem value="Ativo">Ativos</SelectItem>
                                <SelectItem value="Inativo">Inativos</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-1.5 col-span-2">
                            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Função</Label>
                            <Select value={advanced.funcao} onValueChange={(v) => setAdvanced(a => ({ ...a, funcao: v }))}>
                              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Todas">Todas</SelectItem>
                                <SelectItem value="Advogado">Advogado</SelectItem>
                                <SelectItem value="Assistente">Assistente</SelectItem>
                                <SelectItem value="Auxiliar de escritório">Auxiliar de escritório</SelectItem>
                                <SelectItem value="Auxiliar de locação">Auxiliar de locação</SelectItem>
                                <SelectItem value="Auxiliar financeiro">Auxiliar financeiro</SelectItem>
                                <SelectItem value="Coordenador de equipe">Coordenador de equipe</SelectItem>
                                <SelectItem value="Corretor">Corretor</SelectItem>
                                <SelectItem value="Diretor">Diretor</SelectItem>
                                <SelectItem value="Gerente">Gerente</SelectItem>
                                <SelectItem value="Secretária">Secretária</SelectItem>
                                <SelectItem value="Sem Função">Sem Função</SelectItem>
                                <SelectItem value="Supervisor de negócios">Supervisor de negócios</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Equipe</Label>
                            <Input placeholder="Ex: Vendas" value={advanced.equipe} onChange={(e) => setAdvanced(a => ({ ...a, equipe: e.target.value }))} className="h-10" />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Filial</Label>
                            <Input placeholder="Ex: Matriz" value={advanced.filial} onChange={(e) => setAdvanced(a => ({ ...a, filial: e.target.value }))} className="h-10" />
                          </div>
                        </div>
                      </div>
                      <DrawerFooter className="mt-4 flex-row gap-2">
                        <Button className="flex-1" size="lg" onClick={() => setFilterOpen(false)}>
                          Aplicar ({filteredUsuarios.length})
                        </Button>
                        <DrawerClose asChild>
                          <Button variant="outline" size="lg" className="flex-1">
                            Cancelar
                          </Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>
            </div>
            {true && (
              <p className="text-xs font-medium text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg border border-border/50">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{totalAtivos}</span> ativos / <span className="text-foreground font-bold">{usuarios.length}</span> total
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
                    <TableHead className="font-bold pl-4 sm:pl-6 min-w-[220px]">Nome</TableHead>
                    <TableHead className="font-bold hidden sm:table-cell">Contatos</TableHead>
                    <TableHead className="font-bold hidden md:table-cell">Equipe</TableHead>
                    <TableHead className="font-bold hidden md:table-cell">Etiqueta</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="w-[100px] text-right">Ações</TableHead>

                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsuarios.length === 0 ? (
                    <tr><td colSpan={5} className="py-16 text-center text-muted-foreground font-medium"><Search className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />Nenhum usuário encontrado.</td></tr>
                  ) : filteredUsuarios.map((u) => (
                    <TableRow key={u.id} className="group hover:bg-muted/40 transition-colors">
                      <TableCell className="pl-4 sm:pl-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border">
                            <AvatarFallback className="bg-primary/5 text-primary text-xs font-semibold">
                              {u.nome.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm truncate">{u.nome}</p>
                              {u.nivel === 'Admin' && <Badge variant="outline" className="text-[9px] font-black uppercase text-amber-600 border-amber-200 bg-amber-50">ADMIN</Badge>}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{u.cargo}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-slate-600"><Mail className="h-3.5 w-3.5" /> {u.email}</div>
                          {u.telefone && <div className="flex items-center gap-1.5 text-xs text-slate-600"><Phone className="h-3.5 w-3.5" /> {u.telefone}</div>}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell py-4 text-sm text-muted-foreground">
                        {u.equipe || '-'}
                      </TableCell>
                      <TableCell className="hidden md:table-cell py-4 text-sm">
                        {u.etiqueta ? <Badge variant="secondary" className="font-normal text-xs">{u.etiqueta}</Badge> : '-'}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={u.status === 'Ativo'}
                            onCheckedChange={(checked) => {
                              setStatusConfirmDialog({ open: true, user: u, action: checked ? 'Ativo' : 'Inativo' });
                            }}
                          />
                          <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap', statusBadge(u.status))}>
                            {u.status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-right pr-4 sm:pr-6">
                        <Button variant="ghost" size="sm" onClick={() => openSheet(u)} className="h-8 text-primary hover:text-primary hover:bg-primary/10">
                          <Edit className="h-4 w-4 mr-2" /> Editar
                        </Button>
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
              <Card key={u.id} className="group hover:border-primary/40 transition-all overflow-hidden shadow-none hover:shadow-md">
                <CardContent className="p-0">
                  <div className="p-4 sm:p-6 flex items-start gap-3 sm:gap-4 cursor-pointer" onClick={() => openSheet(u)}>
                    <Avatar className="h-11 w-11 border-2 border-border group-hover:border-primary/30 transition-all shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">{u.nome.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{u.nome}</h3>
                      </div>
                      <p className="text-xs font-medium mt-1 flex items-center gap-1.5 text-foreground/70">
                        <Briefcase className="h-3 w-3 shrink-0 opacity-50" /> {u.cargo}
                      </p>

                      <div className="mt-3 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600"><Mail className="h-3.5 w-3.5" /> {u.email}</div>
                        {u.telefone && <div className="flex items-center gap-1.5 text-xs text-slate-600"><Phone className="h-3.5 w-3.5" /> {u.telefone}</div>}
                      </div>

                      <div className="mt-3 flex items-center gap-2 flex-wrap">
                        {u.equipe && <span className="text-xs text-muted-foreground bg-slate-100 px-2 py-0.5 rounded-md border">Equipe: {u.equipe}</span>}
                        {u.etiqueta && <Badge variant="secondary" className="font-normal text-[10px]">{u.etiqueta}</Badge>}
                      </div>
                    </div>
                  </div>
                  <div className="px-4 sm:px-6 py-3 bg-muted/30 border-t flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={u.status === 'Ativo'}
                          onCheckedChange={(checked) => {
                            setStatusConfirmDialog({ open: true, user: u, action: checked ? 'Ativo' : 'Inativo' });
                          }}
                        />
                        <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap', statusBadge(u.status))}>
                          {u.status}
                        </span>
                      </div>
                      <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold', nivelBadge(u.nivel))}>
                        {u.nivel === 'Admin' && <Crown className="h-3 w-3" />}{u.nivel}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 opacity-100">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={(e) => { e.stopPropagation(); openSheet(u); }}><Edit className="h-4 w-4" /></Button>
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

      <NewUserDrawer
        open={newDrawerOpen}
        onClose={() => setNewDrawerOpen(false)}
        onSave={(u) => {
          handleSheetSave(u);
          setNewDrawerOpen(false);
        }}
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
      <Dialog open={statusConfirmDialog.open} onOpenChange={(open) => setStatusConfirmDialog(prev => ({ ...prev, open }))}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>
              {statusConfirmDialog.action === 'Ativo' ? 'Reativar Usuário' : 'Inativar Usuário'}
            </DialogTitle>
            <DialogDescription>
              {statusConfirmDialog.action === 'Ativo'
                ? 'Tem certeza que deseja reativar o acesso deste usuário? Ele será notificado por e-mail com as instruções de acesso.'
                : 'Tem certeza que deseja inativar este usuário? Ele perderá imediatamente o acesso ao sistema e suas sessões serão encerradas.'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl border border-muted">
              <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                  {statusConfirmDialog.user?.nome?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-sm text-foreground">{statusConfirmDialog.user?.nome}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{statusConfirmDialog.user?.email}</p>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0 mt-2">
            <Button variant="outline" onClick={() => setStatusConfirmDialog(prev => ({ ...prev, open: false }))}>
              Cancelar
            </Button>
            <Button
              variant={statusConfirmDialog.action === 'Ativo' ? 'default' : 'destructive'}
              onClick={() => {
                if (statusConfirmDialog.user) {
                  setUsuarios(prev => prev.map(user =>
                    user.id === statusConfirmDialog.user!.id
                      ? { ...user, status: statusConfirmDialog.action }
                      : user
                  ));
                  toast({
                    title: statusConfirmDialog.action === 'Ativo' ? 'Usuário Reativado' : 'Usuário Inativado',
                    description: statusConfirmDialog.action === 'Ativo'
                      ? `O usuário ${statusConfirmDialog.user.nome} foi reativado e notificado por e-mail.`
                      : `O acesso de ${statusConfirmDialog.user.nome} foi bloqueado com sucesso.`,
                    variant: 'success'
                  });
                }
                setStatusConfirmDialog(prev => ({ ...prev, open: false }));
              }}
            >
              {statusConfirmDialog.action === 'Ativo' ? 'Sim, Reativar Usuário' : 'Sim, Inativar Usuário'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
