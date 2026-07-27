import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DollarSign, TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight,
  CalendarIcon,
  ChevronDown,
  Building,
  CheckCircle2,
  Phone,
  Video,
  X, Calendar, Search, Filter, MoreVertical, CheckCircle, Clock,
  Plus, Download, FileText, PieChart, AlertCircle, Edit, Home,
  Landmark, RefreshCw, Link as LinkIcon, Unlink
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';

const transacoes = [
  { id: 'TRX-901', data: '22/Mai', descricao: 'Comissão Venda - Apto Jardins', categoria: 'Comissões', responsavel: 'Ana Souza', valor: 15400, tipo: 'Entrada', status: 'Conciliado' },
  { id: 'TRX-902', data: '21/Mai', descricao: 'Repasse Aluguel - Casa Vila Nova', categoria: 'Repasses', responsavel: 'Sistema', valor: 3800, tipo: 'Saída', status: 'Pendente' },
  { id: 'TRX-903', data: '20/Mai', descricao: 'Marketing Digital (Google Ads)', categoria: 'Despesas', responsavel: 'Marcos Silva', valor: 2500, tipo: 'Saída', status: 'Conciliado' },
];

const dreData = [
  { item: 'Receita Bruta (Vendas + Locação)', valor: 85400 },
  { item: '(-) Impostos e Taxas', valor: -12300 },
  { item: '(=) Receita Líquida', valor: 73100 },
  { item: '(-) Despesas Operacionais', valor: -25600 },
  { item: '(-) Comissões Pagas', valor: -15400 },
  { item: '(=) Lucro Operacional (EBITDA)', valor: 32100 },
];

