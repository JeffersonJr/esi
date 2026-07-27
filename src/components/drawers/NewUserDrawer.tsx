import { useState } from 'react';
import {
  Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import type { Usuario } from '@/components/sheets/UserSheet';

interface NewUserDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (u: Usuario) => void;
}

export function NewUserDrawer({ open, onClose, onSave }: NewUserDrawerProps) {
  const [form, setForm] = useState<Partial<Usuario>>({
    nome: '',
    email: '',
    cargo: '',
    etiqueta: '',
    status: 'Ativo',
    filial: '',
    equipe: '',
    nivel: 'Normal',
  });
  
  // Extra fields requested that are not strictly in Usuario interface yet, we will just hold them in local state for now
  const [extra, setExtra] = useState({
    dataAdmissao: '',
    creci: '',
    regiao: '',
    delegacia: '',
    localidade: '',
    dominio: '',
    albert: false,
  });

  const handleSave = () => {
    if (!form.nome || !form.email || !form.cargo) return;
    
    onSave({
      id: Date.now().toString(),
      nome: form.nome,
      email: form.email,
      cargo: form.cargo,
      etiqueta: form.etiqueta,
      status: form.status || 'Ativo',
      filial: form.filial,
      equipe: form.equipe,
      nivel: form.nivel || 'Normal',
      telefone: '', // Default empty for new
    });
    
    // Reset form after saving
    setForm({ nome: '', email: '', cargo: '', etiqueta: '', status: 'Ativo', filial: '', equipe: '', nivel: 'Normal' });
    setExtra({ dataAdmissao: '', creci: '', regiao: '', delegacia: '', localidade: '', dominio: '', albert: false });
    onClose();
  };

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-2xl max-h-[85vh] flex flex-col">
          <DrawerHeader>
            <DrawerTitle>Novo Usuário</DrawerTitle>
            <DrawerDescription>Preencha os dados abaixo para cadastrar um novo usuário no sistema.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500">Nome</Label>
                <Input placeholder="Nome completo" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500">E-mail</Label>
                <Input type="email" placeholder="email@exemplo.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500">Etiqueta</Label>
                <Input placeholder="Ex: Top Broker" value={form.etiqueta} onChange={e => setForm({ ...form, etiqueta: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500">Função</Label>
                <Select value={form.cargo} onValueChange={(val) => setForm({ ...form, cargo: val })}>
                    <SelectTrigger><SelectValue placeholder="Selecione a função..." /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Advogado">Advogado</SelectItem>
                        <SelectItem value="Assistente">Assistente</SelectItem>
                        <SelectItem value="Auxiliar de escritório">Auxiliar de escritório</SelectItem>
                        <SelectItem value="Auxiliar de locação">Auxiliar de locação</SelectItem>
                        <SelectItem value="Auxiliar financeiro">Auxiliar financeiro</SelectItem>
                        <SelectItem value="Coordenador de equipe">Coordenador de equipe</SelectItem>
                        <SelectItem value="Corretor">Corretor</SelectItem>
                        <SelectItem value="Diretor">Diretor</SelectItem>
                        <SelectItem value="Gerente">Gerente</SelectItem>
                        <SelectItem value="Secretária">Secretária</SelectItem>
                        <SelectItem value="Sem Função">Sem Função</SelectItem>
                        <SelectItem value="Supervisor de negócios">Supervisor de negócios</SelectItem>
                    </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500">Status</Label>
                <Select value={form.status} onValueChange={(val) => setForm({ ...form, status: val })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Ativo">Ativo</SelectItem>
                        <SelectItem value="Inativo">Inativo</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500">Data de admissão</Label>
                <Input type="date" value={extra.dataAdmissao} onChange={e => setExtra({ ...extra, dataAdmissao: e.target.value })} />
              </div>
              
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500">Filial</Label>
                <Input placeholder="Ex: Matriz" value={form.filial} onChange={e => setForm({ ...form, filial: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500">Equipe</Label>
                <Input placeholder="Ex: Vendas Internas" value={form.equipe} onChange={e => setForm({ ...form, equipe: e.target.value })} />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500">Nº. CRECI</Label>
                <Input placeholder="000000-F" value={extra.creci} onChange={e => setExtra({ ...extra, creci: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500">Região</Label>
                <Input placeholder="Ex: SP" value={extra.regiao} onChange={e => setExtra({ ...extra, regiao: e.target.value })} />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500">Delegacia</Label>
                <Input placeholder="Ex: 2ª Delegacia Regional" value={extra.delegacia} onChange={e => setExtra({ ...extra, delegacia: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500">Localidade</Label>
                <Input placeholder="Ex: São Paulo" value={extra.localidade} onChange={e => setExtra({ ...extra, localidade: e.target.value })} />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500">Domínio</Label>
                <Input placeholder="exemplo.com.br" value={extra.dominio} onChange={e => setExtra({ ...extra, dominio: e.target.value })} />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Checkbox id="albert" checked={extra.albert} onCheckedChange={(c) => setExtra({ ...extra, albert: !!c })} />
                <label htmlFor="albert" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Albert
                </label>
              </div>
            </div>
          </div>
          <DrawerFooter className="flex-row justify-end gap-2 border-t pt-4">
            <DrawerClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DrawerClose>
            <Button onClick={handleSave} disabled={!form.nome || !form.email || !form.cargo}>Cadastrar Usuário</Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
