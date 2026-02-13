import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DELETE_REASONS, DeleteReason } from '@/types/lead';

interface DeleteReasonModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: DeleteReason, customReason?: string) => void;
  leadName: string;
}

export function DeleteReasonModal({
  open,
  onClose,
  onConfirm,
  leadName,
}: DeleteReasonModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>('duplicate');
  const [customReason, setCustomReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    const reason = DELETE_REASONS.find(r => r.id === selectedReason);
    if (!reason) return;

    setIsSubmitting(true);
    try {
      await onConfirm(reason, selectedReason === 'other' ? customReason : undefined);
      onClose();
      // Reset form
      setSelectedReason('duplicate');
      setCustomReason('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedReasonObj = DELETE_REASONS.find(r => r.id === selectedReason);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Excluir Lead</DialogTitle>
          <DialogDescription>
            Você está excluindo o lead <strong>{leadName}</strong>. 
            Por favor, informe o motivo da exclusão para registro no histórico.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="reason">Motivo da Exclusão</Label>
            <RadioGroup
              value={selectedReason}
              onValueChange={setSelectedReason}
              className="mt-2"
            >
              {DELETE_REASONS.map((reason) => (
                <div key={reason.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={reason.id} id={reason.id} />
                  <Label htmlFor={reason.id} className="flex-1 cursor-pointer">
                    <div>{reason.label}</div>
                    {reason.description && (
                      <div className="text-sm text-muted-foreground">
                        {reason.description}
                      </div>
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {selectedReason === 'other' && (
            <div>
              <Label htmlFor="customReason">Descreva o motivo</Label>
              <Input
                id="customReason"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Digite o motivo da exclusão..."
                className="mt-1"
              />
            </div>
          )}

          {selectedReasonObj && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Atenção:</strong> O lead será movido para a lixeira e ficará disponível para resgate por 30 dias. 
                Após esse período, será excluído permanentemente.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isSubmitting || (selectedReason === 'other' && !customReason.trim())}
          >
            {isSubmitting ? 'Excluindo...' : 'Confirmar Exclusão'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
