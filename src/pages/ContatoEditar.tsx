import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Search, Upload, User, Plus, Calendar, Building, MapPin, Home, Settings, CreditCard, DollarSign, Calculator, FileText, Globe, Info, Search as SearchIcon, FileImage, Download, Eye, X, GripVertical, CheckCircle, Mail, Phone, Edit } from 'lucide-react';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import { UnsavedChangesModal } from '@/components/modals/UnsavedChangesModal';
import { useToast } from '@/hooks/use-toast';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockContato = {
  id: '1',
  nome: 'Maria Santos',
  email: 'maria@email.com',
  telefone: '(11) 99999-0001',
  tipo: 'Cliente',
  interesse: 'Apartamento',
  cidade: 'São Paulo',
  status: 'Ativo',
  dataCadastro: '15/12/2024',
  observacoes: 'Cliente muito interessado em imóveis no centro de São Paulo. Procura por apartamentos com 2+ quartos e boa localização.',
  preferencias: {
    tipoImovel: 'Apartamento',
    quartos: '2+',
    faixaPreco: 'R$ 300.000 - R$ 500.000',
    bairros: ['Centro', 'Bela Vista', 'Consolação'],
    caracteristicas: ['Aceita financiamento', 'Proximo ao metrô', 'Com vaga na garagem']
  }
};

