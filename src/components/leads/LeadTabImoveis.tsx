import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Calendar, Send, Home, DollarSign, Car } from 'lucide-react';

interface ImovelInteresse {
  id: string;
  titulo: string;
  tipo: string;
  endereco: string;
  valor: string;
  area: string;
  quartos: number;
  banheiros: number;
  vagas: number;
  descricao: string;
  imagens: string[];
}

interface LeadTabImoveisProps {
  imoveisInteresse: ImovelInteresse[];
  selectedProperties: string[];
  isAllPropertiesSelected: boolean;
  isSomePropertiesSelected: boolean;
  masterCheckboxRef: React.RefObject<HTMLInputElement>;
  onPropertySelection: (propertyId: string) => void;
  onSelectAllProperties: (checked: boolean) => void;
  onViewProperty: (propertyId: string) => void;
  onScheduleVisit: (property: ImovelInteresse) => void;
  onScheduleMultipleVisits: () => void;
  onSendProperties: () => void;
}

export const LeadTabImoveis: React.FC<LeadTabImoveisProps> = ({
  imoveisInteresse,
  selectedProperties,
  isAllPropertiesSelected,
  isSomePropertiesSelected,
  masterCheckboxRef,
  onPropertySelection,
  onSelectAllProperties,
  onViewProperty,
  onScheduleVisit,
  onScheduleMultipleVisits,
  onSendProperties
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isAllPropertiesSelected}
            ref={masterCheckboxRef}
            onChange={(e) => onSelectAllProperties(e.target.checked)}
            className="mt-1"
          />
          <span className="text-sm text-muted-foreground">
            Selecionar todos ({imoveisInteresse.length})
          </span>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onScheduleMultipleVisits}
            disabled={selectedProperties.length === 0}
          >
            <Calendar className="h-4 w-4 mr-1" />
            Visitar ({selectedProperties.length})
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onSendProperties}
            disabled={selectedProperties.length === 0}
          >
            <Send className="h-4 w-4 mr-1" />
            Enviar ({selectedProperties.length})
          </Button>
        </div>
      </div>
      
      <div className="space-y-3">
        {imoveisInteresse.map((imovel) => (
          <Card key={imovel.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <input
                type="checkbox"
                checked={selectedProperties.includes(imovel.id)}
                onChange={() => onPropertySelection(imovel.id)}
                className="mt-1"
              />
              
              <div className="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={imovel.imagens[0]}
                  alt={imovel.titulo}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold">{imovel.titulo}</h3>
                <p className="text-sm text-muted-foreground">{imovel.endereco}</p>
                <p className="text-lg font-bold text-primary mt-1">{imovel.valor}</p>
                
                <div className="flex gap-4 mt-3 text-sm">
                  <span className="flex items-center gap-1">
                    <Home className="h-4 w-4" />
                    {imovel.quartos} quartos
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {imovel.area} m²
                  </span>
                  <span className="flex items-center gap-1">
                    <Car className="h-4 w-4" />
                    {imovel.vagas} vagas
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground mt-2">{imovel.descricao}</p>
                
                <div className="flex gap-2 ml-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onViewProperty(imovel.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onScheduleVisit(imovel)}
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    Visitar
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
