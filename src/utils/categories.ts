import { Category } from '../types';

export const getDefaultCategories = (): Category[] => {
  return [
    {
      id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      name: 'Food & Dining',
      color: '#FF5252' // Red
    },
    {
      id: 'b2c3d4e5-f6a7-8901-2345-67890abcdef0',
      name: 'Transportation',
      color: '#448AFF' // Blue
    },
    {
      id: 'c3d4e5f6-a7b8-9012-3456-7890abcdef01',
      name: 'Housing',
      color: '#9C27B0' // Purple
    },
    {
      id: 'd4e5f6a7-b8c9-0123-4567-890abcdef012',
      name: 'Entertainment',
      color: '#FF9800' // Orange
    },
    {
      id: 'e5f6a7b8-c9d0-1234-5678-90abcdef0123',
      name: 'Shopping',
      color: '#E91E63' // Pink
    },
    {
      id: 'f6a7b8c9-d0e1-2345-6789-0abcdef01234',
      name: 'Utilities',
      color: '#607D8B' // Blue Grey
    },
    {
      id: 'a7b8c9d0-e1f2-3456-7890-abcdef012345',
      name: 'Health',
      color: '#4CAF50' // Green
    },
    {
      id: 'b8c9d0e1-f2a3-4567-8901-bcdef0123456',
      name: 'Travel',
      color: '#8BC34A' // Light Green
    },
    {
      id: 'c9d0e1f2-a3b4-5678-9012-cdef01234567',
      name: 'Education',
      color: '#00BCD4' // Cyan
    },
    {
      id: 'd0e1f2a3-b4c5-6789-0123-def012345678',
      name: 'Other',
      color: '#757575' // Grey
    }
  ];
};

export const getCategoryById = (categories: Category[], id: string): Category | undefined => {
  return categories.find(category => category.id === id);
};

export const getCategoryByName = (categories: Category[], name: string): Category | undefined => {
  return categories.find(category => category.name.toLowerCase() === name.toLowerCase());
};

export const formatCategoryName = (name: string): string => {
  return name.trim();
};

export const validateCategoryName = (name: string, categories: Category[], currentId?: string): boolean => {
  // Check if empty
  if (!name.trim()) return false;

  // Check if duplicate (ignore current category when editing)
  const duplicate = categories.find(
    cat => cat.name.toLowerCase() === name.toLowerCase() && cat.id !== currentId
  );

  return !duplicate;
};