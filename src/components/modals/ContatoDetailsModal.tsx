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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Mail, Phone, MapPin, User, Home, History, Save, MessageCircle, Share2, Check } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import { UnsavedChangesModal } from '@/components/modals/UnsavedChangesModal';

interface Imovel {
  id: string;
  titulo: string;
  status: string;
  data: string;
  descricao?: string;
  preco?: string;
  quartos?: string;
  area?: string;
}

interface Negocio {
  id: string;
  titulo: string;
  status: string;
  valor?: string;
  data: string;
  imovel?: string;
}

interface Contato {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  tipo: string;
  interesse: string;
  cidade: string;
  status: string;
}

interface ContatoDetailsModalProps {
  contato: Contato | null;
  open: boolean;
  onClose: () => void;
}

export function ContatoDetailsModal({ open, onClose, contato }: ContatoDetailsModalProps) {
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Contato | null>(contato);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);

  // Store original data for unsaved changes detection
  const [originalData] = useState<Contato | null>(contato);

  // Check if form has unsaved changes
  const hasUnsavedChanges = editMode && JSON.stringify(formData) !== JSON.stringify(originalData);

  const {
    showModal,
    confirmNavigation,
    handleConfirm,
    handleCancel
  } = useUnsavedChanges({ hasUnsavedChanges });

  const handleClose = () => {
    if (confirmNavigation('')) {
      setEditMode(false);
      onClose();
    }
  };

  const handleConfirmExit = () => {
    handleCancel(); // Close the unsaved changes modal first
    setEditMode(false); // Exit edit mode
    onClose(); // Close the main modal
  };

  if (!contato || !formData) return null;

  const handleSave = () => {
    console.log('Salvando alterações:', formData);
    setEditMode(false);
    
    // Show success toast
    toast({
      title: "Contato atualizado com sucesso!",
      description: `As alterações em ${formData?.nome} foram salvas.`,
      variant: "success",
    });
  };

  const enviarWhatsApp = (telefone: string) => {
    const mensagem = encodeURIComponent(`Olá ${contato.nome}! Tudo bem? Sou da imobiliária e gostaria de falar com você.`);
    window.open(`https://wa.me/55${telefone.replace(/\D/g, '')}?text=${mensagem}`, '_blank');
  };

  const enviarEmail = (email: string) => {
    const assunto = encodeURIComponent(`Contato da Imobiliária - ${contato.nome}`);
    const corpo = encodeURIComponent(`Olá ${contato.nome},\n\nTudo bem? Sou da imobiliária e estou entrando em contato para...\n\nAtenciosamente,\nEquipe da Imobiliária`);
    window.location.href = `mailto:${email}?subject=${assunto}&body=${corpo}`;
  };

  const togglePropertySelection = (propertyId: string) => {
    setSelectedProperties(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const interacoes = [
    { id: 1, data: '18/12/2024', tipo: 'Email', descricao: 'Enviado catálogo de imóveis' },
    { id: 2, data: '15/12/2024', tipo: 'Ligação', descricao: 'Cliente interessado em visitas' },
    { id: 3, data: '10/12/2024', tipo: 'Visita', descricao: 'Visitou apartamento no Centro' },
  ];

  const imoveisRelacionados: Imovel[] = [
    { 
      id: '1', 
      titulo: 'Apt 2 Quartos - Centro', 
      status: 'Interessado', 
      data: '15/12/2024',
      descricao: 'Apartamento com 2 quartos, sala, cozinha e banheiro. Próximo ao comércio.',
      preco: 'R$ 280.000',
      quartos: '2',
      area: '65'
    },
    { 
      id: '2', 
      titulo: 'Casa 3 Quartos - Jardim', 
      status: 'Visitado', 
      data: '10/12/2024',
      descricao: 'Casa com 3 quartos, 2 banheiros, garagem para 2 carros e quintal.',
      preco: 'R$ 450.000',
      quartos: '3',
      area: '120'
    },
  ];

  const negociosRelacionados: Negocio[] = [
    {
      id: '1',
      titulo: 'Proposta - Apt Centro',
      status: 'Em negociação',
      valor: 'R$ 270.000',
      data: '15/12/2024',
      imovel: 'Apt 2 Quartos - Centro'
    }
  ];

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                  {contato.nome.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-xl">{contato.nome}</div>
                <Badge variant={contato.tipo === 'Cliente' ? 'default' : 'secondary'}>
                  {contato.tipo}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => enviarEmail(contato.email)}
                className="gap-2"
              >
                <Mail className="h-4 w-4" />
                Email
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => enviarWhatsApp(contato.telefone)}
                className="gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </Button>
              <Button onClick={() => setEditMode(!editMode)} variant="outline">
                {editMode ? 'Cancelar' : 'Editar'}
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="dados" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dados">
              <User className="h-4 w-4 mr-2" />
              Dados
            </TabsTrigger>
            <TabsTrigger value="historico">
              <History className="h-4 w-4 mr-2" />
              Histórico
            </TabsTrigger>
            <TabsTrigger value="imoveis">
              <Home className="h-4 w-4 mr-2" />
              Imóveis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dados" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome Completo</Label>
                    {editMode ? (
                      <Input
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-sm p-2 bg-muted rounded-md">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {formData.nome}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    {editMode ? (
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-sm p-2 bg-muted rounded-md">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {formData.email}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Telefone</Label>
                    {editMode ? (
                      <Input
                        value={formData.telefone}
                        onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-sm p-2 bg-muted rounded-md">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {formData.telefone}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Cidade</Label>
                    {editMode ? (
                      <Input
                        value={formData.cidade}
                        onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-sm p-2 bg-muted rounded-md">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {formData.cidade}
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo de Contato</Label>
                    {editMode ? (
                      <select
                        className="w-full px-3 py-2 rounded-md border border-input bg-background"
                        value={formData.tipo}
                        onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                      >
                        <option value="Cliente">Cliente</option>
                        <option value="Proprietário">Proprietário</option>
                      </select>
                    ) : (
                      <div className="p-2">
                        <Badge variant={formData.tipo === 'Cliente' ? 'default' : 'secondary'}>
                          {formData.tipo}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    {editMode ? (
                      <select
                        className="w-full px-3 py-2 rounded-md border border-input bg-background"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      >
                        <option value="Ativo">Ativo</option>
                        <option value="Em negociação">Em negociação</option>
                        <option value="Inativo">Inativo</option>
                      </select>
                    ) : (
                      <div className="p-2">
                        <Badge
                          variant="outline"
                          className={
                            formData.status === 'Ativo'
                              ? 'border-success text-success'
                              : formData.status === 'Em negociação'
                              ? 'border-warning text-warning'
                              : 'border-muted-foreground text-muted-foreground'
                          }
                        >
                          {formData.status}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Interesse</Label>
                  {editMode ? (
                    <Input
                      value={formData.interesse}
                      onChange={(e) => setFormData({ ...formData, interesse: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-sm p-2 bg-muted rounded-md">
                      <Home className="h-4 w-4 text-muted-foreground" />
                      {formData.interesse}
                    </div>
                  )}
                </div>

                {editMode && (
                  <Button onClick={handleSave} className="w-full gap-2">
                    <Save className="h-4 w-4" />
                    Salvar Alterações
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="historico" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Interações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {interacoes.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {item.tipo === 'Ligação' && <Phone className="h-5 w-5 text-primary" />}
                          {item.tipo === 'Email' && <Mail className="h-5 w-5 text-primary" />}
                          {item.tipo === 'Visita' && <Home className="h-5 w-5 text-primary" />}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <div className="font-medium">{item.tipo}</div>
                          <div className="text-xs text-muted-foreground">{item.data}</div>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.descricao}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="imoveis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Imóveis Relacionados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {imoveisRelacionados.map((imovel) => (
                    <Card key={imovel.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{imovel.titulo}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {imovel.status} em {imovel.data}
                            </p>
                          </div>
                          <Badge variant="outline">{imovel.status}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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
