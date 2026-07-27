import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowUpRight, ArrowDownRight, ArrowRight, Users, Home, Calendar as CalendarIcon, TrendingUp, AlertTriangle, Clock, FileText, Settings, DollarSign, Target, Activity, Zap, Star, Sun, Moon, Save, Plus, MessageSquare, Briefcase, BarChart3, MapPin, Flame, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import { format, subDays, startOfDay, endOfDay, isWithinInterval } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { ptBR } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { RoletaModal } from '@/components/dashboard/RoletaModal';

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
  { stage: 'Novo Lead', count: 45, color: 'hsl(var(--primary))' },
  { stage: 'Contato Realizado', count: 32, color: 'hsl(var(--primary) / 0.8)' },
  { stage: 'Visita Agendada', count: 24, color: 'hsl(var(--primary) / 0.6)' },
  { stage: 'Proposta Enviada', count: 18, color: 'hsl(var(--primary) / 0.4)' },
  { stage: 'Negociação', count: 12, color: 'hsl(var(--primary) / 0.3)' },
  { stage: 'Fechado', count: 8, color: 'hsl(var(--primary) / 0.2)' },
];

const chartData = [
  { name: 'Seg', leads: 12, metas: 10 },
  { name: 'Ter', leads: 19, metas: 15 },
  { name: 'Qua', leads: 15, metas: 18 },
  { name: 'Qui', leads: 22, metas: 20 },
  { name: 'Sex', leads: 30, metas: 25 },
  { name: 'Sáb', leads: 25, metas: 22 },
  { name: 'Dom', leads: 18, metas: 15 },
];

