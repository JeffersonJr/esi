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
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface HeaderProps {
  mobileMenuTrigger?: React.ReactNode;
}

export function Header({ mobileMenuTrigger }: HeaderProps) {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Nova proposta recebida',
      description: 'João Silva enviou proposta para Apt 302',
      time: 'Há 5 minutos',
      isRead: false,
      type: 'proposal',
      link: '/funil?filter=proposals'
    },
    {
      id: 2,
      title: 'Visita agendada',
      description: 'Visita ao Condomínio Solar às 14h',
      time: 'Há 30 minutos',
      isRead: false,
      type: 'visit',
      link: '/agenda'
    },
    {
      id: 3,
      title: 'Novo lead cadastrado',
      description: 'Maria Santos - Interessada em apartamento',
      time: 'Há 1 hora',
      isRead: false,
      type: 'lead',
      link: '/funil'
    },
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    toast({
      title: "Notificações lidas",
      description: "Todas as notificações foram marcadas como lidas.",
    });
  };

  const handleNotificationClick = (id: number, link: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, isRead: true } : n
    ));
    if (link) navigate(link);
  };

  const handleRemoveNotification = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');

    toast({
      title: "Logout realizado",
      description: "Você foi deslogado com sucesso.",
    });

    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/perfil');
  };

  const handleSettings = () => {
    navigate('/configuracoes');
  };

  return (
    <header className="h-16 border-b border-border bg-card px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center flex-1 max-w-xl">
        {mobileMenuTrigger}
        <div className="relative w-full hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar contatos, imóveis, atividades..."
            className="pl-10 bg-background border-none shadow-inner focus-visible:ring-1 focus-visible:ring-primary/20"
          />
        </div>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Search className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative hover:bg-primary/5 transition-colors">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-destructive text-white border-2 border-background text-[10px] font-bold animate-in zoom-in duration-300">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0 shadow-2xl border-border/50 backdrop-blur-sm">
            <div className="p-4 border-b border-border bg-muted/30">
              <div className="flex items-center justify-between">
                <DropdownMenuLabel className="p-0 font-bold">Notificações</DropdownMenuLabel>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-xs text-primary hover:bg-transparent font-semibold"
                    onClick={handleMarkAllRead}
                  >
                    Marcar tudo como lido
                  </Button>
                )}
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={cn(
                      "flex flex-col items-start py-4 px-4 gap-1 cursor-pointer transition-colors border-b last:border-0 border-border/40",
                      !notification.isRead && "bg-primary/5 hover:bg-primary/10"
                    )}
                    onClick={() => handleNotificationClick(notification.id, notification.link)}
                  >
                    <div className="flex items-start justify-between w-full">
                      <div className="font-bold text-sm flex items-center gap-2">
                        {!notification.isRead && <div className="w-2 h-2 bg-primary rounded-full" />}
                        {notification.title}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 text-muted-foreground hover:text-destructive p-0"
                        onClick={(e) => handleRemoveNotification(e, notification.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      {notification.description}
                    </div>
                    <div className="text-[10px] text-muted-foreground/60 mt-1 font-medium">
                      {notification.time}
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="py-12 px-4 text-center flex flex-col items-center gap-2 animate-in fade-in duration-500">
                  <div className="p-3 bg-muted rounded-full">
                    <Bell className="h-6 w-6 text-muted-foreground/40" />
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">Tudo limpo por aqui!</div>
                  <div className="text-xs text-muted-foreground/60">Você não tem novas notificações.</div>
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-primary/5 transition-colors">
              <Avatar className="h-8 w-8 border border-primary/10 shadow-sm">
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary-700 text-white font-bold">AD</AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start leading-none">
                <span className="text-sm font-bold">Admin</span>
                <span className="text-[10px] text-muted-foreground font-medium mt-1">Imobiliária Esi</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 shadow-xl">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleProfile} className="cursor-pointer gap-2 py-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSettings} className="cursor-pointer gap-2 py-2">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer gap-2 py-2">
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header >
  );
}
