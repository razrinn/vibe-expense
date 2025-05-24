import React from 'react';
import { ExpenseFilter, Category } from '../../types';
import { formatPeriod } from '../../utils/formatters';
import { Calendar, Filter } from 'lucide-react';

interface ExpenseFiltersProps {
  filter: ExpenseFilter;
  categories: Category[];
  onFilterChange: (filter: Partial<ExpenseFilter>) => void;
}

const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({ 
  filter, 
  categories, 
  onFilterChange 
}) => {
  const handlePeriodChange = (period: 'day' | 'week' | 'month' | 'custom') => {
    onFilterChange({ period });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value === 'all' ? undefined : e.target.value;
    onFilterChange({ category });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-4 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-green-500 dark:text-green-400" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {formatPeriod(filter.period, filter.dateRange.start, filter.dateRange.end)}
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-500 dark:text-gray-400">Filters</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="period" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Time Period
          </label>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePeriodChange('day')}
              className={`px-3 py-1 text-sm rounded-md ${filter.period === 'day' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            >
              Day
            </button>
            <button
              onClick={() => handlePeriodChange('week')}
              className={`px-3 py-1 text-sm rounded-md ${filter.period === 'week' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            >
              Week
            </button>
            <button
              onClick={() => handlePeriodChange('month')}
              className={`px-3 py-1 text-sm rounded-md ${filter.period === 'month' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            >
              Month
            </button>
          </div>
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            id="category"
            value={filter.category || 'all'}
            onChange={handleCategoryChange}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:text-white text-sm"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ExpenseFilters;