import React from 'react';
import { motion } from 'framer-motion';
import { Smile, Frown, Target } from 'lucide-react';
import { BudgetStatus } from '../types';
import { formatINR } from '../calculations';

interface Props {
  status: BudgetStatus;
  monthStr: string;
}

export const BudgetCard: React.FC<Props> = ({ status, monthStr }) => {
  if (!status.hasBudget || status.budget === null) {
    return (
      <div className="budget-container budget-unset">
        <div className="budget-top-row">
          <div className="budget-label-group">
            <Target size={20} className="budget-icon" />
            <span className="budget-title">Budget standing ({monthStr})</span>
          </div>
        </div>
        <div className="budget-subtitle">
          No budget allocated for {monthStr}. Configure a monthly spending limit in the Budget tab.
        </div>
      </div>
    );
  }

  const { budget, spent, remaining, percentage, isExceeded } = status;
  const cappedPercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <motion.div
      className={`budget-container ${isExceeded ? 'budget-exceeded-shake' : 'budget-healthy'}`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="budget-top-row">
        <div className="budget-message-row">
          {isExceeded ? (
            <>
              <Frown size={22} className="budget-status-icon coral-icon" />
              <span className="budget-highlight coral-text">
                Over budget by {formatINR(spent - budget, { signMode: 'expense' })}
              </span>
            </>
          ) : (
            <>
              <Smile size={22} className="budget-status-icon mint-icon" />
              <span className="budget-highlight mint-text">
                On track • {formatINR(remaining ?? 0, { signMode: 'income' })} remaining
              </span>
            </>
          )}
        </div>

        <div className="budget-stats-text tabular-num">
          Spent {formatINR(spent, { signMode: 'expense' })} of {formatINR(budget, { signMode: 'none' })} ({percentage.toFixed(1)}% used)
        </div>
      </div>

      {/* Animated Progress Bar */}
      <div className="budget-progress-track">
        <motion.div
          className={`budget-progress-fill ${isExceeded ? 'fill-coral' : 'fill-mint'}`}
          initial={{ width: 0 }}
          animate={{ width: isExceeded ? '100%' : `${cappedPercentage}%` }}
          transition={{ duration: 0.85, ease: [0.34, 1.56, 0.64, 1] }}
        />
      </div>
    </motion.div>
  );
};
