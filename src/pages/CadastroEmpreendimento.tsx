'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Zap,
  LayoutGrid,
  MapPin,
  Tag,
  Info,
  Phone,
  Clock,
  Image as ImageIcon,
  Building2,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  ChevronRight,
  BedDouble,
  Bath,
  Car,
  Megaphone,
  Search,
  Bot,
  Globe,
  Sparkles,
} from 'lucide-react'
import { featureFlags } from '@/lib/feature-flags'
import { IAUpsellPage } from '@/components/shared/ia-upsell-page'
import { maskCEP } from '@/lib/masks'
import { SearchableTagSelect } from '@/components/shared/searchable-tag-select'
import {
  STATUS_CONSTRUCAO,
  PROXIMIDADES_POPULAR,
  PROXIMIDADES_GRUPOS,
  CARACTERISTICAS_POPULAR,
  CARACTERISTICAS_GRUPOS,
} from '@/lib/opcoes-imovel'

// ─── Reusable Components ──────────────────────────────────────────────────────

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
      {required && <span className="ml-1 text-destructive">*</span>}
    </label>
  )
}

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${props.className ?? ''}`}
    />
  )
}

function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none ${props.className ?? ''}`}
    >
      {children}
    </select>
  )
}

function Textarea({ ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none ${props.className ?? ''}`}
    />
  )
}

function AccordionSection({
  title,
  icon,
  isOpen,
  onToggle,
  children,
}: {
  title: string
  icon: React.ReactNode
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className={`rounded-3xl bg-card shadow-soft border transition-all duration-300 ${isOpen ? 'border-primary/20 ring-1 ring-primary/10' : 'border-border'}`}>
      <button type="button" onClick={onToggle} className="w-full flex items-center justify-between p-5 text-left rounded-3xl active:bg-muted/50 transition-colors">
        <h3 className={`flex items-center gap-2 font-semibold ${isOpen ? 'text-primary' : 'text-foreground'}`}>
          {icon}
          {title}
        </h3>
        <span className={`flex size-6 items-center justify-center rounded-full text-lg leading-none transition-transform ${isOpen ? 'bg-primary/10 text-primary rotate-180' : 'bg-muted text-muted-foreground'}`}>
          ↓
        </span>
      </button>
      {isOpen && (
        <div className="flex flex-col gap-4 px-5 pb-5 border-t border-border/30 pt-4 animate-in fade-in slide-in-from-top-2">
          {children}
        </div>
      )}
    </div>
  )
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Fase = 'escolha_modo' | 'formulario_fast' | 'formulario'

type Planta = {
  id: string
  codigo: string
  nome: string
  quartos: string
  banheiros: string
  vagasE: string
  vagasG: string
  tipo: string
  valor: string
}

type Torre = {
  id: string
  nome: string
  status: string
  andares: string
  pavimentos: string
  plantas: Planta[]
}

type Contato = {
  id: string
  nome: string
  cargo: string
  telefone: string
}

type Video = {
  id: string
  url: string
}

type FotoEmp = {
  id: string
  url: string
  nome: string
}

type CronogramaEtapa = {
  inicio: string
  termino: string
  previsaoTermino: string
  porcentagem: string
}

// opcoes importadas de @/lib/opcoes-imovel

const ETAPAS_CRONOGRAMA = ['Construção geral', 'Fundação', 'Estrutura', 'Alvenaria', 'Hidráulica', 'Elétrica', 'Acabamento'] as const
type EtapaCronograma = typeof ETAPAS_CRONOGRAMA[number]

const CAPTADORES_MOCK = [
  'Ricardo Augusto - CRECI 317705',
  'Fernanda Lima - CRECI 200411',
  'Carlos Nogueira - CRECI 198882',
]

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CadastroEmpreendimento({ onClose, empreendimentoParaEditar, onSaveEdit }: { onClose?: () => void, empreendimentoParaEditar?: any, onSaveEdit?: (emp: any) => void }) {
  const [fase, setFase] = useState<Fase>('escolha_modo')
  const [openSection, setOpenSection] = useState<number>(1)
  const [mostrarUpsell, setMostrarUpsell] = useState(false)
  const [iaAtivada, setIaAtivada] = useState<boolean>(featureFlags.temIA)

  // Campos básicos
  const [nomeEmpreendimento, setNomeEmpreendimento] = useState('')
  const [codigo, setCodigo] = useState('')
  const [construtora, setConstrutora] = useState('')
  const [incorporadora, setIncorporadora] = useState('')
  const [administradora, setAdministradora] = useState('')
  const [finalidade, setFinalidade] = useState('Residencial')
  const [statusConstrucao, setStatusConstrucao] = useState('Lançamento')

  // Localização
  const [cep, setCep] = useState('')
  const [estado, setEstado] = useState('')
  const [cidade, setCidade] = useState('')
  const [bairro, setBairro] = useState('')
  const [bairroComercial, setBairroComercial] = useState('')
  const [endereco, setEndereco] = useState('')
  const [numero, setNumero] = useState('')
  const [numeroPortal, setNumeroPortal] = useState('')
  const [zona, setZona] = useState('')

  // Busca CEP Avançada
  const [modalBuscaCep, setModalBuscaCep] = useState(false)
  const [buscaUf, setBuscaUf] = useState('SP')
  const [buscaCidade, setBuscaCidade] = useState('')
  const [buscaLogradouro, setBuscaLogradouro] = useState('')
  const [resultadosCep, setResultadosCep] = useState<any[]>([])
  const [buscandoCep, setBuscandoCep] = useState(false)

  useEffect(() => {
    const limpo = cep.replace(/\D/g, '')
    if (limpo.length === 8) {
      fetch(`https://viacep.com.br/ws/${limpo}/json/`)
        .then(res => res.json())
        .then(data => {
          if (!data.erro) {
            if (data.logradouro) setEndereco(data.logradouro)
            if (data.bairro) setBairro(data.bairro)
            if (data.localidade) setCidade(data.localidade)
            if (data.uf) setEstado(data.uf)
          }
        })
        .catch(console.error)
    }
  }, [cep])

  async function buscarCepAvancado() {
    if (!buscaUf || buscaCidade.length < 3 || buscaLogradouro.length < 3) return
    setBuscandoCep(true)
    try {
      const res = await fetch(`https://viacep.com.br/ws/${buscaUf}/${encodeURI(buscaCidade)}/${encodeURI(buscaLogradouro)}/json/`)
      const data = await res.json()
      setResultadosCep(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
    } finally {
      setBuscandoCep(false)
    }
  }

  // Características
  const [proximidadesSelecionadas, setProximidadesSelecionadas] = useState<string[]>([])
  const [caracteristicasSelecionadas, setCaracteristicasSelecionadas] = useState<string[]>([])

  // Informações internas
  const [captador1, setCaptador1] = useState('')
  const [captador2, setCaptador2] = useState('')
  const [observacoesInternas, setObservacoesInternas] = useState('')

  // Contatos
  const [contatos, setContatos] = useState<Contato[]>([])
  const [mostrarNovoContato, setMostrarNovoContato] = useState(false)
  const [novoContatoNome, setNovoContatoNome] = useState('')
  const [novoContatoCargo, setNovoContatoCargo] = useState('')
  const [novoContatoTelefone, setNovoContatoTelefone] = useState('')

  // Cronograma
  const [etapaCronograma, setEtapaCronograma] = useState<EtapaCronograma>('Construção geral')
  const [cronograma, setCronograma] = useState<Record<EtapaCronograma, CronogramaEtapa>>({
    'Construção geral': { inicio: '', termino: '', previsaoTermino: '', porcentagem: '' },
    'Fundação': { inicio: '', termino: '', previsaoTermino: '', porcentagem: '' },
    'Estrutura': { inicio: '', termino: '', previsaoTermino: '', porcentagem: '' },
    'Alvenaria': { inicio: '', termino: '', previsaoTermino: '', porcentagem: '' },
    'Hidráulica': { inicio: '', termino: '', previsaoTermino: '', porcentagem: '' },
    'Elétrica': { inicio: '', termino: '', previsaoTermino: '', porcentagem: '' },
    'Acabamento': { inicio: '', termino: '', previsaoTermino: '', porcentagem: '' },
  })

  // Fotos
  const fotoInputRef = useRef<HTMLInputElement>(null)
  const [fotos, setFotos] = useState<FotoEmp[]>([])
  const [fotoArrastando, setFotoArrastando] = useState(false)

  // Vídeos
  const [videos, setVideos] = useState<Video[]>([])
  const [novoVideoUrl, setNovoVideoUrl] = useState('')

  // Divulgação
  const WEBSITES_MOCK = ['hallimoveis.com.br', 'zapimoveis.com.br', 'vivareal.com.br', 'olx.com.br']
  const [websitesSelecionados, setWebsitesSelecionados] = useState<string[]>([])
  const [mostrarSeletorWebsites, setMostrarSeletorWebsites] = useState(false)
  const [hotsite, setHotsite] = useState('')
  const [exibirNome, setExibirNome] = useState(true)
  const [exibirValorVenda, setExibirValorVenda] = useState(true)
  const [exibirValorLocacao, setExibirValorLocacao] = useState(true)
  const [exibirFinanciamento, setExibirFinanciamento] = useState(true)
  const [destaqueHome, setDestaqueHome] = useState(false)
  const [destaqueBanner, setDestaqueBanner] = useState(false)
  const [obsInternet, setObsInternet] = useState('')
  const [seoTitulo, setSeoTitulo] = useState('')
  const [seoPalavras, setSeoPalavras] = useState('')
  const [seoDescricao, setSeoDescricao] = useState('')

  // Albert
  const [descricaoIA, setDescricaoIA] = useState('')

  // Torres
  const [torres, setTorres] = useState<Torre[]>([])
  const [torreSelecionada, setTorreSelecionada] = useState<string | null>(null)
  const [mostrarNovaTorre, setMostrarNovaTorre] = useState(false)
  const [novaTorreNome, setNovaTorreNome] = useState('')
  const [novaTorreStatus, setNovaTorreStatus] = useState('')
  const [novaTorreAndares, setNovaTorreAndares] = useState('')
  const [novaTorrePavimentos, setNovaTorrePavimentos] = useState('')
  const [mostrarNovaPlanta, setMostrarNovaPlanta] = useState(false)
  const [novaPlantaCodigo, setNovaPlantaCodigo] = useState('')
  const [novaPlantaNome, setNovaPlantaNome] = useState('')
  const [novaPlantaQuartos, setNovaPlantaQuartos] = useState('')
  const [novaPlantaBanheiros, setNovaPlantaBanheiros] = useState('')
  const [novaPlantaVagasE, setNovaPlantaVagasE] = useState('')
  const [novaPlantaVagasG, setNovaPlantaVagasG] = useState('')
  const [novaPlantaTipo, setNovaPlantaTipo] = useState('Apartamento')
  const [novaPlantaValor, setNovaPlantaValor] = useState('')

  // ── Handlers ────────────────────────────────────────────────────────────────

  function toggleProximidade(p: string) {
    setProximidadesSelecionadas(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    )
  }

  function toggleCaracteristica(c: string) {
    setCaracteristicasSelecionadas(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
    )
  }

  function handleFotos(files: FileList | null) {
    if (!files) return
    const novas = Array.from(files).map(f => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(f),
      nome: f.name,
    }))
    setFotos(prev => [...prev, ...novas])
  }

  function adicionarVideo() {
    if (!novoVideoUrl.trim()) return
    setVideos(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), url: novoVideoUrl.trim() }])
    setNovoVideoUrl('')
  }

  function adicionarContato() {
    if (!novoContatoNome.trim()) return
    setContatos(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      nome: novoContatoNome,
      cargo: novoContatoCargo,
      telefone: novoContatoTelefone,
    }])
    setNovoContatoNome('')
    setNovoContatoCargo('')
    setNovoContatoTelefone('')
    setMostrarNovoContato(false)
  }

  function adicionarTorre() {
    if (!novaTorreNome.trim()) return
    const nova: Torre = {
      id: Math.random().toString(36).substr(2, 9),
      nome: novaTorreNome,
      status: novaTorreStatus,
      andares: novaTorreAndares,
      pavimentos: novaTorrePavimentos,
      plantas: [],
    }
    setTorres(prev => [...prev, nova])
    setTorreSelecionada(nova.id)
    setNovaTorreNome('')
    setNovaTorreStatus('')
    setNovaTorreAndares('')
    setNovaTorrePavimentos('')
    setMostrarNovaTorre(false)
  }

  function adicionarPlanta(torredId: string) {
    if (!novaPlantaCodigo.trim()) return
    const planta: Planta = {
      id: Math.random().toString(36).substr(2, 9),
      codigo: novaPlantaCodigo,
      nome: novaPlantaNome,
      quartos: novaPlantaQuartos,
      banheiros: novaPlantaBanheiros,
      vagasE: novaPlantaVagasE,
      vagasG: novaPlantaVagasG,
      tipo: novaPlantaTipo,
      valor: novaPlantaValor,
    }
    setTorres(prev => prev.map(t =>
      t.id === torredId ? { ...t, plantas: [...t.plantas, planta] } : t
    ))
    setNovaPlantaCodigo('')
    setNovaPlantaNome('')
    setNovaPlantaQuartos('')
    setNovaPlantaBanheiros('')
    setNovaPlantaVagasE('')
    setNovaPlantaVagasG('')
    setNovaPlantaTipo('Apartamento')
    setNovaPlantaValor('')
    setMostrarNovaPlanta(false)
  }

  function updateCronograma(etapa: EtapaCronograma, campo: keyof CronogramaEtapa, value: string) {
    setCronograma(prev => ({
      ...prev,
      [etapa]: { ...prev[etapa], [campo]: value }
    }))
  }

  // ── Fase: Escolha Modo ────────────────────────────────────────────────────

  if (fase === 'escolha_modo') {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <button type="button" onClick={onClose} className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-brand active:scale-95">
            <X className="size-4" strokeWidth={1.5} />
          </button>
          <h2 className="font-serif text-xl font-semibold text-foreground">Cadastrar Empreendimento</h2>
          <div className="w-8" />
        </div>

        <p className="text-sm text-muted-foreground mb-6 text-center">
          Escolha como deseja cadastrar o empreendimento
        </p>

        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => setFase('formulario_fast')}
            className="flex flex-col items-center gap-3 rounded-3xl border-2 border-primary/20 bg-primary/5 p-6 text-center transition-brand active:scale-[0.98] hover:border-primary/40 hover:bg-primary/10"
          >
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
              <Zap className="size-7 text-primary" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground mb-1">Cadastro Rápido (Fast)</p>
              <p className="text-xs text-muted-foreground">Preencha apenas o básico: nome, localização e tipo. Finalize depois.</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setFase('formulario')}
            className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-card p-6 text-center shadow-soft transition-brand active:scale-[0.98] hover:border-border/80"
          >
            <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
              <LayoutGrid className="size-7 text-muted-foreground" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground mb-1">Cadastro Completo</p>
              <p className="text-xs text-muted-foreground">Todos os dados: localização, torres, plantas, cronograma, fotos e mais.</p>
            </div>
          </button>
        </div>
      </div>
    )
  }

  // ── Fase: Formulário Fast ─────────────────────────────────────────────────

  if (fase === 'formulario_fast') {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-2 pb-6">
        <div className="flex items-center justify-between mb-5">
          <button type="button" onClick={() => setFase('escolha_modo')} className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-brand active:scale-95">
            <ChevronRight className="size-4 rotate-180" strokeWidth={1.5} />
          </button>
          <h2 className="font-serif text-xl font-semibold text-foreground">Cadastro Fast</h2>
          <button type="button" onClick={onClose} className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <X className="size-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Identificação */}
          <div>
            <Label required>Nome do Empreendimento</Label>
            <Input
              value={nomeEmpreendimento}
              onChange={e => setNomeEmpreendimento(e.target.value)}
              placeholder="Ex: Residencial Monte Verde"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Código</Label>
              <Input value={codigo} onChange={e => setCodigo(e.target.value)} placeholder="Opcional" />
            </div>
            <div>
              <Label>Finalidade</Label>
              <Select value={finalidade} onChange={e => setFinalidade(e.target.value)}>
                <option>Residencial</option>
                <option>Comercial</option>
                <option>Misto</option>
              </Select>
            </div>
          </div>

          <div>
            <Label>Construtora</Label>
            <Input value={construtora} onChange={e => setConstrutora(e.target.value)} placeholder="Nome da construtora" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Incorporadora</Label>
              <Input value={incorporadora} onChange={e => setIncorporadora(e.target.value)} placeholder="Nome" />
            </div>
            <div>
              <Label>Administradora</Label>
              <Input value={administradora} onChange={e => setAdministradora(e.target.value)} placeholder="Nome" />
            </div>
          </div>

          {/* Localização básica */}
          <div className="border-t border-border/50 pt-4 mt-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-1.5">
              <MapPin className="size-3.5" /> Localização
            </p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <Label>CEP</Label>
                <Input value={cep} onChange={e => setCep(maskCEP(e.target.value))} placeholder="00000-000" />
              </div>
              <div>
                <Label>Cidade</Label>
                <Input value={cidade} onChange={e => setCidade(e.target.value)} placeholder="Cidade" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Bairro</Label>
                <Input value={bairro} onChange={e => setBairro(e.target.value)} placeholder="Bairro" />
              </div>
              <div>
                <Label>Estado</Label>
                <Input value={estado} onChange={e => setEstado(e.target.value)} placeholder="SP" />
              </div>
            </div>
          </div>

          {/* Captador */}
          <div className="border-t border-border/50 pt-4">
            <Label>Captador Responsável</Label>
            <Select value={captador1} onChange={e => setCaptador1(e.target.value)}>
              <option value="">Selecionar...</option>
              {CAPTADORES_MOCK.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-amber text-sm font-semibold text-ink shadow-lg shadow-amber/20 transition-brand active:scale-[0.98]"
          >
            <CheckCircle2 className="size-5" />
            Salvar Rascunho / Fast
          </button>
          <p className="text-center text-xs text-muted-foreground">Você poderá completar torres, plantas e cronograma depois.</p>
        </div>
      </div>
    )
  }

  // ── Fase: Formulário Completo ─────────────────────────────────────────────

  const torreSel = torres.find(t => t.id === torreSelecionada)

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <button type="button" onClick={() => setFase('escolha_modo')} className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-brand active:scale-95">
          <ChevronRight className="size-4 rotate-180" strokeWidth={1.5} />
        </button>
        <h2 className="font-serif text-xl font-semibold text-foreground">Empreendimento</h2>
        <button type="button" onClick={onClose} className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <X className="size-4" strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex flex-col gap-5 pb-10">

        {/* ── 1. IDENTIFICAÇÃO ──────────────────────────────────────────── */}
        <AccordionSection
          title="Identificação"
          icon={<Building2 className="size-4" strokeWidth={2.5} />}
          isOpen={openSection === 1}
          onToggle={() => setOpenSection(openSection === 1 ? 0 : 1)}
        >
          <div>
            <Label required>Nome do Empreendimento</Label>
            <Input value={nomeEmpreendimento} onChange={e => setNomeEmpreendimento(e.target.value)} placeholder="Ex: Residencial Monte Verde" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Código</Label>
              <Input value={codigo} onChange={e => setCodigo(e.target.value)} placeholder="Opcional" />
            </div>
            <div>
              <Label>Finalidade</Label>
              <Select value={finalidade} onChange={e => setFinalidade(e.target.value)}>
                <option>Residencial</option>
                <option>Comercial</option>
                <option>Misto</option>
                <option>Industrial</option>
              </Select>
            </div>
          </div>
          <div>
            <Label>Construtora</Label>
            <Input value={construtora} onChange={e => setConstrutora(e.target.value)} placeholder="Nome da construtora" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Incorporadora</Label>
              <Input value={incorporadora} onChange={e => setIncorporadora(e.target.value)} placeholder="Nome" />
            </div>
            <div>
              <Label>Administradora</Label>
              <Input value={administradora} onChange={e => setAdministradora(e.target.value)} placeholder="Nome" />
            </div>
          </div>
          <div>
            <Label>Status da Obra</Label>
          </div>
        </AccordionSection>

        {/* ── 2. LOCALIZAÇÃO ────────────────────────────────────────────── */}
        <AccordionSection
          title="Localização"
          icon={<MapPin className="size-4" strokeWidth={2.5} />}
          isOpen={openSection === 2}
          onToggle={() => setOpenSection(openSection === 2 ? 0 : 2)}
        >
          {/* Linha 1: CEP, Estado, Cidade */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label required>CEP</Label>
              <Input value={cep} onChange={e => setCep(maskCEP(e.target.value))} placeholder="15093-393" />
              <button type="button" onClick={() => setModalBuscaCep(!modalBuscaCep)} className="mt-1 text-[10px] font-semibold text-primary underline">Não sei meu CEP</button>
            </div>
            <div>
              <Label required>Estado</Label>
              <Input value={estado} onChange={e => setEstado(e.target.value)} placeholder="São Paulo" />
            </div>
            <div>
              <Label required>Cidade</Label>
              <Input value={cidade} onChange={e => setCidade(e.target.value)} placeholder="São José do Rio Preto" />
            </div>
          </div>

          <AnimatePresence>
            {modalBuscaCep && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-2xl border border-border bg-muted/30 p-3 mb-2"
              >
                <p className="mb-2 text-xs font-semibold text-foreground">Buscar CEP por endereço</p>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div className="col-span-1">
                    <input type="text" value={buscaUf} onChange={e => setBuscaUf(e.target.value.toUpperCase().slice(0, 2))} placeholder="UF" className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:border-primary" />
                  </div>
                  <div className="col-span-2">
                    <input type="text" value={buscaCidade} onChange={e => setBuscaCidade(e.target.value)} placeholder="Cidade" className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:border-primary" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <input type="text" value={buscaLogradouro} onChange={e => setBuscaLogradouro(e.target.value)} placeholder="Rua, Avenida..." className="h-10 flex-1 rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:border-primary" />
                  <button type="button" onClick={buscarCepAvancado} disabled={buscandoCep} className="h-10 rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground transition-brand disabled:opacity-50">
                    {buscandoCep ? '...' : 'Buscar'}
                  </button>
                </div>
                {resultadosCep.length > 0 && (
                  <ul className="mt-2 max-h-40 overflow-y-auto rounded-xl border border-border bg-background">
                    {resultadosCep.map((res: any, idx) => (
                      <li key={idx}>
                        <button type="button" onClick={() => {
                          setCep(maskCEP(res.cep))
                          setEndereco(res.logradouro)
                          setBairro(res.bairro)
                          setCidade(res.localidade)
                          setEstado(res.uf)
                          setModalBuscaCep(false)
                        }} className="w-full border-b border-border p-2 text-left text-xs hover:bg-muted last:border-0">
                          <p className="font-semibold">{res.logradouro}</p>
                          <p className="text-muted-foreground">{res.bairro} - {res.localidade}/{res.uf} · CEP: {res.cep}</p>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Linha 2: Bairro, Bairro Comercial */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label required>Bairro</Label>
              <Input value={bairro} onChange={e => setBairro(e.target.value)} placeholder="Jardim Paulistano" />
            </div>
            <div>
              <Label>Bairro Comercial</Label>
              <Input value={bairroComercial} onChange={e => setBairroComercial(e.target.value)} placeholder="Jardim Paulistano" />
            </div>
          </div>

          {/* Linha 3: Endereço, Número, Número Portal, Zona */}
          <div>
            <Label required>Endereço</Label>
            <Input value={endereco} onChange={e => setEndereco(e.target.value)} placeholder="Rua João Manoel Pereira Filho" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label required>Número</Label>
              <Input value={numero} onChange={e => setNumero(e.target.value)} placeholder="680" />
            </div>
            <div>
              <Label>Nº Portal</Label>
              <Input value={numeroPortal} onChange={e => setNumeroPortal(e.target.value)} placeholder="-" />
            </div>
            <div>
              <Label>Zona</Label>
              <Input value={zona} onChange={e => setZona(e.target.value)} placeholder="-" />
            </div>
          </div>

          {/* Botão Mapa */}
          <button
            type="button"
            className="flex items-center gap-2 h-10 px-5 rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition-brand active:scale-95 w-fit"
          >
            <MapPin className="size-4" strokeWidth={1.5} />
            Ver no Mapa
          </button>
        </AccordionSection>

        {/* ── 3. CARACTERÍSTICAS ────────────────────────────────────────── */}
        <AccordionSection
          title="Características"
          icon={<Tag className="size-4" strokeWidth={2.5} />}
          isOpen={openSection === 3}
          onToggle={() => setOpenSection(openSection === 3 ? 0 : 3)}
        >
          <div className="flex flex-col gap-6 mb-4">
            <SearchableTagSelect
              label="Características e Infraestrutura"
              placeholder="Buscar características..."
              groups={CARACTERISTICAS_GRUPOS}
              popular={CARACTERISTICAS_POPULAR}
              selected={caracteristicasSelecionadas}
              onChange={setCaracteristicasSelecionadas}
              maxVisible={10}
            />

            <SearchableTagSelect
              label="Proximidades"
              placeholder="Buscar proximidades..."
              groups={PROXIMIDADES_GRUPOS}
              popular={PROXIMIDADES_POPULAR}
              selected={proximidadesSelecionadas}
              onChange={setProximidadesSelecionadas}
              maxVisible={10}
            />
          </div>
        </AccordionSection>

        {/* ── 4. INFORMAÇÕES ────────────────────────────────────────────── */}
        <AccordionSection
          title="Informações"
          icon={<Info className="size-4" strokeWidth={2.5} />}
          isOpen={openSection === 4}
          onToggle={() => setOpenSection(openSection === 4 ? 0 : 4)}
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Captador 1</Label>
              <Select value={captador1} onChange={e => setCaptador1(e.target.value)}>
                <option value="">Selecionar...</option>
                {CAPTADORES_MOCK.map(c => <option key={c} value={c}>{c}</option>)}
              </Select>
            </div>
            <div>
              <Label>Captador 2</Label>
              <Select value={captador2} onChange={e => setCaptador2(e.target.value)}>
                <option value="">Selecionar...</option>
                {CAPTADORES_MOCK.map(c => <option key={c} value={c}>{c}</option>)}
              </Select>
            </div>
          </div>

          <div>
            <Label>Observações internas</Label>
            <Textarea
              value={observacoesInternas}
              onChange={e => setObservacoesInternas(e.target.value)}
              placeholder="Observações internas"
              rows={4}
            />
          </div>
        </AccordionSection>

        {/* ── 5. CONTATOS ───────────────────────────────────────────────── */}
        <AccordionSection
          title="Contatos"
          icon={<Phone className="size-4" strokeWidth={2.5} />}
          isOpen={openSection === 5}
          onToggle={() => setOpenSection(openSection === 5 ? 0 : 5)}
        >
          <button
            type="button"
            onClick={() => setMostrarNovoContato(!mostrarNovoContato)}
            className="flex items-center gap-2 h-10 px-4 rounded-2xl bg-primary text-sm font-semibold text-primary-foreground transition-brand active:scale-95 w-fit"
          >
            <Plus className="size-4" strokeWidth={2} />
            Cadastrar novo contato
          </button>

          {mostrarNovoContato && (
            <div className="rounded-2xl border border-border bg-muted/30 p-4 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2">
              <div>
                <Label required>Nome</Label>
                <Input value={novoContatoNome} onChange={e => setNovoContatoNome(e.target.value)} placeholder="Nome do contato" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Cargo</Label>
                  <Input value={novoContatoCargo} onChange={e => setNovoContatoCargo(e.target.value)} placeholder="Gerente, Diretor..." />
                </div>
                <div>
                  <Label>Telefone</Label>
                  <Input value={novoContatoTelefone} onChange={e => setNovoContatoTelefone(e.target.value)} placeholder="(00) 00000-0000" />
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={adicionarContato} className="flex-1 h-10 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-brand active:scale-95">
                  Salvar Contato
                </button>
                <button type="button" onClick={() => setMostrarNovoContato(false)} className="h-10 px-4 rounded-xl border border-border text-sm text-muted-foreground transition-brand active:scale-95">
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {contatos.length > 0 && (
            <ul className="flex flex-col gap-2">
              {contatos.map(c => (
                <li key={c.id} className="flex items-center justify-between rounded-2xl bg-card border border-border px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{c.nome}</p>
                    <p className="text-xs text-muted-foreground">{c.cargo} {c.cargo && c.telefone ? '·' : ''} {c.telefone}</p>
                  </div>
                  <button type="button" onClick={() => setContatos(prev => prev.filter(x => x.id !== c.id))} className="flex size-8 items-center justify-center rounded-full bg-destructive/10 text-destructive transition-brand active:scale-95">
                    <Trash2 className="size-4" strokeWidth={1.5} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </AccordionSection>

        {/* ── 6. CRONOGRAMA ─────────────────────────────────────────────── */}
        <AccordionSection
          title="Cronograma"
          icon={<Clock className="size-4" strokeWidth={2.5} />}
          isOpen={openSection === 6}
          onToggle={() => setOpenSection(openSection === 6 ? 0 : 6)}
        >
          {/* Tabs de etapas */}
          <div className="flex gap-1 overflow-x-auto scrollbar-none -mx-1 px-1 pb-1">
            {ETAPAS_CRONOGRAMA.map(etapa => (
              <button
                key={etapa}
                type="button"
                onClick={() => setEtapaCronograma(etapa)}
                className={`shrink-0 rounded-xl px-3 py-2 text-xs font-semibold transition-brand ${etapaCronograma === etapa
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border bg-card text-muted-foreground'
                  }`}
              >
                {etapa}
              </button>
            ))}
          </div>

          {/* Campos da etapa selecionada */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Data de início</Label>
              <Input
                type="date"
                value={cronograma[etapaCronograma].inicio}
                onChange={e => updateCronograma(etapaCronograma, 'inicio', e.target.value)}
              />
            </div>
            <div>
              <Label>Data de término</Label>
              <Input
                type="date"
                value={cronograma[etapaCronograma].termino}
                onChange={e => updateCronograma(etapaCronograma, 'termino', e.target.value)}
              />
            </div>
            <div>
              <Label>Previsão de término</Label>
              <Input
                type="date"
                value={cronograma[etapaCronograma].previsaoTermino}
                onChange={e => updateCronograma(etapaCronograma, 'previsaoTermino', e.target.value)}
              />
            </div>
            <div>
              <Label>% Concluída</Label>
              <div className="relative">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={cronograma[etapaCronograma].porcentagem}
                  onChange={e => updateCronograma(etapaCronograma, 'porcentagem', e.target.value)}
                  placeholder="0"
                  className="pr-8"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
              </div>
              {cronograma[etapaCronograma].porcentagem && (
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${Math.min(Number(cronograma[etapaCronograma].porcentagem), 100)}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        </AccordionSection>

        {/* ── 7. FOTOS E VÍDEOS ─────────────────────────────────────────── */}
        <AccordionSection
          title="Fotos e Vídeos"
          icon={<ImageIcon className="size-4" strokeWidth={2.5} />}
          isOpen={openSection === 7}
          onToggle={() => setOpenSection(openSection === 7 ? 0 : 7)}
        >
          {/* Grid de fotos */}
          {fotos.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {fotos.map((foto, idx) => (
                <div key={foto.id} className="relative aspect-square rounded-2xl overflow-hidden bg-muted group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={foto.url} alt={foto.nome} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFotos(prev => prev.filter((_, i) => i !== idx))}
                      className="flex size-8 items-center justify-center rounded-full bg-destructive text-white"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <span className="absolute bottom-1 left-1 rounded-full bg-black/60 px-1.5 py-0.5 text-[9px] text-white font-mono">
                    {idx === 0 ? 'CAPA' : `${idx + 1}`}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Área de upload */}
          <input
            ref={fotoInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={e => handleFotos(e.target.files)}
          />
          <button
            type="button"
            onClick={() => fotoInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setFotoArrastando(true) }}
            onDragLeave={() => setFotoArrastando(false)}
            onDrop={e => {
              e.preventDefault()
              setFotoArrastando(false)
              handleFotos(e.dataTransfer.files)
            }}
            className={`flex flex-col items-center justify-center gap-2 h-28 w-full rounded-2xl border-2 border-dashed transition-brand ${fotoArrastando
                ? 'border-primary bg-primary/5'
                : 'border-border bg-muted/30 hover:border-primary/40'
              }`}
          >
            <ImageIcon className="size-6 text-muted-foreground" strokeWidth={1.5} />
            <p className="text-xs text-muted-foreground text-center">
              <span className="text-primary font-semibold">Clique aqui</span> ou arraste imagens para adicionar
            </p>
            <p className="text-[10px] text-muted-foreground">Formatos: JPG, JPEG e PNG. Máx: 10MB</p>
          </button>

          {/* Vídeos */}
          <div className="border-t border-border/50 pt-4">
            <Label>Vídeos</Label>
            <div className="flex gap-2">
              <Input
                value={novoVideoUrl}
                onChange={e => setNovoVideoUrl(e.target.value)}
                placeholder="URL do vídeo (YouTube, Vimeo...)"
                className="flex-1"
              />
              <button
                type="button"
                onClick={adicionarVideo}
                className="shrink-0 h-12 px-4 rounded-2xl bg-primary text-sm font-semibold text-primary-foreground transition-brand active:scale-95"
              >
                Adicionar
              </button>
            </div>

            {videos.length === 0 ? (
              <div className="mt-3 flex h-12 items-center justify-center rounded-2xl bg-muted/40 text-sm text-muted-foreground">
                Não há vídeos cadastrados
              </div>
            ) : (
              <ul className="mt-3 flex flex-col gap-2">
                {videos.map(v => (
                  <li key={v.id} className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-2.5">
                    <p className="text-xs text-muted-foreground truncate flex-1">{v.url}</p>
                    <button type="button" onClick={() => setVideos(prev => prev.filter(x => x.id !== v.id))} className="ml-3 flex size-7 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                      <Trash2 className="size-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </AccordionSection>

        {/* ── 8. TORRE / BLOCO ──────────────────────────────────────────── */}
        <AccordionSection
          title="Torre / Bloco"
          icon={<Building2 className="size-4" strokeWidth={2.5} />}
          isOpen={openSection === 8}
          onToggle={() => setOpenSection(openSection === 8 ? 0 : 8)}
        >
          {/* Botão nova torre */}
          <button
            type="button"
            onClick={() => setMostrarNovaTorre(!mostrarNovaTorre)}
            className="flex items-center gap-2 h-10 px-4 rounded-2xl bg-primary text-sm font-semibold text-primary-foreground transition-brand active:scale-95 w-fit"
          >
            <Plus className="size-4" strokeWidth={2} />
            Cadastrar nova torre
          </button>

          {/* Form nova torre */}
          {mostrarNovaTorre && (
            <div className="rounded-2xl border border-border bg-muted/30 p-4 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label required>Nome da Torre</Label>
                  <Input value={novaTorreNome} onChange={e => setNovaTorreNome(e.target.value)} placeholder="Ex: Torre A" />
                </div>
                <div>
                  <Label>Status</Label>
                  <Input value={novaTorreStatus} onChange={e => setNovaTorreStatus(e.target.value)} placeholder="Em obras..." />
                </div>
                <div>
                  <Label>Andares</Label>
                  <Input type="number" value={novaTorreAndares} onChange={e => setNovaTorreAndares(e.target.value)} placeholder="Ex: 20" />
                </div>
                <div>
                  <Label>Pavimentos</Label>
                  <Input type="number" value={novaTorrePavimentos} onChange={e => setNovaTorrePavimentos(e.target.value)} placeholder="Ex: 22" />
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={adicionarTorre} className="flex-1 h-10 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-brand active:scale-95">
                  Salvar Torre
                </button>
                <button type="button" onClick={() => setMostrarNovaTorre(false)} className="h-10 px-4 rounded-xl border border-border text-sm text-muted-foreground transition-brand active:scale-95">
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Tabs de torres */}
          {torres.length > 0 && (
            <>
              <div className="flex gap-1 overflow-x-auto scrollbar-none -mx-1 px-1 pb-1">
                {torres.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTorreSelecionada(t.id)}
                    className={`shrink-0 rounded-xl px-4 py-2 text-xs font-semibold border transition-brand ${torreSelecionada === t.id
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border bg-card text-muted-foreground'
                      }`}
                  >
                    {t.nome} ({t.plantas.length} unidade{t.plantas.length !== 1 ? 's' : ''})
                  </button>
                ))}
              </div>

              {torreSel && (
                <div className="rounded-2xl border border-border bg-card p-4 flex flex-col gap-3">
                  {/* Dados da torre */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {[
                      { label: 'Nome', value: torreSel.nome },
                      { label: 'Status', value: torreSel.status || '-' },
                      { label: 'Andares', value: torreSel.andares || '-' },
                      { label: 'Pavimentos', value: torreSel.pavimentos || '-' },
                    ].map(item => (
                      <div key={item.label}>
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{item.label}</p>
                        <p className="text-sm font-medium text-foreground">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Ações da torre */}
                  <div className="flex gap-2">
                    <button type="button" className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-primary/10 text-xs font-semibold text-primary transition-brand active:scale-95">
                      <Edit3 className="size-3.5" /> Editar
                    </button>
                    <button type="button" onClick={() => {
                      setTorres(prev => prev.filter(t => t.id !== torreSel.id))
                      setTorreSelecionada(torres.find(t => t.id !== torreSel.id)?.id ?? null)
                    }} className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-destructive/10 text-xs font-semibold text-destructive transition-brand active:scale-95">
                      <Trash2 className="size-3.5" /> Excluir
                    </button>
                  </div>

                  {/* Plantas da torre */}
                  <div className="border-t border-border/50 pt-3">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Plantas — {torreSel.plantas.length} unidade{torreSel.plantas.length !== 1 ? 's' : ''}
                      </p>
                      <button
                        type="button"
                        onClick={() => setMostrarNovaPlanta(!mostrarNovaPlanta)}
                        className="flex items-center gap-1.5 h-8 px-3 rounded-xl bg-primary text-[11px] font-semibold text-primary-foreground transition-brand active:scale-95"
                      >
                        <Plus className="size-3.5" strokeWidth={2} />
                        Nova planta
                      </button>
                    </div>

                    {/* Form nova planta */}
                    {mostrarNovaPlanta && (
                      <div className="rounded-2xl border border-border bg-muted/30 p-3 flex flex-col gap-3 mb-3 animate-in fade-in slide-in-from-top-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label required>Código</Label>
                            <Input value={novaPlantaCodigo} onChange={e => setNovaPlantaCodigo(e.target.value)} placeholder="18114" />
                          </div>
                          <div>
                            <Label>Nome</Label>
                            <Input value={novaPlantaNome} onChange={e => setNovaPlantaNome(e.target.value)} placeholder="Ex: EMPREENDIMENTO" />
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          <div>
                            <Label>Dorms</Label>
                            <Input type="number" value={novaPlantaQuartos} onChange={e => setNovaPlantaQuartos(e.target.value)} placeholder="3" />
                          </div>
                          <div>
                            <Label>Banh.</Label>
                            <Input type="number" value={novaPlantaBanheiros} onChange={e => setNovaPlantaBanheiros(e.target.value)} placeholder="3" />
                          </div>
                          <div>
                            <Label>Vag. E</Label>
                            <Input type="number" value={novaPlantaVagasE} onChange={e => setNovaPlantaVagasE(e.target.value)} placeholder="-" />
                          </div>
                          <div>
                            <Label>Vag. G</Label>
                            <Input type="number" value={novaPlantaVagasG} onChange={e => setNovaPlantaVagasG(e.target.value)} placeholder="2" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label>Tipo</Label>
                            <Select value={novaPlantaTipo} onChange={e => setNovaPlantaTipo(e.target.value)}>
                              <option>Apartamento</option>
                              <option>Studio</option>
                              <option>Cobertura</option>
                              <option>Sala Comercial</option>
                              <option>Loja</option>
                            </Select>
                          </div>
                          <div>
                            <Label>Valor</Label>
                            <Input value={novaPlantaValor} onChange={e => setNovaPlantaValor(e.target.value)} placeholder="R$ 0,00" />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => adicionarPlanta(torreSel.id)} className="flex-1 h-10 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-brand active:scale-95">
                            Salvar Planta
                          </button>
                          <button type="button" onClick={() => setMostrarNovaPlanta(false)} className="h-10 px-4 rounded-xl border border-border text-sm text-muted-foreground transition-brand active:scale-95">
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Tabela de plantas */}
                    {torreSel.plantas.length > 0 ? (
                      <div className="rounded-2xl border border-border overflow-hidden">
                        {/* Header */}
                        <div className="grid grid-cols-[80px_1fr_32px_32px_32px_32px_80px_auto] gap-1 bg-muted/50 px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                          <span>Código</span>
                          <span>Nome</span>
                          <span><BedDouble className="size-3.5 mx-auto" /></span>
                          <span><Bath className="size-3.5 mx-auto" /></span>
                          <span><Car className="size-3.5 mx-auto" /> E</span>
                          <span><Car className="size-3.5 mx-auto" /> G</span>
                          <span>Tipo</span>
                          <span>Ações</span>
                        </div>
                        {torreSel.plantas.map(planta => (
                          <div key={planta.id} className="grid grid-cols-[80px_1fr_32px_32px_32px_32px_80px_auto] gap-1 items-center border-t border-border px-3 py-2.5 text-xs">
                            <span className="font-mono font-semibold text-foreground">{planta.codigo}</span>
                            <span className="text-muted-foreground truncate">{planta.nome || '-'}</span>
                            <span className="text-center text-foreground">{planta.quartos || '-'}</span>
                            <span className="text-center text-foreground">{planta.banheiros || '-'}</span>
                            <span className="text-center text-foreground">{planta.vagasE || '-'}</span>
                            <span className="text-center text-foreground">{planta.vagasG || '-'}</span>
                            <span className="text-muted-foreground">{planta.tipo}</span>
                            <div className="flex gap-1">
                              <button type="button" className="h-7 px-2 rounded-lg bg-primary/10 text-[10px] font-semibold text-primary">
                                Editar
                              </button>
                              <button type="button" onClick={() => {
                                setTorres(prev => prev.map(t =>
                                  t.id === torreSel.id
                                    ? { ...t, plantas: t.plantas.filter(p => p.id !== planta.id) }
                                    : t
                                ))
                              }} className="h-7 px-2 rounded-lg bg-destructive/10 text-[10px] font-semibold text-destructive">
                                Remover
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex h-16 items-center justify-center rounded-2xl bg-muted/30 text-sm text-muted-foreground">
                        Nenhuma planta cadastrada nesta torre
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </AccordionSection>

        {/* ── 9. DIVULGAÇÃO ──────────────────────────────────────────── */}
        <AccordionSection
          title="Divulgação"
          icon={<Megaphone className="size-4" strokeWidth={2.5} />}
          isOpen={openSection === 9}
          onToggle={() => setOpenSection(openSection === 9 ? 0 : 9)}
        >
          {/* Websites */}
          <div>
            <Label>Websites</Label>
            <button
              type="button"
              onClick={() => setMostrarSeletorWebsites(!mostrarSeletorWebsites)}
              className="flex items-center gap-2 h-10 px-4 rounded-2xl bg-primary text-sm font-semibold text-primary-foreground transition-brand active:scale-95"
            >
              <Globe className="size-4" strokeWidth={1.5} />
              Selecionar Websites
            </button>
            {mostrarSeletorWebsites && (
              <div className="mt-3 flex flex-wrap gap-2 animate-in fade-in">
                {WEBSITES_MOCK.map(w => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setWebsitesSelecionados(prev =>
                      prev.includes(w) ? prev.filter(x => x !== w) : [...prev, w]
                    )}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-brand ${websitesSelecionados.includes(w)
                        ? 'bg-primary text-primary-foreground'
                        : 'border border-border bg-card text-muted-foreground'
                      }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            )}
            {websitesSelecionados.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {websitesSelecionados.map(w => (
                  <span key={w} className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                    {w}
                    <button type="button" onClick={() => setWebsitesSelecionados(prev => prev.filter(x => x !== w))} className="ml-0.5 text-muted-foreground hover:text-foreground">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Hotsite */}
          <div>
            <Label>Hotsite do empreendimento</Label>
            <Input value={hotsite} onChange={e => setHotsite(e.target.value)} placeholder="https://www.seusite.com.br/empreendimento" />
          </div>

          {/* Exibir no site + Destaque */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Exibir no site</p>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'Nome', state: exibirNome, set: setExibirNome },
                  { label: 'Valor de Venda', state: exibirValorVenda, set: setExibirValorVenda },
                  { label: 'Valor de Locação', state: exibirValorLocacao, set: setExibirValorLocacao },
                  { label: 'Opções de Financiamento', state: exibirFinanciamento, set: setExibirFinanciamento },
                ].map(item => (
                  <label key={item.label} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.state}
                      onChange={e => item.set(e.target.checked)}
                      className="size-4 rounded accent-primary"
                    />
                    <span className="text-xs text-foreground">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Destaque</p>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'Na Página Inicial', state: destaqueHome, set: setDestaqueHome },
                  { label: 'No Banner', state: destaqueBanner, set: setDestaqueBanner },
                ].map(item => (
                  <label key={item.label} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.state}
                      onChange={e => item.set(e.target.checked)}
                      className="size-4 rounded accent-primary"
                    />
                    <span className="text-xs text-foreground">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Observações da Internet */}
          <div>
            <Label>Observações da Internet</Label>
            <Textarea
              value={obsInternet}
              onChange={e => setObsInternet(e.target.value)}
              placeholder="Observações da Internet"
              rows={3}
            />
          </div>

          {/* SEO */}
          <div className="border-t border-border/50 pt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
              <Search className="size-3.5" />
              SEO e Otimização
            </p>
            <div className="flex flex-col gap-3">
              <div>
                <Label>Título</Label>
                <Input value={seoTitulo} onChange={e => setSeoTitulo(e.target.value)} placeholder="Título" />
              </div>
              <div>
                <Label>Palavra-Chave (Keywords)</Label>
                <Input value={seoPalavras} onChange={e => setSeoPalavras(e.target.value)} placeholder="Palavra-Chave (Keywords)" />
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea value={seoDescricao} onChange={e => setSeoDescricao(e.target.value)} placeholder="Descrição" rows={3} />
              </div>
              {/* Preview SEO */}
              {(seoTitulo || seoDescricao) && (
                <div className="rounded-2xl bg-muted/40 border border-border p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                    <Search className="size-3" /> Exemplo
                  </p>
                  <p className="text-sm font-semibold text-primary">{seoTitulo || 'Título do imóvel — Seu website'}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">/{nomeEmpreendimento?.toLowerCase().replace(/\s+/g, '-') || 'empreendimento'}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{seoDescricao || 'Aqui vai a descrição do seu website imobiliário que aparecerá nos buscadores.'}</p>
                </div>
              )}
            </div>
          </div>
        </AccordionSection>

        {/* ── 10. ALBERT ────────────────────────────────────────────────── */}
        <AccordionSection
          title="Albert — IA"
          icon={<Bot className="size-4" strokeWidth={2.5} />}
          isOpen={openSection === 10}
          onToggle={() => setOpenSection(openSection === 10 ? 0 : 10)}
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3 rounded-2xl bg-gradient-to-br from-primary/10 to-teal-mid/5 border border-primary/15 p-4">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/15">
                <Bot className="size-5 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Descrição para o Albert</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Neste campo você deve colocar a descrição do empreendimento com a visão da venda, informações que o Albert deverá evidenciar e mostrar ao cliente durante a apresentação.</p>
              </div>
            </div>

            {iaAtivada ? (
              <Textarea
                value={descricaoIA}
                onChange={e => setDescricaoIA(e.target.value)}
                rows={6}
                placeholder="Descreva as informações que o Albert deve usar ao apresentar este empreendimento ao cliente..."
              />
            ) : (
              <div className="relative">
                <Textarea
                  readOnly
                  rows={6}
                  placeholder="Descreva as informações que o Albert deve usar ao apresentar este empreendimento..."
                  className="cursor-not-allowed bg-muted/30"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-background/70 backdrop-blur-sm">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10">
                    <Bot className="size-6 text-primary" strokeWidth={1.5} />
                  </div>
                  <div className="text-center px-4">
                    <p className="text-sm font-semibold text-foreground">Recurso exclusivo com I.A</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Ative o Albert para configurar como ele apresenta este empreendimento.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMostrarUpsell(true)}
                    className="flex h-9 items-center gap-2 rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-brand active:scale-95"
                  >
                    <Sparkles className="size-3.5" strokeWidth={2} /> Contratar Albert
                  </button>
                </div>
              </div>
            )}
          </div>
        </AccordionSection>

        {/* ── Botão Salvar ────────────────────────────────────────────────── */}
        <button
          type="button"
          onClick={onClose}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-brand active:scale-[0.98]"
        >
          <CheckCircle2 className="size-5" strokeWidth={2} />
          Salvar Empreendimento
        </button>
      </div>

      {/* Overlay: IAUpsellPage */}
      {mostrarUpsell && (
        <div className="absolute inset-0 z-50 overflow-y-auto bg-background">
          <IAUpsellPage
            origem="imovel"
            onClose={() => setMostrarUpsell(false)}
            onSuccess={() => {
              setMostrarUpsell(false)
              setIaAtivada(true)
            }}
          />
        </div>
      )}
    </div>
  )
}
