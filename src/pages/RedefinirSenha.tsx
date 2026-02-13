import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const RedefinirSenha: React.FC = () => {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const validarForcaSenha = (senha: string) => {
    const requisitos = {
      comprimento: senha.length >= 8,
      maiuscula: /[A-Z]/.test(senha),
      minuscula: /[a-z]/.test(senha),
      numero: /\d/.test(senha),
      especial: /[!@#$%^&*(),.?":{}|<>]/.test(senha)
    };

    const pontos = Object.values(requisitos).filter(Boolean).length;
    
    return {
      requisitos,
      forca: pontos <= 2 ? 'fraca' : pontos <= 4 ? 'media' : 'forte',
      pontos
    };
  };

  const forcaSenha = validarForcaSenha(novaSenha);

  const getCorForca = (forca: string) => {
    switch (forca) {
      case 'fraca': return 'text-red-500';
      case 'media': return 'text-yellow-500';
      case 'forte': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getCorBarra = (forca: string) => {
    switch (forca) {
      case 'fraca': return 'bg-red-500';
      case 'media': return 'bg-yellow-500';
      case 'forte': return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!novaSenha || !confirmarSenha) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    if (novaSenha.length < 8) {
      toast.error('A senha deve ter pelo menos 8 caracteres');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (forcaSenha.forca === 'fraca') {
      toast.error('A senha é muito fraca. Adicione mais caracteres, números ou símbolos');
      return;
    }

    setIsLoading(true);

    try {
      // Simulação de redefinição
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSuccess(true);
      toast.success('Senha redefinida com sucesso!');
      
      // Redirecionar para login após 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error) {
      toast.error('Erro ao redefinir senha. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        {/* Lado Esquerdo - Hero */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
            <div className="mb-8">
              <div className="w-32 h-32 bg-white bg-opacity-10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <CheckCircle className="w-16 h-16 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4 text-center">
              Senha redefinida!
            </h1>
            <p className="text-xl text-center max-w-md">
              Sua senha foi atualizada com sucesso
            </p>
          </div>
        </div>

        {/* Lado Direito - Sucesso */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Senha redefinida!
            </h2>
            <p className="text-gray-600 mb-8">
              Sua senha foi alterada com sucesso. Você já pode fazer login com sua nova senha.
            </p>
            <p className="text-sm text-gray-500">
              Redirecionando para a página de login...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Lado Esquerdo - Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="mb-8">
            <div className="w-32 h-32 bg-white bg-opacity-10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Lock className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-center">
            Redefinir senha
          </h1>
          <p className="text-xl text-center max-w-md">
            Crie uma nova senha segura para sua conta
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
              Nova senha
            </h2>
            <p className="text-gray-600">
              Digite sua nova senha abaixo
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="novaSenha" className="block text-sm font-medium text-gray-700 mb-2">
                Nova senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="novaSenha"
                  type={showNovaSenha ? "text" : "password"}
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Digite sua nova senha"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowNovaSenha(!showNovaSenha)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showNovaSenha ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
              
              {/* Indicador de força da senha */}
              {novaSenha && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Força da senha:</span>
                    <span className={`text-xs font-medium ${getCorForca(forcaSenha.forca)}`}>
                      {forcaSenha.forca.charAt(0).toUpperCase() + forcaSenha.forca.slice(1)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getCorBarra(forcaSenha.forca)}`}
                      style={{ width: `${(forcaSenha.pontos / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Requisitos da senha */}
              <div className="mt-3 space-y-1">
                <div className="flex items-center text-xs">
                  {forcaSenha.requisitos.comprimento ? (
                    <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                  ) : (
                    <AlertCircle className="w-3 h-3 text-gray-400 mr-1" />
                  )}
                  <span className={forcaSenha.requisitos.comprimento ? 'text-green-600' : 'text-gray-500'}>
                    Pelo menos 8 caracteres
                  </span>
                </div>
                <div className="flex items-center text-xs">
                  {forcaSenha.requisitos.maiuscula ? (
                    <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                  ) : (
                    <AlertCircle className="w-3 h-3 text-gray-400 mr-1" />
                  )}
                  <span className={forcaSenha.requisitos.maiuscula ? 'text-green-600' : 'text-gray-500'}>
                    Uma letra maiúscula
                  </span>
                </div>
                <div className="flex items-center text-xs">
                  {forcaSenha.requisitos.numero ? (
                    <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                  ) : (
                    <AlertCircle className="w-3 h-3 text-gray-400 mr-1" />
                  )}
                  <span className={forcaSenha.requisitos.numero ? 'text-green-600' : 'text-gray-500'}>
                    Um número
                  </span>
                </div>
                <div className="flex items-center text-xs">
                  {forcaSenha.requisitos.especial ? (
                    <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                  ) : (
                    <AlertCircle className="w-3 h-3 text-gray-400 mr-1" />
                  )}
                  <span className={forcaSenha.requisitos.especial ? 'text-green-600' : 'text-gray-500'}>
                    Um caractere especial
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar nova senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmarSenha"
                  type={showConfirmarSenha ? "text" : "password"}
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Confirme sua nova senha"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmarSenha ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
              
              {/* Indicador de correspondência */}
              {confirmarSenha && (
                <div className="mt-1">
                  {novaSenha === confirmarSenha ? (
                    <p className="text-xs text-green-600 flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      As senhas coincidem
                    </p>
                  ) : (
                    <p className="text-xs text-red-600 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      As senhas não coincidem
                    </p>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !novaSenha || !confirmarSenha || novaSenha !== confirmarSenha}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? 'Redefinindo...' : 'Redefinir senha'}
            </button>
          </form>

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
