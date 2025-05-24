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
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add New Expense</h2>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <ExpenseForm 
            onSubmit={handleSubmit} 
            categories={categories} 
          />
        </div>
      </div>
    </PageContainer>
  );
};

export default AddExpensePage;