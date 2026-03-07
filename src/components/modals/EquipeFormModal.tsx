import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Save, Plus, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import { UnsavedChangesModal } from '@/components/modals/UnsavedChangesModal';
import { useToast } from '@/hooks/use-toast';

interface EquipeFormModalProps {
  open: boolean;
  onClose: () => void;
  equipe?: any;
}

const usuariosDisponiveis = [
  { id: '1', nome: 'João Silva', cargo: 'Corretor', selecionado: false },
  { id: '2', nome: 'Maria Rodrigues', cargo: 'Corretora', selecionado: false },
  { id: '3', nome: 'Pedro Santos', cargo: 'Corretor', selecionado: false },
  { id: '4', nome: 'Ana Costa', cargo: 'Assistente', selecionado: false },
];

export function EquipeFormModal({ open, onClose, equipe }: EquipeFormModalProps) {
  const { toast } = useToast();
  const isEdit = !!equipe;
  const [formData, setFormData] = useState({
    nome: equipe?.nome || '',
    descricao: equipe?.descricao || '',
    cor: equipe?.cor || 'bg-primary',
  });

  const [usuarios, setUsuarios] = useState(usuariosDisponiveis.map(u => ({ ...u, selecionado: false })));

  // Reset form when equipe changes
  useEffect(() => {
    setFormData({ nome: equipe?.nome || '', descricao: equipe?.descricao || '', cor: equipe?.cor || 'bg-primary' });
    setUsuarios(usuariosDisponiveis.map(u => ({ ...u, selecionado: equipe?.membros?.includes(u.nome) || false })));
  }, [equipe, open]);

  const [originalData] = useState({
    nome: '',
    descricao: '',
    cor: 'bg-primary',
  });

  // Check if form has unsaved changes
  const hasUnsavedChanges = JSON.stringify(formData) !== JSON.stringify(originalData) ||
    usuarios.some(u => u.selecionado !== usuariosDisponiveis.find(du => du.id === u.id)?.selecionado);

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

  const toggleUsuario = (id: string) => {
    setUsuarios(usuarios.map(u =>
      u.id === id ? { ...u, selecionado: !u.selecionado } : u
    ));
  };

  const handleSave = () => {
    const selecionados = usuarios.filter(u => u.selecionado);
    console.log('Salvando equipe:', { ...formData, membros: selecionados });

    // Show success toast
    toast({
      title: isEdit ? "Equipe atualizada com sucesso!" : "Equipe criada com sucesso!",
      description: `Equipe "${formData.nome}" foi ${isEdit ? 'atualizada' : 'criada'} com ${selecionados.length} membros.`,
      variant: "success",
    });

    onClose();
  };

  const cores = [
    { value: 'bg-primary', label: 'Azul' },
    { value: 'bg-accent', label: 'Roxo' },
    { value: 'bg-warning', label: 'Laranja' },
    { value: 'bg-success', label: 'Verde' },
  ];

  const corStyles: Record<string, string> = { 'bg-primary': 'bg-primary', 'bg-accent': 'bg-accent', 'bg-warning': 'bg-warning', 'bg-success': 'bg-success' };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 border-none shadow-2xl">
        {/* Gradient Header */}
        <div className={cn('p-6 flex items-center gap-4', formData.cor)}>
          <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center">
            <Users className="h-6 w-6 text-white" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-white text-xl font-black">{isEdit ? 'Editar Equipe' : 'Nova Equipe'}</DialogTitle>
            <p className="text-white/70 text-sm">{isEdit ? `Editando ${equipe?.nome}` : 'Configure a nova equipe de vendas'}</p>
          </DialogHeader>
        </div>
        <div className="p-6">

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label>Nome da Equipe*</Label>
                  <Input
                    placeholder="Ex: Vendas Centro, Equipe Lançamentos..."
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Textarea
                    placeholder="Breve descrição sobre a equipe..."
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Cor da Equipe</Label>
                  <div className="flex gap-3">
                    {cores.map((cor) => (
                      <button
                        key={cor.value}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md border-2 transition-all ${formData.cor === cor.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                          }`}
                        onClick={() => setFormData({ ...formData, cor: cor.value })}
                      >
                        <div className={`w-4 h-4 ${cor.value} rounded-full`} />
                        <span className="text-sm">{cor.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Membros da Equipe</Label>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2"
                    onClick={() => { /* Navigate to Usuários to add new members */ }}
                  >
                    <Plus className="h-4 w-4" />
                    Criar Novo Usuário
                  </Button>
                </div>

                <div className="space-y-2">
                  {usuarios.map((usuario) => (
                    <div
                      key={usuario.id}
                      className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all cursor-pointer ${usuario.selecionado
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                        }`}
                      onClick={() => toggleUsuario(usuario.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className={usuario.selecionado ? 'bg-gradient-primary text-primary-foreground' : 'bg-muted'}>
                            {usuario.nome.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{usuario.nome}</div>
                          <div className="text-sm text-muted-foreground">{usuario.cargo}</div>
                        </div>
                      </div>
                      {usuario.selecionado && (
                        <Badge className="bg-primary">Selecionado</Badge>
                      )}
                    </div>
                  ))}
                </div>

                <div className="text-sm text-muted-foreground">
                  {usuarios.filter(u => u.selecionado).length} usuário(s) selecionado(s)
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button onClick={handleSave} className="flex-1 gap-2 shadow-lg shadow-primary/20">
                <Save className="h-4 w-4" />
                {isEdit ? 'Salvar Alterações' : 'Criar Equipe'}
              </Button>
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
            </div>
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
