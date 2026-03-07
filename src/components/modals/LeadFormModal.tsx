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
import { X, Plus, Mail, Phone, Smartphone, Palette, Edit2, Trash2 } from 'lucide-react';
import { TagManager } from '@/components/shared/TagManager';
import { DEFAULT_TAGS, TAG_COLORS, Tag } from '@/components/shared/tagConstants';

interface ContactInfo {
  type: 'email' | 'phone' | 'mobile';
  value: string;
  isPrimary?: boolean;
}

interface LeadData {
  id?: string;
  name: string;
  emails: ContactInfo[];
  phones: ContactInfo[];
  property: string;
  location: string;
  searchType: 'compra' | 'venda' | 'investimento';
  value: string;
  source: string;
  notes?: string;
  stage?: string;
  assignedTo: string;
  tags?: string[];
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
    location: '',
    searchType: 'compra',
    value: '',
    source: '',
    notes: '',
    stage: 'new',
    assignedTo: 'JS',
    tags: []
  });

  const [availableTags, setAvailableTags] = useState<Tag[]>(DEFAULT_TAGS);

  const agents = [
    { id: 'JS', name: 'João Silva' },
    { id: 'MR', name: 'Maria Rocha' },
    { id: 'PC', name: 'Pedro Costa' },
  ];

  const sources = [
    'Site',
    'Instagram',
    'Facebook',
    'Indicação',
    'Telefone',
    'E-mail',
    'Outros'
  ];

  const stages = [
    { id: 'new', name: 'Novo Lead' },
    { id: 'contact', name: 'Contato Realizado' },
    { id: 'visit', name: 'Visita Agendada' },
    { id: 'proposal', name: 'Proposta Enviada' },
    { id: 'negotiation', name: 'Negociação' },
    { id: 'closed', name: 'Fechado' }
  ];

  useEffect(() => {
    if (lead) {
      const leadData: LeadData = {
        name: lead.name || '',
        emails: lead.emails || [{ type: 'email', value: '', isPrimary: true }],
        phones: lead.phones || [{ type: 'phone', value: '', isPrimary: true }],
        property: lead.property || '',
        location: lead.location || '',
        searchType: lead.searchType || 'compra',
        value: lead.value || '',
        source: lead.source || '',
        notes: lead.notes || '',
        stage: lead.stage || 'new',
        assignedTo: lead.assignedTo || 'JS',
        tags: lead.tags || []
      };
      setFormData(leadData);
    } else {
      const emptyData: LeadData = {
        name: '',
        emails: [{ type: 'email', value: '', isPrimary: true }],
        phones: [{ type: 'phone', value: '', isPrimary: true }],
        property: '',
        location: '',
        searchType: 'compra',
        value: '',
        source: '',
        notes: '',
        stage: 'new',
        assignedTo: 'JS',
        tags: []
      };
      setFormData(emptyData);
    }
  }, [lead]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addContact = (type: 'email' | 'phone' | 'mobile') => {
    if (type === 'email') {
      setFormData(prev => ({
        ...prev,
        emails: [...prev.emails, { type, value: '', isPrimary: false }]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        phones: [...prev.phones, { type, value: '', isPrimary: false }]
      }));
    }
  };

  const updateContact = (type: 'email' | 'phone' | 'mobile', index: number, value: string) => {
    if (type === 'email') {
      setFormData(prev => ({
        ...prev,
        emails: prev.emails.map((email, i) =>
          i === index ? { ...email, value } : email
        )
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        phones: prev.phones.map((phone, i) =>
          i === index ? { ...phone, value } : phone
        )
      }));
    }
  };

  const removeContact = (type: 'email' | 'phone' | 'mobile', index: number) => {
    if (type === 'email') {
      setFormData(prev => ({
        ...prev,
        emails: prev.emails.filter((_, i) => i !== index)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        phones: prev.phones.filter((_, i) => i !== index)
      }));
    }
  };

  const setPrimaryContact = (type: 'email' | 'phone' | 'mobile', index: number) => {
    if (type === 'email') {
      setFormData(prev => ({
        ...prev,
        emails: prev.emails.map((email, i) =>
          ({ ...email, isPrimary: i === index })
        )
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        phones: prev.phones.map((phone, i) =>
          ({ ...phone, isPrimary: i === index })
        )
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const [showModal, setShowModal] = useState(false);

  const hasUnsavedChanges = JSON.stringify(formData) !== JSON.stringify(lead || {});

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowModal(true);
    } else {
      onClose();
    }
  };

  const {
    showModal: unsavedModalOpen,
    showUnsavedChangesModal,
    hideUnsavedChangesModal,
    confirmNavigation,
    handleConfirm: confirmUnsaved,
    handleCancel: cancelUnsaved
  } = useUnsavedChanges({
    hasUnsavedChanges,
    message: 'Você tem alterações não salvas. Tem certeza que deseja sair?'
  });

  const handleConfirm = () => {
    setShowModal(false);
    onClose();
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[1200px] max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {formData.id ? 'Editar Lead' : (formData.stage === 'proposal' ? 'Nova Proposta' : 'Novo Lead')}
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-12 gap-6 py-6">
              {/* Colunas 1-7: Informações do Cliente e Perfil de Busca */}
              <div className="col-span-7 space-y-8">
                {/* Informações do Cliente */}
                <div>
                  <h3 className="text-slate-400 uppercase text-xs font-medium mb-4">Informações do Cliente</h3>
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
                        className="border-slate-200"
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
                          className="border-slate-200"
                        >
                          <Mail className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {formData.emails.map((email, index) => (
                          <div key={index} className="flex gap-2">
                            <div className="flex-1 relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                              <Input
                                placeholder="E-mail"
                                value={email.value}
                                onChange={(e) => updateContact('email', index, e.target.value)}
                                className="pl-10 pr-14 border-slate-200"
                              />
                              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                                {email.isPrimary && (
                                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                                    Principal
                                  </Badge>
                                )}
                                {!email.isPrimary && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
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
                                className="h-10 w-8 p-0"
                                onClick={() => removeContact('email', index)}
                              >
                                <X className="h-4 w-4" />
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
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addContact('phone')}
                            disabled={formData.phones.length >= 3}
                            title={formData.phones.length >= 3 ? 'Máximo de 3 telefones permitidos' : 'Adicionar telefone'}
                            className="border-slate-200"
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
                            className="border-slate-200"
                          >
                            <Smartphone className="h-3 w-3 mr-1" />
                            Cel
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {formData.phones.map((phone, index) => (
                          <div key={index} className="flex gap-2">
                            <div className="flex-1 relative">
                              {phone.type === 'phone' ? (
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                              ) : (
                                <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                              )}
                              <Input
                                placeholder={phone.type === 'phone' ? 'Telefone' : 'Celular'}
                                value={phone.value}
                                onChange={(e) => updateContact(phone.type, index, e.target.value)}
                                className="pl-10 pr-14 border-slate-200"
                              />
                              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                                {phone.isPrimary && (
                                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                                    Principal
                                  </Badge>
                                )}
                                {!phone.isPrimary && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
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
                                className="h-10 w-8 p-0"
                                onClick={() => removeContact(phone.type, index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Perfil de Busca */}
                <div>
                  <h3 className="text-slate-400 uppercase text-xs font-medium mb-4">Perfil de Busca</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="property">Imóvel *</Label>
                      <Input
                        id="property"
                        name="property"
                        value={formData.property}
                        onChange={handleChange}
                        required
                        placeholder="Ex: Apt 2 quartos"
                        className="border-slate-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Localização</Label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Ex: Centro, Zona Sul..."
                        className="border-slate-200"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="value">Valor *</Label>
                        <Input
                          id="value"
                          name="value"
                          value={formData.value}
                          onChange={handleChange}
                          required
                          placeholder="Ex: R$ 350.000"
                          className="border-slate-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="searchType">Tipo de Busca</Label>
                        <Select value={formData.searchType} onValueChange={(value) => handleSelectChange('searchType', value)}>
                          <SelectTrigger className="border-slate-200">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="compra">Compra</SelectItem>
                            <SelectItem value="venda">Venda</SelectItem>
                            <SelectItem value="investimento">Investimento</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="source">Origem *</Label>
                        <Select value={formData.source} onValueChange={(value) => handleSelectChange('source', value)} required>
                          <SelectTrigger className="border-slate-200">
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
                          <SelectTrigger className="border-slate-200">
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
                </div>
              </div>

              {/* Colunas 8-12: Classificação (Box lateral) */}
              <div className="col-span-5 bg-slate-50 rounded-lg p-6 space-y-6">
                <h3 className="text-slate-400 uppercase text-xs font-medium mb-4">Classificação</h3>

                {/* Responsável */}
                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Responsável</Label>
                  <Select value={formData.assignedTo} onValueChange={(value) => handleSelectChange('assignedTo', value)}>
                    <SelectTrigger className="border-slate-200 bg-white">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {agents.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tags Refinadas */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Tags</Label>
                  </div>

                  <TagManager
                    selectedTags={formData.tags || []}
                    availableTags={availableTags}
                    onUpdate={(tags) => setFormData(prev => ({ ...prev, tags }))}
                    onUpdateAvailableTags={setAvailableTags}
                    showEditMode={true}
                  />
                </div>

                {/* Observações */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Adicione observações importantes sobre este lead..."
                    rows={4}
                    className="border-slate-200 bg-white resize-none"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-6">
              <Button type="button" variant="ghost" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600">
                {lead ? 'Salvar Lead' : 'Adicionar Lead'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <UnsavedChangesModal
        open={showModal}
        onConfirm={handleConfirm}
        onCancel={handleModalClose}
      />
    </>
  );
}
