import React, { useState, useMemo } from 'react';
import { Transaction, Budget, FilterState, PeriodPreset } from '../types';
import {
  calculateMetrics,
  calculateBudgetStatus,
  filterTransactions,
  getPresetDates,
  formatINR
} from '../calculations';
import { SummaryCards } from '../components/SummaryCards';
import { BudgetCard } from '../components/BudgetCard';
import { IncomeExpenseLineChart, CategoryDonutChart } from '../components/Charts';

interface Props {
  transactions: Transaction[];
  budgets: Budget[];
  theme: 'dark' | 'light';
  onNavigateToTab: (tab: string) => void;
}

export const Overview: React.FC<Props> = ({ transactions, budgets, theme, onNavigateToTab }) => {
  const [period, setPeriod] = useState<PeriodPreset>('All Time');
  const [customStart, setCustomStart] = useState<string>('');
  const [customEnd, setCustomEnd] = useState<string>('');

  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // Filter configuration
  const filterConfig = useMemo<FilterState>(() => {
    let startDate: string | undefined;
    let endDate: string | undefined;

    if (period === 'Custom') {
      startDate = customStart || undefined;
      endDate = customEnd || undefined;
    } else {
      const dates = getPresetDates(period);
      startDate = dates.startDate;
      endDate = dates.endDate;
    }

    return {
      period,
      startDate,
      endDate,
      type: 'All',
      categories: [],
      searchQuery: ''
    };
  }, [period, customStart, customEnd]);

  // ONE shared filtered list for cards, charts, and recent records
  const filteredTransactions = useMemo(() => {
    return filterTransactions(transactions, filterConfig);
  }, [transactions, filterConfig]);

  const metrics = useMemo(() => {
    return calculateMetrics(filteredTransactions);
  }, [filteredTransactions]);

  // Current month budget status
  const currentBudget = useMemo(() => {
    const b = budgets.find((item) => item.month === currentMonthStr);
    return b ? b.amount : null;
  }, [budgets, currentMonthStr]);

  const budgetStatus = useMemo(() => {
    return calculateBudgetStatus(transactions, currentMonthStr, currentBudget);
  }, [transactions, currentMonthStr, currentBudget]);

  const recentTransactions = useMemo(() => {
    return [...filteredTransactions]
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt)
      .slice(0, 6);
  }, [filteredTransactions]);

  return (
    <div className="page-content">
      {/* Header & Filter Row */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Financial overview</h1>
          <p className="page-subtitle">
            Cash inflows, expenditures, and monthly budget performance.
          </p>
        </div>

        <div className="period-filter-group">
          <select
            className="period-select"
            value={period}
            onChange={(e) => setPeriod(e.target.value as PeriodPreset)}
          >
            <option value="All Time">All Time</option>
            <option value="This Month">This Month</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="This Year">This Year</option>
            <option value="Custom">Custom Range</option>
          </select>

          {period === 'Custom' && (
            <div className="custom-date-inputs">
              <input
                type="date"
                className="date-input"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
              />
              <span className="date-sep">to</span>
              <input
                type="date"
                className="date-input"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      {/* 4 Summary Cards */}
      <SummaryCards metrics={metrics} />

      {/* Budget Progress Card */}
      <div style={{ marginTop: 24 }}>
        <BudgetCard status={budgetStatus} monthStr={currentMonthStr} />
      </div>

      {/* Charts Row */}
      <div className="charts-grid-two">
        <IncomeExpenseLineChart
          transactions={filteredTransactions}
          theme={theme}
          dateRange={{ startDate: filterConfig.startDate, endDate: filterConfig.endDate }}
        />
        <CategoryDonutChart transactions={filteredTransactions} theme={theme} />
      </div>

      {/* Recent Transactions List */}
      <div className="recent-section">
        <div className="section-header-row">
          <h2 className="section-title">Recent transactions</h2>
          <button
            className="btn-link"
            onClick={() => onNavigateToTab('transactions')}
          >
            View all
          </button>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="empty-box">No transactions recorded for this period.</div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="tabular-num">{tx.date}</td>
                    <td>
                      <span className={`table-badge ${tx.type === 'Income' ? 'badge-mint' : 'badge-coral'}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td>{tx.category}</td>
                    <td className="text-muted">{tx.description || '—'}</td>
                    <td
                      style={{ textAlign: 'right' }}
                      className={`tabular-num font-medium ${tx.type === 'Income' ? 'val-income' : 'val-expense'}`}
                    >
                      {formatINR(tx.amount, { signMode: tx.type === 'Income' ? 'income' : 'expense' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
