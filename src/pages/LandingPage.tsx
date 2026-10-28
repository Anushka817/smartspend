import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { useApp } from '../context/AppContext';
import {
  ArrowRight,
  TrendingUp,
  PieChart,
  ShoppingBag,
  Scale,
  Target,
  ShieldCheck,
  ChevronDown,
  CheckCircle,
  GraduationCap,
  Briefcase,
  Users,
  Wallet,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { monthlyIncome, monthlyExpense, monthlyBudgetRemaining, formatCurrency } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'How does SmartSpend differ from standard expense trackers?',
      a: 'SmartSpend unites comprehensive expense tracking with an active shopping planner and store price comparison tool. Instead of merely recording money you have already spent, SmartSpend helps you plan ahead, compare prices between stores, calculate unit savings, and protect your budget before you tap your card.',
    },
    {
      q: 'Do you require my bank login or credit card credentials?',
      a: 'Never. SmartSpend operates with zero bank scraping and never asks for sensitive banking passwords, CVV numbers, or card pins. You maintain 100% control over your personal data with privacy-first local storage and optional private Supabase cloud sync.',
    },
    {
      q: 'Can I use SmartSpend across different currencies?',
      a: 'Yes! SmartSpend supports Indian Rupee (₹), US Dollar ($), Euro (€), British Pound (£), Japanese Yen (¥), Canadian Dollar (C$), and Australian Dollar (A$). You can change your preferred currency anytime in Settings.',
    },
    {
      q: 'How does the Product Price Comparison work?',
      a: 'You can input quotes from multiple retail stores or online merchants for any item. SmartSpend automatically normalizes pack sizes (per gram, per milliliter, per unit) so you can identify the genuine lowest unit price and eliminate deceptive packaging tricks.',
    },
    {
      q: 'Can I export my transactions for taxes or spreadsheet analysis?',
      a: 'Yes, SmartSpend provides one-click CSV export of all filtered transactions, as well as complete JSON database backup and restore features.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased transition-colors">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Value Prop */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 rounded-lg text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Spend Smarter. Save Better.</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.15] text-balance">
                Your Money. Your Goals. <span className="text-emerald-600 dark:text-emerald-400">Your Control.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                SmartSpend eliminates financial anxiety for students, working professionals, and families. 
                Track spending, control category budgets, plan smart grocery runs, and compare product prices in one unified workspace.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/app"
                  className="px-6 py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-lg shadow-sm transition-colors inline-flex items-center gap-2"
                >
                  <span>Start Saving Smarter</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/app"
                  className="px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  <span>Explore Interactive Demo</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>

              {/* Trust markers */}
              <div className="flex items-center gap-6 pt-4 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Zero Bank Credentials Required</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Instant Offline Local Persistence</span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive Mockup Frame */}
            <div className="lg:col-span-5">
              <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      Live Snapshot
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Monthly Cash Flow & Health
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-md">
                    Healthy Margin
                  </span>
                </div>

                {/* Key Metrics Strip */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                      Total Inflow
                    </span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                      {formatCurrency(monthlyIncome || 97700)}
                    </span>
                  </div>
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                      Budget Cushion Left
                    </span>
                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                      {formatCurrency(monthlyBudgetRemaining || 20500)}
                    </span>
                  </div>
                </div>

                {/* Mini Budget Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">
                      Budget Utilization
                    </span>
                    <span className="font-mono text-slate-900 dark:text-white font-semibold">
                      51%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-[51%]" />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Spent: {formatCurrency(monthlyExpense || 21500)}</span>
                    <span>Cap: {formatCurrency(42000)}</span>
                  </div>
                </div>

                {/* Mini Quick Preview Items */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                        $
                      </div>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        Organic Groceries
                      </span>
                    </div>
                    <span className="font-mono text-rose-500 font-medium">- {formatCurrency(3850)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-[10px]">
                        ★
                      </div>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        Emergency Fund Milestone
                      </span>
                    </div>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">74% Target</span>
                  </div>
                </div>

                <Link
                  to="/app"
                  className="block text-center w-full py-2.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/50 rounded-lg transition-colors"
                >
                  Open Full Dashboard Experience →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars Section */}
      <section id="features" className="py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Engineered for Complete Financial Mastery
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Every feature works together to build clarity, prevent overspending, and turn everyday savings into life-changing milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Frictionless Expense Tracking
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Log income and expenses in seconds with payment methods, custom tags, rich category filters, and immediate metric recalculations.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <PieChart className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Adaptive Monthly Budgets
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Set category limits with 80% caution thresholds and 100% breach notifications. See exactly how much breathing room remains before month-end.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Smart Shopping Planner
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Build dedicated shopping lists with quantity, unit estimates, and check-offs. Compare planned estimates against real checkout receipts.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Store Price Comparison
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Enter quotes from local stores and online retailers. SmartSpend automatically normalizes pack sizes to reveal genuine unit-rate savings.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Targeted Savings Goals
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Define targets for emergency funds, tech upgrades, or travel. Track progress milestones and calculate needed monthly deposits.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Data Sovereignty & Privacy
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Your data stays strictly yours. Full local offline storage capability, zero third-party ads, and one-click JSON and CSV data exports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Three Steps to Effortless Control
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Transforming your relationship with money takes minutes, not hours of tedious manual spreadsheets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-3xl font-mono font-bold text-emerald-600/30 dark:text-emerald-400/20 block mb-2">
                01
              </span>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">
                Set Income & Category Caps
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Define your target monthly spend across essentials like Groceries, Utilities, and Leisure with realistic safety margins.
              </p>
            </div>

            <div className="relative p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-3xl font-mono font-bold text-emerald-600/30 dark:text-emerald-400/20 block mb-2">
                02
              </span>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">
                Plan Shopping & Compare Rates
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Prepare itemized shopping lists and cross-reference store prices before you buy to consistently capture maximum savings.
              </p>
            </div>

            <div className="relative p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-3xl font-mono font-bold text-emerald-600/30 dark:text-emerald-400/20 block mb-2">
                03
              </span>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">
                Watch Your Savings Accelerate
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Channel protected surplus directly into your milestone goals, celebrating every threshold reached without financial stress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audiences / Benefits Section */}
      <section id="benefits" className="py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Tailored for Every Stage of Life
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Whether you are managing a tight student stipend or orchestrating family household budgets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Student */}
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Students & Campus Life
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Avoid mid-semester cash crunch. Manage textbook expenses, track pocket money, plan grocery group runs, and build disciplined money habits early.
              </p>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Canteen & transit micro-tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Stationery & course fee planning</span>
                </li>
              </ul>
            </div>

            {/* Working Professional */}
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Working Professionals
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Take control of salary credits, freelance earnings, lifestyle creep, recurring SaaS subscriptions, and emergency fund investments.
              </p>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Salary vs freelance tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Emergency fund milestone targets</span>
                </li>
              </ul>
            </div>

            {/* Families */}
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Households & Families
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Coordinate monthly utility bills, medical premiums, child education funds, and weekly supermarket bulk shopping without surprises.
              </p>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Utility bill schedule & alerts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Supermarket unit price comparison</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center space-y-3 mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Clear, transparent answers about how SmartSpend protects your financial privacy and simplifies your money.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-semibold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      openFaq === idx ? 'rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-16 bg-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-6 space-y-6">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
            Take Command of Your Finances Today
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Join thousands of users who track smarter, shop wiser, and achieve their savings goals with SmartSpend.
          </p>
          <div className="pt-2">
            <Link
              to="/app"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 active:bg-emerald-500 rounded-lg shadow-sm transition-colors"
            >
              <span>Launch SmartSpend Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-slate-950 text-slate-400 text-xs border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-200">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <span className="font-bold">SmartSpend</span>
            <span className="text-slate-500 text-[11px]">· Spend Smarter. Save Better.</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <a href="#features" className="hover:text-slate-200 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-slate-200 transition-colors">
              How It Works
            </a>
            <a href="#benefits" className="hover:text-slate-200 transition-colors">
              Benefits
            </a>
            <a href="#faq" className="hover:text-slate-200 transition-colors">
              FAQ
            </a>
          </div>

          <p className="text-slate-500 text-[11px]">
            © {new Date().getFullYear()} SmartSpend. Built with React & TypeScript.
          </p>
        </div>
      </footer>
    </div>
  );
};
