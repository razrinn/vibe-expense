import React from 'react';
import { ExpenseSummary } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { TrendingUp, TrendingDown, Calendar, DollarSign } from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';
import { useSettings } from '../../context/SettingsContext';

interface KeyMetricsProps {
  summary: ExpenseSummary;
  period: 'day' | 'week' | 'month' | 'custom';
}

const KeyMetrics: React.FC<KeyMetricsProps> = ({ summary, period }) => {
  const { categories } = useExpenses();
  const { currency } = useSettings();
  const getIcon = (metricName: string) => {
    switch (metricName) {
      case 'Total':
        return <DollarSign className='h-5 w-5 text-green-500' />;
      case 'Average':
        return <Calendar className='h-5 w-5 text-blue-500' />;
      case 'Highest Category':
        return <TrendingUp className='h-5 w-5 text-red-500' />;
      case 'Lowest Category':
        return <TrendingDown className='h-5 w-5 text-purple-500' />;
      default:
        return null;
    }
  };

  const getAveragePeriod = () => {
    switch (period) {
      case 'day':
        return 'hourly';
      case 'week':
        return 'daily';
      case 'month':
      case 'custom':
      default:
        return 'daily';
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
      name: 'Average',
      value: formatCurrency(summary.average, currency),
      desc: `Average ${getAveragePeriod()} spending`,
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
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
      {metrics.map((metric) => (
        <div
          key={metric.name}
          className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-gray-700'
        >
          <div className='flex items-center'>
            <div className='rounded-full bg-gray-100 dark:bg-gray-700 p-2 mr-3'>
              {getIcon(metric.name)}
            </div>
            <div>
              <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                {metric.name}
              </p>
              <p className='text-xl font-semibold text-gray-900 dark:text-white'>
                {metric.value}
              </p>
              <p className='text-xs text-gray-500 dark:text-gray-400'>
                {metric.desc}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KeyMetrics;
