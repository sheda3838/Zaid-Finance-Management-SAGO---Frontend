import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, User, Wallet, TrendingUp, DollarSign, AlertCircle, Receipt } from 'lucide-react';
import { getSummary, getTrends } from '../services/dashboardService';
import { deleteTransaction } from '../services/transactionService';
import type { Transaction, DashboardPeriod, DashboardSummary, DashboardTrends } from '../types';
import SummaryCard from '../components/SummaryCard';
import TrendChart from '../components/TrendChart';
import PeriodFilter from '../components/PeriodFilter';
import RecentTransactions from '../components/RecentTransactions';
import TransactionModal from '../components/TransactionModal';
import TransactionFormModal from '../components/TransactionFormModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { parseApiError } from '../services/apiClient';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [period, setPeriod] = useState<DashboardPeriod>('all');
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [trends, setTrends] = useState<DashboardTrends | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Modal states
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const [summaryData, trendsData] = await Promise.all([
          getSummary(period),
          getTrends(period)
        ]);
        
        setSummary(summaryData);
        setTrends(trendsData);
      } catch (err: unknown) {
        console.error('Failed to fetch dashboard data:', err);
        setError(parseApiError(err, 'Failed to load your dashboard data.'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [period, refreshTrigger]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDelete = async () => {
    if (!transactionToDelete) return;
    setIsDeleting(true);
    
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
    } finally {
      setIsDeleting(false);
    }
  };

  const balance = summary ? summary.balance : 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-2 text-indigo-600">
          <LayoutDashboard className="w-6 h-6" />
          <span className="text-xl font-bold tracking-tight">SAGO</span>
        </div>
        
        <div className="flex items-center gap-6">
          <Link to="/transactions" className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
            <Receipt className="w-4 h-4" />
            Transactions
          </Link>
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 hidden sm:flex">
            <User className="w-4 h-4 text-gray-400" />
            <span className="font-medium text-gray-700">{user?.name || 'User'}</span>
          </div>
          <button
            onClick={handleLogout}
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-8">
        
        {/* Header & Filter */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, {user?.name}. Here's your financial overview.</p>
          </div>
          <PeriodFilter 
            selectedPeriod={period} 
            onPeriodChange={setPeriod} 
            disabled={isLoading}
          />
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Loading State Skeleton */}
        {isLoading && !summary && (
          <div className="flex flex-col gap-6 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
                  <div className="w-14 h-14 rounded-xl bg-gray-100"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-100 rounded w-1/2 mb-3"></div>
                    <div className="h-6 bg-gray-100 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 h-80"></div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-1 h-80"></div>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        {!error && summary && trends && (
          <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <SummaryCard 
                title="Total Income" 
                amount={summary.totalIncome} 
                icon={TrendingUp} 
                iconColorClass="text-emerald-600"
                iconBgClass="bg-emerald-50"
              />
              <SummaryCard 
                title="Total Expenses" 
                amount={summary.totalExpenses} 
                icon={Wallet} 
                iconColorClass="text-rose-600"
                iconBgClass="bg-rose-50"
              />
              <SummaryCard 
                title="Net Balance" 
                amount={balance} 
                icon={DollarSign} 
                iconColorClass="text-indigo-600"
                iconBgClass="bg-indigo-50"
                isBalance={true}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Trends Chart */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Income vs Expense Trends</h3>
                  <p className="text-sm text-gray-500">Visualizing your cash flow over the selected period.</p>
                </div>
                <TrendChart data={trends.data} />
              </div>

              {/* Recent Transactions */}
              <div className="lg:col-span-1 h-full">
                <RecentTransactions 
                  refreshTrigger={refreshTrigger}
                  onTransactionClick={setSelectedTransaction}
                  onAddClick={() => setIsFormModalOpen(true)}
                />
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-center justify-around z-20 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <Link to="/dashboard" className="flex flex-col items-center py-3 text-indigo-600 w-full hover:bg-gray-50 transition-colors">
          <LayoutDashboard className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Home</span>
        </Link>
        <Link to="/transactions" className="flex flex-col items-center py-3 text-gray-500 hover:text-indigo-600 w-full hover:bg-gray-50 transition-colors">
          <Receipt className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Transactions</span>
        </Link>
        <button onClick={handleLogout} className="flex flex-col items-center py-3 text-gray-500 hover:text-red-600 w-full hover:bg-gray-50 transition-colors">
          <LogOut className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Sign Out</span>
        </button>
      </nav>
      
      {/* Padding for mobile nav */}
      <div className="h-16 sm:hidden"></div>

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

export default Dashboard;
