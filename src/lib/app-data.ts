export type Temperatura = 'quente' | 'morno' | 'frio'

export type OrigemLead =
  | 'Anúncio no Jornal' | 'Captação' | 'Facebook' | 'Fifty' | 'Indicação' | 'Já conhecia a imobiliária'
  | 'Outros' | 'Parceria' | 'Placa' | 'Plantão' | 'Porta' | 'Revista' | 'Robô' | 'Rádio / TV'
  | 'SCI' | 'Telefone' | 'Vitrine' | 'Whatsapp'
  | 'Chats' | 'Chats: Albert' | 'Chats: Tawk.to'
  | 'Marketing' | 'Marketing: Actwork' | 'Marketing: Externo' | 'Marketing: Facebook' | 'Marketing: Google'
  | 'Marketing: Instagram' | 'Marketing: Leadlovers' | 'Marketing: Leads4sales' | 'Marketing: Leadster'
  | 'Marketing: TikTok' | 'Marketing: Whatsapp' | 'Marketing: Youtube'
  | 'Portal: 123i' | 'Portal: acharei' | 'Portal: AchouMudou' | 'Portal: AlugarJa' | 'Portal: Brasileiro Imóveis'
  | 'Portal: campainha' | 'Portal: Casa Jaú' | 'Portal: Casa Mineira' | 'Portal: Chave Fácil' | 'Portal: Chaves na Mão'
  | 'Portal: Cliquei Mudei' | 'Portal: DF Imóveis' | 'Portal: Diario Imoveis' | 'Portal: Epungo' | 'Portal: Grupo OLX'
  | 'Portal: Grupo SP' | 'Portal: Grupozap' | 'Portal: Guia de Imóveis' | 'Portal: Guia de Imóveis IMB'
  | 'Portal: Guia Imóvel & Cia' | 'Portal: iBex Imóveis' | 'Portal: Imocasa' | 'Portal: iMudou'
  | 'Portal: Imóveis em exposição' | 'Portal: Imóveis SC' | 'Portal: Imóvel Web' | 'Portal: Linklar'
  | 'Portal: Local do Imóvel' | 'Portal: Loop Imóveis' | 'Portal: Mercado Livre' | 'Portal: Moving Imóveis'
  | 'Portal: Olho Mágico' | 'Portal: Olx' | 'Portal: Outros' | 'Portal: Portais Imobiliários' | 'Portal: Portal CRECI'
  | 'Portal: Portal Lugar Certo' | 'Portal: Storia Imóveis' | 'Portal: Trocalar' | 'Portal: VaptVupt'
  | 'Portal: Viva Real' | 'Portal: WImoveis' | 'Portal: Zap Imóveis' | 'Portal: ZoopImoveis'
  | 'Website: Agende uma ligação' | 'Website: Cadastre seu imóvel' | 'Website: Fale conosco' | 'Website: Formulário Whatsapp'
  | 'Website: Formulário Whatsapp - Imóvel' | 'Website: Imóvel sob encomenda' | 'Website: Landing Page'
  | 'Website: Mais informações do empreendimento' | 'Website: Mais informações do Imóvel'
  | 'Website: Mais informações Empreendimento (Resultado de Pesquisa)'
  | 'Website: Mais informações Imovel (Resultado de Pesquisa)'
  | 'Website: Trabalhe Conosco'

export type EtapaFunil = string

export type TipoAtividade = 'visita' | 'reuniao' | 'ligacao' | 'prazo' | 'pos-venda' | 'albert'

export type StatusAtendimento = 'aberto' | 'ganho' | 'perdido'

export type PerfilBusca = {
  finalidade: 'Venda' | 'Locação' | 'Ambos' | ''
  tipoImovel: string
  cidades: string[]
  bairros: string[]
  quartos: number | null
  suites: number | null
  vagas: number | null
  areaMin: number | null
  areaMax: number | null
  valorMin: string
  valorMax: string
  andar: string
  lazer: boolean
  varanda: boolean
  mobiliado: boolean
  aceitaFinanciamento: boolean
  prazoParaComprar: string
  observacoes: string
  metodo4Q?: {
    quem: string
    oQue: string
    quando: string
    quanto: string
  }
  metodoFORD?: {
    familia: string
    ocupacao: string
    recreacao: string
    sonhos: string
  }
}

export type AtividadeAtendimento = {
  id: string
  tipo: TipoAtividade
  titulo: string
  descricao: string
  data: string
  hora: string
  importante: boolean
  concluida: boolean
  criadoEm: string
  telefone?: string
  whatsapp?: string
  cliente?: string
  imoveisVisitados?: { id: string; nome: string; visitado: boolean; endereco: string }[]
}

export type NotaAtendimento = {
  id: string
  texto: string
  criadoEm: string
}

export type EmailAtendimento = {
  id: string
  assunto: string
  para: string
  corpo: string
  enviadoEm: string
}

export type DocumentoAtendimento = {
  id: string
  nome: string
  tipo: string
  url: string
  anexadoEm: string
}

export type ImovelEnviado = {
  id: string
  codigoImovel: string
  tituloImovel: string
  enviadoPor: 'email' | 'whatsapp'
  enviadoEm: string
}

export type EventoTimeline = {
  id: string
  tipo: 'nota' | 'atividade' | 'email' | 'imovel_enviado' | 'documento' | 'origem' | 'etapa' | 'status' | 'whatsapp'
  descricao: string
  data: string
  hora: string
  importante?: boolean
  concluida?: boolean
}

export type AlbertFollowUp = {
  ativo: boolean
  dia: string
  hora: string
  instrucoes: string
}

export type Atendimento = {
  id: string
  nome: string
  iniciais: string
  email: string
  emailsAdicionais?: string[]
  telefone: string
  telefonesAdicionais?: string[]
  whatsappsAdicionais?: string[]
  etapa: EtapaFunil
  temperatura: Temperatura
  status: StatusAtendimento
  preAtendimento?: boolean
  origem: OrigemLead
  dataEntrada: string
  ultimaInteracao: string
  interesse: string
  valor: string
  modo: 'venda' | 'locacao'
  funilId: string
  perfil: PerfilBusca
  notas: NotaAtendimento[]
  atividades: AtividadeAtendimento[]
  emails: EmailAtendimento[]
  documentos: DocumentoAtendimento[]
  imoveisEnviados: ImovelEnviado[]
  timeline: EventoTimeline[]
  albert: AlbertFollowUp
}

// ─── Multi-funil ─────────────────────────────────────────────────────────────
export type Funil = {
  id: string
  nome: string
  descricao: string
  cor: string // classe tailwind para a cor do badge
  etapas?: Array<{ id: string; label: string; cor: string }>
}

const DEFAULT_ETAPAS = [
  { id: 'qualificando', label: 'Qualificando', cor: 'bg-indigo-100 text-indigo-800 border border-indigo-200 font-medium dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-800' },
  { id: 'conhecendo', label: 'Conhecendo', cor: 'bg-blue-100 text-blue-800 border border-blue-200 font-medium dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800' },
  { id: 'agendado', label: 'Agendado', cor: 'bg-amber-100 text-amber-800 border border-amber-200 font-medium dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800' },
  { id: 'negociando', label: 'Negociando', cor: 'bg-emerald-100 text-emerald-800 border border-emerald-200 font-medium dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800' },
]

export const funis: Funil[] = [
  { id: 'principal', nome: 'Principal', descricao: 'Funil padrão de vendas', cor: 'bg-primary text-primary-foreground', etapas: DEFAULT_ETAPAS },
  { id: 'alto-padrao', nome: 'Alto Padrão', descricao: 'Imóveis acima de R$ 1,5M', cor: 'bg-amber text-ink', etapas: DEFAULT_ETAPAS },
  { id: 'locacoes', nome: 'Locações', descricao: 'Contratos de locação', cor: 'bg-teal-mid text-white', etapas: DEFAULT_ETAPAS },
]

