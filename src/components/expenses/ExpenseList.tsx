import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Expense, Category } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { getCategoryById } from '../../utils/categories';
import { Edit, Trash2 } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  categories: Category[];
  onDelete: (id: string) => void;
  showFilters?: boolean;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ 
  expenses, 
  categories, 
  onDelete,
  showFilters = true
}) => {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setConfirmDelete(id);
  };

  const handleConfirmDelete = (id: string) => {
    onDelete(id);
    setConfirmDelete(null);
  };

  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };

  const getCategoryColor = (categoryId: string) => {
    const category = getCategoryById(categories, categoryId);
    return category ? category.color : '#757575';
  };

  const getCategoryName = (categoryId: string) => {
    const category = getCategoryById(categories, categoryId);
    return category ? category.name : 'Uncategorized';
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 dark:text-gray-400">No expenses found.</p>
        <Link
          to="/add"
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Add your first expense
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {expenses.map(expense => (
        <div 
          key={expense.id} 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-gray-700 relative transition-all hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <span 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: getCategoryColor(expense.category) }}
                ></span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {getCategoryName(expense.category)}
                </p>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                {expense.description}
              </h3>
              <p className="mt-1 text-green-600 dark:text-green-400 text-xl font-semibold">
                {formatCurrency(expense.amount)}
              </p>
              <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <time dateTime={expense.date}>{formatDate(expense.date)}</time>
              </div>
              {expense.notes && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {expense.notes}
                </p>
              )}
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <Link
                to={`/edit/${expense.id}`}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 mr-3"
                aria-label="Edit expense"
              >
                <Edit className="h-5 w-5" />
              </Link>
              <button
                onClick={() => handleDeleteClick(expense.id)}
                className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                aria-label="Delete expense"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {confirmDelete === expense.id && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800/30 dark:bg-black/50 backdrop-blur-sm rounded-lg z-10">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-xs w-full">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">Confirm Delete</h4>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Are you sure you want to delete this expense? This action cannot be undone.
                </p>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={handleCancelDelete}
                    className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleConfirmDelete(expense.id)}
                    className="px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ExpenseList;