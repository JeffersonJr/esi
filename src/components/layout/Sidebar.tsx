import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
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
  ChevronLeft,
  ChevronRight,
  Globe,
  CreditCard,
  MessageCircle,
  Bot,
  Key,
  DollarSign,
  HelpCircle,
  Camera,
  Palette,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Kanban, label: 'Funil de Vendas', path: '/funil' },
  { icon: Users, label: 'Contatos', path: '/contatos' },
  { icon: Home, label: 'Imóveis', path: '/imoveis' },
  { icon: Calendar, label: 'Agenda', path: '/agenda' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: UserCircle, label: 'Usuários', path: '/usuarios' },
  { icon: UsersRound, label: 'Equipes', path: '/equipes' },
  { icon: Globe, label: 'Editor de Site', path: '/site' },
  { icon: CreditCard, label: 'esi.bank', path: '/esibank' },
  { icon: MessageCircle, label: 'esi.chat', path: '/esichat' },
  { icon: Bot, label: 'Automação', path: '/automacao' },
  { icon: Key, label: 'Locações', path: '/locacoes' },
  { icon: DollarSign, label: 'Financeiro', path: '/financeiro' },
  { icon: HelpCircle, label: 'Solicitações', path: '/solicitacoes' },
  { icon: Camera, label: 'Vistoria', path: '/vistoria' },
  { icon: Settings, label: 'Configurações', path: '/configuracoes' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        'relative flex flex-col bg-card border-r border-border transition-all duration-300',
        collapsed ? 'w-20' : 'w-20 lg:w-64'
      )}
    >
      <div className="flex items-center justify-between p-6 border-b border-border">
        {(!collapsed) && (
          <div className="flex items-center justify-center w-full lg:block hidden">
            <div className="w-full h-auto flex items-center justify-center px-4">
              <img
                src="/logoesi.svg"
                alt="ESI Logo"
                className="w-full h-auto object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = '<div class="w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center mx-auto"><span class="font-bold text-2xl">E</span></div>';
                }}
              />
            </div>
          </div>
        )}
        {(collapsed || true) && (
          <div className={cn("w-14 h-14 items-center justify-center mx-auto", collapsed ? "flex" : "flex lg:hidden")}>
            <img
              src="/logominimal.svg"
              alt="ESI Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = '<div class="w-10 h-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center transition-all"><span class="font-bold text-lg">E</span></div>';
              }}
            />
          </div>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-24 z-10 h-6 w-6 rounded-full border border-border bg-background shadow-md hover:bg-muted hidden lg:flex"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant={isActive ? 'default' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-3 transition-all',
                  (collapsed) ? 'justify-center px-2' : 'justify-center lg:justify-start px-2 lg:px-4',
                  isActive && 'bg-primary text-primary-foreground shadow-md'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span className="hidden lg:inline">{item.label}</span>}
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="text-center text-xs text-muted-foreground">
        </div>
      </div>
    </aside>
  );
}
