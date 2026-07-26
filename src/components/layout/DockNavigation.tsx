import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { menuGroups } from '@/config/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function DockNavigation() {
  const location = useLocation();
  // Flatten all items to show in the dock
  const allItems = menuGroups.flatMap(group => group.items);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-end gap-2 px-4 py-3 bg-background/80 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl mx-auto">
        <TooltipProvider delayDuration={0}>
          {allItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Tooltip key={item.path}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.path}
                    className={cn(
                      'relative group flex items-center justify-center rounded-xl transition-all duration-300 origin-bottom',
                      'w-12 h-12 hover:w-16 hover:h-16 hover:-translate-y-2',
                      isActive 
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' 
                        : 'bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary'
                    )}
                  >
                    <Icon className={cn(
                      "transition-all duration-300",
                      isActive ? 'w-6 h-6' : 'w-5 h-5 group-hover:w-8 group-hover:h-8'
                    )} />
                    {isActive && (
                      <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full" />
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={12} className="font-medium bg-foreground text-background border-none rounded-lg px-3 py-1.5">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>
    </div>
  );
}
