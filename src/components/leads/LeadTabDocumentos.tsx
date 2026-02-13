import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileText, Download, Eye, Trash2, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Documento {
  id: string;
  nome: string;
  tamanho: string;
  data: string;
  tipo: string;
}

interface LeadTabDocumentosProps {
  documentos: Documento[];
  onAddDocument: () => void;
  onViewDocument: (document: Documento) => void;
  onDownloadDocument: (document: Documento) => void;
  onDeleteDocument: (id: string, nome: string) => void;
}

export const LeadTabDocumentos: React.FC<LeadTabDocumentosProps> = ({
  documentos,
  onAddDocument,
  onViewDocument,
  onDownloadDocument,
  onDeleteDocument
}) => {
  const getDocumentIcon = (tipo: string) => {
    switch (tipo) {
      case 'pdf': return '📄';
      case 'doc':
      case 'docx': return '📝';
      case 'xls':
      case 'xlsx': return '📊';
      case 'ppt':
      case 'pptx': return '📈';
      case 'txt': return '📃';
      case 'png':
      case 'jpg':
      case 'jpeg': return '🖼️';
      default: return '📎';
    }
  };

  const getDocumentColor = (tipo: string) => {
    switch (tipo) {
      case 'pdf': return 'bg-red-100 text-red-700';
      case 'doc':
      case 'docx': return 'bg-blue-100 text-blue-700';
      case 'xls':
      case 'xlsx': return 'bg-green-100 text-green-700';
      case 'ppt':
      case 'pptx': return 'bg-orange-100 text-orange-700';
      case 'txt': return 'bg-gray-100 text-gray-700';
      case 'png':
      case 'jpg':
      case 'jpeg': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Documentos</h3>
        <Button onClick={onAddDocument}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Documento
        </Button>
      </div>

      <div className="grid gap-4">
        {documentos.map((doc) => (
          <Card key={doc.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${getDocumentColor(doc.tipo)}`}>
                    <span className="text-2xl">{getDocumentIcon(doc.tipo)}</span>
                  </div>
                  <div>
                    <h4 className="font-medium">{doc.nome}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{doc.tamanho.toUpperCase()}</span>
                      <span>{doc.data}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onDownloadDocument(doc)}
                    title="Baixar documento"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onViewDocument(doc)}
                    title="Visualizar documento"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onDeleteDocument(doc.id, doc.nome)}
                    className="text-red-600 hover:text-red-700"
                    title="Excluir documento"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
