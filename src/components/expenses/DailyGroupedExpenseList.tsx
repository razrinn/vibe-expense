import React, { useState } from 'react';
import { Expense, Category } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { useSettings } from '../../context/SettingsContext';
import ExpenseCard from './ExpenseCard';
import DeleteConfirmation from '../ui/DeleteConfirmation';

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
  const [collapsedMonths, setCollapsedMonths] = useState<
    Record<string, boolean>
  >({});
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const toggleMonthCollapse = (monthYear: string) => {
    setCollapsedMonths((prevState) => ({
      ...prevState,
      [monthYear]: !prevState[monthYear],
    }));
  };

  const handleDeleteClick = (id: string) => {
    setConfirmDelete(id);
  };

  const handleConfirmDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };

  // Group expenses by date
  const groupedExpenses = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date).toISOString().split('T')[0];
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
              className={`transition-all duration-150 ease-in-out overflow-hidden ${
                collapsedMonths[currentMonthYear]
                  ? 'max-h-0 p-0 border-0'
                  : 'max-h-screen mb-3'
              }`}
            >
              <div className='flex justify-between items-center mb-2 text-sm font-semibold px-1'>
                <span className='text-gray-900 dark:text-white'>
                  {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    day: '2-digit',
                  })}
                </span>
                <span className='text-gray-700 dark:text-gray-300'>
                  {formatCurrency(
                    groupedExpenses[date].reduce(
                      (sum, exp) => sum + exp.amount,
                      0
                    ),
                    currency
                  )}
                </span>
              </div>
              <div className='space-y-2'>
                {groupedExpenses[date].map((expense) => (
                  <div key={expense.id} className='relative'>
                    <ExpenseCard
                      expense={expense}
                      categories={categories}
                      onEdit={(id) => window.location.assign(`/edit/${id}`)}
                      onDelete={handleDeleteClick}
                      isDeleting={deletingId === expense.id}
                      variant='compact'
                    />

                    {confirmDelete === expense.id && (
                      <DeleteConfirmation
                        onConfirm={() => handleConfirmDelete(expense.id)}
                        onCancel={handleCancelDelete}
                        title='Delete Expense'
                        message='Are you sure you want to delete this expense? This action cannot be undone.'
                      />
                    )}
                  </div>
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
