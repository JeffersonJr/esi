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
  MessageCircle,
  Briefcase,
  Layers,
  Heart
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

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
    <div className="min-h-screen bg-background space-y-6 animate-fade-in">
      <div className="px-6 py-4">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/contatos">Contatos</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{contato.nome}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/contatos')} className="group pr-4">
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-black tracking-tight">{contato.nome}</h1>
              <p className="text-sm text-muted-foreground font-medium">Informações detalhadas do cliente</p>
            </div>
          </div>

          <Button onClick={handleEdit} className="gap-2 shadow-lg shadow-primary/20">
            <Edit className="h-4 w-4" />
            Editar Perfil
          </Button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
              <div className="flex bg-muted/30 p-1 m-1 rounded-xl gap-1">
                <button
                  className={cn(
                    "flex-1 px-4 py-2.5 font-bold text-xs uppercase tracking-widest transition-all rounded-lg",
                    activeTab === 'informacoes'
                      ? "bg-background text-primary shadow-sm"
                      : "text-muted-foreground hover:bg-background/50"
                  )}
                  onClick={() => setActiveTab('informacoes')}
                >
                  Informações
                </button>
                <button
                  className={cn(
                    "flex-1 px-4 py-2.5 font-bold text-xs uppercase tracking-widest transition-all rounded-lg",
                    activeTab === 'imoveis'
                      ? "bg-background text-primary shadow-sm"
                      : "text-muted-foreground hover:bg-background/50"
                  )}
                  onClick={() => setActiveTab('imoveis')}
                >
                  Imóveis Recomendados ({mockImoveisPerfil.length})
                </button>
              </div>

              <div className="p-6">
                {activeTab === 'informacoes' && (
                  <div className="space-y-8">
                    {/* Informações Pessoais */}
                    <section>
                      <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                        <User className="h-4 w-4 opacity-50" />
                        Informações Principais
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/20 border border-border/40">
                          <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center shadow-sm">
                            <Mail className="h-4 w-4 text-primary/60" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Email</p>
                            <p className="text-sm font-bold">{contato.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/20 border border-border/40">
                          <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center shadow-sm">
                            <Phone className="h-4 w-4 text-primary/60" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Telefone</p>
                            <p className="text-sm font-bold">{contato.telefone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/20 border border-border/40">
                          <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center shadow-sm">
                            <MapPin className="h-4 w-4 text-primary/60" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Cidade Principal</p>
                            <p className="text-sm font-bold">{contato.cidade}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/20 border border-border/40">
                          <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center shadow-sm">
                            <Calendar className="h-4 w-4 text-primary/60" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Membro desde</p>
                            <p className="text-sm font-bold">{contato.dataCadastro}</p>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Preferências */}
                    <section>
                      <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                        <Layers className="h-4 w-4 opacity-50" />
                        Preferências de Busca
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-background border border-border/50">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-2">Interesse Imobiliário</p>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold">{contato.preferencias.tipoImovel}</Badge>
                            <Badge variant="secondary" className="bg-accent/10 text-accent-foreground border-none font-bold">{contato.preferencias.quartos} Quartos</Badge>
                          </div>
                        </div>
                        <div className="p-4 rounded-xl bg-background border border-border/50">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-2">Orçamento Previsto</p>
                          <Badge variant="outline" className="text-primary font-black border-primary/20 bg-primary/5">{contato.preferencias.faixaPreco}</Badge>
                        </div>
                        <div className="p-4 rounded-xl bg-background border border-border/50">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-2">Bairros Prioritários</p>
                          <div className="flex flex-wrap gap-1">
                            {contato.preferencias.bairros.map((bairro, index) => (
                              <Badge key={index} variant="secondary" className="bg-muted text-muted-foreground font-medium">{bairro}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="p-4 rounded-xl bg-background border border-border/50">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-2">Exigências Específicas</p>
                          <div className="flex flex-wrap gap-1">
                            {contato.preferencias.caracteristicas.map((caracteristica, index) => (
                              <Badge key={index} variant="outline" className="border-border/50 text-[10px]">{caracteristica}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Observações */}
                    {contato.observacoes && (
                      <section>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                          <MessageCircle className="h-4 w-4 opacity-50" />
                          Notas e Observações
                        </h3>
                        <div className="bg-muted/30 p-5 rounded-2xl border border-border/40 relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-1 h-full bg-primary/40"></div>
                          <p className="text-foreground/80 leading-relaxed font-medium italic">{contato.observacoes}</p>
                        </div>
                      </section>
                    )}
                  </div>
                )}

                {activeTab === 'imoveis' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/20 p-4 rounded-2xl border border-border/40 mb-6">
                      <div>
                        <h3 className="font-black text-xl tracking-tight">Imóveis Compatíveis</h3>
                        <p className="text-xs text-muted-foreground font-medium">Baseado no perfil de interesse de {contato.nome}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {selectedProperties.length > 0 && (
                          <div className="flex gap-2 animate-in fade-in slide-in-from-right-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={enviarWhatsAppImoveis}
                              className="gap-2 bg-background border-none shadow-sm font-bold text-[10px] uppercase h-8"
                            >
                              <MessageCircle className="h-3.5 w-3.5 text-success" />
                              WhatsApp
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={enviarEmailImoveis}
                              className="gap-2 bg-background border-none shadow-sm font-bold text-[10px] uppercase h-8"
                            >
                              <Mail className="h-3.5 w-3.5 text-primary" />
                              Email
                            </Button>
                          </div>
                        )}
                        <Badge variant="secondary" className="h-8 px-4 font-black bg-primary text-primary-foreground border-none">
                          {selectedProperties.length} selecionado{selectedProperties.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid gap-4">
                      {mockImoveisPerfil.map((imovel) => (
                        <motion.div
                          key={imovel.id}
                          whileHover={{ y: -2 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Card className={cn(
                            "group transition-all cursor-pointer overflow-hidden border-border/50 shadow-none hover:shadow-md hover:border-primary/20",
                            selectedProperties.includes(imovel.id) && "bg-primary/[0.02] border-primary/30 shadow-sm"
                          )}>
                            <CardContent className="p-0">
                              <div className="flex flex-col sm:flex-row gap-0 sm:gap-4">
                                <div className="relative w-full sm:w-48 h-32 overflow-hidden">
                                  <img
                                    src={imovel.imagem}
                                    alt={imovel.titulo}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                  />
                                  <div className="absolute top-2 left-2">
                                    <div
                                      className={cn(
                                        "h-6 w-6 rounded-md border flex items-center justify-center transition-all bg-background/80 backdrop-blur-sm",
                                        selectedProperties.includes(imovel.id) ? "bg-primary border-primary text-primary-foreground" : "border-white/20"
                                      )}
                                      onClick={(e) => { e.stopPropagation(); togglePropertySelection(imovel.id); }}
                                    >
                                      {selectedProperties.includes(imovel.id) && <Star className="h-3 w-3 fill-current" />}
                                    </div>
                                  </div>
                                  <div className="absolute bottom-2 right-2">
                                    <Badge className={cn(
                                      "font-black text-[10px] border-none px-2 py-0.5 shadow-lg",
                                      imovel.match >= 90 ? 'bg-success text-success-foreground' : 'bg-warning text-warning-foreground'
                                    )}>
                                      {imovel.match}% Match
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex-1 p-4 flex flex-col justify-between">
                                  <div>
                                    <h4 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                      {imovel.titulo}
                                    </h4>
                                    <div className="flex items-center justify-between mt-1">
                                      <p className="text-lg font-black text-primary">{imovel.valor}</p>
                                      <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                                        <MapPin className="h-3 w-3" />
                                        {imovel.bairro}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-4 opacity-70">
                                    <span className="flex items-center gap-1"><Home className="h-3 w-3" /> {imovel.area}</span>
                                    <span className="flex items-center gap-1">🛌 {imovel.quartos}</span>
                                    <Badge variant="outline" className="ml-auto border-none bg-muted/60 text-[9px] h-5">{imovel.tipo}</Badge>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
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
            {/* Status Card */}
            <Card className="border-none shadow-lg overflow-hidden relative group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></div>
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <Avatar className="w-24 h-24 mx-auto border-4 border-background shadow-xl">
                      <AvatarFallback className="bg-primary/5 text-primary text-2xl font-black">
                        {contato.nome.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-1 right-1 h-6 w-6 bg-success border-4 border-background rounded-full"></div>
                  </div>
                  <h3 className="font-black text-xl tracking-tight">{contato.nome}</h3>
                  <div className="flex flex-col gap-2 mt-4">
                    <Badge variant="secondary" className="w-full justify-center h-7 font-bold bg-primary/10 text-primary border-none text-[10px] uppercase tracking-widest">
                      {contato.tipo}
                    </Badge>
                    <Badge variant="outline" className={cn(
                      "w-full justify-center h-7 font-bold border-none text-[10px] uppercase tracking-widest",
                      contato.status === 'Ativo' ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                    )}>
                      {contato.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-none shadow-sm bg-muted/30">
              <CardContent className="p-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-foreground mb-6">Canal Direto</h3>
                <div className="space-y-3">
                  <Button className="w-full justify-between h-12 bg-white text-foreground hover:bg-white/90 border border-border/50 group shadow-sm transition-all" onClick={() => enviarEmail(contato.email)}>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-primary transition-colors">
                        <Mail className="h-4 w-4 text-primary group-hover:text-white transition-colors" />
                      </div>
                      <span className="font-bold text-xs uppercase tracking-wider">E-mail Corporativo</span>
                    </div>
                    <ArrowLeft className="h-4 w-4 rotate-180 opacity-20" />
                  </Button>

                  <Button className="w-full justify-between h-12 bg-success text-white hover:bg-success/90 group shadow-lg shadow-success/20 transition-all border-none" onClick={() => enviarWhatsApp(contato.telefone)}>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-black/10 flex items-center justify-center">
                        <MessageCircle className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-bold text-xs uppercase tracking-wider">WhatsApp Lead</span>
                    </div>
                    <ArrowLeft className="h-4 w-4 rotate-180 opacity-50" />
                  </Button>

                  <div className="pt-4 mt-2 border-t border-border/50">
                    <Button variant="ghost" className="w-full justify-between h-10 text-muted-foreground hover:text-primary group" onClick={() => navigate('/imoveis?proprietario=' + contato.id)}>
                      <div className="flex items-center gap-3">
                        <Building className="h-4 w-4 opacity-50 group-hover:opacity-100" />
                        <span className="font-bold text-[10px] uppercase tracking-widest">Ver Portfólio</span>
                      </div>
                      <ArrowLeft className="h-3 w-3 rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
