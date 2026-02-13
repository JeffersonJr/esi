import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  Edit, 
  Mail, 
  Phone, 
  MapPin, 
  Building,
  Home,
  Calendar,
  User,
  Star,
  MessageCircle
} from 'lucide-react';

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

const mockImoveisPerfil = [
  {
    id: '1',
    titulo: 'Apartamento 2 Quartos - Centro',
    tipo: 'Apartamento',
    valor: 'R$ 350.000',
    bairro: 'Centro',
    quartos: 2,
    suites: 1,
    banheiros: 2,
    area: '85m²',
    imagem: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
    match: 95
  },
  {
    id: '2',
    titulo: 'Apartamento 3 Quartos - Bela Vista',
    tipo: 'Apartamento',
    valor: 'R$ 420.000',
    bairro: 'Bela Vista',
    quartos: 3,
    suites: 2,
    banheiros: 2,
    area: '110m²',
    imagem: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
    match: 88
  },
  {
    id: '3',
    titulo: 'Studio Compacto - Consolação',
    tipo: 'Studio',
    valor: 'R$ 280.000',
    bairro: 'Consolação',
    quartos: 1,
    suites: 0,
    banheiros: 1,
    area: '45m²',
    imagem: 'https://images.unsplash.com/photo-1600566753376-12c8cc7a9350?w=400&h=300&fit=crop',
    match: 75
  }
];

