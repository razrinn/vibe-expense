import { Category } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const getDefaultCategories = (): Category[] => {
  return [
    {
      id: uuidv4(),
      name: 'Food & Dining',
      color: '#FF5252' // Red
    },
    {
      id: uuidv4(),
      name: 'Transportation',
      color: '#448AFF' // Blue
    },
    {
      id: uuidv4(),
      name: 'Housing',
      color: '#9C27B0' // Purple
    },
    {
      id: uuidv4(),
      name: 'Entertainment',
      color: '#FF9800' // Orange
    },
    {
      id: uuidv4(),
      name: 'Shopping',
      color: '#E91E63' // Pink
    },
    {
      id: uuidv4(),
      name: 'Utilities',
      color: '#607D8B' // Blue Grey
    },
    {
      id: uuidv4(),
      name: 'Health',
      color: '#4CAF50' // Green
    },
    {
      id: uuidv4(),
      name: 'Travel',
      color: '#8BC34A' // Light Green
    },
    {
      id: uuidv4(),
      name: 'Education',
      color: '#00BCD4' // Cyan
    },
    {
      id: uuidv4(),
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