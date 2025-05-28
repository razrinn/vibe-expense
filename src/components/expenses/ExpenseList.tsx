import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Expense, Category } from '../../types';
import ExpenseCard from './ExpenseCard';
import DeleteConfirmation from '../ui/DeleteConfirmation';

interface ExpenseListProps {
  expenses: Expense[];
  categories: Category[];
  onDelete: (id: string) => Promise<void>;
}

const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  categories,
  onDelete,
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

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
    <div className='space-y-2'>
      {expenses.map((expense) => (
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
  );
};

export default ExpenseList;
