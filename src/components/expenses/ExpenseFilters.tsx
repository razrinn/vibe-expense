import React, { useState, useEffect } from 'react';
import { ExpenseFilter, Category } from '../../types';
import { formatPeriod, formatDateForInput } from '../../utils/formatters';
import { Calendar, Filter } from 'lucide-react';
import Select from '../ui/forms/Select';
import Input from '../ui/forms/Input';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
} from 'date-fns';

interface ExpenseFiltersProps {
  filter: ExpenseFilter;
  categories: Category[];
  onFilterChange: (filter: Partial<ExpenseFilter>) => void;
}

const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({
  filter,
  categories,
  onFilterChange,
}) => {
  const [showMonthYearPicker, setShowMonthYearPicker] = useState(
    filter.period === 'month' || filter.period === 'year'
  );
  const [showCustomRangePicker, setShowCustomRangePicker] = useState(
    filter.period === 'custom'
  );
  const [showFilters, setShowFilters] = useState<boolean>(() => {
    const savedState = localStorage.getItem('expenseFiltersVisible');
    return savedState ? JSON.parse(savedState) : true;
  });

  useEffect(() => {
    localStorage.setItem('expenseFiltersVisible', JSON.stringify(showFilters));
  }, [showFilters]);

  const handlePeriodChange = (
    period: 'all' | 'day' | 'week' | 'month' | 'year' | 'custom'
  ) => {
    let newPeriod = period;
    let newDateRange = filter.dateRange;
    let selectedMonth = filter.selectedMonth;
    let selectedYear = filter.selectedYear;

    const today = new Date();

    // If the same period is clicked again, deselect it and revert to 'all'
    if (filter.period === period) {
      newPeriod = 'all';
      newDateRange = { start: new Date(0), end: new Date() }; // Effectively no filter
      selectedMonth = undefined;
      selectedYear = undefined;
    } else {
      switch (period) {
        case 'day':
          newDateRange = { start: startOfDay(today), end: endOfDay(today) };
          selectedMonth = undefined;
          selectedYear = undefined;
          break;
        case 'week':
          newDateRange = { start: startOfWeek(today), end: endOfWeek(today) };
          selectedMonth = undefined;
          selectedYear = undefined;
          break;
        case 'month':
          newDateRange = { start: startOfMonth(today), end: endOfMonth(today) };
          selectedMonth = today.getMonth();
          selectedYear = today.getFullYear();
          break;
        case 'year':
          newDateRange = { start: startOfYear(today), end: endOfYear(today) };
          selectedMonth = undefined;
          selectedYear = today.getFullYear();
          break;
        case 'custom':
          // Keep existing custom range or set a default
          newDateRange = filter.dateRange || { start: today, end: today };
          selectedMonth = undefined;
          selectedYear = undefined;
          break;
      }
    }

    setShowMonthYearPicker(newPeriod === 'month' || newPeriod === 'year');
    setShowCustomRangePicker(newPeriod === 'custom');

    onFilterChange({
      period: newPeriod,
      dateRange: newDateRange,
      selectedMonth,
      selectedYear,
    });
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const month = parseInt(e.target.value, 10);
    const year = filter.selectedYear || new Date().getFullYear();
    const newDate = new Date(year, month, 1);
    onFilterChange({
      selectedMonth: month,
      selectedYear: year,
      dateRange: { start: startOfMonth(newDate), end: endOfMonth(newDate) },
    });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = parseInt(e.target.value, 10);
    const month = filter.selectedMonth ?? new Date().getMonth(); // Keep current month if selected
    const newDate = new Date(year, month, 1);
    onFilterChange({
      selectedYear: year,
      selectedMonth: month,
      dateRange: { start: startOfYear(newDate), end: endOfYear(newDate) },
    });
  };

  const handleCustomStartDateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const startDate = new Date(e.target.value);
    onFilterChange({
      dateRange: { start: startDate, end: filter.dateRange.end },
    });
  };

  const handleCustomEndDateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const endDate = new Date(e.target.value);
    onFilterChange({
      dateRange: { start: filter.dateRange.start, end: endDate },
    });
  };

  const handleCategoryChange = (categoryId: string) => {
    let newCategories: string[] = filter.category ? [...filter.category] : [];

    if (newCategories.includes(categoryId)) {
      // Deselect category
      newCategories = newCategories.filter((id) => id !== categoryId);
    } else {
      // Select category
      newCategories.push(categoryId);
    }
    onFilterChange({
      category: newCategories.length > 0 ? newCategories : undefined,
    });
  };

  return (
    <div className='bg-white dark:bg-black-900 rounded-lg shadow p-4 mb-4 borderborder-gray-200 dark:border-gray-700'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <Calendar className='h-5 w-5 text-green-500 dark:text-green-400' />
          <h3 className='font-medium text-gray-900 dark:text-white'>
            {filter.period === 'all'
              ? 'All Time'
              : formatPeriod(
                  filter.period,
                  filter.dateRange.start,
                  filter.dateRange.end,
                  filter.selectedMonth,
                  filter.selectedYear
                )}
          </h3>
        </div>
        <div
          className='flex items-center space-x-2 cursor-pointer'
          onClick={() => setShowFilters((prev) => !prev)}
          aria-expanded={showFilters}
          role='button'
          aria-label='Toggle expense filters'
        >
          <Filter className='h-4 w-4 text-gray-500 dark:text-gray-400' />
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          showFilters
            ? 'max-h-screen opacity-100 mt-4'
            : 'max-h-0 opacity-0 mt-0'
        }`}
        style={{ transitionProperty: 'max-height, opacity, margin' }}
      >
        <div className='flex flex-wrap gap-4'>
          <div className='w-full sm:w-auto'>
            <label
              htmlFor='period'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
            >
              Time Period
            </label>
            <div className='flex flex-wrap gap-2'>
              {(
                [
                  { value: 'day', label: 'Day' },
                  { value: 'week', label: 'Week' },
                  { value: 'month', label: 'Month' },
                  { value: 'year', label: 'Year' },
                  { value: 'custom', label: 'Custom' },
                ] as const
              ).map((option) => (
                <button
                  key={option.value}
                  onClick={() => handlePeriodChange(option.value)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    filter.period === option.value
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 dark:bg-black-800 dark:text-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {showMonthYearPicker && (
            <div className='flex space-x-2 w-full sm:w-auto'>
              {filter.period === 'month' && (
                <Select
                  label='Month'
                  id='month-select'
                  value={(
                    filter.selectedMonth ?? new Date().getMonth()
                  ).toString()}
                  onChange={handleMonthChange}
                  options={[...Array(12).keys()].map((i) => ({
                    value: i.toString(),
                    label: format(new Date(2000, i, 1), 'MMM'),
                  }))}
                />
              )}
              <Select
                label='Year'
                id='year-select'
                value={(
                  filter.selectedYear ?? new Date().getFullYear()
                ).toString()}
                onChange={handleYearChange}
                options={[...Array(5).keys()]
                  .map((i) => new Date().getFullYear() - 2 + i)
                  .map((year) => ({
                    value: year.toString(),
                    label: year.toString(),
                  }))}
              />
            </div>
          )}

          {showCustomRangePicker && (
            <div className='flex space-x-2 w-full sm:w-auto'>
              <Input
                label='Start Date'
                id='start-date'
                type='date'
                value={formatDateForInput(filter.dateRange.start).split('T')[0]}
                onChange={handleCustomStartDateChange}
              />
              <Input
                label='End Date'
                id='end-date'
                type='date'
                value={formatDateForInput(filter.dateRange.end).split('T')[0]}
                onChange={handleCustomEndDateChange}
              />
            </div>
          )}

          {categories.length > 0 && (
            <div className='w-full sm:w-auto'>
              <label
                htmlFor='category'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
              >
                Category
              </label>
              <div className='flex flex-wrap gap-2'>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`px-3 py-1 text-sm rounded-full ${
                      filter.category?.includes(category.id)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-700 dark:bg-black-800 dark:text-gray-300'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseFilters;
