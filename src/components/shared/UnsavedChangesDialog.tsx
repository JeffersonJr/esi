import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface UnsavedChangesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinueEditing: () => void;
  onExitWithoutSaving: () => void;
  title?: string;
  description?: string;
  continueButtonText?: string;
  exitButtonText?: string;
}

export function UnsavedChangesDialog({
  open,
  onOpenChange,
  onContinueEditing,
  onExitWithoutSaving,
  title = "Alterações não salvas",
  description = "Você tem alterações não salvas. Deseja continuar editando ou sair sem salvar?",
  continueButtonText = "Continuar Editando",
  exitButtonText = "Sair sem Salvar"
}: UnsavedChangesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-sm text-orange-800">
              <strong>Atenção:</strong> Se você sair sem salvar, todas as alterações serão perdidas.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onContinueEditing}>
            {continueButtonText}
          </Button>
          <Button variant="destructive" onClick={onExitWithoutSaving}>
            {exitButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
