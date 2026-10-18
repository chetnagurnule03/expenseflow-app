import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Transaction, TransactionType, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tx: Omit<Transaction, 'id' | 'createdAt'>, id?: number) => Promise<void>;
  editingTx?: Transaction | null;
}

export const TransactionModal: React.FC<Props> = ({ isOpen, onClose, onSave, editingTx }) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [type, setType] = useState<TransactionType>('Expense');
  const [category, setCategory] = useState<string>('Food');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(todayStr);
  const [description, setDescription] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (editingTx) {
      setType(editingTx.type);
      setCategory(editingTx.category);
      setAmount(editingTx.amount.toString());
      setDate(editingTx.date);
      setDescription(editingTx.description || '');
      setErrors([]);
    } else {
      setType('Expense');
      setCategory('Food');
      setAmount('');
      setDate(todayStr);
      setDescription('');
      setErrors([]);
    }
  }, [editingTx, isOpen]);

  if (!isOpen) return null;

  const categories = type === 'Expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategory(newType === 'Expense' ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: string[] = [];

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      newErrors.push('Amount must be a positive number greater than 0.');
    }

    if (!date) {
      newErrors.push('Date is required.');
    } else if (date > todayStr) {
      newErrors.push('Future dates are not allowed.');
    }

    if (!category) {
      newErrors.push('Category is required.');
    }

    if (description && description.trim().length > 200) {
      newErrors.push('Description cannot exceed 200 characters.');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    await onSave(
      {
        type,
        amount: numAmount,
        category,
        date,
        description: description.trim()
      },
      editingTx?.id
    );

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            {editingTx ? 'Edit transaction' : 'Record new transaction'}
          </div>
          <button className="icon-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {errors.length > 0 && (
          <div className="modal-errors">
            {errors.map((err, idx) => (
              <div key={idx} className="modal-error-item">
                • {err}
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Transaction type</label>
            <div className="type-toggle-group">
              <button
                type="button"
                className={`type-btn ${type === 'Expense' ? 'active-expense' : ''}`}
                onClick={() => handleTypeChange('Expense')}
              >
                Expense
              </button>
              <button
                type="button"
                className={`type-btn ${type === 'Income' ? 'active-income' : ''}`}
                onClick={() => handleTypeChange('Income')}
              >
                Income
              </button>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label">Category *</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group flex-1">
              <label className="form-label">Amount (₹) *</label>
              <input
                type="number"
                step="any"
                min="0.01"
                placeholder="e.g. 500"
                className="form-input tabular-num"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Date *</label>
            <input
              type="date"
              max={todayStr}
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description (optional, max 200 chars)</label>
            <input
              type="text"
              maxLength={200}
              placeholder="e.g. Monthly grocery run"
              className="form-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingTx ? 'Save changes' : 'Add transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
