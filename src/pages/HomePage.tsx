import React from 'react';
import { Link } from 'react-router-dom';
import KeyMetrics from '../components/analytics/KeyMetrics';
import CategoryBudgetOverview from '../components/budgets/CategoryBudgetOverview';
import { useExpenses } from '../context/ExpenseContext';
import { PlusCircle } from 'lucide-react';

const HomePage: React.FC = () => {
  const { summary } = useExpenses();

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
          Overview
        </h2>
        <Link
          to='/add'
          className='inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
        >
          <PlusCircle className='h-4 w-4 mr-1' />
          <span>Add Expense</span>
        </Link>
      </div>
      <KeyMetrics summary={summary} />
      <CategoryBudgetOverview />
    </div>
  );
};

export default HomePage;
