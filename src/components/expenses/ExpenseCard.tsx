import React, { useState } from 'react';
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

  const [showActions, setShowActions] = useState(false);

  const handleCardClick = () => {
    setShowActions(!showActions);
  };

  return (
    <div
      className={`
        bg-white dark:bg-black-900 rounded-lg shadow-sm
        transition-all duration-150 ease-in-out
        hover:shadow-md
        focus:outline-none focus:ring-2 focus:ring-green-500
        py-1
        relative overflow-hidden
      `}
      onClick={handleCardClick}
    >
      <div className='flex items-center justify-between gap-2 pr-2'>
        {/* Left column - Description and metadata */}
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2'>
            <span
              className={`rounded-full ${
                variant === 'compact' ? 'w-2 h-2' : 'w-3 h-3'
              }`}
              style={{ backgroundColor: getCategoryColor(expense.category) }}
            />
            <span className='text-xs flex-shrink-0 font-medium text-gray-500 dark:text-gray-400'>
              {getCategoryName(expense.category)}
            </span>
            <h3 className='text-sm font-medium text-gray-900 dark:text-white truncate'>
              {expense.description}
            </h3>
          </div>

          {expense.notes && variant === 'default' && (
            <p className='text-xs text-gray-600 dark:text-gray-300 line-clamp-1'>
              {expense.notes}
            </p>
          )}
        </div>

        {/* Right column - Amount and actions */}
        <div className='flex items-center gap-2 relative'>
          <p className='text-sm text-gray-700 dark:text-gray-300 font-mono'>
            {formatCurrency(expense.amount, currency)}
          </p>

          <div
            className={`
              absolute top-0 bottom-0 w-16
              flex items-center justify-end gap-1
              bg-white dark:bg-black-900
              transition-all duration-200 ease-out
              ${showActions ? 'right-0' : '-right-16'}
            `}
            onClick={(e) => e.stopPropagation()} // Prevent card click when interacting with buttons
          >
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
