import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Home, Users, Calendar, DollarSign, FileText, Plus, Search, Filter, Eye, Edit, Trash2, MoreVertical, CheckCircle, AlertCircle, Clock, TrendingUp, Download } from 'lucide-react';

const contratos = [
  {
    id: '1',
    imovel: 'Apartamento 2 Quartos - Centro',
    inquilino: 'Maria Santos',
    proprietario: 'João Silva',
    valorAluguel: 'R$ 1.800',
    dataInicio: '01/01/2024',
    dataFim: '31/12/2024',
    status: 'Ativo',
    proximoVencimento: '05/01/2025',
    diaVencimento: 5,
  },
];

export function GestaoLocacoes() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestão de Locações</h1>
            <p className="text-gray-600 mt-1">Controle completo de contratos de aluguel</p>
          </div>
          <Button>
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
    </div>
  );
}
