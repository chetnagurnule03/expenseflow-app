import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Scale, Percent } from 'lucide-react';
import { MetricSummary } from '../types';
import { formatINR } from '../calculations';

interface Props {
  metrics: MetricSummary;
}

export const SummaryCards: React.FC<Props> = ({ metrics }) => {
  const cards = [
    {
      title: 'Total income',
      value: formatINR(metrics.totalIncome, { signMode: 'income' }),
      subtitle: `${metrics.incomeCount} income records`,
      icon: TrendingUp,
      colorClass: 'val-income',
      cardClass: 'card-income'
    },
    {
      title: 'Total expenses',
      value: formatINR(metrics.totalExpense, { signMode: 'expense' }),
      subtitle: `${metrics.expenseCount} expense records`,
      icon: TrendingDown,
      colorClass: 'val-expense',
      cardClass: 'card-expense'
    },
    {
      title: 'Net balance',
      value: formatINR(metrics.balance, { signMode: 'balance' }),
      subtitle: 'Income − expenses',
      icon: Scale,
      colorClass: metrics.balance >= 0 ? 'val-balance-pos' : 'val-balance-neg',
      cardClass: 'card-balance'
    },
    {
      title: 'Savings rate',
      value: metrics.savingsRateStr,
      subtitle: metrics.savingsRateStr !== 'N/A' ? 'Balance ÷ income' : 'Income is ₹0',
      icon: Percent,
      colorClass: 'val-savings',
      cardClass: 'card-savings'
    }
  ];

  return (
    <div className="summary-cards-grid">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <motion.div
            key={c.title}
            className={`metric-card ${c.cardClass}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              delay: i * 0.06, // 60ms stagger
              ease: [0.34, 1.56, 0.64, 1] // Springy easing
            }}
            whileHover={{
              y: -5,
              rotate: -0.8,
              transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }
            }}
          >
            <div className="metric-header">
              <Icon size={18} className="metric-icon" />
              <div className="metric-title">{c.title}</div>
            </div>
            <div className={`metric-value tabular-num ${c.colorClass}`}>
              {c.value}
            </div>
            <div className="metric-subtitle">{c.subtitle}</div>
          </motion.div>
        );
      })}
    </div>
  );
};
