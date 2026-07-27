import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import {
  MapPin, ExternalLink, Key, Camera, FileText, CheckCircle2, ChevronLeft, ChevronRight, Share2, Edit, AlertCircle, Calendar,
  Building2, Users, DollarSign, ListChecks, Map, HeartHandshake, Briefcase, FileSignature, Home, User, Info, Smartphone, Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function PropertyQuickView({ open, onClose, imovel }: { open: boolean, onClose: () => void, imovel: any }) {
  if (!imovel) return null;

  const mockImage = imovel.imagem || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop';
  const codigo = imovel.cod || 'AP-1101';

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-[95vw] md:max-w-[800px] lg:max-w-[1000px] h-[95vh] md:h-[85vh] p-0 flex flex-col rounded-2xl overflow-hidden border-border/50 bg-background shadow-2xl">
        
        {/* CABEÇALHO / HERO COMPACTO */}
        <div className="flex flex-col sm:flex-row bg-muted/20 border-b border-border/50 shrink-0">
          <div className="w-full sm:w-[280px] h-32 sm:h-auto shrink-0 relative bg-muted">
            <img src={mockImage} alt="Foto do Imóvel" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent sm:hidden" />
          </div>
          
          <div className="flex-1 p-5 flex flex-col justify-center">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary hover:bg-primary text-white border-none shadow-sm text-xs font-bold py-1 px-2.5">
                  Cód. {codigo}
                </Badge>
                <span className="text-xs font-semibold text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">4 de 22</span>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs font-semibold rounded-lg"><ExternalLink className="w-3.5 h-3.5 mr-1.5"/> Site</Button>
                <Button size="sm" variant="outline" className="h-8 text-xs font-semibold rounded-lg"><ExternalLink className="w-3.5 h-3.5 mr-1.5"/> Landing page</Button>
                <Button size="sm" variant="outline" className="h-8 text-xs font-semibold rounded-lg text-muted-foreground">S/ valores</Button>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground line-clamp-1">
              {imovel.tipo} — {imovel.titulo?.includes('Padrão') ? imovel.titulo : 'Padrão Aviação'}
            </h2>
            <div className="flex items-center gap-2 mt-1.5 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              <span className="font-medium truncate">{imovel.bairro} · {imovel.cidade}</span>
            </div>
          </div>
        </div>

        {/* CORPO DO MODAL COM ABAS */}
        <Tabs defaultValue="gerais" className="flex-1 flex flex-col min-h-0">
          <div className="border-b border-border/50 bg-muted/10 shrink-0 overflow-x-auto custom-scrollbar">
            <TabsList className="h-10 w-full justify-start bg-transparent p-0 gap-2 px-4 rounded-none">
              <TabsTrigger value="gerais" className="data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-full px-4 text-xs font-semibold whitespace-nowrap"><Info className="w-3.5 h-3.5 mr-1.5"/> Gerais</TabsTrigger>
              <TabsTrigger value="internas" className="data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-full px-4 text-xs font-semibold whitespace-nowrap"><Briefcase className="w-3.5 h-3.5 mr-1.5"/> Internas</TabsTrigger>
              <TabsTrigger value="cond" className="data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-full px-4 text-xs font-semibold whitespace-nowrap"><Building2 className="w-3.5 h-3.5 mr-1.5"/> Cond./Emp.</TabsTrigger>
              <TabsTrigger value="valores" className="data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-full px-4 text-xs font-semibold whitespace-nowrap"><DollarSign className="w-3.5 h-3.5 mr-1.5"/> Valores</TabsTrigger>
              <TabsTrigger value="parcelas" className="data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-full px-4 text-xs font-semibold whitespace-nowrap"><ListChecks className="w-3.5 h-3.5 mr-1.5"/> Parcelas</TabsTrigger>
              <TabsTrigger value="caracteristicas" className="data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-full px-4 text-xs font-semibold whitespace-nowrap"><CheckCircle2 className="w-3.5 h-3.5 mr-1.5"/> Características</TabsTrigger>
              <TabsTrigger value="fotos" className="data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-full px-4 text-xs font-semibold whitespace-nowrap"><Camera className="w-3.5 h-3.5 mr-1.5"/> Fotos</TabsTrigger>
              <TabsTrigger value="mapa" className="data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-full px-4 text-xs font-semibold whitespace-nowrap"><Map className="w-3.5 h-3.5 mr-1.5"/> Mapa</TabsTrigger>
              <TabsTrigger value="match" className="data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-full px-4 text-xs font-semibold whitespace-nowrap"><Users className="w-3.5 h-3.5 mr-1.5"/> Match Clientes</TabsTrigger>
              <TabsTrigger value="negocios" className="data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-full px-4 text-xs font-semibold whitespace-nowrap"><HeartHandshake className="w-3.5 h-3.5 mr-1.5"/> Negócios</TabsTrigger>
              <TabsTrigger value="documentos" className="data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-full px-4 text-xs font-semibold whitespace-nowrap"><FileSignature className="w-3.5 h-3.5 mr-1.5"/> Docs</TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-6">

              {/* ABA: INFORMAÇÕES GERAIS */}
              <TabsContent value="gerais" className="mt-0 outline-none animate-in fade-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-8">
                    <section>
                      <h3 className="text-sm font-bold text-muted-foreground tracking-tight mb-4 flex items-center gap-2"><Calendar className="w-4 h-4"/> Datas e Status</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted/30 p-3 rounded-xl border border-border/50">
                          <span className="text-[11px] text-muted-foreground font-semibold">Cadastrado</span>
                          <div className="font-medium mt-1">22/04/2026</div>
                        </div>
                        <div className="bg-muted/30 p-3 rounded-xl border border-border/50">
                          <span className="text-[11px] text-muted-foreground font-semibold">Atualizado</span>
                          <div className="font-medium mt-1">22/04/2026</div>
                        </div>
                        <div className="bg-muted/30 p-3 rounded-xl border border-border/50 col-span-2 flex justify-between items-center">
                          <span className="text-[11px] text-muted-foreground font-semibold">Finalidade</span>
                          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none font-bold">Venda / Locação</Badge>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-sm font-bold text-muted-foreground tracking-tight mb-4 flex items-center gap-2"><DollarSign className="w-4 h-4"/> Valores Básicos</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                          <span className="text-[11px] text-primary font-bold">Venda</span>
                          <div className="text-xl font-bold text-primary mt-1">{imovel.valor}</div>
                        </div>
                        <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                          <span className="text-[11px] text-primary font-bold">Locação</span>
                          <div className="text-xl font-bold text-primary mt-1">R$ 2.800/mês</div>
                        </div>
                        <div className="col-span-2 flex items-center justify-between text-sm p-3 bg-muted/30 rounded-xl border border-border/50">
                          <span className="text-muted-foreground font-medium">Valor do m²</span>
                          <span className="font-bold">R$ 8.441,56</span>
                        </div>
                      </div>
                    </section>
                  </div>

                  <div className="space-y-8">
                    <section>
                      <h3 className="text-sm font-bold text-muted-foreground tracking-tight mb-4 flex items-center gap-2"><Home className="w-4 h-4"/> Medidas e Estrutura</h3>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-xl border border-border/50 text-center">
                          <span className="text-[11px] text-muted-foreground font-semibold">Dorms</span>
                          <span className="text-lg font-bold mt-0.5">{imovel.dorms}</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-xl border border-border/50 text-center">
                          <span className="text-[11px] text-muted-foreground font-semibold">Suítes</span>
                          <span className="text-lg font-bold mt-0.5">{imovel.suites}</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-xl border border-border/50 text-center">
                          <span className="text-[11px] text-muted-foreground font-semibold">Vagas</span>
                          <span className="text-lg font-bold mt-0.5">{imovel.vagas}</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-xl border border-border/50 text-center">
                          <span className="text-[11px] text-muted-foreground font-semibold">Salas</span>
                          <span className="text-lg font-bold mt-0.5">2</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-xl border border-border/50 text-center">
                          <span className="text-[11px] text-muted-foreground font-semibold">Banh.</span>
                          <span className="text-lg font-bold mt-0.5">1</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-xl border border-border/50 text-center">
                          <span className="text-[11px] text-muted-foreground font-semibold">Área Útil</span>
                          <span className="text-lg font-bold mt-0.5 text-primary">{imovel.area}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 space-y-2 text-sm bg-muted/20 p-4 rounded-xl border border-border/40">
                        <div className="flex justify-between"><span className="text-muted-foreground">Posição</span> <span className="font-medium">Fundos</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Ano de constr.</span> <span className="font-medium">2018</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Dimensão</span> <span className="font-medium">0 × 0 m²</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Chaves</span> <span className="font-medium flex items-center gap-1"><Key className="w-3 h-3 text-amber-500"/> Portaria do prédio</span></div>
                      </div>
                    </section>
                  </div>
                </div>
              </TabsContent>

              {/* ABA: INFORMAÇÕES INTERNAS */}
              <TabsContent value="internas" className="mt-0 outline-none animate-in fade-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <section>
                      <h3 className="text-sm font-bold text-muted-foreground tracking-tight mb-4 flex items-center gap-2"><AlertCircle className="w-4 h-4"/> Obs. Internas</h3>
                      <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200 text-sm leading-relaxed">
                        Proprietário aceita proposta. Chaves na portaria — agendar visita com 1 dia de antecedência. Documentação regularizada.
                      </div>
                    </section>

                    <section>
                      <h3 className="text-sm font-bold text-muted-foreground tracking-tight mb-4 flex items-center gap-2"><User className="w-4 h-4"/> Proprietário(s)</h3>
                      <div className="bg-card p-4 rounded-2xl border border-border/50 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">MR</div>
                        <div>
                          <div className="font-bold">Marcos Ribeiro</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5"><Smartphone className="w-3 h-3"/> (13) 99000-0000</div>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-sm font-bold text-muted-foreground tracking-tight mb-4 flex items-center gap-2"><HeartHandshake className="w-4 h-4"/> Captação e Indicação</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted/30 p-4 rounded-2xl border border-border/50">
                          <span className="text-[11px] text-muted-foreground font-semibold block mb-2">Captadores</span>
                          <div className="space-y-1 text-sm font-medium">
                            <div className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-emerald-500"/> Simone Alves</div>
                            <div className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-emerald-500"/> Cristiano Rovida</div>
                          </div>
                        </div>
                        <div className="bg-muted/30 p-4 rounded-2xl border border-border/50">
                          <span className="text-[11px] text-muted-foreground font-semibold block mb-2">Indicadores</span>
                          <div className="space-y-1 text-sm font-medium">
                            <div className="flex items-center gap-2"><User className="w-3 h-3 text-muted-foreground"/> Neide</div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>

                  <div className="space-y-6">
                    <section>
                      <h3 className="text-sm font-bold text-muted-foreground tracking-tight mb-4 flex items-center gap-2"><FileSignature className="w-4 h-4"/> Cartório e Autorizações</h3>
                      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden divide-y divide-border/50">
                        <div className="p-4 flex items-center justify-between">
                          <span className="text-sm font-medium">Escritura</span>
                          <Button variant="outline" size="sm" className="h-7 text-xs">Exibir</Button>
                        </div>
                        <div className="p-4 flex items-center justify-between">
                          <span className="text-sm font-medium">Matrícula</span>
                          <Button variant="outline" size="sm" className="h-7 text-xs">Exibir</Button>
                        </div>
                        <div className="p-4 flex items-center justify-between">
                          <span className="text-sm font-medium">IPTU</span>
                          <Button variant="outline" size="sm" className="h-7 text-xs">Exibir</Button>
                        </div>
                        <div className="p-4 bg-muted/10">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex flex-col"><span className="text-muted-foreground">Aut. de Venda</span><span className="font-semibold">04/04/2026</span></div>
                            <div className="flex flex-col"><span className="text-muted-foreground">Exclusividade Venda</span><span className="font-semibold">—</span></div>
                            <div className="flex flex-col mt-2"><span className="text-muted-foreground">Aut. Locação</span><span className="font-semibold">—</span></div>
                            <div className="flex flex-col mt-2"><span className="text-muted-foreground">Exclusividade Loc.</span><span className="font-semibold">—</span></div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </TabsContent>

              {/* ABA: COND/EMP */}
              <TabsContent value="cond" className="mt-0 outline-none animate-in fade-in duration-300">
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 text-center">
                    <Building2 className="w-12 h-12 text-primary/40 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-primary mb-1">Residencial Aguinaldo Dias</h3>
                    <p className="text-muted-foreground text-sm">Condomínio / Empreendimento</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-muted/30 p-4 rounded-2xl border border-border/50 text-center">
                      <span className="text-xs text-muted-foreground font-semibold block mb-1">Incorporadora</span>
                      <span className="font-medium">—</span>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-2xl border border-border/50 text-center">
                      <span className="text-xs text-muted-foreground font-semibold block mb-1">Administradora</span>
                      <span className="font-medium">—</span>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-2xl border border-border/50 text-center">
                      <span className="text-xs text-muted-foreground font-semibold block mb-1">Construtora</span>
                      <span className="font-medium">—</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* ABA: VALORES */}
              <TabsContent value="valores" className="mt-0 outline-none animate-in fade-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-sm font-bold text-muted-foreground tracking-tight mb-4">Venda & Despesas</h3>
                    <div className="bg-card p-5 rounded-2xl border border-border/50 shadow-sm space-y-4">
                      <div className="flex justify-between items-end border-b border-border/40 pb-4">
                        <span className="text-sm font-semibold text-muted-foreground">Valor de Venda</span>
                        <span className="text-2xl font-bold text-primary">{imovel.valor}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Condomínio</span>
                        <span className="font-bold">R$ 783,00</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">IPTU</span>
                        <span className="font-bold">R$ 420,00</span>
                      </div>
                      <div className="flex justify-between items-center text-sm pt-2 border-t border-border/30">
                        <span className="text-muted-foreground">Valor do m²</span>
                        <span className="font-semibold text-primary">R$ 8.441,56</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Valor de Avaliação</span>
                        <span className="font-semibold">{imovel.valor}</span>
                      </div>
                    </div>

                    <div className="bg-emerald-50 dark:bg-emerald-950/20 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
                      <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-400 mb-3">Aceita nas Negociações</h4>
                      <div className="space-y-2 text-sm text-emerald-700 dark:text-emerald-300 font-medium">
                        <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> FGTS</div>
                        <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Financiamento Bancário</div>
                        <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Permuta</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-sm font-bold text-muted-foreground tracking-tight mb-4">Locação & Temporada</h3>
                    <div className="bg-muted/20 p-5 rounded-2xl border border-border/50 text-center flex flex-col items-center justify-center min-h-[140px]">
                      <span className="text-sm font-semibold text-muted-foreground mb-1">Locação Mensal</span>
                      <span className="text-2xl font-bold text-foreground">R$ 2.800</span>
                      <span className="text-xs text-muted-foreground mt-2 border border-border/50 px-2 py-1 rounded-md">Exige: Fiador / Caução</span>
                    </div>

                    <div className="bg-muted/20 p-5 rounded-2xl border border-border/50 border-dashed text-center flex flex-col items-center justify-center min-h-[140px]">
                      <Calendar className="w-8 h-8 text-muted-foreground/30 mb-2"/>
                      <span className="text-sm font-semibold text-muted-foreground">Temporada</span>
                      <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">Nenhum período de temporada ou valor cadastrado para este imóvel.</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* ABA: MATCH DE CLIENTES */}
              <TabsContent value="match" className="mt-0 outline-none animate-in fade-in duration-300">
                <div className="max-w-3xl mx-auto space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-border/50">
                    <div>
                      <h3 className="text-lg font-bold">Perfil Compatível</h3>
                      <p className="text-sm text-muted-foreground">4 clientes recomendados para este imóvel</p>
                    </div>
                    <Button variant="outline" size="sm">Ver todos os Matches</Button>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { name: 'Guilherme', status: 'Qualificando', time: '2 meses', color: 'bg-blue-100 text-blue-700' },
                      { name: 'Esterina', status: 'Qualificando', time: '2 meses', color: 'bg-purple-100 text-purple-700' },
                      { name: 'José André Da Silva', status: 'Conhecendo', time: '2 meses', color: 'bg-emerald-100 text-emerald-700' },
                      { name: 'Ewerton Augusto', status: 'Conhecendo', time: '3 meses', color: 'bg-amber-100 text-amber-700' }
                    ].map((c, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-card rounded-2xl border border-border/50 hover:shadow-sm transition-shadow cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold", c.color)}>
                            {c.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold">{c.name}</div>
                            <div className="text-xs text-muted-foreground">Alterado há {c.time}</div>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-background">{c.status}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              {/* ABA: DOCUMENTOS */}
              <TabsContent value="documentos" className="mt-0 outline-none animate-in fade-in duration-300">
                <div className="max-w-2xl mx-auto space-y-8">
                  <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <FileSignature className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Saúde Documental</h3>
                    <div className="w-full max-w-sm mt-2">
                      <div className="flex justify-between text-sm mb-1 font-semibold">
                        <span>Anexados</span>
                        <span className="text-primary">5 / 10</span>
                      </div>
                      <Progress value={50} className="h-2.5" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-4 max-w-md">O imóvel possui apenas 5 dos 10 documentos recomendados para acelerar a validação jurídica.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['Matrícula Atualizada', 'Escritura', 'IPTU (Capa)', 'Planta Baixa', 'Autorização de Venda'].map((d, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-xl text-emerald-800 dark:text-emerald-400 font-medium text-sm">
                        <CheckCircle2 className="w-5 h-5" /> {d}
                      </div>
                    ))}
                    {['Certidão Negativa', 'Habite-se', 'Comprovante Condomínio', 'Docs Proprietário', 'Contrato Anterior'].map((d, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-muted/30 border border-border/50 rounded-xl text-muted-foreground font-medium text-sm">
                        <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 border-dashed" /> {d}
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* PLACEHOLDER P/ OUTRAS ABAS VAZIAS */}
              <TabsContent value="parcelas" className="mt-0 outline-none animate-in fade-in duration-300">
                <div className="py-20 text-center text-muted-foreground flex flex-col items-center">
                  <ListChecks className="w-12 h-12 mb-4 opacity-20"/>
                  <p>Tabela de simulação de parcelas não cadastrada.</p>
                </div>
              </TabsContent>
              <TabsContent value="caracteristicas" className="mt-0 outline-none animate-in fade-in duration-300">
                <div className="py-20 text-center text-muted-foreground flex flex-col items-center">
                  <CheckCircle2 className="w-12 h-12 mb-4 opacity-20"/>
                  <p>Características específicas de cômodos detalhadas aqui.</p>
                </div>
              </TabsContent>
              <TabsContent value="fotos" className="mt-0 outline-none animate-in fade-in duration-300">
                <div className="py-20 text-center text-muted-foreground flex flex-col items-center">
                  <Camera className="w-12 h-12 mb-4 opacity-20"/>
                  <p>Galeria em Grid com as 22 fotos do imóvel.</p>
                </div>
              </TabsContent>
              <TabsContent value="mapa" className="mt-0 outline-none animate-in fade-in duration-300">
                <div className="py-20 text-center text-muted-foreground flex flex-col items-center">
                  <Map className="w-12 h-12 mb-4 opacity-20"/>
                  <p>Visualização do Google Maps aqui.</p>
                </div>
              </TabsContent>
              <TabsContent value="negocios" className="mt-0 outline-none animate-in fade-in duration-300">
                <div className="py-20 text-center text-muted-foreground flex flex-col items-center">
                  <Briefcase className="w-12 h-12 mb-4 opacity-20"/>
                  <p>Lista de Leads (CRM) atrelados a este imóvel.</p>
                </div>
              </TabsContent>
              
            </div>
          </ScrollArea>
        </Tabs>

        {/* RODAPÉ CTAS */}
        <div className="p-4 bg-muted/30 border-t border-border/50 shrink-0 flex items-center justify-between gap-4">
          <Button variant="outline" className="hidden sm:flex bg-background shadow-sm rounded-xl"><ChevronLeft className="w-4 h-4 mr-2"/> Anterior</Button>
          <Button variant="outline" size="icon" className="sm:hidden bg-background shadow-sm rounded-xl"><ChevronLeft className="w-4 h-4"/></Button>
          
          <div className="flex-1 flex justify-center gap-2 sm:gap-4">
            <Button variant="secondary" className="rounded-xl shadow-sm"><Mail className="w-4 h-4 mr-2 hidden sm:block"/> Email</Button>
            <Button className="rounded-xl shadow-sm bg-primary text-white"><Edit className="w-4 h-4 mr-2 hidden sm:block"/> Editar Cadastro</Button>
          </div>

          <Button variant="outline" className="hidden sm:flex bg-background shadow-sm rounded-xl">Próximo <ChevronRight className="w-4 h-4 ml-2"/></Button>
          <Button variant="outline" size="icon" className="sm:hidden bg-background shadow-sm rounded-xl"><ChevronRight className="w-4 h-4"/></Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
