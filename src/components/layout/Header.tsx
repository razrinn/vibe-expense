import React from 'react';
import { useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();

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
        return 'ExpenseTrack';
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className='bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10'>
      <div className='px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <h1 className='text-xl font-bold text-gray-900 dark:text-white'>
            {getTitle()}
          </h1>
          <div className='flex items-center space-x-4'>
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none'
              aria-label='Logout'
            >
              <LogOut className='h-5 w-5' />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
