import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, User, Wallet, TrendingUp, DollarSign, AlertCircle, Loader2, Receipt } from 'lucide-react';
import { getSummary, getTrends } from '../services/dashboardService';
import type { DashboardPeriod, DashboardSummary, DashboardTrends } from '../types';
import SummaryCard from '../components/SummaryCard';
import TrendChart from '../components/TrendChart';
import PeriodFilter from '../components/PeriodFilter';
import axios from 'axios';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [period, setPeriod] = useState<DashboardPeriod>('all');
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [trends, setTrends] = useState<DashboardTrends | null>(null);
  
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
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        if (axios.isAxiosError(err) && err.response) {
          setError(err.response.data.message || 'Failed to load dashboard data.');
        } else {
          setError('An unexpected error occurred while loading your dashboard.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [period]);

  const handleLogout = () => {
    logout();
    navigate('/login');
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
          <Link to="/transactions" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
            <Receipt className="w-4 h-4" />
            Transactions
          </Link>
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 hidden sm:flex">
            <User className="w-4 h-4 text-gray-400" />
            <span className="font-medium text-gray-700">{user?.name || 'User'}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
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

        {/* Loading State */}
        {isLoading && !summary && (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Loading your financial data...</p>
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

            {/* Trends Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Income vs Expense Trends</h3>
                <p className="text-sm text-gray-500">Visualizing your cash flow over the selected period.</p>
              </div>
              <TrendChart data={trends.data} />
            </div>

          </div>
        )}

      </main>
    </div>
  );
};

export default Dashboard;
