import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Ghost } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">

        {/* Visual Element */}
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full" />
          <div className="relative flex justify-center">
            <div className="h-32 w-32 bg-white rounded-3xl shadow-2xl flex items-center justify-center border border-slate-100 rotate-6 hover:rotate-0 transition-transform duration-500">
              <Ghost className="h-16 w-16 text-indigo-600 animate-bounce" />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <h1 className="text-8xl font-black text-slate-800 tracking-tighter">404</h1>
          <h2 className="text-2xl font-bold text-slate-700">Ops! Página não encontrada.</h2>
          <p className="text-slate-500 font-medium leading-relaxed">
            Parece que o link que você tentou acessar não existe ou foi movido para outro lugar.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            asChild
            variant="outline"
            className="flex-1 h-12 rounded-2xl border-slate-200 bg-white hover:bg-slate-50 font-bold text-slate-600 shadow-sm"
          >
            <Link to={-1 as any}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
            </Link>
          </Button>
          <Button
            asChild
            className="flex-1 h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-100"
          >
            <Link to="/">
              <Home className="h-4 w-4 mr-2" /> Ir para o Início
            </Link>
          </Button>
        </div>

        {/* Footer Subtext */}
        <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em] pt-8">
          ESI Platform &bull; Intelligent Systems
        </p>
      </div>
    </div>
  );
}
