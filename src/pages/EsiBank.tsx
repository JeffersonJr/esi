import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, ChevronRight, CreditCard, Send, HandCoins, QrCode, Smartphone, Receipt, TrendingUp, ArrowDownRight, ArrowUpRight, User, X, Search, FileText, Copy, CheckCircle2, ChevronLeft, Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const quickActions = [
  { id: 'pix', icon: <QrCode className="h-6 w-6" />, label: 'Área Pix' },
  { id: 'pay', icon: <Receipt className="h-6 w-6" />, label: 'Pagar' },
  { id: 'transfer', icon: <Send className="h-6 w-6" />, label: 'Transferir' },
  { id: 'charge', icon: <HandCoins className="h-6 w-6" />, label: 'Cobrar (Asaas)' },
  { id: 'deposit', icon: <ArrowDownRight className="h-6 w-6" />, label: 'Depositar' },
];

const transacoesOriginais = [
  { id: '1', titulo: 'Transferência recebida', descricao: 'Aluguel Av. Paulista', valor: 2500.00, tipo: 'entrada', data: 'Hoje', icone: <ArrowDownRight className="h-4 w-4 text-emerald-600" /> },
  { id: '2', titulo: 'Pagamento de boleto', descricao: 'Condomínio', valor: 850.00, tipo: 'saida', data: 'Ontem', icone: <Receipt className="h-4 w-4 text-slate-600" /> },
  { id: '3', titulo: 'Pagamento de fatura', descricao: 'Cartão de crédito esi.bank', valor: 3450.00, tipo: 'saida', data: '15 Fev', icone: <CreditCard className="h-4 w-4 text-slate-600" /> },
  { id: '4', titulo: 'Pix enviado', descricao: 'João Silva', valor: 150.00, tipo: 'saida', data: '12 Fev', icone: <ArrowUpRight className="h-4 w-4 text-slate-600" /> },
  { id: '5', titulo: 'Comissão de venda', descricao: 'Imóvel Jardins', valor: 15000.00, tipo: 'entrada', data: '05 Fev', icone: <TrendingUp className="h-4 w-4 text-emerald-600" /> },
];

const transactionsCard = [
  { id: 'c1', titulo: 'Uber', descricao: 'Transporte', valor: 45.90, data: 'Hoje' },
  { id: 'c2', titulo: 'Ifood', descricao: 'Alimentação', valor: 112.50, data: 'Ontem' },
  { id: 'c3', titulo: 'Amazon', descricao: 'Eletrônicos', valor: 599.00, data: '18 Fev' },
  { id: 'c4', titulo: 'Netflix', descricao: 'Assinaturas', valor: 55.90, data: '15 Fev' },
];

type ActiveViewType = 'home' | 'pix' | 'pay' | 'transfer' | 'charge' | 'deposit' | 'card' | 'loan' | 'history';
type FlowStep = 'menu' | 'input' | 'confirm' | 'success';

