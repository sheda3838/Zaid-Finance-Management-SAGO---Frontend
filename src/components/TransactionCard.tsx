import React from 'react';
import type { Transaction } from '../types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TransactionCardProps {
  transaction: Transaction;
  onClick?: (transaction: Transaction) => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction, onClick }) => {
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
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
        }`}>
          {isIncome ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-lg">{transaction.description || 'Untitled Transaction'}</p>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
            <span className="capitalize bg-gray-100 px-2 py-0.5 rounded-md font-medium text-gray-600">{transaction.category}</span>
            <span>•</span>
            <span>{formatDate(transaction.date)}</span>
          </div>
        </div>
      </div>
      <div className={`font-bold text-lg ${isIncome ? 'text-emerald-600' : 'text-gray-900'}`}>
        {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
      </div>
    </div>
  );
};

export default TransactionCard;
