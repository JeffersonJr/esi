'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Bell,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  Circle,
  Flame,
  Phone,
  Target,
  TrendingUp,
  CalendarDays,
  Users2,
  MessageCircle,
  ChevronDown,
  Sparkles,
  Mic,
  Loader2,
  Bot,
  X,
  Trophy,
  Zap,
  MapPin,
  MapPinOff,
  Wifi,
} from 'lucide-react'
import { atividadesHoje, funil, tempConfig, tipoAtividadeConfig, isAtividadeAtrasada, atendimentos } from '@/lib/app-data'
import { AtividadeDetalheSheet } from '@/components/app/atividade-detalhe-sheet'

export function ScreenHoje({
  onVerFunil,
  onVerCliente,
  onVerPerfil,
  onVerAtendimento,
  onAbrirNovaAtividade,
  onVerAtividades,
  onVerDesempenho,
  tenantAtivo,
  setTenantAtivo,
  tenants,
}: {
  onVerFunil: () => void
  onVerCliente: (id: string) => void
  onVerPerfil?: () => void
  onVerAtendimento?: (id: string) => void
  onAbrirNovaAtividade?: (clienteId?: string) => void
  onVerAtividades?: () => void
  onVerDesempenho: () => void
  tenantAtivo: any
  setTenantAtivo: (t: any) => void
  tenants: any[]
}) {
  const [atividadeSelecionada, setAtividadeSelecionada] = useState<any>(null)
  const [toastMsg, setToastMsg] = useState('')
  
  // Tenant Switching states
  const [mostrarTenantSelector, setMostrarTenantSelector] = useState(false)
  const [alternandoTenant, setAlternandoTenant] = useState(false)

  // Modo Roleta states
  const [modoRoleta, setModoRoleta] = useState(false)
  const [indiceRoleta, setIndiceRoleta] = useState(0)
  const [mensagemGamificada, setMensagemGamificada] = useState('')
  const [roletaFinalizada, setRoletaFinalizada] = useState(false)
  const [roletaAtividades, setRoletaAtividades] = useState<any[]>([])
  const [feedbackAudioRoleta, setFeedbackAudioRoleta] = useState('')
  const [gravandoAudioRoleta, setGravandoAudioRoleta] = useState(false)
  const [timerAudioRoleta, setTimerAudioRoleta] = useState(0)
  const [roletaEfeitoFrup, setRoletaEfeitoFrup] = useState(false)
  const [historicoRoleta, setHistoricoRoleta] = useState<{tarefa: any, acao: 'concluido' | 'pulado' | 'remarcado'}[]>([])
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const [startY, setStartY] = useState(0)
  const [currentY, setCurrentY] = useState(0)
  const [remarcarAtividade, setRemarcarAtividade] = useState<any>(null)
  const [novaDataRemarcar, setNovaDataRemarcar] = useState('')
  const [novaHoraRemarcar, setNovaHoraRemarcar] = useState('')
  const [swipeExitDirection, setSwipeExitDirection] = useState<'left' | 'right' | 'up' | null>(null)
  const [acaoAlbertRoleta, setAcaoAlbertRoleta] = useState<any>(null)
  const [textoAlbertRoleta, setTextoAlbertRoleta] = useState('')
  const [albertVozRoleta, setAlbertVozRoleta] = useState<'idle' | 'gravando' | 'processando'>('idle')
  const [albertVozTimerRoleta, setAlbertVozTimerRoleta] = useState(0)
  const albertVozIntervalRef = useRef<any>(null)

  // Check-in/out Rodízio states
  const [checkinStatus, setCheckinStatus] = useState<'pendente' | 'erro' | 'sucesso'>('pendente')
  const [mostrarCheckinModal, setMostrarCheckinModal] = useState(false)
  const [mostrarCheckoutModal, setMostrarCheckoutModal] = useState(false)
  const [habilitadoRodizio, setHabilitadoRodizio] = useState(false)

  // Saudação e hidratação calculadas no cliente para evitar mismatch
  const [isClient, setIsClient] = useState(false)
  const [saudacao, setSaudacao] = useState('Bom dia')
  useEffect(() => {
    setIsClient(true)
    const h = new Date().getHours()
    setSaudacao(h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite')
  }, [])

  const getHojeStr = () => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  const isHoje = (dataStr?: string) => {
    if (!dataStr || dataStr === 'Hoje') return true
    if (dataStr === getHojeStr()) return true
    const d = new Date()
    const ptBrHoje = d.toLocaleDateString('pt-BR')
    if (dataStr === ptBrHoje) return true
    return false
  }

  // Inicializamos as atividades primeiro com tudo, depois filtramos no cliente para evitar mismatch
  const [localAtividades, setLocalAtividades] = useState<typeof atividadesHoje>([])
  useEffect(() => {
    if (isClient) {
      setLocalAtividades(atividadesHoje.filter(a => isHoje(a.data)))
    }
  }, [isClient])
  const leadsQuentes = funil
    .flatMap((estagio) => estagio.leads.map((lead) => ({ ...lead, estagio: estagio.nome })))
    .filter((lead) => lead.temperatura === 'quente')
    .slice(0, 3)

  const pendentes = localAtividades.filter((a) => !a.concluida)

  useEffect(() => {
    const handleUpdate = () => {
      setLocalAtividades(atividadesHoje.filter(a => isHoje(a.data)))
    }
    setLocalAtividades(atividadesHoje.filter(a => isHoje(a.data)))
    window.addEventListener('app-data-updated', handleUpdate)
    return () => window.removeEventListener('app-data-updated', handleUpdate)
  }, [])

  // Start Roleta Mode
  function iniciarModoRoleta() {
    const list = localAtividades.filter(a => !a.concluida)
    if (list.length === 0) return
    setRoletaAtividades(list)
    setIndiceRoleta(0)
    setRoletaFinalizada(false)
    setFeedbackAudioRoleta('')
    setHistoricoRoleta([])
    setStartX(0)
    setCurrentX(0)
    setStartY(0)
    setCurrentY(0)
    setRemarcarAtividade(null)
    setAcaoAlbertRoleta(null)
    setTextoAlbertRoleta('')
    setSwipeExitDirection(null)
    
    // Set funny message based on task count
    if (list.length > 20) {
      setMensagemGamificada('Você é o herói da imobiliária hoje!')
    } else if (list.length > 10) {
      setMensagemGamificada('Prepare-se, guerreiro!')
    } else {
      setMensagemGamificada('Hora de limpar a mesa!')
    }
    
    setModoRoleta(true)
  }

  // Toggle voice recorder inside Roleta card
  function toggleAudioRoleta() {
    if (gravandoAudioRoleta) {
      setGravandoAudioRoleta(false)
      if ((window as any).roletaAudioInterval) clearInterval((window as any).roletaAudioInterval)
      setFeedbackAudioRoleta("Tarefa executada com sucesso. Cliente confirmou interesse.")
    } else {
      setGravandoAudioRoleta(true)
      setTimerAudioRoleta(0)
      const timer = setInterval(() => {
        setTimerAudioRoleta(t => t + 1)
      }, 1000)
      ;(window as any).roletaAudioInterval = timer
    }
  }

  // Finish current task in Roleta stack (effects "Frup" transition)
  function concluirTarefaRoleta() {
    if (roletaAtividades.length === 0) return
    const currentTask = roletaAtividades[indiceRoleta]
    
    // Mark as completed in the global activities list
    const globalIdx = atividadesHoje.findIndex(a => a.id === currentTask.id)
    if (globalIdx !== -1) {
      atividadesHoje[globalIdx].concluida = true
      atividadesHoje[globalIdx].descricao = (atividadesHoje[globalIdx].descricao || '') + 
        (feedbackAudioRoleta ? `\n[Feedback de voz: ${feedbackAudioRoleta}]` : '')
    }

    // Trigger update
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('app-data-updated'))
    }

    setHistoricoRoleta(prev => [...prev, { tarefa: currentTask, acao: 'concluido' }])

    // Apply swipe exit animation
    setSwipeExitDirection('right')
    setRoletaEfeitoFrup(true)
    setTimeout(() => {
      setRoletaEfeitoFrup(false)
      setSwipeExitDirection(null)
      setFeedbackAudioRoleta('')
      
      const nextIndex = indiceRoleta + 1
      if (nextIndex >= roletaAtividades.length) {
        // Completed all tasks!
        setRoletaFinalizada(true)
      } else {
        setIndiceRoleta(nextIndex)
      }
      
      // Auto-open Nova Atividade after completing one
      if (onAbrirNovaAtividade) {
        const clienteId = atendimentos.find(a => a.nome === currentTask?.cliente)?.id
        onAbrirNovaAtividade(clienteId)
      }
    }, 300)
  }

  // Skip task in Roleta Mode
  function pularTarefaRoleta() {
    if (roletaAtividades.length === 0) return
    const currentTask = roletaAtividades[indiceRoleta]
    
    setHistoricoRoleta(prev => [...prev, { tarefa: currentTask, acao: 'pulado' }])

    setSwipeExitDirection('left')
    setRoletaEfeitoFrup(true)
    setTimeout(() => {
      setRoletaEfeitoFrup(false)
      setSwipeExitDirection(null)
      setFeedbackAudioRoleta('')
      
      const nextIndex = indiceRoleta + 1
      if (nextIndex >= roletaAtividades.length) {
        setRoletaFinalizada(true)
      } else {
        setIndiceRoleta(nextIndex)
      }
    }, 300)
  }

  // Remarcar task in Roleta Mode
  function confirmarRemarcar() {
    if (!remarcarAtividade) return
    
    const globalIdx = atividadesHoje.findIndex(a => a.id === remarcarAtividade.id)
    if (globalIdx !== -1) {
      atividadesHoje[globalIdx].data = novaDataRemarcar || 'Hoje'
      atividadesHoje[globalIdx].hora = novaHoraRemarcar || '12:00'
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('app-data-updated'))
    }

    setHistoricoRoleta(prev => [...prev, { tarefa: remarcarAtividade, acao: 'remarcado' }])

    setRemarcarAtividade(null)
    setNovaDataRemarcar('')
    setNovaHoraRemarcar('')
    setAcaoAlbertRoleta(null)
    setTextoAlbertRoleta('')

    setSwipeExitDirection('up')
    setRoletaEfeitoFrup(true)
    setTimeout(() => {
      setRoletaEfeitoFrup(false)
      setSwipeExitDirection(null)
      setFeedbackAudioRoleta('')
      
      const nextIndex = indiceRoleta + 1
      if (nextIndex >= roletaAtividades.length) {
        setRoletaFinalizada(true)
      } else {
        setIndiceRoleta(nextIndex)
      }
    }, 300)
  }



  return (
    <div className="flex flex-col gap-6 px-5 pt-4 pb-28">
      {/* Nubank-style Tenant Switcher Trigger */}
      <div className="flex items-center justify-between bg-card border border-border/80 shadow-soft p-3 rounded-2xl animate-in fade-in duration-300">
        <button
          type="button"
          onClick={() => setMostrarTenantSelector(true)}
          className="flex items-center gap-2 hover:opacity-85 transition-all text-left"
        >
          <span className="text-2xl">{tenantAtivo.logo}</span>
          <div>
            <span className="text-[9px] font-bold text-primary uppercase tracking-wider block">Conectado a</span>
            <h1 className="text-xs font-bold text-foreground flex items-center gap-1">
              {tenantAtivo.nome}
              <ChevronDown className="size-3.5 text-primary shrink-0" />
            </h1>
          </div>
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMostrarTenantSelector(true)}
            className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1.5 rounded-xl hover:bg-primary/20 transition-all"
          >
            Alterar
          </button>
          
          {tenantAtivo.hasCheckin !== false && (
            habilitadoRodizio ? (
              <button
                onClick={() => setMostrarCheckoutModal(true)}
                className="flex items-center gap-1.5 text-[10px] font-black text-white bg-green-500 px-3 py-1.5 rounded-xl hover:bg-red-500 transition-colors shadow-sm group"
              >
                <Target className="size-3 group-hover:hidden" strokeWidth={3} />
                <X className="size-3 hidden group-hover:block" strokeWidth={3} />
                <span className="group-hover:hidden">Rodízio ON <span className="font-medium opacity-80">(Sair)</span></span>
                <span className="hidden group-hover:block">Fazer Check-out</span>
              </button>
            ) : (
              <button
                onClick={() => setMostrarCheckinModal(true)}
                className="text-[10px] font-black text-white bg-primary px-3 py-1.5 rounded-xl hover:bg-primary/90 transition-all shadow-sm"
              >
                Check-in
              </button>
            )
          )}
        </div>
      </div>

      <header className="flex flex-col gap-1">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Terça · 07 Jul
        </p>
        <h1 className="font-serif text-3xl font-semibold text-foreground tracking-tight truncate">
          {saudacao}, Jefferson.
        </h1>
      </header>

      {/* Gamification: Modo Roleta Activation trigger banner */}
      {pendentes.length > 3 && (
        <div className="rounded-3xl border-2 border-primary/25 bg-[#2B5250]/5 p-5 shadow-soft relative overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="flex items-start justify-between relative z-10">
            <div className="flex flex-col gap-1.5 max-w-[80%]">
              <div className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                <Zap className="size-3.5 fill-primary animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-wider">Modo Hércules Ativo</span>
              </div>
              <h3 className="font-serif text-lg font-black text-foreground leading-snug mt-1">
                Você tem {pendentes.length} pendências acumuladas!
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-light mt-0.5">
                Não deixe acumular. Entre no fluxo contínuo e liquide sua fila de atividades de forma ultra rápida com Albert IA.
              </p>
            </div>
            
            {/* Visual game-like indicator badge */}
            <div className="flex flex-col items-center justify-center bg-primary/5 border border-primary/10 rounded-2xl p-3 shrink-0">
              <span className="text-2xl animate-bounce">🔥</span>
              <span className="font-mono text-xs font-bold text-primary mt-1">+{pendentes.length}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={iniciarModoRoleta}
            className="w-full flex items-center justify-center gap-2 h-12 rounded-2xl bg-primary text-primary-foreground text-xs font-black shadow-md hover:bg-primary/95 transition-all active:scale-[0.98] mt-4 relative z-10"
          >
            <Flame className="size-4 animate-pulse fill-primary-foreground" />
            Entrar no Modo Roleta
          </button>
        </div>
      )}

      {/* Indicadores do dia */}
      <section id="tour-target-goals" aria-label="Indicadores do dia" className="grid grid-cols-2 gap-3 mt-2">
        {/* Leads Quentes */}
        <button
          onClick={() => document.getElementById('secao-leads')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          className="flex flex-col text-left rounded-3xl border border-border/60 bg-card p-5 shadow-soft transition-transform active:scale-95 hover:border-primary/30"
        >
          <div className="flex items-center justify-between mb-2 w-full">
            <span className="text-[13px] font-medium text-muted-foreground">Leads quentes</span>
            <Flame className="size-4 text-amber" strokeWidth={2} />
          </div>
          <p className="font-sans text-[2.5rem] leading-none font-bold tracking-tight text-foreground mb-1.5">14</p>
          <p className="text-[11px] font-medium text-[#2B5250]">
            +12%
          </p>
        </button>

        {/* Meu desempenho */}
        <button
          onClick={onVerDesempenho}
          className="flex flex-col text-left rounded-3xl border border-border/60 bg-card p-5 shadow-soft transition-transform active:scale-95 hover:border-primary/30"
        >
          <div className="flex items-center justify-between mb-2 w-full">
            <span className="text-[13px] font-medium text-muted-foreground">Meu desempenho</span>
            <TrendingUp className="size-4 text-primary" strokeWidth={2} />
          </div>
          <p className="font-sans text-[2.5rem] leading-none font-bold tracking-tight text-foreground mb-1.5">92%</p>
          <p className="font-mono text-[11px] font-medium tracking-wide text-[#2B5250]">
            da meta atingida
          </p>
        </button>

        {/* Propostas */}
        <div className="col-span-2 flex flex-col rounded-3xl border border-border/60 bg-card p-5 shadow-soft transition-brand">
          <span className="mb-2 block text-[13px] font-medium text-muted-foreground">Propostas</span>
          <p className="font-sans text-[2.5rem] leading-none font-bold tracking-tight text-foreground mb-1.5">R$ 4,2M</p>
          <p className="font-mono text-[11px] font-medium tracking-wide text-[#2B5250]">
            em andamento
          </p>
        </div>
      </section>

      {/* Agenda */}
      <section id="secao-agenda" aria-label="Sua agenda" className="scroll-mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-serif text-lg font-semibold text-foreground">
            <CalendarDays className="size-4.5 text-primary" strokeWidth={1.5} />
            Sua agenda
          </h2>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              {pendentes.length} Pendentes
            </span>
            <button
              type="button"
              onClick={onVerAtividades}
              className="flex items-center gap-0.5 text-xs font-semibold text-primary"
            >
              Ver completa
              <ChevronRight className="size-3.5" strokeWidth={2} />
            </button>
          </div>
        </div>
        <ul className="flex flex-col gap-2">
          {localAtividades
            .slice()
            .sort((a, b) => {
              // Pending first, then by time
              if (a.concluida !== b.concluida) return a.concluida ? 1 : -1
              return a.hora.localeCompare(b.hora)
            })
            .map((atv) => (
              <li key={atv.id}>
                <button
                  type="button"
                  onClick={() => setAtividadeSelecionada(atv)}
                  className={`w-full text-left flex items-center gap-3 rounded-[1.25rem] p-3.5 transition-brand relative overflow-hidden ${atv.concluida
                    ? 'border border-border bg-card/40 opacity-70'
                    : 'border-transparent bg-card shadow-soft hover:bg-muted/50'
                    }`}
                >
                  <div className={`flex size-10 shrink-0 items-center justify-center rounded-2xl ${atv.concluida ? 'bg-muted text-muted-foreground' : ((tipoAtividadeConfig as Record<string, any>)[atv.tipo]?.cor || 'bg-muted text-muted-foreground')}`}>
                    {atv.concluida ? (
                      <CheckCircle2 className="size-5" strokeWidth={1.5} />
                    ) : (
                      <span className="text-lg">{(tipoAtividadeConfig as Record<string, any>)[atv.tipo]?.emoji || '📋'}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-sm font-semibold ${atv.concluida ? 'text-muted-foreground line-through' : 'text-foreground'
                        }`}
                    >
                      {atv.titulo}
                    </p>
                    {atv.descricao && (
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                        {atv.descricao}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                      <span className={`size-1.5 rounded-full ${atv.concluida ? 'bg-muted-foreground' : 'bg-primary'}`} />
                      {atv.cliente}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`font-mono text-xs font-bold ${atv.concluida ? 'text-muted-foreground' : (isClient && isAtividadeAtrasada(atv.data || 'Hoje', atv.hora) ? 'text-red-500' : 'text-primary')}`}>
                      {atv.hora}
                    </span>
                    {!atv.concluida && (
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md ${isClient && isAtividadeAtrasada(atv.data || 'Hoje', atv.hora) ? 'text-red-500 bg-red-500/10 border border-red-500/20' : 'text-teal-mid bg-teal-mid/10'}`}>
                        {isClient && isAtividadeAtrasada(atv.data || 'Hoje', atv.hora) ? 'ATRASADA' : 'HOJE'}
                      </span>
                    )}
                  </div>
                </button>
              </li>
            ))}
        </ul>
      </section>

      {/* Leads quentes */}
      <section id="secao-leads" aria-label="Leads quentes" className="scroll-mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-serif text-lg font-semibold text-foreground">
            <Flame className="size-4.5 text-amber" strokeWidth={1.5} />
            Leads quentes
          </h2>
          <button
            type="button"
            onClick={onVerFunil}
            className="flex items-center gap-0.5 text-xs font-semibold text-primary"
          >
            Ver funil
            <ChevronRight className="size-3.5" strokeWidth={2} />
          </button>
        </div>
        <ul className="flex flex-col gap-2">
          {leadsQuentes.map((lead) => (
            <li key={lead.id}>
              <div className="group relative flex w-full flex-col gap-3 rounded-[1.25rem] bg-card p-4 shadow-soft transition-brand">
                <button
                  type="button"
                  onClick={() => onVerCliente(lead.id)}
                  className="flex items-start gap-3 text-left w-full"
                >
                  <div className="relative flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 font-serif text-sm font-semibold text-primary">
                    {lead.iniciais}
                    <span className={`absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full border-2 border-card ${tempConfig[lead.temperatura].dot}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-foreground">
                        {lead.nome}
                      </span>
                      <span className="shrink-0 text-xs font-mono font-semibold text-primary">
                        {lead.valor}
                      </span>
                    </div>
                    <span className="block truncate text-xs text-muted-foreground mt-0.5">
                      {lead.interesse}
                    </span>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${tempConfig[lead.temperatura].chip}`}>
                        {tempConfig[lead.temperatura].label}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Etapa: <span className="font-semibold text-foreground">{lead.estagio}</span>
                      </span>
                    </div>
                  </div>
                </button>
                <div className="flex items-center gap-2 border-t border-border pt-3 mt-1">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onVerCliente(lead.id); }}
                    className="flex-1 rounded-full bg-muted/50 px-3 py-2 text-xs font-semibold text-muted-foreground transition-brand active:scale-95"
                  >
                    Ver detalhes
                  </button>
                  <button
                    type="button"
                    className="flex size-9 items-center justify-center rounded-full bg-green-100 text-green-700 transition-brand active:scale-95"
                    aria-label={`WhatsApp ${lead.nome}`}
                  >
                    <MessageCircle className="size-4" strokeWidth={1.5} />
                  </button>
                  <button
                    type="button"
                    className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary transition-brand active:scale-95"
                    aria-label={`Ligar ${lead.nome}`}
                  >
                    <Phone className="size-4" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Atalhos de contato */}
      <section aria-label="Resumo da carteira" className="rounded-2xl bg-cream p-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Users2 className="size-5" strokeWidth={1.5} />
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">6 clientes ativos na carteira</p>
            <p className="text-xs text-muted-foreground">2 aguardam retorno hoje</p>
          </div>
          <Phone className="size-5 text-primary" strokeWidth={1.5} />
        </div>
      </section>

      <AtividadeDetalheSheet
        atividade={atividadeSelecionada}
        onClose={() => setAtividadeSelecionada(null)}
        onConcluir={(id, statusConcluida, feedback, agendar) => {
          // Update local state to trigger re-render with strikethrough or remove strikethrough
          setLocalAtividades((prev) =>
            prev.map((a) => (a.id === id ? { ...a, concluida: statusConcluida } : a))
          )
          // Also update the global mock so other screens see it
          const atvGlob = atividadesHoje.find((a) => a.id === id)
          if (atvGlob) atvGlob.concluida = statusConcluida
          setAtividadeSelecionada(null)

          if (statusConcluida) {
            if (onAbrirNovaAtividade) {
              const clienteId = atendimentos.find(a => a.nome === atvGlob?.cliente)?.id
              onAbrirNovaAtividade(clienteId)
            }
          }
        }}
        onVerNegocio={(cliente) => {
          setAtividadeSelecionada(null)
          // Na vida real, buscaria o ID do atendimento correspondente. 
          // Aqui enviamos o ID do lead principal para demonstração.
          onVerAtendimento?.('l1')
        }}
        onGerarTermo={(atividadeId) => {
          const atv = localAtividades.find(a => a.id === atividadeId)
          const clienteNome = atv ? atv.cliente : 'Cliente'
          setToastMsg(`Termo para ${clienteNome} gerado com sucesso!`)
          if (navigator.clipboard) {
            navigator.clipboard.writeText(`https://evolves.com.br/assinatura-termo/doc_39482`)
          }
          setTimeout(() => setToastMsg(''), 3000)
        }}
      />

      {/* Modal de Checkout (Out of Zone Example) */}
      {mostrarCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMostrarCheckoutModal(false)} />
          <div className="relative w-full max-w-sm rounded-3xl bg-card p-6 shadow-2xl border border-border animate-in fade-in zoom-in-95 text-center">
            
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-amber/10 text-amber">
              <MapPinOff className="size-6" strokeWidth={2} />
            </div>
            <h3 className="font-serif text-xl font-bold mb-2">Sinal Perdido</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Você saiu da zona da imobiliária ou área habilitada para o checkin do rodízio.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  // Apenas fecha o modal, mantém o rodízio
                  setMostrarCheckoutModal(false)
                }}
                className="w-full rounded-xl bg-primary h-12 text-sm font-bold text-primary-foreground transition-all active:scale-95"
              >
                Ainda estou na imobiliária
              </button>
              <button
                onClick={() => {
                  // Faz o checkout real
                  setHabilitadoRodizio(false)
                  setCheckinStatus('pendente')
                  setMostrarCheckoutModal(false)
                  setToastMsg('Você saiu do rodízio.')
                  setTimeout(() => setToastMsg(''), 3000)
                }}
                className="w-full rounded-xl bg-card border border-border h-12 text-sm font-bold text-foreground transition-all active:scale-95"
              >
                Estou fora da imobiliária (Fazer checkout)
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMsg && (
        <div className="fixed top-[calc(1.5rem+env(safe-area-inset-top))] left-1/2 -translate-x-1/2 z-[100] px-4 py-2.5 rounded-full bg-teal-mid text-white text-xs font-semibold shadow-lg whitespace-nowrap animate-in fade-in slide-in-from-top-5 flex items-center gap-1.5">
          <CheckCircle2 className="size-4" />
          {toastMsg}
        </div>
      )}

      {/* Tenant Switcher Modal */}
      {mostrarTenantSelector && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end">
          <button
            type="button"
            onClick={() => setMostrarTenantSelector(false)}
            className="absolute inset-0 bg-teal-shadow/55 backdrop-blur-[2px]"
          />
          <div className="relative rounded-t-3xl bg-card p-6 shadow-2xl animate-in slide-in-from-bottom duration-250 max-h-[80vh] overflow-y-auto z-10">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
            <h3 className="font-serif text-lg font-bold text-foreground mb-4">Alternar Imobiliária Parceira</h3>
            <ul className="flex flex-col gap-2">
              {tenants.map(t => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setMostrarTenantSelector(false)
                      setAlternandoTenant(true)
                      setTimeout(() => {
                        setTenantAtivo(t)
                        setAlternandoTenant(false)
                        setToastMsg(`Conectado à imobiliária ${t.nome}`)
                        setTimeout(() => setToastMsg(''), 3000)
                      }, 1200)
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all active:scale-[0.98] ${
                      tenantAtivo.id === t.id ? 'border-primary bg-primary/5' : 'border-border bg-card'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{t.logo}</span>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-foreground">{t.nome}</p>
                        <p className="text-xs text-muted-foreground font-mono">{t.creci}</p>
                      </div>
                    </div>
                    {tenantAtivo.id === t.id && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary">Ativa</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tenant Switching Loader Overlay */}
      {alternandoTenant && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="flex flex-col items-center gap-3">
            <span className="text-4xl animate-bounce">{tenantAtivo.logo}</span>
            <span className="text-sm font-semibold text-foreground">Alternando para {tenantAtivo.nome}...</span>
          </div>
        </div>
      )}

      {/* Check-in Rodízio Modal */}
      {mostrarCheckinModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-card border border-border shadow-2xl p-6 text-center">
            {checkinStatus === 'pendente' && (
              <>
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MapPin className="size-6" strokeWidth={2} />
                </div>
                <h3 className="font-serif text-xl font-bold mb-2">Check-in de Plantão</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Para entrar no rodízio de leads, precisamos validar sua localização na imobiliária.
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      // Simula erro na primeira vez
                      setCheckinStatus('erro')
                    }}
                    className="w-full rounded-xl bg-primary h-12 text-sm font-bold text-primary-foreground transition-all active:scale-95"
                  >
                    Fazer Check-in
                  </button>
                  <button
                    onClick={() => setMostrarCheckinModal(false)}
                    className="w-full rounded-xl bg-card border border-border h-12 text-sm font-bold text-foreground transition-all active:scale-95"
                  >
                    Cancelar
                  </button>
                </div>
              </>
            )}

            {checkinStatus === 'erro' && (
              <>
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                  <MapPinOff className="size-6" strokeWidth={2} />
                </div>
                <h3 className="font-serif text-xl font-bold mb-2">Localização não encontrada</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Não conseguimos identificar sua localização na sede. Por favor, conecte no Wi-Fi da imobiliária e tente novamente.
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      // Simula sucesso na segunda tentativa
                      setCheckinStatus('sucesso')
                    }}
                    className="w-full rounded-xl bg-primary h-12 text-sm font-bold text-primary-foreground transition-all active:scale-95"
                  >
                    Tentar Novamente
                  </button>
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.dispatchEvent(new CustomEvent('open-simulated-screen', { detail: { tipo: 'wifi' } }))
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-card border border-border h-12 text-sm font-bold text-foreground transition-all active:scale-95"
                  >
                    <Wifi className="size-4 text-muted-foreground" />
                    Configurações de Wi-Fi
                  </button>
                  <button
                    onClick={() => {
                      setCheckinStatus('pendente')
                      setMostrarCheckinModal(false)
                    }}
                    className="w-full rounded-xl bg-card border border-border h-12 text-sm font-bold text-foreground transition-all active:scale-95"
                  >
                    Cancelar
                  </button>
                </div>
              </>
            )}

            {checkinStatus === 'sucesso' && (
              <>
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                  <CheckCircle2 className="size-6" strokeWidth={2} />
                </div>
                <h3 className="font-serif text-xl font-bold mb-2">Você está no Rodízio!</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Check-in realizado com sucesso. Você já está habilitado para receber novos leads.
                </p>
                <button
                  onClick={() => {
                    setHabilitadoRodizio(true)
                    setCheckinStatus('pendente')
                    setMostrarCheckinModal(false)
                  }}
                  className="w-full rounded-xl bg-green-500 h-12 text-sm font-bold text-white transition-all active:scale-95"
                >
                  OK, Entendi
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Gamification Fullscreen: MODO ROLETA */}
      {modoRoleta && (
        <div className="fixed inset-0 z-[100] bg-background flex flex-col animate-in fade-in duration-300">
          {/* Área Principal de Cartões */}
          <div className="flex-1 p-6 flex flex-col justify-center items-center relative overflow-hidden bg-gradient-to-b from-primary/5 to-background">
            {roletaFinalizada ? (
              <div className="flex flex-col items-center text-center p-6 max-w-md animate-in zoom-in-95 duration-500">
                <div className="relative mb-6">
                  <div className="absolute inset-0 size-24 bg-amber/20 rounded-full blur-xl animate-pulse" />
                  <div className="relative flex size-24 items-center justify-center rounded-full bg-amber/10 text-amber border-2 border-amber">
                    <Trophy className="size-12 animate-bounce" />
                  </div>
                </div>
                <h3 className="font-serif text-2xl font-black text-foreground mb-3">Mesa Limpa, Guerreiro!</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Você passou por todas as tarefas da pilha. Veja o seu resumo:
                </p>
                <ul className="w-full mb-6 flex flex-col gap-2 max-h-48 overflow-y-auto">
                  {historicoRoleta.map((h, i) => (
                    <li key={i} className="flex items-center justify-between bg-background p-2 rounded-xl border border-border/50">
                      <span className="text-xs font-semibold text-foreground truncate flex-1 text-left">{h.tarefa.titulo}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${h.acao === 'concluido' ? 'bg-green-500/10 text-green-600' : h.acao === 'remarcado' ? 'bg-blue-500/10 text-blue-600' : 'bg-muted text-muted-foreground'}`}>
                        {h.acao === 'concluido' ? 'Concluído' : h.acao === 'remarcado' ? 'Remarcado' : 'Pulado'}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => setModoRoleta(false)}
                  className="w-full h-13 rounded-2xl bg-primary text-primary-foreground text-sm font-bold shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  Finalizar
                </button>
              </div>
            ) : (
              remarcarAtividade ? (
                <div className="relative w-full max-w-md flex justify-center">
                  <div className={`w-full max-w-md bg-card border-2 border-primary/50 rounded-3xl shadow-2xl p-6 flex flex-col gap-5 transition-all duration-300 ${roletaEfeitoFrup ? 'opacity-0 -translate-y-[150%] pointer-events-none' : 'animate-in zoom-in-95 duration-300'}`}>
                    <div className="flex items-center gap-3 text-primary mb-2">
                    <Calendar className="size-6" />
                    <h3 className="font-serif text-xl font-bold">Remarcar Tarefa</h3>
                  </div>
                  <p className="text-sm font-semibold text-foreground mb-4">
                    {remarcarAtividade.titulo}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <button type="button" onClick={() => {
                      const d = new Date(); d.setDate(d.getDate() + 1);
                      setNovaDataRemarcar(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`);
                    }} className="h-10 rounded-xl border border-border bg-background text-xs font-semibold text-muted-foreground hover:bg-muted active:scale-95 transition-all">
                      Amanhã
                    </button>
                    <button type="button" onClick={() => {
                      const d = new Date(); d.setDate(d.getDate() + 7);
                      setNovaDataRemarcar(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`);
                    }} className="h-10 rounded-xl border border-border bg-background text-xs font-semibold text-muted-foreground hover:bg-muted active:scale-95 transition-all">
                      Semana que vem
                    </button>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Data Exata</label>
                    <input
                      type="date"
                      value={novaDataRemarcar}
                      onChange={(e) => setNovaDataRemarcar(e.target.value)}
                      className="h-12 w-full rounded-2xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Nova Hora</label>
                    <input
                      type="time"
                      value={novaHoraRemarcar}
                      onChange={(e) => setNovaHoraRemarcar(e.target.value)}
                      className="h-12 w-full rounded-2xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setRemarcarAtividade(null)
                        setNovaDataRemarcar('')
                        setNovaHoraRemarcar('')
                      }}
                      className="flex-1 h-12 rounded-2xl border border-border bg-card text-muted-foreground text-xs font-bold transition-all active:scale-95"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={confirmarRemarcar}
                      disabled={!novaDataRemarcar || !novaHoraRemarcar}
                      className="flex-[2] h-12 rounded-2xl bg-primary text-primary-foreground text-xs font-bold transition-all active:scale-95 disabled:opacity-50"
                    >
                      Confirmar
                    </button>
                  </div>
                </div>
                </div>
              ) : acaoAlbertRoleta ? (
                <div className="relative w-full max-w-md flex justify-center">
                  <div className={`w-full max-w-md bg-card border-2 border-primary/50 rounded-3xl shadow-2xl p-6 flex flex-col gap-5 transition-all duration-300 ${roletaEfeitoFrup ? 'opacity-0 -translate-y-[150%] pointer-events-none' : 'animate-in zoom-in-95 duration-300'}`}>
                    <div className="flex items-center gap-3 text-primary mb-2">
                      <Bot className="size-6" />
                      <h3 className="font-serif text-xl font-bold">Ação com Albert</h3>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {acaoAlbertRoleta.cliente}
                    </p>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">O que o Albert deve fazer?</label>
                        <button
                          type="button"
                          disabled={albertVozRoleta !== 'idle'}
                          onClick={() => {
                            setAlbertVozRoleta('gravando')
                            setAlbertVozTimerRoleta(0)
                            let count = 0
                            albertVozIntervalRef.current = setInterval(() => {
                              count++
                              setAlbertVozTimerRoleta(count)
                              if (count >= 3) {
                                clearInterval(albertVozIntervalRef.current)
                                setAlbertVozRoleta('processando')
                                setTimeout(() => {
                                  setTextoAlbertRoleta('Diga para o cliente que tentei contato mas não foi possível falar agora. Solicite que ele me ligue de volta no período da tarde.')
                                  setAlbertVozRoleta('idle')
                                }, 1500)
                              }
                            }, 1000)
                          }}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all active:scale-95 ${
                            albertVozRoleta === 'gravando' ? 'bg-red-500 text-white animate-pulse' :
                            albertVozRoleta === 'processando' ? 'bg-primary/20 text-primary' :
                            'bg-primary/10 text-primary hover:bg-primary/20'
                          }`}
                        >
                          {albertVozRoleta === 'processando' ? (
                            <Loader2 className="size-3 animate-spin" />
                          ) : (
                            <Mic className={`size-3 ${albertVozRoleta === 'gravando' ? 'animate-pulse' : ''}`} />
                          )}
                          {albertVozRoleta === 'gravando' ? `Gravando ${albertVozTimerRoleta}s` : albertVozRoleta === 'processando' ? 'Transcrevendo...' : 'Gravar voz'}
                        </button>
                      </div>
                      <div className="relative">
                        <textarea
                          value={textoAlbertRoleta}
                          onChange={(e) => setTextoAlbertRoleta(e.target.value)}
                          placeholder="Ex: Diga que eu liguei e vou retornar mais tarde."
                          className={`h-28 w-full resize-none rounded-2xl border bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                            albertVozRoleta === 'gravando' ? 'border-red-400 ring-2 ring-red-400/30' :
                            albertVozRoleta === 'processando' ? 'border-primary/50 ring-2 ring-primary/20' :
                            'border-border'
                          }`}
                        />
                        {albertVozRoleta === 'gravando' && (
                          <div className="absolute inset-0 rounded-2xl bg-red-500/5 pointer-events-none flex items-center justify-center">
                            <div className="flex gap-1 items-end h-8">
                              {[3,6,4,7,5,8,4,6,3,5,7,4].map((h, i) => (
                                <div key={i} className={`w-1 rounded-full bg-red-400 animate-pulse`} style={{ height: `${h * 3}px`, animationDelay: `${i * 80}ms` }} />
                              ))}
                            </div>
                          </div>
                        )}
                        {albertVozRoleta === 'processando' && (
                          <div className="absolute inset-0 rounded-2xl bg-primary/5 pointer-events-none flex items-center justify-center">
                            <div className="flex items-center gap-2 text-primary">
                              <Loader2 className="size-4 animate-spin" />
                              <span className="text-xs font-medium">Transcrevendo áudio...</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
  
                    <div className="flex gap-3 mt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setAcaoAlbertRoleta(null)
                          setTextoAlbertRoleta('')
                          setAlbertVozRoleta('idle')
                          clearInterval(albertVozIntervalRef.current)
                        }}
                        className="flex-1 h-12 rounded-2xl border border-border bg-card text-muted-foreground text-xs font-bold transition-all active:scale-95"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setToastMsg('Ação enviada para o Albert!')
                          setTimeout(() => setToastMsg(''), 3000)
                          concluirTarefaRoleta()
                        }}
                        disabled={!textoAlbertRoleta.trim()}
                        className="flex-[2] h-12 rounded-2xl bg-primary text-primary-foreground text-xs font-bold transition-all active:scale-95 disabled:opacity-50"
                      >
                        Enviar
                      </button>
                    </div>
                  </div>
                </div>
              ) : roletaAtividades[indiceRoleta] && (
                <div className="relative w-full max-w-md flex items-center justify-center">
                  
                  {/* Next cards preview (deck effect) */}
                  {!roletaEfeitoFrup &&
                    [1, 2, 3].map((offset) => {
                      if (!roletaAtividades[indiceRoleta + offset]) return null
                      
                      const scale = 1 - offset * 0.05
                      const translateY = offset * 18 // 18px, 36px, 54px downward
                      const opacity = 1 - offset * 0.25
                      
                      return (
                        <div 
                          key={offset}
                          className="absolute w-full max-w-md bg-card border-2 border-border/60 rounded-3xl p-6 flex flex-col gap-5 pointer-events-none transition-all duration-300"
                          style={{
                            transform: `translateY(${translateY}px) scale(${scale})`,
                            opacity: opacity,
                            zIndex: -offset,
                          }}
                        >
                          <div className="flex items-center justify-between border-b border-border/30 pb-3">
                            <span className="h-4 w-16 bg-muted rounded-md" />
                            <span className="h-4 w-10 bg-muted rounded-md" />
                          </div>
                          <div>
                            <div className="h-6 w-32 bg-muted rounded-md mb-2" />
                            <div className="h-12 w-full bg-muted/40 rounded-2xl" />
                          </div>
                          <div className="flex gap-2">
                            <div className="flex-1 h-12 rounded-2xl bg-muted" />
                            <div className="size-12 rounded-2xl bg-muted" />
                          </div>
                        </div>
                      )
                    })
                  }

                  {/* Visual Background Indicators for Swipe Actions */}
                  <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl transition-opacity duration-200">
                    {(() => {
                      if (!startX || !currentX || !startY || !currentY) return null;
                      const diffX = currentX - startX;
                      const diffY = currentY - startY;
                      
                      if (Math.abs(diffY) > Math.abs(diffX) && diffY < -30) {
                        return (
                          <div className="w-full h-full bg-blue-500/20 border-2 border-blue-500/50 flex flex-col items-center justify-end pb-8 text-blue-600">
                            <Calendar className="size-12 mb-2" />
                            <span className="font-bold text-sm uppercase tracking-wider">Remarcar</span>
                          </div>
                        )
                      } else if (diffX > 30) {
                        return (
                          <div className="w-full h-full bg-green-500/20 border-2 border-green-500/50 flex items-center justify-start pl-8 text-green-600">
                            <span className="font-bold text-sm uppercase tracking-wider mr-2">Concluir</span>
                            <ChevronRight className="size-12" />
                          </div>
                        )
                      } else if (diffX < -30) {
                        return (
                          <div className="w-full h-full bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-end pr-8 text-amber-600">
                            <ChevronLeft className="size-12 mr-2" />
                            <span className="font-bold text-sm uppercase tracking-wider">Pular</span>
                          </div>
                        )
                      }
                      return null;
                    })()}
                  </div>

                  <div
                    onTouchStart={(e) => {
                      setStartX(e.touches[0].clientX)
                      setStartY(e.touches[0].clientY)
                    }}
                    onTouchMove={(e) => {
                      setCurrentX(e.touches[0].clientX)
                      setCurrentY(e.touches[0].clientY)
                    }}
                    onTouchEnd={() => {
                      if (startX && currentX && startY && currentY) {
                        const diffX = currentX - startX
                        const diffY = currentY - startY
                        
                        if (Math.abs(diffY) > Math.abs(diffX) && diffY < -80) {
                          setRemarcarAtividade(roletaAtividades[indiceRoleta])
                          const now = new Date()
                          setNovaDataRemarcar(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`)
                        } else if (diffX > 80) {
                          concluirTarefaRoleta()
                        } else if (diffX < -80) {
                          pularTarefaRoleta()
                        }
                      }
                      setStartX(0)
                      setCurrentX(0)
                      setStartY(0)
                      setCurrentY(0)
                    }}
                    style={{
                      transform: roletaEfeitoFrup 
                        ? swipeExitDirection === 'left' ? 'translateX(-150%) rotate(-12deg)'
                        : swipeExitDirection === 'right' ? 'translateX(150%) rotate(12deg)'
                        : swipeExitDirection === 'up' ? 'translateY(-150%)'
                        : 'scale(0.9)'
                        : `translate(${startX && currentX ? currentX - startX : 0}px, ${startY && currentY ? currentY - startY : 0}px) rotate(${(startX && currentX ? currentX - startX : 0) * 0.05}deg)`,
                      transition: startX && currentX ? 'none' : 'all 0.3s ease-out',
                      opacity: roletaEfeitoFrup ? 0 : 1
                    }}
                    className={`w-full bg-card border-2 border-border/80 rounded-3xl p-6 flex flex-col gap-5 relative z-10 overflow-hidden ${roletaEfeitoFrup ? 'pointer-events-none' : ''}`}
                  >
                  {/* Swipe Stamps */}
                  <div 
                    className="absolute top-10 right-8 border-[4px] border-green-500 text-green-500 font-black text-3xl uppercase tracking-widest rounded-lg px-4 py-2 rotate-12 pointer-events-none transition-opacity z-50 bg-background/50 backdrop-blur-sm"
                    style={{ opacity: (startX && currentX && (currentX - startX) > 40) ? Math.min(((currentX - startX) - 40) / 100, 1) : 0 }}
                  >
                    Concluir
                  </div>
                  <div 
                    className="absolute top-10 left-8 border-[4px] border-red-500 text-red-500 font-black text-3xl uppercase tracking-widest rounded-lg px-4 py-2 -rotate-12 pointer-events-none transition-opacity z-50 bg-background/50 backdrop-blur-sm"
                    style={{ opacity: (startX && currentX && (currentX - startX) < -40) ? Math.min(((-40 - (currentX - startX))) / 100, 1) : 0 }}
                  >
                    Pular
                  </div>
                  <div 
                    className="absolute bottom-[20%] left-1/2 -translate-x-1/2 border-[4px] border-amber-500 text-amber-500 font-black text-2xl uppercase tracking-widest rounded-lg px-4 py-2 pointer-events-none transition-opacity z-50 bg-background/50 backdrop-blur-sm"
                    style={{ opacity: (startY && currentY && (currentY - startY) < -40 && Math.abs(currentY - startY) > Math.abs(currentX - startX)) ? Math.min(((-40 - (currentY - startY))) / 100, 1) : 0 }}
                  >
                    Remarcar
                  </div>

                  {/* Visual card badge */}
                  <div className="flex items-center justify-between border-b border-border/50 pb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#2B5250] bg-[#2B5250]/10 px-2 py-0.5 rounded-md">
                      {roletaAtividades[indiceRoleta].tipo}
                    </span>
                    <span className="text-[10px] font-semibold text-muted-foreground">
                      Tarefa {indiceRoleta + 1} de {roletaAtividades.length}
                    </span>
                  </div>

                  {/* Task context content */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-serif text-xl font-bold text-foreground">
                        {roletaAtividades[indiceRoleta].cliente}
                      </h4>
                      <span className="text-3xl font-black text-foreground">
                        {roletaAtividades[indiceRoleta].hora}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed bg-muted/40 p-3 rounded-2xl border border-border/40">
                      Você ficou de: <span className="font-semibold text-foreground">{roletaAtividades[indiceRoleta].titulo}</span>
                    </p>
                  </div>

                  {/* Call and Chat CTAs */}
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (typeof window !== 'undefined') {
                            window.dispatchEvent(new CustomEvent('open-simulated-screen', { detail: { tipo: 'ligacao', params: { nome: roletaAtividades[indiceRoleta]?.cliente, telefone: roletaAtividades[indiceRoleta]?.telefone } } }))
                          }
                        }}
                        className="flex-1 flex items-center justify-center gap-2 h-12 rounded-2xl bg-primary text-primary-foreground text-xs font-bold shadow-md transition-all active:scale-95"
                      >
                        <Phone className="size-4" /> Ligar agora
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (typeof window !== 'undefined') {
                            window.dispatchEvent(new CustomEvent('open-simulated-screen', { detail: { tipo: 'whatsapp', params: { nome: roletaAtividades[indiceRoleta]?.cliente } } }))
                          }
                        }}
                        className="flex-1 flex items-center justify-center gap-2 h-12 rounded-2xl bg-[#25D366] text-white text-xs font-bold shadow-md transition-all active:scale-95"
                      >
                        <MessageCircle className="size-4" /> WhatsApp
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAcaoAlbertRoleta(roletaAtividades[indiceRoleta])}
                      className="w-full flex items-center justify-center gap-2 h-12 rounded-2xl bg-amber-500/15 text-amber-900 border border-amber-500/30 text-xs font-bold shadow-sm transition-all active:scale-95"
                    >
                      <Bot className="size-4" strokeWidth={2} /> Ação com Albert
                    </button>
                  </div>

                  {/* Voice Feedback Section */}
                  <div className="border-t border-border/50 pt-4 mt-1 flex flex-col gap-3">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Feedback por Voz da Visita/Atividade
                    </label>

                    {gravandoAudioRoleta ? (
                      <div className="flex items-center justify-between p-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 animate-pulse">
                        <span className="flex items-center gap-2 text-xs font-semibold">
                          <span className="size-2 rounded-full bg-red-600 animate-ping" />
                          Gravando áudio... {timerAudioRoleta}s
                        </span>
                        <button
                          type="button"
                          onClick={toggleAudioRoleta}
                          className="px-3 py-1 rounded-xl bg-red-600 text-white text-[10px] font-bold"
                        >
                          Parar e Transcrever
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={toggleAudioRoleta}
                        className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-dashed border-primary/40 bg-primary/5 text-primary text-xs font-semibold hover:bg-primary/10 transition-all"
                      >
                        <Mic className="size-4 text-primary animate-bounce" />
                        Gravar feedback por áudio
                      </button>
                    )}

                    {feedbackAudioRoleta && (
                      <div className="flex flex-col gap-2 mt-1">
                        <span className="text-[10px] font-bold text-teal-deep flex items-center gap-1">
                          <Bot className="size-3.5" />
                          Transcrição IA (Clique para editar):
                        </span>
                        <textarea
                          value={feedbackAudioRoleta}
                          onChange={(e) => setFeedbackAudioRoleta(e.target.value)}
                          className="w-full h-16 resize-none rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    )}
                  </div>

                  {/* Actions Row (Skip & Conclude) */}
                  <div className="flex gap-2.5">
                    <button
                      type="button"
                      onClick={pularTarefaRoleta}
                      className="flex-1 h-12 rounded-2xl border border-border bg-card text-muted-foreground text-xs font-bold transition-all active:bg-muted"
                    >
                      Pular
                    </button>
                    <button
                      type="button"
                      onClick={concluirTarefaRoleta}
                      className="flex-[2] h-12 rounded-2xl bg-[#2B5250] text-white text-xs font-bold transition-all active:scale-95 shadow-md flex items-center justify-center gap-2"
                    >
                      Concluir
                      <ChevronRight className="size-4" />
                    </button>
                  </div>
                  
                  {/* Gesture Hints */}
                  <div className="flex justify-between items-center text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest pt-1 px-2 select-none pointer-events-none">
                    <span className="flex items-center gap-1"><ChevronLeft size={14} className="-ml-1" /> Pular</span>
                    <span className="flex items-center gap-1 flex-col justify-center translate-y-1"><ChevronUp size={14} className="-mb-1.5" /> Remarcar</span>
                    <span className="flex items-center gap-1 text-primary/70">Concluir <ChevronRight size={14} className="-mr-1" /></span>
                  </div>
                </div>
              </div>
              )
            )}
            
            {!roletaFinalizada && (
              <button
                type="button"
                onClick={() => setModoRoleta(false)}
                className="mt-8 rounded-full bg-muted/80 px-6 py-2.5 text-xs font-bold text-muted-foreground shadow-sm hover:bg-muted active:scale-95 flex items-center gap-2 z-10"
              >
                <X className="size-4" /> Sair do Modo Roleta
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
