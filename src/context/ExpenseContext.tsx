import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Expense, Category, ExpenseFilter, ExpenseSummary } from '../types';
import { getDefaultCategories } from '../utils/categories';
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isWithinInterval,
} from 'date-fns';

interface ExpenseContextType {
  expenses: Expense[];
  filteredExpenses: Expense[];
  categories: Category[];
  filter: ExpenseFilter;
  summary: ExpenseSummary;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => boolean;
  setFilter: (filter: Partial<ExpenseFilter>) => void;
}

const defaultFilter: ExpenseFilter = {
  period: 'all',
  dateRange: { start: new Date(0), end: new Date() }, // Default to all time
  selectedMonth: undefined,
  selectedYear: undefined,
};

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const savedExpenses = localStorage.getItem('expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    const savedCategories = localStorage.getItem('categories');
    return savedCategories
      ? JSON.parse(savedCategories)
      : getDefaultCategories();
  });
  const [filter, setFilterState] = useState<ExpenseFilter>(defaultFilter);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<ExpenseSummary>({
    total: 0,
    average: 0,
    byCategory: {},
  });

  // Save expenses and categories to localStorage when they change
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  // Update filtered expenses and summary when expenses, filter, or categories change
  useEffect(() => {
    // Apply filters
    let filtered = [...expenses];

    // Filter by date range
    filtered = filtered.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return isWithinInterval(expenseDate, {
        start: filter.dateRange.start,
        end: filter.dateRange.end,
      });
    });

    // Filter by category if specified
    if (filter.category) {
      filtered = filtered.filter(
        (expense) => expense.category === filter.category
      );
    }

    // Sort by date (most recent first)
    filtered = filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    setFilteredExpenses(filtered);

    // Calculate summary
    const total = filtered.reduce((sum, expense) => sum + expense.amount, 0);
    const days = Math.max(
      1,
      Math.ceil(
        (filter.dateRange.end.getTime() - filter.dateRange.start.getTime()) /
          (1000 * 60 * 60 * 24)
      )
    );
    const average = total / days;

    // Calculate by category
    const byCategory: Record<string, number> = {};
    filtered.forEach((expense) => {
      if (!byCategory[expense.category]) {
        byCategory[expense.category] = 0;
      }
      byCategory[expense.category] += expense.amount;
    });

    setSummary({
      total,
      average,
      byCategory,
    });
  }, [expenses, filter, categories]);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: uuidv4(),
    };
    setExpenses((prev) => [...prev, newExpense]);
  };

  const updateExpense = (id: string, expense: Omit<Expense, 'id'>) => {
    setExpenses((prev) =>
      prev.map((item) => (item.id === id ? { ...expense, id } : item))
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: uuidv4(),
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const updateCategory = (id: string, category: Omit<Category, 'id'>) => {
    setCategories((prev) =>
      prev.map((item) => (item.id === id ? { ...category, id } : item))
    );
  };

  const deleteCategory = (id: string) => {
    // Don't delete categories that are in use
    const inUse = expenses.some((expense) => expense.category === id);
    if (inUse) {
      return false;
    }

    setCategories((prev) => prev.filter((category) => category.id !== id));
    return true;
  };

  const setFilter = (newFilter: Partial<ExpenseFilter>) => {
    setFilterState((prev) => {
      const updated = { ...prev, ...newFilter };

      // Update date range based on period and selected month/year
      if (newFilter.period !== undefined) {
        const today = new Date();
        let newStart: Date;
        let newEnd: Date;

        switch (newFilter.period) {
          case 'all':
            newStart = new Date(0); // Epoch
            newEnd = new Date(); // Now
            break;
          case 'day':
            newStart = startOfDay(today);
            newEnd = endOfDay(today);
            break;
          case 'week':
            newStart = startOfWeek(today, { weekStartsOn: 1 });
            newEnd = endOfWeek(today, { weekStartsOn: 1 });
            break;
          case 'month': {
            const monthDate =
              newFilter.selectedYear !== undefined &&
              newFilter.selectedMonth !== undefined
                ? new Date(newFilter.selectedYear, newFilter.selectedMonth, 1)
                : today;
            newStart = startOfMonth(monthDate);
            newEnd = endOfMonth(monthDate);
            break;
          }
          case 'year': {
            const yearDate =
              newFilter.selectedYear !== undefined
                ? new Date(newFilter.selectedYear, 0, 1)
                : today;
            newStart = startOfYear(yearDate);
            newEnd = endOfYear(yearDate);
            break;
          }
          case 'custom':
            // If custom, use the provided dateRange or keep existing
            newStart = newFilter.dateRange?.start || prev.dateRange.start;
            newEnd = endOfDay(newFilter.dateRange?.end || prev.dateRange.end);
            break;
          default:
            newStart = prev.dateRange.start;
            newEnd = prev.dateRange.end;
            break;
        }
        updated.dateRange = { start: newStart, end: newEnd };
      } else if (
        // If period is not changed, but month/year are
        (newFilter.selectedMonth !== undefined ||
          newFilter.selectedYear !== undefined) &&
        (prev.period === 'month' || prev.period === 'year')
      ) {
        const currentYear =
          newFilter.selectedYear ??
          prev.selectedYear ??
          new Date().getFullYear();
        const currentMonth =
          newFilter.selectedMonth ??
          prev.selectedMonth ??
          new Date().getMonth();

        if (prev.period === 'month') {
          const monthDate = new Date(currentYear, currentMonth, 1);
          updated.dateRange = {
            start: startOfMonth(monthDate),
            end: endOfMonth(monthDate),
          };
        } else if (prev.period === 'year') {
          const yearDate = new Date(currentYear, 0, 1);
          updated.dateRange = {
            start: startOfYear(yearDate),
            end: endOfYear(yearDate),
          };
        }
      } else if (newFilter.dateRange) {
        // If only dateRange is updated (for custom period)
        updated.dateRange = newFilter.dateRange;
      }

      return { ...updated, ...newFilter };
    });
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        filteredExpenses,
        categories,
        filter,
        summary,
        addExpense,
        updateExpense,
        deleteExpense,
        addCategory,
        updateCategory,
        deleteCategory,
        setFilter,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = (): ExpenseContextType => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};
