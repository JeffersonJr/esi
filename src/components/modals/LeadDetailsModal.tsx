import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Mail,
  Phone,
  Calendar as CalendarIcon,
  MapPin,
  Building,
  DollarSign,
  Edit,
  Save,
  MessageCircle,
  FileText,
  Clock,
  User,
  Check,
  X,
  Home,
  Download,
  ArrowLeft,
  Trash2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import { UnsavedChangesModal } from '@/components/modals/UnsavedChangesModal';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ContactInfo {
  type: 'email' | 'phone' | 'mobile';
  value: string;
  isPrimary?: boolean;
}

export interface Lead {
  id: string;
  name: string;
  emails: ContactInfo[];
  phones: ContactInfo[];
  property: string;
  value: string;
  source: string;
  assignedTo: string;
  notes?: string;
  stage?: string;
  lastContact?: string;
  nextAction?: string;
  tags?: string[];
}

interface LeadDetailsModalProps {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onScheduleVisit: () => void;
}

const historicoAtendimento = [
  { id: 1, data: '18/12/2024 14:30', tipo: 'Ligação', descricao: 'Cliente interessado em apartamento 2 quartos', usuario: 'JS' },
  { id: 2, data: '17/12/2024 10:15', tipo: 'Email', descricao: 'Enviado catálogo de imóveis', usuario: 'JS' },
  { id: 3, data: '15/12/2024 16:00', tipo: 'Visita', descricao: 'Visitou apartamento na Vila Mariana', usuario: 'JS' },
];

const documentos = [
  { id: 1, nome: 'Proposta Comercial.pdf', tamanho: '2.4 MB', data: '15/12/2024' },
  { id: 2, nome: 'Documentos Necessários.docx', tamanho: '1.1 MB', data: '10/12/2024' },
  { id: 3, nome: 'Ficha Cadastral.pdf', tamanho: '850 KB', data: '05/12/2024' },
];

const imoveisCompativeis = [
  { id: 1, titulo: 'Apt 2 Quartos - Centro', valor: 'R$ 350.000', endereco: 'Centro, São Paulo', match: 95 },
  { id: 2, titulo: 'Apt 2 Quartos - Vila Mariana', valor: 'R$ 380.000', endereco: 'Vila Mariana, São Paulo', match: 88 },
  { id: 3, titulo: 'Apt 2 Quartos - Pinheiros', valor: 'R$ 420.000', endereco: 'Pinheiros, São Paulo', match: 82 },
];

