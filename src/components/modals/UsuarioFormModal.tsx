import { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Save, Send, Shield, Briefcase } from 'lucide-react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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

  const getInitial = () => ({
    nome: usuario?.nome || '',
    email: usuario?.email || '',
    cargo: usuario?.cargo || '',
    nivel: usuario?.nivel || 'Normal',
    status: usuario?.status || 'Ativo',
  });

  const [formData, setFormData] = useState(getInitial);
  const [originalData] = useState(getInitial);

  useEffect(() => {
    setFormData(getInitial());
  }, [usuario]);

  const hasUnsavedChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

  const { showModal, confirmNavigation, handleConfirm, handleCancel } = useUnsavedChanges({ hasUnsavedChanges });

  const handleClose = () => {
    if (confirmNavigation('')) onClose();
  };

  const handleSave = () => {
    if (!formData.nome || !formData.email) return;
    const usuarioData = { ...formData, id: usuario?.id || Math.random().toString(36).substring(7) };
    if (onSave) onSave(usuarioData);
    else onClose();
  };

  const initials = formData.nome.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg p-0 overflow-hidden border-none shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 p-6 flex items-center gap-4">
          <Avatar className="h-14 w-14 border-2 border-white/20 shadow-lg">
            <AvatarFallback className="bg-white/10 text-white text-lg font-black">{initials}</AvatarFallback>
          </Avatar>
          <DialogHeader>
            <DialogTitle className="text-white text-xl font-black">{isEdit ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
            <p className="text-white/70 text-sm">{isEdit ? `Atualizando dados de ${usuario?.nome}` : 'Preencha as informações do novo usuário'}</p>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-5">
          {/* Dados Pessoais */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <span className="w-4 h-[2px] bg-primary inline-block" /> Dados Pessoais
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Nome Completo *</Label>
                <Input
                  placeholder="Nome do usuário"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email *</Label>
                <Input
                  type="email"
                  placeholder="email@empresa.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cargo</Label>
                <Input
                  placeholder="Ex: Corretor, Assistente"
                  value={formData.cargo}
                  onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Permissões */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <span className="w-4 h-[2px] bg-primary inline-block" /> Permissões e Acesso
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Shield className="h-3 w-3" /> Nível de Acesso *
                </Label>
                <Select value={formData.nivel} onValueChange={(v) => setFormData({ ...formData, nivel: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Normal">Corretor / Normal</SelectItem>
                    <SelectItem value="Admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {isEdit && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          {/* Invite notice for new users */}
          {!isEdit && (
            <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl flex items-start gap-3">
              <Send className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-bold text-sm mb-0.5">Convite por Email</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Um link de acesso será enviado para{' '}
                  <span className="font-bold text-foreground">{formData.email || 'o usuário'}</span>{' '}
                  para que ele defina sua senha e acesse o sistema.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <Button onClick={handleSave} className="flex-1 gap-2 font-bold shadow-lg shadow-primary/20" disabled={!formData.nome || !formData.email}>
            {isEdit ? <><Save className="h-4 w-4" /> Salvar Alterações</> : <><Send className="h-4 w-4" /> Criar e Enviar Convite</>}
          </Button>
          <Button variant="outline" onClick={handleClose} className="font-bold">Cancelar</Button>
        </div>

        <UnsavedChangesModal open={showModal} onConfirm={handleConfirm} onCancel={handleCancel} />
      </DialogContent>
    </Dialog>
  );
}
