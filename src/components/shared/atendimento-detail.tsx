'use client'

import { useState, useEffect, useRef } from 'react'
import {
  ArrowLeft,
  Bot,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Download, Edit2,
  FileText,
  Flame,
  Mail,
  MessageCircle,
  Paperclip,
  Phone,
  Plus,
  StickyNote,
  Trophy,
  User,
  Users,
  X,
  XCircle,
  Star,
  Target,
  Heart,
  Send,
  FileText as DocumentIcon,
  Trash2,
  Edit3,
  MapPin,
  Search,
  Link as LinkIcon
} from 'lucide-react'
import {
  type Atendimento,
  type EventoTimeline,
  type TipoAtividade,
  etapaConfig,
  imoveis,
  origemConfig,
  tempConfig,
  tipoAtividadeConfig,
  isAtividadeAtrasada,
  funis,
  atendimentos as dadosAtendimentos,
} from '@/lib/app-data'
import { empreendimentosMock } from '@/lib/empreendimentos-data'
import { featureFlags } from '@/lib/feature-flags'
import { IAUpsellPage } from '@/components/shared/ia-upsell-page'
import { AtividadeDetalheSheet } from '@/components/shared/atividade-detalhe-sheet'
import { GanhoPerdidoSheet } from '@/components/shared/ganho-perdido-sheet'
import { FormNovaAtividade } from '@/components/shared/form-nova-atividade'
type Etapa = string

const FILTROS_TIMELINE = ['Todos', 'Atividades', 'E-mails', 'Imóveis', 'Notas', 'Outros'] as const

// ─── Helpers ─────────────────────────────────────────────────────────────────
function iconeTimeline(tipo: EventoTimeline['tipo']) {
  const map: Record<EventoTimeline['tipo'], string> = {
    nota: '📝',
    atividade: '📅',
    email: '✉️',
    imovel_enviado: '🏠',
    documento: '📎',
    origem: '🎯',
    etapa: '➡️',
    status: '⭐',
    whatsapp: '💬',
  }
  return map[tipo] ?? '•'
}

