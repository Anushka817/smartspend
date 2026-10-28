import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { StorageService } from '../services/storage';
import { Modal } from '../components/common/Modal';
import {
  Settings as SettingsIcon,
  User,
  DollarSign,
  Moon,
  Sun,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from 'lucide-react';

const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (₹)' },
  { code: 'USD', symbol: '$', name: 'US Dollar ($)' },
  { code: 'EUR', symbol: '€', name: 'Euro (€)' },
  { code: 'GBP', symbol: '£', name: 'British Pound (£)' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen (¥)' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar (C$)' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar (A$)' },
];

export const SettingsPage: React.FC = () => {
  const { profile, updateProfile, resetToDemoData, addToast, theme, setTheme } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [currency, setCurrency] = useState(profile.currency || '₹');
  const [income, setIncome] = useState(String(profile.monthlyIncome || '75000'));
  const [budget, setBudget] = useState(String(profile.defaultMonthlyBudget || '42000'));

  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importModalOpen, setImportModalOpen] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const inc = parseFloat(income) || 0;
    const bgt = parseFloat(budget) || 0;

    updateProfile({
      name: name.trim(),
      email: email.trim(),
      currency,
      monthlyIncome: inc,
      defaultMonthlyBudget: bgt,
    });
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
  };

  const handleExportJSON = () => {
    const dataStr = StorageService.exportAllData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `smartspend_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    addToast('Complete database exported to JSON', 'success');
  };

  const handleImportJSON = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importJsonText.trim()) return;
    const success = StorageService.importData(importJsonText);
    if (success) {
      addToast('Backup restored successfully! Refreshing...', 'success');
      setTimeout(() => window.location.reload(), 1000);
    } else {
      addToast('Failed to parse valid backup JSON', 'error');
    }
  };

  const handleResetConfirmed = () => {
    resetToDemoData();
    setResetModalOpen(false);
    setTimeout(() => window.location.reload(), 500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Banner */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Preferences & Settings
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Manage your personal profile, baseline currency, theme mode, and data portability.
        </p>
      </div>

      {/* Profile & Financial Baselines Form */}
      <form onSubmit={handleSaveProfile} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-5 shadow-2xs">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Profile & Financial Baselines</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Default values used when initializing new monthly budgets and computing savings rates.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Your Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Primary Currency *
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.symbol}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Monthly Inflow Baseline ({currency})
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Default Monthly Budget Cap ({currency})
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-hidden"
            />
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </form>

      {/* Visual Theme Section */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xs">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sun className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Visual Theme Appearance</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Switch between crisp light studio surfaces and deep midnight navy dark mode.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 max-w-sm">
          <button
            type="button"
            onClick={() => handleThemeChange('light')}
            className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all text-left focus:outline-hidden focus:ring-2 focus:ring-emerald-500 ${
              theme === 'light'
                ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
            aria-pressed={theme === 'light'}
          >
            <Sun className="w-4 h-4 text-amber-500 shrink-0" />
            <div>
              <span className="text-xs font-bold block">Light Theme</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Daylight studio</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleThemeChange('dark')}
            className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all text-left focus:outline-hidden focus:ring-2 focus:ring-emerald-500 ${
              theme === 'dark'
                ? 'border-emerald-600 bg-emerald-950/40 text-emerald-300 ring-2 ring-emerald-500/20'
                : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
            aria-pressed={theme === 'dark'}
          >
            <Moon className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-xs font-bold block">Dark Theme</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Midnight navy</span>
            </div>
          </button>
        </div>
      </div>

      {/* Data Sovereignty & Portability */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xs">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Data Portability & Backup</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Export a full JSON backup of all transactions, budgets, lists, and comparisons or restore from file.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportJSON}
            className="px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Full JSON Backup</span>
          </button>

          <button
            onClick={() => setImportModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Restore / Import JSON</span>
          </button>

          <button
            onClick={() => setResetModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 rounded-lg transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Privacy Architecture Notice */}
      <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/80 rounded-xl space-y-2 text-xs text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Privacy & Security Architecture</span>
        </div>
        <p className="leading-relaxed">
          SmartSpend does not collect bank login passwords, credit card numbers, or CVVs. All data is persisted client-side in your browser’s secure local storage sandbox, with optional direct user-isolated Supabase PostgreSQL sync when credentials are provided.
        </p>
      </div>

      {/* Reset Confirmation Modal */}
      {resetModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setResetModalOpen(false)}
          title="Reset to Demo State?"
          description="This will clear your current local ledger and restore the initial sample dataset (Alex Morgan demo profile)."
        >
          <div className="flex items-center justify-end gap-2.5 pt-3">
            <button
              type="button"
              onClick={() => setResetModalOpen(false)}
              className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleResetConfirmed}
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg"
            >
              Confirm Reset
            </button>
          </div>
        </Modal>
      )}

      {/* Import JSON Modal */}
      {importModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setImportModalOpen(false)}
          title="Import JSON Backup"
          description="Paste raw JSON contents from a previously exported SmartSpend backup file."
        >
          <form onSubmit={handleImportJSON} className="space-y-4">
            <textarea
              rows={8}
              required
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Paste backup JSON here..."
              className="w-full p-3 font-mono text-[11px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
            />
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setImportModalOpen(false)}
                className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg"
              >
                Restore Data
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
