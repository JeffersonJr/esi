import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogIn, LogOut, MapPin, CheckCircle2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'

export function CheckinWidget() {
  const { toast } = useToast()
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    // Check localStorage on mount
    const saved = localStorage.getItem('esi_checkin')
    if (saved) setIsCheckedIn(saved === 'true')

    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }))
    }
    updateTime()
    const timer = setInterval(updateTime, 60000)
    return () => clearInterval(timer)
  }, [])

  const handleAction = () => {
    setShowModal(true)
  }

  const confirmAction = () => {
    setIsLoading(true)
    // Simulate API call and geofencing verification
    setTimeout(() => {
      setIsLoading(false)
      const newState = !isCheckedIn
      setIsCheckedIn(newState)
      localStorage.setItem('esi_checkin', String(newState))
      setShowModal(false)
      
      toast({
        title: newState ? "Check-in realizado" : "Check-out realizado",
        description: newState 
          ? "Você entrou no rodízio de atendimento e está visível na roleta."
          : "Seu plantão foi encerrado.",
        variant: "default",
      })
    }, 1500)
  }

  return (
    <>
      <Button
        variant="outline"
        className={`h-9 px-3 gap-2 border shadow-sm transition-all ${
          isCheckedIn 
            ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400' 
            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'
        }`}
        onClick={handleAction}
      >
        <div className="relative flex h-2.5 w-2.5 items-center justify-center">
          {isCheckedIn && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          )}
          <span className={`relative inline-flex h-2 w-2 rounded-full ${isCheckedIn ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
        </div>
        <span className="text-xs font-bold whitespace-nowrap">
          {isCheckedIn ? 'Em Plantão' : 'Fazer Check-in'}
        </span>
      </Button>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[425px] overflow-hidden p-0 border-0 shadow-2xl rounded-2xl">
          <div className="p-6">
            <DialogHeader className="mb-6 text-center">
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                isCheckedIn ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
              }`}>
                {isCheckedIn ? <LogOut className="h-8 w-8" /> : <LogIn className="h-8 w-8" />}
              </div>
              <DialogTitle className="text-2xl font-black text-slate-800">
                {isCheckedIn ? 'Encerrar Plantão' : 'Iniciar Plantão'}
              </DialogTitle>
              <p className="text-slate-500 mt-2 text-sm px-4">
                {isCheckedIn 
                  ? 'Você será removido da roleta de atendimento presencial.' 
                  : 'Para entrar no rodízio de atendimento, precisamos confirmar sua localização no plantão.'}
              </p>
            </DialogHeader>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3 mb-6">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-slate-500">
                  <Clock className="w-4 h-4 mr-2" /> Horário atual
                </div>
                <span className="font-bold text-slate-700">{currentTime}</span>
              </div>
              {!isCheckedIn && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-slate-500">
                    <MapPin className="w-4 h-4 mr-2" /> Localização
                  </div>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Verificada
                  </Badge>
                </div>
              )}
            </div>

            <DialogFooter className="flex gap-2 sm:justify-center">
              <Button 
                variant="outline" 
                onClick={() => setShowModal(false)}
                className="w-full rounded-xl h-12"
              >
                Cancelar
              </Button>
              <Button 
                onClick={confirmAction}
                disabled={isLoading}
                className={`w-full rounded-xl h-12 font-bold ${
                  isCheckedIn 
                    ? 'bg-rose-500 hover:bg-rose-600' 
                    : 'bg-emerald-500 hover:bg-emerald-600'
                } text-white`}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  isCheckedIn ? 'Confirmar Check-out' : 'Confirmar Check-in'
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
