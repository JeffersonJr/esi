'use client'

import { useState, useEffect } from 'react'
import { Bot, Brain, Camera, CheckCircle2, MessageCircle, Sparkles, Trophy, X, Zap, Loader2, Check, ArrowRight } from 'lucide-react'
import { createPortal } from 'react-dom'

const BENEFICIOS = [
  {
    icon: Camera,
    cor: 'from-teal-deep to-teal-mid',
    emoji: '📸',
    titulo: 'Cadastro de Imóveis por IA',
    descricao:
      'Tire fotos do imóvel e a IA analisa automaticamente: identifica o tipo, estima a metragem, detecta a localização, avalia o valor de mercado e gera uma descrição completa em segundos.',
    itens: [
      'Tipo de imóvel detectado automaticamente',
      'Estimativa de metragem por visão computacional',
      'Valor de mercado sugerido pela IA',
      'Descrição profissional gerada em segundos',
      'Localização e bairro identificados',
    ],
  },
  {
    icon: Bot,
    cor: 'from-primary to-teal-deep',
    emoji: '🤖',
    titulo: 'Albert — IA de Atendimento',
    descricao:
      'O Albert é seu assistente de vendas 24h. Ele faz follow-up automático com leads, envia mensagens personalizadas no momento certo e garante que nenhum cliente seja esquecido.',
    itens: [
      'Follow-up automático por WhatsApp e e-mail',
      'Mensagens personalizadas para cada lead',
      'Reativação de leads frios sem esforço',
      'Notificações inteligentes de oportunidades',
      'Histórico completo de interações com IA',
    ],
  },
  {
    icon: Brain,
    cor: 'from-amber to-[#8a5a1e]',
    emoji: '📊',
    titulo: 'Insights e Previsão de Fechamento',
    descricao:
      'A IA analisa o comportamento dos leads e prevê quais têm maior probabilidade de fechar. Priorize seu tempo com quem realmente vai comprar.',
    itens: [
      'Score de probabilidade de fechamento',
      'Análise do perfil de cada lead',
      'Sugestão de próxima ação ideal',
      'Relatórios de performance gerados por IA',
      'Alertas de leads prontos para fechar',
    ],
  },
]

const ESTATISTICAS = [
  { valor: '3x', label: 'mais conversões de leads' },
  { valor: '78%', label: 'menos tempo no cadastro' },
  { valor: '24h', label: 'de follow-up automático' },
  { valor: '94%', label: 'de precisão na análise' },
]

