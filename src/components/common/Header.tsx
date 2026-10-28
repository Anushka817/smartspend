import React from 'react';
import { useApp } from '../../context/AppContext';
import { Menu, Plus, Sun, Moon, Calendar } from 'lucide-react';

interface HeaderProps {
  onOpenSidebar: () => void;
  onOpenAddTransaction: () => void;
  pageTitle: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSidebar,
  onOpenAddTransaction,
  pageTitle,
}) => {
  const { theme, toggleTheme, selectedMonth, setSelectedMonth } = useApp();

  // Generate selectable months (last 6 months and next 2 months)
  const monthOptions = React.useMemo(() => {
    const list: { label: string; value: string }[] = [];
    const date = new Date();
    for (let i = -6; i <= 2; i++) {
      const d = new Date(date.getFullYear(), date.getMonth() + i, 1);
      const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      list.push({ label, value: val });
    }
    return list;
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-6 py-3.5 bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 backdrop-blur-xs transition-colors">
      {/* Left: Mobile trigger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          aria-label="Open sidebar navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Month Selector */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-lg text-xs">
          <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-transparent text-slate-700 dark:text-slate-200 font-medium text-xs focus:outline-hidden cursor-pointer"
            aria-label="Select budget and analysis month"
          >
            {monthOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="dark:bg-slate-900">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          aria-label={theme === 'dark' ? 'Currently in dark mode. Click to switch to light mode' : 'Currently in light mode. Click to switch to dark mode'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <Moon className="w-4 h-4 text-emerald-400" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500" />
          )}
        </button>

        {/* Quick Add Transaction Button */}
        <button
          onClick={onOpenAddTransaction}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-lg shadow-xs transition-colors whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add Transaction</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>
    </header>
  );
};
