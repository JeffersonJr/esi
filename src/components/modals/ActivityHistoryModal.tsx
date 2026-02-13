import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  X, 
  Upload, 
  Image as ImageIcon, 
  FileText, 
  Calendar,
  Clock,
  User,
  Tag,
  MessageCircle,
  Phone,
  Mail,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

interface Activity {
  id: string;
  date: string;
  time: string;
  type: 'call' | 'email' | 'meeting' | 'visit' | 'note' | 'task';
  title: string;
  description: string;
  tags: string[];
  images: string[];
  documents: string[];
  createdBy: string;
  leadId: string;
}

interface ActivityHistoryModalProps {
  open: boolean;
  onClose: () => void;
  leadId: string;
  leadName: string;
}

const ACTIVITY_TYPES = [
  { value: 'call', label: 'Ligação', icon: Phone, color: 'bg-blue-500' },
  { value: 'email', label: 'E-mail', icon: Mail, color: 'bg-green-500' },
  { value: 'meeting', label: 'Reunião', icon: User, color: 'bg-purple-500' },
  { value: 'visit', label: 'Visita', icon: Calendar, color: 'bg-orange-500' },
  { value: 'note', label: 'Nota', icon: FileText, color: 'bg-gray-500' },
  { value: 'task', label: 'Tarefa', icon: MessageCircle, color: 'bg-red-500' },
];

const COMMON_TAGS = [
  'Urgente',
  'Follow-up',
  'Proposta',
  'Contrato',
  'Documentação',
  'Visita Agendada',
  'Interesse Confirmado',
  'Negociação',
  'Pendente',
];

