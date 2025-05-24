import React from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import ExpenseList from '../components/expenses/ExpenseList';
import ExpenseFilters from '../components/expenses/ExpenseFilters';
import { useExpenses } from '../context/ExpenseContext';
import { formatCurrency } from '../utils/formatters';
import { PlusCircle } from 'lucide-react';

const ExpensesPage: React.FC = () => {
  const { 
    filteredExpenses, 
    deleteExpense, 
    categories, 
    filter, 
    setFilter,
    summary
  } = useExpenses();

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Expenses</h2>
          <Link
            to="/add"
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            <span>Add Expense</span>
          </Link>
        </div>
        
        <ExpenseFilters 
          filter={filter} 
          categories={categories} 
          onFilterChange={setFilter} 
        />
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <p className="text-gray-500 dark:text-gray-400">
              {filteredExpenses.length} {filteredExpenses.length === 1 ? 'expense' : 'expenses'} found
            </p>
            <p className="text-lg font-medium text-green-600 dark:text-green-400">
              Total: {formatCurrency(summary.total)}
            </p>
          </div>
        </div>
        
        <ExpenseList 
          expenses={filteredExpenses} 
          categories={categories} 
          onDelete={deleteExpense} 
        />
      </div>
    </PageContainer>
  );
};

export default ExpensesPage;