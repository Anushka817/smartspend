export type TransactionType = 'income' | 'expense';

export type Category =
  | 'Food & Dining'
  | 'Shopping & Retail'
  | 'Transportation'
  | 'Housing & Rent'
  | 'Utilities & Bills'
  | 'Healthcare & Medical'
  | 'Education'
  | 'Entertainment & Leisure'
  | 'Salary & Earnings'
  | 'Investments'
  | 'Personal Care'
  | 'Other';

export type PaymentMethod = 'Cash' | 'Credit Card' | 'Debit Card' | 'UPI / Bank Transfer' | 'Digital Wallet';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: Category;
  date: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  notes?: string;
  createdAt: string;
}

export interface CategoryBudget {
  category: Category;
  allocatedAmount: number;
}

export interface MonthlyBudget {
  month: string; // YYYY-MM
  totalBudget: number;
  categoryBudgets: CategoryBudget[];
}

export interface StorePriceQuote {
  id: string;
  storeName: string;
  price: number;
  packageSize: number;
  unit: string;
  url?: string;
  notes?: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit?: string;
  estimatedPrice: number;
  actualPrice?: number;
  category: string;
  isPurchased: boolean;
  storeQuotes?: StorePriceQuote[]; // store-by-store comparison attached to item
  preferredStore?: string;
}

export interface ShoppingList {
  id: string;
  title: string;
  budget: number;
  items: ShoppingItem[];
  createdAt: string;
  updatedAt: string;
}

export interface StorePriceItem {
  id: string;
  storeName: string;
  productName: string;
  price: number;
  packageSize: number; // e.g. 500
  unit: string; // e.g. 'g', 'kg', 'ml', 'L', 'pcs'
  productUrl?: string;
  notes?: string;
}

export interface PriceComparison {
  id: string;
  productName: string;
  category: string;
  items: StorePriceItem[];
  createdAt: string;
}

export interface SavingsGoalContribution {
  id: string;
  amount: number;
  date: string;
  note?: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string; // YYYY-MM-DD
  category: string;
  contributions: SavingsGoalContribution[];
  createdAt: string;
}

export interface SavingChallenge {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  duration: '1 Week' | '2 Weeks' | '1 Month';
  startDate: string;
  endDate: string;
  category: string;
  isCompleted: boolean;
  completedAt?: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isUnlocked: boolean;
  progress: number; // 0 - 100
}

export interface Bill {
  id: string;
  title: string;
  amount: number;
  dueDate: string; // YYYY-MM-DD
  category: Category;
  isPaid: boolean;
  paidDate?: string;
  recurringFrequency: 'Monthly' | 'Quarterly' | 'Yearly' | 'Weekly' | 'One-Time';
  billType?: 'bill' | 'subscription'; // distinguish utilities vs SaaS/streaming
  provider?: string;
  reminderDaysBefore?: number;
  autoRenew?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  currency: string; // '$', '₹', '€', '£', '¥', 'C$'
  monthlyIncome: number;
  defaultMonthlyBudget: number;
  theme: 'light' | 'dark';
  isOnboarded: boolean;
  isDemoUser: boolean;
}

export interface SmartInsight {
  id: string;
  type: 'info' | 'warning' | 'success' | 'tip';
  title: string;
  description: string;
  metric?: string;
  category?: Category;
  trend?: 'up' | 'down' | 'neutral';
  actionableTip?: string;
}
