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
    <div className='container mx-auto p-4 sm:p-6 lg:p-8'>
      <div className='space-y-8'>
        {!isPWA && (
          <section className='bg-white dark:bg-black-900 shadow rounded-lg p-6'>
            <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
              Install App
            </h2>
            <p className='text-gray-600 dark:text-gray-300 mb-4'>
              Install this application to your home screen for a native app-like
              experience.
            </p>
            <button
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
              onClick={() => navigate('/settings/installation')}
            >
              How to Install PWA
            </button>
          </section>
        )}

        <section className='bg-white dark:bg-black-900 shadow rounded-lg p-6'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
            Data Management
          </h2>
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                  Manage Categories
                </h3>
                <p className='mt-1 text-sm text-gray-600 dark:text-gray-300'>
                  Add, edit, or delete your expense categories.
                </p>
              </div>
              <button
                onClick={() => navigate('/settings/category')}
                className='inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-black-900 hover:bg-gray-50 dark:hover:bg-black-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
              >
                Manage
              </button>
            </div>

            <div className='border-t border-gray-200 dark:border-gray-700 pt-6'>
              <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-3'>
                Export Data
              </h3>
              <div className='flex flex-col sm:flex-row gap-3'>
                <button
                  onClick={handleExportExpenses}
                  className='inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full sm:w-auto'
                >
                  <Download className='h-4 w-4 mr-2' />
                  Export Expenses (CSV)
                </button>
                <button
                  onClick={handleExportCategories}
                  className='inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full sm:w-auto'
                >
                  <Download className='h-4 w-4 mr-2' />
                  Export Categories (CSV)
                </button>
              </div>
              <p className='mt-2 text-sm text-gray-600 dark:text-gray-300'>
                Download your expense and category data as CSV files.
              </p>
            </div>

            <div className='border-t border-gray-200 dark:border-gray-700 pt-6'>
              <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-3'>
                Import Data
              </h3>
              <div className='flex flex-col sm:flex-row gap-3'>
                <label
                  htmlFor='import-expenses-csv'
                  className='inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer w-full sm:w-auto'
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
                  className='inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer w-full sm:w-auto'
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
              <p className='mt-2 text-sm text-gray-600 dark:text-gray-300'>
                Upload CSV files to import expense or category data. Existing
                entries with matching IDs will be updated.
              </p>
            </div>
          </div>
        </section>

        <section className='bg-white dark:bg-black-900 shadow rounded-lg p-6'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
            Preferences
          </h2>
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                  Currency
                </h3>
                <p className='mt-1 text-sm text-gray-600 dark:text-gray-300'>
                  Choose the currency for displaying expenses.
                </p>
              </div>
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
            </div>

            <div className='flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-6'>
              <div>
                <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                  Dark Mode
                </h3>
                <p className='mt-1 text-sm text-gray-600 dark:text-gray-300'>
                  Toggle between light and dark themes.
                </p>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </section>

        <section className='bg-white dark:bg-black-900 shadow rounded-lg p-6'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
            Account Actions
          </h2>
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                  Reset PIN
                </h3>
                <p className='mt-1 text-sm text-gray-600 dark:text-gray-300'>
                  Reset your security PIN and create a new one.
                </p>
              </div>
              <button
                onClick={handleResetPin}
                className='inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-black-900 hover:bg-gray-50 dark:hover:bg-black-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
              >
                Reset PIN
              </button>
            </div>

            <div className='flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-6'>
              <div>
                <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                  Clear All Data
                </h3>
                <p className='mt-1 text-sm text-gray-600 dark:text-gray-300'>
                  Permanently delete all your expense and category data. This
                  action cannot be undone.
                </p>
              </div>
              <button
                onClick={handleClearData}
                className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
              >
                <Trash2 className='h-4 w-4 mr-2' />
                Clear
              </button>
            </div>

            <div className='flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-6'>
              <div>
                <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                  Logout
                </h3>
                <p className='mt-1 text-sm text-gray-600 dark:text-gray-300'>
                  Log out from your account.
                </p>
              </div>
              <button
                onClick={handleLogout}
                className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
              >
                <LogOut className='h-4 w-4 mr-2' />
                Logout
              </button>
            </div>
          </div>
        </section>

        <div className='text-center text-gray-500 dark:text-gray-400 text-sm mt-8'>
          App Version: {packageJson.version}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
