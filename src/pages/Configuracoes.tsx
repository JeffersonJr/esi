import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Bell, Shield, Palette, Globe, Save, Check, Search, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useTheme } from '@/contexts/theme-context';
import { TwoFactorSetupModal } from '@/components/modals/TwoFactorSetupModal';
import { useToast } from '@/hooks/use-toast';

export function Configuracoes() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [saved, setSaved] = useState(false);
  const [portalSearchTerm, setPortalSearchTerm] = useState('');
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  // Company branding states
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState('#4298B5');
  const [secondaryColor, setSecondaryColor] = useState('#00C389');
  const [companyName, setCompanyName] = useState('Minha Imobiliária');

  const handleSave = () => {
    console.log('Salvando configurações...');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePasswordReset = () => {
    toast({
      title: "Link de redefinição enviado!",
      description: "Enviamos um link para redefinir sua senha para o email admin@imobiliaria.com",
      variant: "success",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">Personalize e configure seu sistema</p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? 'Salvo!' : 'Salvar Alterações'}
        </Button>
      </div>

      <Tabs defaultValue="geral" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="geral">
            <Settings className="h-4 w-4 mr-2" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="notificacoes">
            <Bell className="h-4 w-4 mr-2" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="seguranca">
            <Shield className="h-4 w-4 mr-2" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="personalizacao">
            <Palette className="h-4 w-4 mr-2" />
            Personalização
          </TabsTrigger>
          <TabsTrigger value="integracoes">
            <Globe className="h-4 w-4 mr-2" />
            Integrações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Empresa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome da Imobiliária</Label>
                  <Input placeholder="Nome da sua imobiliária" />
                </div>
                <div className="space-y-2">
                  <Label>CRECI</Label>
                  <Input placeholder="Número do CRECI" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Telefone Principal</Label>
                  <Input placeholder="(00) 0000-0000" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="contato@imobiliaria.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Endereço</Label>
                <Input placeholder="Endereço completo da imobiliária" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rodízio de Atendimento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Rodízio Automático</Label>
                  <p className="text-sm text-muted-foreground">
                    Distribui leads automaticamente entre os corretores
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Modo de Rodízio</Label>
                <select className="w-full px-3 py-2 rounded-md border border-input bg-background">
                  <option value="sequencial">Sequencial</option>
                  <option value="aleatorio">Aleatório</option>
                  <option value="disponibilidade">Por Disponibilidade</option>
                  <option value="desempenho">Por Desempenho</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notificacoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Novos Leads</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba notificação quando um novo lead for cadastrado
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Visitas Agendadas</Label>
                  <p className="text-sm text-muted-foreground">
                    Seja notificado sobre visitas marcadas
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Propostas Recebidas</Label>
                  <p className="text-sm text-muted-foreground">
                    Notificação de novas propostas
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações por Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba também por email
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguranca" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Redefinição de Senha</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium">Enviar Link de Redefinição</h3>
                    <p className="text-sm text-muted-foreground">
                      Receba um link seguro no seu email para redefinir sua senha
                    </p>
                  </div>
                </div>
                
                <div className="p-4 bg-muted rounded-lg">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Email cadastrado:</span>
                      <span className="text-sm text-muted-foreground">admin@imobiliaria.com</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Última redefinição:</span>
                      <span className="text-sm text-muted-foreground">Nunca</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={handlePasswordReset}
                  className="w-full"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar Link de Redefinição
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  O link expirará em 1 hora por segurança. Verifique sua caixa de entrada e spam.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Autenticação de Dois Fatores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Label className="font-medium">2FA</Label>
                    {twoFactorEnabled && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Ativado
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Adicione uma camada extra de segurança à sua conta
                  </p>
                </div>
                <Button
                  variant={twoFactorEnabled ? "destructive" : "default"}
                  onClick={() => twoFactorEnabled ? setTwoFactorEnabled(false) : setTwoFactorModalOpen(true)}
                >
                  {twoFactorEnabled ? "Desativar" : "Ativar"}
                </Button>
              </div>
              
              {twoFactorEnabled && (
                <div className="space-y-3">
                  <Separator />
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Status:</span>
                        <span className="text-sm text-green-600">Ativo e funcionando</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Configurado em:</span>
                        <span className="text-sm text-muted-foreground">20/12/2024</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Método:</span>
                        <span className="text-sm text-muted-foreground">Aplicativo Autenticador</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        Em caso de perda do acesso ao aplicativo, use seu código de backup para recuperar sua conta.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personalizacao" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Branding da Empresa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base font-medium">Logo da Empresa</Label>
                  <p className="text-sm text-muted-foreground">
                    Faça upload do logo da sua imobiliária para personalizar o site.
                  </p>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-gray-50">
                    {companyLogo ? (
                      <img src={companyLogo} alt="Company Logo" className="w-full h-full object-contain rounded-lg" />
                    ) : (
                      <div className="text-center">
                        <svg className="w-8 h-8 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-xs text-gray-500">Logo</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <input
                        type="file"
                        id="logo-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              setCompanyLogo(e.target?.result as string);
                              toast({
                                title: "Logo atualizado!",
                                description: "O logo da empresa foi atualizado com sucesso.",
                                variant: "success",
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <Button
                        onClick={() => document.getElementById('logo-upload')?.click()}
                        variant="outline"
                        className="w-full"
                      >
                        {companyLogo ? 'Alterar Logo' : 'Fazer Upload do Logo'}
                      </Button>
                    </div>
                    
                    {companyLogo && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setCompanyLogo(null);
                          toast({
                            title: "Logo removido!",
                            description: "O logo foi removido com sucesso.",
                            variant: "success",
                          });
                        }}
                      >
                        Remover Logo
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base font-medium">Nome da Empresa</Label>
                  <p className="text-sm text-muted-foreground">
                    Nome que será exibido no site e nos documentos.
                  </p>
                </div>
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Nome da sua imobiliária"
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base font-medium">Cores da Marca</Label>
                  <p className="text-sm text-muted-foreground">
                    Defina as cores primária e secundária da sua marca.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Cor Primária</Label>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-lg border-2 border-border cursor-pointer"
                        style={{ backgroundColor: primaryColor }}
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'color';
                          input.value = primaryColor;
                          input.onchange = (e) => {
                            setPrimaryColor((e.target as HTMLInputElement).value);
                          };
                          input.click();
                        }}
                      />
                      <Input
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        placeholder="#4298B5"
                        className="font-mono"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Cor Secundária</Label>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-lg border-2 border-border cursor-pointer"
                        style={{ backgroundColor: secondaryColor }}
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'color';
                          input.value = secondaryColor;
                          input.onchange = (e) => {
                            setSecondaryColor((e.target as HTMLInputElement).value);
                          };
                          input.click();
                        }}
                      />
                      <Input
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        placeholder="#00C389"
                        className="font-mono"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-8 h-8 rounded"
                      style={{ backgroundColor: primaryColor }}
                    />
                    <div 
                      className="w-8 h-8 rounded"
                      style={{ backgroundColor: secondaryColor }}
                    />
                    <span className="text-sm text-gray-600">Preview das cores selecionadas</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Aparência
                <ThemeToggle />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base font-medium">Tema do Sistema</Label>
                  <p className="text-sm text-muted-foreground">
                    Escolha o tema que prefere usar. O modo automático segue as preferências do seu sistema operacional.
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => setTheme('light')}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:scale-105 ${
                      theme === 'light' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary'
                    }`}
                  >
                    <div className="aspect-video bg-gradient-to-br from-white to-gray-100 rounded mb-2 border border-gray-200"></div>
                    <div className="text-sm font-medium text-center">Claro</div>
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:scale-105 ${
                      theme === 'dark' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary'
                    }`}
                  >
                    <div className="aspect-video bg-gradient-to-br from-gray-900 to-black rounded mb-2"></div>
                    <div className="text-sm font-medium text-center">Escuro</div>
                  </button>
                  <button
                    onClick={() => setTheme('system')}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:scale-105 ${
                      theme === 'system' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary'
                    }`}
                  >
                    <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded mb-2"></div>
                    <div className="text-sm font-medium text-center">Automático</div>
                  </button>
                </div>
                
                <div className="text-xs text-muted-foreground text-center">
                  {theme === 'system' 
                    ? 'Usando as preferências do sistema operacional'
                    : `Tema ${theme === 'light' ? 'claro' : 'escuro'} selecionado`
                  }
                </div>
              </div>
            </CardContent>
          </Card>

        </TabsContent>

        <TabsContent value="integracoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Portais Imobiliários</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { nome: 'ZAP Imóveis', conectado: true },
                { nome: 'Viva Real', conectado: true },
                { nome: 'OLX', conectado: false },
                { nome: 'Imovelweb', conectado: false },
              ].map((portal) => (
                <div key={portal.nome} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <div className="font-medium">{portal.nome}</div>
                    <p className="text-sm text-muted-foreground">
                      {portal.conectado ? 'Conectado e sincronizando' : 'Não conectado'}
                    </p>
                  </div>
                  <Button variant={portal.conectado ? 'outline' : 'default'}>
                    {portal.conectado ? 'Desconectar' : 'Conectar'}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Google Agenda</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sincronizar com Google Agenda</Label>
                  <p className="text-sm text-muted-foreground">
                    Sincronize automaticamente suas atividades
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm">
                  ✓ Conectado como: <strong>usuario@gmail.com</strong>
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Alterar Conta
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analytics e Scripts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Google Analytics ID</Label>
                <Input placeholder="G-XXXXXXXXXX" />
              </div>
              <div className="space-y-2">
                <Label>Facebook Pixel</Label>
                <Input placeholder="000000000000000" />
              </div>
              <div className="space-y-2">
                <Label>Scripts Personalizados (Talk.to, etc)</Label>
                <textarea
                  className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background font-mono text-sm"
                  placeholder="Cole seus scripts aqui..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <TwoFactorSetupModal 
        open={twoFactorModalOpen} 
        onClose={() => {
          setTwoFactorModalOpen(false);
          setTwoFactorEnabled(true);
        }} 
      />
    </div>
  );
}