export function LeadDetailsModal({ 
  lead, 
  open, 
  onClose, 
  onEdit, 
  onDelete,
  onScheduleVisit 
}: LeadDetailsModalProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    property: '',
    value: '',
    source: '',
    notes: '',
    assignedTo: '',
  });
  const [emailMessage, setEmailMessage] = useState('');
  const [agendamento, setAgendamento] = useState({ data: '', hora: '', tipo: 'visita' });

  // Store original data for unsaved changes detection
  const [originalData] = useState({
    name: '',
    email: '',
    phone: '',
    property: '',
    value: '',
    source: '',
    notes: '',
    assignedTo: '',
  });

  // Check if form has unsaved changes
  const hasUnsavedChanges = isEditing && JSON.stringify(formData) !== JSON.stringify(originalData);

  const {
    showModal,
    confirmNavigation,
    handleConfirm,
    handleCancel
  } = useUnsavedChanges({ hasUnsavedChanges });

  const handleClose = () => {
    if (confirmNavigation('')) {
      setIsEditing(false);
      onClose();
    }
  };

  const handleConfirmExit = () => {
    handleCancel(); // Close the unsaved changes modal first
    setIsEditing(false); // Exit edit mode
    onClose(); // Close the main modal
  };

  useEffect(() => {
    if (lead) {
      const primaryEmail = lead?.emails?.find(email => email.isPrimary)?.value || lead?.emails?.[0]?.value || '';
      const primaryPhone = lead?.phones?.find(phone => phone.isPrimary)?.value || lead?.phones?.[0]?.value || '';
      setFormData({
        name: lead.name || '',
        email: primaryEmail,
        phone: primaryPhone,
        property: lead.property || '',
        value: lead.value || '',
        source: lead.source || '',
        notes: lead.notes || '',
        assignedTo: lead.assignedTo || '',
      });
    }
  }, [lead]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // In a real app, you would save the changes to your backend here
    console.log('Saving changes:', formData);
    setIsEditing(false);
    
    // Show success toast
    toast({
      title: "Lead atualizado com sucesso!",
      description: `As alterações em ${lead.name} foram salvas.`,
      variant: "success",
    });
  };

  if (!lead) return null;

  const handleSendEmail = () => {
    const primaryEmail = lead?.emails?.find(email => email.isPrimary)?.value || lead?.emails?.[0]?.value || '';
    console.log('Enviando email para:', primaryEmail, 'Mensagem:', emailMessage);
    setEmailMessage('');
    
    // Show success toast
    toast({
      title: "Email enviado com sucesso!",
      description: `Email enviado para ${lead.name}.`,
      variant: "success",
    });
  };

  const handleAgendarAtividade = () => {
    console.log('Agendando:', agendamento);
    
    // Show success toast
    toast({
      title: `${agendamento.tipo === 'visita' ? 'Visita' : 'Ligação'} agendada!`,
      description: `${agendamento.tipo === 'visita' ? 'Visita' : 'Ligação'} agendada para ${agendamento.data} às ${agendamento.hora}.`,
      variant: "success",
    });
    
    setAgendamento({ data: '', hora: '', tipo: 'visita' });
  };
  const handleGerarTermoVisita = () => {
    console.log('Gerando termo de visita para:', lead.name);
    
    // Show success toast
    toast({
      title: "Termo de visita gerado!",
      description: `PDF do termo de visita foi gerado para ${lead.name}.`,
      variant: "success",
    });
  };

  const renderContent = () => {
    if (isEditing) {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source">Origem</Label>
              <Input
                id="source"
                name="source"
                value={formData.source}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="property">Imóvel de Interesse</Label>
              <Input
                id="property"
                name="property"
                value={formData.property}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Valor</Label>
              <Input
                id="value"
                name="value"
                value={formData.value}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Responsável</Label>
              <Input
                id="assignedTo"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Salvar Alterações
            </Button>
          </div>
        </div>
      );
    }

    return (
      <Tabs defaultValue="info" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onScheduleVisit}
              className="gap-2"
            >
              <CalendarIcon className="h-4 w-4" />
              Agendar Atividade
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(true)}
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              Editar
            </Button>
          </div>
        </div>

        <TabsContent value="info" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {lead.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl">{lead.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {lead?.emails?.find(email => email.isPrimary)?.value || lead?.emails?.[0]?.value || ''}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-sm">
                  {lead.source}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Contato</h3>
                    {(() => {
                      const primaryPhone = lead?.phones?.find(phone => phone.isPrimary)?.value || lead?.phones?.[0]?.value || '';
                      const primaryEmail = lead?.emails?.find(email => email.isPrimary)?.value || lead?.emails?.[0]?.value || '';
                      
                      return (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <a href={`tel:${primaryPhone}`} className="hover:underline">
                              {primaryPhone}
                            </a>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <a href={`mailto:${primaryEmail}`} className="hover:underline">
                              {primaryEmail}
                            </a>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Imóvel de Interesse</h3>
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-muted-foreground" />
                      <span>{lead.property}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-semibold text-primary">{lead.value}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Responsável</h3>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-muted text-xs">
                          {lead.assignedTo}
                        </AvatarFallback>
                      </Avatar>
                      <span>Corretor {lead.assignedTo}</span>
                    </div>
                  </div>

                  {lead.nextAction && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Próxima Ação</h3>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{lead.nextAction}</span>
                      </div>
                    </div>
                  )}

                  {lead.notes && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Observações</h3>
                      <p className="text-sm">{lead.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Atendimento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {historicoAtendimento.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-3 rounded-full bg-primary mt-1" />
                      <div className="h-full w-px bg-border mt-1" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{item.tipo}</h4>
                          <p className="text-sm text-muted-foreground">{item.descricao}</p>
                        </div>
                        <div className="text-sm text-muted-foreground whitespace-nowrap ml-4">
                          {item.data}
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Atendente: {item.usuario}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documentos.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-muted">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{doc.nome}</p>
                        <p className="text-sm text-muted-foreground">{doc.tamanho} • {doc.data}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 -ml-2"
              onClick={isEditing ? () => setIsEditing(false) : onClose}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            {isEditing ? 'Editar Lead' : 'Detalhes do Lead'}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {renderContent()}
        </div>
        
        {!isEditing && (
          <DialogFooter className="sm:justify-between">
            <Button 
              variant="destructive" 
              onClick={() => {
                if (confirm('Tem certeza que deseja excluir este lead?')) {
                  onDelete();
                  onClose();
                }
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir Lead
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Fechar
              </Button>
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
    
    <UnsavedChangesModal
      open={showModal}
      onConfirm={handleConfirmExit}
      onCancel={handleCancel}
    />
  </>
  );
}
