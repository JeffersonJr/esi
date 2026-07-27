import { useState } from 'react'
import { Check, ChevronDown, ChevronUp, X } from 'lucide-react'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// ─── Types ───────────────────────────────────────────────────────────────────

export type FiltrosAvancadosImoveis = {
  statuses: string[]
  purpose: string       // 'Qualquer' | 'Venda' | 'Locação'
  finality: string      // 'Todas' | 'Residencial' | 'Comercial' | 'Industrial' | 'Rural'
  types: string[]       // Apartamento, Casa, Terreno, ...
  cities: string[]
  neighborhoods: string[]
  dormCount: string     // 'Qualquer' | '1' | '2' | '3' | '4+'
  suitCount: string
  carGarageCount: string
  minPrice: string
  maxPrice: string
  minArea: string
  maxArea: string
  features: string[]    // Piscina, Churrasqueira, ...
  code: string
  searchName: string
}

export const defaultFiltrosImoveis: FiltrosAvancadosImoveis = {
  statuses: [],
  purpose: 'Qualquer',
  finality: 'Todas',
  types: [],
  cities: [],
  neighborhoods: [],
  dormCount: 'Qualquer',
  suitCount: 'Qualquer',
  carGarageCount: 'Qualquer',
  minPrice: '',
  maxPrice: '',
  minArea: '',
  maxArea: '',
  features: [],
  code: '',
  searchName: '',
}

export function countFiltrosAtivos(f: FiltrosAvancadosImoveis): number {
  let count = 0
  if (f.statuses.length > 0) count++
  if (f.purpose !== 'Qualquer') count++
  if (f.finality !== 'Todas') count++
  if (f.types.length > 0) count++
  if (f.cities.length > 0) count++
  if (f.neighborhoods.length > 0) count++
  if (f.dormCount !== 'Qualquer') count++
  if (f.suitCount !== 'Qualquer') count++
  if (f.carGarageCount !== 'Qualquer') count++
  if (f.minPrice || f.maxPrice) count++
  if (f.minArea || f.maxArea) count++
  if (f.features.length > 0) count++
  if (f.code) count++
  return count
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="border-b border-border/50 py-4 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between text-left mb-1"
      >
        <h3 className="text-[11px] font-bold tracking-tight text-muted-foreground">{title}</h3>
        {open
          ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
          : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
      </button>
      {open && (
        <div className="mt-3 flex flex-col gap-3 animate-in fade-in slide-in-from-top-1">
          {children}
        </div>
      )}
    </div>
  )
}

function ChipGroup({
  options, value, onChange, multi = false,
}: {
  options: string[]
  value: string | string[]
  onChange: (v: string | string[]) => void
  multi?: boolean
}) {
  const isActive = (opt: string) =>
    multi ? (value as string[]).includes(opt) : value === opt

  const toggle = (opt: string) => {
    if (!multi) {
      onChange(isActive(opt) ? '' : opt)
      return
    }
    const arr = value as string[]
    onChange(isActive(opt) ? arr.filter(v => v !== opt) : [...arr, opt])
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={cn(
            'flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-all',
            isActive(opt)
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground'
          )}
        >
          {isActive(opt) && <Check className="h-3 w-3" />}
          {opt}
        </button>
      ))}
    </div>
  )
}

