
import { useState } from 'react'
import { Calendar, CheckCircle2, ChevronRight, Clock, MessageSquare, Target, User, X, PartyPopper, Phone, MessageCircle, MapPin, FileText as DocumentIcon, Search, ArrowUp, ArrowDown, Pencil, Mic, PhoneOff, Play, Pause, Trash2, Volume2 } from 'lucide-react'
import { type Atividade, isAtividadeAtrasada, tipoAtividadeConfig, imoveis, atendimentos } from '@/lib/app-data'
import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import { FormNovaAtividade } from '@/components/shared/form-nova-atividade'

export function AtividadeDetalheSheet({
  atividade,
  onClose,
  onVerNegocio,
  onConcluir,
  onGerarTermo
}: {
  atividade: Atividade | null
  onClose: () => void
  onVerNegocio: (clienteNome: string) => void
  onConcluir: (id: string, statusConcluida: boolean, feedback?: string, agendarProxima?: boolean) => void
  onGerarTermo?: (atividadeId: string) => void
}) {
  const [feedback, setFeedback] = useState('')
  const [agendarProxima, setAgendarProxima] = useState(true)
  const [remarcando, setRemarcando] = useState(false)
  const [novaData, setNovaData] = useState('')
  const [novaHora, setNovaHora] = useState('')
  const [sucesso, setSucesso] = useState(false)
  const [sucessoRemarcar, setSucessoRemarcar] = useState(false)
  const [emojiFeedback, setEmojiFeedback] = useState<'ruim' | 'neutra' | 'boa' | null>(null)
  const [visitadosLocais, setVisitadosLocais] = useState<Record<string, boolean>>({})
  const [buscandoImovel, setBuscandoImovel] = useState(false)
  const [buscaImovelTexto, setBuscaImovelTexto] = useState('')
  const [editando, setEditando] = useState(false)
  const [mostrarLigacao, setMostrarLigacao] = useState(false)

  // Audio Recording States
  const [gravando, setGravando] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [tempoGravacao, setTempoGravacao] = useState(0)
  const [audioTocando, setAudioTocando] = useState(false)
  const [transcrevendo, setTranscrevendo] = useState(false)
  const timerRef = useRef<any>(null)

  // Visit Property Evaluation Flow States
  const [imoveisAvaliacaoPendentes, setImoveisAvaliacaoPendentes] = useState<any[]>([])
  const [indiceAvaliacaoAtual, setIndiceAvaliacaoAtual] = useState<number | null>(null)
  const [avaliacaoReacao, setAvaliacaoReacao] = useState<'gostou' | 'neutro' | 'nao_gostou' | null>(null)
  const [avaliacaoImpressao, setAvaliacaoImpressao] = useState('')
  const [avaliacoesSalvas, setAvaliacoesSalvas] = useState<Record<string, { reacao: string; impressao: string }>>({})

  // Inline Property Evaluation States
  const [inlineFeedbackAtivo, setInlineFeedbackAtivo] = useState<string | null>(null)
  const [inlineFeedbacks, setInlineFeedbacks] = useState<Record<string, string>>({})
  const [inlineReacoes, setInlineReacoes] = useState<Record<string, 'gostou' | 'neutro' | 'nao_gostou'>>({})
  const [inlineGravando, setInlineGravando] = useState(false)
  const [inlineTempoGravacao, setInlineTempoGravacao] = useState(0)
  const [inlineTranscrevendo, setInlineTranscrevendo] = useState(false)
  const inlineTimerRef = useRef<any>(null)

  // Evaluation Audio Recording States
  const [evalGravando, setEvalGravando] = useState(false)
  const [evalTempoGravacao, setEvalTempoGravacao] = useState(0)
  const [evalAudioUrl, setEvalAudioUrl] = useState<string | null>(null)
  const [evalTranscrevendo, setEvalTranscrevendo] = useState(false)
  const evalTimerRef = useRef<any>(null)

  useEffect(() => {
    // Reset all state when a new atividade is opened
    setFeedback('')
    setSucesso(false)
    setRemarcando(false)
    setNovaData('')
    setNovaHora('')
    setEmojiFeedback(null)
    setEditando(false)
    setMostrarLigacao(false)
    setGravando(false)
    setAudioUrl(null)
    setTempoGravacao(0)
    setAudioTocando(false)
    if (timerRef.current) clearInterval(timerRef.current)
    setImoveisAvaliacaoPendentes([])
    setIndiceAvaliacaoAtual(null)
    setAvaliacaoReacao(null)
    setAvaliacaoImpressao('')
    setAvaliacoesSalvas({})
    setEvalGravando(false)
    setEvalTempoGravacao(0)
    setEvalAudioUrl(null)
    setEvalTranscrevendo(false)
    if (evalTimerRef.current) clearInterval(evalTimerRef.current)
    setInlineFeedbackAtivo(null)
    setInlineFeedbacks({})
    setInlineReacoes({})
    setInlineGravando(false)
    setInlineTempoGravacao(0)
    setInlineTranscrevendo(false)
    if (inlineTimerRef.current) clearInterval(inlineTimerRef.current)
    if (atividade?.tipo === 'visita') {
      setAgendarProxima(true)
      const inicialVisitados: Record<string, boolean> = {}
      atividade.imoveisVisitados?.forEach(imv => {
        inicialVisitados[imv.id] = imv.visitado
      })
      setVisitadosLocais(inicialVisitados)
      setBuscandoImovel(false)
      setBuscaImovelTexto('')
    } else {
      setAgendarProxima(false)
      setVisitadosLocais({})
    }
  }, [atividade?.id])

  if (!atividade) return null

  function handleReorder(idx: number, dir: 'up' | 'down') {
    if (!atividade || !atividade.imoveisVisitados) return
    const newArr = [...atividade.imoveisVisitados]
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1
    if (targetIdx < 0 || targetIdx >= newArr.length) return
    const temp = newArr[idx]
    newArr[idx] = newArr[targetIdx]
    newArr[targetIdx] = temp

    // Altera a referência diretamente como estava sendo feito
    atividade.imoveisVisitados = newArr
    // Força re-render limpo usando um estado que já mapeia as visitas
    setVisitadosLocais(prev => ({ ...prev }))
  }

  // Audio Recording Helpers
  function startRecording() {
    setGravando(true)
    setTempoGravacao(0)
    setAudioUrl(null)
    timerRef.current = setInterval(() => {
      setTempoGravacao(prev => prev + 1)
    }, 1000)
  }

  function stopRecording() {
    if (timerRef.current) clearInterval(timerRef.current)
    setGravando(false)
    setAudioUrl('mock-audio-feedback.mp3')
    setTranscrevendo(true)
    setTimeout(() => {
      setTranscrevendo(false)
      const quotes = [
        "Conversa com o cliente foi muito produtiva. Ele demonstrou interesse em fechar a proposta.",
        "Ligação realizada com sucesso. Deixei recado sobre a nova documentação necessária.",
        "Reunião finalizada. Ficou acordado o envio da proposta formal por e-mail amanhã."
      ]
      setFeedback(quotes[Math.floor(Math.random() * quotes.length)])
    }, 1500)
  }

  function deleteRecording() {
    setAudioUrl(null)
    setTempoGravacao(0)
    setAudioTocando(false)
  }

  function formatTime(secs: number) {
    const minutes = Math.floor(secs / 60)
    const seconds = secs % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // Property Evaluation Audio Recording Helpers
  function startEvalRecording() {
    setEvalGravando(true)
    setEvalTempoGravacao(0)
    setEvalAudioUrl(null)
    setEvalTranscrevendo(false)
    evalTimerRef.current = setInterval(() => {
      setEvalTempoGravacao(prev => prev + 1)
    }, 1000)
  }

  function stopEvalRecording() {
    if (evalTimerRef.current) clearInterval(evalTimerRef.current)
    setEvalGravando(false)
    setEvalAudioUrl('mock-eval-audio.mp3')
    setEvalTranscrevendo(true)
    
    setTimeout(() => {
      setEvalTranscrevendo(false)
      const transQuotes = [
        "Cliente gostou muito do tamanho das salas e do acabamento geral, mas achou a garagem um pouco apertada.",
        "Adorou a iluminação natural na suíte principal, porém a cozinha precisa de algumas reformas.",
        "Achou o imóvel bem localizado e ventilado, ideal para a família."
      ]
      setAvaliacaoImpressao(transQuotes[Math.floor(Math.random() * transQuotes.length)])
    }, 1500)
  }

  function deleteEvalRecording() {
    setEvalAudioUrl(null)
    setEvalTempoGravacao(0)
  }

  // Inline Property Audio Recording Helpers
  function startInlineRecording(id: string) {
    setInlineFeedbackAtivo(id)
    setInlineGravando(true)
    setInlineTempoGravacao(0)
    setInlineTranscrevendo(false)
    inlineTimerRef.current = setInterval(() => {
      setInlineTempoGravacao(prev => prev + 1)
    }, 1000)
  }

  function stopInlineRecording(id: string) {
    if (inlineTimerRef.current) clearInterval(inlineTimerRef.current)
    setInlineGravando(false)
    setInlineTranscrevendo(true)

    setTimeout(() => {
      setInlineTranscrevendo(false)
      const transQuotes = [
        "Cliente achou a sala bem ventilada e ampla, mas gostaria de um andar mais alto.",
        "Gostou bastante da área de lazer e piscina, considerou excelente opção.",
        "Localização excelente, porém necessita de pintura e troca de pisos."
      ]
      const text = transQuotes[Math.floor(Math.random() * transQuotes.length)]
      setInlineFeedbacks(prev => ({ ...prev, [id]: text }))
    }, 1500)
  }

  function deleteInlineRecording(id: string) {
    setInlineFeedbacks(prev => {
      const copy = { ...prev }
      delete copy[id]
      return copy
    })
  }

  // Visit Property Evaluation Flow Helpers
  function iniciarAvaliacoes() {
    if (!atividade || !atividade.imoveisVisitados) {
      realizarConclusao()
      return
    }

    const visitados = atividade.imoveisVisitados.filter(imv => visitadosLocais[imv.id])
    if (visitados.length === 0) {
      realizarConclusao()
      return
    }

    // Start with the first visited property
    setImoveisAvaliacaoPendentes(visitados)
    setIndiceAvaliacaoAtual(0)
    
    const firstImv = visitados[0]
    setAvaliacaoReacao(inlineReacoes[firstImv.id] || null)
    setAvaliacaoImpressao(inlineFeedbacks[firstImv.id] || '')
  }

  function handleSalvarAvaliacao() {
    if (indiceAvaliacaoAtual === null) return
    const imvAtual = imoveisAvaliacaoPendentes[indiceAvaliacaoAtual]
    
    // Save current evaluation
    const novaAvaliacao = {
      reacao: avaliacaoReacao || 'neutro',
      impressao: avaliacaoImpressao.trim()
    }
    
    const novasAvaliacoes = {
      ...avaliacoesSalvas,
      [imvAtual.id]: novaAvaliacao
    }
    setAvaliacoesSalvas(novasAvaliacoes)

    // Reset evaluation audio states for the next property
    setEvalAudioUrl(null)
    setEvalTempoGravacao(0)
    setEvalTranscrevendo(false)
    if (evalTimerRef.current) clearInterval(evalTimerRef.current)

    // Go to next or finish
    if (indiceAvaliacaoAtual + 1 < imoveisAvaliacaoPendentes.length) {
      const nextIdx = indiceAvaliacaoAtual + 1
      setIndiceAvaliacaoAtual(nextIdx)
      const nextImv = imoveisAvaliacaoPendentes[nextIdx]
      setAvaliacaoReacao(inlineReacoes[nextImv.id] || null)
      setAvaliacaoImpressao(inlineFeedbacks[nextImv.id] || '')
    } else {
      // All evaluated! Complete the activity!
      setIndiceAvaliacaoAtual(null)
      realizarConclusao(novasAvaliacoes)
    }
  }

  function realizarConclusao(avaliacoes = avaliacoesSalvas) {
    if (atividade?.imoveisVisitados) {
      atividade.imoveisVisitados.forEach(imv => {
        if (visitadosLocais[imv.id]) imv.visitado = true
      })
    }

    let finalFeedback = feedback
    
    // Append audio note info if present
    if (audioUrl) {
      finalFeedback = finalFeedback 
        ? `${finalFeedback}\n\n[Nota de áudio gravada: ${audioUrl} (${formatTime(tempoGravacao)})]` 
        : `[Nota de áudio gravada: ${audioUrl} (${formatTime(tempoGravacao)})]`
    }

    if (emojiFeedback) {
      const emojiMap = { ruim: '👎 Ruim', neutra: '😐 Neutra', boa: '👍 Boa' }
      finalFeedback = finalFeedback ? `[${emojiMap[emojiFeedback]}] ${finalFeedback}` : `[${emojiMap[emojiFeedback]}]`
    }

    // Append property evaluations to the feedback
    const avaliacoesTexto = Object.entries(avaliacoes).map(([id, info]) => {
      const imovelInfo = atividade?.imoveisVisitados?.find(imv => imv.id === id)
      const nomeImovel = imovelInfo ? imovelInfo.nome : 'Imóvel'
      const reacaoEmoji = info.reacao === 'gostou' ? '👍 Gostou' : info.reacao === 'nao_gostou' ? '👎 Não Gostou' : '😐 Neutro'
      return `\n- ${nomeImovel}: ${reacaoEmoji}${info.impressao ? ` | Obs: "${info.impressao}"` : ''}`
    }).join('')

    if (avaliacoesTexto) {
      finalFeedback = finalFeedback 
        ? `${finalFeedback}\n\nAvaliação dos imóveis visitados:${avaliacoesTexto}` 
        : `Avaliação dos imóveis visitados:${avaliacoesTexto}`
    }

    setSucesso(true)
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#0d9488', '#14b8a6', '#5eead4']
    })
    setTimeout(() => {
      onConcluir(atividade!.id, true, finalFeedback, agendarProxima)
    }, 1500)
  }

  function handleConcluir() {
    if (atividade?.tipo === 'visita') {
      iniciarAvaliacoes()
    } else {
      realizarConclusao()
    }
  }

  function handleDesfazerConclusao() {
    onConcluir(atividade!.id, false)
  }

  function handleRemarcar() {
    atividade!.hora = novaHora || atividade!.hora
    if (novaData) atividade!.titulo = `${atividade!.titulo} (Remarcado)`

    setSucessoRemarcar(true)
    setTimeout(() => {
      onClose()
    }, 1200)
  }

  const tipoInfo = (tipoAtividadeConfig as Record<string, any>)[atividade.tipo] || { emoji: '📋', cor: 'bg-muted text-muted-foreground' }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className="relative flex w-full max-w-[600px] flex-col rounded-t-3xl sm:rounded-2xl bg-card shadow-2xl animate-in sm:zoom-in-95 sm:slide-in-from-bottom-0 slide-in-from-bottom max-h-[95dvh] duration-300 mx-auto">
        <div className="flex justify-center pt-3 pb-1 shrink-0"><div className="h-1 w-10 rounded-full bg-border" /></div>

        {editando ? (
          <div className="flex-1 overflow-y-auto px-6 py-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
            <FormNovaAtividade
              atividadeInicial={atividade}
              defaultClienteId={atendimentos.find(a => a.nome === atividade.cliente)?.id}
              onClose={() => setEditando(false)}
              onSalvar={() => {
                setEditando(false)
                onClose()
              }}
            />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
            {indiceAvaliacaoAtual !== null && imoveisAvaliacaoPendentes[indiceAvaliacaoAtual] ? (
              <div className="flex flex-col py-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
                  <div className="flex-1 min-w-0 pr-2">
                    <span className="text-[9px] font-bold tracking-tight text-primary">Avaliação de Imóvel ({indiceAvaliacaoAtual + 1} de {imoveisAvaliacaoPendentes.length})</span>
                    <h2 className="text-lg font-bold text-foreground mt-0.5 truncate">{imoveisAvaliacaoPendentes[indiceAvaliacaoAtual].nome}</h2>
                  </div>
                  <span className="text-[10px] text-muted-foreground bg-muted px-2.5 py-1 rounded-full font-semibold truncate shrink-0 max-w-[150px]">{imoveisAvaliacaoPendentes[indiceAvaliacaoAtual].endereco}</span>
                </div>

                <p className="text-sm font-semibold text-foreground mb-3">O cliente gostou do imóvel?</p>
                <div className="flex gap-3 mb-6">
                  <button 
                    type="button" 
                    onClick={() => setAvaliacaoReacao('gostou')} 
                    className={`flex-1 flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border transition-all active:scale-[0.98] ${avaliacaoReacao === 'gostou' ? 'border-green-500 bg-green-50 text-green-700 font-semibold' : 'border-border bg-card hover:bg-muted text-muted-foreground'}`}
                  >
                    <span className="text-3xl">👍</span>
                    <span className="text-[10px] font-bold tracking-tight">Gostou</span>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setAvaliacaoReacao('neutro')} 
                    className={`flex-1 flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border transition-all active:scale-[0.98] ${avaliacaoReacao === 'neutro' ? 'border-amber bg-amber/10 text-[#8a5a1e] font-semibold' : 'border-border bg-card hover:bg-muted text-muted-foreground'}`}
                  >
                    <span className="text-3xl">😐</span>
                    <span className="text-[10px] font-bold tracking-tight">Neutro</span>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setAvaliacaoReacao('nao_gostou')} 
                    className={`flex-1 flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border transition-all active:scale-[0.98] ${avaliacaoReacao === 'nao_gostou' ? 'border-red-500 bg-red-50 text-red-700 font-semibold' : 'border-border bg-card hover:bg-muted text-muted-foreground'}`}
                  >
                    <span className="text-3xl">👎</span>
                    <span className="text-[10px] font-bold tracking-tight">Não Gostou</span>
                  </button>
                </div>

                <p className="text-sm font-semibold text-foreground mb-2">Impressões gerais e anotações</p>
                
                {/* Property Evaluation Audio Recorder & Transcriber */}
                <div className="mb-4 p-3 rounded-2xl border border-border bg-muted/20 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Volume2 className="size-3.5 text-primary" />
                      Gravar Comentários (Voz)
                    </span>
                    {evalAudioUrl && (
                      <button
                        type="button"
                        onClick={deleteEvalRecording}
                        className="text-red-500 hover:text-red-750 transition-colors"
                        title="Remover áudio"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>

                  {!evalGravando && !evalAudioUrl && (
                    <button
                      type="button"
                      onClick={startEvalRecording}
                      className="flex w-full h-11 items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 text-primary text-xs font-bold transition-all hover:bg-primary/10 active:scale-[0.98]"
                    >
                      <Mic className="size-4" />
                      Gravar Comentário por Voz
                    </button>
                  )}

                  {evalGravando && (
                    <div className="flex items-center justify-between bg-red-550/10 border border-red-500/20 rounded-xl px-4 py-2">
                      <div className="flex items-center gap-2">
                        <span className="size-2.5 rounded-full bg-red-500 animate-ping" />
                        <span className="text-xs font-semibold text-red-700">Gravando...</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-xs font-bold text-red-700">{formatTime(evalTempoGravacao)}</span>
                        <button
                          type="button"
                          onClick={stopEvalRecording}
                          className="bg-red-500 text-white rounded-lg px-3 py-1 text-[11px] font-bold shadow-sm active:scale-95 transition-all"
                        >
                          Parar
                        </button>
                      </div>
                    </div>
                  )}

                  {evalTranscrevendo && (
                    <div className="flex items-center justify-center gap-2 py-2 text-xs text-primary font-semibold">
                      <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Transcrevendo áudio com Albert IA...
                    </div>
                  )}

                  {evalAudioUrl && !evalTranscrevendo && (
                    <div className="flex items-center gap-2 text-[10px] text-green-600 font-semibold bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-1.5">
                      <CheckCircle2 className="size-3.5" />
                      Áudio gravado e transcrito automaticamente abaixo!
                    </div>
                  )}
                </div>

                <textarea
                  value={avaliacaoImpressao}
                  onChange={(e) => setAvaliacaoImpressao(e.target.value)}
                  placeholder="Ex: Achou a cozinha pequena, mas adorou a área de lazer..."
                  className="w-full resize-none rounded-2xl border border-border bg-background p-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary h-28 mb-6"
                />

                <button
                  type="button"
                  onClick={handleSalvarAvaliacao}
                  className="w-full h-12 bg-primary text-primary-foreground font-semibold text-sm rounded-2xl transition-all hover:bg-primary/95 active:scale-98 shadow-md"
                >
                  {indiceAvaliacaoAtual + 1 === imoveisAvaliacaoPendentes.length ? 'Finalizar Avaliações' : 'Próximo Imóvel'}
                </button>
              </div>
            ) : sucesso ? (
              <div className="flex flex-col items-center justify-center py-10 animate-in zoom-in duration-300">
                <div className="flex size-20 items-center justify-center rounded-full bg-teal-mid/10 text-teal-deep mb-4">
                  <CheckCircle2 className="size-10" />
                </div>
                <h2 className="text-2xl font-bold text-foreground text-center">
                  Atividade Concluída!
                </h2>
                <p className="mt-2 text-sm text-muted-foreground text-center max-w-xs">
                  {agendarProxima ? 'Vamos agendar a próxima etapa...' : 'Tudo certo. Bom trabalho!'}
                </p>
              </div>
            ) : sucessoRemarcar ? (
              <div className="flex flex-col items-center justify-center py-10 animate-in zoom-in duration-300">
                <div className="flex size-20 items-center justify-center rounded-full bg-amber/10 text-amber mb-4">
                  <Calendar className="size-10" />
                </div>
                <h2 className="text-2xl font-bold text-foreground text-center">
                  Remarcado com sucesso!
                </h2>
                <p className="mt-2 text-sm text-muted-foreground text-center max-w-xs">
                  A agenda foi atualizada.
                </p>
              </div>
            ) : atividade.concluida ? (
              <div className="flex flex-col items-center justify-center py-6 animate-in zoom-in duration-300">
                <div className="flex size-20 items-center justify-center rounded-full bg-teal-mid/10 text-teal-deep mb-4">
                  <CheckCircle2 className="size-10" />
                </div>
                <h2 className="text-2xl font-bold text-foreground text-center">
                  Atividade Concluída
                </h2>
                <p className="mt-2 text-sm text-muted-foreground text-center max-w-xs mb-8">
                  Esta atividade já foi finalizada.
                </p>
                <button
                  type="button"
                  onClick={handleDesfazerConclusao}
                  className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  Desfazer conclusão
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className={`flex size-14 shrink-0 items-center justify-center rounded-2xl ${tipoInfo.cor} text-2xl`}>
                      {tipoInfo.emoji}
                    </div>
                    <div>
                      <p className="text-xs font-semibold tracking-tight text-muted-foreground mb-1">
                        {atividade.tipo}
                      </p>
                      <h2 className="text-xl font-semibold text-foreground leading-tight">
                        {atividade.titulo}
                      </h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditando(true)}
                      className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted/80 active:scale-95"
                      title="Editar Atividade"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted/80 active:scale-95"
                    >
                      <X className="size-5" />
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <div className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold ${!atividade.concluida && isAtividadeAtrasada(atividade.data || 'Hoje', atividade.hora) ? 'bg-red-500/10 text-red-600 border border-red-500/20' : 'bg-amber/15 text-amber-700'}`}>
                    <Clock className="size-3.5" />
                    {!atividade.concluida && isAtividadeAtrasada(atividade.data || 'Hoje', atividade.hora) ? `ATRASADA (${atividade.hora})` : `${atividade.data && atividade.data !== 'Hoje' ? atividade.data : 'Hoje'}, ${atividade.hora}`}
                  </div>
                  <button
                    type="button"
                    onClick={() => onVerNegocio(atividade.cliente)}
                    className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors active:scale-95"
                  >
                    <User className="size-3.5" />
                    {atividade.cliente}
                    <ChevronRight className="size-3.5 text-muted-foreground" />
                  </button>
                </div>

                {atividade.tipo === 'ligacao' && atividade.telefone && (
                  <div className="mt-6 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-5 shadow-sm">
                    <p className="text-[10px] font-bold tracking-tight text-primary mb-2">Ligação com Lead</p>
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div>
                        <p className="text-lg font-bold text-foreground">{atividade.telefone}</p>
                        <p className="text-xs text-muted-foreground">Chamada local via operadora</p>
                      </div>
                      <span className="flex size-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                        <Phone className="size-5" />
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          window.dispatchEvent(new CustomEvent('open-simulated-screen', { detail: { tipo: 'ligacao', params: { nome: atividade.cliente, telefone: atividade.telefone } } }))
                        }
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/95 active:scale-[0.98] shadow-sm"
                    >
                      <Phone className="size-4" strokeWidth={2} />
                      Iniciar Ligação
                    </button>
                  </div>
                )}
                {atividade.tipo === 'whatsapp' && atividade.whatsapp && (
                  <div className="mt-6 rounded-2xl border border-green-200 bg-gradient-to-br from-[#25D366]/5 to-[#25D366]/10 p-5 shadow-sm">
                    <p className="text-[10px] font-bold tracking-tight text-[#25D366] mb-2">Mensagem de WhatsApp</p>
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div>
                        <p className="text-lg font-bold text-foreground">{atividade.whatsapp}</p>
                        <p className="text-xs text-muted-foreground">Abrir chat direto com lead</p>
                      </div>
                      <span className="flex size-10 items-center justify-center rounded-full bg-[#25D366]/20 text-[#25D366]">
                        <MessageCircle className="size-5" />
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          window.dispatchEvent(new CustomEvent('open-simulated-screen', { detail: { tipo: 'whatsapp', params: { nome: atividade.cliente } } }))
                        }
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-semibold text-white transition-all hover:bg-[#25D366]/95 active:scale-[0.98] shadow-sm text-center"
                    >
                      <MessageCircle className="size-4" strokeWidth={2} />
                      Abrir WhatsApp
                    </button>
                  </div>
                )}

                {atividade.tipo === 'visita' && (
                  <div className="mt-6 rounded-2xl border border-border bg-card p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-xs font-semibold tracking-tight text-muted-foreground flex items-center gap-2">
                        <MapPin className="size-3.5" />
                        Roteiro de visita
                      </h3>
                      {atividade.imoveisVisitados && atividade.imoveisVisitados.length > 0 && (
                        <span className="font-mono text-xs font-bold text-primary">
                          {Object.values(visitadosLocais).filter(Boolean).length} / {atividade.imoveisVisitados.length}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-3">
                      {atividade.imoveisVisitados?.map((imv, idx) => (
                        <div key={imv.id} className="flex flex-col gap-2 rounded-xl bg-muted/50 p-3">
                          <div className="flex items-start gap-3">
                            <button
                              type="button"
                              onClick={() => setVisitadosLocais(prev => ({ ...prev, [imv.id]: !prev[imv.id] }))}
                              className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border transition-colors ${visitadosLocais[imv.id] ? 'bg-primary border-primary text-primary-foreground' : 'border-input bg-background'
                                }`}
                            >
                              {visitadosLocais[imv.id] && <CheckCircle2 className="size-3.5" />}
                            </button>
                            <div className="flex-1">
                              <p className={`text-sm font-semibold ${visitadosLocais[imv.id] ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                                {imv.nome}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">{imv.endereco}</p>
                            </div>
                          </div>
                          <div className="ml-8 flex items-center justify-between">
                            <a
                              href={`https://maps.google.com/?q=${encodeURIComponent(imv.endereco)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex w-fit items-center gap-1.5 rounded-lg bg-background px-2.5 py-1.5 text-xs font-semibold text-primary shadow-sm border border-border hover:bg-muted active:scale-95 transition-all"
                            >
                              <MapPin className="size-3" />
                              Navegar até o local
                            </a>
                            {atividade.imoveisVisitados && atividade.imoveisVisitados.length > 1 && (
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleReorder(idx, 'up')}
                                  disabled={idx === 0}
                                  className="flex size-7 items-center justify-center rounded-lg border border-border bg-background shadow-sm hover:bg-muted disabled:opacity-50 disabled:active:scale-100 active:scale-95 transition-all"
                                >
                                  <ArrowUp className="size-3.5 text-muted-foreground" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleReorder(idx, 'down')}
                                  disabled={idx === atividade.imoveisVisitados!.length - 1}
                                  className="flex size-7 items-center justify-center rounded-lg border border-border bg-background shadow-sm hover:bg-muted disabled:opacity-50 disabled:active:scale-100 active:scale-95 transition-all"
                                >
                                  <ArrowDown className="size-3.5 text-muted-foreground" />
                                </button>
                              </div>
                            )}
                          </div>

                          {visitadosLocais[imv.id] && (
                            <div className="mt-3 ml-8 p-3 rounded-xl border border-border/80 bg-background/50 flex flex-col gap-3">
                              {/* Reação/Gostou */}
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-muted-foreground tracking-tight">Avaliação rápida</span>
                                <div className="flex gap-1.5">
                                  {(['gostou', 'neutro', 'nao_gostou'] as const).map(reac => (
                                    <button
                                      key={reac}
                                      type="button"
                                      onClick={() => setInlineReacoes(prev => ({ ...prev, [imv.id]: reac }))}
                                      className={`size-7 rounded-lg border text-xs flex items-center justify-center transition-all active:scale-95 ${inlineReacoes[imv.id] === reac ? 'border-primary bg-primary/10 shadow-sm' : 'border-border'}`}
                                    >
                                      {reac === 'gostou' ? '👍' : reac === 'neutro' ? '😐' : '👎'}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Gravação de Voz Inline */}
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-semibold text-foreground flex items-center gap-1">
                                    <Mic className="size-3 text-primary" />
                                    Feedback por Voz
                                  </span>
                                  {inlineFeedbacks[imv.id] && (
                                    <button
                                      type="button"
                                      onClick={() => deleteInlineRecording(imv.id)}
                                      className="text-red-500 hover:text-red-750 text-[10px] underline"
                                    >
                                      Remover
                                    </button>
                                  )}
                                </div>

                                {!inlineGravando && !inlineFeedbacks[imv.id] && (
                                  <button
                                    type="button"
                                    onClick={() => startInlineRecording(imv.id)}
                                    className="flex w-full h-8 items-center justify-center gap-1.5 rounded-lg border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold transition-all hover:bg-primary/10"
                                  >
                                    <Mic className="size-3" />
                                    Gravar Comentário
                                  </button>
                                )}

                                {inlineGravando && inlineFeedbackAtivo === imv.id && (
                                  <div className="flex items-center justify-between bg-red-550/15 border border-red-500/20 rounded-lg px-2.5 py-1">
                                    <div className="flex items-center gap-1.5">
                                      <span className="size-2 rounded-full bg-red-500 animate-ping" />
                                      <span className="text-[10px] font-semibold text-red-700">Gravando...</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono text-[10px] font-bold text-red-700">{formatTime(inlineTempoGravacao)}</span>
                                      <button
                                        type="button"
                                        onClick={() => stopInlineRecording(imv.id)}
                                        className="bg-red-500 text-white rounded px-2 py-0.5 text-[9px] font-bold shadow-sm active:scale-95 transition-all"
                                      >
                                        Parar
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {inlineTranscrevendo && inlineFeedbackAtivo === imv.id && (
                                  <div className="flex items-center justify-center gap-1 py-1 text-[10px] text-primary font-semibold">
                                    <svg className="size-3 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                    Transcrevendo...
                                  </div>
                                )}

                                {(inlineFeedbacks[imv.id] || (inlineFeedbackAtivo !== imv.id && inlineGravando)) && (
                                  <textarea
                                    value={inlineFeedbacks[imv.id] || ''}
                                    onChange={(e) => {
                                      const text = e.target.value
                                      setInlineFeedbacks(prev => ({ ...prev, [imv.id]: text }))
                                    }}
                                    placeholder="Comentários transcritos..."
                                    className="w-full resize-none rounded-lg border border-border bg-background p-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none h-16"
                                  />
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                      {!buscandoImovel ? (
                        <button
                          type="button"
                          onClick={() => setBuscandoImovel(true)}
                          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 bg-primary/5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 active:scale-[0.98]"
                        >
                          <Search className="size-4" />
                          Buscar e anexar outro imóvel
                        </button>
                      ) : (
                        <div className="flex flex-col gap-2 rounded-xl border border-border bg-background p-3 shadow-sm">
                          <div className="flex items-center gap-2 border-b border-border pb-2">
                            <Search className="size-4 text-muted-foreground" />
                            <input
                              type="text"
                              autoFocus
                              placeholder="Código, bairro ou tipo..."
                              value={buscaImovelTexto}
                              onChange={(e) => setBuscaImovelTexto(e.target.value)}
                              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                            />
                            <button type="button" onClick={() => { setBuscandoImovel(false); setBuscaImovelTexto(''); }} className="p-1 text-muted-foreground hover:text-foreground">
                              <X className="size-4" />
                            </button>
                          </div>
                          {buscaImovelTexto && (
                            <div className="mt-1 flex max-h-40 flex-col overflow-y-auto rounded-lg">
                              {imoveis
                                .filter(i =>
                                  i.codigo.toLowerCase().includes(buscaImovelTexto.toLowerCase()) ||
                                  i.bairro.toLowerCase().includes(buscaImovelTexto.toLowerCase()) ||
                                  i.titulo.toLowerCase().includes(buscaImovelTexto.toLowerCase()) ||
                                  i.tipoImovel.toLowerCase().includes(buscaImovelTexto.toLowerCase())
                                )
                                .filter(i => !atividade.imoveisVisitados?.find(v => v.id === i.id))
                                .map(imv => (
                                  <button
                                    key={imv.id}
                                    type="button"
                                    onClick={() => {
                                      if (!atividade.imoveisVisitados) atividade.imoveisVisitados = [];
                                      atividade.imoveisVisitados.push({
                                        id: imv.id,
                                        nome: `${imv.tipoImovel} em ${imv.bairro}`,
                                        visitado: false,
                                        endereco: imv.enderecoCompleto || ''
                                      });
                                      setVisitadosLocais(prev => ({ ...prev, [imv.id]: false }));
                                      setBuscandoImovel(false);
                                      setBuscaImovelTexto('');
                                    }}
                                    className="flex flex-col border-b border-border py-2 text-left hover:bg-muted last:border-0"
                                  >
                                    <span className="text-xs font-semibold text-foreground">{imv.codigo} - {imv.tipoImovel} em {imv.bairro}</span>
                                    <span className="text-[10px] text-muted-foreground">{imv.preco}</span>
                                  </button>
                                ))}
                              {imoveis.filter(i =>
                                i.codigo.toLowerCase().includes(buscaImovelTexto.toLowerCase()) ||
                                i.bairro.toLowerCase().includes(buscaImovelTexto.toLowerCase()) ||
                                i.titulo.toLowerCase().includes(buscaImovelTexto.toLowerCase()) ||
                                i.tipoImovel.toLowerCase().includes(buscaImovelTexto.toLowerCase())
                              ).length === 0 && (
                                  <div className="p-3 text-center text-xs text-muted-foreground">Nenhum imóvel encontrado</div>
                                )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-6 rounded-2xl bg-muted/30 p-4 border border-border/50">
                  <h3 className="mb-2 text-xs font-semibold tracking-tight text-muted-foreground flex items-center gap-2">
                    <Target className="size-3.5" />
                    O que deve ser feito
                  </h3>
                  <p className="text-sm text-foreground leading-relaxed">
                    {atividade.descricao || 'Nenhuma instrução específica para esta atividade.'}
                  </p>
                </div>

                <div className="mt-6">
                  <h3 className="mb-2 text-xs font-semibold tracking-tight text-muted-foreground flex items-center gap-2">
                    <MessageSquare className="size-3.5" />
                    Feedback da atividade
                  </h3>
                  <div className="flex gap-2 mb-3">
                    <button type="button" onClick={() => setEmojiFeedback('ruim')} className={`flex-1 flex flex-col items-center justify-center gap-1 p-2 rounded-xl border transition-colors ${emojiFeedback === 'ruim' ? 'border-red-500 bg-red-50 text-red-700' : 'border-border bg-card hover:bg-muted'}`}>
                      <span className="text-2xl">👎</span>
                      <span className="text-[10px] font-semibold ">Ruim</span>
                    </button>
                    <button type="button" onClick={() => setEmojiFeedback('neutra')} className={`flex-1 flex flex-col items-center justify-center gap-1 p-2 rounded-xl border transition-colors ${emojiFeedback === 'neutra' ? 'border-amber bg-amber/10 text-[#8a5a1e]' : 'border-border bg-card hover:bg-muted'}`}>
                      <span className="text-2xl">😐</span>
                      <span className="text-[10px] font-semibold ">Neutra</span>
                    </button>
                    <button type="button" onClick={() => setEmojiFeedback('boa')} className={`flex-1 flex flex-col items-center justify-center gap-1 p-2 rounded-xl border transition-colors ${emojiFeedback === 'boa' ? 'border-green-500 bg-green-50 text-green-700' : 'border-border bg-card hover:bg-muted'}`}>
                      <span className="text-2xl">👍</span>
                      <span className="text-[10px] font-semibold ">Boa</span>
                    </button>
                  </div>
                  {/* Audio Recording UI Component */}
                  <div className="mt-3 mb-3 p-3 rounded-2xl border border-border bg-muted/20 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <Volume2 className="size-3.5 text-primary" />
                        Feedback por Áudio
                      </span>
                      {audioUrl && (
                        <button
                          type="button"
                          onClick={deleteRecording}
                          className="text-red-500 hover:text-red-750 transition-colors"
                          title="Remover áudio"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      )}
                    </div>

                    {!gravando && !audioUrl && (
                      <button
                        type="button"
                        onClick={startRecording}
                        className="flex w-full h-11 items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 text-primary text-xs font-bold transition-all hover:bg-primary/10 active:scale-[0.98]"
                      >
                        <Mic className="size-4" />
                        Gravar Feedback Falado
                      </button>
                    )}

                    {gravando && (
                      <div className="flex items-center justify-between bg-red-550/10 border border-red-500/20 rounded-xl px-4 py-2">
                        <div className="flex items-center gap-2">
                          <span className="size-2.5 rounded-full bg-red-500 animate-ping" />
                          <span className="text-xs font-semibold text-red-700">Gravando áudio...</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-xs font-bold text-red-700">{formatTime(tempoGravacao)}</span>
                          <button
                            type="button"
                            onClick={stopRecording}
                            className="bg-red-500 text-white rounded-lg px-3 py-1 text-[11px] font-bold shadow-sm active:scale-95 transition-all"
                          >
                            Parar
                          </button>
                        </div>
                      </div>
                    )}

                    {transcrevendo && (
                      <div className="flex items-center justify-center gap-2 py-2 text-xs text-primary font-semibold">
                        <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                        Transcrevendo áudio com Albert IA...
                      </div>
                    )}

                    {audioUrl && !transcrevendo && (
                      <>
                        <div className="flex items-center gap-3 bg-primary/5 border border-primary/25 rounded-xl px-4 py-2">
                          <button
                            type="button"
                            onClick={() => setAudioTocando(!audioTocando)}
                            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm active:scale-90 transition-all"
                          >
                            {audioTocando ? <Pause className="size-4" /> : <Play className="size-4" />}
                          </button>
                          <div className="flex-1">
                            <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full transition-all duration-300" 
                                style={{ width: audioTocando ? '100%' : '20%' }} 
                              />
                            </div>
                          </div>
                          <span className="font-mono text-xs font-semibold text-muted-foreground">
                            {audioTocando ? '0:00' : formatTime(tempoGravacao)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-green-600 font-semibold bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-1.5">
                          <CheckCircle2 className="size-3.5" />
                          Áudio gravado e transcrito automaticamente abaixo!
                        </div>
                      </>
                    )}
                  </div>

                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Como foi a interação? O que ficou acordado?"
                    className="w-full resize-none rounded-2xl border border-border bg-background p-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary h-24"
                  />
                </div>


                {atividade.tipo === 'visita' && !atividade.concluida && onGerarTermo && (
                  <div className="mt-6 mb-2">
                    <button
                      type="button"
                      onClick={() => onGerarTermo(atividade.id)}
                      className="flex w-full h-12 items-center justify-center gap-2 rounded-2xl bg-amber/10 text-[#8a5a1e] text-sm font-semibold transition-transform hover:bg-amber/20 active:scale-95 border border-amber/20"
                    >
                      <DocumentIcon className="size-4.5" />
                      Gerar Termo de Visita
                    </button>
                  </div>
                )}

                {remarcando ? (
                  <div className="mt-6 flex flex-col gap-4 animate-in fade-in duration-200">
                    <h3 className="text-sm font-semibold text-foreground">Remarcar atividade</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Nova Data</label>
                        <input
                          type="date"
                          value={novaData}
                          onChange={(e) => setNovaData(e.target.value)}
                          className="h-12 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Nova Hora</label>
                        <input
                          type="time"
                          value={novaHora}
                          onChange={(e) => setNovaHora(e.target.value)}
                          className="h-12 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <button
                        type="button"
                        onClick={() => setRemarcando(false)}
                        className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-background text-sm font-semibold text-foreground transition-colors hover:bg-muted active:scale-95"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={handleRemarcar}
                        className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:bg-primary/90 active:scale-95"
                      >
                        <CheckCircle2 className="size-4.5" />
                        Salvar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRemarcando(true)}
                      className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-background text-sm font-semibold text-foreground transition-colors hover:bg-muted active:scale-95"
                    >
                      <Calendar className="size-4.5" />
                      Remarcar
                    </button>
                    <button
                      type="button"
                      onClick={handleConcluir}
                      className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:bg-primary/90 active:scale-95"
                    >
                      <CheckCircle2 className="size-4.5" />
                      Concluir
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
