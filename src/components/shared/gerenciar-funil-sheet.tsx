'use client'

import { useState } from 'react'
import { CheckCircle2, ChevronRight, Edit3, Plus, Trash2, X, GripVertical } from 'lucide-react'
import { type Funil, type Atendimento } from '@/lib/app-data'

export function GerenciarFunilSheet({
  funil,
  atendimentos,
  onClose,
  onSave,
}: {
  funil: Funil
  atendimentos: Atendimento[]
  onClose: () => void
  onSave: (funilAtualizado: Funil, transferencias: Record<string, string>) => void
}) {
  const [etapas, setEtapas] = useState(funil.etapas || [])
  const [etapaEmEdicao, setEtapaEmEdicao] = useState<string | null>(null)
  const [novoNome, setNovoNome] = useState('')
  const [excluindoEtapa, setExcluindoEtapa] = useState<{ id: string, name: string } | null>(null)
  const [etapaDestinoId, setEtapaDestinoId] = useState<string>('')
  
  // Tracking transfers: deletedEtapaId -> destinationEtapaId
  const [transferencias, setTransferencias] = useState<Record<string, string>>({})

  const handleAddEtapa = () => {
    const newId = `etapa-${Date.now()}`
    setEtapas([...etapas, {
      id: newId,
      label: 'Nova Etapa',
      cor: 'bg-muted text-muted-foreground border border-border font-medium dark:bg-muted/40 dark:text-muted-foreground dark:border-border/50'
    }])
    setEtapaEmEdicao(newId)
    setNovoNome('Nova Etapa')
  }

  const handleSaveName = (id: string) => {
    setEtapas(etapas.map(e => e.id === id ? { ...e, label: novoNome } : e))
    setEtapaEmEdicao(null)
  }

  const handleDeleteRequest = (id: string, name: string) => {
    const atendimentosNaEtapa = atendimentos.filter(a => a.etapa === id)
    if (atendimentosNaEtapa.length > 0) {
      // Need to ask where to transfer
      setExcluindoEtapa({ id, name })
      const possibleDestinations = etapas.filter(e => e.id !== id)
      if (possibleDestinations.length > 0) {
        setEtapaDestinoId(possibleDestinations[0].id)
      }
    } else {
      // Just delete directly
      setEtapas(etapas.filter(e => e.id !== id))
    }
  }

  const confirmDelete = () => {
    if (!excluindoEtapa || !etapaDestinoId) return
    
    setTransferencias(prev => ({ ...prev, [excluindoEtapa.id]: etapaDestinoId }))
    setEtapas(etapas.filter(e => e.id !== excluindoEtapa.id))
    setExcluindoEtapa(null)
  }

  const handleSaveAll = () => {
    onSave({ ...funil, etapas }, transferencias)
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer" onClick={onClose} />
      <div className="relative z-50 flex h-[85vh] w-full flex-col rounded-t-[2.5rem] bg-card shadow-2xl animate-in slide-in-from-bottom-full duration-300">
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="h-1.5 w-12 rounded-full bg-border" />
        </div>
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="font-serif text-xl font-semibold text-foreground">
              Gerenciar Funil
            </h2>
            <p className="text-xs text-muted-foreground">{funil.nome}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-brand active:scale-95"
          >
            <X className="size-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {excluindoEtapa ? (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5 mb-6 animate-in fade-in">
              <h3 className="text-sm font-semibold text-destructive mb-2">Excluir "{excluindoEtapa.name}"</h3>
              <p className="text-sm text-foreground mb-4">
                Existem negócios vinculados a esta etapa. Para não perdê-los, selecione para qual etapa eles devem ser movidos:
              </p>
              <select
                value={etapaDestinoId}
                onChange={(e) => setEtapaDestinoId(e.target.value)}
                className="w-full h-12 rounded-xl border border-border bg-background px-4 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {etapas.filter(e => e.id !== excluindoEtapa.id).map(e => (
                  <option key={e.id} value={e.id}>{e.label}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setExcluindoEtapa(null)}
                  className="flex-1 h-11 rounded-xl bg-background border border-border text-sm font-semibold transition-colors active:scale-95"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="flex-1 h-11 rounded-xl bg-destructive text-destructive-foreground text-sm font-semibold shadow-lg shadow-destructive/20 transition-transform active:scale-95"
                >
                  Confirmar exclusão
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Edite os nomes das colunas, remova ou adicione novas etapas ao seu funil.
              </p>
              
              <ul className="flex flex-col gap-3">
                {etapas.map((etapa) => (
                  <li key={etapa.id} className="flex items-center gap-2 rounded-2xl border border-border bg-background p-3 shadow-sm">
                    <GripVertical className="size-4 text-muted-foreground/50 shrink-0" />
                    
                    {etapaEmEdicao === etapa.id ? (
                      <div className="flex flex-1 items-center gap-2">
                        <input
                          type="text"
                          value={novoNome}
                          onChange={(e) => setNovoNome(e.target.value)}
                          className="h-9 flex-1 rounded-lg border border-primary bg-background px-3 text-sm focus:outline-none"
                          autoFocus
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveName(etapa.id)}
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveName(etapa.id)}
                          className="flex h-9 items-center justify-center rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground"
                        >
                          Salvar
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className={`flex-1 flex items-center gap-2 px-2 py-1 rounded-lg`}>
                          <span className="font-semibold text-sm text-foreground">{etapa.label}</span>
                          <span className="text-[10px] bg-muted text-muted-foreground px-1.5 rounded-md font-mono">
                            {atendimentos.filter(a => a.etapa === etapa.id).length} negócios
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => { setEtapaEmEdicao(etapa.id); setNovoNome(etapa.label) }}
                          className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
                        >
                          <Edit3 className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteRequest(etapa.id, etapa.label)}
                          className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </>
                    )}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={handleAddEtapa}
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-transparent text-sm font-semibold text-muted-foreground hover:bg-muted/50 transition-colors"
              >
                <Plus className="size-4" />
                Adicionar Etapa
              </button>
            </div>
          )}
        </div>

        {!excluindoEtapa && (
          <div className="border-t border-border p-6 pt-4 bg-card shrink-0">
            <button
              type="button"
              onClick={handleSaveAll}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform active:scale-[0.98]"
            >
              <CheckCircle2 className="size-5" />
              Salvar alterações
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