function CounterGroup({
  options, value, onChange,
}: {
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex gap-1.5">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(value === opt ? 'Qualquer' : opt)}
          className={cn(
            'h-9 min-w-[2.5rem] rounded-xl border px-3 text-sm font-semibold transition-all flex-1',
            value === opt
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-background text-muted-foreground hover:border-primary/40'
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

interface FiltrosImoveisSheetProps {
  open: boolean
  filtrosAtuais: FiltrosAvancadosImoveis
  onApply: (f: FiltrosAvancadosImoveis) => void
  onClose: () => void
}

export function FiltrosImoveisSheet({ open, filtrosAtuais, onApply, onClose }: FiltrosImoveisSheetProps) {
  const [f, setF] = useState<FiltrosAvancadosImoveis>(filtrosAtuais)

  const update = <K extends keyof FiltrosAvancadosImoveis>(key: K, value: FiltrosAvancadosImoveis[K]) =>
    setF(prev => ({ ...prev, [key]: value }))

  const handleApply = () => {
    onApply(f)
    onClose()
  }

  const handleReset = () => {
    setF(defaultFiltrosImoveis)
  }

  const ativos = countFiltrosAtivos(f)

  const applyMoneyMask = (v: string) => {
    const digits = v.replace(/\D/g, '')
    if (!digits) return ''
    const num = Number(digits) / 100
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  return (
    <Sheet open={open} onOpenChange={v => !v && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0 gap-0">
        <SheetHeader className="px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SheetTitle className="text-lg font-bold">Filtros Avançados</SheetTitle>
              {ativos > 0 && (
                <Badge variant="default" className="text-xs">{ativos}</Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {ativos > 0 && (
                <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs h-8 text-muted-foreground mr-6">
                  Limpar tudo
                </Button>
              )}
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6">
          {/* Status */}
          <Section title="Status">
            <ChipGroup
              multi
              options={['Disponível', 'Reservado', 'Vendido', 'Locado', 'Em Reforma']}
              value={f.statuses}
              onChange={v => update('statuses', v as string[])}
            />
          </Section>

          {/* Finalidade */}
          <Section title="Finalidade">
            <ChipGroup
              options={['Todas', 'Residencial', 'Comercial', 'Industrial', 'Rural']}
              value={f.finality}
              onChange={v => update('finality', v as string)}
            />
          </Section>

          {/* Propósito */}
          <Section title="Propósito">
            <ChipGroup
              options={['Qualquer', 'Venda', 'Locação']}
              value={f.purpose}
              onChange={v => update('purpose', v as string)}
            />
          </Section>

          {/* Tipo */}
          <Section title="Tipo de Imóvel">
            <ChipGroup
              multi
              options={['Apartamento', 'Casa', 'Cobertura', 'Terreno', 'Sala Comercial', 'Galpão', 'Sítio']}
              value={f.types}
              onChange={v => update('types', v as string[])}
            />
          </Section>

          {/* Dormitórios */}
          <Section title="Dormitórios">
            <CounterGroup
              options={['1', '2', '3', '4+']}
              value={f.dormCount}
              onChange={v => update('dormCount', v)}
            />
          </Section>

          {/* Suítes */}
          <Section title="Suítes">
            <CounterGroup
              options={['1', '2', '3', '4+']}
              value={f.suitCount}
              onChange={v => update('suitCount', v)}
            />
          </Section>

          {/* Vagas */}
          <Section title="Vagas de Garagem">
            <CounterGroup
              options={['1', '2', '3', '4+']}
              value={f.carGarageCount}
              onChange={v => update('carGarageCount', v)}
            />
          </Section>

          {/* Preço */}
          <Section title="Faixa de Preço">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Mínimo</Label>
                <Input
                  placeholder="R$ 0,00"
                  value={f.minPrice}
                  onChange={e => update('minPrice', applyMoneyMask(e.target.value))}
                  className="h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Máximo</Label>
                <Input
                  placeholder="R$ 0,00"
                  value={f.maxPrice}
                  onChange={e => update('maxPrice', applyMoneyMask(e.target.value))}
                  className="h-10"
                />
              </div>
            </div>
          </Section>

          {/* Área */}
          <Section title="Área (m²)">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Mínimo</Label>
                <Input
                  placeholder="Ex: 50"
                  value={f.minArea}
                  onChange={e => update('minArea', e.target.value.replace(/\D/g, ''))}
                  className="h-10"
                  inputMode="numeric"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Máximo</Label>
                <Input
                  placeholder="Ex: 300"
                  value={f.maxArea}
                  onChange={e => update('maxArea', e.target.value.replace(/\D/g, ''))}
                  className="h-10"
                  inputMode="numeric"
                />
              </div>
            </div>
          </Section>

          {/* Características */}
          <Section title="Características">
            <ChipGroup
              multi
              options={['Piscina', 'Churrasqueira', 'Academia', 'Portaria 24h', 'Pet Friendly', 'Sacada', 'Mobiliado', 'Lazer Completo', 'Elevador']}
              value={f.features}
              onChange={v => update('features', v as string[])}
            />
          </Section>

          {/* Código */}
          <Section title="Código do Imóvel">
            <Input
              placeholder="Ex: IM-1042"
              value={f.code}
              onChange={e => update('code', e.target.value)}
              className="h-10"
            />
          </Section>
        </div>

        <SheetFooter className="px-6 py-4 border-t border-border shrink-0">
          <div className="flex gap-3 w-full">
            <Button variant="outline" onClick={handleReset} className="flex-1">
              Limpar Filtros
            </Button>
            <Button onClick={handleApply} className="flex-1">
              Aplicar {ativos > 0 && `(${ativos})`}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
