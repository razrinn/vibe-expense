import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Category } from '../../types';
import { getCategoryById } from '../../utils/categories';
import { formatCurrency } from '../../utils/formatters';
import { useSettings } from '../../context/SettingsContext';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryChartProps {
  data: Record<string, number>;
  categories: Category[];
  total: number;
}

const CategoryChart: React.FC<CategoryChartProps> = ({
  data,
  categories,
  total,
}) => {
  const { currency } = useSettings();
  // Prepare data for pie chart
  const categoryNames: string[] = [];
  const categoryColors: string[] = [];
  const values: number[] = [];

  Object.entries(data).forEach(([categoryId, amount]) => {
    const category = getCategoryById(categories, categoryId);
    if (category) {
      categoryNames.push(category.name);
      categoryColors.push(category.color);
      values.push(amount);
    }
  });

  const chartData: ChartData<'pie'> = {
    labels: categoryNames,
    datasets: [
      {
        data: values,
        backgroundColor: categoryColors,
        borderColor: categoryColors.map((color) => `${color}80`), // Add transparency
        borderWidth: 1,
      },
    ],
  };

  const chartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${formatCurrency(
              value,
              currency
            )} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className='bg-white dark:bg-black-900 rounded-lg shadow p-4 borderborder-gray-200 dark:border-gray-700'>
      <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
        Spending by Category
      </h3>
      <div className='h-64'>
        {Object.keys(data).length > 0 ? (
          <Pie data={chartData} options={chartOptions} />
        ) : (
          <div className='h-full flex items-center justify-center'>
            <p className='text-gray-500 dark:text-gray-400'>
              No data available
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryChart;