export const perfilVazio: PerfilBusca = {
  finalidade: '',
  tipoImovel: 'Apartamento',
  cidades: ['São Paulo'],
  bairros: [],
  quartos: null,
  suites: null,
  vagas: null,
  areaMin: null,
  areaMax: null,
  valorMin: '',
  valorMax: '',
  andar: '',
  lazer: false,
  varanda: false,
  mobiliado: false,
  aceitaFinanciamento: false,
  prazoParaComprar: 'Imediato',
  observacoes: '',
  metodo4Q: {
    quem: '',
    oQue: '',
    quando: '',
    quanto: '',
  },
  metodoFORD: {
    familia: '',
    ocupacao: '',
    recreacao: '',
    sonhos: '',
  },
}

export const atendimentos: Atendimento[] = [
  // --- AGENDADO (3) ---
  {
    id: 'l1',
    nome: 'Mariana Costa',
    iniciais: 'MC',
    email: 'mariana.costa@email.com',
    telefone: '(11) 98765-4321',
    etapa: 'agendado',
    temperatura: 'quente',
    status: 'aberto',
    origem: 'Portal: Zap Imóveis',
    dataEntrada: '30/06/2026',
    ultimaInteracao: 'há 12 min',
    interesse: 'Apto 2 dorms · Jardins',
    valor: 'R$ 890.000',
    modo: 'venda',
    funilId: 'principal',
    perfil: {
      ...perfilVazio,
      finalidade: 'Venda',
      tipoImovel: 'Apartamento',
      cidades: ['São Paulo'],
      bairros: ['Jardins', 'Itaim Bibi'],
      quartos: 2,
      suites: 1,
      vagas: 2,
      areaMin: 70,
      areaMax: 120,
      valorMin: 'R$ 700.000',
      valorMax: 'R$ 1.000.000',
      lazer: true,
      varanda: true,
      prazoParaComprar: '1-3 meses',
      observacoes: 'Prefere andar alto. Não quer térreo.',
      metodo4Q: { quem: 'Ela e o marido decidem juntos', oQue: 'Apartamento com varanda gourmet, min 2 dorms', quando: 'Até o final do ano (precisam mudar antes das aulas do filho)', quanto: 'Orçamento aprovado de até 1 milhão' },
      metodoFORD: { familia: 'Casada com Rodrigo, um filho pequeno de 3 anos (Lucas)', ocupacao: 'Arquiteta em escritório próprio, marido é engenheiro', recreacao: 'Gostam de receber amigos para churrasco no fim de semana', sonhos: 'Morar perto do parque Ibirapuera para passear com o cachorro e o filho' },
    },
    notas: [{ id: 'n1', texto: 'Cliente muito animada, quer visitar no sábado pela manhã.', criadoEm: 'Hoje, 09:45' }],
    atividades: [{ id: 'a2', tipo: 'visita', titulo: 'Visita — Cobertura Vila Nova', descricao: 'Chegar 15 minutos antes para abrir as janelas.', data: 'Hoje', hora: '15:00', importante: true, concluida: false, criadoEm: 'Hoje, 09:32', imoveisVisitados: [{ id: 'v1', nome: 'Casa em condomínio', visitado: false, endereco: 'Alameda Rio Negro, Barueri' }] }],
    emails: [{ id: 'e1', assunto: 'Imóvel MS-1042 — Apartamento Jardins', para: 'mariana.costa@email.com', corpo: 'Olá Mariana, segue a ficha do imóvel conforme combinado...', enviadoEm: 'Ontem, 16:10' }],
    documentos: [{ id: 'd10', nome: 'Proposta_Comercial_Mariana.pdf', tipo: 'pdf', url: '#', anexadoEm: 'Ontem' }, { id: 'd11', nome: 'Identidade_Mariana.jpg', tipo: 'jpg', url: '#', anexadoEm: 'Hoje' }],
    imoveisEnviados: [{ id: 'ie1', codigoImovel: 'MS-1042', tituloImovel: 'Apartamento com varanda gourmet', enviadoPor: 'email', enviadoEm: 'Ontem, 16:10' }],
    timeline: [
      { id: 't1', tipo: 'atividade', descricao: 'Visita agendada — Apto Jardins MS-1042', data: 'Hoje', hora: '09:32', importante: true },
      { id: 't2', tipo: 'nota', descricao: 'Cliente animada, quer visitar no sábado.', data: 'Hoje', hora: '09:45' },
      { id: 't3', tipo: 'email', descricao: 'E-mail enviado: ficha do imóvel MS-1042', data: 'Ontem', hora: '16:10' },
      { id: 't4', tipo: 'imovel_enviado', descricao: 'Imóvel MS-1042 enviado por e-mail', data: 'Ontem', hora: '16:10' },
      { id: 't5', tipo: 'origem', descricao: 'Lead captado via Portal ZAP', data: '30/06', hora: '08:22' },
    ],
    albert: { ativo: false, dia: '', hora: '', instrucoes: '' },
  },
  {
    id: 'l4',
    nome: 'Paulo Henrique',
    iniciais: 'PH',
    email: 'paulo.h@email.com',
    telefone: '(11) 97654-3210',
    etapa: 'agendado',
    temperatura: 'quente',
    status: 'aberto',
    origem: 'Marketing: Instagram',
    dataEntrada: '28/06/2026',
    ultimaInteracao: 'há 40 min',
    interesse: 'Cobertura · Vila Nova',
    valor: 'R$ 2.300.000',
    modo: 'venda',
    funilId: 'alto-padrao',
    perfil: { ...perfilVazio, finalidade: 'Venda', tipoImovel: 'Cobertura', cidades: ['São Paulo'], bairros: ['Vila Nova Conceição', 'Itaim Bibi'], quartos: 3, suites: 3, vagas: 3, areaMin: 180, valorMin: 'R$ 2.000.000', valorMax: 'R$ 3.000.000', lazer: true, varanda: true, prazoParaComprar: 'Imediato', metodo4Q: { quem: 'Ele sozinho, solteiro', oQue: 'Cobertura com vista livre e piscina', quando: 'Imediato (vendeu empresa recentemente)', quanto: 'À vista, limite de 3M' }, metodoFORD: { familia: 'Solteiro, sem filhos', ocupacao: 'Empreendedor, acabou de vender uma startup', recreacao: 'Gosta de festas exclusivas, carros esportivos e vinhos', sonhos: 'Ter um espaço incrível para receber os amigos do networking' } },
    notas: [],
    atividades: [{ id: 'av1', tipo: 'visita', titulo: 'Visita — Cobertura Vila Nova', descricao: 'Confirmar com portaria 30min antes.', data: '2026-07-06', hora: '15:00', importante: true, concluida: false, criadoEm: 'Ontem, 14:20' }],
    emails: [],
    documentos: [{ id: 'd40', nome: 'Termo_De_Visita.pdf', tipo: 'pdf', url: '#', anexadoEm: 'Ontem' }],
    imoveisEnviados: [],
    timeline: [
      { id: 't1', tipo: 'atividade', descricao: 'Visita agendada — Cobertura Vila Nova', data: 'Hoje', hora: '08:50', importante: true },
      { id: 't2', tipo: 'origem', descricao: 'Lead captado via Instagram', data: '28/06', hora: '11:00' },
    ],
    albert: { ativo: false, dia: '', hora: '', instrucoes: '' },
  },
  {
    id: 'l9',
    nome: 'Dra. Camila Soares',
    iniciais: 'CS',
    email: 'camila.soares@email.com',
    telefone: '(11) 91122-3344',
    etapa: 'agendado',
    temperatura: 'quente',
    status: 'aberto',
    origem: 'Indicação',
    dataEntrada: '05/07/2026',
    ultimaInteracao: 'há 2 h',
    interesse: 'Consultório · Paulista',
    valor: 'R$ 12.000/mês',
    modo: 'locacao',
    funilId: 'locacoes',
    perfil: { ...perfilVazio, finalidade: 'Locação', tipoImovel: 'Comercial', cidades: ['São Paulo'], bairros: ['Bela Vista', 'Paraíso'], areaMin: 80, valorMax: 'R$ 15.000/mês', prazoParaComprar: '1 mês', metodo4Q: { quem: 'Ela e os sócios da clínica', oQue: 'Conjunto comercial pronto para clínica médica', quando: 'Próximo mês (expansão)', quanto: 'Aluguel de até 15k' }, metodoFORD: { familia: 'Casada, sem filhos', ocupacao: 'Médica Dermatologista', recreacao: 'Viagens internacionais e alta gastronomia', sonhos: 'Ter a clínica referência na Paulista' } },
    notas: [],
    atividades: [{ id: 'av2', tipo: 'reuniao', titulo: 'Reunião com Sócios', descricao: 'Apresentar as opções da Paulista', data: 'Hoje', hora: '17:30', importante: true, concluida: false, criadoEm: 'Ontem, 10:20' }],
    emails: [],
    documentos: [],
    imoveisEnviados: [],
    timeline: [{ id: 't1', tipo: 'atividade', descricao: 'Reunião agendada com os sócios', data: 'Ontem', hora: '10:20', importante: true }, { id: 't2', tipo: 'origem', descricao: 'Lead captado por Indicação (Dr. Rubens)', data: '05/07', hora: '09:00' }],
    albert: { ativo: false, dia: '', hora: '', instrucoes: '' },
  },

  // --- QUALIFICANDO (3) ---
  {
    id: 'l2',
    nome: 'Ricardo Almeida',
    iniciais: 'RA',
    email: 'ricardo.almeida@email.com',
    telefone: '(11) 95432-1098',
    etapa: 'qualificando',
    temperatura: 'morno',
    status: 'aberto',
    origem: 'Website: Landing Page',
    dataEntrada: '04/07/2026',
    ultimaInteracao: 'há 2 h',
    interesse: 'Casa em condomínio',
    valor: 'R$ 1.450.000',
    modo: 'venda',
    funilId: 'principal',
    perfil: { ...perfilVazio, finalidade: 'Venda', tipoImovel: 'Casa', cidades: ['Barueri'], bairros: ['Alphaville'], quartos: 4, suites: 2, vagas: 3, valorMin: 'R$ 1.200.000', valorMax: 'R$ 1.600.000', lazer: true, prazoParaComprar: '3-6 meses', observacoes: 'Precisa de condomínio fechado com segurança 24h.', metodo4Q: { quem: 'Ricardo e a esposa (ela é quem dá a palavra final)', oQue: 'Casa em condomínio fechado com segurança rígida', quando: 'Sem pressa, até 6 meses', quanto: 'Entre 1.2M e 1.6M, dependendo da permuta' }, metodoFORD: { familia: 'Casado, 3 filhos adolescentes', ocupacao: 'Diretor financeiro de multinacional', recreacao: 'Gosta de jogar tênis e fazer trilhas de bicicleta', sonhos: 'Tranquilidade e segurança para os filhos crescerem com liberdade' } },
    notas: [{ id: 'n1', texto: 'Cliente prefere região de Alphaville. Enfatizou segurança como prioridade 1.', criadoEm: '04/07' }],
    atividades: [{ id: 'a2', tipo: 'ligacao', titulo: 'Alinhamento de perfil', descricao: 'Ligar para detalhar o que a esposa achou dos imoveis.', data: 'Hoje', hora: '10:00', importante: false, concluida: false, criadoEm: 'Hoje' }],
    emails: [],
    documentos: [{ id: 'd1', nome: 'Cópia CNH Ricardo.pdf', tipo: 'pdf', url: '#', anexadoEm: 'Ontem' }, { id: 'd2', nome: 'Comprovante_Residencia.png', tipo: 'png', url: '#', anexadoEm: 'Hoje' }],
    imoveisEnviados: [],
    timeline: [
      { id: 't1', tipo: 'origem', descricao: 'Lead captado via Site Próprio', data: '04/07', hora: '14:30' },
      { id: 't2', tipo: 'atividade', descricao: 'Primeiro contato (Qualificação) - Concluído', data: '04/07', hora: '15:10', concluida: true },
      { id: 't3', tipo: 'nota', descricao: 'Adicionada nota: Cliente prefere região de Alphaville...', data: '04/07', hora: '15:15' },
    ],
    albert: { ativo: false, dia: '', hora: '', instrucoes: '' },
  },
  {
    id: 'l8',
    nome: 'Carlos Mendes',
    iniciais: 'CM',
    email: 'carlos.mendes@email.com',
    telefone: '(11) 92345-6789',
    etapa: 'qualificando',
    temperatura: 'morno',
    status: 'aberto',
    origem: 'Facebook',
    dataEntrada: '05/07/2026',
    ultimaInteracao: 'há 3 h',
    interesse: 'Studio · Pinheiros',
    valor: 'R$ 3.500/mês',
    modo: 'locacao',
    funilId: 'locacoes',
    perfil: { ...perfilVazio, finalidade: 'Locação', tipoImovel: 'Studio', cidades: ['São Paulo'], bairros: ['Pinheiros', 'Vila Madalena'], quartos: 1, suites: 0, vagas: 1, valorMax: 'R$ 4.000/mês', mobiliado: true, prazoParaComprar: 'Imediato', metodo4Q: { quem: 'Carlos (mora sozinho)', oQue: 'Studio mobiliado próximo ao metrô', quando: 'Imediato, começou em um novo emprego presencial', quanto: 'Até R$ 4.000 o pacote (aluguel+cond)' }, metodoFORD: { familia: 'Solteiro, família mora no interior (Campinas)', ocupacao: 'Desenvolvedor Senior no Itaú', recreacao: 'Gamer, gosta de ir a bares artesanais em Pinheiros', sonhos: 'Ficar perto do trabalho para não perder tempo no trânsito' } },
    notas: [],
    atividades: [],
    emails: [],
    documentos: [{ id: 'd80', nome: 'Comprovante_de_Renda.pdf', tipo: 'pdf', url: '#', anexadoEm: '22/06/2026' }],
    imoveisEnviados: [],
    timeline: [{ id: 't1', tipo: 'origem', descricao: 'Lead captado via Facebook', data: '05/07', hora: '10:00' }],
    albert: { ativo: false, dia: '', hora: '', instrucoes: '' },
  },
  {
    id: 'l10',
    nome: 'Sérgio Nogueira',
    iniciais: 'SN',
    email: 'sergio.invest@email.com',
    telefone: '(11) 97788-9900',
    etapa: 'qualificando',
    temperatura: 'frio',
    status: 'aberto',
    origem: 'Whatsapp',
    dataEntrada: '07/07/2026',
    ultimaInteracao: 'há 15 min',
    interesse: 'Terreno galpão',
    valor: 'R$ 4.500.000',
    modo: 'venda',
    funilId: 'alto-padrao',
    perfil: { ...perfilVazio, finalidade: 'Venda', tipoImovel: 'Terreno', cidades: ['Guarulhos', 'Osasco'], areaMin: 2000, valorMax: 'R$ 5.000.000', prazoParaComprar: 'Até fim do ano', metodo4Q: { quem: 'Ele e fundo de investimento', oQue: 'Terreno para construção de galpão logístico', quando: 'Oportunidade', quanto: 'Até 5 milhões à vista' }, metodoFORD: { familia: 'Casado, sem filhos morando junto', ocupacao: 'Investidor imobiliário', recreacao: 'Golfe e leilões', sonhos: 'Expandir o portfólio logístico na Grande SP' } },
    notas: [],
    atividades: [{ id: 'a10', tipo: 'ligacao', titulo: 'Ligar para entender zoneamento', descricao: 'Verificar se aceita ZPI.', data: 'Amanhã', hora: '11:00', importante: false, concluida: false, criadoEm: 'Hoje' }],
    emails: [],
    documentos: [],
    imoveisEnviados: [],
    timeline: [{ id: 't1', tipo: 'origem', descricao: 'Lead captado via WhatsApp', data: 'Hoje', hora: '08:00' }],
    albert: { ativo: false, dia: '', hora: '', instrucoes: '' },
  },

  // --- CONHECENDO (3) ---
  {
    id: 'l3',
    nome: 'Fernanda Lima',
    iniciais: 'FL',
    email: 'fe.lima@email.com',
    telefone: '(11) 94321-0987',
    etapa: 'conhecendo',
    temperatura: 'frio',
    status: 'aberto',
    origem: 'Indicação',
    dataEntrada: '01/07/2026',
    ultimaInteracao: 'ontem',
    interesse: 'Studio p/ locação',
    valor: 'R$ 2.800/mês',
    modo: 'locacao',
    funilId: 'locacoes',
    perfil: { ...perfilVazio, finalidade: 'Locação', tipoImovel: 'Studio', cidades: ['São Paulo'], bairros: ['Centro', 'Vila Madalena'], quartos: 1, suites: 0, vagas: 1, valorMax: 'R$ 3.500/mês', mobiliado: true, prazoParaComprar: 'Imediato', metodo4Q: { quem: 'Ela (estudante)', oQue: 'Studio seguro e mobiliado para estudante', quando: 'Imediato (aulas começam mês que vem)', quanto: 'Até R$ 3.500/mês (fiador são os pais)' }, metodoFORD: { familia: 'Os pais moram em MG, ela vem estudar em SP', ocupacao: 'Estudante de Medicina (USP)', recreacao: 'Leitura, museus e cafés', sonhos: 'Se formar e abrir a própria clínica' } },
    notas: [],
    atividades: [],
    emails: [],
    documentos: [{ id: 'd30', nome: 'Ficha_Locacao_Assinada.pdf', tipo: 'pdf', url: '#', anexadoEm: '02/07/2026' }],
    imoveisEnviados: [],
    timeline: [{ id: 't1', tipo: 'origem', descricao: 'Lead captado por indicação', data: '01/07', hora: '17:40' }],
    albert: { ativo: true, dia: '08/07/2026', hora: '10:00', instrucoes: 'Ligar e perguntar se ainda tem interesse na locação.' },
  },
  {
    id: 'l5',
    nome: 'Juliana Martins',
    iniciais: 'JM',
    email: 'ju.martins@email.com',
    telefone: '(11) 99876-5432',
    etapa: 'conhecendo',
    temperatura: 'morno',
    status: 'aberto',
    origem: 'Portal: Viva Real',
    dataEntrada: '02/07/2026',
    ultimaInteracao: 'há 5 h',
    interesse: 'Apto 3 dorms · Moema',
    valor: 'R$ 1.120.000',
    modo: 'venda',
    funilId: 'principal',
    perfil: { ...perfilVazio, finalidade: 'Venda', tipoImovel: 'Apartamento', cidades: ['São Paulo'], bairros: ['Moema', 'Ibirapuera'], quartos: 3, suites: 1, vagas: 2, valorMin: 'R$ 900.000', valorMax: 'R$ 1.300.000', prazoParaComprar: '3-6 meses', metodo4Q: { quem: 'Juliana e o esposo', oQue: 'Apartamento espaçoso e com boa planta para reformar', quando: 'Dentro de 6 meses', quanto: 'Até 1.3M para sobrar caixa para a reforma' }, metodoFORD: { familia: 'Casada, planejando o primeiro filho', ocupacao: 'Gerente de marketing', recreacao: 'Viagens para a praia, gastronomia e shows', sonhos: 'Ter um apartamento com o quarto do bebê decorado do zero' } },
    notas: [],
    atividades: [],
    emails: [],
    documentos: [{ id: 'd50', nome: 'Matricula_Atualizada.pdf', tipo: 'pdf', url: '#', anexadoEm: '03/07/2026' }, { id: 'd51', nome: 'Planta_Baixa.pdf', tipo: 'pdf', url: '#', anexadoEm: '04/07/2026' }],
    imoveisEnviados: [],
    timeline: [{ id: 't1', tipo: 'origem', descricao: 'Lead captado via Portal VivaReal', data: '02/07', hora: '09:15' }],
    albert: { ativo: false, dia: '', hora: '', instrucoes: '' },
  },
  {
    id: 'l11',
    nome: 'Roberto e Lúcia',
    iniciais: 'RL',
    email: 'roberto.lucia@email.com',
    telefone: '(11) 94455-6677',
    etapa: 'conhecendo',
    temperatura: 'morno',
    status: 'aberto',
    origem: 'Website: Landing Page',
    dataEntrada: '06/07/2026',
    ultimaInteracao: 'há 1 dia',
    interesse: 'Casa em condomínio (Downsize)',
    valor: 'R$ 2.000.000',
    modo: 'venda',
    funilId: 'alto-padrao',
    perfil: { ...perfilVazio, finalidade: 'Venda', tipoImovel: 'Casa de Condomínio', cidades: ['Santana de Parnaíba'], bairros: ['Gênesis II'], quartos: 3, valorMax: 'R$ 2.500.000', metodo4Q: { quem: 'O casal', oQue: 'Casa térrea (acessibilidade), em condomínio tranquilo', quando: 'Imediato, casa atual é muito grande e vazia', quanto: 'Vão dar a casa atual na permuta ou pagar à vista' }, metodoFORD: { familia: 'Casal de idosos, filhos já casados e moram fora', ocupacao: 'Aposentados', recreacao: 'Jardinagem, receber os netos no domingo', sonhos: 'Uma casa prática, segura e sem escadas para a velhice' } },
    notas: [{ id: 'n11', texto: 'Atenção especial à ausência de escadas.', criadoEm: 'Ontem' }],
    atividades: [{ id: 'a11', tipo: 'pos-venda', titulo: 'Envio de opções', descricao: 'Separar 5 casas térreas e enviar.', data: 'Hoje', hora: '14:00', importante: false, concluida: true, criadoEm: 'Ontem' }],
    emails: [],
    documentos: [],
    imoveisEnviados: [],
    timeline: [{ id: 't1', tipo: 'origem', descricao: 'Lead captado via Site', data: '06/07', hora: '10:00' }, { id: 't2', tipo: 'atividade', descricao: 'Envio de opções - Concluído', data: 'Hoje', hora: '14:00', concluida: true }],
    albert: { ativo: false, dia: '', hora: '', instrucoes: '' },
  },

  // --- NEGOCIANDO (3) ---
  {
    id: 'l6',
    nome: 'André Souza',
    iniciais: 'AS',
    email: 'andre.souza@email.com',
    telefone: '(11) 91234-5678',
    etapa: 'negociando',
    temperatura: 'quente',
    status: 'aberto',
    origem: 'Website: Landing Page',
    dataEntrada: '25/06/2026',
    ultimaInteracao: 'há 1 h',
    interesse: 'Casa cond. Alphaville',
    valor: 'R$ 1.680.000',
    modo: 'venda',
    funilId: 'alto-padrao',
    perfil: { ...perfilVazio, finalidade: 'Venda', tipoImovel: 'Casa', cidades: ['Barueri'], bairros: ['Alphaville'], quartos: 4, suites: 3, vagas: 4, valorMin: 'R$ 1.500.000', valorMax: 'R$ 2.000.000', lazer: true, prazoParaComprar: 'Imediato', aceitaFinanciamento: true, metodo4Q: { quem: 'André e o setor jurídico da empresa', oQue: 'Casa pronta para morar em Alphaville', quando: 'Já, está em fase de minuta de contrato', quanto: 'Fechado em 1.68M' }, metodoFORD: { familia: 'Casado, 2 filhos e 2 cachorros', ocupacao: 'Sócio de escritório de advocacia', recreacao: 'Clube, natação e viagens', sonhos: 'Uma casa ampla onde a família tenha segurança total' } },
    notas: [],
    atividades: [{ id: 'av3', tipo: 'prazo', titulo: 'Cobrar assinatura do contrato', descricao: 'Ligar para o jurídico.', data: 'Hoje', hora: '16:00', importante: true, concluida: false, criadoEm: 'Hoje, 08:00' }],
    emails: [],
    documentos: [{ id: 'd60', nome: 'Folder_Empreendimento.pdf', tipo: 'pdf', url: '#', anexadoEm: '05/07/2026' }],
    imoveisEnviados: [],
    timeline: [
      { id: 't1', tipo: 'etapa', descricao: 'Avançou para Negociando', data: 'Hoje', hora: '09:00' },
      { id: 't2', tipo: 'atividade', descricao: 'Reunião de proposta - Concluído', data: 'Ontem', hora: '18:00', concluida: true },
      { id: 't3', tipo: 'origem', descricao: 'Lead captado via Site Próprio', data: '25/06', hora: '10:30' },
    ],
    albert: { ativo: false, dia: '', hora: '', instrucoes: '' },
  },
  {
    id: 'l7',
    nome: 'Beatriz Rocha',
    iniciais: 'BR',
    email: 'bia.rocha@email.com',
    telefone: '(11) 96543-2109',
    etapa: 'negociando',
    temperatura: 'quente',
    status: 'aberto',
    origem: 'Portal: Zap Imóveis',
    dataEntrada: '20/06/2026',
    ultimaInteracao: 'há 30 min',
    interesse: 'Studio Centro · Venda',
    valor: 'R$ 420.000',
    modo: 'venda',
    funilId: 'principal',
    perfil: { ...perfilVazio, finalidade: 'Venda', tipoImovel: 'Studio', cidades: ['São Paulo'], bairros: ['Centro'], quartos: 1, suites: 0, vagas: 1, valorMax: 'R$ 500.000', prazoParaComprar: 'Imediato', metodo4Q: { quem: 'Beatriz', oQue: 'Studio mobiliado para investimento (AirBnb)', quando: 'Agora (proposta aceita)', quanto: '420 mil à vista' }, metodoFORD: { familia: 'Solteira, investidora independente', ocupacao: 'Servidora Pública', recreacao: 'Teatro, feiras de arte', sonhos: 'Viver de renda passiva com imóveis' } },
    notas: [],
    atividades: [],
    emails: [],
    documentos: [{ id: 'd70', nome: 'RG_Beatriz.jpg', tipo: 'jpg', url: '#', anexadoEm: '20/06/2026' }],
    imoveisEnviados: [],
    timeline: [
      { id: 't1', tipo: 'status', descricao: 'Proposta aceita — aguardando documentação', data: 'Hoje', hora: '10:05', importante: true },
      { id: 't2', tipo: 'origem', descricao: 'Lead captado via Portal ZAP', data: '20/06', hora: '08:00' },
    ],
    albert: { ativo: false, dia: '', hora: '', instrucoes: '' },
  },
  {
    id: 'l12',
    nome: 'TechCorp Brasil',
    iniciais: 'TB',
    email: 'facilities@techcorp.com.br',
    telefone: '(11) 93322-1100',
    etapa: 'negociando',
    temperatura: 'quente',
    status: 'aberto',
    origem: 'Indicação',
    dataEntrada: '15/06/2026',
    ultimaInteracao: 'há 10 min',
    interesse: 'Laje Corporativa',
    valor: 'R$ 25.000/mês',
    modo: 'locacao',
    funilId: 'locacoes',
    perfil: { ...perfilVazio, finalidade: 'Locação', tipoImovel: 'Comercial', cidades: ['São Paulo'], bairros: ['Vila Olímpia'], areaMin: 300, valorMax: 'R$ 30.000/mês', prazoParaComprar: 'Imediato', metodo4Q: { quem: 'Diretoria e Facilities', oQue: 'Laje corporativa open space para 80 posições', quando: 'Urgente, contrato atual vence em 2 meses', quanto: 'Até 30k/mês' }, metodoFORD: { familia: 'Empresa multinacional de software', ocupacao: 'Tecnologia', recreacao: 'Eventos corporativos e happy hour', sonhos: 'Criar um escritório que atraia talentos presencialmente' } },
    notas: [{ id: 'n12', texto: 'Aguardando apenas fiador empresarial (seguro fiança porto).', criadoEm: 'Hoje' }],
    atividades: [{ id: 'a12', tipo: 'ligacao', titulo: 'Cobrar Seguradora', descricao: 'Verificar status da aprovação do seguro fiança.', data: 'Hoje', hora: '11:30', importante: true, concluida: false, criadoEm: 'Hoje' }],
    emails: [],
    documentos: [],
    imoveisEnviados: [],
    timeline: [
      { id: 't1', tipo: 'atividade', descricao: 'Contrato enviado para assinatura digital', data: 'Ontem', hora: '14:00', importante: true },
      { id: 't2', tipo: 'origem', descricao: 'Lead captado por Indicação (Broker SP)', data: '15/06', hora: '13:00' }
    ],
    albert: { ativo: false, dia: '', hora: '', instrucoes: '' },
  }
]

