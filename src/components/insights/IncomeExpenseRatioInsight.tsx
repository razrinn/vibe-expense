import React from 'react';
import { ExpenseSummary } from '../../types';
import { DollarSign } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { useSettings } from '../../context/SettingsContext';

interface IncomeExpenseRatioInsightProps {
  summary: ExpenseSummary;
}

const ratioRanges = [
  {
    max: 0.3,
    color: 'bg-green-100',
    text: 'text-green-800',
    message:
      "Excellent spending habits! You're saving a significant portion of your income.",
  },
  {
    max: 0.5,
    color: 'bg-blue-100',
    text: 'text-blue-800',
    message:
      "Good balance. You're managing your expenses well relative to your income.",
  },
  {
    max: 0.7,
    color: 'bg-yellow-100',
    text: 'text-yellow-800',
    message:
      'Watch out! Your expenses are taking a large chunk of your income. Consider reviewing your spending.',
  },
  {
    max: Infinity,
    color: 'bg-red-100',
    text: 'text-red-800',
    message:
      'High spending alert! Your expenses are very high compared to your income. Time to cut back!',
  },
];

const IncomeExpenseRatioInsight: React.FC<IncomeExpenseRatioInsightProps> = ({
  summary,
}) => {
  const { currency } = useSettings();
  const { total, monthlyIncome } = summary;

  if (!monthlyIncome || monthlyIncome <= 0) {
    return (
      <div className='p-4 rounded-lg shadow-md flex items-center space-x-4 bg-gray-100 text-gray-800'>
        <div className='flex-shrink-0'>
          <DollarSign className='h-6 w-6 text-gray-500' />
        </div>
        <div>
          <h3 className='text-lg font-semibold'>Set Your Income!</h3>
          <p className='text-sm'>
            Enter your monthly income in settings to see your income-to-expense
            ratio.
          </p>
        </div>
      </div>
    );
  }

  const ratio = total / monthlyIncome;
  const insight = ratioRanges.find((range) => ratio <= range.max);

  if (!insight) {
    // Fallback in case no range matches (shouldn't happen with Infinity)
    return null;
  }

  return (
    <div
      className={`p-4 rounded-lg shadow-md flex items-center space-x-4 ${insight.color}`}
    >
      <div className='flex-shrink-0'>
        <DollarSign
          className={`h-6 w-6 ${insight.text.replace('text-', 'text-')}`}
        />
      </div>
      <div>
        <h3 className='text-lg font-semibold'>
          Income-to-Expense Ratio: {ratio.toFixed(2)}
        </h3>
        <p className='text-sm'>
          You've spent {formatCurrency(total, currency)} out of{' '}
          {formatCurrency(monthlyIncome, currency)} this month.{' '}
          {insight.message}
        </p>
      </div>
    </div>
  );
};

export default IncomeExpenseRatioInsight;
