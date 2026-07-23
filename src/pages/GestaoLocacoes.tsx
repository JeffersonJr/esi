import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Building2, Users, FileText, DollarSign, ArrowUpRight, ArrowDownRight,
  Calendar, Search, Filter, MoreVertical, CheckCircle, Clock,
  Plus, Download, FileSignature, AlertCircle, ChevronRight, Layout, Home
} from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PageHeader } from '@/components/layout/PageHeader';

const contratos = [
  { id: 'LOC-2024-001', imovel: 'Apto 2 Quartos - Centro', inquilino: 'João Silva', proprietario: 'Maria Oliveira', valor: 2500, vencimento: 'Dia 10', status: 'Ativo' },
  { id: 'LOC-2024-002', imovel: 'Casa 3 Quartos - Vila Nova', inquilino: 'Pedro Santos', proprietario: 'José Pereira', valor: 4200, vencimento: 'Dia 05', status: 'Inadimplente' },
  { id: 'LOC-2024-003', imovel: 'Studio Moderno - Jardins', inquilino: 'Ana Beatriz', proprietario: 'Carlos Eduardo', valor: 3100, vencimento: 'Dia 15', status: 'Ativo' },
];

const negociacoes = [
  { etapa: 'Proposta', count: 12, color: 'bg-blue-500' },
  { etapa: 'Análise de Crédito', count: 5, color: 'bg-amber-500' },
  { etapa: 'Contrato', count: 3, color: 'bg-indigo-500' },
  { etapa: 'Vistoria', count: 2, color: 'bg-emerald-500' },
];

