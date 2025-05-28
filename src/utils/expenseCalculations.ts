import { Expense, ExpenseFilter, ExpenseSummary } from '../types';
import { isWithinInterval } from 'date-fns';

export const calculateExpenseSummary = (
  expenses: Expense[],
  filter: ExpenseFilter
): { summary: ExpenseSummary; filteredExpenses: Expense[] } => {
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
  if (filter.category && filter.category.length > 0) {
    filtered = filtered.filter((expense) =>
      filter.category!.includes(expense.category)
    );
  }

  // Sort by date (most recent first)
  filtered = filtered.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

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

  return {
    summary: {
      total,
      average,
      byCategory,
    },
    filteredExpenses: filtered,
  };
};