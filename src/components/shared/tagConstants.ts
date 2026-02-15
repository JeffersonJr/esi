export interface Tag {
  id: string;
  name: string;
  color: string;
}

export const TAG_COLORS = [
  { name: 'Vermelho', value: 'bg-red-500' },
  { name: 'Laranja', value: 'bg-orange-500' },
  { name: 'Amarelo', value: 'bg-yellow-500' },
  { name: 'Verde', value: 'bg-green-500' },
  { name: 'Azul', value: 'bg-blue-500' },
  { name: 'Roxo', value: 'bg-purple-500' },
  { name: 'Rosa', value: 'bg-pink-500' },
  { name: 'Cinza', value: 'bg-gray-500' },
];

export const DEFAULT_TAGS: Tag[] = [
  { id: '1', name: 'Hot Lead', color: 'bg-red-500' },
  { id: '2', name: 'VIP', color: 'bg-purple-500' },
  { id: '3', name: 'Primeira Compra', color: 'bg-blue-500' },
  { id: '4', name: 'Investidor', color: 'bg-green-500' },
  { id: '5', name: 'Financiamento', color: 'bg-orange-500' },
  { id: '6', name: 'Aluguel', color: 'bg-yellow-500' },
  { id: '7', name: 'Interesse Alto', color: 'bg-red-500' },
  { id: '8', name: 'Follow-up Necessário', color: 'bg-orange-500' },
  { id: '9', name: 'Urgente', color: 'bg-red-500' },
  { id: '10', name: 'Contato Realizado', color: 'bg-green-500' },
  { id: '11', name: 'Visita Agendada', color: 'bg-blue-500' },
  { id: '12', name: 'Em Negociação', color: 'bg-purple-500' },
];
