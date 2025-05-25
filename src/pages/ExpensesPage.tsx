import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import DailyGroupedExpenseList from '../components/expenses/DailyGroupedExpenseList';
import ExpenseFilters from '../components/expenses/ExpenseFilters';
import { useExpenses } from '../context/ExpenseContext';
import { formatCurrency } from '../utils/formatters';
import { useSettings } from '../context/SettingsContext';

const ExpensesPage: React.FC = () => {
  const {
    filteredExpenses,
    deleteExpense,
    categories,
    filter,
    setFilter,
    summary,
  } = useExpenses();
  const { currency } = useSettings();

  return (
    <PageContainer>
      <div className='space-y-4'>
        <ExpenseFilters
          filter={filter}
          categories={categories}
          onFilterChange={setFilter}
        />

        <div className='bg-white dark:bg-black-900 rounded-lg shadow p-4 borderborder-gray-200 dark:border-gray-700'>
          <div className='flex justify-between items-center'>
            <p className='text-gray-500 dark:text-gray-400'>
              {filteredExpenses.length}{' '}
              {filteredExpenses.length === 1 ? 'expense' : 'expenses'} found
            </p>
            <p className='text-lg font-medium text-green-600 dark:text-green-400'>
              Total: {formatCurrency(summary.total, currency)}
            </p>
          </div>
        </div>

        <DailyGroupedExpenseList
          expenses={filteredExpenses}
          categories={categories}
          onDelete={deleteExpense}
        />
      </div>
    </PageContainer>
  );
};

export default ExpensesPage;
