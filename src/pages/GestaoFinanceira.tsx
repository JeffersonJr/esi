import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, TrendingUp, TrendingDown, Plus, Search, Filter, Download, Calendar, FileText, CreditCard, PiggyBank, Receipt, AlertCircle, CheckCircle } from 'lucide-react';

const transacoes = [
  {
    id: '1',
    descricao: 'Aluguel - Apt 302',
    categoria: 'Receita',
    valor: 'R$ 1.800,00',
    data: '05/01/2025',
    status: 'Pago',
    tipo: 'Entrada',
  },
];

export function GestaoFinanceira() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestão Financeira</h1>
            <p className="text-gray-600 mt-1">Controle completo das finanças da imobiliária</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Transação
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receitas do Mês</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 45.678,90</div>
              <p className="text-xs text-gray-600">+12,5% vs mês anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Despesas do Mês</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 12.345,67</div>
              <p className="text-xs text-gray-600">-3,1% vs mês anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Líquido</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 33.333,23</div>
              <p className="text-xs text-gray-600">73% de margem</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contas a Pagar</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 8.456,32</div>
              <p className="text-xs text-gray-600">5 vencem esta semana</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transacoes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="transacoes">Transações</TabsTrigger>
            <TabsTrigger value="contas">Contas a Pagar</TabsTrigger>
            <TabsTrigger value="receber">Contas a Receber</TabsTrigger>
            <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="transacoes" className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar transações..."
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

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transacoes.map((transacao) => (
                    <TableRow key={transacao.id}>
                      <TableCell>{transacao.data}</TableCell>
                      <TableCell className="font-medium">{transacao.descricao}</TableCell>
                      <TableCell>{transacao.categoria}</TableCell>
                      <TableCell>
                        <Badge variant={transacao.tipo === 'Entrada' ? 'default' : 'secondary'}>
                          {transacao.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell className={transacao.tipo === 'Entrada' ? 'text-green-600' : 'text-red-600'}>
                        {transacao.tipo === 'Entrada' ? '+' : '-'} {transacao.valor}
                      </TableCell>
                      <TableCell>
                        <Badge variant={transacao.status === 'Pago' ? 'default' : 'secondary'}>
                          {transacao.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
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
