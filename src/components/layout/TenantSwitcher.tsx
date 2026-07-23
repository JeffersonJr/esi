import { useState } from 'react';
import { ChevronDown, Building, Check } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const tenants = [
  { id: '1', nome: 'Lopes SP', logo: '🏢' },
  { id: '2', nome: 'Remax Elite', logo: '🏘️' },
  { id: '3', nome: 'Century 21', logo: '🏠' },
];

export function TenantSwitcher({ collapsed = false }: { collapsed?: boolean }) {
  const [tenantAtivo, setTenantAtivo] = useState(tenants[0]);
  const [mostrarTenantSheet, setMostrarTenantSheet] = useState(false);
  const [loadingTenant, setLoadingTenant] = useState(false);

  const handleMudarTenant = (t: any) => {
    if (t.id === tenantAtivo.id) return;
    setLoadingTenant(true);
    setTimeout(() => {
      setTenantAtivo(t);
      setLoadingTenant(false);
      setMostrarTenantSheet(false);
    }, 1500);
  };

  return (
    <DropdownMenu open={mostrarTenantSheet} onOpenChange={setMostrarTenantSheet}>
      <DropdownMenuTrigger asChild>
        <div 
          className={cn(
            "flex items-center gap-2 rounded-xl bg-card border border-border p-1.5 shadow-sm cursor-pointer hover:bg-accent/50 hover:border-primary/30 transition-all duration-300 outline-none",
            collapsed ? "justify-center" : "pr-3"
          )}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors shrink-0">
            <span className="text-lg">{tenantAtivo.logo}</span>
          </div>
          
          {!collapsed && (
            <>
              <div className="flex flex-col hidden sm:flex justify-center flex-1 overflow-hidden">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-0.5">Imobiliária</span>
                <span className="text-xs font-bold text-foreground truncate max-w-[120px] leading-none">
                  {tenantAtivo.nome}
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground ml-1 shrink-0" />
            </>
          )}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        side="right" 
        align="start"
        className="w-72 shadow-lg-pro border-border/60 ml-2 p-0 rounded-2xl"
      >
        {loadingTenant ? (
          <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
              <span className="text-4xl relative z-10 animate-bounce">{tenantAtivo.logo}</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="text-sm font-bold text-foreground">Acessando {tenantAtivo.nome}...</span>
              <span className="text-xs text-muted-foreground">Preparando seu ambiente</span>
            </div>
            <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary animate-pulse w-full rounded-full origin-left" style={{ animationDuration: '1.5s' }}></div>
            </div>
          </div>
        ) : (
          <>
            <div className="p-4 border-b border-border bg-muted/20">
              <div className="flex items-center gap-2 mb-1">
                <Building className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold">Suas Imobiliárias</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Selecione em qual base de dados deseja atuar.
              </p>
            </div>
            <div className="p-2 space-y-1">
              {tenants.map(t => (
                <DropdownMenuItem
                  key={t.id}
                  onClick={() => handleMudarTenant(t)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all",
                    tenantAtivo.id === t.id 
                      ? 'bg-primary/10 text-primary focus:bg-primary/15' 
                      : 'hover:bg-muted focus:bg-muted'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg text-xl shadow-sm",
                      tenantAtivo.id === t.id ? "bg-background" : "bg-muted"
                    )}>
                      {t.logo}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">{t.nome}</span>
                      {tenantAtivo.id === t.id && (
                        <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 opacity-80">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                          Ativa
                        </span>
                      )}
                    </div>
                  </div>
                  {tenantAtivo.id === t.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
