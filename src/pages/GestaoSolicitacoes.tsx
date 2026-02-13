import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Plus, Search, Filter, Clock, CheckCircle, AlertCircle, User, Home, Wrench, PaintBucket, Droplets, Zap, Users, Calendar, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';

const solicitacoes = [
  {
    id: '1',
    titulo: 'Vazamento na cozinha',
    descricao: 'Torneira da pia está vazando',
    categoria: 'Encanamento',
    prioridade: 'Alta',
    status: 'Em andamento',
    solicitante: 'Maria Santos',
    imovel: 'Apt 302 - Centro',
    dataSolicitacao: '15/01/2025',
    dataPrevista: '17/01/2025',
    atribuidoPara: 'João Silva',
  },
];

export function GestaoSolicitacoes() {
  const [searchTerm, setSearchTerm] = useState('');

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'Alta': return 'bg-red-100 text-red-800 border-red-200';
      case 'Média': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Baixa': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aberto': return 'bg-blue-100 text-blue-800';
      case 'Em andamento': return 'bg-yellow-100 text-yellow-800';
      case 'Resolvido': return 'bg-green-100 text-green-800';
      case 'Fechado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoriaIcon = (categoria: string) => {
    switch (categoria) {
      case 'Encanamento': return <Droplets className="h-4 w-4" />;
      case 'Elétrica': return <Zap className="h-4 w-4" />;
      case 'Pintura': return <PaintBucket className="h-4 w-4" />;
      case 'Geral': return <Wrench className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestão de Solicitações</h1>
            <p className="text-gray-600 mt-1">Controle de chamados e ordens de serviço</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Solicitação
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Abertos</CardTitle>
              <MessageSquare className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-gray-600">2 urgentes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-gray-600">3 hoje</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolvidos</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-gray-600">Esta semana</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48h</div>
              <p className="text-xs text-gray-600">-6h vs mês anterior</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="solicitacoes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="solicitacoes">Solicitações</TabsTrigger>
            <TabsTrigger value="manutencao">Manutenção</TabsTrigger>
            <TabsTrigger value="equipe">Equipe</TabsTrigger>
            <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="solicitacoes" className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar solicitações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {solicitacoes.map((solicitacao) => (
                <Card key={solicitacao.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center space-x-2">
                      {getCategoriaIcon(solicitacao.categoria)}
                      <CardTitle className="text-lg">{solicitacao.titulo}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPrioridadeColor(solicitacao.prioridade)}>
                        {solicitacao.prioridade}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{solicitacao.descricao}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Status:</span>
                        <Badge className={getStatusColor(solicitacao.status)}>
                          {solicitacao.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Solicitante:</span>
                        <span className="font-medium">{solicitacao.solicitante}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Imóvel:</span>
                        <span className="font-medium">{solicitacao.imovel}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Previsão:</span>
                        <span className="font-medium">{solicitacao.dataPrevista}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">JS</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-600">{solicitacao.atribuidoPara}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
