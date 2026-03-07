import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  Zap, FileText, Home, MapPin, BarChart3, Tag, Users, Building2,
  Globe, Eye, Image as ImageIcon, CheckCircle2, ChevronRight, Plus, X, Save
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────
interface FormData {
  titulo: string; tipo: string; finalidade: string; status: string; destaque: boolean;
  cep: string; logradouro: string; numero: string; complemento: string;
  bairro: string; cidade: string; estado: string; latitude: string; longitude: string;
  quartos: string; banheiros: string; suites: string; vagas: string;
  area: string; areaUtil: string; areaTerreno: string; andar: string;
  totalAndares: string; anoConstrucao: string; posicaoSol: string;
  valorVenda: string; valorAluguel: string; condominio: string;
  iptu: string; aguaLuz: string; valorNegociavel: boolean;
  nomeCondominio: string; portaria: string; infraCondominio: string[];
  nomeProprietario: string; telefoneProprietario: string; emailProprietario: string;
  documentoProprietario: string; exclusividade: boolean;
  caracteristicas: string[];
  proximidades: { local: string; distancia: string }[];
  fotoPrincipal: string; fotos: string[]; videoUrl: string; tourVirtual: string;
  tituloSeo: string; metaDescricao: string; slug: string; tags: string;
  portais: string[]; ativo: boolean; descricao: string;
}

const defaultForm: FormData = {
  titulo: '', tipo: 'Apartamento', finalidade: 'Venda', status: 'Disponível', destaque: false,
  cep: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', latitude: '', longitude: '',
  quartos: '', banheiros: '', suites: '', vagas: '', area: '', areaUtil: '', areaTerreno: '',
  andar: '', totalAndares: '', anoConstrucao: '', posicaoSol: '', valorNegociavel: false,
  valorVenda: '', valorAluguel: '', condominio: '', iptu: '', aguaLuz: '',
  nomeCondominio: '', portaria: '', infraCondominio: [],
  nomeProprietario: '', telefoneProprietario: '', emailProprietario: '', documentoProprietario: '', exclusividade: false,
  caracteristicas: [], proximidades: [],
  fotoPrincipal: '', fotos: [], videoUrl: '', tourVirtual: '',
  tituloSeo: '', metaDescricao: '', slug: '', tags: '',
  portais: [], ativo: true, descricao: '',
};

// ─── Helpers ──────────────────────────────────────────────────────────────
const TIPOS = ['Apartamento', 'Casa', 'Cobertura', 'Studio', 'Kitnet', 'Loft', 'Terreno', 'Casa em Condomínio', 'Sobrado', 'Comercial', 'Galpão'];
const FINALIDADES = ['Venda', 'Aluguel', 'Venda e Aluguel'];
const STATUS_LIST = ['Disponível', 'Reservado', 'Vendido', 'Alugado', 'Em construção'];
const ESTADOS = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
const PORTAIS = ['Zap Imóveis', 'OLX', 'Viva Real', 'Imovelweb', 'Loft'];
const INFRA_OPTIONS = ['Piscina', 'Academia', 'Salão de Festas', 'Churrasqueira', 'Playground', 'Quadra', 'Coworking', 'Pet Space', 'Spa', 'Cinema'];
const CARACTERISTICAS_OPTIONS = ['Sacada/Varanda', 'Armários Embutidos', 'Ar Condicionado', 'Portaria 24h', 'Elevador', 'Aquecimento Solar', 'Piscina Privativa', 'Jardim', 'Gás Central', 'Interfone', 'Câmeras de Segurança', 'Gerador'];
const PROXIMIDADES_SUGESTOES = ['Metrô', 'Escola', 'Hospital', 'Supermercado', 'Shopping', 'Farmácia', 'Academia', 'Parque', 'Banco'];

const TABS = [
  { id: 'identificacao', label: 'Identificação', icon: Home, desc: 'Tipo, finalidade e status' },
  { id: 'localizacao', label: 'Localização', icon: MapPin, desc: 'Endereço completo' },
  { id: 'caracteristicas', label: 'Características', icon: BarChart3, desc: 'Quartos, área, andares…' },
  { id: 'valores', label: 'Valores', icon: Tag, desc: 'Preços, IPTU, condomínio' },
  { id: 'condominio', label: 'Condomínio', icon: Building2, desc: 'Nome, portaria, infra' },
  { id: 'proprietario', label: 'Proprietário', icon: Users, desc: 'Dados do dono' },
  { id: 'proximidades', label: 'Proximidades', icon: MapPin, desc: 'Pontos de referência' },
  { id: 'midia', label: 'Mídia', icon: ImageIcon, desc: 'Fotos, vídeo, tour' },
  { id: 'seo', label: 'SEO', icon: Globe, desc: 'Título, meta, slug' },
  { id: 'publicacao', label: 'Publicação', icon: Eye, desc: 'Portais e descrição' },
];

