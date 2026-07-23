import { useState, useCallback, useEffect } from 'react'
import { FunilDef, EtapaFunil, DEFAULT_FUNIS } from '@/types/funil'

const STORAGE_KEY = 'esi_funis_v1'

function loadFunis(): FunilDef[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return DEFAULT_FUNIS
}

function saveFunis(funis: FunilDef[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(funis))
  } catch {}
}

export function useFunis() {
  const [funis, setFunis] = useState<FunilDef[]>(() => loadFunis())
  const [funilAtivoId, setFunilAtivoId] = useState<string>(() => {
    try {
      return localStorage.getItem('esi_funil_ativo') || 'principal'
    } catch {
      return 'principal'
    }
  })

  useEffect(() => {
    saveFunis(funis)
  }, [funis])

  useEffect(() => {
    try {
      localStorage.setItem('esi_funil_ativo', funilAtivoId)
    } catch {}
  }, [funilAtivoId])

  const funilAtivo = funis.find(f => f.id === funilAtivoId) ?? funis[0]

  const criarFunil = useCallback((nome: string, descricao = '') => {
    const id = `funil-${Date.now()}`
    const novo: FunilDef = {
      id,
      nome,
      descricao,
      cor: 'bg-primary text-primary-foreground',
      etapas: [
        { id: 'new', title: 'Novo Lead', color: 'bg-primary/10 text-primary border-primary/20' },
        { id: 'contact', title: 'Em Contato', color: 'bg-accent/10 text-accent border-accent/20' },
        { id: 'closed', title: 'Fechado', color: 'bg-success/10 text-success border-success/20' },
        { id: 'lost', title: 'Perdido', color: 'bg-destructive/10 text-destructive border-destructive/20' },
      ],
    }
    setFunis(prev => [...prev, novo])
    setFunilAtivoId(id)
    return id
  }, [])

  const atualizarFunil = useCallback((funilAtualizado: FunilDef, transferencias?: Record<string, string>) => {
    setFunis(prev => prev.map(f => f.id === funilAtualizado.id ? funilAtualizado : f))
    // Return transferencias so caller can update leads
    return transferencias
  }, [])

  const excluirFunil = useCallback((id: string) => {
    setFunis(prev => {
      const restantes = prev.filter(f => f.id !== id)
      if (funilAtivoId === id && restantes.length > 0) {
        setFunilAtivoId(restantes[0].id)
      }
      return restantes
    })
  }, [funilAtivoId])

  const adicionarEtapa = useCallback((funilId: string, etapa: Omit<EtapaFunil, 'id'>) => {
    const id = `etapa-${Date.now()}`
    setFunis(prev => prev.map(f =>
      f.id === funilId
        ? { ...f, etapas: [...f.etapas, { ...etapa, id }] }
        : f
    ))
    return id
  }, [])

  return {
    funis,
    funilAtivo,
    funilAtivoId,
    setFunilAtivoId,
    criarFunil,
    atualizarFunil,
    excluirFunil,
    adicionarEtapa,
  }
}
