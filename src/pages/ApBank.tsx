import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Building,
  CreditCard,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Wallet,
  PiggyBank,
  Receipt,
  Calendar,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

const contasBancarias = [
  {
    id: '1',
    banco: 'Banco do Brasil',
    agencia: '1234-5',
    conta: '123456-7',
    tipo: 'Conta Corrente',
    saldo: 'R$ 45.678,90',
    status: 'Ativa',
    titular: 'Empresa Imobiliária Ltda',
  },
  {
    id: '2',
    banco: 'Itaú',
    agencia: '6789-0',
    conta: '987654-3',
    tipo: 'Conta Poupança',
    saldo: 'R$ 23.456,78',
    status: 'Ativa',
    titular: 'Empresa Imobiliária Ltda',
  },
];

const transacoes = [
  {
    id: '1',
    data: '15/01/2025',
    descricao: 'Recebimento Aluguel - Apt 302',
    categoria: 'Receita',
    valor: 'R$ 2.500,00',
    tipo: 'Entrada',
    conta: 'Banco do Brasil',
    status: 'Concluído',
  },
  {
    id: '2',
    data: '14/01/2025',
    descricao: 'Pagamento Condomínio - Casa 123',
    categoria: 'Despesa',
    valor: 'R$ 450,00',
    tipo: 'Saída',
    conta: 'Itaú',
    status: 'Concluído',
  },
  {
    id: '3',
    data: '13/01/2025',
    descricao: 'Comissão Venda - Apt 201',
    categoria: 'Receita',
    valor: 'R$ 15.000,00',
    tipo: 'Entrada',
    conta: 'Banco do Brasil',
    status: 'Pendente',
  },
];

const investimentos = [
  {
    id: '1',
    nome: 'Tesouro Selic 2029',
    tipo: 'Renda Fixa',
    valorInvestido: 'R$ 50.000,00',
    valorAtual: 'R$ 52.345,67',
    rentabilidade: '+4,69%',
    vencimento: '01/03/2029',
    status: 'Ativo',
  },
  {
    id: '2',
    nome: 'Fundo Imobiliário XPML11',
    tipo: 'FII',
    valorInvestido: 'R$ 10.000,00',
    valorAtual: 'R$ 10.876,54',
    rentabilidade: '+8,77%',
    vencimento: 'Indeterminado',
    status: 'Ativo',
  },
];

const faturas = [
  {
    id: '1',
    descricao: 'Cartão Corporate',
    banco: 'Banco do Brasil',
    vencimento: '25/01/2025',
    valorTotal: 'R$ 8.456,32',
    valorPago: 'R$ 0,00',
    status: 'Aberta',
  },
  {
    id: '2',
    descricao: 'Cartão Corporate',
    banco: 'Itaú',
    vencimento: '20/01/2025',
    valorTotal: 'R$ 3.234,56',
    valorPago: 'R$ 3.234,56',
    status: 'Paga',
  },
];

