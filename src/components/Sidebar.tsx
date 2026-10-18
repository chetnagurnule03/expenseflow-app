import React, { useState } from 'react';
import {
  LayoutDashboard,
  ReceiptText,
  BarChart3,
  Target,
  Sparkles,
  RotateCcw,
  Sun,
  Moon,
  ChevronRight
} from 'lucide-react';
import { loadDemoData, db } from '../db';

interface Props {
  currentTab: string;
  onTabChange: (tab: string) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenLanding: () => void;
}

export const Sidebar: React.FC<Props> = ({
  currentTab,
  onTabChange,
  theme,
  onToggleTheme,
  onOpenLanding
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ReceiptText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'budget', label: 'Budget', icon: Target }
  ];

  const handleLoadDemo = async () => {
    await loadDemoData();
    window.location.reload();
  };

  const handleResetData = async () => {
    setResetting(true);
    await db.transactions.clear();
    await db.budgets.clear();
    setResetting(false);
    setShowResetConfirm(false);
    window.location.reload();
  };

  return (
    <aside className="sidebar-container">
      <div className="sidebar-header" onClick={onOpenLanding} style={{ cursor: 'pointer' }}>
        <div className="sidebar-brand">
          <div className="brand-icon-box">
            <span className="brand-dot" />
          </div>
          <div>
            <h2 className="brand-name">ExpenseFlow</h2>
            <div className="brand-sub">Personal finance</div>
          </div>
        </div>
      </div>

      {/* Nav List */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'nav-active' : ''}`}
              onClick={() => onTabChange(item.id)}
            >
              <Icon size={19} className="nav-icon" />
              <span className="nav-label">{item.label}</span>
              {isActive && <ChevronRight size={16} className="nav-arrow" />}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-spacer" />

      {/* Quick Actions & Demo */}
      <div className="sidebar-footer">
        <div className="theme-toggle-box">
          <button className="theme-toggle-btn" onClick={onToggleTheme}>
            {theme === 'dark' ? (
              <>
                <Sun size={17} className="sunny-icon" />
                <span>Light mode</span>
              </>
            ) : (
              <>
                <Moon size={17} className="moon-icon" />
                <span>Dark mode</span>
              </>
            )}
          </button>
        </div>

        <div className="demo-box">
          <button className="btn-sidebar-demo" onClick={handleLoadDemo}>
            <Sparkles size={16} />
            <span>Load demo data</span>
          </button>

          {!showResetConfirm ? (
            <button
              className="btn-sidebar-reset"
              onClick={() => setShowResetConfirm(true)}
            >
              <RotateCcw size={14} />
              <span>Reset data</span>
            </button>
          ) : (
            <div className="reset-confirm-box">
              <div className="reset-confirm-text">Clear all records?</div>
              <div className="reset-confirm-actions">
                <button
                  className="btn-reset-yes"
                  disabled={resetting}
                  onClick={handleResetData}
                >
                  Confirm
                </button>
                <button
                  className="btn-reset-no"
                  onClick={() => setShowResetConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="sidebar-tagline">Private • Stays on your device</div>
      </div>
    </aside>
  );
};
