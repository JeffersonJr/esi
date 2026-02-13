import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  MoreVertical, 
  Mail, 
  MessageCircle, 
  Calendar, 
  Edit, 
  Eye, 
  Trash2,
  Thermometer,
  TrendingUp,
  GripVertical
} from 'lucide-react';

interface ContactInfo {
  type: 'email' | 'phone' | 'mobile';
  value: string;
  isPrimary?: boolean;
}

interface Lead {
  id: string;
  name: string;
  emails: ContactInfo[];
  phones: ContactInfo[];
  property: string;
  value: string;
  source: string;
  assignedTo: string;
  notes?: string;
  stage?: string;
  lastContact?: string;
  nextAction?: string;
  tags?: string[];
}

interface LeadCardProps {
  lead: Lead;
  onOpenDetails: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onScheduleVisit: (lead: Lead) => void;
  onSendEmail: (lead: Lead) => void;
  onWhatsApp: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
  isMobile?: boolean;
  provided?: {
    innerRef: (element: HTMLElement | null) => void;
    draggableProps: React.HTMLAttributes<HTMLElement>;
    dragHandleProps: React.HTMLAttributes<HTMLElement>;
  }; // Drag and drop provided props
  isDragging?: boolean;
}

export function LeadCard({ 
  lead, 
  onOpenDetails, 
  onEdit, 
  onScheduleVisit, 
  onSendEmail, 
  onWhatsApp, 
  onDelete,
  isMobile = false,
  provided,
  isDragging = false
}: LeadCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getLeadTemperature = () => {
    // Simple logic to determine lead temperature
    const hotTags = ['Hot Lead', 'Urgente', 'Interesse Alto'];
    const warmTags = ['VIP', 'Follow-up Necessário'];
    
    if (lead.tags?.some(tag => hotTags.includes(tag))) {
      return { level: 'hot', color: 'bg-red-500', icon: TrendingUp, label: 'Quente' };
    } else if (lead.tags?.some(tag => warmTags.includes(tag))) {
      return { level: 'warm', color: 'bg-orange-500', icon: Thermometer, label: 'Morno' };
    }
    return { level: 'cold', color: 'bg-blue-500', icon: Thermometer, label: 'Frio' };
  };

  const temperature = getLeadTemperature();
  const TemperatureIcon = temperature.icon;

  const primaryEmail = lead.emails?.find(email => email.isPrimary)?.value || lead.emails?.[0]?.value || '';
  const primaryPhone = lead.phones?.find(phone => phone.isPrimary)?.value || lead.phones?.[0]?.value || '';

  const getTagColor = (tagName: string) => {
    const tagColors: Record<string, string> = {
      'Hot Lead': 'bg-red-500',
      'VIP': 'bg-purple-500',
      'Primeira Compra': 'bg-blue-500',
      'Investidor': 'bg-green-500',
      'Financiamento': 'bg-orange-500',
      'Aluguel': 'bg-yellow-500',
      'Interesse Alto': 'bg-red-500',
      'Follow-up Necessário': 'bg-orange-500',
      'Urgente': 'bg-red-500',
    };
    return tagColors[tagName] || 'bg-gray-500';
  };

  return (
    <Card
      ref={provided?.innerRef}
      {...provided?.draggableProps}
      className={`hover:shadow-lg transition-all duration-200 cursor-pointer relative group ${
        isHovered ? 'transform -translate-y-1' : ''
      } ${isDragging ? 'opacity-50 rotate-2 scale-105' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onOpenDetails(lead)}
    >
      {/* Temperature Indicator */}
      <div className={`absolute top-2 right-2 ${temperature.color} text-white rounded-full p-1 opacity-80`}>
        <TemperatureIcon className="h-3 w-3" />
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {provided && (
              <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
                {lead.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-sm">{lead.name}</CardTitle>
              <Badge variant="outline" className="mt-1 text-xs">
                {lead.source}
              </Badge>
              {/* Tags */}
              {lead.tags && lead.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {lead.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} className={`${getTagColor(tag)} text-white text-xs`}>
                      {tag}
                    </Badge>
                  ))}
                  {lead.tags.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{lead.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Hover Actions */}
          <div className={`transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onOpenDetails(lead);
                  }}>
                  <Eye className="h-4 w-4 mr-2" />
                  Ver detalhes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onEdit(lead);
                  }}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onScheduleVisit(lead);
                  }}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar atividade
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Tem certeza que deseja excluir este lead?')) {
                      onDelete(lead.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2">
        <div className="text-sm">
          <div className="font-medium text-foreground">{lead.property}</div>
          <div className="text-primary font-semibold mt-1">{lead.value}</div>
        </div>
        
        {/* Action Buttons - Always Visible */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size={isMobile ? 'sm' : 'icon'} 
            className={`${isMobile ? 'gap-2' : 'h-8 w-8'}`}
            onClick={(e) => {
              e.stopPropagation();
              onSendEmail(lead);
            }}
          >
            <Mail className="h-4 w-4" />
            {isMobile && <span>E-mail</span>}
          </Button>
          <Button 
            variant="outline" 
            size={isMobile ? 'sm' : 'icon'} 
            className={`${isMobile ? 'gap-2' : 'h-8 w-8'}`}
            onClick={(e) => {
              e.stopPropagation();
              onWhatsApp(lead);
            }}
          >
            <MessageCircle className="h-4 w-4" />
            {isMobile && <span>WhatsApp</span>}
          </Button>
          <Button 
            variant="outline" 
            size={isMobile ? 'sm' : 'icon'} 
            className={`${isMobile ? 'gap-2' : 'h-8 w-8'}`}
            onClick={(e) => {
              e.stopPropagation();
              onScheduleVisit(lead);
            }}
          >
            <Calendar className="h-4 w-4" />
            {isMobile && <span>Atividade</span>}
          </Button>
        </div>
        
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="bg-muted text-xs">{lead.assignedTo}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">Responsável</span>
          <div className="ml-auto">
            <Badge variant="secondary" className="text-xs">
              {temperature.label}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
