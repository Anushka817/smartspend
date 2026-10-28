import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Transaction } from '../types';
import { Modal } from '../components/common/Modal';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  AlertTriangle,
  ArrowRight,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Target,
  Repeat,
  ShieldCheck,
  Eye,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart as RechartsPie,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

interface OutletContextType {
  openAddTransaction: () => void;
}

const CATEGORY_COLORS = [
  '#10B981', // emerald
  '#3B82F6', // blue
  '#F59E0B', // amber
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#14B8A6', // teal
  '#64748B', // slate
];

export const DashboardOverview: React.FC = () => {
  const { openAddTransaction } = useOutletContext<OutletContextType>();
  const {
    profile,
    theme,
    selectedMonth,
    formatCurrency,
    monthlyIncome,
    monthlyExpense,
    previousMonthlyExpense,
    monthOverMonthExpenseDiff,
    monthOverMonthPercentage,
    monthlyNetBalance,
    monthlyBudgetRemaining,
    monthlySavingsRate,
    currentMonthBudget,
    categorySpendingMap,
    transactions,
    savingsGoals,
    savingChallenges,
    upcomingUnpaidBills,
    recurringMonthlyTotal,
    shoppingLists,
    insights,
    toggleBillPaid,
  } = useApp();

  const [trendView, setTrendView] = useState<'flow' | 'daily' | 'categories'>('flow');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Recent 6 transactions
  const recentTransactions = React.useMemo(() => {
    return [...transactions]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 6);
  }, [transactions]);

  // Data for Category Pie Chart
  const pieChartData = React.useMemo(() => {
    return Object.entries(categorySpendingMap)
      .filter(([_, amount]) => amount > 0)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [categorySpendingMap]);

  // Data for Income vs Expense vs Budget comparison bar chart
  const barChartData = React.useMemo(() => {
    return [
      {
        name: 'Inflow',
        amount: monthlyIncome,
        fill: '#10B981',
      },
      {
        name: 'Outflow',
        amount: monthlyExpense,
        fill: '#EF4444',
      },
      {
        name: 'Budget Cap',
        amount: currentMonthBudget.totalBudget,
        fill: '#64748B',
      },
    ];
  }, [monthlyIncome, monthlyExpense, currentMonthBudget]);

  // Daily Spending Trend for current month
  const dailySpendingData = React.useMemo(() => {
    const map: Record<string, number> = {};
    const filtered = transactions.filter(
      (t) => t.type === 'expense' && t.date.startsWith(selectedMonth)
    );
    filtered.forEach((t) => {
      const day = t.date.slice(8);
      map[day] = (map[day] || 0) + t.amount;
    });

    const entries = Object.entries(map).map(([day, amount]) => ({
      day: `Day ${day}`,
      amount,
    }));
    return entries.sort((a, b) => a.day.localeCompare(b.day));
  }, [transactions, selectedMonth]);

  const budgetUsagePercent = currentMonthBudget.totalBudget > 0
    ? Math.round((monthlyExpense / currentMonthBudget.totalBudget) * 100)
    : 0;

  const isBudgetWarning = budgetUsagePercent >= 80;
  const isBudgetExceeded = budgetUsagePercent > 100;

  // Active top savings goal
  const primaryGoal = savingsGoals[0];
  const primaryGoalPct = primaryGoal && primaryGoal.targetAmount > 0
    ? Math.min(100, Math.round((primaryGoal.currentAmount / primaryGoal.targetAmount) * 100))
    : 0;

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            Welcome back, {profile.name}
          </h2>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mt-1">
            <span>
              Auditing <strong className="text-slate-800 dark:text-slate-200">{selectedMonth}</strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Savings Rate: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{monthlySavingsRate}%</strong>
            </span>
            {previousMonthlyExpense > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 font-mono">
                  MoM Outflow:{' '}
                  {monthOverMonthExpenseDiff >= 0 ? (
                    <span className="text-rose-500 font-semibold inline-flex items-center">
                      +{Math.abs(monthOverMonthPercentage)}%
                    </span>
                  ) : (
                    <span className="text-emerald-500 font-semibold inline-flex items-center">
                      -{Math.abs(monthOverMonthPercentage)}%
                    </span>
                  )}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={openAddTransaction}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Record</span>
          </button>
          <Link
            to="/reports"
            className="px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span>View Reports</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Primary KPI Metric Cards (Single elevation, tabular figures) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Income */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Total Inflow
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {formatCurrency(monthlyIncome)}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
              Salary & earnings for {selectedMonth}
            </span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Total Outflow
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {formatCurrency(monthlyExpense)}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
              {budgetUsagePercent}% of monthly spending budget
            </span>
          </div>
        </div>

        {/* Available Net Balance */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Net Surplus Cash
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span
              className={`text-xl font-bold font-mono tabular-nums ${
                monthlyNetBalance >= 0
                  ? 'text-slate-900 dark:text-white'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {formatCurrency(monthlyNetBalance)}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
              Inflow minus outflow
            </span>
          </div>
        </div>

        {/* Monthly Budget Remaining */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Remaining Budget Cap
            </span>
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                isBudgetExceeded
                  ? 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400'
                  : isBudgetWarning
                  ? 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                  : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
              }`}
            >
              {isBudgetWarning ? <AlertTriangle className="w-4 h-4" /> : <PiggyBank className="w-4 h-4" />}
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {formatCurrency(monthlyBudgetRemaining)}
            </span>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    isBudgetExceeded
                      ? 'bg-rose-500'
                      : isBudgetWarning
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, budgetUsagePercent)}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                {budgetUsagePercent}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature 1: Intelligent Smart Spending Insights Section (Real Data-Driven) */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Intelligent Spending Insights
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Data-driven anomaly detection and expense optimization suggestions calculated from ledger history
              </p>
            </div>
          </div>

          <span className="text-[11px] font-mono text-slate-400 self-start sm:self-auto">
            {insights.length} active insights
          </span>
        </div>

        {insights.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            Log transactions to unlock real-time spending insights, anomaly alerts, and reduction tips.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {insights.map((ins) => {
              const isWarning = ins.type === 'warning';
              const isSuccess = ins.type === 'success';
              const isTip = ins.type === 'tip';

              return (
                <div
                  key={ins.id}
                  className="p-4 rounded-xl border bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between space-y-2.5"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        {isWarning && <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                        {isSuccess && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                        {isTip && <Zap className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                        {!isWarning && !isSuccess && !isTip && <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {ins.title}
                        </span>
                      </div>
                      {ins.metric && (
                        <span className="text-[10px] font-mono font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded shrink-0">
                          {ins.metric}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {ins.description}
                    </p>
                  </div>

                  {ins.actionableTip && (
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-1.5">
                      <strong className="font-semibold text-slate-700 dark:text-slate-200 shrink-0">Tip:</strong>
                      <span>{ins.actionableTip}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Feature 6: Advanced Interactive Visual Analytics (Charts with Timeframe/Type toggles) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Multi-View Analytics */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Expenditure & Cash Flow Analytics
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Visualize spending velocity, inflows vs limits, and category distribution
              </p>
            </div>

            {/* View Selector Controls */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs self-start sm:self-auto">
              <button
                onClick={() => setTrendView('flow')}
                className={`px-3 py-1.5 font-semibold rounded-md transition-colors ${
                  trendView === 'flow'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Inflow vs Cap
              </button>
              <button
                onClick={() => setTrendView('daily')}
                className={`px-3 py-1.5 font-semibold rounded-md transition-colors ${
                  trendView === 'daily'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Daily Outflow
              </button>
              <button
                onClick={() => setTrendView('categories')}
                className={`px-3 py-1.5 font-semibold rounded-md transition-colors ${
                  trendView === 'categories'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Category Shares
              </button>
            </div>
          </div>

          {/* Chart Display Container */}
          <div className="h-68 w-full pt-2">
            {trendView === 'flow' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? 'rgba(148, 163, 184, 0.15)' : 'rgba(148, 163, 184, 0.25)'} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: theme === 'dark' ? '#94A3B8' : '#64748B' }} />
                  <YAxis tick={{ fontSize: 11, fill: theme === 'dark' ? '#94A3B8' : '#64748B' }} tickFormatter={(val) => `${val / 1000}k`} />
                  <Tooltip
                    formatter={(value: any) => [formatCurrency(Number(value) || 0), 'Amount']}
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
                      borderColor: theme === 'dark' ? '#334155' : '#E2E8F0',
                      color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                    {barChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}

            {trendView === 'daily' && (
              dailySpendingData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No daily expense data points recorded for {selectedMonth}.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailySpendingData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? 'rgba(148, 163, 184, 0.15)' : 'rgba(148, 163, 184, 0.25)'} />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: theme === 'dark' ? '#94A3B8' : '#64748B' }} />
                    <YAxis tick={{ fontSize: 11, fill: theme === 'dark' ? '#94A3B8' : '#64748B' }} tickFormatter={(val) => `${val / 1000}k`} />
                    <Tooltip
                      formatter={(value: any) => [formatCurrency(Number(value) || 0), 'Spent']}
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
                        borderColor: theme === 'dark' ? '#334155' : '#E2E8F0',
                        color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        fontSize: '12px',
                      }}
                    />
                    <Line type="monotone" dataKey="amount" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              )
            )}

            {trendView === 'categories' && (
              pieChartData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No expense category records in this period.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={pieChartData.slice(0, 6)}
                    margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={theme === 'dark' ? 'rgba(148, 163, 184, 0.15)' : 'rgba(148, 163, 184, 0.25)'} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: theme === 'dark' ? '#94A3B8' : '#64748B' }} tickFormatter={(val) => `${val / 1000}k`} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: theme === 'dark' ? '#94A3B8' : '#64748B' }} width={110} />
                    <Tooltip
                      formatter={(value: any) => [formatCurrency(Number(value) || 0), 'Spent']}
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
                        borderColor: theme === 'dark' ? '#334155' : '#E2E8F0',
                        color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="value" fill="#10B981" radius={[0, 4, 4, 0]}>
                      {pieChartData.slice(0, 6).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )
            )}
          </div>
        </div>

        {/* Right: Savings Goal with Circular Progress Ring & Recurring Totals */}
        <div className="lg:col-span-4 space-y-6">
          {/* Animated Circular Progress Ring Card */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Savings Milestone
                </h3>
              </div>
              <Link to="/savings" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline">
                Challenges →
              </Link>
            </div>

            {primaryGoal ? (
              <div className="flex flex-col items-center text-center space-y-3">
                {/* SVG Progress Ring */}
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      strokeWidth="8"
                      className="text-slate-100 dark:text-slate-800"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      strokeWidth="8"
                      className="text-emerald-500 transition-all duration-700 ease-out"
                      stroke="currentColor"
                      fill="transparent"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 - (251.2 * primaryGoalPct) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                      {primaryGoalPct}%
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                      Achieved
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {primaryGoal.title}
                  </h4>
                  <div className="flex items-center justify-center gap-1.5 font-mono text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {formatCurrency(primaryGoal.currentAmount)}
                    </span>
                    <span>/</span>
                    <span>{formatCurrency(primaryGoal.targetAmount)}</span>
                  </div>
                </div>

                {savingChallenges.length > 0 && (
                  <div className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-left text-xs flex items-center justify-between">
                    <div className="truncate mr-2">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Active Sprint</span>
                      <span className="font-semibold text-slate-900 dark:text-white truncate block">
                        {savingChallenges[0].title}
                      </span>
                    </div>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                      {Math.round((savingChallenges[0].currentAmount / savingChallenges[0].targetAmount) * 100)}%
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-400">
                No active goals. <Link to="/savings" className="text-emerald-500 underline">Create one</Link> to start tracking.
              </div>
            )}
          </div>

          {/* Recurring Subscriptions Summary Card */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Repeat className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Recurring Commitments
                </h3>
              </div>
              <Link to="/bills" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline">
                Calendar →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                <span className="text-[10px] text-slate-400 block mb-0.5">Monthly Burn</span>
                <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                  {formatCurrency(recurringMonthlyTotal)}
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                <span className="text-[10px] text-slate-400 block mb-0.5">Projected Annual</span>
                <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                  {formatCurrency(recurringMonthlyTotal * 12)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Multi-Module Grid: Recent Transactions, Upcoming Bills, Active Shopping Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Transactions List (8 Cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Recent Ledger Activity
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Latest debit and credit entries with detail inspections
              </p>
            </div>
            <Link
              to="/transactions"
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>View All Transactions</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                onClick={() => setSelectedTx(tx)}
                className="py-3 px-2 rounded-lg flex items-center justify-between gap-3 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      tx.type === 'income'
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                        : 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400'
                    }`}
                  >
                    {tx.type === 'income' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">
                      {tx.title}
                    </p>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                      <span>{tx.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{tx.date}</span>
                      <span aria-hidden="true">·</span>
                      <span>{tx.paymentMethod}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 flex items-center gap-2.5">
                  <span
                    className={`font-mono font-bold tabular-nums text-xs ${
                      tx.type === 'income'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
                  </span>
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Lower Stack: Upcoming Bills & Shopping Lists */}
        <div className="lg:col-span-4 space-y-6">
          {/* Upcoming Bills Card */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Upcoming Obligations
                </h3>
              </div>
              <Link to="/bills" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline">
                All Bills
              </Link>
            </div>

            {upcomingUnpaidBills.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">
                All scheduled obligations are marked as paid!
              </p>
            ) : (
              <div className="space-y-2.5">
                {upcomingUnpaidBills.slice(0, 3).map((bill) => (
                  <div
                    key={bill.id}
                    className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-semibold text-slate-900 dark:text-white truncate">
                        {bill.title}
                      </p>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Due {bill.dueDate} ({bill.recurringFrequency})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {formatCurrency(bill.amount)}
                      </span>
                      <button
                        onClick={() => toggleBillPaid(bill.id)}
                        className="p-1 text-slate-400 hover:text-emerald-500 transition-colors"
                        title="Mark as paid"
                        aria-label={`Mark bill ${bill.title} as paid`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Shopping List Card */}
          {shoppingLists.length > 0 && (
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Active Shopping
                  </h3>
                </div>
                <Link to="/shopping" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline">
                  Planner →
                </Link>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  {shoppingLists[0].title}
                </p>
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>
                    {shoppingLists[0].items.filter((i) => i.isPurchased).length} /{' '}
                    {shoppingLists[0].items.length} items acquired
                  </span>
                  <span className="font-mono font-medium text-slate-900 dark:text-white">
                    Budget: {formatCurrency(shoppingLists[0].budget)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected Transaction Detail Modal */}
      {selectedTx && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedTx(null)}
          title="Transaction Details"
          description="Detailed inspection of this ledger record."
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Total Amount</span>
              <span
                className={`text-2xl font-bold font-mono tabular-nums ${
                  selectedTx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                }`}
              >
                {selectedTx.type === 'income' ? '+' : '-'} {formatCurrency(selectedTx.amount)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 block mb-0.5">Title</span>
                <span className="font-semibold text-slate-900 dark:text-white">{selectedTx.title}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Category</span>
                <span className="font-semibold text-slate-900 dark:text-white">{selectedTx.category}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Date</span>
                <span className="font-mono text-slate-900 dark:text-white">{selectedTx.date}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Payment Method</span>
                <span className="font-medium text-slate-900 dark:text-white">{selectedTx.paymentMethod}</span>
              </div>
            </div>

            {selectedTx.notes && (
              <div>
                <span className="text-slate-400 block mb-0.5">Notes</span>
                <p className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300">
                  {selectedTx.notes}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="px-4 py-2 text-xs font-semibold bg-slate-900 dark:bg-slate-700 text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
