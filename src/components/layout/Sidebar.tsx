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
  TrendingUp,
  Building,
  Network,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { menuGroups } from '@/config/navigation';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  path: string;
  isActive: boolean;
  collapsed: boolean;
}

function NavItem({ icon: Icon, label, path, isActive, collapsed }: NavItemProps) {
  const content = (
    <Link
      to={path}
      className={cn(
        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-150 group relative',
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/60',
        collapsed && 'justify-center px-2'
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full" />
      )}
      <Icon
        className={cn(
          'flex-shrink-0 transition-colors',
          collapsed ? 'h-5 w-5' : 'h-4 w-4',
          isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
        )}
      />
      {!collapsed && (
        <span className="truncate">{label}</span>
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="text-xs font-medium">
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <TooltipProvider>
      <aside
        className={cn(
          'relative flex flex-col bg-card transition-all duration-300 ease-in-out',
          'border-r border-border',
          collapsed ? 'w-[60px]' : 'w-[60px] lg:w-[220px]'
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            'flex items-center border-b border-border',
            collapsed ? 'h-16 justify-center px-3' : 'h-16 px-4 justify-center lg:justify-start gap-3'
          )}
        >
          {/* Minimal logo (always visible) */}
          <div className={cn('flex-shrink-0', collapsed ? 'block' : 'block lg:hidden')}>
            <img
              src="/logominimal.svg"
              alt="ESI"
              className="h-8 w-8 object-contain"
              onError={(e) => {
                const t = e.target as HTMLImageElement;
                t.style.display = 'none';
                t.parentElement!.innerHTML =
                  '<div class="h-8 w-8 rounded-lg bg-primary flex items-center justify-center"><span class="text-white font-bold text-sm">E</span></div>';
              }}
            />
          </div>

          {/* Full logo (expanded + desktop) */}
          {!collapsed && (
            <div className="hidden lg:flex items-center gap-2">
              <img
                src="/logominimal.svg"
                alt="Evolves Logo"
                className="h-7 w-auto object-contain"
                onError={(e) => {
                  const t = e.target as HTMLImageElement;
                  t.style.display = 'none';
                }}
              />
              <span className="font-bold text-xl tracking-tight text-primary">evolves</span>
            </div>
          )}
        </div>

        {/* Toggle button */}
        <button
          className={cn(
            'absolute -right-3 top-[4.5rem] z-20',
            'h-6 w-6 rounded-full border border-border bg-card shadow-sm-pro',
            'flex items-center justify-center',
            'text-muted-foreground hover:text-foreground hover:bg-muted',
            'transition-all duration-150 cursor-pointer',
            'hidden lg:flex'
          )}
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          {collapsed
            ? <ChevronRight className="h-3 w-3" />
            : <ChevronLeft  className="h-3 w-3" />
          }
        </button>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2">
          {menuGroups.map((group, groupIdx) => (
            <div key={group.label} className={cn(groupIdx > 0 && 'mt-4')}>
              {/* Group label — only in expanded mode on desktop */}
              {!collapsed && (
                <p className="hidden lg:block px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 select-none">
                  {group.label}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavItem
                    key={item.path}
                    icon={item.icon}
                    label={item.label}
                    path={item.path}
                    isActive={location.pathname === item.path}
                    collapsed={collapsed}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border">
          {!collapsed && (
            <p className="hidden lg:block text-center text-[10px] text-muted-foreground/40 select-none">
              ESI © {new Date().getFullYear()}
            </p>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
