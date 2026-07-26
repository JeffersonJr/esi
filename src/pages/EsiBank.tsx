import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, ChevronRight, CreditCard, Send, HandCoins, QrCode, Receipt, TrendingUp, ArrowDownRight, ArrowUpRight, User, X, Search, FileText, Copy, CheckCircle2, ChevronLeft } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const quickActions = [
  { id: 'pix', icon: <QrCode className="h-6 w-6" />, label: 'Área Pix' },
  { id: 'pay', icon: <Receipt className="h-6 w-6" />, label: 'Pagar' },
  { id: 'transfer', icon: <Send className="h-6 w-6" />, label: 'Transferir' },
  { id: 'charge', icon: <HandCoins className="h-6 w-6" />, label: 'Cobrar' },
  { id: 'deposit', icon: <ArrowDownRight className="h-6 w-6" />, label: 'Depositar' },
];

const transacoesOriginais = [
  { id: '1', titulo: 'Transferência recebida', descricao: 'Aluguel Av. Paulista', valor: 2500.00, tipo: 'entrada', data: 'Hoje', icone: <ArrowDownRight className="h-4 w-4 text-emerald-400" /> },
  { id: '2', titulo: 'Pagamento de boleto', descricao: 'Condomínio', valor: 850.00, tipo: 'saida', data: 'Ontem', icone: <Receipt className="h-4 w-4 text-zinc-400" /> },
  { id: '3', titulo: 'Pagamento de fatura', descricao: 'Cartão de crédito esi.bank', valor: 3450.00, tipo: 'saida', data: '15 Fev', icone: <CreditCard className="h-4 w-4 text-zinc-400" /> },
  { id: '4', titulo: 'Pix enviado', descricao: 'João Silva', valor: 150.00, tipo: 'saida', data: '12 Fev', icone: <ArrowUpRight className="h-4 w-4 text-zinc-400" /> },
  { id: '5', titulo: 'Comissão de venda', descricao: 'Imóvel Jardins', valor: 15000.00, tipo: 'entrada', data: '05 Fev', icone: <TrendingUp className="h-4 w-4 text-emerald-400" /> },
];

const transactionsCard = [
  { id: 'c1', titulo: 'Uber', descricao: 'Transporte', valor: 45.90, data: 'Hoje' },
  { id: 'c2', titulo: 'Ifood', descricao: 'Alimentação', valor: 112.50, data: 'Ontem' },
  { id: 'c3', titulo: 'Amazon', descricao: 'Eletrônicos', valor: 599.00, data: '18 Fev' },
  { id: 'c4', titulo: 'Netflix', descricao: 'Assinaturas', valor: 55.90, data: '15 Fev' },
];

type ActiveViewType = 'home' | 'pix' | 'pay' | 'transfer' | 'charge' | 'deposit' | 'card' | 'loan' | 'history';
type FlowStep = 'menu' | 'input' | 'confirm' | 'success';

const formatCurrency = (val: number) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
const formatCPF = (cpf: string) => `***.${cpf.substring(3, 6)}.${cpf.substring(6, 9)}-**`;
const formatBoletoMask = (val: string) => val.replace(/\D/g, '').substring(0, 54);

const SlideUpPanel = ({ id, title, children, open, onHeaderAction, headerIcon }: { id: string, title?: string, children: React.ReactNode, open: boolean, onHeaderAction?: () => void, headerIcon?: React.ReactNode }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key={`panel-${id}`}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute inset-0 bg-zinc-950 z-50 flex flex-col h-full overflow-hidden text-zinc-100"
        >
          {title && (
            <div className="h-16 border-b border-zinc-800/50 flex items-center px-4 shrink-0 bg-zinc-950/80 backdrop-blur-xl z-10 pt-safe">
              <Button variant="ghost" size="icon" onClick={onHeaderAction} className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 mr-2 -ml-2 rounded-full transition-colors">
                {headerIcon || <X className="h-6 w-6" />}
              </Button>
              <div className="font-bold text-zinc-100 text-lg flex-1 truncate">{title}</div>
            </div>
          )}
          <div className="flex-1 overflow-y-auto w-full no-scrollbar pb-safe">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const SuccessState = ({ title, subtitle, amount, onClose }: { title: string, subtitle: string, amount?: string, onClose: () => void }) => (
  <div className="p-8 flex flex-col items-center justify-center text-center h-full min-h-[400px] space-y-6">
    <motion.div 
      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}
      className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mb-2 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
    >
      <CheckCircle2 className="h-12 w-12" />
    </motion.div>
    <div className="space-y-2">
      <h2 className="text-3xl font-black text-white">{title}</h2>
      <p className="text-zinc-400 text-lg">{subtitle}</p>
      {amount && (
        <div className="text-4xl font-black text-emerald-400 pt-4 drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]">{amount}</div>
      )}
    </div>
    <div className="pt-8 w-full space-y-3">
      <Button variant="outline" className="w-full h-14 rounded-2xl font-bold text-emerald-400 border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors">Ver comprovante</Button>
      <Button variant="ghost" className="w-full h-14 rounded-2xl font-bold text-zinc-400 hover:text-white hover:bg-zinc-800" onClick={onClose}>Voltar ao início</Button>
    </div>
  </div>
);

