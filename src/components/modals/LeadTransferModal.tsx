import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Users, UserCheck } from 'lucide-react';

interface LeadTransferModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (newAgent: string) => void;
  leadName: string;
  currentAgent: string;
  sourceStage: string;
  destStage: string;
}

const AGENTS = [
  { id: 'JS', name: 'João Silva', avatar: 'JS', color: 'bg-blue-500' },
  { id: 'MR', name: 'Maria Rocha', avatar: 'MR', color: 'bg-pink-500' },
  { id: 'PC', name: 'Pedro Costa', avatar: 'PC', color: 'bg-green-500' },
];

export function LeadTransferModal({
  open,
  onClose,
  onConfirm,
  leadName,
  currentAgent,
  sourceStage,
  destStage
}: LeadTransferModalProps) {
  const [selectedAgent, setSelectedAgent] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const currentAgentData = AGENTS.find(agent => agent.id === currentAgent);
  const selectedAgentData = AGENTS.find(agent => agent.id === selectedAgent);

  const handleConfirm = () => {
    if (!selectedAgent) return;
    
    setIsAnimating(true);
    
    // Simula animação de transferência
    setTimeout(() => {
      onConfirm(selectedAgent);
      setIsAnimating(false);
      onClose();
      setSelectedAgent('');
    }, 1500);
  };

  const handleCancel = () => {
    onClose();
    setSelectedAgent('');
    setIsAnimating(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            Transferência de Lead
          </DialogTitle>
          <DialogDescription>
            O lead <strong>{leadName}</strong> está sendo movido entre corretores diferentes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Animação de Transferência */}
          {isAnimating && (
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center gap-4">
                {/* Corretor Atual */}
                <div className={`text-center ${isAnimating ? 'scale-95 opacity-50' : ''}`}>
                  <div className={`w-12 h-12 rounded-full ${currentAgentData?.color} text-white flex items-center justify-center font-bold mb-2`}>
                    {currentAgentData?.avatar}
                  </div>
                  <p className="text-sm font-medium">{currentAgentData?.name}</p>
                </div>

                {/* Seta Animada */}
                <div className="flex flex-col items-center">
                  <ArrowRight className={`h-6 w-6 text-blue-500 ${isAnimating ? 'animate-bounce' : ''}`} />
                  <div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mt-1"></div>
                </div>

                {/* Novo Corretor */}
                <div className={`text-center ${isAnimating ? 'scale-110 opacity-100' : ''}`}>
                  <div className={`w-12 h-12 rounded-full ${selectedAgentData?.color} text-white flex items-center justify-center font-bold mb-2`}>
                    {selectedAgentData?.avatar}
                  </div>
                  <p className="text-sm font-medium">{selectedAgentData?.name}</p>
                </div>
              </div>
            </div>
          )}

          {/* Informações da Transferência */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Corretor atual:</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {currentAgentData?.name}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-gray-400" />
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Novo corretor:
              </label>
              <Select value={selectedAgent} onValueChange={setSelectedAgent} disabled={isAnimating}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o novo corretor" />
                </SelectTrigger>
                <SelectContent>
                  {AGENTS.filter(agent => agent.id !== currentAgent).map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full ${agent.color} text-white flex items-center justify-center text-xs font-bold`}>
                          {agent.avatar}
                        </div>
                        <span>{agent.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Informações dos Estágios */}
            <div className="flex items-center gap-2 text-xs text-gray-500 p-2 bg-gray-50 rounded">
              <span>{sourceStage}</span>
              <ArrowRight className="h-3 w-3" />
              <span>{destStage}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isAnimating}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedAgent || isAnimating}
            className="flex-1"
          >
            {isAnimating ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Transferindo...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Confirmar Transferência
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