export type EstagioFunil = {
  id: EtapaFunil
  nome: string
  atendimentos: Atendimento[]
}

export function getFunil(funilId: string, filtroModo?: 'venda' | 'locacao' | 'todos'): EstagioFunil[] {
  const lista = atendimentos.filter((a) => {
    const matchFunil = a.funilId === funilId
    const matchStatus = a.status === 'aberto'
    const matchModo = !filtroModo || filtroModo === 'todos' || a.modo === filtroModo
    return matchFunil && matchStatus && matchModo
  })
  const funil = funis.find(f => f.id === funilId)
  const etapas = funil?.etapas || []

  return etapas.map((e) => ({
    id: e.id,
    nome: e.label,
    atendimentos: lista.filter((a) => a.etapa === e.id),
  }))
}

// Legacy Lead type kept for compatibility
export type Lead = {
  id: string
  nome: string
  iniciais: string
  interesse: string
  valor: string
  temperatura: Temperatura
  origem: string
  atualizado: string
}

export type Imovel = {
  id: string
  codigo: string
  titulo: string
  bairro: string
  cidade: string
  preco: string
  operacoes: string[]
  finalidade: string
  tipoImovel: string
  cib?: string
  situacaoImovel?: string
  status: 'Livre' | 'Reservado' | 'Proposta' | 'Vendido' | 'Alugado' | string
  tipoExclusividade?: string
  validadeExclusividade?: string
  enderecoCompleto?: string
  cep?: string
  condominio?: string
  iptu?: string
  anoConstrucao?: string
  andar?: string
  dorms: number
  suites: number
  banheiros?: number
  salas?: number
  vagas: number
  area: number
  areaTotal?: number
  descricao?: string
  tags?: string[]
  caracteristicas?: string[]
  proximidades?: string[]
  proprietario?: { nome: string; telefone: string; email?: string; validade?: string }
  urlVideo?: string
  urlTour360?: string
  observacoesInternas?: string
  foto: string
  fotos?: { id: string; url: string; titulo?: string; descricao?: string }[]
}

