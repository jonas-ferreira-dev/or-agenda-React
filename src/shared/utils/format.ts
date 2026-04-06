export function formatDate(dateString: string) {
  if (!dateString) return '-';

  const normalized = dateString.includes('T')
    ? dateString
    : `${dateString}T00:00:00`;

  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat('pt-BR').format(date);
}

export function formatTime(time: string) {
  if (!time) return '-';
  return time.slice(0, 5);
}

export function formatCurrency(value?: string | number | null) {
  if (value === null || value === undefined || value === '') return '-';

  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) return String(value);

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numericValue);
}