import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { formatDateForInput } from '../../utils/formatters';
import { Expense, Category } from '../../types';
import { useToast } from '../../context/ToastContext';

interface ExpenseFormProps {
  onSubmit: (data: Omit<Expense, 'id'>) => void;
  categories: Category[];
  initialData?: Expense;
  isEditing?: boolean;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  onSubmit,
  categories,
  initialData,
  isEditing = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Omit<Expense, 'id'>>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  // Set initial form values when editing an existing expense
  useEffect(() => {
    if (initialData) {
      reset({
        description: initialData.description,
        amount: initialData.amount,
        date: formatDateForInput(initialData.date),
        category: initialData.category,
        notes: initialData.notes || '',
      });
    } else {
      // Set default values for new expense
      reset({
        description: '',
        amount: 0,
        date: formatDateForInput(new Date()),
        category: categories.length > 0 ? categories[0].id : '',
        notes: '',
      });
    }
  }, [initialData, categories, reset]);

  const onFormSubmit = async (data: Omit<Expense, 'id'>) => {
    setIsSubmitting(true);

    try {
      // Convert amount to number
      const formattedData = {
        ...data,
        amount: parseFloat(data.amount.toString()),
      };

      onSubmit(formattedData);

      // Show success message
      showToast({
        message: isEditing
          ? 'Expense updated successfully!'
          : 'Expense added successfully!',
        type: 'success',
      });

      // Reset form if not editing
      if (!isEditing) {
        reset({
          description: '',
          amount: 0,
          date: formatDateForInput(new Date()),
          category: categories.length > 0 ? categories[0].id : '',
          notes: '',
        });
      }
    } catch (error) {
      showToast({
        message: 'Failed to save expense. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className='space-y-4'>
      <div>
        <label
          htmlFor='description'
          className='block text-sm font-medium text-gray-700 dark:text-gray-200'
        >
          Description
        </label>
        <input
          id='description'
          type='text'
          className='mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow focus:border-green-500 focus:ring-green-500 dark:bg-black-800 dark:text-white'
          placeholder='What did you spend on?'
          {...register('description', { required: 'Description is required' })}
        />
        {errors.description && (
          <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor='amount'
          className='block text-sm font-medium text-gray-700 dark:text-gray-200'
        >
          Amount
        </label>
        <div className='mt-1 relative rounded-md shadow'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <span className='text-gray-500 dark:text-gray-400'>$</span>
          </div>
          <input
            id='amount'
            type='number'
            step='0.01'
            min='0'
            className='pl-7 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow focus:border-green-500 focus:ring-green-500 dark:bg-black-800 dark:text-white'
            placeholder='0.00'
            {...register('amount', {
              required: 'Amount is required',
              valueAsNumber: true,
              min: { value: 0.01, message: 'Amount must be greater than 0' },
            })}
          />
        </div>
        {errors.amount && (
          <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
            {errors.amount.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor='date'
          className='block text-sm font-medium text-gray-700 dark:text-gray-200'
        >
          Date
        </label>
        <input
          id='date'
          type='datetime-local'
          className='mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow focus:border-green-500 focus:ring-green-500 dark:bg-black-800 dark:text-white'
          {...register('date', { required: 'Date and time are required' })}
        />
        {errors.date && (
          <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
            {errors.date.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor='category'
          className='block text-sm font-medium text-gray-700 dark:text-gray-200'
        >
          Category
        </label>
        <select
          id='category'
          className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md dark:bg-black-800 dark:border-gray-600 dark:text-white'
          {...register('category', { required: 'Category is required' })}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
            {errors.category.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor='notes'
          className='block text-sm font-medium text-gray-700 dark:text-gray-200'
        >
          Notes (Optional)
        </label>
        <textarea
          id='notes'
          rows={3}
          className='mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow focus:border-green-500 focus:ring-green-500 dark:bg-black-800 dark:text-white'
          placeholder='Any additional details...'
          {...register('notes')}
        />
      </div>

      <div className='pt-2'>
        <button
          type='submit'
          disabled={isSubmitting}
          className='w-full inline-flex justify-center py-2 px-4 border border-transparent shadow text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
        >
          {isSubmitting
            ? 'Saving...'
            : isEditing
            ? 'Update Expense'
            : 'Add Expense'}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
