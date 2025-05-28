import React, { useEffect, useRef } from 'react';

interface DeleteConfirmationProps {
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  onConfirm,
  onCancel,
  title,
  message,
}) => {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Focus the confirm button when mounted for keyboard accessibility
    confirmRef.current?.focus();
  }, []);

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50'>
      <div className='bg-white dark:bg-black-900 rounded-lg shadow-xl p-6 max-w-xs w-full mx-4'>
        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
          {title}
        </h3>
        <p className='text-sm text-gray-600 dark:text-gray-300 mb-6'>
          {message}
        </p>
        <div className='flex justify-end space-x-3'>
          <button
            onClick={onCancel}
            className='px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-black-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md'
          >
            Cancel
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            className='px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
