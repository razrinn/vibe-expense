import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Expense, Category, ExpenseFilter, DateRange, ExpenseSummary } from '../types';
import { getDefaultCategories } from '../utils/categories';
import { 
  startOfDay, endOfDay, startOfWeek, endOfWeek, 
  startOfMonth, endOfMonth, isWithinInterval 
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
  deleteCategory: (id: string) => void;
  setFilter: (filter: Partial<ExpenseFilter>) => void;
}

const defaultDateRange: DateRange = {
  start: startOfMonth(new Date()),
  end: endOfMonth(new Date())
};

const defaultFilter: ExpenseFilter = {
  period: 'month',
  dateRange: defaultDateRange,
};

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>(getDefaultCategories());
  const [filter, setFilterState] = useState<ExpenseFilter>(defaultFilter);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<ExpenseSummary>({
    total: 0,
    average: 0,
    byCategory: {}
  });

  // Load expenses and categories from localStorage
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    const savedCategories = localStorage.getItem('categories');
    
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
    
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      // If no saved categories, use defaults and save them
      const defaultCategories = getDefaultCategories();
      setCategories(defaultCategories);
      localStorage.setItem('categories', JSON.stringify(defaultCategories));
    }
  }, []);

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
    filtered = filtered.filter(expense => {
      const expenseDate = new Date(expense.date);
      return isWithinInterval(expenseDate, {
        start: filter.dateRange.start,
        end: filter.dateRange.end
      });
    });
    
    // Filter by category if specified
    if (filter.category) {
      filtered = filtered.filter(expense => expense.category === filter.category);
    }
    
    // Sort by date (most recent first)
    filtered = filtered.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    setFilteredExpenses(filtered);
    
    // Calculate summary
    const total = filtered.reduce((sum, expense) => sum + expense.amount, 0);
    const days = Math.max(1, Math.ceil((filter.dateRange.end.getTime() - filter.dateRange.start.getTime()) / (1000 * 60 * 60 * 24)));
    const average = total / days;
    
    // Calculate by category
    const byCategory: Record<string, number> = {};
    filtered.forEach(expense => {
      if (!byCategory[expense.category]) {
        byCategory[expense.category] = 0;
      }
      byCategory[expense.category] += expense.amount;
    });
    
    setSummary({
      total,
      average,
      byCategory
    });
  }, [expenses, filter, categories]);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: uuidv4(),
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  const updateExpense = (id: string, expense: Omit<Expense, 'id'>) => {
    setExpenses(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...expense, id } 
          : item
      )
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: uuidv4(),
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (id: string, category: Omit<Category, 'id'>) => {
    setCategories(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...category, id } 
          : item
      )
    );
  };

  const deleteCategory = (id: string) => {
    // Don't delete categories that are in use
    const inUse = expenses.some(expense => expense.category === id);
    if (inUse) {
      return false;
    }
    
    setCategories(prev => prev.filter(category => category.id !== id));
    return true;
  };

  const setFilter = (newFilter: Partial<ExpenseFilter>) => {
    setFilterState(prev => {
      const updated = { ...prev, ...newFilter };
      
      // Update date range based on period
      if (newFilter.period) {
        const today = new Date();
        
        switch (newFilter.period) {
          case 'day':
            updated.dateRange = {
              start: startOfDay(today),
              end: endOfDay(today)
            };
            break;
          case 'week':
            updated.dateRange = {
              start: startOfWeek(today, { weekStartsOn: 1 }),
              end: endOfWeek(today, { weekStartsOn: 1 })
            };
            break;
          case 'month':
            updated.dateRange = {
              start: startOfMonth(today),
              end: endOfMonth(today)
            };
            break;
          // For custom, keep the existing date range unless explicitly provided
        }
      }
      
      return updated;
    });
  };

  return (
    <ExpenseContext.Provider value={{
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
    }}>
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