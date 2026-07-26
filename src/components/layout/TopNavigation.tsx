import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { menuGroups } from '@/config/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

export function TopNavigation() {
  const location = useLocation();

  const principalGroup = menuGroups.find(g => g.label === 'Principal')?.items || [];
  const ferramentasGroup = menuGroups.find(g => g.label === 'Ferramentas')?.items || [];
  const equipeGroup = menuGroups.find(g => g.label === 'Equipe')?.items || [];

  return (
    <div className="w-full bg-card border-b border-border shadow-sm z-10 px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-6">
        {/* Logo or Brand could go here if needed, but DashboardLayout handles header maybe? Let's just put the links */}
        <nav className="flex items-center gap-1">
          {principalGroup.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                Ferramentas <ChevronDown className="w-4 h-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Ferramentas</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {ferramentasGroup.map((item) => {
                const Icon = item.icon;
                return (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link to={item.path} className="flex items-center gap-2 cursor-pointer">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                Equipe <ChevronDown className="w-4 h-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Gestão</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {equipeGroup.map((item) => {
                const Icon = item.icon;
                return (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link to={item.path} className="flex items-center gap-2 cursor-pointer">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </div>
  );
}
