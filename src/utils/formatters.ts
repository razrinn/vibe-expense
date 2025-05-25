export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
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

export const formatPeriod = (period: 'day' | 'week' | 'month' | 'custom', start: Date, end: Date): string => {
  const today = new Date();
  const isToday = start.toDateString() === today.toDateString() && end.toDateString() === today.toDateString();
  const isThisMonth =
    start.getMonth() === today.getMonth() &&
    start.getFullYear() === today.getFullYear() &&
    end.getMonth() === today.getMonth() &&
    end.getFullYear() === today.getFullYear();

  switch (period) {
    case 'day':
      return isToday ? 'Today' : formatDate(start);
    case 'week':
      return `Week of ${formatDate(start)}`;
    case 'month':
      return isThisMonth
        ? 'This Month'
        : start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    case 'custom':
      return `${formatDate(start)} to ${formatDate(end)}`;
    default:
      return '';
  }
};
