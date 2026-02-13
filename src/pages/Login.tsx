import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, Building2, Calendar, Users, BarChart3, MessageSquare } from 'lucide-react';
import { Logo } from '@/components/Logo';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulação de login
    setTimeout(() => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        name: 'Admin',
        email: email,
        role: 'admin'
      }));
      
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao sistema!",
      });
      
      navigate('/');
      setIsLoading(false);
    }, 1000);
  };

  const features = [
    { icon: Building2, title: "Funil de Vendas Inteligente" },
    { icon: Calendar, title: "Agenda Integrada" },
    { icon: Users, title: "Gestão de Imóveis" },
    { icon: BarChart3, title: "CRM Completo" },
    { icon: MessageSquare, title: "Analytics Avançado" }
  ];

  return (
    <div className="min-h-screen flex">
      {/* Lado Esquerdo - Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-secondary flex-col justify-between p-12 text-white">
        <div className="flex-1 flex flex-col justify-center">
          <div className="mb-12">
            <div className="mb-6">
              <Logo size="lg" className="text-white" showText={false} />
            </div>
            <p className="text-xl text-white/90 max-w-md">
              A plataforma completa para gestão do seu negócio imobiliário
            </p>
          </div>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-5 w-5" />
                </div>
                <span className="text-lg">{feature.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-md border-0 shadow-none">
          <CardContent className="p-0">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Bem-vindo de volta!</h1>
              <p className="text-muted-foreground">
                Entre com suas credenciais para acessar o sistema
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm font-medium cursor-pointer">
                    Lembrar-me
                  </Label>
                </div>
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                  onClick={() => navigate('/recuperar-senha')}
                >
                  Esqueceu a senha?
                </button>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar no Sistema →'}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-xs text-muted-foreground">
                Copyright {new Date().getFullYear()} © ESI Sistema Imobiliário. Todos os direitos reservados.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