export function EsiBank() {
  const { toast } = useToast();
  const [showBalance, setShowBalance] = useState(false);
  const [activeView, setActiveView] = useState<ActiveViewType>('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [historyFilter, setHistoryFilter] = useState<'all' | 'in' | 'out'>('all');
  const [flowStep, setFlowStep] = useState<FlowStep>('menu');
  const [flowData, setFlowData] = useState<any>({});
  const [inputValue, setInputValue] = useState('');

  const filteredTransacoes = transacoesOriginais.filter(t => {
    if (historyFilter === 'in' && t.tipo !== 'entrada') return false;
    if (historyFilter === 'out' && t.tipo !== 'saida') return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return t.titulo.toLowerCase().includes(q) || t.descricao.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado!", description: "Chave PIX copiada para a área de transferência.", duration: 2000 });
  };

  const closeView = () => {
    setActiveView('home');
    setTimeout(() => { setFlowStep('menu'); setFlowData({}); setInputValue(''); }, 300);
  };

  const goBackStep = () => {
    if (flowStep === 'success') return closeView();
    if (flowStep === 'confirm') setFlowStep('input');
    else if (flowStep === 'input') setFlowStep('menu');
  };

  const showBack = flowStep !== 'menu' && flowStep !== 'success';
  const headerAction = showBack ? goBackStep : closeView;
  const headerIcon = showBack ? <ChevronLeft className="h-6 w-6" /> : <X className="h-6 w-6" />;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center w-full pb-10">
      <div className="w-full max-w-[1600px] mb-4 sm:mb-6">
        <PageHeader title="Esi.bank" subtitle="Conta digital integrada" icon={<CreditCard />} breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Esi.bank' }]} />
      </div>

      <div className="w-full max-w-[420px] bg-zinc-950 shadow-2xl min-h-[850px] relative rounded-[2.5rem] border-[8px] border-zinc-900 overflow-hidden font-sans flex flex-col ring-1 ring-zinc-800">
        
        {/* Animated Background Mesh */}
        <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] opacity-40 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(16,185,129,0.15) 0%, transparent 60%)' }} />

        {/* --- HOME VIEW --- */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-20 z-10 relative">
          
          {/* HEADER / CONTA */}
          <div className="px-6 pt-10 pb-6 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-zinc-800/80 backdrop-blur-md flex items-center justify-center border border-zinc-700/50 shadow-lg">
                  <User className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs text-zinc-500 font-medium tracking-wider uppercase">esi.bank</div>
                  <div className="font-bold text-lg text-white leading-tight">Olá, Corretor</div>
                </div>
              </div>
              <button onClick={() => setShowBalance(!showBalance)} className="text-zinc-400 p-3 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 hover:bg-zinc-800 rounded-full transition-colors shadow-sm">
                {showBalance ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
            </div>

            <div className="space-y-2 cursor-pointer group mt-4 p-5 rounded-3xl bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 border border-zinc-800/50 backdrop-blur-xl shadow-xl relative overflow-hidden" onClick={() => setActiveView('history')}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
              <div className="flex items-center justify-between relative z-10">
                <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">Saldo Disponível</h2>
                <ChevronRight className="h-5 w-5 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
              </div>
              <div className="text-4xl font-black text-white tracking-tighter pt-1 relative z-10 drop-shadow-sm">
                {showBalance ? 'R$ 69.135,68' : 'R$ •••••••'}
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="overflow-x-auto pb-6 pt-2 -mx-2 px-6 no-scrollbar flex gap-4">
            {quickActions.map(action => (
              <div key={action.id} onClick={() => setActiveView(action.id as ActiveViewType)} className="flex flex-col items-center gap-3 cursor-pointer group shrink-0 w-[76px]">
                <div className="w-16 h-16 rounded-2xl bg-zinc-900/80 backdrop-blur-md border border-zinc-800/80 flex items-center justify-center text-zinc-300 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all shadow-lg">
                  {action.icon}
                </div>
                <div className="text-xs font-bold text-zinc-400 group-hover:text-zinc-200 text-center leading-tight transition-colors">
                  {action.label}
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 py-2">
            <Card className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 shadow-lg hover:bg-zinc-800/80 cursor-pointer transition-all rounded-2xl group" onClick={() => setActiveView('card')}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-zinc-800 p-2 rounded-xl group-hover:bg-emerald-500/20 transition-colors"><CreditCard className="h-5 w-5 text-zinc-300 group-hover:text-emerald-400" /></div>
                  <span className="font-bold text-sm text-zinc-200">Meus cartões</span>
                </div>
                <ChevronRight className="h-5 w-5 text-zinc-600 group-hover:text-zinc-400" />
              </CardContent>
            </Card>
          </div>

          <Separator className="my-6 h-px bg-zinc-800/50 border-none w-full" />

          {/* CREDIT CARD */}
          <div className="px-6 space-y-4 cursor-pointer group" onClick={() => setActiveView('card')}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-zinc-400" />
                <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-widest">Cartão de crédito</h2>
              </div>
              <ChevronRight className="h-5 w-5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-semibold text-rose-400 tracking-wider uppercase">Fatura fechada</div>
              <div className="text-3xl font-black text-white">
                {showBalance ? 'R$ 3.450,00' : 'R$ •••••••'}
              </div>
              <div className="text-sm text-zinc-500 font-medium">
                Vencimento <span className="font-bold text-zinc-300">05 MAR</span>
              </div>
            </div>
            <div className="pt-2">
              <Button size="sm" className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl px-6 font-bold text-xs h-10 w-fit transition-all shadow-sm" onClick={(e) => { e.stopPropagation(); setActiveView('card'); setFlowStep('confirm'); }}>
                Pagar fatura
              </Button>
            </div>
          </div>

          <Separator className="my-8 h-px bg-zinc-800/50 border-none w-full" />

          {/* LOANS */}
          <div className="px-6 space-y-4 cursor-pointer group mb-8" onClick={() => setActiveView('loan')}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-zinc-400" />
                <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-widest">Empréstimo</h2>
              </div>
              <ChevronRight className="h-5 w-5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
            </div>
            <div className="space-y-2">
              <div className="text-[15px] font-medium text-zinc-400 pr-4 leading-relaxed">
                Valor disponível de até <strong className="font-bold text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">R$ 50.000,00</strong>
              </div>
              <div className="text-xs text-zinc-500 font-medium">Faça uma simulação sem compromisso.</div>
            </div>
          </div>

          <Separator className="my-6 h-px bg-zinc-800/50 border-none w-full" />

          {/* TRANSACTIONS */}
          <div className="px-6 space-y-6 cursor-pointer group" onClick={() => setActiveView('history')}>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-widest">Histórico</h2>
              <ChevronRight className="h-5 w-5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
            </div>
            <div className="space-y-6 pt-2">
              {transacoesOriginais.slice(0, 3).map((t) => (
                <div key={t.id} className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center shrink-0 shadow-sm">
                    {t.icone}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <div className="font-bold text-zinc-100 text-[15px] leading-snug tracking-tight">{t.titulo}</div>
                      <div className="text-xs text-zinc-500 font-bold">{t.data}</div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="text-sm text-zinc-500 font-medium">{t.descricao}</div>
                      <div className={`text-sm font-black ${t.tipo === 'entrada' ? 'text-emerald-400' : 'text-zinc-300'}`}>
                        {t.tipo === 'entrada' ? '+ ' : ''} R$ {t.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- OVERLAY VIEWS --- */}

        {/* 1. PIX VIEW */}
        <SlideUpPanel id="pix" title="Área Pix" open={activeView === 'pix'} onHeaderAction={headerAction} headerIcon={headerIcon}>
          {flowStep === 'menu' && (
            <div className="p-6 space-y-8">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center gap-3 cursor-pointer group" onClick={() => { setFlowStep('input'); setFlowData({ type: 'pix-copy' }); }}>
                  <div className="w-16 h-16 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-zinc-300 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-all"><QrCode className="h-6 w-6" /></div>
                  <div className="text-xs font-bold text-zinc-400 text-center leading-tight">Pix Copia<br />e Cola</div>
                </div>
                <div className="flex flex-col items-center gap-3 cursor-pointer group" onClick={() => { setActiveView('transfer'); setFlowStep('input'); }}>
                  <div className="w-16 h-16 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-zinc-300 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-all"><Send className="h-6 w-6" /></div>
                  <div className="text-xs font-bold text-zinc-400 text-center">Transferir</div>
                </div>
                <div className="flex flex-col items-center gap-3 cursor-pointer group" onClick={() => { setActiveView('charge'); }}>
                  <div className="w-16 h-16 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-zinc-300 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-all"><HandCoins className="h-6 w-6" /></div>
                  <div className="text-xs font-bold text-zinc-400 text-center">Cobrar</div>
                </div>
              </div>

              <Separator className="bg-zinc-800/50" />

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Minhas chaves</h3>
                <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/80 flex justify-between items-center group hover:border-zinc-700 transition-colors">
                  <div>
                    <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">CPF</div>
                    <div className="text-sm font-semibold text-zinc-200">{formatCPF('12345678900')}</div>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800" onClick={() => handleCopy('12345678900')}><Copy className="h-5 w-5" /></Button>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/80 flex justify-between items-center group hover:border-zinc-700 transition-colors">
                  <div>
                    <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">E-mail</div>
                    <div className="text-sm font-semibold text-zinc-200">contato@imob.com.br</div>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800" onClick={() => handleCopy('contato@imob.com.br')}><Copy className="h-5 w-5" /></Button>
                </div>
              </div>
            </div>
          )}
          {flowStep === 'input' && (
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <Label className="text-lg font-bold text-white">Cole o código Pix ou chave</Label>
                <Input
                  placeholder="Cole aqui..."
                  className="h-14 bg-zinc-900/80 border-zinc-800 text-white rounded-xl focus:ring-emerald-500 focus:border-emerald-500"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  autoFocus
                />
              </div>
              <Button
                className="w-full h-14 rounded-2xl font-bold bg-emerald-500 hover:bg-emerald-600 text-white text-lg shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                disabled={!inputValue}
                onClick={() => { setFlowData({ payee: "Empresa Fictícia LTDA", cpf: "12.345.678/0001-00", value: 450.00 }); setFlowStep('confirm'); }}
              >
                Continuar
              </Button>
            </div>
          )}
          {flowStep === 'confirm' && (
            <div className="p-6 space-y-6">
              <div className="space-y-8 pb-4">
                <h2 className="text-2xl font-black text-white">Confirme os dados do Pix</h2>
                <div className="bg-zinc-900/80 p-6 rounded-3xl border border-zinc-800 space-y-6 shadow-inner">
                  <div>
                    <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Para</div>
                    <div className="font-bold text-xl text-white">{flowData.payee}</div>
                    <div className="text-sm text-zinc-400 mt-1">{flowData.cpf}</div>
                  </div>
                  <Separator className="bg-zinc-800" />
                  <div>
                    <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Valor</div>
                    <div className="font-black text-3xl text-emerald-400">{formatCurrency(flowData.value)}</div>
                  </div>
                </div>
              </div>
              <Button className="w-full h-14 rounded-2xl font-bold bg-emerald-500 hover:bg-emerald-600 text-white text-lg shadow-[0_0_20px_rgba(16,185,129,0.3)]" onClick={() => setFlowStep('success')}>
                Pagar {formatCurrency(flowData.value)}
              </Button>
            </div>
          )}
          {flowStep === 'success' && <SuccessState title="Pix enviado!" subtitle={`Para ${flowData.payee}`} amount={formatCurrency(flowData.value)} onClose={closeView} />}
        </SlideUpPanel>

        {/* 6. CREDIT CARD VIEW */}
        <SlideUpPanel id="card" open={activeView === 'card'}>
          {flowStep === 'menu' && (
            <div className="flex flex-col h-full overflow-hidden">
              <div className="h-16 flex items-center px-4 shrink-0 bg-transparent z-10 border-b border-transparent">
                <Button variant="ghost" size="icon" onClick={() => setActiveView('home')} className="text-zinc-400 hover:text-white hover:bg-zinc-800 mr-2 -ml-2 rounded-full">
                  <ChevronLeft className="h-6 w-6" />
                </Button>
              </div>
              <div className="px-6 py-2 space-y-6 flex-1 overflow-y-auto no-scrollbar">
                
                {/* Visual Card */}
                <div className="w-full h-56 rounded-2xl p-6 relative overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-700 shadow-2xl flex flex-col justify-between group cursor-pointer hover:border-zinc-600 transition-colors">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
                  <div className="absolute -top-20 -right-20 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl group-hover:bg-emerald-500/30 transition-colors"></div>
                  
                  <div className="relative z-10 flex justify-between items-start">
                    <div className="font-black text-xl text-white tracking-widest italic">esi.bank</div>
                    <div className="text-zinc-400 group-hover:text-zinc-300 transition-colors">
                      <svg width="36" height="24" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="12" fill="currentColor" fillOpacity="0.8"/>
                        <circle cx="24" cy="12" r="12" fill="currentColor" fillOpacity="0.8"/>
                      </svg>
                    </div>
                  </div>
                  
                  <div className="relative z-10 space-y-2">
                    <div className="font-mono text-xl tracking-[0.2em] text-zinc-300 group-hover:text-white transition-colors">•••• •••• •••• 4092</div>
                    <div className="flex justify-between items-center text-sm font-medium text-zinc-400">
                      <span>CORRETOR SILVA</span>
                      <span>12/29</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <div className="text-rose-400 font-bold tracking-widest uppercase text-xs">Fatura fechada</div>
                  <div className="text-4xl font-black text-white tracking-tighter drop-shadow-sm">R$ 3.450,00</div>
                  <div className="text-sm font-semibold text-zinc-500">Vence dia 05 MAR</div>
                </div>
                <div className="flex gap-4">
                  <Button className="w-full h-12 rounded-2xl font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)] border-none" onClick={(e) => { e.stopPropagation(); setFlowData({ type: 'full', value: 3450 }); setFlowStep('confirm'); }}>Pagar fatura</Button>
                  <Button variant="outline" className="w-full h-12 rounded-2xl font-bold border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800 hover:text-white" onClick={() => { setFlowData({ type: 'instalment' }); setFlowStep('input'); }}>Parcelar</Button>
                </div>
                <div className="space-y-3 pt-6">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-emerald-400">Limite disponível: R$ 4.550,00</span>
                  </div>
                  <div className="h-2.5 w-full bg-zinc-800 rounded-full overflow-hidden flex shadow-inner">
                    <div className="h-full bg-emerald-500 w-[10%]" />
                    <div className="h-full bg-rose-500 w-[40%]" />
                    <div className="h-full bg-zinc-600 w-[15%]" />
                  </div>
                </div>
                <Separator className="my-8 bg-zinc-800/50" />
                <div className="space-y-6 pb-12">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-white text-lg">Últimas compras</h3>
                    <div className="text-xs font-bold text-rose-400 uppercase tracking-widest cursor-pointer hover:text-rose-300">Ver todas</div>
                  </div>
                  <div className="space-y-6">
                    {transactionsCard.map((t) => (
                      <div key={t.id} className="flex justify-between items-center group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 group-hover:border-zinc-700 transition-colors">
                            <CreditCard className="h-5 w-5 text-zinc-400 group-hover:text-white transition-colors" />
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm">{t.titulo}</div>
                            <div className="text-xs text-zinc-500 font-medium mt-0.5">{t.descricao} • {t.data}</div>
                          </div>
                        </div>
                        <div className="font-black text-white text-sm">
                          R$ {t.valor.toLocaleString('pt-br', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {flowStep === 'input' && (
            <div className="p-6 space-y-6 pt-16">
              <div className="space-y-6 pb-4">
                <h2 className="text-2xl font-black text-white">Opções de parcelamento</h2>
                <p className="text-zinc-400 font-medium">Valor da fatura: <strong className="text-white">R$ 3.450,00</strong></p>
                <div className="space-y-3 mt-4">
                  {[2, 3, 4, 5, 6].map(x => (
                    <div key={x} className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-rose-500 cursor-pointer transition-all flex justify-between items-center group shadow-sm hover:shadow-[0_0_15px_rgba(244,63,94,0.15)]" onClick={() => { setFlowData({ type: 'instalment', value: 3450, splits: x }); setFlowStep('confirm'); }}>
                      <span className="font-black text-lg text-white">{x}x de {formatCurrency(3450 / x * 1.05)}</span>
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest group-hover:text-rose-400 transition-colors">com juros</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {flowStep === 'confirm' && (
            <div className="p-6 space-y-6 pt-16">
              <div className="space-y-8 pb-4">
                <h2 className="text-3xl font-black text-white">
                  {flowData.type === 'full' ? 'Pagamento da fatura' : `Parcelamento em ${flowData.splits}x`}
                </h2>
                <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 flex flex-col items-center justify-center space-y-3 shadow-inner">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Valor a ser debitado na conta:</span>
                  <span className="text-4xl font-black text-rose-400 drop-shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                    {flowData.type === 'full' ? formatCurrency(flowData.value) : formatCurrency((3450 / flowData.splits) * 1.05)}
                  </span>
                </div>
              </div>
              <Button className="w-full h-14 rounded-2xl font-bold bg-rose-500 hover:bg-rose-600 text-white text-lg shadow-[0_0_20px_rgba(244,63,94,0.3)] border-none" onClick={() => setFlowStep('success')}>Confirmar com Senha</Button>
            </div>
          )}
          {flowStep === 'success' && (
            <SuccessState
              title={flowData.type === 'full' ? 'Fatura Paga!' : 'Parcelamento confirmado!'}
              subtitle="Seu limite será restabelecido em instantes."
              onClose={() => { setFlowStep('menu'); setActiveView('home'); }}
            />
          )}
        </SlideUpPanel>

        {/* OTHER PLACEHOLDER VIEWS */}
        {['pay', 'transfer', 'charge', 'deposit', 'loan', 'history'].map(v => (
           v !== 'history' && <SlideUpPanel key={v} id={v} title={v.toUpperCase()} open={activeView === v} onHeaderAction={closeView} headerIcon={<X className="h-6 w-6"/>}>
             <div className="p-8 text-center text-zinc-500 font-medium">Fluxo de {v} em construção com o novo design system.</div>
           </SlideUpPanel>
        ))}

        {/* 8. HISTORY VIEW */}
        <SlideUpPanel id="history" title="Histórico da Conta" open={activeView === 'history'} onHeaderAction={headerAction} headerIcon={headerIcon}>
          <div className="p-6 space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
              <Input
                placeholder="Buscar transações..."
                className="pl-12 h-14 bg-zinc-900 border-zinc-800 text-white focus:ring-emerald-500 focus:border-emerald-500 rounded-2xl text-lg font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-3 mb-2">
              <Button variant={historyFilter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setHistoryFilter('all')} className={`rounded-xl h-10 font-bold px-5 ${historyFilter === 'all' ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-transparent border-zinc-800 text-zinc-400 hover:text-white'}`}>Todos</Button>
              <Button variant={historyFilter === 'in' ? 'default' : 'outline'} size="sm" onClick={() => setHistoryFilter('in')} className={`rounded-xl h-10 font-bold px-5 ${historyFilter === 'in' ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-transparent border-zinc-800 text-zinc-400 hover:text-white'}`}>Entradas</Button>
              <Button variant={historyFilter === 'out' ? 'default' : 'outline'} size="sm" onClick={() => setHistoryFilter('out')} className={`rounded-xl h-10 font-bold px-5 ${historyFilter === 'out' ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-transparent border-zinc-800 text-zinc-400 hover:text-white'}`}>Saídas</Button>
            </div>

            <div className="space-y-8 pt-2">
              {filteredTransacoes.length > 0 ? (
                <div className="space-y-6">
                  {filteredTransacoes.map((t) => (
                    <div key={t.id} className="flex gap-4 items-center group">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 group-hover:border-zinc-700 transition-colors">
                        {t.icone}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <div className="font-bold text-white text-[15px] leading-snug tracking-tight">{t.titulo}</div>
                          <div className="text-xs text-zinc-500 font-bold">{t.data}</div>
                        </div>
                        <div className="flex justify-between items-end">
                          <div className="text-sm text-zinc-500 font-medium">{t.descricao}</div>
                          <div className={`text-sm font-black ${t.tipo === 'entrada' ? 'text-emerald-400' : 'text-zinc-300'}`}>
                            {t.tipo === 'entrada' ? '+ ' : ''} {formatCurrency(t.valor)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-zinc-500 font-medium">Nenhuma transação encontrada.</div>
              )}
            </div>
          </div>
        </SlideUpPanel>

      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