export default function ContatoPerfil() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);

  const enviarWhatsApp = (telefone: string) => {
    const mensagem = encodeURIComponent(`Olá ${mockContato.nome}! Tudo bem? Sou da imobiliária e gostaria de falar com você.`);
    window.open(`https://wa.me/55${telefone.replace(/\D/g, '')}?text=${mensagem}`, '_blank');
  };

  const enviarEmail = (email: string) => {
    const assunto = encodeURIComponent(`Contato da Imobiliária - ${mockContato.nome}`);
    const corpo = encodeURIComponent(`Olá ${mockContato.nome},\n\nTudo bem? Sou da imobiliária e estou entrando em contato para...\n\nAtenciosamente,\nEquipe da Imobiliária`);
    window.location.href = `mailto:${email}?subject=${assunto}&body=${corpo}`;
  };

  const enviarWhatsAppImoveis = () => {
    const imoveisSelecionados = mockImoveisPerfil.filter(imovel => selectedProperties.includes(imovel.id));
    const mensagem = encodeURIComponent(`Olá ${mockContato.nome}! Tudo bem? Sou da imobiliária e encontrei alguns imóveis que podem te interessar:\n\n${imoveisSelecionados.map(imovel => `• ${imovel.titulo} - ${imovel.valor}\n  ${imovel.bairro} - ${imovel.area}\n`).join('\n')}\nGostaria de saber mais sobre algum deles?`);
    window.open(`https://wa.me/55${mockContato.telefone.replace(/\D/g, '')}?text=${mensagem}`, '_blank');
  };

  const enviarEmailImoveis = () => {
    const imoveisSelecionados = mockImoveisPerfil.filter(imovel => selectedProperties.includes(imovel.id));
    const assunto = encodeURIComponent(`Imóveis que podem te interessar - ${mockContato.nome}`);
    const corpo = encodeURIComponent(`Olá ${mockContato.nome},\n\nTudo bem? Sou da imobiliária e encontrei alguns imóveis que podem te interessar:\n\n${imoveisSelecionados.map(imovel => `• ${imovel.titulo} - ${imovel.valor}\n  ${imovel.bairro} - ${imovel.area}\n`).join('\n')}\nGostaria de agendar uma visita para conhecer algum deles?\n\nAtenciosamente,\nEquipe da Imobiliária`);
    window.location.href = `mailto:${mockContato.email}?subject=${assunto}&body=${corpo}`;
  };

  const togglePropertySelection = (propertyId: string) => {
    setSelectedProperties(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };
  const [activeTab, setActiveTab] = useState('informacoes');

  const contato = mockContato; // In a real app, fetch based on id

  const handleEdit = () => {
    navigate(`/contatos/editar/${id}`);
  };

  const getMatchColor = (match: number) => {
    if (match >= 90) return 'bg-green-100 text-green-800 border-green-200';
    if (match >= 75) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/contatos')} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{contato.nome}</h1>
              <p className="text-sm text-gray-500">Perfil do Contato</p>
            </div>
          </div>
          
          <Button onClick={handleEdit} className="gap-2">
            <Edit className="h-4 w-4" />
            Editar Contato
          </Button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-lg border">
              <div className="flex border-b">
                <button
                  className={`px-6 py-3 font-medium text-sm ${
                    activeTab === 'informacoes'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('informacoes')}
                >
                  Informações
                </button>
                <button
                  className={`px-6 py-3 font-medium text-sm ${
                    activeTab === 'imoveis'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('imoveis')}
                >
                  Imóveis do Perfil ({mockImoveisPerfil.length})
                </button>
              </div>

              <div className="p-6">
                {activeTab === 'informacoes' && (
                  <div className="space-y-6">
                    {/* Informações Pessoais */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Informações Pessoais</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{contato.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Telefone</p>
                            <p className="font-medium">{contato.telefone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Cidade de Interesse</p>
                            <p className="font-medium">{contato.cidade}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Data de Cadastro</p>
                            <p className="font-medium">{contato.dataCadastro}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Preferências */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Preferências de Imóvel</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Tipo de Imóvel</p>
                          <Badge variant="secondary">{contato.preferencias.tipoImovel}</Badge>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Quartos</p>
                          <Badge variant="secondary">{contato.preferencias.quartos}</Badge>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Faixa de Preço</p>
                          <Badge variant="secondary">{contato.preferencias.faixaPreco}</Badge>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Bairros de Interesse</p>
                          <div className="flex flex-wrap gap-1">
                            {contato.preferencias.bairros.map((bairro, index) => (
                              <Badge key={index} variant="outline">{bairro}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-gray-500 mb-2">Características Desejadas</p>
                        <div className="flex flex-wrap gap-2">
                          {contato.preferencias.caracteristicas.map((caracteristica, index) => (
                            <Badge key={index} variant="outline">{caracteristica}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Observações */}
                    {contato.observacoes && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Observações</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-700">{contato.observacoes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'imoveis' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Imóveis que se encaixam no perfil</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          {selectedProperties.length} selecionados
                        </span>
                        {selectedProperties.length > 0 && (
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={enviarWhatsAppImoveis}
                              className="gap-2"
                            >
                              <MessageCircle className="h-4 w-4" />
                              WhatsApp
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={enviarEmailImoveis}
                              className="gap-2"
                            >
                              <Mail className="h-4 w-4" />
                              Email
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-4">
                      {mockImoveisPerfil.map((imovel) => (
                        <Card key={imovel.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={selectedProperties.includes(imovel.id)}
                                  onChange={() => togglePropertySelection(imovel.id)}
                                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                              </div>
                              <img 
                                src={imovel.imagem} 
                                alt={imovel.titulo}
                                className="w-24 h-24 rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => window.open(`/imoveis/detalhes/${imovel.id}`, '_blank')}
                              />
                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-semibold cursor-pointer hover:text-blue-600 transition-colors" 
                                        onClick={() => window.open(`/imoveis/detalhes/${imovel.id}`, '_blank')}>
                                      {imovel.titulo}
                                    </h4>
                                    <p className="text-lg font-bold text-blue-600">{imovel.valor}</p>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                      <MapPin className="h-3 w-3" />
                                      {imovel.bairro}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <Badge className={getMatchColor(imovel.match)}>
                                      <Star className="h-3 w-3 mr-1" />
                                      {imovel.match}% match
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex gap-4 text-sm text-gray-600 mt-3">
                                  <span>{imovel.quartos} quartos</span>
                                  <span>{imovel.suites} suítes</span>
                                  <span>{imovel.banheiros} banheiros</span>
                                  <span>{imovel.area}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xl">
                      {contato.nome.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg">{contato.nome}</h3>
                  <Badge 
                    variant={contato.tipo === 'Cliente' ? 'default' : 'secondary'}
                    className="mt-2"
                  >
                    {contato.tipo}
                  </Badge>
                  <Badge 
                    variant="outline"
                    className={
                      contato.status === 'Ativo'
                        ? 'border-success text-success mt-2'
                        : 'border-muted-foreground text-muted-foreground mt-2'
                    }
                  >
                    {contato.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Ações Rápidas</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full gap-2" onClick={() => enviarEmail(contato.email)}>
                    <Mail className="h-4 w-4" />
                    Enviar Email
                  </Button>
                  <Button variant="outline" className="w-full gap-2" onClick={() => enviarWhatsApp(contato.telefone)}>
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </Button>
                  <Button variant="outline" className="w-full gap-2" onClick={() => navigate('/imoveis?proprietario=' + contato.id)}>
                    <Building className="h-4 w-4" />
                    Ver Todos os Imóveis
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
