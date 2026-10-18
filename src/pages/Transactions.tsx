import React, { useState, useMemo } from 'react';
import { Plus, Download, Search, Trash2, Edit3, AlertCircle } from 'lucide-react';
import { Transaction, FilterState, PeriodPreset, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../types';
import { filterTransactions, getPresetDates, formatINR } from '../calculations';
import { db } from '../db';
import { TransactionModal } from '../components/TransactionModal';

interface Props {
  transactions: Transaction[];
}

export const Transactions: React.FC<Props> = ({ transactions }) => {
  const [period, setPeriod] = useState<PeriodPreset>('All Time');
  const [customStart, setCustomStart] = useState<string>('');
  const [customEnd, setCustomEnd] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Income' | 'Expense'>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [sortField, setSortField] = useState<'date' | 'amount' | 'category'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  // Deletion Confirmation State
  const [deletingTx, setDeletingTx] = useState<Transaction | null>(null);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);

  // Filter Configuration
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
      type: typeFilter,
      categories: categoryFilter === 'All' ? [] : [categoryFilter],
      searchQuery
    };
  }, [period, customStart, customEnd, typeFilter, categoryFilter, searchQuery]);

  // Shared Filtered Transactions
  const filteredList = useMemo(() => {
    const list = filterTransactions(transactions, filterConfig);

    return list.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'date') {
        cmp = a.date.localeCompare(b.date);
      } else if (sortField === 'amount') {
        cmp = a.amount - b.amount;
      } else if (sortField === 'category') {
        cmp = a.category.localeCompare(b.category);
      }
      return sortOrder === 'desc' ? -cmp : cmp;
    });
  }, [transactions, filterConfig, sortField, sortOrder]);

  const allCategories = useMemo(() => {
    return Array.from(new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES])).sort();
  }, []);

  const handleSaveTransaction = async (
    txData: Omit<Transaction, 'id' | 'createdAt'>,
    id?: number
  ) => {
    if (id) {
      await db.transactions.update(id, txData);
    } else {
      await db.transactions.add({
        ...txData,
        createdAt: Date.now()
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (deletingTx?.id) {
      await db.transactions.delete(deletingTx.id);
      setDeletingTx(null);
      setDeleteConfirmed(false);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (filteredList.length === 0) return;

    const headers = ['ID', 'Date', 'Type', 'Category', 'Description', 'Amount'];
    const rows = filteredList.map((t) => [
      t.id ?? '',
      t.date,
      t.type,
      `"${(t.category || '').replace(/"/g, '""')}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      t.amount
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'expenseflow_transactions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page-content">
      {/* Header and Add Button */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-subtitle">
            Search, filter, edit cashflows, or export records to CSV.
          </p>
        </div>

        <div className="header-actions">
          <button
            className="btn-secondary"
            onClick={handleExportCSV}
            disabled={filteredList.length === 0}
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
          <button
            className="btn-primary"
            onClick={() => {
              setEditingTx(null);
              setIsModalOpen(true);
            }}
          >
            <Plus size={16} />
            <span>Add transaction</span>
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="filter-panel">
        <div className="filter-grid">
          <div className="filter-item">
            <label className="filter-label">Period</label>
            <select
              className="filter-select"
              value={period}
              onChange={(e) => setPeriod(e.target.value as PeriodPreset)}
            >
              <option value="All Time">All Time</option>
              <option value="This Month">This Month</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="This Year">This Year</option>
              <option value="Custom">Custom Range</option>
            </select>
          </div>

          <div className="filter-item">
            <label className="filter-label">Type</label>
            <select
              className="filter-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
            >
              <option value="All">All Types</option>
              <option value="Expense">Expense</option>
              <option value="Income">Income</option>
            </select>
          </div>

          <div className="filter-item">
            <label className="filter-label">Category</label>
            <select
              className="filter-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All categories</option>
              {allCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-item search-item">
            <label className="filter-label">Search</label>
            <div className="search-input-wrapper">
              <Search size={15} className="search-icon" />
              <input
                type="text"
                placeholder="Search notes or category..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {period === 'Custom' && (
          <div className="custom-dates-bar">
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

      {/* Results Count & Active Sort Notice */}
      <div className="table-meta-bar">
        <div className="meta-count">
          Showing <b>{filteredList.length}</b> of <b>{transactions.length}</b> transactions
        </div>
        <div className="sort-controls">
          <span className="sort-label">Sort by:</span>
          <button
            className={`sort-btn ${sortField === 'date' ? 'active-sort' : ''}`}
            onClick={() => {
              if (sortField === 'date') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              else {
                setSortField('date');
                setSortOrder('desc');
              }
            }}
          >
            Date {sortField === 'date' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
          <button
            className={`sort-btn ${sortField === 'amount' ? 'active-sort' : ''}`}
            onClick={() => {
              if (sortField === 'amount') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              else {
                setSortField('amount');
                setSortOrder('desc');
              }
            }}
          >
            Amount {sortField === 'amount' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
        </div>
      </div>

      {/* Main Transactions Table */}
      {filteredList.length === 0 ? (
        <div className="empty-box">No transactions match your current search filters.</div>
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
                <th style={{ textAlign: 'center', width: 90 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((tx) => (
                <tr key={tx.id}>
                  <td className="tabular-num">{tx.date}</td>
                  <td>
                    <span
                      className={`table-badge ${tx.type === 'Income' ? 'badge-mint' : 'badge-coral'}`}
                    >
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
                  <td style={{ textAlign: 'center' }}>
                    <div className="row-actions">
                      <button
                        className="btn-icon"
                        title="Edit transaction"
                        onClick={() => {
                          setEditingTx(tx);
                          setIsModalOpen(true);
                        }}
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        className="btn-icon btn-icon-delete"
                        title="Delete transaction"
                        onClick={() => {
                          setDeletingTx(tx);
                          setDeleteConfirmed(false);
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTx(null);
        }}
        onSave={handleSaveTransaction}
        editingTx={editingTx}
      />

      {/* Delete Confirmation Modal */}
      {deletingTx && (
        <div className="modal-backdrop" onClick={() => setDeletingTx(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title" style={{ color: 'var(--coral)' }}>
                Confirm permanent deletion
              </div>
            </div>

            <div className="delete-confirm-body">
              <AlertCircle size={28} className="coral-icon" />
              <p>
                Are you sure you want to permanently delete this {deletingTx.type.toLowerCase()} of{' '}
                <b>{formatINR(deletingTx.amount, { signMode: deletingTx.type === 'Income' ? 'income' : 'expense' })}</b> ({deletingTx.category}) on {deletingTx.date}?
              </p>
              <div className="confirm-checkbox-row">
                <input
                  type="checkbox"
                  id="chk-confirm"
                  checked={deleteConfirmed}
                  onChange={(e) => setDeleteConfirmed(e.target.checked)}
                />
                <label htmlFor="chk-confirm">Yes, permanently remove this transaction</label>
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setDeletingTx(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-coral"
                disabled={!deleteConfirmed}
                onClick={handleConfirmDelete}
              >
                Permanently delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
