import React from 'react';
import { Link } from 'react-router-dom';
import ExpenseList from '../components/expenses/ExpenseList';
import KeyMetrics from '../components/analytics/KeyMetrics';
import { useExpenses } from '../context/ExpenseContext';
import { PlusCircle, ArrowRight } from 'lucide-react';
import UpdateNotification from '../components/layout/UpdateNotification';

const HomePage: React.FC = () => {
  const { filteredExpenses, deleteExpense, categories, summary, filter } =
    useExpenses();

  // Get only the 5 most recent expenses
  const recentExpenses = filteredExpenses.slice(0, 5);

  return (
    <>
      <UpdateNotification />
      <div className='space-y-6'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
            Overview
          </h2>
          <KeyMetrics summary={summary} period={filter.period} />
        </div>

        <div className='flex items-center justify-between'>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
            Recent
          </h2>
          <div className='flex space-x-2'>
            <Link
              to='/add'
              className='inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
            >
              <PlusCircle className='h-4 w-4 mr-1' />
              <span>Add</span>
            </Link>
            <Link
              to='/expenses'
              className='inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-black-900 hover:bg-gray-50 dark:hover:bg-black-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
            >
              <span>View All</span>
              <ArrowRight className='h-4 w-4 ml-1' />
            </Link>
          </div>
        </div>

        <ExpenseList
          expenses={recentExpenses}
          categories={categories}
          onDelete={deleteExpense}
        />
        {recentExpenses.length === 0 && (
          <div className='text-center py-10'>
            <p className='text-gray-500 dark:text-gray-400'>
              No expenses found for the selected period.
            </p>
            <Link
              to='/add'
              className='mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
            >
              <PlusCircle className='h-4 w-4 mr-1' />
              Add your first expense
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;
