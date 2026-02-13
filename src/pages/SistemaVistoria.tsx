import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Camera, Plus, Search, Filter, Calendar, MapPin, Home, CheckCircle, AlertCircle, Clock, FileText, Download, Upload, Eye, Edit, Trash2, MoreVertical, Star, MessageSquare, Image as ImageIcon } from 'lucide-react';

const vistorias = [
  {
    id: '1',
    imovel: 'Apartamento 2 Quartos - Centro',
    imovelId: '1',
    tipo: 'Entrada',
    inquilino: 'Maria Santos',
    proprietario: 'João Silva',
    dataAgendada: '20/01/2025',
    status: 'Agendado',
    vistoriador: 'Pedro Santos',
    endereco: 'Rua das Flores, 123 - Centro, São Paulo',
  },
];

const imoveisDisponiveis = [
  { id: '1', titulo: 'Apartamento 2 Quartos - Centro', endereco: 'Rua das Flores, 123' },
  { id: '2', titulo: 'Casa 3 Quartos - Jardim América', endereco: 'Av. Brasil, 456' },
];

const vistoriadores = [
  { id: '1', nome: 'Pedro Santos', especialidade: 'Geral', status: 'Disponível' },
  { id: '2', nome: 'Ana Oliveira', especialidade: 'Elétrica', status: 'Ocupado' },
];

export function SistemaVistoria() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNovaVistoriaModal, setShowNovaVistoriaModal] = useState(false);
  const [showEditarVistoriaModal, setShowEditarVistoriaModal] = useState(false);
  const [selectedVistoria, setSelectedVistoria] = useState(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Agendado': return 'bg-blue-100 text-blue-800';
      case 'Em andamento': return 'bg-yellow-100 text-yellow-800';
      case 'Concluído': return 'bg-green-100 text-green-800';
      case 'Cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Entrada': return 'bg-green-100 text-green-800 border-green-200';
      case 'Saída': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Manutenção': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sistema de Vistoria</h1>
            <p className="text-gray-600 mt-1">Gestão completa de vistorias de imóveis</p>
          </div>
          <Button onClick={() => setShowNovaVistoriaModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Vistoria
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vistorias Agendadas</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-gray-600">3 esta semana</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-gray-600">Hoje</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-gray-600">Este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa Aprovação</CardTitle>
              <Star className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-gray-600">+3% vs mês anterior</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="vistorias" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="vistorias">Vistorias</TabsTrigger>
            <TabsTrigger value="checklist">Checklist</TabsTrigger>
            <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
            <TabsTrigger value="galeria">Galeria</TabsTrigger>
          </TabsList>

          <TabsContent value="vistorias" className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar vistorias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vistorias.map((vistoria) => (
                <Card key={vistoria.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center space-x-2">
                      <Home className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-lg">{vistoria.imovel}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getTipoColor(vistoria.tipo)}>
                        {vistoria.tipo}
                      </Badge>
                      <Badge className={getStatusColor(vistoria.status)}>
                        {vistoria.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{vistoria.endereco}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Inquilino:</span>
                        <span className="font-medium">{vistoria.inquilino}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Proprietário:</span>
                        <span className="font-medium">{vistoria.proprietario}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Data:</span>
                        <span className="font-medium">{vistoria.dataAgendada}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">PS</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-600">{vistoria.vistoriador}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedVistoria(vistoria);
                            setShowEditarVistoriaModal(true);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver
                        </Button>
                        <Button variant="outline" size="sm">
                          <Camera className="h-4 w-4 mr-2" />
                          Fotos
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="checklist" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Checklist de Entrada</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    'Paredes e tetos - sem rachaduras ou umidade',
                    'Pisos - em bom estado de conservação',
                    'Portas e janelas - funcionando corretamente',
                    'Instalações elétricas - seguras e funcionando',
                    'Instalações hidráulicas - sem vazamentos',
                    'Cozinha - armários e eletrodomésticos',
                    'Banheiros - louças e metais em bom estado',
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <label className="text-sm">{item}</label>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    <span>Checklist de Saída</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    'Limpeza geral - imóvel limpo e conservado',
                    'Pintura - sem danos ou desbotamento',
                    'Azulejos e pisos - intactos e limpos',
                    'Metais e louças - sem quebras ou ferrugem',
                    'Armários e gavetas - funcionando corretamente',
                    'Chaves - todas entregues',
                    'Documentação - assinada e completa',
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <label className="text-sm">{item}</label>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="galeria" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
                <Card key={item} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-gray-100 relative">
                    <ImageIcon className="absolute inset-0 m-auto h-8 w-8 text-gray-400" />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="text-xs">
                        Foto {item}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal Nova Vistoria */}
      <Dialog open={showNovaVistoriaModal} onOpenChange={setShowNovaVistoriaModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Nova Vistoria</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="imovel">Imóvel</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o imóvel" />
                  </SelectTrigger>
                  <SelectContent>
                    {imoveisDisponiveis.map((imovel) => (
                      <SelectItem key={imovel.id} value={imovel.id}>
                        {imovel.titulo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Vistoria</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrada">Entrada</SelectItem>
                    <SelectItem value="saida">Saída</SelectItem>
                    <SelectItem value="manutencao">Manutenção</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data">Data Agendada</Label>
                <Input id="data" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vistoriador">Vistoriador</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o vistoriador" />
                  </SelectTrigger>
                  <SelectContent>
                    {vistoriadores.map((vistoriador) => (
                      <SelectItem key={vistoriador.id} value={vistoriador.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{vistoriador.nome}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">{vistoriador.especialidade}</span>
                            <Badge variant={vistoriador.status === 'Disponível' ? 'default' : 'secondary'}>
                              {vistoriador.status}
                            </Badge>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="inquilino">Inquilino</Label>
                <Input id="inquilino" placeholder="Nome do inquilino" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="proprietario">Proprietário</Label>
                <Input id="proprietario" placeholder="Nome do proprietário" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Input id="observacoes" placeholder="Observações da vistoria" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNovaVistoriaModal(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setShowNovaVistoriaModal(false)}>
              Agendar Vistoria
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Editar Vistoria */}
      <Dialog open={showEditarVistoriaModal} onOpenChange={setShowEditarVistoriaModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Vistoria</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Vistoria</Label>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">{selectedVistoria?.imovel}</p>
                <p className="text-sm text-gray-600">{selectedVistoria?.dataAgendada}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-data">Nova Data</Label>
                <Input id="edit-data" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agendado">Agendado</SelectItem>
                    <SelectItem value="em-andamento">Em andamento</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-vistoriador">Vistoriador</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o vistoriador" />
                </SelectTrigger>
                <SelectContent>
                  {vistoriadores.map((vistoriador) => (
                    <SelectItem key={vistoriador.id} value={vistoriador.id}>
                      {vistoriador.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-observacoes">Observações</Label>
              <Input id="edit-observacoes" placeholder="Observações da vistoria" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditarVistoriaModal(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setShowEditarVistoriaModal(false)}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
