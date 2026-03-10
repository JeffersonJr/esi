import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BrazilMap } from '@/components/BrazilMap';
import {
  TrendingUp, Users, Home, Target, DollarSign, Eye, MousePointer,
  Clock, ArrowRight, Medal, Key, CheckCircle, AlertCircle, Camera,
  Calendar, FileText, Activity, MapPin
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// ─── Helpers ────────────────────────────────────────────────────────────────

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1: return <Medal className="h-5 w-5 text-yellow-500" />;
    case 2: return <Medal className="h-5 w-5 text-slate-400" />;
    case 3: return <Medal className="h-5 w-5 text-amber-600" />;
    default: return null;
  }
};

const getRankBg = (rank: number) => {
  switch (rank) {
    case 1: return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-400';
    case 2: return 'bg-slate-500/10 border-slate-500/20 text-slate-700 dark:text-slate-400';
    case 3: return 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400';
    default: return 'bg-muted border-border text-muted-foreground';
  }
};

// ─── Reusable Metric Card ───────────────────────────────────────────────────

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: any;
  trend?: string;
  trendLabel?: string;
  trendPositive?: boolean;
  colorClass: string; // e.g. 'text-blue-500 bg-blue-500/10'
  delay?: number;
}

function MetricCard({ title, value, icon: Icon, trend, trendLabel, trendPositive, colorClass, delay = 0 }: MetricCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }}>
      <Card className="hover:shadow-md transition-all duration-300 border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden group">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{title}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-black tracking-tight">{value}</h3>
              </div>
            </div>
            <div className={cn("p-3 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", colorClass)}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
          {(trend || trendLabel) && (
            <div className="mt-4 flex items-center gap-2 text-sm">
              {trend && (
                <Badge variant={trendPositive ? 'default' : 'destructive'} className={cn("px-1.5 py-0 text-[10px] uppercase font-bold", trendPositive ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border-emerald-200/50" : "bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 border-rose-200/50")}>
                  {trendPositive ? '↑' : '↓'} {trend}
                </Badge>
              )}
              <span className="text-muted-foreground font-medium">{trendLabel}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Mock Data ──────────────────────────────────────────────────────────────

const mockVendas = {
  'João Silva': [
    { id: '1', imovel: 'Apt 302 - Centro', valor: 'R$ 450K', cliente: 'Maria Santos', data: '15/12/2024', comissao: 'R$ 22.5K' },
    { id: '2', imovel: 'Casa - Jd América', valor: 'R$ 580K', cliente: 'Carlos O.', data: '10/12/2024', comissao: 'R$ 29K' },
  ],
  'Maria Rodrigues': [
    { id: '4', imovel: 'Studio - V. Mariana', valor: 'R$ 320K', cliente: 'Pedro S.', data: '18/12/2024', comissao: 'R$ 16K' },
  ]
};

const mockLocacoes = {
  'João Silva': [
    { id: '1', imovel: 'Kitnet - Centro', valor: 'R$ 1.2K/mês', cliente: 'Lucas M.', data: '20/12/2024', comissao: 'R$ 720' },
  ],
  'Maria Rodrigues': [
    { id: '3', imovel: 'Studio - Pinheiros', valor: 'R$ 1.8K/mês', cliente: 'Roberto A.', data: '18/12/2024', comissao: 'R$ 1.08K' },
  ]
};

// ─── Main Component ─────────────────────────────────────────────────────────

export function Analytics() {
  const navigate = useNavigate();
  const [selectedCorretor, setSelectedCorretor] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<'vendas' | 'locacoes' | 'leads' | null>(null);

  return (
    <div className="space-y-8 pb-20">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="flex items-center gap-1">
              <Home className="h-4 w-4" /> Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Analytics</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Visão Geral & Analytics</h1>
            <p className="text-slate-500 mt-1 font-medium">Acompanhe as métricas e o desempenho da sua operação.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="h-12 bg-white/50 backdrop-blur font-bold px-6 border-border rounded-2xl shadow-sm flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" /> Janeiro 2025
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="imoveis" className="w-full">
        {/* Scrollable TabsList for Mobile Support */}
        <div className="overflow-x-auto pb-4 custom-scrollbar">
          <TabsList className="h-12 w-full justify-start md:justify-center p-1 bg-muted/40 border border-border/50 rounded-xl inline-flex min-w-max">
            <TabsTrigger value="imoveis" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm px-4">Imóveis</TabsTrigger>
            <TabsTrigger value="vendas" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm px-4">Vendas</TabsTrigger>
            <TabsTrigger value="locacoes" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm px-4">Locações</TabsTrigger>
            <TabsTrigger value="clientes" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm px-4">Clientes</TabsTrigger>
            <TabsTrigger value="solicitacoes" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm px-4">Solicitações</TabsTrigger>
            <TabsTrigger value="vistorias" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm px-4">Vistorias</TabsTrigger>
            <TabsTrigger value="equipe" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm px-4">Equipe</TabsTrigger>
            <TabsTrigger value="site" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm px-4">Site</TabsTrigger>
          </TabsList>
        </div>

        {/* ── IMÓVEIS TAB ── */}
        <TabsContent value="imoveis" className="space-y-6 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard title="Total de Imóveis" value="342" icon={Home} trend="8.2%" trendLabel="vs mês ant." trendPositive colorClass="text-blue-500 bg-blue-500/10" delay={0.1} />
            <MetricCard title="Captações Ativas" value="289" icon={CrosshairIcon} trend="12.1%" trendLabel="vs mês ant." trendPositive colorClass="text-purple-500 bg-purple-500/10" delay={0.2} />
            <MetricCard title="Novos no Mês" value="45" icon={PlusCircleIcon} trend="4.5%" trendLabel="vs mês ant." trendPositive colorClass="text-emerald-500 bg-emerald-500/10" delay={0.3} />
            <MetricCard title="Ticket Médio" value="R$ 685K" icon={DollarSign} trend="2.8%" trendLabel="vs mês ant." trendPositive colorClass="text-amber-500 bg-amber-500/10" delay={0.4} />
          </div>

          <Card className="border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/10 border-b border-border/40">
              <CardTitle>Imóveis por Tipo</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {[
                { tipo: 'Apartamento', qtde: 156, pct: 45, cor: 'bg-blue-500' },
                { tipo: 'Casa de Condomínio', qtde: 89, pct: 26, cor: 'bg-purple-500' },
                { tipo: 'Casa Padrão', qtde: 62, pct: 18, cor: 'bg-emerald-500' },
                { tipo: 'Terreno / Lote', qtde: 35, pct: 11, cor: 'bg-amber-500' },
              ].map((i, idx) => (
                <div key={i.tipo} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold">{i.tipo}</span>
                    <span className="text-muted-foreground font-medium">{i.qtde} imóveis ({i.pct}%)</span>
                  </div>
                  <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${i.pct}%` }} transition={{ duration: 1, delay: idx * 0.1 }} className={cn("h-full rounded-full", i.cor)} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── VENDAS TAB ── */}
        <TabsContent value="vendas" className="space-y-6 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard title="VGV Mensal" value="R$ 4.2M" icon={TrendingUp} trend="18%" trendLabel="vs mês ant." trendPositive colorClass="text-emerald-500 bg-emerald-500/10" delay={0.1} />
            <MetricCard title="Total de Vendas" value="12" icon={Target} trend="2" trendLabel="vendas a mais" trendPositive colorClass="text-blue-500 bg-blue-500/10" delay={0.2} />
            <MetricCard title="Ticket Médio" value="R$ 350K" icon={DollarSign} trend="5%" trendLabel="vs mês ant." trendPositive={false} colorClass="text-amber-500 bg-amber-500/10" delay={0.3} />
            <MetricCard title="Comissão Gerada" value="R$ 210K" icon={Medal} trend="18%" trendLabel="vs mês ant." trendPositive colorClass="text-purple-500 bg-purple-500/10" delay={0.4} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="bg-muted/10 border-b border-border/40">
                <CardTitle>Últimas Vendas Concluídas</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-muted/5">
                    <TableRow>
                      <TableHead>Imóvel</TableHead>
                      <TableHead>Corretor</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { i: "Apt 302 - Centro", c: "João Silva", v: "R$ 450.000" },
                      { i: "Casa - Jd América", c: "João Silva", v: "R$ 580.000" },
                      { i: "Studio - V. Mariana", c: "Maria R.", v: "R$ 320.000" },
                      { i: "Cobertura - Brooklin", c: "Pedro S.", v: "R$ 890.000" },
                    ].map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium text-sm">{row.i}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{row.c}</TableCell>
                        <TableCell className="text-right font-bold text-emerald-600">{row.v}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
              <CardHeader className="bg-muted/10 border-b border-border/40">
                <CardTitle>VGV por Corretor (Top 4)</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                {[
                  { n: 'João Silva', v: 'R$ 1.03M', pct: 85 },
                  { n: 'Pedro Santos', v: 'R$ 890K', pct: 70 },
                  { n: 'Maria Rodrigues', v: 'R$ 320K', pct: 25 },
                  { n: 'Ana Costa', v: 'R$ 280K', pct: 20 },
                ].map((c, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold flex items-center gap-2">
                        {getRankIcon(idx + 1)} {c.n}
                      </span>
                      <strong className="text-emerald-600 dark:text-emerald-400">{c.v}</strong>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${c.pct}%` }} transition={{ duration: 1, delay: idx * 0.1 }} className="h-full bg-emerald-500 rounded-full" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── LOCAÇÕES TAB ── */}
        <TabsContent value="locacoes" className="space-y-6 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard title="Contratos Ativos" value="142" icon={FileText} trend="5" trendLabel="novos no mês" trendPositive colorClass="text-blue-500 bg-blue-500/10" delay={0.1} />
            <MetricCard title="Valor Locado Mês" value="R$ 342K" icon={TrendingUp} trend="8.2%" trendLabel="vs mês ant." trendPositive colorClass="text-indigo-500 bg-indigo-500/10" delay={0.2} />
            <MetricCard title="Ticket Médio" value="R$ 2.4K" icon={DollarSign} trend="1.2%" trendLabel="vs mês ant." trendPositive colorClass="text-purple-500 bg-purple-500/10" delay={0.3} />
            <MetricCard title="Inadimplência" value="3.5%" icon={AlertCircle} trend="0.5%" trendLabel="vs mês ant." trendPositive={false} colorClass="text-rose-500 bg-rose-500/10" delay={0.4} />
          </div>

          <Card className="border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/10 border-b border-border/40">
              <CardTitle>Locações Mais Recentes</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/5">
                  <TableRow>
                    <TableHead>Imóvel</TableHead>
                    <TableHead>Inquilino</TableHead>
                    <TableHead>Proprietário</TableHead>
                    <TableHead>Corretor</TableHead>
                    <TableHead className="text-right">Aluguel Base</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { i: "Apt 12B - Pinheiros", inq: "Lucas Mendes", prop: "Roberto Silva", c: "João Silva", v: "R$ 3.800" },
                    { i: "Studio - Consolação", inq: "Marina Costa", prop: "Ana Maria", c: "Maria R.", v: "R$ 2.500" },
                    { i: "Casa 3/4 - Jd Paulistano", inq: "Família Sousa", prop: "Eduardo Lima", c: "Pedro S.", v: "R$ 8.500" },
                  ].map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium text-sm">{row.i}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{row.inq}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{row.prop}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{row.c}</TableCell>
                      <TableCell className="text-right font-bold text-indigo-600">{row.v}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── CLIENTES TAB ── */}
        <TabsContent value="clientes" className="space-y-6 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard title="Total de Clientes" value="2.450" icon={Users} trend="15%" trendLabel="vs mês ant." trendPositive colorClass="text-purple-500 bg-purple-500/10" delay={0.1} />
            <MetricCard title="Leads Ativos" value="380" icon={Activity} trend="22" trendLabel="novos hoje" trendPositive colorClass="text-emerald-500 bg-emerald-500/10" delay={0.2} />
            <MetricCard title="Proprietários" value="450" icon={Key} trend="12" trendLabel="cadastros m." trendPositive colorClass="text-amber-500 bg-amber-500/10" delay={0.3} />
            <MetricCard title="Taxa de Conversão" value="4.2%" icon={Target} trend="0.8%" trendLabel="vs mês ant." trendPositive colorClass="text-blue-500 bg-blue-500/10" delay={0.4} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border/50 shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/10 border-b border-border/40">
                <CardTitle>Origem dos Leads (Top Canais)</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {[
                  { f: "Orgânico (Google)", n: 145, pct: 38, cor: 'bg-indigo-500' },
                  { f: "Instagram Ads", n: 110, pct: 28, cor: 'bg-pink-500' },
                  { f: "Portais Imobiliários", n: 85, pct: 22, cor: 'bg-amber-500' },
                  { f: "Indicações", n: 40, pct: 12, cor: 'bg-emerald-500' },
                ].map((c, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold">{c.f}</span>
                      <span className="text-muted-foreground font-medium">{c.n} leads ({c.pct}%)</span>
                    </div>
                    <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${c.pct}%` }} transition={{ duration: 1, delay: idx * 0.1 }} className={cn("h-full rounded-full", c.cor)} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/10 border-b border-border/40">
                <CardTitle>Perfil de Compra Adquirido</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {[
                  { p: "Investidores", v: "18%", cor: "bg-blue-500" },
                  { p: "Primeiro Imóvel", v: "42%", cor: "bg-emerald-500" },
                  { p: "Upgrade de Moradia", v: "30%", cor: "bg-purple-500" },
                  { p: "Empresarial / Comercial", v: "10%", cor: "bg-amber-500" },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold">{item.p}</span>
                      <span className="text-muted-foreground font-medium">{item.v} dos fechamentos</span>
                    </div>
                    <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: item.v }} transition={{ duration: 1, delay: idx * 0.1 }} className={cn("h-full rounded-full", item.cor)} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── SOLICITAÇÕES TAB ── */}
        <TabsContent value="solicitacoes" className="space-y-6 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard title="Abertas" value="42" icon={AlertCircle} trend="12" trendLabel="hoje" trendPositive={false} colorClass="text-amber-500 bg-amber-500/10" delay={0.1} />
            <MetricCard title="Em Atendimento" value="18" icon={Clock} trend="4" trendLabel="resolvidas" trendPositive colorClass="text-blue-500 bg-blue-500/10" delay={0.2} />
            <MetricCard title="Concluídas no Mês" value="185" icon={CheckCircle} trend="15%" trendLabel="vs mês ant." trendPositive colorClass="text-emerald-500 bg-emerald-500/10" delay={0.3} />
            <MetricCard title="SLA Médio" value="4h 30m" icon={Activity} trend="1h" trendLabel="pior q ant." trendPositive={false} colorClass="text-rose-500 bg-rose-500/10" delay={0.4} />
          </div>

          <Card className="border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/10 border-b border-border/40">
              <CardTitle>Solicitações por Categoria</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/5">
                  <TableRow>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Quantidade</TableHead>
                    <TableHead className="text-right">SLA Médio de Resolução</TableHead>
                    <TableHead className="text-right">Status Crítico</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { c: 'Manutenção Hidráulica', q: 28, sla: '24h', critico: 5 },
                    { c: 'Reparos Elétricos', q: 15, sla: '12h', critico: 8 },
                    { c: 'Dúvidas Contratuais', q: 45, sla: '4h', critico: 0 },
                    { c: 'Vistoria de Saída', q: 12, sla: '48h', critico: 0 },
                  ].map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium text-sm">{row.c}</TableCell>
                      <TableCell className="text-right">{row.q}</TableCell>
                      <TableCell className="text-right">{row.sla}</TableCell>
                      <TableCell className="text-right">
                        {row.critico > 0 ? (
                          <Badge variant="destructive" className="bg-rose-500">{row.critico} pendentes</Badge>
                        ) : (
                          <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-500/10">0 pendências</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── VISTORIAS TAB ── */}
        <TabsContent value="vistorias" className="space-y-6 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard title="Realizadas (Mês)" value="45" icon={Camera} trend="12%" trendLabel="vs mês ant." trendPositive colorClass="text-indigo-500 bg-indigo-500/10" delay={0.1} />
            <MetricCard title="Agendadas" value="12" icon={Calendar} trend="3" trendLabel="para hoje" trendPositive colorClass="text-blue-500 bg-blue-500/10" delay={0.2} />
            <MetricCard title="Aprovadas direto" value="38" icon={CheckCircle} trend="84%" trendLabel="taxa de sucesso" trendPositive colorClass="text-emerald-500 bg-emerald-500/10" delay={0.3} />
            <MetricCard title="Com Ressalvas" value="7" icon={AlertCircle} trend="-2" trendLabel="melhoria" trendPositive colorClass="text-amber-500 bg-amber-500/10" delay={0.4} />
          </div>

          <Card className="border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/10 border-b border-border/40">
              <CardTitle>Vistorias por Status</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {[
                { status: 'Concluídas Sem Ressalva', quantidade: 38, percentual: 66, cor: 'bg-emerald-500' },
                { status: 'Concluídas Com Ressalva', quantidade: 7, percentual: 12, cor: 'bg-amber-500' },
                { status: 'Agendadas', quantidade: 12, percentual: 20, cor: 'bg-blue-500' },
                { status: 'Canceladas', quantidade: 1, percentual: 2, cor: 'bg-rose-500' },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold">{item.status}</span>
                    <span className="text-muted-foreground font-medium">{item.quantidade} ({item.percentual}%)</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${item.percentual}%` }} transition={{ duration: 1, delay: index * 0.1 }} className={cn("h-full rounded-full", item.cor)} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── EQUIPE TAB ── */}
        <TabsContent value="equipe" className="space-y-6 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard title="Corretores Ativos" value="18" icon={Users} colorClass="text-primary bg-primary/10" delay={0.1} />
            <MetricCard title="Média de Vendas" value="2.5" icon={Target} trend="0.5" trendLabel="vs ant." trendPositive colorClass="text-emerald-500 bg-emerald-500/10" delay={0.2} />
          </div>

          <Card className="border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/10 border-b border-border/40">
              <CardTitle>Ranking de Atividades Realizadas</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/5">
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Corretor</TableHead>
                    <TableHead className="text-right">Reuniões</TableHead>
                    <TableHead className="text-right">Visitas</TableHead>
                    <TableHead className="text-right">Propostas</TableHead>
                    <TableHead className="text-right">Conversão</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { r: 1, n: 'João Silva', re: 45, vi: 30, pr: 12, cv: "26%" },
                    { r: 2, n: 'Pedro Santos', re: 38, vi: 22, pr: 8, cv: "21%" },
                    { r: 3, n: 'Maria Rodrigues', re: 35, vi: 25, pr: 7, cv: "20%" },
                  ].map((row, idx) => (
                    <TableRow key={idx} className={getRankBg(row.r)}>
                      <TableCell className="font-bold flex items-center justify-center h-full min-h-[50px]">{getRankIcon(row.r) || row.r}</TableCell>
                      <TableCell className="font-medium text-sm">{row.n}</TableCell>
                      <TableCell className="text-right">{row.re}</TableCell>
                      <TableCell className="text-right">{row.vi}</TableCell>
                      <TableCell className="text-right">{row.pr}</TableCell>
                      <TableCell className="text-right font-bold text-emerald-600 dark:text-emerald-400">{row.cv}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── SITE TAB ── */}
        <TabsContent value="site" className="space-y-6 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard title="Acessos Totais" value="45.2K" icon={Eye} trend="22%" trendLabel="vs mês ant." trendPositive colorClass="text-blue-500 bg-blue-500/10" delay={0.1} />
            <MetricCard title="Usuários Únicos" value="18.5K" icon={Users} trend="18%" trendLabel="vs mês ant." trendPositive colorClass="text-indigo-500 bg-indigo-500/10" delay={0.2} />
            <MetricCard title="Taxa de Rejeição" value="34%" icon={MousePointer} trend="-2%" trendLabel="melhoria" trendPositive colorClass="text-emerald-500 bg-emerald-500/10" delay={0.3} />
            <MetricCard title="Tempo Médio" value="2m 45s" icon={Clock} trend="15s" trendLabel="a mais no site" trendPositive colorClass="text-purple-500 bg-purple-500/10" delay={0.4} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border/50 shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/10 border-b border-border/40">
                <CardTitle>Páginas Mais Visitadas</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {[
                  { pagina: 'Home / Busca', visitas: "15.2K", pct: 45, cor: 'bg-blue-500', cliques: "8.5K" },
                  { pagina: 'Imóveis Padrão', visitas: "8.4K", pct: 25, cor: 'bg-indigo-500', cliques: "4.2K" },
                  { pagina: 'Lançamentos', visitas: "5.1K", pct: 15, cor: 'bg-purple-500', cliques: "2.8K" },
                  { pagina: 'Contato / Sobre', visitas: "2.3K", pct: 8, cor: 'bg-amber-500', cliques: "950" },
                ].map((i, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold truncate pr-4">{i.pagina}</span>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-muted-foreground hidden sm:inline">{i.cliques} cliques</span>
                        <span className="font-medium bg-muted px-2 py-0.5 rounded">{i.visitas} vis. ({i.pct}%)</span>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${i.pct}%` }} transition={{ duration: 1, delay: idx * 0.1 }} className={cn("h-full rounded-full", i.cor)} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/10 border-b border-border/40">
                <CardTitle>Tipos de Imóveis Mais Buscados</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {[
                  { tipo: 'Apartamentos', icon: '🏢', buscas: 4500, pct: 42, cor: 'bg-emerald-500' },
                  { tipo: 'Casas de Condomínio', icon: '🏡', buscas: 3100, pct: 28, cor: 'bg-blue-500' },
                  { tipo: 'Coberturas / Alto Padrão', icon: '✨', buscas: 1800, pct: 16, cor: 'bg-purple-500' },
                  { tipo: 'Salas Comerciais', icon: '💼', buscas: 950, pct: 9, cor: 'bg-amber-500' },
                ].map((i, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold flex items-center gap-2"><span className="text-lg">{i.icon}</span> {i.tipo}</span>
                      <span className="text-muted-foreground font-medium">{i.buscas.toLocaleString()} buscas</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${i.pct}%` }} transition={{ duration: 1, delay: idx * 0.1 }} className={cn("h-full rounded-full", i.cor)} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm overflow-hidden md:col-span-2">
              <CardHeader className="bg-muted/10 border-b border-border/40">
                <CardTitle>Acessos por Região / Cidade</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row min-h-[300px]">
                  {/* Visual Map Illusion using precise absolute positioning inside a relative container */}
                  <div className="md:w-1/2 p-6 flex flex-col items-center justify-center bg-muted/20 border-r border-border/40 relative min-h-[300px]">
                    <div className="opacity-20 absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent"></div>
                    {/* Real Brazil Map Background */}
                    <div className="relative w-[280px] h-[280px] opacity-10 dark:opacity-20 pointer-events-none drop-shadow-lg">
                      <BrazilMap className="text-primary w-full h-full" fill="currentColor" />
                    </div>

                    {/* Interactive Data Pins (Simulating Brazil's regions) */}
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }} className="absolute top-[68%] left-[58%] flex flex-col items-center group cursor-pointer">
                      <MapPin className="h-8 w-8 text-emerald-500 drop-shadow-md z-10 -mt-8" />
                      <div className="bg-background/90 backdrop-blur rounded-lg px-2 py-1 shadow-lg text-xs font-bold -mt-1 z-20 whitespace-nowrap">
                        SP - Capital
                      </div>
                      <span className="absolute w-12 h-12 bg-emerald-500/20 rounded-full animate-ping -mt-10"></span>
                    </motion.div>

                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="absolute top-[61%] left-[53%] flex flex-col items-center group cursor-pointer">
                      <MapPin className="h-6 w-6 text-blue-500 drop-shadow-md z-10 -mt-6" />
                      <div className="bg-background/90 backdrop-blur rounded-lg px-2 py-1 shadow-lg text-xs font-bold mt-1 z-20 whitespace-nowrap">
                        Campinas
                      </div>
                    </motion.div>

                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 }} className="absolute top-[73%] left-[64%] flex flex-col items-center group cursor-pointer">
                      <MapPin className="h-5 w-5 text-purple-500 drop-shadow-md z-10 -mt-5" />
                      <div className="bg-background/90 backdrop-blur rounded-lg px-2 py-1 shadow-lg text-[10px] font-bold mt-1 z-20 whitespace-nowrap">
                        Baixada
                      </div>
                      <span className="absolute w-6 h-6 bg-purple-500/30 rounded-full animate-ping -mt-5" style={{ animationDuration: '3s' }}></span>
                    </motion.div>
                  </div>

                  <div className="md:w-1/2">
                    <Table>
                      <TableHeader className="bg-muted/5">
                        <TableRow>
                          <TableHead>Cidade / Região</TableHead>
                          <TableHead className="text-right">Acessos</TableHead>
                          <TableHead className="text-right">Acesso / Conv.</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          { reg: 'São Paulo - Capital', ac: '28.4K', cv: '4.8%' },
                          { reg: 'Campinas e Região', ac: '8.2K', cv: '3.5%' },
                          { reg: 'ABC Paulista', ac: '4.5K', cv: '4.1%' },
                          { reg: 'Baixada Santista', ac: '2.1K', cv: '2.9%' },
                          { reg: 'Outros Estados', ac: '2.0K', cv: '1.2%' },
                        ].map((row, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-medium text-sm flex items-center gap-2">
                              <span className={cn("w-2 h-2 rounded-full", idx === 0 ? "bg-emerald-500" : idx === 1 ? "bg-blue-500" : "bg-purple-500")} />
                              {row.reg}
                            </TableCell>
                            <TableCell className="text-right font-medium">{row.ac}</TableCell>
                            <TableCell className="text-right font-bold text-emerald-600 dark:text-emerald-400">{row.cv}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/10 border-b border-border/40">
                <CardTitle>Acessos por Dispositivo</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex gap-4 items-end justify-center h-48 mb-6 mt-4">
                  {/* Mobile */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-xl" style={{ height: '140px' }} />
                    <div className="text-center">
                      <p className="font-bold text-lg leading-none">68%</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Mobile</p>
                    </div>
                  </div>
                  {/* Desktop */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-xl" style={{ height: '60px' }} />
                    <div className="text-center">
                      <p className="font-bold text-lg leading-none">28%</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Desktop</p>
                    </div>
                  </div>
                  {/* Tablet */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-xl" style={{ height: '20px' }} />
                    <div className="text-center">
                      <p className="font-bold text-lg leading-none">4%</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Tablet</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-center text-muted-foreground">A maioria do seu público busca imóveis pelo celular. Certifique-se que as fotos carregam rápido!</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

      </Tabs>

      {/* Lucide Icons for Map/Fallback */}
      <span className="hidden">
        <Home /> <Target /> <DollarSign /> <TrendingUp /> <Users /> <Activity /> <Key /> <AlertCircle /> <CheckCircle /> <Clock /> <Camera /> <Calendar /> <FileText /> <Eye /> <MousePointer />
      </span>
    </div>
  );
}

// Inline fallback icons injected at top if needed cross-file
function CrosshairIcon(props: any) { return <Target {...props} />; }
function PlusCircleIcon(props: any) { return <Activity {...props} />; }
