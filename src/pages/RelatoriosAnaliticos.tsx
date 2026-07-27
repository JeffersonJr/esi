import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Download, Filter, Home, Briefcase, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

// Mock Data
const IMOVEIS_DESATUALIZADOS = [
  { id: 'IMV-1029', corretor: 'João Silva', dias: 95, status: 'Ativo', valor: 'R$ 550.000', local: 'Centro, SP' },
  { id: 'IMV-1035', corretor: 'Maria Oliveira', dias: 112, status: 'Ativo', valor: 'R$ 890.000', local: 'Jardins, SP' },
  { id: 'IMV-1044', corretor: 'Carlos Souza', dias: 150, status: 'Ativo', valor: 'R$ 320.000', local: 'Pinheiros, SP' },
]

const NOVOS_NEGOCIOS = [
  { id: 'NEG-551', lead: 'Ana Clara', origem: 'WhatsApp', corretor: 'João Silva', data: 'Há 2 horas', valor: 'R$ 550.000' },
  { id: 'NEG-552', lead: 'Roberto Gomes', origem: 'Site', corretor: 'Maria Oliveira', data: 'Ontem', valor: 'R$ 1.200.000' },
  { id: 'NEG-553', lead: 'Fernanda Lima', origem: 'Instagram', corretor: 'Não atribuído', data: 'Ontem', valor: 'R$ 800.000' },
]

export function RelatoriosAnaliticos() {
  const [categoria, setCategoria] = useState('imoveis')
  const [subReportImoveis, setSubReportImoveis] = useState('desatualizados')
  const [subReportNegocios, setSubReportNegocios] = useState('novos')

  return (
    <div className="flex flex-col h-full bg-background">
      <PageHeader
        title="Relatórios Analíticos"
        description="Listagens e métricas detalhadas de Imóveis e Negócios"
        actions={
          <Button variant="outline" className="h-9 px-4 rounded-xl gap-2 font-semibold">
            <Download className="w-4 h-4" /> Exportar para Excel
          </Button>
        }
      />

      <div className="flex-1 p-6 lg:p-8 pt-0 space-y-6 overflow-auto">
        <Tabs defaultValue="imoveis" onValueChange={setCategoria} className="w-full">
          <TabsList className="h-10 bg-muted/50 rounded-xl p-1 mb-6 inline-flex w-full sm:w-auto">
            <TabsTrigger value="imoveis" className="rounded-lg gap-2 text-[15px]">
              <Home className="w-4 h-4" />
              Imóveis
            </TabsTrigger>
            <TabsTrigger value="negocios" className="rounded-lg gap-2 text-[15px]">
              <Briefcase className="w-4 h-4" />
              Negócios
            </TabsTrigger>
          </TabsList>

          {/* ABA IMÓVEIS */}
          <TabsContent value="imoveis" className="mt-0 outline-none space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Select value={subReportImoveis} onValueChange={setSubReportImoveis}>
                  <SelectTrigger className="w-full sm:w-[280px] h-9 rounded-xl font-semibold">
                    <SelectValue placeholder="Selecione o relatório" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="desatualizados">Imóveis desatualizados</SelectItem>
                    <SelectItem value="captados">Imóveis captados</SelectItem>
                    <SelectItem value="atualizados">Imóveis atualizados</SelectItem>
                    <SelectItem value="inativos">Corretores/captadores inativos</SelectItem>
                    <SelectItem value="cancelados">Imóveis cancelados/suspensos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Buscar..." className="h-9 pl-9 rounded-xl text-[14px]" />
                </div>
                <Button variant="outline" className="h-9 w-9 p-0 rounded-xl flex-shrink-0">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
            </div>

            <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent border-b-border/50">
                      <TableHead className="font-semibold text-muted-foreground">Código</TableHead>
                      <TableHead className="font-semibold text-muted-foreground">Localização</TableHead>
                      <TableHead className="font-semibold text-muted-foreground">Valor</TableHead>
                      <TableHead className="font-semibold text-muted-foreground">Corretor</TableHead>
                      <TableHead className="font-semibold text-muted-foreground text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {IMOVEIS_DESATUALIZADOS.map((imv) => (
                      <TableRow key={imv.id} className="hover:bg-muted/30 border-b-border/30">
                        <TableCell className="font-semibold text-[15px]">{imv.id}</TableCell>
                        <TableCell className="text-muted-foreground text-[14px]">{imv.local}</TableCell>
                        <TableCell className="font-medium text-[15px]">{imv.valor}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                              {imv.corretor.charAt(0)}
                            </div>
                            <span className="text-[14px] font-medium">{imv.corretor}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 rounded-full font-semibold px-3 border-0">
                            {imv.dias} dias s/ atualização
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* ABA NEGÓCIOS */}
          <TabsContent value="negocios" className="mt-0 outline-none space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Select value={subReportNegocios} onValueChange={setSubReportNegocios}>
                  <SelectTrigger className="w-full sm:w-[280px] h-9 rounded-xl font-semibold">
                    <SelectValue placeholder="Selecione o relatório" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="novos">Novos negócios (Leads)</SelectItem>
                    <SelectItem value="visitas">Visitas agendadas/realizadas</SelectItem>
                    <SelectItem value="estagnados">Negócios estagnados</SelectItem>
                    <SelectItem value="desatualizados">Negócios desatualizados</SelectItem>
                    <SelectItem value="perdidos">Negócios perdidos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Buscar leads..." className="h-9 pl-9 rounded-xl text-[14px]" />
                </div>
                <Button variant="outline" className="h-9 w-9 p-0 rounded-xl flex-shrink-0">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
            </div>

            <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent border-b-border/50">
                      <TableHead className="font-semibold text-muted-foreground">ID / Lead</TableHead>
                      <TableHead className="font-semibold text-muted-foreground">Origem</TableHead>
                      <TableHead className="font-semibold text-muted-foreground">Valor (VGV/VGL)</TableHead>
                      <TableHead className="font-semibold text-muted-foreground">Corretor</TableHead>
                      <TableHead className="font-semibold text-muted-foreground text-right">Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {NOVOS_NEGOCIOS.map((neg) => (
                      <TableRow key={neg.id} className="hover:bg-muted/30 border-b-border/30">
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-semibold text-[15px]">{neg.lead}</span>
                            <span className="text-[13px] text-muted-foreground">{neg.id}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="rounded-full bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 font-semibold border-0">
                            {neg.origem}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-[15px]">{neg.valor}</TableCell>
                        <TableCell>
                          {neg.corretor !== 'Não atribuído' ? (
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                                {neg.corretor.charAt(0)}
                              </div>
                              <span className="text-[14px] font-medium">{neg.corretor}</span>
                            </div>
                          ) : (
                            <span className="text-[14px] text-muted-foreground italic">Na roleta</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right text-[14px] text-muted-foreground font-medium">
                          {neg.data}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
