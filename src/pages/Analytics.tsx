import React, { useState, useMemo } from 'react';
import { Transaction, FilterState, PeriodPreset } from '../types';
import { filterTransactions, getPresetDates, calculateMetrics, formatINR } from '../calculations';
import { IncomeExpenseLineChart, CategoryDonutChart, CategoryRankingBarChart } from '../components/Charts';

interface Props {
  transactions: Transaction[];
  theme: 'dark' | 'light';
}

export const Analytics: React.FC<Props> = ({ transactions, theme }) => {
  const [period, setPeriod] = useState<PeriodPreset>('All Time');
  const [customStart, setCustomStart] = useState<string>('');
  const [customEnd, setCustomEnd] = useState<string>('');

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

  // Shared filtered list
  const filteredTransactions = useMemo(() => {
    return filterTransactions(transactions, filterConfig);
  }, [transactions, filterConfig]);

  const metrics = useMemo(() => {
    return calculateMetrics(filteredTransactions);
  }, [filteredTransactions]);

  // Category breakdown table data
  const categoryTableData = useMemo(() => {
    const expenseOnly = filteredTransactions.filter((t) => t.type === 'Expense');
    const totalExp = expenseOnly.reduce((sum, t) => sum + t.amount, 0);

    const catMap: Record<string, { total: number; count: number }> = {};
    expenseOnly.forEach((t) => {
      if (!catMap[t.category]) {
        catMap[t.category] = { total: 0, count: 0 };
      }
      catMap[t.category].total += t.amount;
      catMap[t.category].count += 1;
    });

    return Object.entries(catMap)
      .map(([category, info]) => ({
        category,
        total: info.total,
        count: info.count,
        percent: totalExp > 0 ? (info.total / totalExp) * 100 : 0
      }))
      .sort((a, b) => b.total - a.total);
  }, [filteredTransactions]);

  // 5. Insight chips above the Analytics charts
  const insightChips = useMemo(() => {
    const chips: Array<{ key: string; text: string; icon: string }> = [];

    // Chip 1: Top category: Food · 44% of spending
    const expenseOnly = filteredTransactions.filter((t) => t.type === 'Expense');
    const totalExp = expenseOnly.reduce((sum, t) => sum + t.amount, 0);

    if (totalExp > 0 && expenseOnly.length > 0) {
      const catMap: Record<string, number> = {};
      expenseOnly.forEach((t) => {
        catMap[t.category] = (catMap[t.category] || 0) + t.amount;
      });
      const sorted = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
      if (sorted.length > 0 && sorted[0][1] > 0) {
        const [topCat, topAmt] = sorted[0];
        const pct = Math.round((topAmt / totalExp) * 100);
        chips.push({
          key: 'top-cat',
          text: `Top category: ${topCat} · ${pct}% of spending`,
          icon: 'category'
        });
      }
    }

    // Chip 2: Biggest spending day: 12 Oct · ₹1,200
    if (expenseOnly.length > 0) {
      const dayMap: Record<string, number> = {};
      expenseOnly.forEach((t) => {
        dayMap[t.date] = (dayMap[t.date] || 0) + t.amount;
      });
      const sortedDays = Object.entries(dayMap).sort((a, b) => b[1] - a[1]);
      if (sortedDays.length > 0 && sortedDays[0][1] > 0) {
        const [dayStr, dayAmt] = sortedDays[0];
        const dObj = new Date(`${dayStr}T00:00:00`);
        const formattedDay = dObj.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short'
        });
        chips.push({
          key: 'biggest-day',
          text: `Biggest spending day: ${formattedDay} · ${formatINR(dayAmt, { includeSymbol: true, signMode: 'none' })}`,
          icon: 'calendar'
        });
      }
    }

    // Chip 3: You saved 77.5% of your income
    if (metrics.totalIncome > 0 && metrics.savingsRate !== null && metrics.savingsRate > 0) {
      chips.push({
        key: 'savings',
        text: `You saved ${metrics.savingsRate.toFixed(1)}% of your income`,
        icon: 'savings'
      });
    }

    return chips;
  }, [filteredTransactions, metrics]);

  return (
    <div className="page-content">
      {/* Header & Date Range */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Financial analytics</h1>
          <p className="page-subtitle">
            Deep-dive visual patterns, cashflow timelines, and category distributions.
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

      {/* Mini Metrics Bar */}
      <div className="analytics-metrics-strip">
        <div className="strip-item">
          <div className="strip-label">Period income</div>
          <div className="strip-value val-income tabular-num">
            {formatINR(metrics.totalIncome, { signMode: 'income' })}
          </div>
        </div>
        <div className="strip-item">
          <div className="strip-label">Period expenses</div>
          <div className="strip-value val-expense tabular-num">
            {formatINR(metrics.totalExpense, { signMode: 'expense' })}
          </div>
        </div>
        <div className="strip-item">
          <div className="strip-label">Period net balance</div>
          <div
            className={`strip-value tabular-num ${metrics.balance >= 0 ? 'val-balance-pos' : 'val-balance-neg'}`}
          >
            {formatINR(metrics.balance, { signMode: 'balance' })}
          </div>
        </div>
        <div className="strip-item">
          <div className="strip-label">Savings rate</div>
          <div className="strip-value val-savings tabular-num">{metrics.savingsRateStr}</div>
        </div>
      </div>

      {/* Insight Chips */}
      {insightChips.length > 0 && (
        <div className="analytics-chips-row">
          {insightChips.map((chip) => (
            <div key={chip.key} className="insight-chip">
              <span className="insight-chip-dot" />
              <span>{chip.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* Two Main Visuals: Spline Line & Category Donut */}
      <div className="charts-grid-two">
        <IncomeExpenseLineChart
          transactions={filteredTransactions}
          theme={theme}
          dateRange={{ startDate: filterConfig.startDate, endDate: filterConfig.endDate }}
        />
        <CategoryDonutChart transactions={filteredTransactions} theme={theme} />
      </div>

      {/* Category Ranking Horizontal Bar */}
      <div style={{ marginTop: 24 }}>
        <CategoryRankingBarChart transactions={filteredTransactions} theme={theme} />
      </div>

      {/* Category Breakdown Table */}
      {categoryTableData.length > 0 && (
        <div className="recent-section" style={{ marginTop: 28 }}>
          <h2 className="section-title">Category breakdown details</h2>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th style={{ textAlign: 'right' }}>Total spent</th>
                  <th style={{ textAlign: 'right' }}>Share of expenses</th>
                  <th style={{ textAlign: 'right' }}>Transactions</th>
                </tr>
              </thead>
              <tbody>
                {categoryTableData.map((row) => (
                  <tr key={row.category}>
                    <td className="font-medium">{row.category}</td>
                    <td style={{ textAlign: 'right' }} className="tabular-num val-expense font-medium">
                      {formatINR(row.total, { signMode: 'expense' })}
                    </td>
                    <td style={{ textAlign: 'right' }} className="tabular-num text-muted">
                      {row.percent.toFixed(1)}%
                    </td>
                    <td style={{ textAlign: 'right' }} className="tabular-num">
                      {row.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
