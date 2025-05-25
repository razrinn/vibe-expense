import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PieChart, BarChart3, Settings, Plus } from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ||
      (path !== '/' && location.pathname.startsWith(path))
      ? 'text-green-600 dark:text-green-400'
      : 'text-gray-500 dark:text-gray-400';
  };

  return (
    <nav className='fixed bottom-0 left-0 right-0 bg-white dark:bg-black-900 shadow-top border-t border-gray-200 dark:border-gray-700 z-10 sm:hidden pb-safe'>
      <div className='max-w-xl mx-auto px-4'>
        <div className='flex justify-around items-center h-16'>
          <Link
            to='/'
            className={`flex flex-col items-center justify-center ${isActive(
              '/'
            )} hover:text-green-600 dark:hover:text-green-400 transition-colors`}
          >
            <Home className='h-6 w-6' />
            <span className='text-xs mt-1'>Dashboard</span>
          </Link>

          <Link
            to='/expenses'
            className={`flex flex-col items-center justify-center ${isActive(
              '/expenses'
            )} hover:text-green-600 dark:hover:text-green-400 transition-colors`}
          >
            <BarChart3 className='h-6 w-6' />
            <span className='text-xs mt-1'>Expenses</span>
          </Link>

          <Link
            to='/add'
            className='flex flex-col items-center justify-center text-white bg-green-600 hover:bg-green-700 rounded-xl h-14 w-14 shadow-lg transition-colors'
          >
            <Plus className='h-6 w-6' />
            <span className='text-xs mt-1'>Add</span>
          </Link>

          <Link
            to='/analytics'
            className={`flex flex-col items-center justify-center ${isActive(
              '/analytics'
            )} hover:text-green-600 dark:hover:text-green-400 transition-colors`}
          >
            <PieChart className='h-6 w-6' />
            <span className='text-xs mt-1'>Analytics</span>
          </Link>

          <Link
            to='/settings'
            className={`flex flex-col items-center justify-center ${isActive(
              '/settings'
            )} hover:text-green-600 dark:hover:text-green-400 transition-colors`}
          >
            <Settings className='h-6 w-6' />
            <span className='text-xs mt-1'>Settings</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
