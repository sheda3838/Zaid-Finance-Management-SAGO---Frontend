import React, { useEffect, useRef } from 'react';
import { X, Edit2, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import type { Transaction } from '../types';

interface TransactionModalProps {
  transaction: Transaction;
  onClose: () => void;
  onEdit: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ transaction, onClose, onEdit }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const isIncome = transaction.type === 'income';

  const formatDateTime = (dateStr: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(dateStr));
  };

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(dateStr));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm transition-opacity"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 id="modal-title" className="text-xl font-bold text-gray-900">Transaction Details</h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Close"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${
              isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
            }`}>
              {isIncome ? <TrendingUp className="w-7 h-7" /> : <TrendingDown className="w-7 h-7" />}
            </div>
            <div>
              <p className={`text-2xl font-bold ${isIncome ? 'text-emerald-600' : 'text-gray-900'}`}>
                {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
              </p>
              <p className="text-gray-500 font-medium capitalize">{transaction.type}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase mb-1">Description</p>
              <p className="text-gray-900 font-medium">{transaction.description || 'N/A'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase mb-1">Category</p>
                <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg capitalize">
                  {transaction.category}
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase mb-1">Date</p>
                <p className="text-gray-900 font-medium text-sm">{formatDate(transaction.date)}</p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Created At</p>
                <p className="text-sm font-medium text-gray-900">{transaction.createdAt ? formatDateTime(transaction.createdAt) : 'Unknown'}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Updated At</p>
                <p className={`text-sm font-medium ${transaction.updatedAt && transaction.updatedAt !== transaction.createdAt ? 'text-indigo-600' : 'text-gray-900'}`}>
                  {transaction.updatedAt ? formatDateTime(transaction.updatedAt) : 'Not updated'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3 rounded-b-2xl">
          <button 
            type="button"
            onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm"
            aria-label="Edit transaction"
            title="Edit transaction"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
          <button 
            type="button"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors shadow-sm"
            aria-label="Delete transaction"
            title="Delete transaction"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
