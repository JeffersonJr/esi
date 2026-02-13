import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Home, Target, DollarSign, Eye, MousePointer, Clock, BarChart3, ArrowRight, Medal } from 'lucide-react';

// Medal component for ranking
const getMedalIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Medal className="h-5 w-5 text-yellow-500" />;
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />;
    case 3:
      return <Medal className="h-5 w-5 text-amber-600" />;
    default:
      return null;
  }
};

const getRankingBg = (rank: number) => {
  switch (rank) {
    case 1:
      return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200';
    case 2:
      return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200';
    case 3:
      return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200';
    default:
      return '';
  }
};

// Mock data for detailed views
const mockVendas = {
  'João Silva': [
    { id: '1', imovel: 'Apt 302 - Centro', valor: 'R$ 450K', cliente: 'Maria Santos', data: '15/12/2024', comissao: 'R$ 22.5K' },
    { id: '2', imovel: 'Casa 4 quartos - Jardim América', valor: 'R$ 580K', cliente: 'Carlos Oliveira', data: '10/12/2024', comissao: 'R$ 29K' },
    { id: '3', imovel: 'Cobertura - Brooklin', valor: 'R$ 770K', cliente: 'Ana Costa', data: '05/12/2024', comissao: 'R$ 38.5K' },
  ],
  'Maria Rodrigues': [
    { id: '4', imovel: 'Studio - Vila Mariana', valor: 'R$ 320K', cliente: 'Pedro Santos', data: '18/12/2024', comissao: 'R$ 16K' },
    { id: '5', imovel: 'Apartamento 2 quartos - Moema', valor: 'R$ 420K', cliente: 'Fernanda Lima', data: '12/12/2024', comissao: 'R$ 21K' },
  ]
};

const mockLocacoes = {
  'João Silva': [
    { id: '1', imovel: 'Kitnet - Centro', valor: 'R$ 1.2K/mês', cliente: 'Lucas Mendes', data: '20/12/2024', comissao: 'R$ 720' },
    { id: '2', imovel: 'Apartamento 1 quarto - Bela Vista', valor: 'R$ 2.5K/mês', cliente: 'Juliana Rocha', data: '15/12/2024', comissao: 'R$ 1.5K' },
  ],
  'Maria Rodrigues': [
    { id: '3', imovel: 'Studio - Pinheiros', valor: 'R$ 1.8K/mês', cliente: 'Roberto Alves', data: '18/12/2024', comissao: 'R$ 1.08K' },
  ]
};

const mockLeads = {
  'João Silva': [
    { id: '1', nome: 'Maria Santos', contato: 'maria@email.com', origem: 'Site', status: 'negociacao', imovel: 'Apt 302' },
    { id: '2', nome: 'Carlos Oliveira', contato: 'carlos@email.com', origem: 'Facebook', status: 'visita-agendada', imovel: 'Casa Jardim América' },
    { id: '3', nome: 'Ana Costa', contato: 'ana@email.com', origem: 'Indicação', status: 'proposta-enviada', imovel: 'Cobertura Brooklin' },
  ],
  'Maria Rodrigues': [
    { id: '4', nome: 'Pedro Santos', contato: 'pedro@email.com', origem: 'Instagram', status: 'novo-lead', imovel: 'Studio Vila Mariana' },
  ]
};

