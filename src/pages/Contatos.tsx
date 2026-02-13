import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, Mail, Phone, MapPin, MoreVertical, User, Edit, Trash2, Home } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { ContatoDeleteModal } from '@/components/modals/ContatoDeleteModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const contatos = [
  {
    id: '1',
    nome: 'Maria Santos',
    email: 'maria@email.com',
    telefone: '(11) 99999-0001',
    tipo: 'Cliente',
    interesse: 'Apartamento',
    cidade: 'São Paulo',
    status: 'Ativo',
  },
  {
    id: '2',
    nome: 'Carlos Oliveira',
    email: 'carlos@email.com',
    telefone: '(11) 99999-0002',
    tipo: 'Proprietário',
    interesse: 'Casa',
    cidade: 'Santos',
    status: 'Ativo',
  },
  {
    id: '3',
    nome: 'João Silva',
    email: 'joao@email.com',
    telefone: '(11) 99999-0003',
    tipo: 'Cliente',
    interesse: 'Cobertura',
    cidade: 'São Paulo',
    status: 'Em negociação',
  },
  {
    id: '4',
    nome: 'Ana Costa',
    email: 'ana@email.com',
    telefone: '(11) 99999-0004',
    tipo: 'Cliente',
    interesse: 'Apartamento',
    cidade: 'Guarujá',
    status: 'Ativo',
  },
  {
    id: '5',
    nome: 'Pedro Souza',
    email: 'pedro@email.com',
    telefone: '(11) 99999-0005',
    tipo: 'Proprietário',
    interesse: 'Casa condomínio',
    cidade: 'São Paulo',
    status: 'Inativo',
  },
];

export function Contatos() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [contatoToDelete, setContatoToDelete] = useState<any>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newContato, setNewContato] = useState({
    nome: '',
    email: '',
    telefone: '',
    tipo: '',
    interesse: '',
    cidade: '',
    status: 'Ativo'
  });
  const [contatosList, setContatosList] = useState(contatos);

  const handleViewProfile = (contato: any) => {
    navigate(`/contatos/perfil/${contato.id}`);
  };

  const handleEdit = (contato: any) => {
    navigate(`/contatos/editar/${contato.id}`);
  };

  const handleDelete = (contato: any) => {
    setContatoToDelete(contato);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    // In a real app, this would call an API to delete the contato
    console.log('Deleting contato:', contatoToDelete);
    setDeleteModalOpen(false);
    setContatoToDelete(null);
  };

  const handleAddContato = () => {
    if (newContato.nome && newContato.email && newContato.telefone && newContato.tipo) {
      const contatoToAdd = {
        ...newContato,
        id: Date.now().toString()
      };
      setContatosList([...contatosList, contatoToAdd]);
      setAddModalOpen(false);
      setNewContato({
        nome: '',
        email: '',
        telefone: '',
        tipo: '',
        interesse: '',
        cidade: '',
        status: 'Ativo'
      });
    }
  };

  const filteredContatos = contatosList.filter(
    (contato) =>
      contato.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contato.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contato.telefone.includes(searchTerm)
  );

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
            <BreadcrumbPage>Contatos</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contatos</h1>
          <p className="text-muted-foreground">Gerencie clientes e proprietários</p>
        </div>
        <Button className="gap-2" onClick={() => setAddModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Novo Contato
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contato</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Interesse</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContatos.map((contato, index) => (
                <TableRow key={contato.id} className="animate-slide-up cursor-pointer hover:bg-muted/50" style={{ animationDelay: `${index * 50}ms` }} onClick={() => navigate(`/contatos/perfil/${contato.id}`)}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                          {contato.nome.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{contato.nome}</div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {contato.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {contato.telefone}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {contato.tipo === 'Ambos' ? (
                      <div className="flex gap-1">
                        <Badge variant="default">Cliente</Badge>
                        <Badge variant="secondary">Proprietário</Badge>
                      </div>
                    ) : (
                      <Badge variant={contato.tipo === 'Cliente' ? 'default' : 'secondary'}>
                        {contato.tipo}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{contato.interesse}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {contato.cidade}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        contato.status === 'Ativo'
                          ? 'border-success text-success'
                          : contato.status === 'Em negociação'
                          ? 'border-warning text-warning'
                          : 'border-muted-foreground text-muted-foreground'
                      }
                    >
                      {contato.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleViewProfile(contato);
                        }} className="gap-2">
                          <User className="h-4 w-4" />
                          Ver perfil
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(contato);
                        }} className="gap-2">
                          <Edit className="h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(contato);
                        }} className="text-destructive gap-2">
                          <Trash2 className="h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ContatoDeleteModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setContatoToDelete(null);
        }}
        contato={contatoToDelete}
        onConfirm={confirmDelete}
      />

      {/* Modal para Adicionar Contato */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Contato</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                value={newContato.nome}
                onChange={(e) => setNewContato({...newContato, nome: e.target.value})}
                placeholder="Digite o nome completo"
              />
            </div>
            
            <div>
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={newContato.email}
                onChange={(e) => setNewContato({...newContato, email: e.target.value})}
                placeholder="Digite o e-mail"
              />
            </div>
            
            <div>
              <Label htmlFor="telefone">Telefone *</Label>
              <Input
                id="telefone"
                value={newContato.telefone}
                onChange={(e) => setNewContato({...newContato, telefone: e.target.value})}
                placeholder="Digite o telefone"
              />
            </div>
            
            <div>
              <Label htmlFor="tipo">Tipo *</Label>
              <Select value={newContato.tipo} onValueChange={(value) => setNewContato({...newContato, tipo: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cliente">Cliente</SelectItem>
                  <SelectItem value="Proprietário">Proprietário</SelectItem>
                  <SelectItem value="Ambos">Ambos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="interesse">Interesse</Label>
              <Input
                id="interesse"
                value={newContato.interesse}
                onChange={(e) => setNewContato({...newContato, interesse: e.target.value})}
                placeholder="Ex: Apartamento, Casa, etc."
              />
            </div>
            
            <div>
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                value={newContato.cidade}
                onChange={(e) => setNewContato({...newContato, cidade: e.target.value})}
                placeholder="Digite a cidade"
              />
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={newContato.status} onValueChange={(value) => setNewContato({...newContato, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                  <SelectItem value="Em negociação">Em negociação</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddContato}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
