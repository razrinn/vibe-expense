import { db } from '../utils/indexedDB';
import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import CategoryManager from '../components/expenses/CategoryManager';
import { useExpenses } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useSettings } from '../context/SettingsContext';
import { Download, Trash2 } from 'lucide-react';
import Select from '../components/ui/forms/Select';
import { useNavigate } from 'react-router-dom';
import packageJson from '../../package.json'; // Import package.json

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

const SettingsPage: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, expenses } =
    useExpenses();

  const { resetPinAndLogout } = useAuth();
  const { showToast } = useToast();
  const { currency, setCurrency } = useSettings();
  const navigate = useNavigate();

  const getIsPWA = () => {
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    return (
      mediaQuery.matches || !!(navigator as NavigatorWithStandalone).standalone
    );
  };

  const [isPWA, setIsPWA] = React.useState(getIsPWA());

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handler = (e: MediaQueryListEvent) => {
      setIsPWA(
        e.matches || !!(navigator as NavigatorWithStandalone).standalone
      );
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleExportData = () => {
    try {
      // Create CSV content
      const headers = ['Date', 'Category', 'Description', 'Amount', 'Notes'];

      let csvContent = headers.join(',') + '\n';

      // Add expense data
      expenses.forEach((expense) => {
        const category = categories.find((c) => c.id === expense.category);
        const categoryName = category ? category.name : 'Unknown';

        const row = [
          expense.date,
          categoryName,
          `"${expense.description.replace(/"/g, '""')}"`, // Escape quotes
          expense.amount,
          `"${(expense.notes || '').replace(/"/g, '""')}"`, // Escape quotes
        ];

        csvContent += row.join(',') + '\n';
      });

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `expenses_${new Date().toISOString().split('T')[0]}.csv`
      );
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast({
        message: 'Data exported successfully',
        type: 'success',
      });
    } catch (error) {
      console.log('EXPORT DATA err: ', error);
      showToast({
        message: 'Failed to export data',
        type: 'error',
      });
    }
  };

  const handleResetPin = () => {
    if (
      window.confirm(
        'Are you sure you want to reset your PIN? You will be logged out.'
      )
    ) {
      resetPinAndLogout();

      showToast({
        message: 'PIN reset successfully',
        type: 'success',
      });
    }
  };

  const handleClearData = async () => {
    const confirmation = prompt(
      'This action will permanently delete ALL your expense data. Type "DELETE" to confirm:'
    );
    if (confirmation === 'DELETE') {
      await db.expenses.clear();
      // No need to reload the window, as the context providers will react to the DB changes

      showToast({
        message: 'All data cleared successfully',
        type: 'success',
      });
    } else if (confirmation !== null) {
      showToast({
        message: 'Data clearing cancelled.',
        type: 'info',
      });
    }
  };

  return (
    <PageContainer>
      <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
        {!isPWA && (
          <li className='py-4'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
              Install Progressive Web App (PWA)
            </h3>
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400 mb-4'>
              Install this application to your home screen for a native app-like
              experience.
            </p>
            <button
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
              onClick={() => navigate('/settings/installation')}
            >
              How to Install PWA
            </button>
          </li>
        )}
        <li className='py-4'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
            Data Management
          </h3>

          <div className='space-y-4'>
            <div>
              <button
                onClick={handleExportData}
                className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
              >
                <Download className='h-4 w-4 mr-2' />
                Export Expenses (CSV)
              </button>
              <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                Download all your expense data as a CSV file
              </p>
            </div>

            <div>
              <button
                onClick={handleResetPin}
                className='inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-black-900 hover:bg-gray-50 dark:hover:bg-black-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
              >
                Reset PIN
              </button>
              <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                Reset your PIN and create a new one
              </p>
            </div>

            <div>
              <button
                onClick={handleClearData}
                className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
              >
                <Trash2 className='h-4 w-4 mr-2' />
                Clear All Data
              </button>
              <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                Permanently delete all expense data
              </p>
            </div>
          </div>
        </li>
        <li className='py-4'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
            Currency Settings
          </h3>
          <Select
            label='Select Currency'
            id='currency-select'
            name='currency-select'
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            options={[
              { value: 'IDR', label: 'IDR - Indonesian Rupiah' },
              { value: 'USD', label: 'USD - United States Dollar' },
              { value: 'EUR', label: 'EUR - Euro' },
              { value: 'GBP', label: 'GBP - British Pound' },
              { value: 'JPY', label: 'JPY - Japanese Yen' },
            ]}
          />
          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            Choose the currency for displaying expenses.
          </p>
        </li>
        <li className='py-4'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
            Category Management
          </h3>
          <CategoryManager
            categories={categories}
            onAddCategory={addCategory}
            onUpdateCategory={updateCategory}
            onDeleteCategory={deleteCategory}
          />
        </li>
        <li className='py-4 text-center text-gray-500 dark:text-gray-400 text-sm'>
          App Version: {packageJson.version}
        </li>
      </ul>
    </PageContainer>
  );
};

export default SettingsPage;
