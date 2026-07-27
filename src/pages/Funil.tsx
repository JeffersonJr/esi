import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Bot, Search, ChevronDown, MessageCircle, Phone, Plus, ListFilter, Filter, Settings2, X, CheckCircle2 } from 'lucide-react'
import {
  atendimentos as dadosAtendimentos,
  etapaConfig,
  funis,
  getFunil,
  origemConfig,
  tempConfig,
  type Atendimento,
  type EtapaFunil,
  type Funil,
} from '@/lib/app-data'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

import { cn } from '@/lib/utils'
import { PageHeader } from '@/components/layout/PageHeader'
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd'
import { AtendimentoDetail } from '@/components/shared/atendimento-detail'
import { FiltrosAvancadosSheet } from '@/components/shared/filtros-avancados-sheet'
import { GerenciarFunilSheet } from '@/components/shared/gerenciar-funil-sheet'
import { type Temperatura, type OrigemLead, type EventoTimeline } from '@/lib/app-data'

type FiltroModo = 'todos' | 'venda' | 'locacao'



export function Funil({
  onVerCliente,
  abrirAtendimentoId: propsAbrirAtendimentoId,
  onAtendimentoAberto
}: {
  onVerCliente?: (id: string) => void
  abrirAtendimentoId?: string | null
  onAtendimentoAberto?: () => void
}) {
  const { id } = useParams()
  const abrirAtendimentoId = propsAbrirAtendimentoId || id
  const [funilAtivo, setFunilAtivo] = useState<Funil>(funis[0])

  const [filtroModo, setFiltroModo] = useState<FiltroModo>('todos')
  const [estagioAtivo, setEstagioAtivo] = useState(0)
  const [atendimentoAberto, setAtendimentoAberto] = useState<Atendimento | null>(null)
  const [dados, setDados] = useState(dadosAtendimentos)
  const [mostrarSeletorFunil, setMostrarSeletorFunil] = useState(false)
  const [mostrarNovoFunil, setMostrarNovoFunil] = useState(false)
  const [novoFunilNome, setNovoFunilNome] = useState('')
  const [funisList, setFunisList] = useState(funis)
  const [mostrarGerenciarFunil, setMostrarGerenciarFunil] = useState(false)

  useEffect(() => {
    const handleUpdate = () => {
      setDados([...dadosAtendimentos])
    }
    window.addEventListener('app-data-updated', handleUpdate)
    return () => window.removeEventListener('app-data-updated', handleUpdate)
  }, [])
  const [mostrarFiltrosAvancados, setMostrarFiltrosAvancados] = useState(false)
  const [filtroTemp, setFiltroTemp] = useState<Temperatura | 'todas'>('todas')
  const [filtroOrigem, setFiltroOrigem] = useState<OrigemLead[]>([])
  const [filtroPreAtendimento, setFiltroPreAtendimento] = useState<'todos' | 'sim' | 'nao'>('todos')
  const [filtroPeriodo, setFiltroPeriodo] = useState('todos')
  const [filtroNome, setFiltroNome] = useState('')

  useEffect(() => {
    if (abrirAtendimentoId) {
      const atd = dados.find((a) => a.id === abrirAtendimentoId)
      if (atd) {
        // Change to the correct funnel and stage if needed
        const funilDesteAtd = funisList.find(f => f.id === atd.funilId)
        if (funilDesteAtd) setFunilAtivo(funilDesteAtd)
        setAtendimentoAberto(atd)
        onAtendimentoAberto?.()
      }
    }
  }, [abrirAtendimentoId, dados, funisList, onAtendimentoAberto])

  const pipeline = getFunil(funilAtivo.id, filtroModo === 'todos' ? undefined : filtroModo).map((e) => ({
    ...e,
    atendimentos: dados.filter(
      (a) =>
        a.funilId === funilAtivo.id &&
        a.status === 'aberto' &&
        a.etapa === e.id &&
        (filtroModo === 'todos' || a.modo === filtroModo) &&
        (filtroTemp === 'todas' || a.temperatura === filtroTemp) &&
        (filtroOrigem.length === 0 || filtroOrigem.includes(a.origem)) &&
        (filtroPreAtendimento === 'todos' || (filtroPreAtendimento === 'sim' ? a.preAtendimento : !a.preAtendimento)) &&
        (filtroNome === '' || a.nome.toLowerCase().includes(filtroNome.toLowerCase())) &&
        (filtroPeriodo === 'todos' ||
          (filtroPeriodo === 'hoje' ? a.dataEntrada.toLowerCase() === 'hoje' : true) || // Mock filtering logic
          (filtroPeriodo === 'essa_semana' ? ['hoje', 'ontem'].includes(a.dataEntrada.toLowerCase()) || a.dataEntrada.includes('/') : true)
        ),
    ),
  }))

  const total = pipeline.reduce((acc, e) => acc + e.atendimentos.length, 0)


  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return
    
    if (destination.droppableId !== source.droppableId) {
      handleEtapaChange(draggableId, destination.droppableId)
    }
  }

  function handleStatusChange(id: string, status: 'ganho' | 'perdido') {
    setDados((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
    setAtendimentoAberto(null)
  }

  function handleEtapaChange(id: string, etapa: EtapaFunil) {
    const oldEtapaId = dadosAtendimentos.find(a => a.id === id)?.etapa
    const oldEtapaNome = funilAtivo.etapas?.find((e) => e.id === oldEtapaId)?.label || oldEtapaId || 'desconhecida'
    const etapaNome = funilAtivo.etapas?.find((e) => e.id === etapa)?.label || etapa

    const newTimelineEvent: EventoTimeline = {
      id: `tl-${Date.now()}`,
      tipo: 'etapa',
      descricao: `Cliente foi da etapa ${oldEtapaNome} para etapa ${etapaNome}`,
      data: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    }

    const idx = dadosAtendimentos.findIndex(a => a.id === id)
    if (idx !== -1) {
      dadosAtendimentos[idx].etapa = etapa
      dadosAtendimentos[idx].timeline = [newTimelineEvent, ...dadosAtendimentos[idx].timeline]
    }

    setDados((prev) => prev.map((a) => (a.id === id ? { ...a, etapa, timeline: [newTimelineEvent, ...a.timeline] } : a)))
    setAtendimentoAberto((prev) => (prev?.id === id ? { ...prev, etapa, timeline: [newTimelineEvent, ...prev.timeline] } : prev))
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('app-data-updated'))
    }
  }

  function criarFunil() {
    if (!novoFunilNome.trim()) return
    const novo: Funil = {
      id: `funil-${Date.now()}`,
      nome: novoFunilNome.trim(),
      descricao: 'Funil personalizado',
      cor: 'bg-teal-mid text-white',
    }
    setFunisList((prev) => [...prev, novo])
    setFunilAtivo(novo)
    setNovoFunilNome('')
    setMostrarNovoFunil(false)
    setMostrarSeletorFunil(false)
  }

  if (atendimentoAberto) {
    const atual = dados.find((a) => a.id === atendimentoAberto.id) ?? atendimentoAberto
    return (
      <AtendimentoDetail
        atendimento={atual}
        onBack={() => setAtendimentoAberto(null)}
        onStatusChange={handleStatusChange}
        onEtapaChange={handleEtapaChange}
      />
    )
  }

  return (
    <div className="flex h-full flex-col pb-6 animate-fade-in bg-slate-50/50 dark:bg-slate-900/50">
      <PageHeader
        title="ESI Leads"
        subtitle={`${total} em andamento no funil`}
        icon={<ListFilter />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Leads' }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setMostrarSeletorFunil(!mostrarSeletorFunil)}
                className="flex items-center gap-2 rounded-xl bg-card px-4 py-2 shadow-sm transition-brand active:scale-95 border border-border h-10"
              >
                <div className="flex flex-col text-left">
                  <span className="text-sm font-semibold text-foreground flex items-center justify-between gap-1.5">
                    {funilAtivo.nome}
                    <ChevronDown className={`size-4 text-muted-foreground transition-transform ${mostrarSeletorFunil ? 'rotate-180' : ''}`} strokeWidth={2} />
                  </span>
                </div>
              </button>

              {/* Dropdown de funis */}
              {mostrarSeletorFunil && (
                <div className="absolute top-12 right-0 z-50 w-64 mt-2 rounded-2xl bg-card shadow-xl border border-border overflow-hidden animate-in fade-in duration-150">
                  <ul className="flex flex-col p-2">
                    {funisList.map((f) => (
                      <li key={f.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setFunilAtivo(f)
                            setMostrarSeletorFunil(false)
                          }}
                          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-brand ${funilAtivo.id === f.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50 text-foreground'
                            }`}
                        >
                          <div className="flex-1">
                            <span className="block text-sm font-semibold">{f.nome}</span>
                            <span className="block text-[10px] text-muted-foreground">{f.descricao}</span>
                          </div>
                          {funilAtivo.id === f.id && <CheckCircle2 className="size-4" strokeWidth={2} />}
                        </button>
                      </li>
                    ))}
                  </ul>
                  {!mostrarNovoFunil ? (
                    <button
                      type="button"
                      onClick={() => setMostrarNovoFunil(true)}
                      className="flex w-full items-center gap-3 border-t border-border px-4 py-3 text-left text-xs font-semibold text-primary transition-brand hover:bg-primary/5"
                    >
                      <Plus className="size-4" strokeWidth={2} />
                      Criar novo funil
                    </button>
                  ) : (
                    <div className="border-t border-border p-2 flex gap-2">
                      <input
                        type="text"
                        value={novoFunilNome}
                        onChange={(e) => setNovoFunilNome(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && criarFunil()}
                        placeholder="Nome..."
                        autoFocus
                        className="flex-1 h-8 rounded-lg border border-border bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                      <button
                        type="button"
                        onClick={criarFunil}
                        className="h-8 px-2 rounded-lg bg-primary text-[10px] font-semibold text-primary-foreground"
                      >
                        Criar
                      </button>
                      <button
                        type="button"
                        onClick={() => { setMostrarNovoFunil(false); setNovoFunilNome('') }}
                        className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground"
                      >
                        <X className="size-3" strokeWidth={1.5} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMostrarGerenciarFunil(true)}
              className="flex size-10 items-center justify-center rounded-xl bg-card border border-border shadow-sm transition-brand active:scale-95 text-muted-foreground hover:text-foreground"
            >
              <Settings2 className="size-5" strokeWidth={1.5} />
            </button>

            <Button
              variant="outline"
              onClick={() => setMostrarFiltrosAvancados(true)}
              className="gap-2 relative h-10 px-4 rounded-xl shadow-sm border-border"
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filtros</span>
              {(filtroTemp !== 'todas' || filtroOrigem.length > 0 || filtroPreAtendimento !== 'todos' || filtroPeriodo !== 'todos' || filtroNome !== '') && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold shadow-sm animate-in zoom-in">
                  !
                </span>
              )}
            </Button>
          </div>
        }
      />

      <div className="px-5 mb-4 mt-2">
        <Card className="border-none shadow-sm bg-muted/30">
          <CardContent className="p-3 sm:p-4 space-y-3">
            {/* Row 1 — Search */}
            <div className="flex gap-2">
              <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="Buscar por nome no funil..." 
                  value={filtroNome} 
                  onChange={(e) => setFiltroNome(e.target.value)} 
                  className="pl-10 bg-background border-none shadow-sm h-9" 
                />
              </div>
            </div>

            {/* Row 2 — Tipo quick chips (horizontal scroll) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {([
                { id: 'todos', label: 'Todos' },
                { id: 'venda', label: 'Venda' },
                { id: 'locacao', label: 'Locação' },
              ] as { id: FiltroModo; label: string }[]).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFiltroModo(f.id)}
                  className={cn(
                    'h-7 px-3 rounded-full text-xs font-semibold border transition-all shrink-0',
                    filtroModo === f.id
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'bg-background text-foreground border-border hover:border-primary/60 hover:bg-primary/5'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
            
            {total > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Mostrando <span className="font-bold text-foreground">{total}</span> leads em andamento
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Quadro Kanban (Colunas lado a lado) ── */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden px-5 pb-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex h-full gap-4 items-start w-max">
            {pipeline.map((estagio) => (
              <div key={estagio.id} className="flex flex-col h-[calc(100vh-280px)] w-[320px] shrink-0 bg-muted/30 rounded-[1.25rem] border border-border/60 overflow-hidden shadow-sm">
                <div className="px-4 py-3 border-b border-border/40 bg-card/40 backdrop-blur-sm flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                      {funilAtivo.etapas?.find(e => e.id === estagio.id)?.label || estagio.id}
                    </h3>
                    <span className="flex size-6 items-center justify-center rounded-full bg-background border border-border text-[11px] font-mono font-semibold text-muted-foreground shadow-sm">
                      {estagio.atendimentos.length}
                    </span>
                  </div>
                  {(() => {
                    const parseValor = (v?: string) => {
                      if (!v) return 0;
                      const nums = v.replace(/[^\d]/g, '');
                      return parseInt(nums, 10) || 0;
                    };
                    const vgv = estagio.atendimentos.filter(a => a.modo === 'venda' || !a.modo).reduce((acc, a) => acc + parseValor(a.valor), 0);
                    const vgl = estagio.atendimentos.filter(a => a.modo === 'locacao').reduce((acc, a) => acc + parseValor(a.valor), 0);
                    if (vgv === 0 && vgl === 0) return null;
                    return (
                      <div className="flex flex-col gap-0.5 mt-1 border-t border-border/30 pt-2">
                        {vgv > 0 && (
                          <div className="flex items-center justify-between text-[11px] font-medium">
                            <span className="text-muted-foreground">VGV</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(vgv)}</span>
                          </div>
                        )}
                        {vgl > 0 && (
                          <div className="flex items-center justify-between text-[11px] font-medium">
                            <span className="text-muted-foreground">VGL</span>
                            <span className="text-blue-600 dark:text-blue-400 font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(vgl)}</span>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
                
                <Droppable droppableId={estagio.id}>
                  {(provided, snapshot) => (
                    <div 
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent transition-colors ${snapshot.isDraggingOver ? 'bg-primary/5' : ''}`}
                    >
                      {estagio.atendimentos.length === 0 && !snapshot.isDraggingOver && (
                        <div className="mt-10 flex flex-col items-center gap-2 text-center px-4">
                          <div className="size-12 rounded-full bg-muted/50 flex items-center justify-center text-xl shadow-inner">
                            🎯
                          </div>
                          <p className="text-xs text-muted-foreground font-medium mt-2">Nenhum lead nesta etapa</p>
                        </div>
                      )}
                      <ul className="flex flex-col gap-3 min-h-[50px]">
                        {estagio.atendimentos.map((atd, index) => (
                          <Draggable key={atd.id} draggableId={atd.id} index={index}>
                            {(provided, snapshot) => (
                              <li 
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`transition-all ${snapshot.isDragging ? 'shadow-2xl rotate-2 z-50 ring-2 ring-primary/20' : 'hover:-translate-y-0.5 hover:shadow-md'}`}
                              >
                                <AtendimentoCard
                                  atendimento={atd}
                                  onAbrir={() => setAtendimentoAberto(atd)}
                                  onVerCliente={onVerCliente}
                                />
                              </li>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </ul>
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>

      {mostrarFiltrosAvancados && (
        <FiltrosAvancadosSheet
          onClose={() => setMostrarFiltrosAvancados(false)}
          filtroTemp={filtroTemp}
          setFiltroTemp={setFiltroTemp}
          filtroOrigem={filtroOrigem}
          setFiltroOrigem={setFiltroOrigem}
          filtroPreAtendimento={filtroPreAtendimento}
          setFiltroPreAtendimento={setFiltroPreAtendimento}
          filtroPeriodo={filtroPeriodo}
          setFiltroPeriodo={setFiltroPeriodo}
          filtroNome={filtroNome}
          setFiltroNome={setFiltroNome}
        />
      )}
      {mostrarGerenciarFunil && (
        <GerenciarFunilSheet
          funil={funilAtivo}
          atendimentos={dados.filter(a => a.funilId === funilAtivo.id)}
          onClose={() => setMostrarGerenciarFunil(false)}
          onSave={(funilAtualizado, transferencias) => {
            // Update funnel
            setFunisList(prev => prev.map(f => f.id === funilAtualizado.id ? funilAtualizado : f))
            setFunilAtivo(funilAtualizado)
            const globalIdx = funis.findIndex(f => f.id === funilAtualizado.id)
            if (globalIdx !== -1) funis[globalIdx] = funilAtualizado

            // Apply transfers
            if (Object.keys(transferencias).length > 0) {
              setDados(prev => prev.map(a => {
                if (a.funilId === funilAtualizado.id && transferencias[a.etapa]) {
                  const novaEtapaId = transferencias[a.etapa]
                  const oldEtapaNome = funilAtivo.etapas?.find((e) => e.id === a.etapa)?.label || a.etapa
                  const novaEtapaNome = funilAtualizado.etapas?.find((e) => e.id === novaEtapaId)?.label || novaEtapaId
                  const newTimelineEvent = {
                    id: `tl-${Date.now()}-${a.id}`,
                    tipo: 'etapa' as const,
                    descricao: `Cliente foi da etapa ${oldEtapaNome} para etapa ${novaEtapaNome}`,
                    data: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
                    hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                  }

                  const idx = dadosAtendimentos.findIndex(da => da.id === a.id)
                  if (idx !== -1) {
                    dadosAtendimentos[idx].etapa = novaEtapaId
                    dadosAtendimentos[idx].timeline = [newTimelineEvent, ...dadosAtendimentos[idx].timeline]
                  }

                  return { ...a, etapa: novaEtapaId, timeline: [newTimelineEvent, ...a.timeline] }
                }
                return a
              }))

              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('app-data-updated'))
              }
            }

            setMostrarGerenciarFunil(false)
          }}
        />
      )}
    </div>
  )
}

function AtendimentoCard({
  atendimento: atd,
  onAbrir,
  onVerCliente,
}: {
  atendimento: Atendimento
  onAbrir: () => void
  onVerCliente: (id: string) => void
}) {
  return (
    <Card className="rounded-xl border-border bg-card shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      <CardContent className="p-3 sm:p-4">
        <button type="button" onClick={onAbrir} className="flex w-full items-start gap-3 text-left">
          <div className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary border border-primary/20">
            {atd.iniciais}
            <span
              className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-card ${tempConfig[atd.temperatura].dot}`}
              aria-label={`Temperatura: ${tempConfig[atd.temperatura].label}`}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 justify-between">
              <span className="truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{atd.nome}</span>
              <div className="flex items-center gap-1.5 shrink-0">
                {atd.albert.ativo && (
                  <span title="Albert ativo" className="shrink-0">
                    <Bot className="size-3.5 text-teal-mid" strokeWidth={1.5} />
                  </span>
                )}
                <Badge variant={atd.modo === 'venda' ? 'default' : 'secondary'} className={cn("text-[9px] px-1.5 py-0", atd.modo === 'locacao' && "bg-teal-mid/15 text-teal-deep hover:bg-teal-mid/25")}>
                  {atd.modo === 'venda' ? 'Venda' : 'Locação'}
                </Badge>
              </div>
            </div>
            <div className="mt-1 space-y-0.5">
              {atd.telefone && <span className="flex text-[11px] text-muted-foreground items-center gap-1"><Phone className="size-3 opacity-70" /> {atd.telefone}</span>}
              {atd.email && <span className="flex text-[11px] text-muted-foreground items-center gap-1 truncate"><MessageCircle className="size-3 opacity-70" /> {atd.email}</span>}
            </div>
          </div>
        </button>

        <div className="mt-2.5 flex items-center justify-between border-t border-border/50 pt-2.5">
          <span className="text-[11px] text-muted-foreground truncate mr-2 font-medium">{atd.interesse}</span>
          <span className="shrink-0 font-mono text-xs font-bold text-primary">{atd.valor}</span>
        </div>

        <div className="mt-2.5 flex flex-wrap gap-1.5">
          <Badge variant="outline" className={cn("text-[9px] font-medium border-transparent", origemConfig[atd.origem].cor)}>
            {atd.origem}
          </Badge>
          <span className="rounded-md bg-muted/50 border border-border/50 px-1.5 py-0.5 text-[9px] text-muted-foreground font-medium">
            Entrada: {atd.dataEntrada}
          </span>
          <span className="rounded-md bg-muted/50 border border-border/50 px-1.5 py-0.5 text-[9px] text-muted-foreground font-medium">
            Última: {atd.ultimaInteracao}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={onAbrir}
            className="flex-1 rounded-lg bg-primary/10 hover:bg-primary/15 border border-primary/20 px-3 py-1.5 text-xs font-semibold text-primary transition-all active:scale-95"
          >
            Abrir
          </button>
          <button
            type="button"
            aria-label={`WhatsApp de ${atd.nome}`}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-green-500/15 hover:bg-green-500/25 border border-green-500/30 text-green-700 dark:text-green-400 transition-all active:scale-95"
          >
            <MessageCircle className="size-4" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label={`Ligar para ${atd.nome}`}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted hover:bg-muted/80 border border-border text-foreground transition-all active:scale-95"
          >
            <Phone className="size-4" strokeWidth={1.5} />
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
