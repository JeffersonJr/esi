'use client'

import { useState } from 'react'

import { X, Check, Search, ChevronDown } from 'lucide-react'
import { origemConfig, tempConfig, type OrigemLead, type Temperatura } from '@/lib/app-data'

export function FiltrosAvancadosSheet({
  onClose,
  filtroTemp,
  setFiltroTemp,
  filtroOrigem,
  setFiltroOrigem,
  filtroPreAtendimento,
  setFiltroPreAtendimento,
  filtroPeriodo,
  setFiltroPeriodo,
  filtroNome,
  setFiltroNome,
}: {
  onClose: () => void
  filtroTemp: Temperatura | 'todas'
  setFiltroTemp: (v: Temperatura | 'todas') => void
  filtroOrigem: OrigemLead[]
  setFiltroOrigem: (v: OrigemLead[]) => void
  filtroPreAtendimento: 'todos' | 'sim' | 'nao'
  setFiltroPreAtendimento: (v: 'todos' | 'sim' | 'nao') => void
  filtroPeriodo: string
  setFiltroPeriodo: (v: string) => void
  filtroNome: string
  setFiltroNome: (v: string) => void
}) {
  const isPersonalizado = filtroPeriodo.startsWith('personalizado')
  const [dataDe, setDataDe] = useState(isPersonalizado ? filtroPeriodo.split(':')[1] || '' : '')
  const [dataAte, setDataAte] = useState(isPersonalizado ? filtroPeriodo.split(':')[2] || '' : '')

  const origens = Object.keys(origemConfig) as OrigemLead[]
  const temperaturas: Temperatura[] = ['quente', 'morno', 'frio']
  const [buscaOrigem, setBuscaOrigem] = useState('')

  const origensFiltradas = origens.filter(o => o.toLowerCase().includes(buscaOrigem.toLowerCase()))

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Fechar filtros"
        onClick={onClose}
        className="absolute inset-0 bg-teal-shadow/40 backdrop-blur-[2px]"
      />

      {/* Sheet Content */}
      <div className="relative flex flex-col rounded-t-3xl bg-card shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-serif text-xl font-semibold text-foreground">Filtros Avançados</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-brand active:scale-95"
          >
            <X className="size-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-6 p-6 overflow-y-auto pb-[calc(1.5rem+env(safe-area-inset-bottom))] max-h-[85vh]">
          {/* Nome */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Nome do Cliente
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-ring">
              <Search className="size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por nome..."
                value={filtroNome}
                onChange={(e) => setFiltroNome(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground text-foreground"
              />
              {filtroNome && (
                <button type="button" onClick={() => setFiltroNome('')} className="text-muted-foreground hover:text-foreground">
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Pré-atendimento */}
          <div>
            <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Pré-atendimento
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setFiltroPreAtendimento('todos')}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-brand border ${filtroPreAtendimento === 'todos'
                  ? 'border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20'
                  : 'border-border bg-transparent text-muted-foreground'
                  }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => setFiltroPreAtendimento('sim')}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-brand border ${filtroPreAtendimento === 'sim'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-transparent text-muted-foreground'
                  }`}
              >
                Em pré-atendimento
              </button>
              <button
                type="button"
                onClick={() => setFiltroPreAtendimento('nao')}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-brand border ${filtroPreAtendimento === 'nao'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-transparent text-muted-foreground'
                  }`}
              >
                Atendimento iniciado
              </button>
            </div>
          </div>

          {/* Período de Criação */}
          <div>
            <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Período de Criação
            </label>
            <div className="relative">
              <select
                value={isPersonalizado ? 'personalizado' : filtroPeriodo}
                onChange={(e) => {
                  const val = e.target.value
                  if (val === 'personalizado') {
                    setFiltroPeriodo(`personalizado:${dataDe}:${dataAte}`)
                  } else {
                    setFiltroPeriodo(val)
                  }
                }}
                className="w-full appearance-none rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="todos">Qualquer período</option>
                <option value="hoje">Hoje</option>
                <option value="essa_semana">Esta semana</option>
                <option value="esse_mes">Este mês</option>
                <option value="ultimos_3_meses">Últimos 3 meses</option>
                <option value="personalizado">Personalizado</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-muted-foreground">
                <ChevronDown className="size-4" />
              </div>
            </div>
            {isPersonalizado && (
              <div className="mt-3 flex gap-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex-1">
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">De</label>
                  <input
                    type="date"
                    value={dataDe}
                    onChange={e => {
                      setDataDe(e.target.value)
                      setFiltroPeriodo(`personalizado:${e.target.value}:${dataAte}`)
                    }}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Até</label>
                  <input
                    type="date"
                    value={dataAte}
                    onChange={e => {
                      setDataAte(e.target.value)
                      setFiltroPeriodo(`personalizado:${dataDe}:${e.target.value}`)
                    }}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Temperatura */}
          <div>
            <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Temperatura
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setFiltroTemp('todas')}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-brand border ${filtroTemp === 'todas'
                  ? 'border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20'
                  : 'border-border bg-transparent text-muted-foreground'
                  }`}
              >
                Todas
              </button>
              {temperaturas.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFiltroTemp(t)}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-brand border ${filtroTemp === t
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-transparent text-muted-foreground'
                    }`}
                >
                  <span className={`size-2.5 rounded-full border ${tempConfig[t].bg} border-card shadow-sm`} />
                  {tempConfig[t].label}
                </button>
              ))}
            </div>
          </div>

          {/* Origem */}
          <div className="flex flex-col min-h-[30dvh] max-h-[40dvh]">
            <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-muted-foreground shrink-0">
              Origem do Lead
            </label>
            <div className="flex-1 overflow-y-auto rounded-2xl border border-border bg-background shadow-inner flex flex-col">
              <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border p-2">
                <div className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2">
                  <Search className="size-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar origem..."
                    value={buscaOrigem}
                    onChange={(e) => setBuscaOrigem(e.target.value)}
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground text-foreground"
                  />
                  {buscaOrigem && (
                    <button type="button" onClick={() => setBuscaOrigem('')} className="text-muted-foreground hover:text-foreground">
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1 p-2">
                <button
                  type="button"
                  onClick={() => setFiltroOrigem([])}
                  className="flex w-full items-center gap-3 rounded-xl p-3 text-left hover:bg-muted transition-colors"
                >
                  <div className={`flex size-5 shrink-0 items-center justify-center rounded border transition-colors ${filtroOrigem.length === 0 ? 'bg-primary border-primary text-primary-foreground' : 'border-input bg-card'
                    }`}>
                    {filtroOrigem.length === 0 && <Check className="size-3.5" />}
                  </div>
                  <span className="text-sm font-medium text-foreground">Todas as origens</span>
                </button>
                {origensFiltradas.map((origem) => (
                  <button
                    key={origem}
                    type="button"
                    onClick={() => {
                      if (filtroOrigem.includes(origem)) {
                        setFiltroOrigem(filtroOrigem.filter(o => o !== origem))
                      } else {
                        setFiltroOrigem([...filtroOrigem, origem])
                      }
                    }}
                    className="flex w-full items-center gap-3 rounded-xl p-3 text-left hover:bg-muted transition-colors"
                  >
                    <div className={`flex size-5 shrink-0 items-center justify-center rounded border transition-colors ${filtroOrigem.includes(origem) ? 'bg-primary border-primary text-primary-foreground' : 'border-input bg-card'
                      }`}>
                      {filtroOrigem.includes(origem) && <Check className="size-3.5" />}
                    </div>
                    <span className="text-sm font-medium text-foreground">{origem}</span>
                  </button>
                ))}
                {origensFiltradas.length === 0 && (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Nenhuma origem encontrada.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={() => {
                setFiltroTemp('todas')
                setFiltroOrigem([])
                setFiltroPreAtendimento('todos')
                setFiltroPeriodo('todos')
                setDataDe('')
                setDataAte('')
                setFiltroNome('')
              }}
              className="flex-1 rounded-2xl border border-border bg-transparent py-3.5 font-semibold text-foreground transition-brand active:scale-[0.98]"
            >
              Limpar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-[2] rounded-2xl bg-primary py-3.5 font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-brand active:scale-[0.98]"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