export function Dashboard() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [daysThreshold, setDaysThreshold] = useState(30);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [initialDaysThreshold, setInitialDaysThreshold] = useState(30);
  const [hasChanges, setHasChanges] = useState(false);
  const [modoRoleta, setModoRoleta] = useState(false);

  const [tarefasPendentes, setTarefasPendentes] = useState([
    {
      id: '1',
      title: 'Ligar para João Silva',
      cliente: 'João Silva',
      tipo: 'Ligação',
      descricao: 'O cliente demonstrou interesse no apartamento do centro. Precisa confirmar horário da visita amanhã.'
    },
    {
      id: '2',
      title: 'Enviar proposta Comercial',
      cliente: 'Maria Oliveira',
      tipo: 'Proposta',
      descricao: 'Enviar a proposta comercial com as condições de pagamento discutidas ontem à tarde.'
    },
    {
      id: '3',
      title: 'Feedback pós-visita',
      cliente: 'Carlos Souza',
      tipo: 'Feedback',
      descricao: 'Pegar feedback sobre a visita na casa do condomínio fechado. O cliente gostou bastante da área de lazer.'
    }
  ]);

  const propertyMetrics = calculateMetrics(daysThreshold);
  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;
  const userEmail = 'jefferson@evolston@evolvestecnologia.com.br'; // Mock user email
  const userName = getUserName(userEmail);

  // Navigation functions for strategic metrics
  const handleConversionRateClick = () => {
    navigate('/analytics');
  };

  const handleAverageTicketClick = () => {
    navigate('/analytics');
  };

  const handleQualifiedLeadsClick = () => {
    navigate('/funil?filter=qualified');
  };

  const handleMonthlyTargetClick = () => {
    navigate('/analytics');
  };

  const newMetrics = [
    {
      title: 'Taxa de Conversão',
      tooltip: 'Percentual de leads que se tornaram negócios fechados.',
      value: `${newMetricsData.conversionRate}%`,
      change: '+2.3%',
      trend: 'up',
      icon: Target,
      color: 'text-primary',
      subtitle: 'Leads → Negócios',
      period: 'Este mês',
      needsAttention: parseFloat(newMetricsData.conversionRate) < 3,
      onClick: handleConversionRateClick,
    },
    {
      title: 'Ticket Médio',
      tooltip: 'Valor médio das vendas realizadas.',
      value: newMetricsData.avgTicket,
      change: '+5.7%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-success',
      period: 'Este mês',
      needsAttention: false,
      onClick: handleAverageTicketClick,
    },
    {
      title: 'Leads Qualificados',
      tooltip: 'Potenciais clientes que avançaram no funil e demonstraram real interesse.',
      value: newMetricsData.qualifiedLeads,
      change: '+12.1%',
      trend: 'up',
      icon: Star,
      color: 'text-warning',
      period: 'Este mês',
      needsAttention: parseInt(newMetricsData.qualifiedLeads) < 100,
      onClick: handleQualifiedLeadsClick,
    },
    {
      title: 'Meta Mensal',
      tooltip: 'Progresso em relação ao objetivo de vendas estabelecido para o mês atual.',
      value: `${newMetricsData.monthlyProgress}%`,
      change: '+8.4%',
      trend: 'up',
      icon: Activity,
      color: 'text-primary-600',
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
    handleNavigateToProperties('old-prices');
  };

  const handleDraftsClick = () => {
    handleNavigateToProperties('draft');
  };

  const handleIncompleteActiveClick = () => {
    handleNavigateToProperties('no-photos');
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
      tooltip: 'Número total de contatos captados.',
      value: '347',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'text-primary',
    },
    {
      title: 'Imóveis Ativos',
      tooltip: 'Imóveis atualmente disponíveis para negociação.',
      value: propertyMetrics.ativos.toString(),
      change: '+8.2%',
      trend: 'up',
      icon: Home,
      color: 'text-accent',
    },
    {
      title: 'Visitas Agendadas',
      tooltip: 'Número de visitas marcadas para demonstração de imóveis.',
      value: '24',
      change: '-3.1%',
      trend: 'down',
      icon: CalendarIcon,
      color: 'text-warning',
    },
    {
      title: 'Negócios Fechados',
      tooltip: 'Total de vendas ou locações concluídas.',
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
      tooltip: 'Quantidade total de imóveis cadastrados na plataforma.',
      value: propertyMetrics.total.toString(),
      icon: FileText,
      color: 'text-primary',
      onClick: handleTotalPropertiesClick,
    },
    {
      title: 'Imóveis Desatualizados',
      tooltip: 'Imóveis sem atualização de preço ou informações há mais de 30 dias.',
      value: propertyMetrics.desatualizados.toString(),
      icon: Clock,
      color: 'text-warning',
      subtitle: `> ${daysThreshold} dias`,
      onClick: handleOutdatedPropertiesClick,
    },
    {
      title: 'Rascunhos',
      tooltip: 'Imóveis com cadastro iniciado mas não publicado.',
      value: propertyMetrics.rascunhos.toString(),
      icon: FileText,
      color: 'text-muted-foreground',
      onClick: handleDraftsClick,
    },
    {
      title: 'Ativos Incompletos',
      tooltip: 'Imóveis cadastrados que não atingiram a porcentagem ideal de informações.',
      value: propertyMetrics.ativosIncompletos.toString(),
      icon: AlertTriangle,
      color: 'text-destructive',
      subtitle: '< 80% completo',
      onClick: handleIncompleteActiveClick,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Welcome Section */}
      {/* Welcome — Apple minimal style: no card, just typography + metadata */}
      <div className="flex items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/8 text-primary shrink-0">
            <GreetingIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-title-1 text-foreground leading-none">
              {greeting.text}, {userName}
            </h1>
            <p className="text-subheadline text-muted-foreground mt-0.5">
              Você possui <span className="font-semibold text-foreground">2 tarefas urgentes</span> aguardando.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-right shrink-0">
          <div className="flex flex-col items-end">
            <span className="text-[13px] font-semibold text-foreground leading-none">
              {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
            </span>
            <span className="text-[11px] text-muted-foreground capitalize mt-0.5">
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long' })}
            </span>
          </div>
          <div className="w-px h-8 bg-border mx-1" />
          <span className="text-[17px] font-medium tabular-nums text-foreground">
            {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Roleta Banner — subtle, minimal */}
      {tarefasPendentes.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-amber-50/80 dark:bg-amber-950/20 rounded-2xl px-4 py-3 border border-amber-200/60 dark:border-amber-800/30">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="flex size-7 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 shrink-0">
              <AlertTriangle className="size-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-foreground leading-snug">
                {tarefasPendentes.length} pendências aguardam sua atenção.
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                Entre no Modo Roleta e resolva tudo em sequência com Albert IA.
              </p>
            </div>
          </div>
          <button
            onClick={() => setModoRoleta(true)}
            className="w-full sm:w-auto shrink-0 h-8 px-4 rounded-xl bg-amber-600 dark:bg-amber-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-amber-700 transition-all"
          >
            <Flame className="size-3.5" />
            Modo Roleta
          </button>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Novo Lead', icon: Plus, color: 'bg-primary', action: () => navigate('/funil?action=novo-lead') },
          { label: 'Cadastrar Imóvel', icon: Home, color: 'bg-accent', action: () => navigate('/imoveis/cadastrar') },
          { label: 'Agendar Visita', icon: CalendarIcon, color: 'bg-success', action: () => navigate('/agenda?action=nova-atividade') },
          { label: 'Nova Proposta', icon: FileText, color: 'bg-warning', action: () => navigate('/funil?action=nova-proposta') },
        ].map((item, idx) => (
          <motion.button
            key={item.label}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * idx }}
            onClick={item.action}
            className={cn(
              "flex items-center gap-3 p-3.5 rounded-xl border border-border bg-card",
              "hover:border-primary/30 hover:shadow-card-hover transition-all duration-200 group text-left"
            )}
          >
            <div className={cn("p-2 rounded-lg text-white flex-shrink-0", item.color)}>
              <item.icon className="h-4 w-4" />
            </div>
            <span className="font-medium text-sm text-foreground">{item.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Day Summary */}
      <Card className="border border-border shadow-card overflow-hidden">
        <CardHeader className="pb-3 pt-5">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
            <Zap className="h-4 w-4 text-primary" />
            Resumo do Dia
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-5">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: 'Novos Leads', value: daySummary.newLeads, color: 'text-primary', bg: 'bg-primary/5 border-primary/10' },
              { label: 'Visitas', value: daySummary.scheduledVisits, color: 'text-success', bg: 'bg-success/5 border-success/10' },
              { label: 'Propostas', value: daySummary.pendingProposals, color: 'text-warning', bg: 'bg-warning/5 border-warning/10' },
              { label: 'Urgentes', value: daySummary.urgentTasks, color: 'text-destructive', bg: 'bg-destructive/5 border-destructive/10' },
              { label: 'Faturamento', value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(daySummary.todayRevenue), color: 'text-accent', bg: 'bg-accent/5 border-accent/10' },
            ].map((item) => (
              <div
                key={item.label}
                className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-lg border transition-colors",
                  item.bg
                )}
              >
                <div className={cn("text-2xl font-bold tracking-tight", item.color)}>
                  {item.value}
                </div>
                <div className="text-[11px] font-medium text-muted-foreground mt-1 text-center">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strategic Goals & Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border border-border shadow-card overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Target className="h-4 w-4 text-primary" />
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-help flex items-center gap-1 border-b border-dashed border-muted-foreground/50">
                        Meta de Vendas Mensal
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-[200px] text-center">Acompanhamento do objetivo financeiro do mês.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Badge variant="secondary" className="text-[10px] font-medium">Dezembro 2024</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1">
                <p className="text-[11px] font-medium tracking-tight text-muted-foreground">Progresso Atual</p>
                <div className="text-2xl font-bold tracking-tight text-foreground">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(2450000)}
                </div>
                <div className="flex items-center gap-1.5 text-success text-xs font-medium">
                  <TrendingUp className="h-3.5 w-3.5" />
                  +15.4% vs mês anterior
                </div>
              </div>

              <div className="col-span-2 space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-[11px] font-medium text-muted-foreground">Objetivo: R$ 3.000.000</p>
                  <span className="text-lg font-bold text-primary">82%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '82%' }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-primary to-primary-400 rounded-full"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Faltam <span className="font-semibold text-foreground">R$ 550.000</span> para bater a meta. Faltam 12 dias.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
              {[
                { label: 'Ticket Médio', value: 'R$ 612k', icon: DollarSign },
                { label: 'Conversão', value: '3.4%', icon: Activity },
                { label: 'Visitas/Mês', value: '42', icon: MapPin },
                { label: 'Novos Contratos', value: '8', icon: Briefcase },
              ].map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <p className="text-[10px] font-medium tracking-tight text-muted-foreground">{stat.label}</p>
                  <div className="flex items-center gap-1.5">
                    <stat.icon className="h-3.5 w-3.5 text-primary" />
                    <span className="text-sm font-semibold">{stat.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Star className="h-4 w-4 text-warning fill-warning" />
              Insight da IA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30">
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                Detectamos um aumento de 25% na procura por imóveis na Vila Mariana. Recomendamos focar suas campanhas nesta região.
              </p>
            </div>
            <Button variant="outline" size="sm" className="w-full text-xs font-medium text-amber-700 border-amber-200 hover:bg-amber-50 dark:text-amber-400 dark:border-amber-900/50">
              Ver Análise Completa
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* New Strategic Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {newMetrics.map((metric) => {
          const Icon = metric.icon;
          const TrendIcon = metric.trend === 'up' ? ArrowUpRight : ArrowDownRight;

          return (
            <Card
              key={metric.title}
              className={cn("border border-border shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer hover:border-border/60", metric.needsAttention && "border-destructive/20 bg-destructive/[0.02]")}
              onClick={metric.onClick}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex flex-col">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    <TooltipProvider delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help flex items-center gap-1 border-b border-dashed border-muted-foreground/50">
                            {metric.title}
                            <Info className="h-3.5 w-3.5 text-muted-foreground" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-[200px] text-center">{metric.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardTitle>
                  <div className="text-xs text-muted-foreground">
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
            <Card key={metric.title} className="border border-border shadow-card hover:shadow-card-hover transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help flex items-center gap-1 border-b border-dashed border-muted-foreground/50">
                          {metric.title}
                          <Info className="h-3.5 w-3.5 text-muted-foreground" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-[200px] text-center">{metric.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Métricas de Imóveis</CardTitle>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex bg-muted p-1 rounded-lg">
                {[30, 60, 90].map((period) => (
                  <Button
                    key={period}
                    variant={daysThreshold === period ? "default" : "ghost"}
                    size="sm"
                    className="h-8 text-xs px-3"
                    onClick={() => handleDaysThresholdChange(period)}
                  >
                    {period} dias
                  </Button>
                ))}

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={![30, 60, 90].includes(daysThreshold) ? "default" : "ghost"}
                      size="sm"
                      className="h-8 text-xs px-4 gap-2 min-w-[120px]"
                    >
                      <CalendarIcon className="h-3.5 w-3.5" />
                      {![30, 60, 90].includes(daysThreshold) && dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "dd/MM")} - {format(dateRange.to, "dd/MM")}
                          </>
                        ) : (
                          format(dateRange.from, "dd/MM")
                        )
                      ) : (
                        "Personalizado"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={(range) => {
                        setDateRange(range);
                        if (range?.from && range?.to) {
                          const diff = Math.ceil((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24));
                          setDaysThreshold(diff);
                          setHasChanges(true);
                        }
                      }}
                      numberOfMonths={2}
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {![30, 60, 90].includes(daysThreshold) && (
                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
                  <Input
                    id="daysThreshold"
                    type="number"
                    min="1"
                    max="365"
                    value={daysThreshold}
                    onChange={(e) => handleDaysThresholdChange(Number(e.target.value))}
                    className="w-20 h-8"
                  />
                  <Label htmlFor="daysThreshold" className="text-sm text-muted-foreground whitespace-nowrap">
                    dias
                  </Label>
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={!hasChanges}
                className={cn(
                  "h-8 transition-all duration-200",
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
                  className="border border-border shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer"
                  onClick={metric.onClick}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-muted-foreground">
                          <TooltipProvider delayDuration={300}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help flex items-center gap-1 border-b border-dashed border-muted-foreground/50">
                                  {metric.title}
                                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-[200px] text-center">{metric.tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
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


      <Card className="border border-border shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-help flex items-center gap-1 border-b border-dashed border-muted-foreground/50">
                      Atividades Recentes
                      <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-[200px] text-center">Histórico das últimas ações realizadas no sistema.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/funil')}
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
                className="flex gap-3 pb-4 border-b border-border last:border-0 last:pb-0 cursor-pointer hover:bg-muted/50 rounded-lg p-2 -mx-2 transition-colors"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => {
                  // Navigate to specific page based on activity type
                  if (activity.type === 'lead' || activity.description.includes('lead')) {
                    // Navigate to specific lead in funnel
                    navigate(`/leads/${activity.id}`);
                  } else if (activity.type === 'visita') {
                    navigate('/agenda');
                  } else if (activity.type === 'proposta') {
                    navigate('/funil?filter=proposals');
                  } else if (activity.type === 'negocio') {
                    navigate('/funil?filter=closed');
                  } else {
                    navigate('/agenda');
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

      {/* Roleta Modal (Fullscreen Overlay) */}
      {modoRoleta && (
        <RoletaModal
          atividades={tarefasPendentes}
          onClose={() => setModoRoleta(false)}
          onConcluirTarefa={(id, feedback) => {
            setTarefasPendentes(prev => prev.filter(t => t.id !== id));
            toast({ title: 'Atividade concluída', description: 'Mandou bem!' });
          }}
          onPularTarefa={(id) => {
            setTarefasPendentes(prev => {
              const task = prev.find(t => t.id === id);
              if (task) {
                const newTasks = prev.filter(t => t.id !== id);
                return [...newTasks, task];
              }
              return prev;
            });
          }}
        />
      )}
    </div>
  );
}