export default function ContatoEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nome: mockContato.nome,
    email: mockContato.email,
    telefone: mockContato.telefone,
    tipo: mockContato.tipo,
    interesse: mockContato.interesse,
    cidade: mockContato.cidade,
    status: mockContato.status,
    observacoes: mockContato.observacoes,
    preferencias: {
      tipoImovel: mockContato.preferencias.tipoImovel,
      quartos: mockContato.preferencias.quartos,
      faixaPreco: mockContato.preferencias.faixaPreco,
      bairros: mockContato.preferencias.bairros.join(', '),
      caracteristicas: mockContato.preferencias.caracteristicas.join(', ')
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [originalData] = useState(formData);

  // Check if form has unsaved changes
  const hasUnsavedChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

  const {
    showModal,
    confirmNavigation,
    handleConfirm,
    handleCancel: handleUnsavedChangesCancel
  } = useUnsavedChanges({ hasUnsavedChanges });

  const handleNavigation = (to: string) => {
    if (confirmNavigation(to)) {
      navigate(to);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // In a real app, this would call an API to update the contato
    console.log('Updating contato:', formData);

    // Show success toast
    toast({
      title: "Contato atualizado!",
      description: "As informações do contato foram atualizadas com sucesso.",
      variant: "success",
    });

    // Navigate back to profile
    navigate(`/contatos/perfil/${id}`);
  };

  const handleCancel = () => {
    handleNavigation(`/contatos/perfil/${id}`);
  };

  return (
    <div className="flex flex-col min-h-full font-sans">
      <div className="max-w-[1400px] w-full mx-auto px-6 pt-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="flex items-center gap-1">
                <Home className="h-4 w-4" /> Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/contatos">Contatos</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Editar Contato</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header Sticky */}
      <div className="bg-white border-b border-slate-200 px-6 py-6 sticky top-0 z-40 backdrop-blur-md bg-white/80 mt-4 h-24 flex items-center shrink-0">
        <div className="max-w-[1400px] w-full mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleCancel} className="h-10 w-10 p-0 rounded-xl hover:bg-slate-50 transition-all shrink-0">
              <ArrowLeft className="h-5 w-5 text-slate-500" />
            </Button>
            <div className="h-12 w-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200 shrink-0">
              <Edit className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-semibold text-slate-800 tracking-tight">Editar Contato</h1>
                <Badge variant="outline" className="text-[10px] font-semibold tracking-tight border-indigo-100 text-indigo-600 bg-indigo-50/50">Edição</Badge>
              </div>
              <p className="text-slate-500 mt-1 font-medium italic">Atualize as informações do contato</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleCancel} className="bg-white border-slate-200 text-slate-700 font-bold h-9 rounded-xl shadow-sm hover:bg-slate-50 transition-all">
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleSubmit} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-9 rounded-xl shadow-lg shadow-indigo-200 transition-all">
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] w-full mx-auto px-6 py-8">

        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informações Básicas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informações Básicas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome *</Label>
                      <Input
                        id="nome"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        className={errors.nome ? 'border-red-500' : ''}
                      />
                      {errors.nome && <p className="text-sm text-red-500">{errors.nome}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone *</Label>
                      <Input
                        id="telefone"
                        value={formData.telefone}
                        onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                        className={errors.telefone ? 'border-red-500' : ''}
                      />
                      {errors.telefone && <p className="text-sm text-red-500">{errors.telefone}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cidade">Cidade de Interesse</Label>
                      <Input
                        id="cidade"
                        value={formData.cidade}
                        onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tipo">Tipo</Label>
                      <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cliente">Cliente</SelectItem>
                          <SelectItem value="Proprietário">Proprietário</SelectItem>
                          <SelectItem value="Ambos">Ambos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="interesse">Tipo de Imóvel de Interesse</Label>
                      <select
                        id="interesse"
                        value={formData.interesse}
                        onChange={(e) => setFormData({ ...formData, interesse: e.target.value })}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="Apartamento">Apartamento</option>
                        <option value="Casa">Casa</option>
                        <option value="Cobertura">Cobertura</option>
                        <option value="Studio">Studio</option>
                        <option value="Casa condomínio">Casa condomínio</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <select
                        id="status"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="Ativo">Ativo</option>
                        <option value="Em negociação">Em negociação</option>
                        <option value="Inativo">Inativo</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Preferências */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Preferências de Imóvel
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tipoImovel">Tipo de Imóvel</Label>
                      <select
                        id="tipoImovel"
                        value={formData.preferencias.tipoImovel}
                        onChange={(e) => setFormData({
                          ...formData,
                          preferencias: { ...formData.preferencias, tipoImovel: e.target.value }
                        })}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="Apartamento">Apartamento</option>
                        <option value="Casa">Casa</option>
                        <option value="Cobertura">Cobertura</option>
                        <option value="Studio">Studio</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quartos">Número de Quartos</Label>
                      <select
                        id="quartos"
                        value={formData.preferencias.quartos}
                        onChange={(e) => setFormData({
                          ...formData,
                          preferencias: { ...formData.preferencias, quartos: e.target.value }
                        })}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="1">1 quarto</option>
                        <option value="2">2 quartos</option>
                        <option value="2+">2+ quartos</option>
                        <option value="3">3 quartos</option>
                        <option value="3+">3+ quartos</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="faixaPreco">Faixa de Preço</Label>
                      <Input
                        id="faixaPreco"
                        value={formData.preferencias.faixaPreco}
                        onChange={(e) => setFormData({
                          ...formData,
                          preferencias: { ...formData.preferencias, faixaPreco: e.target.value }
                        })}
                        placeholder="Ex: R$ 300.000 - R$ 500.000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bairros">Bairros de Interesse</Label>
                      <Input
                        id="bairros"
                        value={formData.preferencias.bairros}
                        onChange={(e) => setFormData({
                          ...formData,
                          preferencias: { ...formData.preferencias, bairros: e.target.value }
                        })}
                        placeholder="Separe por vírgula"
                      />
                      <p className="text-xs text-gray-500">Ex: Centro, Bela Vista, Consolação</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="caracteristicas">Características Desejadas</Label>
                      <Input
                        id="caracteristicas"
                        value={formData.preferencias.caracteristicas}
                        onChange={(e) => setFormData({
                          ...formData,
                          preferencias: { ...formData.preferencias, caracteristicas: e.target.value }
                        })}
                        placeholder="Separe por vírgula"
                      />
                      <p className="text-xs text-gray-500">Ex: Aceita financiamento, Proximo ao metrô, Com vaga</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Observações */}
              <Card>
                <CardHeader>
                  <CardTitle>Observações</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="observacoes">Observações Internas</Label>
                    <textarea
                      id="observacoes"
                      value={formData.observacoes}
                      onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                      rows={4}
                      className="w-full p-2 border rounded-md"
                      placeholder="Adicione observações importantes sobre este contato..."
                    />
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>
        </div>

        <UnsavedChangesModal
          open={showModal}
          onConfirm={handleConfirm}
          onCancel={handleUnsavedChangesCancel}
        />
      </div>
    </div>
  );
}
