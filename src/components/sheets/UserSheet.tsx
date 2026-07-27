import { useState, useEffect } from 'react';
import {
    Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    CheckCircle2, XCircle, X, Crown, Plus, Trash2, Key, Copy, ShieldAlert,
    Building2, Users, FileText, Phone, Mail, Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export interface Usuario {
    id: string;
    nome: string;
    email: string;
    telefone?: string;
    cargo: string;
    equipe?: string;
    filial?: string;
    etiqueta?: string;
    nivel: string;
    status: string;
}

interface UserSheetProps {
    usuario: Usuario | null;
    open: boolean;
    onClose: () => void;
    onSave: (u: Usuario) => void;
    onDelete?: (u: Usuario) => void;
}

const statusStyle = (s: string) =>
    s === 'Ativo'
        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';

const nivelStyle = (n: string) =>
    n === 'Admin'
        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';

export function UserSheet({ usuario, open, onClose, onSave, onDelete }: UserSheetProps) {
    const { toast } = useToast();
    const [form, setForm] = useState<Usuario | null>(null);
    const [activeTab, setActiveTab] = useState('dados');
    const [telefones, setTelefones] = useState([{ id: 1, tipo: 'Celular', operadora: 'Vivo', numero: '' }]);

    useEffect(() => {
        if (usuario) {
            setForm({ ...usuario });
            setTelefones(usuario.telefone ? [{ id: 1, tipo: 'Celular', operadora: 'Outra', numero: usuario.telefone }] : []);
            setActiveTab('dados');
        } else {
            setForm(null);
        }
    }, [usuario]);

    if (!usuario || !form) return null;

    const initials = form.nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    const handleSave = () => {
        if (form) {
            // Save main phone to the user object for the table
            const mainPhone = telefones.length > 0 ? telefones[0].numero : '';
            onSave({ ...form, telefone: mainPhone });
        }
    };

    const handleAddPhone = () => {
        setTelefones([...telefones, { id: Date.now(), tipo: 'Celular', operadora: 'Claro', numero: '' }]);
    };

    const handleRemovePhone = (id: number) => {
        setTelefones(telefones.filter(t => t.id !== id));
    };

    const isAdmin = form.nivel === 'Admin';

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent className="w-full sm:max-w-[600px] p-0 flex flex-col overflow-hidden" side="right">
                {/* Header */}
                <div className="relative bg-gradient-to-br from-primary/90 to-primary/80 h-32 shrink-0">
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
                    >
                        <X className="h-4 w-4" />
                    </button>
                    {isAdmin && (
                        <div className="absolute top-3 left-4 flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1">
                            <Crown className="h-3.5 w-3.5 text-amber-300" />
                            <span className="text-white text-xs font-bold">Administrador</span>
                        </div>
                    )}
                    <div className="absolute -bottom-10 left-6">
                        <Avatar className="h-20 w-20 border-4 border-background shadow-xl">
                            <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xl font-semibold dark:bg-indigo-900/50 dark:text-indigo-300">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                {/* Identity */}
                <div className="pt-12 px-6 pb-2 shrink-0">
                    <SheetHeader className="text-left">
                        <div className="flex justify-between items-start">
                            <div>
                                <SheetTitle className="text-2xl font-semibold tracking-tight">{form.nome}</SheetTitle>
                                <SheetDescription className="flex items-center gap-2 mt-1 flex-wrap">
                                    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold', nivelStyle(form.nivel))}>
                                        {isAdmin && <Crown className="h-3 w-3" />}
                                        {form.nivel}
                                    </span>
                                    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold', statusStyle(form.status))}>
                                        {form.status}
                                    </span>
                                </SheetDescription>
                            </div>
                            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                Salvar Alterações
                            </Button>
                        </div>
                    </SheetHeader>
                </div>

                {/* Body Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden mt-4">
                    <div className="px-6 border-b shrink-0">
                        <TabsList className="bg-transparent h-auto p-0 flex gap-6 justify-start">
                            <TabsTrigger value="dados" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary text-primary rounded-none pb-3 px-0 font-semibold">
                                Dados Principais
                            </TabsTrigger>
                            {isAdmin ? (
                                <TabsTrigger value="acesso" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary text-primary rounded-none pb-3 px-0 font-semibold">
                                    Acesso ao sistema
                                </TabsTrigger>
                            ) : (
                                <>
                                    <TabsTrigger value="permissoes" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary text-primary rounded-none pb-3 px-0 font-semibold">
                                        Permissões de Acesso
                                    </TabsTrigger>
                                    <TabsTrigger value="tokens" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary text-primary rounded-none pb-3 px-0 font-semibold">
                                        Tokens
                                    </TabsTrigger>
                                </>
                            )}
                        </TabsList>
                    </div>

                    <ScrollArea className="flex-1 px-6">
                        <TabsContent value="dados" className="py-6 space-y-6 mt-0">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2">
                                    <Label className="text-xs font-bold text-slate-500">Nome</Label>
                                    <Input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-500">Etiqueta</Label>
                                    <Input placeholder="Ex: Especialista" value={form.etiqueta || ''} onChange={e => setForm({ ...form, etiqueta: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-500">Função / Cargo</Label>
                                    <Input value={form.cargo} onChange={e => setForm({ ...form, cargo: e.target.value })} />
                                </div>
                                {!isAdmin && (
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500">Status</Label>
                                        <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Ativo">Ativo</SelectItem>
                                                <SelectItem value="Inativo">Inativo</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-500">Data de admissão</Label>
                                    <Input type="date" />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <Label className="text-xs font-bold text-slate-500">E-mail</Label>
                                    <Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-500">Filial</Label>
                                    <Input placeholder="Matriz" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-500">Equipe</Label>
                                    <Input placeholder="Vendas" value={form.equipe || ''} onChange={e => setForm({ ...form, equipe: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-500">Nº. CRECI</Label>
                                    <Input placeholder="12345-J" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-500">Região</Label>
                                    <Input placeholder="SP" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-500">Delegacia</Label>
                                    <Input placeholder="" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-500">Localidade</Label>
                                    <Input placeholder="São Paulo" />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <Label className="text-xs font-bold text-slate-500">Domínio</Label>
                                    <Input placeholder="exemplo.esi.chat" />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                        <Checkbox id="albert" />
                                        <label htmlFor="albert" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Habilitar Inteligência Artificial (Albert)
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <Separator />
                            
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <Label className="text-sm font-bold">Informações de Contato (Telefones)</Label>
                                    <Button variant="outline" size="sm" onClick={handleAddPhone}>
                                        <Plus className="h-3 w-3 mr-1" /> Adicionar
                                    </Button>
                                </div>
                                <div className="space-y-3">
                                    {telefones.map((tel, index) => (
                                        <div key={tel.id} className="flex gap-2 items-end">
                                            <div className="space-y-1 flex-1">
                                                <Label className="text-[10px] text-muted-foreground">Tipo</Label>
                                                <Select value={tel.tipo} onValueChange={(val) => {
                                                    const nt = [...telefones]; nt[index].tipo = val; setTelefones(nt);
                                                }}>
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Celular">Celular</SelectItem>
                                                        <SelectItem value="Residencial">Residencial</SelectItem>
                                                        <SelectItem value="Trabalho">Trabalho</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-1 flex-1">
                                                <Label className="text-[10px] text-muted-foreground">Operadora</Label>
                                                <Input value={tel.operadora} onChange={e => {
                                                    const nt = [...telefones]; nt[index].operadora = e.target.value; setTelefones(nt);
                                                }} />
                                            </div>
                                            <div className="space-y-1 flex-[2]">
                                                <Label className="text-[10px] text-muted-foreground">Telefone</Label>
                                                <Input value={tel.numero} placeholder="+55 11 99999-9999" onChange={e => {
                                                    const nt = [...telefones]; nt[index].numero = e.target.value; setTelefones(nt);
                                                }} />
                                            </div>
                                            <Button variant="ghost" className="text-red-500 shrink-0" onClick={() => handleRemovePhone(tel.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    {telefones.length === 0 && (
                                        <p className="text-sm text-slate-500 text-center py-2">Nenhum telefone cadastrado.</p>
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        {isAdmin && (
                            <TabsContent value="acesso" className="py-6 space-y-6 mt-0">
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-slate-800">Alterar Senha do Administrador</h4>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500">Nova Senha</Label>
                                        <Input type="password" placeholder="••••••••" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500">Repetir Senha</Label>
                                        <Input type="password" placeholder="••••••••" />
                                    </div>
                                    <Button className="w-full">Atualizar Senha</Button>
                                </div>
                            </TabsContent>
                        )}

                        {!isAdmin && (
                            <>
                                <TabsContent value="permissoes" className="py-6 space-y-8 mt-0">
                                    <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3">
                                        <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0" />
                                        <p className="text-sm text-amber-800">Selecione cuidadosamente as permissões deste usuário. Estas regras afetam diretamente o que ele pode ver e editar no sistema.</p>
                                    </div>

                                    {/* Permission Group */}
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-bold border-b pb-2 flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-muted-foreground"/> Segurança e Financeiro</h4>
                                        <label className="flex items-start gap-2 text-sm"><Checkbox /> Bloqueio de IP: Esse usuário não é afetado pelo bloqueio de IP</label>
                                        <label className="flex items-start gap-2 text-sm"><Checkbox /> Meus Boletos: Visualizar e gerar novos boletos</label>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="text-sm font-bold border-b pb-2 flex items-center gap-2"><Briefcase className="w-4 h-4 text-muted-foreground"/> Negócios e Atividades</h4>
                                        <label className="flex items-start gap-2 text-sm"><Checkbox /> Cadastrar e editar seus negócios</label>
                                        <label className="flex items-start gap-2 text-sm"><Checkbox /> Excluir negócios</label>
                                        <label className="flex items-start gap-2 text-sm"><Checkbox /> Cadastrar e editar negócios de sua equipe</label>
                                        <label className="flex items-start gap-2 text-sm"><Checkbox /> Cadastrar e editar todos os negócios</label>
                                        <label className="flex items-start gap-2 text-sm"><Checkbox /> Cadastrar e editar suas atividades</label>
                                        <label className="flex items-start gap-2 text-sm"><Checkbox /> Cadastrar e editar todas as atividades</label>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="text-sm font-bold border-b pb-2 flex items-center gap-2"><Building2 className="w-4 h-4 text-muted-foreground"/> Imóveis</h4>
                                        <label className="flex items-start gap-2 text-sm"><Checkbox /> Por tipo de imóvel</label>
                                        <label className="flex items-start gap-2 text-sm"><Checkbox /> Permite baixar imagens limpas</label>
                                        <label className="flex items-start gap-2 text-sm"><Checkbox /> Visualizar seus imóveis</label>
                                        <label className="flex items-start gap-2 text-sm"><Checkbox /> Visualizar imóveis que o time captou</label>
                                        <label className="flex items-start gap-2 text-sm"><Checkbox /> Visualizar todos os imóveis</label>
                                        <label className="flex items-start gap-2 text-sm"><Checkbox /> Visualizar proprietários dos seus imóveis</label>
                                        <label className="flex items-start gap-2 text-sm"><Checkbox /> Visualizar proprietários dos imóveis do próprio time</label>
                                        <label className="flex items-start gap-2 text-sm"><Checkbox /> Visualizar proprietários de todos os imóveis</label>
                                        <label className="flex items-start gap-2 text-sm"><Checkbox /> Visualizar endereço de todos os imóveis do próprio time</label>
                                        <label className="flex items-start gap-2 text-sm"><Checkbox /> Visualizar endereço de todos os imóveis</label>
                                        <label className="flex items-start gap-2 text-sm"><Checkbox /> Cadastrar e editar seus imóveis</label>
                                        <label className="flex items-start gap-2 text-sm"><Checkbox /> Cadastrar e editar todos do próprio time</label>
                                        <label className="flex items-start gap-2 text-sm"><Checkbox /> Cadastrar e editar todos os imóveis</label>
                                        <label className="flex items-start gap-2 text-sm"><Checkbox /> Remover seus imóveis</label>
                                        <label className="flex items-start gap-2 text-sm"><Checkbox /> Remover todos os imóveis do próprio time</label>
                                        <label className="flex items-start gap-2 text-sm"><Checkbox /> Remover todos os imóveis</label>
                                        <label className="flex items-start gap-2 text-sm"><Checkbox /> Mudar o captador dos imóveis editáveis</label>
                                        <label className="flex items-start gap-2 text-sm"><Checkbox /> Mudar o status dos imóveis editáveis</label>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="text-sm font-bold border-b pb-2 flex items-center gap-2"><Users className="w-4 h-4 text-muted-foreground"/> Clientes, Usuários e Equipes</h4>
                                        <label className="flex items-start gap-2 text-sm"><Checkbox /> Cadastrar e editar seus clientes e proprietários</label>
                                        <label className="flex items-start gap-2 text-sm"><Checkbox /> Gerar relatório de clientes</label>
                                        <label className="flex items-start gap-2 text-sm"><Checkbox /> Cadastrar e editar os clientes da equipe</label>
                                        <label className="flex items-start gap-2 text-sm"><Checkbox /> Cadastrar e editar todos os clientes e proprietários</label>
                                        <label className="flex items-start gap-2 text-sm"><Checkbox /> Cadastrar e editar usuários e equipes</label>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="text-sm font-bold border-b pb-2 flex items-center gap-2"><FileText className="w-4 h-4 text-muted-foreground"/> Outros</h4>
                                        <label className="flex items-start gap-2 text-sm"><Checkbox /> Portais: Visualizar portais</label>
                                        <label className="flex items-start gap-2 text-sm"><Checkbox /> Imobiliária: Cadastrar e editar informações da imobiliária e filiais</label>
                                        <label className="flex items-start gap-2 text-sm"><Checkbox /> Inteligência: Visualizar dados de inteligência</label>
                                        <label className="flex items-start gap-2 text-sm"><Checkbox /> Empreendimentos: Visualizar empreendimentos e condomínios</label>
                                        <label className="flex items-start gap-2 text-sm"><Checkbox /> Empreendimentos: Administrar empreendimentos e condomínios</label>
                                        <label className="flex items-start gap-2 text-sm"><Checkbox /> Website: Editar informações do website</label>
                                        <label className="flex items-start gap-2 text-sm"><Checkbox /> Marketing: Cadastrar valores investidos em fontes de leads</label>
                                    </div>
                                    <div className="pb-10"></div>
                                </TabsContent>

                                <TabsContent value="tokens" className="py-6 space-y-6 mt-0">
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-800">Token de Acesso (API)</h4>
                                                <p className="text-xs text-slate-500">Token gerado para integrações externas deste usuário.</p>
                                            </div>
                                            <Button size="sm" variant="outline"><Key className="w-4 h-4 mr-2" /> Gerar Token</Button>
                                        </div>
                                        <div className="flex gap-2">
                                            <Input readOnly value="user-token:5533cf9f43ecf073f8bfc5d1108b042c17e66c04084d539dc98d778e5819c83f" className="font-mono text-[10px] bg-white h-9" />
                                            <Button variant="secondary" size="sm" className="h-9 px-3" onClick={() => {
                                                navigator.clipboard.writeText("user-token:5533cf9f43ecf073f8bfc5d1108b042c17e66c04084d539dc98d778e5819c83f");
                                                toast({title: 'Copiado', description: 'Token copiado com sucesso.', variant: 'success'});
                                            }}>
                                                <Copy className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <div className="flex gap-2 justify-end">
                                            <Button variant="outline" size="sm" className="text-amber-600 h-8 text-xs">Desativar</Button>
                                            <Button variant="outline" size="sm" className="text-red-600 h-8 text-xs"><Trash2 className="w-3 h-3 mr-1"/> Excluir</Button>
                                        </div>
                                    </div>
                                </TabsContent>
                            </>
                        )}
                    </ScrollArea>
                </Tabs>
            </SheetContent>
        </Sheet>
    );
}
