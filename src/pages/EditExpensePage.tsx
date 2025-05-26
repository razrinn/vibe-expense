import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import ExpenseForm from '../components/expenses/ExpenseForm';
import { useExpenses } from '../context/ExpenseContext';
import { useToast } from '../context/ToastContext';
import { Expense } from '../types';

const EditExpensePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { expenses, updateExpense, categories } = useExpenses();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [expense, setExpense] = useState<Expense | null>(null);

  useEffect(() => {
    if (id) {
      const foundExpense = expenses.find((exp) => exp.id === id);
      if (foundExpense) {
        setExpense(foundExpense);
      } else {
        showToast({
          message: 'Expense not found',
          type: 'error',
        });
        navigate('/expenses');
      }
    }
  }, [id, expenses, navigate, showToast]);

  const handleSubmit = async (data: Omit<Expense, 'id'>) => {
    if (id) {
      await updateExpense(id, data);
      navigate('/expenses');
    }
  };

  if (!expense) {
    return (
      <PageContainer>
        <div className='flex justify-center items-center h-64'>
          <p className='text-gray-500 dark:text-gray-400'>Loading expense...</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className='bg-white dark:bg-black-900 rounded-lg shadow p-6 borderborder-gray-200 dark:border-gray-700'>
        <ExpenseForm
          onSubmit={handleSubmit}
          categories={categories}
          initialData={expense}
          isEditing={true}
        />
      </div>
    </PageContainer>
  );
};

export default EditExpensePage;