export function ApBank() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('contas');
  const [showNovaContaModal, setShowNovaContaModal] = useState(false);
  const [showNovaTransacaoModal, setShowNovaTransacaoModal] = useState(false);
  const [showNovoInvestimentoModal, setShowNovoInvestimentoModal] = useState(false);

  const totalSaldo = contasBancarias.reduce((acc, conta) => {
    return acc + parseFloat(conta.saldo.replace('R$ ', '').replace('.', '').replace(',', '.'));
  }, 0);

  const totalInvestido = investimentos.reduce((acc, inv) => {
    return acc + parseFloat(inv.valorInvestido.replace('R$ ', '').replace('.', '').replace(',', '.'));
  }, 0);

  const totalAtual = investimentos.reduce((acc, inv) => {
    return acc + parseFloat(inv.valorAtual.replace('R$ ', '').replace('.', '').replace(',', '.'));
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ApBank</h1>
            <p className="text-gray-600 mt-1">Gestão financeira e bancária completa</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar Relatório
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Operação
            </Button>
          </div>
        </div>

        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>ApBank</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Cards Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
              <Wallet className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {totalSaldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <p className="text-xs text-blue-100 mt-1">
                <ArrowUpRight className="h-3 w-3 inline mr-1" />
                +12,5% vs mês anterior
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Investido</CardTitle>
              <PiggyBank className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {totalInvestido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <p className="text-xs text-green-100 mt-1">
                <ArrowUpRight className="h-3 w-3 inline mr-1" />
                +5,2% rentabilidade
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receitas Mês</CardTitle>
              <TrendingUp className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 45.678,90</div>
              <p className="text-xs text-purple-100 mt-1">
                <ArrowUpRight className="h-3 w-3 inline mr-1" />
                +8,3% vs mês anterior
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Despesas Mês</CardTitle>
              <Receipt className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 12.345,67</div>
              <p className="text-xs text-orange-100 mt-1">
                <ArrowDownRight className="h-3 w-3 inline mr-1" />
                -3,1% vs mês anterior
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="contas">Contas Bancárias</TabsTrigger>
            <TabsTrigger value="transacoes">Transações</TabsTrigger>
            <TabsTrigger value="investimentos">Investimentos</TabsTrigger>
            <TabsTrigger value="faturas">Faturas</TabsTrigger>
            <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
          </TabsList>

          {/* Contas Bancárias */}
          <TabsContent value="contas" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar contas..."
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
              <Button onClick={() => setShowNovaContaModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Conta
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contasBancarias.map((conta) => (
                <Card key={conta.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center space-x-2">
                      <Building className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-lg">{conta.banco}</CardTitle>
                    </div>
                    <Badge variant={conta.status === 'Ativa' ? 'default' : 'secondary'}>
                      {conta.status}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">{conta.tipo}</p>
                      <p className="text-2xl font-bold text-green-600">{conta.saldo}</p>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Agência:</span> {conta.agencia}</p>
                      <p><span className="font-medium">Conta:</span> {conta.conta}</p>
                      <p><span className="font-medium">Titular:</span> {conta.titular}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Extrato
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Transações */}
          <TabsContent value="transacoes" className="space-y-6">
            <div className="flex items-center justify-between">
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
              </div>
              <Button onClick={() => setShowNovaTransacaoModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Transação
              </Button>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Conta</TableHead>
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
                      <TableCell>
                        <Badge variant="outline">{transacao.categoria}</Badge>
                      </TableCell>
                      <TableCell>{transacao.conta}</TableCell>
                      <TableCell>
                        <Badge variant={transacao.tipo === 'Entrada' ? 'default' : 'secondary'}>
                          {transacao.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell className={`font-semibold ${transacao.tipo === 'Entrada' ? 'text-green-600' : 'text-red-600'}`}>
                        {transacao.tipo === 'Entrada' ? '+' : '-'} {transacao.valor}
                      </TableCell>
                      <TableCell>
                        <Badge variant={transacao.status === 'Concluído' ? 'default' : 'secondary'}>
                          {transacao.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Investimentos */}
          <TabsContent value="investimentos" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar investimentos..."
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
              <Button onClick={() => setShowNovoInvestimentoModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Investimento
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {investimentos.map((investimento) => (
                <Card key={investimento.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle className="text-lg">{investimento.nome}</CardTitle>
                      <p className="text-sm text-gray-600">{investimento.tipo}</p>
                    </div>
                    <Badge variant="default">{investimento.status}</Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Valor Investido</p>
                        <p className="text-lg font-semibold">{investimento.valorInvestido}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Valor Atual</p>
                        <p className="text-lg font-semibold text-green-600">{investimento.valorAtual}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Rentabilidade</p>
                        <p className={`text-lg font-semibold ${investimento.rentabilidade.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {investimento.rentabilidade}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Vencimento</p>
                        <p className="text-sm font-medium">{investimento.vencimento}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <Button variant="outline" size="sm">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Ver Detalhes
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <DollarSign className="h-4 w-4 mr-2" />
                            Resgatar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Faturas */}
          <TabsContent value="faturas" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar faturas..."
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {faturas.map((fatura) => (
                <Card key={fatura.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-lg">{fatura.descricao}</CardTitle>
                    </div>
                    <Badge variant={fatura.status === 'Paga' ? 'default' : fatura.status === 'Aberta' ? 'secondary' : 'destructive'}>
                      {fatura.status}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">{fatura.banco}</p>
                      <p className="text-2xl font-bold">{fatura.valorTotal}</p>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="font-medium">Vencimento:</span> {fatura.vencimento}
                      </p>
                      <p><span className="font-medium">Valor Pago:</span> {fatura.valorPago}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Fatura
                      </Button>
                      {fatura.status === 'Aberta' && (
                        <Button size="sm">
                          <DollarSign className="h-4 w-4 mr-2" />
                          Pagar
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Relatórios */}
          <TabsContent value="relatorios" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <span>Fluxo de Caixa</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Análise detalhada do fluxo de caixa mensal e anual</p>
                  <Button variant="outline" className="w-full mt-4">
                    Gerar Relatório
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Receipt className="h-5 w-5 text-green-600" />
                    <span>Relatório de Despesas</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Controle detalhado de todas as despesas operacionais</p>
                  <Button variant="outline" className="w-full mt-4">
                    Gerar Relatório
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PiggyBank className="h-5 w-5 text-purple-600" />
                    <span>Performance de Investimentos</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Análise de rentabilidade e performance da carteira</p>
                  <Button variant="outline" className="w-full mt-4">
                    Gerar Relatório
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal Nova Conta */}
      <Dialog open={showNovaContaModal} onOpenChange={setShowNovaContaModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nova Conta Bancária</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="banco">Banco</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o banco" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bb">Banco do Brasil</SelectItem>
                  <SelectItem value="itau">Itaú</SelectItem>
                  <SelectItem value="caixa">Caixa</SelectItem>
                  <SelectItem value="santander">Santander</SelectItem>
                  <SelectItem value="bradesco">Bradesco</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="agencia">Agência</Label>
                <Input id="agencia" placeholder="1234-5" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="conta">Conta</Label>
                <Input id="conta" placeholder="123456-7" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tipo">Tipo de Conta</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cc">Conta Corrente</SelectItem>
                  <SelectItem value="poupanca">Conta Poupança</SelectItem>
                  <SelectItem value="investimento">Conta Investimento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="titular">Titular</Label>
              <Input id="titular" placeholder="Nome do titular" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNovaContaModal(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setShowNovaContaModal(false)}>
              Criar Conta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
