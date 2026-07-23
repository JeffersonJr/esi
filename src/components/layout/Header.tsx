import { useState } from 'react';
import { Bell, Search, Check, LogOut, X, User, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { CheckinWidget } from '@/components/checkin/CheckinWidget';
import { TenantSwitcher } from '@/components/layout/TenantSwitcher';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface HeaderProps {
  mobileMenuTrigger?: React.ReactNode;
}

const notificationTypeColor: Record<string, string> = {
  proposal: 'bg-primary/10 text-primary',
  visit:    'bg-success/10 text-success',
  lead:     'bg-warning/10 text-warning',
};

const notificationTypeDot: Record<string, string> = {
  proposal: 'bg-primary',
  visit:    'bg-success',
  lead:     'bg-warning',
};

export function Header({ mobileMenuTrigger }: HeaderProps) {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Nova proposta recebida',
      description: 'João Silva enviou proposta para Apt 302',
      time: '5 min atrás',
      isRead: false,
      type: 'proposal',
      link: '/funil?filter=proposals',
    },
    {
      id: 2,
      title: 'Visita agendada',
      description: 'Visita ao Condomínio Solar às 14h',
      time: '30 min atrás',
      isRead: false,
      type: 'visit',
      link: '/agenda',
    },
    {
      id: 3,
      title: 'Novo lead cadastrado',
      description: 'Maria Santos — Interessada em apartamento',
      time: '1 hora atrás',
      isRead: false,
      type: 'lead',
      link: '/funil',
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    toast({ title: 'Notificações lidas', description: 'Todas marcadas como lidas.' });
  };

  const handleNotificationClick = (id: number, link: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    if (link) navigate(link);
  };

  const handleRemoveNotification = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    toast({ title: 'Sessão encerrada', description: 'Até logo!' });
    navigate('/login');
  };

  return (
    <header className="h-14 border-b border-border bg-card px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: mobile trigger + search */}
      <div className="flex items-center flex-1 gap-3 max-w-lg">
        {mobileMenuTrigger}

        {/* Desktop search */}
        <div className="relative w-full hidden md:flex items-center">
          <Search className="absolute left-3 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Buscar..."
            className={cn(
              'pl-9 pr-16 h-9 text-sm',
              'bg-muted/40 border-transparent',
              'focus-visible:bg-background focus-visible:border-border focus-visible:ring-1 focus-visible:ring-primary/20',
              'placeholder:text-muted-foreground/60 transition-all duration-200'
            )}
          />
          <kbd className="absolute right-3 pointer-events-none hidden sm:flex items-center gap-0.5 text-[10px] font-medium text-muted-foreground/50 bg-muted rounded px-1.5 py-0.5">
            ⌘K
          </kbd>
        </div>

        {/* Mobile search icon */}
        <Button variant="ghost" size="icon" className="md:hidden h-8 w-8">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1.5 md:gap-2">
        <ThemeToggle />
        <CheckinWidget />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 hover:bg-muted/60 transition-colors"
            >
              <Bell className="h-4 w-4 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[9px] font-bold text-white flex items-center justify-center border-2 border-card">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-80 p-0 shadow-lg-pro border-border/60"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="text-sm font-semibold">Notificações</span>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                    {unreadCount} nova{unreadCount > 1 ? 's' : ''}
                  </Badge>
                )}
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-[11px] text-primary hover:bg-primary/5"
                    onClick={handleMarkAllRead}
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Marcar lidas
                  </Button>
                )}
              </div>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <DropdownMenuItem
                    key={n.id}
                    className={cn(
                      'flex flex-col items-start px-4 py-3 gap-1 cursor-pointer border-b last:border-0 border-border/40 focus:bg-muted/40',
                      !n.isRead && 'bg-primary/[0.03]'
                    )}
                    onClick={() => handleNotificationClick(n.id, n.link)}
                  >
                    <div className="flex items-start justify-between w-full gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={cn(
                            'flex-shrink-0 h-1.5 w-1.5 rounded-full mt-0.5',
                            !n.isRead
                              ? notificationTypeDot[n.type] ?? 'bg-primary'
                              : 'bg-transparent'
                          )}
                        />
                        <span className="text-xs font-semibold text-foreground truncate">
                          {n.title}
                        </span>
                      </div>
                      <button
                        className="flex-shrink-0 h-4 w-4 flex items-center justify-center rounded hover:bg-muted text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                        onClick={(e) => handleRemoveNotification(e, n.id)}
                        aria-label="Remover notificação"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-1 ml-3.5">
                      {n.description}
                    </p>
                    <span className="text-[10px] text-muted-foreground/50 ml-3.5 font-medium">
                      {n.time}
                    </span>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="py-10 flex flex-col items-center gap-2 text-center">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <Bell className="h-4 w-4 text-muted-foreground/40" />
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">Sem notificações</p>
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Divider */}
        <div className="hidden md:block w-px h-5 bg-border mx-0.5" />

        {/* Tenant Switcher */}
        <div className="hidden md:flex items-center">
          <TenantSwitcher collapsed={true} />
        </div>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-2 h-9 hover:bg-muted/60 transition-colors"
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                  AD
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-xs font-semibold leading-none">Admin</span>
                <span className="text-[10px] text-muted-foreground leading-none mt-0.5">
                  Imobiliária Esi
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-44 shadow-md-pro border-border/60">
            <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
              Minha Conta
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigate('/perfil')}
              className="text-sm gap-2 cursor-pointer"
            >
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate('/configuracoes')}
              className="text-sm gap-2 cursor-pointer"
            >
              <Settings className="h-3.5 w-3.5 text-muted-foreground" />
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-sm gap-2 cursor-pointer text-destructive focus:text-destructive"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
