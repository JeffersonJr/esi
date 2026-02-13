import { SiteTemplate } from './site-templates';
import { SitePreview } from './site-preview';

interface TemplatePreviewProps {
  template: SiteTemplate;
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (template: SiteTemplate) => void;
}

export function TemplatePreview({ template, isOpen, onClose, onApplyTemplate }: TemplatePreviewProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{template.name}</h2>
            <p className="text-sm text-gray-600">{template.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onApplyTemplate(template)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Aplicar Template
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
        
        <div className="overflow-y-auto" style={{ height: 'calc(90vh - 80px)' }}>
          <div className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Preview do Template</h3>
              <p className="text-sm text-gray-600">
                Este é um preview do template com dados mockados. Clique em "Aplicar Template" para usá-lo em seu site.
              </p>
            </div>
            
            <div className="border rounded-lg overflow-hidden bg-gray-50">
              <div className="max-w-7xl mx-auto">
                <SitePreview 
                  blocks={template.blocks} 
                  selectedPage="home"
                  selectedBlock={null}
                  onBlockSelect={() => {}}
                />
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Características</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Design responsivo</li>
                  <li>• Otimizado para SEO</li>
                  <li>• Carregamento rápido</li>
                  <li>• Navegação intuitiva</li>
                </ul>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Blocos Incluídos</h4>
                <div className="text-sm text-gray-600">
                  {template.blocks.map((block, index) => (
                    <div key={index} className="capitalize">
                      • {block.type}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Categoria</h4>
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {template.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
