import React, { useState } from 'react';
import { Category } from '../../types';
import { validateCategoryName } from '../../utils/categories';
import { formatCurrency } from '../../utils/formatters';
import { Plus, Edit, Trash2, Check, X, AlertCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import Input from '../ui/forms/Input';
import { useSettings } from '../../context/SettingsContext';

interface CategoryManagerProps {
  categories: Category[];
  onAddCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  onUpdateCategory: (
    id: string,
    category: Omit<Category, 'id'>
  ) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<boolean>;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#4CAF50');
  const [newCategoryBudget, setNewCategoryBudget] = useState<number>(0);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');
  const [editBudget, setEditBudget] = useState<number>(0);
  const [error, setError] = useState('');
  const { showToast } = useToast();
  const { currency } = useSettings();

  const handleAddCategory = () => {
    setIsAddingCategory(true);
    setNewCategoryName('');
    setNewCategoryColor('#4CAF50');
    setNewCategoryBudget(0);
    setError('');
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditName(category.name);
    setEditColor(category.color);
    setEditBudget(category.budget || 0); // Set to existing budget or 0 if undefined
    setError('');
  };

  const handleSaveCategory = async () => {
    if (!validateCategoryName(newCategoryName, categories)) {
      setError(
        newCategoryName.trim()
          ? 'Category name already exists'
          : 'Category name cannot be empty'
      );
      return;
    }

    await onAddCategory({
      name: newCategoryName.trim(),
      color: newCategoryColor,
      budget: newCategoryBudget,
    });

    setIsAddingCategory(false);
    setNewCategoryName('');
    setNewCategoryColor('#4CAF50');
    setNewCategoryBudget(0);
    setError('');

    showToast({
      message: 'Category added successfully',
      type: 'success',
    });
  };

  const handleUpdateCategory = async (id: string) => {
    if (!validateCategoryName(editName, categories, id)) {
      setError(
        editName.trim()
          ? 'Category name already exists'
          : 'Category name cannot be empty'
      );
      return;
    }

    await onUpdateCategory(id, {
      name: editName.trim(),
      color: editColor,
      budget: editBudget,
    });

    setEditingCategoryId(null);
    setEditName('');
    setEditColor('');
    setEditBudget(0);
    setError('');

    showToast({
      message: 'Category updated successfully',
      type: 'success',
    });
  };

  const handleDeleteCategory = async (id: string) => {
    const success = await onDeleteCategory(id);

    if (success) {
      showToast({
        message: 'Category deleted successfully',
        type: 'success',
      });
    } else {
      showToast({
        message: 'Cannot delete a category that is in use',
        type: 'error',
      });
    }
  };

  const handleCancelAdd = () => {
    setIsAddingCategory(false);
    setError('');
  };

  const handleCancelEdit = () => {
    setEditingCategoryId(null);
    setError('');
  };

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
          Categories
        </h2>
        <button
          onClick={handleAddCategory}
          className='inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
        >
          <Plus className='h-4 w-4 mr-1' />
          Add
        </button>
      </div>

      {error && (
        <div className='rounded-md bg-red-50 dark:bg-red-900/30 p-3 border border-red-200 dark:border-red-800'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <AlertCircle className='h-5 w-5 text-red-400 dark:text-red-300' />
            </div>
            <div className='ml-3'>
              <p className='text-sm text-red-700 dark:text-red-300'>{error}</p>
            </div>
          </div>
        </div>
      )}

      {isAddingCategory && (
        <div className='bg-gray-50 dark:bg-black-800 p-4 rounded-md'>
          <div className='space-y-3'>
            <Input
              label='Category Name'
              id='newCategoryName'
              type='text'
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder='Enter category name'
              autoFocus
              error={error} // Pass error prop
            />
            <Input
              label='Monthly Budget'
              id='newCategoryBudget'
              type='number'
              value={newCategoryBudget.toString()}
              onChange={(e) => setNewCategoryBudget(Number(e.target.value))}
              placeholder='0'
              min='0'
            />
            <div>
              <label
                htmlFor='newCategoryColor'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300'
              >
                Color
              </label>
              <div className='mt-1 flex items-center space-x-2'>
                <input
                  type='color'
                  id='newCategoryColor'
                  value={newCategoryColor}
                  onChange={(e) => setNewCategoryColor(e.target.value)}
                  className='h-8 w-8 rounded-md border-0 cursor-pointer'
                />
                <Input
                  type='text'
                  value={newCategoryColor}
                  onChange={(e) => setNewCategoryColor(e.target.value)}
                  placeholder='#HEX'
                />
              </div>
            </div>
            <div className='flex justify-end space-x-2 mt-3'>
              <button
                onClick={handleCancelAdd}
                className='inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-black-900 hover:bg-gray-50 dark:hover:bg-black-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
              >
                <X className='h-4 w-4 mr-1' />
                Cancel
              </button>
              <button
                onClick={handleSaveCategory}
                className='inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
              >
                <Check className='h-4 w-4 mr-1' />
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div className='bg-white dark:bg-black-900 shadow rounded-md overflow-hidden'>
        <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
          {categories.map((category) => (
            <li key={category.id} className='p-4'>
              {editingCategoryId === category.id ? (
                <div className='space-y-3'>
                  <Input
                    label='Category Name'
                    id={`edit-${category.id}-name`}
                    type='text'
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    autoFocus
                    error={error}
                  />
                  <Input
                    label='Monthly Budget'
                    id={`edit-${category.id}-budget`}
                    type='number'
                    value={editBudget.toString()}
                    onChange={(e) => setEditBudget(Number(e.target.value))}
                    placeholder='0'
                    min='0'
                  />
                  <div>
                    <label
                      htmlFor={`edit-${category.id}-color`}
                      className='block text-sm font-medium text-gray-700 dark:text-gray-300'
                    >
                      Color
                    </label>
                    <div className='mt-1 flex items-center space-x-2'>
                      <input
                        type='color'
                        id={`edit-${category.id}-color`}
                        value={editColor}
                        onChange={(e) => setEditColor(e.target.value)}
                        className='h-8 w-8 rounded-md border-0 cursor-pointer'
                      />
                      <Input
                        type='text'
                        value={editColor}
                        onChange={(e) => setEditColor(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className='flex justify-end space-x-2 mt-3'>
                    <button
                      onClick={handleCancelEdit}
                      className='inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-black-900 hover:bg-gray-50 dark:hover:bg-black-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                    >
                      <X className='h-4 w-4 mr-1' />
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdateCategory(category.id)}
                      className='inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                    >
                      <Check className='h-4 w-4 mr-1' />
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <span
                      className='w-4 h-4 rounded-full mr-3'
                      style={{ backgroundColor: category.color }}
                    ></span>
                    <span className='text-gray-900 dark:text-white'>
                      {category.name}
                    </span>
                    {category.budget !== undefined && (
                      <span className='ml-2 text-sm text-gray-500 dark:text-gray-400'>
                        (Budget: {formatCurrency(category.budget, currency)})
                      </span>
                    )}
                  </div>
                  <div className='flex space-x-2'>
                    <button
                      onClick={() => handleEditCategory(category)}
                      className='text-gray-400 hover:text-gray-500 dark:hover:text-gray-300'
                      aria-label={`Edit ${category.name}`}
                    >
                      <Edit className='h-4 w-4' />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className='text-gray-400 hover:text-red-500 dark:hover:text-red-400'
                      aria-label={`Delete ${category.name}`}
                    >
                      <Trash2 className='h-4 w-4' />
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryManager;
