import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Building, Home, ArrowRight } from 'lucide-react';

interface ContatoDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  contato: any;
}

const mockImoveisAtrelados = [
  { id: '1', titulo: 'Apartamento 2 Quartos - Centro', tipo: 'Apartamento' },
  { id: '2', titulo: 'Casa 3 Quartos - Jardins', tipo: 'Casa' },
  { id: '3', titulo: 'Cobertura Premium - Moema', tipo: 'Cobertura' },
];

const mockOutrosContatos = [
  { id: '2', nome: 'Carlos Oliveira', tipo: 'Proprietário' },
  { id: '4', nome: 'Ana Costa', tipo: 'Cliente' },
  { id: '5', nome: 'Pedro Souza', tipo: 'Proprietário' },
];

export function ContatoDeleteModal({ open, onClose, onConfirm, contato }: ContatoDeleteModalProps) {
  const [selectedContatoId, setSelectedContatoId] = useState('');
  const [transferRequired, setTransferRequired] = useState(true);

  const handleConfirm = () => {
    if (transferRequired && !selectedContatoId) {
      return;
    }
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Excluir Contato
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Tem certeza que deseja excluir o contato <strong>{contato?.nome}</strong>? 
              Esta ação não pode ser desfeita.
            </AlertDescription>
          </Alert>

          {/* Imóveis Atrelados */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Building className="h-4 w-4" />
              Imóveis Atrelados ({mockImoveisAtrelados.length})
            </h3>
            
            {mockImoveisAtrelados.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Este contato possui imóveis cadastrados. Você precisa transferir os imóveis para outro contato antes de excluí-lo.
                </p>
                
                <div className="border rounded-lg p-3 space-y-2">
                  {mockImoveisAtrelados.map((imovel) => (
                    <div key={imovel.id} className="flex items-center justify-between p-2 bg-muted rounded">
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{imovel.titulo}</span>
                      </div>
                      <Badge variant="secondary">{imovel.tipo}</Badge>
                    </div>
                  ))}
                </div>

                {/* Transferência de Imóveis */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Transferir imóveis para:</label>
                  <Select value={selectedContatoId} onValueChange={setSelectedContatoId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um contato para receber os imóveis..." />
                    </SelectTrigger>
                    <SelectContent>
                      {mockOutrosContatos.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          <div className="flex items-center gap-2">
                            <span>{c.nome}</span>
                            <Badge variant="outline" className="text-xs">{c.tipo}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Este contato não possui imóveis atrelados.
              </p>
            )}
          </div>

          {/* Ações */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {mockImoveisAtrelados.length > 0 && (
                <>
                  <Building className="h-4 w-4" />
                  <span>{mockImoveisAtrelados.length} imóveis serão transferidos</span>
                  {selectedContatoId && (
                    <>
                      <ArrowRight className="h-4 w-4" />
                      <span>
                        {mockOutrosContatos.find(c => c.id === selectedContatoId)?.nome}
                      </span>
                    </>
                  )}
                </>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleConfirm}
                disabled={mockImoveisAtrelados.length > 0 && !selectedContatoId}
              >
                Excluir Contato
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
