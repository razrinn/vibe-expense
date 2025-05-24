export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface ExpenseFilter {
  period: 'day' | 'week' | 'month' | 'custom';
  dateRange: DateRange;
  category?: string;
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
  lastActivity: number;
}

export interface ToastOptions {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}