import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, ChevronLeft, X, Zap, LayoutGrid, Sparkles, CheckCircle2, Home, Store, Factory, TreePine
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type FlowContext = 'imovel' | 'empreendimento';

interface AICadastroFlowProps {
  contexto: FlowContext;
  onClose: () => void;
  onCompleteManual: (dadosIniciais: any) => void;
  onCompleteIA: (dadosExtraidos: any) => void;
}

const FINALIDADES = ['Residencial', 'Comercial', 'Industrial', 'Rural'] as const;
type FinalidadeCategoria = typeof FINALIDADES[number];

const TIPOS_POR_FINALIDADE: Record<FinalidadeCategoria, string[]> = {
  Comercial: ['Andar Comercial', 'Casa Comercial', 'Conjunto Comercial', 'Consultório', 'Depósito', 'Galpão', 'Loja', 'Sala Comercial', 'Terreno'],
  Industrial: ['Armazém', 'Barracão', 'Depósito', 'Galpão', 'Indústria', 'Terreno'],
  Rural: ['Chácara', 'Fazenda', 'Haras', 'Sítio', 'Terreno'],
  Residencial: ['Apartamento', 'Casa', 'Casa de Condomínio', 'Cobertura', 'Kitnet', 'Sobrado', 'Studio', 'Terreno'],
};

type Fase = 'escolha_categoria' | 'escolha_modo' | 'upload' | 'analisando' | 'resultado';

interface Foto {
  id: string;
  url: string;
  rotacao: number;
}

