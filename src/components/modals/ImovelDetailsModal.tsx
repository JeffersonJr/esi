import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  ExternalLink,
  Share2,
  Mail,
  MessageCircle,
  Users,
  Link as LinkIcon,
  Copy,
} from 'lucide-react';

interface Imovel {
  id: string;
  titulo: string;
  tipo: string;
  endereco: string;
  valor: string;
  quartos: number;
  banheiros: number;
  area: string;
  status: string;
  imagem: string;
}

interface ImovelDetailsModalProps {
  imovel: Imovel | null;
  open: boolean;
  onClose: () => void;
}

const clientesInteressados = [
  { id: 1, nome: 'Maria Santos', email: 'maria@email.com', telefone: '11 99999-0001', interesse: 'Alto' },
  { id: 2, nome: 'João Silva', email: 'joao@email.com', telefone: '11 99999-0003', interesse: 'Médio' },
  { id: 3, nome: 'Ana Costa', email: 'ana@email.com', telefone: '11 99999-0004', interesse: 'Alto' },
];

export function ImovelDetailsModal({ imovel, open, onClose }: ImovelDetailsModalProps) {
  if (!imovel) return null;

  const linkSite = `https://seusite.com.br/imovel/${imovel.id}`;
  const linkLanding = `https://seusite.com.br/lp/${imovel.id}`;

  const copiarLink = (link: string) => {
    navigator.clipboard.writeText(link);
    alert('Link copiado para área de transferência!');
  };

  const enviarEmail = (email: string) => {
    console.log('Enviando email para:', email);
    alert(`Abrindo editor de email para ${email}`);
  };

  const enviarWhatsApp = (telefone: string) => {
    const mensagem = encodeURIComponent(`Olá! Gostaria de saber mais sobre o imóvel: ${imovel.titulo}`);
    window.open(`https://wa.me/55${telefone.replace(/\D/g, '')}?text=${mensagem}`, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{imovel.titulo}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="aspect-video relative overflow-hidden rounded-lg">
              <img
                src={imovel.imagem}
                alt={imovel.titulo}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <Badge className="bg-primary text-primary-foreground">
                  {imovel.tipo}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-3xl font-bold text-primary">{imovel.valor}</div>
              
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>{imovel.endereco}</span>
              </div>

              <div className="flex gap-6 py-4 border-y border-border">
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{imovel.quartos} quartos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{imovel.banheiros} banheiros</span>
                </div>
                <div className="flex items-center gap-2">
                  <Maximize className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{imovel.area}</span>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="links" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="links">
                <LinkIcon className="h-4 w-4 mr-2" />
                Links
              </TabsTrigger>
              <TabsTrigger value="interessados">
                <Users className="h-4 w-4 mr-2" />
                Interessados
              </TabsTrigger>
            </TabsList>

            <TabsContent value="links" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Links para Compartilhamento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Página do Site</div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={linkSite}
                        readOnly
                        className="flex-1 px-3 py-2 text-sm bg-muted rounded-md"
                      />
                      <Button size="sm" variant="outline" onClick={() => copiarLink(linkSite)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => window.open(linkSite, '_blank')}>
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Landing Page</div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={linkLanding}
                        readOnly
                        className="flex-1 px-3 py-2 text-sm bg-muted rounded-md"
                      />
                      <Button size="sm" variant="outline" onClick={() => copiarLink(linkLanding)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => window.open(linkLanding, '_blank')}>
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="text-sm font-medium mb-3">Compartilhar em:</div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 gap-2">
                        <Share2 className="h-4 w-4" />
                        Facebook
                      </Button>
                      <Button variant="outline" className="flex-1 gap-2">
                        <Share2 className="h-4 w-4" />
                        Instagram
                      </Button>
                      <Button variant="outline" className="flex-1 gap-2">
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="interessados" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Clientes Interessados ({clientesInteressados.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {clientesInteressados.map((cliente) => (
                    <Card key={cliente.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                              {cliente.nome.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="font-medium">{cliente.nome}</div>
                              <Badge
                                variant="outline"
                                className={
                                  cliente.interesse === 'Alto'
                                    ? 'border-success text-success'
                                    : 'border-warning text-warning'
                                }
                              >
                                {cliente.interesse}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground truncate">{cliente.email}</div>
                            <div className="text-sm text-muted-foreground">{cliente.telefone}</div>
                            <div className="flex gap-2 mt-3">
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-2"
                                onClick={() => enviarEmail(cliente.email)}
                              >
                                <Mail className="h-3 w-3" />
                                Email
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-2"
                                onClick={() => enviarWhatsApp(cliente.telefone)}
                              >
                                <MessageCircle className="h-3 w-3" />
                                WhatsApp
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
