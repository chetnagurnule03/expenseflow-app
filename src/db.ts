import Dexie, { Table } from 'dexie';
import { Transaction, Budget } from './types';

export class ExpenseFlowDB extends Dexie {
  transactions!: Table<Transaction, number>;
  budgets!: Table<Budget, number>;

  constructor() {
    super('expenseflow_db');
    this.version(1).stores({
      transactions: '++id, type, amount, category, date, createdAt',
      budgets: '++id, &month, amount, createdAt'
    });
  }
}

export const db = new ExpenseFlowDB();

/**
 * Loads standard demonstration dataset into local database:
 * - Income: ₹20,000 (Salary/Allowance)
 * - Expenses: Food ₹2,000, Travel ₹1,500, Shopping ₹1,000
 * - Total expenses: ₹4,500 | Net Balance: ₹15,500 | Savings Rate: 77.5%
 * - Demo Budget: ₹10,000 for current month
 */
export async function loadDemoData(): Promise<void> {
  await db.transaction('rw', db.transactions, db.budgets, async () => {
    await db.transactions.clear();
    await db.budgets.clear();

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const currentMonthStr = `${year}-${month}`;
    const todayDay = now.getDate();

    const clampDate = (targetDay: number) => {
      const chosenDay = Math.min(targetDay, Math.max(todayDay, 1));
      return `${year}-${month}-${String(chosenDay).padStart(2, '0')}`;
    };

    const dateSalary = `${year}-${month}-01`;
    const dateFood = clampDate(Math.min(5, todayDay));
    const dateTravel = clampDate(Math.min(10, todayDay));
    const dateShopping = clampDate(Math.min(12, todayDay));

    // 1. Income
    await db.transactions.add({
      type: 'Income',
      amount: 20000,
      category: 'Salary/Allowance',
      date: dateSalary,
      description: 'Monthly Salary Credit',
      createdAt: Date.now() - 3600000 * 24 * 10
    });

    // 2. Expenses
    await db.transactions.add({
      type: 'Expense',
      amount: 2000,
      category: 'Food',
      date: dateFood,
      description: 'Grocery and household supplies',
      createdAt: Date.now() - 3600000 * 24 * 6
    });

    await db.transactions.add({
      type: 'Expense',
      amount: 1500,
      category: 'Travel',
      date: dateTravel,
      description: 'Metro card recharge & fuel',
      createdAt: Date.now() - 3600000 * 24 * 3
    });

    await db.transactions.add({
      type: 'Expense',
      amount: 1000,
      category: 'Shopping',
      date: dateShopping,
      description: 'Clothing & daily essentials',
      createdAt: Date.now() - 3600000 * 24 * 1
    });

    // 3. Demo Budget
    await db.budgets.put({
      month: currentMonthStr,
      amount: 10000,
      createdAt: Date.now()
    });
  });
}

/**
 * Ensures initial data exists on first app load.
 */
export async function initDatabase(): Promise<void> {
  const count = await db.transactions.count();
  if (count === 0) {
    await loadDemoData();
  }
}
