import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { formatDateForInput } from '../../utils/formatters';
import { Expense, Category } from '../../types';
import { useToast } from '../../context/ToastContext';
import { useSettings } from '../../context/SettingsContext';
import Input from '../ui/forms/Input';
import Select from '../ui/forms/Select';
import Textarea from '../ui/forms/Textarea';

// Currency symbol mapping with padding adjustments for wider symbols
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  IDR: 'Rp',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CNY: '¥',
  INR: '₹',
  KRW: '₩',
  THB: '฿',
  VND: '₫',
  PHP: '₱',
  MYR: 'RM',
  SGD: 'S$',
  AUD: 'A$',
  CAD: 'C$',
  CHF: 'CHF',
};

// Currencies that need extra padding due to wider symbols
const WIDE_SYMBOL_CURRENCIES = new Set([
  'IDR',
  'KRW',
  'VND',
  'PHP',
  'MYR',
  'SGD',
  'AUD',
  'CAD',
  'CHF',
]);

interface ExpenseFormProps {
  onSubmit: (data: Omit<Expense, 'id'>) => Promise<void>;
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
  const { currency } = useSettings();

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

      await onSubmit(formattedData);

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
      console.log(error);
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
      <Input
        label='Description'
        id='description'
        type='text'
        placeholder='What did you spend on?'
        {...register('description', { required: 'Description is required' })}
        error={errors.description?.message}
      />

      <div>
        <Input
          label='Amount'
          id='amount'
          type='number'
          step='0.01'
          min='0'
          placeholder='0.00'
          {...register('amount', {
            required: 'Amount is required',
            min: { value: 0.01, message: 'Amount must be greater than 0' },
          })}
          error={errors.amount?.message}
          className={WIDE_SYMBOL_CURRENCIES.has(currency) ? 'pl-9' : 'pl-7'} // Adjust padding for wider symbols
          icon={
            <span className='text-gray-700 dark:text-gray-300'>
              {CURRENCY_SYMBOLS[currency] || '$'}
            </span>
          }
        />
      </div>

      <Input
        label='Date'
        id='date'
        type='datetime-local'
        {...register('date', { required: 'Date and time are required' })}
        error={errors.date?.message}
      />

      <Select
        label='Category'
        id='category'
        options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
        {...register('category', { required: 'Category is required' })}
        error={errors.category?.message}
      />

      <Textarea
        label='Notes (Optional)'
        id='notes'
        rows={3}
        placeholder='Any additional details...'
        {...register('notes')}
      />

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
