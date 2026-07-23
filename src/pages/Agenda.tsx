import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, CheckCircle2, X, Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { useAnimation } from '@/components/shared/ActionAnimation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  MapPin, CheckSquare, PhoneCall, Users, FileText, Key,
  BarChart, Activity, Play
} from 'lucide-react';
import { ModoRoleta } from '@/components/roleta/ModoRoleta';

// ─── Shared Mock Data ───────────────────────────────────────────────────────
const clientes = [
  { id: '1', name: 'Maria Santos', email: 'maria@email.com', phone: '11 99999-0001' },
  { id: '2', name: 'Carlos Oliveira', email: 'carlos@email.com', phone: '11 99999-0002' },
  { id: '3', name: 'João Silva', email: 'joao@email.com', phone: '11 99999-0003' },
  { id: '4', name: 'Ana Costa', email: 'ana@email.com', phone: '11 99999-0004' },
];

const eventosData = [
  { id: '1', titulo: 'Visita - Cobertura Jardins', cliente: 'João Silva', data: new Date().toISOString().split('T')[0], horario: '14:00', duracao: '1h', tipo: 'visita', prioridade: 'alta', concluida: false },
  { id: '2', titulo: 'Fechamento de Contrato', cliente: 'Maria Santos', data: new Date().toISOString().split('T')[0], horario: '10:00', duracao: '45min', tipo: 'reuniao', prioridade: 'alta', concluida: true },
  { id: '3', titulo: 'Follow-up Lead Frio', cliente: 'Carlos Oliveira', data: new Date().toISOString().split('T')[0], horario: '16:30', duracao: '30min', tipo: 'ligacao', prioridade: 'baixa', concluida: false },
  { id: '4', titulo: 'Vistoria de Chaves', cliente: 'Ana Costa', data: new Date(Date.now() + 86400000).toISOString().split('T')[0], horario: '09:00', duracao: '1h', tipo: 'vistoria', prioridade: 'media', concluida: false },
  { id: '5', titulo: 'Apresentação Lançamento', cliente: 'João Silva', data: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], horario: '15:00', duracao: '2h', tipo: 'apresentacao', prioridade: 'alta', concluida: false },
  { id: '6', titulo: 'Firma em Cartório', cliente: 'Maria Santos', data: new Date(Date.now() - 86400000).toISOString().split('T')[0], horario: '11:00', duracao: '1h', tipo: 'contrato', prioridade: 'alta', concluida: true },
];

const getTipoIcon = (tipo: string) => {
  switch (tipo) {
    case 'visita': return MapPin;
    case 'reuniao': return Users;
    case 'ligacao': return PhoneCall;
    case 'vistoria': return Key;
    case 'apresentacao': return BarChart;
    case 'contrato': return FileText;
    default: return CheckSquare;
  }
};

const getTipoColor = (tipo: string) => {
  switch (tipo) {
    case 'visita': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900';
    case 'reuniao': return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900';
    case 'ligacao': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900';
    case 'vistoria': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900';
    case 'apresentacao': return 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-900';
    case 'contrato': return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900';
    default: return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800';
  }
};

const getPriorityStyles = (prio: string) => {
  if (prio === 'alta') return 'bg-red-500 text-white shadow-red-500/30';
  if (prio === 'media') return 'bg-amber-500 text-white shadow-amber-500/30';
  return 'bg-emerald-500 text-white shadow-emerald-500/30';
};

// ─── Main Component ─────────────────────────────────────────────────────────