function filtroMatches(tipo: EventoTimeline['tipo'], filtro: string): boolean {
  if (filtro === 'Todos') return true
  if (filtro === 'Atividades') return tipo === 'atividade'
  if (filtro === 'E-mails') return tipo === 'email'
  if (filtro === 'Imóveis') return tipo === 'imovel_enviado'
  if (filtro === 'Notas') return tipo === 'nota'
  return ['documento', 'origem', 'etapa', 'status'].includes(tipo)
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function AtendimentoDetail({
  atendimento,
  onBack,
  onStatusChange,
  onEtapaChange,
}: {
  atendimento: Atendimento
  onBack: () => void
  onStatusChange?: (id: string, status: 'ganho' | 'perdido') => void
  onEtapaChange?: (id: string, etapa: Etapa) => void
}) {
  const [aba, setAba] = useState<'historico' | 'atividades' | 'imoveis' | 'documentos' | 'perfil' | 'albert'>('historico')
  const [isClient, setIsClient] = useState(false)
  const [filtroTimeline, setFiltroTimeline] = useState('Todos')
  const [mostrarNovaNota, setMostrarNovaNota] = useState(false)
  const [mostrarNovaAtividade, setMostrarNovaAtividade] = useState(false)
  const [mostrarNovoEmail, setMostrarNovoEmail] = useState(false)
  const [localDocumentos, setLocalDocumentos] = useState(atendimento.documentos)
  const [editandoDocId, setEditandoDocId] = useState<string | null>(null)
  const [novoNomeDoc, setNovoNomeDoc] = useState('')
  const [mostrarAlbert, setMostrarAlbert] = useState(false)
  const [mostrarUpsell, setMostrarUpsell] = useState(false)
  const [nota, setNota] = useState('')
  const [mostrarNovaInteracao, setMostrarNovaInteracao] = useState(false)
  const [localTimeline, setLocalTimeline] = useState(() => {
    const globalAtendimento = dadosAtendimentos.find(a => a.id === atendimento.id)
    return [...(globalAtendimento?.timeline || atendimento.timeline || [])].sort((a, b) => {
      if (a.id > b.id) return -1;
      if (a.id < b.id) return 1;
      return 0;
    })
  })
  const [localAtividades, setLocalAtividades] = useState(() => {
    const globalAtendimento = dadosAtendimentos.find(a => a.id === atendimento.id)
    return [...(globalAtendimento?.atividades || atendimento.atividades || [])].sort((a, b) => {
      const parseDate = (d: string, h: string) => {
        if (d === 'Hoje') return new Date(`1970-01-01T${h}:00`)
        if (d === 'Amanhã') return new Date(`1970-01-02T${h}:00`)
        return new Date(`${d}T${h}:00`)
      }
      return parseDate(a.data, a.hora).getTime() - parseDate(b.data, b.hora).getTime()
    })
  })
  const [atividadeSelecionada, setAtividadeSelecionada] = useState<any>(null)
  const [sheetGanhoPerdido, setSheetGanhoPerdido] = useState<'ganho' | 'perdido' | null>(null)
  const [expandedTimelineItemId, setExpandedTimelineItemId] = useState<string | null>(null)
  const [confirmacaoEtapa, setConfirmacaoEtapa] = useState<{ id: string, etapaId: string, nomeDaEtapa: string } | null>(null)

  // States for Document Request Flow
  const [solicitarDocs, setSolicitarDocs] = useState(false)
  const [docsSelecionadosParaSolicitar, setDocsSelecionadosParaSolicitar] = useState<Set<string>>(new Set())
  const documentosSugeridos = ['RG', 'CPF', 'Comprovante de Residência', 'Certidão de Casamento', 'Holerite', 'Imposto de Renda']

  useEffect(() => {
    const handleUpdate = () => {
      const globalAtendimento = dadosAtendimentos.find(a => a.id === atendimento.id)
      if (globalAtendimento) {
        setLocalTimeline([...(globalAtendimento.timeline || [])].sort((a, b) => {
          if (a.id > b.id) return -1;
          if (a.id < b.id) return 1;
          return 0;
        }))
        setLocalAtividades([...(globalAtendimento.atividades || [])].sort((a, b) => {
          const parseDate = (d: string, h: string) => {
            if (d === 'Hoje') return new Date(`1970-01-01T${h}:00`)
            if (d === 'Amanhã') return new Date(`1970-01-02T${h}:00`)
            return new Date(`${d}T${h}:00`)
          }
          return parseDate(a.data, a.hora).getTime() - parseDate(b.data, b.hora).getTime()
        }))
      }
    }
    window.addEventListener('app-data-updated', handleUpdate)
    return () => window.removeEventListener('app-data-updated', handleUpdate)
  }, [atendimento.id])

  // 4Q e FORD Edit states
  const [editing4Q, setEditing4Q] = useState(false)
  const [form4Q, setForm4Q] = useState({ quem: '', oQue: '', quando: '', quanto: '' })
  const [editingFORD, setEditingFORD] = useState(false)
  const [formFORD, setFormFORD] = useState({ familia: '', ocupacao: '', recreacao: '', sonhos: '' })

  // Imóveis selection and sending
  const [imoveisSelecionados, setImoveisSelecionados] = useState<string[]>([])
  const [previewEnvio, setPreviewEnvio] = useState<{ tipo: 'email' | 'whatsapp', imoveis: any[] } | null>(null)
  const [textoEnvio, setTextoEnvio] = useState('')
  const [assuntoEnvio, setAssuntoEnvio] = useState('')
  const [termoAberto, setTermoAberto] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [toastMensagem, setToastMensagem] = useState<string | null>(null)

  const [abaImoveis, setAbaImoveis] = useState<'imoveis' | 'empreendimentos'>('imoveis')

  const imoveisEmVisitaAtiva = new Set<string>()
  localAtividades.forEach(a => {
    if (a.tipo === 'visita' && !a.concluida && a.imoveisVisitados) {
      a.imoveisVisitados.forEach(imv => imoveisEmVisitaAtiva.add(imv.id))
    }
  })

  const [mostrarVincularVisita, setMostrarVincularVisita] = useState(false)

  // Busca manual de imóveis
  const [buscaManualImoveis, setBuscaManualImoveis] = useState('')

  useEffect(() => { setIsClient(true) }, [])

  // Reset states when the atendimento changes
  useEffect(() => {
    if (atendimento?.perfil) {
      setForm4Q({
        quem: atendimento.perfil.metodo4Q?.quem || '',
        oQue: atendimento.perfil.metodo4Q?.oQue || '',
        quando: atendimento.perfil.metodo4Q?.quando || '',
        quanto: atendimento.perfil.metodo4Q?.quanto || '',
      })
      setFormFORD({
        familia: atendimento.perfil.metodoFORD?.familia || '',
        ocupacao: atendimento.perfil.metodoFORD?.ocupacao || '',
        recreacao: atendimento.perfil.metodoFORD?.recreacao || '',
        sonhos: atendimento.perfil.metodoFORD?.sonhos || '',
      })
    }
  }, [atendimento?.id])

  const funilDoLead = funis.find((f) => f.id === atendimento.funilId)
  const etapasFunil = funilDoLead?.etapas || []
  const etapaIdx = etapasFunil.findIndex((e) => e.id === atendimento.etapa)
  const imoveisCompativeis = imoveis.filter((im) => {
    const p = atendimento.perfil
    if (p.finalidade === 'Venda' && im.finalidade !== 'Venda') return false
    if (p.finalidade === 'Locação' && im.finalidade !== 'Locação') return false
    if (p.quartos && im.dorms < p.quartos) return false
    return true
  })

  // Se a busca manual estiver preenchida, filtramos sobre todos imóveis ou empreendimentos
  const imoveisExibidos = abaImoveis === 'imoveis' ? (
    buscaManualImoveis
      ? imoveis.filter(im => im.titulo.toLowerCase().includes(buscaManualImoveis.toLowerCase()) || im.codigo.toLowerCase().includes(buscaManualImoveis.toLowerCase()))
      : imoveis
  ) : (
    buscaManualImoveis
      ? empreendimentosMock.filter(emp => emp.nome.toLowerCase().includes(buscaManualImoveis.toLowerCase()) || emp.codigo.toLowerCase().includes(buscaManualImoveis.toLowerCase()))
      : empreendimentosMock
  )

  function handleSave4Q() {
    if (atendimento) {
      if (!atendimento.perfil.metodo4Q) atendimento.perfil.metodo4Q = { quem: '', oQue: '', quando: '', quanto: '' }
      atendimento.perfil.metodo4Q = { ...form4Q }
    }
    setEditing4Q(false)
  }

  function handleSaveFORD() {
    if (atendimento) {
      if (!atendimento.perfil.metodoFORD) atendimento.perfil.metodoFORD = { familia: '', ocupacao: '', recreacao: '', sonhos: '' }
      atendimento.perfil.metodoFORD = { ...formFORD }
    }
    setEditingFORD(false)
  }

  const timelineFiltrada = localTimeline.filter((e) => filtroMatches(e.tipo, filtroTimeline))

  function handleSalvarInteracao(evento: EventoTimeline) {
    setLocalTimeline([evento, ...localTimeline])
    setMostrarNovaInteracao(false)
  }

  function handleMarcarVisitaMassa() {
    setMostrarNovaAtividade(true)
  }

  function handleVincularVisita(atividadeId: string) {
    const atividade = localAtividades.find(a => a.id === atividadeId)
    if (!atividade) return
    const imoveisAdicionados = imoveis.filter(i => imoveisSelecionados.includes(i.id)).map(i => ({
      id: i.id,
      nome: i.titulo,
      visitado: false,
      endereco: `${i.bairro}, ${i.cidade}`
    }))
    const novosImoveisVisitados = [...(atividade.imoveisVisitados || []), ...imoveisAdicionados]

    setLocalAtividades(prev => prev.map(a => a.id === atividadeId ? { ...a, imoveisVisitados: novosImoveisVisitados } : a))
    setImoveisSelecionados([])
    setMostrarVincularVisita(false)
    setToastMensagem('Imóvel anexado à visita com sucesso!')
    setTimeout(() => setToastMensagem(null), 3000)
  }

  function handleGerarTermoVisita(atividadeId: string) {
    const atividade = localAtividades.find(a => a.id === atividadeId)
    if (!atividade) return

    const novoDoc = {
      id: `doc-${Date.now()}`,
      nome: `Termo de Visita - ${atividade.data}.pdf`,
      tipo: 'pdf',
      url: '#',
      anexadoEm: new Date().toLocaleDateString('pt-BR')
    }
    setLocalDocumentos([...localDocumentos, novoDoc])
    setToastMensagem('Termo gerado e salvo na aba Documentos!')
    setTimeout(() => setToastMensagem(null), 3000)
    setAtividadeSelecionada(null) // Optional: close the sheet
  }

  function handleGerarTermo() {
    setTermoAberto(true)
  }

  function toggleSelecionarImovel(id: string) {
    if (imoveisEmVisitaAtiva.has(id)) return
    if (imoveisSelecionados.includes(id)) {
      setImoveisSelecionados(imoveisSelecionados.filter(i => i !== id))
    } else {
      setImoveisSelecionados([...imoveisSelecionados, id])
    }
  }

  function abrirPreviewEnvio(tipo: 'email' | 'whatsapp', imoveisParaEnviar: any[]) {
    let msg = `Olá ${atendimento?.nome}, separei as seguintes opções para você:\n\n`
    imoveisParaEnviar.forEach(im => {
      msg += `- ${im.titulo || im.nome} (${im.codigo})\n  Preço: ${im.preco || im.precoMin}\n\n`
    })
    msg += `O que acha de agendarmos uma visita?`
    setTextoEnvio(msg)
    setAssuntoEnvio('Sugestão de imóveis incríveis para você')
    setPreviewEnvio({ tipo, imoveis: imoveisParaEnviar })
  }

  function handleEnviar() {
    if (!previewEnvio) return
    const evento: EventoTimeline = {
      id: `evt-${Date.now()}`,
      tipo: previewEnvio.tipo === 'email' ? 'email' : 'atividade',
      descricao: `Imóveis enviados por ${previewEnvio.tipo}:\n${textoEnvio}`,
      data: 'Hoje',
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    }
    setLocalTimeline([evento, ...localTimeline])
    setPreviewEnvio(null)
    setImoveisSelecionados([])
  }

  function handleConcluirAtividade(id: string, statusConcluida: boolean, feedback?: string, agendarProxima?: boolean) {
    setLocalAtividades((prev) => prev.map((a) => (a.id === id ? { ...a, concluida: statusConcluida } : a)))

    if (statusConcluida && feedback) {
      // Add feedback as a note/timeline event
      const evento: EventoTimeline = {
        id: `evt-${Date.now()}`,
        tipo: 'atividade',
        descricao: `Atividade concluída com feedback: "${feedback}"`,
        data: 'Hoje',
        hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      }
      setLocalTimeline((prev) => [evento, ...prev])
    }

    if (statusConcluida) {
      setMostrarNovaAtividade(true)
    }
    setAtividadeSelecionada(null)
  }

  function handleDownloadDoc(nome: string) {
    setToastMensagem(`Baixando ${nome}...`)
    setTimeout(() => setToastMensagem(null), 3000)
  }

  function handleDeletarDoc(id: string) {
    setLocalDocumentos(localDocumentos.filter(d => d.id !== id))
  }

  function handleSalvarNomeDoc(id: string) {
    setLocalDocumentos(localDocumentos.map(d => d.id === id ? { ...d, nome: novoNomeDoc } : d))
    setEditandoDocId(null)
  }

  function handleUploadDoc(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const ext = file.name.split('.').pop() || 'pdf'
      const novoDoc = {
        id: `d${Date.now()}`,
        nome: file.name,
        tipo: ext.toLowerCase(),
        url: '#',
        anexadoEm: 'Hoje'
      }
      setLocalDocumentos([...localDocumentos, novoDoc])

      const evento: EventoTimeline = {
        id: `evt-${Date.now()}`,
        tipo: 'documento',
        descricao: `Documento ${file.name} anexado`,
        data: 'Hoje',
        hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      }
      setLocalTimeline([evento, ...localTimeline])
    }
  }

  if (!isClient || !atendimento) return null

  return (
    <div className="flex flex-col pb-28">

      {/* Toast Feedback */}
      {toastMensagem && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top fade-in duration-300">
          <div className="bg-primary text-primary-foreground px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 text-sm font-semibold">
            <CheckCircle2 className="size-4" />
            {toastMensagem}
          </div>
        </div>
      )}

      {mostrarUpsell && <IAUpsellPage onClose={() => setMostrarUpsell(false)} origem="albert" />}

      {/* Header imersivo */}
      <div className="bg-primary px-5 pb-5 pt-[calc(1rem+env(safe-area-inset-top))] text-primary-foreground">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            aria-label="Voltar"
            className="flex size-10 items-center justify-center rounded-full bg-teal-shadow/40 transition-brand active:scale-95"
          >
            <ArrowLeft className="size-5" strokeWidth={1.5} />
          </button>
          <div className="flex gap-2">
            {atendimento.status === 'aberto' && (
              <>
                <button
                  type="button"
                  onClick={() => setSheetGanhoPerdido('ganho')}
                  className="flex items-center gap-1.5 rounded-full bg-teal-shadow/40 px-3 py-1.5 text-xs font-semibold transition-brand active:scale-95"
                >
                  <Trophy className="size-3.5" strokeWidth={2} />
                  Ganho
                </button>
                <button
                  type="button"
                  onClick={() => setSheetGanhoPerdido('perdido')}
                  className="flex items-center gap-1.5 rounded-full bg-teal-shadow/40 px-3 py-1.5 text-xs font-semibold transition-brand active:scale-95"
                >
                  <XCircle className="size-3.5" strokeWidth={2} />
                  Perdido
                </button>
              </>
            )}
            {atendimento.status !== 'aberto' && (
              <span className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${atendimento.status === 'ganho' ? 'bg-green-500/30' : 'bg-red-500/30'}`}>
                {atendimento.status === 'ganho' ? '🏆 Ganho' : '✗ Perdido'}
              </span>
            )}
          </div>
        </div>

        {/* Dados do cliente */}
        <div className="mt-4 flex items-center gap-3">
          <div className="relative flex size-16 shrink-0 items-center justify-center rounded-full bg-teal-mid/30 text-2xl font-semibold">
            {atendimento.iniciais}
            <span className={`absolute -bottom-0.5 -right-0.5 size-4 rounded-full border-2 border-primary ${tempConfig[atendimento.temperatura].bg}`} />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-semibold">{atendimento.nome}</h1>
            <p className="text-sm text-teal-light">{atendimento.telefone}</p>
            <p className="text-xs text-teal-light/80">{atendimento.email}</p>
          </div>
        </div>

        {/* Info rápida */}
        <div className="mt-3 flex flex-wrap gap-2">
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${origemConfig[atendimento.origem].cor}`}>
            {atendimento.origem}
          </span>
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${etapasFunil.find(e => e.id === atendimento.etapa)?.cor || 'bg-muted'}`}>
            {etapasFunil.find(e => e.id === atendimento.etapa)?.label || atendimento.etapa}
          </span>
          <span className="rounded-full bg-teal-shadow/30 px-2.5 py-1 text-[10px] font-semibold text-teal-light">
            Entrada: {atendimento.dataEntrada}
          </span>
          <span className="rounded-full bg-teal-shadow/30 px-2.5 py-1 text-[10px] font-semibold text-teal-light">
            Última: {atendimento.ultimaInteracao}
          </span>
        </div>

        {/* Ações rápidas */}
        <div className="mt-4 grid grid-cols-5 gap-1.5">
          {[
            { icon: Phone, label: 'Ligar' },
            { icon: MessageCircle, label: 'WA' },
            { icon: Mail, label: 'E-mail', onClick: () => setMostrarNovoEmail(true) },
            { icon: StickyNote, label: 'Nota', onClick: () => setMostrarNovaNota(true) },
            {
              icon: Bot, label: 'Albert', onClick: () => {
                if (!featureFlags.temIA) {
                  setMostrarUpsell(true)
                } else {
                  setMostrarAlbert(true)
                  setAba('albert')
                }
              }
            },
          ].map((a) => (
            <button
              key={a.label}
              type="button"
              onClick={a.onClick}
              className="flex flex-col items-center gap-1 rounded-2xl bg-teal-shadow/40 py-2.5 transition-brand active:scale-95"
            >
              <a.icon className="size-4" strokeWidth={1.5} />
              <span className="text-[10px] font-medium">{a.label}</span>
            </button>
          ))}
        </div>

        {/* Funil — avançar / retroceder etapa */}
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-teal-shadow/40 px-4 py-3">
          <button
            type="button"
            disabled={etapaIdx <= 0}
            onClick={() => {
              if (etapaIdx > 0) {
                const prev = etapasFunil[etapaIdx - 1]
                setConfirmacaoEtapa({ id: atendimento.id, etapaId: prev.id, nomeDaEtapa: prev.label })
              }
            }}
            className="flex size-8 items-center justify-center rounded-full bg-teal-shadow/40 text-teal-light disabled:opacity-30"
          >
            <ChevronLeft className="size-4" strokeWidth={2} />
          </button>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] uppercase tracking-widest text-teal-light/70">Etapa no funil</span>
            <span className="text-sm font-semibold text-white">
              {etapasFunil.find(e => e.id === atendimento.etapa)?.label || atendimento.etapa}
            </span>
            <div className="flex gap-1">
              {etapasFunil.map((e, i) => (
                <span key={e.id} className={`h-1 w-6 rounded-full ${i <= etapaIdx ? 'bg-teal-light' : 'bg-teal-shadow/60'}`} />
              ))}
            </div>
          </div>
          <button
            type="button"
            disabled={etapaIdx >= etapasFunil.length - 1}
            onClick={() => {
              if (etapaIdx < etapasFunil.length - 1) {
                const next = etapasFunil[etapaIdx + 1]
                setConfirmacaoEtapa({ id: atendimento.id, etapaId: next.id, nomeDaEtapa: next.label })
              }
            }}
            className="flex size-8 items-center justify-center rounded-full bg-teal-shadow/40 text-teal-light disabled:opacity-30"
          >
            <ChevronRight className="size-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Abas */}
      <div className="flex overflow-x-auto scrollbar-none border-b border-border bg-card">
        {[
          { id: 'historico', label: 'Histórico', icon: Calendar },
          { id: 'atividades', label: 'Atividades', icon: CheckCircle2 },
          { id: 'imoveis', label: 'Imóveis', icon: Building2 },
          { id: 'documentos', label: 'Docs', icon: Paperclip },
          { id: 'perfil', label: 'Perfil', icon: User },
          { id: 'albert', label: 'Albert', icon: Bot },
        ].map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => {
              if (a.id === 'albert' && !featureFlags.temIA) {
                setMostrarUpsell(true)
              } else {
                setAba(a.id as typeof aba)
              }
            }}
            className={`flex shrink-0 flex-col items-center gap-1 px-4 py-3 text-[11px] font-semibold transition-brand border-b-2 ${aba === a.id
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground'
              }`}
          >
            <a.icon className="size-4" strokeWidth={1.5} />
            {a.label}
          </button>
        ))}
      </div>

      {/* Conteúdo das abas */}
      <div className="px-5 pt-5">
        {/* ── Histórico ── */}
        {aba === 'historico' && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Histórico</h2>
              <button
                type="button"
                onClick={() => setMostrarNovaInteracao(true)}
                className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-brand active:scale-95"
              >
                <Plus className="size-3.5" strokeWidth={2} /> Registro
              </button>
            </div>

            {/* Atividades */}
            {localAtividades.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Calendar className="size-3.5" />
                  Atividades
                </h3>
                <ul className="flex flex-col gap-2">
                  {localAtividades
                    .slice()
                    .sort((a, b) => {
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
                            : 'border-transparent bg-card shadow-soft hover:bg-muted/50 border border-border/50'
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
                            <p className={`truncate text-sm font-semibold ${atv.concluida ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                              {atv.titulo}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {atv.hora}
                            </p>
                          </div>
                          <ChevronRight className={`size-4 ${atv.concluida ? 'text-muted-foreground/30' : 'text-muted-foreground opacity-50'}`} />
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* Filtros timeline */}
            <div className="mb-4 flex gap-2 overflow-x-auto scrollbar-none -mx-5 px-5">
              {FILTROS_TIMELINE.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFiltroTimeline(f)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-brand ${filtroTimeline === f
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border bg-card text-muted-foreground'
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <ol className="relative flex flex-col gap-4 border-l-2 border-border pl-5">
              {timelineFiltrada.map((item) => {
                const isExpanded = expandedTimelineItemId === item.id
                return (
                  <li key={item.id} className="relative">
                    <span className={`absolute -left-[22px] top-1 flex size-5 items-center justify-center rounded-full border border-border text-[10px] transition-colors ${isExpanded ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-foreground'}`}>
                      {iconeTimeline(item.tipo)}
                    </span>
                    {item.importante && (
                      <span className="absolute -left-[30px] -top-1 text-[8px]">⭐</span>
                    )}
                    <button
                      type="button"
                      onClick={() => setExpandedTimelineItemId(isExpanded ? null : item.id)}
                      className="w-full text-left rounded-xl p-3 -ml-3 transition-colors hover:bg-muted/50 focus:outline-none"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                          {item.data} · {item.hora}
                        </p>
                        <ChevronRight className={`size-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </div>
                      <p className="mt-0.5 text-sm font-medium text-foreground pr-4 leading-tight">{item.descricao}</p>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground animate-in slide-in-from-top-1 fade-in duration-200">
                          <p className="font-semibold text-foreground mb-1">Detalhes Adicionais:</p>
                          <p>Origem do registro: {item.tipo === 'whatsapp' ? 'Integração Oficial (API)' : 'Sistema interno'}</p>
                          <p className="mt-1">Registrado por: Atendente Digital (Albert)</p>

                          {item.tipo === 'imovel_enviado' && (
                            <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-primary/10 py-2 font-semibold text-primary">
                              <MapPin className="size-4" /> Ver Imóvel Enviado
                            </button>
                          )}
                        </div>
                      )}
                    </button>
                  </li>
                )
              })}
              {timelineFiltrada.length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhum registro para este filtro.</p>
              )}
            </ol>

            {/* Nova Nota inline */}
            {mostrarNovaNota && (
              <div className="mt-4 rounded-2xl border border-border bg-card p-4">
                <p className="mb-2 text-sm font-semibold text-foreground">Nova nota</p>
                <textarea
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                  placeholder="Escreva sua anotação..."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setMostrarNovaNota(false); setNota('') }}
                    className="flex-1 rounded-xl border border-border py-2 text-sm font-semibold text-muted-foreground"
                  >Cancelar</button>
                  <button
                    type="button"
                    onClick={() => { setMostrarNovaNota(false); setNota('') }}
                    className="flex-1 rounded-xl bg-primary py-2 text-sm font-semibold text-primary-foreground"
                  >Salvar nota</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Atividades ── */}
        {aba === 'atividades' && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Atividades</h2>
              <button
                type="button"
                onClick={() => setMostrarNovaAtividade(true)}
                className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"
              >
                <Plus className="size-3.5" strokeWidth={2} /> Agendar
              </button>
            </div>
            <ul className="flex flex-col gap-3">
              {localAtividades.map((atv) => (
                <li key={atv.id}>
                  <button
                    type="button"
                    onClick={() => setAtividadeSelecionada({ ...atv, cliente: atendimento.nome, telefone: atendimento.telefone, whatsapp: atendimento.telefone })}
                    className={`w-full text-left rounded-[1.25rem] bg-card shadow-soft p-4 transition-brand hover:bg-muted/50 ${atv.concluida ? 'opacity-70 grayscale' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`rounded-xl px-2.5 py-1 text-xs font-semibold ${tipoAtividadeConfig[atv.tipo]?.cor || 'bg-muted'}`}>
                        {tipoAtividadeConfig[atv.tipo]?.emoji || '📅'} {tipoAtividadeConfig[atv.tipo]?.label || atv.tipo}
                      </span>
                      {atv.importante && <Star className="size-4 text-amber fill-amber" strokeWidth={0} />}
                    </div>
                    <p className={`mt-2 text-sm font-semibold ${atv.concluida ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                      {atv.titulo}
                    </p>
                    {atv.descricao && <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{atv.descricao}</p>}
                    <p className={`mt-2 flex items-center gap-1 font-mono text-[11px] ${atv.concluida ? 'text-muted-foreground' : (isAtividadeAtrasada(atv.data, atv.hora) ? 'text-red-500' : 'text-primary')}`}>
                      {atv.data === 'Hoje' ? 'Hoje' : atv.data} · {atv.hora}
                      {!atv.concluida && isAtividadeAtrasada(atv.data, atv.hora) && (
                        <span className="ml-2 rounded text-[9px] font-bold text-red-500 bg-red-500/10 border border-red-500/20 px-1.5 py-0.5">ATRASADA</span>
                      )}
                    </p>
                  </button>
                </li>
              ))}
              {localAtividades.length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhuma atividade agendada.</p>
              )}
            </ul>

            {mostrarNovaAtividade && (
              <div className="fixed inset-0 z-[60] flex flex-col justify-end">
                <button type="button" onClick={() => setMostrarNovaAtividade(false)} className="absolute inset-0 bg-teal-shadow/40 backdrop-blur-[2px]" />
                <div className="relative flex flex-col rounded-t-3xl bg-card shadow-2xl animate-in slide-in-from-bottom duration-200 max-h-[90dvh]">
                  <div className="flex justify-center pt-3 pb-1 shrink-0"><div className="h-1 w-10 rounded-full bg-border" /></div>
                  <div className="flex-1 overflow-y-auto px-6 py-2 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
                    <FormNovaAtividade
                      defaultClienteId={atendimento.id}
                      onClose={() => setMostrarNovaAtividade(false)}
                      onSalvar={(id, atv, tml) => {
                        if (atv) setLocalAtividades((prev) => [atv, ...prev])
                        if (tml) handleSalvarInteracao(tml)
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Imóveis ── */}
        {aba === 'imoveis' && (
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Opções de Imóveis</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Baseado no perfil de busca do cliente
              </p>
            </div>

            <div className="mb-4 flex rounded-full bg-muted/50 p-1 w-full max-w-sm">
              <button
                onClick={() => { setAbaImoveis('imoveis'); setBuscaManualImoveis(''); setImoveisSelecionados([]) }}
                className={`relative flex-1 rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${abaImoveis === 'imoveis' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Imóveis ({imoveisCompativeis.length})
              </button>
              <button
                onClick={() => { setAbaImoveis('empreendimentos'); setBuscaManualImoveis(''); setImoveisSelecionados([]) }}
                className={`relative flex-1 rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${abaImoveis === 'empreendimentos' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Empreendimentos
              </button>
            </div>

            {((abaImoveis === 'imoveis' && imoveisCompativeis.length === 0) || abaImoveis === 'empreendimentos') && (
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={buscaManualImoveis}
                  onChange={(e) => setBuscaManualImoveis(e.target.value)}
                  placeholder={`Pesquisar por código ou título...`}
                  className="w-full rounded-2xl border border-border bg-card pl-10 pr-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>
            )}

            <ul className={`flex flex-col gap-3 ${imoveisSelecionados.length > 0 ? 'pb-40' : ''}`}>
              {imoveisExibidos.map((im) => (
                <li key={im.id} className={`relative rounded-[1.25rem] bg-card shadow-soft p-4 border transition-colors ${imoveisSelecionados.includes(im.id) ? 'border-primary bg-primary/5' : 'border-transparent'} ${imoveisEmVisitaAtiva.has(im.id) ? 'opacity-80' : ''}`}>
                  {abaImoveis === 'imoveis' && imoveisCompativeis.length === 0 && !buscaManualImoveis && !imoveisEmVisitaAtiva.has(im.id) && (
                    <span className="absolute -top-2.5 right-4 rounded-full bg-amber text-[#8a5a1e] px-2 py-0.5 text-[10px] font-bold shadow-sm">
                      Fora do perfil
                    </span>
                  )}
                  {imoveisEmVisitaAtiva.has(im.id) && (
                    <span className="absolute -top-2.5 right-4 rounded-full bg-teal-mid/20 text-teal-deep border border-teal-mid/30 px-2 py-0.5 text-[10px] font-bold shadow-sm flex items-center gap-1">
                      <Calendar className="size-3" /> Já em visita
                    </span>
                  )}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        disabled={imoveisEmVisitaAtiva.has(im.id)}
                        checked={imoveisSelecionados.includes(im.id)}
                        onChange={() => toggleSelecionarImovel(im.id)}
                        className="mt-1 size-5 rounded border-border text-primary focus:ring-primary disabled:opacity-50"
                      />
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{im.codigo}</p>
                        <p className="mt-1 text-sm font-semibold text-foreground">{'titulo' in im ? im.titulo : im.nome}</p>
                        <p className="text-xs text-muted-foreground">{im.bairro}, {im.cidade}</p>
                        <p className="mt-1 font-mono text-sm font-semibold text-primary">{'preco' in im ? im.preco : im.precoMin}</p>
                      </div>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${im.status === 'Livre' || im.status === 'Lançamento' ? 'bg-teal-mid/20 text-teal-deep' : 'bg-amber/20 text-[#8a5a1e]'}`}>
                      {im.status}
                    </span>
                  </div>
                  <div className="mt-3 flex gap-2 border-t border-border pt-3">
                    <button type="button" onClick={() => abrirPreviewEnvio('email', [im])} className="flex-1 rounded-xl bg-primary/10 py-2 text-xs font-semibold text-primary active:scale-95 transition-brand">
                      <Mail className="mb-0.5 inline size-3.5 mr-1" strokeWidth={1.5} />
                      Enviar por e-mail
                    </button>
                    <button type="button" onClick={() => abrirPreviewEnvio('whatsapp', [im])} className="flex-1 rounded-xl bg-green-100 py-2 text-xs font-semibold text-green-700 active:scale-95 transition-brand">
                      <MessageCircle className="mb-0.5 inline size-3.5 mr-1" strokeWidth={1.5} />
                      WhatsApp
                    </button>
                  </div>
                </li>
              ))}
              {imoveisExibidos.length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhuma opção encontrada.</p>
              )}
            </ul>

            {/* Ações em Massa — sticky abaixo da lista */}
            {imoveisSelecionados.length > 0 && (
              <div className="sticky bottom-20 mt-4 rounded-[1.5rem] bg-card p-4 shadow-2xl border border-primary/30 animate-in slide-in-from-bottom-5 z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {imoveisSelecionados.length} imóvel(is) selecionado(s)
                  </span>
                  <button type="button" onClick={() => setImoveisSelecionados([])} className="text-xs font-medium text-primary">Limpar</button>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <button type="button" onClick={() => abrirPreviewEnvio('whatsapp', imoveisExibidos.filter(i => imoveisSelecionados.includes(i.id)))} className="flex-1 rounded-xl bg-green-100 py-2.5 text-xs font-semibold text-green-700 active:scale-95 transition-brand">
                      <MessageCircle className="mb-0.5 inline size-4 mr-1" strokeWidth={1.5} />
                      WhatsApp
                    </button>
                    <button type="button" onClick={() => abrirPreviewEnvio('email', imoveisExibidos.filter(i => imoveisSelecionados.includes(i.id)))} className="flex-1 rounded-xl bg-primary/10 py-2.5 text-xs font-semibold text-primary active:scale-95 transition-brand">
                      <Mail className="mb-0.5 inline size-4 mr-1" strokeWidth={1.5} />
                      E-mail
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={handleMarcarVisitaMassa} className="flex-1 rounded-xl bg-background border border-border py-2.5 text-xs font-semibold text-foreground active:scale-95 transition-brand">
                      <Calendar className="mb-0.5 inline size-4 mr-1" strokeWidth={1.5} />
                      Agendar Visita
                    </button>
                    {localAtividades.some(a => a.tipo === 'visita' && !a.concluida) && (
                      <button type="button" onClick={() => setMostrarVincularVisita(true)} className="flex-1 rounded-xl bg-teal-mid/10 py-2.5 text-xs font-semibold text-teal-deep active:scale-95 transition-brand">
                        <LinkIcon className="mb-0.5 inline size-4 mr-1" strokeWidth={1.5} />
                        Vincular a Visita
                      </button>
                    )}
                    <button type="button" onClick={handleGerarTermo} className="flex-1 rounded-xl bg-amber/10 py-2.5 text-xs font-semibold text-[#8a5a1e] active:scale-95 transition-brand">
                      <DocumentIcon className="mb-0.5 inline size-4 mr-1" strokeWidth={1.5} />
                      Gerar Termo
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

        )}

        {/* ── Documentos ── */}
        {aba === 'documentos' && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Documentos</h2>
              <div className="flex gap-2">
                <button type="button" onClick={() => setSolicitarDocs(true)} className="flex items-center gap-1 rounded-full bg-amber/10 px-3 py-1.5 text-xs font-semibold text-amber-600 transition-brand active:scale-95">
                  <Bot className="size-3.5" strokeWidth={2} /> Requisitar
                </button>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-brand active:scale-95">
                  <Plus className="size-3.5" strokeWidth={2} /> Anexar
                </button>
              </div>
            </div>

            {solicitarDocs && (
              <div className="mb-6 rounded-2xl bg-amber-500/10 p-4 border border-amber-500/20 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-amber-900">Quais documentos pedir ao cliente?</h3>
                  <button onClick={() => { setSolicitarDocs(false); setDocsSelecionadosParaSolicitar(new Set()); }} className="text-amber-900/50 hover:text-amber-900">
                    <X className="size-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {documentosSugeridos.map(doc => {
                    const isSelected = docsSelecionadosParaSolicitar.has(doc)
                    return (
                      <button
                        key={doc}
                        onClick={() => {
                          const novoSet = new Set(docsSelecionadosParaSolicitar)
                          if (isSelected) novoSet.delete(doc)
                          else novoSet.add(doc)
                          setDocsSelecionadosParaSolicitar(novoSet)
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${isSelected ? 'bg-amber-500 text-white border-amber-500' : 'bg-background text-foreground border-border'}`}
                      >
                        {doc}
                      </button>
                    )
                  })}
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={docsSelecionadosParaSolicitar.size === 0}
                    onClick={() => {
                      setToastMensagem(`Solicitação enviada via WhatsApp para ${atendimento.nome}!`)
                      setSolicitarDocs(false)
                      setDocsSelecionadosParaSolicitar(new Set())
                      setTimeout(() => setToastMensagem(''), 3000)
                    }}
                    className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-[#25D366] text-white text-xs font-bold disabled:opacity-50"
                  >
                    <MessageCircle className="size-4" /> Via WhatsApp
                  </button>
                  <button
                    disabled={docsSelecionadosParaSolicitar.size === 0}
                    onClick={() => {
                      setToastMensagem(`O Albert vai cobrar ${atendimento.nome} pelos documentos.`)
                      setSolicitarDocs(false)
                      setDocsSelecionadosParaSolicitar(new Set())
                      setTimeout(() => setToastMensagem(''), 3000)
                    }}
                    className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-amber-500 text-white text-xs font-bold disabled:opacity-50"
                  >
                    <Bot className="size-4" /> O Albert pede
                  </button>
                </div>
              </div>
            )}

            <input type="file" ref={fileInputRef} onChange={handleUploadDoc} className="hidden" />
            {localDocumentos.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-10 text-center">
                <FileText className="size-10 text-muted-foreground/40" strokeWidth={1} />
                <p className="text-sm text-muted-foreground">Nenhum documento anexado</p>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-brand active:scale-95">
                  Anexar documento
                </button>
              </div>
            ) : (
              <ul className="flex flex-col gap-3">
                {localDocumentos.map((doc) => (
                  <li key={doc.id} className="flex items-center gap-3 rounded-2xl bg-card shadow-soft p-4">
                    <FileText className="size-8 text-primary shrink-0" strokeWidth={1.5} />
                    <div className="flex-1 min-w-0">
                      {editandoDocId === doc.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={novoNomeDoc}
                            onChange={(e) => setNovoNomeDoc(e.target.value)}
                            className="h-8 w-full rounded border border-border bg-background px-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            autoFocus
                          />
                          <button type="button" onClick={() => handleSalvarNomeDoc(doc.id)} className="h-8 px-3 rounded bg-primary text-xs font-semibold text-white transition-brand active:scale-95">
                            OK
                          </button>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm font-semibold text-foreground truncate">{doc.nome}</p>
                          <p className="text-xs text-muted-foreground">{doc.tipo.toUpperCase()} · {doc.anexadoEm}</p>
                        </>
                      )}
                    </div>
                    {editandoDocId !== doc.id && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button type="button" onClick={() => handleDownloadDoc(doc.nome)} className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-brand active:scale-95">
                          <Download className="size-4" strokeWidth={1.5} />
                        </button>
                        <button type="button" onClick={() => { setEditandoDocId(doc.id); setNovoNomeDoc(doc.nome); }} className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-primary transition-brand active:scale-95">
                          <Edit3 className="size-4" strokeWidth={1.5} />
                        </button>
                        <button type="button" onClick={() => handleDeletarDoc(doc.id)} className="flex size-8 items-center justify-center rounded-full bg-red-100 text-red-600 transition-brand active:scale-95">
                          <Trash2 className="size-4" strokeWidth={1.5} />
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* ── Perfil ── */}
        {aba === 'perfil' && (
          <div>
            <h2 className="mb-4 text-lg font-semibold">O que está buscando</h2>
            <div className="flex flex-col gap-3">
              <InfoRow label="Finalidade" value={atendimento.perfil.finalidade || '—'} />
              <InfoRow label="Tipo de imóvel" value={atendimento.perfil.tipoImovel || '—'} />
              <InfoRow label="Cidades" value={atendimento.perfil.cidades.join(', ') || '—'} />
              <InfoRow label="Bairros preferidos" value={atendimento.perfil.bairros.join(', ') || '—'} />
              <div className="grid grid-cols-3 gap-2">
                <InfoCard label="Quartos" value={atendimento.perfil.quartos?.toString() ?? '—'} />
                <InfoCard label="Suítes" value={atendimento.perfil.suites?.toString() ?? '—'} />
                <InfoCard label="Vagas" value={atendimento.perfil.vagas?.toString() ?? '—'} />
              </div>
              {(atendimento.perfil.areaMin || atendimento.perfil.areaMax) && (
                <InfoRow label="Área" value={`${atendimento.perfil.areaMin ?? '?'} – ${atendimento.perfil.areaMax ?? '?'} m²`} />
              )}
              <InfoRow label="Faixa de valor" value={`${atendimento.perfil.valorMin || '?'} até ${atendimento.perfil.valorMax || '?'}`} />
              <InfoRow label="Prazo para comprar" value={atendimento.perfil.prazoParaComprar || '—'} />
              <div className="flex flex-wrap gap-2">
                {atendimento.perfil.lazer && <TagChip label="Lazer/Piscina" />}
                {atendimento.perfil.varanda && <TagChip label="Varanda" />}
                {atendimento.perfil.mobiliado && <TagChip label="Mobiliado" />}
                {atendimento.perfil.aceitaFinanciamento && <TagChip label="Aceita financiamento" />}
              </div>
              {atendimento.perfil.observacoes && (
                <div className="rounded-2xl bg-cream p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Observações</p>
                  <p className="mt-1 text-sm text-foreground">{atendimento.perfil.observacoes}</p>
                </div>
              )}

              {/* Método 4Q */}
              <div className="mt-4 rounded-3xl bg-teal-mid/5 shadow-soft p-5 border border-teal-mid/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-teal-deep flex items-center gap-2">
                    <Target className="size-5" />
                    Qualificação 4Q
                  </h3>
                  {!editing4Q ? (
                    <button type="button" onClick={() => setEditing4Q(true)} className="flex size-8 items-center justify-center rounded-full bg-teal-mid/10 text-teal-deep transition-brand active:scale-95 hover:bg-teal-mid/20">
                      <Edit2 className="size-4" strokeWidth={1.5} />
                    </button>
                  ) : (
                    <button type="button" onClick={handleSave4Q} className="flex h-8 items-center justify-center rounded-full bg-teal-mid px-3 text-xs font-semibold text-white transition-brand active:scale-95 shadow-sm">
                      Salvar
                    </button>
                  )}
                </div>

                {editing4Q ? (
                  <div className="flex flex-col gap-3 animate-in fade-in">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-deep/70">Quem decide?</span>
                      <input type="text" value={form4Q.quem} onChange={e => setForm4Q(prev => ({ ...prev, quem: e.target.value }))} className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-teal-mid" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-deep/70">O quê busca?</span>
                      <input type="text" value={form4Q.oQue} onChange={e => setForm4Q(prev => ({ ...prev, oQue: e.target.value }))} className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-teal-mid" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-deep/70">Quando precisa?</span>
                      <input type="text" value={form4Q.quando} onChange={e => setForm4Q(prev => ({ ...prev, quando: e.target.value }))} className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-teal-mid" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-deep/70">Quanto (Orçamento)?</span>
                      <input type="text" value={form4Q.quanto} onChange={e => setForm4Q(prev => ({ ...prev, quanto: e.target.value }))} className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-teal-mid" />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-deep/70">Quem decide?</span>
                      <span className="text-sm font-medium text-foreground">{atendimento.perfil.metodo4Q?.quem || '—'}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-deep/70">O quê busca?</span>
                      <span className="text-sm font-medium text-foreground">{atendimento.perfil.metodo4Q?.oQue || '—'}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-deep/70">Quando precisa?</span>
                      <span className="text-sm font-medium text-foreground">{atendimento.perfil.metodo4Q?.quando || '—'}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-deep/70">Quanto (Orçamento)?</span>
                      <span className="text-sm font-medium text-foreground">{atendimento.perfil.metodo4Q?.quanto || '—'}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Método FORD */}
              <div className="mt-3 rounded-3xl bg-amber/5 shadow-soft p-5 border border-amber/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#8a5a1e] flex items-center gap-2">
                    <Heart className="size-5" />
                    Rapport FORD
                  </h3>
                  {!editingFORD ? (
                    <button type="button" onClick={() => setEditingFORD(true)} className="flex size-8 items-center justify-center rounded-full bg-amber/10 text-[#8a5a1e] transition-brand active:scale-95 hover:bg-amber/20">
                      <Edit2 className="size-4" strokeWidth={1.5} />
                    </button>
                  ) : (
                    <button type="button" onClick={handleSaveFORD} className="flex h-8 items-center justify-center rounded-full bg-[#8a5a1e] px-3 text-xs font-semibold text-white transition-brand active:scale-95 shadow-sm">
                      Salvar
                    </button>
                  )}
                </div>

                {editingFORD ? (
                  <div className="flex flex-col gap-3 animate-in fade-in">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8a5a1e]/70">F (Família)</span>
                      <input type="text" value={formFORD.familia} onChange={e => setFormFORD(prev => ({ ...prev, familia: e.target.value }))} className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[#8a5a1e]" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8a5a1e]/70">O (Ocupação)</span>
                      <input type="text" value={formFORD.ocupacao} onChange={e => setFormFORD(prev => ({ ...prev, ocupacao: e.target.value }))} className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[#8a5a1e]" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8a5a1e]/70">R (Recreação)</span>
                      <input type="text" value={formFORD.recreacao} onChange={e => setFormFORD(prev => ({ ...prev, recreacao: e.target.value }))} className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[#8a5a1e]" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8a5a1e]/70">D (Sonhos)</span>
                      <input type="text" value={formFORD.sonhos} onChange={e => setFormFORD(prev => ({ ...prev, sonhos: e.target.value }))} className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[#8a5a1e]" />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8a5a1e]/70">F (Família)</span>
                      <span className="text-sm font-medium text-foreground">{atendimento.perfil.metodoFORD?.familia || '—'}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8a5a1e]/70">O (Ocupação)</span>
                      <span className="text-sm font-medium text-foreground">{atendimento.perfil.metodoFORD?.ocupacao || '—'}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8a5a1e]/70">R (Recreação)</span>
                      <span className="text-sm font-medium text-foreground">{atendimento.perfil.metodoFORD?.recreacao || '—'}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8a5a1e]/70">D (Sonhos)</span>
                      <span className="text-sm font-medium text-foreground">{atendimento.perfil.metodoFORD?.sonhos || '—'}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Albert ── */}
        {aba === 'albert' && (
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <Bot className="size-6" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Albert IA</h2>
                <p className="text-xs text-muted-foreground">Assistente de follow-up automático</p>
              </div>
            </div>

            <div className="rounded-2xl bg-primary/5 p-4 mb-4">
              <p className="text-sm text-foreground">
                O Albert vai fazer um <strong>follow-up automático</strong> com {atendimento.nome} no dia e hora que você definir, enviando uma mensagem personalizada.
              </p>
            </div>

            <div className={`rounded-2xl p-4 mb-4 ${atendimento.albert.ativo ? 'bg-teal-mid/10 border border-teal-mid/30' : 'bg-muted border border-border'}`}>
              {atendimento.albert.ativo ? (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="size-2 rounded-full bg-teal-mid animate-pulse" />
                    <p className="text-sm font-semibold text-teal-deep">Follow-up ativo</p>
                  </div>
                  <p className="text-sm text-foreground">📅 {atendimento.albert.dia} · {atendimento.albert.hora}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{atendimento.albert.instrucoes}</p>

                  <div className="mt-4 border-t border-teal-mid/20 pt-4">
                    <p className="text-xs font-semibold text-teal-deep mb-3 uppercase tracking-wide">Plano de Ação do Albert</p>
                    <div className="flex flex-col gap-3 relative before:absolute before:inset-y-2 before:left-[11px] before:w-px before:bg-teal-mid/30">
                      <div className="flex gap-3 relative">
                        <div className="size-6 shrink-0 rounded-full bg-teal-mid/20 border-2 border-teal-mid flex items-center justify-center text-teal-deep z-10"><MessageCircle className="size-3" /></div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">Envio de WhatsApp Inicial</p>
                          <p className="text-[10px] text-muted-foreground">Albert envia mensagem personalizada baseada nas instruções.</p>
                        </div>
                      </div>
                      <div className="flex gap-3 relative">
                        <div className="size-6 shrink-0 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground z-10"><Bot className="size-3" /></div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">Análise de Resposta</p>
                          <p className="text-[10px] text-muted-foreground">O Albert processa a resposta usando IA e identifica o humor e o interesse do lead.</p>
                        </div>
                      </div>
                      <div className="flex gap-3 relative">
                        <div className="size-6 shrink-0 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground z-10"><Target className="size-3" /></div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">Atualização do CRM</p>
                          <p className="text-[10px] text-muted-foreground">O lead é movido de etapa e uma notificação é gerada para o corretor.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum follow-up agendado para este atendimento.</p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Dia do follow-up</label>
                <input type="date" className="h-12 w-full rounded-2xl border border-border bg-card px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Horário</label>
                <input type="time" className="h-12 w-full rounded-2xl border border-border bg-card px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Instrução para o Albert</label>
                <textarea
                  rows={3}
                  placeholder="Ex: Ligar e perguntar se ainda tem interesse no imóvel..."
                  className="w-full resize-none rounded-2xl border border-border bg-card p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <button type="button" className="h-12 w-full rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-brand active:scale-[0.98]">
                Ativar follow-up do Albert
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Nova Atividade */}
      {mostrarNovaAtividade && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <button type="button" onClick={() => setMostrarNovaAtividade(false)} className="absolute inset-0 bg-teal-shadow/50 backdrop-blur-[2px]" />
          <div className="relative rounded-t-3xl bg-card p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-fog" />
            <FormNovaAtividade
              defaultClienteId={atendimento.id}
              defaultImoveis={imoveis.filter(i => imoveisSelecionados.includes(i.id))}
              onClose={() => {
                setMostrarNovaAtividade(false)
                setImoveisSelecionados([])
              }}
              onSalvar={(id, atv, tml) => {
                if (tml) handleSalvarInteracao(tml)
                if (atv) setLocalAtividades([atv, ...localAtividades])
                setMostrarNovaAtividade(false)
                setImoveisSelecionados([])
              }}
            />
          </div>
        </div>
      )}

      {/* Confirmation Modal for Stage Change */}
      {confirmacaoEtapa && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-[1.25rem] bg-card border border-border shadow-2xl p-6 text-center animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-2">Atenção</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Você deseja mover <strong>{atendimento.nome}</strong> para a etapa <strong>{confirmacaoEtapa.nomeDaEtapa}</strong>?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmacaoEtapa(null)}
                className="flex-1 rounded-xl bg-muted px-4 py-3 text-sm font-semibold text-muted-foreground transition-brand active:scale-95"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  onEtapaChange?.(confirmacaoEtapa.id, confirmacaoEtapa.etapaId)
                  setConfirmacaoEtapa(null)
                  setToastMensagem(`Etapa alterada para ${confirmacaoEtapa.nomeDaEtapa}`)
                  setTimeout(() => setToastMensagem(''), 3000)
                }}
                className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-brand active:scale-95"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Novo E-mail */}
      {mostrarNovoEmail && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <button type="button" onClick={() => setMostrarNovoEmail(false)} className="absolute inset-0 bg-teal-shadow/50 backdrop-blur-[2px]" />
          <div className="relative rounded-t-3xl bg-card p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-fog" />
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Enviar e-mail</h3>
              <button type="button" onClick={() => setMostrarNovoEmail(false)} className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <X className="size-4" strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <input type="text" placeholder="Assunto" className="h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <textarea rows={4} placeholder="Corpo do e-mail..." className="w-full resize-none rounded-2xl border border-border bg-background p-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <button type="button" onClick={() => setMostrarNovoEmail(false)} className="h-12 w-full rounded-2xl bg-primary text-sm font-semibold text-primary-foreground transition-brand active:scale-[0.98]">
                Enviar para {atendimento.email}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Registrar Interação Sheet */}
      {mostrarNovaInteracao && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <button type="button" onClick={() => setMostrarNovaInteracao(false)} className="absolute inset-0 bg-teal-shadow/40 backdrop-blur-[2px]" />
          <div className="relative flex flex-col rounded-t-3xl bg-card shadow-2xl animate-in slide-in-from-bottom duration-200 max-h-[90dvh]">
            <div className="flex justify-center pt-3 pb-1 shrink-0"><div className="h-1 w-10 rounded-full bg-border" /></div>
            <div className="flex-1 overflow-y-auto px-6 py-2 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
              <FormNovaAtividade
                defaultClienteId={atendimento.id}
                onClose={() => setMostrarNovaInteracao(false)}
                onSalvar={(id, atv, tml) => {
                  if (tml) handleSalvarInteracao(tml)
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Atividade Detalhe Sheet */}
      <AtividadeDetalheSheet
        atividade={atividadeSelecionada}
        onClose={() => setAtividadeSelecionada(null)}
        onConcluir={handleConcluirAtividade}
        onGerarTermo={handleGerarTermoVisita}
        onVerNegocio={() => {
          setAtividadeSelecionada(null)
        }}
      />

      {/* Ganho ou Perdido Sheet */}
      {sheetGanhoPerdido && (
        <GanhoPerdidoSheet
          tipo={sheetGanhoPerdido}
          onClose={() => setSheetGanhoPerdido(null)}
          onConfirm={(feedback) => {
            onStatusChange?.(atendimento.id, sheetGanhoPerdido)
          }}
        />
      )}

      {/* Modal Vincular Visita */}
      {mostrarVincularVisita && (
        <div className="absolute inset-0 z-[70] flex flex-col justify-end">
          <button type="button" onClick={() => setMostrarVincularVisita(false)} className="absolute inset-0 bg-teal-shadow/50 backdrop-blur-[2px]" />
          <div className="relative flex flex-col max-h-[80dvh] rounded-t-3xl bg-card p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-fog" />
            <h3 className="text-lg font-semibold mb-4">Vincular a Visita Existente</h3>
            <p className="text-sm text-muted-foreground mb-4">Selecione uma visita futura para anexar os imóveis selecionados.</p>
            <div className="flex-1 overflow-y-auto">
              <ul className="flex flex-col gap-3">
                {localAtividades.filter(a => a.tipo === 'visita' && !a.concluida).map(atv => (
                  <li key={atv.id}>
                    <button
                      type="button"
                      onClick={() => handleVincularVisita(atv.id)}
                      className="w-full text-left rounded-2xl bg-muted/50 p-4 border border-border/50 hover:bg-muted transition-brand"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm">{atv.titulo}</p>
                          <p className="text-xs text-muted-foreground">{atv.data} às {atv.hora}</p>
                        </div>
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-md">
                          {atv.imoveisVisitados?.length || 0} imóveis
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Preview Envio Sheet */}
      {previewEnvio && (
        <div className="absolute inset-0 z-[60] flex flex-col justify-end">
          <button type="button" onClick={() => setPreviewEnvio(null)} className="absolute inset-0 bg-teal-shadow/40 backdrop-blur-[2px]" />
          <div className="relative flex flex-col rounded-t-3xl bg-card shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="h-1 w-10 rounded-full bg-border" />
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
              <h2 className="text-xl font-semibold text-foreground">
                Enviar por {previewEnvio.tipo === 'whatsapp' ? 'WhatsApp' : 'E-mail'}
              </h2>
              <button type="button" onClick={() => setPreviewEnvio(null)} className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-brand active:scale-95">
                <X className="size-4" strokeWidth={1.5} />
              </button>
            </div>
            <div className="p-6">
              {previewEnvio.tipo === 'email' && (
                <div className="mb-4">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Assunto do e-mail</label>
                  <input
                    type="text"
                    value={assuntoEnvio}
                    onChange={(e) => setAssuntoEnvio(e.target.value)}
                    placeholder="Assunto"
                    className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              )}
              <div className="mb-4">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Mensagem</label>
                <textarea
                  value={textoEnvio}
                  onChange={(e) => setTextoEnvio(e.target.value)}
                  className="w-full h-48 rounded-2xl border border-border bg-background p-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
              <button
                type="button"
                onClick={handleEnviar}
                className={`flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-sm font-semibold text-white shadow-xl transition-brand active:scale-[0.98] ${previewEnvio.tipo === 'whatsapp' ? 'bg-green-600 shadow-green-600/20' : 'bg-primary shadow-primary/20'
                  }`}
              >
                <Send className="size-4" />
                Confirmar e Enviar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Termo de Visita Sheet */}
      {termoAberto && (
        <div className="absolute inset-0 z-[60] flex flex-col justify-end">
          <button type="button" onClick={() => setTermoAberto(false)} className="absolute inset-0 bg-teal-shadow/40 backdrop-blur-[2px]" />
          <div className="relative flex flex-col rounded-t-3xl bg-card shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="h-1 w-10 rounded-full bg-border" />
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
              <h2 className="text-xl font-semibold text-foreground">Termo de Visita</h2>
              <button type="button" onClick={() => setTermoAberto(false)} className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-brand active:scale-95">
                <X className="size-4" strokeWidth={1.5} />
              </button>
            </div>
            <div className="p-6">
              <div className="rounded-2xl bg-muted p-5 mb-5 flex flex-col items-center justify-center text-center">
                <DocumentIcon className="size-10 text-muted-foreground mb-3" />
                <p className="text-sm font-semibold">Termo gerado com sucesso</p>
                <p className="text-xs text-muted-foreground">O termo já inclui os dados do cliente {atendimento.nome} e de {imoveisSelecionados.length} imóvel(is).</p>
              </div>
              <div className="flex gap-3">
                <button type="button" className="flex-1 h-12 rounded-2xl border border-border bg-background text-sm font-semibold text-foreground">
                  Baixar PDF
                </button>
                <button type="button" onClick={() => setTermoAberto(false)} className="flex-1 h-12 rounded-2xl bg-primary text-sm font-semibold text-primary-foreground">
                  Assinatura Digital
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Subcomponents ─────────────────────────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-2xl bg-card shadow-soft px-4 py-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground text-right">{value}</span>
    </div>
  )
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl bg-card shadow-soft p-3">
      <span className="font-mono text-xl font-semibold text-primary">{value}</span>
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</span>
    </div>
  )
}

function TagChip({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
      {label}
    </span>
  )
}
