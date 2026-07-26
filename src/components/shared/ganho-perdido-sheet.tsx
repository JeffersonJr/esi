'use client'

import { useState, useRef, useEffect } from 'react'
import { CheckCircle2, Frown, Trophy, X, PartyPopper, Mic, Volume2, Play, Pause, Trash2 } from 'lucide-react'
import confetti from 'canvas-confetti'

const MOTIVOS_PERDA = [
  'Cliente fora do perfil',
  'Desistiu da negociação',
  'Fechou com a concorrência',
  'Inacessível',
  'Não demonstrou mais interesse',
  'Outros',
  'Parou de responder',
  'Sem prioridade de negociação',
]

export function GanhoPerdidoSheet({
  tipo,
  onClose,
  onConfirm,
}: {
  tipo: 'ganho' | 'perdido'
  onClose: () => void
  onConfirm: (feedback: string) => void
}) {
  const [feedback, setFeedback] = useState('')
  const [motivoPerda, setMotivoPerda] = useState('')
  const [sucesso, setSucesso] = useState(false)

  // Audio Recording States
  const [gravandoAudio, setGravandoAudio] = useState(false)
  const [tempoGravacao, setTempoGravacao] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [transcrevendo, setTranscrevendo] = useState(false)
  const timerRef = useRef<any>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const isGanho = tipo === 'ganho'

  function startRecording() {
    setGravandoAudio(true)
    setTempoGravacao(0)
    setAudioUrl(null)
    setTranscrevendo(false)
    timerRef.current = setInterval(() => {
      setTempoGravacao(prev => prev + 1)
    }, 1000)
  }

  function stopRecording() {
    if (timerRef.current) clearInterval(timerRef.current)
    setGravandoAudio(false)
    setAudioUrl('mock-deal-audio.mp3')
    setTranscrevendo(true)

    setTimeout(() => {
      setTranscrevendo(false)
      const transTexts = isGanho 
        ? [
            "Conseguimos fechar a venda hoje à tarde! O cliente concordou com as condições e já fez o sinal.",
            "Negócio ganho! Cliente assinou a proposta de compra do apartamento à vista.",
            "Venda efetuada com sucesso. Proprietário aceitou a contraproposta do lead."
          ]
        : [
            "Cliente preferiu imóvel com mais vagas de garagem, acabou fechando com outra imobiliária.",
            "Desistiu do negócio pois a taxa de juros do financiamento ficou muito alta.",
            "Parou de responder as mensagens e ligações após a segunda visita."
          ]
      setFeedback(transTexts[Math.floor(Math.random() * transTexts.length)])
    }, 1600)
  }

  function deleteRecording() {
    setAudioUrl(null)
    setTempoGravacao(0)
  }

  function formatTime(secs: number) {
    const minutes = Math.floor(secs / 60)
    const seconds = secs % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  function handleSubmit() {
    if (isGanho && !feedback.trim() && !audioUrl) return
    if (!isGanho && !motivoPerda) return
    
    setSucesso(true)
    
    if (isGanho) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }

    let finalFeedback = feedback.trim()
    if (audioUrl) {
      finalFeedback = finalFeedback 
        ? `${finalFeedback} [Nota de áudio gravada: ${audioUrl} (${formatTime(tempoGravacao)})]` 
        : `[Nota de áudio gravada: ${audioUrl} (${formatTime(tempoGravacao)})]`
    }

    const finalConfirmText = isGanho 
      ? finalFeedback 
      : `[Motivo da Perda: ${motivoPerda}]${finalFeedback ? ` - ${finalFeedback}` : ''}`

    setTimeout(() => {
      onConfirm(finalConfirmText)
      onClose()
    }, 3000)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={!sucesso ? onClose : undefined}
      />
      <div className="relative z-50 w-full rounded-t-[2.5rem] bg-card p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-2xl animate-in slide-in-from-bottom duration-300 mx-auto max-w-[600px]">
        <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-border" />
        
        {sucesso ? (
          <div className="flex flex-col items-center justify-center py-10 animate-in zoom-in duration-300">
            {isGanho ? (
              <div className="flex size-20 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4 animate-bounce">
                <PartyPopper className="size-10" />
              </div>
            ) : (
              <div className="flex size-20 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
                <CheckCircle2 className="size-10" />
              </div>
            )}
            <h2 className="font-serif text-2xl font-bold text-foreground text-center">
              {isGanho ? 'Parabéns pela venda!' : 'Feedback registrado'}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground text-center max-w-xs">
              {isGanho 
                ? 'Mais um negócio de sucesso fechado. Continue assim!' 
                : 'Oportunidade perdida, mas aprendizado garantido. Vamos para a próxima!'}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`flex size-12 items-center justify-center rounded-2xl ${isGanho ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {isGanho ? <Trophy className="size-6" /> : <Frown className="size-6" />}
                </div>
                <div>
                  <h2 className="font-serif text-xl font-bold text-foreground leading-tight">
                    {isGanho ? 'Negócio Ganho' : 'Negócio Perdido'}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {isGanho ? 'Registre os detalhes da vitória' : 'Qual foi o motivo da perda?'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted/80 active:scale-95"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {!isGanho && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-foreground">
                    Motivo da Perda <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={motivoPerda}
                    onChange={(e) => setMotivoPerda(e.target.value)}
                    className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm font-medium text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Selecione o motivo da perda...</option>
                    {MOTIVOS_PERDA.map((motivo) => (
                      <option key={motivo} value={motivo}>
                        {motivo}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Audio Recorder & Transcriber */}
              <div className="p-3 rounded-2xl border border-border bg-muted/20 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Volume2 className="size-3.5 text-primary" />
                    Gravar Feedback por Voz
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

                {!gravandoAudio && !audioUrl && (
                  <button
                    type="button"
                    onClick={startRecording}
                    className="flex w-full h-11 items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 text-primary text-xs font-bold transition-all hover:bg-primary/10 active:scale-[0.98]"
                  >
                    <Mic className="size-4" />
                    Gravar Comentário (Voz)
                  </button>
                )}

                {gravandoAudio && (
                  <div className="flex items-center justify-between bg-red-550/10 border border-red-500/20 rounded-xl px-4 py-2">
                    <div className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full bg-red-500 animate-ping" />
                      <span className="text-xs font-semibold text-red-700">Gravando...</span>
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
                  <div className="flex items-center gap-2 text-[10px] text-green-600 font-semibold bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-1.5">
                    <CheckCircle2 className="size-3.5" />
                    Áudio gravado e transcrito automaticamente abaixo!
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-foreground">
                  {isGanho ? 'Observações da Venda' : 'Anotações Extras'}
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder={isGanho ? "Ex: Cliente amou a vista e fechamos o valor cheio!" : "Ex: Cliente achou muito caro e comprou outro... (Opcional)"}
                  className="w-full resize-none rounded-2xl border border-border bg-background p-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary h-28"
                />
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isGanho ? (!feedback.trim() && !audioUrl) : !motivoPerda}
                className={`mt-2 flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-sm font-semibold text-white shadow-lg transition-transform hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:active:scale-100 ${
                  isGanho ? 'bg-green-600 shadow-green-600/20' : 'bg-red-600 shadow-red-600/20'
                }`}
              >
                <CheckCircle2 className="size-5" />
                Confirmar {isGanho ? 'Venda' : 'Perda'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
