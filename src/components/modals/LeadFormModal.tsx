import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from '@/components/ui/button';
import { cn, maskCurrency } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import { UnsavedChangesModal } from '@/components/modals/UnsavedChangesModal';
import { useAnimation } from '@/components/shared/ActionAnimation';
import { X, Plus, Mail, Phone, Smartphone, Palette, Edit2, Trash2, User, Home, Building, DollarSign } from 'lucide-react';
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
  onSave: (lead: LeadData) => void;
  lead?: LeadData;
  stageId?: string;
}

export function LeadFormModal({ open, onClose, onSave, lead, stageId }: LeadFormModalProps) {
  const { triggerAnimation } = useAnimation();
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
    { id: '1', name: 'Jefferson (Você)' },
    { id: '2', name: 'Paula Corretora' },
    { id: '3', name: 'Rodrigo Silva' }
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

    // Trigger micro-animation
    const rect = (e.target as HTMLFormElement).querySelector('button[type="submit"]')?.getBoundingClientRect();
    if (rect) {
      triggerAnimation({
        type: 'save-property',
        startX: rect.left + rect.width / 2,
        startY: rect.top + rect.height / 2,
        icon: formData.searchType === 'investimento' ? Building : Home
      });
    }

    onSave(formData);
    onClose();
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
      <Sheet open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
        <SheetContent side="right" className="sm:max-w-md w-full p-0 flex flex-col h-full bg-background">
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <SheetHeader className="p-6 border-b bg-white shrink-0">
              <SheetTitle className="text-xl font-bold text-slate-900">
                {formData.id ? 'Editar Lead' : (formData.stage === 'proposal' ? 'Nova Proposta' : 'Novo Lead')}
              </SheetTitle>
            </SheetHeader>

            <ScrollArea className="flex-1">
              <div className="p-6 space-y-8">
                {/* Dados da Pessoa */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-indigo-500" />
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Dados do Lead</h3>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-semibold text-slate-600">Nome Completo *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Ex: Maria Oliveira"
                      className="h-11 border-slate-200 bg-white focus:ring-indigo-500"
                    />
                  </div>

                  {/* E-mails Simples */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold text-slate-600">E-mails</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => addContact('email')}
                        disabled={formData.emails.length >= 2}
                        className="h-6 text-[10px] text-indigo-600 hover:text-indigo-700 font-bold"
                      >
                        <Plus className="h-3 w-3 mr-1" /> ADICIONAR
                      </Button>
                    </div>
                    {formData.emails.map((email, index) => (
                      <div key={index} className="flex gap-2">
                        <div className="relative flex-1">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            placeholder="E-mail"
                            value={email.value}
                            onChange={(e) => updateContact('email', index, e.target.value)}
                            className="pl-9 h-11 border-slate-200 bg-white"
                          />
                        </div>
                        {formData.emails.length > 1 && (
                          <Button type="button" variant="ghost" size="icon" className="h-11 w-11 shrink-0" onClick={() => removeContact('email', index)}>
                            <Trash2 className="h-4 w-4 text-slate-400" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Telefones Simples */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold text-slate-600">Telefones</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => addContact('mobile')}
                        disabled={formData.phones.length >= 2}
                        className="h-6 text-[10px] text-indigo-600 hover:text-indigo-700 font-bold"
                      >
                        <Plus className="h-3 w-3 mr-1" /> ADICIONAR
                      </Button>
                    </div>
                    {formData.phones.map((phone, index) => (
                      <div key={index} className="flex gap-2">
                        <div className="relative flex-1">
                          <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            placeholder="Celular/WhatsApp"
                            value={phone.value}
                            onChange={(e) => updateContact(phone.type, index, e.target.value)}
                            className="pl-9 h-11 border-slate-200 bg-white"
                          />
                        </div>
                        {formData.phones.length > 1 && (
                          <Button type="button" variant="ghost" size="icon" className="h-11 w-11 shrink-0" onClick={() => removeContact(phone.type, index)}>
                            <Trash2 className="h-4 w-4 text-slate-400" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                <Separator />

                {/* Interesse */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Home className="h-4 w-4 text-emerald-500" />
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Interesse e Perfil</h3>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="property" className="text-xs font-semibold text-slate-600">O que procura? *</Label>
                    <Input
                      id="property"
                      name="property"
                      value={formData.property}
                      onChange={handleChange}
                      required
                      placeholder="Ex: Casa com piscina, Terreno..."
                      className="h-11 border-slate-200 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="searchType" className="text-xs font-semibold text-slate-600">Tipo</Label>
                      <Select value={formData.searchType} onValueChange={(value) => handleSelectChange('searchType', value)}>
                        <SelectTrigger className="h-11 bg-white border-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="compra">Compra</SelectItem>
                          <SelectItem value="venda">Venda</SelectItem>
                          <SelectItem value="investimento">Investimento</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="value" className="text-xs font-semibold text-slate-600">Budget Aprox. *</Label>
                      <Input
                        id="value"
                        name="value"
                        value={formData.value}
                        onChange={handleChange}
                        required
                        placeholder="R$ 0,00"
                        className="h-11 border-slate-200 bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-xs font-semibold text-slate-600">Onde procura?</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Bairros, Cidades..."
                      className="h-11 border-slate-200 bg-white"
                    />
                  </div>
                </section>

                <Separator />

                {/* Gestão */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Palette className="h-4 w-4 text-amber-500" />
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Gestão e Origem</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="source" className="text-xs font-semibold text-slate-600">Origem *</Label>
                      <Select value={formData.source} onValueChange={(value) => handleSelectChange('source', value)} required>
                        <SelectTrigger className="h-11 bg-white border-slate-200">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {sources.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assignedTo" className="text-xs font-semibold text-slate-600">Responsável</Label>
                      <Select value={formData.assignedTo} onValueChange={(value) => handleSelectChange('assignedTo', value)}>
                        <SelectTrigger className="h-11 bg-white border-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {agents.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xs font-semibold text-slate-600">Qualificar com Tags</Label>
                    <TagManager
                      selectedTags={formData.tags || []}
                      availableTags={availableTags}
                      onUpdate={(tags) => setFormData(prev => ({ ...prev, tags }))}
                      onUpdateAvailableTags={setAvailableTags}
                      showEditMode={true}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-xs font-semibold text-slate-600">Notas Internas</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Adicione observações importantes..."
                      className="min-h-[100px] border-slate-200 bg-white resize-none text-sm"
                    />
                  </div>
                </section>
              </div>
            </ScrollArea>

            <SheetFooter className="p-6 border-t bg-muted/20 shrink-0 sm:flex-row gap-3">
              <Button type="button" variant="ghost" onClick={handleClose} className="w-full sm:w-auto font-bold text-slate-500">
                DESCARTAR
              </Button>
              <Button type="submit" className="w-full sm:w-auto px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 shadow-md shadow-indigo-100">
                {lead ? 'SALVAR ALTERAÇÕES' : 'CRIAR LEAD AGORA'}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      <UnsavedChangesModal
        open={showModal}
        onConfirm={handleConfirm}
        onCancel={handleModalClose}
      />
    </>
  );
}