export const imoveis: Imovel[] = [
  { id: 'i1', codigo: 'MS-1042', titulo: 'Apartamento com varanda gourmet', bairro: 'Jardins', cidade: 'São Paulo', preco: 'R$ 890.000', operacoes: ['Venda'], finalidade: 'Residencial', tipoImovel: 'Apartamento', situacaoImovel: 'Pronto', dorms: 2, suites: 1, vagas: 2, area: 94, foto: '/images/imovel-apto-jardins.png', fotos: [{ id: 'f1', url: '/images/imovel-apto-jardins.png' }], status: 'Livre', descricao: 'Lindo apartamento nos Jardins com acabamento de alto padrão, varanda gourmet envidraçada e piso em madeira de lei. Excelente iluminação natural.', tags: ['Aceita financiamento', 'Lazer completo', 'Varanda gourmet'], condominio: 'R$ 1.200', iptu: 'R$ 350', caracteristicas: ['Ar condicionado', 'Armários embutidos', 'Área de serviço', 'Churrasqueira'], proximidades: ['Metrô Trianon-Masp', 'Parque Trianon', 'Shopping Cidade São Paulo'], enderecoCompleto: 'Rua Peixoto Gomide, 1024 - Jardins, São Paulo/SP', proprietario: { nome: 'Carlos Nogueira', telefone: '(11) 98765-4321', validade: 'Autorização válida por mais 62 dias' }, banheiros: 2, salas: 2, andar: '5º' },
  { id: 'i2', codigo: 'MS-0987', titulo: 'Casa em condomínio fechado', bairro: 'Alphaville', cidade: 'Barueri', preco: 'R$ 1.680.000', operacoes: ['Venda'], finalidade: 'Residencial', tipoImovel: 'Casa de Condomínio', situacaoImovel: 'Pronto', dorms: 4, suites: 3, vagas: 4, area: 320, foto: '/images/imovel-casa-condominio.png', fotos: [{ id: 'f2', url: '/images/imovel-casa-condominio.png' }], status: 'Proposta', descricao: 'Ampla casa em Alphaville com piscina privativa, área gourmet integrada e pé direito duplo na sala de estar. O condomínio oferece segurança 24h e clube completo.', tags: ['Piscina', 'Segurança 24h', 'Permuta'], condominio: 'R$ 1.800', iptu: 'R$ 520', caracteristicas: ['Quintal', 'Piscina Privativa', 'Espaço Gourmet', 'Lareira'], proximidades: ['Centro Comercial Alphaville', 'Escola Internacional', 'Rodovia Castelo Branco'], enderecoCompleto: 'Alameda Rio Negro, Condomínio Alpha 2 - Alphaville, Barueri/SP', proprietario: { nome: 'Mariana Silva', telefone: '(11) 97654-3210', validade: 'Autorização válida por mais 15 dias' }, banheiros: 5, salas: 3 },
  { id: 'i3', codigo: 'MS-1108', titulo: 'Studio mobiliado próximo ao metrô', bairro: 'Centro', cidade: 'São Paulo', preco: 'R$ 2.800/mês', operacoes: ['Locação'], finalidade: 'Residencial', tipoImovel: 'Studio', situacaoImovel: 'Pronto', dorms: 1, suites: 0, vagas: 1, area: 38, foto: '/images/imovel-studio-centro.png', fotos: [{ id: 'f3', url: '/images/imovel-studio-centro.png' }], status: 'Livre', descricao: 'Studio moderno e 100% mobiliado (porteira fechada), a apenas 3 minutos da estação República. Ideal para jovens profissionais ou estudantes.', tags: ['Mobiliado', 'Perto do metrô', 'Academia'], condominio: 'R$ 450', iptu: 'Isento', caracteristicas: ['Móveis planejados', 'Cozinha americana', 'Fechadura digital', 'Varanda'], proximidades: ['Metrô República', 'Teatro Municipal', 'Supermercado Extra'], enderecoCompleto: 'Avenida Ipiranga, 200 - Centro, São Paulo/SP', proprietario: { nome: 'João Pedro', telefone: '(11) 91234-5678', validade: 'Locação exclusiva' }, banheiros: 1, salas: 1, andar: '12º' },
  { id: 'i4', codigo: 'MS-0871', titulo: 'Cobertura duplex com piscina', bairro: 'Vila Nova Conceição', cidade: 'São Paulo', preco: 'R$ 2.300.000', operacoes: ['Venda'], finalidade: 'Residencial', tipoImovel: 'Cobertura', situacaoImovel: 'Pronto', dorms: 3, suites: 3, vagas: 3, area: 210, foto: '/images/imovel-cobertura.png', fotos: [{ id: 'f4', url: '/images/imovel-cobertura.png' }], status: 'Reservado', descricao: 'Cobertura espetacular com vista 360º para o parque Ibirapuera. Possui deck de madeira, piscina aquecida e espaço para adega.', tags: ['Vista panorâmica', 'Piscina aquecida', 'Alto Padrão'], condominio: 'R$ 2.500', iptu: 'R$ 800', caracteristicas: ['Deck de madeira', 'Piscina aquecida', 'Closet', 'Dependência de empregados'], proximidades: ['Parque Ibirapuera', 'Hospital São Luiz', 'Praça Pereira Coutinho'], enderecoCompleto: 'Rua Jacques Félix, 150 - Vila Nova Conceição, São Paulo/SP', proprietario: { nome: 'Fernanda Costa', telefone: '(11) 95555-4444', validade: 'Autorização válida por mais 120 dias' }, banheiros: 4, salas: 3, andar: '20º' },
]

