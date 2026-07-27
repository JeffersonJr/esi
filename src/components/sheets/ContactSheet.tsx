import { useState, useEffect } from 'react';
import {
    Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
    Mail, Phone, MapPin, Briefcase, Edit2, Save, X, Trash2,
    User, Building, CheckCircle, ExternalLink, MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Contato {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    tipo: string;
    interesse: string;
    cidade: string;
    status: string;
}

interface ContactSheetProps {
    contato: Contato | null;
    open: boolean;
    onClose: () => void;
    onSave: (contato: Contato) => void;
    onDelete: (contato: Contato) => void;
    onViewProfile: (contato: Contato) => void;
}

const statusStyle = (s: string) =>
    s === 'Ativo' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' :
        s === 'Em negociação' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' :
            'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';

const tipoStyle = (t: string) =>
    t === 'Cliente' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' :
        'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300';

export function ContactSheet({ contato, open, onClose, onSave, onDelete, onViewProfile }: ContactSheetProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState<Contato | null>(null);

    useEffect(() => {
        setForm(contato ? { ...contato } : null);
        setIsEditing(false);
    }, [contato]);

    if (!contato || !form) return null;

    const initials = contato.nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    const handleSave = () => {
        if (form) { onSave(form); setIsEditing(false); }
    };

    const handleDiscard = () => {
        setForm({ ...contato });
        setIsEditing(false);
    };

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent className="w-full sm:max-w-[480px] p-0 flex flex-col overflow-hidden" side="right">
                {/* Colour-accent header */}
                <div className="relative bg-gradient-to-br from-primary/80 to-primary h-36 shrink-0">
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
                    >
                        <X className="h-4 w-4" />
                    </button>
                    <div className="absolute -bottom-10 left-6">
                        <Avatar className="h-20 w-20 border-4 border-background shadow-xl">
                            <AvatarFallback className="bg-primary/20 text-primary text-xl font-semibold">{initials}</AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                {/* Identity row */}
                <div className="pt-14 px-6 pb-4 shrink-0">
                    <SheetHeader className="text-left">
                        <SheetTitle className="text-2xl font-semibold tracking-tight leading-tight">{contato.nome}</SheetTitle>
                        <SheetDescription className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold', tipoStyle(contato.tipo))}>
                                {contato.tipo === 'Cliente' ? <User className="h-3 w-3 mr-1" /> : <Building className="h-3 w-3 mr-1" />}
                                {contato.tipo}
                            </span>
                            <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold', statusStyle(contato.status))}>
                                {contato.status}
                            </span>
                        </SheetDescription>
                    </SheetHeader>

                    {/* Quick actions */}
                    <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" className="gap-1.5 flex-1 h-9 text-xs font-semibold" onClick={() => window.open(`mailto:${contato.email}`)}>
                            <Mail className="h-3.5 w-3.5" /> E-mail
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1.5 flex-1 h-9 text-xs font-semibold" onClick={() => window.open(`tel:${contato.telefone}`)}>
                            <Phone className="h-3.5 w-3.5" /> Ligar
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1.5 flex-1 h-9 text-xs font-semibold text-emerald-700 border-emerald-200 hover:bg-emerald-50" onClick={() => window.open(`https://wa.me/${contato.telefone.replace(/\D/g, '')}`)}>
                            <MessageSquare className="h-3.5 w-3.5" /> WhatsApp
                        </Button>
                    </div>
                </div>

                <Separator />

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                    {isEditing ? (
                        /* ── EDIT MODE ── */
                        <div className="space-y-4">
                            <p className="text-[10px] font-semibold tracking-tight text-muted-foreground flex items-center gap-2">
                                <span className="w-4 h-[2px] bg-primary inline-block" /> Editando informações
                            </p>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-muted-foreground ">Nome</Label>
                                <Input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-muted-foreground ">E-mail</Label>
                                    <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-muted-foreground ">Telefone</Label>
                                    <Input value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-muted-foreground ">Tipo</Label>
                                    <Select value={form.tipo} onValueChange={v => setForm({ ...form, tipo: v })}>
                                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Cliente">Cliente</SelectItem>
                                            <SelectItem value="Proprietário">Proprietário</SelectItem>
                                            <SelectItem value="Ambos">Ambos</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-muted-foreground ">Status</Label>
                                    <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Ativo">Ativo</SelectItem>
                                            <SelectItem value="Em negociação">Em negociação</SelectItem>
                                            <SelectItem value="Inativo">Inativo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-muted-foreground ">Interesse</Label>
                                    <Input value={form.interesse} onChange={e => setForm({ ...form, interesse: e.target.value })} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-muted-foreground ">Cidade</Label>
                                    <Input value={form.cidade} onChange={e => setForm({ ...form, cidade: e.target.value })} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* ── VIEW MODE ── */
                        <div className="space-y-5">
                            <p className="text-[10px] font-semibold tracking-tight text-muted-foreground flex items-center gap-2">
                                <span className="w-4 h-[2px] bg-primary inline-block" /> Informações de contato
                            </p>

                            <InfoRow icon={Mail} label="E-mail" value={contato.email} />
                            <InfoRow icon={Phone} label="Telefone" value={contato.telefone} />
                            <InfoRow icon={MapPin} label="Cidade" value={contato.cidade} />
                            <InfoRow icon={Briefcase} label="Interesse" value={contato.interesse} />

                            <Separator />
                            <p className="text-[10px] font-semibold tracking-tight text-muted-foreground flex items-center gap-2">
                                <span className="w-4 h-[2px] bg-primary inline-block" /> Classificação
                            </p>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-xl bg-muted/30 border border-border/40">
                                    <p className="text-[10px] font-semibold text-muted-foreground  mb-1">Tipo</p>
                                    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold', tipoStyle(contato.tipo))}>{contato.tipo}</span>
                                </div>
                                <div className="p-3 rounded-xl bg-muted/30 border border-border/40">
                                    <p className="text-[10px] font-semibold text-muted-foreground  mb-1">Status</p>
                                    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold', statusStyle(contato.status))}>{contato.status}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer action bar */}
                <div className="shrink-0 border-t bg-muted/20 px-6 py-4">
                    {isEditing ? (
                        <div className="flex gap-3">
                            <Button className="flex-1 gap-2 shadow-lg shadow-primary/20" onClick={handleSave}>
                                <Save className="h-4 w-4" /> Salvar
                            </Button>
                            <Button variant="outline" className="flex-1" onClick={handleDiscard}>Descartar</Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-2">
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold col-span-1" onClick={() => onViewProfile(contato)}>
                                <ExternalLink className="h-3.5 w-3.5" /> Perfil
                            </Button>
                            <Button size="sm" className="gap-1.5 text-xs font-semibold col-span-1 shadow-sm" onClick={() => setIsEditing(true)}>
                                <Edit2 className="h-3.5 w-3.5" /> Editar
                            </Button>
                            <Button size="sm" variant="destructive" className="gap-1.5 text-xs font-semibold col-span-1" onClick={() => onDelete(contato)}>
                                <Trash2 className="h-3.5 w-3.5" /> Excluir
                            </Button>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
    return (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-border/30 hover:border-border/60 transition-colors">
            <div className="h-8 w-8 rounded-lg bg-background flex items-center justify-center shrink-0 shadow-sm">
                <Icon className="h-4 w-4 text-primary/70" />
            </div>
            <div className="min-w-0">
                <p className="text-[10px] font-semibold text-muted-foreground ">{label}</p>
                <p className="text-sm font-semibold truncate">{value || '—'}</p>
            </div>
        </div>
    );
}
