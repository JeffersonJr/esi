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
import { X, Plus, Mail, Phone, Smartphone, Palette, Edit2 } from 'lucide-react';

interface ContactInfo {
  type: 'email' | 'phone' | 'mobile';
  value: string;
  isPrimary?: boolean;
}

interface Tag {
  id: string;
  name: string;
  color: string;
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

const TAG_COLORS = [
  { name: 'Vermelho', value: 'bg-red-500' },
  { name: 'Laranja', value: 'bg-orange-500' },
  { name: 'Amarelo', value: 'bg-yellow-500' },
  { name: 'Verde', value: 'bg-green-500' },
  { name: 'Azul', value: 'bg-blue-500' },
  { name: 'Roxo', value: 'bg-purple-500' },
  { name: 'Rosa', value: 'bg-pink-500' },
  { name: 'Cinza', value: 'bg-gray-500' },
];

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
  const [availableTags, setAvailableTags] = useState<Tag[]>([
    { id: '1', name: 'Hot Lead', color: 'bg-red-500' },
    { id: '2', name: 'VIP', color: 'bg-purple-500' },
    { id: '3', name: 'Primeira Compra', color: 'bg-blue-500' },
    { id: '4', name: 'Investidor', color: 'bg-green-500' },
    { id: '5', name: 'Financiamento', color: 'bg-orange-500' },
    { id: '6', name: 'Aluguel', color: 'bg-yellow-500' },
    { id: '7', name: 'Interesse Alto', color: 'bg-red-500' },
    { id: '8', name: 'Follow-up Necessário', color: 'bg-orange-500' },
    { id: '9', name: 'Urgente', color: 'bg-red-500' },
  ]);

  const [tagEditMode, setTagEditMode] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [selectedTagColor, setSelectedTagColor] = useState('bg-blue-500');

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
    const currentContacts = type === 'email' ? formData.emails : formData.phones;
    if (currentContacts.length < 3) {
      setFormData(prev => ({
        ...prev,
        [type === 'email' ? 'emails' : 'phones']: [
          ...prev[type === 'email' ? 'emails' : 'phones'],
          { type, value: '', isPrimary: false }
        ]
      }));
    }
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

  const setPrimaryContact = (type: 'email' | 'phone' | 'mobile', index: number) => {
    setFormData(prev => {
      const contacts = [...prev[type === 'email' ? 'emails' : 'phones']];
      return {
        ...prev,
        [type === 'email' ? 'emails' : 'phones']: contacts.map((contact, i) => ({
          ...contact,
          isPrimary: i === index
        }))
      };
    });
  };

