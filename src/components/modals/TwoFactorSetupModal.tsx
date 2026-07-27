import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Smartphone, Check, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TwoFactorSetupModalProps {
  open: boolean;
  onClose: () => void;
}

export function TwoFactorSetupModal({ open, onClose }: TwoFactorSetupModalProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState('');
  const [secretKey] = useState('JBSWY3DPEHPK3PXP'); // Simulação de chave secreta

  const handleCopySecret = () => {
    navigator.clipboard.writeText(secretKey);
    toast({
      title: "Chave copiada!",
      description: "A chave secreta foi copiada para a área de transferência.",
      variant: "success",
    });
  };

  const handleVerifyCode = () => {
    if (verificationCode === '123456') { // Simulação de código válido
      toast({
        title: "2FA ativado com sucesso!",
        description: "A autenticação de dois fatores foi configurada em sua conta.",
        variant: "success",
      });
      setStep(3);
      setTimeout(() => {
        onClose();
        setStep(1);
        setVerificationCode('');
      }, 2000);
    } else {
      toast({
        title: "Código inválido",
        description: "Verifique o código e tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="text-lg">Configurar Autenticação de Dois Fatores</DialogTitle>
          </div>
          <DialogDescription className="text-gray-600 mt-2">
            {step === 1 && "Adicione uma camada extra de segurança à sua conta"}
            {step === 2 && "Verifique o código do seu aplicativo autenticador"}
            {step === 3 && "2FA configurado com sucesso!"}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-medium">1. Instale um aplicativo autenticador</h3>
                  <p className="text-sm text-muted-foreground">
                    Use Google Authenticator, Authy, Microsoft Authenticator ou similar
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-medium">2. Digite o código</h3>
                  <p className="text-sm text-muted-foreground">
                    Digite o código de 6 dígitos do seu aplicativo
                  </p>
                </div>
              </div>
            </div>

            <Card className="p-4">
              <CardContent className="space-y-4">
                <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Smartphone className="h-16 w-16 mx-auto mb-2 text-gray-400" />
                    <p className="text-xs text-gray-500">Configure manualmente</p>
                    <p className="text-xs text-gray-400 mt-1">Use o código fornecido</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Ou insira manualmente:</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      value={secretKey} 
                      readOnly 
                      className="font-mono text-sm"
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={handleCopySecret}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={() => setStep(2)} 
              className="w-full"
            >
              Próximo
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Código de verificação</Label>
              <p className="text-sm text-muted-foreground">
                Digite o código de 6 dígitos do seu aplicativo autenticador
              </p>
              <Input
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="text-center text-2xl tracking-tight font-mono"
                maxLength={6}
              />
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setStep(1)}
                className="flex-1"
              >
                Voltar
              </Button>
              <Button 
                onClick={handleVerifyCode}
                disabled={verificationCode.length !== 6}
                className="flex-1"
              >
                Verificar
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-lg">2FA Ativado!</h3>
                <p className="text-sm text-muted-foreground">
                  Sua conta agora está protegida com autenticação de dois fatores
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Importante:</strong> Guarde seu código de backup em um local seguro.
                Você precisará dele caso perca acesso ao seu aplicativo autenticador.
              </p>
            </div>

            <Button onClick={() => onClose()} className="w-full">
              Concluir
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