export function GestaoFinanceira() {
  const [showNovaTransacao, setShowNovaTransacao] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Conciliado': return <Badge className="bg-emerald-100 text-emerald-700 border-none">Conciliado</Badge>;
      case 'Pendente': return <Badge className="bg-amber-100 text-amber-700 border-none">Pendente</Badge>;
      case 'Cancelado': return <Badge className="bg-rose-100 text-rose-700 border-none">Cancelado</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      <div className="max-w-[1400px] w-full mx-auto px-6 pt-4">
        <PageHeader
          title="Esi.finance"
          subtitle="Gestão financeira completa"
          icon={<DollarSign />}
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Esi.finance' }
          ]}
          actions={
            <div className="flex items-center gap-3">
              <Button variant="outline" className="bg-white border-slate-200 text-slate-700 font-bold h-9 rounded-xl shadow-sm hover:bg-slate-50 transition-all">
                <Download className="h-4 w-4 mr-2" /> Exportar
              </Button>
              <Button onClick={() => setShowNovaTransacao(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-9 rounded-xl shadow-lg shadow-indigo-200 transition-all">
                <Plus className="h-4 w-4 mr-2" /> Nova Movimentação
              </Button>
            </div>
          }
        />
      </div>

      <div className="max-w-[1400px] w-full mx-auto px-6 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Financial KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <p className="text-xs font-bold text-slate-500 tracking-tight mb-1">Saldo em Caixa</p>
              <h3 className="text-2xl font-semibold text-slate-800 tracking-tight mb-2">{formatCurrency(124500)}</h3>
              <div className="flex items-center text-xs text-emerald-600 font-bold">
                <ArrowUpRight className="h-3 w-3 mr-1" /> +8.4% vs mês anterior
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <p className="text-xs font-bold text-slate-500 tracking-tight mb-1">Receita Prevista (30d)</p>
              <h3 className="text-2xl font-semibold text-slate-800 tracking-tight mb-2">{formatCurrency(85400)}</h3>
              <div className="flex items-center text-xs text-slate-400 font-bold">
                Aguardando 12 transações
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <p className="text-xs font-bold text-slate-500 tracking-tight mb-1">Contas a Pagar (7d)</p>
              <h3 className="text-2xl font-semibold text-rose-600 tracking-tight mb-2">{formatCurrency(38900)}</h3>
              <div className="flex items-center text-xs text-rose-500 font-bold">
                <AlertCircle className="h-3 w-3 mr-1" /> 2 Faturas vencem amanhã
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <p className="text-xs font-bold text-slate-500 tracking-tight mb-1">Lançamentos Pendentes</p>
              <h3 className="text-2xl font-semibold text-amber-600 tracking-tight mb-2">08</h3>
              <div className="flex items-center text-xs text-amber-600 font-bold">
                Requerem conciliação bancária
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="visao-geral" className="w-full">
          <TabsList className="bg-slate-100/50 p-1 rounded-xl h-12 w-full md:w-auto mb-6 flex flex-wrap md:flex-nowrap gap-1">
            <TabsTrigger value="visao-geral" className="rounded-lg px-6 font-bold flex-1 md:flex-none">Visão Geral</TabsTrigger>
            <TabsTrigger value="movimentacoes" className="rounded-lg px-6 font-bold flex-1 md:flex-none">Movimentações</TabsTrigger>
            <TabsTrigger value="integracoes" className="rounded-lg px-6 font-bold flex-1 md:flex-none">Integrações Bancárias</TabsTrigger>
          </TabsList>

          <TabsContent value="visao-geral" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* DRE Simplificado */}
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-slate-800">DRE Simplificado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {dreData.map((row, idx) => (
                    <div key={idx} className={`flex justify-between p-3 rounded-lg text-sm ${row.item.startsWith('(=)') ? 'font-bold bg-slate-100 text-slate-800' : 'text-slate-600 border-b border-slate-50'}`}>
                      <span>{row.item}</span>
                      <span className={row.valor < 0 ? 'text-rose-600' : 'text-emerald-600'}>
                        {formatCurrency(Math.abs(row.valor))}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Fluxo de Caixa Futuro */}
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-slate-800">Projeção Futura (7 dias)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-emerald-600">A Receber</span>
                      <span>R$ 52.400</span>
                    </div>
                    <Progress value={85} className="h-2 bg-slate-100" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-rose-600">A Pagar</span>
                      <span>R$ 38.900</span>
                    </div>
                    <Progress value={60} className="h-2 bg-slate-100" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="movimentacoes" className="m-0">
            <Card className="border-none shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Data / ID</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transacoes.map((trx) => (
                    <TableRow key={trx.id}>
                      <TableCell>
                        <div className="font-bold text-slate-800 text-xs">{trx.data}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{trx.id}</div>
                      </TableCell>
                      <TableCell className="font-bold text-slate-800 text-sm">{trx.descricao}</TableCell>
                      <TableCell className="text-xs text-slate-600">{trx.categoria}</TableCell>
                      <TableCell className="text-xs text-slate-600">{trx.responsavel}</TableCell>
                      <TableCell className="text-right font-semibold text-slate-800">{formatCurrency(trx.valor)}</TableCell>
                      <TableCell>{getStatusBadge(trx.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Integrações Bancárias Tab */}
          <TabsContent value="integracoes" className="space-y-6 m-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Contas Conectadas (Open Finance)</h3>
                <p className="text-sm text-slate-500 font-medium">Sincronize automaticamente extratos e saldos para conciliação.</p>
              </div>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 px-5 rounded-2xl shadow-lg shadow-indigo-200 transition-all w-full sm:w-auto">
                <LinkIcon className="h-4 w-4 mr-2" /> Conectar Conta
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Connected Bank 1 */}
              <Card className="border-indigo-100 bg-indigo-50/40 shadow-sm relative overflow-hidden rounded-2xl">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500"></div>
                <CardContent className="p-6 pl-8">
                  <div className="flex justify-between items-start mb-5">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-white rounded-2xl shadow-sm flex items-center justify-center font-semibold text-orange-500 border border-orange-100 text-lg">
                        Itaú
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">Itaú Empresas</h4>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">Ag: 1234 CC: 56789-0</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 border-none flex items-center gap-1.5 font-bold shadow-sm">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Sincronizado
                    </Badge>
                  </div>
                  <div className="mb-5 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-semibold text-slate-400 tracking-tight mb-1">Saldo Atual</p>
                    <h3 className="text-2xl font-semibold text-slate-800">{formatCurrency(45200.50)}</h3>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-white border-slate-200 text-slate-600 font-bold h-10 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                      <RefreshCw className="h-4 w-4 mr-2" /> Sincronizar Agora
                    </Button>
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl shrink-0">
                      <Unlink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Connected Bank 2 */}
              <Card className="border-indigo-100 bg-indigo-50/40 shadow-sm relative overflow-hidden rounded-2xl">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-600"></div>
                <CardContent className="p-6 pl-8">
                  <div className="flex justify-between items-start mb-5">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-purple-600 rounded-2xl shadow-sm flex items-center justify-center font-semibold text-white border border-purple-500 text-xl">
                        NU
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">Nubank PJ</h4>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">Ag: 0001 CC: 123456-7</p>
                      </div>
                    </div>
                    <Badge className="bg-amber-100 text-amber-700 border-none flex items-center gap-1.5 font-bold shadow-sm">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Atualizando
                    </Badge>
                  </div>
                  <div className="mb-5 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-semibold text-slate-400 tracking-tight mb-1">Saldo Atual</p>
                    <h3 className="text-2xl font-semibold text-slate-800">{formatCurrency(79300.00)}</h3>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-white border-slate-200 text-slate-400 font-bold h-10 rounded-xl" disabled>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Atualizando...
                    </Button>
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl shrink-0">
                      <Unlink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Add new bank CTA */}
              <div className="border-2 border-dashed border-indigo-200 rounded-2xl flex flex-col items-center justify-center text-center p-6 bg-indigo-50/30 hover:bg-indigo-50 hover:border-indigo-300 transition-colors cursor-pointer min-h-[240px] group">
                <div className="h-10 w-14 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-indigo-100 group-hover:scale-110 transition-transform">
                  <Landmark className="h-6 w-6 text-indigo-500" />
                </div>
                <h4 className="font-bold text-slate-800 mb-1.5 text-lg group-hover:text-indigo-600 transition-colors">Nova Instituição</h4>
                <p className="text-sm text-slate-500 font-medium">Conecte via Open Finance<br/>para conciliação automática.</p>
              </div>

            </div>
            
            <div className="mt-8">
               <h3 className="text-lg font-bold text-slate-800 mb-4">Bancos Compatíveis via Open Finance</h3>
               <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar">
                 {['Itaú', 'Bradesco', 'Santander', 'Banco do Brasil', 'Caixa', 'Nubank', 'Inter', 'Cora', 'Sicredi', 'BTG Pactual'].map(b => (
                   <div key={b} className="flex-shrink-0 bg-white border border-slate-200 rounded-2xl px-6 py-5 flex items-center justify-center shadow-sm min-w-[140px] opacity-60 grayscale hover:grayscale-0 hover:opacity-100 cursor-pointer transition-all hover:border-indigo-200 hover:shadow-md">
                     <span className="font-semibold text-slate-700 whitespace-nowrap tracking-tight">{b}</span>
                   </div>
                 ))}
               </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showNovaTransacao} onOpenChange={setShowNovaTransacao}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nova Movimentação</DialogTitle>
            <DialogDescription>Registre uma receita ou despesa no caixa da agência.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Input placeholder="Ex: Pagamento de Software" className="bg-slate-50" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valor (R$)</Label>
                <Input type="number" placeholder="0.00" className="bg-slate-50" />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select>
                  <SelectTrigger className="bg-slate-50"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrada">Entrada (Receita)</SelectItem>
                    <SelectItem value="saida">Saída (Despesa)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="ghost" onClick={() => setShowNovaTransacao(false)} className="font-bold">Cancelar</Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8">Salvar Lançamento</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
