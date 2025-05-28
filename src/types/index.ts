export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  notes?: string;
}

export type Currency =
  | 'USD' | 'IDR' | 'EUR' | 'GBP' | 'JPY'
  | 'CNY' | 'INR' | 'KRW' | 'THB' | 'VND'
  | 'PHP' | 'MYR' | 'SGD' | 'AUD' | 'CAD' | 'CHF';

export interface Category {
  id: string;
  name: string;
  color: string;
  budget?: number; // Monthly budget for the category
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface ExpenseFilter {
  period: 'all' | 'day' | 'week' | 'month' | 'year' | 'custom';
  dateRange: DateRange;
  category?: string;
  selectedMonth?: number; // 0-11 for Jan-Dec
  selectedYear?: number;
}

export interface ExpenseSummary {
  total: number;
  average: number;
  byCategory: Record<string, number>;
}

export interface AuthState {
  isAuthenticated: boolean;
  isInitialized: boolean;
  hasPin: boolean;
}

export interface ToastOptions {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}
