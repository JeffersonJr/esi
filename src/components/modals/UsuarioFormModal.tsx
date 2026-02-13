import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Save, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import { UnsavedChangesModal } from '@/components/modals/UnsavedChangesModal';

interface UsuarioFormModalProps {
  open: boolean;
  onClose: () => void;
  usuario?: any;
  onSave?: (usuario: any) => void;
}

export function UsuarioFormModal({ open, onClose, usuario, onSave }: UsuarioFormModalProps) {
  const isEdit = !!usuario;
  
  const [formData, setFormData] = useState({
    nome: usuario?.nome || '',
    email: usuario?.email || '',
    cargo: usuario?.cargo || '',
    nivel: usuario?.nivel || 'Normal',
    status: usuario?.status || 'Ativo',
  });

  const [originalData] = useState({
    nome: usuario?.nome || '',
    email: usuario?.email || '',
    cargo: usuario?.cargo || '',
    nivel: usuario?.nivel || 'Normal',
    status: usuario?.status || 'Ativo',
  });

  // Check if form has unsaved changes
  const hasUnsavedChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

  const {
    showModal,
    confirmNavigation,
    handleConfirm,
    handleCancel
  } = useUnsavedChanges({ hasUnsavedChanges });

  const handleClose = () => {
    if (confirmNavigation('')) {
      onClose();
    }
  };

  const handleSave = () => {
    const usuarioData = {
      ...formData,
      id: usuario?.id || Math.random().toString(36).substring(7),
    };
    
    if (onSave) {
      onSave(usuarioData);
    } else {
      // Fallback for backwards compatibility
      if (isEdit) {
        console.log('Atualizando usuário:', formData);
        alert('Usuário atualizado com sucesso!');
      } else {
        console.log('Criando usuário:', formData);
        const linkConvite = `https://seucrm.com.br/convite/${Math.random().toString(36).substring(7)}`;
        alert(`Usuário criado! Link de convite enviado para ${formData.email}\n\nLink: ${linkConvite}`);
      }
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome Completo*</Label>
                  <Input
                    placeholder="Nome do usuário"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email*</Label>
                  <Input
                    type="email"
                    placeholder="email@exemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cargo</Label>
                  <Input
                    placeholder="Ex: Corretor, Assistente"
                    value={formData.cargo}
                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nível de Acesso*</Label>
                  <select
                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                    value={formData.nivel}
                    onChange={(e) => setFormData({ ...formData, nivel: e.target.value })}
                  >
                    <option value="Normal">Normal</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              {isEdit && (
                <div className="space-y-2">
                  <Label>Status</Label>
                  <select
                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                  </select>
                </div>
              )}

              {!isEdit && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <div className="flex items-start gap-2">
                    <Send className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium mb-1">Convite por Email</div>
                      <p className="text-sm text-muted-foreground">
                        Um email será enviado para {formData.email || 'o usuário'} com um link para definir a senha e acessar o sistema.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button onClick={handleSave} className="flex-1 gap-2">
              {isEdit ? (
                <>
                  <Save className="h-4 w-4" />
                  Salvar Alterações
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Criar e Enviar Convite
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancelar
            </Button>
          </div>
        </div>
        
        <UnsavedChangesModal
          open={showModal}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