export type Cliente = {
  id: string
  nome: string
  iniciais: string
  tipo: 'Comprador' | 'Locatário' | 'Proprietário'
  telefone: string
  telefonesAdicionais?: string[]
  whatsappsAdicionais?: string[]
  email: string
  emailsAdicionais?: string[]
  temperatura: Temperatura
  ultimoContato: string
  timeline: { data: string; evento: string; tipo: string }[]
  dataCriacao?: string
  origem?: string
  status?: 'aberto' | 'ganho' | 'perdido'
}

export const clientes: Cliente[] = [
  { id: 'c1', nome: 'Mariana Costa', iniciais: 'MC', tipo: 'Comprador', telefone: '(11) 98765-4321', email: 'mariana.costa@email.com', temperatura: 'quente', ultimoContato: 'há 12 min', timeline: [{ data: 'Hoje, 09:32', evento: 'Respondeu no WhatsApp — quer visitar sábado', tipo: 'whatsapp' }, { data: 'Ontem, 16:10', evento: 'Recebeu ficha do imóvel MS-1042', tipo: 'envio' }, { data: 'Seg, 11:45', evento: 'Lead captado via Portal ZAP', tipo: 'origem' }], dataCriacao: '2026-07-10', origem: 'Portal ZAP', status: 'aberto' },
  { id: 'c2', nome: 'Paulo Henrique', iniciais: 'PH', tipo: 'Comprador', telefone: '(11) 97654-3210', email: 'paulo.h@email.com', temperatura: 'quente', ultimoContato: 'há 40 min', timeline: [{ data: 'Hoje, 08:50', evento: 'Visita confirmada para hoje às 15h', tipo: 'visita' }, { data: 'Qui, 14:20', evento: 'Ligação — alinhou expectativa de valor', tipo: 'ligacao' }], dataCriacao: '2026-07-11', origem: 'Indicação', status: 'aberto' },
  { id: 'c3', nome: 'Beatriz Rocha', iniciais: 'BR', tipo: 'Comprador', telefone: '(11) 96543-2109', email: 'bia.rocha@email.com', temperatura: 'quente', ultimoContato: 'há 30 min', timeline: [{ data: 'Hoje, 10:05', evento: 'Proposta aceita — aguardando documentação', tipo: 'proposta' }, { data: 'Ter, 09:00', evento: 'Segunda visita ao imóvel MS-1108', tipo: 'visita' }], dataCriacao: '2026-06-25', origem: 'Instagram', status: 'ganho' },
  { id: 'c4', nome: 'Ricardo Almeida', iniciais: 'RA', tipo: 'Comprador', telefone: '(11) 95432-1098', email: 'ricardo.almeida@email.com', temperatura: 'morno', ultimoContato: 'há 2 h', timeline: [{ data: 'Hoje, 08:15', evento: 'Solicitou mais opções em Alphaville', tipo: 'whatsapp' }], dataCriacao: '2026-07-12', origem: 'Google Ads', status: 'aberto' },
  { id: 'c5', nome: 'Fernanda Lima', iniciais: 'FL', tipo: 'Locatário', telefone: '(11) 94321-0987', email: 'fe.lima@email.com', temperatura: 'frio', ultimoContato: 'ontem', timeline: [{ data: 'Ontem, 17:40', evento: 'Lead captado por indicação', tipo: 'origem' }], dataCriacao: '2026-05-15', origem: 'Indicação', status: 'perdido' },
  { id: 'c6', nome: 'Carlos Nogueira', iniciais: 'CN', tipo: 'Proprietário', telefone: '(11) 93210-9876', email: 'carlos.nog@email.com', temperatura: 'morno', ultimoContato: 'há 3 dias', timeline: [{ data: 'Qua, 10:30', evento: 'Autorização de venda renovada — 90 dias', tipo: 'documento' }], dataCriacao: '2026-01-10', origem: 'Passante', status: 'aberto' },
]

