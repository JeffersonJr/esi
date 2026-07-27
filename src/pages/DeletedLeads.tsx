import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Search,
  Trash2,
  RotateCcw,
  Calendar,
  User,
  Clock,
  AlertTriangle,
  MoreHorizontal,
  Filter,
  X,
  Settings,
  Home
} from 'lucide-react';
import { DeletedLead, DeleteReason } from '@/types/lead';
import { useDeletedLeadsCleanup } from '@/hooks/use-deleted-leads-cleanup';

// Mock data - em produção viria do backend
const mockDeletedLeads: DeletedLead[] = [
  {
    id: 'del_1',
    originalLead: {
      id: '1',
      name: 'Maria Santos',
      emails: [{ type: 'email', value: 'maria@email.com', isPrimary: true }],
      phones: [{ type: 'phone', value: '11 99999-0001', isPrimary: true }],
      property: 'Apt 2 quartos',
      location: 'Vila Mariana',
      searchType: 'compra',
      value: 'R$ 350.000',
      source: 'Site',
      assignedTo: 'JS',
      tags: ['Hot Lead'],
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T15:30:00Z'
    },
    deletedAt: '2024-01-25T14:20:00Z',
    deletedBy: 'JS',
    deleteReason: { id: 'not_interested', label: 'Sem Interesse', description: 'Lead perdeu o interesse' }
  },
  {
    id: 'del_2',
    originalLead: {
      id: '2',
      name: 'Carlos Oliveira',
      emails: [{ type: 'email', value: 'carlos@email.com', isPrimary: true }],
      phones: [{ type: 'mobile', value: '11 99999-0002', isPrimary: true }],
      property: 'Casa 3 quartos',
      location: 'Moema',
      searchType: 'investimento',
      value: 'R$ 580.000',
      source: 'Facebook',
      assignedTo: 'MR',
      tags: ['Investidor'],
      createdAt: '2024-01-10T09:00:00Z',
      updatedAt: '2024-01-18T11:00:00Z'
    },
    deletedAt: '2024-01-22T16:45:00Z',
    deletedBy: 'MR',
    deleteReason: { id: 'duplicate', label: 'Lead Duplicado', description: 'Lead já existente no sistema' },
    restoredAt: '2024-01-23T10:30:00Z',
    restoredBy: 'JS'
  }
];

