import React from 'react';

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea: React.FC<TextareaProps> = ({ label, error, id, ...props }) => {
  const textareaId =
    id || (label ? label.toLowerCase().replace(/\s/g, '-') : undefined);

  return (
    <div className='mb-4'>
      {label && (
        <label
          htmlFor={textareaId}
          className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-black-900 text-gray-900 dark:text-white ${
          error ? 'border-red-500' : ''
        }`}
        rows={3}
        {...props}
      />
      {error && (
        <p className='mt-1 text-sm text-red-600 dark:text-red-400'>{error}</p>
      )}
    </div>
  );
};

export default Textarea;
