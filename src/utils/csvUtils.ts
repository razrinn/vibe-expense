import { getExpensesFromDB, getCategoriesFromDB, db } from './indexedDB';
import { Expense, Category, ToastOptions } from '../types';
import Papa, { ParseResult } from 'papaparse';

// Helper function to escape CSV values
const escapeCsvValue = (value: unknown): string => {
  if (value === null || value === undefined) {
    return '';
  }
  const stringValue = String(value);
  // If the value contains a comma, double quote, or newline, enclose it in double quotes
  // and escape any double quotes within the value by doubling them.
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

// Type for the return value of export/import functions
interface CsvOperationResult {
  success: boolean;
  message: string;
  type: ToastOptions['type']; // Ensure type is included for toast
}

export const exportExpensesToCsv = async (): Promise<CsvOperationResult> => {
  try {
    const expenses = await getExpensesFromDB();

    const headers = ['id', 'description', 'amount', 'date', 'category', 'notes'];

    const csvRows = [
      headers.join(','), // Add headers as the first row
      ...expenses.map(expense => {
        return [
          escapeCsvValue(expense.id),
          escapeCsvValue(expense.description),
          escapeCsvValue(expense.amount),
          escapeCsvValue(expense.date),
          escapeCsvValue(expense.category),
          escapeCsvValue(expense.notes),
        ].join(',');
      })
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.setAttribute('href', url);
    link.setAttribute('download', `vibe_expenses_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    return { success: true, message: 'Expenses exported successfully.', type: 'success' };
  } catch (error) {
    console.error('Error exporting expenses to CSV:', error);
    return { success: false, message: 'Failed to export expenses.', type: 'error' };
  }
};

export const exportCategoriesToCsv = async (): Promise<CsvOperationResult> => {
  try {
    const categories = await getCategoriesFromDB();

    const headers = ['id', 'name', 'color', 'budget'];

    const csvRows = [
      headers.join(','), // Add headers as the first row
      ...categories.map(category => {
        return [
          escapeCsvValue(category.id),
          escapeCsvValue(category.name),
          escapeCsvValue(category.color),
          escapeCsvValue(category.budget),
        ].join(',');
      })
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.setAttribute('href', url);
    link.setAttribute('download', `vibe_categories_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    return { success: true, message: 'Categories exported successfully.', type: 'success' };
  } catch (error) {
    console.error('Error exporting categories to CSV:', error);
    return { success: false, message: 'Failed to export categories.', type: 'error' };
  }
};

export const importExpensesFromCsv = async (file: File): Promise<CsvOperationResult> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const csvString = e.target?.result as string;
      Papa.parse<Expense>(csvString, {
        header: true,
        skipEmptyLines: true,
        complete: async (results: ParseResult<Expense>) => {
          const importedExpenses: Expense[] = [];
          const errors: string[] = [];

          for (const row of results.data) {
            // Basic validation and type conversion
            const expense: Expense = {
              id: row.id,
              description: row.description,
              amount: parseFloat(String(row.amount)), // Ensure amount is parsed as number
              date: row.date,
              category: row.category,
              notes: row.notes || undefined,
            };

            // More robust validation would go here (e.g., check if amount is a valid number, date is valid)
            if (
              !expense.id ||
              isNaN(Number(expense.amount)) ||
              expense.description === undefined ||
              !expense.date ||
              !expense.category
            ) {
              errors.push(`Invalid row: ${JSON.stringify(row)}`);
              continue;
            }
            importedExpenses.push(expense);
          }

          if (errors.length > 0) {
            console.error('Import errors:', errors);
            resolve({ success: false, message: `Import completed with ${errors.length} errors.`, type: 'warning' });
            return;
          }

          try {
            // Use bulkPut to overwrite existing records and add new ones
            await db.expenses.bulkPut(importedExpenses);
            resolve({ success: true, message: `Successfully imported/updated ${importedExpenses.length} expenses.`, type: 'success' });
          } catch (error) {
            console.error('Error importing expenses to DB:', error);
            resolve({ success: false, message: 'Failed to import expenses to database.', type: 'error' });
          }
        },
        error: (err: Error) => {
          console.error('CSV parsing error:', err);
          resolve({ success: false, message: `CSV parsing error: ${err.message}`, type: 'error' });
        },
      });
    };
    reader.onerror = () => {
      resolve({ success: false, message: 'Failed to read file.', type: 'error' });
    };
    reader.readAsText(file);
  });
};

export const importCategoriesFromCsv = async (file: File): Promise<CsvOperationResult> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const csvString = e.target?.result as string;
      Papa.parse<Category>(csvString, {
        header: true,
        skipEmptyLines: true,
        complete: async (results: ParseResult<Category>) => {
          const importedCategories: Category[] = [];
          const errors: string[] = [];

          for (const row of results.data) {
            const category: Category = {
              id: row.id,
              name: row.name,
              color: row.color,
              budget: row.budget ? parseFloat(String(row.budget)) : 0, // Parse budget as number, default to 0
            };

            if (!category.id || !category.name || !category.color) {
              errors.push(`Invalid row: ${JSON.stringify(row)}`);
              continue;
            }
            importedCategories.push(category);
          }

          if (errors.length > 0) {
            console.error('Import errors:', errors);
            resolve({ success: false, message: `Import completed with ${errors.length} errors.`, type: 'warning' });
            return;
          }

          try {
            await db.categories.bulkPut(importedCategories);
            resolve({ success: true, message: `Successfully imported/updated ${importedCategories.length} categories.`, type: 'success' });
          } catch (error) {
            console.error('Error importing categories to DB:', error);
            resolve({ success: false, message: 'Failed to import categories to database.', type: 'error' });
          }
        },
        error: (err: Error) => {
          console.error('CSV parsing error:', err);
          resolve({ success: false, message: `CSV parsing error: ${err.message}`, type: 'error' });
        },
      });
    };
    reader.onerror = () => {
      resolve({ success: false, message: 'Failed to read file.', type: 'error' });
    };
    reader.readAsText(file);
  });
};