import Dexie, { Table } from 'dexie';
import { Expense, Category } from '../types';

export class VibeExpenseDB extends Dexie {
  expenses!: Table<Expense, string>; // 'id' is the primary key
  categories!: Table<Category, string>; // 'id' is the primary key

  constructor() {
    super('vibe-expense-db');
    this.version(1).stores({
      expenses: 'id, date, category', // Primary key 'id', indexed 'date' and 'category'
      categories: 'id, name', // Primary key 'id', indexed 'name'
    });

    // Migration from localStorage to IndexedDB
    this.on('populate', async () => {
      console.log('Populating database for the first time...');
      const savedExpenses = localStorage.getItem('expenses');
      const savedCategories = localStorage.getItem('categories');

      if (savedExpenses) {
        const expenses: Expense[] = JSON.parse(savedExpenses);
        if (expenses.length > 0) {
          await this.expenses.bulkAdd(expenses);
          console.log(`Migrated ${expenses.length} expenses from localStorage.`);
        }
      }

      if (savedCategories) {
        const categories: Category[] = JSON.parse(savedCategories);
        if (categories.length > 0) {
          await this.categories.bulkAdd(categories);
          console.log(`Migrated ${categories.length} categories from localStorage.`);
        }
      }

      // Optionally, clear localStorage after successful migration
      if (savedExpenses || savedCategories) {
        localStorage.removeItem('expenses');
        localStorage.removeItem('categories');
        console.log('Cleared localStorage data after migration.');
      }
    });
  }
}

export const db = new VibeExpenseDB();

// Helper functions for expenses
export const addExpenseToDB = async (expense: Expense) => {
  await db.expenses.add(expense);
};

export const getExpensesFromDB = async (): Promise<Expense[]> => {
  return await db.expenses.toArray();
};

export const updateExpenseInDB = async (id: string, updates: Partial<Expense>) => {
  await db.expenses.update(id, updates);
};

export const deleteExpenseFromDB = async (id: string) => {
  await db.expenses.delete(id);
};

// Helper functions for categories
export const addCategoryToDB = async (category: Category) => {
  await db.categories.add(category);
};

export const getCategoriesFromDB = async (): Promise<Category[]> => {
  return await db.categories.toArray();
};

export const updateCategoryInDB = async (id: string, updates: Partial<Category>) => {
  await db.categories.update(id, updates);
};

export const deleteCategoryFromDB = async (id: string) => {
  await db.categories.delete(id);
};