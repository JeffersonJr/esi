import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Home, MoreVertical, Trash2, Eye, Users, Search } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UsuarioFormModal } from '@/components/modals/UsuarioFormModal';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const usuarios = [
  { id: '1', nome: 'João Silva', email: 'joao@empresa.com', cargo: 'Corretor', nivel: 'Admin', status: 'Ativo' },
  { id: '2', nome: 'Maria Rodrigues', email: 'maria@empresa.com', cargo: 'Corretora', nivel: 'Normal', status: 'Ativo' },
  { id: '3', nome: 'Pedro Santos', email: 'pedro@empresa.com', cargo: 'Corretor', nivel: 'Normal', status: 'Ativo' },
  { id: '4', nome: 'Ana Costa', email: 'ana@empresa.com', cargo: 'Assistente', nivel: 'Normal', status: 'Inativo' },
];

export function Usuarios() {
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState<any>(null);
  const [selectedTransferUser, setSelectedTransferUser] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleEdit = (usuario: any) => {
    setSelectedUsuario(usuario);
    setFormOpen(true);
  };

  const handleSave = (usuario: any) => {
    // Here you would implement the actual save logic
    console.log('Saving user:', usuario);
    
    // Show success toast
    toast({
      title: "Usuário salvo com sucesso!",
      description: `${usuario.nome} foi ${usuario.id ? 'atualizado' : 'criado'} com sucesso.`,
      variant: "success",
    });
    
    setFormOpen(false);
    setSelectedUsuario(null);
  };

  const handleNew = () => {
    setSelectedUsuario(null);
    setFormOpen(true);
  };

  const handleViewDetails = (usuario: any) => {
    setSelectedUsuario(usuario);
    setDetailsOpen(true);
  };

  const handleDelete = (usuario: any) => {
    setUsuarioToDelete(usuario);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedTransferUser) {
      toast({
        title: "Selecione um usuário",
        description: "Por favor, selecione para qual usuário os leads devem ser transferidos.",
        variant: "destructive",
      });
      return;
    }
    
    // Here you would implement the actual delete logic and lead transfer
    console.log('Deleting user:', usuarioToDelete?.nome);
    console.log('Transferring leads to:', selectedTransferUser);
    
    // Show success toast
    toast({
      title: "Usuário deletado com sucesso!",
      description: `${usuarioToDelete?.nome} foi removido do sistema e seus leads foram transferidos.`,
      variant: "success",
    });
    
    setDeleteOpen(false);
    setUsuarioToDelete(null);
    setSelectedTransferUser('');
  };

  // Filter users based on search term
  const filteredUsuarios = usuarios.filter(usuario => {
    const searchLower = searchTerm.toLowerCase();
    return (
      usuario.nome.toLowerCase().includes(searchLower) ||
      usuario.cargo.toLowerCase().includes(searchLower) ||
      usuario.email.toLowerCase().includes(searchLower)
    );
  });
  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Usuários</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Usuários</h1>
          <p className="text-muted-foreground">Gerencie os usuários do sistema</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por nome, cargo, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          <Button className="gap-2" onClick={handleNew}>
            <Plus className="h-4 w-4" />
            Novo Usuário
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsuarios.length > 0 ? (
          filteredUsuarios.map((usuario, index) => (
            <Card 
              key={usuario.id} 
              className="hover:shadow-lg transition-all animate-slide-up cursor-pointer" 
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleViewDetails(usuario)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                      {usuario.nome.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{usuario.nome}</h3>
                        <p className="text-sm text-muted-foreground">{usuario.email}</p>
                        <p className="text-sm text-muted-foreground mt-1">{usuario.cargo}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(usuario);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(usuario);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(usuario);
                            }}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Deletar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Badge variant={usuario.nivel === 'Admin' ? 'default' : 'secondary'}>
                        {usuario.nivel}
                      </Badge>
                      <Badge variant="outline" className={usuario.status === 'Ativo' ? 'border-success text-success' : 'border-muted-foreground text-muted-foreground'}>
                        {usuario.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="flex flex-col items-center gap-2">
              <Search className="h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Nenhum usuário encontrado</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Nenhum usuário corresponde à sua busca.' : 'Nenhum usuário cadastrado.'}
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

      <UsuarioFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedUsuario(null);
        }}
        usuario={selectedUsuario}
        onSave={handleSave}
      />

      {/* User Details Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Usuário</DialogTitle>
            <DialogDescription>
              Informações completas do usuário selecionado.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-lg">
                  {selectedUsuario?.nome?.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{selectedUsuario?.nome}</h3>
                <p className="text-sm text-muted-foreground">{selectedUsuario?.cargo}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium">Email</label>
                <p className="text-sm text-muted-foreground">{selectedUsuario?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Cargo</label>
                <p className="text-sm text-muted-foreground">{selectedUsuario?.cargo}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Nível</label>
                <div className="mt-1">
                  <Badge variant={selectedUsuario?.nivel === 'Admin' ? 'default' : 'secondary'}>
                    {selectedUsuario?.nivel}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <div className="mt-1">
                  <Badge variant="outline" className={selectedUsuario?.status === 'Ativo' ? 'border-success text-success' : 'border-muted-foreground text-muted-foreground'}>
                    {selectedUsuario?.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDetailsOpen(false)}
            >
              Fechar
            </Button>
            <Button 
              onClick={() => {
                setDetailsOpen(false);
                handleEdit(selectedUsuario);
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Para deletar este usuário, selecione para qual usuário os leads serão transferidos.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm font-medium mb-2">
                Você está prestes a deletar o usuário:
              </p>
              <p className="font-semibold">{usuarioToDelete?.nome}</p>
              <p className="text-sm text-muted-foreground">{usuarioToDelete?.email}</p>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Transferir leads para:
              </Label>
              <Select value={selectedTransferUser} onValueChange={setSelectedTransferUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um usuário..." />
                </SelectTrigger>
                <SelectContent>
                  {usuarios
                    .filter(u => u.id !== usuarioToDelete?.id)
                    .map((usuario) => (
                      <SelectItem key={usuario.id} value={usuario.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {usuario.nome.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{usuario.nome}</p>
                            <p className="text-xs text-muted-foreground">{usuario.cargo}</p>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {selectedTransferUser && (
                <p className="text-xs text-muted-foreground">
                  Os leads de {usuarioToDelete?.nome} serão transferidos para {usuarios.find(u => u.id === selectedTransferUser)?.nome}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setDeleteOpen(false);
                setSelectedTransferUser('');
              }}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive"
              onClick={confirmDelete}
              disabled={!selectedTransferUser}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Deletar e Transferir Leads
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
