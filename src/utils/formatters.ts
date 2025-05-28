export const formatCurrency = (
  amount: number,
  currencyCode: string = 'IDR',
  locale: string = 'en-US', // Changed default locale to en-US for consistent thousand separators
  minimumFractionDigits: number = 0,
  maximumFractionDigits: number = 0
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits,
    maximumFractionDigits,
    useGrouping: true, // Explicitly enable thousand separators
  }).format(amount);
};

export const formatNumber = (
  amount: number,
  locale: string = 'en-US',
  minimumFractionDigits: number = 0,
  maximumFractionDigits: number = 0
): string => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
    useGrouping: true,
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateForInput = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  // Format to YYYY-MM-DDTHH:mm for datetime-local input
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const formatPeriod = (
  period: 'all' | 'day' | 'week' | 'month' | 'year' | 'custom',
  start: Date,
  end: Date,
  selectedMonth?: number,
  selectedYear?: number
): string => {
  const today = new Date();
  const isToday =
    start.toDateString() === today.toDateString() &&
    end.toDateString() === today.toDateString();
  const isThisMonth =
    start.getMonth() === today.getMonth() &&
    start.getFullYear() === today.getFullYear() &&
    end.getMonth() === today.getMonth() &&
    end.getFullYear() === today.getFullYear();
  const isThisYear = start.getFullYear() === today.getFullYear();

  switch (period) {
    case 'all':
      return 'All Time';
    case 'day':
      return isToday ? 'Today' : formatDate(start);
    case 'week':
      return `Week of ${formatDate(start)}`;
    case 'month':
      if (selectedMonth !== undefined && selectedYear !== undefined) {
        return new Date(selectedYear, selectedMonth, 1).toLocaleDateString(
          'en-US',
          { month: 'long', year: 'numeric' }
        );
      }
      return isThisMonth
        ? 'This Month'
        : start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    case 'year':
      if (selectedYear !== undefined) {
        return selectedYear.toString();
      }
      return isThisYear ? 'This Year' : start.getFullYear().toString();
    case 'custom':
      return `${formatDate(start)} to ${formatDate(end)}`;
    default:
      return '';
  }
};
