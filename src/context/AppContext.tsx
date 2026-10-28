import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Transaction,
  MonthlyBudget,
  ShoppingList,
  ShoppingItem,
  StorePriceQuote,
  PriceComparison,
  StorePriceItem,
  SavingsGoal,
  SavingChallenge,
  AchievementBadge,
  Bill,
  UserProfile,
  Category,
  SmartInsight,
} from '../types';
import { StorageService, isSupabaseConfigured } from '../services/storage';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  isSupabaseConfigured: boolean;

  // Theme Management
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Selected Month State
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;

  // Transactions
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, tx: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // Budgets
  budgets: MonthlyBudget[];
  currentMonthBudget: MonthlyBudget;
  updateMonthlyBudget: (totalBudget: number, categoryBudgets: { category: Category; allocatedAmount: number }[]) => void;

  // Shopping Lists
  shoppingLists: ShoppingList[];
  addShoppingList: (title: string, budget: number) => string;
  updateShoppingList: (id: string, updates: Partial<ShoppingList>) => void;
  deleteShoppingList: (id: string) => void;
  addShoppingItem: (listId: string, item: Omit<ShoppingItem, 'id' | 'isPurchased'>) => void;
  toggleShoppingItem: (listId: string, itemId: string, actualPrice?: number) => void;
  deleteShoppingItem: (listId: string, itemId: string) => void;
  addStoreQuoteToItem: (listId: string, itemId: string, quote: Omit<StorePriceQuote, 'id'>) => void;
  removeStoreQuoteFromItem: (listId: string, itemId: string, quoteId: string) => void;
  selectPreferredStoreForItem: (listId: string, itemId: string, storeName: string, price: number) => void;

  // Price Comparisons
  priceComparisons: PriceComparison[];
  addPriceComparison: (productName: string, category: string, items: Omit<StorePriceItem, 'id'>[]) => void;
  deletePriceComparison: (id: string) => void;
  addStoreItemToComparison: (comparisonId: string, item: Omit<StorePriceItem, 'id'>) => void;
  deleteStoreItemFromComparison: (comparisonId: string, itemId: string) => void;

  // Savings Goals & Challenges
  savingsGoals: SavingsGoal[];
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'currentAmount' | 'contributions' | 'createdAt'>) => void;
  updateSavingsGoal: (id: string, updates: Partial<SavingsGoal>) => void;
  deleteSavingsGoal: (id: string) => void;
  addSavingsContribution: (goalId: string, amount: number, note?: string) => void;

  savingChallenges: SavingChallenge[];
  addSavingChallenge: (challenge: Omit<SavingChallenge, 'id' | 'currentAmount' | 'isCompleted'>) => void;
  updateSavingChallenge: (id: string, updates: Partial<SavingChallenge>) => void;
  deleteSavingChallenge: (id: string) => void;
  contributeToChallenge: (challengeId: string, amount: number) => void;
  achievementBadges: AchievementBadge[];

  // Bills & Subscriptions
  bills: Bill[];
  addBill: (bill: Omit<Bill, 'id' | 'isPaid'>) => void;
  updateBill: (id: string, updates: Partial<Bill>) => void;
  deleteBill: (id: string) => void;
  toggleBillPaid: (id: string) => void;

  // Helpers & Derived Analytics
  formatCurrency: (amount: number) => string;
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  resetToDemoData: () => void;

  // Computed values for selectedMonth
  monthlyIncome: number;
  monthlyExpense: number;
  previousMonthlyExpense: number;
  monthOverMonthExpenseDiff: number;
  monthOverMonthPercentage: number;
  monthlyNetBalance: number;
  monthlyBudgetRemaining: number;
  monthlySavingsRate: number;
  categorySpendingMap: Record<Category, number>;
  insights: SmartInsight[];
  upcomingUnpaidBills: Bill[];
  recurringMonthlyTotal: number;
  recurringAnnualTotal: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => StorageService.getProfile());
  const [transactions, setTransactions] = useState<Transaction[]>(() => StorageService.getTransactions());
  const [budgets, setBudgets] = useState<MonthlyBudget[]>(() => StorageService.getBudgets());
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>(() => StorageService.getShoppingLists());
  const [priceComparisons, setPriceComparisons] = useState<PriceComparison[]>(() => StorageService.getPriceComparisons());
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => StorageService.getSavingsGoals());
  const [savingChallenges, setSavingChallenges] = useState<SavingChallenge[]>(() => StorageService.getSavingChallenges());
  const [bills, setBills] = useState<Bill[]>(() => StorageService.getBills());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Selected month filter (default current year-month)
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  // Theme Management (synchronized with localStorage and root HTML class)
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => StorageService.getTheme());

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
    StorageService.saveTheme(theme);
  }, [theme]);

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    setProfile((prev) => {
      const updated = { ...prev, theme: newTheme };
      StorageService.saveProfile(updated);
      return updated;
    });
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Toast notifier
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Profile operations
  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      const updated = { ...prev, ...updates };
      StorageService.saveProfile(updated);
      return updated;
    });
    if (updates.theme && updates.theme !== theme) {
      setThemeState(updates.theme);
      StorageService.saveTheme(updates.theme);
    }
    addToast('Profile updated successfully', 'success');
  };

  // Currency Formatter
  const formatCurrency = (amount: number): string => {
    const symbol = profile.currency || '₹';
    const num = Math.round(amount);
    return `${symbol} ${num.toLocaleString()}`;
  };

  // Transaction operations
  const addTransaction = (tx: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTx: Transaction = {
      ...tx,
      id: 'tx_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    StorageService.saveTransactions(updated);
    addToast(`Recorded ${tx.type === 'income' ? 'Income' : 'Expense'}: ${tx.title}`, 'success');
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    const updated = transactions.map((t) => (t.id === id ? { ...t, ...updates } : t));
    setTransactions(updated);
    StorageService.saveTransactions(updated);
    addToast('Transaction updated', 'success');
  };

  const deleteTransaction = (id: string) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    StorageService.saveTransactions(updated);
    addToast('Transaction removed', 'info');
  };

  // Budget operations
  const currentMonthBudget: MonthlyBudget = useMemo(() => {
    const found = budgets.find((b) => b.month === selectedMonth);
    if (found) return found;
    return {
      month: selectedMonth,
      totalBudget: profile.defaultMonthlyBudget || 42000,
      categoryBudgets: [
        { category: 'Food & Dining', allocatedAmount: 11000 },
        { category: 'Shopping & Retail', allocatedAmount: 7000 },
        { category: 'Housing & Rent', allocatedAmount: 8000 },
        { category: 'Transportation', allocatedAmount: 3500 },
        { category: 'Utilities & Bills', allocatedAmount: 4000 },
        { category: 'Healthcare & Medical', allocatedAmount: 2500 },
        { category: 'Entertainment & Leisure', allocatedAmount: 3000 },
        { category: 'Education', allocatedAmount: 3000 },
      ],
    };
  }, [budgets, selectedMonth, profile.defaultMonthlyBudget]);

  const updateMonthlyBudget = (
    totalBudget: number,
    categoryBudgets: { category: Category; allocatedAmount: number }[]
  ) => {
    const exists = budgets.some((b) => b.month === selectedMonth);
    let updated: MonthlyBudget[];
    if (exists) {
      updated = budgets.map((b) =>
        b.month === selectedMonth ? { ...b, totalBudget, categoryBudgets } : b
      );
    } else {
      updated = [...budgets, { month: selectedMonth, totalBudget, categoryBudgets }];
    }
    setBudgets(updated);
    StorageService.saveBudgets(updated);
    addToast(`Updated budget for ${selectedMonth}`, 'success');
  };

  // Shopping List operations
  const addShoppingList = (title: string, budget: number): string => {
    const newList: ShoppingList = {
      id: 'shop_' + Date.now(),
      title,
      budget,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newList, ...shoppingLists];
    setShoppingLists(updated);
    StorageService.saveShoppingLists(updated);
    addToast(`Shopping list "${title}" created`, 'success');
    return newList.id;
  };

  const updateShoppingList = (id: string, updates: Partial<ShoppingList>) => {
    const updated = shoppingLists.map((l) =>
      l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l
    );
    setShoppingLists(updated);
    StorageService.saveShoppingLists(updated);
  };

  const deleteShoppingList = (id: string) => {
    const updated = shoppingLists.filter((l) => l.id !== id);
    setShoppingLists(updated);
    StorageService.saveShoppingLists(updated);
    addToast('Shopping list deleted', 'info');
  };

  const addShoppingItem = (listId: string, item: Omit<ShoppingItem, 'id' | 'isPurchased'>) => {
    const newItem: ShoppingItem = {
      ...item,
      id: 'item_' + Date.now(),
      isPurchased: false,
      storeQuotes: item.storeQuotes || [],
    };
    const updated = shoppingLists.map((l) => {
      if (l.id === listId) {
        return {
          ...l,
          items: [...l.items, newItem],
          updatedAt: new Date().toISOString(),
        };
      }
      return l;
    });
    setShoppingLists(updated);
    StorageService.saveShoppingLists(updated);
    addToast(`Added "${item.name}" to list`, 'success');
  };

  const toggleShoppingItem = (listId: string, itemId: string, actualPrice?: number) => {
    const updated = shoppingLists.map((l) => {
      if (l.id === listId) {
        const newItems = l.items.map((it) => {
          if (it.id === itemId) {
            const nextPurchased = !it.isPurchased;
            return {
              ...it,
              isPurchased: nextPurchased,
              actualPrice: nextPurchased ? actualPrice ?? it.estimatedPrice : undefined,
            };
          }
          return it;
        });
        return { ...l, items: newItems, updatedAt: new Date().toISOString() };
      }
      return l;
    });
    setShoppingLists(updated);
    StorageService.saveShoppingLists(updated);
  };

  const deleteShoppingItem = (listId: string, itemId: string) => {
    const updated = shoppingLists.map((l) => {
      if (l.id === listId) {
        return {
          ...l,
          items: l.items.filter((it) => it.id !== itemId),
          updatedAt: new Date().toISOString(),
        };
      }
      return l;
    });
    setShoppingLists(updated);
    StorageService.saveShoppingLists(updated);
    addToast('Item removed from shopping list', 'info');
  };

  // Add store comparison quote to an item in a shopping list
  const addStoreQuoteToItem = (listId: string, itemId: string, quote: Omit<StorePriceQuote, 'id'>) => {
    const newQuote: StorePriceQuote = {
      ...quote,
      id: 'sq_' + Date.now(),
    };
    const updated = shoppingLists.map((l) => {
      if (l.id === listId) {
        const newItems = l.items.map((it) => {
          if (it.id === itemId) {
            const quotes = [...(it.storeQuotes || []), newQuote];
            return {
              ...it,
              storeQuotes: quotes,
            };
          }
          return it;
        });
        return { ...l, items: newItems, updatedAt: new Date().toISOString() };
      }
      return l;
    });
    setShoppingLists(updated);
    StorageService.saveShoppingLists(updated);
    addToast(`Added store quote from ${quote.storeName}`, 'success');
  };

  const removeStoreQuoteFromItem = (listId: string, itemId: string, quoteId: string) => {
    const updated = shoppingLists.map((l) => {
      if (l.id === listId) {
        const newItems = l.items.map((it) => {
          if (it.id === itemId) {
            return {
              ...it,
              storeQuotes: (it.storeQuotes || []).filter((q) => q.id !== quoteId),
            };
          }
          return it;
        });
        return { ...l, items: newItems, updatedAt: new Date().toISOString() };
      }
      return l;
    });
    setShoppingLists(updated);
    StorageService.saveShoppingLists(updated);
    addToast('Store quote removed', 'info');
  };

  const selectPreferredStoreForItem = (listId: string, itemId: string, storeName: string, price: number) => {
    const updated = shoppingLists.map((l) => {
      if (l.id === listId) {
        const newItems = l.items.map((it) => {
          if (it.id === itemId) {
            return {
              ...it,
              preferredStore: storeName,
              estimatedPrice: price,
            };
          }
          return it;
        });
        return { ...l, items: newItems, updatedAt: new Date().toISOString() };
      }
      return l;
    });
    setShoppingLists(updated);
    StorageService.saveShoppingLists(updated);
    addToast(`Selected ${storeName} as preferred store (${formatCurrency(price)})`, 'success');
  };

  // Price Comparisons
  const addPriceComparison = (productName: string, category: string, items: Omit<StorePriceItem, 'id'>[]) => {
    const newComp: PriceComparison = {
      id: 'cmp_' + Date.now(),
      productName,
      category,
      createdAt: new Date().toISOString(),
      items: items.map((it, idx) => ({ ...it, id: 'store_' + Date.now() + '_' + idx })),
    };
    const updated = [newComp, ...priceComparisons];
    setPriceComparisons(updated);
    StorageService.savePriceComparisons(updated);
    addToast(`Saved comparison for ${productName}`, 'success');
  };

  const deletePriceComparison = (id: string) => {
    const updated = priceComparisons.filter((c) => c.id !== id);
    setPriceComparisons(updated);
    StorageService.savePriceComparisons(updated);
    addToast('Comparison removed', 'info');
  };

  const addStoreItemToComparison = (comparisonId: string, item: Omit<StorePriceItem, 'id'>) => {
    const newItem: StorePriceItem = { ...item, id: 'store_' + Date.now() };
    const updated = priceComparisons.map((c) => {
      if (c.id === comparisonId) {
        return { ...c, items: [...c.items, newItem] };
      }
      return c;
    });
    setPriceComparisons(updated);
    StorageService.savePriceComparisons(updated);
    addToast(`Added store price from ${item.storeName}`, 'success');
  };

  const deleteStoreItemFromComparison = (comparisonId: string, itemId: string) => {
    const updated = priceComparisons.map((c) => {
      if (c.id === comparisonId) {
        return { ...c, items: c.items.filter((it) => it.id !== itemId) };
      }
      return c;
    });
    setPriceComparisons(updated);
    StorageService.savePriceComparisons(updated);
    addToast('Store quote deleted', 'info');
  };

  // Savings Goals
  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id' | 'currentAmount' | 'contributions' | 'createdAt'>) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: 'goal_' + Date.now(),
      currentAmount: 0,
      contributions: [],
      createdAt: new Date().toISOString(),
    };
    const updated = [...savingsGoals, newGoal];
    setSavingsGoals(updated);
    StorageService.saveSavingsGoals(updated);
    addToast(`Goal created: ${goal.title}`, 'success');
  };

  const updateSavingsGoal = (id: string, updates: Partial<SavingsGoal>) => {
    const updated = savingsGoals.map((g) => (g.id === id ? { ...g, ...updates } : g));
    setSavingsGoals(updated);
    StorageService.saveSavingsGoals(updated);
  };

  const deleteSavingsGoal = (id: string) => {
    const updated = savingsGoals.filter((g) => g.id !== id);
    setSavingsGoals(updated);
    StorageService.saveSavingsGoals(updated);
    addToast('Savings goal deleted', 'info');
  };

  const addSavingsContribution = (goalId: string, amount: number, note?: string) => {
    const newContribution = {
      id: 'c_' + Date.now(),
      amount,
      date: new Date().toISOString().split('T')[0],
      note,
    };
    const updated = savingsGoals.map((g) => {
      if (g.id === goalId) {
        return {
          ...g,
          currentAmount: g.currentAmount + amount,
          contributions: [newContribution, ...g.contributions],
        };
      }
      return g;
    });
    setSavingsGoals(updated);
    StorageService.saveSavingsGoals(updated);
    addToast(`Deposited ${formatCurrency(amount)} into goal`, 'success');
  };

  // Saving Challenges
  const addSavingChallenge = (challenge: Omit<SavingChallenge, 'id' | 'currentAmount' | 'isCompleted'>) => {
    const newChallenge: SavingChallenge = {
      ...challenge,
      id: 'ch_' + Date.now(),
      currentAmount: 0,
      isCompleted: false,
    };
    const updated = [newChallenge, ...savingChallenges];
    setSavingChallenges(updated);
    StorageService.saveSavingChallenges(updated);
    addToast(`Started challenge: ${challenge.title}`, 'success');
  };

  const updateSavingChallenge = (id: string, updates: Partial<SavingChallenge>) => {
    const updated = savingChallenges.map((c) => (c.id === id ? { ...c, ...updates } : c));
    setSavingChallenges(updated);
    StorageService.saveSavingChallenges(updated);
  };

  const deleteSavingChallenge = (id: string) => {
    const updated = savingChallenges.filter((c) => c.id !== id);
    setSavingChallenges(updated);
    StorageService.saveSavingChallenges(updated);
    addToast('Challenge deleted', 'info');
  };

  const contributeToChallenge = (challengeId: string, amount: number) => {
    const updated = savingChallenges.map((c) => {
      if (c.id === challengeId) {
        const newTotal = c.currentAmount + amount;
        const willBeComplete = newTotal >= c.targetAmount;
        return {
          ...c,
          currentAmount: newTotal,
          isCompleted: willBeComplete,
          completedAt: willBeComplete ? new Date().toISOString().split('T')[0] : c.completedAt,
        };
      }
      return c;
    });
    setSavingChallenges(updated);
    StorageService.saveSavingChallenges(updated);
    const target = updated.find((c) => c.id === challengeId);
    if (target?.isCompleted) {
      addToast(`🎉 Challenge Accomplished: ${target.title}! Badge Unlocked!`, 'success');
    } else {
      addToast(`Added ${formatCurrency(amount)} to challenge progress`, 'success');
    }
  };

  // Bills
  const addBill = (bill: Omit<Bill, 'id' | 'isPaid'>) => {
    const newBill: Bill = {
      ...bill,
      id: 'bill_' + Date.now(),
      isPaid: false,
    };
    const updated = [...bills, newBill];
    setBills(updated);
    StorageService.saveBills(updated);
    addToast(`Bill scheduled: ${bill.title}`, 'success');
  };

  const updateBill = (id: string, updates: Partial<Bill>) => {
    const updated = bills.map((b) => (b.id === id ? { ...b, ...updates } : b));
    setBills(updated);
    StorageService.saveBills(updated);
    addToast('Bill updated', 'success');
  };

  const deleteBill = (id: string) => {
    const updated = bills.filter((b) => b.id !== id);
    setBills(updated);
    StorageService.saveBills(updated);
    addToast('Bill removed', 'info');
  };

  const toggleBillPaid = (id: string) => {
    const updated = bills.map((b) => {
      if (b.id === id) {
        const willBePaid = !b.isPaid;
        return {
          ...b,
          isPaid: willBePaid,
          paidDate: willBePaid ? new Date().toISOString().split('T')[0] : undefined,
        };
      }
      return b;
    });
    setBills(updated);
    StorageService.saveBills(updated);
    const target = updated.find((b) => b.id === id);
    addToast(target?.isPaid ? `Marked "${target.title}" as paid` : `Marked "${target?.title}" as unpaid`, 'info');
  };

  // Reset to Demo
  const resetToDemoData = () => {
    StorageService.resetToDemoData();
    setProfile(StorageService.getProfile());
    setTransactions(StorageService.getTransactions());
    setBudgets(StorageService.getBudgets());
    setShoppingLists(StorageService.getShoppingLists());
    setPriceComparisons(StorageService.getPriceComparisons());
    setSavingsGoals(StorageService.getSavingsGoals());
    setSavingChallenges(StorageService.getSavingChallenges());
    setBills(StorageService.getBills());
    addToast('Demo database refreshed to defaults', 'success');
  };

  // Filter transactions for selectedMonth
  const monthlyTxs = useMemo(() => {
    return transactions.filter((t) => t.date.startsWith(selectedMonth));
  }, [transactions, selectedMonth]);

  const monthlyIncome = useMemo(() => {
    return monthlyTxs.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  }, [monthlyTxs]);

  const monthlyExpense = useMemo(() => {
    return monthlyTxs.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  }, [monthlyTxs]);

  // Previous month calculation
  const previousMonthStr = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const d = new Date(year, month - 2, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }, [selectedMonth]);

  const previousMonthlyTxs = useMemo(() => {
    return transactions.filter((t) => t.date.startsWith(previousMonthStr));
  }, [transactions, previousMonthStr]);

  const previousMonthlyExpense = useMemo(() => {
    return previousMonthlyTxs.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  }, [previousMonthlyTxs]);

  const monthOverMonthExpenseDiff = monthlyExpense - previousMonthlyExpense;
  const monthOverMonthPercentage = previousMonthlyExpense > 0
    ? Math.round((monthOverMonthExpenseDiff / previousMonthlyExpense) * 100)
    : 0;

  const monthlyNetBalance = monthlyIncome - monthlyExpense;
  const monthlyBudgetRemaining = Math.max(0, currentMonthBudget.totalBudget - monthlyExpense);
  const monthlySavingsRate = monthlyIncome > 0 ? Math.round(((monthlyIncome - monthlyExpense) / monthlyIncome) * 100) : 0;

  // Category breakdown for selectedMonth
  const categorySpendingMap = useMemo(() => {
    const map: Record<Category, number> = {
      'Food & Dining': 0,
      'Shopping & Retail': 0,
      'Transportation': 0,
      'Housing & Rent': 0,
      'Utilities & Bills': 0,
      'Healthcare & Medical': 0,
      'Education': 0,
      'Entertainment & Leisure': 0,
      'Salary & Earnings': 0,
      'Investments': 0,
      'Personal Care': 0,
      'Other': 0,
    };
    monthlyTxs.forEach((t) => {
      if (t.type === 'expense') {
        map[t.category] = (map[t.category] || 0) + t.amount;
      }
    });
    return map;
  }, [monthlyTxs]);

  // Category breakdown for previous month
  const previousCategorySpendingMap = useMemo(() => {
    const map: Record<string, number> = {};
    previousMonthlyTxs.forEach((t) => {
      if (t.type === 'expense') {
        map[t.category] = (map[t.category] || 0) + t.amount;
      }
    });
    return map;
  }, [previousMonthlyTxs]);

  // Upcoming unpaid bills
  const upcomingUnpaidBills = useMemo(() => {
    return bills.filter((b) => !b.isPaid).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [bills]);

  // Recurring totals (normalized to Monthly and Annual)
  const recurringMonthlyTotal = useMemo(() => {
    return bills.reduce((sum, b) => {
      if (b.recurringFrequency === 'Weekly') return sum + b.amount * 4.33;
      if (b.recurringFrequency === 'Quarterly') return sum + b.amount / 3;
      if (b.recurringFrequency === 'Yearly') return sum + b.amount / 12;
      if (b.recurringFrequency === 'One-Time') return sum;
      return sum + b.amount; // Monthly default
    }, 0);
  }, [bills]);

  const recurringAnnualTotal = recurringMonthlyTotal * 12;

  // Achievement Badges computed from genuine user milestones
  const achievementBadges: AchievementBadge[] = useMemo(() => {
    const badges: AchievementBadge[] = [];

    // 1. First Goal Initiated
    const hasGoal = savingsGoals.length > 0;
    badges.push({
      id: 'badge_first_goal',
      title: 'Target Setter',
      description: 'Created your first dedicated savings goal',
      icon: 'Target',
      isUnlocked: hasGoal,
      progress: hasGoal ? 100 : 0,
    });

    // 2. Quarter Milestone (25%)
    const maxGoalPct = savingsGoals.reduce((max, g) => {
      const pct = g.targetAmount > 0 ? (g.currentAmount / g.targetAmount) * 100 : 0;
      return Math.max(max, pct);
    }, 0);
    badges.push({
      id: 'badge_quarter',
      title: 'Quarter Milestone',
      description: 'Reached 25% of any target savings milestone',
      icon: 'Award',
      isUnlocked: maxGoalPct >= 25,
      progress: Math.min(100, Math.round((maxGoalPct / 25) * 100)),
    });

    // 3. Halfway Hero (50%)
    badges.push({
      id: 'badge_halfway',
      title: 'Halfway Hero',
      description: 'Crossed the 50% milestone on a savings target',
      icon: 'Sparkles',
      isUnlocked: maxGoalPct >= 50,
      progress: Math.min(100, Math.round((maxGoalPct / 50) * 100)),
    });

    // 4. Goal Accomplished (100%)
    const completedGoalsCount = savingsGoals.filter((g) => g.currentAmount >= g.targetAmount).length;
    badges.push({
      id: 'badge_achiever',
      title: 'Goal Achiever',
      description: 'Fully achieved 100% of a financial goal target',
      icon: 'Trophy',
      isUnlocked: completedGoalsCount > 0,
      progress: completedGoalsCount > 0 ? 100 : Math.min(99, Math.round(maxGoalPct)),
    });

    // 5. Frequent Depositor (3+ deposits)
    const totalDeposits = savingsGoals.reduce((sum, g) => sum + g.contributions.length, 0);
    badges.push({
      id: 'badge_disciplined',
      title: 'Disciplined Depositor',
      description: 'Recorded 3 or more savings contributions',
      icon: 'PiggyBank',
      isUnlocked: totalDeposits >= 3,
      progress: Math.min(100, Math.round((totalDeposits / 3) * 100)),
    });

    // 6. Challenge Victor
    const completedChallenges = savingChallenges.filter((c) => c.isCompleted).length;
    badges.push({
      id: 'badge_challenge_victor',
      title: 'Challenge Victor',
      description: 'Conquered a weekly or monthly personal saving challenge',
      icon: 'Flame',
      isUnlocked: completedChallenges > 0,
      progress: completedChallenges > 0 ? 100 : (savingChallenges.length > 0 ? 50 : 0),
    });

    // 7. Smart Price Sleuth
    const comparisonsCount = priceComparisons.length;
    badges.push({
      id: 'badge_sleuth',
      title: 'Smart Price Sleuth',
      description: 'Cross-compared retail quotes to capture lowest unit prices',
      icon: 'Scale',
      isUnlocked: comparisonsCount > 0,
      progress: comparisonsCount > 0 ? 100 : 0,
    });

    // 8. Budget Guardian
    const currentBudgetCap = currentMonthBudget.totalBudget;
    const isUnderBudget = currentBudgetCap > 0 && monthlyExpense <= currentBudgetCap;
    badges.push({
      id: 'badge_guardian',
      title: 'Budget Guardian',
      description: 'Preserved positive budget cushion within the current month',
      icon: 'ShieldCheck',
      isUnlocked: isUnderBudget,
      progress: isUnderBudget ? 100 : 0,
    });

    return badges;
  }, [savingsGoals, savingChallenges, priceComparisons, currentMonthBudget, monthlyExpense]);

  // Data-grounded Smart Insights (Feature #1)
  const insights: SmartInsight[] = useMemo(() => {
    const list: SmartInsight[] = [];

    // 1. Highest spending category
    const entries = Object.entries(categorySpendingMap).filter(([_, val]) => val > 0) as [Category, number][];
    if (entries.length > 0) {
      entries.sort((a, b) => b[1] - a[1]);
      const [topCategory, topAmount] = entries[0];
      const categoryShare = monthlyExpense > 0 ? Math.round((topAmount / monthlyExpense) * 100) : 0;
      list.push({
        id: 'ins_top_category',
        type: 'info',
        title: `Highest Spending: ${topCategory}`,
        description: `${topCategory} accounts for ${categoryShare}% of your total outflow this month (${formatCurrency(topAmount)}).`,
        metric: `${categoryShare}% of total outflow`,
        category: topCategory,
      });
    }

    // 2. Spending Increase or Decrease Compared with Previous Month (Month-over-Month)
    if (previousMonthlyExpense > 0) {
      const isIncrease = monthOverMonthExpenseDiff > 0;
      const absDiff = Math.abs(monthOverMonthExpenseDiff);
      const absPct = Math.abs(monthOverMonthPercentage);
      list.push({
        id: 'ins_mom_change',
        type: isIncrease ? (absPct > 15 ? 'warning' : 'info') : 'success',
        trend: isIncrease ? 'up' : 'down',
        title: isIncrease ? `Spending Up ${absPct}% vs Previous Month` : `Spending Down ${absPct}% vs Previous Month`,
        description: isIncrease
          ? `You have spent ${formatCurrency(absDiff)} more in ${selectedMonth} compared to ${previousMonthStr} (${formatCurrency(previousMonthlyExpense)}).`
          : `Great job! Outflows in ${selectedMonth} are ${formatCurrency(absDiff)} lower than ${previousMonthStr}.`,
        metric: isIncrease ? `+${absPct}% (${formatCurrency(absDiff)})` : `-${absPct}% (${formatCurrency(absDiff)})`,
      });
    }

    // 3. Remaining Monthly Budget & Daily Pacing
    if (currentMonthBudget.totalBudget > 0) {
      const pct = Math.round((monthlyExpense / currentMonthBudget.totalBudget) * 100);
      const now = new Date();
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const currentDay = Math.min(now.getDate(), daysInMonth);
      const daysLeft = Math.max(1, daysInMonth - currentDay);
      const recommendedDailyBurn = Math.max(0, Math.round(monthlyBudgetRemaining / daysLeft));

      if (pct > 100) {
        list.push({
          id: 'ins_budget_over',
          type: 'warning',
          trend: 'up',
          title: 'Monthly Budget Limit Exceeded',
          description: `Total expenses exceed your limit by ${formatCurrency(monthlyExpense - currentMonthBudget.totalBudget)} (${pct}% spent).`,
          metric: `${pct}% used`,
          actionableTip: 'Review optional categories such as Shopping & Retail or Entertainment.',
        });
      } else if (pct >= 80) {
        list.push({
          id: 'ins_budget_warning',
          type: 'warning',
          trend: 'up',
          title: 'Budget Alert (80% Reached)',
          description: `You have spent ${pct}% of your ${formatCurrency(currentMonthBudget.totalBudget)} budget. Remaining: ${formatCurrency(monthlyBudgetRemaining)}.`,
          metric: `${formatCurrency(monthlyBudgetRemaining)} left`,
          actionableTip: `Target a maximum of ${formatCurrency(recommendedDailyBurn)}/day across the remaining ${daysLeft} days.`,
        });
      } else {
        list.push({
          id: 'ins_budget_on_track',
          type: 'success',
          trend: 'down',
          title: 'Healthy Budget Margin',
          description: `You have ${formatCurrency(monthlyBudgetRemaining)} remaining (${100 - pct}% cushion). Recommended daily pace: ${formatCurrency(recommendedDailyBurn)}/day.`,
          metric: `${100 - pct}% cushion left`,
        });
      }
    }

    // 4. Unusual Increases in Category Spending (Anomaly Detection)
    entries.forEach(([cat, currentAmount]) => {
      const prevAmount = previousCategorySpendingMap[cat] || 0;
      if (prevAmount > 0 && currentAmount > prevAmount * 1.25 && currentAmount - prevAmount > 1500) {
        const catPct = Math.round(((currentAmount - prevAmount) / prevAmount) * 100);
        list.push({
          id: `ins_anomaly_${cat}`,
          type: 'warning',
          trend: 'up',
          title: `Unusual Surge in ${cat}`,
          description: `${cat} surged +${catPct}% this month (${formatCurrency(currentAmount)} vs ${formatCurrency(prevAmount)} last month).`,
          metric: `+${catPct}% MoM`,
          category: cat,
          actionableTip: `Audit recent transactions in ${cat} to check for one-time anomalies or recurring increases.`,
        });
      }
    });

    // 5. Personalized Suggestions to Reduce Expenses
    if (entries.length > 0) {
      const topCat = entries[0][0];
      const topAmt = entries[0][1];
      if (topCat === 'Food & Dining') {
        const potentialSaving = Math.round(topAmt * 0.2);
        list.push({
          id: 'ins_suggestion_dining',
          type: 'tip',
          title: 'Personalized Suggestion: Dining Optimization',
          description: `Dining out accounts for ${formatCurrency(topAmt)}. Preparing 2 more home-cooked meals per week or meal-prepping could save approx ${formatCurrency(potentialSaving)} this month.`,
          metric: `Save ~${formatCurrency(potentialSaving)}/mo`,
          actionableTip: 'Try our "Weekend Home-Chef" saving challenge to kickstart this habit.',
        });
      } else if (topCat === 'Shopping & Retail') {
        const potentialSaving = Math.round(topAmt * 0.25);
        list.push({
          id: 'ins_suggestion_shopping',
          type: 'tip',
          title: 'Personalized Suggestion: Cart Cool-Off Period',
          description: `Shopping spend is at ${formatCurrency(topAmt)}. Instituting a 48-hour cool-off rule before buying non-essentials could trim around ${formatCurrency(potentialSaving)}.`,
          metric: `Save ~${formatCurrency(potentialSaving)}/mo`,
          actionableTip: 'Add candidate purchases to a Smart Shopping List with prices first before ordering.',
        });
      }
    }

    // 6. Savings Goal Pacing
    if (savingsGoals.length > 0) {
      const activeGoal = savingsGoals[0];
      const needed = Math.max(0, activeGoal.targetAmount - activeGoal.currentAmount);
      if (needed > 0 && monthlyNetBalance > 5000) {
        const potentialBoost = Math.round(monthlyNetBalance * 0.3);
        list.push({
          id: 'ins_goal_boost',
          type: 'tip',
          title: `Accelerate "${activeGoal.title}"`,
          description: `You have ${formatCurrency(monthlyNetBalance)} in net surplus cash this month. Allocating ${formatCurrency(potentialBoost)} could shorten your goal timeline by weeks.`,
          metric: `Target: ${formatCurrency(activeGoal.targetAmount)}`,
        });
      }
    }

    return list;
  }, [
    currentMonthBudget,
    monthlyExpense,
    monthlyBudgetRemaining,
    categorySpendingMap,
    previousCategorySpendingMap,
    previousMonthlyExpense,
    monthOverMonthExpenseDiff,
    monthOverMonthPercentage,
    savingsGoals,
    monthlyNetBalance,
    selectedMonth,
    previousMonthStr,
    profile.currency,
  ]);

  return (
    <AppContext.Provider
      value={{
        profile,
        updateProfile,
        isSupabaseConfigured,
        theme,
        setTheme,
        toggleTheme,
        selectedMonth,
        setSelectedMonth,
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        budgets,
        currentMonthBudget,
        updateMonthlyBudget,
        shoppingLists,
        addShoppingList,
        updateShoppingList,
        deleteShoppingList,
        addShoppingItem,
        toggleShoppingItem,
        deleteShoppingItem,
        addStoreQuoteToItem,
        removeStoreQuoteFromItem,
        selectPreferredStoreForItem,
        priceComparisons,
        addPriceComparison,
        deletePriceComparison,
        addStoreItemToComparison,
        deleteStoreItemFromComparison,
        savingsGoals,
        addSavingsGoal,
        updateSavingsGoal,
        deleteSavingsGoal,
        addSavingsContribution,
        savingChallenges,
        addSavingChallenge,
        updateSavingChallenge,
        deleteSavingChallenge,
        contributeToChallenge,
        achievementBadges,
        bills,
        addBill,
        updateBill,
        deleteBill,
        toggleBillPaid,
        formatCurrency,
        toasts,
        addToast,
        removeToast,
        resetToDemoData,
        monthlyIncome,
        monthlyExpense,
        previousMonthlyExpense,
        monthOverMonthExpenseDiff,
        monthOverMonthPercentage,
        monthlyNetBalance,
        monthlyBudgetRemaining,
        monthlySavingsRate,
        categorySpendingMap,
        insights,
        upcomingUnpaidBills,
        recurringMonthlyTotal,
        recurringAnnualTotal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
