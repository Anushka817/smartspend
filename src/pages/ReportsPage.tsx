import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Category } from '../types';
import {
  Download,
  Printer,
  Calendar,
  TrendingUp,
  TrendingDown,
  PieChart as PieIcon,
  BarChart3,
  Sparkles,
  FileText,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Scale,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

const PALETTE = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#64748B', '#F97316'];

const ALL_CATEGORIES: Category[] = [
  'Food & Dining',
  'Shopping & Retail',
  'Transportation',
  'Housing & Rent',
  'Utilities & Bills',
  'Healthcare & Medical',
  'Education',
  'Entertainment & Leisure',
  'Salary & Earnings',
  'Investments',
  'Personal Care',
  'Other',
];

export const ReportsPage: React.FC = () => {
  const {
    transactions,
    currentMonthBudget,
    selectedMonth,
    formatCurrency,
    monthlyIncome,
    monthlyExpense,
    monthlyNetBalance,
    monthlySavingsRate,
    savingsGoals,
    theme,
  } = useApp();

  const [dateRange, setDateRange] = useState<'current' | 'all' | 'custom'>('current');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [reportTab, setReportTab] = useState<'statement' | 'weekly' | 'budgets'>('statement');

  // Transactions in report scope
  const scopedTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (dateRange === 'current') {
        if (!t.date.startsWith(selectedMonth)) return false;
      } else if (dateRange === 'custom') {
        if (customStart && t.date < customStart) return false;
        if (customEnd && t.date > customEnd) return false;
      }
      if (categoryFilter !== 'all' && t.category !== categoryFilter) {
        return false;
      }
      return true;
    });
  }, [transactions, dateRange, selectedMonth, customStart, customEnd, categoryFilter]);

  const totalInflow = scopedTransactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);

  const totalOutflow = scopedTransactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);

  const netSavings = totalInflow - totalOutflow;

  // Category breakdown for scoped data
  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    scopedTransactions.forEach((t) => {
      if (t.type === 'expense') {
        map[t.category] = (map[t.category] || 0) + t.amount;
      }
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [scopedTransactions]);

  // Daily Spending Trend within scope
  const dailyTrendData = useMemo(() => {
    const map: Record<string, { date: string; income: number; expense: number }> = {};
    scopedTransactions.forEach((t) => {
      if (!map[t.date]) {
        map[t.date] = { date: t.date.slice(5), income: 0, expense: 0 };
      }
      if (t.type === 'income') map[t.date].income += t.amount;
      if (t.type === 'expense') map[t.date].expense += t.amount;
    });
    return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
  }, [scopedTransactions]);

  // Weekly spending summary (Week 1, Week 2, Week 3, Week 4+)
  const weeklyBreakdown = useMemo(() => {
    const weeks = [
      { name: 'Week 1 (Days 1–7)', expense: 0, income: 0, count: 0 },
      { name: 'Week 2 (Days 8–14)', expense: 0, income: 0, count: 0 },
      { name: 'Week 3 (Days 15–21)', expense: 0, income: 0, count: 0 },
      { name: 'Week 4+ (Days 22–End)', expense: 0, income: 0, count: 0 },
    ];

    scopedTransactions.forEach((t) => {
      const day = parseInt(t.date.slice(8), 10);
      let weekIdx = 0;
      if (day > 21) weekIdx = 3;
      else if (day > 14) weekIdx = 2;
      else if (day > 7) weekIdx = 1;

      if (t.type === 'expense') weeks[weekIdx].expense += t.amount;
      if (t.type === 'income') weeks[weekIdx].income += t.amount;
      weeks[weekIdx].count += 1;
    });

    return weeks;
  }, [scopedTransactions]);

  // Budget vs Actual Comparison per category
  const budgetComparisons = useMemo(() => {
    return currentMonthBudget.categoryBudgets.map((b) => {
      const spent = scopedTransactions
        .filter((t) => t.type === 'expense' && t.category === b.category)
        .reduce((sum, t) => sum + t.amount, 0);

      const allocated = b.allocatedAmount;
      const variance = allocated - spent;
      const pct = allocated > 0 ? Math.round((spent / allocated) * 100) : (spent > 0 ? 100 : 0);

      return {
        category: b.category,
        allocated,
        spent,
        variance,
        pct,
        isOver: pct > 100,
        isWarning: pct >= 80 && pct <= 100,
      };
    });
  }, [currentMonthBudget, scopedTransactions]);

  const handlePrint = () => {
    window.print();
  };

  const exportCSV = () => {
    const headers = ['ID', 'Date', 'Title', 'Type', 'Category', 'Amount', 'Payment Method', 'Notes'];
    const rows = scopedTransactions.map((tx) => [
      tx.id,
      tx.date,
      `"${tx.title.replace(/"/g, '""')}"`,
      tx.type,
      `"${tx.category}"`,
      tx.amount,
      `"${tx.paymentMethod}"`,
      `"${(tx.notes || '').replace(/"/g, '""')}"`,
    ]);
    const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const uri = encodeURI(csv);
    const link = document.createElement('a');
    link.href = uri;
    link.download = `smartspend_report_${dateRange === 'current' ? selectedMonth : 'export'}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Print/Export Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Reports & Analytics
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Audit weekly & monthly spending summaries, category breakdowns, and budget variance comparisons.
          </p>
        </div>

        <div className="flex items-center gap-2.5 no-print">
          <button
            onClick={exportCSV}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Filtered CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Date & Category Filter Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setDateRange('current')}
              className={`px-3 py-1.5 font-semibold rounded-md transition-colors ${
                dateRange === 'current'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500'
              }`}
            >
              Current Month ({selectedMonth})
            </button>
            <button
              onClick={() => setDateRange('all')}
              className={`px-3 py-1.5 font-semibold rounded-md transition-colors ${
                dateRange === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500'
              }`}
            >
              All Historical
            </button>
            <button
              onClick={() => setDateRange('custom')}
              className={`px-3 py-1.5 font-semibold rounded-md transition-colors ${
                dateRange === 'custom'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500'
              }`}
            >
              Custom Dates
            </button>
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
          >
            <option value="all">All Categories</option>
            {ALL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {dateRange === 'custom' && (
          <div className="flex items-center gap-2 text-xs">
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>
        )}
      </div>

      {/* Report Section Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs w-fit no-print">
        <button
          onClick={() => setReportTab('statement')}
          className={`px-3.5 py-1.5 font-semibold rounded-md transition-colors ${
            reportTab === 'statement'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Overview Statement
        </button>
        <button
          onClick={() => setReportTab('weekly')}
          className={`px-3.5 py-1.5 font-semibold rounded-md transition-colors ${
            reportTab === 'weekly'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Weekly Spend Breakdown
        </button>
        <button
          onClick={() => setReportTab('budgets')}
          className={`px-3.5 py-1.5 font-semibold rounded-md transition-colors ${
            reportTab === 'budgets'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Budget vs Actual Variance
        </button>
      </div>

      {/* Main Statement Container */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-2xs">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
              SmartSpend Financial Audit Statement
            </h1>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Generated on {new Date().toLocaleDateString()} · Timeframe: {dateRange === 'current' ? selectedMonth : 'Filtered Range'} · {scopedTransactions.length} matching transactions
            </span>
          </div>
          <div className="sm:text-right">
            <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 block">
              STATUS: RECONCILED
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Category filter: {categoryFilter}
            </span>
          </div>
        </div>

        {/* Executive Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
            <span className="text-[11px] text-slate-500 block mb-1">Total Inflow</span>
            <span className="text-xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
              +{formatCurrency(totalInflow)}
            </span>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
            <span className="text-[11px] text-slate-500 block mb-1">Total Outflow</span>
            <span className="text-xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400">
              -{formatCurrency(totalOutflow)}
            </span>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
            <span className="text-[11px] text-slate-500 block mb-1">Net Cash Surplus</span>
            <span className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {formatCurrency(netSavings)}
            </span>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
            <span className="text-[11px] text-slate-500 block mb-1">Net Savings Rate</span>
            <span className="text-xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
              {totalInflow > 0 ? Math.round(((totalInflow - totalOutflow) / totalInflow) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* VIEW 1: Overview Statement */}
        {reportTab === 'statement' && (
          <div className="space-y-6">
            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              {/* Daily Outflow Velocity */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Daily Outflow Velocity
                </h3>
                <div className="h-64 bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3">
                  {dailyTrendData.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs text-slate-400">
                      No data points in this timeframe
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dailyTrendData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? 'rgba(148, 163, 184, 0.15)' : 'rgba(148, 163, 184, 0.25)'} />
                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: theme === 'dark' ? '#94A3B8' : '#64748B' }} />
                        <YAxis tick={{ fontSize: 10, fill: theme === 'dark' ? '#94A3B8' : '#64748B' }} tickFormatter={(val) => `${val / 1000}k`} />
                        <Tooltip
                          formatter={(val: any) => [formatCurrency(Number(val)), 'Outflow']}
                          contentStyle={{
                            backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
                            borderColor: theme === 'dark' ? '#334155' : '#E2E8F0',
                            borderRadius: '8px',
                            fontSize: '11px',
                            color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          }}
                        />
                        <Bar dataKey="expense" fill="#EF4444" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Category Proportions */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Category Distribution
                </h3>
                <div className="h-64 bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 flex items-center justify-center">
                  {categoryData.length === 0 ? (
                    <span className="text-xs text-slate-400">No expense records</span>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={75}
                          innerRadius={45}
                          paddingAngle={3}
                        >
                          {categoryData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(val: any) => [formatCurrency(Number(val)), 'Spent']}
                          contentStyle={{
                            backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
                            borderColor: theme === 'dark' ? '#334155' : '#E2E8F0',
                            borderRadius: '8px',
                            fontSize: '11px',
                            color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            {/* Detailed Category Table */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Category Breakdown Statement
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                      <th className="py-2.5 px-3 font-semibold">Expense Category</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Total Outflow</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Share of Outflows</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {categoryData.map((item) => {
                      const share = totalOutflow > 0 ? Math.round((item.value / totalOutflow) * 100) : 0;
                      return (
                        <tr key={item.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                          <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white">
                            {item.name}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                            {formatCurrency(item.value)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-500">
                            {share}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: Weekly Spending Summary */}
        {reportTab === 'weekly' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Weekly Spending Progression
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                    <th className="py-3 px-3 font-semibold">Week Interval</th>
                    <th className="py-3 px-3 font-semibold text-right">Total Outflow</th>
                    <th className="py-3 px-3 font-semibold text-right">Total Inflow</th>
                    <th className="py-3 px-3 font-semibold text-right">Weekly Net Balance</th>
                    <th className="py-3 px-3 font-semibold text-right">Recorded Entries</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {weeklyBreakdown.map((w) => {
                    const net = w.income - w.expense;
                    return (
                      <tr key={w.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                        <td className="py-3 px-3 font-sans font-semibold text-slate-900 dark:text-white">
                          {w.name}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-rose-600 dark:text-rose-400">
                          -{formatCurrency(w.expense)}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                          +{formatCurrency(w.income)}
                        </td>
                        <td className={`py-3 px-3 text-right font-bold ${net >= 0 ? 'text-slate-900 dark:text-white' : 'text-rose-500'}`}>
                          {formatCurrency(net)}
                        </td>
                        <td className="py-3 px-3 text-right text-slate-500">
                          {w.count} txs
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 3: Planned Budget vs Actual Variance Comparison */}
        {reportTab === 'budgets' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Category Budget Variance (Planned vs Actual)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                    <th className="py-3 px-3 font-semibold">Category</th>
                    <th className="py-3 px-3 font-semibold text-right">Allocated Budget</th>
                    <th className="py-3 px-3 font-semibold text-right">Actual Spent</th>
                    <th className="py-3 px-3 font-semibold text-right">Variance Headroom</th>
                    <th className="py-3 px-3 font-semibold text-right">Utilization</th>
                    <th className="py-3 px-3 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {budgetComparisons.map((b) => (
                    <tr key={b.category} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="py-3 px-3 font-sans font-semibold text-slate-900 dark:text-white">
                        {b.category}
                      </td>
                      <td className="py-3 px-3 text-right text-slate-600 dark:text-slate-300">
                        {formatCurrency(b.allocated)}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-white">
                        {formatCurrency(b.spent)}
                      </td>
                      <td className={`py-3 px-3 text-right font-bold ${b.variance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {b.variance >= 0 ? `+${formatCurrency(b.variance)}` : `-${formatCurrency(Math.abs(b.variance))}`}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {b.pct}%
                      </td>
                      <td className="py-3 px-3 text-center">
                        {b.isOver ? (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 rounded">
                            EXCEEDED
                          </span>
                        ) : b.isWarning ? (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 rounded">
                            NEAR LIMIT
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded">
                            ON TRACK
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
