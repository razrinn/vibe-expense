import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
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
import {
  db,
  getExpensesFromDB,
  addExpenseToDB,
  updateExpenseInDB,
  deleteExpenseFromDB,
  getCategoriesFromDB,
  addCategoryToDB,
  updateCategoryInDB,
  deleteCategoryFromDB,
} from '../utils/indexedDB';

interface ExpenseContextType {
  expenses: Expense[];
  filteredExpenses: Expense[];
  categories: Category[];
  filter: ExpenseFilter;
  summary: ExpenseSummary;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  updateExpense: (id: string, expense: Omit<Expense, 'id'>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, category: Omit<Category, 'id'>) => Promise<void>;
  deleteCategory: (id: string) => Promise<boolean>;
  setFilter: (filter: Partial<ExpenseFilter>) => void;
  clearAllExpenses: () => Promise<void>;
}

const defaultFilter: ExpenseFilter = {
  period: 'all',
  dateRange: { start: new Date(0), end: new Date() }, // Default to all time
  selectedMonth: undefined,
  selectedYear: undefined,
};

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilterState] = useState<ExpenseFilter>(defaultFilter);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<ExpenseSummary>({
    total: 0,
    average: 0,
    byCategory: {},
  });

  // Load initial data from IndexedDB
  useEffect(() => {
    const loadData = async () => {
      await db.open(); // Ensure DB is open and migration runs if needed
      const loadedExpenses = await getExpensesFromDB();
      const loadedCategories = await getCategoriesFromDB();
      setExpenses(loadedExpenses);
      let initialCategories = loadedCategories;
      if (loadedCategories.length === 0) {
        const defaultCategories = getDefaultCategories();
        for (const category of defaultCategories) {
          await addCategoryToDB(category);
        }
        initialCategories = defaultCategories;
      }
      setCategories(initialCategories);
    };
    loadData();
  }, []); // Run only once on component mount

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

  const addExpense = useCallback(async (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: uuidv4(),
    };
    await addExpenseToDB(newExpense);
    const updatedExpenses = await getExpensesFromDB();
    setExpenses(updatedExpenses);
  }, []);

  const updateExpense = useCallback(
    async (id: string, expense: Omit<Expense, 'id'>) => {
      await updateExpenseInDB(id, expense);
      const updatedExpenses = await getExpensesFromDB();
      setExpenses(updatedExpenses);
    },
    []
  );

  const deleteExpense = useCallback(async (id: string) => {
    await deleteExpenseFromDB(id);
    const updatedExpenses = await getExpensesFromDB();
    setExpenses(updatedExpenses);
  }, []);

  const addCategory = useCallback(async (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: uuidv4(),
    };
    await addCategoryToDB(newCategory);
    const updatedCategories = await getCategoriesFromDB();
    setCategories(updatedCategories);
  }, []);

  const updateCategory = useCallback(
    async (id: string, category: Omit<Category, 'id'>) => {
      await updateCategoryInDB(id, category);
      const updatedCategories = await getCategoriesFromDB();
      setCategories(updatedCategories);
    },
    []
  );

  const deleteCategory = useCallback(
    async (id: string) => {
      // Don't delete categories that are in use
      const inUse = expenses.some((expense) => expense.category === id);
      if (inUse) {
        return false;
      }
      await deleteCategoryFromDB(id);
      const updatedCategories = await getCategoriesFromDB();
      setCategories(updatedCategories);
      return true;
    },
    [expenses]
  );

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

  const clearAllExpenses = useCallback(async () => {
    await db.expenses.clear();
    setExpenses([]);
  }, []);

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
        clearAllExpenses,
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
