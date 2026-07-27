import { useState } from 'react'
import { Edit3, GripVertical, Plus, Trash2, X, CheckCircle2 } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { FunilDef, EtapaFunil } from '@/types/funil'

interface GerenciarFunilSheetProps {
  open: boolean
  onClose: () => void
  funil: FunilDef
  leadsCount: Record<string, number> // etapaId -> count
  onSave: (funilAtualizado: FunilDef, transferencias: Record<string, string>) => void
  onExcluir?: () => void
  totalFunis: number
}

export function GerenciarFunilSheet({
  open,
  onClose,
  funil,
  leadsCount,
  onSave,
  onExcluir,
  totalFunis,
}: GerenciarFunilSheetProps) {
  const [nome, setNome] = useState(funil.nome)
  const [descricao, setDescricao] = useState(funil.descricao)
  const [etapas, setEtapas] = useState<EtapaFunil[]>(funil.etapas)
  const [etapaEmEdicao, setEtapaEmEdicao] = useState<string | null>(null)
  const [novoNome, setNovoNome] = useState('')
  const [excluindoEtapa, setExcluindoEtapa] = useState<{ id: string; title: string } | null>(null)
  const [etapaDestinoId, setEtapaDestinoId] = useState('')
  const [transferencias, setTransferencias] = useState<Record<string, string>>({})

  const handleAddEtapa = () => {
    const newId = `etapa-${Date.now()}`
    const nova: EtapaFunil = {
      id: newId,
      title: 'Nova Etapa',
      color: 'bg-muted text-muted-foreground border border-border',
    }
    setEtapas(prev => [...prev, nova])
    setEtapaEmEdicao(newId)
    setNovoNome('Nova Etapa')
  }

  const handleSaveName = (id: string) => {
    if (!novoNome.trim()) return
    setEtapas(prev => prev.map(e => e.id === id ? { ...e, title: novoNome.trim() } : e))
    setEtapaEmEdicao(null)
  }

  const handleDeleteRequest = (id: string, title: string) => {
    const count = leadsCount[id] ?? 0
    if (count > 0) {
      setExcluindoEtapa({ id, title })
      const possible = etapas.filter(e => e.id !== id)
      if (possible.length > 0) setEtapaDestinoId(possible[0].id)
    } else {
      setEtapas(prev => prev.filter(e => e.id !== id))
    }
  }

  const confirmDelete = () => {
    if (!excluindoEtapa || !etapaDestinoId) return
    setTransferencias(prev => ({ ...prev, [excluindoEtapa.id]: etapaDestinoId }))
    setEtapas(prev => prev.filter(e => e.id !== excluindoEtapa.id))
    setExcluindoEtapa(null)
  }

  const moveEtapa = (idx: number, dir: 'up' | 'down') => {
    const next = [...etapas]
    const target = dir === 'up' ? idx - 1 : idx + 1
    if (target < 0 || target >= next.length) return
    ;[next[idx], next[target]] = [next[target], next[idx]]
    setEtapas(next)
  }

  const handleSave = () => {
    onSave({ ...funil, nome, descricao, etapas }, transferencias)
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={v => !v && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0 gap-0">
        <SheetHeader className="px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-lg font-bold">Gerenciar Funil</SheetTitle>
              <p className="text-xs text-muted-foreground mt-0.5">{funil.nome}</p>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Nome e Descrição */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold tracking-tight text-muted-foreground">Informações do Funil</h3>
            <div className="space-y-1.5">
              <Label className="text-xs">Nome do Funil</Label>
              <Input
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Ex: Funil de Locações"
                className="h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Descrição (opcional)</Label>
              <Input
                value={descricao}
                onChange={e => setDescricao(e.target.value)}
                placeholder="Ex: Para contratos de locação"
                className="h-10"
              />
            </div>
          </div>

          {/* Etapas */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold tracking-tight text-muted-foreground">Colunas do Kanban</h3>
            <p className="text-xs text-muted-foreground -mt-2">
              Adicione, renomeie ou remova colunas. Arraste para reordenar.
            </p>

            {/* Delete with transfer warning */}
            {excluindoEtapa && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 space-y-3 animate-in fade-in">
                <p className="text-sm font-semibold text-destructive">Excluir "{excluindoEtapa.title}"</p>
                <p className="text-xs text-muted-foreground">
                  Existem {leadsCount[excluindoEtapa.id] ?? 0} leads nesta coluna. Mova-os para:
                </p>
                <Select value={etapaDestinoId} onValueChange={setEtapaDestinoId}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Selecione a coluna destino" />
                  </SelectTrigger>
                  <SelectContent>
                    {etapas
                      .filter(e => e.id !== excluindoEtapa.id)
                      .map(e => (
                        <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => setExcluindoEtapa(null)}>
                    Cancelar
                  </Button>
                  <Button variant="destructive" size="sm" className="flex-1" onClick={confirmDelete}>
                    Confirmar
                  </Button>
                </div>
              </div>
            )}

            <ul className="space-y-2">
              {etapas.map((etapa, idx) => (
                <li
                  key={etapa.id}
                  className="flex items-center gap-2 rounded-xl border border-border bg-card p-3 shadow-card"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground/40 shrink-0 cursor-grab" />

                  {etapaEmEdicao === etapa.id ? (
                    <div className="flex flex-1 items-center gap-2">
                      <Input
                        value={novoNome}
                        onChange={e => setNovoNome(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSaveName(etapa.id)}
                        className="h-8 flex-1 text-sm"
                        autoFocus
                      />
                      <Button size="sm" className="h-8 px-3 text-xs" onClick={() => handleSaveName(etapa.id)}>
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> OK
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 flex items-center gap-2 min-w-0">
                        <span className="font-medium text-sm truncate">{etapa.title}</span>
                        {(leadsCount[etapa.id] ?? 0) > 0 && (
                          <Badge variant="secondary" className="text-[10px] font-mono shrink-0">
                            {leadsCount[etapa.id]}
                          </Badge>
                        )}
                      </div>

                      {/* Move buttons */}
                      <div className="flex gap-0.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => moveEtapa(idx, 'up')}
                          disabled={idx === 0}
                          className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:bg-muted disabled:opacity-30"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveEtapa(idx, 'down')}
                          disabled={idx === etapas.length - 1}
                          className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:bg-muted disabled:opacity-30"
                        >
                          ↓
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => { setEtapaEmEdicao(etapa.id); setNovoNome(etapa.title) }}
                        className="h-7 w-7 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted shrink-0"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteRequest(etapa.id, etapa.title)}
                        className="h-7 w-7 flex items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive shrink-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={handleAddEtapa}
              className={cn(
                'mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-xl',
                'border-2 border-dashed border-border bg-transparent',
                'text-sm font-medium text-muted-foreground',
                'hover:bg-muted/50 hover:border-primary/30 hover:text-foreground transition-colors'
              )}
            >
              <Plus className="h-4 w-4" /> Adicionar Coluna
            </button>
          </div>

          {/* Excluir funil */}
          {onExcluir && totalFunis > 1 && (
            <div className="pt-2 border-t border-border">
              <button
                type="button"
                onClick={onExcluir}
                className="text-xs text-destructive hover:underline font-medium"
              >
                Excluir este funil
              </button>
            </div>
          )}
        </div>

        <SheetFooter className="px-6 py-4 border-t border-border shrink-0">
          <div className="flex gap-3 w-full">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Salvar Alterações
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