export function DeletedLeads() {
  const [deletedLeads, setDeletedLeads] = useState<DeletedLead[]>(mockDeletedLeads);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<DeletedLead | null>(null);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [permanentDeleteDialogOpen, setPermanentDeleteDialogOpen] = useState(false);

  // Hook para limpeza automática
  const { manualCleanup, getCleanupStats } = useDeletedLeadsCleanup(
    deletedLeads,
    (leadIds) => {
      setDeletedLeads(prev => prev.filter(lead => !leadIds.includes(lead.id)));
      toast({
        title: "Limpeza automática realizada",
        description: `${leadIds.length} leads foram permanentemente excluídos após 30 dias.`,
      });
    }
  );

  const cleanupStats = getCleanupStats();

  // Filtrar leads excluídos
  const filteredLeads = useMemo(() => {
    return deletedLeads.filter(lead => {
      if (lead.restoredAt) return false; // Não mostrar já restaurados

      const searchLower = searchTerm.toLowerCase();
      return (
        lead.originalLead.name.toLowerCase().includes(searchLower) ||
        lead.originalLead.property.toLowerCase().includes(searchLower) ||
        lead.originalLead.location.toLowerCase().includes(searchLower) ||
        lead.deleteReason.label.toLowerCase().includes(searchLower)
      );
    });
  }, [deletedLeads, searchTerm]);

  // Calcular dias restantes
  const getDaysRemaining = (deletedAt: string) => {
    const deleted = new Date(deletedAt);
    const now = new Date();
    const diffTime = deleted.getTime() + (30 * 24 * 60 * 60 * 1000) - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  // Formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Restaurar lead
  const handleRestoreLead = async (lead: DeletedLead) => {
    try {
      // Em produção: chamada à API
      const updatedLead = {
        ...lead,
        restoredAt: new Date().toISOString(),
        restoredBy: 'currentUser' // Em produção: ID do usuário atual
      };

      setDeletedLeads(prev =>
        prev.map(l => l.id === lead.id ? updatedLead : l)
      );

      toast({
        title: "Lead restaurado com sucesso!",
        description: `${lead.originalLead.name} foi restaurado para o funil.`,
        variant: "success",
      });

      setRestoreDialogOpen(false);
      setSelectedLead(null);
    } catch (error) {
      toast({
        title: "Erro ao restaurar lead",
        description: "Não foi possível restaurar o lead. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Excluir permanentemente
  const handlePermanentDelete = async (lead: DeletedLead) => {
    try {
      // Em produção: chamada à API
      setDeletedLeads(prev => prev.filter(l => l.id !== lead.id));

      toast({
        title: "Lead excluído permanentemente",
        description: `${lead.originalLead.name} foi removido definitivamente do sistema.`,
      });

      setPermanentDeleteDialogOpen(false);
      setSelectedLead(null);
    } catch (error) {
      toast({
        title: "Erro ao excluir lead",
        description: "Não foi possível excluir o lead permanentemente. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      <div className="max-w-[1400px] w-full mx-auto px-6 pt-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="flex items-center gap-1">
                <Home className="h-4 w-4" /> Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/funil">Funil de Vendas</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Lixeira</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header Sticky */}
      <div className="bg-white border-b border-slate-200 px-6 py-6 sticky top-0 z-40 backdrop-blur-md bg-white/80 mt-4 h-24 flex items-center shrink-0">
        <div className="max-w-[1400px] w-full mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-slate-800 text-white flex items-center justify-center shadow-lg shadow-slate-200 shrink-0">
              <Trash2 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-semibold text-slate-800 tracking-tight">Lixeira de Leads</h1>
                <Badge variant="outline" className="text-[10px] font-semibold tracking-tight border-slate-200 text-slate-600 bg-slate-50/50">Recuperação</Badge>
              </div>
              <p className="text-slate-500 mt-1 font-medium italic">Leads excluídos que podem ser restaurados em até 30 dias</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar leads excluídos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 bg-slate-50 border-slate-200 rounded-2xl focus-visible:ring-indigo-100"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] w-full mx-auto px-6 py-8 space-y-8 animate-fade-in">

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-destructive" />
                <div>
                  <p className="text-sm text-muted-foreground">Total na Lixeira</p>
                  <p className="text-2xl font-bold">{cleanupStats.totalInTrash}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Expiram em 7 dias</p>
                  <p className="text-2xl font-bold">{cleanupStats.expiringInSevenDays}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Restaurados</p>
                  <p className="text-2xl font-bold">{cleanupStats.restored}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Limpeza Manual</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const deleted = manualCleanup();
                      if (deleted > 0) {
                        toast({
                          title: "Limpeza manual realizada",
                          description: `${deleted} leads foram permanentemente excluídos.`,
                        });
                      } else {
                        toast({
                          title: "Nenhum lead para limpar",
                          description: "Não há leads expirados para limpar no momento.",
                        });
                      }
                    }}
                    className="mt-1"
                  >
                    Executar Limpeza
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Leads Excluídos */}
        <div className="space-y-4">
          {filteredLeads.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Trash2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum lead na lixeira</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Nenhum lead encontrado para sua busca.' : 'Todos os leads estão ativos no funil.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredLeads.map((deletedLead) => {
              const daysRemaining = getDaysRemaining(deletedLead.deletedAt);
              const isExpiringSoon = daysRemaining <= 7;

              return (
                <Card key={deletedLead.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-muted">
                            {deletedLead.originalLead.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{deletedLead.originalLead.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{deletedLead.originalLead.source}</Badge>
                            <Badge variant="secondary">{deletedLead.originalLead.property}</Badge>
                            {isExpiringSoon && (
                              <Badge variant="destructive" className="gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                Expira em {daysRemaining} dias
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedLead(deletedLead);
                              setRestoreDialogOpen(true);
                            }}
                            className="gap-2"
                          >
                            <RotateCcw className="h-4 w-4" />
                            Restaurar Lead
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedLead(deletedLead);
                              setPermanentDeleteDialogOpen(true);
                            }}
                            className="gap-2 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            Excluir Permanentemente
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Responsável:</span>
                          <span>{deletedLead.originalLead.assignedTo}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Excluído em:</span>
                          <span>{formatDate(deletedLead.deletedAt)}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Excluído por:</span>
                          <span>{deletedLead.deletedBy}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Tempo restante:</span>
                          <span className={isExpiringSoon ? 'text-destructive font-medium' : ''}>
                            {daysRemaining} dias
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Motivo da exclusão:</span>
                        <Badge variant="outline">{deletedLead.deleteReason.label}</Badge>
                        {deletedLead.customReason && (
                          <span className="text-sm text-muted-foreground">- {deletedLead.customReason}</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Dialog de Confirmação de Restauração */}
        <Dialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Restaurar Lead</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja restaurar o lead <strong>{selectedLead?.originalLead.name}</strong>?
                Ele retornará para o estágio "Novo Lead" no funil.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRestoreDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={() => selectedLead && handleRestoreLead(selectedLead)}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Restaurar Lead
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog de Confirmação de Exclusão Permanente */}
        <Dialog open={permanentDeleteDialogOpen} onOpenChange={setPermanentDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Excluir Permanentemente</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir permanentemente o lead <strong>{selectedLead?.originalLead.name}</strong>?
                Esta ação não poderá ser desfeita e todos os dados serão perdidos.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPermanentDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={() => selectedLead && handlePermanentDelete(selectedLead)}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Excluir Permanentemente
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
