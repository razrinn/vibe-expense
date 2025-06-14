import React from 'react';
import { useNavigate } from 'react-router-dom';
import ExpenseForm from '../components/expenses/ExpenseForm';
import { useExpenses } from '../context/ExpenseContext';
import { Expense } from '../types';

const AddExpensePage: React.FC = () => {
  const { addExpense, categories } = useExpenses();
  const navigate = useNavigate();

  const handleSubmit = async (expense: Omit<Expense, 'id'>) => {
    await addExpense(expense);
    navigate('/expenses');
  };

  return (
    <div className='bg-white dark:bg-black-900 rounded-lg shadow p-6 borderborder-gray-200 dark:border-gray-700'>
      <ExpenseForm onSubmit={handleSubmit} categories={categories} />
    </div>
  );
};

export default AddExpensePage;
