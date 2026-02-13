import { Bell, Search, Check, LogOut } from 'lucide-react';
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

export function Header() {
  const navigate = useNavigate();

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
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar contatos, imóveis, atividades..."
            className="pl-10 bg-background"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-destructive text-xs">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
              <Check className="h-4 w-4" />
              Marcar como lidas
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start py-3">
              <div className="font-medium">Nova proposta recebida</div>
              <div className="text-sm text-muted-foreground">João Silva enviou proposta para Apt 302</div>
              <div className="text-xs text-muted-foreground mt-1">Há 5 minutos</div>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start py-3">
              <div className="font-medium">Visita agendada</div>
              <div className="text-sm text-muted-foreground">Visita ao Condomínio Solar às 14h</div>
              <div className="text-xs text-muted-foreground mt-1">Há 30 minutos</div>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start py-3">
              <div className="font-medium">Novo lead cadastrado</div>
              <div className="text-sm text-muted-foreground">Maria Santos - Interessada em apartamento</div>
              <div className="text-xs text-muted-foreground mt-1">Há 1 hora</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground">AD</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline">Admin</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleProfile} className="cursor-pointer">
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSettings} className="cursor-pointer">
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
