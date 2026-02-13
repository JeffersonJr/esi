import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface VisitFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VisitFormModal({ open, onOpenChange }: VisitFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agendar Visita</DialogTitle>
          <DialogDescription>
            Preencha as informações para agendar uma visita ao imóvel.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {/* Form content will go here */}
          <p>Formulário de agendamento de visita</p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button>Agendar Visita</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
