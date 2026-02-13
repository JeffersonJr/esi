import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowUpRight, ArrowDownRight, ArrowRight, Users, Home, Calendar, TrendingUp, AlertTriangle, Clock, FileText, Settings, DollarSign, Target, Activity, Zap, Star, Sun, Moon, Save } from 'lucide-react';
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

// Get greeting based on time of day
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'Bom dia', icon: Sun };
  if (hour < 18) return { text: 'Boa tarde', icon: Sun };
  return { text: 'Boa noite', icon: Moon };
};

// Extract name from email
const getUserName = (email: string) => {
  const namePart = email.split('@')[0];
  // Remove numbers, dots, underscores and capitalize first letter
  const cleanName = namePart.replace(/[0-9._-]/g, ' ').trim();
  return cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase();
};

const calculateNewMetrics = () => {
  const totalLeads = 347;
  const closedDeals = 12;
  const totalValue = 2450000; // Valor total dos negócios fechados
  const qualifiedLeads = 89;
  const monthlyTarget = 3000000;
  const currentMonthValue = 2450000;
  const avgResponseTime = 2.5; // horas

  return {
    conversionRate: ((closedDeals / totalLeads) * 100).toFixed(1),
    avgTicket: new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(totalValue / closedDeals),
    qualifiedLeads: qualifiedLeads.toString(),
    monthlyProgress: ((currentMonthValue / monthlyTarget) * 100).toFixed(0),
    avgResponseTime: `${avgResponseTime}h`,
  };
};

const newMetricsData = calculateNewMetrics();


const daySummary = {
  newLeads: 8,
  scheduledVisits: 5,
  pendingProposals: 3,
  urgentTasks: 2,
  todayRevenue: 450000,
};

