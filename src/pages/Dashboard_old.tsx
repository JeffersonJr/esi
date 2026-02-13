import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowUpRight, ArrowDownRight, Users, Home, Calendar, TrendingUp, AlertTriangle, Clock, FileText, Settings, DollarSign, Target, Activity, Zap, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for properties
const mockProperties = [
  { id: '1', status: 'ativo', lastUpdated: new Date('2024-12-01'), completeness: 95 },
  { id: '2', status: 'ativo', lastUpdated: new Date('2024-12-15'), completeness: 100 },
  { id: '3', status: 'rascunho', lastUpdated: new Date('2024-11-20'), completeness: 60 },
  { id: '4', status: 'ativo', lastUpdated: new Date('2024-10-15'), completeness: 80 },
  { id: '5', status: 'ativo', lastUpdated: new Date('2024-12-10'), completeness: 45 },
  { id: '6', status: 'rascunho', lastUpdated: new Date('2024-12-05'), completeness: 30 },
  { id: '7', status: 'ativo', lastUpdated: new Date('2024-09-01'), completeness: 100 },
  { id: '8', status: 'ativo', lastUpdated: new Date('2024-12-18'), completeness: 85 },
];

const calculateMetrics = (daysThreshold: number) => {
  const now = new Date();
  const thresholdDate = new Date(now.getTime() - (daysThreshold * 24 * 60 * 60 * 1000));
  
  const total = mockProperties.length;
  const ativos = mockProperties.filter(p => p.status === 'ativo').length;
  const rascunhos = mockProperties.filter(p => p.status === 'rascunho').length;
  const desatualizados = mockProperties.filter(p => p.lastUpdated < thresholdDate).length;
  const ativosIncompletos = mockProperties.filter(p => p.status === 'ativo' && p.completeness < 80).length;
  
  return { total, ativos, rascunhos, desatualizados, ativosIncompletos };
};

const metrics = [
  {
    title: 'Total de Leads',
    value: '347',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    color: 'text-primary',
  },
  {
    title: 'Imóveis Ativos',
    value: '0',
    change: '+8.2%',
    trend: 'up',
    icon: Home,
    color: 'text-accent',
  },
  {
    title: 'Visitas Agendadas',
    value: '24',
    change: '-3.1%',
    trend: 'down',
    icon: Calendar,
    color: 'text-warning',
  },
  {
    title: 'Negócios Fechados',
    value: '12',
    change: '+18.7%',
    trend: 'up',
    icon: TrendingUp,
    color: 'text-success',
  },
];

const recentActivities = [
  { id: 1, type: 'lead', description: 'Novo lead: Maria Santos', time: '5 min atrás' },
  { id: 2, type: 'visita', description: 'Visita agendada: Apt 302 - João Silva', time: '30 min atrás' },
  { id: 3, type: 'proposta', description: 'Proposta enviada: Casa 4 quartos', time: '1 hora atrás' },
  { id: 4, type: 'negocio', description: 'Negócio fechado: Cobertura Centro', time: '2 horas atrás' },
  { id: 5, type: 'lead', description: 'Novo lead: Carlos Oliveira', time: '3 horas atrás' },
];

const funilData = [
  { stage: 'Novo Lead', count: 45, color: 'bg-primary-400' },
  { stage: 'Contato Realizado', count: 32, color: 'bg-primary-500' },
  { stage: 'Visita Agendada', count: 24, color: 'bg-primary-600' },
  { stage: 'Proposta Enviada', count: 18, color: 'bg-primary-700' },
  { stage: 'Negociação', count: 12, color: 'bg-primary-800' },
  { stage: 'Fechado', count: 8, color: 'bg-success' },
];

export function Dashboard() {
  const [daysThreshold, setDaysThreshold] = useState(30);
  const propertyMetrics = calculateMetrics(daysThreshold);

  // Update metrics with calculated values
  const updatedMetrics = [
    {
      title: 'Total de Leads',
      value: '347',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'text-primary',
    },
    {
      title: 'Imóveis Ativos',
      value: propertyMetrics.ativos.toString(),
      change: '+8.2%',
      trend: 'up',
      icon: Home,
      color: 'text-accent',
    },
    {
      title: 'Visitas Agendadas',
      value: '24',
      change: '-3.1%',
      trend: 'down',
      icon: Calendar,
      color: 'text-warning',
    },
    {
      title: 'Negócios Fechados',
      value: '12',
      change: '+18.7%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-success',
    },
  ];

  const propertyMetricsCards = [
    {
      title: 'Total de Imóveis',
      value: propertyMetrics.total.toString(),
      icon: FileText,
      color: 'text-blue-600',
    },
    {
      title: 'Imóveis Desatualizados',
      value: propertyMetrics.desatualizados.toString(),
      icon: Clock,
      color: 'text-orange-600',
      subtitle: `> ${daysThreshold} dias`,
    },
    {
      title: 'Rascunhos',
      value: propertyMetrics.rascunhos.toString(),
      icon: FileText,
      color: 'text-gray-600',
    },
    {
      title: 'Ativos Incompletos',
      value: propertyMetrics.ativosIncompletos.toString(),
      icon: AlertTriangle,
      color: 'text-red-600',
      subtitle: '< 80% completo',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do seu sistema imobiliário</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {updatedMetrics.map((metric) => {
          const Icon = metric.icon;
          const TrendIcon = metric.trend === 'up' ? ArrowUpRight : ArrowDownRight;

          return (
            <Card key={metric.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <Icon className={cn('h-5 w-5', metric.color)} />
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-3xl font-bold">{metric.value}</div>
                    <div
                      className={cn(
                        'flex items-center text-sm mt-1',
                        metric.trend === 'up' ? 'text-success' : 'text-destructive'
                      )}
                    >
                      <TrendIcon className="h-4 w-4 mr-1" />
                      {metric.change}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Property Metrics Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Métricas de Imóveis</CardTitle>
            <div className="flex items-center gap-2">
              <Label htmlFor="days-threshold" className="text-sm">Dias para desatualizado:</Label>
              <Input
                id="days-threshold"
                type="number"
                min="1"
                max="365"
                value={daysThreshold}
                onChange={(e) => setDaysThreshold(Number(e.target.value))}
                className="w-20"
              />
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {propertyMetricsCards.map((metric) => {
              const Icon = metric.icon;

              return (
                <Card key={metric.title} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                        <p className="text-2xl font-bold mt-1">{metric.value}</p>
                        {metric.subtitle && (
                          <p className="text-xs text-muted-foreground mt-1">{metric.subtitle}</p>
                        )}
                      </div>
                      <Icon className={cn('h-8 w-8', metric.color)} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Funil de Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {funilData.map((stage, index) => (
                <div key={stage.stage} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{stage.stage}</span>
                    <span className="text-sm text-muted-foreground">{stage.count} leads</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn('h-full transition-all duration-500', stage.color)}
                      style={{ width: `${(stage.count / funilData[0].count) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  className="flex gap-3 pb-4 border-b border-border last:border-0 last:pb-0 animate-slide-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