export function IAUpsellPage({ onClose, onSuccess, origem }: { onClose: () => void; onSuccess?: () => void; origem: 'albert' | 'imovel' }) {
  const [contratando, setContratando] = useState(false)
  const [habilitado, setHabilitado] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const beneficioDestaque = origem === 'albert' ? 1 : 0 // qual card mostrar primeiro

  function handleContratar() {
    setContratando(true)
    setTimeout(() => {
      setContratando(false)
      setHabilitado(true)
    }, 1500)
  }

  const content = (
    <div className="fixed inset-0 z-[100] flex flex-col bg-background">
      <div className="flex-1 overflow-y-auto pb-6">
      {/* Hero */}
      <div className="relative flex flex-col items-center justify-center overflow-hidden bg-primary px-6 pb-10 pt-[calc(3rem+env(safe-area-inset-top))] text-center">
        {/* Fechar */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-5 top-[calc(1rem+env(safe-area-inset-top))] flex size-10 items-center justify-center rounded-full bg-teal-shadow/40 text-primary-foreground transition-brand active:scale-95"
        >
          <X className="size-5" strokeWidth={1.5} />
        </button>

        {/* Ícone animado */}
        <div className="relative mb-5">
          <div className="flex size-20 items-center justify-center rounded-3xl bg-teal-shadow/50">
            <Sparkles className="size-10 text-primary-foreground" strokeWidth={1.5} />
          </div>
          {/* Pulso */}
          <span className="absolute inset-0 animate-ping rounded-3xl bg-teal-mid/30" />
        </div>

        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-teal-light">evolves IA</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight text-primary-foreground text-balance">
          Venda mais com<br />Inteligência Artificial
        </h1>
        <p className="mt-3 text-sm text-teal-light text-balance max-w-xs">
          {origem === 'albert'
            ? 'O Albert é um assistente de IA que faz follow-up automático dos seus leads para você nunca perder uma venda.'
            : 'Cadastre imóveis em segundos tirando fotos — a IA preenche tudo automaticamente.'}
        </p>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-4 gap-2 w-full">
          {ESTATISTICAS.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-0.5 rounded-2xl bg-teal-shadow/40 px-2 py-3">
              <span className="font-serif text-lg font-black text-primary-foreground">{s.valor}</span>
              <span className="text-[9px] font-medium text-teal-light text-center leading-tight">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Benefícios */}
      {habilitado ? (
          <div className="flex flex-col items-center justify-center text-center animate-in zoom-in duration-500 py-10 px-4">
            <div className="flex size-24 items-center justify-center rounded-full bg-teal-mid/20 text-teal-deep mb-6">
              <CheckCircle2 className="size-12" strokeWidth={2} />
            </div>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
              A IA já está trabalhando por você!
            </h2>
            <div className="rounded-[1.25rem] bg-card p-6 shadow-soft text-left w-full mb-6">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Bot className="size-5 text-primary" /> Nos seus Negócios:
              </h3>
              <ul className="flex flex-col gap-3">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span className="text-sm text-muted-foreground">Sugerindo automaticamente a próxima melhor ação para cada cliente.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span className="text-sm text-muted-foreground">Avaliando a temperatura do lead (Quente, Morno, Frio).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span className="text-sm text-muted-foreground">Fazendo follow-up automático na aba "Albert IA" dentro do atendimento.</span>
                </li>
              </ul>
            </div>
            <div className="rounded-[1.25rem] bg-card p-6 shadow-soft text-left w-full">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Camera className="size-5 text-primary" /> Na Captação:
              </h3>
              <p className="text-sm text-muted-foreground">
                Agora, ao enviar uma foto, a IA vai extrair cômodos, preencher descrições e sugerir preços do mercado local em segundos.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8 grid grid-cols-2 gap-3 px-5 mt-6">
              {ESTATISTICAS.map((est) => (
                <div key={est.label} className="flex flex-col items-center justify-center rounded-[1.25rem] bg-card p-4 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.08)]">
                  <span className="font-serif text-2xl font-bold text-primary">{est.valor}</span>
                  <span className="mt-1 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {est.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mb-8 flex flex-col gap-4 px-5">
              {BENEFICIOS.map((b, i) => {
                const isDestaque = i === beneficioDestaque
                return (
                  <div
                    key={b.titulo}
                    className={`flex flex-col overflow-hidden rounded-[1.5rem] border ${isDestaque ? 'border-primary shadow-[0_8px_30px_-12px_rgba(var(--primary-rgb),0.3)]' : 'border-border bg-card'}`}
                  >
                    {/* Header do Card */}
                    <div className={`flex items-center gap-3 p-5 ${isDestaque ? `bg-gradient-to-br ${b.cor} text-white` : 'border-b border-border'}`}>
                      <div className={`flex size-10 shrink-0 items-center justify-center rounded-2xl ${isDestaque ? 'bg-white/20' : 'bg-primary/10 text-primary'}`}>
                        <b.icon className="size-5" strokeWidth={1.5} />
                      </div>
                      <h3 className={`font-serif text-lg font-semibold ${isDestaque ? 'text-white' : 'text-foreground'}`}>
                        {b.titulo}
                      </h3>
                    </div>

                    {/* Conteúdo */}
                    <div className="bg-card px-5 py-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">{b.descricao}</p>
                      <ul className="mt-3 flex flex-col gap-2">
                        {b.itens.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <CheckCircle2 className="size-4 shrink-0 text-teal-mid mt-0.5" strokeWidth={2} />
                            <span className="text-xs font-medium text-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )
              })}

              {/* Depoimento */}
              <div className="rounded-[1.25rem] bg-cream p-5">
                <div className="flex gap-1 mb-2">
                  {[1,2,3,4,5].map(i => <span key={i} className="text-amber text-sm">★</span>)}
                </div>
                <p className="text-sm text-foreground italic leading-relaxed">
                  "Com o Albert, minha taxa de conversão triplicou. Ele faz os follow-ups enquanto eu estou em visitas. É como ter um assistente trabalhando 24h por dia."
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 font-serif text-xs font-bold text-primary">
                    RF
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Roberto Figueiredo</p>
                    <p className="text-[10px] text-muted-foreground">Corretor · São Paulo</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* CTAs Sticky */}
      <div className="shrink-0 border-t border-border/40 bg-background p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col gap-3">
          {habilitado ? (
            <button
              type="button"
              onClick={onSuccess || onClose}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-teal-mid text-sm font-semibold text-white shadow-xl shadow-teal-mid/25 transition-brand active:scale-[0.98]"
            >
              <CheckCircle2 className="size-4" />
              Entendi, voltar para o app
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleContratar}
                disabled={contratando}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/25 transition-brand active:scale-[0.98]"
              >
                {contratando ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Habilitando IA...
                  </>
                ) : (
                  <>
                    <Zap className="size-4" strokeWidth={2} />
                    Contratar evolves IA
                  </>
                )}
              </button>
              <a
                href="https://wa.me/5511999999999?text=Olá,%20gostaria%20de%20falar%20com%20um%20consultor%20sobre%20a%20evolves%20IA."
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card text-sm font-semibold text-foreground transition-brand active:scale-[0.98]"
              >
                <MessageCircle className="size-4 text-green-600" strokeWidth={1.5} />
                Falar com consultor pelo WhatsApp
              </a>
              <button
                type="button"
                onClick={onClose}
                className="h-10 w-full text-sm text-muted-foreground transition-brand hover:text-foreground"
              >
                Continuar sem IA
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )

  if (!mounted) return null
  return createPortal(content, document.body)
}
