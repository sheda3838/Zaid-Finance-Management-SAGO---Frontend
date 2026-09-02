import React from 'react';
import type { Transaction } from '../types';
import { TrendingUp, TrendingDown, Pencil, Trash2 } from 'lucide-react';

interface TransactionCardProps {
  transaction: Transaction;
  onClick?: (transaction: Transaction) => void;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction, onClick, onEdit, onDelete }) => {
  const isIncome = transaction.type === 'income';

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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
      onClick={() => onClick && onClick(transaction)}
      className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 rounded-2xl transition-all shadow-sm border border-gray-100 cursor-pointer hover:shadow-md"
    >
      <div className="flex items-center gap-4 min-w-0 flex-1 pr-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
        }`}>
          {isIncome ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-900 text-lg truncate">{transaction.title || 'Untitled Transaction'}</p>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500 mt-1">
            <span className="capitalize bg-gray-100 px-2 py-0.5 rounded-md font-medium text-gray-600 whitespace-nowrap">{transaction.category}</span>
            <span className="text-gray-400">•</span>
            <span className="whitespace-nowrap">{formatDate(transaction.date)}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className={`font-bold text-lg whitespace-nowrap ${isIncome ? 'text-emerald-600' : 'text-gray-900'}`}>
          {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
        </div>
        
        {(onEdit || onDelete) && (
          <div className="flex items-center gap-1 border-l border-gray-200 pl-4">
            {onEdit && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(transaction);
                }}
                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Edit transaction"
                title="Edit transaction"
              >
                <Pencil className="w-5 h-5" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(transaction);
                }}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Delete transaction"
                title="Delete transaction"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionCard;
