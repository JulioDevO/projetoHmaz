export const formatarMoeda = (valor) => {
  if (valor === undefined || valor === null || valor === '') return '';
  const num = Number(valor);
  if (isNaN(num)) return '';
  return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const mascaraMoedaInput = (value) => {
  const apenasDigitos = value.replace(/\D/g, '');
  if (!apenasDigitos) return '';
  const valorDecimal = Number(apenasDigitos) / 100;
  return valorDecimal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const converterParaNumero = (valorFormatado) => {
  if (!valorFormatado) return 0;
  const limpo = String(valorFormatado).replace(/\./g, '').replace(',', '.');
  return parseFloat(limpo) || 0;
};