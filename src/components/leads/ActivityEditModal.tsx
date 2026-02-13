import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ActivityEditModalProps {
  open: boolean;
  onClose: () => void;
  activity?: {
    id: string;
    tipo: string;
    data: string;
    descricao: string;
    usuario: string;
    proximoPasso?: string;
  };
  onSave: (activity: {
    id: string;
    tipo: string;
    data: string;
    descricao: string;
    usuario: string;
    proximoPasso?: string;
  }) => void;
}

export const ActivityEditModal: React.FC<ActivityEditModalProps> = ({
  open,
  onClose,
  activity,
  onSave
}) => {
  const [formData, setFormData] = useState({
    tipo: activity?.tipo || 'ligacao',
    data: activity?.data || new Date().toISOString().split('T')[0],
    descricao: activity?.descricao || '',
    usuario: activity?.usuario || '',
    proximoPasso: activity?.proximoPasso || ''
  });

  const handleSave = () => {
    onSave({
      ...activity,
      ...formData,
      data: new Date(formData.data).toISOString()
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Atividade</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tipo">Tipo</Label>
              <Select value={formData.tipo} onValueChange={(value) => setFormData({...formData, tipo: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ligacao">Ligação</SelectItem>
                  <SelectItem value="email">E-mail</SelectItem>
                  <SelectItem value="visita">Visita</SelectItem>
                  <SelectItem value="proposta">Proposta</SelectItem>
                  <SelectItem value="reuniao">Reunião</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="followup">Follow-up</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="data">Data</Label>
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({...formData, data: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({...formData, descricao: e.target.value})}
              rows={3}
              placeholder="Descreva a atividade..."
            />
          </div>
          
          <div>
            <Label htmlFor="usuario">Usuário</Label>
            <Input
              id="usuario"
              value={formData.usuario}
              onChange={(e) => setFormData({...formData, usuario: e.target.value})}
              placeholder="Nome do usuário"
            />
          </div>
          
          <div>
            <Label htmlFor="proximoPasso">Próximo Passo</Label>
            <Textarea
              id="proximoPasso"
              value={formData.proximoPasso}
              onChange={(e) => setFormData({...formData, proximoPasso: e.target.value})}
              rows={2}
              placeholder="Descreva o próximo passo a ser tomado..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar Atividade
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
