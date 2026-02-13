import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export const RecuperarSenha: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Por favor, informe seu email');
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Por favor, informe um email válido');
      return;
    }

    setIsLoading(true);

    try {
      // Simulação de envio de email
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsEmailSent(true);
      toast.success('Email de recuperação enviado com sucesso!');
      
      // Redirecionar para página de verificação após 3 segundos
      setTimeout(() => {
        navigate('/verificar-codigo');
      }, 3000);
      
    } catch (error) {
      toast.error('Erro ao enviar email. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Lado Esquerdo - Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="mb-8">
            <div className="w-32 h-32 bg-white bg-opacity-10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Mail className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-center">
            Recupere sua senha
          </h1>
          <p className="text-xl text-center max-w-md">
            Não se preocupe! Enviaremos um link para seu email para você redefinir sua senha
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
              {isEmailSent ? 'Email enviado!' : 'Recuperar senha'}
            </h2>
            <p className="text-gray-600">
              {isEmailSent 
                ? 'Verifique sua caixa de entrada'
                : 'Digite seu email para receber as instruções'
              }
            </p>
          </div>

          {!isEmailSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="seu@email.com"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isLoading ? 'Enviando...' : 'Enviar email de recuperação'}
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-gray-600 mb-6">
                Enviamos as instruções para <strong>{email}</strong>
              </p>
              <p className="text-sm text-gray-500">
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
