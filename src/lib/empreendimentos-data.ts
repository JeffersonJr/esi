// ─── Tipos ────────────────────────────────────────────────────────────────────

export type PlantaEmp = {
  codigo: string
  nome: string
  quartos: number
  banheiros: number
  vagasEscrituras: number
  vagasGaragem: number
  tipo: string
  valor: string
  areaUtil: number
}

export type TorreEmp = {
  nome: string
  status: string
  andares: number
  pavimentos: number
  plantas: PlantaEmp[]
}

export type ContatoEmp = {
  nome: string
  cargo: string
  telefone: string
}

export type CronogramaEtapaEmp = {
  etapa: string
  porcentagem: number
  inicio: string
  previsaoTermino: string
}

export type Empreendimento = {
  id: string
  nome: string
  codigo: string
  construtora: string
  finalidade: string
  bairro: string
  bairroComercial: string
  cidade: string
  estado: string
  cep: string
  endereco: string
  numero: string
  zona: string
  foto: string
  fotos: string[]
  status: string
  minDorms: number
  maxDorms: number
  minSuites: number
  maxSuites: number
  minVagas: number
  maxVagas: number
  precoMin: string
  precoMax: string
  unidades: number
  descricao: string
  caracteristicas: string[]
  proximidades: string[]
  torres: TorreEmp[]
  contatos: ContatoEmp[]
  captador1: string
  captador2: string
  observacoesInternas: string
  hotsite: string
  descricaoAlbert: string
  seoTitulo: string
  seoPalavras: string
  seoDescricao: string
  cronograma: CronogramaEtapaEmp[]
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const empreendimentosMock: Empreendimento[] = [
  {
    id: 'emp1',
    nome: 'Residencial Monte Verde',
    codigo: 'EMP-1302',
    construtora: 'Halli Construtora',
    finalidade: 'Residencial',
    bairro: 'Jardim Paulistano',
    bairroComercial: 'Jardim Paulistano',
    cidade: 'São José do Rio Preto',
    estado: 'São Paulo',
    cep: '15093-393',
    endereco: 'Rua João Manoel Pereira Filho',
    numero: '680',
    zona: 'Zona Sul',
    foto: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format',
    fotos: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?w=800&auto=format',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&auto=format',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format',
    ],
    status: 'Lançamento',
    minDorms: 2,
    maxDorms: 3,
    minSuites: 1,
    maxSuites: 2,
    minVagas: 1,
    maxVagas: 2,
    precoMin: 'R$ 380.000',
    precoMax: 'R$ 620.000',
    unidades: 48,
    descricao:
      'Sofisticado empreendimento residencial em localização privilegiada no Jardim Paulistano. Apartamentos com acabamento de alto padrão, varandas espaçosas e infraestrutura completa de lazer. Duas torres com 18 andares cada, piscina aquecida, academia equipada Technogym e salão de festas gourmet.',
    caracteristicas: [
      'Piscina', 'Academia', 'Salão de Festas', 'Playground', 'Portaria 24h',
      'Elevador', 'Churrasqueira', 'Coworking', 'Pet Friendly', 'Bicicletário',
    ],
    proximidades: [
      'Escola', 'Supermercado', 'Shopping', 'Hospital', 'Farmácia', 'Restaurantes', 'Parque',
    ],
    torres: [
      {
        nome: 'Torre A',
        status: 'Em Construção',
        andares: 18,
        pavimentos: 20,
        plantas: [
          { codigo: '18001', nome: 'Tipo 2 Dorms', quartos: 2, banheiros: 2, vagasEscrituras: 0, vagasGaragem: 1, tipo: 'Apartamento', valor: 'R$ 380.000', areaUtil: 62 },
          { codigo: '18002', nome: 'Tipo 3 Dorms', quartos: 3, banheiros: 2, vagasEscrituras: 0, vagasGaragem: 2, tipo: 'Apartamento', valor: 'R$ 520.000', areaUtil: 85 },
          { codigo: '18003', nome: 'Garden 2 Dorms', quartos: 2, banheiros: 2, vagasEscrituras: 0, vagasGaragem: 1, tipo: 'Garden', valor: 'R$ 420.000', areaUtil: 72 },
        ],
      },
      {
        nome: 'Torre B',
        status: 'Fundação',
        andares: 18,
        pavimentos: 20,
        plantas: [
          { codigo: '18101', nome: 'Tipo 3 Dorms Suíte Master', quartos: 3, banheiros: 3, vagasEscrituras: 1, vagasGaragem: 2, tipo: 'Apartamento', valor: 'R$ 560.000', areaUtil: 96 },
          { codigo: '18102', nome: 'Cobertura Duplex', quartos: 3, banheiros: 3, vagasEscrituras: 1, vagasGaragem: 2, tipo: 'Cobertura', valor: 'R$ 620.000', areaUtil: 138 },
        ],
      },
    ],
    contatos: [
      { nome: 'Ricardo Augusto', cargo: 'Diretor Comercial', telefone: '(17) 99812-3456' },
      { nome: 'Fernanda Lima', cargo: 'Gerente de Vendas', telefone: '(17) 98765-4321' },
    ],
    captador1: 'Ricardo Augusto - CRECI 317705',
    captador2: 'Fernanda Lima - CRECI 200411',
    observacoesInternas:
      'Empreendimento com parceria exclusiva com a Halli. Comissão de 2% para indicações externas. Prioridade de atendimento para clientes investidores com renda comprovada acima de R$ 10k. Estande de vendas funcionando sábados e domingos das 10h às 18h.',
    hotsite: 'https://hallimoveis.com.br/lp/lancamento/monte-verde',
    descricaoAlbert:
      'Residencial Monte Verde é um lançamento exclusivo no coração do Jardim Paulistano. Destaque a localização privilegiada a 5 minutos do Shopping Iguatemi e Hospital de Base. Enfatize a piscina aquecida e academia Technogym. Custo-benefício: 3 dormitórios com 2 vagas por menos de R$ 550k. Para investidores, mencione que a região valorizou 18% nos últimos 2 anos.',
    seoTitulo: 'Residencial Monte Verde | Lançamento Jardim Paulistano - São José do Rio Preto',
    seoPalavras:
      'apartamento lançamento jardim paulistano, monte verde são josé do rio preto, apartamento 3 dormitórios sjrp, lançamento sjrp 2025',
    seoDescricao:
      'Lançamento exclusivo no Jardim Paulistano, São José do Rio Preto. Apartamentos de 2 e 3 dormitórios com suíte, a partir de R$ 380.000. Lazer completo, portaria 24h e financiamento facilitado.',
    cronograma: [
      { etapa: 'Construção geral', porcentagem: 28, inicio: '2025-03-01', previsaoTermino: '2027-06-30' },
      { etapa: 'Fundação', porcentagem: 100, inicio: '2025-03-01', previsaoTermino: '2025-07-31' },
      { etapa: 'Estrutura', porcentagem: 60, inicio: '2025-08-01', previsaoTermino: '2026-04-30' },
      { etapa: 'Alvenaria', porcentagem: 20, inicio: '2026-05-01', previsaoTermino: '2026-10-31' },
      { etapa: 'Hidráulica', porcentagem: 0, inicio: '2026-11-01', previsaoTermino: '2027-02-28' },
      { etapa: 'Elétrica', porcentagem: 0, inicio: '2026-11-01', previsaoTermino: '2027-02-28' },
      { etapa: 'Acabamento', porcentagem: 0, inicio: '2027-03-01', previsaoTermino: '2027-06-30' },
    ],
  },

  {
    id: 'emp2',
    nome: 'Grand Parque Business',
    codigo: 'EMP-0891',
    construtora: 'Alpha Incorporadora',
    finalidade: 'Comercial',
    bairro: 'Redentora',
    bairroComercial: 'Centro Comercial',
    cidade: 'São José do Rio Preto',
    estado: 'São Paulo',
    cep: '15015-110',
    endereco: 'Av. Bady Bassitt',
    numero: '3200',
    zona: 'Zona Norte',
    foto: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&auto=format',
    fotos: [
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&auto=format',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&auto=format',
      'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&auto=format',
    ],
    status: 'Em Obras',
    minDorms: 0,
    maxDorms: 1,
    minSuites: 0,
    maxSuites: 0,
    minVagas: 1,
    maxVagas: 3,
    precoMin: 'R$ 250.000',
    precoMax: 'R$ 890.000',
    unidades: 120,
    descricao:
      'Complexo empresarial moderno na Av. Bady Bassitt, com salas comerciais de alto padrão, coworking integrado, auditório para 200 pessoas, rooftop privativo e 3 subsolos de garagem. Ideal para escritórios, clínicas, consultórios e lojas âncora. Previsão de entrega dezembro/2026.',
    caracteristicas: [
      'Coworking', 'Rooftop', 'Gerador', 'Elevador', 'Portaria 24h',
      'Estação de Recarga EV', 'Academia', 'Concierge', 'Heliponto',
    ],
    proximidades: [
      'Banco', 'Restaurantes', 'Shopping', 'Aeroporto', 'Transporte Público', 'Universidade',
    ],
    torres: [
      {
        nome: 'Torre Comercial',
        status: 'Estrutura',
        andares: 22,
        pavimentos: 25,
        plantas: [
          { codigo: '89001', nome: 'Sala 30m²', quartos: 0, banheiros: 1, vagasEscrituras: 1, vagasGaragem: 0, tipo: 'Sala Comercial', valor: 'R$ 250.000', areaUtil: 30 },
          { codigo: '89002', nome: 'Sala 50m²', quartos: 0, banheiros: 1, vagasEscrituras: 1, vagasGaragem: 1, tipo: 'Sala Comercial', valor: 'R$ 390.000', areaUtil: 50 },
          { codigo: '89003', nome: 'Sala 80m²', quartos: 0, banheiros: 2, vagasEscrituras: 2, vagasGaragem: 1, tipo: 'Sala Comercial', valor: 'R$ 580.000', areaUtil: 80 },
          { codigo: '89004', nome: 'Loja Âncora Térreo', quartos: 0, banheiros: 2, vagasEscrituras: 3, vagasGaragem: 0, tipo: 'Loja', valor: 'R$ 890.000', areaUtil: 130 },
        ],
      },
    ],
    contatos: [
      { nome: 'Carlos Nogueira', cargo: 'Superintendente de Vendas', telefone: '(17) 97654-3210' },
      { nome: 'Mariana Souza', cargo: 'Corretora Senior', telefone: '(17) 99123-7890' },
    ],
    captador1: 'Carlos Nogueira - CRECI 198882',
    captador2: '',
    observacoesInternas:
      'Previsão de entrega Dezembro/2026. Construtora oferece 30% de entrada e o restante em 36x durante a obra. Excelente para investidores — renda estimada de 0,7% ao mês na locação. Últimas 12 salas de 50m² disponíveis no pacote corporativo com desconto de 8%.',
    hotsite: 'https://alphaincorporadora.com.br/grand-parque-business',
    descricaoAlbert:
      'Grand Parque Business é o mais moderno complexo comercial de São José do Rio Preto. Para investidores, destaque a rentabilidade estimada de 0,7% ao mês na locação e o heliponto exclusivo. Para empresários, enfatize o coworking premium, auditório de 200 pessoas e localização estratégica na Av. Bady Bassitt com fluxo de 50.000 veículos/dia. Estação de recarga para veículos elétricos disponível.',
    seoTitulo: 'Grand Parque Business | Salas Comerciais Av. Bady Bassitt - São José do Rio Preto',
    seoPalavras:
      'sala comercial são josé do rio preto, sala à venda bady bassitt, investimento imóvel comercial sjrp, coworking sjrp',
    seoDescricao:
      'Salas comerciais de alto padrão na Av. Bady Bassitt, São José do Rio Preto. Unidades de 30m² a 130m², a partir de R$ 250.000. Coworking, rooftop, heliponto e estação de recarga EV.',
    cronograma: [
      { etapa: 'Construção geral', porcentagem: 45, inicio: '2024-06-01', previsaoTermino: '2026-12-31' },
      { etapa: 'Fundação', porcentagem: 100, inicio: '2024-06-01', previsaoTermino: '2024-10-31' },
      { etapa: 'Estrutura', porcentagem: 80, inicio: '2024-11-01', previsaoTermino: '2025-08-31' },
      { etapa: 'Alvenaria', porcentagem: 40, inicio: '2025-09-01', previsaoTermino: '2026-02-28' },
      { etapa: 'Hidráulica', porcentagem: 15, inicio: '2026-03-01', previsaoTermino: '2026-06-30' },
      { etapa: 'Elétrica', porcentagem: 15, inicio: '2026-03-01', previsaoTermino: '2026-06-30' },
      { etapa: 'Acabamento', porcentagem: 0, inicio: '2026-07-01', previsaoTermino: '2026-12-31' },
    ],
  },

  {
    id: 'emp3',
    nome: 'Villa Reserva Ipê',
    codigo: 'EMP-0412',
    construtora: 'Prime Construções',
    finalidade: 'Residencial',
    bairro: 'Boa Vista',
    bairroComercial: 'Boa Vista',
    cidade: 'São Paulo',
    estado: 'São Paulo',
    cep: '05468-901',
    endereco: 'Al. Ministro Rocha Azevedo',
    numero: '1200',
    zona: 'Zona Oeste',
    foto: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format',
    fotos: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&auto=format',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&auto=format',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format',
    ],
    status: 'Pronto',
    minDorms: 3,
    maxDorms: 4,
    minSuites: 2,
    maxSuites: 3,
    minVagas: 2,
    maxVagas: 4,
    precoMin: 'R$ 980.000',
    precoMax: 'R$ 1.800.000',
    unidades: 24,
    descricao:
      'Residencial de altíssimo padrão com apenas 24 unidades, garantindo privacidade e exclusividade absolutas. Apartamentos e coberturas com materiais importados, vista para área verde tombada, spa completo com piscina aquecida e jacuzzi. Cinema privativo e salão gourmet exclusivos. O mais exclusivo endereço do Boa Vista.',
    caracteristicas: [
      'Piscina', 'Spa', 'Sauna', 'Academia', 'Cinema Privativo',
      'Salão de Festas', 'Concierge', 'Portaria 24h', 'Elevador',
      'Heliponto', 'Área Verde', 'Pet Friendly', 'Rooftop',
    ],
    proximidades: [
      'Parque', 'Escola', 'Shopping', 'Hospital', 'Restaurantes', 'Academia', 'Teatro',
    ],
    torres: [
      {
        nome: 'Bloco Único',
        status: 'Pronto para Morar',
        andares: 12,
        pavimentos: 14,
        plantas: [
          { codigo: '41201', nome: 'Tipo 3 Suítes Master', quartos: 3, banheiros: 3, vagasEscrituras: 2, vagasGaragem: 0, tipo: 'Apartamento', valor: 'R$ 980.000', areaUtil: 142 },
          { codigo: '41202', nome: 'Tipo 4 Suítes Panorâmico', quartos: 4, banheiros: 4, vagasEscrituras: 3, vagasGaragem: 0, tipo: 'Apartamento', valor: 'R$ 1.350.000', areaUtil: 186 },
          { codigo: '41203', nome: 'Cobertura Duplex Premium', quartos: 4, banheiros: 4, vagasEscrituras: 4, vagasGaragem: 0, tipo: 'Cobertura', valor: 'R$ 1.800.000', areaUtil: 310 },
          { codigo: '41204', nome: 'Garden 3 Suítes', quartos: 3, banheiros: 3, vagasEscrituras: 2, vagasGaragem: 0, tipo: 'Garden', valor: 'R$ 1.100.000', areaUtil: 165 },
        ],
      },
    ],
    contatos: [
      { nome: 'Beatriz Almeida', cargo: 'Diretora Premium', telefone: '(11) 99988-7766' },
      { nome: 'Paulo Henrique', cargo: 'Corretor Exclusivo', telefone: '(11) 98877-6655' },
    ],
    captador1: 'Fernanda Lima - CRECI 200411',
    captador2: 'Ricardo Augusto - CRECI 317705',
    observacoesInternas:
      'Clientes qualificados apenas — renda comprovada mínima de R$ 25k. Últimas 4 unidades disponíveis: 2 coberturas e 2 garden. Permuta de imóveis aceita. Financiamento Itaú Private pré-aprovado em até 72h. Visita apenas com agendamento prévio.',
    hotsite: 'https://primeconstrucoes.com.br/villa-reserva-ipe',
    descricaoAlbert:
      'Villa Reserva Ipê é o endereço mais exclusivo de São Paulo. São apenas 24 famílias em um condomínio que compete com os melhores da Av. Paulista. Destaque: spa e sauna privativos, cinema 4K com 20 poltronas, apenas vizinhos de mesmo padrão social. A cobertura duplex de 310m² com heliponto é única no bairro. Últimas 4 unidades — urgência real. Permuta aceita.',
    seoTitulo: 'Villa Reserva Ipê | Alto Padrão Boa Vista São Paulo - Apartamentos e Coberturas Duplex',
    seoPalavras:
      'apartamento alto padrão boa vista sp, cobertura duplex são paulo, villa reserva ipê prime, apartamento 4 suites sp',
    seoDescricao:
      'Residencial de altíssimo padrão no Boa Vista, São Paulo. Apenas 24 unidades exclusivas com spa, cinema e concierge. Apartamentos de 3 e 4 suítes e coberturas duplex, a partir de R$ 980.000.',
    cronograma: [
      { etapa: 'Construção geral', porcentagem: 100, inicio: '2022-04-01', previsaoTermino: '2025-03-31' },
      { etapa: 'Fundação', porcentagem: 100, inicio: '2022-04-01', previsaoTermino: '2022-09-30' },
      { etapa: 'Estrutura', porcentagem: 100, inicio: '2022-10-01', previsaoTermino: '2023-06-30' },
      { etapa: 'Alvenaria', porcentagem: 100, inicio: '2023-07-01', previsaoTermino: '2023-12-31' },
      { etapa: 'Hidráulica', porcentagem: 100, inicio: '2024-01-01', previsaoTermino: '2024-06-30' },
      { etapa: 'Elétrica', porcentagem: 100, inicio: '2024-01-01', previsaoTermino: '2024-06-30' },
      { etapa: 'Acabamento', porcentagem: 100, inicio: '2024-07-01', previsaoTermino: '2025-03-31' },
    ],
  },
]
