import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import { UnsavedChangesModal } from '@/components/modals/UnsavedChangesModal';

interface LeadFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (lead: any) => void;
  lead?: any;
}

export function LeadFormModal({ open, onClose, onSubmit, lead }: LeadFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    property: '',
    value: '',
    source: '',
    notes: '',
    stage: 'new',
    assignedTo: 'JS'
  });

  useEffect(() => {
    if (lead) {
      const leadData = {
        name: lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        property: lead.property || '',
        value: lead.value || '',
        source: lead.source || '',
        notes: lead.notes || '',
        stage: lead.stage || 'new',
        assignedTo: lead.assignedTo || 'JS'
      };
      setFormData(leadData);
      setOriginalData(leadData);
    } else {
      const emptyData = {
        name: '',
        email: '',
        phone: '',
        property: '',
        value: '',
        source: '',
        notes: '',
        stage: 'new',
        assignedTo: 'JS'
      };
      setFormData(emptyData);
      setOriginalData(emptyData);
    }
  }, [lead, open]);

  const [originalData, setOriginalData] = useState({
    name: '',
    email: '',
    phone: '',
    property: '',
    value: '',
    source: '',
    notes: '',
    stage: 'new',
    assignedTo: 'JS'
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const sources = [
    'Site',
    'Facebook',
    'Instagram',
    'Indicação',
    'Portal Imóveis',
    'Outro'
  ];

  const agents = [
    { id: 'JS', name: 'João Silva' },
    { id: 'MR', name: 'Maria Rocha' },
    { id: 'PC', name: 'Pedro Costa' }
  ];

  const stages = [
    { id: 'new', name: 'Novo Lead' },
    { id: 'contact', name: 'Contato Realizado' },
    { id: 'visit', name: 'Visita Agendada' },
    { id: 'proposal', name: 'Proposta Enviada' },
    { id: 'negotiation', name: 'Negociação' },
    { id: 'closed', name: 'Fechado' }
  ];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{lead ? 'Editar Lead' : 'Novo Lead'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Origem</Label>
                <Select
                  value={formData.source}
                  onValueChange={(value) => handleSelectChange('source', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a origem" />
                  </SelectTrigger>
                  <SelectContent>
                    {sources.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="property">Imóvel de Interesse</Label>
                <Input
                  id="property"
                  name="property"
                  value={formData.property}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Valor</Label>
                <Input
                  id="value"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stage">Estágio</Label>
                <Select
                  value={formData.stage}
                  onValueChange={(value) => handleSelectChange('stage', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o estágio" />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map((stage) => (
                      <SelectItem key={stage.id} value={stage.id}>
                        {stage.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignedTo">Responsável</Label>
                <Select
                  value={formData.assignedTo}
                  onValueChange={(value) => handleSelectChange('assignedTo', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o responsável" />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {lead ? 'Salvar alterações' : 'Adicionar Lead'}
            </Button>
          </DialogFooter>
        </form>
        
        <UnsavedChangesModal
          open={showModal}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
