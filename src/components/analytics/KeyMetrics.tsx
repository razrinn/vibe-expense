import React from 'react';
import { ExpenseSummary } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { TrendingUp, TrendingDown, Calendar, DollarSign } from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';
import { useSettings } from '../../context/SettingsContext';

interface KeyMetricsProps {
  summary: ExpenseSummary;
}

const KeyMetrics: React.FC<KeyMetricsProps> = ({ summary }) => {
  const { categories } = useExpenses();
  const { currency } = useSettings();
  const getIcon = (metricName: string) => {
    switch (metricName) {
      case 'Total':
        return <DollarSign className='h-5 w-5 text-green-500' />;
      case 'Transactions':
        return <Calendar className='h-5 w-5 text-blue-500' />;
      case 'Highest Category':
        return <TrendingUp className='h-5 w-5 text-red-500' />;
      case 'Lowest Category':
        return <TrendingDown className='h-5 w-5 text-purple-500' />;
      default:
        return null;
    }
  };

  const getCategoryName = (id: string) => {
    if (!categories || categories.length === 0) {
      return 'Unknown Category';
    }
    const category = categories.find((cat) => cat.id === id);
    return category ? category.name : 'Unknown Category';
  };

  const getHighestCategory = () => {
    let highest = { id: 'None', amount: 0 };

    Object.entries(summary.byCategory).forEach(([categoryId, amount]) => {
      if (amount > highest.amount) {
        highest = { id: categoryId, amount };
      }
    });

    return {
      name: highest.id !== 'None' ? getCategoryName(highest.id) : 'None',
      amount: highest.amount,
    };
  };

  const getLowestCategory = () => {
    if (Object.keys(summary.byCategory).length === 0) {
      return { name: 'None', amount: 0 };
    }

    let lowest = { id: '', amount: Infinity };

    Object.entries(summary.byCategory).forEach(([categoryId, amount]) => {
      if (amount < lowest.amount) {
        lowest = { id: categoryId, amount };
      }
    });

    return {
      name: lowest.id !== '' ? getCategoryName(lowest.id) : 'None',
      amount: lowest.amount,
    };
  };

  const highestCategory = getHighestCategory();
  const lowestCategory = getLowestCategory();

  const metrics = [
    {
      name: 'Total',
      value: formatCurrency(summary.total, currency),
      desc: 'Total expenses',
    },
    {
      name: 'Transactions',
      value: summary.totalTransactions.toString(),
      desc: 'Number of transactions',
    },
    {
      name: 'Highest Category',
      value: highestCategory.name !== 'None' ? highestCategory.name : 'N/A',
      desc:
        highestCategory.name !== 'None'
          ? formatCurrency(highestCategory.amount, currency)
          : 'No data',
    },
    {
      name: 'Lowest Category',
      value: lowestCategory.name !== 'None' ? lowestCategory.name : 'N/A',
      desc:
        lowestCategory.name !== 'None'
          ? formatCurrency(lowestCategory.amount, currency)
          : 'No data',
    },
  ];

  return (
    <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-2'>
      {metrics.map((metric) => (
        <div
          key={metric.name}
          className='bg-white dark:bg-black-900 rounded-lg shadow p-3 flex flex-col items-center text-center'
        >
          <div className='rounded-full bg-gray-100 dark:bg-black-800 p-2 mb-2'>
            {getIcon(metric.name)}
          </div>
          <p className='text-xs font-medium text-gray-500 dark:text-gray-400 mb-1'>
            {metric.name}
          </p>
          <p className='text-lg font-semibold text-gray-900 dark:text-white'>
            {metric.value}
          </p>
          <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
            {metric.desc}
          </p>
        </div>
      ))}
    </div>
  );
};

export default KeyMetrics;
