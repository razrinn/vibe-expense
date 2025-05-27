import React, { useMemo } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { useSettings } from '../../context/SettingsContext';
import { formatCurrency } from '../../utils/formatters';
import { calculateExpenseSummary } from '../../utils/expenseCalculations';
import { endOfMonth, startOfMonth } from 'date-fns';

const CategoryBudgetOverview: React.FC = () => {
  const { categories, expenses } = useExpenses();
  const { currency } = useSettings();

  const budgetedCategories = categories.filter(
    (cat) => cat.budget !== undefined && cat.budget > 0
  );

  const dateRange = useMemo(() => {
    const monthDate = new Date();
    const newStart = startOfMonth(monthDate);
    const newEnd = endOfMonth(monthDate);

    return {
      start: newStart,
      end: newEnd,
    };
  }, []);

  if (budgetedCategories.length === 0) {
    return null; // Don't render if no categories have budgets
  }

  return (
    <div className='space-y-4'>
      <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
        Budgets
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {budgetedCategories.map((category) => {
          const categorySpecificSummary = calculateExpenseSummary(expenses, {
            period: 'month',
            category: category.id,
            dateRange,
          });
          const spentAmount = categorySpecificSummary.total || 0;
          const budget = category.budget || 0;
          const progress =
            budget > 0 ? Math.min(100, (spentAmount / budget) * 100) : 0;
          const remaining = budget - spentAmount;

          const progressBarColor = category.color; // Use category color for progress bar

          return (
            <div
              key={category.id}
              className='bg-white dark:bg-black-900 rounded-lg shadow p-4'
            >
              <div className='flex justify-between items-center mb-2'>
                <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-100'>
                  {category.name}
                </h3>
                <span className='text-sm font-medium text-gray-600 dark:text-gray-300'>
                  {formatCurrency(spentAmount, currency)} /{' '}
                  {formatCurrency(budget, currency)}
                </span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700'>
                <div
                  className='h-2.5 rounded-full'
                  style={{
                    width: `${progress}%`,
                    backgroundColor: progressBarColor,
                  }}
                ></div>
              </div>
              <p
                className={`text-sm mt-2 ${
                  remaining < 0
                    ? 'text-red-500'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {remaining >= 0
                  ? `${formatCurrency(remaining, currency)} remaining`
                  : `${formatCurrency(
                      Math.abs(remaining),
                      currency
                    )} over budget`}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryBudgetOverview;
