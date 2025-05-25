import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import CategoryChart from '../components/analytics/CategoryChart';
import TrendChart from '../components/analytics/TrendChart';
import KeyMetrics from '../components/analytics/KeyMetrics';
import ExpenseFilters from '../components/expenses/ExpenseFilters';
import { useExpenses } from '../context/ExpenseContext';

const AnalyticsPage: React.FC = () => {
  const { filteredExpenses, categories, filter, setFilter, summary } =
    useExpenses();

  return (
    <PageContainer>
      <div className='space-y-6'>
        <ExpenseFilters
          filter={filter}
          categories={categories}
          onFilterChange={setFilter}
        />

        <KeyMetrics summary={summary} period={filter.period} />

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
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

        {Object.keys(summary.byCategory).length === 0 && (
          <div className='text-center py-6'>
            <p className='text-gray-500 dark:text-gray-400'>
              No data available for the selected period.
            </p>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default AnalyticsPage;
