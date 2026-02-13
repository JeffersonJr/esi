// Currency mask functions
export const currencyMask = (value: string): string => {
  // Remove tudo que não é dígito
  const numbers = value.replace(/\D/g, '');
  
  // Se não tiver números, retorna vazio
  if (!numbers) return '';
  
  // Converte para número e formata
  const number = parseInt(numbers, 10);
  
  // Formata como moeda brasileira
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number / 100);
};

export const currencyToNumber = (value: string): number => {
  // Remove o símbolo R$, espaços e pontos, depois substitui vírgula por ponto
  const cleanValue = value
    .replace(/R\$\s*/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  
  return parseFloat(cleanValue) || 0;
};

export const formatCurrencyInput = (value: string): string => {
  // Remove tudo que não é dígito
  const numbers = value.replace(/\D/g, '');
  
  // Se não tiver números, retorna vazio
  if (!numbers) return '';
  
  // Converte para centavos
  const centavos = parseInt(numbers, 10);
  
  // Formata como moeda brasileira
  const formatted = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(centavos / 100);
  
  return formatted;
};

// Hook para usar com inputs
export const useCurrencyMask = (onChange: (value: string) => void) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = formatCurrencyInput(e.target.value);
    onChange(maskedValue);
  };

  return { handleChange };
};
