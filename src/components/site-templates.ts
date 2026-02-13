export interface SiteTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: string;
  blocks: any[];
}

export const siteTemplates: SiteTemplate[] = [
  {
    id: 'modern-imobiliaria',
    name: 'Imobiliária Moderna',
    description: 'Design limpo e profissional com foco em conversão',
    category: 'Imobiliária',
    preview: '/templates/modern-imobiliaria.jpg',
    blocks: [
      {
        id: '1',
        type: 'header',
        content: { 
          logo: 'Imobiliária Moderna', 
          menu: ['Início', 'Imóveis', 'Sobre', 'Contato'],
          phone: '(11) 9999-9999',
          email: 'contato@imobiliaria.com'
        },
      },
      {
        id: '2',
        type: 'hero',
        content: { 
          title: 'Encontre o Lar dos Seus Sonhos', 
          subtitle: 'Mais de 10 anos de experiência no mercado imobiliário',
          cta: 'Ver Imóveis',
          backgroundImage: '/hero-modern.jpg'
        },
      },
      {
        id: '3',
        type: 'properties',
        content: { 
          titulo: 'Imóveis em Destaque', 
          quantidade: 6,
          filter: 'destaque'
        },
      },
      {
        id: '4',
        type: 'text',
        content: { 
          title: 'Sobre Nós',
          content: 'Somos uma imobiliária comprometida em encontrar o imóvel perfeito para você. Com mais de 10 anos de experiência, oferecemos o melhor atendimento e as melhores oportunidades do mercado.'
        },
      },
      {
        id: '5',
        type: 'map',
        content: { 
          title: 'Nossa Localização',
          address: 'Av. Paulista, 1000 - São Paulo/SP'
        },
      },
    ],
  },
  {
    id: 'luxury-properties',
    name: 'Propriedades de Luxo',
    description: 'Elegante e sofisticado para imóveis de alto padrão',
    category: 'Imobiliária',
    preview: '/templates/luxury-properties.jpg',
    blocks: [
      {
        id: '1',
        type: 'header',
        content: { 
          logo: 'Luxury Properties', 
          menu: ['Home', 'Properties', 'About', 'Contact'],
          phone: '+55 11 9999-9999'
        },
      },
      {
        id: '2',
        type: 'hero',
        content: { 
          title: 'Exclusividade e Sofisticação', 
          subtitle: 'Imóveis de luxo que transformam seu estilo de vida',
          cta: 'Explore Nossas Propriedades'
        },
      },
      {
        id: '3',
        type: 'properties',
        content: { 
          titulo: 'Propriedades Exclusivas', 
          quantidade: 4,
          filter: 'luxo'
        },
      },
      {
        id: '4',
        type: 'text',
        content: { 
          title: 'Atendimento Premium',
          content: 'Oferecemos um serviço exclusivo para clientes que buscam o melhor em imóveis de luxo. Nossa equipe está preparada para atender às suas mais exigentes expectativas.'
        },
      },
    ],
  },
  {
    id: 'minimalist-clean',
    name: 'Minimalista Clean',
    description: 'Design simples e direto com foco em usabilidade',
    category: 'Minimalista',
    preview: '/templates/minimalist-clean.jpg',
    blocks: [
      {
        id: '1',
        type: 'header',
        content: { 
          logo: 'Clean Imóveis', 
          menu: ['Home', 'Properties', 'About']
        },
      },
      {
        id: '2',
        type: 'hero',
        content: { 
          title: 'Simplicidade é o Ultimate Luxo', 
          subtitle: 'Encontre seu imóvel de forma rápida e fácil'
        },
      },
      {
        id: '3',
        type: 'properties',
        content: { 
          titulo: 'Nossos Imóveis', 
          quantidade: 8
        },
      },
    ],
  },
  {
    id: 'corporate-business',
    name: 'Corporate Business',
    description: 'Profissional e confiável para empresas imobiliárias',
    category: 'Corporativo',
    preview: '/templates/corporate-business.jpg',
    blocks: [
      {
        id: '1',
        type: 'header',
        content: { 
          logo: 'Corporate Imóveis', 
          menu: ['Home', 'Properties', 'Services', 'About', 'Contact'],
          phone: '(11) 3333-3333',
          email: 'comercial@corporate.com.br'
        },
      },
      {
        id: '2',
        type: 'hero',
        content: { 
          title: 'Soluções Imobiliárias Corporativas', 
          subtitle: 'Atendimento especializado para Pessoa Jurídica',
          cta: 'Fale com um Consultor'
        },
      },
      {
        id: '3',
        type: 'text',
        content: { 
          title: 'Nossos Serviços',
          content: 'Oferecemos soluções completas para empresas: gestão de propriedades, consultoria imobiliária, leasing e muito mais.'
        },
      },
      {
        id: '4',
        type: 'properties',
        content: { 
          titulo: 'Propriedades Comerciais', 
          quantidade: 6,
          filter: 'comercial'
        },
      },
    ],
  },
  {
    id: 'cozy-residential',
    name: 'Residencial Aconchegante',
    description: 'Design caloroso e acolhedor para imóveis residenciais',
    category: 'Residencial',
    preview: '/templates/cozy-residential.jpg',
    blocks: [
      {
        id: '1',
        type: 'header',
        content: { 
          logo: 'Lar & Cia', 
          menu: ['Início', 'Casas', 'Apartamentos', 'Contato']
        },
      },
      {
        id: '2',
        type: 'hero',
        content: { 
          title: 'Sua Casa, Seu Refúgio', 
          subtitle: 'Encontre o lugar perfeito para chamar de lar',
          cta: 'Ver Casas e Apartamentos'
        },
      },
      {
        id: '3',
        type: 'properties',
        content: { 
          titulo: 'Lares Esperando por Você', 
          quantidade: 6,
          filter: 'residencial'
        },
      },
      {
        id: '4',
        type: 'text',
        content: { 
          title: 'Nosso Diferencial',
          content: 'Acreditamos que cada imóvel tem uma história única. Nossa missão é ajudar você a encontrar o lugar que se torna parte da sua história.'
        },
      },
    ],
  },
];

export const getTemplateById = (id: string): SiteTemplate | undefined => {
  return siteTemplates.find(template => template.id === id);
};

export const getTemplatesByCategory = (category: string): SiteTemplate[] => {
  return siteTemplates.filter(template => template.category === category);
};

export const getAllCategories = (): string[] => {
  return [...new Set(siteTemplates.map(template => template.category))];
};
