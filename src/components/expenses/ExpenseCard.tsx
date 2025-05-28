import React from 'react';
import { Expense, Category } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { getCategoryById } from '../../utils/categories';
import { Edit, Trash2 } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

interface ExpenseCardProps {
  expense: Expense;
  categories: Category[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
  variant?: 'default' | 'compact';
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expense,
  categories,
  onEdit,
  onDelete,
  isDeleting = false,
  variant = 'default',
}) => {
  const { currency } = useSettings();

  const getCategoryColor = (categoryId: string) => {
    const category = getCategoryById(categories, categoryId);
    return category ? category.color : '#757575';
  };

  const getCategoryName = (categoryId: string) => {
    const category = getCategoryById(categories, categoryId);
    return category ? category.name : 'Uncategorized';
  };

  return (
    <div
      className={`
      bg-white dark:bg-black-900 rounded-lg shadow-sm p-4
      border border-gray-100 dark:border-gray-800
      transition-all duration-150 ease-in-out
      hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700
      focus:outline-none focus:ring-2 focus:ring-green-500
      ${variant === 'compact' ? 'py-2' : ''}
    `}
    >
      <div className='flex items-start justify-between gap-4'>
        {/* Left column - Description and metadata */}
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2 mb-1'>
            <span
              className={`rounded-full ${
                variant === 'compact' ? 'w-2 h-2' : 'w-3 h-3'
              }`}
              style={{ backgroundColor: getCategoryColor(expense.category) }}
            />
            <span className='text-xs font-medium text-gray-500 dark:text-gray-400'>
              {getCategoryName(expense.category)}
            </span>
          </div>

          <h3 className='text-base font-medium text-gray-900 dark:text-white truncate'>
            {expense.description}
          </h3>

          {expense.notes && variant === 'default' && (
            <p className='mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2'>
              {expense.notes}
            </p>
          )}
        </div>

        {/* Right column - Amount and actions */}
        <div className='flex flex-col items-end gap-1'>
          <p className='text-lg font-semibold text-green-600 dark:text-green-400'>
            {formatCurrency(expense.amount, currency)}
          </p>

          <div className='flex items-center gap-2'>
            <button
              onClick={() => onEdit(expense.id)}
              className='p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full'
              aria-label='Edit expense'
            >
              <Edit className='w-4 h-4' />
            </button>
            <button
              onClick={() => onDelete(expense.id)}
              className='p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-full'
              aria-label='Delete expense'
              disabled={isDeleting}
            >
              <Trash2 className='w-4 h-4' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;
