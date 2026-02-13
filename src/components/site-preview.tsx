import { Block } from '@/pages/EditorSite';

interface SitePreviewProps {
  blocks: Block[];
  selectedPage: string;
  selectedBlock?: string | null;
  onBlockSelect?: (id: string) => void;
  onBlockDelete?: (id: string) => void;
}

export function SitePreview({ blocks, selectedPage, selectedBlock, onBlockSelect, onBlockDelete }: SitePreviewProps) {
  const handleBlockDelete = (blockId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja remover este bloco?')) {
      onBlockDelete?.(blockId);
    }
  };

  const renderBlock = (block: Block, index: number) => {
    const isSelected = selectedBlock === block.id;
    
    switch (block.type) {
      case 'header':
        return (
          <header 
            className={`bg-white border-b border-gray-200 px-6 py-4 cursor-pointer transition-all relative group ${
              isSelected ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'
            }`}
            onClick={() => onBlockSelect?.(block.id)}
          >
            {isSelected && (
              <button
                onClick={(e) => handleBlockDelete(block.id, e)}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="text-xl font-bold text-gray-900">
                  {block.content.logo || 'Logo'}
                </div>
                <nav className="hidden md:flex items-center gap-6">
                  {(block.content.menu || ['Início', 'Imóveis', 'Sobre', 'Contato']).map((item: string, i: number) => (
                    <a key={i} href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                      {item}
                    </a>
                  ))}
                </nav>
              </div>
              <div className="flex items-center gap-4">
                {block.content.phone && (
                  <span className="text-sm text-gray-600">{block.content.phone}</span>
                )}
                {block.content.email && (
                  <span className="text-sm text-gray-600">{block.content.email}</span>
                )}
              </div>
            </div>
          </header>
        );

      case 'hero':
        return (
          <section 
            className={`relative group bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 cursor-pointer transition-all ${
              isSelected ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => onBlockSelect?.(block.id)}
            style={{
              backgroundImage: block.content.backgroundImage 
                ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${block.content.backgroundImage})`
                : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {isSelected && (
              <button
                onClick={(e) => handleBlockDelete(block.id, e)}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <div className="max-w-7xl mx-auto px-6 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {block.content.title || 'Título Principal'}
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                {block.content.subtitle || 'Subtítulo descritivo'}
              </p>
              {block.content.cta && (
                <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                  {block.content.cta}
                </button>
              )}
            </div>
          </section>
        );

      case 'properties':
        return (
          <section 
            className={`relative group py-16 bg-gray-50 cursor-pointer transition-all ${
              isSelected ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => onBlockSelect?.(block.id)}
          >
            {isSelected && (
              <button
                onClick={(e) => handleBlockDelete(block.id, e)}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-12">
                {block.content.titulo || 'Imóveis em Destaque'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: block.content.quantidade || 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300"></div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2">Imóvel {i + 1}</h3>
                      <p className="text-gray-600 mb-2">Descrição breve do imóvel em destaque</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-blue-600">R$ {(500000 + i * 50000).toLocaleString('pt-BR')}</span>
                        <span className="text-sm text-gray-500">{3 + i} quartos</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'text':
        return (
          <section 
            className={`relative group py-16 bg-white cursor-pointer transition-all ${
              isSelected ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => onBlockSelect?.(block.id)}
          >
            {isSelected && (
              <button
                onClick={(e) => handleBlockDelete(block.id, e)}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <div className="max-w-4xl mx-auto px-6 text-center">
              {block.content.title && (
                <h2 className="text-3xl font-bold mb-8">{block.content.title}</h2>
              )}
              <p className="text-lg text-gray-600 leading-relaxed">
                {block.content.content || 'Conteúdo do bloco de texto. Adicione seu conteúdo aqui para informar seus visitantes sobre seus serviços e diferenciais.'}
              </p>
            </div>
          </section>
        );

      case 'map':
        return (
          <section 
            className={`relative group py-16 bg-gray-100 cursor-pointer transition-all ${
              isSelected ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => onBlockSelect?.(block.id)}
          >
            {isSelected && (
              <button
                onClick={(e) => handleBlockDelete(block.id, e)}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-12">
                {block.content.title || 'Nossa Localização'}
              </h2>
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="h-64 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-8 h-8 bg-white rounded-full"></div>
                    </div>
                    <p className="text-gray-600">
                      {block.content.address || 'Av. Paulista, 1000 - São Paulo/SP'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      case 'footer':
        return (
          <footer 
            className={`relative group bg-gray-900 text-white py-12 cursor-pointer transition-all ${
              isSelected ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => onBlockSelect?.(block.id)}
          >
            {isSelected && (
              <button
                onClick={(e) => handleBlockDelete(block.id, e)}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">{block.content.logo || 'Sua Empresa'}</h3>
                  <p className="text-gray-400">
                    {block.content.description || 'Descrição da sua empresa e missão.'}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Links Úteis</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="#" className="hover:text-white transition-colors">Sobre Nós</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Imóveis</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Contato</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li>{block.content.phone || '(11) 9999-9999'}</li>
                    <li>{block.content.email || 'contato@empresa.com'}</li>
                    <li>{block.content.address || 'Endereço da empresa'}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Redes Sociais</h4>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                    <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                    <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; 2024 {block.content.logo || 'Sua Empresa'}. Todos os direitos reservados.</p>
              </div>
            </div>
          </footer>
        );

      default:
        return (
          <div 
            className={`p-8 bg-gray-100 text-center cursor-pointer transition-all ${
              isSelected ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => onBlockSelect?.(block.id)}
          >
            <p className="text-gray-600">Bloco desconhecido: {block.type}</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-white min-h-full">
      {blocks.length === 0 ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 mb-2">Nenhum bloco adicionado ainda</p>
            <p className="text-sm text-gray-400">Adicione blocos para começar a construir seu site</p>
          </div>
        </div>
      ) : (
        <div className="space-y-0">
          {blocks.map((block, index) => (
            <div key={block.id}>
              {renderBlock(block, index)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
