import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MessageCircle, Phone, Mail, FileText, Users, Star, Target, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface HistoricoAtendimento {
  id: string;
  data: string;
  tipo: 'ligacao' | 'email' | 'visita' | 'proposta' | 'reuniao' | 'whatsapp' | 'followup';
  descricao: string;
  usuario: string;
  resultado?: 'sucesso' | 'em_andamento' | 'fracasso' | 'agendado';
  proximoPasso?: string;
  editavel: boolean;
  tags?: string[];
  dataHora?: string;
  prioridade?: 'baixa' | 'media' | 'alta';
}

interface ActivityEditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (activity: HistoricoAtendimento) => void;
  activity?: HistoricoAtendimento;
  leadName: string;
  leadTags: string[];
}

const ACTIVITY_TYPES = [
  { id: 'ligacao', label: 'Ligação Telefônica', icon: Phone },
  { id: 'email', label: 'Envio de E-mail', icon: Mail },
  { id: 'visita', label: 'Visita ao Imóvel', icon: Calendar },
  { id: 'reuniao', label: 'Reunião Presencial', icon: Users },
  { id: 'proposta', label: 'Apresentar Proposta', icon: FileText },
  { id: 'whatsapp', label: 'Contato via WhatsApp', icon: MessageCircle },
  { id: 'followup', label: 'Follow-up', icon: Star }
];

const ACTIVITY_PRIORITIES: Array<{
  id: 'baixa' | 'media' | 'alta';
  label: string;
  color: string;
}> = [
  { id: 'baixa', label: 'Baixa', color: 'bg-gray-100 text-gray-700' },
  { id: 'media', label: 'Média', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'alta', label: 'Alta', color: 'bg-red-100 text-red-700' },
];

export function ActivityEditModal({
  open,
  onClose,
  onSave,
  activity,
  leadName,
  leadTags
}: ActivityEditModalProps) {
  const [formData, setFormData] = useState({
    tipo: (activity?.tipo as 'ligacao' | 'email' | 'visita' | 'proposta' | 'reuniao' | 'whatsapp' | 'followup') || 'ligacao',
    data: activity?.data ? new Date(activity.data) : new Date(),
    hora: activity?.dataHora ? activity.dataHora.split('T')[1] : '14:00',
    descricao: activity?.descricao || '',
    usuario: activity?.usuario || 'Usuário Atual',
    resultado: (activity?.resultado as 'sucesso' | 'em_andamento' | 'fracasso' | 'agendado') || 'em_andamento',
    proximoPasso: activity?.proximoPasso || '',
    editavel: activity?.editavel !== false,
    tags: activity?.tags || [],
    prioridade: (activity?.prioridade as 'baixa' | 'media' | 'alta') || 'media'
  });

  const [newTag, setNewTag] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);

  const handleSave = () => {
    const activityToSave = {
      ...formData,
      id: activity?.id || Date.now().toString(),
      data: new Date(formData.data).toISOString()
    };
    
    onSave(activityToSave);
    onClose();
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
      setShowTagInput(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            Detalhes da Atividade
          </DialogTitle>
          <DialogDescription>
            Registre os detalhes da atividade para o lead <strong>{leadName}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Atividade</Label>
              <Select value={formData.tipo} onValueChange={(value) => setFormData({...formData, tipo: value as 'ligacao' | 'email' | 'visita' | 'proposta' | 'reuniao' | 'whatsapp' | 'followup'})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {ACTIVITY_TYPES.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="data">Data</Label>
              <Input
                id="data"
                type="date"
                value={formData.data.toISOString().split('T')[0]}
                onChange={(e) => setFormData({...formData, data: new Date(e.target.value)})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hora">Hora</Label>
              <Input
                id="hora"
                type="time"
                value={formData.hora}
                onChange={(e) => setFormData({...formData, hora: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({...formData, descricao: e.target.value})}
              rows={3}
              placeholder="Descreva os detalhes da atividade..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="usuario">Responsável</Label>
              <Input
                id="usuario"
                value={formData.usuario}
                onChange={(e) => setFormData({...formData, usuario: e.target.value})}
                placeholder="Nome do responsável"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prioridade">Prioridade</Label>
              <Select value={formData.prioridade} onValueChange={(value) => setFormData({...formData, prioridade: value as 'baixa' | 'media' | 'alta'})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Tags da Atividade</Label>
              <div className="flex items-center gap-2">
                {showTagInput ? (
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Adicionar tag..."
                      className="flex-1"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                    <Button onClick={addTag} disabled={!newTag.trim()}>
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" onClick={() => setShowTagInput(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="gap-1">
                        {tag}
                        <X 
                          className="h-3 w-3 cursor-pointer hover:text-red-500" 
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => setShowTagInput(true)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Prioridade */}
          <div className="space-y-2">
            <Label>Prioridade</Label>
            <div className="flex gap-2">
              {ACTIVITY_PRIORITIES.map((priority) => (
                <Button
                  key={priority.id}
                  variant={formData.prioridade === priority.id ? "default" : "outline"}
                  className={`flex-1 justify-start ${priority.color}`}
                  onClick={() => setFormData({...formData, prioridade: priority.id})}
                >
                  {priority.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Próximo Passo */}
          <div className="space-y-2">
            <Label htmlFor="proximoPasso">Próximo Passo</Label>
            <Textarea
              id="proximoPasso"
              value={formData.proximoPasso}
              onChange={(e) => setFormData({...formData, proximoPasso: e.target.value})}
              rows={2}
              placeholder="Descreva o próximo passo a ser tomado..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar Atividade
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
