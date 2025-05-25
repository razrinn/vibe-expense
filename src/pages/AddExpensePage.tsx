import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import ExpenseForm from '../components/expenses/ExpenseForm';
import { useExpenses } from '../context/ExpenseContext';
import { Expense } from '../types';

const AddExpensePage: React.FC = () => {
  const { addExpense, categories } = useExpenses();
  const navigate = useNavigate();

  const handleSubmit = (expense: Omit<Expense, 'id'>) => {
    addExpense(expense);
    navigate('/expenses');
  };

  return (
    <PageContainer>
      <div className='bg-white dark:bg-black-900 rounded-lg shadow p-6 borderborder-gray-200 dark:border-gray-700'>
        <ExpenseForm onSubmit={handleSubmit} categories={categories} />
      </div>
    </PageContainer>
  );
};

export default AddExpensePage;
