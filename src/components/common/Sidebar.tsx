import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  ShoppingBag,
  Scale,
  Target,
  FileText,
  Settings,
  CalendarCheck,
  Wallet,
  LogOut,
  X,
  Database,
  Sun,
  Moon,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { profile, isSupabaseConfigured, resetToDemoData, theme, toggleTheme } = useApp();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Overview', to: '/app', icon: LayoutDashboard },
    { label: 'Transactions', to: '/transactions', icon: ArrowLeftRight },
    { label: 'Budgets', to: '/budgets', icon: PieChart },
    { label: 'Shopping Planner', to: '/shopping', icon: ShoppingBag },
    { label: 'Price Comparison', to: '/comparison', icon: Scale },
    { label: 'Savings & Challenges', to: '/savings', icon: Target },
    { label: 'Bills & Subscriptions', to: '/bills', icon: CalendarCheck },
    { label: 'Reports', to: '/reports', icon: FileText },
    { label: 'Settings', to: '/settings', icon: Settings },
  ];

  const handleSignOut = () => {
    navigate('/auth/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800 transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Area */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white block leading-none">
                SmartSpend
              </span>
              <span className="text-[11px] text-slate-400 font-normal">Spend Smarter. Save Better.</span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-md"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Storage State Indicator */}
        <div className="px-5 py-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isSupabaseConfigured ? 'Supabase Connected' : 'Local Storage Demo'}</span>
          </div>
          <button
            onClick={resetToDemoData}
            title="Reset demo data to initial defaults"
            className="text-[10px] text-slate-400 hover:text-emerald-400 underline underline-offset-2 transition-colors"
          >
            Reset Data
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/app'}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-semibold text-xs text-emerald-400 shrink-0">
                {profile.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate leading-tight">
                  {profile.name}
                </p>
                <p className="text-[11px] text-slate-400 truncate">{profile.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={toggleTheme}
                className="p-1.5 text-slate-400 hover:text-white rounded-md transition-colors focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-label={theme === 'dark' ? 'Currently in dark mode. Click to switch to light mode' : 'Currently in light mode. Click to switch to dark mode'}
              >
                {theme === 'dark' ? (
                  <Moon className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500" />
                )}
              </button>
              <button
                onClick={handleSignOut}
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-md transition-colors focus:outline-hidden focus:ring-1 focus:ring-rose-500"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