  const addTag = () => {
    if (newTag.trim()) {
      const newTagObj: Tag = {
        id: Date.now().toString(),
        name: newTag.trim(),
        color: selectedTagColor
      };
      setAvailableTags(prev => [...prev, newTagObj]);
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

  const addAvailableTag = (tag: Tag) => {
    if (!formData.tags.includes(tag.name)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.name]
      }));
    }
  };

  const startEditTag = (tag: Tag) => {
    setEditingTag(tag);
    setNewTagName(tag.name);
    setSelectedTagColor(tag.color);
  };

  const saveTagEdit = () => {
    if (editingTag && newTagName.trim()) {
      setAvailableTags(prev => prev.map(tag => 
        tag.id === editingTag.id 
          ? { ...tag, name: newTagName.trim(), color: selectedTagColor }
          : tag
      ));
      
      if (formData.tags.includes(editingTag.name)) {
        setFormData(prev => ({
          ...prev,
          tags: prev.tags.map(tag => tag === editingTag.name ? newTagName.trim() : tag)
        }));
      }
      
      setEditingTag(null);
      setNewTagName('');
    }
  };

  const deleteTag = (tagId: string) => {
    const tagToDelete = availableTags.find(tag => tag.id === tagId);
    if (tagToDelete) {
      setAvailableTags(prev => prev.filter(tag => tag.id !== tagId));
      setFormData(prev => ({
        ...prev,
        tags: prev.tags.filter(tag => tag !== tagToDelete.name)
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const sources = ['Site', 'Facebook', 'Instagram', 'Indicação', 'Portal Imóveis', 'Outro'];
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
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{lead ? 'Editar Lead' : 'Novo Lead'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-6 py-4">
            {/* Coluna Esquerda */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Nome completo do lead"
                />
              </div>

              {/* E-mails */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label>E-mails</Label>
                    <span className="text-xs text-muted-foreground">
                      ({formData.emails.length}/3)
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addContact('email')}
                    disabled={formData.emails.length >= 3}
                    title={formData.emails.length >= 3 ? 'Máximo de 3 emails permitidos' : 'Adicionar email'}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {formData.emails.map((email, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="flex-1 relative">
                        <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                        <Input
                          placeholder="E-mail"
                          value={email.value}
                          onChange={(e) => updateContact('email', index, e.target.value)}
                          className="pl-8 pr-16 text-sm"
                        />
                        <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex gap-1">
                          {email.isPrimary && (
                            <Badge variant="default" className="text-xs px-1">
                              Principal
                            </Badge>
                          )}
                          {!email.isPrimary && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-5 w-5 p-0"
                              onClick={() => setPrimaryContact('email', index)}
                              title="Definir como principal"
                            >
                              <span className="text-xs">★</span>
                            </Button>
                          )}
                        </div>
                      </div>
                      {formData.emails.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => removeContact('email', index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Telefones */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label>Telefones</Label>
                    <span className="text-xs text-muted-foreground">
                      ({formData.phones.length}/3)
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addContact('phone')}
                      disabled={formData.phones.length >= 3}
                      title={formData.phones.length >= 3 ? 'Máximo de 3 telefones permitidos' : 'Adicionar telefone'}
                    >
                      <Phone className="h-3 w-3 mr-1" />
                      Tel
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addContact('mobile')}
                      disabled={formData.phones.length >= 3}
                      title={formData.phones.length >= 3 ? 'Máximo de 3 telefones permitidos' : 'Adicionar celular'}
                    >
                      <Smartphone className="h-3 w-3 mr-1" />
                      Cel
                    </Button>
                  </div>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {formData.phones.map((phone, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="flex-1 relative">
                        {phone.type === 'phone' ? (
                          <Phone className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                        ) : (
                          <Smartphone className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                        )}
                        <Input
                          placeholder={phone.type === 'phone' ? 'Telefone' : 'Celular'}
                          value={phone.value}
                          onChange={(e) => updateContact(phone.type, index, e.target.value)}
                          className="pl-8 pr-16 text-sm"
                        />
                        <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex gap-1">
                          {phone.isPrimary && (
                            <Badge variant="default" className="text-xs px-1">
                              Principal
                            </Badge>
                          )}
                          {!phone.isPrimary && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-5 w-5 p-0"
                              onClick={() => setPrimaryContact(phone.type, index)}
                              title="Definir como principal"
                            >
                              <span className="text-xs">★</span>
                            </Button>
                          )}
                        </div>
                      </div>
                      {formData.phones.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => removeContact(phone.type, index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="source">Origem *</Label>
                  <Select value={formData.source} onValueChange={(value) => handleSelectChange('source', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {sources.map((source) => (
                        <SelectItem key={source} value={source}>{source}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stage">Estágio</Label>
                  <Select value={formData.stage} onValueChange={(value) => handleSelectChange('stage', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map((stage) => (
                        <SelectItem key={stage.id} value={stage.id}>{stage.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Coluna Direita */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="property">Imóvel *</Label>
                  <Input
                    id="property"
                    name="property"
                    value={formData.property}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Apt 2 quartos"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value">Valor *</Label>
                  <Input
                    id="value"
                    name="value"
                    value={formData.value}
                    onChange={handleChange}
                    required
                    placeholder="Ex: R$ 350.000"
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Tags</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setTagEditMode(!tagEditMode)}
                  >
                    <Edit2 className="h-3 w-3 mr-1" />
                    {tagEditMode ? 'Voltar' : 'Editar'}
                  </Button>
                </div>

                {!tagEditMode ? (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1 min-h-[32px] p-2 border rounded-md bg-muted/20">
                      {formData.tags.length === 0 ? (
                        <span className="text-sm text-muted-foreground">Clique nas tags abaixo para adicionar</span>
                      ) : (
                        formData.tags.map((tagName) => {
                          const tag = availableTags.find(t => t.name === tagName);
                          return (
                            <Badge 
                              key={tagName} 
                              className={`${tag?.color || 'bg-gray-500'} text-white cursor-pointer gap-1`}
                            >
                              {tagName}
                              <X className="h-3 w-3 hover:text-red-200" onClick={() => removeTag(tagName)} />
                            </Badge>
                          );
                        })
                      )}
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Tags disponíveis:</p>
                      <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-2 border rounded-md">
                        {availableTags
                          .filter(tag => !formData.tags.includes(tag.name))
                          .map((tag) => (
                            <Badge
                              key={tag.id}
                              className={`${tag.color} text-white cursor-pointer hover:opacity-80`}
                              onClick={() => addAvailableTag(tag)}
                            >
                              {tag.name}
                            </Badge>
                          ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Input
                        placeholder="Nova tag..."
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        className="flex-1"
                      />
                      <Select value={selectedTagColor} onValueChange={setSelectedTagColor}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TAG_COLORS.map((color) => (
                            <SelectItem key={color.value} value={color.value}>
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${color.value}`} />
                                {color.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button type="button" variant="outline" size="sm" onClick={addTag} disabled={!newTag.trim()}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {availableTags.map((tag) => (
                        <div key={tag.id} className="flex items-center gap-2 p-2 border rounded">
                          {editingTag?.id === tag.id ? (
                            <>
                              <Input
                                value={newTagName}
                                onChange={(e) => setNewTagName(e.target.value)}
                                className="flex-1"
                                placeholder="Nome da tag"
                              />
                              <Select value={selectedTagColor} onValueChange={setSelectedTagColor}>
                                <SelectTrigger className="w-24">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {TAG_COLORS.map((color) => (
                                    <SelectItem key={color.value} value={color.value}>
                                      <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${color.value}`} />
                                        {color.name}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button type="button" variant="ghost" size="sm" onClick={saveTagEdit}>
                                Salvar
                              </Button>
                              <Button type="button" variant="ghost" size="sm" onClick={() => setEditingTag(null)}>
                                Cancelar
                              </Button>
                            </>
                          ) : (
                            <>
                              <div className={`w-4 h-4 rounded-full ${tag.color}`} />
                              <span className="flex-1">{tag.name}</span>
                              <Button type="button" variant="ghost" size="sm" onClick={() => startEditTag(tag)}>
                                <Edit2 className="h-3 w-3" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteTag(tag.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignedTo">Responsável</Label>
                <Select value={formData.assignedTo} onValueChange={(value) => handleSelectChange('assignedTo', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Informações adicionais sobre o lead..."
                />
              </div>
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
