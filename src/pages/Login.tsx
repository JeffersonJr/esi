import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, Building2, Calendar, Users, BarChart3, TrendingUp, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  { icon: Building2,  title: 'Funil de Vendas Inteligente',  desc: 'Gerencie leads com Kanban visual' },
  { icon: Calendar,   title: 'Agenda Integrada',              desc: 'Visitas, tarefas e compromissos' },
  { icon: Users,      title: 'CRM Completo',                 desc: 'Contatos e proprietários em um só lugar' },
  { icon: BarChart3,  title: 'Analytics Avançado',           desc: 'Métricas e relatórios em tempo real' },
  { icon: TrendingUp, title: 'Gestão Financeira',            desc: 'Controle de receitas e comissões' },
];

export function Login() {
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe]     = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({ id: '1', name: 'Admin', email, role: 'admin' }));
      toast({ title: 'Acesso autorizado', description: 'Bem-vindo ao ESI!' });
      navigate('/');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* ── Left Panel ───────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[46%] xl:w-[42%] flex-col justify-between p-10 xl:p-14 relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '28px 28px',
          }}
        />
        {/* Blur orbs */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-primary-700/40 blur-3xl" />

        {/* Logo */}
        <div className="relative z-10">
          <img
            src="/logoesi.svg"
            alt="ESI Logo"
            className="h-8 w-auto brightness-0 invert"
            onError={(e) => {
              const t = e.target as HTMLImageElement;
              t.style.display = 'none';
              t.parentElement!.innerHTML =
                '<span class="text-white font-bold text-2xl tracking-tight">ESI</span>';
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-3">
            <h1 className="text-3xl xl:text-4xl font-bold text-white leading-tight tracking-tight">
              O melhor sistema<br />
              <span className="text-primary-200">para imobiliárias</span>
            </h1>
            <p className="text-sm text-white/60 max-w-xs leading-relaxed">
              Uma plataforma completa para gestão, vendas, locações e relacionamento com clientes.
            </p>
          </div>

          <div className="space-y-4">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center mt-0.5">
                  <f.icon className="h-4 w-4 text-primary-200" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/90">{f.title}</p>
                  <p className="text-xs text-white/40">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-[11px] text-white/30">
            © {new Date().getFullYear()} ESI Sistema Imobiliário
          </p>
        </div>
      </div>

      {/* ── Right Panel (Form) ───────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          {/* Logo mobile */}
          <div className="lg:hidden mb-8 flex items-center gap-2">
            <img
              src="/logominimal.svg"
              alt="ESI"
              className="h-8 w-8"
              onError={(e) => {
                const t = e.target as HTMLImageElement;
                t.style.display = 'none';
              }}
            />
            <span className="font-bold text-xl text-primary tracking-tight">ESI</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Bem-vindo de volta</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Acesse sua conta para continuar
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">
                E-mail
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(
                    'pl-10 h-10 text-sm',
                    'border-border/80 bg-background',
                    'focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:border-primary/50'
                  )}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn(
                    'pl-10 pr-10 h-10 text-sm',
                    'border-border/80 bg-background',
                    'focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:border-primary/50'
                  )}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(c) => setRememberMe(c as boolean)}
                  className="h-4 w-4"
                />
                <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground cursor-pointer">
                  Lembrar-me
                </Label>
              </div>
              <button
                type="button"
                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                onClick={() => navigate('/recuperar-senha')}
              >
                Esqueceu a senha?
              </button>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className={cn(
                'w-full h-10 text-sm font-semibold gap-2',
                'bg-primary hover:bg-primary/90 text-primary-foreground',
                'transition-all duration-200'
              )}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Entrando...
                </span>
              ) : (
                <>
                  Entrar
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-[11px] text-muted-foreground/60">
            © {new Date().getFullYear()} ESI Sistema Imobiliário. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
