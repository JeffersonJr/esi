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
import { Users, Edit2, Save, Trash2, X, UserPlus, UserMinus, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Equipe {
    id: string;
    nome: string;
    descricao: string;
    membros: string[];
    cor: string;
}

interface EquipeSheetProps {
    equipe: Equipe | null;
    open: boolean;
    allUsers: string[];
    onClose: () => void;
    onSave: (e: Equipe) => void;
    onDelete: (e: Equipe) => void;
}

const corBgSolid: Record<string, string> = {
    'bg-primary': 'bg-blue-600',
    'bg-accent': 'bg-violet-600',
    'bg-warning': 'bg-amber-500',
    'bg-success': 'bg-emerald-600',
};
const corLabel: Record<string, string> = {
    'bg-primary': 'Azul', 'bg-accent': 'Roxo', 'bg-warning': 'Laranja', 'bg-success': 'Verde',
};
const corGradient: Record<string, string> = {
    'bg-primary': 'from-blue-600/80 to-blue-500',
    'bg-accent': 'from-violet-600/80 to-violet-500',
    'bg-warning': 'from-amber-500/80 to-amber-400',
    'bg-success': 'from-emerald-600/80 to-emerald-500',
};

export function EquipeSheet({ equipe, open, allUsers, onClose, onSave, onDelete }: EquipeSheetProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState<Equipe | null>(null);

    useEffect(() => {
        setForm(equipe ? { ...equipe, membros: [...(equipe.membros ?? [])] } : null);
        setIsEditing(false);
    }, [equipe]);

    if (!equipe || !form) return null;

    const gradient = corGradient[equipe.cor] || 'from-blue-600/80 to-blue-500';
    const solid = corBgSolid[equipe.cor] || 'bg-blue-600';

    const handleSave = () => {
        if (form) { onSave(form); setIsEditing(false); }
    };
    const handleDiscard = () => {
        setForm({ ...equipe, membros: [...equipe.membros] });
        setIsEditing(false);
    };

    const toggleMember = (user: string) => {
        setForm(f => {
            if (!f) return f;
            return f.membros.includes(user)
                ? { ...f, membros: f.membros.filter(m => m !== user) }
                : { ...f, membros: [...f.membros, user] };
        });
    };

    const COLOR_OPTIONS = ['bg-primary', 'bg-accent', 'bg-warning', 'bg-success'];

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent className="w-full sm:max-w-[480px] p-0 flex flex-col overflow-hidden" side="right">
                {/* Colour-themed header */}
                <div className={cn('relative bg-gradient-to-br h-36 shrink-0', gradient)}>
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
                    >
                        <X className="h-4 w-4" />
                    </button>
                    <div className="absolute -bottom-8 left-6">
                        <div className={cn('h-16 w-16 rounded-2xl flex items-center justify-center border-4 border-background shadow-xl', solid)}>
                            <Users className="h-8 w-8 text-white" />
                        </div>
                    </div>
                </div>

                {/* Identity */}
                <div className="pt-12 px-6 pb-4 shrink-0">
                    <SheetHeader className="text-left">
                        <SheetTitle className="text-2xl font-black tracking-tight">{equipe.nome}</SheetTitle>
                        <SheetDescription className="mt-1 flex items-center gap-2 flex-wrap">
                            <span className="text-sm text-muted-foreground line-clamp-2">{equipe.descricao}</span>
                        </SheetDescription>
                    </SheetHeader>

                    {/* Stats row */}
                    <div className="flex gap-2 mt-4">
                        <div className="flex-1 flex items-center gap-2 p-2.5 rounded-xl bg-muted/30 border border-border/30">
                            <Users className="h-4 w-4 text-primary/70 shrink-0" />
                            <div>
                                <p className="text-xs font-black leading-none">{equipe.membros.length}</p>
                                <p className="text-[10px] text-muted-foreground">Membros</p>
                            </div>
                        </div>
                        <div className="flex-1 flex items-center gap-2 p-2.5 rounded-xl bg-muted/30 border border-border/30">
                            <Hash className="h-4 w-4 text-primary/70 shrink-0" />
                            <div>
                                <p className="text-xs font-black leading-none">{corLabel[equipe.cor] || '—'}</p>
                                <p className="text-[10px] text-muted-foreground">Cor</p>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                    {isEditing ? (
                        <div className="space-y-4">
                            <SectionLabel>Editando equipe</SectionLabel>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Nome da equipe</Label>
                                <Input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Descrição</Label>
                                <Input value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cor identificadora</Label>
                                <div className="flex gap-2">
                                    {COLOR_OPTIONS.map(cor => (
                                        <button
                                            key={cor}
                                            onClick={() => setForm({ ...form, cor })}
                                            className={cn(
                                                'h-9 flex-1 rounded-lg border-2 transition-all flex items-center justify-center',
                                                corBgSolid[cor] || '',
                                                form.cor === cor ? 'border-foreground scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                                            )}
                                            title={corLabel[cor]}
                                        />
                                    ))}
                                </div>
                            </div>

                            <Separator />
                            <SectionLabel>Gerenciar membros</SectionLabel>

                            <div className="space-y-2">
                                {allUsers.map(user => {
                                    const isMember = form.membros.includes(user);
                                    const initials = user.split(' ').map(n => n[0]).join('').slice(0, 2);
                                    return (
                                        <div key={user} className={cn(
                                            'flex items-center gap-3 p-3 rounded-xl border transition-all',
                                            isMember ? 'bg-primary/5 border-primary/20' : 'bg-muted/20 border-border/30'
                                        )}>
                                            <Avatar className="h-8 w-8 shrink-0">
                                                <AvatarFallback className={cn('text-xs font-bold', isMember ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground')}>
                                                    {initials}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className={cn('flex-1 text-sm font-semibold', isMember ? 'text-foreground' : 'text-muted-foreground')}>
                                                {user}
                                            </span>
                                            <Button
                                                size="sm"
                                                variant={isMember ? 'default' : 'outline'}
                                                className={cn('h-7 px-2 text-[11px] gap-1', isMember ? 'bg-primary/10 text-primary hover:bg-destructive/10 hover:text-destructive border-primary/20' : 'border-dashed')}
                                                onClick={() => toggleMember(user)}
                                            >
                                                {isMember ? <><UserMinus className="h-3 w-3" /> Remover</> : <><UserPlus className="h-3 w-3" /> Adicionar</>}
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            <SectionLabel>Membros da equipe ({equipe.membros.length})</SectionLabel>

                            {equipe.membros.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
                                    <p className="text-sm font-medium">Nenhum membro ainda</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {equipe.membros.map((membro, idx) => {
                                        const initials = membro.split(' ').map(n => n[0]).join('').slice(0, 2);
                                        return (
                                            <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-border/30 hover:border-border/60 transition-colors">
                                                <Avatar className="h-9 w-9 shrink-0">
                                                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">{initials}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold truncate">{membro}</p>
                                                    <p className="text-[10px] text-muted-foreground font-medium">Corretor</p>
                                                </div>
                                                <div className={cn('h-2 w-2 rounded-full shrink-0', solid)} />
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
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
                            <Button size="sm" className="gap-1.5 text-xs font-semibold shadow-sm" onClick={() => setIsEditing(true)}>
                                <Edit2 className="h-3.5 w-3.5" /> Editar Equipe
                            </Button>
                            <Button size="sm" variant="destructive" className="gap-1.5 text-xs font-semibold" onClick={() => onDelete(equipe)}>
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