export type Atividade = {
  id: string
  data?: string
  hora: string
  titulo: string
  cliente: string
  telefone?: string
  whatsapp?: string
  tipo: 'visita' | 'ligacao' | 'reuniao' | 'tarefa' | 'whatsapp' | string
  concluida: boolean
  descricao?: string
  importante?: boolean
  imoveisVisitados?: { id: string; nome: string; visitado: boolean; endereco: string }[]
}

export const atividadesHoje: Atividade[] = [
  { id: 'a1', hora: '11:00', titulo: 'Ligar para follow-up de proposta', cliente: 'André Souza', telefone: '(11) 99999-1111', tipo: 'ligacao', concluida: false, descricao: 'Perguntar se ele já analisou a proposta que enviei ontem e verificar se a esposa também aprovou o layout do apartamento.' },
  {
    id: 'a2', hora: '15:00', titulo: 'Visita — Cobertura e Imóveis', cliente: 'Mariana Costa', whatsapp: '(11) 98765-4321', tipo: 'visita', concluida: false, descricao: 'Visita para conhecer opções em Alphaville.', imoveisVisitados: [
      { id: 'v1', nome: 'Casa em condomínio', visitado: false, endereco: 'Alameda Rio Negro, Barueri' },
      { id: 'v2', nome: 'Cobertura duplex', visitado: false, endereco: 'Rua Jacques Félix, São Paulo' },
    ]
  },
  { id: 'a3', hora: '17:30', titulo: 'Enviar documentação do MS-1108', cliente: 'Beatriz Rocha', whatsapp: '(11) 96543-2109', tipo: 'whatsapp', concluida: false },
  { id: 'a4', hora: '09:00', titulo: 'Reunião de equipe — metas da semana', cliente: 'Equipe Central', tipo: 'reuniao', concluida: true },
  { id: 'a5', hora: '10:00', titulo: 'Retornar contato sobre cobertura duplex', cliente: 'Dona Raimunda', telefone: '(11) 93333-3333', tipo: 'ligacao', concluida: false, descricao: 'Ficou de confirmar se a filha vai acompanhar a visita no sábado.' },
  { id: 'a6', hora: '14:15', titulo: 'Enviar fotos atualizadas do empreendimento', cliente: 'Marcos Oliver', whatsapp: '(11) 92222-2222', tipo: 'whatsapp', concluida: false, descricao: 'Marcos quer ver fotos da evolução da fachada e acabamentos.' },
  { id: 'a7', hora: '16:00', titulo: 'Ligar para sondar interesse no Lançamento', cliente: 'Carlos Henrique', telefone: '(11) 94444-4444', tipo: 'ligacao', concluida: false, descricao: 'Lead do portal interessado no decorado.' },
  { id: 'a8', hora: '18:00', titulo: 'Alinhar proposta com o proprietário', cliente: 'Roberto Silveira', tipo: 'tarefa', concluida: false, descricao: 'Apresentar a proposta de permuta enviada pelo cliente André Souza.' },
]

