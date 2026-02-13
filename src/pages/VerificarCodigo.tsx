import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, RefreshCw, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export const VerificarCodigo: React.FC = () => {
  const [codigo, setCodigo] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(60);
  const navigate = useNavigate();

  // Countdown timer para reenviar código
  React.useEffect(() => {
    if (tempoRestante > 0) {
      const timer = setTimeout(() => setTempoRestante(tempoRestante - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [tempoRestante]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return; // Apenas um caractere por input
    
    const novoCodigo = [...codigo];
    novoCodigo[index] = value;
    setCodigo(novoCodigo);

    // Auto-focus no próximo input
    if (value && index < 5) {
      const nextInput = document.getElementById(`codigo-${index + 1}`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Voltar para o input anterior ao pressionar Backspace
    if (e.key === 'Backspace' && !codigo[index] && index > 0) {
      const prevInput = document.getElementById(`codigo-${index - 1}`) as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (/^\d+$/.test(pastedData)) {
      const novoCodigo = pastedData.split('');
      while (novoCodigo.length < 6) {
        novoCodigo.push('');
      }
      setCodigo(novoCodigo);
      
      // Focar no último input preenchido
      const lastIndex = novoCodigo.findIndex(char => char === '') - 1;
      if (lastIndex >= 0 && lastIndex < 6) {
        const lastInput = document.getElementById(`codigo-${lastIndex}`) as HTMLInputElement;
        if (lastInput) lastInput.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const codigoCompleto = codigo.join('');
    if (codigoCompleto.length !== 6) {
      toast.error('Por favor, digite o código completo de 6 dígitos');
      return;
    }

    if (!/^\d{6}$/.test(codigoCompleto)) {
      toast.error('O código deve conter apenas números');
      return;
    }

    setIsLoading(true);

    try {
      // Simulação de verificação
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulação: código "123456" é válido
      if (codigoCompleto === '123456') {
        setIsVerified(true);
        toast.success('Código verificado com sucesso!');
        
        // Redirecionar para página de redefinição após 2 segundos
        setTimeout(() => {
          navigate('/redefinir-senha');
        }, 2000);
      } else {
        toast.error('Código inválido. Verifique e tente novamente.');
      }
    } catch (error) {
      toast.error('Erro ao verificar código. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (tempoRestante > 0) return;

    try {
      // Simulação de reenvio
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTempoRestante(60);
      setCodigo(['', '', '', '', '', '']);
      toast.success('Novo código enviado para seu email!');
    } catch (error) {
      toast.error('Erro ao reenviar código. Tente novamente.');
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const formatarTempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Lado Esquerdo - Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="mb-8">
            <div className="w-32 h-32 bg-white bg-opacity-10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Shield className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-center">
            Verifique seu código
          </h1>
          <p className="text-xl text-center max-w-md">
            Digite o código de 6 dígitos que enviamos para seu email
          </p>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Botão Voltar */}
          <button
            onClick={handleBackToLogin}
            className="flex items-center text-gray-600 hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o login
          </button>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isVerified ? 'Código verificado!' : 'Verificar código'}
            </h2>
            <p className="text-gray-600">
              {isVerified 
                ? 'Redirecionando para redefinir senha...'
                : 'Enviamos um código para seu email'
              }
            </p>
          </div>

          {!isVerified ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Código de verificação
                </label>
                <div className="flex justify-center gap-2" onPaste={handlePaste}>
                  {codigo.map((digito, index) => (
                    <input
                      key={index}
                      id={`codigo-${index}`}
                      type="text"
                      value={digito}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      maxLength={1}
                      disabled={isLoading}
                    />
                  ))}
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Não recebeu o código?
                </p>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={tempoRestante > 0 || isLoading}
                  className="text-primary hover:text-primary/90 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${tempoRestante > 0 ? '' : 'animate-spin'}`} />
                  {tempoRestante > 0 
                    ? `Reenviar em ${formatarTempo(tempoRestante)}` 
                    : 'Reenviar código'
                  }
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isLoading ? 'Verificando...' : 'Verificar código'}
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-gray-600">
                Código verificado com sucesso!
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Redirecionando para a próxima etapa...
              </p>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Lembrou sua senha?{' '}
              <button
                onClick={handleBackToLogin}
                className="text-primary hover:text-primary/90 font-medium"
              >
                Voltar para o login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