const recentActivities = [
  { id: 1, type: 'lead', description: 'Novo lead: Maria Santos - Interesse em apartamento 3 quartos', time: '5 min atrás', priority: 'high' },
  { id: 2, type: 'visita', description: 'Visita agendada: Apt 302 - João Silva', time: '30 min atrás', priority: 'medium' },
  { id: 3, type: 'proposta', description: 'Proposta enviada: Casa 4 quartos - R$ 580.000', time: '1 hora atrás', priority: 'high' },
  { id: 4, type: 'negocio', description: 'Negócio fechado: Cobertura Centro - R$ 1.200.000', time: '2 horas atrás', priority: 'high' },
  { id: 5, type: 'tarefa', description: 'Documentação pendente: Imóvel Jardim América', time: '3 horas atrás', priority: 'urgent' },
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
  const { toast } = useToast();
  const navigate = useNavigate();
  const [daysThreshold, setDaysThreshold] = useState(30);
  const [initialDaysThreshold, setInitialDaysThreshold] = useState(30);
  const [hasChanges, setHasChanges] = useState(false);
  const propertyMetrics = calculateMetrics(daysThreshold);
  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;
  const userEmail = 'jefferson@evolston@evolvestecnologia.com.br'; // Mock user email
  const userName = getUserName(userEmail);

  // Navigation functions for strategic metrics
  const handleConversionRateClick = () => {
    navigate('/relatorios/conversao');
  };

  const handleAverageTicketClick = () => {
    navigate('/relatorios/ticket-medio');
  };

  const handleQualifiedLeadsClick = () => {
    navigate('/leads?filter=qualified');
  };

  const handleMonthlyTargetClick = () => {
    navigate('/relatorios/meta-mensal');
  };

  const newMetrics = [
    {
      title: 'Taxa de Conversão',
      value: `${newMetricsData.conversionRate}%`,
      change: '+2.3%',
      trend: 'up',
      icon: Target,
      color: 'text-purple-600',
      subtitle: 'Leads → Negócios',
      period: 'Este mês',
      needsAttention: parseFloat(newMetricsData.conversionRate) < 3,
      onClick: handleConversionRateClick,
    },
    {
      title: 'Ticket Médio',
      value: newMetricsData.avgTicket,
      change: '+5.7%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600',
      period: 'Este mês',
      needsAttention: false,
      onClick: handleAverageTicketClick,
    },
    {
      title: 'Leads Qualificados',
      value: newMetricsData.qualifiedLeads,
      change: '+12.1%',
      trend: 'up',
      icon: Star,
      color: 'text-yellow-600',
      period: 'Este mês',
      needsAttention: parseInt(newMetricsData.qualifiedLeads) < 100,
      onClick: handleQualifiedLeadsClick,
    },
    {
      title: 'Meta Mensal',
      value: `${newMetricsData.monthlyProgress}%`,
      change: '+8.4%',
      trend: 'up',
      icon: Activity,
      color: 'text-blue-600',
      subtitle: 'R$ 2.4M / R$ 3M',
      period: 'Este mês',
      needsAttention: parseFloat(newMetricsData.monthlyProgress) < 80,
      onClick: handleMonthlyTargetClick,
    },
  ];

  // Navigation functions for property metrics
  const handleNavigateToProperties = (filter?: string) => {
    const url = filter ? `/imoveis?filter=${filter}` : '/imoveis';
    navigate(url);
  };

  const handleTotalPropertiesClick = () => {
    handleNavigateToProperties();
  };

  const handleOutdatedPropertiesClick = () => {
    handleNavigateToProperties('outdated');
  };

  const handleDraftsClick = () => {
    handleNavigateToProperties('draft');
  };

  const handleIncompleteActiveClick = () => {
    handleNavigateToProperties('incomplete-active');
  };

  // Detect changes in daysThreshold
  const handleDaysThresholdChange = (value: number) => {
    setDaysThreshold(value);
    setHasChanges(value !== initialDaysThreshold);
  };

  // Save settings
  const handleSave = () => {
    setInitialDaysThreshold(daysThreshold);
    setHasChanges(false);
    // Here you would normally save to backend
    console.log('Settings saved:', { daysThreshold });
    
    // Show success toast
    toast({
      title: "Configurações salvas",
      description: `Período de ${daysThreshold} dias foi salvo com sucesso.`,
      variant: "success"
    });
  };

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
      onClick: handleTotalPropertiesClick,
    },
    {
      title: 'Imóveis Desatualizados',
      value: propertyMetrics.desatualizados.toString(),
      icon: Clock,
      color: 'text-orange-600',
      subtitle: `> ${daysThreshold} dias`,
      onClick: handleOutdatedPropertiesClick,
    },
    {
      title: 'Rascunhos',
      value: propertyMetrics.rascunhos.toString(),
      icon: FileText,
      color: 'text-gray-600',
      onClick: handleDraftsClick,
    },
    {
      title: 'Ativos Incompletos',
      value: propertyMetrics.ativosIncompletos.toString(),
      icon: AlertTriangle,
      color: 'text-red-600',
      subtitle: '< 80% completo',
      onClick: handleIncompleteActiveClick,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-primary to-primary-600 text-primary-foreground">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <GreetingIcon className="h-6 w-6" />
                <h1 className="text-2xl font-bold">{greeting.text}, {userName}!</h1>
              </div>
              <p className="text-primary-foreground/90">
                Aqui está o resumo do seu dia e as métricas mais importantes do seu negócio.
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">
                {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </div>
              <div className="text-primary-foreground/80">
                {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Day Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Resumo do Dia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{daySummary.newLeads}</div>
              <div className="text-sm text-blue-600">Novos Leads</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{daySummary.scheduledVisits}</div>
              <div className="text-sm text-green-600">Visitas</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{daySummary.pendingProposals}</div>
              <div className="text-sm text-yellow-600">Propostas</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{daySummary.urgentTasks}</div>
              <div className="text-sm text-red-600">Urgentes</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(daySummary.todayRevenue)}
              </div>
              <div className="text-sm text-purple-600">Faturamento</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Strategic Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {newMetrics.map((metric) => {
          const Icon = metric.icon;
          const TrendIcon = metric.trend === 'up' ? ArrowUpRight : ArrowDownRight;

          return (
            <Card 
              key={metric.title} 
              className={cn("hover:shadow-lg transition-shadow cursor-pointer hover:bg-gray-50", metric.needsAttention && "border-red-200 bg-red-50/30")}
              onClick={metric.onClick}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex flex-col">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </CardTitle>
                  <div className="text-xs text-muted-foreground/70">
                    {metric.period}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {metric.needsAttention && (
                    <div className="relative">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <div className="absolute inset-0 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                    </div>
                  )}
                  <Icon className={cn('h-5 w-5', metric.color)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div className="flex-1">
                    <div className="text-3xl font-bold">{metric.value}</div>
                    {metric.subtitle && (
                      <div className="text-xs text-muted-foreground mt-1">{metric.subtitle}</div>
                    )}
                    <div
                      className={cn(
                        'flex items-center text-sm mt-1',
                        metric.trend === 'up' ? 'text-success' : 'text-destructive'
                      )}
                    >
                      <TrendIcon className="h-4 w-4 mr-1" />
                      {metric.change}
                    </div>
                    <div 
                      className="flex items-center gap-1 mt-2 text-sm text-primary hover:text-primary/80 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        metric.onClick();
                      }}
                    >
                      <span>Ver detalhes</span>
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Original Metrics */}
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
              <Label htmlFor="daysThreshold" className="text-sm text-muted-foreground">
                Últimos
              </Label>
              <Input
                id="daysThreshold"
                type="number"
                min="1"
                max="365"
                value={daysThreshold}
                onChange={(e) => handleDaysThresholdChange(Number(e.target.value))}
                className="w-20"
              />
              <Label htmlFor="daysThreshold" className="text-sm text-muted-foreground">
                dias
              </Label>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSave}
                disabled={!hasChanges}
                className={cn(
                  "transition-all duration-200",
                  hasChanges 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : "opacity-50 cursor-not-allowed"
                )}
              >
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {propertyMetricsCards.map((metric) => {
              const Icon = metric.icon;

              return (
                <Card 
                  key={metric.title} 
                  className="hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50"
                  onClick={metric.onClick}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                        <p className="text-2xl font-bold mt-1">{metric.value}</p>
                        {metric.subtitle && (
                          <p className="text-xs text-muted-foreground mt-1">{metric.subtitle}</p>
                        )}
                        <div 
                          className="flex items-center gap-1 mt-2 text-sm text-primary hover:text-primary/80 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            metric.onClick();
                          }}
                        >
                          <span>Ver detalhes</span>
                          <ArrowRight className="h-3 w-3" />
                        </div>
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
            <div className="flex items-center justify-between">
              <CardTitle>Funil de Vendas</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/funil-vendas')}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                <span className="text-sm">Ver detalhes</span>
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {funilData.map((stage, index) => {
                const previousCount = index > 0 ? funilData[index - 1].count : stage.count;
                const conversionRate = index > 0 ? ((stage.count / previousCount) * 100).toFixed(1) : null;
                
                return (
                  <div key={stage.stage} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{stage.stage}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{stage.count} leads</span>
                        {conversionRate && (
                          <span className={cn(
                            "text-xs px-2 py-1 rounded",
                            parseFloat(conversionRate) >= 70 ? "bg-green-100 text-green-700" :
                            parseFloat(conversionRate) >= 50 ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                          )}>
                            {conversionRate}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn('h-full transition-all duration-500', stage.color)}
                        style={{ width: `${(stage.count / funilData[0].count) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Atividades Recentes</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/funil-vendas?filter=ultimos-30-dias')}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                <span className="text-sm">Ver detalhes</span>
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  className="flex gap-3 pb-4 border-b border-border last:border-0 last:pb-0 animate-slide-in cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => {
                    // Navigate to specific page based on activity type
                    if (activity.type === 'lead' || activity.description.includes('lead')) {
                      // Extract lead name from description and navigate to specific lead
                      const leadName = activity.description.split(':')[1]?.split('-')[0]?.trim();
                      if (leadName) {
                        navigate(`/leads/${leadName.toLowerCase().replace(/\s+/g, '-')}`);
                      } else {
                        navigate('/leads');
                      }
                    } else if (activity.type === 'visita') {
                      navigate('/visitas');
                    } else if (activity.type === 'proposta') {
                      navigate('/propostas');
                    } else if (activity.type === 'negocio') {
                      navigate('/negocios');
                    } else {
                      navigate('/atividades');
                    }
                  }}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                      {activity.priority === 'urgent' && (
                        <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded">Urgente</span>
                      )}
                      {activity.priority === 'high' && (
                        <span className="px-2 py-0.5 text-xs bg-orange-100 text-orange-700 rounded">Alta</span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