export const tempConfig: Record<Temperatura, { label: string; dot: string; chip: string; bg: string }> = {
  quente: { label: 'Quente', dot: 'bg-amber', chip: 'bg-amber/15 text-[#8a5a1e]', bg: 'bg-amber' },
  morno: { label: 'Morno', dot: 'bg-teal-mid', chip: 'bg-teal-mid/15 text-teal-deep', bg: 'bg-teal-mid' },
  frio: { label: 'Frio', dot: 'bg-slate', chip: 'bg-fog text-slate', bg: 'bg-slate' },
}

export const etapaConfig: Record<EtapaFunil, { label: string; cor: string }> = {
  qualificando: { label: 'Qualificando', cor: 'bg-indigo-100 text-indigo-800 border border-indigo-200 font-medium dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-800' },
  conhecendo: { label: 'Conhecendo', cor: 'bg-blue-100 text-blue-800 border border-blue-200 font-medium dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800' },
  agendado: { label: 'Agendado', cor: 'bg-amber-100 text-amber-800 border border-amber-200 font-medium dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800' },
  negociando: { label: 'Negociando', cor: 'bg-emerald-100 text-emerald-800 border border-emerald-200 font-medium dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800' },
}

export const origemConfig: Record<OrigemLead, { cor: string }> = {
  // Gerais / Tradicionais
  'Anúncio no Jornal': { cor: 'bg-slate/10 text-slate' },
  'Captação': { cor: 'bg-teal-mid/10 text-teal-deep' },
  'Facebook': { cor: 'bg-blue-100 text-blue-800' },
  'Fifty': { cor: 'bg-purple-100 text-purple-700' },
  'Indicação': { cor: 'bg-amber/15 text-amber' },
  'Já conhecia a imobiliária': { cor: 'bg-emerald-100 text-emerald-800' },
  'Outros': { cor: 'bg-fog text-slate' },
  'Parceria': { cor: 'bg-indigo-100 text-indigo-700' },
  'Placa': { cor: 'bg-yellow-100 text-yellow-800' },
  'Plantão': { cor: 'bg-orange-100 text-orange-800' },
  'Porta': { cor: 'bg-red-100 text-red-700' },
  'Revista': { cor: 'bg-rose-100 text-rose-700' },
  'Robô': { cor: 'bg-cyan-100 text-cyan-800' },
  'Rádio / TV': { cor: 'bg-sky-100 text-sky-800' },
  'SCI': { cor: 'bg-gray-100 text-gray-700' },
  'Telefone': { cor: 'bg-zinc-100 text-zinc-700' },
  'Vitrine': { cor: 'bg-lime-100 text-lime-800' },
  'Whatsapp': { cor: 'bg-green-100 text-green-800' },
  // Chats
  'Chats': { cor: 'bg-blue-50 text-blue-600' },
  'Chats: Albert': { cor: 'bg-teal-mid/15 text-teal-deep' },
  'Chats: Tawk.to': { cor: 'bg-emerald-50 text-emerald-600' },
  // Marketing
  'Marketing': { cor: 'bg-fuchsia-50 text-fuchsia-700' },
  'Marketing: Actwork': { cor: 'bg-fuchsia-100 text-fuchsia-800' },
  'Marketing: Externo': { cor: 'bg-fuchsia-100 text-fuchsia-800' },
  'Marketing: Facebook': { cor: 'bg-blue-100 text-blue-800' },
  'Marketing: Google': { cor: 'bg-red-100 text-red-700' },
  'Marketing: Instagram': { cor: 'bg-pink-100 text-pink-700' },
  'Marketing: Leadlovers': { cor: 'bg-orange-100 text-orange-700' },
  'Marketing: Leads4sales': { cor: 'bg-amber-100 text-amber-700' },
  'Marketing: Leadster': { cor: 'bg-blue-100 text-blue-700' },
  'Marketing: TikTok': { cor: 'bg-slate-100 text-slate-800' },
  'Marketing: Whatsapp': { cor: 'bg-green-100 text-green-800' },
  'Marketing: Youtube': { cor: 'bg-red-100 text-red-700' },
  // Portais
  'Portal: 123i': { cor: 'bg-blue-50 text-blue-700' },
  'Portal: acharei': { cor: 'bg-blue-50 text-blue-700' },
  'Portal: AchouMudou': { cor: 'bg-blue-50 text-blue-700' },
  'Portal: AlugarJa': { cor: 'bg-blue-50 text-blue-700' },
  'Portal: Brasileiro Imóveis': { cor: 'bg-blue-50 text-blue-700' },
  'Portal: campainha': { cor: 'bg-blue-50 text-blue-700' },
  'Portal: Casa Jaú': { cor: 'bg-blue-50 text-blue-700' },
  'Portal: Casa Mineira': { cor: 'bg-blue-50 text-blue-700' },
  'Portal: Chave Fácil': { cor: 'bg-blue-50 text-blue-700' },
  'Portal: Chaves na Mão': { cor: 'bg-blue-50 text-blue-700' },
  'Portal: Cliquei Mudei': { cor: 'bg-blue-50 text-blue-700' },
  'Portal: DF Imóveis': { cor: 'bg-blue-50 text-blue-700' },
  'Portal: Diario Imoveis': { cor: 'bg-blue-50 text-blue-700' },
  'Portal: Epungo': { cor: 'bg-blue-50 text-blue-700' },
  'Portal: Grupo OLX': { cor: 'bg-purple-100 text-purple-700' },
  'Portal: Grupo SP': { cor: 'bg-purple-100 text-purple-700' },
  'Portal: Grupozap': { cor: 'bg-orange-100 text-orange-700' },
  'Portal: Guia de Imóveis': { cor: 'bg-blue-50 text-blue-700' },
  'Portal: Guia de Imóveis IMB': { cor: 'bg-blue-50 text-blue-700' },
  'Portal: Guia Imóvel & Cia': { cor: 'bg-blue-50 text-blue-700' },
  'Portal: iBex Imóveis': { cor: 'bg-blue-50 text-blue-700' },
  'Portal: Imocasa': { cor: 'bg-blue-50 text-blue-700' },
  'Portal: iMudou': { cor: 'bg-blue-50 text-blue-700' },
  'Portal: Imóveis em exposição': { cor: 'bg-blue-50 text-blue-700' },
  'Portal: Imóveis SC': { cor: 'bg-blue-50 text-blue-700' },
  'Portal: Imóvel Web': { cor: 'bg-orange-50 text-orange-600' },
  'Portal: Linklar': { cor: 'bg-blue-50 text-blue-700' },
  'Portal: Local do Imóvel': { cor: 'bg-blue-50 text-blue-700' },
  'Portal: Loop Imóveis': { cor: 'bg-blue-50 text-blue-700' },
  'Portal: Mercado Livre': { cor: 'bg-yellow-100 text-yellow-800' },
  'Portal: Moving Imóveis': { cor: 'bg-blue-50 text-blue-700' },
  'Portal: Olho Mágico': { cor: 'bg-blue-50 text-blue-700' },
  'Portal: Olx': { cor: 'bg-purple-100 text-purple-700' },
  'Portal: Outros': { cor: 'bg-gray-100 text-gray-700' },
  'Portal: Portais Imobiliários': { cor: 'bg-blue-50 text-blue-700' },
  'Portal: Portal CRECI': { cor: 'bg-blue-50 text-blue-700' },
  'Portal: Portal Lugar Certo': { cor: 'bg-blue-50 text-blue-700' },
  'Portal: Storia Imóveis': { cor: 'bg-blue-50 text-blue-700' },
  'Portal: Trocalar': { cor: 'bg-blue-50 text-blue-700' },
  'Portal: VaptVupt': { cor: 'bg-blue-50 text-blue-700' },
  'Portal: Viva Real': { cor: 'bg-blue-100 text-blue-700' },
  'Portal: WImoveis': { cor: 'bg-blue-50 text-blue-700' },
  'Portal: Zap Imóveis': { cor: 'bg-orange-100 text-orange-700' },
  'Portal: ZoopImoveis': { cor: 'bg-blue-50 text-blue-700' },
  // Websites
  'Website: Agende uma ligação': { cor: 'bg-teal-deep text-white' },
  'Website: Cadastre seu imóvel': { cor: 'bg-teal-deep text-white' },
  'Website: Fale conosco': { cor: 'bg-teal-deep text-white' },
  'Website: Formulário Whatsapp': { cor: 'bg-green-100 text-green-800' },
  'Website: Formulário Whatsapp - Imóvel': { cor: 'bg-green-100 text-green-800' },
  'Website: Imóvel sob encomenda': { cor: 'bg-teal-deep text-white' },
  'Website: Landing Page': { cor: 'bg-teal-deep text-white' },
  'Website: Mais informações do empreendimento': { cor: 'bg-teal-deep text-white' },
  'Website: Mais informações do Imóvel': { cor: 'bg-teal-deep text-white' },
  'Website: Mais informações Empreendimento (Resultado de Pesquisa)': { cor: 'bg-teal-deep text-white' },
  'Website: Mais informações Imovel (Resultado de Pesquisa)': { cor: 'bg-teal-deep text-white' },
  'Website: Trabalhe Conosco': { cor: 'bg-teal-deep text-white' }
}

