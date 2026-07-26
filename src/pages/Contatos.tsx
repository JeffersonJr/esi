import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Plus, Search, Mail, Phone, MapPin, MoreVertical,
  User, Edit, Trash2, Home, Grid, List as ListIcon,
  Users, UserCheck, Building, X, SlidersHorizontal
, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn, maskPhone } from '@/lib/utils';
import { useAnimation } from '@/components/shared/ActionAnimation';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PageHeader } from '@/components/layout/PageHeader';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter,
} from '@/components/ui/sheet';
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { ContatoDeleteModal } from '@/components/modals/ContatoDeleteModal';
import { useToast } from '@/hooks/use-toast';
import { ContactSheet } from '@/components/sheets/ContactSheet';

const contatosIniciais = [
  { id: '1', nome: 'Maria Santos', email: 'maria@email.com', telefone: '(11) 99999-0001', tipo: 'Cliente', interesse: 'Apartamento', cidade: 'São Paulo', status: 'Ativo' },
  { id: '2', nome: 'Carlos Oliveira', email: 'carlos@email.com', telefone: '(11) 99999-0002', tipo: 'Proprietário', interesse: 'Casa', cidade: 'Santos', status: 'Ativo' },
  { id: '3', nome: 'João Silva', email: 'joao@email.com', telefone: '(11) 99999-0003', tipo: 'Cliente', interesse: 'Cobertura', cidade: 'São Paulo', status: 'Em negociação' },
  { id: '4', nome: 'Ana Costa', email: 'ana@email.com', telefone: '(11) 99999-0004', tipo: 'Cliente', interesse: 'Apartamento', cidade: 'Guarujá', status: 'Ativo' },
  { id: '5', nome: 'Pedro Souza', email: 'pedro@email.com', telefone: '(11) 99999-0005', tipo: 'Proprietário', interesse: 'Casa condomínio', cidade: 'São Paulo', status: 'Inativo' },
];

type FilterType = 'Todos' | 'Cliente' | 'Proprietário';

// High-contrast status badge colors (WCAG AA compliant)
const statusColor = (status: string) => {
  if (status === 'Ativo') return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300';
  if (status === 'Em negociação') return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300';
  return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
};

const tipoColor = (tipo: string) =>
  tipo === 'Cliente'
    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
    : 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300';

interface AdvancedFilters {
  status: string;
  cidade: string;
  interesse: string;
}

const defaultAdvanced: AdvancedFilters = { status: 'Todos', cidade: '', interesse: '' };

