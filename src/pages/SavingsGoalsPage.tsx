import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SavingsGoal, SavingChallenge } from '../types';
import { Modal } from '../components/common/Modal';
import {
  Target,
  Plus,
  Trash2,
  TrendingUp,
  Award,
  Calendar,
  CheckCircle2,
  Sparkles,
  Edit2,
  Clock,
  ArrowRight,
  Flame,
  Trophy,
  ShieldCheck,
  PiggyBank,
  Check,
  Zap,
} from 'lucide-react';

export const SavingsGoalsPage: React.FC = () => {
  const {
    savingsGoals,
    addSavingsGoal,
    deleteSavingsGoal,
    addSavingsContribution,
    savingChallenges,
    addSavingChallenge,
    deleteSavingChallenge,
    contributeToChallenge,
    achievementBadges,
    formatCurrency,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'goals' | 'challenges' | 'badges'>('goals');

  // Goals modal
  const [newGoalModal, setNewGoalModal] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [goalCategory, setGoalCategory] = useState('Emergency Fund');

  const [depositModalGoal, setDepositModalGoal] = useState<SavingsGoal | null>(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositNote, setDepositNote] = useState('');

  const [viewingHistoryGoal, setViewingHistoryGoal] = useState<SavingsGoal | null>(null);

  // Challenges modal
  const [newChallengeModal, setNewChallengeModal] = useState(false);
  const [challengeTitle, setChallengeTitle] = useState('');
  const [challengeDesc, setChallengeDesc] = useState('');
  const [challengeTarget, setChallengeTarget] = useState('2000');
  const [challengeDuration, setChallengeDuration] = useState<'1 Week' | '2 Weeks' | '1 Month'>('2 Weeks');
  const [challengeCategory, setChallengeCategory] = useState('Food & Dining');

  const [contributeChallengeItem, setContributeChallengeItem] = useState<SavingChallenge | null>(null);
  const [challengeContribAmount, setChallengeContribAmount] = useState('');

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(targetAmount);
    if (!goalTitle.trim() || isNaN(amount) || amount <= 0 || !targetDate) return;

    addSavingsGoal({
      title: goalTitle.trim(),
      targetAmount: amount,
      targetDate,
      category: goalCategory.trim() || 'General Savings',
    });

    setGoalTitle('');
    setTargetAmount('');
    setTargetDate('');
    setNewGoalModal(false);
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositModalGoal) return;
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) return;

    addSavingsContribution(depositModalGoal.id, amount, depositNote.trim() || undefined);
    setDepositAmount('');
    setDepositNote('');
    setDepositModalGoal(null);
  };

  const handleCreateChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    const tgt = parseFloat(challengeTarget) || 0;
    if (!challengeTitle.trim() || tgt <= 0) return;

    const startDate = new Date().toISOString().split('T')[0];
    const endDays = challengeDuration === '1 Week' ? 7 : challengeDuration === '2 Weeks' ? 14 : 30;
    const endDateObj = new Date(Date.now() + endDays * 24 * 3600 * 1000);
    const endDate = endDateObj.toISOString().split('T')[0];

    addSavingChallenge({
      title: challengeTitle.trim(),
      description: challengeDesc.trim() || 'Discipline-driven micro savings challenge',
      targetAmount: tgt,
      duration: challengeDuration,
      startDate,
      endDate,
      category: challengeCategory,
    });

    setChallengeTitle('');
    setChallengeDesc('');
    setNewChallengeModal(false);
  };

  const handleContributeChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contributeChallengeItem) return;
    const amt = parseFloat(challengeContribAmount);
    if (isNaN(amt) || amt <= 0) return;

    contributeToChallenge(contributeChallengeItem.id, amt);
    setChallengeContribAmount('');
    setContributeChallengeItem(null);
  };

  // Summary figures
  const totalTargetAllGoals = savingsGoals.reduce((s, g) => s + g.targetAmount, 0);
  const totalSavedAllGoals = savingsGoals.reduce((s, g) => s + g.currentAmount, 0);
  const overallAchievedPct = totalTargetAllGoals > 0 ? Math.round((totalSavedAllGoals / totalTargetAllGoals) * 100) : 0;

  const unlockedBadgesCount = achievementBadges.filter((b) => b.isUnlocked).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Savings Goals, Challenges & Achievements
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Turn your financial ambitions into animated milestone targets, compete in saving sprints, and earn genuine badges.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setNewChallengeModal(true)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>New Challenge</span>
          </button>
          <button
            onClick={() => setNewGoalModal(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Goal</span>
          </button>
        </div>
      </div>

      {/* Aggregate Milestones Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
            Total Target Capital
          </span>
          <span className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {formatCurrency(totalTargetAllGoals)}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">Across {savingsGoals.length} milestone goals</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
            Total Saved Capital
          </span>
          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
            {formatCurrency(totalSavedAllGoals)}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            {overallAchievedPct}% milestone completion
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
            Achievements Unlocked
          </span>
          <span className="text-xl font-bold text-amber-600 dark:text-amber-400 font-mono tabular-nums">
            {unlockedBadgesCount} / {achievementBadges.length} Badges
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            {savingChallenges.filter((c) => c.isCompleted).length} challenges completed
          </span>
        </div>
      </div>

      {/* Section View Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs w-fit">
        <button
          onClick={() => setActiveTab('goals')}
          className={`px-4 py-2 font-semibold rounded-md transition-colors flex items-center gap-2 ${
            activeTab === 'goals'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Target className="w-3.5 h-3.5 text-emerald-500" />
          <span>Milestone Goals ({savingsGoals.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('challenges')}
          className={`px-4 py-2 font-semibold rounded-md transition-colors flex items-center gap-2 ${
            activeTab === 'challenges'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          <span>Saving Challenges ({savingChallenges.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('badges')}
          className={`px-4 py-2 font-semibold rounded-md transition-colors flex items-center gap-2 ${
            activeTab === 'badges'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Trophy className="w-3.5 h-3.5 text-yellow-500" />
          <span>Achievements ({unlockedBadgesCount})</span>
        </button>
      </div>

      {/* TAB 1: Savings Goals with Animated Progress Rings */}
      {activeTab === 'goals' && (
        savingsGoals.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
            <Target className="w-10 h-10 text-slate-400 mx-auto opacity-50" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No Active Savings Goals
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Set up an emergency fund, travel fund, or laptop upgrade goal to start tracking progress with animated rings.
            </p>
            <button
              onClick={() => setNewGoalModal(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg"
            >
              Create Your First Goal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savingsGoals.map((goal) => {
              const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
              const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

              // Calculate estimated monthly contribution needed
              const now = new Date();
              const target = new Date(goal.targetDate);
              const monthsLeft = Math.max(
                1,
                (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth())
              );
              const monthlyPace = remaining > 0 ? Math.ceil(remaining / monthsLeft) : 0;
              const isCompleted = goal.currentAmount >= goal.targetAmount;

              return (
                <div
                  key={goal.id}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 flex flex-col justify-between shadow-2xs"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          {goal.category}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                          {goal.title}
                        </h3>
                      </div>

                      <button
                        onClick={() => deleteSavingsGoal(goal.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 rounded-md transition-colors"
                        title="Delete Goal"
                        aria-label="Delete goal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Feature 3: Animated SVG Progress Ring */}
                    <div className="flex items-center justify-center py-2">
                      <div className="relative w-32 h-32 flex items-center justify-center">
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
                            strokeDashoffset={251.2 - (251.2 * pct) / 100}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                          <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                            {pct}%
                          </span>
                          <span className="text-[9px] text-slate-400 uppercase tracking-wider">
                            Saved
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Amount Labels */}
                    <div className="text-center font-mono">
                      <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(goal.currentAmount)}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Target: {formatCurrency(goal.targetAmount)} · Due {goal.targetDate}
                      </div>
                    </div>

                    {/* Pacing Advice Box */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs space-y-1">
                      {isCompleted ? (
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Goal Achieved! 100% Funded.</span>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                            <span>Remaining Timeline:</span>
                            <span className="font-mono font-medium">{monthsLeft} month{monthsLeft > 1 ? 's' : ''}</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                            <span>Estimated Pace:</span>
                            <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">
                              {formatCurrency(monthlyPace)} / mo
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions & History Button */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 gap-2">
                    <button
                      onClick={() => setViewingHistoryGoal(goal)}
                      className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white font-medium"
                    >
                      History ({goal.contributions.length})
                    </button>

                    <button
                      onClick={() => {
                        setDepositModalGoal(goal);
                        setDepositAmount('');
                        setDepositNote('');
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-2xs flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Deposit Funds</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* TAB 2: Personal Saving Challenges */}
      {activeTab === 'challenges' && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Flame className="w-5 h-5 text-amber-500 shrink-0" />
              <div className="text-xs">
                <strong className="font-bold text-slate-900 dark:text-white">Micro-Saving Sprints:</strong> Commit to weekly or monthly behavioral habits to accelerate discretionary savings without feeling restricted.
              </div>
            </div>
            <button
              onClick={() => setNewChallengeModal(true)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg shrink-0"
            >
              + Join Challenge
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savingChallenges.map((ch) => {
              const pct = Math.min(100, Math.round((ch.currentAmount / ch.targetAmount) * 100));
              return (
                <div
                  key={ch.id}
                  className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between shadow-2xs"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded">
                            {ch.duration}
                          </span>
                          {ch.isCompleted && (
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                              COMPLETED
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">
                          {ch.title}
                        </h3>
                      </div>
                      <button
                        onClick={() => deleteSavingChallenge(ch.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 rounded"
                        title="Delete challenge"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {ch.description}
                    </p>

                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-baseline justify-between text-xs font-mono">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {formatCurrency(ch.currentAmount)}
                        </span>
                        <span className="text-slate-400">
                          Target: {formatCurrency(ch.targetAmount)}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            ch.isCompleted ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                        <span>{pct}% accumulated</span>
                        <span>Ends {ch.endDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Category: {ch.category}
                    </span>
                    {!ch.isCompleted ? (
                      <button
                        onClick={() => {
                          setContributeChallengeItem(ch);
                          setChallengeContribAmount('500');
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Log Progress</span>
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Sprint Won!</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Milestone Achievements & Badges Shelf */}
      {activeTab === 'badges' && (
        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Genuine Milestone Badges
              </h3>
              <p className="text-xs text-slate-500">
                Badges automatically unlock as you hit real savings milestones, complete challenges, and manage your ledger.
              </p>
            </div>
            <span className="px-3 py-1 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold text-xs rounded-full font-mono">
              {unlockedBadgesCount} / {achievementBadges.length} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {achievementBadges.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border transition-all text-center space-y-2.5 flex flex-col items-center justify-between ${
                  badge.isUnlocked
                    ? 'bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-700 shadow-2xs ring-1 ring-amber-400/20'
                    : 'bg-slate-50/60 dark:bg-slate-800/20 border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    badge.isUnlocked
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  <Trophy className="w-6 h-6" />
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {badge.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                    {badge.description}
                  </p>
                </div>

                <div className="w-full pt-1">
                  {badge.isUnlocked ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                      <Check className="w-3 h-3" />
                      <span>UNLOCKED</span>
                    </span>
                  ) : (
                    <div className="space-y-1">
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-slate-400 rounded-full"
                          style={{ width: `${badge.progress}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-mono text-slate-400">
                        {badge.progress}% reached
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Goal Modal */}
      {newGoalModal && (
        <Modal
          isOpen={true}
          onClose={() => setNewGoalModal(false)}
          title="Create New Savings Goal"
          description="Define a target amount and estimated deadline."
        >
          <form onSubmit={handleCreateGoal} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Goal Title *
              </label>
              <input
                type="text"
                required
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                placeholder="e.g., Emergency Buffer (6 Months)"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Amount *
                </label>
                <input
                  type="number"
                  step="any"
                  min="1"
                  required
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="e.g., 100000"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Date *
                </label>
                <input
                  type="date"
                  required
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <input
                type="text"
                value={goalCategory}
                onChange={(e) => setGoalCategory(e.target.value)}
                placeholder="Emergency, Tech, Travel, Education"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setNewGoalModal(false)}
                className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg"
              >
                Create Goal
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* New Challenge Modal */}
      {newChallengeModal && (
        <Modal
          isOpen={true}
          onClose={() => setNewChallengeModal(false)}
          title="Create Personal Saving Challenge"
          description="Set a micro-saving sprint target to curb discretionary outflows."
        >
          <form onSubmit={handleCreateChallenge} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Challenge Title *
              </label>
              <input
                type="text"
                required
                value={challengeTitle}
                onChange={(e) => setChallengeTitle(e.target.value)}
                placeholder="e.g., 14-Day Zero Food Delivery"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Description / Rule
              </label>
              <input
                type="text"
                value={challengeDesc}
                onChange={(e) => setChallengeDesc(e.target.value)}
                placeholder="e.g., Cook all weeknight dinners at home and bank the savings"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Savings *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={challengeTarget}
                  onChange={(e) => setChallengeTarget(e.target.value)}
                  placeholder="2000"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Duration
                </label>
                <select
                  value={challengeDuration}
                  onChange={(e) => setChallengeDuration(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                >
                  <option value="1 Week">1 Week</option>
                  <option value="2 Weeks">2 Weeks</option>
                  <option value="1 Month">1 Month</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setNewChallengeModal(false)}
                className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg"
              >
                Start Challenge
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Deposit Contribution Modal */}
      {depositModalGoal && (
        <Modal
          isOpen={true}
          onClose={() => setDepositModalGoal(null)}
          title={`Deposit into "${depositModalGoal.title}"`}
          description="Record an addition towards this milestone."
        >
          <form onSubmit={handleDeposit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Deposit Amount *
              </label>
              <input
                type="number"
                step="any"
                min="1"
                required
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="e.g., 5000"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Contribution Note (Optional)
              </label>
              <input
                type="text"
                value={depositNote}
                onChange={(e) => setDepositNote(e.target.value)}
                placeholder="e.g., Monthly salary allocation or bonus deposit"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setDepositModalGoal(null)}
                className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg"
              >
                Confirm Deposit
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Challenge Contribute Modal */}
      {contributeChallengeItem && (
        <Modal
          isOpen={true}
          onClose={() => setContributeChallengeItem(null)}
          title={`Log Progress: ${contributeChallengeItem.title}`}
          description="Enter savings accumulated from avoiding an expense."
        >
          <form onSubmit={handleContributeChallenge} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Savings Amount *
              </label>
              <input
                type="number"
                step="any"
                min="1"
                required
                value={challengeContribAmount}
                onChange={(e) => setChallengeContribAmount(e.target.value)}
                placeholder="e.g., 500"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-hidden"
              />
            </div>
            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setContributeChallengeItem(null)}
                className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg"
              >
                Record Progress
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Contribution History Modal */}
      {viewingHistoryGoal && (
        <Modal
          isOpen={true}
          onClose={() => setViewingHistoryGoal(null)}
          title={`Contribution History: ${viewingHistoryGoal.title}`}
          description="Log of all deposits contributed to this goal."
        >
          <div className="space-y-3">
            {viewingHistoryGoal.contributions.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No contribution deposits recorded yet.
              </p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto pr-1">
                {viewingHistoryGoal.contributions.map((c) => (
                  <div key={c.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block font-mono">
                        +{formatCurrency(c.amount)}
                      </span>
                      {c.note && (
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {c.note}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">{c.date}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setViewingHistoryGoal(null)}
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
