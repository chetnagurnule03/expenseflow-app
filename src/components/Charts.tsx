import React, { useState, useMemo, useEffect } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LabelList,
  Sector,
  CartesianGrid
} from 'recharts';
import { Transaction } from '../types';
import { formatINR, formatCompactINR } from '../calculations';

export interface ChartsProps {
  transactions: Transaction[];
  theme: 'dark' | 'light';
  dateRange?: { startDate?: string; endDate?: string };
}

// Design system palette: Mint, Coral, Sunny, plus harmonic tints and shades
export const CHART_PALETTE = [
  '#FF6B8A', // Coral (primary expense)
  '#5ED3A6', // Mint
  '#FFC857', // Sunny
  '#7EE2BE', // Mint light
  '#FF8EA6', // Coral light
  '#FFD982', // Sunny light
  '#CDB9A8', // Warm sand extra
  '#4EB28B', // Mint deep
  '#E55372', // Coral deep
  '#E0AA3E', // Sunny deep
  '#A89280', // Sand shade
  '#B5E8D5'  // Mint soft
];

/**
 * Hook to respect user's prefers-reduced-motion OS setting
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

interface CashflowPoint {
  key: string;
  shortLabel: string;
  fullDate: string;
  income: number;
  expense: number;
  net: number;
}

/**
 * Groups cashflow transactions by DAY (<=62 days), WEEK (63-180 days), or MONTH (>180 days).
 * Solves the single-dot problem by padding surrounding periods at zero when only one period exists.
 */
