import React from 'react';
import { ExpenseSummary } from '../../types';
import { TrendingUp, TrendingDown, Lightbulb, DollarSign } from 'lucide-react';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { calculateExpenseSummary } from '../../utils/expenseCalculations';
import { useExpenses } from '../../context/ExpenseContext';
import { useSettings } from '../../context/SettingsContext';
import { formatCurrency, formatNumber } from '../../utils/formatters';

interface SpendingHabitsInsightProps {
  summary: ExpenseSummary;
}

const SpendingHabitsInsight: React.FC<SpendingHabitsInsightProps> = ({
  summary,
}) => {
  const { categories, expenses } = useExpenses();
  const { currency } = useSettings();

  const getCategoryName = (id: string) => {
    const category = categories.find((cat) => cat.id === id);
    return category ? category.name : 'Unknown Category';
  };

  const getTopSpendingCategory = () => {
    let topCategory = { id: '', amount: 0 };
    for (const categoryId in summary.byCategory) {
      if (summary.byCategory[categoryId] > topCategory.amount) {
        topCategory = {
          id: categoryId,
          amount: summary.byCategory[categoryId],
        };
      }
    }
    return topCategory;
  };

  const topCategory = getTopSpendingCategory();

  const currentMonthStart = startOfMonth(new Date());
  const previousMonthStart = subMonths(currentMonthStart, 1);
  const previousMonthEnd = endOfMonth(previousMonthStart);

  const previousMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= previousMonthStart && expenseDate <= previousMonthEnd;
  });

  const previousMonthSummary = calculateExpenseSummary(previousMonthExpenses, {
    period: 'month',
    dateRange: { start: previousMonthStart, end: previousMonthEnd },
  });

  let insight = {
    icon: <Lightbulb className='h-6 w-6 text-green-500' />,
    title: 'Your Spending Snapshot',
    description: `You've spent ${formatCurrency(
      summary.total,
      currency
    )} this month.`,
    color: 'bg-green-100 text-green-800',
  };

  if (summary.total > 0 && previousMonthSummary.total > 0) {
    const percentageChange =
      ((summary.total - previousMonthSummary.total) /
        previousMonthSummary.total) *
      100;

    if (percentageChange > 10) {
      insight = {
        icon: <TrendingUp className='h-6 w-6 text-red-500' />,
        title: 'Spending Increase!',
        description: `You've spent ${formatNumber(
          percentageChange,
          'en-US',
          0,
          0
        )}% more this month compared to last.`,
        color: 'bg-red-100 text-red-800',
      };
    } else if (percentageChange < -10) {
      insight = {
        icon: <TrendingDown className='h-6 w-6 text-green-500' />,
        title: 'Spending Decrease!',
        description: `You've spent ${formatNumber(
          Math.abs(percentageChange),
          'en-US',
          0,
          0
        )}% less this month compared to last.`,
        color: 'bg-green-100 text-green-800',
      };
    } else {
      insight = {
        icon: <Lightbulb className='h-6 w-6 text-blue-500' />,
        title: 'Stable Spending',
        description: 'Your spending is consistent with last month.',
        color: 'bg-blue-100 text-blue-800',
      };
    }
  } else if (topCategory.id && topCategory.amount > 0) {
    insight = {
      icon: <TrendingUp className='h-6 w-6 text-red-500' />,
      title: 'Top Spending Category',
      description: `Your highest spending is in "${getCategoryName(
        topCategory.id
      )}" with ${formatCurrency(topCategory.amount, currency)}.`,
      color: 'bg-red-100 text-red-800',
    };
  } else if (summary.total === 0) {
    insight = {
      icon: <DollarSign className='h-6 w-6 text-blue-500' />,
      title: 'No Spending Yet!',
      description:
        "You haven't recorded any expenses yet. Start tracking to see insights!",
      color: 'bg-blue-100 text-blue-800',
    };
  }

  return (
    <div
      className={`p-4 rounded-lg shadow-md flex items-center space-x-4 ${insight.color}`}
    >
      <div className='flex-shrink-0'>{insight.icon}</div>
      <div>
        <h3 className='text-lg font-semibold'>{insight.title}</h3>
        <p className='text-sm'>{insight.description}</p>
      </div>
    </div>
  );
};

export default SpendingHabitsInsight;
