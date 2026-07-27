import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Target, TrendingUp, PhoneCall, CalendarIcon, CheckCircle2, DollarSign, Award, ArrowUp, ArrowDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const performanceData = [
  { name: 'Jan', ligacoes: 120, visitas: 45, propostas: 15, vendas: 3, comissao: 15000 },
  { name: 'Fev', ligacoes: 150, visitas: 52, propostas: 20, vendas: 5, comissao: 28000 },
  { name: 'Mar', ligacoes: 180, visitas: 65, propostas: 25, vendas: 4, comissao: 22000 },
  { name: 'Abr', ligacoes: 140, visitas: 48, propostas: 18, vendas: 2, comissao: 12000 },
  { name: 'Mai', ligacoes: 210, visitas: 75, propostas: 30, vendas: 7, comissao: 45000 },
  { name: 'Jun', ligacoes: 195, visitas: 68, propostas: 28, vendas: 6, comissao: 38000 },
];

export function MeuDesempenho() {
  const [periodo, setPeriodo] = useState('semestre');

  return (
    <div className="space-y-6 animate-fade-in pb-10 pt-2">
      <div className="flex justify-between items-center bg-card p-4 rounded-2xl shadow-sm border border-border/50">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" /> Meu Desempenho
          </h2>
          <p className="text-sm text-muted-foreground">Acompanhe suas metas e conversões</p>
        </div>
        <Select value={periodo} onValueChange={setPeriodo}>
          <SelectTrigger className="w-[180px] bg-background">
            <SelectValue placeholder="Selecione o período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mes">Este Mês</SelectItem>
            <SelectItem value="semestre">Último Semestre</SelectItem>
            <SelectItem value="ano">Este Ano</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Comissões', value: 'R$ 160.000', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10', trend: '+15%', trendUp: true },
          { title: 'Vendas Realizadas', value: '27', icon: Award, color: 'text-amber-500', bg: 'bg-amber-500/10', trend: '+3', trendUp: true },
          { title: 'Visitas Feitas', value: '353', icon: CalendarIcon, color: 'text-blue-500', bg: 'bg-blue-500/10', trend: '-12%', trendUp: false },
          { title: 'Ligações / Contatos', value: '995', icon: PhoneCall, color: 'text-indigo-500', bg: 'bg-indigo-500/10', trend: '+25%', trendUp: true },
        ].map((kpi, i) => (
          <Card key={i} className="border-none shadow-sm bg-card hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                  <p className="text-title-1 text-foreground">{kpi.value}</p>
                </div>
                <div className={cn("p-3 rounded-2xl", kpi.bg, kpi.color)}>
                  <kpi.icon className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-sm">
                <span className={cn("flex items-center font-bold", kpi.trendUp ? "text-emerald-500" : "text-rose-500")}>
                  {kpi.trendUp ? <ArrowUp className="h-4 w-4 mr-0.5" /> : <ArrowDown className="h-4 w-4 mr-0.5" />}
                  {kpi.trend}
                </span>
                <span className="text-muted-foreground">vs. período anterior</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Gráfico Principal de Comissões */}
        <Card className="xl:col-span-2 shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Evolução de Comissões</CardTitle>
            <CardDescription>Sua receita ao longo dos últimos meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorComissao" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dx={-10} tickFormatter={(val) => `R$${val/1000}k`} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Comissão']}
                  />
                  <Area type="monotone" dataKey="comissao" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorComissao)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Funil de Conversão */}
        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Funil de Conversão</CardTitle>
            <CardDescription>Taxa de sucesso das suas interações</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { label: 'Ligações Feitas', value: 995, max: 1000, color: 'bg-indigo-500' },
                { label: 'Visitas Realizadas', value: 353, max: 1000, color: 'bg-blue-500' },
                { label: 'Propostas Enviadas', value: 136, max: 1000, color: 'bg-amber-500' },
                { label: 'Vendas Fechadas', value: 27, max: 1000, color: 'bg-emerald-500' },
              ].map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                    <span className="font-bold">{item.value}</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full", item.color)} 
                      style={{ width: `${(item.value / item.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              
              <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Target className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Taxa de Conversão</p>
                    <p className="text-2xl font-semibold text-emerald-600">2.7%</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
