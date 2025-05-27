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
