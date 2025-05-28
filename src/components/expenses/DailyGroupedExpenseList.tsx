import React, { useState } from 'react';
import { Expense, Category } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { useSettings } from '../../context/SettingsContext';
import { Link, useNavigate } from 'react-router-dom';
import ExpenseCard from './ExpenseCard';

interface DailyGroupedExpenseListProps {
  expenses: Expense[];
  categories: Category[];
  onDelete: (id: string) => Promise<void>;
}

const DailyGroupedExpenseList: React.FC<DailyGroupedExpenseListProps> = ({
  expenses,
  categories,
  onDelete,
}) => {
  const { currency } = useSettings();
  const navigate = useNavigate();
  const [collapsedMonths, setCollapsedMonths] = useState<
    Record<string, boolean>
  >({});

  const toggleMonthCollapse = (monthYear: string) => {
    setCollapsedMonths((prevState) => ({
      ...prevState,
      [monthYear]: !prevState[monthYear],
    }));
  };

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

  let lastMonthYear = '';

  return (
    <div>
      {sortedDates.map((date) => {
        const currentDate = new Date(date);
        const currentMonthYear = currentDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
        });

        const showMonthDivider = currentMonthYear !== lastMonthYear;
        lastMonthYear = currentMonthYear;

        return (
          <React.Fragment key={date}>
            {showMonthDivider && (
              <div className='sticky top-20 z-10 my-3'>
                <div className='relative flex justify-center'>
                  <button
                    onClick={() => toggleMonthCollapse(currentMonthYear)}
                    className='bg-gray-100 dark:bg-black-800 px-3 py-1 text-base font-semibold text-gray-900 dark:text-white rounded-full flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                  >
                    <span>{currentMonthYear}</span>
                    {collapsedMonths[currentMonthYear] ? (
                      <svg
                        className='h-4 w-4 transform rotate-90'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M9 5l7 7-7 7'
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        className='h-4 w-4 transform -rotate-90'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M9 5l7 7-7 7'
                        ></path>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}
            <div
              className={`bg-white dark:bg-black-900 rounded-lg shadow transition-all duration-150 ease-in-out overflow-hidden ${
                collapsedMonths[currentMonthYear]
                  ? 'max-h-0 p-0 border-0'
                  : 'max-h-screen p-4 mb-3'
              }`}
            >
              <div className='flex justify-between items-center mb-3 text-sm font-semibold'>
                <span className='text-gray-900 dark:text-white'>
                  {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    day: '2-digit',
                  })}
                </span>
                <span className=' text-gray-700 dark:text-gray-300'>
                  {formatCurrency(
                    groupedExpenses[date].reduce(
                      (sum, exp) => sum + exp.amount,
                      0
                    ),
                    currency
                  )}
                </span>
              </div>
              <div className='space-y-1 w-full'>
                {groupedExpenses[date].map((expense) => (
                  <ExpenseCard
                    key={expense.id}
                    expense={expense}
                    categories={categories}
                    onEdit={() => navigate(`/edit/${expense.id}`)}
                    onDelete={onDelete}
                    variant='compact'
                  />
                ))}
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default DailyGroupedExpenseList;
