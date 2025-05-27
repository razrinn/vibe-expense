import React from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useSettings } from '../context/SettingsContext';
import { Download, Trash2, LogOut, Upload } from 'lucide-react';
import Select from '../components/ui/forms/Select';
import { useNavigate } from 'react-router-dom';
import packageJson from '../../package.json'; // Import package.json
import ThemeToggle from '../components/layout/ThemeToggle';
import {
  exportExpensesToCsv,
  exportCategoriesToCsv,
  importExpensesFromCsv,
  importCategoriesFromCsv,
} from '../utils/csvUtils';

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

const SettingsPage: React.FC = () => {
  const { clearAllExpenses, loadExpenses, loadCategories } = useExpenses();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const categoryFileInputRef = React.useRef<HTMLInputElement>(null);

  const { resetPinAndLogout, logout } = useAuth();
  const { showToast } = useToast();
  const { currency, setCurrency } = useSettings();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

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

  const handleExportExpenses = async () => {
    const result = await exportExpensesToCsv();
    showToast(result);
  };

  const handleExportCategories = async () => {
    const result = await exportCategoriesToCsv();
    showToast(result);
  };

  const handleImportExpenses = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const result = await importExpensesFromCsv(file);
      showToast(result);
      if (result.success) {
        // Only reload if import was successful
        await loadExpenses();
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Clear the input
      }
    }
  };

  const handleImportCategories = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const result = await importCategoriesFromCsv(file);
      showToast(result);
      if (result.success) {
        // Only reload if import was successful
        await loadCategories();
      }
      if (categoryFileInputRef.current) {
        categoryFileInputRef.current.value = ''; // Clear the input
      }
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
      await clearAllExpenses();

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

        <div className='space-y-6'>
          <div>
            <button
              onClick={() => navigate('/settings/category')}
              className='inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-black-900 hover:bg-gray-50 dark:hover:bg-black-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
            >
              Manage Categories
            </button>
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
              Add, edit, or delete expense categories.
            </p>
          </div>

          <div>
            <h4 className='text-md font-semibold text-gray-800 dark:text-gray-200 mb-2'>
              Export Data
            </h4>
            <div className='flex gap-2'>
              <button
                onClick={handleExportExpenses}
                className='inline-flex w-full items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
              >
                <Download className='h-4 w-4 mr-2' />
                Export Expenses (CSV)
              </button>
              <button
                onClick={handleExportCategories}
                className='inline-flex w-full items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
              >
                <Download className='h-4 w-4 mr-2' />
                Export Categories (CSV)
              </button>
            </div>
            <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
              Download your expense and category data as CSV files.
            </p>
          </div>

          <div>
            <h4 className='text-md font-semibold text-gray-800 dark:text-gray-200 mb-2'>
              Import Data
            </h4>
            <div className='flex gap-2'>
              <label
                htmlFor='import-expenses-csv'
                className='inline-flex w-full items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer'
              >
                <Upload className='h-4 w-4 mr-2' />
                Import Expenses (CSV)
              </label>
              <input
                id='import-expenses-csv'
                type='file'
                accept='.csv'
                onChange={handleImportExpenses}
                ref={fileInputRef}
                className='hidden'
              />
              <label
                htmlFor='import-categories-csv'
                className='inline-flex w-full items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer'
              >
                <Upload className='h-4 w-4 mr-2' />
                Import Categories (CSV)
              </label>
              <input
                id='import-categories-csv'
                type='file'
                accept='.csv'
                onChange={handleImportCategories}
                ref={categoryFileInputRef}
                className='hidden'
              />
            </div>
            <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
              Upload CSV files to import expense or category data. Existing
              entries with matching IDs will be updated.
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
          Theme Settings
        </h3>
        <div className='flex items-center justify-between'>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Enable dark mode
          </p>
          <ThemeToggle />
        </div>
      </li>
      <li className='py-4'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
          Account Actions
        </h3>
        <div className='space-y-4'>
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
          <div>
            <button
              onClick={handleLogout}
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
            >
              <LogOut className='h-4 w-4 mr-2' />
              Logout
            </button>
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
              Log out from your account.
            </p>
          </div>
        </div>
      </li>
      <li className='py-4 text-center text-gray-500 dark:text-gray-400 text-sm'>
        App Version: {packageJson.version}
      </li>
    </ul>
  );
};

export default SettingsPage;
