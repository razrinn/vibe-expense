import React from 'react';
import CategoryChart from '../components/analytics/CategoryChart';
import TrendChart from '../components/analytics/TrendChart';
import ExpenseFilters from '../components/expenses/ExpenseFilters';
import { useExpenses } from '../context/ExpenseContext';
import CategoryBudgetOverview from '../components/budgets/CategoryBudgetOverview';

const AnalyticsPage: React.FC = () => {
  const { filteredExpenses, categories, filter, setFilter, summary } =
    useExpenses();

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <ExpenseFilters
          filter={filter}
          categories={categories}
          onFilterChange={setFilter}
        />

        <CategoryChart
          data={summary.byCategory}
          categories={categories}
          total={summary.total}
        />

        <TrendChart
          expenses={filteredExpenses}
          period={filter.period}
          dateRange={filter.dateRange}
        />
      </div>

      <CategoryBudgetOverview includeZeroBudget />

      {Object.keys(summary.byCategory).length === 0 && (
        <div className='text-center py-6'>
          <p className='text-gray-500 dark:text-gray-400'>
            No data available for the selected period.
          </p>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
