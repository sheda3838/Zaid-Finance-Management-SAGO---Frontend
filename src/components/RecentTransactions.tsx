import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2, ReceiptText, TrendingUp, TrendingDown } from 'lucide-react';
import { getRecentTransactions } from '../services/transactionService';
import type { Transaction } from '../types';
import axios from 'axios';
interface RecentTransactionsProps {
  refreshTrigger?: number;
  onTransactionClick?: (transaction: Transaction) => void;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ refreshTrigger = 0, onTransactionClick }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getRecentTransactions();
        setTransactions(data);
      } catch (err) {
        console.error('Failed to fetch recent transactions', err);
        if (axios.isAxiosError(err) && err.response) {
          setError(err.response.data.message || 'Failed to load recent transactions.');
        } else {
          setError('An unexpected error occurred.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [refreshTrigger]);

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
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          <p className="text-sm text-gray-500">Your latest financial activity.</p>
        </div>
        <Link 
          to="/transactions" 
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1"
        >
          See More
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-10">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
          <p className="text-sm text-gray-500">Loading transactions...</p>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center p-4 bg-red-50 text-red-600 text-sm rounded-xl">
          {error}
        </div>
      ) : transactions.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
            <ReceiptText className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-900 font-medium mb-1">No recent transactions</p>
          <p className="text-gray-500 text-sm">Your latest activity will appear here.</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-4">
          {transactions.map((tx) => (
            <div 
              key={tx.id || tx._id} 
              onClick={() => onTransactionClick && onTransactionClick(tx)}
              className={`flex items-center justify-between p-3 rounded-xl transition-colors border border-transparent ${
                onTransactionClick ? 'cursor-pointer hover:bg-gray-50 hover:border-gray-100' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  tx.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                }`}>
                  {tx.type === 'income' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{tx.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    <span className="capitalize bg-gray-100 px-2 py-0.5 rounded-md">{tx.category}</span>
                    <span>•</span>
                    <span>{formatDate(tx.date)}</span>
                  </div>
                </div>
              </div>
              <div className={`font-semibold ${tx.type === 'income' ? 'text-emerald-600' : 'text-gray-900'}`}>
                {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;
