import { featureFlags } from '@/lib/feature-flags'

// ─── Status de Construção ──────────────────────────────────────────────────────

export const STATUS_CONSTRUCAO = [
  'Em construção',
  'Futuro lançamento',
  'Lançamento',
  'Na planta',
  'Novo',
  'Pronto para morar',
  'Pré-lançamento',
  'Revenda',
  'Seminovo',
  'Usado',
  'Últimas unidades',
] as const

export type StatusConstrucao = typeof STATUS_CONSTRUCAO[number]

// ─── Proximidades ──────────────────────────────────────────────────────────────

export const PROXIMIDADES_POPULAR = [
  'Escola', 'Supermercado', 'Shopping', 'Hospital', 'Farmácia',
  'Ponto de ônibus', 'Restaurante', 'Parque e Praça', 'Banco', 'Academia',
]

export const PROXIMIDADES_GRUPOS = [
  {
    label: 'Transporte',
    items: [
      'Estação de Metrô', 'Estação de Trem', 'Estação de VLT', 'Estação Rodoviária',
      'Ponto de ônibus', 'Ponto de Táxi', 'Estacionamento',
    ],
  },
  {
    label: 'Saúde',
    items: [
      'Hospital', 'Clínica de Saúde', 'Clínica Veterinária', 'Dentista',
      'Farmácia', 'Posto de Saúde', 'Petshop',
    ],
  },
  {
    label: 'Educação',
    items: ['Escola', 'Escola de Idioma', 'Faculdade', 'Universidade'],
  },
  {
    label: 'Compras e Serviços',
    items: [
      'Shopping', 'Supermercado', 'Banco', 'Lotérica', 'Padaria',
      'Banca de Jornal', 'Feira Livre', 'Posto de Combustível', 'Salão de Beleza',
      'Barbearia', 'Mini Mercado',
    ],
  },
  {
    label: 'Lazer e Cultura',
    items: [
      'Academia', 'Parque e Praça', 'Cinema', 'Restaurante', 'Bar e Choperia',
      'Igreja', 'Centro Esportivo', 'Praia', 'Parque Aquático', 'Clube',
    ],
  },
  {
    label: 'Outros',
    items: ['Centro', 'Delegacia', 'Indústria'],
  },
]

// ─── Características ────────────────────────────────────────────────────────────

export const CARACTERISTICAS_POPULAR = [
  'Piscina', 'Academia', 'Portaria 24 horas', 'Salão de Festas', 'Elevador Social',
  'Churrasqueira', 'Playground', 'Bicicletário', 'Espaço Gourmet', 'Coworking',
]

