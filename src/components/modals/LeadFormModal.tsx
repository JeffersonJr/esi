import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import { UnsavedChangesModal } from '@/components/modals/UnsavedChangesModal';
import { X, Plus, Mail, Phone, Smartphone } from 'lucide-react';

interface ContactInfo {
  type: 'email' | 'phone' | 'mobile';
  value: string;
  isPrimary?: boolean;
}

interface LeadData {
  name: string;
  emails: ContactInfo[];
  phones: ContactInfo[];
  property: string;
  value: string;
  source: string;
  notes: string;
  stage: string;
  assignedTo: string;
  tags: string[];
}

interface LeadFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (lead: LeadData) => void;
  lead?: LeadData;
}

export function LeadFormModal({ open, onClose, onSubmit, lead }: LeadFormModalProps) {
  const [formData, setFormData] = useState<LeadData>({
    name: '',
    emails: [{ type: 'email', value: '', isPrimary: true }],
    phones: [{ type: 'phone', value: '', isPrimary: true }],
    property: '',
    value: '',
    source: '',
    notes: '',
    stage: 'new',
    assignedTo: 'JS',
    tags: []
  });

  const [newTag, setNewTag] = useState('');
  const [availableTags] = useState([
    'Hot Lead',
    'VIP',
    'Primeira Compra',
    'Investidor',
    'Financiamento',
    'Aluguel',
    'Interesse Alto',
    'Follow-up Necessário',
    'Urgente'
  ]);

  useEffect(() => {
    if (lead) {
      const leadData: LeadData = {
        name: lead.name || '',
        emails: lead.emails || [{ type: 'email', value: '', isPrimary: true }],
        phones: lead.phones || [{ type: 'phone', value: '', isPrimary: true }],
        property: lead.property || '',
        value: lead.value || '',
        source: lead.source || '',
        notes: lead.notes || '',
        stage: lead.stage || 'new',
        assignedTo: lead.assignedTo || 'JS',
        tags: lead.tags || []
      };
      setFormData(leadData);
      setOriginalData(leadData);
    } else {
      const emptyData: LeadData = {
        name: '',
        emails: [{ type: 'email', value: '', isPrimary: true }],
        phones: [{ type: 'phone', value: '', isPrimary: true }],
        property: '',
        value: '',
        source: '',
        notes: '',
        stage: 'new',
        assignedTo: 'JS',
        tags: []
      };
      setFormData(emptyData);
      setOriginalData(emptyData);
    }
  }, [lead, open]);

  const [originalData, setOriginalData] = useState<LeadData>({
    name: '',
    emails: [{ type: 'email', value: '', isPrimary: true }],
    phones: [{ type: 'phone', value: '', isPrimary: true }],
    property: '',
    value: '',
    source: '',
    notes: '',
    stage: 'new',
    assignedTo: 'JS',
    tags: []
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

  const addContact = (type: 'email' | 'phone' | 'mobile') => {
    setFormData(prev => ({
      ...prev,
      [type === 'email' ? 'emails' : 'phones']: [
        ...prev[type === 'email' ? 'emails' : 'phones'],
        { type, value: '', isPrimary: false }
      ]
    }));
  };

  const removeContact = (type: 'email' | 'phone' | 'mobile', index: number) => {
    setFormData(prev => {
      const contacts = [...prev[type === 'email' ? 'emails' : 'phones']];
      if (contacts.length > 1) {
        contacts.splice(index, 1);
      }
      return {
        ...prev,
        [type === 'email' ? 'emails' : 'phones']: contacts
      };
    });
  };

  const updateContact = (type: 'email' | 'phone' | 'mobile', index: number, value: string) => {
    setFormData(prev => {
      const contacts = [...prev[type === 'email' ? 'emails' : 'phones']];
      contacts[index] = { ...contacts[index], value };
      return {
        ...prev,
        [type === 'email' ? 'emails' : 'phones']: contacts
      };
    });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addAvailableTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
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
              {/* E-mails */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>E-mails</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addContact('email')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
              {formData.emails.map((email, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1 relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="E-mail"
                      value={email.value}
                      onChange={(e) => updateContact('email', index, e.target.value)}
                      className="pl-10"
                    />
                    {email.isPrimary && (
                      <Badge variant="default" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs">
                        Principal
                      </Badge>
                    )}
                  </div>
                  {formData.emails.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeContact('email', index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Telefones */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Telefones</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addContact('phone')}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Tel
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addContact('mobile')}
                  >
                    <Smartphone className="h-4 w-4 mr-2" />
                    Cel
                  </Button>
                </div>
              </div>
              {formData.phones.map((phone, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1 relative">
                    {phone.type === 'phone' ? (
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    ) : (
                      <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    )}
                    <Input
                      placeholder={phone.type === 'phone' ? 'Telefone' : 'Celular'}
                      value={phone.value}
                      onChange={(e) => updateContact(phone.type, index, e.target.value)}
                      className="pl-10"
                    />
                    {phone.isPrimary && (
                      <Badge variant="default" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs">
                        Principal
                      </Badge>
                    )}
                  </div>
                  {formData.phones.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeContact(phone.type, index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
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

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="space-y-2">
                {/* Tags existentes */}
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="default" className="gap-1">
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-red-500"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
                
                {/* Adicionar nova tag */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Nova tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTag}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Tags disponíveis */}
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Tags disponíveis:</p>
                  <div className="flex flex-wrap gap-1">
                    {availableTags.filter(tag => !formData.tags.includes(tag)).map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() => addAvailableTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
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
