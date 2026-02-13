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
  Eye, 
  Edit, 
  Trash2,
  Thermometer 
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
  tags?: string[];
  temperature?: 'cold' | 'warm' | 'hot';
}

interface LeadCardProps {
  lead: Lead;
  isMobile: boolean;
  onOpenDetails: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onScheduleVisit: (lead: Lead) => void;
  onSendEmail: (lead: Lead) => void;
  onWhatsApp: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
}

export function LeadCard({
  lead,
  isMobile,
  onOpenDetails,
  onEdit,
  onScheduleVisit,
  onSendEmail,
  onWhatsApp,
  onDelete
}: LeadCardProps) {
  const [isHovered, setIsHovered] = useState(false);

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

  const getTemperatureColor = (temp?: string) => {
    switch (temp) {
      case 'hot': return 'bg-red-500';
      case 'warm': return 'bg-orange-500';
      case 'cold': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getTemperatureIcon = (temp?: string) => {
    switch (temp) {
      case 'hot': return '🔥';
      case 'warm': return '🌡️';
      case 'cold': return '❄️';
      default: return '🌡️';
    }
  };

  return (
    <Card
      className={`hover:shadow-lg transition-all cursor-pointer relative ${
        isHovered ? 'shadow-xl scale-105' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onOpenDetails(lead)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
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
          
          {/* Termômetro */}
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs text-white ${getTemperatureColor(lead.temperature)}`}>
              <span>{getTemperatureIcon(lead.temperature)}</span>
              <span className="capitalize">{lead.temperature || 'warm'}</span>
            </div>
            
            {/* Dropdown menu */}
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
        
        {/* Action buttons - sempre visíveis */}
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
        </div>
      </CardContent>
    </Card>
  );
}