export function AICadastroFlow({ contexto, onClose, onCompleteManual, onCompleteIA }: AICadastroFlowProps) {
  const [fase, setFase] = useState<Fase>('escolha_categoria');
  
  const [finalidade, setFinalidade] = useState<FinalidadeCategoria>('Residencial');
  const [tipo, setTipo] = useState('Apartamento');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fotos, setFotos] = useState<Foto[]>([]);
  
  const [progresso, setProgresso] = useState(0);
  const [progressoTexto, setProgressoTexto] = useState('');

  // 1. Fase Categoria
  if (fase === 'escolha_categoria') {
    return (
      <div className="flex flex-col h-full bg-background min-h-[400px]">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-5 w-5 text-muted-foreground" />
          </Button>
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Categoria do {contexto === 'imovel' ? 'Imóvel' : 'Empreendimento'}
          </h2>
          <div className="w-10" />
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-4">
          <h3 className="text-base font-bold text-foreground text-center mb-6 leading-snug">
            Qual a finalidade e qual o tipo que você deseja cadastrar?
          </h3>

          <div className="flex flex-col gap-5 bg-card border border-border p-5 rounded-3xl shadow-sm mb-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Finalidade</label>
              <select
                value={finalidade}
                onChange={(e) => {
                  const val = e.target.value as FinalidadeCategoria;
                  setFinalidade(val);
                  setTipo(TIPOS_POR_FINALIDADE[val][0]);
                }}
                className="h-12 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {FINALIDADES.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tipo</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="h-12 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {TIPOS_POR_FINALIDADE[finalidade].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <Button 
            className="w-full h-12 rounded-2xl font-bold shadow-md"
            onClick={() => setFase('escolha_modo')}
          >
            Continuar
          </Button>
        </div>
      </div>
    );
  }

  // 2. Fase Modo de Cadastro
  if (fase === 'escolha_modo') {
    return (
      <div className="flex flex-col h-full bg-background min-h-[400px]">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="icon" onClick={() => setFase('escolha_categoria')} className="rounded-full">
            <ChevronLeft className="h-5 w-5 text-muted-foreground" />
          </Button>
          <h2 className="font-serif text-xl font-semibold text-foreground">Método de Cadastro</h2>
          <div className="w-10" />
        </div>

        <div className="max-w-sm mx-auto w-full">
          <div className="bg-primary/5 p-3 rounded-2xl border border-primary/20 mb-5 flex flex-col gap-1">
            <span className="text-[9px] font-bold text-primary uppercase tracking-wider">Estrutura Selecionada</span>
            <span className="text-xs font-semibold text-primary">{finalidade} · {tipo}</span>
          </div>

          <p className="text-sm text-muted-foreground mb-6 text-center">
            Como você deseja cadastrar este {contexto}?
          </p>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => onCompleteManual({ finalidade, tipo })}
              className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-card p-6 text-center shadow-sm transition-all hover:border-primary/50"
            >
              <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
                <LayoutGrid className="size-7 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-base font-semibold text-foreground mb-1">Preenchimento Manual</p>
                <p className="text-xs text-muted-foreground">Preencha os dados e informações você mesmo através do formulário completo.</p>
              </div>
            </button>

            <button
              onClick={() => setFase('upload')}
              className="flex flex-col items-center gap-3 rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 p-6 text-center shadow-md transition-all hover:border-primary"
            >
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/20">
                <Sparkles className="size-7 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-base font-semibold text-foreground mb-1">Cadastro com IA (Recomendado)</p>
                <p className="text-xs text-muted-foreground">Envie fotos e deixe o assistente virtual preencher os dados automaticamente.</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Fase Upload
  if (fase === 'upload') {
    return (
      <div className="flex flex-col h-full bg-background min-h-[400px]">
        <div className="flex items-center justify-between mb-5">
          <Button variant="ghost" size="icon" onClick={() => setFase('escolha_modo')} className="rounded-full">
            <ChevronLeft className="h-5 w-5 text-muted-foreground" />
          </Button>
          <h2 className="font-serif text-xl font-semibold text-foreground">Captar {contexto} com IA</h2>
          <div className="w-10" />
        </div>

        <div className="max-w-md mx-auto w-full">
          {/* Banner IA */}
          <div className="mb-5 flex items-start gap-3 rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-4 text-primary-foreground shadow-lg">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
              <Sparkles className="size-5" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-semibold">Cadastro inteligente com IA</p>
              <p className="mt-0.5 text-xs text-primary-foreground/80">
                Arraste ou envie as fotos do {contexto} e a IA preenche automaticamente: área, valor estimado, descrição e características.
              </p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                const files = Array.from(e.target.files);
                const novasFotos = files.map(file => ({
                  id: Math.random().toString(),
                  url: URL.createObjectURL(file),
                  rotacao: 0
                }));
                setFotos([...fotos, ...novasFotos]);
              }
            }}
          />

          {fotos.length === 0 ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex h-[320px] w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors"
            >
              <div className="flex size-16 items-center justify-center rounded-full bg-primary/20 text-primary">
                <Camera className="size-8" strokeWidth={1.5} />
              </div>
              <p className="mt-4 font-serif text-lg font-semibold text-foreground">
                Adicionar fotos
              </p>
              <p className="mt-1 text-center text-sm text-muted-foreground">
                Clique aqui para escolher as fotos <br/> ou arraste-as para esta área
              </p>
            </button>
          ) : (
            <div className="flex h-[320px] w-full flex-col rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="grid grid-cols-2 gap-2 p-2 h-[calc(100%-64px)] overflow-y-auto">
                {fotos.map((foto, i) => (
                  <div key={foto.id} className="relative h-32 w-full overflow-hidden rounded-2xl bg-muted">
                    <img src={foto.url} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />
                  </div>
                ))}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col h-32 items-center justify-center rounded-2xl border-2 border-dashed border-border text-muted-foreground hover:bg-muted/50 transition-colors"
                >
                  <Camera className="size-5" strokeWidth={1.5} />
                  <span className="text-[10px] mt-1 font-semibold">Adicionar mais</span>
                </button>
              </div>
              <div className="p-4 bg-muted/30 border-t border-border flex justify-between items-center h-16 shrink-0">
                <div>
                  <p className="font-semibold text-sm text-foreground">
                    {fotos.length} foto{fotos.length > 1 ? 's' : ''} selecionada{fotos.length > 1 ? 's' : ''}
                  </p>
                </div>
                <Button 
                  size="sm" 
                  className="rounded-xl px-4"
                  onClick={() => {
                    setFase('analisando');
                    
                    // Simular progresso da IA
                    let p = 0;
                    setProgressoTexto('Identificando imagens...');
                    const interval = setInterval(() => {
                      p += Math.floor(Math.random() * 10) + 5;
                      if (p > 100) p = 100;
                      setProgresso(p);
                      
                      if (p > 25 && p <= 50) setProgressoTexto('Extraindo características...');
                      if (p > 50 && p <= 75) setProgressoTexto('Criando descrição criativa...');
                      if (p > 75 && p < 100) setProgressoTexto('Finalizando análise...');
                      
                      if (p === 100) {
                        clearInterval(interval);
                        setTimeout(() => setFase('resultado'), 500);
                      }
                    }, 400);
                  }}
                >
                  Analisar Imagens
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 4. Fase Analisando
  if (fase === 'analisando') {
    return (
      <div className="flex flex-col h-full bg-background min-h-[400px] items-center justify-center py-8 text-center max-w-sm mx-auto">
        <div className="relative flex size-24 items-center justify-center rounded-3xl bg-primary/10">
          <svg className="absolute inset-0 size-24 -rotate-90" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r="44" fill="none" stroke="hsl(var(--border))" strokeWidth="4" />
            <circle
              cx="48" cy="48" r="44"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 44}`}
              strokeDashoffset={`${2 * Math.PI * 44 * (1 - progresso / 100)}`}
              className="transition-all duration-500"
            />
          </svg>
          <Sparkles className="size-10 text-primary" strokeWidth={1.5} />
        </div>

        <p className="mt-6 font-serif text-xl font-semibold text-foreground">IA analisando {contexto}</p>
        <p className="mt-2 text-sm text-muted-foreground">{progressoTexto || 'Iniciando análise...'}</p>
        
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary border border-primary/20">
          <Sparkles className="size-3 text-primary animate-pulse" />
          Contexto = {contexto.charAt(0).toUpperCase() + contexto.slice(1)} {finalidade} - {tipo}
        </div>

        <div className="mt-8 w-full">
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progresso}%` }}
            />
          </div>
          <p className="mt-2 font-mono text-xs text-muted-foreground">{progresso}%</p>
        </div>
        
        <div className="mt-6 flex justify-center gap-2 flex-wrap">
          {fotos.slice(0, 4).map((foto, i) => (
            <div key={i} className={`relative size-14 overflow-hidden rounded-xl transition-all duration-700 ${progresso > i * 25 ? 'opacity-100 ring-2 ring-primary' : 'opacity-40 grayscale'}`}>
              <img src={foto.url} alt="" className="h-full w-full object-cover" />
              {progresso > (i + 1) * 25 && (
                <div className="absolute inset-0 flex items-center justify-center bg-primary/40 backdrop-blur-[1px]">
                  <CheckCircle2 className="size-5 text-white" strokeWidth={2} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 5. Fase Resultado
  if (fase === 'resultado') {
    // Dados simulados gerados pela IA
    const resultadoIA = {
      finalidade,
      tipo,
      titulo: `${tipo} de alto padrão reformado`,
      descricao: `Excelente ${tipo.toLowerCase()} ${finalidade.toLowerCase()} recém reformado, com acabamentos premium e projeto de iluminação natural incrível. Possui living amplo e integrado, oferecendo o máximo de conforto para a família.`,
      quartos: tipo.includes('Studio') || tipo.includes('Kitnet') ? '1' : '3',
      vagas: tipo.includes('Comercial') ? '0' : '2',
      areaUtil: tipo.includes('Casa') ? '250' : '90',
      valorVenda: 'R$ 850.000',
      caracteristicas: ['Acabamento Alto Padrão', 'Iluminação Natural', 'Reformado']
    };

    return (
      <div className="flex flex-col h-full bg-background min-h-[400px]">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-xl font-semibold text-foreground">Resultado da IA</h2>
          <div className="w-8" />
        </div>

        <div className="max-w-md mx-auto w-full">
          <div className="mb-6 rounded-2xl bg-card border border-primary/30 shadow-md p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-sm">Informações detectadas</h3>
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Título Sugerido</p>
              <p className="text-sm font-medium">{resultadoIA.titulo}</p>
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Descritivo (Gerado)</p>
              <p className="text-sm text-foreground/80 line-clamp-3">{resultadoIA.descricao}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-muted rounded-xl p-3">
                <p className="text-xs text-muted-foreground font-bold mb-1">Estrutura</p>
                <p className="text-sm font-semibold">{resultadoIA.quartos} Dorm(s) • {resultadoIA.vagas} Vaga(s)</p>
              </div>
              <div className="bg-muted rounded-xl p-3">
                <p className="text-xs text-muted-foreground font-bold mb-1">Área Útil</p>
                <p className="text-sm font-semibold">{resultadoIA.areaUtil} m²</p>
              </div>
            </div>
          </div>
          
          <p className="text-center text-xs text-muted-foreground mb-4">
            Você poderá revisar e editar todas as informações no próximo passo.
          </p>

          <Button 
            className="w-full h-12 rounded-2xl font-bold shadow-lg shadow-primary/20"
            onClick={() => onCompleteIA(resultadoIA)}
          >
            Aplicar ao Formulário
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
