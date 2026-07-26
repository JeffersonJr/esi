'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, MapPin, Search, ChevronLeft, ChevronDown, Check, X, Building2, UploadCloud, Link as LinkIcon, Sparkles, Wand2, Calendar, FileText, CheckCircle2, Home, Store, Factory, TreePine, LayoutGrid, Ruler, Tag, UserCircle, ImageIcon, Lock, Megaphone, Info, Monitor, Trash2, RotateCw, ChevronRight, Bot, Zap, Mic } from 'lucide-react'
import { featureFlags } from '@/lib/feature-flags'
import { IAUpsellPage } from '@/components/shared/ia-upsell-page'
import { SearchableTagSelect } from '@/components/shared/searchable-tag-select'
import { maskCEP, maskCurrency, maskPhone } from '@/lib/masks'
import {
  STATUS_CONSTRUCAO,
  PROXIMIDADES_POPULAR,
  PROXIMIDADES_GRUPOS,
  CARACTERISTICAS_POPULAR,
  CARACTERISTICAS_GRUPOS,
  CARACTERISTICAS_COMODOS_POPULAR,
  CARACTERISTICAS_COMODOS_GRUPOS
} from '@/lib/opcoes-imovel'

const FINALIDADES = ['Residencial', 'Comercial', 'Industrial', 'Rural'] as const
type FinalidadeCategoria = typeof FINALIDADES[number]

const TIPOS_POR_FINALIDADE: Record<FinalidadeCategoria, string[]> = {
  Comercial: ['Andar Comercial', 'Armazém', 'Barracão', 'Casa', 'Casa Comercial', 'Conjunto Comercial', 'Consultório', 'Depósito', 'Edifício Comercial', 'Fazenda', 'Galpão', 'Garagem', 'Haras', 'Hotel', 'Indústria', 'Loja', 'Loja em Shopping', 'Loteamento', 'Motel', 'Padaria', 'Ponto Comercial', 'Pousada', 'Prédio', 'Sala Comercial', 'Salão', 'Sobrado', 'Studio', 'Terreno', 'Terreno de Condomínio', 'Área'],
  Industrial: ['Armazém', 'Barracão', 'Depósito', 'Galpão', 'Indústria', 'Loteamento', 'Terreno', 'Terreno de Condomínio', 'Área'],
  Rural: ['Chácara', 'Chácara em Condomínio', 'Fazenda', 'Haras', 'Loteamento', 'Rancho', 'Sítio', 'Terreno', 'Terreno de Condomínio', 'Área'],
  Residencial: ['Apartamento', 'Casa', 'Casa de Condomínio', 'Casa de Vila', 'Chácara', 'Chácara em Condomínio', 'Cobertura', 'Flat', 'Garagem', 'Kitnet', 'Loft', 'Loteamento', 'Penthouse', 'Prédio', 'Sala Living', 'Sobrado', 'Sobrado de Condomínio', 'Sobrado de Vila', 'Studio', 'Terreno', 'Terreno de Condomínio', 'Área'],
}

const STATUS_OPTIONS = ['Livre', 'Ocupado', 'Em reforma'] as const

// Resultados simulados que a IA "detectaria" das fotos
const AI_RESULTADOS = [
  {
    titulo: 'Apartamento 3 quartos com sacada',
    tipo: 'Apartamento',
    bairro: 'Jardins',
    cidade: 'São Paulo',
    area: '87',
    quartos: '3',
    valor: 'R$ 980.000',
    finalidade: 'Residencial' as const,
    operacao: 'Venda' as const,
    observacoes: 'Imóvel com acabamento de alto padrão. Sacada ampla com vista para o parque. Cozinha americana integrada. Dois banheiros completos.',
  },
  {
    titulo: 'Studio mobiliado próximo ao metrô',
    tipo: 'Studio',
    bairro: 'Vila Madalena',
    cidade: 'São Paulo',
    area: '42',
    quartos: '1',
    valor: 'R$ 3.200/mês',
    finalidade: 'Residencial' as const,
    operacao: 'Locação' as const,
    observacoes: 'Studio bem localizado, mobiliado completo. Área de serviço separada. Próximo ao metrô e comércio.',
  },
  {
    titulo: 'Casa em condomínio fechado',
    tipo: 'Casa',
    bairro: 'Alphaville',
    cidade: 'Barueri',
    area: '280',
    quartos: '4',
    valor: 'R$ 1.750.000',
    finalidade: 'Residencial' as const,
    operacao: 'Venda' as const,
    observacoes: 'Casa ampla em condomínio com área de lazer completa. Churrasqueira coberta, piscina privativa, 3 suítes.',
  },
]

type Fase = 'upload' | 'analisando' | 'resultado' | 'modo' | 'escolha_modo_manual' | 'escolha_categoria' | 'formulario_fast' | 'formulario'

