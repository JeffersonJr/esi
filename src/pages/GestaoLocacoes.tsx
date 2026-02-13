import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Home, Users, Calendar, DollarSign, FileText, Plus, Search, Filter, Eye, Edit, Trash2, MoreVertical, CheckCircle, AlertCircle, Clock, TrendingUp, Download, Building, User, Mail, Phone, MapPin } from 'lucide-react';

const contratos = [
  {
    id: '1',
    imovel: 'Apartamento 2 Quartos - Centro',
    imovelId: '1',
    inquilino: 'Maria Santos',
    inquilinoId: '1',
    proprietario: 'João Silva',
    proprietarioId: '1',
    valorAluguel: 'R$ 1.800',
    valorCondominio: 'R$ 320',
    valorIPTU: 'R$ 85',
    dataInicio: '01/01/2024',
    dataFim: '31/12/2024',
    status: 'Ativo',
    proximoVencimento: '05/01/2025',
    diaVencimento: 5,
  },
];

const imoveisDisponiveis = [
  { id: '1', titulo: 'Apartamento 2 Quartos - Centro', endereco: 'Rua das Flores, 123', valorAluguel: 'R$ 1.800' },
  { id: '2', titulo: 'Casa 3 Quartos - Jardim América', endereco: 'Av. Brasil, 456', valorAluguel: 'R$ 2.500' },
];

const inquilinos = [
  { id: '1', nome: 'Maria Santos', email: 'maria@email.com', telefone: '(11) 99999-0001', cpf: '123.456.789-00' },
  { id: '2', nome: 'Carlos Oliveira', email: 'carlos@email.com', telefone: '(11) 88888-0002', cpf: '987.654.321-00' },
];

export function GestaoLocacoes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNovoContratoModal, setShowNovoContratoModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState('ativos');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestão de Locações</h1>
            <p className="text-gray-600 mt-1">Controle completo de contratos de aluguel</p>
          </div>
          <Button onClick={() => setShowNovoContratoModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Contrato
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contratos Ativos</CardTitle>
              <Home className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-gray-600">3 vencem este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faturamento Mensal</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 43.200</div>
              <p className="text-xs text-gray-600">+5,2% vs mês anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Ocupação</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-gray-600">2 imóveis disponíveis</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inadimplência</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4,2%</div>
              <p className="text-xs text-gray-600">1 contrato em atraso</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="contratos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="contratos">Contratos</TabsTrigger>
            <TabsTrigger value="vencimentos">Vencimentos</TabsTrigger>
            <TabsTrigger value="manutencao">Manutenção</TabsTrigger>
            <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="contratos" className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar contratos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Imóvel</TableHead>
                    <TableHead>Inquilino</TableHead>
                    <TableHead>Proprietário</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contratos.map((contrato) => (
                    <TableRow key={contrato.id}>
                      <TableCell className="font-medium">{contrato.imovel}</TableCell>
                      <TableCell>{contrato.inquilino}</TableCell>
                      <TableCell>{contrato.proprietario}</TableCell>
                      <TableCell>{contrato.valorAluguel}</TableCell>
                      <TableCell>{contrato.proximoVencimento}</TableCell>
                      <TableCell>
                        <Badge variant="default">{contrato.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal Novo Contrato */}
      <Dialog open={showNovoContratoModal} onOpenChange={setShowNovoContratoModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Criar Novo Contrato de Locação</DialogTitle>
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
                        {imovel.titulo} - {imovel.valorAluguel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="inquilino">Inquilino</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o inquilino" />
                  </SelectTrigger>
                  <SelectContent>
                    {inquilinos.map((inquilino) => (
                      <SelectItem key={inquilino.id} value={inquilino.id}>
                        {inquilino.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataInicio">Data de Início</Label>
                <Input id="dataInicio" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataFim">Data de Término</Label>
                <Input id="dataFim" type="date" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="valorAluguel">Valor Aluguel</Label>
                <Input id="valorAluguel" placeholder="R$ 0,00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valorCondominio">Condomínio</Label>
                <Input id="valorCondominio" placeholder="R$ 0,00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valorIPTU">IPTU</Label>
                <Input id="valorIPTU" placeholder="R$ 0,00" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="diaVencimento">Dia de Vencimento</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o dia" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 31 }, (_, i) => (
                      <SelectItem key={i + 1} value={String(i + 1)}>
                        Dia {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="garantia">Tipo de Garantia</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fiador">Fiador</SelectItem>
                    <SelectItem value="seguro">Seguro Fiança</SelectItem>
                    <SelectItem value="caucao">Caução</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Input id="observacoes" placeholder="Observações do contrato" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNovoContratoModal(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setShowNovoContratoModal(false)}>
              Criar Contrato
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
