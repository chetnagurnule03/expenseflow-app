export type TransactionType = 'Income' | 'Expense';

export interface Transaction {
  id?: number;
  type: TransactionType;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  description?: string;
  createdAt: number;
}

export interface Budget {
  id?: number;
  month: string; // YYYY-MM
  amount: number;
  createdAt: number;
}

export interface MetricSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  savingsRate: number | null;
  savingsRateStr: string;
  transactionCount: number;
  incomeCount: number;
  expenseCount: number;
}

export interface BudgetStatus {
  hasBudget: boolean;
  budget: number | null;
  spent: number;
  remaining: number | null;
  percentage: number;
  isExceeded: boolean;
}

export type PeriodPreset = 'All Time' | 'This Month' | 'Last 30 Days' | 'This Year' | 'Custom';

export interface FilterState {
  period: PeriodPreset;
  startDate?: string;
  endDate?: string;
  type: 'All' | 'Income' | 'Expense';
  categories: string[];
  searchQuery: string;
}

export const EXPENSE_CATEGORIES = [
  'Food',
  'Travel',
  'Shopping',
  'Bills',
  'Education',
  'Health',
  'Other'
] as const;

export const INCOME_CATEGORIES = [
  'Salary/Allowance',
  'Bonus',
  'Freelance',
  'Investments',
  'Other Income'
] as const;
