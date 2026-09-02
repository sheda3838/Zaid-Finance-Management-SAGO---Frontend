import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { LogOut, ArrowLeft, Receipt } from 'lucide-react';

const Transactions: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 text-indigo-600">
          <Receipt className="w-6 h-6" />
          <span className="text-xl font-bold tracking-tight">Transactions</span>
        </div>
        
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Your Transactions</h1>
          <p className="text-gray-500 mt-1">{user?.name}'s transaction history placeholder.</p>
        </div>

        <div className="flex-1 bg-white border border-gray-200 border-dashed rounded-2xl flex flex-col items-center justify-center text-center p-8 shadow-sm">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mb-4">
            <Receipt className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Transactions UI Coming Soon</h2>
          <p className="text-gray-500 max-w-md">
            This is a protected page. Only authenticated users can see this.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Transactions;
