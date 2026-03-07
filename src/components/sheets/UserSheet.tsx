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
import {
    Mail, Briefcase, Shield, CheckCircle2, XCircle, Edit2, Save,
    Trash2, X, Crown, Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Usuario {
    id: string;
    nome: string;
    email: string;
    cargo: string;
    nivel: string;
    status: string;
}

interface UserSheetProps {
    usuario: Usuario | null;
    open: boolean;
    onClose: () => void;
    onSave: (u: Usuario) => void;
    onDelete: (u: Usuario) => void;
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
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState<Usuario | null>(null);

    useEffect(() => {
        setForm(usuario ? { ...usuario } : null);
        setIsEditing(false);
    }, [usuario]);

    if (!usuario || !form) return null;

    const initials = usuario.nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    const handleSave = () => {
        if (form) { onSave(form); setIsEditing(false); }
    };

    const handleDiscard = () => {
        setForm({ ...usuario });
        setIsEditing(false);
    };

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent className="w-full sm:max-w-[480px] p-0 flex flex-col overflow-hidden" side="right">
                {/* Header */}
                <div className="relative bg-gradient-to-br from-violet-600/80 to-violet-500 h-36 shrink-0">
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
                    >
                        <X className="h-4 w-4" />
                    </button>
                    {usuario.nivel === 'Admin' && (
                        <div className="absolute top-3 left-4 flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1">
                            <Crown className="h-3.5 w-3.5 text-amber-300" />
                            <span className="text-white text-xs font-bold">Administrador</span>
                        </div>
                    )}
                    <div className="absolute -bottom-10 left-6">
                        <Avatar className="h-20 w-20 border-4 border-background shadow-xl">
                            <AvatarFallback className="bg-violet-100 text-violet-700 text-xl font-black dark:bg-violet-900/50 dark:text-violet-300">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                {/* Identity */}
                <div className="pt-14 px-6 pb-4 shrink-0">
                    <SheetHeader className="text-left">
                        <SheetTitle className="text-2xl font-black tracking-tight">{usuario.nome}</SheetTitle>
                        <SheetDescription className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold', nivelStyle(usuario.nivel))}>
                                {usuario.nivel === 'Admin' && <Crown className="h-3 w-3" />}
                                {usuario.nivel}
                            </span>
                            <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold', statusStyle(usuario.status))}>
                                {usuario.status === 'Ativo'
                                    ? <><CheckCircle2 className="h-3 w-3 mr-1" />Ativo</>
                                    : <><XCircle className="h-3 w-3 mr-1" />Inativo</>
                                }
                            </span>
                        </SheetDescription>
                    </SheetHeader>
                </div>

                <Separator />

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                    {isEditing ? (
                        <div className="space-y-4">
                            <SectionLabel>Editando informações</SectionLabel>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Nome completo</Label>
                                <Input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">E-mail</Label>
                                <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cargo</Label>
                                <Input value={form.cargo} onChange={e => setForm({ ...form, cargo: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Nível de acesso</Label>
                                    <Select value={form.nivel} onValueChange={v => setForm({ ...form, nivel: v })}>
                                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Admin">
                                                <div className="flex items-center gap-1.5"><Crown className="h-3.5 w-3.5 text-amber-500" /> Admin</div>
                                            </SelectItem>
                                            <SelectItem value="Normal">Normal</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</Label>
                                    <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Ativo">Ativo</SelectItem>
                                            <SelectItem value="Inativo">Inativo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            <SectionLabel>Informações do usuário</SectionLabel>

                            <InfoRow icon={Mail} label="E-mail" value={usuario.email} />
                            <InfoRow icon={Briefcase} label="Cargo" value={usuario.cargo} />

                            <Separator />
                            <SectionLabel>Permissões e acesso</SectionLabel>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-xl bg-muted/30 border border-border/40 flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-lg bg-background flex items-center justify-center shadow-sm shrink-0">
                                        <Shield className="h-4 w-4 text-violet-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Nível</p>
                                        <p className="font-bold text-sm">{usuario.nivel}</p>
                                    </div>
                                </div>
                                <div className="p-3 rounded-xl bg-muted/30 border border-border/40 flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-lg bg-background flex items-center justify-center shadow-sm shrink-0">
                                        {usuario.status === 'Ativo'
                                            ? <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                            : <XCircle className="h-4 w-4 text-destructive" />
                                        }
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Acesso</p>
                                        <p className="font-bold text-sm">{usuario.status === 'Ativo' ? 'Permitido' : 'Bloqueado'}</p>
                                    </div>
                                </div>
                            </div>

                            {usuario.nivel === 'Admin' && (
                                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-800/40 flex items-start gap-3">
                                    <Crown className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-bold text-amber-900 dark:text-amber-300">Administrador do sistema</p>
                                        <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">Acesso completo a todas as funções e configurações.</p>
                                    </div>
                                </div>
                            )}

                            <Separator />
                            <SectionLabel>Atividade</SectionLabel>

                            <div className="p-3 rounded-xl bg-muted/30 border border-border/40 flex items-center gap-3">
                                <div className="h-9 w-9 rounded-lg bg-background flex items-center justify-center shadow-sm shrink-0">
                                    <Star className="h-4 w-4 text-primary/70" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Leads atribuídos</p>
                                    <p className="font-bold text-sm">—</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="shrink-0 border-t bg-muted/20 px-6 py-4">
                    {isEditing ? (
                        <div className="flex gap-3">
                            <Button className="flex-1 gap-2 shadow-lg shadow-primary/20" onClick={handleSave}>
                                <Save className="h-4 w-4" /> Salvar
                            </Button>
                            <Button variant="outline" className="flex-1" onClick={handleDiscard}>Descartar</Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-2">
                            <Button size="sm" className="gap-1.5 text-xs font-semibold col-span-1 shadow-sm" onClick={() => setIsEditing(true)}>
                                <Edit2 className="h-3.5 w-3.5" /> Editar
                            </Button>
                            <Button size="sm" variant="destructive" className="gap-1.5 text-xs font-semibold col-span-1" onClick={() => onDelete(usuario)}>
                                <Trash2 className="h-3.5 w-3.5" /> Excluir
                            </Button>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <span className="w-4 h-[2px] bg-primary inline-block" /> {children}
        </p>
    );
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
    return (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-border/30 hover:border-border/60 transition-colors">
            <div className="h-8 w-8 rounded-lg bg-background flex items-center justify-center shrink-0 shadow-sm">
                <Icon className="h-4 w-4 text-primary/70" />
            </div>
            <div className="min-w-0">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
                <p className="text-sm font-semibold truncate">{value || '—'}</p>
            </div>
        </div>
    );
}
