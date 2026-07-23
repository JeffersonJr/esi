import { useState, useRef } from 'react';
import { Trophy, Calendar, Bot, Loader2, Mic, Flame, X, CheckCircle } from 'lucide-react';

export function RoletaModal({
  atividades,
  onClose,
  onConcluirTarefa,
  onPularTarefa
}: {
  atividades: any[];
  onClose: () => void;
  onConcluirTarefa: (tarefaId: string, feedback?: string) => void;
  onPularTarefa: (tarefaId: string) => void;
}) {
  const [indiceRoleta, setIndiceRoleta] = useState(0);
  const [roletaFinalizada, setRoletaFinalizada] = useState(false);
  const [roletaAtividades] = useState(atividades);
  const [feedbackAudioRoleta, setFeedbackAudioRoleta] = useState('');
  const [gravandoAudioRoleta, setGravandoAudioRoleta] = useState(false);
  const [timerAudioRoleta, setTimerAudioRoleta] = useState(0);
  const [roletaEfeitoFrup, setRoletaEfeitoFrup] = useState(false);
  const [historicoRoleta, setHistoricoRoleta] = useState<{tarefa: any, acao: 'concluido' | 'pulado' | 'remarcado'}[]>([]);
  
  const [remarcarAtividade, setRemarcarAtividade] = useState<any>(null);
  const [novaDataRemarcar, setNovaDataRemarcar] = useState('');
  const [novaHoraRemarcar, setNovaHoraRemarcar] = useState('');
  
  const [acaoAlbertRoleta, setAcaoAlbertRoleta] = useState<any>(null);
  const [textoAlbertRoleta, setTextoAlbertRoleta] = useState('');
  const [albertVozRoleta, setAlbertVozRoleta] = useState<'idle' | 'gravando' | 'processando'>('idle');
  const [albertVozTimerRoleta, setAlbertVozTimerRoleta] = useState(0);
  const albertVozIntervalRef = useRef<any>(null);
  const [swipeExitDirection, setSwipeExitDirection] = useState<'left' | 'right' | 'up' | null>(null);

  function toggleAudioRoleta() {
    if (gravandoAudioRoleta) {
      setGravandoAudioRoleta(false);
      if ((window as any).roletaAudioInterval) clearInterval((window as any).roletaAudioInterval);
      setFeedbackAudioRoleta("Tarefa executada com sucesso. Cliente confirmou interesse.");
    } else {
      setGravandoAudioRoleta(true);
      setTimerAudioRoleta(0);
      const timer = setInterval(() => {
        setTimerAudioRoleta(t => t + 1);
      }, 1000);
      (window as any).roletaAudioInterval = timer;
    }
  }

  function concluirTarefaRoleta() {
    if (roletaAtividades.length === 0) return;
    const currentTask = roletaAtividades[indiceRoleta];
    
    onConcluirTarefa(currentTask.id, feedbackAudioRoleta);
    setHistoricoRoleta(prev => [...prev, { tarefa: currentTask, acao: 'concluido' }]);

    setSwipeExitDirection('right');
    setRoletaEfeitoFrup(true);
    setTimeout(() => {
      setRoletaEfeitoFrup(false);
      setSwipeExitDirection(null);
      setFeedbackAudioRoleta('');
      
      const nextIndex = indiceRoleta + 1;
      if (nextIndex >= roletaAtividades.length) {
        setRoletaFinalizada(true);
      } else {
        setIndiceRoleta(nextIndex);
      }
    }, 300);
  }

  function pularTarefaRoleta() {
    if (roletaAtividades.length === 0) return;
    const currentTask = roletaAtividades[indiceRoleta];
    
    onPularTarefa(currentTask.id);
    setHistoricoRoleta(prev => [...prev, { tarefa: currentTask, acao: 'pulado' }]);

    setSwipeExitDirection('left');
    setRoletaEfeitoFrup(true);
    setTimeout(() => {
      setRoletaEfeitoFrup(false);
      setSwipeExitDirection(null);
      setFeedbackAudioRoleta('');
      
      const nextIndex = indiceRoleta + 1;
      if (nextIndex >= roletaAtividades.length) {
        setRoletaFinalizada(true);
      } else {
        setIndiceRoleta(nextIndex);
      }
    }, 300);
  }

  function confirmarRemarcar() {
    if (!remarcarAtividade) return;
    setHistoricoRoleta(prev => [...prev, { tarefa: remarcarAtividade, acao: 'remarcado' }]);
    
    setSwipeExitDirection('up');
    setRoletaEfeitoFrup(true);
    setTimeout(() => {
      setRoletaEfeitoFrup(false);
      setSwipeExitDirection(null);
      setRemarcarAtividade(null);
      
      const nextIndex = indiceRoleta + 1;
      if (nextIndex >= roletaAtividades.length) {
        setRoletaFinalizada(true);
      } else {
        setIndiceRoleta(nextIndex);
      }
    }, 300);
  }

  function formatTime(secs: number) {
    const minutes = Math.floor(secs / 60)
    const seconds = secs % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col animate-in fade-in duration-300">
      <div className="flex justify-end p-4 absolute top-0 right-0 w-full z-50">
        <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
          <X className="w-6 h-6 text-slate-500" />
        </button>
      </div>

      {/* Área Principal de Cartões */}
      <div className="flex-1 p-6 flex flex-col justify-center items-center relative overflow-hidden bg-gradient-to-b from-primary/5 to-background">
        {roletaFinalizada ? (
          <div className="flex flex-col items-center text-center p-6 max-w-md animate-in zoom-in-95 duration-500">
            <div className="relative mb-6">
              <div className="absolute inset-0 size-24 bg-amber-500/20 rounded-full blur-xl animate-pulse" />
              <div className="relative flex size-24 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 border-2 border-amber-500">
                <Trophy className="size-12 animate-bounce" />
              </div>
            </div>
            <h3 className="font-serif text-2xl font-black text-foreground mb-3">Mesa Limpa, Guerreiro!</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Você passou por todas as tarefas da pilha. Veja o seu resumo:
            </p>
            <ul className="w-full mb-6 flex flex-col gap-2 max-h-48 overflow-y-auto">
              {historicoRoleta.map((h, i) => (
                <li key={i} className="flex items-center justify-between bg-background p-2 rounded-xl border border-border/50">
                  <span className="text-xs font-semibold text-foreground truncate flex-1 text-left">{h.tarefa.title || h.tarefa.titulo || 'Tarefa'}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${h.acao === 'concluido' ? 'bg-green-500/10 text-green-600' : h.acao === 'remarcado' ? 'bg-blue-500/10 text-blue-600' : 'bg-muted text-muted-foreground'}`}>
                    {h.acao === 'concluido' ? 'Concluído' : h.acao === 'remarcado' ? 'Remarcado' : 'Pulado'}
                  </span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={onClose}
              className="w-full h-12 rounded-2xl bg-primary text-primary-foreground text-sm font-bold shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Finalizar
            </button>
          </div>
        ) : (
          remarcarAtividade ? (
            <div className="relative w-full max-w-md flex justify-center">
              <div className={`w-full max-w-md bg-card border-2 border-primary/50 rounded-3xl shadow-2xl p-6 flex flex-col gap-5 transition-all duration-300 ${roletaEfeitoFrup ? 'opacity-0 -translate-y-[150%] pointer-events-none' : 'animate-in zoom-in-95 duration-300'}`}>
                <div className="flex items-center gap-3 text-primary mb-2">
                  <Calendar className="size-6" />
                  <h3 className="font-serif text-xl font-bold">Remarcar Tarefa</h3>
                </div>
                <p className="text-sm font-semibold text-foreground mb-4">
                  {remarcarAtividade.title || remarcarAtividade.titulo}
                </p>
                
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button type="button" onClick={() => {
                    const d = new Date(); d.setDate(d.getDate() + 1);
                    setNovaDataRemarcar(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`);
                  }} className="h-10 rounded-xl border border-border bg-background text-xs font-semibold text-muted-foreground hover:bg-muted active:scale-95 transition-all">
                    Amanhã
                  </button>
                  <button type="button" onClick={() => {
                    const d = new Date(); d.setDate(d.getDate() + 7);
                    setNovaDataRemarcar(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`);
                  }} className="h-10 rounded-xl border border-border bg-background text-xs font-semibold text-muted-foreground hover:bg-muted active:scale-95 transition-all">
                    Semana que vem
                  </button>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Data Exata</label>
                  <input
                    type="date"
                    value={novaDataRemarcar}
                    onChange={(e) => setNovaDataRemarcar(e.target.value)}
                    className="h-12 w-full rounded-2xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Nova Hora</label>
                  <input
                    type="time"
                    value={novaHoraRemarcar}
                    onChange={(e) => setNovaHoraRemarcar(e.target.value)}
                    className="h-12 w-full rounded-2xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setRemarcarAtividade(null)
                      setNovaDataRemarcar('')
                      setNovaHoraRemarcar('')
                    }}
                    className="flex-1 h-12 rounded-2xl border border-border bg-card text-muted-foreground text-xs font-bold transition-all active:scale-95"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={confirmarRemarcar}
                    disabled={!novaDataRemarcar || !novaHoraRemarcar}
                    className="flex-[2] h-12 rounded-2xl bg-primary text-primary-foreground text-xs font-bold transition-all active:scale-95 disabled:opacity-50"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          ) : acaoAlbertRoleta ? (
            <div className="relative w-full max-w-md flex justify-center">
              <div className={`w-full max-w-md bg-card border-2 border-primary/50 rounded-3xl shadow-2xl p-6 flex flex-col gap-5 transition-all duration-300 ${roletaEfeitoFrup ? 'opacity-0 -translate-y-[150%] pointer-events-none' : 'animate-in zoom-in-95 duration-300'}`}>
                <div className="flex items-center gap-3 text-primary mb-2">
                  <Bot className="size-6" />
                  <h3 className="font-serif text-xl font-bold">Ação com Albert</h3>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {acaoAlbertRoleta.cliente || 'Cliente'}
                </p>
                
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">O que o Albert deve fazer?</label>
                    <button
                      type="button"
                      disabled={albertVozRoleta !== 'idle'}
                      onClick={() => {
                        setAlbertVozRoleta('gravando')
                        setAlbertVozTimerRoleta(0)
                        let count = 0
                        albertVozIntervalRef.current = setInterval(() => {
                          count++
                          setAlbertVozTimerRoleta(count)
                          if (count >= 3) {
                            clearInterval(albertVozIntervalRef.current)
                            setAlbertVozRoleta('processando')
                            setTimeout(() => {
                              setTextoAlbertRoleta('Diga para o cliente que tentei contato mas não foi possível falar agora. Solicite que ele me ligue de volta no período da tarde.')
                              setAlbertVozRoleta('idle')
                            }, 1500)
                          }
                        }, 1000)
                      }}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all active:scale-95 ${
                        albertVozRoleta === 'gravando' ? 'bg-red-500 text-white animate-pulse' :
                        albertVozRoleta === 'processando' ? 'bg-primary/20 text-primary' :
                        'bg-primary/10 text-primary hover:bg-primary/20'
                      }`}
                    >
                      {albertVozRoleta === 'processando' ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <Mic className={`size-3 ${albertVozRoleta === 'gravando' ? 'animate-pulse' : ''}`} />
                      )}
                      {albertVozRoleta === 'gravando' ? `Gravando ${albertVozTimerRoleta}s` : albertVozRoleta === 'processando' ? 'Transcrevendo...' : 'Gravar voz'}
                    </button>
                  </div>
                  <div className="relative">
                    <textarea
                      value={textoAlbertRoleta}
                      onChange={(e) => setTextoAlbertRoleta(e.target.value)}
                      placeholder="Ex: Diga que eu liguei e vou retornar mais tarde."
                      className={`h-28 w-full resize-none rounded-2xl border bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                        albertVozRoleta === 'gravando' ? 'border-red-400 ring-2 ring-red-400/30' :
                        albertVozRoleta === 'processando' ? 'border-primary/50 ring-2 ring-primary/20' :
                        'border-border'
                      }`}
                    />
                    {albertVozRoleta === 'gravando' && (
                      <div className="absolute inset-0 rounded-2xl bg-red-500/5 pointer-events-none flex items-center justify-center">
                        <div className="size-16 rounded-full border-4 border-red-500/30 border-t-red-500 animate-spin" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setAcaoAlbertRoleta(null)
                      setTextoAlbertRoleta('')
                      setAlbertVozRoleta('idle')
                      if (albertVozIntervalRef.current) clearInterval(albertVozIntervalRef.current)
                    }}
                    className="flex-1 h-12 rounded-2xl border border-border bg-card text-muted-foreground text-xs font-bold transition-all active:scale-95"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    disabled={!textoAlbertRoleta.trim() || albertVozRoleta !== 'idle'}
                    onClick={() => {
                      concluirTarefaRoleta()
                    }}
                    className="flex-[2] h-12 rounded-2xl bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Bot className="size-4" />
                    Enviar Ação
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative w-full max-w-md h-[70vh] max-h-[600px] flex justify-center perspective-[1000px]">
              {roletaAtividades.map((tarefa, idx) => {
                const isCurrent = idx === indiceRoleta
                const isPast = idx < indiceRoleta
                const isNext = idx > indiceRoleta
                const offset = idx - indiceRoleta

                if (isPast) return null // Hide past tasks

                let transformStyle = ''
                let opacityStyle = 1
                let zIndex = 50 - offset

                if (isCurrent && roletaEfeitoFrup) {
                  const dirMultiplier = swipeExitDirection === 'left' ? -1 : swipeExitDirection === 'right' ? 1 : 0
                  const upMultiplier = swipeExitDirection === 'up' ? -1 : 0
                  
                  if (swipeExitDirection === 'up') {
                    transformStyle = `translateY(-150%) scale(0.9) rotate(5deg)`
                  } else {
                    transformStyle = `translateX(${dirMultiplier * 150}%) rotate(${dirMultiplier * 15}deg)`
                  }
                  opacityStyle = 0
                } else if (isNext) {
                  transformStyle = `translateY(${offset * 15}px) scale(${1 - offset * 0.05})`
                  opacityStyle = 1 - offset * 0.2
                } else {
                  transformStyle = `translateY(0) scale(1)`
                  opacityStyle = 1
                }

                if (offset > 3) return null // Only render top 3

                return (
                  <div
                    key={tarefa.id}
                    className="absolute w-full h-full bg-card rounded-[32px] shadow-2xl border-2 border-border/50 flex flex-col overflow-hidden transition-all duration-300 ease-out will-change-transform"
                    style={{
                      transform: transformStyle,
                      opacity: opacityStyle,
                      zIndex,
                    }}
                  >
                    {/* Top Section */}
                    <div className="bg-primary/5 p-6 flex flex-col items-center border-b border-border/50">
                      <div className="flex w-full items-center justify-between mb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                          {tarefa.tipo}
                        </span>
                        <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                          <Flame className="size-3 text-orange-500" />
                          {idx + 1} de {roletaAtividades.length}
                        </span>
                      </div>
                      
                      <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center text-4xl mb-4 border-4 border-background shadow-inner">
                        👤
                      </div>
                      <h2 className="font-serif text-2xl font-black text-foreground text-center line-clamp-1">
                        {tarefa.title || tarefa.titulo || 'Tarefa sem título'}
                      </h2>
                      <p className="text-sm font-semibold text-muted-foreground text-center mt-1">
                        {tarefa.cliente || 'Cliente'}
                      </p>
                    </div>

                    {/* Middle Section (Content) */}
                    <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto bg-background">
                      <div className="bg-muted/30 p-4 rounded-2xl border border-border/50">
                        <p className="text-sm text-foreground leading-relaxed">
                          {tarefa.descricao || tarefa.description || 'Sem detalhes'}
                        </p>
                      </div>

                      {/* Voice Recorder Inline */}
                      {isCurrent && (
                        <div className="mt-auto">
                          {feedbackAudioRoleta ? (
                            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-3 flex flex-col gap-2">
                              <span className="text-[10px] font-black text-green-600 uppercase tracking-wider flex items-center gap-1">
                                <CheckCircle className="size-3" /> Transcrição do Feedback
                              </span>
                              <p className="text-sm text-green-700 font-medium">"{feedbackAudioRoleta}"</p>
                              <button
                                onClick={() => setFeedbackAudioRoleta('')}
                                className="text-[10px] font-bold text-green-600 hover:underline self-end"
                              >
                                Apagar e gravar novamente
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={toggleAudioRoleta}
                              className={`w-full flex items-center justify-center gap-2 h-14 rounded-2xl border-2 transition-all active:scale-95 ${
                                gravandoAudioRoleta 
                                  ? 'border-red-500 bg-red-500/10 text-red-600 animate-pulse' 
                                  : 'border-border bg-card text-foreground hover:bg-muted'
                              }`}
                            >
                              <Mic className={`size-5 ${gravandoAudioRoleta ? 'animate-bounce' : ''}`} />
                              <span className="font-bold text-sm">
                                {gravandoAudioRoleta ? `Gravando... ${formatTime(timerAudioRoleta)} (Clique para parar)` : 'Registrar feedback por voz'}
                              </span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom Actions */}
                    <div className="p-4 bg-card border-t border-border/50 grid grid-cols-4 gap-2">
                      <button
                        title="Pular"
                        onClick={pularTarefaRoleta}
                        className="col-span-1 flex flex-col items-center justify-center h-16 rounded-2xl bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-all active:scale-95"
                      >
                        <X className="size-5 mb-1" />
                        <span className="text-[9px] font-black uppercase">Pular</span>
                      </button>
                      
                      <button
                        title="Remarcar"
                        onClick={() => setRemarcarAtividade(tarefa)}
                        className="col-span-1 flex flex-col items-center justify-center h-16 rounded-2xl bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 transition-all active:scale-95"
                      >
                        <Calendar className="size-5 mb-1" />
                        <span className="text-[9px] font-black uppercase">Adiar</span>
                      </button>

                      <button
                        title="Albert IA"
                        onClick={() => setAcaoAlbertRoleta(tarefa)}
                        className="col-span-1 flex flex-col items-center justify-center h-16 rounded-2xl bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 transition-all active:scale-95"
                      >
                        <Bot className="size-5 mb-1" />
                        <span className="text-[9px] font-black uppercase">IA</span>
                      </button>

                      <button
                        title="Concluir"
                        onClick={concluirTarefaRoleta}
                        className="col-span-1 flex flex-col items-center justify-center h-16 rounded-2xl bg-green-500 text-white shadow-lg shadow-green-500/30 hover:bg-green-600 transition-all active:scale-95"
                      >
                        <Flame className="size-5 mb-1" />
                        <span className="text-[9px] font-black uppercase">Feito</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}
