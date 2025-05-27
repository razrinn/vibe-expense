import React from 'react';
import CategoryManager from '../components/expenses/CategoryManager';
import { useExpenses } from '../context/ExpenseContext';

const CategoryManagementPage: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } =
    useExpenses();

  return (
    <>
      <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
        Category Management
      </h2>
      <p className='text-gray-700 dark:text-gray-300 mb-4'>
        You can now set a monthly budget for each category. This budget will
        help you track your spending more effectively.
      </p>
      <CategoryManager
        categories={categories}
        onAddCategory={addCategory}
        onUpdateCategory={updateCategory}
        onDeleteCategory={deleteCategory}
      />
    </>
  );
};

export default CategoryManagementPage;
