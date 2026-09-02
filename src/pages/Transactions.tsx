import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { LogOut, ArrowLeft, Receipt, Search, Filter, AlertCircle, Loader2, Plus, X } from 'lucide-react';
import { getTransactions, deleteTransaction } from '../services/transactionService';
import type { GetTransactionsParams } from '../services/transactionService';
import type { Transaction } from '../types';
import { IncomeCategories, ExpenseCategories } from '../types';
import TransactionCard from '../components/TransactionCard';
import TransactionModal from '../components/TransactionModal';
import TransactionFormModal from '../components/TransactionFormModal';
import ConfirmationModal from '../components/ConfirmationModal';
import axios from 'axios';

const Transactions: React.FC = () => {
  const { logout } = useAuth();
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('newest');
  
  // Dynamic categories based on selected type
  const availableCategories = useMemo(() => {
    if (type === 'income') return [...IncomeCategories].sort();
    if (type === 'expense') return [...ExpenseCategories].sort();
    return Array.from(new Set([...IncomeCategories, ...ExpenseCategories])).sort();
  }, [type]);

  useEffect(() => {
    const fetchAllTransactions = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const params: GetTransactionsParams = {
          search: search.trim(),
          type,
          category,
          sort
        };
        const data = await getTransactions(params);
        setTransactions(data);
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
        if (axios.isAxiosError(err) && err.response) {
          setError(err.response.data.message || 'Failed to load transactions.');
        } else {
          setError('An unexpected error occurred.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    // A simple timeout debounce inside the useEffect to prevent spamming backend when typing
    const delayDebounceFn = setTimeout(() => {
      fetchAllTransactions();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, type, category, sort, refreshTrigger]);

  const hasActiveFilters = search !== '' || type !== 'all' || category !== 'all' || sort !== 'newest';

  const handleClearFilters = () => {
    setSearch('');
    setType('all');
    setCategory('all');
    setSort('newest');
  };

  const handleDelete = async () => {
    if (!transactionToDelete) return;
    setIsDeleting(true);
    
    // Find correct ID to use (id or _id fallback)
    const id = transactionToDelete.id || transactionToDelete._id;
    if (!id) {
      setIsDeleting(false);
      return;
    }
    
    try {
      await deleteTransaction(id);
      setIsDeleteModalOpen(false);
      setTransactionToDelete(null);
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Failed to delete transaction:', err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Failed to delete transaction.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-2 text-indigo-600">
          <Receipt className="w-6 h-6" />
          <span className="text-xl font-bold tracking-tight">Transactions</span>
        </div>
        
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Transactions</h1>
            <p className="text-gray-500 mt-1">Manage and view your financial history.</p>
          </div>
          <button 
            onClick={() => setIsFormModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Transaction
          </button>
        </div>

        {/* Filters Section */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
          
          <div className="relative w-full md:flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search description..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-gray-50 focus:bg-white"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
            <select
              value={type}
              onChange={(e) => {
                const newType = e.target.value;
                setType(newType);
                const allowedCategories: string[] = newType === 'income' ? [...IncomeCategories] : newType === 'expense' ? [...ExpenseCategories] : [...IncomeCategories, ...ExpenseCategories];
                
                if (category !== 'all' && !allowedCategories.includes(category)) {
                  setCategory('all');
                }
              }}
              className="py-2.5 px-4 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-gray-50 focus:bg-white text-gray-700 w-full sm:w-auto"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="py-2.5 px-4 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-gray-50 focus:bg-white text-gray-700 w-full sm:w-auto max-w-[200px]"
            >
              <option value="all">All Categories</option>
              {availableCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="py-2.5 px-4 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-gray-50 focus:bg-white text-gray-700 w-full sm:w-auto"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                aria-label="Clear filters"
                title="Clear filters"
                className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors flex-shrink-0 flex items-center justify-center w-full sm:w-auto border border-transparent hover:border-red-100"
              >
                <X className="w-5 h-5" />
                <span className="sm:hidden ml-2 font-medium">Clear Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Loading / Content */}
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Loading transactions...</p>
          </div>
        ) : !error && transactions.length === 0 ? (
          <div className="flex-1 bg-white border border-gray-200 border-dashed rounded-2xl flex flex-col items-center justify-center py-20 px-4 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-4">
              <Filter className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-500 max-w-md">
              We couldn't find any transactions matching your current filters. Try adjusting your search or clearing the filters.
            </p>
            {hasActiveFilters && (
              <button 
                onClick={handleClearFilters}
                className="mt-6 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4 pb-10">
            {transactions.map((tx) => (
              <TransactionCard 
                key={tx.id || tx._id} 
                transaction={tx} 
                onClick={(t) => setSelectedTransaction(t)}
                onEdit={(t) => {
                  setTransactionToEdit(t);
                  setIsFormModalOpen(true);
                }}
                onDelete={(t) => {
                  setTransactionToDelete(t);
                  setIsDeleteModalOpen(true);
                }}
              />
            ))}
          </div>
        )}

      </main>

      {/* Transaction Modal */}
      {selectedTransaction && (
        <TransactionModal 
          transaction={selectedTransaction} 
          onClose={() => setSelectedTransaction(null)}
          onEdit={() => {
            setTransactionToEdit(selectedTransaction);
            setIsFormModalOpen(true);
            setSelectedTransaction(null);
          }}
          onDelete={() => {
            setTransactionToDelete(selectedTransaction);
            setIsDeleteModalOpen(true);
            setSelectedTransaction(null);
          }}
        />
      )}

      {/* Transaction Form Modal (Create/Edit) */}
      {isFormModalOpen && (
        <TransactionFormModal 
          initialData={transactionToEdit || undefined}
          onClose={() => {
            setIsFormModalOpen(false);
            setTransactionToEdit(null);
          }}
          onSuccess={() => setRefreshTrigger(prev => prev + 1)}
        />
      )}

      {/* Confirmation Modal (Delete) */}
      {isDeleteModalOpen && transactionToDelete && (
        <ConfirmationModal
          title="Delete Transaction?"
          message="Are you sure you want to delete this transaction? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleDelete}
          onCancel={() => {
            setIsDeleteModalOpen(false);
            setTransactionToDelete(null);
          }}
          isLoading={isDeleting}
          isDanger={true}
        />
      )}
    </div>
  );
};

export default Transactions;