export const CARACTERISTICAS_GRUPOS = [
  {
    label: 'Segurança',
    items: [
      'Portaria 24 horas', 'Portaria Virtual', 'Segurança 24 horas', 'Câmera de Vigilância',
      'CFTV', 'Cerca elétrica', 'Interfone', 'Portão Eletrônico', 'Acesso por Biometria',
      'Fechadura Eletrônica', 'Guarita', 'Cabine de Segurança', 'Alarme Monitorado',
      'Sistema de Incendio', 'Extintores', 'Catraca Eletrônica', 'Portão tipo Clausura',
      'Segurança Interna', 'Segurança Patrimonial', 'Vigia', 'Vigilancia 24h',
      'Porta de Segurança', 'Sistema de Segurança', 'Portão Simples', 'Portaria',
    ],
  },
  {
    label: 'Lazer e Esportes',
    items: [
      'Piscina', 'Piscina Aquecida', 'Piscina Coberta', 'Piscina Infantil',
      'Piscina adulto', 'Piscina Coberta Climatizada', 'Piscina Privativa', 'Piscina da Cobertura',
      'Piscina com Hidromassagem', 'Piscina com Prainha', 'Piscina com borda infinita', 'Piscina com Cascata',
      'Piscina com Raia',
      'Academia', 'Academia ao Ar Livre', 'Sala Fitness', 'Espaço Pilates',
      'Salão de Festas', 'Salão de Festas Infantil', 'Salão de Jogos', 'Salão de Jogos Adulto', 'Salão de Jogos Juvenil',
      'Churrasqueira', 'Churrasqueira Privativa', 'Churrasqueira Coletiva', 'Churrasqueira na Sacada',
      'Churrasqueira a Gás', 'Espaço Gourmet', 'Espaço Grill', 'Forno de Pizza', 'Forno a Lenha', 'Fogão a Lenha',
      'Playground', 'Parque Infantil', 'Espaço Kids', 'Brinquedoteca', 'Espaço Juvenil',
      'Quadra Poliesportiva', 'Quadra de Tênis', 'Quadra de Vôlei', 'Campo de Futebol',
      'Quadra Gramada', 'Quadra de Areia', 'Quadra de Squash', 'Mini Quadra',
      'Pista de Caminhada', 'Pista de cooper', 'Ciclovia', 'Pista de Skate', 'Pista de Bocha',
      'SPA', 'Sauna', 'Sauna Seca', 'Sauna Úmida', 'Hidromassagem', 'Ofurô', 'Jacuzzi',
      'Solarium', 'Deck de Madeira', 'Deck Molhado', 'Pergolado', 'Quiosque',
      'Terraço', 'Terraço Gourmet', 'Rooftop', 'Mirante', 'Praça de Convivencia', 'Praça de fogo',
      'Bar', 'Restaurante', 'Piano-bar', 'Café', 'Adega',
      'Redário', 'Espaço Zen', 'Espaço Verde / Parque', 'Bosque', 'Jardim de inverno', 'Pomar',
      'Boliche', 'Bike Center', 'Espaço Motos', 'Espaço petwash', 'Espaço carwash',
      'Coworking', 'Espaço Leitura', 'Home cinema', 'Cinema', 'Garage Band',
      'Lazer na Cobertura', 'Lan House', 'Sala Massagem', 'Sala de descanso', 'Espaço Mulher',
    ],
  },
  {
    label: 'Infraestrutura e Serviços',
    items: [
      'Elevador Social', 'Elevador de Serviço', 'Elevador de Carga',
      'Elevador Panorâmico', 'Elevador privativo', 'Elevador Cadeirante',
      'Sem Elevador', 'Elevador Cod. Segurança', '2 Entradas', 'Entrada Lateral', 'Entrada de Serviço',
      'Bicicletário', 'Garagem Coberta', 'Garagem Escriturada', 'Garagem Privativa',
      'Garagem Ar Livre', 'Garagem Fechada', 'Garagem Coletiva', 'Garagem Demarcada',
      'Garagem Coletiva Suficiente', 'Garagem Coletiva Insuficiente',
      'Depósito na Garagem', 'Estacionamento Rotativo', 'Manobrista',
      'Entrada para Carro', 'Port Cochere', 'Vaga para Visita', 'Vaga anti-sequestro',
      'Gerador de Emergência', 'Gerador elétrico', 'Energia Solar', 'Carregador de Carro Elétrico',
      'Energia Elétrica', 'Energia Pública',
      'Fibra Ótica', 'Wi-fi', 'TV a cabo', 'TV Assinatura', 'Cabeamento Estruturado', 'Conexão à internet',
      'Telefonia PABX', 'Central Telefônica', 'Antena Coletiva', 'Parabólica',
      'Gás Encanado', 'Gás Individual', 'Central de Gás', 'Estação de Gás',
      'Heliponto', 'Auditório', 'Centro de Convenções',
      'Recepção', 'Concierge', 'Hall de Entrada', 'Sala de espera',
      'Lavanderia Coletiva', 'Depósito Privativo', 'Depósito Privativo no Subsolo',
      'Acessibilidade', 'Rampas', 'Acesso para deficientes',
      'Cisterna', 'Reservatório de Água', 'Medidores de Água Individuais',
      'Isolamento Acústico', 'Isolamento Térmico',
      'Children Care', 'Pet Care', 'Pet Place', 'Fraldário', 'Refeitório', 'Vestiario para diaristas',
      'Zelador', 'Serviços de Limpeza', 'Serviço de Quarto', 'Serviço de Praia', 'Serviços pay-per-use', 'Camareira',
    ],
  },
  {
    label: 'Composição',
    items: [
      'Sacada', 'Sacada Panorâmica', 'Sacada Técnica', 'Sacada Gourmet', 'Sacada com Envidraçamento',
      'Varanda', 'Varanda Gourmet', 'Área de Serviço', 'Lavanderia', 'Área de Lazer',
      'Banheiro Social', 'Banheiro de Serviço', 'WC Empregada', 'Banheira',
      'Sala Grande', 'Sala Pequena', 'Sala de Jantar', 'Sala de Ginástica', 'Sala de TV', 'Sala Íntima', 'Sala para Estudo',
      'Cozinha Grande', 'Escritório', 'Home Office', 'Dormitório reversível',
      'Ambientes Integrados', 'Mezanino', 'Área de Luz',
    ],
  },
  {
    label: 'Acabamentos (Gerais)',
    items: [
      'Gesso', 'Forro de Gesso', 'Forro de Madeira', 'Forro de PVC',
      'Janelas Grandes', 'Janelas de Alumínio', 'Janela de Vidro', 'Esquadria em Alumínio', 'Grades de Alumínio',
      'Janelas de Ferro', 'Esquadria em ferro', 'Grades de Ferro',
      'Janelas de Madeira', 'Esquadria em Madeira', 'Esquadria em PVC', 'Janela Automatizada',
      'Móveis Planejados', 'Armário de Cozinha', 'Armários Individuais', 'Armários na Lavanderia',
      'Piso Vinílico', 'Piso de taco', 'Piso ardósia', 'Cimento Queimado', 'Carpete',
      'Parede de Vidro', 'Muro de Vidro', 'Muro', 'Grade', 'Divisória', 'Drywall',
      'Pé direito duplo', 'Teto Rebaixado', 'Platibanda', 'Balaústre',
    ],
  },
  {
    label: 'Climatização',
    items: [
      'Aquecimento Solar', 'Aquecimento elétrico', 'Aquecimento Central', 'Lareira a Gás', 'Calefação',
      'Sistema de Aquecimento de Água à Gás', 'Sistema de Refrigeração Central - Tipo Split', 'Ventilação Natural', 'Arandelas',
    ],
  },
  {
    label: 'Energia',
    items: [
      '110v', '220v', '330v', 'Bifásico', 'Trifásico', 'Monofásico',
    ],
  },
  {
    label: 'Serviços Públicos',
    items: [
      'Coleta de Lixo', 'Iluminação Pública', 'Rede de Transporte Coletivo', 'Rede Pública',
      'Sistema de Água', 'Sistema de Esgoto', 'Rua asfaltada', 'Rua sem pavimento',
    ],
  },
  {
    label: 'Diferenciais',
    items: [
      'Aceita Pet', 'Mobiliado', 'Semi Mobiliado', 'Decorado', 'Reformado', 'Alto padrão',
      'Vista Panorâmica', 'Frente para o Mar', 'Vista para o Mar', 'Vista exterior', 'Vista para a montanha', 'Vista para lago',
      'Pé na Areia', 'Beira-mar', 'Litoral', 'Em Área de Preservação', 'Bosque', 'Lago', 'Riacho', 'Arroio',
      'Persiana Elétrica', 'Sem condomínio', 'Andar Inteiro', 'Meio Andar',
      'Conjunto fechado', 'Tipo casa', 'Porteira Fechada', 'Perfil de Investimento', 'Perfil de Estudantes', 'Moradia',
      'Atelier', 'Ateliê', 'Beauty hair', 'Biblioteca', 'Office', 'Salão', 'Bangalô',
      'Orquidário', 'Aquário', 'Incorporação', 'CDHU', 'Black Friday',
    ],
  },
]

