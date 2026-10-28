import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Category } from '../types';
import { Modal } from '../components/common/Modal';
import {
  PieChart,
  AlertTriangle,
  CheckCircle2,
  Edit2,
  Calendar,
  Plus,
  TrendingUp,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

const ALL_CATEGORIES: Category[] = [
  'Food & Dining',
  'Shopping & Retail',
  'Transportation',
  'Housing & Rent',
  'Utilities & Bills',
  'Healthcare & Medical',
  'Education',
  'Entertainment & Leisure',
  'Personal Care',
  'Other',
];

export const BudgetsPage: React.FC = () => {
  const {
    currentMonthBudget,
    updateMonthlyBudget,
    selectedMonth,
    setSelectedMonth,
    categorySpendingMap,
    monthlyExpense,
    formatCurrency,
  } = useApp();

  const [isEditingBudgetModal, setIsEditingBudgetModal] = useState(false);
  const [editTotalBudget, setEditTotalBudget] = useState(String(currentMonthBudget.totalBudget));
  const [categoryAllocations, setCategoryAllocations] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    ALL_CATEGORIES.forEach((cat) => {
      const match = currentMonthBudget.categoryBudgets.find((b) => b.category === cat);
      map[cat] = match ? match.allocatedAmount : 0;
    });
    return map;
  });

  const handleOpenEdit = () => {
    setEditTotalBudget(String(currentMonthBudget.totalBudget));
    const map: Record<string, number> = {};
    ALL_CATEGORIES.forEach((cat) => {
      const match = currentMonthBudget.categoryBudgets.find((b) => b.category === cat);
      map[cat] = match ? match.allocatedAmount : 0;
    });
    setCategoryAllocations(map);
    setIsEditingBudgetModal(true);
  };

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedTotal = parseFloat(editTotalBudget) || 0;
    const catList = Object.entries(categoryAllocations).map(([category, allocatedAmount]) => ({
      category: category as Category,
      allocatedAmount: Number(allocatedAmount) || 0,
    }));
    updateMonthlyBudget(parsedTotal, catList);
    setIsEditingBudgetModal(false);
  };

  const totalAllocated = Object.values(categoryAllocations).reduce((s, a) => s + (Number(a) || 0), 0);
  const totalBudgetNum = currentMonthBudget.totalBudget;
  const overallUsedPct = totalBudgetNum > 0 ? Math.round((monthlyExpense / totalBudgetNum) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Smart Budget Planner
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure monthly expenditure targets and receive automatic early-warning alerts before breaching limits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenEdit}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Configure Budgets</span>
          </button>
        </div>
      </div>

      {/* Overview Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
            Total Monthly Budget ({selectedMonth})
          </span>
          <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {formatCurrency(totalBudgetNum)}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            Set limit for all outflows
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
            Total Spent Outflow
          </span>
          <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {formatCurrency(monthlyExpense)}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            {overallUsedPct}% utilized so far
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
            Available Allowance Margin
          </span>
          <span
            className={`text-2xl font-bold font-mono tabular-nums ${
              totalBudgetNum - monthlyExpense >= 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {formatCurrency(Math.max(0, totalBudgetNum - monthlyExpense))}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            {totalBudgetNum - monthlyExpense >= 0 ? 'Remaining headroom' : 'Over limit!'}
          </span>
        </div>
      </div>

      {/* Global Warning Banner if near limit */}
      {overallUsedPct >= 100 ? (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
          <div className="text-xs text-rose-800 dark:text-rose-200">
            <strong className="font-bold">Budget Exceeded!</strong> You have spent {overallUsedPct}% of your allocated {formatCurrency(totalBudgetNum)} budget. 
            Review category allocations to avoid extending debt.
          </div>
        </div>
      ) : overallUsedPct >= 80 ? (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <div className="text-xs text-amber-800 dark:text-amber-200">
            <strong className="font-bold">Caution: 80% Threshold Reached.</strong> You have utilized {overallUsedPct}% of your monthly cap. Only {formatCurrency(totalBudgetNum - monthlyExpense)} remaining.
          </div>
        </div>
      ) : null}

      {/* Category Budgets Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Category Breakdown & Utilization
          </h3>
          <span className="text-xs text-slate-500">
            {ALL_CATEGORIES.length} Categories Tracked
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ALL_CATEGORIES.map((cat) => {
            const budgetItem = currentMonthBudget.categoryBudgets.find((b) => b.category === cat);
            const allocated = budgetItem ? budgetItem.allocatedAmount : 0;
            const spent = categorySpendingMap[cat] || 0;
            const pct = allocated > 0 ? Math.round((spent / allocated) * 100) : spent > 0 ? 100 : 0;
            const isOver = pct > 100;
            const isWarning = pct >= 80 && pct <= 100;

            return (
              <div
                key={cat}
                className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                      {cat}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      Cap: {formatCurrency(allocated)}
                    </span>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs font-bold font-mono tabular-nums ${
                        isOver
                          ? 'text-rose-600 dark:text-rose-400'
                          : isWarning
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {pct}%
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {isOver ? 'Exceeded' : isWarning ? 'Caution' : 'On Track'}
                    </span>
                  </div>
                </div>

                {/* Accessible Progress Bar */}
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isOver
                        ? 'bg-rose-500'
                        : isWarning
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Spent: {formatCurrency(spent)}</span>
                  <span>
                    {allocated - spent >= 0
                      ? `Left: ${formatCurrency(allocated - spent)}`
                      : `Over by: ${formatCurrency(spent - allocated)}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Budget Modal */}
      {isEditingBudgetModal && (
        <Modal
          isOpen={true}
          onClose={() => setIsEditingBudgetModal(false)}
          title={`Edit Budgets for ${selectedMonth}`}
          description="Adjust overall monthly spending cap and individual category targets."
          maxWidth="max-w-xl"
        >
          <form onSubmit={handleSaveBudget} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Overall Total Budget Cap *
              </label>
              <input
                type="number"
                min="0"
                step="any"
                required
                value={editTotalBudget}
                onChange={(e) => setEditTotalBudget(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-hidden"
              />
              <span className="text-[11px] text-slate-400 block mt-1">
                Sum of categories allocated: {formatCurrency(totalAllocated)}
              </span>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Category Allocations
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
                {ALL_CATEGORIES.map((cat) => (
                  <div key={cat} className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                    <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 block mb-1 truncate">
                      {cat}
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={categoryAllocations[cat] ?? 0}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setCategoryAllocations((prev) => ({ ...prev, [cat]: val }));
                      }}
                      className="w-full px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsEditingBudgetModal(false)}
                className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs"
              >
                Save Budget Plan
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
