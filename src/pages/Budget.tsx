import React, { useState, useMemo } from 'react';
import { Target, CheckCircle2, AlertTriangle, Frown, Smile } from 'lucide-react';
import { Transaction, Budget } from '../types';
import { calculateBudgetStatus, formatINR } from '../calculations';
import { db } from '../db';

interface Props {
  transactions: Transaction[];
  budgets: Budget[];
}

export const BudgetPage: React.FC<Props> = ({ transactions, budgets }) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthIdx = now.getMonth();

  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonthIdx + 1);
  const [budgetInput, setBudgetInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const selectedMonthStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;

  // Current budget object for this selected month
  const activeBudget = useMemo(() => {
    return budgets.find((b) => b.month === selectedMonthStr);
  }, [budgets, selectedMonthStr]);

  // Update input when activeBudget changes
  React.useEffect(() => {
    if (activeBudget) {
      setBudgetInput(activeBudget.amount.toString());
    } else {
      setBudgetInput('');
    }
    setErrorMsg('');
    setSuccessMsg('');
  }, [activeBudget, selectedMonthStr]);

  const budgetStatus = useMemo(() => {
    return calculateBudgetStatus(
      transactions,
      selectedMonthStr,
      activeBudget ? activeBudget.amount : null
    );
  }, [transactions, selectedMonthStr, activeBudget]);

  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const amt = parseFloat(budgetInput);
    if (isNaN(amt) || amt <= 0) {
      setErrorMsg('Budget must be a positive number greater than 0.');
      return;
    }

    if (activeBudget && activeBudget.id) {
      await db.budgets.update(activeBudget.id, {
        amount: amt,
        createdAt: Date.now()
      });
    } else {
      await db.budgets.put({
        month: selectedMonthStr,
        amount: amt,
        createdAt: Date.now()
      });
    }

    setSuccessMsg(`Monthly budget for ${monthNames[selectedMonth - 1]} ${selectedYear} saved as ${formatINR(amt)}.`);
  };

  // Itemized expense entries for this month
  const monthExpenseRecords = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'Expense' && t.date.startsWith(selectedMonthStr))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions, selectedMonthStr]);

  const cappedPercent = Math.min(Math.max(budgetStatus.percentage, 0), 100);

  return (
    <div className="page-content">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Monthly budget planner</h1>
          <p className="page-subtitle">
            Configure monthly targets, track expenditure pacing, and receive early overspend warnings.
          </p>
        </div>

        {/* Month & Year Selectors */}
        <div className="budget-month-selector">
          <select
            className="filter-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            {monthNames.map((name, i) => (
              <option key={name} value={i + 1}>
                {name}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Set or Update Budget Form */}
      <div className="budget-form-card">
        <div className="card-header-small">
          <Target size={18} className="sunny-icon" />
          <span>Set or update allocation for {monthNames[selectedMonth - 1]} {selectedYear}</span>
        </div>

        <form onSubmit={handleSaveBudget} className="budget-input-form">
          <div className="budget-input-row">
            <div className="budget-input-col">
              <input
                type="number"
                step="any"
                min="0.01"
                placeholder="Enter monthly target (₹)"
                className="form-input tabular-num"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary">
              Save budget
            </button>
          </div>

          {errorMsg && <div className="form-error-inline">❌ {errorMsg}</div>}
          {successMsg && <div className="form-success-inline">✓ {successMsg}</div>}
        </form>
      </div>

      {/* Budget Status Standing Display */}
      {budgetStatus.hasBudget && budgetStatus.budget !== null ? (
        <div style={{ marginTop: 24 }}>
          {/* Over Budget Shake Alert vs Healthy Banner */}
          {budgetStatus.isExceeded ? (
            <div className="budget-container budget-exceeded-shake">
              <div className="budget-alert-header">
                <Frown size={26} className="coral-icon" />
                <span className="budget-alert-title coral-text">
                  Over budget by {formatINR(budgetStatus.spent - budgetStatus.budget, { signMode: 'expense' })}
                </span>
              </div>
              <div className="budget-alert-body tabular-num">
                You have spent <b>{formatINR(budgetStatus.spent, { signMode: 'expense' })}</b>, which exceeds your monthly limit of{' '}
                <b>{formatINR(budgetStatus.budget, { signMode: 'none' })}</b> ({budgetStatus.percentage.toFixed(1)}% utilized).
              </div>
              <div className="budget-progress-track">
                <div className="budget-progress-fill fill-coral" style={{ width: '100%' }} />
              </div>
            </div>
          ) : (
            <div className="budget-container budget-healthy">
              <div className="budget-alert-header">
                <Smile size={26} className="mint-icon" />
                <span className="budget-alert-title mint-text">
                  Healthy budget standing • {formatINR(budgetStatus.remaining ?? 0, { signMode: 'income' })} remaining
                </span>
              </div>
              <div className="budget-alert-body tabular-num">
                Spent <b>{formatINR(budgetStatus.spent, { signMode: 'expense' })}</b> out of{' '}
                <b>{formatINR(budgetStatus.budget, { signMode: 'none' })}</b> ({budgetStatus.percentage.toFixed(1)}% used) for{' '}
                {monthNames[selectedMonth - 1]}.
              </div>
              <div className="budget-progress-track">
                <div
                  className="budget-progress-fill fill-mint"
                  style={{ width: `${cappedPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Metric Cards Row */}
          <div className="summary-cards-grid" style={{ marginTop: 20 }}>
            <div className="metric-card">
              <div className="metric-title">Monthly allocation</div>
              <div className="metric-value val-income tabular-num">
                {formatINR(budgetStatus.budget, { signMode: 'none' })}
              </div>
              <div className="metric-subtitle">Target limit for {selectedMonthStr}</div>
            </div>

            <div className="metric-card">
              <div className="metric-title">Total spent</div>
              <div className="metric-value val-expense tabular-num">
                {formatINR(budgetStatus.spent, { signMode: 'expense' })}
              </div>
              <div className="metric-subtitle">{monthExpenseRecords.length} recorded expenses</div>
            </div>

            <div className="metric-card">
              <div className="metric-title">
                {budgetStatus.isExceeded ? 'Over budget by' : 'Remaining balance'}
              </div>
              <div
                className={`metric-value tabular-num ${budgetStatus.isExceeded ? 'val-expense' : 'val-balance-pos'}`}
              >
                {formatINR(Math.abs(budgetStatus.remaining ?? 0), {
                  signMode: budgetStatus.isExceeded ? 'expense' : 'income'
                })}
              </div>
              <div className="metric-subtitle">Budget − actual expenditures</div>
            </div>

            <div className="metric-card">
              <div className="metric-title">Pacing used</div>
              <div
                className={`metric-value tabular-num ${budgetStatus.isExceeded ? 'val-expense' : 'val-savings'}`}
              >
                {budgetStatus.percentage.toFixed(1)}%
              </div>
              <div className="metric-subtitle">
                {budgetStatus.isExceeded ? 'Allocation surpassed' : 'Under ceiling'}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-box" style={{ marginTop: 24 }}>
          No budget allocated for {monthNames[selectedMonth - 1]} {selectedYear}. Set an amount above to begin tracking.
        </div>
      )}

      {/* Itemized expenses in this month */}
      <div className="recent-section" style={{ marginTop: 32 }}>
        <h2 className="section-title">
          Expense records for {monthNames[selectedMonth - 1]} {selectedYear}
        </h2>
        {monthExpenseRecords.length === 0 ? (
          <div className="empty-box">No expense transactions recorded in this month yet.</div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {monthExpenseRecords.map((t) => (
                  <tr key={t.id}>
                    <td className="tabular-num">{t.date}</td>
                    <td>{t.category}</td>
                    <td className="text-muted">{t.description || '—'}</td>
                    <td style={{ textAlign: 'right' }} className="tabular-num val-expense font-medium">
                      {formatINR(t.amount, { signMode: 'expense' })}
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
