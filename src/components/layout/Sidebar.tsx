import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  PieChart,
  BarChart3,
  Settings,
  Plus,
  DollarSign,
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ||
      (path !== '/' && location.pathname.startsWith(path))
      ? 'text-green-600 dark:text-green-400'
      : 'text-gray-500 dark:text-gray-400';
  };

  return (
    <aside className='hidden sm:flex flex-col w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-black-900 h-full fixed'>
      <div className='p-5 border-b border-gray-200 dark:border-gray-700'>
        <div className='flex items-center space-x-2'>
          <DollarSign className='h-8 w-8 text-green-600 dark:text-green-400' />
          <span className='text-xl font-bold text-gray-800 dark:text-white'>
            VibeExpense
          </span>
        </div>
      </div>

      <nav className='flex-1 py-4 px-3 space-y-1'>
        <Link
          to='/'
          className={`flex items-center space-x-3 px-3 py-2 rounded-md ${isActive(
            '/'
          )} transition-colors`}
        >
          <Home className='h-5 w-5' />
          <span>Dashboard</span>
        </Link>

        <Link
          to='/expenses'
          className={`flex items-center space-x-3 px-3 py-2 rounded-md ${isActive(
            '/expenses'
          )} transition-colors`}
        >
          <BarChart3 className='h-5 w-5' />
          <span>Expenses</span>
        </Link>

        <Link
          to='/analytics'
          className={`flex items-center space-x-3 px-3 py-2 rounded-md ${isActive(
            '/analytics'
          )} transition-colors`}
        >
          <PieChart className='h-5 w-5' />
          <span>Analytics</span>
        </Link>

        <Link
          to='/settings'
          className={`flex items-center space-x-3 px-3 py-2 rounded-md ${isActive(
            '/settings'
          )} transition-colors`}
        >
          <Settings className='h-5 w-5' />
          <span>Settings</span>
        </Link>
      </nav>

      <div className='p-4'>
        <Link
          to='/add'
          className='flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md w-full transition-colors'
        >
          <Plus className='h-5 w-5' />
          <span>Add Expense</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
