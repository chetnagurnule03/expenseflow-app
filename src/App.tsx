import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, initDatabase } from './db';
import { Sidebar } from './components/Sidebar';
import { Landing } from './pages/Landing';
import { Overview } from './pages/Overview';
import { Transactions } from './pages/Transactions';
import { Analytics } from './pages/Analytics';
import { BudgetPage } from './pages/Budget';

export const App: React.FC = () => {
  const [inApp, setInApp] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Initialize DB on first render
  useEffect(() => {
    initDatabase();
  }, []);

  // Update data-theme on body
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Live queries from Dexie
  const transactions = useLiveQuery(() => db.transactions.toArray(), []) || [];
  const budgets = useLiveQuery(() => db.budgets.toArray(), []) || [];

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  if (!inApp) {
    return <Landing onEnterApp={() => setInApp(true)} />;
  }

  return (
    <div className="app-layout">
      {/* Floating Ambient Circles */}
      <div className="bg-blob-1" />
      <div className="bg-blob-2" />
      <div className="bg-blob-3" />

      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={activeTab}
        onTabChange={setActiveTab}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenLanding={() => setInApp(false)}
      />

      {/* Main Content Area with Illustration Background */}
      <div className="main-content-wrapper">
        <div className="content-bg-watermark" aria-hidden="true" />
        <main className="main-viewport">
          {activeTab === 'overview' && (
            <Overview
              transactions={transactions}
              budgets={budgets}
              theme={theme}
              onNavigateToTab={setActiveTab}
            />
          )}
          {activeTab === 'transactions' && <Transactions transactions={transactions} />}
          {activeTab === 'analytics' && <Analytics transactions={transactions} theme={theme} />}
          {activeTab === 'budget' && <BudgetPage transactions={transactions} budgets={budgets} />}
        </main>
      </div>
    </div>
  );
};

export default App;
