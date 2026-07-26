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
export const maskPhone = (value: string) => {
  if (!value) return '';
  const num = value.replace(/\D/g, '');
  if (num.length <= 10) {
    return num.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim();
  }
  return num.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim().slice(0, 15);
};

export const maskCEP = (value: string) => {
  if (!value) return '';
  const num = value.replace(/\D/g, '');
  return num.replace(/(\d{5})(\d{0,3})/, '$1-$2').trim().slice(0, 9);
};

export const maskCPF = (value: string) => {
  if (!value) return '';
  const num = value.replace(/\D/g, '');
  return num
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .slice(0, 14);
};

export const maskCurrency = (value: string | number) => {
  if (!value && value !== 0) return '';
  const num = String(value).replace(/\D/g, '');
  if (num === '') return '';
  
  const parsed = parseInt(num, 10) / 100;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(parsed);
};

// Removes the "R$ " from the formatted currency and keeping only numbers
// Used if we want to store raw value or parse back to number
export const unmaskCurrency = (value: string) => {
  if (!value) return 0;
  return Number(value.replace(/\D/g, '')) / 100;
};
