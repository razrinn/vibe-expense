import { useMemo } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { useSettings } from '../../context/SettingsContext';
import { formatCurrency } from '../../utils/formatters';
import { calculateExpenseSummary } from '../../utils/expenseCalculations';
import { endOfMonth, startOfMonth } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Category } from '../../types';

interface CategoryBudgetOverviewProps {
  includeZeroBudget?: boolean;
}

const CategoryBudgetOverview = ({
  includeZeroBudget = false,
}: CategoryBudgetOverviewProps) => {
  const { categories, expenses } = useExpenses();
  const { currency } = useSettings();
  const navigate = useNavigate();

  const dateRange = useMemo(() => {
    const monthDate = new Date();
    const newStart = startOfMonth(monthDate);
    const newEnd = endOfMonth(monthDate);

    return {
      start: newStart,
      end: newEnd,
    };
  }, []);

  const budgetedCategories = categories.filter((cat) => {
    if (includeZeroBudget) {
      return true;
    }
    return cat.budget !== undefined && cat.budget > 0;
  });

  const sortedBudgetedCategories = useMemo(() => {
    return budgetedCategories
      .map((category) => {
        const categorySpecificSummary = calculateExpenseSummary(expenses, {
          period: 'month',
          category: [category.id],
          dateRange,
        });
        const spentAmount = categorySpecificSummary.summary.total || 0;
        const budget = category.budget || 0;
        const progress = budget > 0 ? spentAmount / budget : 0;
        return { ...category, progress };
      })
      .sort((a, b) => b.progress - a.progress);
  }, [budgetedCategories, expenses, dateRange]);

  const handleClickCategory = (category: Category) => {
    if (category?.budget) return;

    navigate('/settings/category');
  };

  if (sortedBudgetedCategories.length === 0) {
    return null; // Don't render if no categories have budgets
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {sortedBudgetedCategories.map((category) => {
        const categorySpecificSummary = calculateExpenseSummary(expenses, {
          period: 'month',
          category: [category.id],
          dateRange,
        });
        const spentAmount = categorySpecificSummary.summary.total || 0;
        const budget = category.budget || 0;
        const progress =
          budget > 0 ? Math.min(100, (spentAmount / budget) * 100) : 0;
        const remaining = budget - spentAmount;

        const progressBarColor = category.color; // Use category color for progress bar

        return (
          <div
            key={category.id}
            className='bg-white dark:bg-black-900 rounded-lg shadow p-3'
            onClick={() => handleClickCategory(category)}
          >
            <div className='flex justify-between items-start mb-1'>
              <h3 className='text-base font-semibold text-gray-800 dark:text-gray-100'>
                {category.name}
              </h3>
              <div className='text-right'>
                <span className='text-xs font-medium text-gray-600 dark:text-gray-300 block'>
                  {budget > 0 ? (
                    <>
                      {formatCurrency(spentAmount, currency)} /{' '}
                      {formatCurrency(budget, currency)}
                    </>
                  ) : (
                    <span className='text-gray-500 dark:text-gray-400'>
                      No budget
                    </span>
                  )}
                </span>
                {budget > 0 && (
                  <p
                    className={`text-xs ${
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
                )}
              </div>
            </div>
            <div className='w-full bg-gray-300 rounded-full h-1.5 dark:bg-black-800'>
              <div
                className='h-1.5 rounded-full'
                style={{
                  width: `${progress}%`,
                  backgroundColor: progressBarColor,
                }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryBudgetOverview;