export const tipoAtividadeConfig: Record<TipoAtividade, { label: string; emoji: string; cor: string }> = {
  visita: { label: 'Visita', emoji: '🏠', cor: 'bg-teal-mid/15 text-teal-deep' },
  reuniao: { label: 'Reunião', emoji: '👥', cor: 'bg-blue-100 text-blue-700' },
  ligacao: { label: 'Ligação', emoji: '📞', cor: 'bg-green-100 text-green-700' },
  prazo: { label: 'Prazo', emoji: '⏰', cor: 'bg-amber/15 text-[#8a5a1e]' },
  'pos-venda': { label: 'Pós-venda', emoji: '🤝', cor: 'bg-purple-100 text-purple-700' },
  albert: { label: 'Albert', emoji: '🤖', cor: 'bg-primary/10 text-primary' },
}

// Legacy funil structure kept for screen-hoje compatibility
export const funil = [
  { id: 'qualificando', nome: 'Qualificando', leads: atendimentos.filter(a => a.etapa === 'qualificando').map(a => ({ id: a.id, nome: a.nome, iniciais: a.iniciais, interesse: a.interesse, valor: a.valor, temperatura: a.temperatura, origem: a.origem, atualizado: a.ultimaInteracao })) },
  { id: 'conhecendo', nome: 'Conhecendo', leads: atendimentos.filter(a => a.etapa === 'conhecendo').map(a => ({ id: a.id, nome: a.nome, iniciais: a.iniciais, interesse: a.interesse, valor: a.valor, temperatura: a.temperatura, origem: a.origem, atualizado: a.ultimaInteracao })) },
  { id: 'agendado', nome: 'Agendado', leads: atendimentos.filter(a => a.etapa === 'agendado').map(a => ({ id: a.id, nome: a.nome, iniciais: a.iniciais, interesse: a.interesse, valor: a.valor, temperatura: a.temperatura, origem: a.origem, atualizado: a.ultimaInteracao })) },
  { id: 'negociando', nome: 'Negociando', leads: atendimentos.filter(a => a.etapa === 'negociando').map(a => ({ id: a.id, nome: a.nome, iniciais: a.iniciais, interesse: a.interesse, valor: a.valor, temperatura: a.temperatura, origem: a.origem, atualizado: a.ultimaInteracao })) },
]

export function isAtividadeAtrasada(dataStr?: string, horaStr?: string) {
  if (!horaStr) return false
  const now = new Date()
  const horaAtual = now.getHours()
  const minutoAtual = now.getMinutes()

  if (!dataStr || dataStr === 'Hoje') {
    const [h, m] = horaStr.split(':').map(Number)
    if (h < horaAtual) return true
    if (h === horaAtual && m < minutoAtual) return true
    return false
  }

  if (dataStr === 'Amanhã') return false

  // Handle YYYY-MM-DD
  if (dataStr.includes('-')) {
    const atvDate = new Date(`${dataStr}T${horaStr.replace('h', '')}:00`)
    return atvDate.getTime() < now.getTime()
  }

  // Handle DD/MM/YYYY
  if (dataStr.includes('/')) {
    const [d, mo, y] = dataStr.split('/')
    if (!d || !mo || !y) return false
    const atvDate = new Date(`${y}-${mo}-${d}T${horaStr.replace('h', '')}:00`)
    return atvDate.getTime() < now.getTime()
  }

  return false
}
