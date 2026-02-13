import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, MessageCircle, Phone, Home, FileText, Users, ArrowRight, Download, Paperclip, Trash, Eye, Edit } from 'lucide-react';
import { HistoricoAtendimento, Documento } from '@/types/lead';

interface LeadTabAtividadesProps {
  historico: HistoricoAtendimento[];
  documentos?: Documento[];
  onScheduleActivity: () => void;
  onActivityDetails: (activity: HistoricoAtendimento) => void;
  onEditActivity: (activity: HistoricoAtendimento) => void;
  onDeleteActivity: (activity: HistoricoAtendimento) => void;
}

export const LeadTabAtividades: React.FC<LeadTabAtividadesProps> = ({
  historico,
  documentos = [],
  onScheduleActivity,
  onActivityDetails,
  onEditActivity,
  onDeleteActivity
}) => {
  const getActivityIcon = (tipo: string) => {
    switch (tipo) {
      case 'ligacao': return <Phone className="h-4 w-4" />;
      case 'email': return <MessageCircle className="h-4 w-4" />;
      case 'visita': return <Home className="h-4 w-4" />;
      case 'proposta': return <FileText className="h-4 w-4" />;
      case 'reuniao': return <Users className="h-4 w-4" />;
      case 'whatsapp': return <MessageCircle className="h-4 w-4" />;
      case 'followup': return <ArrowRight className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getActivityColor = (tipo: string) => {
    switch (tipo) {
      case 'ligacao': return 'bg-blue-100 text-blue-700';
      case 'email': return 'bg-green-100 text-green-700';
      case 'visita': return 'bg-purple-100 text-purple-700';
      case 'proposta': return 'bg-orange-100 text-orange-700';
      case 'reuniao': return 'bg-red-100 text-red-700';
      case 'whatsapp': return 'bg-green-100 text-green-700';
      case 'followup': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRelatedDocuments = (activity: HistoricoAtendimento) => {
    // Para notas (followup), buscar documentos criados no mesmo timestamp
    if (activity.tipo === 'followup') {
      const activityTimestamp = new Date(activity.data).getTime();
      return documentos.filter(doc => {
        // Converter a data formatada do documento para timestamp
        const docDate = new Date(doc.data);
        const docTimestamp = docDate.getTime();
        
        // Considerar relacionados se foram criados dentro de 5 segundos
        return Math.abs(docTimestamp - activityTimestamp) < 5000;
      });
    }
    return [];
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Histórico de Atendimento</h3>
        <Button onClick={onScheduleActivity}>
          <Calendar className="h-4 w-4 mr-2" />
          Nova Atividade
        </Button>
      </div>

      <div className="space-y-3">
        {historico.map((activity) => {
          const isNote = activity.tipo === 'followup';
          const relatedDocs = getRelatedDocuments(activity);
          
          return (
            <Card key={activity.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${getActivityColor(activity.tipo)}`}>
                      {getActivityIcon(activity.tipo)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getActivityColor(activity.tipo)}>
                          {activity.tipo === 'followup' ? 'Nota' : activity.tipo.charAt(0).toUpperCase() + activity.tipo.slice(1)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(activity.data).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        {activity.duracao && (
                          <span className="text-sm text-muted-foreground">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {activity.duracao}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium mb-1">{activity.descricao}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {activity.usuario}
                        </span>
                        {activity.resultado && (
                          <span>Resultado: {activity.resultado}</span>
                        )}
                        {activity.proximoPasso && (
                          <span>Próximo: {activity.proximoPasso}</span>
                        )}
                      </div>
                      
                      {/* Exibir arquivos anexados em notas */}
                      {isNote && relatedDocs.length > 0 && (
                        <div className="mt-3 flex items-center gap-2">
                          <Paperclip className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {relatedDocs.length} arquivo{relatedDocs.length > 1 ? 's' : ''} anexado{relatedDocs.length > 1 ? 's' : ''}
                          </span>
                          {relatedDocs.map((doc) => (
                            <Button
                              key={doc.id}
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => {
                                // Simular download
                                const link = document.createElement('a');
                                link.href = '#';
                                link.download = doc.nome;
                                link.click();
                              }}
                              title={`Baixar ${doc.nome}`}
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Botões de ação - notas têm editar + excluir, atividades têm detalhes + editar + excluir */}
                  {isNote ? (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditActivity(activity)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteActivity(activity)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onActivityDetails(activity)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {activity.editavel && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditActivity(activity)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteActivity(activity)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
