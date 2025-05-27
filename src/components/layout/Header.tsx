import React from 'react';
import { useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/expenses':
        return 'Expenses';
      case '/add':
        return 'Add Expense';
      case '/analytics':
        return 'Analytics';
      case '/settings':
        return 'Settings';
      default:
        if (location.pathname.startsWith('/edit/')) {
          return 'Edit Expense';
        }
        return 'VibeExpense';
    }
  };

  return (
    <header className='bg-white dark:bg-black-900 shadow sticky top-0 z-10'>
      <div className='px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <h1 className='text-xl font-bold text-gray-900 dark:text-white'>
            {getTitle()}
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
