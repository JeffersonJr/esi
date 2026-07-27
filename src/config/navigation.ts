import {
  LayoutDashboard,
  Kanban,
  Users,
  Home,
  Calendar,
  BarChart3,
  UserCircle,
  UsersRound,
  Settings,
  Globe,
  CreditCard,
  MessageCircle,
  Bot,
  Key,
  DollarSign,
  HelpCircle,
  Camera,
  Building,
  Network,
  PieChart,
  LineChart,
} from 'lucide-react';

export const menuGroups = [
  {
    label: 'Principal',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard',    path: '/' },
      { icon: Kanban,           label: 'Esi.leads',   path: '/funil' },
      { icon: Users,            label: 'Contatos',    path: '/contatos' },
      { icon: Home,             label: 'Imóveis',     path: '/imoveis' },
      { icon: Building,         label: 'Empreendimentos', path: '/empreendimentos' },
      { icon: Calendar,         label: 'Agenda',      path: '/agenda' },
      { icon: BarChart3,        label: 'Analytics',   path: '/analytics' },
    ],
  },
  {
    label: 'Relatórios',
    items: [
      { icon: PieChart,         label: 'Analíticos',  path: '/relatorios/analiticos' },
      { icon: LineChart,        label: 'Desempenho',  path: '/relatorios/desempenho' },
    ],
  },
  {
    label: 'Ferramentas',
    items: [
      { icon: Globe,            label: 'Esi.sites',   path: '/site' },
      { icon: CreditCard,       label: 'Esi.bank',    path: '/esibank' },
      { icon: MessageCircle,    label: 'Esi.chat',    path: '/esichat' },
      { icon: Network,          label: 'Integrações', path: '/integracoes' },
      { icon: Bot,              label: 'Automação',   path: '/automacao' },
      { icon: Key,              label: 'Locações',    path: '/locacoes' },
      { icon: DollarSign,       label: 'Esi.finance', path: '/financeiro' },
      { icon: HelpCircle,       label: 'Solicitações',path: '/solicitacoes' },
      { icon: Camera,           label: 'Vistoria',    path: '/vistoria' },
    ],
  },
  {
    label: 'Equipe',
    items: [
      { icon: UserCircle,  label: 'Usuários', path: '/usuarios' },
      { icon: UsersRound,  label: 'Equipes',  path: '/equipes' },
      { icon: Settings,    label: 'Configurações', path: '/configuracoes' },
    ],
  },
];
