import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Expense } from '../../types';
import { formatDate } from '../../utils/formatters';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface TrendChartProps {
  expenses: Expense[];
  period: 'day' | 'week' | 'month' | 'custom';
  dateRange: { start: Date; end: Date };
}

const TrendChart: React.FC<TrendChartProps> = ({ expenses, period, dateRange }) => {
  const { labels, data } = useMemo(() => {
    if (expenses.length === 0) {
      return { labels: [], data: [] };
    }

    // Sort expenses by date
    const sortedExpenses = [...expenses].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Group by date and calculate daily totals
    const dailyTotals: Record<string, number> = {};
    
    sortedExpenses.forEach(expense => {
      const date = expense.date.split('T')[0]; // Format: YYYY-MM-DD
      if (!dailyTotals[date]) {
        dailyTotals[date] = 0;
      }
      dailyTotals[date] += expense.amount;
    });

    // Create arrays for chart
    const labels: string[] = [];
    const data: number[] = [];
    
    Object.entries(dailyTotals)
      .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
      .forEach(([date, amount]) => {
        labels.push(formatDate(date));
        data.push(amount);
      });

    return { labels, data };
  }, [expenses]);

  const chartData: ChartData<'line'> = {
    labels,
    datasets: [
      {
        label: 'Daily Spending',
        data,
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        borderWidth: 2,
        pointBackgroundColor: '#4CAF50',
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: function(value) {
            return '$' + value;
          },
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Expense Trend</h3>
      <div className="h-64">
        {data.length > 0 ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendChart;