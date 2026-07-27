import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, TrendingUp, Users, Target, BarChart2, Star, Megaphone } from 'lucide-react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts'

// Mock Data for Charts
const PERFORMANCE_DATA = [
  { name: 'Jan', vendas: 40, locacoes: 24, leads: 120 },
  { name: 'Fev', vendas: 30, locacoes: 13, leads: 98 },
  { name: 'Mar', vendas: 20, locacoes: 38, leads: 150 },
  { name: 'Abr', vendas: 27, locacoes: 39, leads: 130 },
  { name: 'Mai', vendas: 18, locacoes: 48, leads: 180 },
  { name: 'Jun', vendas: 23, locacoes: 38, leads: 160 },
]

const FUNNEL_DATA = [
  { name: 'Leads (Topo)', value: 1200 },
  { name: 'Atendimento', value: 850 },
  { name: 'Visita', value: 400 },
  { name: 'Proposta', value: 150 },
  { name: 'Ganho', value: 50 },
]

const QUALITY_DATA = [
  { name: 'Qualificados', value: 65, color: '#10b981' },
  { name: 'Descartados', value: 35, color: '#f43f5e' },
]

export function RelatoriosDesempenho() {
  const [reportType, setReportType] = useState('equipe')
  const [periodo, setPeriodo] = useState('30d')

  return (
    <div className="flex flex-col h-full bg-background">
      <PageHeader
        title="Relatórios de Desempenho"
        description="KPIs e métricas de conversão da sua imobiliária"
        actions={
          <div className="flex items-center gap-3">
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger className="w-[160px] h-9 rounded-xl font-semibold">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="90d">Últimos 90 dias</SelectItem>
                <SelectItem value="ano">Este ano</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="h-9 px-4 rounded-xl gap-2 font-semibold">
              <Download className="w-4 h-4" /> Exportar
            </Button>
          </div>
        }
      />

      <div className="flex-1 p-6 lg:p-8 pt-0 space-y-6 overflow-auto">
        <Tabs defaultValue="equipe" onValueChange={setReportType} className="w-full">
          <TabsList className="h-10 bg-muted/50 rounded-xl p-1 mb-6 inline-flex flex-wrap sm:flex-nowrap w-full sm:w-auto overflow-x-auto justify-start">
            <TabsTrigger value="equipe" className="rounded-lg gap-2 text-[14px]">
              <Users className="w-4 h-4" /> Performance da Equipe
            </TabsTrigger>
            <TabsTrigger value="corretor" className="rounded-lg gap-2 text-[14px]">
              <Target className="w-4 h-4" /> Por Corretor
            </TabsTrigger>
            <TabsTrigger value="ranking" className="rounded-lg gap-2 text-[14px]">
              <TrendingUp className="w-4 h-4" /> Ranking
            </TabsTrigger>
            <TabsTrigger value="funil" className="rounded-lg gap-2 text-[14px]">
              <BarChart2 className="w-4 h-4" /> Desempenho por Funil
            </TabsTrigger>
            <TabsTrigger value="leads" className="rounded-lg gap-2 text-[14px]">
              <Star className="w-4 h-4" /> Qualidade dos Leads
            </TabsTrigger>
            <TabsTrigger value="anuncios" className="rounded-lg gap-2 text-[14px]">
              <Megaphone className="w-4 h-4" /> Qualidade dos Anúncios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="equipe" className="mt-0 outline-none space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* KPIs Principais */}
              <Card className="rounded-2xl border-border/50 shadow-sm">
                <CardContent className="p-6">
                  <p className="text-[14px] font-medium text-muted-foreground mb-2">Total de Vendas</p>
                  <h3 className="text-3xl font-semibold">158</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-0 font-semibold rounded-full">+12%</Badge>
                    <span className="text-xs text-muted-foreground">vs mês anterior</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-border/50 shadow-sm">
                <CardContent className="p-6">
                  <p className="text-[14px] font-medium text-muted-foreground mb-2">Total de Locações</p>
                  <h3 className="text-3xl font-semibold">201</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-0 font-semibold rounded-full">+5%</Badge>
                    <span className="text-xs text-muted-foreground">vs mês anterior</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-border/50 shadow-sm">
                <CardContent className="p-6">
                  <p className="text-[14px] font-medium text-muted-foreground mb-2">Taxa de Conversão Média</p>
                  <h3 className="text-3xl font-semibold">4.2%</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 border-0 font-semibold rounded-full">-0.8%</Badge>
                    <span className="text-xs text-muted-foreground">vs mês anterior</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico 1 */}
              <Card className="rounded-2xl border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-title-2 font-semibold">Evolução Mensal (Vendas vs Locações)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={PERFORMANCE_DATA}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Legend iconType="circle" />
                        <Bar dataKey="vendas" name="Vendas" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="locacoes" name="Locações" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Gráfico 2 */}
              <Card className="rounded-2xl border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-title-2 font-semibold">Volume de Leads</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={PERFORMANCE_DATA}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Line type="monotone" dataKey="leads" name="Leads" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="leads" className="mt-0 outline-none space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="rounded-2xl border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-title-2 font-semibold">Proporção de Leads</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center items-center h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={QUALITY_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {QUALITY_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Legend iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Outras abas (Corretor, Ranking, Funil, Anuncios) seguem a mesma lógica */}
          <TabsContent value="corretor" className="mt-0">
            <div className="flex h-[400px] items-center justify-center border-2 border-dashed border-border rounded-2xl">
              <p className="text-muted-foreground font-medium">Selecione um corretor para visualizar os dados.</p>
            </div>
          </TabsContent>
          <TabsContent value="ranking" className="mt-0">
            <div className="flex h-[400px] items-center justify-center border-2 border-dashed border-border rounded-2xl">
              <p className="text-muted-foreground font-medium">Leaderboard em construção...</p>
            </div>
          </TabsContent>
          <TabsContent value="funil" className="mt-0">
             <div className="flex h-[400px] items-center justify-center border-2 border-dashed border-border rounded-2xl">
              <p className="text-muted-foreground font-medium">Análise de vazamento de funil...</p>
            </div>
          </TabsContent>
          <TabsContent value="anuncios" className="mt-0">
            <div className="flex h-[400px] items-center justify-center border-2 border-dashed border-border rounded-2xl">
              <p className="text-muted-foreground font-medium">ROI dos anúncios e métricas de campanhas...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