export function Analytics() {
  const [selectedCorretor, setSelectedCorretor] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<'vendas' | 'locacoes' | 'leads' | null>(null);
  const navigate = useNavigate();
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Análise de desempenho e métricas detalhadas</p>
      </div>

      <Tabs defaultValue="imoveis" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="imoveis">
            <Home className="h-4 w-4 mr-2" />
            Imóveis
          </TabsTrigger>
          <TabsTrigger value="clientes">
            <Users className="h-4 w-4 mr-2" />
            Clientes/Proprietários
          </TabsTrigger>
          <TabsTrigger value="site">
            <Eye className="h-4 w-4 mr-2" />
            Site
          </TabsTrigger>
          <TabsTrigger value="equipe">
            <BarChart3 className="h-4 w-4 mr-2" />
            Equipe
          </TabsTrigger>
        </TabsList>

        <TabsContent value="imoveis" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  Total de Imóveis
                  <Home className="h-5 w-5 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">89</div>
                <p className="text-sm text-success mt-1">+8.2% vs mês anterior</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  Imóveis Vendidos
                  <Target className="h-5 w-5 text-success" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">34</div>
                <p className="text-sm text-success mt-1">+22.1% vs mês anterior</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  Tempo Médio Venda
                  <Clock className="h-5 w-5 text-accent" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">45</div>
                <p className="text-sm text-muted-foreground mt-1">dias</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  Ticket Médio
                  <DollarSign className="h-5 w-5 text-warning" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">R$ 485K</div>
                <p className="text-sm text-success mt-1">+12.8% vs mês anterior</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Imóveis por Tipo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { tipo: 'Apartamento', quantidade: 42, percentual: 47, cor: 'bg-primary', conversao: 28.5 },
                { tipo: 'Casa', quantidade: 28, percentual: 31, cor: 'bg-accent', conversao: 32.1 },
                { tipo: 'Cobertura', quantidade: 12, percentual: 13, cor: 'bg-warning', conversao: 41.7 },
                { tipo: 'Terreno', quantidade: 7, percentual: 8, cor: 'bg-success', conversao: 14.3 },
              ].map((item, index) => (
                <div key={item.tipo} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{item.tipo}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{item.quantidade} imóveis ({item.percentual}%)</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        item.conversao >= 30 ? 'bg-green-100 text-green-700' :
                        item.conversao >= 20 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {item.conversao}% conv.
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.cor} transition-all duration-500`}
                      style={{ width: `${item.percentual}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clientes" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  Total de Clientes
                  <Users className="h-5 w-5 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">247</div>
                <p className="text-sm text-success mt-1">+15.3% vs mês anterior</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  Proprietários
                  <Home className="h-5 w-5 text-accent" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">89</div>
                <p className="text-sm text-success mt-1">+8.2% vs mês anterior</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  Taxa de Conversão
                  <Target className="h-5 w-5 text-success" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">23.4%</div>
                <p className="text-sm text-success mt-1">+4.2% vs mês anterior</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  Novos este Mês
                  <TrendingUp className="h-5 w-5 text-warning" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">38</div>
                <p className="text-sm text-success mt-1">+18.3% vs mês anterior</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Origem dos Leads</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { fonte: 'Site', quantidade: 45, percentual: 35, cor: 'bg-primary', conversao: 4.2 },
                { fonte: 'Facebook', quantidade: 32, percentual: 25, cor: 'bg-accent', conversao: 3.8 },
                { fonte: 'Instagram', quantidade: 28, percentual: 22, cor: 'bg-warning', conversao: 3.1 },
                { fonte: 'Indicação', quantidade: 22, percentual: 18, cor: 'bg-success', conversao: 8.7 },
              ].map((item, index) => (
                <div key={item.fonte} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{item.fonte}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{item.quantidade} leads ({item.percentual}%)</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        item.conversao >= 5 ? 'bg-green-100 text-green-700' :
                        item.conversao >= 3 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {item.conversao}% conv.
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.cor} transition-all duration-500`}
                      style={{ width: `${item.percentual}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="site" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  Visitantes Únicos
                  <Eye className="h-5 w-5 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">12.5K</div>
                <p className="text-sm text-success mt-1">+24.5% vs mês anterior</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  Pageviews
                  <MousePointer className="h-5 w-5 text-accent" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">45.2K</div>
                <p className="text-sm text-success mt-1">+18.7% vs mês anterior</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  Tempo Médio
                  <Clock className="h-5 w-5 text-warning" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">3:45</div>
                <p className="text-sm text-muted-foreground mt-1">minutos</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  Taxa de Conversão
                  <Target className="h-5 w-5 text-success" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">3.8%</div>
                <p className="text-sm text-success mt-1">+1.2% vs mês anterior</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Páginas Mais Visitadas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { pagina: 'Home', visitas: 8500, percentual: 19, cor: 'bg-primary', cliques: 3200, tempo: '2:15', taxaRejeicao: 32.5 },
                { pagina: 'Imóveis para Venda', visitas: 12000, percentual: 27, cor: 'bg-accent', cliques: 5800, tempo: '4:30', taxaRejeicao: 28.3 },
                { pagina: 'Imóveis para Locação', visitas: 9800, percentual: 22, cor: 'bg-warning', cliques: 4200, tempo: '3:45', taxaRejeicao: 31.2 },
                { pagina: 'Contato', visitas: 6200, percentual: 14, cor: 'bg-success', cliques: 2100, tempo: '1:30', taxaRejeicao: 45.8 },
              ].map((item, index) => (
                <div key={item.pagina} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-sm font-medium">{item.pagina}</span>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-muted-foreground">{item.cliques.toLocaleString()} cliques</span>
                        <span className="text-xs text-muted-foreground">{item.tempo} avg</span>
                        <span className="text-xs text-muted-foreground">{item.taxaRejeicao}% rejeição</span>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{item.visitas.toLocaleString()} visitas ({item.percentual}%)</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.cor} transition-all duration-500`}
                      style={{ width: `${item.percentual}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipe" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Desempenho por Corretor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { nome: 'João Silva', vendas: 8, locacoes: 4, valorVendas: 'R$ 1.8M', valorLocacoes: 'R$ 45K', leads: 45, cor: 'bg-primary' },
                { nome: 'Maria Rodrigues', vendas: 6, locacoes: 4, valorVendas: 'R$ 1.5M', valorLocacoes: 'R$ 52K', leads: 38, cor: 'bg-accent' },
                { nome: 'Pedro Santos', vendas: 5, locacoes: 3, valorVendas: 'R$ 1.2M', valorLocacoes: 'R$ 38K', leads: 32, cor: 'bg-warning' },
                { nome: 'Ana Costa', vendas: 3, locacoes: 1, valorVendas: 'R$ 600K', valorLocacoes: 'R$ 12K', leads: 18, cor: 'bg-success' },
              ].map((corretor, index) => (
                <div key={corretor.nome} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-sm font-medium">{corretor.nome}</span>
                      <div className="flex items-center gap-4 mt-1">
                        <button 
                          onClick={() => { setSelectedCorretor(corretor.nome); setSelectedMetric('vendas'); }}
                          className="text-xs text-success hover:underline cursor-pointer flex items-center gap-1"
                        >
                          {corretor.vendas} vendas ({corretor.valorVendas})
                          <ArrowRight className="h-3 w-3" />
                        </button>
                        <button 
                          onClick={() => { setSelectedCorretor(corretor.nome); setSelectedMetric('locacoes'); }}
                          className="text-xs text-warning hover:underline cursor-pointer flex items-center gap-1"
                        >
                          {corretor.locacoes} locações ({corretor.valorLocacoes})
                          <ArrowRight className="h-3 w-3" />
                        </button>
                        <button 
                          onClick={() => { setSelectedCorretor(corretor.nome); setSelectedMetric('leads'); }}
                          className="text-xs text-muted-foreground hover:underline cursor-pointer flex items-center gap-1"
                        >
                          {corretor.leads} leads
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <span className="text-sm font-bold">{corretor.vendas + corretor.locacoes} total</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${corretor.cor} transition-all duration-500`}
                      style={{ width: `${((corretor.vendas + corretor.locacoes) / 12) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Taxa de Conversão por Corretor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { nome: 'João Silva', taxa: 26.7 },
                  { nome: 'Maria Rodrigues', taxa: 26.3 },
                  { nome: 'Pedro Santos', taxa: 25.0 },
                  { nome: 'Ana Costa', taxa: 22.2 },
                ].sort((a, b) => b.taxa - a.taxa).map((item, index) => (
                  <div key={item.nome} className={`flex items-center justify-between animate-slide-up p-2 rounded-lg ${getRankingBg(index + 1)}`} style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="flex items-center gap-2">
                      {index === 0 && <span className="text-lg font-bold text-yellow-500">🏅</span>}
                      {index === 1 && <span className="text-lg font-bold text-gray-500">🥈</span>}
                      {index === 2 && <span className="text-lg font-bold text-orange-500">🥉</span>}
                      {index > 2 && <span className="text-lg font-bold text-muted-foreground">{index + 1}</span>}
                      <span className="text-sm font-medium">{item.nome}</span>
                    </div>
                    <span className="text-sm font-bold text-primary">{item.taxa}%</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Atividades do Mês</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { nome: 'João Silva', atividades: 128 },
                  { nome: 'Maria Rodrigues', atividades: 115 },
                  { nome: 'Pedro Santos', atividades: 98 },
                  { nome: 'Ana Costa', atividades: 72 },
                ].sort((a, b) => b.atividades - a.atividades).map((item, index) => (
                  <div key={item.nome} className={`flex items-center justify-between animate-slide-up p-2 rounded-lg ${getRankingBg(index + 1)}`} style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="flex items-center gap-2">
                      {getMedalIcon(index + 1)}
                      <span className="text-sm font-medium">{item.nome}</span>
                    </div>
                    <span className="text-sm font-bold text-accent">{item.atividades}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal Detalhes da Métrica */}
      <Dialog open={!!selectedCorretor && !!selectedMetric} onOpenChange={() => { setSelectedCorretor(null); setSelectedMetric(null); }}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedMetric === 'vendas' && `Vendas - ${selectedCorretor}`}
              {selectedMetric === 'locacoes' && `Locações - ${selectedCorretor}`}
              {selectedMetric === 'leads' && `Leads - ${selectedCorretor}`}
            </DialogTitle>
          </DialogHeader>
          
          {selectedMetric === 'vendas' && selectedCorretor && (
            <div className="space-y-4">
              {mockVendas[selectedCorretor as keyof typeof mockVendas]?.map((venda) => (
                <Card key={venda.id} className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/vendas/${venda.id}`)}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{venda.imovel}</div>
                        <div className="text-sm text-muted-foreground mt-1">Cliente: {venda.cliente}</div>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm font-semibold text-success">{venda.valor}</span>
                          <span className="text-xs text-muted-foreground">{venda.data}</span>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Comissão: {venda.comissao}</span>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              )) || <p className="text-muted-foreground">Nenhuma venda encontrada.</p>}
            </div>
          )}
          
          {selectedMetric === 'locacoes' && selectedCorretor && (
            <div className="space-y-4">
              {mockLocacoes[selectedCorretor as keyof typeof mockLocacoes]?.map((locacao) => (
                <Card key={locacao.id} className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/locacoes/${locacao.id}`)}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{locacao.imovel}</div>
                        <div className="text-sm text-muted-foreground mt-1">Cliente: {locacao.cliente}</div>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm font-semibold text-warning">{locacao.valor}</span>
                          <span className="text-xs text-muted-foreground">{locacao.data}</span>
                          <span className="text-xs bg-warning/10 text-warning px-2 py-1 rounded">Comissão: {locacao.comissao}</span>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              )) || <p className="text-muted-foreground">Nenhuma locação encontrada.</p>}
            </div>
          )}
          
          {selectedMetric === 'leads' && selectedCorretor && (
            <div className="space-y-4">
              {mockLeads[selectedCorretor as keyof typeof mockLeads]?.map((lead) => (
                <Card key={lead.id} className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/leads/${lead.id}`)}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{lead.nome}</div>
                        <div className="text-sm text-muted-foreground mt-1">{lead.contato}</div>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {lead.status === 'novo-lead' && 'Novo Lead'}
                            {lead.status === 'visita-agendada' && 'Visita Agendada'}
                            {lead.status === 'proposta-enviada' && 'Proposta Enviada'}
                            {lead.status === 'negociacao' && 'Negociação'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">Origem: {lead.origem}</span>
                          <span className="text-xs text-muted-foreground">Interesse: {lead.imovel}</span>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              )) || <p className="text-muted-foreground">Nenhum lead encontrado.</p>}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
