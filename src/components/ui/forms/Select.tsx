import React, { forwardRef } from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, id, options, className, ...props }, ref) => {
    const selectId =
      id || (label ? label.toLowerCase().replace(/\s/g, '-') : undefined);

    return (
      <div className='mb-4'>
        {label && (
          <label
            htmlFor={selectId}
            className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-black-900 text-gray-900 dark:text-white ${
            error ? 'border-red-500' : ''
          } ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className='mt-1 text-sm text-red-600 dark:text-red-400'>{error}</p>
        )}
      </div>
    );
  }
);

export default Select;
