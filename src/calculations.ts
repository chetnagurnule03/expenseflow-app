import { Transaction, MetricSummary, BudgetStatus, FilterState } from './types';

/**
 * Formats a numeric value into the Indian numbering format (e.g., ₹20,000, ₹1,50,000).
 * Last 3 digits grouped, then in pairs of 2.
 * Supports explicit '+' and '−' signs so accessibility does not rely on color alone.
 */
export function formatINR(
  val: number | null | undefined,
  options?: {
    signMode?: 'income' | 'expense' | 'balance' | 'auto' | 'none';
    decimals?: boolean;
    includeSymbol?: boolean;
  }
): string {
  if (val === null || val === undefined || isNaN(val)) {
    return '₹0';
  }

  const includeSymbol = options?.includeSymbol !== false;
  const isNegative = val < 0;
  const absVal = Math.abs(val);

  // Formatting decimals if needed
  let decStr = '';
  if (options?.decimals || !Number.isInteger(absVal)) {
    decStr = '.' + absVal.toFixed(2).split('.')[1];
  }

  const intStr = Math.floor(absVal).toString();
  let formattedInt = intStr;

  if (intStr.length > 3) {
    const last3 = intStr.substring(intStr.length - 3);
    let remaining = intStr.substring(0, intStr.length - 3);
    const groups: string[] = [];

    while (remaining.length > 2) {
      groups.unshift(remaining.substring(remaining.length - 2));
      remaining = remaining.substring(0, remaining.length - 2);
    }
    if (remaining.length > 0) {
      groups.unshift(remaining);
    }
    formattedInt = groups.join(',') + ',' + last3;
  }

  const symbol = includeSymbol ? '₹' : '';
  const amountStr = `${symbol}${formattedInt}${decStr}`;

  const mode = options?.signMode ?? 'auto';

  if (mode === 'income') {
    return `+ ${amountStr}`;
  }
  if (mode === 'expense') {
    return `− ${amountStr}`;
  }
  if (mode === 'balance' || mode === 'auto') {
    if (val > 0) return `+ ${amountStr}`;
    if (val < 0) return `− ${amountStr}`;
    return amountStr;
  }

  return isNegative ? `− ${amountStr}` : amountStr;
}

/**
 * Compact Indian rupee formatting for charts and axis labels (e.g. ₹5k, ₹20k, ₹1.5L, ₹1Cr).
 */
export function formatCompactINR(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val) || val === 0) {
    return '₹0';
  }
  const abs = Math.abs(val);
  const sign = val < 0 ? '−' : '';
  if (abs >= 10000000) {
    const cr = abs / 10000000;
    return `${sign}₹${cr % 1 === 0 ? cr : cr.toFixed(1)}Cr`;
  }
  if (abs >= 100000) {
    const lk = abs / 100000;
    return `${sign}₹${lk % 1 === 0 ? lk : lk.toFixed(1)}L`;
  }
  if (abs >= 1000) {
    const k = abs / 1000;
    return `${sign}₹${k % 1 === 0 ? k : k.toFixed(1)}k`;
  }
  return `${sign}₹${abs}`;
}

/**
 * Computes key financial metrics for a given transactions list.
 * Guarantees no division by zero when income is 0 -> returns "N/A".
 */
export function calculateMetrics(transactions: Transaction[]): MetricSummary {
  if (!transactions || transactions.length === 0) {
    return {
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
      savingsRate: null,
      savingsRateStr: 'N/A',
      transactionCount: 0,
      incomeCount: 0,
      expenseCount: 0
    };
  }

  let totalIncome = 0;
  let totalExpense = 0;
  let incomeCount = 0;
  let expenseCount = 0;

  for (const t of transactions) {
    if (t.type === 'Income') {
      totalIncome += t.amount;
      incomeCount++;
    } else if (t.type === 'Expense') {
      totalExpense += t.amount;
      expenseCount++;
    }
  }

  const balance = totalIncome - totalExpense;

  let savingsRate: number | null = null;
  let savingsRateStr = 'N/A';

  if (totalIncome > 0) {
    savingsRate = (balance / totalIncome) * 100;
    savingsRateStr = `${savingsRate.toFixed(1)}%`;
  }

  return {
    totalIncome,
    totalExpense,
    balance,
    savingsRate,
    savingsRateStr,
    transactionCount: transactions.length,
    incomeCount,
    expenseCount
  };
}

/**
 * Computes monthly budget status and checks if spending exceeds threshold.
 */
export function calculateBudgetStatus(
  transactions: Transaction[],
  monthStr: string, // YYYY-MM
  budgetAmount?: number | null
): BudgetStatus {
  // Only expense transactions in the given month count
  const monthExpenses = transactions.filter(
    (t) => t.type === 'Expense' && t.date.startsWith(monthStr)
  );

  const spent = monthExpenses.reduce((sum, t) => sum + t.amount, 0);

  if (!budgetAmount || budgetAmount <= 0) {
    return {
      hasBudget: false,
      budget: null,
      spent,
      remaining: null,
      percentage: 0,
      isExceeded: false
    };
  }

  const remaining = budgetAmount - spent;
  const percentage = (spent / budgetAmount) * 100;
  const isExceeded = spent > budgetAmount;

  return {
    hasBudget: true,
    budget: budgetAmount,
    spent,
    remaining,
    percentage,
    isExceeded
  };
}

/**
 * Centralized pure filter ensuring ONE shared filtered list for cards, table, and charts.
 */
export function filterTransactions(
  transactions: Transaction[],
  filter: FilterState
): Transaction[] {
  if (!transactions) return [];

  return transactions.filter((t) => {
    // 1. Date Range
    if (filter.startDate && t.date < filter.startDate) return false;
    if (filter.endDate && t.date > filter.endDate) return false;

    // 2. Type Filter
    if (filter.type !== 'All' && t.type !== filter.type) return false;

    // 3. Category Filter
    if (filter.categories && filter.categories.length > 0) {
      if (!filter.categories.includes(t.category)) return false;
    }

    // 4. Search Filter
    if (filter.searchQuery && filter.searchQuery.trim()) {
      const q = filter.searchQuery.trim().toLowerCase();
      const descMatch = (t.description || '').toLowerCase().includes(q);
      const catMatch = t.category.toLowerCase().includes(q);
      if (!descMatch && !catMatch) return false;
    }

    return true;
  });
}

/**
 * Helper to get dates for presets (All Time, This Month, Last 30 Days, This Year)
 */
export function getPresetDates(preset: FilterState['period']): { startDate?: string; endDate?: string } {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  if (preset === 'All Time') {
    return {};
  }
  if (preset === 'This Month') {
    return {
      startDate: `${year}-${month}-01`,
      endDate: todayStr
    };
  }
  if (preset === 'Last 30 Days') {
    const past = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const pYear = past.getFullYear();
    const pMonth = String(past.getMonth() + 1).padStart(2, '0');
    const pDay = String(past.getDate()).padStart(2, '0');
    return {
      startDate: `${pYear}-${pMonth}-${pDay}`,
      endDate: todayStr
    };
  }
  if (preset === 'This Year') {
    return {
      startDate: `${year}-01-01`,
      endDate: todayStr
    };
  }

  return {};
}
