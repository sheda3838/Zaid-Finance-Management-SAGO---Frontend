import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, User } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 text-indigo-600">
          <LayoutDashboard className="w-6 h-6" />
          <span className="text-xl font-bold tracking-tight">SAGO</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
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
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.name}. Here's an overview of your finances.</p>
        </div>

        {/* Placeholder for future dashboard content */}
        <div className="flex-1 bg-white border border-gray-200 border-dashed rounded-2xl flex flex-col items-center justify-center text-center p-8 shadow-sm">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mb-4">
            <LayoutDashboard className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Dashboard UI Coming Soon</h2>
          <p className="text-gray-500 max-w-md">
            This is a placeholder page to verify the authentication flow. 
            The actual dashboard design, summary cards, charts, and transactions will be implemented later.
          </p>
          {user && (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100 inline-block text-left text-sm">
              <p><span className="font-medium text-gray-700">Authenticated as:</span> {user.name}</p>
              <p><span className="font-medium text-gray-700">Email:</span> {user.email}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
