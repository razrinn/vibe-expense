import React from 'react';
import { Expense, Category } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { getCategoryById } from '../../utils/categories';
import { useSettings } from '../../context/SettingsContext';
import { Link } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';

interface DailyGroupedExpenseListProps {
  expenses: Expense[];
  categories: Category[];
  onDelete: (id: string) => void;
}

const DailyGroupedExpenseList: React.FC<DailyGroupedExpenseListProps> = ({
  expenses,
  categories,
  onDelete,
}) => {
  const { currency } = useSettings();

  // Group expenses by date
  const groupedExpenses = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date).toISOString().split('T')[0]; // YYYY-MM-DD for grouping
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(expense);
    return acc;
  }, {} as Record<string, Expense[]>);

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedExpenses).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  const getCategoryName = (categoryId: string) => {
    const category = getCategoryById(categories, categoryId);
    return category ? category.name : 'Uncategorized';
  };

  const getCategoryColor = (categoryId: string) => {
    const category = getCategoryById(categories, categoryId);
    return category ? category.color : '#757575';
  };

  if (expenses.length === 0) {
    return (
      <div className='text-center py-10'>
        <p className='text-gray-500 dark:text-gray-400'>No expenses found.</p>
        <Link
          to='/add'
          className='mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
        >
          Add your first expense
        </Link>
      </div>
    );
  }

  return (
    <div className='space-y-3'>
      {sortedDates.map((date) => (
        <div
          key={date}
          className='bg-white dark:bg-black-900 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700'
        >
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-3'>
            {new Date(date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </h3>
          <div className='space-y-1'>
            {groupedExpenses[date].map((expense) => (
              <div
                key={expense.id}
                className='flex items-center justify-between py-1 border-b border-gray-100 dark:border-gray-800 last:border-b-0'
              >
                <div className='flex items-center flex-1 min-w-0'>
                  <span
                    className='w-2 h-2 rounded-full mr-2 flex-shrink-0'
                    style={{
                      backgroundColor: getCategoryColor(expense.category),
                    }}
                  ></span>
                  <div className='flex flex-col min-w-0'>
                    <p className='text-sm font-medium text-gray-900 dark:text-white truncate'>
                      {expense.description}
                    </p>
                    <p className='text-xs text-gray-500 dark:text-gray-400 truncate'>
                      {getCategoryName(expense.category)}
                    </p>
                  </div>
                </div>
                <div className='flex items-center ml-4 flex-shrink-0'>
                  <p className='text-sm font-semibold text-green-600 dark:text-green-400 mr-3'>
                    {formatCurrency(expense.amount, currency)}
                  </p>
                  <Link
                    to={`/edit/${expense.id}`}
                    className='text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 mr-2'
                    aria-label='Edit expense'
                  >
                    <Edit className='h-4 w-4' />
                  </Link>
                  <button
                    onClick={() => onDelete(expense.id)} // Direct delete for compact view, no confirmation for now
                    className='text-gray-400 hover:text-red-500 dark:hover:text-red-400'
                    aria-label='Delete expense'
                  >
                    <Trash2 className='h-4 w-4' />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DailyGroupedExpenseList;