// Formatter utils
const formatCurrency = (val: number) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
const formatCPF = (cpf: string) => `***.${cpf.substring(3, 6)}.${cpf.substring(6, 9)}-**`;


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
          className="absolute inset-0 bg-white z-50 flex flex-col h-full overflow-hidden"
        >
          {title && (
            <div className="h-16 border-b border-slate-100 flex items-center px-4 shrink-0 bg-white z-10 pt-safe">
              <Button variant="ghost" size="icon" onClick={onHeaderAction} className="text-slate-500 mr-2 -ml-2">
                {headerIcon || <X className="h-6 w-6" />}
              </Button>
              <div className="font-semibold text-slate-800 text-lg flex-1 truncate">{title}</div>
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
    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-2">
      <CheckCircle2 className="h-10 w-10" />
    </div>
    <div className="space-y-2">
      <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
      <p className="text-slate-500">{subtitle}</p>
      {amount && (
        <div className="text-3xl font-extrabold text-slate-800 pt-4">{amount}</div>
      )}
    </div>
    <div className="pt-8 w-full space-y-3">
      <Button variant="outline" className="w-full h-12 rounded-full font-bold text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100">Ver comprovante</Button>
      <Button variant="ghost" className="w-full h-12 rounded-full font-bold text-slate-500" onClick={onClose}>Voltar ao início</Button>
    </div>
  </div>
);

const formatBoletoMask = (val: string) => {
  return val.replace(/\D/g, '')
    .replace(/^(\d{5})(\d)/, '$1.$2')
    .replace(/^(\d{5}\.\d{5})(\d)/, '$1 $2')
    .replace(/^(\d{5}\.\d{5} \d{5})(\d)/, '$1.$2')
    .replace(/^(\d{5}\.\d{5} \d{5}\.\d{6})(\d)/, '$1 $2')
    .replace(/^(\d{5}\.\d{5} \d{5}\.\d{6} \d{5})(\d)/, '$1.$2')
    .replace(/^(\d{5}\.\d{5} \d{5}\.\d{6} \d{5}\.\d{6})(\d)/, '$1 $2')
    .replace(/^(\d{5}\.\d{5} \d{5}\.\d{6} \d{5}\.\d{6} \d)(\d)/, '$1 $2')
    .substring(0, 54);
};

export function EsiBank() {

  const { toast } = useToast();
  const [showBalance, setShowBalance] = useState(false);
  const [activeView, setActiveView] = useState<ActiveViewType>('home');
  const [searchTerm, setSearchTerm] = useState('');

  // History Filter State
  const [historyFilter, setHistoryFilter] = useState<'all' | 'in' | 'out'>('all');

  // Interactive Flow State
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
    toast({
      title: "Copiado!",
      description: "Chave PIX copiada para a área de transferência.",
      duration: 2000,
    });
  };

  const closeView = () => {
    setActiveView('home');
    setTimeout(() => {
      setFlowStep('menu');
      setFlowData({});
      setInputValue('');
    }, 300); // Reset after slide out
  };

  const goBackStep = () => {
    if (flowStep === 'success') return closeView();
    if (flowStep === 'confirm') setFlowStep('input');
    else if (flowStep === 'input') setFlowStep('menu');
  };

  // Header logic for panels
  const showBack = flowStep !== 'menu' && flowStep !== 'success';
  const headerAction = showBack ? goBackStep : closeView;
  const headerIcon = showBack ? <ChevronLeft className="h-6 w-6" /> : <X className="h-6 w-6" />;



  // Reusable Components inner



  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center w-full">
      <div className="w-full max-w-[1600px] mb-4 sm:mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="flex items-center gap-1">
                <Home className="h-4 w-4" /> Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>esi.bank</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="w-full max-w-md bg-white shadow-sm sm:shadow-xl min-h-[100dvh] relative border-x border-slate-100 overflow-hidden font-sans flex flex-col">

        {/* --- HOME VIEW --- */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
          {/* HEADER / CONTA */}
          <div className="px-6 pt-12 pb-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100/50 flex items-center justify-center border border-emerald-100">
                  <User className="h-6 w-6 text-emerald-700" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">esi.bank</div>
                  <div className="font-bold text-lg text-slate-800 leading-tight">Olá, Corretor</div>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setShowBalance(!showBalance)} className="text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors mt-1">
                  {showBalance ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1 cursor-pointer group mt-6" onClick={() => setActiveView('history')}>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-600">Conta</h2>
                <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
              </div>
              <div className="text-3xl font-bold text-slate-800 tracking-tight pt-1">
                {showBalance ? 'R$ 69.135,68' : 'R$ •••••••'}
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="overflow-x-auto pb-4 pt-4 -mx-2 px-6 no-scrollbar flex gap-4">
            {quickActions.map(action => (
              <div key={action.id} onClick={() => setActiveView(action.id as ActiveViewType)} className="flex flex-col items-center gap-2 cursor-pointer group shrink-0 w-[72px]">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-slate-200 transition-colors">
                  {action.icon}
                </div>
                <div className="text-xs font-semibold text-slate-800 text-center leading-tight mt-1">
                  {action.label}
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 py-6 border-t border-slate-100 mt-2">
            <Card className="bg-slate-50 border-none shadow-none hover:bg-slate-100 cursor-pointer transition-colors rounded-xl" onClick={() => setActiveView('card')}>
              <CardContent className="p-4 flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-slate-700" />
                <span className="font-semibold text-sm text-slate-800">Meus cartões</span>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-0 h-2 bg-slate-100 border-none w-full" />

          {/* CREDIT CARD */}
          <div className="px-6 py-6 space-y-3 cursor-pointer group" onClick={() => setActiveView('card')}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-slate-600" />
                <h2 className="text-sm font-semibold text-slate-600 mt-1">Cartão de crédito</h2>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
            </div>
            <div className="space-y-1 pt-2">
              <div className="text-sm text-slate-500 font-medium tracking-tight">Fatura fechada</div>
              <div className="text-2xl font-bold text-slate-800">
                {showBalance ? 'R$ 3.450,00' : 'R$ •••••••'}
              </div>
              <div className="text-sm text-slate-500">
                Vencimento <span className="font-bold text-slate-700">05 MAR</span>
              </div>
            </div>
            <div className="pt-3">
              <Button size="sm" className="bg-rose-500 hover:bg-rose-600 text-white rounded-full px-5 font-semibold text-xs h-9" onClick={(e) => { e.stopPropagation(); setActiveView('card'); setFlowStep('confirm'); }}>
                Pagar fatura
              </Button>
            </div>
          </div>

          <Separator className="my-0 h-2 bg-slate-100 border-none w-full" />

          {/* LOANS */}
          <div className="px-6 py-6 space-y-3 cursor-pointer group" onClick={() => setActiveView('loan')}>
            <div className="flex items-center justify-between">
              <div className="flex justify-between w-full pr-2">
                <h2 className="text-sm font-semibold text-slate-600 mt-1">Empréstimo</h2>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
            </div>
            <div className="space-y-1 pt-2">
              <div className="text-[15px] font-medium text-slate-800 pr-12">
                Valor disponível de até <strong className="font-bold">R$ 50.000,00</strong>
              </div>
            </div>
          </div>

          <Separator className="my-0 h-2 bg-slate-100 border-none w-full" />

          {/* TRANSACTIONS */}
          <div className="px-6 py-6 space-y-6 cursor-pointer group" onClick={() => setActiveView('history')}>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-600">Histórico</h2>
              <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
            </div>
            <div className="space-y-6 pt-2">
              {transacoesOriginais.slice(0, 3).map((t) => (
                <div key={t.id} className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    {t.icone}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <div className="font-semibold text-slate-800 text-[15px] leading-snug tracking-tight">{t.titulo}</div>
                      <div className="text-xs text-slate-500 font-medium">{t.data}</div>
                    </div>
                    <div className="text-sm text-slate-500 tracking-tight">{t.descricao}</div>
                    <div className={`text-sm font-semibold pt-0.5 ${t.tipo === 'entrada' ? 'text-emerald-600' : 'text-slate-700'}`}>
                      {t.tipo === 'entrada' ? '+ ' : ''} R$ {t.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                <div className="flex flex-col items-center gap-2 cursor-pointer group" onClick={() => { setFlowStep('input'); setFlowData({ type: 'pix-copy' }); }}>
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-slate-200"><QrCode className="h-6 w-6" /></div>
                  <div className="text-xs font-semibold text-slate-800 text-center leading-tight">Pix Copia<br />e Cola</div>
                </div>
                <div className="flex flex-col items-center gap-2 cursor-pointer group" onClick={() => { setActiveView('transfer'); setFlowStep('input'); }}>
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-slate-200"><Send className="h-6 w-6" /></div>
                  <div className="text-xs font-semibold text-slate-800 text-center">Transferir</div>
                </div>
                <div className="flex flex-col items-center gap-2 cursor-pointer group" onClick={() => { setActiveView('charge'); }}>
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-slate-200"><HandCoins className="h-6 w-6" /></div>
                  <div className="text-xs font-semibold text-slate-800 text-center">Cobrar</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800">Minhas chaves</h3>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                  <div>
                    <div className="text-sm font-bold text-slate-800">CPF</div>
                    <div className="text-sm text-slate-500">{formatCPF('12345678900')}</div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleCopy('12345678900')}><Copy className="h-5 w-5 text-slate-500" /></Button>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                  <div>
                    <div className="text-sm font-bold text-slate-800">E-mail</div>
                    <div className="text-sm text-slate-500">contato@imob.com.br</div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleCopy('contato@imob.com.br')}><Copy className="h-5 w-5 text-slate-500" /></Button>
                </div>
              </div>
            </div>
          )}
          {flowStep === 'input' && (
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <Label className="text-lg font-bold text-slate-800">Cole o código Pix ou chave</Label>
                <Input
                  placeholder="Cole aqui..."
                  className="h-12 border-slate-200"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  autoFocus
                />
              </div>
              <Button
                className="w-full h-12 rounded-full font-bold bg-emerald-500 hover:bg-emerald-600 text-white"
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
                <h2 className="text-xl font-bold text-slate-800">Confirme os dados do Pix</h2>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                  <div>
                    <div className="text-sm text-slate-500">Para</div>
                    <div className="font-bold text-lg text-slate-800">{flowData.payee}</div>
                    <div className="text-sm text-slate-500">{flowData.cpf}</div>
                  </div>
                  <Separator />
                  <div>
                    <div className="text-sm text-slate-500">Valor</div>
                    <div className="font-bold text-2xl text-slate-800">{formatCurrency(flowData.value)}</div>
                  </div>
                </div>
              </div>
              <Button className="w-full h-12 rounded-full font-bold bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => setFlowStep('success')}>
                Pagar {formatCurrency(flowData.value)}
              </Button>
            </div>
          )}
          {flowStep === 'success' && <SuccessState title="Pix enviado!" subtitle={`Para ${flowData.payee}`} amount={formatCurrency(flowData.value)} onClose={closeView} />}
        </SlideUpPanel>

        {/* 2. PAY VIEW */}
        <SlideUpPanel id="pay" title="Pagar" open={activeView === 'pay'} onHeaderAction={headerAction} headerIcon={headerIcon}>
          {flowStep === 'menu' && (
            <div className="p-6 space-y-6">
              <div className="space-y-8 pb-4">
                <div className="bg-slate-900 rounded-2xl p-8 flex flex-col items-center justify-center text-white h-48 cursor-pointer relative overflow-hidden group mb-4" onClick={() => setFlowStep('input')}>
                  <div className="absolute inset-0 bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Receipt className="h-12 w-12 text-slate-300 mb-4 relative z-10" />
                  <div className="font-semibold text-lg relative z-10">Pagar boleto</div>
                  <div className="text-sm text-slate-400 mt-1 relative z-10">com código ou scanner</div>
                </div>

                <div className="space-y-4" onClick={() => setFlowStep('input')}>
                  <Label className="text-sm font-bold text-slate-800">Ou digite o código de barras</Label>
                  <Input
                    placeholder="00000.00000 00000.000000..."
                    className="h-12 border-slate-200 cursor-pointer"
                    readOnly
                  />
                  <Button className="w-full h-12 rounded-full font-bold bg-slate-800 text-white">Continuar</Button>
                </div>
              </div>
            </div>
          )}
          {flowStep === 'input' && (
            <div className="p-6 space-y-6">
              <div className="space-y-6 pb-4">
                <Label className="text-lg font-bold text-slate-800">Digite o código de barras</Label>
                <textarea
                  className="w-full h-32 border border-slate-200 rounded-xl p-4 text-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none font-mono"
                  placeholder="00000.00000..."
                  value={inputValue}
                  onChange={(e) => setInputValue(formatBoletoMask(e.target.value))}
                  autoFocus
                />
              </div>
              <Button
                className="w-full h-12 rounded-full font-bold bg-slate-800 text-white"
                disabled={inputValue.length < 10}
                onClick={() => { setFlowData({ payee: "Condomínio Edifício Paulista", doc: "00000.00000...", value: 850.00 }); setFlowStep('confirm'); }}>
                Avançar
              </Button>
            </div>
          )}
          {flowStep === 'confirm' && (
            <div className="p-6 space-y-6">
              <div className="space-y-8 pb-4">
                <h2 className="text-xl font-bold text-slate-800">Confirme o pagamento</h2>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                  <div>
                    <div className="text-sm text-slate-500">Beneficiário</div>
                    <div className="font-bold text-lg text-slate-800">{flowData.payee}</div>
                  </div>
                  <Separator />
                  <div>
                    <div className="text-sm text-slate-500">Valor do boleto</div>
                    <div className="font-bold text-2xl text-slate-800">{formatCurrency(flowData.value)}</div>
                  </div>
                </div>
              </div>
              <Button className="w-full h-12 rounded-full font-bold bg-emerald-500 text-white" onClick={() => setFlowStep('success')}>
                Confirmar pagamento
              </Button>
            </div>
          )}
          {flowStep === 'success' && <SuccessState title="Pagamento realizado!" subtitle={`Referente a ${flowData.payee}`} amount={formatCurrency(flowData.value)} onClose={closeView} />}
        </SlideUpPanel>

        {/* 3. TRANSFER VIEW */}
        <SlideUpPanel id="transfer" title="Transferir" open={activeView === 'transfer'} onHeaderAction={headerAction} headerIcon={headerIcon}>
          {flowStep === 'menu' && (
            <div className="p-6 space-y-6">
              <div className="space-y-4 pb-4">
                <div className="text-slate-500 font-medium">Qual o valor da transferência?</div>
                <div className="text-sm text-slate-400">Saldo disponível: R$ 69.135,68</div>
                <div className="pt-4">
                  <div className="text-4xl font-bold text-slate-800 border-b-2 focus-within:border-emerald-500 transition-colors pb-2 flex items-center">
                    <span className="text-2xl mr-2 text-slate-400">R$</span>
                    <Input
                      type="number"
                      className="border-none shadow-none text-4xl p-0 h-auto focus-visible:ring-0"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      autoFocus
                      placeholder="0,00"
                    />
                  </div>
                </div>
              </div>
              <Button
                className="w-full h-12 rounded-full font-bold text-white bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400"
                disabled={!inputValue || Number(inputValue) <= 0}
                onClick={() => { setFlowData({ payee: "Maria Aparecida Silva", cpf: "***.123.456-**", value: Number(inputValue) }); setFlowStep('confirm'); }}>
                Continuar
              </Button>
            </div>
          )}
          {flowStep === 'confirm' && (
            <div className="p-6 space-y-6">
              <div className="space-y-8 pb-4">
                <h2 className="text-xl font-bold text-slate-800">Revisar transferência</h2>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                  <div>
                    <div className="text-sm text-slate-500">Para</div>
                    <div className="font-bold text-lg text-slate-800">{flowData.payee}</div>
                    <div className="text-sm text-slate-500">{flowData.cpf}</div>
                  </div>
                  <Separator />
                  <div>
                    <div className="text-sm text-slate-500">Valor da transferência</div>
                    <div className="font-bold text-2xl text-slate-800">{formatCurrency(flowData.value)}</div>
                  </div>
                </div>
              </div>
              <Button className="w-full h-12 rounded-full font-bold bg-emerald-500 text-white" onClick={() => setFlowStep('success')}>
                Transferir {formatCurrency(flowData.value)}
              </Button>
            </div>
          )}
          {flowStep === 'success' && <SuccessState title="Transferência enviada!" subtitle={`Para ${flowData.payee}`} amount={formatCurrency(flowData.value)} onClose={closeView} />}
        </SlideUpPanel>

        {/* 4. CHARGE VIEW (ASAAS) */}
        <SlideUpPanel id="charge" title="Cobrar com Asaas" open={activeView === 'charge'} onHeaderAction={headerAction} headerIcon={headerIcon}>
          {flowStep === 'menu' && (
            <div className="p-6 space-y-4">
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-start gap-4 mb-6">
                <HandCoins className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <div className="font-bold text-blue-900">Integração Asaas Ativa</div>
                  <div className="text-sm text-blue-700 leading-snug mt-1">Gere boletos e links de pagamento diretos vinculados ao sistema financeiro da sua corretora.</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white border hover:border-blue-400 border-slate-200 p-5 rounded-2xl cursor-pointer transition-colors shadow-sm" onClick={() => { setFlowData({ type: 'Boleto', id: 'BOL-1234' }); setFlowStep('success'); }}>
                  <div className="font-bold text-lg text-slate-800">Boleto Bancário</div>
                  <div className="text-sm text-slate-500 mt-1">Enviar cobrança via boleto registrado</div>
                </div>
                <div className="bg-white border hover:border-emerald-400 border-slate-200 p-5 rounded-2xl cursor-pointer transition-colors shadow-sm" onClick={() => { setFlowData({ type: 'Pix', id: 'PIX-1234' }); setFlowStep('success'); }}>
                  <div className="font-bold text-lg text-slate-800">Cobrança via Pix</div>
                  <div className="text-sm text-slate-500 mt-1">Gerar QR Code dinâmico com valor exato</div>
                </div>
                <div className="bg-white border hover:border-slate-400 border-slate-200 p-5 rounded-2xl cursor-pointer transition-colors shadow-sm" onClick={() => { setFlowData({ type: 'Link', id: 'LNK-1234' }); setFlowStep('success'); }}>
                  <div className="font-bold text-lg text-slate-800">Link de Pagamento</div>
                  <div className="text-sm text-slate-500 mt-1">Cartão de crédito ou boleto avulso</div>
                </div>
              </div>
            </div>
          )}
          {flowStep === 'success' && <SuccessState title={`${flowData.type} gerado!`} subtitle={`ID da cobrança: ${flowData.id}`} onClose={closeView} />}
        </SlideUpPanel>

        {/* 5. DEPOSIT VIEW */}
        <SlideUpPanel id="deposit" title="Depositar" open={activeView === 'deposit'} onHeaderAction={headerAction} headerIcon={headerIcon}>
          <div className="p-6 space-y-4">
            <div className="text-slate-600 font-medium pb-2">Como você quer depositar na sua conta esi.bank?</div>
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 p-5 rounded-2xl cursor-pointer transition-colors hover:bg-slate-50 shadow-sm flex items-center justify-between" onClick={() => setActiveView('home')}>
                <div>
                  <div className="font-bold text-lg text-slate-800">Boleto em dinheiro</div>
                  <div className="text-sm text-slate-500 mt-1">Demora até 3 dias úteis</div>
                </div>
                <FileText className="h-6 w-6 text-slate-400" />
              </div>
              <div className="bg-white border border-slate-200 p-5 rounded-2xl cursor-pointer transition-colors hover:bg-slate-50 shadow-sm flex items-center justify-between" onClick={() => setActiveView('home')}>
                <div>
                  <div className="font-bold text-lg text-slate-800">Receber Pix</div>
                  <div className="text-sm text-slate-500 mt-1">Cai na hora, de graça</div>
                </div>
                <QrCode className="h-6 w-6 text-slate-400" />
              </div>
              <div className="bg-white border border-slate-200 p-5 rounded-2xl cursor-pointer transition-colors hover:bg-slate-50 shadow-sm flex items-center justify-between" onClick={() => setActiveView('home')}>
                <div>
                  <div className="font-bold text-lg text-slate-800">TED/DOC</div>
                  <div className="text-sm text-slate-500 mt-1">Cai no mesmo dia útil</div>
                </div>
                <ArrowDownRight className="h-6 w-6 text-slate-400" />
              </div>
            </div>
          </div>
        </SlideUpPanel>

        {/* 6. CREDIT CARD VIEW */}
        <SlideUpPanel id="card" open={activeView === 'card'}>
          {flowStep === 'menu' && (
            <div className="flex flex-col h-full overflow-hidden">
              <div className="h-16 flex items-center px-4 shrink-0 bg-white z-10 border-b border-transparent">
                <Button variant="ghost" size="icon" onClick={() => setActiveView('home')} className="text-slate-500 mr-2 -ml-2">
                  <ChevronLeft className="h-6 w-6" />
                </Button>
              </div>
              <div className="px-6 py-2 space-y-6 flex-1 overflow-y-auto no-scrollbar">
                <div className="space-y-1">
                  <div className="text-rose-500 font-bold tracking-tight">Fatura fechada</div>
                  <div className="text-4xl font-extrabold text-slate-800 tracking-tighter">R$ 3.450,00</div>
                  <div className="text-sm font-medium text-slate-500">Vence dia 05 MAR</div>
                </div>
                <div className="flex gap-4">
                  <Button className="w-full h-12 rounded-full font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-200" onClick={(e) => { e.stopPropagation(); setFlowData({ type: 'full', value: 3450 }); setFlowStep('confirm'); }}>Pagar fatura</Button>
                  <Button variant="outline" className="w-full h-12 rounded-full font-bold border-slate-200 text-slate-800" onClick={() => { setFlowData({ type: 'instalment' }); setFlowStep('input'); }}>Parcelar</Button>
                </div>
                <div className="space-y-2 pt-4">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-emerald-600">Limite disponível: R$ 4.550,00</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                    <div className="h-full bg-yellow-400 w-[10%]" />
                    <div className="h-full bg-rose-500 w-[40%]" />
                    <div className="h-full bg-sky-500 w-[15%]" />
                  </div>
                </div>
                <Separator className="my-6" />
                <div className="space-y-6 pb-12">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 text-lg">Últimas compras</h3>
                    <div className="text-sm font-semibold text-rose-500">Ver todas</div>
                  </div>
                  <div className="space-y-6">
                    {transactionsCard.map((t) => (
                      <div key={t.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                            <CreditCard className="h-5 w-5 text-slate-500" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 text-sm">{t.titulo}</div>
                            <div className="text-xs text-slate-500">{t.descricao} • {t.data}</div>
                          </div>
                        </div>
                        <div className="font-semibold text-slate-800">
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
                <h2 className="text-2xl font-bold text-slate-800">Opções de parcelamento</h2>
                <p className="text-slate-500">Valor da fatura: R$ 3.450,00</p>
                <div className="space-y-2 mt-4">
                  {[2, 3, 4, 5, 6].map(x => (
                    <div key={x} className="p-4 border border-slate-200 rounded-xl hover:border-rose-400 cursor-pointer transition-all flex justify-between" onClick={() => { setFlowData({ type: 'instalment', value: 3450, splits: x }); setFlowStep('confirm'); }}>
                      <span className="font-bold text-slate-800">{x}x de {formatCurrency(3450 / x * 1.05)}</span>
                      <span className="text-sm text-slate-500">com juros</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {flowStep === 'confirm' && (
            <div className="p-6 space-y-6 pt-16">
              <div className="space-y-8 pb-4">
                <h2 className="text-2xl font-bold text-slate-800">
                  {flowData.type === 'full' ? 'Pagamento da fatura' : `Parcelamento em ${flowData.splits}x`}
                </h2>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col items-center justify-center py-10 space-y-2">
                  <span className="text-sm text-slate-500">Valor a ser debitado na conta:</span>
                  <span className="text-3xl font-extrabold text-slate-800">
                    {flowData.type === 'full' ? formatCurrency(flowData.value) : formatCurrency((3450 / flowData.splits) * 1.05)}
                  </span>
                </div>
              </div>
              <Button className="w-full h-12 rounded-full font-bold bg-rose-500 text-white" onClick={() => setFlowStep('success')}>Confirmar com Senha</Button>
            </div>
          )}
          {flowStep === 'success' && (
            <SuccessState
              title={flowData.type === 'full' ? 'Fatura Paga!' : 'Parcelamento confirmado!'}
              subtitle="Seu limite será restabelecido em instantes."
              onClose={() => {
                setFlowStep('menu');
                setActiveView('home');
              }}
            />
          )}
        </SlideUpPanel>

        {/* 7. LOAN VIEW */}
        <SlideUpPanel id="loan" title="Empréstimo" open={activeView === 'loan'} onHeaderAction={headerAction} headerIcon={headerIcon}>
          {flowStep === 'menu' && (
            <div className="p-6 space-y-6">
              <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 mb-6 shadow-sm">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-emerald-600 mb-2">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <div className="text-emerald-800 font-bold text-xl">R$ 50.000,00</div>
                <div className="text-sm text-emerald-700">Pré-aprovado para seu negócio</div>
              </div>
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 text-lg">Opções para você</h3>
                <div className="bg-white border hover:border-emerald-400 border-slate-200 p-5 rounded-2xl cursor-pointer transition-colors shadow-sm" onClick={() => { setFlowData({ type: 'novo' }); setFlowStep('input'); }}>
                  <div className="font-bold text-lg text-slate-800">Novo empréstimo</div>
                  <div className="text-sm text-slate-500 mt-1">Simule taxas e parcelas na hora</div>
                </div>
                <div className="bg-white border hover:border-emerald-400 border-slate-200 p-5 rounded-2xl cursor-pointer transition-colors shadow-sm" onClick={() => { setFlowData({ type: 'antecipacao' }); setFlowStep('input'); }}>
                  <div className="font-bold text-lg text-slate-800">Antecipação de aluguéis</div>
                  <div className="text-sm text-slate-500 mt-1">Receba comissão futura à vista</div>
                </div>
              </div>
            </div>
          )}
          {flowStep === 'input' && (
            <div className="p-6 space-y-6">
              <div className="space-y-8 pb-4">
                <h2 className="text-xl font-bold text-slate-800">
                  {flowData.type === 'novo' ? 'Quanto você precisa?' : 'Deseja antecipar qual contrato?'}
                </h2>
                {flowData.type === 'novo' ? (
                  <div className="pt-4">
                    <div className="text-4xl font-bold text-slate-800 border-b-2 border-slate-200 focus-within:border-emerald-500 transition-colors pb-2 flex items-center">
                      <span className="text-2xl mr-2 text-slate-400">R$</span>
                      <Input
                        type="number"
                        className="border-none shadow-none text-4xl p-0 h-auto focus-visible:ring-0"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        autoFocus
                        placeholder="0,00"
                      />
                    </div>
                    <p className="text-sm text-slate-400 mt-2">Limite: R$ 50.000,00</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="p-4 border border-slate-200 rounded-xl hover:border-emerald-400 cursor-pointer bg-slate-50" onClick={() => { setInputValue('12000'); }}>
                      <div className="font-bold text-slate-800">Aluguel Imóvel Jardins</div>
                      <div className="text-sm text-slate-500">12 parcelas de R$ 1.000 (Comissão a receber)</div>
                      <div className="text-emerald-600 font-bold mt-2">Valor líquido a antecipar: R$ 10.500,00</div>
                    </div>
                  </div>
                )}
              </div>
              <Button className="w-full h-12 rounded-full font-bold bg-emerald-500 hover:bg-emerald-600 text-white" disabled={!inputValue} onClick={() => { flowData.type === 'novo' ? setFlowData({ ...flowData, val: Number(inputValue) }) : setFlowData({ ...flowData, val: 10500 }); setFlowStep('confirm'); }}>Ver taxas</Button>
            </div>
          )}
          {flowStep === 'confirm' && (
            <div className="p-6 space-y-6">
              <div className="space-y-8 pb-4">
                <h2 className="text-xl font-bold text-slate-800">Resumo do Empréstimo</h2>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Valor líquido Liberado</span>
                    <span className="font-bold text-slate-800">{formatCurrency(flowData.val)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-slate-500">Juros aplicados</span>
                    <span className="font-bold text-slate-800">1.99% a.m</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total a pagar</span>
                    <span className="font-bold text-slate-800">{formatCurrency(flowData.val * 1.1)}</span>
                  </div>
                </div>
              </div>
              <Button className="w-full h-12 rounded-full font-bold bg-emerald-500 text-white" onClick={() => setFlowStep('success')}>Contratar e Transferir</Button>
            </div>
          )}
          {flowStep === 'success' && <SuccessState title="Dinheiro na conta!" subtitle="O valor já está disponível no saldo esi.bank." amount={formatCurrency(flowData.val)} onClose={closeView} />}
        </SlideUpPanel>

        {/* 8. HISTORY VIEW */}
        <SlideUpPanel id="history" title="Histórico da Conta" open={activeView === 'history'} onHeaderAction={headerAction} headerIcon={headerIcon}>
          <div className="p-6 space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Buscar transações..."
                className="pl-10 h-12 bg-slate-50 border-transparent focus-visible:ring-1 focus-visible:ring-emerald-400 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2 mb-2">
              <Button variant={historyFilter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setHistoryFilter('all')} className={historyFilter === 'all' ? 'bg-slate-800' : ''}>Todos</Button>
              <Button variant={historyFilter === 'in' ? 'default' : 'outline'} size="sm" onClick={() => setHistoryFilter('in')} className={historyFilter === 'in' ? 'bg-slate-800' : ''}>Entradas</Button>
              <Button variant={historyFilter === 'out' ? 'default' : 'outline'} size="sm" onClick={() => setHistoryFilter('out')} className={historyFilter === 'out' ? 'bg-slate-800' : ''}>Saídas</Button>
            </div>

            <div className="space-y-8 pt-2">
              {filteredTransacoes.length > 0 ? (
                <div className="space-y-6">
                  {filteredTransacoes.map((t) => (
                    <div key={t.id} className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        {t.icone}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <div className="font-semibold text-slate-800 text-[15px] leading-snug tracking-tight">{t.titulo}</div>
                          <div className="text-xs text-slate-500 font-medium">{t.data}</div>
                        </div>
                        <div className="text-sm text-slate-500 tracking-tight">{t.descricao}</div>
                        <div className={`text-sm font-semibold pt-0.5 ${t.tipo === 'entrada' ? 'text-emerald-600' : 'text-slate-700'}`}>
                          {t.tipo === 'entrada' ? '+ ' : ''} {formatCurrency(t.valor)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500">Nenhuma transação encontrada.</div>
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
