import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Play, SkipForward, X, Calendar, Clock, MapPin, Users, PhoneCall, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface EventoRoleta {
  id: string
  titulo: string
  cliente: string
  data: string
  horario: string
  duracao: string
  tipo: string
  prioridade: string
  concluida: boolean
}

interface ModoRoletaProps {
  eventos: EventoRoleta[]
  onConcluir: (id: string) => void
  onClose: () => void
}

export function ModoRoleta({ eventos, onConcluir, onClose }: ModoRoletaProps) {
  const pending = eventos.filter(e => !e.concluida)
  const [index, setIndex] = useState(0)
  const [finished, setFinished] = useState(false)
  
  // Efeitos de swipe
  const [swipeExitDirection, setSwipeExitDirection] = useState<'left' | 'right' | null>(null)
  
  const currentEvent = pending[index]

  const nextTask = () => {
    if (index + 1 >= pending.length) {
      setFinished(true)
    } else {
      setIndex(index + 1)
    }
  }

  const handleConcluir = () => {
    setSwipeExitDirection('right')
    setTimeout(() => {
      if (currentEvent) onConcluir(currentEvent.id)
      setSwipeExitDirection(null)
      nextTask()
    }, 300)
  }

  const handlePular = () => {
    setSwipeExitDirection('left')
    setTimeout(() => {
      setSwipeExitDirection(null)
      nextTask()
    }, 300)
  }

  if (pending.length === 0 || finished) {
    return (
      <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-card border border-border shadow-2xl rounded-2xl p-8 max-w-sm w-full text-center"
        >
          <div className="w-20 h-20 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight mb-2">Tudo limpo!</h2>
          <p className="text-muted-foreground mb-8">Você zerou sua fila de atividades para agora.</p>
          <Button size="lg" className="w-full h-12 rounded-xl text-md" onClick={onClose}>
            Voltar para Agenda
          </Button>
        </motion.div>
      </div>
    )
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'visita': return <MapPin className="w-5 h-5" />
      case 'reuniao': return <Users className="w-5 h-5" />
      case 'ligacao': return <PhoneCall className="w-5 h-5" />
      default: return <FileText className="w-5 h-5" />
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
        <Badge variant="secondary" className="px-3 py-1.5 text-sm font-bold shadow-sm">
          Foco Atual
        </Badge>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
            {index + 1} de {pending.length}
          </span>
          <Button variant="ghost" size="icon" className="rounded-full bg-background/50 hover:bg-background" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="w-full max-w-md px-4 relative perspective-[1000px]">
        <AnimatePresence mode="popLayout">
          {currentEvent && !swipeExitDirection && (
            <motion.div
              key={currentEvent.id}
              initial={{ scale: 0.9, opacity: 0, rotateY: 90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ 
                x: swipeExitDirection === 'right' ? 300 : swipeExitDirection === 'left' ? -300 : 0, 
                opacity: 0, 
                rotate: swipeExitDirection === 'right' ? 15 : swipeExitDirection === 'left' ? -15 : 0 
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="w-full"
            >
              <Card className="border-border shadow-2xl overflow-hidden rounded-2xl bg-card">
                <CardHeader className="bg-primary/5 pb-4 border-b border-border/50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-12 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      {getTipoIcon(currentEvent.tipo)}
                    </div>
                    {currentEvent.prioridade === 'alta' && (
                      <Badge className="bg-destructive text-destructive-foreground shadow-sm">
                        Alta Prioridade
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-2xl font-semibold leading-tight mt-2">{currentEvent.titulo}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <Users className="w-4 h-4 text-foreground" />
                      </div>
                      <div>
                        <p className="text-xs tracking-tight font-bold">Cliente</p>
                        <p className="text-sm font-semibold text-foreground">{currentEvent.cliente}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <Calendar className="w-4 h-4 text-foreground" />
                      </div>
                      <div>
                        <p className="text-xs tracking-tight font-bold">Data e Hora</p>
                        <p className="text-sm font-semibold text-foreground">{currentEvent.horario} • {currentEvent.duracao}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/50">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="h-10 rounded-2xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30"
                      onClick={handlePular}
                    >
                      <SkipForward className="w-5 h-5 mr-2" />
                      Pular
                    </Button>
                    <Button 
                      size="lg" 
                      className="h-10 rounded-2xl bg-success hover:bg-success/90 text-white font-bold shadow-lg shadow-success/20"
                      onClick={handleConcluir}
                    >
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Concluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
