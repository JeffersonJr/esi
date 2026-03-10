import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import {
    Edit, MapPin, Bed, Bath, Maximize, Home, Building,
    Settings, FileText, Globe, CreditCard, User, Phone,
    Mail, Share2, Heart, ChevronLeft, ChevronRight, TrendingUp,
    Download, Printer, MessageCircle, Calendar, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ImovelDetailsDrawerProps {
    imovel: any;
    open: boolean;
    onClose: () => void;
    onEdit: () => void;
}

export function ImovelDetailsDrawer({ imovel, open, onClose, onEdit }: ImovelDetailsDrawerProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!imovel) return null;

    const handlePreviousImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? (imovel.imagens?.length || 1) - 1 : prev - 1
        );
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === (imovel.imagens?.length || 1) - 1 ? 0 : prev + 1
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Disponível':
                return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300';
            case 'Reservado':
                return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300';
            case 'Vendido':
                return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
            default:
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300';
        }
    };

    const imovelImages = imovel.imagens || [imovel.imagem];

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent side="right" className="sm:max-w-2xl w-full p-0 flex flex-col overflow-hidden">
                <SheetHeader className="p-6 border-b shrink-0 bg-background/95 backdrop-blur-sm sticky top-0 z-10">
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-3">
                                <SheetTitle className="text-xl font-black tracking-tight">{imovel.titulo}</SheetTitle>
                                <Badge variant="outline" className={cn("font-bold text-[10px] uppercase border-none", getStatusColor(imovel.status))}>
                                    {imovel.status}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">REF: {imovel.id || '---'}</span>
                                <span className="text-[10px] text-muted-foreground/30">|</span>
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">{imovel.tipo}</span>
                            </div>
                        </div>
                    </div>
                </SheetHeader>

                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-8 pb-20">
                        {/* Gallery */}
                        <div className="space-y-4">
                            <div className="relative group">
                                <div className="aspect-video overflow-hidden rounded-2xl shadow-lg bg-muted">
                                    <AnimatePresence mode="wait">
                                        <motion.img
                                            key={currentImageIndex}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            src={imovelImages[currentImageIndex]}
                                            alt={imovel.titulo}
                                            className="w-full h-full object-cover"
                                        />
                                    </AnimatePresence>
                                </div>

                                {imovelImages.length > 1 && (
                                    <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            onClick={(e) => { e.stopPropagation(); handlePreviousImage(); }}
                                            className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-md shadow-lg"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                                            className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-md shadow-lg"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}

                                <div className="absolute bottom-3 left-3">
                                    <Badge className="bg-black/60 text-white border-none font-bold text-[9px] uppercase">
                                        {currentImageIndex + 1} / {imovelImages.length} Fotos
                                    </Badge>
                                </div>
                            </div>

                            {imovelImages.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                                    {imovelImages.map((img: string, idx: number) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={cn(
                                                "w-20 aspect-video rounded-lg overflow-hidden shrink-0 border-2 transition-all",
                                                idx === currentImageIndex ? "border-primary" : "border-transparent opacity-60"
                                            )}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Price & Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10">
                                <div className="text-[10px] font-black uppercase tracking-wider text-primary/60 mb-1">Valor Pedido</div>
                                <div className="text-2xl font-black tracking-tight text-primary">{imovel.valor}</div>
                                {imovel.valorAluguel && (
                                    <div className="text-xs font-bold text-primary/70">{imovel.valorAluguel}/mês</div>
                                )}
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-muted/30 border border-border/40">
                                    <Bed className="h-4 w-4 text-muted-foreground mb-1" />
                                    <span className="text-sm font-black">{imovel.quartos || '—'}</span>
                                    <span className="text-[8px] font-bold text-muted-foreground uppercase">Quartos</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-muted/30 border border-border/40">
                                    <Bath className="h-4 w-4 text-muted-foreground mb-1" />
                                    <span className="text-sm font-black">{imovel.banheiros || '—'}</span>
                                    <span className="text-[8px] font-bold text-muted-foreground uppercase">Banh.</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-muted/30 border border-border/40">
                                    <Maximize className="h-4 w-4 text-muted-foreground mb-1" />
                                    <span className="text-sm font-black">{imovel.area || '—'}</span>
                                    <span className="text-[8px] font-bold text-muted-foreground uppercase">Área</span>
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
                                <MapPin className="h-3.5 w-3.5 text-primary" /> Endereço
                            </h3>
                            <p className="text-sm font-medium text-foreground bg-muted/30 p-4 rounded-xl border border-border/40">
                                {imovel.endereco}
                            </p>
                        </div>

                        {/* Description */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
                                <FileText className="h-3.5 w-3.5 text-primary" /> Descrição
                            </h3>
                            <p className="text-sm leading-relaxed text-muted-foreground font-medium">
                                {imovel.descricao}
                            </p>
                        </div>

                        {/* Features */}
                        {imovel.caracteristicas && imovel.caracteristicas.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
                                    <Settings className="h-3.5 w-3.5 text-primary" /> Diferenciais
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {imovel.caracteristicas.map((c: string) => (
                                        <Badge key={c} variant="secondary" className="bg-primary/5 text-primary-700 dark:text-primary-300 font-bold text-[10px] uppercase border-none px-3 py-1.5">
                                            {c}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Owner/Captador Info */}
                        <div className="p-6 rounded-2xl border-2 border-dashed border-border bg-muted/10">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black uppercase text-muted-foreground">Proprietário</div>
                                    <div className="text-sm font-black">{imovel.proprietario || '—'}</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="outline" size="sm" className="h-10 gap-2 text-[10px] font-black uppercase">
                                    <Phone className="h-3.5 w-3.5" /> Ligar
                                </Button>
                                <Button variant="outline" size="sm" className="h-10 gap-2 text-[10px] font-black uppercase">
                                    <Mail className="h-3.5 w-3.5" /> E-mail
                                </Button>
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <SheetFooter className="p-6 border-t bg-muted/20 gap-3">
                    <Button variant="outline" className="flex-1 h-12 uppercase font-black text-[10px] tracking-widest gap-2" onClick={onClose}>
                        Fechar
                    </Button>
                    <Button className="flex-1 h-12 uppercase font-black text-[10px] tracking-widest gap-2 shadow-lg" onClick={onEdit}>
                        <Edit className="h-4 w-4" /> Editar Imóvel
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