export function Agenda() {
  const { triggerAnimation } = useAnimation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month' | 'list'>('day');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [eventos, setEventos] = useState(eventosData);
  const [modoRoletaOpen, setModoRoletaOpen] = useState(false);

  // Modals state
  const [showNewActivityModal, setShowNewActivityModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState<any>(null);
  const [completionNote, setCompletionNote] = useState('');

  // ─── Query Params Handling ───
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'nova-atividade') {
      setShowNewActivityModal(true);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  // ─── Date Math / Helpers ───
  const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  const endOfDay = new Date(startOfDay); endOfDay.setDate(endOfDay.getDate() + 1);

  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  // ─── Filter Events by currently viewed period ───
  const periodEvents = useMemo(() => {
    return eventos.filter(e => {
      const eDate = new Date(e.data + 'T00:00:00'); // local time safe
      if (viewMode === 'day' || viewMode === 'list') return eDate >= startOfDay && eDate < endOfDay;
      if (viewMode === 'week') return eDate >= startOfWeek && eDate < endOfWeek;
      if (viewMode === 'month') return eDate >= startOfMonth && eDate <= endOfMonth;
      return false;
    });
  }, [eventos, currentDate, viewMode]);

  // ─── Metrics Calculation ───
  const totalPeriod = periodEvents.length;
  const completedPeriod = periodEvents.filter(e => e.concluida).length;
  const visitas = periodEvents.filter(e => e.tipo === 'visita').length;
  const reunioes = periodEvents.filter(e => e.tipo === 'reuniao').length;
  const completionRate = totalPeriod > 0 ? Math.round((completedPeriod / totalPeriod) * 100) : 0;

  // ─── Navigation ───
  const navDate = (dir: number) => {
    const d = new Date(currentDate);
    if (viewMode === 'day' || viewMode === 'list') d.setDate(d.getDate() + dir);
    else if (viewMode === 'week') d.setDate(d.getDate() + dir * 7);
    else if (viewMode === 'month') d.setMonth(d.getMonth() + dir);
    setCurrentDate(d);
  };

  const getViewTitle = () => {
    if (viewMode === 'month') return currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    if (viewMode === 'week') return `${startOfWeek.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} a ${new Date(endOfWeek.getTime() - 1).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}`;
    return currentDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  // ─── Actions ───
  const handleComplete = (evento: any) => {
    if (evento.concluida) {
      toast({ title: 'Atenção', description: 'Atividade já está concluída.', variant: 'default' });
      return;
    }
    setSelectedEvento(evento);
    setCompletionNote('');
    setShowCompleteModal(true);
  };

  const confirmComplete = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    triggerAnimation({
      type: 'success',
      startX: rect.left + rect.width / 2,
      startY: rect.top + rect.height / 2,
      icon: CheckCircle2
    });
    setEventos(prev => prev.map(e => e.id === selectedEvento.id ? { ...e, concluida: true } : e));
    toast({ title: "Sensacional!", description: `A atividade "${selectedEvento.titulo}" foi concluída.`, variant: "success" });
    setShowCompleteModal(false);
  };

  const handleNewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rect = (e.target as HTMLFormElement).getBoundingClientRect();
    triggerAnimation({
      type: 'success',
      startX: rect.left + rect.width / 2,
      startY: rect.top + rect.height / 2,
      icon: CalendarIcon
    });
    toast({ title: "Criado!", description: "Nova atividade foi agendada.", variant: "success" });
    setShowNewActivityModal(false);
  };

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        title="Agenda"
        subtitle="Seus compromissos e tarefas"
        icon={<CalendarIcon />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Agenda' }
        ]}
        actions={
          <>
            <Tabs value={viewMode} onValueChange={(v: any) => setViewMode(v)} className="w-full sm:w-[300px] h-12 bg-muted/50 p-1 rounded-2xl border border-border/50">
              <TabsList className="grid w-full grid-cols-3 h-full bg-transparent p-0">
                <TabsTrigger value="day" className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm">Diário</TabsTrigger>
                <TabsTrigger value="week" className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm">Semanal</TabsTrigger>
                <TabsTrigger value="month" className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm">Mensal</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" onClick={() => setModoRoletaOpen(true)} className="h-10 border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold rounded-xl shadow-sm">
              <Play className="h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">Modo Foco</span>
            </Button>
            <Button onClick={() => setShowNewActivityModal(true)} className="h-10 px-4 rounded-xl shadow-lg shadow-primary/20 gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Nova Atividade</span>
            </Button>
          </>
        }
      />

      {/* ── KPI METRICS ROW ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPIBox title="Total do Período" value={totalPeriod} sub="atividades" icon={Activity} color="text-amber-500" bg="bg-amber-500/10" />
        <KPIBox title="Concluídas" value={`${completionRate}%`} sub={`${completedPeriod} de ${totalPeriod}`} icon={CheckCircle2} color="text-emerald-500" bg="bg-emerald-500/10" />
        <KPIBox title="Visitas Físicas" value={visitas} sub="agendadas" icon={MapPin} color="text-blue-500" bg="bg-blue-500/10" />
        <KPIBox title="Reuniões/Calls" value={reunioes} sub="marcadas" icon={Users} color="text-purple-500" bg="bg-purple-500/10" />
      </div>

      <div className="flex flex-col xl:flex-row gap-6">

        {/* ── MAIN CALENDAR AREA ── */}
        <Card className="flex-1 shadow-sm border-border/40 overflow-hidden bg-background/50 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-b border-border/40 bg-muted/5">
            <h2 className="text-xl font-bold text-foreground capitalize flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" /> {getViewTitle()}
            </h2>
            <div className="flex items-center gap-1 mt-4 sm:mt-0 bg-background border rounded-lg p-1 shadow-sm">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => navDate(-1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground" onClick={() => setCurrentDate(new Date())}>
                Hoje
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => navDate(1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="p-0 sm:p-6 bg-muted/5 min-h-[500px]">
            <AnimatePresence mode="wait">
              {/* DAY VIEW (Timeline mapping) */}
              {(viewMode === 'day' || viewMode === 'list') && (
                <motion.div key="day" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4 px-4 sm:px-0 py-4 sm:py-0">
                  {periodEvents.length === 0 ? (
                    <EmptyAgenda msg="Nenhum compromisso para este dia." />
                  ) : (
                    <div className="relative border-l-2 border-primary/20 ml-4 sm:ml-8 space-y-8 pb-4">
                      {periodEvents.sort((a, b) => a.horario.localeCompare(b.horario)).map((ev, i) => {
                        const Icon = getTipoIcon(ev.tipo);
                        return (
                          <div key={ev.id} className="relative pl-6 sm:pl-8 group">
                            {/* Dot */}
                            <div className={cn("absolute -left-[9px] top-6 h-4 w-4 rounded-full border-[3px] border-background shadow-sm transition-all", ev.concluida ? "bg-emerald-500" : "bg-primary group-hover:scale-110")} />
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                              <div className="text-sm font-black text-foreground shrink-0 pt-0.5 w-16 text-right hidden sm:block">
                                {ev.horario}
                              </div>
                              <div className={cn("flex-1 p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-center min-h-[100px]", ev.concluida ? "bg-muted/30 border-dashed border-border/60 opacity-70" : "bg-background shadow-sm hover:shadow-md border-border/80 hover:border-primary/40")}>
                                <div className="absolute top-3 right-3 flex gap-2">
                                  {ev.concluida ? (
                                    <Badge variant="outline" className="text-emerald-500 border-emerald-200 bg-emerald-50 gap-1"><CheckCircle2 className="h-3 w-3" /> Concluído</Badge>
                                  ) : (
                                    <Button variant="ghost" size="sm" className="h-7 px-3 text-xs border border-border/50 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 shadow-sm" onClick={(e) => { e.stopPropagation(); handleComplete(ev); }}>Concluir</Button>
                                  )}
                                </div>
                                <div className="flex items-start gap-4 pr-24">
                                  <div className={cn("h-10 w-10 shrink-0 rounded-xl flex items-center justify-center border", getTipoColor(ev.tipo))}>
                                    <Icon className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <h3 className={cn("text-base font-bold tracking-tight mb-1", ev.concluida && "line-through text-muted-foreground")}>{ev.titulo}</h3>
                                    <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                                      <span className="w-5 h-5 bg-muted rounded-full flex items-center justify-center text-[9px] text-foreground font-bold">{ev.cliente.charAt(0)}</span>
                                      {ev.cliente}
                                      <span className="px-1.5 py-0.5 ml-2 bg-muted rounded text-[10px]">{ev.duracao}</span>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* MONTH VIEW */}
              {viewMode === 'month' && (
                <motion.div key="month" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 sm:p-0">
                  <div className="grid grid-cols-7 gap-px bg-border/50 rounded-2xl overflow-hidden border border-border/50 shadow-sm">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
                      <div key={d} className="bg-muted/40 py-3 text-center text-xs font-bold text-muted-foreground uppercase tracking-widest">{d}</div>
                    ))}
                    {Array.from({ length: 42 }).map((_, i) => {
                      const date = new Date(startOfMonth);
                      date.setDate(date.getDate() - date.getDay() + i);
                      const isCurrentM = date.getMonth() === currentDate.getMonth();
                      const isToday = date.toDateString() === new Date().toDateString();
                      const evs = eventos.filter(e => new Date(e.data + 'T00:00:00').toDateString() === date.toDateString());

                      return (
                        <div key={i} onClick={() => { setCurrentDate(date); setViewMode('day'); }} className={cn("bg-background min-h-[90px] sm:min-h-[110px] p-1 sm:p-2 border-r border-b border-border/20 cursor-pointer hover:bg-muted/10 transition-colors relative", !isCurrentM && "opacity-40 bg-muted/20")}>
                          <span className={cn("text-xs sm:text-sm font-semibold flex items-center justify-center h-6 w-6 sm:h-7 sm:w-7 rounded-full", isToday ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground/80")}>
                            {date.getDate()}
                          </span>
                          <div className="mt-1 flex flex-col gap-1 px-0.5">
                            {evs.slice(0, 3).map(e => (
                              <div key={e.id} className={cn("text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded font-bold truncate border border-transparent line-clamp-1", getTipoColor(e.tipo).replace('/10', '/20'))}>
                                {e.horario} {e.titulo.split('-')[0]}
                              </div>
                            ))}
                            {evs.length > 3 && <p className="text-[9px] text-muted-foreground font-bold px-1">+ {evs.length - 3} mais</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* WEEK VIEW */}
              {viewMode === 'week' && (
                <motion.div key="week" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 sm:p-0">
                  <div className="grid grid-cols-1 sm:grid-cols-7 gap-4">
                    {Array.from({ length: 7 }).map((_, i) => {
                      const d = new Date(startOfWeek); d.setDate(d.getDate() + i);
                      const isToday = d.toDateString() === new Date().toDateString();
                      const evs = eventos.filter(e => new Date(e.data + 'T00:00:00').toDateString() === d.toDateString());

                      return (
                        <div key={i} onClick={() => { setCurrentDate(d); setViewMode('day'); }} className={cn("flex flex-col gap-3 rounded-2xl p-3 border transition-all cursor-pointer", isToday ? "border-primary/50 shadow-md bg-primary/[0.02]" : "border-border/60 bg-background hover:bg-muted/20 hover:border-border")}>
                          <div className="text-center pb-2 border-b border-border/40">
                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{d.toLocaleDateString('pt-BR', { weekday: 'short' })}</p>
                            <p className={cn("text-xl font-bold mt-1", isToday ? "text-primary" : "text-foreground")}>{d.getDate()}</p>
                          </div>
                          <div className="flex-1 space-y-2">
                            {evs.length === 0 ? <p className="text-xs text-muted-foreground/50 text-center mt-4">Livre</p> : evs.map(e => (
                              <div key={e.id} className={cn("p-2 rounded-lg border text-xs", getTipoColor(e.tipo))}>
                                <p className="font-bold">{e.horario}</p>
                                <p className="truncate opacity-80 mt-0.5">{e.titulo}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>

        {/* ── ALERTS / NEXT SIDEBAR ── */}
        <div className="w-full xl:w-80 space-y-4">
          <div className="bg-primary hover:bg-primary/95 transition-colors rounded-2xl p-5 text-primary-foreground shadow-md cursor-pointer flex flex-col justify-center" onClick={() => { setViewMode('day'); setCurrentDate(new Date()); }}>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-black text-lg flex items-center gap-2">Radar do Dia</h3>
              <Activity className="h-5 w-5 opacity-70" />
            </div>
            <p className="text-primary-foreground/80 text-sm">{periodEvents.filter(e => !e.concluida).length} atividades para hoje.</p>
          </div>

          <div className="bg-background rounded-2xl border border-border/50 shadow-sm p-5">
            <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-widest flex items-center justify-between border-b border-border/40 pb-3 mb-4">
              <span>Próximas Tarefas</span>
              <Badge variant="secondary" className="font-bold">{eventos.filter(e => !e.concluida).length}</Badge>
            </h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {eventos.filter(e => !e.concluida && new Date(e.data + 'T00:00') >= startOfDay).sort((a, b) => a.data.localeCompare(b.data)).map(e => {
                const Icon = getTipoIcon(e.tipo);
                const isToday = e.data === startOfDay.toISOString().split('T')[0];
                return (
                  <div key={e.id} className="p-3 bg-background rounded-xl border border-border/60 hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer group" onClick={() => { setCurrentDate(new Date(e.data + 'T00:00')); setViewMode('day'); }}>
                    <div className="flex items-center justify-between mb-2">
                      {isToday ? <Badge className="bg-blue-500 text-[10px] px-1.5 py-0 border-none">Hoje</Badge> : <Badge variant="outline" className="text-[10px] px-2 py-0 text-muted-foreground bg-muted/30">{new Date(e.data + 'T00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</Badge>}
                      <span className="text-[11px] font-black text-foreground opacity-60 group-hover:text-primary transition-colors">{e.horario}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className={cn("p-1.5 rounded-lg border", getTipoColor(e.tipo))}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold leading-tight truncate">{e.titulo}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{e.cliente}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── SHEETS ── */}
      <Sheet open={showCompleteModal} onOpenChange={setShowCompleteModal}>
        <SheetContent side="right" className="max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-emerald-600"><CheckCircle2 className="h-5 w-5" /> Concluir "{selectedEvento?.titulo}"</SheetTitle>
          </SheetHeader>
          <div className="py-6">
            <Label>Notas do fechamento (opcional)</Label>
            <Textarea value={completionNote} onChange={e => setCompletionNote(e.target.value)} placeholder="Deixe um registro do que aconteceu..." className="mt-2 min-h-[150px]" />
          </div>
          <SheetFooter>
            <Button variant="ghost" onClick={() => setShowCompleteModal(false)}>Cancelar</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2" onClick={(e) => confirmComplete(e)}>Confirmar Conclusão</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={showNewActivityModal} onOpenChange={setShowNewActivityModal}>
        <SheetContent side="right" className="max-w-xl overflow-y-auto custom-scrollbar">
          <SheetHeader className="mb-6">
            <SheetTitle>Agendar Nova Atividade</SheetTitle>
          </SheetHeader>
          <form onSubmit={handleNewSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Assunto / Título</Label>
              <Input required placeholder="Ex: Apresentação Empreendimento X" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data</Label>
                <Input type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="space-y-2">
                <Label>Horário</Label>
                <Input type="time" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Atividade</Label>
                <Select defaultValue="visita">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visita">Visita a Imóvel</SelectItem>
                    <SelectItem value="reuniao">Reunião / Call</SelectItem>
                    <SelectItem value="ligacao">Ligação de Follow-up</SelectItem>
                    <SelectItem value="vistoria">Vistoria de Chaves</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Prioridade</Label>
                <Select defaultValue="media">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta (Urgente)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Cliente Vinculado</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Selecione um cliente..." /></SelectTrigger>
                <SelectContent>
                  {clientes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <SheetFooter className="mt-8 pt-6 border-t border-border">
              <Button type="button" variant="ghost" className="w-full sm:w-auto" onClick={() => setShowNewActivityModal(false)}>Cancelar</Button>
              <Button type="submit" className="w-full sm:w-auto">Agendar</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {modoRoletaOpen && (
        <ModoRoleta 
          eventos={eventos} 
          onConcluir={(id) => setEventos(prev => prev.map(e => e.id === id ? { ...e, concluida: true } : e))} 
          onClose={() => setModoRoletaOpen(false)} 
        />
      )}
    </div>
  );
}

// ─── Extras ─────────────────────────────────────────────────────────────────
function KPIBox({ title, value, sub, icon: Icon, color, bg }: { title: string, value: any, sub: string, icon: any, color: string, bg: string }) {
  return (
    <div className="bg-background rounded-2xl border border-border/50 p-5 shadow-sm flex items-start gap-4 transition-transform hover:-translate-y-1">
      <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center shrink-0", bg, color)}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1.5">{title}</p>
        <div className="flex items-baseline gap-2">
          <h4 className="text-3xl font-black text-foreground leading-none">{value}</h4>
        </div>
        <p className="text-xs text-muted-foreground mt-1 opacity-80">{sub}</p>
      </div>
    </div>
  );
}

function EmptyAgenda({ msg }: { msg: string }) {
  return (
    <div className="py-16 text-center border-2 border-dashed border-border/50 rounded-2xl bg-muted/10 mx-6">
      <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
        <CalendarIcon className="h-8 w-8 text-muted-foreground/40" />
      </div>
      <h3 className="text-base font-bold text-foreground">A agenda está limpa!</h3>
      <p className="text-sm text-muted-foreground max-w-[250px] mx-auto mt-1">{msg} Aproveite para fazer captações ou adiantar tarefas.</p>
    </div>
  );
}