// ─── Características dos Cômodos ───────────────────────────────────────────────

export const CARACTERISTICAS_COMODOS_POPULAR = [
  'Ar condicionado', 'Armário embutido', 'Móveis Planejados', 'Piso Porcelanato',
  'Piso Laminado', 'Ventilador de Teto', 'Gesso Rebaixado',
]

export const CARACTERISTICAS_COMODOS_GRUPOS = [
  {
    label: 'Móveis & Equipamentos',
    items: [
      'Ar condicionado', 'Armário', 'Armário embutido', 'Móveis Planejados',
      'Ventilador de Teto', 'Cortina de Vidro', 'Luminária',
    ],
  },
  {
    label: 'Pisos',
    items: [
      'Piso Porcelanato', 'Piso Cerâmica', 'Piso Laminado', 'Piso de Madeira',
      'Piso de taco', 'Carpete de Madeira', 'Carpete de Nylon', 'Piso Frio',
      'Piso Rústico', 'Piso Ardósia', 'Piso Granito', 'Piso Mármore', 'Piso Paviflex',
      'Piso emborrachado', 'Piso aquecido', 'Contra Piso', 'Cimento Queimado',
    ],
  },
  {
    label: 'Paredes & Revestimentos',
    items: [
      'Papel de Parede', 'Parede com Textura', 'Parede com Massa Corrida', 'Parede com Revestimento',
      'Parede em Alvenaria', 'Pedra', 'Pintura Latex', 'Pintura Texturizada',
      'Azulejo até o teto', 'Azulejo Parcial', 'Ladrilho', 'Litocerâmica', 'Granito', 'Tijolinho',
    ],
  },
  {
    label: 'Teto & Gesso',
    items: [
      'Gesso', 'Moldura', 'Gesso Rebaixado', 'Gesso(Sanca)',
    ],
  },
  {
    label: 'Esquadrias',
    items: [
      'Janelas', 'Janelas de Alumínio', 'Janelas de Ferro', 'Janelas de Madeira', 'Janelas de Vidro',
      'Grades de Alumínio', 'Grades de Ferro', 'Portas',
    ],
  },
  {
    label: 'Outros',
    items: ['Vaga Dupla'],
  },
]
