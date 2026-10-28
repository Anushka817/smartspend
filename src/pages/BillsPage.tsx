import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Bill, Category } from '../types';
import { Modal } from '../components/common/Modal';
import {
  CalendarCheck,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Clock,
  Calendar,
  AlertCircle,
  Bell,
  Info,
  Repeat,
  Tv,
  Zap,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const CATEGORIES: Category[] = [
  'Utilities & Bills',
  'Housing & Rent',
  'Healthcare & Medical',
  'Entertainment & Leisure',
  'Education',
  'Shopping & Retail',
  'Transportation',
  'Other',
];

export const BillsPage: React.FC = () => {
  const {
    bills,
    addBill,
    deleteBill,
    toggleBillPaid,
    formatCurrency,
    recurringMonthlyTotal,
    recurringAnnualTotal,
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'unpaid' | 'paid' | 'subscriptions' | 'utilities'>('unpaid');
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number | null>(null);

  // Modal state
  const [newBillModal, setNewBillModal] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState<Category>('Utilities & Bills');
  const [recurringFrequency, setRecurringFrequency] = useState<'Monthly' | 'Quarterly' | 'Yearly' | 'Weekly' | 'One-Time'>('Monthly');
  const [billType, setBillType] = useState<'bill' | 'subscription'>('bill');
  const [provider, setProvider] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonthWeekday = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday

  const handleCreateBill = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!title.trim() || isNaN(amt) || amt <= 0 || !dueDate) return;

    addBill({
      title: title.trim(),
      amount: amt,
      dueDate,
      category,
      recurringFrequency,
      billType,
      provider: provider.trim() || undefined,
    });

    setTitle('');
    setAmount('');
    setDueDate('');
    setProvider('');
    setNewBillModal(false);
  };

  const processedBills = useMemo(() => {
    return bills.map((b) => {
      const isPast = b.dueDate < todayStr && !b.isPaid;
      const diffDays = Math.ceil(
        (new Date(b.dueDate).getTime() - new Date(todayStr).getTime()) / (1000 * 3600 * 24)
      );
      const isDueSoon = !b.isPaid && diffDays >= 0 && diffDays <= 5;
      const dueDay = parseInt(b.dueDate.split('-')[2], 10);
      return {
        ...b,
        isOverdue: isPast,
        isDueSoon,
        diffDays,
        dueDay,
      };
    }).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [bills, todayStr]);

  const filteredBills = processedBills.filter((b) => {
    if (filter === 'unpaid') return !b.isPaid;
    if (filter === 'paid') return b.isPaid;
    if (filter === 'subscriptions') return b.billType === 'subscription';
    if (filter === 'utilities') return b.billType !== 'subscription';
    return true;
  });

  const unpaidTotal = bills.filter((b) => !b.isPaid).reduce((s, b) => s + b.amount, 0);
  const paidTotal = bills.filter((b) => b.isPaid).reduce((s, b) => s + b.amount, 0);

  // Group bills by day for payment calendar
  const calendarDayBillsMap = useMemo(() => {
    const map: Record<number, typeof processedBills> = {};
    processedBills.forEach((b) => {
      if (!map[b.dueDay]) map[b.dueDay] = [];
      map[b.dueDay].push(b);
    });
    return map;
  }, [processedBills]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Recurring Bills & Subscriptions
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Audit fixed commitments, track subscription renewals, and keep utility obligations punctual.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setNewBillModal(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Bill / Subscription</span>
          </button>
        </div>
      </div>

      {/* Feature 4: Metric Cards Strip (Monthly & Annual Totals) */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
            Monthly Recurring Burn
          </span>
          <span className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {formatCurrency(recurringMonthlyTotal)}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            Normalized monthly rate
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
            Annual Projected Outflow
          </span>
          <span className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {formatCurrency(recurringAnnualTotal)}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            12-month commitment forecast
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
            Pending This Month
          </span>
          <span className="text-xl font-bold text-rose-600 dark:text-rose-400 font-mono tabular-nums">
            {formatCurrency(unpaidTotal)}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            {bills.filter((b) => !b.isPaid).length} unpaid obligations
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
            Due Soon & Overdue
          </span>
          <span className="text-xl font-bold text-amber-600 dark:text-amber-400 font-mono tabular-nums">
            {processedBills.filter((b) => b.isOverdue || b.isDueSoon).length} Critical
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            Due in &le; 5 days or past
          </span>
        </div>
      </div>

      {/* Feature 4: Upcoming Payment Calendar Grid */}
      <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Upcoming Payment Calendar ({now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })})
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Click any highlighted day to filter obligations
          </span>
        </div>

        {/* 7-column calendar grid */}
        <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="py-1 text-[11px] font-semibold text-slate-400">
              {d}
            </div>
          ))}

          {/* Empty cells before month start */}
          {Array.from({ length: firstDayOfMonthWeekday }).map((_, i) => (
            <div key={`empty-${i}`} className="h-10 rounded-lg bg-transparent" />
          ))}

          {/* Days of current month */}
          {Array.from({ length: daysInCurrentMonth }).map((_, i) => {
            const dayNum = i + 1;
            const billsOnDay = calendarDayBillsMap[dayNum] || [];
            const hasBills = billsOnDay.length > 0;
            const hasUnpaid = billsOnDay.some((b) => !b.isPaid);
            const isSelected = selectedCalendarDay === dayNum;
            const isToday = now.getDate() === dayNum;

            return (
              <button
                key={`day-${dayNum}`}
                type="button"
                onClick={() => setSelectedCalendarDay(isSelected ? null : dayNum)}
                className={`h-11 rounded-lg border text-left p-1.5 flex flex-col justify-between transition-all relative ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 ring-2 ring-emerald-500/20'
                    : hasBills
                    ? hasUnpaid
                      ? 'border-amber-300 dark:border-amber-800/80 bg-amber-50/40 dark:bg-amber-950/20'
                      : 'border-emerald-200 dark:border-emerald-900 bg-emerald-50/30 dark:bg-emerald-950/10'
                    : 'border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-[11px] font-mono font-medium ${
                      isToday
                        ? 'w-5 h-5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {dayNum}
                  </span>
                  {hasBills && (
                    <span
                      className={`w-2 h-2 rounded-full ${
                        hasUnpaid ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                    />
                  )}
                </div>

                {hasBills && (
                  <span className="text-[9px] font-mono font-semibold text-slate-600 dark:text-slate-300 truncate block">
                    {formatCurrency(billsOnDay.reduce((s, b) => s + b.amount, 0))}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {selectedCalendarDay && (
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg flex items-center justify-between text-xs">
            <span>
              Showing obligations scheduled on <strong>Day {selectedCalendarDay}</strong> (
              {(calendarDayBillsMap[selectedCalendarDay] || []).length} items)
            </span>
            <button
              onClick={() => setSelectedCalendarDay(null)}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
            >
              Clear Day Filter
            </button>
          </div>
        )}
      </div>

      {/* Bill List Container with Filter Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
            <button
              onClick={() => {
                setFilter('unpaid');
                setSelectedCalendarDay(null);
              }}
              className={`px-3 py-1.5 font-semibold rounded-md transition-colors ${
                filter === 'unpaid'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500'
              }`}
            >
              Pending ({bills.filter((b) => !b.isPaid).length})
            </button>
            <button
              onClick={() => {
                setFilter('paid');
                setSelectedCalendarDay(null);
              }}
              className={`px-3 py-1.5 font-semibold rounded-md transition-colors ${
                filter === 'paid'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500'
              }`}
            >
              Paid ({bills.filter((b) => b.isPaid).length})
            </button>
            <button
              onClick={() => {
                setFilter('subscriptions');
                setSelectedCalendarDay(null);
              }}
              className={`px-3 py-1.5 font-semibold rounded-md transition-colors ${
                filter === 'subscriptions'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500'
              }`}
            >
              Subscriptions ({bills.filter((b) => b.billType === 'subscription').length})
            </button>
            <button
              onClick={() => {
                setFilter('all');
                setSelectedCalendarDay(null);
              }}
              className={`px-3 py-1.5 font-semibold rounded-md transition-colors ${
                filter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500'
              }`}
            >
              All Records ({bills.length})
            </button>
          </div>
        </div>

        {filteredBills.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No bills found matching this filter criteria.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredBills
              .filter((b) => (selectedCalendarDay ? b.dueDay === selectedCalendarDay : true))
              .map((bill) => (
                <div
                  key={bill.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => toggleBillPaid(bill.id)}
                      className="p-1 text-slate-400 hover:text-emerald-500 shrink-0 transition-colors"
                      title={bill.isPaid ? 'Mark as unpaid' : 'Mark as paid'}
                      aria-label={`Toggle payment status for ${bill.title}`}
                    >
                      {bill.isPaid ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`font-semibold text-sm truncate ${
                            bill.isPaid
                              ? 'line-through text-slate-400'
                              : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {bill.title}
                        </span>

                        {bill.billType === 'subscription' && (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 rounded">
                            SUBSCRIPTION
                          </span>
                        )}

                        {bill.isOverdue && (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 rounded">
                            OVERDUE
                          </span>
                        )}
                        {bill.isDueSoon && (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 rounded">
                            DUE SOON
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        <span>{bill.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>Cadence: {bill.recurringFrequency}</span>
                        <span aria-hidden="true">·</span>
                        <span>Due: {bill.dueDate}</span>
                        {bill.provider && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>Provider: {bill.provider}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                    <div className="text-right">
                      <span className="font-mono text-base font-bold text-slate-900 dark:text-white block">
                        {formatCurrency(bill.amount)}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {bill.isPaid
                          ? `Paid on ${bill.paidDate || 'record'}`
                          : bill.diffDays === 0
                          ? 'Due Today'
                          : bill.diffDays < 0
                          ? `${Math.abs(bill.diffDays)} days overdue`
                          : `In ${bill.diffDays} days`}
                      </span>
                    </div>

                    <button
                      onClick={() => deleteBill(bill.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-md transition-colors"
                      title="Delete bill"
                      aria-label={`Delete ${bill.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* New Bill / Subscription Modal */}
      {newBillModal && (
        <Modal
          isOpen={true}
          onClose={() => setNewBillModal(false)}
          title="Schedule Recurring Bill or Subscription"
          description="Enter title, cost, due date, billing cycle, and service category."
        >
          <form onSubmit={handleCreateBill} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Obligation Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Netflix Premium 4K / Home Internet"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Amount *
                </label>
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Next Due Date *
                </label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Payment Frequency
                </label>
                <select
                  value={recurringFrequency}
                  onChange={(e) => setRecurringFrequency(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Yearly">Yearly</option>
                  <option value="Weekly">Weekly</option>
                  <option value="One-Time">One-Time</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Type
                </label>
                <select
                  value={billType}
                  onChange={(e) => setBillType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                >
                  <option value="bill">Utility / Essential Bill</option>
                  <option value="subscription">Digital / Recurring Subscription</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Provider (Optional)
                </label>
                <input
                  type="text"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  placeholder="e.g. Netflix, Airtel, ConEd"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setNewBillModal(false)}
                className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg"
              >
                Schedule Commitment
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