export function GestaoLocacoes() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNovoContrato, setShowNovoContrato] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ativo': return <Badge className="bg-emerald-100 text-emerald-700 border-none">Ativo</Badge>;
      case 'Inadimplente': return <Badge className="bg-rose-100 text-rose-700 border-none">Inadimplente</Badge>;
      case 'Encerrado': return <Badge className="bg-slate-100 text-slate-700 border-none">Encerrado</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-[1400px] mx-auto px-6 pt-4">
        <PageHeader
          title="Gestão de Locações"
          subtitle="Contratos ativos, repasses e fluxo de inadimplência"
          icon={<FileText />}
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Gestão de Locações' }
          ]}
          actions={
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowNovoContrato(true)}
                className="h-12 px-6 rounded-2xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 transition-all"
              >
                <Plus className="h-4 w-4 mr-2" /> Novo Contrato
              </Button>
            </div>
          }
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <FileText className="h-6 w-6" />
                </div>
                <Badge className="bg-indigo-100 text-indigo-700 border-none">+12%</Badge>
              </div>
              <h3 className="text-3xl font-black text-slate-800 tracking-tight mb-1">142</h3>
              <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">Contratos Ativos</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-3xl font-black text-slate-800 tracking-tight mb-1">{formatCurrency(452000)}</h3>
              <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">Receita Mensal</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <Badge className="bg-rose-100 text-rose-700 border-none">Alerta</Badge>
              </div>
              <h3 className="text-3xl font-black text-slate-800 tracking-tight mb-1">4.2%</h3>
              <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">Inadimplência</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Building2 className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-3xl font-black text-slate-800 tracking-tight mb-1">15</h3>
              <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">Vago / Disponível</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-slate-100/50 p-1 rounded-xl h-12 w-full md:w-auto mb-6">
            <TabsTrigger value="dashboard" className="rounded-lg px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600">Dashboard</TabsTrigger>
            <TabsTrigger value="contratos" className="rounded-lg px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600">Contratos</TabsTrigger>
            <TabsTrigger value="negociacoes" className="rounded-lg px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600">Negociações</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Funil de Locação */}
              <Card className="lg:col-span-2 border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-slate-800">Pipeline de Locação</CardTitle>
                  <CardDescription>Fluxo de novos contratos em andamento.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-4 py-6">
                  {negociacoes.map((item, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-3">
                      <div className={`w-full h-2 rounded-full ${item.color} opacity-20`} />
                      <div className="flex flex-col items-center">
                        <span className="text-2xl font-black text-slate-800">{item.count}</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase text-center">{item.etapa}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Repasses do Dia */}
              <Card className="border-none shadow-sm bg-indigo-600 text-white overflow-hidden relative">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Resumo de Repasses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm border-b border-indigo-500/50 pb-2">
                      <span className="font-medium">Total a Repassar (Hoje)</span>
                      <span className="font-bold">R$ 15.200,00</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-indigo-500/50 pb-2">
                      <span className="font-medium">Aguardando Recebimento</span>
                      <span className="font-bold">R$ 8.450,00</span>
                    </div>
                    <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 font-bold">
                      Conciliar Repasses
                    </Button>
                  </div>
                </CardContent>
                <div className="absolute -bottom-4 -right-4 opacity-10">
                  <ArrowUpRight className="h-32 w-32" />
                </div>
              </Card>
            </div>

            {/* Inquilinos em Atraso */}
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg font-bold text-slate-800 text-rose-600 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" /> Inadimplência e Ações
                  </CardTitle>
                </div>
                <Button variant="ghost" size="sm" className="font-bold text-indigo-600">Ver Todos</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contrato</TableHead>
                      <TableHead>Atraso</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Última Ação</TableHead>
                      <TableHead className="text-right">Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-bold">Pedro Santos (Vila Nova)</TableCell>
                      <TableCell><Badge className="bg-rose-100 text-rose-700">08 dias</Badge></TableCell>
                      <TableCell className="font-bold">R$ 4.200,00</TableCell>
                      <TableCell className="text-xs text-slate-500">Notificação via Zap enviada</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" className="text-rose-600 border-rose-100 hover:bg-rose-50">Cobrar</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contratos" className="space-y-6">
            <Card className="border-none shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>ID / Imóvel</TableHead>
                    <TableHead>Partes</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contratos.map((loc) => (
                    <TableRow key={loc.id}>
                      <TableCell>
                        <div className="font-bold text-slate-800">{loc.imovel}</div>
                        <div className="text-[10px] font-mono text-slate-400 uppercase">{loc.id}</div>
                      </TableCell>
                      <TableCell className="text-xs">
                        <p><strong>Inq:</strong> {loc.inquilino}</p>
                        <p><strong>Prop:</strong> {loc.proprietario}</p>
                      </TableCell>
                      <TableCell className="font-bold text-slate-700">{formatCurrency(loc.valor)}</TableCell>
                      <TableCell className="text-sm font-medium text-slate-600">{loc.vencimento}</TableCell>
                      <TableCell>{getStatusBadge(loc.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="negociacoes" className="m-0 p-12 text-center text-slate-500 bg-white rounded-2xl border border-dashed border-slate-200 font-medium">
            O fluxo de negociações (Kanban) virá aqui.
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showNovoContrato} onOpenChange={setShowNovoContrato}>
        <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
          <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
            <div>
              <DialogTitle className="text-xl font-bold">Gerador Rápido de Contrato</DialogTitle>
              <p className="text-indigo-100 mt-1 text-sm font-medium">Preencha os dados básicos. O sistema esi.chat cuidará da redação.</p>
            </div>
            <FileSignature className="h-10 w-10 text-indigo-300 opacity-50" />
          </div>
          <div className="p-6 grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-bold">Imóvel</Label>
                <Input placeholder="Código ou Endereço" className="bg-slate-50 h-11" />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Inquilino</Label>
                <Input placeholder="Nome ou CPF" className="bg-slate-50 h-11" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="font-bold">Aluguel (R$)</Label>
                <Input type="number" placeholder="0.00" className="bg-slate-50 h-11" />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Vencimento</Label>
                <Input type="number" placeholder="Dia" className="bg-slate-50 h-11" />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Caução / Garantia</Label>
                <Select>
                  <SelectTrigger className="bg-slate-50 h-11"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="caucao">Caução</SelectItem>
                    <SelectItem value="fiador">Fiador</SelectItem>
                    <SelectItem value="seguro">Seguro Fiança</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="ghost" onClick={() => setShowNovoContrato(false)} className="font-bold">Cancelar</Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 px-8">Gerar Laudo e Contrato</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
