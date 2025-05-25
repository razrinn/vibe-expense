import { AlertCircle } from 'lucide-react';
import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode; // Add icon prop
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, icon, className, ...props }, ref) => {
    const inputId =
      id || (label ? label.toLowerCase().replace(/\s/g, '-') : undefined);

    return (
      <div className='mb-4'>
        {label && (
          <label
            htmlFor={inputId}
            className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
          >
            {label}
          </label>
        )}
        <div className='relative'>
          {icon && (
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-black-900 text-gray-900 dark:text-white ${
              error ? 'border-red-500 dark:border-red-500' : ''
            } ${icon ? 'pl-10' : ''} ${className}`}
            {...props}
          />
        </div>
        {error && (
          <div className='flex items-center mt-2 text-red-600 dark:text-red-400 text-sm'>
            <AlertCircle className='h-4 w-4 mr-1' />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);

export default Input;