export function ActivityHistoryModal({ open, onClose, leadId, leadName }: ActivityHistoryModalProps) {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      date: '13/02/2026',
      time: '14:30',
      type: 'call',
      title: 'Ligação inicial',
      description: 'Cliente demonstrou interesse no apartamento 2 quartos em Brooklin. Agendada visita para o fim de semana.',
      tags: ['Interesse Confirmado', 'Visita Agendada'],
      images: [],
      documents: [],
      createdBy: 'João Silva',
      leadId: leadId
    },
    {
      id: '2',
      date: '12/02/2026',
      time: '10:15',
      type: 'email',
      title: 'Envio de materiais',
      description: 'Enviado catálogo completo com fotos e valores dos imóveis disponíveis na região solicitada.',
      tags: ['Proposta'],
      images: [],
      documents: ['catalogo_brooklin.pdf'],
      createdBy: 'Maria Santos',
      leadId: leadId
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newActivity, setNewActivity] = useState<{
    date: string;
    time: string;
    type: 'call' | 'email' | 'meeting' | 'visit' | 'note' | 'task';
    title: string;
    description: string;
    tags: string[];
    images: File[];
    documents: File[];
  }>({
    date: '',
    time: '',
    type: 'note',
    title: '',
    description: '',
    tags: [],
    images: [],
    documents: []
  });

  const [newTag, setNewTag] = useState('');
  const [viewingActivity, setViewingActivity] = useState<Activity | null>(null);

  const handleAddActivity = () => {
    if (newActivity.title && newActivity.description) {
      const activity: Activity = {
        id: Date.now().toString(),
        date: newActivity.date || new Date().toLocaleDateString('pt-BR'),
        time: newActivity.time || new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        type: newActivity.type,
        title: newActivity.title,
        description: newActivity.description,
        tags: newActivity.tags,
        images: newActivity.images.map(img => URL.createObjectURL(img)),
        documents: newActivity.documents.map(doc => doc.name),
        createdBy: 'Usuário Atual',
        leadId: leadId
      };

      setActivities(prev => [activity, ...prev]);
      setNewActivity({
        date: '',
        time: '',
        type: 'note',
        title: '',
        description: '',
        tags: [],
        images: [],
        documents: []
      });
      setShowAddForm(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !newActivity.tags.includes(newTag.trim())) {
      setNewActivity(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewActivity(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewActivity(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewActivity(prev => ({
      ...prev,
      documents: [...prev.documents, ...files]
    }));
  };

  const getActivityIcon = (type: string) => {
    const activityType = ACTIVITY_TYPES.find(t => t.value === type);
    return activityType?.icon || FileText;
  };

  const getActivityColor = (type: string) => {
    const activityType = ACTIVITY_TYPES.find(t => t.value === type);
    return activityType?.color || 'bg-gray-500';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Histórico de Atividades - {leadName}
            </span>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Nova Atividade
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {showAddForm ? (
            // Form to add new activity
            <div className="p-6 border-b overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label>Data</label>
                      <Input
                        type="date"
                        value={newActivity.date}
                        onChange={(e) => setNewActivity(prev => ({ ...prev, date: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <label>Horário</label>
                      <Input
                        type="time"
                        value={newActivity.time}
                        onChange={(e) => setNewActivity(prev => ({ ...prev, time: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label>Tipo</label>
                    <Select value={newActivity.type} onValueChange={(value: 'call' | 'email' | 'meeting' | 'visit' | 'note' | 'task') => setNewActivity(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ACTIVITY_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
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
                    <label>Título *</label>
                    <Input
                      placeholder="Título da atividade"
                      value={newActivity.title}
                      onChange={(e) => setNewActivity(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <label>Descrição *</label>
                    <Textarea
                      placeholder="Detalhes da atividade..."
                      value={newActivity.description}
                      onChange={(e) => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label>Tags</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Adicionar tag..."
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        className="flex-1"
                      />
                      <Button type="button" onClick={addTag} disabled={!newTag.trim()}>
                        Adicionar
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {newActivity.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="gap-1">
                          {tag}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {COMMON_TAGS
                        .filter(tag => !newActivity.tags.includes(tag))
                        .map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="cursor-pointer hover:bg-secondary"
                            onClick={() => setNewActivity(prev => ({ ...prev, tags: [...prev.tags, tag] }))}
                          >
                            {tag}
                          </Badge>
                        ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        Imagens
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="activity-image-upload"
                        />
                        <label
                          htmlFor="activity-image-upload"
                          className="cursor-pointer flex flex-col items-center gap-2"
                        >
                          <Upload className="h-6 w-6 text-gray-400" />
                          <span className="text-sm text-gray-500">Adicionar imagens</span>
                        </label>
                      </div>
                      {newActivity.images.length > 0 && (
                        <div className="text-xs text-gray-600 mt-1">
                          {newActivity.images.length} imagem(ns) selecionada(s)
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Documentos
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.xls,.xlsx"
                          onChange={handleDocumentUpload}
                          className="hidden"
                          id="activity-document-upload"
                        />
                        <label
                          htmlFor="activity-document-upload"
                          className="cursor-pointer flex flex-col items-center gap-2"
                        >
                          <Upload className="h-6 w-6 text-gray-400" />
                          <span className="text-sm text-gray-500">Adicionar documentos</span>
                        </label>
                      </div>
                      {newActivity.documents.length > 0 && (
                        <div className="text-xs text-gray-600 mt-1">
                          {newActivity.documents.length} documento(s) selecionado(s)
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddActivity} disabled={!newActivity.title || !newActivity.description}>
                  Salvar Atividade
                </Button>
              </div>
            </div>
          ) : (
            // Activities list
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {activities.map((activity) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div key={activity.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`p-2 rounded-full text-white ${getActivityColor(activity.type)}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{activity.title}</h4>
                              <Badge variant="outline" className="text-xs">
                                {ACTIVITY_TYPES.find(t => t.value === activity.type)?.label}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                            
                            {activity.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {activity.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {(activity.images.length > 0 || activity.documents.length > 0) && (
                              <div className="flex gap-4 text-xs text-gray-500">
                                {activity.images.length > 0 && (
                                  <span className="flex items-center gap-1">
                                    <ImageIcon className="h-3 w-3" />
                                    {activity.images.length} imagem(ns)
                                  </span>
                                )}
                                {activity.documents.length > 0 && (
                                  <span className="flex items-center gap-1">
                                    <FileText className="h-3 w-3" />
                                    {activity.documents.length} documento(s)
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2 text-xs text-gray-500">
                          <span>{activity.date}</span>
                          <span>{activity.time}</span>
                          <span>por {activity.createdBy}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
