import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../common/Sidebar';
import { Header } from '../common/Header';
import { AddTransactionModal } from '../modals/AddTransactionModal';
import { ToastContainer } from '../common/ToastContainer';
import { Plus } from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addTxOpen, setAddTxOpen] = useState(false);
  const location = useLocation();

  // Determine current page title
  const getPageTitle = (pathname: string): string => {
    if (pathname === '/app') return 'Financial Overview';
    if (pathname.startsWith('/transactions')) return 'Transactions & Ledger';
    if (pathname.startsWith('/budgets')) return 'Smart Budget Planner';
    if (pathname.startsWith('/shopping')) return 'Smart Shopping Planner';
    if (pathname.startsWith('/comparison')) return 'Product Price Comparison';
    if (pathname.startsWith('/savings')) return 'Savings Goals & Challenges';
    if (pathname.startsWith('/bills')) return 'Recurring Bills & Subscriptions';
    if (pathname.startsWith('/reports')) return 'Reports & Analytics';
    if (pathname.startsWith('/settings')) return 'Preferences & Settings';
    return 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col antialiased text-slate-900 dark:text-slate-100 transition-colors relative">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        <Header
          pageTitle={getPageTitle(location.pathname)}
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenAddTransaction={() => setAddTxOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6 pb-24">
          <Outlet context={{ openAddTransaction: () => setAddTxOpen(true) }} />
        </main>
      </div>

      {/* Feature 5: Floating Quick Add Expense Button (Accessible throughout authenticated app) */}
      <div className="fixed bottom-6 right-6 z-40 group">
        <button
          onClick={() => setAddTxOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-full shadow-lg shadow-emerald-900/20 hover:shadow-xl hover:shadow-emerald-900/30 transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-hidden focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          aria-label="Quick Add Expense"
        >
          <div className="w-5 h-5 rounded-full bg-emerald-500/50 flex items-center justify-center shrink-0">
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <span className="text-xs font-semibold whitespace-nowrap tracking-wide">
            Add Expense
          </span>
        </button>
      </div>

      {/* Quick Add Transaction Modal */}
      <AddTransactionModal isOpen={addTxOpen} onClose={() => setAddTxOpen(false)} />

      {/* Toast Feedback */}
      <ToastContainer />
    </div>
  );
};