function AccordionSection({ title, icon, isOpen, onToggle, children }: { title: string, icon: React.ReactNode, isOpen: boolean, onToggle: () => void, children: React.ReactNode }) {
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

type Foto = {
  id: string
  url: string
  titulo: string
  descricao: string
  rotacao: number
}

export default function CadastroImovel({ onClose, imovelParaEditar, onSaveEdit }: { onClose?: () => void, imovelParaEditar?: any, onSaveEdit?: (imovel: any) => void }) {
  const [fase, setFase] = useState<Fase>('escolha_categoria')
  const [cadastroTipoMode, setCadastroTipoMode] = useState<'fast' | 'completo' | 'ia' | null>(null)
  const [transcricaoIA, setTranscricaoIA] = useState('Apartamento alto padrão localizado no bairro Jardins com 3 dormitórios, sacada ampla com vista livre, armários embutidos na cozinha e banheiros, ótima iluminação solar de manhã.')
  const [exibindoTranscricao, setExibindoTranscricao] = useState(false)
  const [albertGravandoAudio, setAlbertGravandoAudio] = useState(false)
  const [albertAudioTimer, setAlbertAudioTimer] = useState(0)
  const [fotos, setFotos] = useState<Foto[]>([])
  const [progresso, setProgresso] = useState(0)
  const [progressoTexto, setProgressoTexto] = useState('')
  const [resultado, setResultado] = useState(AI_RESULTADOS[0])
  const [isIaGerado, setIsIaGerado] = useState(false)
  const [mostrarUpsell, setMostrarUpsell] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [openSection, setOpenSection] = useState<number>(1)
  const [showFastLink, setShowFastLink] = useState(false)
  const [fotoEditando, setFotoEditando] = useState<Foto | null>(null)

  // Campos do formulário
  // 1. Negociações e Tipos
  const [titulo, setTitulo] = useState('')
  const [operacoes, setOperacoes] = useState<string[]>(['Venda'])
  const [finalidade, setFinalidade] = useState<FinalidadeCategoria>('Residencial')
  const [tipoImovel, setTipoImovel] = useState('Apartamento')
  const [codigo, setCodigo] = useState('')
  const [cib, setCib] = useState('')
  const [situacaoImovel, setSituacaoImovel] = useState('Pronto')
  const [statusImovel, setStatusImovel] = useState<(typeof STATUS_OPTIONS)[number]>('Livre')
  const [tipoExclusividade, setTipoExclusividade] = useState<'Nenhuma' | 'Venda' | 'Locação' | 'Ambas'>('Nenhuma')
  const [validadeExclusividade, setValidadeExclusividade] = useState('')

  // Dynamic Industrial & Rural Fields
  const [peDireito, setPeDireito] = useState('')
  const [capacidadePiso, setCapacidadePiso] = useState('')
  const [energiaTrifasica, setEnergiaTrifasica] = useState(false)
  const [areaPatio, setAreaPatio] = useState('')
  const [areaHectares, setAreaHectares] = useState('')
  const [recursosHidricos, setRecursosHidricos] = useState('')
  const [temCurral, setTemCurral] = useState(false)
  const [temCasaSede, setTemCasaSede] = useState(false)

  // 2. Localização
  const [endereco, setEndereco] = useState('')
  const [cep, setCep] = useState('')
  const [bairro, setBairro] = useState('')
  const [cidade, setCidade] = useState('')
  const [condominio, setCondominio] = useState('')
  const [anoConstrucao, setAnoConstrucao] = useState('')
  const [andar, setAndar] = useState('')

  // 3. Composição
  const [quartos, setQuartos] = useState('')
  const [suites, setSuites] = useState('')
  const [statusConstrucao, setStatusConstrucao] = useState('Pronto para morar')
  const [banheiros, setBanheiros] = useState('')
  const [salas, setSalas] = useState('')
  const [vagas, setVagas] = useState('')

  // 4. Busca CEP Avançada
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

  // 4. Medidas
  const [valor, setValor] = useState('')
  const [area, setArea] = useState('') // Área Útil/Construída
  const [areaTotal, setAreaTotal] = useState('')

  // 5. Características e Proximidades
  const [observacoes, setObservacoes] = useState('')
  const [caracteristicasSelecionadas, setCaracteristicasSelecionadas] = useState<string[]>([])
  const [proximidadesSelecionadas, setProximidadesSelecionadas] = useState<string[]>([])
  const [caracteristicasComodos, setCaracteristicasComodos] = useState<string[]>([])
  const [buscaCaracteristica, setBuscaCaracteristica] = useState('')

  // 6. Proprietário
  const [proprietario, setProprietario] = useState('')
  const [emailProprietario, setEmailProprietario] = useState('')
  const [telefoneProprietario, setTelefoneProprietario] = useState('')

  // 7. Mídia
  const [urlVideo, setUrlVideo] = useState('')
  const [urlTour360, setUrlTour360] = useState('')

  // 8. Informações Internas e Documentação
  const [observacoesInternas, setObservacoesInternas] = useState('')

  useEffect(() => {
    if (imovelParaEditar) {
      setTitulo(imovelParaEditar.titulo || '')
      setOperacoes(imovelParaEditar.operacoes || ['Venda'])
      setFinalidade(imovelParaEditar.finalidade || 'Residencial')
      setTipoImovel(imovelParaEditar.tipoImovel || 'Apartamento')
      setCodigo(imovelParaEditar.codigo || '')
      setCib(imovelParaEditar.cib || '')
      setSituacaoImovel(imovelParaEditar.situacaoImovel || 'Pronto')
      setStatusImovel(imovelParaEditar.status || 'Livre')
      setTipoExclusividade(imovelParaEditar.tipoExclusividade || 'Nenhuma')
      setValidadeExclusividade(imovelParaEditar.validadeExclusividade || '')
      setEndereco(imovelParaEditar.enderecoCompleto || '')
      setCep(imovelParaEditar.cep || '')
      setBairro(imovelParaEditar.bairro || '')
      setCidade(imovelParaEditar.cidade || '')
      setCondominio(imovelParaEditar.condominio?.replace(/\D/g, '') || '')
      setAnoConstrucao(imovelParaEditar.anoConstrucao || '')
      setAndar(imovelParaEditar.andar || '')
      setQuartos(String(imovelParaEditar.dorms || ''))
      setSuites(String(imovelParaEditar.suites || ''))
      setBanheiros(String(imovelParaEditar.banheiros || ''))
      setSalas(String(imovelParaEditar.salas || ''))
      setVagas(String(imovelParaEditar.vagas || ''))
      setValor(imovelParaEditar.preco?.replace(/\D/g, '') || '')
      setArea(String(imovelParaEditar.area || ''))
      setAreaTotal(String(imovelParaEditar.areaTotal || ''))
      setObservacoes(imovelParaEditar.descricao || '')
      setCaracteristicasSelecionadas(imovelParaEditar.caracteristicas || [])
      setProprietario(imovelParaEditar.proprietario?.nome || '')
      setEmailProprietario(imovelParaEditar.proprietario?.email || '')
      setTelefoneProprietario(imovelParaEditar.proprietario?.telefone || '')
      setUrlVideo(imovelParaEditar.urlVideo || '')
      setUrlTour360(imovelParaEditar.urlTour360 || '')
      setObservacoesInternas(imovelParaEditar.observacoesInternas || '')
      if (imovelParaEditar.fotos) {
        setFotos(imovelParaEditar.fotos)
      } else if (imovelParaEditar.foto) {
        setFotos([{ id: 'f1', url: imovelParaEditar.foto, titulo: '', descricao: '', rotacao: 0 }])
      }
      setFase('formulario')
    }
  }, [imovelParaEditar])
  const [chaveDisponivel, setChaveDisponivel] = useState('Não')
  const [localChaves, setLocalChaves] = useState('')
  const [matricula, setMatricula] = useState('')
  const [iptu, setIptu] = useState('')
  const [incra, setIncra] = useState('')
  const [energia, setEnergia] = useState('')
  const [agua, setAgua] = useState('')
  const [cartorio, setCartorio] = useState('')
  const [situacaoEscritura, setSituacaoEscritura] = useState('')
  const [captador1, setCaptador1] = useState('')
  const [captador2, setCaptador2] = useState('')
  const [indicador1, setIndicador1] = useState('')
  const [indicador2, setIndicador2] = useState('')
  const [filialImovel, setFilialImovel] = useState('')

  // Albert
  const [descricaoIA, setDescricaoIA] = useState('')
  const [iaAtivada, setIaAtivada] = useState<boolean>(featureFlags.temIA)

  // 9. Divulgação no Website
  const [destaqueHome, setDestaqueHome] = useState(false)
  const [destaqueBanner, setDestaqueBanner] = useState(false)
  const [oportunidade, setOportunidade] = useState(false)

  // 10. SEO e Otimização
  const [seoTitulo, setSeoTitulo] = useState('')
  const [seoPalavras, setSeoPalavras] = useState('')
  const [seoDescricao, setSeoDescricao] = useState('')

  function aplicarResultadoIA(res: typeof AI_RESULTADOS[0]) {
    setTitulo(res.titulo)
    setBairro(res.bairro)
    setCidade(res.cidade)
    setFinalidade(res.finalidade)
    setTipoImovel(res.tipo)
    setOperacoes([res.operacao])
    setValor(res.valor)
    setArea(res.area)
    setQuartos(res.quartos)
    setObservacoes(res.observacoes)
    setIsIaGerado(true)
  }

  function handleFotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    const novasFotos = files.map((f) => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(f),
      titulo: '',
      descricao: '',
      rotacao: 0
    }))
    setFotos((prev) => [...prev, ...novasFotos])
  }

  function resetFields() {
    setTitulo('')
    setOperacoes(['Venda'])
    setCodigo('')
    setCib('')
    setSituacaoImovel('Pronto')
    setStatusImovel('Livre')
    setTipoExclusividade('Nenhuma')
    setValidadeExclusividade('')
    setPeDireito('')
    setCapacidadePiso('')
    setEnergiaTrifasica(false)
    setAreaPatio('')
    setAreaHectares('')
    setRecursosHidricos('')
    setTemCurral(false)
    setTemCasaSede(false)
    setFotos([])
    setValor('')
    setArea('')
    setQuartos('')
    setObservacoes('')
  }

  function handleSave() {
    if (imovelParaEditar && onSaveEdit) {
      onSaveEdit({
        ...imovelParaEditar,
        titulo,
        operacoes,
        finalidade,
        tipoImovel,
        codigo,
        cib,
        situacaoImovel,
        status: statusImovel,
        tipoExclusividade,
        validadeExclusividade,
        enderecoCompleto: endereco,
        cep,
        bairro,
        cidade,
        condominio,
        anoConstrucao,
        andar,
        dorms: Number(quartos),
        suites: Number(suites),
        banheiros: Number(banheiros),
        salas: Number(salas),
        vagas: Number(vagas),
        preco: valor,
        area: Number(area),
        areaTotal: Number(areaTotal),
        descricao: observacoes,
        caracteristicas: caracteristicasSelecionadas,
        proprietario: { nome: proprietario, email: emailProprietario, telefone: telefoneProprietario },
        urlVideo,
        urlTour360,
        observacoesInternas,
        fotos
      })
    }
    if (onClose) onClose(); else window.history.back();
  }

  function moverFoto(index: number, direcao: 'esq' | 'dir') {
    if (direcao === 'esq' && index > 0) {
      const nova = [...fotos]
        ;[nova[index - 1], nova[index]] = [nova[index], nova[index - 1]]
      setFotos(nova)
    } else if (direcao === 'dir' && index < fotos.length - 1) {
      const nova = [...fotos]
        ;[nova[index], nova[index + 1]] = [nova[index + 1], nova[index]]
      setFotos(nova)
    }
  }

  function rotacionarFoto(index: number) {
    const nova = [...fotos]
    nova[index].rotacao = (nova[index].rotacao + 90) % 360
    setFotos(nova)
  }

  function removerFoto(index: number) {
    setFotos(fotos.filter((_, i) => i !== index))
  }

  function atualizarFoto(index: number, campo: 'titulo' | 'descricao', valor: string) {
    const nova = [...fotos]
    nova[index][campo] = valor
    setFotos(nova)
  }

  async function iniciarAnaliseIA() {
    setFase('analisando')
    setProgresso(0)

    const etapas = [
      { texto: 'Carregando imagens...', delay: 600 },
      { texto: 'Identificando tipo de imóvel...', delay: 800 },
      { texto: 'Analisando cômodos e acabamentos...', delay: 900 },
      { texto: 'Estimando metragem por visão computacional...', delay: 700 },
      { texto: 'Detectando localização e bairro...', delay: 600 },
      { texto: 'Calculando valor de mercado...', delay: 700 },
      { texto: 'Gerando descrição automática...', delay: 500 },
    ]

    let totalDelay = 0
    for (let i = 0; i < etapas.length; i++) {
      totalDelay += etapas[i].delay
      setTimeout(() => {
        setProgresso(Math.round(((i + 1) / etapas.length) * 100))
        setProgressoTexto(etapas[i].texto)
      }, totalDelay)
    }

    // Escolhe um resultado aleatório para simular
    const escolhido = AI_RESULTADOS[Math.floor(Math.random() * AI_RESULTADOS.length)]
    setTimeout(() => {
      setResultado(escolhido)
      aplicarResultadoIA(escolhido)
      setFase('formulario')
    }, totalDelay + 400)
  }

  function aplicarCorrecaoTranscricao() {
    setFase('analisando')
    setProgresso(0)
    setProgressoTexto('Analisando transcrição corrigida...')
    
    const etapas = [
      { texto: 'Analisando correções de texto...', delay: 600 },
      { texto: 'Re-processando metragens e características...', delay: 800 },
      { texto: 'Atualizando formulário...', delay: 500 }
    ]

    let totalDelay = 0
    for (let i = 0; i < etapas.length; i++) {
      totalDelay += etapas[i].delay
      setTimeout(() => {
        setProgresso(Math.round(((i + 1) / etapas.length) * 100))
        setProgressoTexto(etapas[i].texto)
      }, totalDelay)
    }

    setTimeout(() => {
      setTitulo('Cobertura Mobiliada em Moema')
      setValor('R$ 2.450.000')
      setQuartos('4')
      setArea('160')
      setFase('formulario')
      setExibindoTranscricao(false)
      setIsIaGerado(true)
    }, totalDelay + 200)
  }

  function toggleAlbertGravandoAudio() {
    if (albertGravandoAudio) {
      setAlbertGravandoAudio(false)
      if ((window as any).albertAudioInterval) clearInterval((window as any).albertAudioInterval)
      setTranscricaoIA(prev => `${prev} [Áudio complementar: O imóvel possui varanda gourmet e 3 vagas de garagem.]`)
    } else {
      setAlbertGravandoAudio(true)
      setAlbertAudioTimer(0)
      const timer = setInterval(() => {
        setAlbertAudioTimer(t => t + 1)
      }, 1000)
      ;(window as any).albertAudioInterval = timer
    }
  }

  // ── Upsell IA ─────────────────────────────────────────────────────────────
  if (mostrarUpsell) {
    return <IAUpsellPage
      onClose={() => setMostrarUpsell(false)}
      onSuccess={() => {
        setMostrarUpsell(false)
        setIaAtivada(true)
        iniciarAnaliseIA()
      }}
      origem="imovel"
    />
  }

  // ── Fase 1: Upload de fotos ───────────────────────────────────────────────
  if (fase === 'upload') {
    return (
      <div>
        <div className="flex items-center justify-between mb-5">
          <button type="button" onClick={() => setFase('escolha_modo_manual')} className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-brand active:scale-95">
            <ChevronLeft className="size-5" />
          </button>
          <h2 className="font-serif text-xl font-semibold text-foreground">Captar imóvel com IA</h2>
          <div className="w-8" />
        </div>

        {/* Banner IA */}
        <div className="mb-5 flex items-start gap-3 rounded-2xl bg-gradient-to-br from-primary to-teal-deep p-4 text-primary-foreground">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-shadow/40">
            <Sparkles className="size-5" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-sm font-semibold">Cadastro inteligente com IA</p>
            <p className="mt-0.5 text-xs text-teal-light">
              Tire fotos do imóvel e a IA preenche automaticamente: tipo, área, valor estimado, descrição e localização.
            </p>
          </div>
        </div>

        {/* Área de fotos */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFotos}
        />

        {fotos.length === 0 ? (
          <button
            id="tour-target-imoveis-ia"
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-[320px] w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-card/50 transition-colors"
          >
            <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Camera className="size-8" strokeWidth={1.5} />
            </div>
            <p className="mt-4 font-serif text-lg font-semibold text-foreground">
              Adicionar fotos
            </p>
            <p className="mt-1 text-center text-sm text-muted-foreground">
              Tire fotos agora ou<br />escolha da galeria
            </p>
          </button>
        ) : (
          <div className="flex h-[320px] w-full flex-col rounded-3xl border border-border bg-card shadow-soft overflow-hidden">
            <div className="grid grid-cols-2 gap-2 p-2 h-full">
              {fotos.map((foto, i) => (
                <div key={foto.id} className="relative h-full w-full overflow-hidden rounded-2xl bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={foto.url} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" style={{ transform: `rotate(${foto.rotacao}deg)` }} />
                </div>
              ))}
              {fotos.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border text-muted-foreground"
                >
                  <Camera className="size-5" strokeWidth={1.5} />
                  <span className="text-[10px] mt-1">Mais</span>
                </button>
              )}
            </div>
            <div className="p-4 bg-muted/30">
              <p className="font-serif text-lg font-semibold text-foreground">
                {fotos.length} foto{fotos.length > 1 ? 's' : ''} selecionada{fotos.length > 1 ? 's' : ''}
              </p>
              <p className="text-xs text-muted-foreground">A IA vai extrair as informações</p>
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-col gap-3">
          {fotos.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (!featureFlags.temIA) {
                  setMostrarUpsell(true)
                  return
                }
                iniciarAnaliseIA()
              }}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-brand active:scale-[0.98]"
            >
              <Sparkles className="size-4" strokeWidth={1.5} />
              Analisar com IA
            </button>
          )}
          <button
            id="tour-target-preencher-manualmente"
            type="button"
            onClick={() => setFase('escolha_categoria')}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card text-sm font-semibold text-muted-foreground transition-brand active:scale-[0.98]"
          >
            Alterar tipo/categoria de imóvel
          </button>
        </div>
      </div>
    )
  }

  // ── Fase: Escolha Modo Manual ─────────────────────────────────────────────
  if (fase === 'escolha_modo_manual') {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <button type="button" onClick={() => setFase('escolha_categoria')} className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-brand active:scale-95">
            <ChevronLeft className="size-5" />
          </button>
          <h2 className="font-serif text-xl font-semibold text-foreground">Método de Cadastro</h2>
          <div className="w-8" />
        </div>

        <div className="bg-teal-mid/10 p-3 rounded-2xl border border-teal-mid/20 mb-5 flex flex-col gap-1">
          <span className="text-[9px] font-bold text-teal-deep uppercase tracking-wider">Estrutura Travada</span>
          <span className="text-xs font-semibold text-teal-deep">{finalidade} · {tipoImovel}</span>
        </div>

        <p className="text-sm text-muted-foreground mb-6 text-center">
          Como você deseja cadastrar este imóvel?
        </p>

        <div className="flex flex-col gap-4">
          <button
            id="tour-target-imoveis-fast"
            type="button"
            onClick={() => {
              setCadastroTipoMode('fast')
              setFase('formulario_fast')
            }}
            className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-card p-6 text-center shadow-soft transition-brand active:scale-[0.98] hover:border-border/80"
          >
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
              <Zap className="size-7 text-primary" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground mb-1">Cadastro Rápido (Fast)</p>
              <p className="text-xs text-muted-foreground">Preencha apenas o básico para salvar e continuar depois no celular ou computador.</p>
            </div>
          </button>

          <button
            id="tour-target-imoveis-completo"
            type="button"
            onClick={() => {
              setCadastroTipoMode('completo')
              setFase('formulario')
            }}
            className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-card p-6 text-center shadow-soft transition-brand active:scale-[0.98] hover:border-border/80"
          >
            <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
              <LayoutGrid className="size-7 text-muted-foreground" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground mb-1">Cadastro Completo</p>
              <p className="text-xs text-muted-foreground">Preencha todos os dados, características e informações para já publicar.</p>
            </div>
          </button>

          <button
            id="tour-target-imoveis-ia"
            type="button"
            onClick={() => {
              setCadastroTipoMode('ia')
              setFase('upload')
            }}
            className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-gradient-to-br from-primary/5 to-teal-deep/5 p-6 text-center shadow-soft transition-brand active:scale-[0.98] hover:border-primary/30"
          >
            <div className="flex size-14 items-center justify-center rounded-2xl bg-teal-shadow/20">
              <Sparkles className="size-7 text-teal-deep" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground mb-1">Cadastro com IA</p>
              <p className="text-xs text-muted-foreground">Envie fotos/áudios e deixe o Albert processar de acordo com o contexto.</p>
            </div>
          </button>
        </div>
      </div>
    )
  }

  // ── Fase: Escolha Categoria / Tipo Condicional ────────────────────────────
  if (fase === 'escolha_categoria') {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <button type="button" onClick={onClose} className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-brand active:scale-95">
            <X className="size-4" strokeWidth={1.5} />
          </button>
          <h2 className="font-serif text-xl font-semibold text-foreground">Categoria do Imóvel</h2>
          <div className="w-8" />
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-4">
          <h3 className="text-base font-bold text-foreground text-center mb-6 leading-snug">
            Qual a finalidade e qual o tipo de imóvel você deseja cadastrar?
          </h3>

          <div className="flex flex-col gap-5 bg-card border border-border p-5 rounded-3xl shadow-sm mb-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Finalidade</label>
              <select
                value={finalidade}
                onChange={(e) => {
                  const val = e.target.value as FinalidadeCategoria
                  resetFields()
                  setFinalidade(val)
                  setTipoImovel(TIPOS_POR_FINALIDADE[val][0])
                }}
                className="h-12 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {FINALIDADES.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tipo de Imóvel</label>
              <select
                value={tipoImovel}
                onChange={(e) => {
                  resetFields()
                  setTipoImovel(e.target.value)
                }}
                className="h-12 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {TIPOS_POR_FINALIDADE[finalidade].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setFase('escolha_modo_manual')}
            className="h-12 w-full rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-brand active:scale-[0.98]"
          >
            Continuar para Método de Cadastro
          </button>
        </div>
      </div>
    )
  }

  // ── Fase 2: Analisando ────────────────────────────────────────────────────
  if (fase === 'analisando') {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <div className="relative flex size-24 items-center justify-center rounded-3xl bg-primary/10">
          {/* Spinner animado */}
          <svg className="absolute inset-0 size-24 -rotate-90" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r="44" fill="none" stroke="hsl(var(--border))" strokeWidth="4" />
            <circle
              cx="48" cy="48" r="44"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 44}`}
              strokeDashoffset={`${2 * Math.PI * 44 * (1 - progresso / 100)}`}
              className="transition-all duration-500"
            />
          </svg>
          <Sparkles className="size-10 text-primary" strokeWidth={1.5} />
        </div>

        <p className="mt-6 font-serif text-xl font-semibold text-foreground">IA analisando imóvel</p>
        <p className="mt-2 text-sm text-muted-foreground">{progressoTexto || 'Iniciando análise...'}</p>
        
        {/* Contexto travado guiando a IA */}
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-teal-mid/10 px-3 py-1 text-[11px] font-bold text-teal-deep border border-teal-mid/20">
          <Sparkles className="size-3 text-teal-mid animate-pulse animate-duration-1000" />
          Contexto = Imóvel {finalidade} - {tipoImovel} (IA Focada)
        </div>

        {/* Barra de progresso */}
        <div className="mt-6 w-full max-w-xs">
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progresso}%` }}
            />
          </div>
          <p className="mt-2 font-mono text-xs text-muted-foreground">{progresso}%</p>
        </div>

        {/* Fotos sendo "processadas" */}
        {fotos.length > 0 && (
          <div className="mt-6 flex gap-2">
            {fotos.slice(0, 3).map((foto, i) => (
              <div key={i} className={`relative size-16 overflow-hidden rounded-xl transition-all duration-700 ${progresso > i * 30 ? 'opacity-100 ring-2 ring-primary' : 'opacity-40'}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={foto.url} alt="" className="h-full w-full object-cover" style={{ transform: `rotate(${foto.rotacao}deg)` }} />
                {progresso > (i + 1) * 30 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-primary/40">
                    <CheckCircle2 className="size-5 text-white" strokeWidth={2} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-2 px-4">
          {['Visão computacional', 'OCR', 'Geolocalização', 'Avaliação de mercado'].map((tag) => (
            <span key={tag} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {tag}
            </span>
          ))}
        </div>
      </div>
    )
  }

  // ── Fase 3: Resultado da IA ───────────────────────────────────────────────
  if (fase === 'resultado') {
    return (
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-xl font-semibold text-foreground">Resultado da IA</h2>
          <button type="button" onClick={onClose} aria-label="Fechar" className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <X className="size-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Confiança */}
        <div className="mb-4 flex items-center gap-3 rounded-2xl bg-teal-mid/10 border border-teal-mid/20 p-3">
          <Sparkles className="size-5 text-teal-mid shrink-0" strokeWidth={1.5} />
          <div>
            <p className="text-sm font-semibold text-teal-deep">IA concluiu a análise</p>
            <p className="text-xs text-muted-foreground">Confiança: 94% · Baseado em {fotos.length > 0 ? fotos.length : 3} foto{fotos.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <span className="font-mono text-lg font-bold text-teal-mid">94%</span>
          </div>
        </div>

        {/* Dados detectados */}
        <div className="flex flex-col gap-2 mb-5">
          {[
            { label: 'Tipo detectado', value: resultado.tipo, emoji: '🏠' },
            { label: 'Título sugerido', value: resultado.titulo, emoji: '📝' },
            { label: 'Bairro / Cidade', value: `${resultado.bairro}, ${resultado.cidade}`, emoji: '📍' },
            { label: 'Área estimada', value: `${resultado.area} m²`, emoji: '📐' },
            { label: 'Quartos', value: resultado.quartos, emoji: '🛏️' },
            { label: 'Valor de mercado', value: resultado.valor, emoji: '💰' },
            { label: 'Operação', value: resultado.operacao, emoji: '🏷️' },
            { label: 'Finalidade', value: resultado.finalidade, emoji: '🏢' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 rounded-2xl bg-card shadow-soft px-4 py-3">
              <span className="text-base">{item.emoji}</span>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{item.label}</p>
                <p className="text-sm font-semibold text-foreground truncate">{item.value}</p>
              </div>
              <Zap className="size-3.5 text-teal-mid shrink-0" strokeWidth={1.5} />
            </div>
          ))}
        </div>

        {/* Descrição gerada */}
        <div className="mb-5 rounded-2xl bg-cream p-4">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="size-3 text-primary" strokeWidth={1.5} />
            Descrição gerada pela IA
          </p>
          <p className="text-sm text-foreground leading-relaxed">{resultado.observacoes}</p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => { aplicarResultadoIA(resultado); setFase('formulario') }}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-brand active:scale-[0.98]"
          >
            <CheckCircle2 className="size-4" strokeWidth={2} />
            Usar estes dados e revisar
          </button>
          <button
            type="button"
            onClick={() => setFase('modo')}
            className="h-12 w-full rounded-2xl border border-border bg-card text-sm font-semibold text-muted-foreground transition-brand active:scale-[0.98]"
          >
            Pular, preencher manualmente
          </button>
        </div>
      </div>
    )
  }

  // ── Fase 4: Escolha do Modo de Cadastro ───────────────────────────────────────────────
  if (fase === 'modo') {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-2">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-xl font-semibold text-foreground">Como deseja cadastrar?</h2>
          <button type="button" onClick={onClose} aria-label="Fechar" className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <X className="size-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => setFase('formulario_fast')}
            className="flex flex-col items-start gap-2 rounded-2xl border border-border bg-card p-5 text-left transition-brand active:scale-[0.98] active:bg-muted"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-teal-mid/10 text-teal-deep">
                <Zap className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Cadastro Fast (No App)</h3>
                <p className="text-xs text-muted-foreground">Campos essenciais para colocar o imóvel no ar agora.</p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              alert('Link seguro copiado! Abra no seu PC para finalizar o cadastro completo com mais conforto.')
              if (onClose) onClose(); else window.history.back();
            }}
            className="flex flex-col items-start gap-2 rounded-2xl border border-border bg-card p-5 text-left transition-brand active:scale-[0.98] active:bg-muted"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Monitor className="size-5" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Finalizar no Computador</h3>
                <p className="text-xs text-muted-foreground">Copie o link seguro e preencha todos os detalhes na tela grande.</p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setFase('formulario')}
            className="mt-2 text-center text-sm font-semibold text-muted-foreground underline"
          >
            Prefiro fazer o completo aqui pelo celular
          </button>
        </div>
      </div>
    )
  }

  // ── Fase 5: Formulário Fast ───────────────────────────────────────────────
  if (fase === 'formulario_fast') {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-2 pb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-xl font-semibold text-foreground">Cadastro Fast</h2>
          <button type="button" onClick={onClose} aria-label="Fechar" className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <X className="size-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Finalidade</label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {(['Residencial', 'Comercial', 'Industrial', 'Rural'] as FinalidadeCategoria[]).map((fin) => {
                  const Icon = fin === 'Residencial' ? Home : fin === 'Comercial' ? Store : fin === 'Industrial' ? Factory : TreePine;
                  return (
                    <button
                      key={fin}
                      type="button"
                      onClick={() => {
                        setFinalidade(fin)
                        setTipoImovel(TIPOS_POR_FINALIDADE[fin][0])
                      }}
                      className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-2 transition-colors ${finalidade === fin ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card text-muted-foreground hover:bg-muted'}`}
                    >
                      <Icon className="size-4" />
                      <span className="text-[10px] font-semibold">{fin}</span>
                    </button>
                  )
                })}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tipo</label>
              <select value={tipoImovel} onChange={(e) => setTipoImovel(e.target.value)} className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                {TIPOS_POR_FINALIDADE[finalidade].map((tipo) => <option key={tipo} value={tipo}>{tipo}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Endereço Básico / Título *</label>
            <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Apartamento Jardins" className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Valor (R$)</label>
              <input type="text" value={valor} onChange={(e) => setValor(maskCurrency(e.target.value))} placeholder="R$ 0,00" className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Área Útil (m²)</label>
              <input type="number" value={area} onChange={(e) => setArea(e.target.value)} placeholder="Ex: 85" className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>

          {/* Dynamic Composition Fields */}
          {finalidade === 'Residencial' && (
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Dorms</label>
                <input type="number" value={quartos} onChange={(e) => setQuartos(e.target.value)} className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Suítes</label>
                <input type="number" value={suites} onChange={(e) => setSuites(e.target.value)} className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Vagas</label>
                <input type="number" value={vagas} onChange={(e) => setVagas(e.target.value)} className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
          )}

          {finalidade === 'Comercial' && (
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Salas</label>
                <input type="number" value={salas} onChange={(e) => setSalas(e.target.value)} className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Banheiros</label>
                <input type="number" value={banheiros} onChange={(e) => setBanheiros(e.target.value)} className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Vagas</label>
                <input type="number" value={vagas} onChange={(e) => setVagas(e.target.value)} className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
          )}

          {finalidade === 'Industrial' && (
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pé Direito (m)</label>
                  <input type="text" value={peDireito} onChange={(e) => setPeDireito(e.target.value)} placeholder="Ex: 8" className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Capac. Piso (t)</label>
                  <input type="text" value={capacidadePiso} onChange={(e) => setCapacidadePiso(e.target.value)} placeholder="Ex: 5" className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Área Pátio (m²)</label>
                  <input type="text" value={areaPatio} onChange={(e) => setAreaPatio(e.target.value)} placeholder="Ex: 300" className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <label className="flex items-center gap-2 mt-6 cursor-pointer select-none">
                  <input type="checkbox" checked={energiaTrifasica} onChange={(e) => setEnergiaTrifasica(e.target.checked)} className="size-5 rounded border-border text-primary focus:ring-primary" />
                  <span className="text-xs font-semibold text-foreground">Energia Trifásica</span>
                </label>
              </div>
            </div>
          )}

          {finalidade === 'Rural' && (
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Área (Hectares)</label>
                  <input type="text" value={areaHectares} onChange={(e) => setAreaHectares(e.target.value)} placeholder="Ex: 45" className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recursos Hídricos</label>
                  <input type="text" value={recursosHidricos} onChange={(e) => setRecursosHidricos(e.target.value)} placeholder="Ex: Rio, poço art." className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={temCurral} onChange={(e) => setTemCurral(e.target.checked)} className="size-5 rounded border-border text-primary focus:ring-primary" />
                  <span className="text-xs font-semibold text-foreground">Possui Curral</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={temCasaSede} onChange={(e) => setTemCasaSede(e.target.checked)} className="size-5 rounded border-border text-primary focus:ring-primary" />
                  <span className="text-xs font-semibold text-foreground">Possui Casa Sede</span>
                </label>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mt-2 border-t border-border/50 pt-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Proprietário</label>
              <input type="text" value={proprietario} onChange={(e) => setProprietario(e.target.value)} placeholder="Nome" className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Telefone</label>
              <input type="text" value={telefoneProprietario} onChange={(e) => setTelefoneProprietario(maskPhone(e.target.value))} placeholder="(00) 00000-0000" className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-amber text-sm font-semibold text-ink shadow-lg shadow-amber/20 transition-brand active:scale-[0.98]"
          >
            <CheckCircle2 className="size-5" />
            Salvar Rascunho / Fast
          </button>

          <p className="text-center text-xs text-muted-foreground">Você poderá finalizar as fotos e dados completos depois pelo computador.</p>
        </div>
      </div>
    )
  }

  // ── Fase 6: Formulário Completo (manual ou pré-preenchido pela IA) ────────
  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFotos}
      />
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h2 className="font-serif text-xl font-semibold text-foreground">Cadastrar imóvel</h2>
          {titulo && (
            <span className="flex items-center gap-1 rounded-full bg-teal-mid/15 px-2 py-0.5 text-[10px] font-semibold text-teal-deep">
              <Sparkles className="size-2.5" strokeWidth={2} />
              IA
            </span>
          )}
        </div>
        <button type="button" onClick={onClose} aria-label="Fechar" className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <X className="size-4" strokeWidth={1.5} />
        </button>
      </div>


      {isIaGerado && (
        <div className="mb-6 flex flex-col gap-3 rounded-2xl bg-teal-mid/10 p-4 border border-teal-mid/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="size-5 text-teal-mid shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-semibold text-teal-deep">IA concluiu a análise</p>
                <p className="text-xs text-teal-deep/80">Confiança: 94% · Baseado nas fotos/áudios</p>
              </div>
            </div>
            {exibindoTranscricao && (
              <button
                type="button"
                onClick={() => setExibindoTranscricao(false)}
                className="text-xs font-semibold text-teal-deep underline"
              >
                Minimizar
              </button>
            )}
          </div>

          {exibindoTranscricao ? (
            <div className="flex flex-col gap-3 mt-1 animate-in fade-in duration-200">
              <label className="text-xs font-bold text-teal-deep uppercase tracking-wider">Transcrição Gerada</label>
              <textarea
                value={transcricaoIA}
                onChange={(e) => setTranscricaoIA(e.target.value)}
                className="w-full h-24 rounded-xl border border-teal-mid/20 bg-background/80 p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-medium"
              />
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={toggleAlbertGravandoAudio}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${albertGravandoAudio ? 'bg-red-500 text-white border-red-500 animate-pulse' : 'bg-background/80 text-teal-deep border-teal-mid/20'}`}
                >
                  <Mic className="size-3.5" />
                  {albertGravandoAudio ? `Parar (${albertAudioTimer}s)` : 'Adicionar Áudio'}
                </button>
                <button
                  type="button"
                  onClick={aplicarCorrecaoTranscricao}
                  className="flex-1 rounded-xl bg-primary py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/95 active:scale-95 transition-all text-center"
                >
                  Analisar e Preencher
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2 mt-1">
              <button type="button" onClick={() => setExibindoTranscricao(true)} className="flex-1 rounded-xl bg-background/50 border border-teal-mid/20 py-2 text-xs font-semibold text-teal-deep hover:bg-teal-mid/20 transition-colors">
                Analisar Novamente
              </button>
              <button type="button" onClick={() => {
                setTitulo(''); setBairro(''); setCidade(''); setValor(''); setArea(''); setQuartos(''); setObservacoes('');
                setIsIaGerado(false);
                setExibindoTranscricao(false);
              }} className="flex-1 rounded-xl border border-border bg-background py-2 text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors">
                Descartar
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-5 pb-8">

        {/* BLOCO 1: NEGOCIAÇÕES E TIPOS */}
        <AccordionSection title="Negociações e Tipos" icon={<FileText className="size-4" strokeWidth={2.5} />} isOpen={openSection === 1} onToggle={() => setOpenSection(openSection === 1 ? 0 : 1)}>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Título do imóvel *</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Apartamento Jardins 3 quartos"
              className={`h-12 w-full rounded-2xl border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${titulo ? 'border-teal-mid/40' : 'border-border'}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Código</label>
              <input type="text" value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="Opcional" className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">CIB</label>
              <input type="text" value={cib} onChange={(e) => setCib(e.target.value)} placeholder="Opcional" className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Finalidade</label>
              <div className="grid grid-cols-4 gap-2">
                {(['Residencial', 'Comercial', 'Industrial', 'Rural'] as FinalidadeCategoria[]).map((fin) => {
                  const Icon = fin === 'Residencial' ? Home : fin === 'Comercial' ? Store : fin === 'Industrial' ? Factory : TreePine;
                  return (
                    <button
                      key={fin}
                      type="button"
                      onClick={() => {
                        setFinalidade(fin)
                        setTipoImovel(TIPOS_POR_FINALIDADE[fin][0])
                      }}
                      className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border py-2.5 transition-colors ${finalidade === fin ? 'border-primary bg-primary/10 text-primary shadow-sm' : 'border-border bg-card text-muted-foreground hover:bg-muted'}`}
                    >
                      <Icon className="size-5" />
                      <span className="text-[10px] font-semibold">{fin}</span>
                    </button>
                  )
                })}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tipo</label>
              <div className="relative">
                <select value={tipoImovel} onChange={(e) => setTipoImovel(e.target.value)} className={`h-12 w-full rounded-2xl border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none pr-10 ${tipoImovel ? 'border-teal-mid/40' : 'border-border'}`}>
                  {TIPOS_POR_FINALIDADE[finalidade].map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Operação</label>
            <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-1 px-1 py-1">
              {(['Venda', 'Locação', 'Temporada', 'Arrendamento'] as const).map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => {
                    if (operacoes.includes(o)) {
                      setOperacoes(operacoes.filter((op) => op !== o))
                    } else {
                      setOperacoes([...operacoes, o])
                    }
                  }}
                  className={`shrink-0 rounded-2xl px-4 py-3 text-sm font-semibold transition-brand ${operacoes.includes(o) ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted text-muted-foreground'}`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Situação</label>
              <select value={situacaoImovel} onChange={(e) => setSituacaoImovel(e.target.value)} className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none">
                <option value="Pronto">Pronto</option>
                <option value="Na Planta">Na Planta</option>
                <option value="Em Obras">Em Obras</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</label>
              <select value={statusImovel} onChange={(e) => setStatusImovel(e.target.value as (typeof STATUS_OPTIONS)[number])} className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none">
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="mt-2 rounded-2xl bg-muted/40 p-4 border border-border/50">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
              Contrato de Exclusividade
            </label>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2 bg-background p-1.5 rounded-xl border border-border/50">
                {(['Nenhuma', 'Venda', 'Locação', 'Ambas'] as const).map(tipo => (
                  <button
                    key={tipo}
                    type="button"
                    onClick={() => setTipoExclusividade(tipo)}
                    className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${tipoExclusividade === tipo
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted/50'
                      }`}
                  >
                    {tipo}
                  </button>
                ))}
              </div>

              {tipoExclusividade !== 'Nenhuma' && (
                <div className="mt-2">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Validade (Dias)</label>
                  <input type="number" value={validadeExclusividade} onChange={(e) => setValidadeExclusividade(e.target.value)} placeholder="Ex: 90" className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              )}
            </div>
          </div>
        </AccordionSection>

        {/* BLOCO 2: LOCALIZAÇÃO */}
        <AccordionSection title="Localização e Prédio" icon={<MapPin className="size-4" strokeWidth={2.5} />} isOpen={openSection === 2} onToggle={() => setOpenSection(openSection === 2 ? 0 : 2)}>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-1">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">CEP</label>
              <input type="text" value={cep} onChange={(e) => setCep(maskCEP(e.target.value))} placeholder="00000-000" className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <button type="button" onClick={() => setModalBuscaCep(!modalBuscaCep)} className="mt-1 text-[10px] font-semibold text-primary underline">Não sei meu CEP</button>
            </div>
            <div className="col-span-2">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Endereço</label>
              <input type="text" value={endereco} onChange={(e) => setEndereco(e.target.value)} placeholder="Rua, número" className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
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

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Bairro</label>
              <input type="text" value={bairro} onChange={(e) => setBairro(e.target.value)} placeholder="Jardins" className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Cidade</label>
              <input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="São Paulo" className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Condomínio/Empreendimento</label>
            <input type="text" value={condominio} onChange={(e) => setCondominio(e.target.value)} placeholder="Nome do prédio ou loteamento" className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Andar</label>
              <input type="text" value={andar} onChange={(e) => setAndar(e.target.value)} placeholder="Opcional" className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ano de Construção</label>
              <input type="text" value={anoConstrucao} onChange={(e) => setAnoConstrucao(e.target.value)} placeholder="YYYY" className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
        </AccordionSection>

        {/* BLOCO 3: COMPOSIÇÃO (Condicional) */}
        {((finalidade === 'Residencial' && !['Terreno', 'Terreno de Condomínio', 'Área', 'Loteamento', 'Garagem'].includes(tipoImovel)) ||
          (finalidade === 'Rural' && ['Chácara', 'Chácara em Condomínio', 'Fazenda', 'Haras', 'Rancho', 'Sítio'].includes(tipoImovel)) ||
          (finalidade === 'Comercial' && ['Casa', 'Sobrado', 'Conjunto Comercial', 'Prédio'].includes(tipoImovel))) && (
            <AccordionSection title="Composição (Cômodos)" icon={<LayoutGrid className="size-4" strokeWidth={2.5} />} isOpen={openSection === 3} onToggle={() => setOpenSection(openSection === 3 ? 0 : 3)}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Dormitórios</label>
                  <input type="number" value={quartos} onChange={(e) => setQuartos(e.target.value)} placeholder="0" className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Suítes</label>
                  <input type="number" value={suites} onChange={(e) => setSuites(e.target.value)} placeholder="0" className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Banheiros</label>
                  <input type="number" value={banheiros} onChange={(e) => setBanheiros(e.target.value)} placeholder="0" className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Salas</label>
                  <input type="number" value={salas} onChange={(e) => setSalas(e.target.value)} placeholder="0" className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Vagas</label>
                  <input type="number" value={vagas} onChange={(e) => setVagas(e.target.value)} placeholder="0" className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>

              <div className="mt-6">
                <SearchableTagSelect
                  label="Acabamento & Características dos Cômodos"
                  placeholder="Ex: Armários, Piso Porcelanato, Ar Condicionado..."
                  groups={CARACTERISTICAS_COMODOS_GRUPOS}
                  popular={CARACTERISTICAS_COMODOS_POPULAR}
                  selected={caracteristicasComodos}
                  onChange={setCaracteristicasComodos}
                  maxVisible={10}
                />
              </div>
            </AccordionSection>
          )}

        {/* BLOCO 3.5: ESPECIFICAÇÕES INDUSTRIAIS */}
        {finalidade === 'Industrial' && (
          <AccordionSection title="Características Industriais" icon={<LayoutGrid className="size-4" strokeWidth={2.5} />} isOpen={openSection === 35} onToggle={() => setOpenSection(openSection === 35 ? 0 : 35)}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pé Direito (m)</label>
                <input type="text" value={peDireito} onChange={(e) => setPeDireito(e.target.value)} placeholder="Ex: 8" className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Capac. Piso (t)</label>
                <input type="text" value={capacidadePiso} onChange={(e) => setCapacidadePiso(e.target.value)} placeholder="Ex: 5" className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Área de Pátio (m²)</label>
                <input type="text" value={areaPatio} onChange={(e) => setAreaPatio(e.target.value)} placeholder="Ex: 300" className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <label className="flex items-center gap-2 mt-8 cursor-pointer select-none">
                <input type="checkbox" checked={energiaTrifasica} onChange={(e) => setEnergiaTrifasica(e.target.checked)} className="size-5 rounded border-border text-primary focus:ring-primary" />
                <span className="text-xs font-semibold text-foreground">Energia Trifásica</span>
              </label>
            </div>
          </AccordionSection>
        )}

        {/* BLOCO 3.6: ESPECIFICAÇÕES RURAIS */}
        {finalidade === 'Rural' && (
          <AccordionSection title="Características Rurais" icon={<LayoutGrid className="size-4" strokeWidth={2.5} />} isOpen={openSection === 36} onToggle={() => setOpenSection(openSection === 36 ? 0 : 36)}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Área Total (Hectares)</label>
                <input type="text" value={areaHectares} onChange={(e) => setAreaHectares(e.target.value)} placeholder="Ex: 45" className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recursos Hídricos</label>
                <input type="text" value={recursosHidricos} onChange={(e) => setRecursosHidricos(e.target.value)} placeholder="Ex: Rio, poço art." className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer select-none mt-4">
                <input type="checkbox" checked={temCurral} onChange={(e) => setTemCurral(e.target.checked)} className="size-5 rounded border-border text-primary focus:ring-primary" />
                <span className="text-xs font-semibold text-foreground">Possui Curral</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none mt-4">
                <input type="checkbox" checked={temCasaSede} onChange={(e) => setTemCasaSede(e.target.checked)} className="size-5 rounded border-border text-primary focus:ring-primary" />
                <span className="text-xs font-semibold text-foreground">Possui Casa Sede</span>
              </label>
            </div>
          </AccordionSection>
        )}

        {/* BLOCO 4: MEDIDAS E VALORES */}
        <AccordionSection title="Medidas e Valores" icon={<Ruler className="size-4" strokeWidth={2.5} />} isOpen={openSection === 4} onToggle={() => setOpenSection(openSection === 4 ? 0 : 4)}>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Valor (R$)</label>
            <input type="text" value={valor} onChange={(e) => setValor(maskCurrency(e.target.value))} placeholder="R$ 890.000,00" className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Área Útil/Const.</label>
              <input type="number" value={area} onChange={(e) => setArea(e.target.value)} placeholder="m²" className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Área Total</label>
              <input type="number" value={areaTotal} onChange={(e) => setAreaTotal(e.target.value)} placeholder="m²" className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
        </AccordionSection>

        {/* BLOCO 5: CARACTERÍSTICAS */}
        <AccordionSection title="Características" icon={<Tag className="size-4" strokeWidth={2.5} />} isOpen={openSection === 5} onToggle={() => setOpenSection(openSection === 5 ? 0 : 5)}>
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

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Descrição do imóvel</label>
            <textarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)} rows={4} placeholder="Conte a história do imóvel, detalhes e proximidades..." className="w-full resize-none rounded-2xl border border-border bg-background p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            {observacoes && titulo && (
              <p className="mt-1.5 flex items-center gap-1 text-[10px] text-teal-mid font-medium">
                <Sparkles className="size-2.5" strokeWidth={2} />
                Preenchido pela IA
              </p>
            )}
          </div>
        </AccordionSection>

        {/* BLOCO 6: PROPRIETÁRIO */}
        <AccordionSection title="Proprietário" icon={<UserCircle className="size-4" strokeWidth={2.5} />} isOpen={openSection === 6} onToggle={() => setOpenSection(openSection === 6 ? 0 : 6)}>
          <div className="flex flex-col gap-3">
            <input type="text" value={proprietario} onChange={(e) => setProprietario(e.target.value)} placeholder="Nome completo" className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            <input type="tel" value={telefoneProprietario} onChange={(e) => setTelefoneProprietario(maskPhone(e.target.value))} placeholder="Telefone / WhatsApp" className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            <input type="email" value={emailProprietario} onChange={(e) => setEmailProprietario(e.target.value)} placeholder="E-mail" className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </AccordionSection>

        {/* BLOCO 7: MÍDIA */}
        <AccordionSection title="Mídia" icon={<ImageIcon className="size-4" strokeWidth={2.5} />} isOpen={openSection === 7} onToggle={() => setOpenSection(openSection === 7 ? 0 : 7)}>
          <div className="flex flex-col gap-4">

            {/* Gerenciamento de Fotos */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Fotos ({fotos.length})</label>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="text-xs font-semibold text-primary">Adicionar +</button>
              </div>

              <div className="flex flex-col gap-3">
                {fotos.length === 0 ? (
                  <div className="flex h-32 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 text-muted-foreground">
                    <Camera className="size-6 mb-2 opacity-50" strokeWidth={1.5} />
                    <span className="text-xs font-medium">Nenhuma foto adicionada</span>
                  </div>
                ) : (
                  fotos.map((foto, i) => (
                    <div key={foto.id} className="flex gap-3 rounded-2xl border border-border bg-background p-2 pr-4 shadow-sm">
                      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={foto.url} alt="Foto" className="h-full w-full object-cover" style={{ transform: `rotate(${foto.rotacao}deg)` }} />
                        {i === 0 && (
                          <span className="absolute left-1 top-1 rounded bg-black/70 px-1.5 py-0.5 text-[8px] font-bold uppercase text-white">Capa</span>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col justify-center">
                        <button type="button" onClick={() => setFotoEditando(foto)} className="text-left">
                          <p className={`text-sm font-semibold ${foto.titulo ? 'text-foreground' : 'text-muted-foreground italic'}`}>{foto.titulo || 'Adicionar título...'}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{foto.descricao || 'Adicionar descrição...'}</p>
                        </button>
                        <div className="mt-2 flex items-center gap-1.5">
                          <button type="button" onClick={() => rotacionarFoto(i)} className="flex size-7 items-center justify-center rounded-full bg-muted text-foreground transition-brand active:scale-95"><RotateCw className="size-3.5" /></button>
                          <button type="button" disabled={i === 0} onClick={() => moverFoto(i, 'esq')} className="flex size-7 items-center justify-center rounded-full bg-muted text-foreground disabled:opacity-30 transition-brand active:scale-95"><ChevronLeft className="size-3.5" /></button>
                          <button type="button" disabled={i === fotos.length - 1} onClick={() => moverFoto(i, 'dir')} className="flex size-7 items-center justify-center rounded-full bg-muted text-foreground disabled:opacity-30 transition-brand active:scale-95"><ChevronRight className="size-3.5" /></button>
                          <div className="flex-1" />
                          <button type="button" onClick={() => removerFoto(i)} className="flex size-7 items-center justify-center rounded-full bg-red-500/10 text-red-600 transition-brand active:scale-95"><Trash2 className="size-3.5" /></button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="border-t border-border/50 pt-4 mt-2">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">URL do Vídeo</label>
              <input type="url" value={urlVideo} onChange={(e) => setUrlVideo(e.target.value)} placeholder="https://youtube.com/..." className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">URL do Tour 360</label>
              <input type="url" value={urlTour360} onChange={(e) => setUrlTour360(e.target.value)} placeholder="https://..." className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
        </AccordionSection>

        {/* BLOCO 8: INFORMAÇÕES INTERNAS */}
        <AccordionSection title="Informações Internas" icon={<Lock className="size-4" strokeWidth={2.5} />} isOpen={openSection === 8} onToggle={() => setOpenSection(openSection === 8 ? 0 : 8)}>
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Observações Internas</label>
              <textarea value={observacoesInternas} onChange={(e) => setObservacoesInternas(e.target.value)} rows={3} placeholder="Anotações sigilosas (visíveis apenas para corretores da imobiliária)..." className="w-full resize-none rounded-2xl border border-border bg-muted/40 p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Chave disponível?</label>
                <select value={chaveDisponivel} onChange={(e) => setChaveDisponivel(e.target.value)} className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none">
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Local das chaves</label>
                <input type="text" value={localChaves} onChange={(e) => setLocalChaves(e.target.value)} placeholder="Ex: Portaria" className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Matrícula Nº</label>
                <input type="text" value={matricula} onChange={(e) => setMatricula(e.target.value)} className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">IPTU Nº</label>
                <input type="text" value={iptu} onChange={(e) => setIptu(maskCurrency(e.target.value))} placeholder="R$ 0,00" className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">INCRA Nº</label>
                <input type="text" value={incra} onChange={(e) => setIncra(e.target.value)} className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Cartório</label>
                <input type="text" value={cartorio} onChange={(e) => setCartorio(e.target.value)} className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Energia Nº</label>
                <input type="text" value={energia} onChange={(e) => setEnergia(e.target.value)} className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Água Nº</label>
                <input type="text" value={agua} onChange={(e) => setAgua(e.target.value)} className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Captador 1</label>
                <input type="text" value={captador1} onChange={(e) => setCaptador1(e.target.value)} className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Captador 2</label>
                <input type="text" value={captador2} onChange={(e) => setCaptador2(e.target.value)} className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
          </div>
        </AccordionSection>

        {/* BLOCO 9: DIVULGAÇÃO */}
        <AccordionSection title="Divulgação no Website" icon={<Megaphone className="size-4" strokeWidth={2.5} />} isOpen={openSection === 9} onToggle={() => setOpenSection(openSection === 9 ? 0 : 9)}>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 text-sm font-medium text-foreground cursor-pointer">
              <input type="checkbox" checked={destaqueHome} onChange={(e) => setDestaqueHome(e.target.checked)} className="size-5 rounded border-border text-primary focus:ring-primary" />
              Destaque na Página Inicial
            </label>
            <label className="flex items-center gap-3 text-sm font-medium text-foreground cursor-pointer">
              <input type="checkbox" checked={destaqueBanner} onChange={(e) => setDestaqueBanner(e.target.checked)} className="size-5 rounded border-border text-primary focus:ring-primary" />
              Destaque no Banner
            </label>
            <label className="flex items-center gap-3 text-sm font-medium text-foreground cursor-pointer">
              <input type="checkbox" checked={oportunidade} onChange={(e) => setOportunidade(e.target.checked)} className="size-5 rounded border-border text-primary focus:ring-primary" />
              Oportunidade (Selo)
            </label>
          </div>
        </AccordionSection>

        {/* BLOCO 10: SEO E OTIMIZAÇÃO */}
        <AccordionSection title="SEO e Otimização" icon={<Search className="size-4" strokeWidth={2.5} />} isOpen={openSection === 10} onToggle={() => setOpenSection(openSection === 10 ? 0 : 10)}>
          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={() => {
                setSeoTitulo(`${tipoImovel}, ${bairro || 'Centro'}, ${cidade || 'SP'}`)
                setSeoPalavras(`${tipoImovel} em ${bairro || 'Centro'}, ${tipoImovel} em ${cidade || 'SP'}, ${quartos ? quartos + ' dorms' : ''}`)
                setSeoDescricao(`${tipoImovel} à venda em ${bairro || 'Centro'}, ${cidade || 'SP'} com ${area ? area + 'm²' : ''}. Código: ${codigo || '1000'}`)
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-teal-mid/10 py-3 text-sm font-semibold text-teal-deep transition-colors hover:bg-teal-mid/20"
            >
              <Sparkles className="size-4" strokeWidth={2} />
              Preencher com IA
            </button>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Título</label>
              <input type="text" value={seoTitulo} onChange={(e) => setSeoTitulo(e.target.value)} className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Palavras-Chave</label>
              <input type="text" value={seoPalavras} onChange={(e) => setSeoPalavras(e.target.value)} className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Descrição</label>
              <textarea value={seoDescricao} onChange={(e) => setSeoDescricao(e.target.value)} rows={3} className="w-full resize-none rounded-2xl border border-border bg-background p-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
        </AccordionSection>

        {/* BLOCO 11: ALBERT — DESCRIÇÃO I.A */}
        <AccordionSection title="Albert — IA" icon={<Bot className="size-4" strokeWidth={2.5} />} isOpen={openSection === 11} onToggle={() => setOpenSection(openSection === 11 ? 0 : 11)}>
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3 rounded-2xl bg-gradient-to-br from-primary/10 to-teal-mid/5 border border-primary/15 p-4">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/15">
                <Bot className="size-5 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Descrição para o Albert</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Neste campo você deve colocar a descrição do imóvel com a visão da venda, informações que o Albert deverá evidenciar e mostrar ao cliente durante a apresentação do imóvel.</p>
              </div>
            </div>

            {iaAtivada ? (
              <textarea
                value={descricaoIA}
                onChange={e => setDescricaoIA(e.target.value)}
                rows={6}
                placeholder="Descreva as informações que o Albert deve usar ao apresentar este imóvel ao cliente..."
                className="w-full resize-none rounded-2xl border border-border bg-background p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            ) : (
              <div className="relative">
                <textarea
                  readOnly
                  rows={6}
                  placeholder="Descreva as informações que o Albert deve usar ao apresentar este imóvel ao cliente..."
                  className="w-full resize-none rounded-2xl border border-border bg-muted/30 p-4 text-sm text-foreground placeholder:text-muted-foreground cursor-not-allowed"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-background/70 backdrop-blur-sm">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10">
                    <Bot className="size-6 text-primary" strokeWidth={1.5} />
                  </div>
                  <div className="text-center px-4">
                    <p className="text-sm font-semibold text-foreground">Recurso exclusivo com I.A</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Ative o Albert para configurar como ele apresenta este imóvel.</p>
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

        <div className="mt-4 flex gap-2">
          <button type="button" onClick={() => setFase('upload')} className="h-12 rounded-2xl border border-border px-5 text-sm font-semibold text-foreground transition-brand active:bg-muted">Voltar</button>
          <button type="button" onClick={handleSave} className="flex-1 h-12 rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform active:scale-[0.98]">{imovelParaEditar ? 'Salvar Alterações' : 'Salvar Captação'}</button>
        </div>
      </div>

      {/* Modal Edição de Foto */}
      {fotoEditando && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
          <button type="button" onClick={() => setFotoEditando(null)} className="absolute inset-0 bg-teal-shadow/40 backdrop-blur-[2px]" />
          <div className="relative flex flex-col rounded-t-3xl bg-card shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full bg-border" />
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-serif text-xl font-semibold text-foreground">Detalhes da foto</h2>
              <button type="button" onClick={() => setFotoEditando(null)} className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <X className="size-4" strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex flex-col gap-4 p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
              <div className="relative h-40 w-full overflow-hidden rounded-2xl bg-muted border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={fotoEditando.url} alt="" className="h-full w-full object-cover" style={{ transform: `rotate(${fotoEditando.rotacao}deg)` }} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Título</label>
                <input
                  type="text"
                  value={fotoEditando.titulo}
                  onChange={(e) => setFotoEditando({ ...fotoEditando, titulo: e.target.value })}
                  placeholder="Ex: Fachada, Sala de Estar..."
                  className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Descrição (Opcional)</label>
                <textarea
                  value={fotoEditando.descricao}
                  onChange={(e) => setFotoEditando({ ...fotoEditando, descricao: e.target.value })}
                  rows={2}
                  placeholder="Detalhes para os portais..."
                  className="w-full resize-none rounded-2xl border border-border bg-background p-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  const idx = fotos.findIndex(f => f.id === fotoEditando.id)
                  if (idx !== -1) {
                    const nova = [...fotos]
                    nova[idx] = fotoEditando
                    setFotos(nova)
                  }
                  setFotoEditando(null)
                }}
                className="mt-2 h-12 w-full rounded-2xl bg-primary text-sm font-semibold text-primary-foreground active:scale-[0.98]"
              >
                Salvar detalhes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
