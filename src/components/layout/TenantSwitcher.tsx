import { useState } from 'react';
import { ChevronDown, Building, Check, ArrowRight } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const tenants = [
  { id: '1', nome: 'Lopes SP', logo: '🏢' },
  { id: '2', nome: 'Remax Elite', logo: '🏘️' },
  { id: '3', nome: 'Century 21', logo: '🏠' },
];

export function TenantSwitcher({ collapsed = false }: { collapsed?: boolean }) {
  const [tenantAtivo, setTenantAtivo] = useState(tenants[0]);
  const [tenantDestino, setTenantDestino] = useState<any>(null);
  const [mostrarTenantSheet, setMostrarTenantSheet] = useState(false);
  const [loadingTenant, setLoadingTenant] = useState(false);

  const handleMudarTenant = (t: any) => {
    if (t.id === tenantAtivo.id) return;
    setTenantDestino(t);
    setLoadingTenant(true);
    setTimeout(() => {
      setTenantAtivo(t);
      setTenantDestino(null);
      setLoadingTenant(false);
      setMostrarTenantSheet(false);
    }, 2000);
  };

  return (
    <>
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
                  <span className="text-[9px] font-bold text-muted-foreground tracking-tight leading-none mb-0.5">Imobiliária</span>
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
                  <div>
                    <p className={cn(
                      "text-sm font-bold",
                      tenantAtivo.id === t.id ? "text-primary" : "text-foreground"
                    )}>
                      {t.nome}
                    </p>
                    {tenantAtivo.id === t.id && (
                      <p className="text-[10px] text-primary/80 font-medium">Imobiliária Atual</p>
                    )}
                  </div>
                </div>
                {tenantAtivo.id === t.id && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Fullscreen Animation Overlay */}
      {loadingTenant && tenantDestino && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 backdrop-blur-md animate-in fade-in duration-300">
          <div className="flex items-center gap-6 sm:gap-12 mb-8">
            <div className="flex flex-col items-center gap-3 opacity-50">
              <div className="h-16 w-16 sm:h-20 sm:w-20 bg-muted rounded-2xl shadow-sm border border-border flex items-center justify-center text-3xl sm:text-4xl">
                {tenantAtivo.logo}
              </div>
              <span className="text-sm font-medium">{tenantAtivo.nome}</span>
            </div>
            
            <div className="flex items-center justify-center relative w-16 sm:w-24">
               {/* Arrow passing from left to right */}
               <div className="h-0.5 w-full bg-muted-foreground/30 relative overflow-hidden rounded-full">
                 <div className="absolute top-0 left-0 h-full bg-primary animate-[translate-x-full_1.5s_ease-in-out_infinite]" />
               </div>
               <ArrowRight className="h-6 w-6 text-primary absolute left-1/2 -translate-x-1/2 -top-3 bg-background/95 px-1" />
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                <div className="h-24 w-24 sm:h-32 sm:w-32 bg-card rounded-2xl shadow-xl border border-border flex items-center justify-center text-5xl sm:text-6xl relative z-10 animate-bounce">
                  {tenantDestino.logo}
                </div>
              </div>
              <span className="text-lg sm:text-xl font-bold text-foreground">{tenantDestino.nome}</span>
            </div>
          </div>
          
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Alternando ambiente...</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Saindo de {tenantAtivo.nome} e acessando {tenantDestino.nome}</p>
          <div className="w-64 h-1 bg-muted rounded-full overflow-hidden mt-8">
            <div className="h-full bg-primary w-full rounded-full origin-left animate-pulse" style={{ animationDuration: '2s' }}></div>
          </div>
        </div>
      )}
    </>
  );
}