function processCashflowData(
  transactions: Transaction[],
  dateRange?: { startDate?: string; endDate?: string }
): { points: CashflowPoint[]; grouping: 'day' | 'week' | 'month' } {
  if (!transactions || transactions.length === 0) {
    return { points: [], grouping: 'day' };
  }

  // Calculate span from transactions or explicit range
  let minDate = transactions[0].date;
  let maxDate = transactions[0].date;
  for (const t of transactions) {
    if (t.date < minDate) minDate = t.date;
    if (t.date > maxDate) maxDate = t.date;
  }

  let rangeStart = dateRange?.startDate || minDate;
  let rangeEnd = dateRange?.endDate || maxDate;
  if (rangeStart > rangeEnd) {
    const temp = rangeStart;
    rangeStart = rangeEnd;
    rangeEnd = temp;
  }

  const startT = new Date(`${rangeStart}T00:00:00`).getTime();
  const endT = new Date(`${rangeEnd}T00:00:00`).getTime();
  const diffDays = Math.max(1, Math.round((endT - startT) / 86400000)) + 1;

  const grouping: 'day' | 'week' | 'month' =
    diffDays <= 62 ? 'day' : diffDays <= 180 ? 'week' : 'month';

  if (grouping === 'day') {
    const dayMap: Record<string, { income: number; expense: number }> = {};
    for (const t of transactions) {
      if (!dayMap[t.date]) dayMap[t.date] = { income: 0, expense: 0 };
      if (t.type === 'Income') dayMap[t.date].income += t.amount;
      else if (t.type === 'Expense') dayMap[t.date].expense += t.amount;
    }

    const uniqueDays = Object.keys(dayMap).sort();

    // If only one unique day exists, pad previous and next day at zero for a smooth peak
    if (uniqueDays.length === 1 && diffDays <= 1) {
      const dStr = uniqueDays[0];
      const curDate = new Date(`${dStr}T00:00:00`);
      const prevDate = new Date(curDate);
      prevDate.setDate(curDate.getDate() - 1);
      const nextDate = new Date(curDate);
      nextDate.setDate(curDate.getDate() + 1);

      const prevStr = prevDate.toISOString().split('T')[0];
      const nextStr = nextDate.toISOString().split('T')[0];

      return {
        grouping: 'day',
        points: [
          {
            key: prevStr,
            shortLabel: prevDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            fullDate: prevDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            income: 0,
            expense: 0,
            net: 0
          },
          {
            key: dStr,
            shortLabel: curDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            fullDate: curDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            income: dayMap[dStr].income,
            expense: dayMap[dStr].expense,
            net: dayMap[dStr].income - dayMap[dStr].expense
          },
          {
            key: nextStr,
            shortLabel: nextDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            fullDate: nextDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            income: 0,
            expense: 0,
            net: 0
          }
        ]
      };
    }

    // Build timeline from rangeStart to rangeEnd
    const points: CashflowPoint[] = [];
    const cur = new Date(`${rangeStart}T00:00:00`);
    const end = new Date(`${rangeEnd}T00:00:00`);

    while (cur <= end) {
      const dateStr = cur.toISOString().split('T')[0];
      const rec = dayMap[dateStr] || { income: 0, expense: 0 };
      points.push({
        key: dateStr,
        shortLabel: cur.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        fullDate: cur.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        income: rec.income,
        expense: rec.expense,
        net: rec.income - rec.expense
      });
      cur.setDate(cur.getDate() + 1);
    }

    return { grouping: 'day', points };
  }

  if (grouping === 'week') {
    // Helper to calculate ISO week number
    const getWeekKey = (dStr: string) => {
      const d = new Date(`${dStr}T00:00:00`);
      d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
      const week1 = new Date(d.getFullYear(), 0, 4);
      const weekNum =
        1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
      return { year: d.getFullYear(), week: weekNum, key: `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}` };
    };

    const weekMap: Record<
      string,
      { income: number; expense: number; minDate: string; maxDate: string; weekNum: number }
    > = {};

    for (const t of transactions) {
      const w = getWeekKey(t.date);
      if (!weekMap[w.key]) {
        weekMap[w.key] = { income: 0, expense: 0, minDate: t.date, maxDate: t.date, weekNum: w.week };
      }
      if (t.type === 'Income') weekMap[w.key].income += t.amount;
      else if (t.type === 'Expense') weekMap[w.key].expense += t.amount;
      if (t.date < weekMap[w.key].minDate) weekMap[w.key].minDate = t.date;
      if (t.date > weekMap[w.key].maxDate) weekMap[w.key].maxDate = t.date;
    }

    const sortedWeeks = Object.keys(weekMap).sort();

    if (sortedWeeks.length === 1) {
      const wKey = sortedWeeks[0];
      const curItem = weekMap[wKey];
      const prevWk = curItem.weekNum > 1 ? curItem.weekNum - 1 : 52;
      const nextWk = curItem.weekNum < 52 ? curItem.weekNum + 1 : 1;

      return {
        grouping: 'week',
        points: [
          {
            key: `prev-${prevWk}`,
            shortLabel: `Wk ${prevWk}`,
            fullDate: `Week ${prevWk}`,
            income: 0,
            expense: 0,
            net: 0
          },
          {
            key: wKey,
            shortLabel: `Wk ${curItem.weekNum}`,
            fullDate: `Week ${curItem.weekNum} · ${new Date(`${curItem.minDate}T00:00:00`).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short'
            })} – ${new Date(`${curItem.maxDate}T00:00:00`).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short'
            })}`,
            income: curItem.income,
            expense: curItem.expense,
            net: curItem.income - curItem.expense
          },
          {
            key: `next-${nextWk}`,
            shortLabel: `Wk ${nextWk}`,
            fullDate: `Week ${nextWk}`,
            income: 0,
            expense: 0,
            net: 0
          }
        ]
      };
    }

    const points: CashflowPoint[] = sortedWeeks.map((key) => {
      const item = weekMap[key];
      return {
        key,
        shortLabel: `Wk ${item.weekNum}`,
        fullDate: `Week ${item.weekNum} · ${new Date(`${item.minDate}T00:00:00`).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short'
        })} – ${new Date(`${item.maxDate}T00:00:00`).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short'
        })}`,
        income: item.income,
        expense: item.expense,
        net: item.income - item.expense
      };
    });

    return { grouping: 'week', points };
  }

  // grouping === 'month'
  const monthMap: Record<string, { income: number; expense: number }> = {};
  for (const t of transactions) {
    const monthKey = t.date.substring(0, 7); // YYYY-MM
    if (!monthMap[monthKey]) monthMap[monthKey] = { income: 0, expense: 0 };
    if (t.type === 'Income') monthMap[monthKey].income += t.amount;
    else if (t.type === 'Expense') monthMap[monthKey].expense += t.amount;
  }

  const sortedMonths = Object.keys(monthMap).sort();

  if (sortedMonths.length === 1) {
    const m = sortedMonths[0];
    const [yStr, mStr] = m.split('-');
    const year = parseInt(yStr, 10);
    const month = parseInt(mStr, 10);

    const prevDate = new Date(year, month - 2, 1);
    const curDate = new Date(year, month - 1, 1);
    const nextDate = new Date(year, month, 1);

    const prevKey = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;
    const nextKey = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}`;

    return {
      grouping: 'month',
      points: [
        {
          key: prevKey,
          shortLabel: prevDate.toLocaleDateString('en-IN', { month: 'short' }),
          fullDate: prevDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
          income: 0,
          expense: 0,
          net: 0
        },
        {
          key: m,
          shortLabel: curDate.toLocaleDateString('en-IN', { month: 'short' }),
          fullDate: curDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
          income: monthMap[m].income,
          expense: monthMap[m].expense,
          net: monthMap[m].income - monthMap[m].expense
        },
        {
          key: nextKey,
          shortLabel: nextDate.toLocaleDateString('en-IN', { month: 'short' }),
          fullDate: nextDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
          income: 0,
          expense: 0,
          net: 0
        }
      ]
    };
  }

  const points: CashflowPoint[] = sortedMonths.map((m) => {
    const [yStr, mStr] = m.split('-');
    const d = new Date(parseInt(yStr, 10), parseInt(mStr, 10) - 1, 1);
    return {
      key: m,
      shortLabel: d.toLocaleDateString('en-IN', { month: 'short' }),
      fullDate: d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
      income: monthMap[m].income,
      expense: monthMap[m].expense,
      net: monthMap[m].income - monthMap[m].expense
    };
  });

  return { grouping: 'month', points };
}

/**
 * 1. Monthly cashflow trend (ComposedChart with smooth gradient areas)
 */
export const IncomeExpenseLineChart: React.FC<ChartsProps> = ({ transactions, theme, dateRange }) => {
  const isDark = theme === 'dark';
  const textColor = isDark ? '#FFFFFF' : '#372C2E';
  const textMuted = isDark ? 'rgba(255, 255, 255, 0.70)' : 'rgba(55, 44, 46, 0.70)';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.10)' : 'rgba(55, 44, 46, 0.10)';
  const cardBg = isDark ? '#563727' : '#FFFFFF';
  const reducedMotion = usePrefersReducedMotion();

  const { points: chartData, grouping } = useMemo(() => {
    return processCashflowData(transactions, dateRange);
  }, [transactions, dateRange]);

  if (chartData.length === 0) {
    return (
      <div className="chart-card">
        <div className="chart-header-row">
          <div className="chart-title">Cashflow trend</div>
        </div>
        <div className="chart-empty-state-modern">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: 0.5, marginBottom: 8 }}
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
          </svg>
          <div>No transactions in this period</div>
        </div>
      </div>
    );
  }

  const groupingBadge =
    grouping === 'day' ? 'Daily view' : grouping === 'week' ? 'Weekly view' : 'Monthly view';

  return (
    <div className="chart-card">
      <div className="chart-header-row">
        <div>
          <div className="chart-title">Cashflow trend</div>
          <div className="chart-subtitle">{groupingBadge}</div>
        </div>

        {/* Legend above the chart with coloured dots */}
        <div className="custom-chart-legend">
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#5ED3A6' }} />
            <span>Income</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#FF6B8A' }} />
            <span>Expenses</span>
          </div>
        </div>
      </div>

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <ComposedChart data={chartData} margin={{ top: 20, right: 16, left: -4, bottom: 5 }}>
            <defs>
              {/* Mint vertical gradient (35% to 0%) */}
              <linearGradient id="mintAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5ED3A6" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#5ED3A6" stopOpacity={0.0} />
              </linearGradient>

              {/* Coral vertical gradient (35% to 0%) */}
              <linearGradient id="coralAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF6B8A" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#FF6B8A" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            {/* Horizontal dashed gridlines at 10% opacity, no vertical gridlines */}
            <CartesianGrid
              horizontal={true}
              vertical={false}
              stroke={gridColor}
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="shortLabel"
              axisLine={false}
              tickLine={false}
              stroke={gridColor}
              tick={{ fill: textMuted, fontSize: 11, fontFamily: 'Hanken Grotesk' }}
              minTickGap={24}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              stroke={gridColor}
              tick={{ fill: textMuted, fontSize: 11, fontFamily: 'Hanken Grotesk' }}
              tickFormatter={formatCompactINR}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as CashflowPoint;
                  return (
                    <div
                      style={{
                        backgroundColor: cardBg,
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.14)' : 'rgba(55,44,46,0.14)'}`,
                        borderRadius: 12,
                        padding: '12px 16px',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.22)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        minWidth: 190,
                        fontFamily: 'Hanken Grotesk, sans-serif'
                      }}
                    >
                      <div
                        style={{
                          fontFamily: 'Fredoka, sans-serif',
                          fontSize: 14,
                          fontWeight: 500,
                          color: textColor,
                          marginBottom: 8
                        }}
                      >
                        {data.fullDate}
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 12,
                          fontSize: 13,
                          marginBottom: 4
                        }}
                      >
                        <span style={{ color: textMuted, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: '#5ED3A6',
                              display: 'inline-block'
                            }}
                          />
                          Income
                        </span>
                        <span style={{ color: '#5ED3A6', fontWeight: 500 }} className="tabular-num">
                          {formatINR(data.income, { signMode: 'income' })}
                        </span>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 12,
                          fontSize: 13,
                          marginBottom: 6
                        }}
                      >
                        <span style={{ color: textMuted, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: '#FF6B8A',
                              display: 'inline-block'
                            }}
                          />
                          Expenses
                        </span>
                        <span style={{ color: '#FF6B8A', fontWeight: 500 }} className="tabular-num">
                          {formatINR(data.expense, { signMode: 'expense' })}
                        </span>
                      </div>

                      <div
                        style={{
                          borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(55,44,46,0.1)'}`,
                          paddingTop: 6,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 12,
                          fontSize: 13,
                          fontWeight: 600
                        }}
                      >
                        <span style={{ color: textColor }}>Net balance</span>
                        <span
                          style={{
                            color: data.net >= 0 ? '#5ED3A6' : '#FF6B8A'
                          }}
                          className="tabular-num"
                        >
                          {formatINR(data.net, { signMode: 'balance' })}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Income: Smooth Area with Mint gradient fill, 3px line, round caps, ringed dots */}
            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#5ED3A6"
              strokeWidth={3}
              strokeLinecap="round"
              fill="url(#mintAreaGradient)"
              isAnimationActive={!reducedMotion}
              animationDuration={900}
              animationEasing="ease-out"
              dot={{ r: 3, stroke: '#5ED3A6', strokeWidth: 2, fill: cardBg }}
              activeDot={{
                r: 6,
                stroke: '#5ED3A6',
                strokeWidth: 3,
                fill: '#5ED3A6',
                style: { filter: 'drop-shadow(0 0 6px rgba(94, 211, 166, 0.7))' }
              }}
            />

            {/* Expense: Smooth Area with Coral gradient fill, 3px line, round caps, ringed dots */}
            <Area
              type="monotone"
              dataKey="expense"
              name="Expenses"
              stroke="#FF6B8A"
              strokeWidth={3}
              strokeLinecap="round"
              fill="url(#coralAreaGradient)"
              isAnimationActive={!reducedMotion}
              animationDuration={900}
              animationEasing="ease-out"
              dot={{ r: 3, stroke: '#FF6B8A', strokeWidth: 2, fill: cardBg }}
              activeDot={{
                r: 6,
                stroke: '#FF6B8A',
                strokeWidth: 3,
                fill: '#FF6B8A',
                style: { filter: 'drop-shadow(0 0 6px rgba(255, 107, 138, 0.7))' }
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/**
 * 3. Spending by category (Donut chart with interactive hover & row legend)
 */
export const CategoryDonutChart: React.FC<ChartsProps> = ({ transactions, theme }) => {
  const isDark = theme === 'dark';
  const textColor = isDark ? '#FFFFFF' : '#372C2E';
  const textMuted = isDark ? 'rgba(255, 255, 255, 0.70)' : 'rgba(55, 44, 46, 0.70)';
  const reducedMotion = usePrefersReducedMotion();

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const { categoryData, totalExpense } = useMemo(() => {
    const expenseOnly = transactions.filter((t) => t.type === 'Expense');
    const catMap: Record<string, number> = {};
    let total = 0;

    expenseOnly.forEach((t) => {
      catMap[t.category] = (catMap[t.category] || 0) + t.amount;
      total += t.amount;
    });

    const data = Object.entries(catMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    return { categoryData: data, totalExpense: total };
  }, [transactions]);

  if (categoryData.length === 0) {
    return (
      <div className="chart-card">
        <div className="chart-title">Spending by category</div>
        <div className="chart-empty-state-modern">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: 0.5, marginBottom: 8 }}
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a10 10 0 0 1 10 10h-10Z" />
          </svg>
          <div>No expense records found for this period</div>
        </div>
      </div>
    );
  }

  // Active shape rendering to expand segment slightly on hover
  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          cornerRadius={8}
        />
      </g>
    );
  };

  const activeItem = activeIndex !== null ? categoryData[activeIndex] : null;
  const centerLabel = activeItem ? activeItem.name : 'Total expenses';
  const centerValue = activeItem
    ? formatINR(activeItem.value, { signMode: 'expense' })
    : formatINR(totalExpense, { signMode: 'expense' });
  const centerPercent =
    activeItem && totalExpense > 0
      ? `${((activeItem.value / totalExpense) * 100).toFixed(1)}% of spending`
      : `${categoryData.length} ${categoryData.length === 1 ? 'category' : 'categories'}`;

  return (
    <div className="chart-card">
      <div className="chart-title">Spending by category</div>

      <div className="donut-layout-container">
        {/* Donut chart frame */}
        <div className="donut-chart-box">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius="68%"
                outerRadius="88%"
                paddingAngle={3}
                cornerRadius={8}
                dataKey="value"
                activeIndex={activeIndex !== null ? activeIndex : undefined}
                activeShape={renderActiveShape}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                isAnimationActive={!reducedMotion}
                animationDuration={900}
                animationEasing="ease-out"
              >
                {categoryData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_PALETTE[index % CHART_PALETTE.length]}
                    style={{ outline: 'none', cursor: 'pointer' }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Centered label updating on hover */}
          <div className="donut-center-overlay">
            <div className="donut-center-label" style={{ color: textMuted }}>
              {centerLabel}
            </div>
            <div className="donut-center-value tabular-num" style={{ color: textColor }}>
              {centerValue}
            </div>
            <div className="donut-center-sub" style={{ color: textMuted }}>
              {centerPercent}
            </div>
          </div>
        </div>

        {/* Legend beside or below with coloured dots, category name, amount and percent */}
        <div className="donut-legend-list">
          {categoryData.map((item, index) => {
            const isHovered = activeIndex === index;
            const color = CHART_PALETTE[index % CHART_PALETTE.length];
            const percent = totalExpense > 0 ? ((item.value / totalExpense) * 100).toFixed(1) : '0';

            return (
              <div
                key={item.name}
                className={`donut-legend-row ${isHovered ? 'donut-legend-row-active' : ''}`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <span className="donut-legend-dot" style={{ backgroundColor: color }} />
                <span className="donut-legend-name" title={item.name}>
                  {item.name}
                </span>
                <span className="donut-legend-val tabular-num">
                  {formatINR(item.value, { includeSymbol: true, signMode: 'none' })}
                </span>
                <span className="donut-legend-pct tabular-num">{percent}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/**
 * 2. Category expense ranking (Horizontal bar chart with 8% track, rounded ends, stagger and hover dimming)
 */
export const CategoryRankingBarChart: React.FC<ChartsProps> = ({ transactions, theme }) => {
  const isDark = theme === 'dark';
  const textColor = isDark ? '#FFFFFF' : '#372C2E';
  const textMuted = isDark ? 'rgba(255, 255, 255, 0.70)' : 'rgba(55, 44, 46, 0.70)';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.10)' : 'rgba(55, 44, 46, 0.10)';
  const reducedMotion = usePrefersReducedMotion();

  const [hoveredCat, setHoveredCat] = useState<string | null>(null);

  const barData = useMemo(() => {
    const expenseOnly = transactions.filter((t) => t.type === 'Expense');
    const totalExp = expenseOnly.reduce((sum, t) => sum + t.amount, 0);
    const catMap: Record<string, number> = {};

    expenseOnly.forEach((t) => {
      catMap[t.category] = (catMap[t.category] || 0) + t.amount;
    });

    return Object.entries(catMap)
      .map(([category, amount]) => {
        const percent = totalExp > 0 ? (amount / totalExp) * 100 : 0;
        return {
          category,
          amount,
          percent,
          labelFormatted: `${formatINR(amount, { includeSymbol: true, signMode: 'none' })} · ${Math.round(percent)}%`
        };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  if (barData.length === 0) {
    return (
      <div className="chart-card">
        <div className="chart-title">Category expense ranking</div>
        <div className="chart-empty-state-modern">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: 0.5, marginBottom: 8 }}
          >
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          <div>No category expenses available for this period</div>
        </div>
      </div>
    );
  }

  // Dynamic height ensuring ~44px spacing per bar
  const chartHeight = Math.max(220, barData.length * 44 + 40);

  return (
    <div className="chart-card">
      <div className="chart-header-row">
        <div>
          <div className="chart-title">Category expense ranking</div>
          <div className="chart-subtitle">Ranked from highest to lowest expenditure</div>
        </div>
      </div>

      <div style={{ width: '100%', height: chartHeight }}>
        <ResponsiveContainer>
          <BarChart
            layout="vertical"
            data={barData}
            margin={{ top: 10, right: 120, left: 24, bottom: 10 }}
          >
            <CartesianGrid
              horizontal={false}
              vertical={true}
              stroke={gridColor}
              strokeDasharray="3 3"
            />

            <XAxis
              type="number"
              domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.35)]}
              axisLine={false}
              tickLine={false}
              stroke={gridColor}
              tick={{ fill: textMuted, fontSize: 11, fontFamily: 'Hanken Grotesk' }}
              tickFormatter={formatCompactINR}
            />

            <YAxis
              type="category"
              dataKey="category"
              axisLine={false}
              tickLine={false}
              stroke={gridColor}
              tick={{ fill: textColor, fontSize: 13, fontFamily: 'Fredoka, sans-serif' }}
              width={95}
            />

            <Tooltip
              formatter={(val: number) => [formatINR(val, { signMode: 'expense' }), 'Spent']}
              contentStyle={{
                backgroundColor: isDark ? '#563727' : '#FFFFFF',
                borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(55,44,46,0.15)',
                borderRadius: 12,
                color: textColor,
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.22)',
                fontFamily: 'Hanken Grotesk, sans-serif'
              }}
            />

            {/* Thinner 18px bars, rounded ends, light 8% track behind, hover dimming to 50% */}
            <Bar
              dataKey="amount"
              barSize={18}
              radius={[0, 10, 10, 0] as any}
              background={{
                fill: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(55, 44, 46, 0.08)',
                radius: 10
              }}
              isAnimationActive={!reducedMotion}
              animationDuration={850}
              animationEasing="ease-out"
            >
              {barData.map((entry, index) => {
                const isHovered = hoveredCat === null || hoveredCat === entry.category;
                const color = CHART_PALETTE[index % CHART_PALETTE.length];

                return (
                  <Cell
                    key={`cell-${entry.category}`}
                    fill={color}
                    opacity={isHovered ? 1 : 0.5}
                    style={{
                      transition: 'opacity 0.25s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={() => setHoveredCat(entry.category)}
                    onMouseLeave={() => setHoveredCat(null)}
                  />
                );
              })}

              <LabelList
                dataKey="labelFormatted"
                position="right"
                fill={textColor}
                style={{
                  fontSize: 12,
                  fontFamily: 'Hanken Grotesk',
                  fontWeight: 500,
                  letterSpacing: '0.2px'
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
