import React from 'react';
import { ExpenseSummary } from '../../types';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
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

  const { summary: previousMonthSummary } = calculateExpenseSummary(
    previousMonthExpenses,
    {
      period: 'month',
      dateRange: { start: previousMonthStart, end: previousMonthEnd },
    }
  );

  let insight;

  if (summary.total === 0) {
    insight = {
      icon: <DollarSign className='h-6 w-6 text-blue-500' />,
      title: 'No Spending Yet!',
      description:
        "You haven't recorded any expenses yet. Start tracking to see insights!",
      color: 'bg-blue-100 text-blue-800',
    };
  } else if (previousMonthSummary.total > 0) {
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
      // Stable spending, now check for category changes
      const topCategoryChange = Object.keys(summary.byCategory).reduce(
        (acc, categoryId) => {
          const currentMonthAmount = summary.byCategory[categoryId] || 0;
          const previousMonthAmount =
            previousMonthSummary.byCategory[categoryId] || 0;
          const change = currentMonthAmount - previousMonthAmount;
          if (Math.abs(change) > Math.abs(acc.change)) {
            return { categoryId, change };
          }
          return acc;
        },
        { categoryId: '', change: 0 }
      );

      if (
        topCategoryChange.categoryId &&
        Math.abs(topCategoryChange.change) > 0
      ) {
        const categoryName = getCategoryName(topCategoryChange.categoryId);
        const percentageChange =
          (topCategoryChange.change /
            (previousMonthSummary.byCategory[topCategoryChange.categoryId] ||
              1)) *
          100;

        if (percentageChange > 20) {
          insight = {
            icon: <TrendingUp className='h-6 w-6 text-red-500' />,
            title: 'Category Spending Surge!',
            description: `Your spending in "${categoryName}" increased by ${formatNumber(
              percentageChange,
              'en-US',
              0,
              0
            )}% this month.`,
            color: 'bg-red-100 text-red-800',
          };
        } else if (percentageChange < -20) {
          insight = {
            icon: <TrendingDown className='h-6 w-6 text-green-500' />,
            title: 'Category Spending Drop!',
            description: `Your spending in "${categoryName}" decreased by ${formatNumber(
              Math.abs(percentageChange),
              'en-US',
              0,
              0
            )}% this month.`,
            color: 'bg-green-100 text-green-800',
          };
        } else if (topCategory.id && topCategory.amount > 0) {
          insight = {
            icon: <TrendingUp className='h-6 w-6 text-red-500' />,
            title: 'Top Spending Category',
            description: `Your highest spending is in "${getCategoryName(
              topCategory.id
            )}" with ${formatCurrency(topCategory.amount, currency)}.`,
            color: 'bg-red-100 text-red-800',
          };
        } else {
          insight = {
            icon: <DollarSign className='h-6 w-6 text-blue-500' />,
            title: 'Daily Spending',
            description: `You're spending an average of ${formatCurrency(
              summary.average,
              currency
            )} per day this month.`,
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
      } else {
        insight = {
          icon: <DollarSign className='h-6 w-6 text-blue-500' />,
          title: 'Daily Spending',
          description: `You're spending an average of ${formatCurrency(
            summary.average,
            currency
          )} per day this month.`,
          color: 'bg-blue-100 text-blue-800',
        };
      }
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
  } else {
    insight = {
      icon: <DollarSign className='h-6 w-6 text-blue-500' />,
      title: 'Daily Spending',
      description: `You're spending an average of ${formatCurrency(
        summary.average,
        currency
      )} per day this month.`,
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