function FieldGroup({ children, cols = 1 }: { children: React.ReactNode; cols?: number }) {
  return <div className={cn('grid gap-4', cols === 2 && 'grid-cols-1 md:grid-cols-2', cols === 3 && 'grid-cols-1 sm:grid-cols-3')}>{children}</div>;
}

function F({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}

function CheckChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all',
        active ? 'bg-primary text-primary-foreground border-primary shadow-sm' : 'bg-background border-border text-muted-foreground hover:border-primary/40'
      )}
    >
      {active ? <CheckCircle2 className="h-3.5 w-3.5" /> : <div className="h-3.5 w-3.5 rounded-full border border-current opacity-50" />}
      {label}
    </button>
  );
}

export default function CadastroImovel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;

  const [mode, setMode] = useState<'escolha' | 'agil' | 'tecnica'>(isEditing ? 'tecnica' : 'escolha');
  const [activeTab, setActiveTab] = useState('identificacao');
  const [form, setForm] = useState<FormData>(defaultForm);
  const [novaProximidade, setNovaProximidade] = useState({ local: '', distancia: '' });

  useEffect(() => {
    if (isEditing) {
      // Mock data loading
      setForm(prev => ({
        ...prev,
        titulo: 'Apartamento 2 Quartos - Centro',
        tipo: 'Apartamento',
        finalidade: 'Venda',
        logradouro: 'Rua das Flores',
        cidade: 'São Paulo',
        valorVenda: '350000',
      }));
    }
  }, [isEditing]);

  const set = (field: keyof FormData, value: any) => setForm(f => ({ ...f, [field]: value }));
  const toggleArr = (field: keyof FormData, val: string) => {
    const arr = (form[field] as string[]);
    set(field, arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  };

  const addProximidade = () => {
    if (!novaProximidade.local) return;
    set('proximidades', [...form.proximidades, { ...novaProximidade }]);
    setNovaProximidade({ local: '', distancia: '' });
  };
  const removeProximidade = (i: number) => set('proximidades', form.proximidades.filter((_, idx) => idx !== i));

  const handleSave = () => {
    toast({
      title: isEditing ? "Imóvel atualizado!" : "Imóvel cadastrado!",
      description: isEditing ? "As informações foram salvas com sucesso." : "O novo imóvel já está disponível.",
      variant: "success",
    });
    navigate('/imoveis');
  };

  const canSaveQuick = form.titulo && (form.logradouro || form.cidade);
  const tabIdx = TABS.findIndex(t => t.id === activeTab);
  const completionPercentage = Math.round(((tabIdx + 1) / TABS.length) * 100);

  // ─── Mode Renderers ───
  if (mode === 'escolha') {
    return (
      <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-background rounded-3xl shadow-xl overflow-hidden border border-border/50">
          <div className="bg-gradient-to-br from-primary to-primary/80 p-10 text-center">
            <h1 className="text-white text-3xl font-black mb-3">Como deseja cadastrar?</h1>
            <p className="text-white/80 text-lg">Escolha o formato que melhor se adapta à sua necessidade agora.</p>
          </div>
          <div className="p-8 space-y-4">
            <ModeCard
              icon={Zap} iconColor="text-amber-500" iconBg="bg-amber-50 dark:bg-amber-950/40"
              title="Cadastro Ágil" subtitle="Preencha apenas o essencial e publique em menos de 2 minutos. Complemente os detalhes depois."
              tags={['~2 min', 'Campos básicos', 'Publicação imediata']}
              onClick={() => setMode('agil')}
            />
            <ModeCard
              icon={FileText} iconColor="text-primary" iconBg="bg-primary/10" premium
              title="Ficha Técnica Completa" subtitle="Cadastro profissional guiado com todas as opções: SEO, mídias, características de condomínio e muito mais."
              tags={['~10 min', '10 seções guiadas', 'Alta conversão']}
              onClick={() => setMode('tecnica')}
            />
          </div>
          <div className="px-8 pb-8 pt-2">
            <Button variant="ghost" onClick={() => window.history.back()} className="w-full text-muted-foreground">Cancelar e Voltar</Button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'agil') {
    return (
      <div className="min-h-screen bg-muted/20 pb-20">
        <div className="bg-gradient-to-r from-amber-500 to-orange-400 p-8 shadow-md sticky top-0 z-50">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setMode('escolha')} className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition text-white">
                <ChevronRight className="h-5 w-5 rotate-180" />
              </button>
              <div>
                <h1 className="text-white text-2xl font-black flex items-center gap-2">
                  <Zap className="h-6 w-6" /> Cadastro Ágil
                </h1>
                <p className="text-white/80 mt-0.5">Preencha o essencial para cadastrar agora</p>
              </div>
            </div>
            <Button onClick={handleSave} disabled={!canSaveQuick} className="gap-2 shadow-xl shrink-0">
              <Plus className="h-4 w-4" /> Finalizar Cadastro
            </Button>
          </div>
        </div>

        <div className="max-w-3xl mx-auto mt-8 px-4">
          <div className="bg-background rounded-3xl shadow-sm border p-6 sm:p-10 space-y-8">
            <F label="Título do anúncio" required>
              <Input className="h-12 text-lg font-medium" value={form.titulo} onChange={e => set('titulo', e.target.value)} placeholder="Ex: Apartamento 2 Quartos com Varanda — Vila Madalena" />
            </F>

            <FieldGroup cols={2}>
              <F label="Tipo" required>
                <Select value={form.tipo} onValueChange={v => set('tipo', v)}>
                  <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                  <SelectContent>{TIPOS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </F>
              <F label="Finalidade" required>
                <Select value={form.finalidade} onValueChange={v => set('finalidade', v)}>
                  <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                  <SelectContent>{FINALIDADES.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </F>
              <F label="Status">
                <Select value={form.status} onValueChange={v => set('status', v)}>
                  <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                  <SelectContent>{STATUS_LIST.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </F>
              <F label="Quartos">
                <Input className="h-12" type="number" min={0} placeholder="0" value={form.quartos} onChange={e => set('quartos', e.target.value)} />
              </F>
              <F label="Banheiros">
                <Input className="h-12" type="number" min={0} placeholder="0" value={form.banheiros} onChange={e => set('banheiros', e.target.value)} />
              </F>
              <F label="Área total">
                <Input className="h-12" placeholder="m²" value={form.area} onChange={e => set('area', e.target.value)} />
              </F>
              <F label="Valor venda" required>
                <Input className="h-12 font-medium" placeholder="R$ 0" value={form.valorVenda} onChange={e => set('valorVenda', e.target.value)} />
              </F>
              <F label="Valor aluguel">
                <Input className="h-12" placeholder="R$ 0/mês" value={form.valorAluguel} onChange={e => set('valorAluguel', e.target.value)} />
              </F>
            </FieldGroup>

            <div className="h-px bg-border my-8 w-full" />

            <FieldGroup cols={2}>
              <div className="md:col-span-2">
                <F label="Endereço (Logradouro)" required>
                  <Input className="h-12" placeholder="Rua, Av., Alameda…" value={form.logradouro} onChange={e => set('logradouro', e.target.value)} />
                </F>
              </div>
              <F label="Nº">
                <Input className="h-12" placeholder="123" value={form.numero} onChange={e => set('numero', e.target.value)} />
              </F>
              <F label="Bairro">
                <Input className="h-12" placeholder="Bairro" value={form.bairro} onChange={e => set('bairro', e.target.value)} />
              </F>
              <F label="Cidade" required>
                <Input className="h-12" placeholder="Cidade" value={form.cidade} onChange={e => set('cidade', e.target.value)} />
              </F>
              <F label="Estado">
                <Select value={form.estado} onValueChange={v => set('estado', v)}>
                  <SelectTrigger className="h-12"><SelectValue placeholder="UF" /></SelectTrigger>
                  <SelectContent>{ESTADOS.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
                </Select>
              </F>
            </FieldGroup>

            <div className="h-px bg-border my-8 w-full" />

            <F label="Nome do Proprietário">
              <Input className="h-12" placeholder="Nome completo" value={form.nomeProprietario} onChange={e => set('nomeProprietario', e.target.value)} />
            </F>
          </div>
        </div>
      </div>
    );
  }

  // ─── Ficha Técnica Completa ───
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020817] flex flex-col">
      {/* Header Sticky */}
      <div className="bg-white/90 dark:bg-slate-950/90 backdrop-blur-md sticky top-0 z-50 border-b border-border/40 px-4 md:px-8 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <Breadcrumb className="mb-4 sm:mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="flex items-center gap-1">
                    <Home className="h-4 w-4" /> Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/imoveis">Imóveis</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{isEditing ? 'Editar Imóvel' : 'Cadastrar Imóvel'}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {isEditing ? 'Refinar Imóvel' : 'Registrar Novo Ativo'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex flex-col items-end mr-4">
              <div className="text-[10px] font-black uppercase tracking-wider text-primary">Preenchido: {completionPercentage}%</div>
              <div className="w-32 bg-muted rounded-full h-1.5 mt-1 overflow-hidden">
                <div className="bg-primary h-full transition-all duration-300" style={{ width: `${completionPercentage}%` }} />
              </div>
            </div>
            <Button variant="ghost" className="hidden sm:inline-flex" onClick={() => navigate('/imoveis')}>Descartar</Button>
            <Button onClick={handleSave} disabled={!form.titulo} className="gap-2 shadow-lg h-10 px-6">
              <Save className="h-4 w-4" /> <span className="hidden sm:inline">Finalizar Cadastro</span><span className="sm:hidden">Salvar</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-[1400px] w-full mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="sticky top-[100px] space-y-1">
            {TABS.map((tab, idx) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isPast = tabIdx >= idx;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all",
                    isActive ? "bg-primary text-primary-foreground shadow-md font-bold" : "hover:bg-muted/50 text-muted-foreground font-medium"
                  )}
                >
                  {isPast && !isActive ? <CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> : <Icon className="h-4 w-4 shrink-0" />}
                  <span className="text-sm truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Panel */}
        <div className="flex-1 bg-background rounded-3xl shadow-sm border border-border/40 p-6 md:p-10 min-h-[60vh]">
          <Tabs value={activeTab} className="h-full">
            {/* IDENTIFICAÇÃO */}
            <TabsContent value="identificacao" className="space-y-6 mt-0">
              <h2 className="text-lg font-black uppercase tracking-wide border-b pb-4 mb-6">Identificação Básica</h2>
              <F label="Título do anúncio" required>
                <Input className="h-12" value={form.titulo} onChange={e => set('titulo', e.target.value)} placeholder="Ex: Cobertura Duplex com Vista para o Mar — Guarujá" />
                <p className="text-xs text-muted-foreground mt-1">{form.titulo.length}/100 caracteres</p>
              </F>
              <FieldGroup cols={2}>
                <F label="Tipo do imóvel" required>
                  <Select value={form.tipo} onValueChange={v => set('tipo', v)}>
                    <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                    <SelectContent>{TIPOS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </F>
                <F label="Finalidade" required>
                  <Select value={form.finalidade} onValueChange={v => set('finalidade', v)}>
                    <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                    <SelectContent>{FINALIDADES.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                  </Select>
                </F>
                <F label="Status">
                  <Select value={form.status} onValueChange={v => set('status', v)}>
                    <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUS_LIST.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </F>
                <F label="Ano de construção">
                  <Input className="h-12" placeholder="Ex: 2018" value={form.anoConstrucao} onChange={e => set('anoConstrucao', e.target.value)} />
                </F>
              </FieldGroup>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/20 border mt-8">
                <input type="checkbox" id="destaque" checked={form.destaque} onChange={e => set('destaque', e.target.checked)} className="h-5 w-5 accent-primary rounded" />
                <label htmlFor="destaque" className="text-sm font-semibold cursor-pointer">Marcar como imóvel em destaque na página inicial e no topo das buscas.</label>
              </div>
            </TabsContent>

            {/* LOCALIZAÇÃO */}
            <TabsContent value="localizacao" className="space-y-6 mt-0">
              <h2 className="text-lg font-black uppercase tracking-wide border-b pb-4 mb-6">Localização</h2>
              <FieldGroup cols={2}>
                <F label="CEP">
                  <Input className="h-12" placeholder="00000-000" value={form.cep} onChange={e => set('cep', e.target.value)} />
                </F>
                <div className="hidden md:block" />
                <div className="md:col-span-2">
                  <F label="Logradouro" required>
                    <Input className="h-12" placeholder="Rua, Av., Alameda…" value={form.logradouro} onChange={e => set('logradouro', e.target.value)} />
                  </F>
                </div>
                <F label="Número">
                  <Input className="h-12" placeholder="123" value={form.numero} onChange={e => set('numero', e.target.value)} />
                </F>
                <F label="Complemento">
                  <Input className="h-12" placeholder="Apto 42, Bloco B…" value={form.complemento} onChange={e => set('complemento', e.target.value)} />
                </F>
                <F label="Bairro">
                  <Input className="h-12" value={form.bairro} onChange={e => set('bairro', e.target.value)} />
                </F>
                <F label="Cidade" required>
                  <Input className="h-12" value={form.cidade} onChange={e => set('cidade', e.target.value)} />
                </F>
                <F label="Estado">
                  <Select value={form.estado} onValueChange={v => set('estado', v)}>
                    <SelectTrigger className="h-12"><SelectValue placeholder="UF" /></SelectTrigger>
                    <SelectContent>{ESTADOS.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
                  </Select>
                </F>
                <div className="hidden md:block" />
                <F label="Latitude (GPS)">
                  <Input className="h-12" placeholder="-23.5505" value={form.latitude} onChange={e => set('latitude', e.target.value)} />
                </F>
                <F label="Longitude (GPS)">
                  <Input className="h-12" placeholder="-46.6333" value={form.longitude} onChange={e => set('longitude', e.target.value)} />
                </F>
              </FieldGroup>
            </TabsContent>

            {/* CARACTERÍSTICAS */}
            <TabsContent value="caracteristicas" className="space-y-6 mt-0">
              <h2 className="text-lg font-black uppercase tracking-wide border-b pb-4 mb-6">Estrutura e Características</h2>
              <FieldGroup cols={3}>
                <F label="Quartos"><Input className="h-12" type="number" min={0} value={form.quartos} onChange={e => set('quartos', e.target.value)} /></F>
                <F label="Suítes"><Input className="h-12" type="number" min={0} value={form.suites} onChange={e => set('suites', e.target.value)} /></F>
                <F label="Banheiros"><Input className="h-12" type="number" min={0} value={form.banheiros} onChange={e => set('banheiros', e.target.value)} /></F>
                <F label="Vagas garagem"><Input className="h-12" type="number" min={0} value={form.vagas} onChange={e => set('vagas', e.target.value)} /></F>
                <F label="Área total (m²)"><Input className="h-12" placeholder="0" value={form.area} onChange={e => set('area', e.target.value)} /></F>
                <F label="Área útil (m²)"><Input className="h-12" placeholder="0" value={form.areaUtil} onChange={e => set('areaUtil', e.target.value)} /></F>
                <F label="Área terreno (m²)"><Input className="h-12" placeholder="0" value={form.areaTerreno} onChange={e => set('areaTerreno', e.target.value)} /></F>
                <F label="Andar"><Input className="h-12" type="number" min={0} value={form.andar} onChange={e => set('andar', e.target.value)} /></F>
                <F label="Total andares"><Input className="h-12" type="number" min={0} value={form.totalAndares} onChange={e => set('totalAndares', e.target.value)} /></F>
              </FieldGroup>
              <div className="w-1/3 min-w-[200px] mt-4">
                <F label="Posição solar">
                  <Select value={form.posicaoSol} onValueChange={v => set('posicaoSol', v)}>
                    <SelectTrigger className="h-12"><SelectValue placeholder="Selecione…" /></SelectTrigger>
                    <SelectContent>
                      {['Norte', 'Sul', 'Leste', 'Oeste', 'Nordeste', 'Noroeste', 'Sudeste', 'Sudoeste'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </F>
              </div>
              <div className="mt-8">
                <F label="Características e diferenciais">
                  <div className="flex flex-wrap gap-2.5 mt-2">
                    {CARACTERISTICAS_OPTIONS.map(c => (
                      <CheckChip key={c} label={c} active={form.caracteristicas.includes(c)} onClick={() => toggleArr('caracteristicas', c)} />
                    ))}
                  </div>
                </F>
              </div>
            </TabsContent>

            {/* VALORES */}
            <TabsContent value="valores" className="space-y-6 mt-0">
              <h2 className="text-lg font-black uppercase tracking-wide border-b pb-4 mb-6">Precificação e Taxas</h2>
              <FieldGroup cols={2}>
                <F label="Valor de venda">
                  <Input className="h-12 font-medium" placeholder="R$ 0" value={form.valorVenda} onChange={e => set('valorVenda', e.target.value)} />
                </F>
                <F label="Valor de aluguel">
                  <Input className="h-12" placeholder="R$ 0/mês" value={form.valorAluguel} onChange={e => set('valorAluguel', e.target.value)} />
                </F>
                <F label="Condomínio/mês">
                  <Input className="h-12" placeholder="R$ 0" value={form.condominio} onChange={e => set('condominio', e.target.value)} />
                </F>
                <F label="IPTU/mês">
                  <Input className="h-12" placeholder="R$ 0" value={form.iptu} onChange={e => set('iptu', e.target.value)} />
                </F>
                <F label="Água + Luz (estimativa)">
                  <Input className="h-12" placeholder="R$ 0/mês" value={form.aguaLuz} onChange={e => set('aguaLuz', e.target.value)} />
                </F>
              </FieldGroup>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/20 border mt-6">
                <input type="checkbox" id="negociavel" checked={form.valorNegociavel} onChange={e => set('valorNegociavel', e.target.checked)} className="h-5 w-5 accent-primary rounded" />
                <label htmlFor="negociavel" className="text-sm font-semibold cursor-pointer">Proprietário aceita propostas ou o valor é negociável</label>
              </div>
            </TabsContent>

            {/* CONDOMÍNIO */}
            <TabsContent value="condominio" className="space-y-6 mt-0">
              <h2 className="text-lg font-black uppercase tracking-wide border-b pb-4 mb-6">Dados do Condomínio</h2>
              <FieldGroup cols={2}>
                <div className="md:col-span-2">
                  <F label="Nome do condomínio ou empreendimento">
                    <Input className="h-12" placeholder="Ex: Condomínio Parque das Flores" value={form.nomeCondominio} onChange={e => set('nomeCondominio', e.target.value)} />
                  </F>
                </div>
                <F label="Tipo de portaria / Acesso">
                  <Select value={form.portaria} onValueChange={v => set('portaria', v)}>
                    <SelectTrigger className="h-12"><SelectValue placeholder="Selecione…" /></SelectTrigger>
                    <SelectContent>
                      {['24 horas presencial', '24 horas virtual', 'Diurna', 'Sem portaria'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </F>
              </FieldGroup>
              <div className="mt-8">
                <F label="Infraestrutura do condomínio">
                  <div className="flex flex-wrap gap-2.5 mt-2">
                    {INFRA_OPTIONS.map(i => (
                      <CheckChip key={i} label={i} active={form.infraCondominio.includes(i)} onClick={() => toggleArr('infraCondominio', i)} />
                    ))}
                  </div>
                </F>
              </div>
            </TabsContent>

            {/* PROPRIETÁRIO */}
            <TabsContent value="proprietario" className="space-y-6 mt-0">
              <h2 className="text-lg font-black uppercase tracking-wide border-b pb-4 mb-6">Informações do Proprietário</h2>
              <FieldGroup cols={2}>
                <div className="md:col-span-2">
                  <F label="Nome completo">
                    <Input className="h-12" value={form.nomeProprietario} onChange={e => set('nomeProprietario', e.target.value)} placeholder="Nome do proprietário" />
                  </F>
                </div>
                <F label="Telefone / WhatsApp">
                  <Input className="h-12" placeholder="(11) 99999-9999" value={form.telefoneProprietario} onChange={e => set('telefoneProprietario', e.target.value)} />
                </F>
                <F label="E-mail principal">
                  <Input className="h-12" type="email" placeholder="email@exemplo.com" value={form.emailProprietario} onChange={e => set('emailProprietario', e.target.value)} />
                </F>
                <div className="md:col-span-2 mt-2">
                  <F label="CPF / CNPJ ou RG">
                    <Input className="h-12 w-full md:w-1/2" placeholder="000.000.000-00" value={form.documentoProprietario} onChange={e => set('documentoProprietario', e.target.value)} />
                  </F>
                </div>
              </FieldGroup>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/20 border mt-8">
                <input type="checkbox" id="exclusividade" checked={form.exclusividade} onChange={e => set('exclusividade', e.target.checked)} className="h-5 w-5 accent-primary rounded" />
                <label htmlFor="exclusividade" className="text-sm font-semibold cursor-pointer">Imóvel com contrato de exclusividade de captação</label>
              </div>
            </TabsContent>

            {/* PROXIMIDADES */}
            <TabsContent value="proximidades" className="space-y-6 mt-0">
              <h2 className="text-lg font-black uppercase tracking-wide border-b pb-4 mb-6">Proximidades e Destaques Locais</h2>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Select value={novaProximidade.local} onValueChange={v => setNovaProximidade(p => ({ ...p, local: v }))}>
                    <SelectTrigger className="h-12"><SelectValue placeholder="Selecione o ponto de referência…" /></SelectTrigger>
                    <SelectContent>
                      {PROXIMIDADES_SUGESTOES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <Input className="w-32 h-12" placeholder="Ex: 500m, 5 min" value={novaProximidade.distancia} onChange={e => setNovaProximidade(p => ({ ...p, distancia: e.target.value }))} />
                <Button variant="secondary" className="h-12 px-6 shrink-0 gap-2" onClick={addProximidade}><Plus className="h-4 w-4" /> Adicionar</Button>
              </div>
              <div className="mt-8">
                {form.proximidades.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {form.proximidades.map((p, i) => (
                      <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl bg-background border shadow-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold text-sm">{p.local}</span>
                          {p.distancia && <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground ml-2">{p.distancia}</span>}
                        </div>
                        <button onClick={() => removeProximidade(i)} className="text-muted-foreground hover:text-destructive transition-colors"><X className="h-4 w-4" /></button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-border/40 rounded-2xl bg-muted/10">
                    <MapPin className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="font-semibold text-foreground">Nenhuma proximidade adicionada</p>
                    <p className="text-sm text-muted-foreground mt-1 text-balance">Destaque hospitais, escolas e mercados próximos para valorizar a localização do imóvel.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* MÍDIA */}
            <TabsContent value="midia" className="space-y-6 mt-0">
              <h2 className="text-lg font-black uppercase tracking-wide border-b pb-4 mb-6">Mídia e Apresentação</h2>
              <F label="URL da foto principal de capa">
                <Input className="h-12" placeholder="https://…" value={form.fotoPrincipal} onChange={e => set('fotoPrincipal', e.target.value)} />
              </F>
              <F label="URL do vídeo promocional (YouTube/Vimeo)">
                <Input className="h-12" placeholder="https://youtube.com/…" value={form.videoUrl} onChange={e => set('videoUrl', e.target.value)} />
              </F>
              <F label="Link do tour virtual (Matterport, etc.)">
                <Input className="h-12" placeholder="https://…" value={form.tourVirtual} onChange={e => set('tourVirtual', e.target.value)} />
              </F>
              <div className="mt-8 p-10 border-2 border-dashed border-border/40 rounded-3xl bg-muted/10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/30 hover:border-primary/30 transition-all">
                <ImageIcon className="h-12 w-12 text-primary/40 mx-auto mb-4" />
                <p className="text-base text-foreground font-semibold">Arraste fotos ou clique para fazer upload</p>
                <p className="text-sm text-muted-foreground mt-1">Suporta JPG, PNG. Máximo 10MB por arquivo.</p>
                <Button variant="outline" className="mt-6 rounded-xl relative z-10 pointer-events-none">Selecionar Arquivos</Button>
              </div>
            </TabsContent>

            {/* SEO */}
            <TabsContent value="seo" className="space-y-6 mt-0">
              <h2 className="text-lg font-black uppercase tracking-wide border-b pb-4 mb-6">Otimização para Buscas (SEO)</h2>
              <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/30 text-sm text-blue-700 dark:text-blue-300 font-medium flex items-start gap-3 mb-6">
                <Globe className="h-5 w-5 shrink-0 mt-0.5" />
                <p>Um bom preenchimento de SEO aumenta drasticamente a chance do imóvel ser encontrado no <strong>Google</strong> e se destacar com links ricos nas redes sociais.</p>
              </div>
              <F label="Título SEO da página (tag <title>)">
                <Input className="h-12" placeholder="Apartamento 2 Quartos, Suíte e Varanda à Venda no Centro – Imobiliária XY" value={form.tituloSeo} onChange={e => set('tituloSeo', e.target.value)} />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-muted-foreground">O que aparece na aba do navegador e no título do Google.</p>
                  <p className={cn("text-xs font-semibold", form.tituloSeo.length > 60 ? "text-amber-500" : "text-muted-foreground")}>{form.tituloSeo.length}/60</p>
                </div>
              </F>
              <div className="mt-6">
                <F label="Meta descrição (Aparece logo abaixo do título no Google)">
                  <textarea
                    rows={4}
                    placeholder="Imóvel com excelente localização no centro, 2 quartos sendo 1 suíte, varanda gourmet e vaga de garagem demarcada. Confira fotos e valor. Aceita financiamento."
                    value={form.metaDescricao}
                    onChange={e => set('metaDescricao', e.target.value)}
                    className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                  />
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-muted-foreground">Um pequeno resumo atraente do imóvel para fisgar o clique.</p>
                    <p className={cn("text-xs font-semibold", form.metaDescricao.length > 160 ? "text-amber-500" : "text-muted-foreground")}>{form.metaDescricao.length}/160</p>
                  </div>
                </F>
              </div>
              <div className="mt-6">
                <F label="Slug amigável da URL">
                  <Input className="h-12" placeholder="apartamento-2-quartos-venda-centro" value={form.slug} onChange={e => set('slug', e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))} />
                  <p className="text-xs text-muted-foreground mt-1">Sua página ficará: website.com/imoveis/<strong>{form.slug || '[seu-slug]'}</strong></p>
                </F>
              </div>
              <div className="mt-6">
                <F label="Tags de Busca (Opcionais)">
                  <Input className="h-12" placeholder="apartamento padrão, compra sp centro, varanda gourmet" value={form.tags} onChange={e => set('tags', e.target.value)} />
                  <p className="text-xs text-muted-foreground mt-1">Palavras-chave separadas por vírgulas.</p>
                </F>
              </div>
            </TabsContent>

            {/* PUBLICAÇÃO */}
            <TabsContent value="publicacao" className="space-y-6 mt-0">
              <h2 className="text-lg font-black uppercase tracking-wide border-b pb-4 mb-6">Publicação e Descrição Completa</h2>
              <F label="Descrição pública do imóvel">
                <textarea
                  rows={10}
                  placeholder="Escreva um texto cativante detalhando todos os pontos fortes, acabamentos, luminosidade, história do imóvel e vantagens de morar na região..."
                  value={form.descricao}
                  onChange={e => set('descricao', e.target.value)}
                  className="w-full rounded-2xl border border-input bg-background px-4 py-4 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y min-h-[200px]"
                />
                <div className="flex justify-end mt-1">
                  <p className="text-xs text-muted-foreground">{form.descricao.length} caracteres ({form.descricao.split(' ').filter(String).length} palavras)</p>
                </div>
              </F>
              <div className="mt-8">
                <F label="Publicar nos Seguintes Portais Nacionais">
                  <div className="flex flex-wrap gap-3 mt-3">
                    {PORTAIS.map(p => (
                      <CheckChip key={p} label={p} active={form.portais.includes(p)} onClick={() => toggleArr('portais', p)} />
                    ))}
                  </div>
                </F>
              </div>
              <div className="flex items-center gap-3 p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 mt-8">
                <input type="checkbox" id="ativo" checked={form.ativo} onChange={e => set('ativo', e.target.checked)} className="h-5 w-5 accent-emerald-600 rounded" />
                <label htmlFor="ativo" className="text-base font-bold cursor-pointer text-emerald-900 dark:text-emerald-400">Publicar imóvel e deixar visível online imediatamente ao salvar</label>
              </div>

              <div className="pt-8 flex justify-end gap-3 border-t mt-8">
                <Button variant="outline" size="lg" className="rounded-xl" onClick={() => navigate('/imoveis')}>Descartar Mudanças</Button>
                <Button size="lg" className="rounded-xl px-8 gap-2 shadow-xl" disabled={!form.titulo || !form.logradouro} onClick={handleSave}>
                  <Save className="h-5 w-5" /> Salvar Tudo e Finalizar
                </Button>
              </div>
            </TabsContent>

          </Tabs>
        </div>
      </div>
    </div>
  );
}

// ─── Mode Card ───────────────────────────────────────────────────────────────
function ModeCard({
  icon: Icon, iconColor, iconBg, title, subtitle, tags, premium, onClick
}: {
  icon: any; iconColor: string; iconBg: string; title: string; subtitle: string;
  tags: string[]; premium?: boolean; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full text-left p-6 rounded-2xl border-2 transition-all hover:shadow-lg hover:border-primary/40 active:scale-[0.99] relative flex flex-col sm:flex-row items-start sm:items-center gap-6',
        premium ? 'border-primary/40 bg-primary/[0.03]' : 'border-border hover:bg-muted/20'
      )}
    >
      {premium && (
        <span className="absolute top-4 right-5 text-[9px] font-black uppercase tracking-wider text-primary border border-primary/30 rounded-full px-2 py-0.5 bg-primary/10 shadow-sm">
          Apenas 10 min
        </span>
      )}
      <div className={cn('h-16 w-16 rounded-2xl flex items-center justify-center shrink-0 shadow-inner', iconBg)}>
        <Icon className={cn('h-8 w-8', iconColor)} />
      </div>
      <div className="flex-1">
        <h3 className="font-black text-xl text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{subtitle}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map(t => (
            <span key={t} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-background border border-border uppercase tracking-wide text-foreground shadow-sm">
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="hidden sm:flex h-10 w-10 shrink-0 bg-background border rounded-full items-center justify-center text-muted-foreground shadow-sm">
        <ChevronRight className="h-5 w-5" />
      </div>
    </button>
  );
}
