import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Check, ArrowRight, Wallet, Target, Sparkles, DollarSign, Sun, Moon } from 'lucide-react';

const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
];

const GOAL_TEMPLATES = [
  { title: 'Emergency Fund (3-6 Months)', target: 200000, category: 'Emergency Fund' },
  { title: 'Laptop or Hardware Upgrade', target: 120000, category: 'Electronics & Work' },
  { title: 'Vacation & Travel Fund', target: 50000, category: 'Travel & Vacations' },
  { title: 'Debt Payoff Acceleration', target: 80000, category: 'Debt Relief' },
];

export const OnboardingPage: React.FC = () => {
  const { profile, updateProfile, addSavingsGoal, addToast, theme, toggleTheme } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedCurrency, setSelectedCurrency] = useState(profile.currency || '₹');
  const [monthlyIncome, setMonthlyIncome] = useState(profile.monthlyIncome ? String(profile.monthlyIncome) : '60000');
  const [monthlyBudget, setMonthlyBudget] = useState(profile.defaultMonthlyBudget ? String(profile.defaultMonthlyBudget) : '35000');
  const [selectedGoal, setSelectedGoal] = useState(GOAL_TEMPLATES[0]);
  const [customGoalTitle, setCustomGoalTitle] = useState('');
  const [customGoalAmount, setCustomGoalAmount] = useState('');

  const handleFinish = () => {
    const incomeNum = parseFloat(monthlyIncome) || 0;
    const budgetNum = parseFloat(monthlyBudget) || 35000;

    updateProfile({
      currency: selectedCurrency,
      monthlyIncome: incomeNum,
      defaultMonthlyBudget: budgetNum,
      isOnboarded: true,
    });

    // Create the chosen goal
    const goalTitle = customGoalTitle.trim() || selectedGoal.title;
    const goalTarget = parseFloat(customGoalAmount) || selectedGoal.target;
    const nextYear = new Date().getFullYear() + 1;

    addSavingsGoal({
      title: goalTitle,
      targetAmount: goalTarget,
      targetDate: `${nextYear}-06-30`,
      category: selectedGoal.category,
    });

    addToast('Welcome to SmartSpend! Your workspace is ready.', 'success');
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-slate-900 dark:text-slate-100 transition-colors relative">
      {/* Top Right Theme Toggle */}
      <div className="absolute top-4 right-4">
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          aria-label={theme === 'dark' ? 'Currently in dark mode. Click to switch to light mode' : 'Currently in light mode. Click to switch to dark mode'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <Moon className="w-4 h-4 text-emerald-400" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500" />
          )}
        </button>
      </div>

      <div className="max-w-xl w-full mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-full text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Step {step} of 3 · Setup Your Workspace</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Personalize Your SmartSpend Experience
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Customize your base currency, estimated cash flow, and target milestone.
          </p>
        </div>

        {/* Wizard Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
          {/* Step 1: Currency Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  1. Choose Your Primary Currency
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  All budgets, shopping lists, and analytics will be formatted using this currency symbol.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {CURRENCIES.map((c) => {
                  const isSelected = selectedCurrency === c.symbol;
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => setSelectedCurrency(c.symbol)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold font-mono">{c.symbol}</span>
                        {isSelected && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                      </div>
                      <span className="text-xs font-medium block mt-1 truncate">{c.name}</span>
                      <span className="text-[10px] text-slate-400 uppercase">{c.code}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs transition-colors"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Income & Budget Targets */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  2. Monthly Income & Spending Target
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Helps SmartSpend calculate your savings rate and alert you when spending approaches your limit.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Estimated Monthly Inflow / Income ({selectedCurrency})
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-medium">
                      {selectedCurrency}
                    </span>
                    <input
                      type="number"
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(e.target.value)}
                      placeholder="e.g., 60000"
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono tabular-nums focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-1">
                    Optional. Used for personal savings rate calculations.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Monthly Spending Cap ({selectedCurrency})
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-medium">
                      {selectedCurrency}
                    </span>
                    <input
                      type="number"
                      value={monthlyBudget}
                      onChange={(e) => setMonthlyBudget(e.target.value)}
                      placeholder="e.g., 35000"
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono tabular-nums focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-1">
                    We will issue early warning indicators at 80% and 100% threshold utilization.
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs transition-colors"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Preferred Savings Goal */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  3. Choose Your Primary Savings Goal
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Give your savings an explicit target to unlock motivation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {GOAL_TEMPLATES.map((tmpl, idx) => {
                  const isSelected = selectedGoal.title === tmpl.title;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedGoal(tmpl);
                        setCustomGoalTitle('');
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        {isSelected && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                      </div>
                      <span className="text-xs font-semibold block">{tmpl.title}</span>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        Target: {selectedCurrency} {tmpl.target.toLocaleString()}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Or Custom Goal */}
              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Or customize your goal:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={customGoalTitle}
                    onChange={(e) => setCustomGoalTitle(e.target.value)}
                    placeholder="Custom goal title"
                    className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                  />
                  <input
                    type="number"
                    value={customGoalAmount}
                    onChange={(e) => setCustomGoalAmount(e.target.value)}
                    placeholder={`Target (${selectedCurrency})`}
                    className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs transition-colors"
                >
                  <span>Complete Setup & Open Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
