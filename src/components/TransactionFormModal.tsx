import React, { useState, useEffect, useRef } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import type { Transaction } from '../types';
import { IncomeCategories, ExpenseCategories } from '../types';
import { createTransaction, updateTransaction } from '../services/transactionService';
import ConfirmationModal from './ConfirmationModal';
import { parseApiError } from '../services/apiClient';

interface TransactionFormModalProps {
  initialData?: Transaction;
  onClose: () => void;
  onSuccess: () => void;
}

const TransactionFormModal: React.FC<TransactionFormModalProps> = ({ initialData, onClose, onSuccess }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  const isEditMode = !!initialData;

  const [title, setTitle] = useState(initialData?.title || '');
  const [type, setType] = useState(initialData?.type || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [amount, setAmount] = useState(initialData ? initialData.amount.toString() : '');
  const [description, setDescription] = useState(initialData?.description || '');
  
  // Format the existing date to YYYY-MM-DD for the date input if editing
  const getInitialDate = () => {
    if (initialData?.date) {
      return new Date(initialData.date).toISOString().split('T')[0];
    }
    return new Date().toISOString().split('T')[0];
  };
  const [date, setDate] = useState(getInitialDate());
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, isSubmitting]);

  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node) && !isSubmitting) {
      onClose();
    }
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value;
    setType(newType);
    
    // Reset category if it's incompatible with the new type
    let allowedCategories: string[] = [];
    if (newType === 'income') allowedCategories = [...IncomeCategories];
    else if (newType === 'expense') allowedCategories = [...ExpenseCategories];
    
    if (category && !allowedCategories.includes(category)) {
      setCategory('');
    }
  };

  const availableCategories = type === 'income' ? IncomeCategories : type === 'expense' ? ExpenseCategories : [];
  
  // Max date is today
  const maxDate = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Frontend Validation
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Please enter a title.');
      return;
    }
    if (trimmedTitle.length > 100) {
      setError('Title cannot exceed 100 characters.');
      return;
    }
    if (!type) {
      setError('Please select a transaction type.');
      return;
    }
    if (!category) {
      setError('Please select a category.');
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Amount must be a valid number greater than 0.');
      return;
    }
    if (!date) {
      setError('Please select a date.');
      return;
    }
    if (date > maxDate) {
      setError('Transaction date cannot be in the future.');
      return;
    }

    const selectedDate = new Date(date);
    const hundredYearsAgo = new Date();
    hundredYearsAgo.setFullYear(hundredYearsAgo.getFullYear() - 100);

    if (selectedDate < hundredYearsAgo) {
      setIsWarningModalOpen(true);
      return;
    }

    processSubmission();
  };

  const processSubmission = async () => {
    setIsSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        type,
        category,
        amount: parseFloat(amount),
        description: description.trim(),
        date
      };

      if (isEditMode && initialData) {
        // Find correct ID to use (id or _id fallback)
        const id = initialData.id || initialData._id;
        if (!id) throw new Error('Transaction ID missing.');
        await updateTransaction(id, payload);
      } else {
        await createTransaction(payload);
      }
      
      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} transaction:`, err);
      setError(parseApiError(err, `Failed to ${isEditMode ? 'update' : 'create'} transaction.`));
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm transition-opacity"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden transform transition-all flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 id="modal-title" className="text-xl font-bold text-gray-900">
            {isEditMode ? 'Edit Transaction' : 'Create Transaction'}
          </h2>
          <button 
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form id="transaction-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="title">Title <span className="text-red-500">*</span></label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Grocery Shopping"
                maxLength={100}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="type">Transaction Type <span className="text-red-500">*</span></label>
              <select
                id="type"
                value={type}
                onChange={handleTypeChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white text-sm cursor-pointer"
                required
              >
                <option value="" disabled>Select Type</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="category">Category <span className="text-red-500">*</span></label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={!type}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white text-sm cursor-pointer disabled:bg-gray-100 disabled:text-gray-500"
                required
              >
                <option value="" disabled>Select Category</option>
                {availableCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="amount">Amount ($) <span className="text-red-500">*</span></label>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="date">Date <span className="text-red-500">*</span></label>
              <input
                id="date"
                type="date"
                max={maxDate}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white text-sm cursor-pointer"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="description">Description <span className="text-gray-400 font-normal">(Optional)</span></label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What was this for?"
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white text-sm resize-none"
              ></textarea>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3 rounded-b-2xl flex-shrink-0">
          <button 
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="transaction-form"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isEditMode ? 'Saving...' : 'Creating...'}
              </>
            ) : (
              isEditMode ? 'Save Changes' : 'Create Transaction'
            )}
          </button>
        </div>
      </div>

      {isWarningModalOpen && (
        <ConfirmationModal
          title="Very Old Transaction Date"
          message="This transaction date is unusually old. Please make sure the date is correct before continuing."
          confirmText="Save"
          cancelText="Edit"
          onConfirm={() => {
            setIsWarningModalOpen(false);
            processSubmission();
          }}
          onCancel={() => {
            setIsWarningModalOpen(false);
            setTimeout(() => document.getElementById('date')?.focus(), 50);
          }}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
};

export default TransactionFormModal;