export function Contatos() {
  const { triggerAnimation } = useAnimation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [activeFilter, setActiveFilter] = useState<FilterType>('Todos');
  const [advanced, setAdvanced] = useState<AdvancedFilters>(defaultAdvanced);
  const [filterOpen, setFilterOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [contatoToDelete, setContatoToDelete] = useState<any>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [contatosList, setContatosList] = useState(contatosIniciais);
  const [newContato, setNewContato] = useState({
    nome: '', email: '', telefone: '', tipo: '', interesse: '', cidade: '', status: 'Ativo',
  });
  // Sheet state
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedContato, setSelectedContato] = useState<any>(null);

  const handleViewProfile = (contato: any) => navigate(`/contatos/perfil/${contato.id}`);
  const handleEdit = (contato: any) => navigate(`/contatos/editar/${contato.id}`);
  const openSheet = (contato: any) => { setSelectedContato(contato); setSheetOpen(true); };
  const handleSheetSave = (updated: any) => {
    setContatosList(prev => prev.map(c => c.id === updated.id ? updated : c));
    setSelectedContato(updated);
    toast({ title: 'Contato atualizado', description: `${updated.nome} foi salvo.`, variant: 'success' });
  };
  const handleSheetDelete = (contato: any) => {
    setContatoToDelete(contato);
    setSheetOpen(false);
    setDeleteModalOpen(true);
  };
  const handleDelete = (contato: any) => { setContatoToDelete(contato); setDeleteModalOpen(true); };

  const confirmDelete = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    triggerAnimation({
      type: 'delete',
      startX: rect.left + rect.width / 2,
      startY: rect.top + rect.height / 2,
      icon: Trash2
    });
    setContatosList(prev => prev.filter(c => c.id !== contatoToDelete?.id));
    toast({ title: 'Contato excluído', description: `${contatoToDelete?.nome} foi removido.`, variant: 'success' });
    setDeleteModalOpen(false);
    setContatoToDelete(null);
  };

  const handleAddContato = (e: React.MouseEvent) => {
    if (newContato.nome && newContato.email && newContato.telefone && newContato.tipo) {
      const rect = e.currentTarget.getBoundingClientRect();
      triggerAnimation({
        type: 'success',
        startX: rect.left + rect.width / 2,
        startY: rect.top + rect.height / 2,
        icon: User
      });
      setContatosList(prev => [...prev, { ...newContato, id: Date.now().toString() }]);
      toast({ title: 'Contato adicionado!', description: `${newContato.nome} foi cadastrado com sucesso.`, variant: 'success' });
      setAddModalOpen(false);
      setNewContato({ nome: '', email: '', telefone: '', tipo: '', interesse: '', cidade: '', status: 'Ativo' });
    } else {
      toast({ title: 'Campos obrigatórios', description: 'Preencha Nome, E-mail, Telefone e Tipo.', variant: 'destructive' });
    }
  };

  const clearAdvanced = () => setAdvanced(defaultAdvanced);
  const hasActiveAdvanced = advanced.status !== 'Todos' || advanced.cidade !== '' || advanced.interesse !== '';

  const filteredContatos = contatosList.filter((c) => {
    const q = searchTerm.toLowerCase();
    const matchSearch = c.nome.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.telefone.includes(q);
    const matchTipo = activeFilter === 'Todos' || c.tipo === activeFilter;
    const matchStatus = advanced.status === 'Todos' || c.status === advanced.status;
    const matchCidade = !advanced.cidade || c.cidade.toLowerCase().includes(advanced.cidade.toLowerCase());
    const matchInteresse = !advanced.interesse || c.interesse.toLowerCase().includes(advanced.interesse.toLowerCase());
    return matchSearch && matchTipo && matchStatus && matchCidade && matchInteresse;
  });

  const totalClientes = contatosList.filter(c => c.tipo === 'Cliente').length;
  const totalProprietarios = contatosList.filter(c => c.tipo === 'Proprietário').length;
  const totalAtivos = contatosList.filter(c => c.status === 'Ativo').length;

  const stats = [
    { label: 'Total', value: contatosList.length, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Clientes', value: totalClientes, icon: User, color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40' },
    { label: 'Proprietários', value: totalProprietarios, icon: Building, color: 'text-violet-700 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950/40' },
    { label: 'Ativos', value: totalAtivos, icon: UserCheck, color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
  ];

  const filters: FilterType[] = ['Todos', 'Cliente', 'Proprietário'];

  const EmptyState = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 text-center px-4">
      <div className="mx-auto w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Search className="h-7 w-7 text-muted-foreground" />
      </div>
      <p className="font-bold text-foreground">Nenhum contato encontrado</p>
      <p className="text-sm text-muted-foreground mt-1">Tente ajustar os filtros ou adicione um novo contato.</p>
      <Button className="mt-6 gap-2 shadow-lg shadow-primary/20" onClick={() => setAddModalOpen(true)}>
        <Plus className="h-4 w-4" /> Novo Contato
      </Button>
    </motion.div>
  );

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <PageHeader
        title="Contatos"
        subtitle="Gerencie clientes e proprietários"
        icon={<Users />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Contatos' }
        ]}
        actions={
          <>
            <div className="flex items-center bg-muted/50 rounded-xl p-1 border border-border/50">
              <Button variant={viewMode === 'table' ? 'secondary' : 'ghost'} size="sm" className="h-9 w-9 p-0 rounded-lg" onClick={() => setViewMode('table')}>
                <ListIcon className="h-4 w-4" />
              </Button>
              <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="sm" className="h-9 w-9 p-0 rounded-lg" onClick={() => setViewMode('grid')}>
                <Grid className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={() => setAddModalOpen(true)} className="h-10 px-4 rounded-xl shadow-lg shadow-primary/20 gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Novo Contato</span>
            </Button>
          </>
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
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-black tracking-tight leading-none">{stat.value}</p>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <Card className="border-none shadow-sm bg-muted/30">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col gap-3">
            {/* Search row */}
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Buscar por nome, email ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background border-none shadow-sm focus-visible:ring-1 focus-visible:ring-primary/30"
              />
            </div>
            {/* Filter chips + Advanced filter button */}
            <div className="flex items-center gap-2 flex-wrap">
              {filters.map((f) => (
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
                  {f === 'Todos' ? 'Todos' : f === 'Cliente' ? 'Clientes' : 'Proprietários'}
                </button>
              ))}

              <div className="ml-auto flex items-center gap-2">
                {hasActiveAdvanced && (
                  <button
                    onClick={clearAdvanced}
                    className="h-7 px-2 rounded-full text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20 flex items-center gap-1 hover:bg-destructive/20 transition-colors"
                  >
                    <X className="h-3 w-3" /> Limpar filtros
                  </button>
                )}
                <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="gap-2 relative h-10 px-4 rounded-xl shadow-sm border-border"
                    >
                      <Filter className="h-4 w-4" />
                      <span className="hidden sm:inline">Filtros</span>
                      {hasActiveAdvanced && (
                        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold shadow-sm animate-in zoom-in">
                          !
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 p-4" align="end">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm">Filtros Avançados</h4>
                        {hasActiveAdvanced && (
                          <button onClick={clearAdvanced} className="text-xs text-destructive hover:underline font-semibold">Limpar</button>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</Label>
                        <Select value={advanced.status} onValueChange={(v) => setAdvanced(a => ({ ...a, status: v }))}>
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Todos">Todos</SelectItem>
                            <SelectItem value="Ativo">Ativo</SelectItem>
                            <SelectItem value="Em negociação">Em negociação</SelectItem>
                            <SelectItem value="Inativo">Inativo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cidade</Label>
                        <Input
                          placeholder="Ex: São Paulo"
                          value={advanced.cidade}
                          onChange={(e) => setAdvanced(a => ({ ...a, cidade: e.target.value }))}
                          className="h-9"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Interesse</Label>
                        <Input
                          placeholder="Ex: Apartamento"
                          value={advanced.interesse}
                          onChange={(e) => setAdvanced(a => ({ ...a, interesse: e.target.value }))}
                          className="h-9"
                        />
                      </div>

                      <Button className="w-full" size="sm" onClick={() => setFilterOpen(false)}>
                        Aplicar ({filteredContatos.length} resultado{filteredContatos.length !== 1 ? 's' : ''})
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Active filter indicator */}
            {filteredContatos.length < contatosList.length && (
              <p className="text-xs text-muted-foreground">
                Mostrando <span className="font-bold text-foreground">{filteredContatos.length}</span> de {contatosList.length} contatos
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <AnimatePresence mode="wait">
            {viewMode === 'table' ? (
              <motion.div key="table" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                {filteredContatos.length === 0 ? <EmptyState /> : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="font-bold min-w-[200px]">Contato</TableHead>
                          <TableHead className="font-bold hidden sm:table-cell">Tipo</TableHead>
                          <TableHead className="font-bold hidden md:table-cell">Interesse</TableHead>
                          <TableHead className="font-bold hidden lg:table-cell">Cidade</TableHead>
                          <TableHead className="font-bold text-center">Status</TableHead>
                          <TableHead className="w-[50px]" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredContatos.map((contato) => (
                          <TableRow key={contato.id} className="group cursor-pointer hover:bg-muted/40 transition-colors" onClick={() => openSheet(contato)}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9 border border-border group-hover:border-primary/40 transition-all shrink-0">
                                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                    {contato.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <div className="font-semibold text-sm group-hover:text-primary transition-colors truncate">{contato.nome}</div>
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5 truncate">
                                    <Mail className="h-3 w-3 shrink-0" /> {contato.email}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold', tipoColor(contato.tipo))}>
                                {contato.tipo}
                              </span>
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-sm font-medium">{contato.interesse}</TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3 shrink-0" /> {contato.cidade}
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold', statusColor(contato.status))}>
                                {contato.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openSheet(contato); }} className="gap-2"><User className="h-4 w-4" /> Ver detalhes</DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openSheet(contato); }} className="gap-2"><Edit className="h-4 w-4" /> Editar</DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDelete(contato); }} className="text-destructive gap-2"><Trash2 className="h-4 w-4" /> Excluir</DropdownMenuItem>
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
            ) : (
              <motion.div key="grid" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="p-3 sm:p-4">
                {filteredContatos.length === 0 ? <EmptyState /> : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                    {filteredContatos.map((contato) => (
                      <Card key={contato.id} className="group hover:border-primary/40 transition-all cursor-pointer overflow-hidden shadow-none hover:shadow-md" onClick={() => openSheet(contato)}>

                        <CardContent className="p-0">
                          <div className="p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
                            <Avatar className="h-11 w-11 border-2 border-border group-hover:border-primary/30 transition-all shrink-0">
                              <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                                {contato.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{contato.nome}</h3>
                                <span className={cn('inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold shrink-0', statusColor(contato.status))}>
                                  {contato.status}
                                </span>
                              </div>
                              <div className="space-y-1 mt-2">
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
                                  <Mail className="h-3 w-3 shrink-0" /> {contato.email}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <Phone className="h-3 w-3 shrink-0" /> {contato.telefone}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="px-4 sm:px-5 py-3 bg-muted/30 border-t flex items-center justify-between gap-2">
                            <div className="flex gap-1.5 flex-wrap">
                              <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold', tipoColor(contato.tipo))}>{contato.tipo}</span>
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-muted text-muted-foreground">{contato.interesse}</span>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); handleEdit(contato); }}><Edit className="h-3.5 w-3.5" /></Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={(e) => { e.stopPropagation(); handleDelete(contato); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      <ContatoDeleteModal open={deleteModalOpen} onClose={() => { setDeleteModalOpen(false); setContatoToDelete(null); }} contato={contatoToDelete} onConfirm={(e) => confirmDelete(e)} />

      {/* Add Contact Modal */}
      {/* Add Contact Modal -> Changed to Sheet */}
      <Sheet open={addModalOpen} onOpenChange={setAddModalOpen}>
        <SheetContent side="right" className="sm:max-w-[500px] p-0 overflow-y-auto custom-scrollbar border-none shadow-2xl">
          <div className="bg-gradient-to-r from-primary to-primary/80 p-5 sm:p-6 sticky top-0 z-10">
            <SheetHeader>
              <SheetTitle className="text-white text-lg sm:text-xl font-black">Novo Contato</SheetTitle>
              <p className="text-white/80 text-sm mt-1">Preencha as informações do novo contato</p>
            </SheetHeader>
          </div>
          <div className="p-5 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="nome" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Nome Completo *</Label>
                <Input id="nome" value={newContato.nome} onChange={(e) => setNewContato({ ...newContato, nome: e.target.value })} placeholder="Ex: Maria Silva" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">E-mail *</Label>
                <Input id="email" type="email" value={newContato.email} onChange={(e) => setNewContato({ ...newContato, email: e.target.value })} placeholder="email@exemplo.com" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="telefone" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Telefone *</Label>
                <Input id="telefone" value={newContato.telefone} onChange={(e) => setNewContato({ ...newContato, telefone: maskPhone(e.target.value) })} placeholder="(00) 99999-0000" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tipo *</Label>
                <Select value={newContato.tipo} onValueChange={(v) => setNewContato({ ...newContato, tipo: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cliente">Cliente</SelectItem>
                    <SelectItem value="Proprietário">Proprietário</SelectItem>
                    <SelectItem value="Ambos">Ambos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</Label>
                <Select value={newContato.status} onValueChange={(v) => setNewContato({ ...newContato, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Em negociação">Em negociação</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="interesse" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Interesse</Label>
                <Input id="interesse" value={newContato.interesse} onChange={(e) => setNewContato({ ...newContato, interesse: e.target.value })} placeholder="Ex: Apartamento" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cidade" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cidade</Label>
                <Input id="cidade" value={newContato.cidade} onChange={(e) => setNewContato({ ...newContato, cidade: e.target.value })} placeholder="Ex: São Paulo" />
              </div>
            </div>
          </div>
          <SheetFooter className="px-5 sm:px-6 pb-5 sm:pb-6 gap-2 flex-col sm:flex-row mt-6">
            <Button variant="outline" onClick={() => setAddModalOpen(false)} className="w-full sm:w-auto">Cancelar</Button>
            <Button onClick={(e) => handleAddContato(e)} className="gap-2 shadow-lg shadow-primary/20 w-full sm:w-auto">
              <Plus className="h-4 w-4" /> Adicionar Contato
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Contact Detail/Edit Sheet */}
      <ContactSheet
        contato={selectedContato}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSave={handleSheetSave}
        onDelete={handleSheetDelete}
        onViewProfile={handleViewProfile}
      />
    </div>
  );
}
