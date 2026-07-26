'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X, ChevronDown, ChevronUp } from 'lucide-react'

export type TagGroup = {
  label: string
  items: string[]
}

type Props = {
  label?: string
  placeholder?: string
  groups: TagGroup[]
  popular?: string[]
  selected: string[]
  onChange: (values: string[]) => void
  maxVisible?: number
}

export function SearchableTagSelect({
  label,
  placeholder = 'Buscar...',
  groups,
  popular = [],
  selected,
  onChange,
  maxVisible = 8,
}: Props) {
  const [aberto, setAberto] = useState(false)
  const [busca, setBusca] = useState('')
  const [mostrarTodos, setMostrarTodos] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (aberto) {
      setTimeout(() => inputRef.current?.focus(), 80)
    } else {
      setBusca('')
    }
  }, [aberto])

  function toggle(item: string) {
    if (selected.includes(item)) {
      onChange(selected.filter(s => s !== item))
    } else {
      onChange([...selected, item])
    }
  }

  const query = busca.trim().toLowerCase()
  const todosItens = groups.flatMap(g => g.items)

  const gruposFiltrados: TagGroup[] = query
    ? [{ label: 'Resultados', items: todosItens.filter(i => i.toLowerCase().includes(query)) }]
    : groups

  const popularNaoSelecionados = popular.filter(p => !selected.includes(p))

  const chipsVisiveis = mostrarTodos ? selected : selected.slice(0, maxVisible)
  const chipsOcultos = selected.length - maxVisible

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      )}

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {chipsVisiveis.map(item => (
            <span
              key={item}
              className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary"
            >
              {item}
              <button
                type="button"
                onClick={() => toggle(item)}
                className="ml-0.5 flex size-3.5 items-center justify-center rounded-full text-primary/60 hover:bg-primary/20 hover:text-primary transition-colors"
                aria-label={`Remover ${item}`}
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
          {!mostrarTodos && chipsOcultos > 0 && (
            <button
              type="button"
              onClick={() => setMostrarTodos(true)}
              className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted/80"
            >
              +{chipsOcultos} mais
            </button>
          )}
          {mostrarTodos && selected.length > maxVisible && (
            <button
              type="button"
              onClick={() => setMostrarTodos(false)}
              className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
            >
              Ver menos
            </button>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => setAberto(prev => !prev)}
        className={`flex h-11 w-full items-center justify-between rounded-2xl border px-4 text-sm transition-all ${
          aberto
            ? 'border-primary bg-primary/5 text-primary'
            : 'border-border bg-background text-muted-foreground hover:border-primary/40'
        }`}
      >
        <span className="flex items-center gap-2">
          <Search className="size-4" strokeWidth={1.5} />
          {selected.length > 0
            ? `${selected.length} selecionado${selected.length > 1 ? 's' : ''}`
            : placeholder}
        </span>
        {aberto ? (
          <ChevronUp className="size-4 shrink-0" strokeWidth={1.5} />
        ) : (
          <ChevronDown className="size-4 shrink-0" strokeWidth={1.5} />
        )}
      </button>

      {aberto && (
        <div className="rounded-2xl border border-primary/20 bg-card shadow-lg overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
            <Search className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
            <input
              ref={inputRef}
              type="text"
              value={busca}
              onChange={e => setBusca(e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            {busca && (
              <button type="button" onClick={() => setBusca('')} className="text-muted-foreground hover:text-foreground">
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto p-3 space-y-4">
            {!query && popularNaoSelecionados.length > 0 && (
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  ⭐ Mais usados
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {popularNaoSelecionados.map(item => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggle(item)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all active:scale-95 ${
                        selected.includes(item)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'border-border bg-muted/50 text-foreground hover:border-primary/40 hover:bg-primary/5'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {gruposFiltrados.map(group => {
              if (group.items.length === 0) return null
              return (
                <div key={group.label}>
                  {!query && (
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {group.label}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map(item => {
                      const ativo = selected.includes(item)
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggle(item)}
                          className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all active:scale-95 ${
                            ativo
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'border-border bg-background text-foreground hover:border-primary/40 hover:bg-primary/5'
                          }`}
                        >
                          {item}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}

            {query && gruposFiltrados[0]?.items.length === 0 && (
              <div className="flex flex-col items-center gap-1.5 py-6 text-center">
                <Search className="size-5 text-muted-foreground/40" strokeWidth={1.5} />
                <p className="text-sm text-muted-foreground">Nenhum resultado para "{busca}"</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
            <p className="text-xs text-muted-foreground">
              {selected.length} selecionado{selected.length !== 1 ? 's' : ''}
            </p>
            <button
              type="button"
              onClick={() => setAberto(false)}
              className="rounded-xl bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition-all active:scale-95"
            >
              Confirmar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
