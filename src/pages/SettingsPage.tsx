import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import CategoryManager from '../components/expenses/CategoryManager';
import { useExpenses } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useSettings } from '../context/SettingsContext';
import { Download, Trash2 } from 'lucide-react';
import Select from '../components/ui/forms/Select';

const SettingsPage: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, expenses } =
    useExpenses();

  const { resetPinAndLogout } = useAuth();
  const { showToast } = useToast();
  const { currency, setCurrency } = useSettings();

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
      localStorage.removeItem('expenses');
      window.location.reload();

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
      <div className='space-y-8 max-w-3xl mx-auto'>
        <div className='bg-white dark:bg-black-900 rounded-lg shadow p-6 borderborder-gray-200 dark:border-gray-700'>
          <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>
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
        </div>

        <div className='bg-white dark:bg-black-900 rounded-lg shadow p-6 borderborder-gray-200 dark:border-gray-700'>
          <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>
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
        </div>

        <CategoryManager
          categories={categories}
          onAddCategory={addCategory}
          onUpdateCategory={updateCategory}
          onDeleteCategory={deleteCategory}
        />
      </div>
    </PageContainer>
  );
};

export default SettingsPage;
