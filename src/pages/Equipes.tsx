import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Users, MoreVertical, Edit, Trash2, Search } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { EquipeFormModal } from '@/components/modals/EquipeFormModal';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const equipes = [
  {
    id: '1',
    nome: 'Vendas Centro',
    descricao: 'Equipe responsável pela região central',
    membros: ['João Silva', 'Maria Rodrigues', 'Pedro Santos'],
    cor: 'bg-primary',
  },
  {
    id: '2',
    nome: 'Vendas Zona Sul',
    descricao: 'Equipe responsável pela zona sul',
    membros: ['Ana Costa', 'Carlos Oliveira'],
    cor: 'bg-accent',
  },
  {
    id: '3',
    nome: 'Empreendimentos',
    descricao: 'Equipe de vendas de lançamentos',
    membros: ['Fernanda Lima', 'Roberto Alves', 'Juliana Rocha'],
    cor: 'bg-warning',
  },
];

export function Equipes() {
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [selectedEquipe, setSelectedEquipe] = useState<any>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [equipeToDelete, setEquipeToDelete] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleEdit = (equipe: any) => {
    setSelectedEquipe(equipe);
    setFormOpen(true);
  };

  const handleNew = () => {
    setSelectedEquipe(null);
    setFormOpen(true);
  };

  const handleDelete = (equipe: any) => {
    setEquipeToDelete(equipe);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    // Here you would implement the actual delete logic
    console.log('Deleting team:', equipeToDelete?.nome);
    
    // Show success toast
    toast({
      title: "Equipe deletada com sucesso!",
      description: `${equipeToDelete?.nome} foi removida do sistema.`,
      variant: "success",
    });
    
    setDeleteOpen(false);
    setEquipeToDelete(null);
  };

  // Filter teams based on search term
  const filteredEquipes = equipes.filter(equipe => {
    const searchLower = searchTerm.toLowerCase();
    return (
      equipe.nome.toLowerCase().includes(searchLower) ||
      equipe.cor.toLowerCase().includes(searchLower)
    );
  });
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Equipes</h1>
          <p className="text-muted-foreground">Organize seus colaboradores em equipes</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por nome, cor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          <Button className="gap-2" onClick={handleNew}>
            <Plus className="h-4 w-4" />
            Nova Equipe
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipes.length > 0 ? (
          filteredEquipes.map((equipe, index) => (
            <Card key={equipe.id} className="hover:shadow-lg transition-all animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 ${equipe.cor} rounded-lg flex items-center justify-center mb-3`}>
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(equipe)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(equipe)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Deletar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle>{equipe.nome}</CardTitle>
                <p className="text-sm text-muted-foreground">{equipe.descricao}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground mb-3">
                    {equipe.membros.length} membros
                  </div>
                  <div className="flex -space-x-2">
                    {equipe.membros.map((membro, idx) => (
                      <Avatar key={idx} className="border-2 border-background">
                        <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
                          {membro.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="flex flex-col items-center gap-2">
              <Search className="h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Nenhuma equipe encontrada</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Nenhuma equipe corresponde à sua busca.' : 'Nenhuma equipe cadastrada.'}
              </p>
              {searchTerm && (
                <Button variant="outline" onClick={() => setSearchTerm('')} className="mt-2">
                  Limpar busca
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      <EquipeFormModal 
        open={formOpen} 
        onClose={() => {
          setFormOpen(false);
          setSelectedEquipe(null);
        }} 
        equipe={selectedEquipe}
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja deletar esta equipe? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm">
                Você está prestes a deletar a equipe:
              </p>
              <p className="font-semibold mt-1">{equipeToDelete?.nome}</p>
              <p className="text-sm text-muted-foreground">{equipeToDelete?.descricao}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {equipeToDelete?.membros?.length || 0} membros serão afetados
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive"
              onClick={confirmDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Deletar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
