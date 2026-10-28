import {
  Transaction,
  MonthlyBudget,
  ShoppingList,
  PriceComparison,
  SavingsGoal,
  SavingChallenge,
  Bill,
  UserProfile,
} from '../types';

const STORAGE_KEYS = {
  PROFILE: 'smartspend_profile',
  TRANSACTIONS: 'smartspend_transactions',
  BUDGETS: 'smartspend_budgets',
  SHOPPING_LISTS: 'smartspend_shopping_lists',
  PRICE_COMPARISONS: 'smartspend_price_comparisons',
  SAVINGS_GOALS: 'smartspend_savings_goals',
  SAVING_CHALLENGES: 'smartspend_saving_challenges',
  BILLS: 'smartspend_bills',
  AUTH_TOKEN: 'smartspend_auth_token',
  THEME: 'smartspend_theme',
};

// Check if external Supabase credentials are configured
export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Initial Realistic Demo Data
export const initialProfile: UserProfile = {
  id: 'usr_demo_101',
  name: 'Alex Morgan',
  email: 'alex.morgan@smartspend.app',
  currency: '₹',
  monthlyIncome: 75000,
  defaultMonthlyBudget: 42000,
  theme: 'light',
  isOnboarded: true,
  isDemoUser: true,
};

// Helper for dynamic relative dates in current month & previous month
const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth(); // 0-indexed
const currentMonthStr = String(currentMonth + 1).padStart(2, '0');
const currentMonthKey = `${currentYear}-${currentMonthStr}`;

// Previous month calculation
const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
const prevYear = prevMonthDate.getFullYear();
const prevMonthStr = String(prevMonthDate.getMonth() + 1).padStart(2, '0');
const prevMonthKey = `${prevYear}-${prevMonthStr}`;

export const initialTransactions: Transaction[] = [
  // --- Current Month Entries ---
  {
    id: 'tx_01',
    title: 'Monthly Consulting Salary',
    amount: 75000,
    type: 'income',
    category: 'Salary & Earnings',
    date: `${currentMonthKey}-01`,
    paymentMethod: 'UPI / Bank Transfer',
    notes: 'Direct corporate deposit for monthly compensation',
    createdAt: new Date(currentYear, currentMonth, 1).toISOString(),
  },
  {
    id: 'tx_02',
    title: 'Whole Foods & Fresh Produce',
    amount: 3850,
    type: 'expense',
    category: 'Food & Dining',
    date: `${currentMonthKey}-03`,
    paymentMethod: 'Credit Card',
    notes: 'Weekly organic pantry restocking',
    createdAt: new Date(currentYear, currentMonth, 3).toISOString(),
  },
  {
    id: 'tx_03',
    title: 'Apartment Maintenance & Water',
    amount: 4500,
    type: 'expense',
    category: 'Housing & Rent',
    date: `${currentMonthKey}-04`,
    paymentMethod: 'UPI / Bank Transfer',
    notes: 'Monthly society maintenance fee',
    createdAt: new Date(currentYear, currentMonth, 4).toISOString(),
  },
  {
    id: 'tx_04',
    title: 'Fiber Internet 300 Mbps',
    amount: 1180,
    type: 'expense',
    category: 'Utilities & Bills',
    date: `${currentMonthKey}-05`,
    paymentMethod: 'Debit Card',
    notes: 'High-speed home work internet bill',
    createdAt: new Date(currentYear, currentMonth, 5).toISOString(),
  },
  {
    id: 'tx_05',
    title: 'Subway & Transit Pass',
    amount: 1450,
    type: 'expense',
    category: 'Transportation',
    date: `${currentMonthKey}-07`,
    paymentMethod: 'Digital Wallet',
    notes: 'Smart card metro monthly recharge',
    createdAt: new Date(currentYear, currentMonth, 7).toISOString(),
  },
  {
    id: 'tx_06',
    title: 'Books & Online Course Material',
    amount: 2200,
    type: 'expense',
    category: 'Education',
    date: `${currentMonthKey}-09`,
    paymentMethod: 'Credit Card',
    notes: 'Data structures & Cloud architecture books',
    createdAt: new Date(currentYear, currentMonth, 9).toISOString(),
  },
  {
    id: 'tx_07',
    title: 'Weekend Bistro Dinner with Friends',
    amount: 3950,
    type: 'expense',
    category: 'Food & Dining',
    date: `${currentMonthKey}-11`,
    paymentMethod: 'UPI / Bank Transfer',
    notes: 'Celebration dinner at Olive Kitchen',
    createdAt: new Date(currentYear, currentMonth, 11).toISOString(),
  },
  {
    id: 'tx_08',
    title: 'Running Shoes & Sports Apparel',
    amount: 5490,
    type: 'expense',
    category: 'Shopping & Retail',
    date: `${currentMonthKey}-13`,
    paymentMethod: 'Credit Card',
    notes: 'Seasonal fitness gear refresh',
    createdAt: new Date(currentYear, currentMonth, 13).toISOString(),
  },
  {
    id: 'tx_09',
    title: 'Freelance UX Consultation',
    amount: 18500,
    type: 'income',
    category: 'Salary & Earnings',
    date: `${currentMonthKey}-15`,
    paymentMethod: 'UPI / Bank Transfer',
    notes: 'Payment for e-commerce design audit',
    createdAt: new Date(currentYear, currentMonth, 15).toISOString(),
  },
  {
    id: 'tx_10',
    title: 'Streaming & Music Subscriptions',
    amount: 999,
    type: 'expense',
    category: 'Entertainment & Leisure',
    date: `${currentMonthKey}-16`,
    paymentMethod: 'Credit Card',
    notes: 'Spotify Family & OTT combo package',
    createdAt: new Date(currentYear, currentMonth, 16).toISOString(),
  },
  {
    id: 'tx_11',
    title: 'Pharmacy & Wellness Vitamins',
    amount: 1350,
    type: 'expense',
    category: 'Healthcare & Medical',
    date: `${currentMonthKey}-18`,
    paymentMethod: 'Debit Card',
    notes: 'Prescriptions, Vitamin D3 and Omega-3',
    createdAt: new Date(currentYear, currentMonth, 18).toISOString(),
  },
  {
    id: 'tx_12',
    title: 'Quarterly Mutual Fund Dividend',
    amount: 4200,
    type: 'income',
    category: 'Investments',
    date: `${currentMonthKey}-20`,
    paymentMethod: 'UPI / Bank Transfer',
    notes: 'Index fund yield dividend credit',
    createdAt: new Date(currentYear, currentMonth, 20).toISOString(),
  },
  {
    id: 'tx_13',
    title: 'Artisan Coffee Roasters',
    amount: 680,
    type: 'expense',
    category: 'Food & Dining',
    date: `${currentMonthKey}-22`,
    paymentMethod: 'Digital Wallet',
    notes: 'Single-origin espresso beans (500g)',
    createdAt: new Date(currentYear, currentMonth, 22).toISOString(),
  },

  // --- Previous Month Historical Entries (for genuine MoM trend & anomaly analytics) ---
  {
    id: 'tx_prev_01',
    title: 'Monthly Consulting Salary',
    amount: 75000,
    type: 'income',
    category: 'Salary & Earnings',
    date: `${prevMonthKey}-01`,
    paymentMethod: 'UPI / Bank Transfer',
    createdAt: new Date(prevYear, prevMonthDate.getMonth(), 1).toISOString(),
  },
  {
    id: 'tx_prev_02',
    title: 'Supermarket Groceries',
    amount: 4200,
    type: 'expense',
    category: 'Food & Dining',
    date: `${prevMonthKey}-04`,
    paymentMethod: 'Debit Card',
    createdAt: new Date(prevYear, prevMonthDate.getMonth(), 4).toISOString(),
  },
  {
    id: 'tx_prev_03',
    title: 'Apartment Maintenance Fee',
    amount: 4500,
    type: 'expense',
    category: 'Housing & Rent',
    date: `${prevMonthKey}-05`,
    paymentMethod: 'UPI / Bank Transfer',
    createdAt: new Date(prevYear, prevMonthDate.getMonth(), 5).toISOString(),
  },
  {
    id: 'tx_prev_04',
    title: 'Transit & Metro Commute',
    amount: 1550,
    type: 'expense',
    category: 'Transportation',
    date: `${prevMonthKey}-08`,
    paymentMethod: 'Digital Wallet',
    createdAt: new Date(prevYear, prevMonthDate.getMonth(), 8).toISOString(),
  },
  {
    id: 'tx_prev_05',
    title: 'Casual Wardrobe Essentials',
    amount: 2800,
    type: 'expense',
    category: 'Shopping & Retail',
    date: `${prevMonthKey}-12`,
    paymentMethod: 'Credit Card',
    createdAt: new Date(prevYear, prevMonthDate.getMonth(), 12).toISOString(),
  },
  {
    id: 'tx_prev_06',
    title: 'Movie Night & Snacks',
    amount: 1200,
    type: 'expense',
    category: 'Entertainment & Leisure',
    date: `${prevMonthKey}-17`,
    paymentMethod: 'Credit Card',
    createdAt: new Date(prevYear, prevMonthDate.getMonth(), 17).toISOString(),
  },
  {
    id: 'tx_prev_07',
    title: 'Home Wi-Fi Bill',
    amount: 1180,
    type: 'expense',
    category: 'Utilities & Bills',
    date: `${prevMonthKey}-20`,
    paymentMethod: 'Debit Card',
    createdAt: new Date(prevYear, prevMonthDate.getMonth(), 20).toISOString(),
  },
  {
    id: 'tx_prev_08',
    title: 'Prescription Refill',
    amount: 850,
    type: 'expense',
    category: 'Healthcare & Medical',
    date: `${prevMonthKey}-24`,
    paymentMethod: 'Cash',
    createdAt: new Date(prevYear, prevMonthDate.getMonth(), 24).toISOString(),
  },
];

export const initialBudgets: MonthlyBudget[] = [
  {
    month: currentMonthKey,
    totalBudget: 42000,
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
  },
  {
    month: prevMonthKey,
    totalBudget: 40000,
    categoryBudgets: [
      { category: 'Food & Dining', allocatedAmount: 10000 },
      { category: 'Shopping & Retail', allocatedAmount: 6000 },
      { category: 'Housing & Rent', allocatedAmount: 8000 },
      { category: 'Transportation', allocatedAmount: 3500 },
      { category: 'Utilities & Bills', allocatedAmount: 4000 },
      { category: 'Healthcare & Medical', allocatedAmount: 2500 },
      { category: 'Entertainment & Leisure', allocatedAmount: 3000 },
      { category: 'Education', allocatedAmount: 3000 },
    ],
  },
];

export const initialShoppingLists: ShoppingList[] = [
  {
    id: 'shop_01',
    title: 'Weekly Supermarket & Organic Pantry',
    budget: 5000,
    createdAt: new Date(currentYear, currentMonth, 2).toISOString(),
    updatedAt: new Date(currentYear, currentMonth, 5).toISOString(),
    items: [
      {
        id: 'item_01',
        name: 'Cold Pressed Virgin Olive Oil 1L',
        quantity: 1,
        unit: 'L',
        estimatedPrice: 1150,
        actualPrice: 1049,
        category: 'Pantry',
        isPurchased: true,
        preferredStore: 'Amazon Prime Pantry',
        storeQuotes: [
          { id: 'sq_1', storeName: 'Amazon Prime Pantry', price: 1049, packageSize: 1000, unit: 'ml' },
          { id: 'sq_2', storeName: 'FreshMart Superstore', price: 1199, packageSize: 1000, unit: 'ml' },
          { id: 'sq_3', storeName: 'Blinkit Quick Delivery', price: 1280, packageSize: 1000, unit: 'ml' },
        ],
      },
      {
        id: 'item_02',
        name: 'Whole Grain Rolled Oats 1kg',
        quantity: 2,
        unit: 'kg',
        estimatedPrice: 380,
        actualPrice: 360,
        category: 'Breakfast',
        isPurchased: true,
        preferredStore: 'Costco Wholesale',
        storeQuotes: [
          { id: 'sq_4', storeName: 'Costco Wholesale', price: 360, packageSize: 1000, unit: 'g' },
          { id: 'sq_5', storeName: 'Local Organic Mart', price: 420, packageSize: 1000, unit: 'g' },
        ],
      },
      {
        id: 'item_03',
        name: 'Raw California Almonds 500g',
        quantity: 1,
        unit: 'pack',
        estimatedPrice: 480,
        actualPrice: 450,
        category: 'Snacks',
        isPurchased: true,
        preferredStore: 'NutStore',
        storeQuotes: [
          { id: 'sq_6', storeName: 'NutStore Direct', price: 450, packageSize: 500, unit: 'g' },
          { id: 'sq_7', storeName: 'Metro Cash & Carry', price: 495, packageSize: 500, unit: 'g' },
        ],
      },
      {
        id: 'item_04',
        name: 'Greek Yogurt Unsweetened (400g x 2)',
        quantity: 2,
        unit: 'tub',
        estimatedPrice: 280,
        actualPrice: undefined,
        category: 'Dairy',
        isPurchased: false,
        storeQuotes: [
          { id: 'sq_8', storeName: 'Local Dairy Co', price: 270, packageSize: 400, unit: 'g' },
          { id: 'sq_9', storeName: 'SuperMart', price: 290, packageSize: 400, unit: 'g' },
        ],
      },
      {
        id: 'item_05',
        name: 'Organic Hass Avocados (Pack of 3)',
        quantity: 1,
        unit: 'pack',
        estimatedPrice: 390,
        actualPrice: undefined,
        category: 'Produce',
        isPurchased: false,
      },
      {
        id: 'item_06',
        name: 'Arabica Roasted Coffee Beans 500g',
        quantity: 1,
        unit: 'bag',
        estimatedPrice: 720,
        actualPrice: undefined,
        category: 'Beverages',
        isPurchased: false,
        storeQuotes: [
          { id: 'sq_10', storeName: 'Blue Tokai Roasters', price: 690, packageSize: 500, unit: 'g' },
          { id: 'sq_11', storeName: 'Starbucks Retail', price: 850, packageSize: 500, unit: 'g' },
        ],
      },
    ],
  },
  {
    id: 'shop_02',
    title: 'Home Office Ergonomic Upgrades',
    budget: 12000,
    createdAt: new Date(currentYear, currentMonth, 10).toISOString(),
    updatedAt: new Date(currentYear, currentMonth, 12).toISOString(),
    items: [
      {
        id: 'item_10',
        name: 'Adjustable Aluminum Laptop Riser',
        quantity: 1,
        unit: 'pcs',
        estimatedPrice: 1699,
        actualPrice: 1499,
        category: 'Accessories',
        isPurchased: true,
      },
      {
        id: 'item_11',
        name: 'Ergonomic Memory Foam Lumbar Support',
        quantity: 1,
        unit: 'pcs',
        estimatedPrice: 1850,
        actualPrice: undefined,
        category: 'Ergonomics',
        isPurchased: false,
      },
      {
        id: 'item_12',
        name: 'USB-C 7-in-1 Dual Display Hub',
        quantity: 1,
        unit: 'pcs',
        estimatedPrice: 3200,
        actualPrice: undefined,
        category: 'Electronics',
        isPurchased: false,
      },
    ],
  },
];

export const initialPriceComparisons: PriceComparison[] = [
  {
    id: 'cmp_01',
    productName: 'Cold Pressed Extra Virgin Olive Oil',
    category: 'Grocery & Gourmet',
    createdAt: new Date(currentYear, currentMonth, 4).toISOString(),
    items: [
      {
        id: 'store_01',
        storeName: 'Amazon Prime Pantry',
        productName: 'Borges Extra Virgin Olive Oil 1L Tin',
        price: 1049,
        packageSize: 1000,
        unit: 'ml',
        productUrl: 'https://amazon.com',
        notes: 'Free overnight delivery with Prime (Lowest Unit Price)',
      },
      {
        id: 'store_02',
        storeName: 'FreshMart Superstore',
        productName: 'Borges Extra Virgin Olive Oil',
        price: 1199,
        packageSize: 1000,
        unit: 'ml',
        productUrl: 'https://example.com/freshmart',
        notes: 'In-store retail price with loyalty card',
      },
      {
        id: 'store_03',
        storeName: 'Blinkit / Quick Commerce',
        productName: 'Borges Extra Virgin Olive Oil Glass Bottle',
        price: 1280,
        packageSize: 1000,
        unit: 'ml',
        productUrl: 'https://blinkit.com',
        notes: 'Instant 15-minute doorstep delivery',
      },
      {
        id: 'store_04',
        storeName: 'Nature’s Basket Gourmet',
        productName: 'Borges EVOO Premium Glass',
        price: 1350,
        packageSize: 1000,
        unit: 'ml',
        notes: 'Includes temperature-controlled handling',
      },
    ],
  },
  {
    id: 'cmp_02',
    productName: 'Whey Protein Isolate 1kg',
    category: 'Health & Nutrition',
    createdAt: new Date(currentYear, currentMonth, 8).toISOString(),
    items: [
      {
        id: 'store_05',
        storeName: 'NutriKart Health',
        productName: 'ON Gold Standard Isolate 1kg',
        price: 3390,
        packageSize: 1000,
        unit: 'g',
        notes: 'Festive weekend bundle promotion',
      },
      {
        id: 'store_06',
        storeName: 'PharmEasy Wellness',
        productName: 'ON Gold Standard 1000g',
        price: 3550,
        packageSize: 1000,
        unit: 'g',
        notes: 'Includes free shaker bottle voucher',
      },
      {
        id: 'store_07',
        storeName: 'Brand Direct Official Site',
        productName: 'Optimum Nutrition Gold Standard 1kg',
        price: 3699,
        packageSize: 1000,
        unit: 'g',
        notes: 'Guaranteed batch authenticity code',
      },
    ],
  },
];

export const initialSavingsGoals: SavingsGoal[] = [
  {
    id: 'goal_01',
    title: 'Emergency Safety Net (6 Months)',
    targetAmount: 250000,
    currentAmount: 185000,
    targetDate: `${currentYear}-12-31`,
    category: 'Emergency Fund',
    createdAt: new Date(currentYear - 1, 10, 1).toISOString(),
    contributions: [
      {
        id: 'c_01',
        amount: 20000,
        date: `${currentMonthKey}-02`,
        note: 'Monthly allocation from salary',
      },
      {
        id: 'c_02',
        amount: 15000,
        date: `${currentMonthKey}-16`,
        note: 'Partial freelance bonus assignment',
      },
    ],
  },
  {
    id: 'goal_02',
    title: 'MacBook Pro M-Series Workstation',
    targetAmount: 160000,
    currentAmount: 112000,
    targetDate: `${currentYear + 1}-03-15`,
    category: 'Electronics & Work',
    createdAt: new Date(currentYear, 2, 10).toISOString(),
    contributions: [
      {
        id: 'c_03',
        amount: 10000,
        date: `${currentMonthKey}-05`,
        note: 'Disciplined tech savings deposit',
      },
    ],
  },
  {
    id: 'goal_03',
    title: 'Autumn Mountain Retreat Trip',
    targetAmount: 45000,
    currentAmount: 38000,
    targetDate: `${currentYear}-11-20`,
    category: 'Travel & Vacations',
    createdAt: new Date(currentYear, 5, 1).toISOString(),
    contributions: [
      {
        id: 'c_04',
        amount: 6000,
        date: `${currentMonthKey}-08`,
        note: 'Pre-booking flight & stay reserve',
      },
    ],
  },
];

export const initialSavingChallenges: SavingChallenge[] = [
  {
    id: 'ch_01',
    title: 'Weekend Home-Chef Sprint',
    description: 'Cook all weekend meals at home instead of dining out or ordering takeout.',
    targetAmount: 2500,
    currentAmount: 2500,
    duration: '1 Week',
    startDate: `${currentMonthKey}-05`,
    endDate: `${currentMonthKey}-12`,
    category: 'Food & Dining',
    isCompleted: true,
    completedAt: `${currentMonthKey}-12`,
  },
  {
    id: 'ch_02',
    title: 'No-Impulse Online Retail (14 Days)',
    description: 'Wait 48 hours before purchasing any non-essential cart item.',
    targetAmount: 4000,
    currentAmount: 2800,
    duration: '2 Weeks',
    startDate: `${currentMonthKey}-10`,
    endDate: `${currentMonthKey}-24`,
    category: 'Shopping & Retail',
    isCompleted: false,
  },
  {
    id: 'ch_03',
    title: 'Daily Coffee Habit Shift',
    description: 'Brew premium single-origin beans at home on weekdays.',
    targetAmount: 1500,
    currentAmount: 1100,
    duration: '1 Month',
    startDate: `${currentMonthKey}-01`,
    endDate: `${currentMonthKey}-30`,
    category: 'Food & Dining',
    isCompleted: false,
  },
];

export const initialBills: Bill[] = [
  {
    id: 'bill_01',
    title: 'Residential Electricity & Power',
    amount: 2650,
    dueDate: `${currentMonthKey}-28`,
    category: 'Utilities & Bills',
    isPaid: false,
    recurringFrequency: 'Monthly',
    billType: 'bill',
    provider: 'State Electric Utility Board',
    reminderDaysBefore: 3,
  },
  {
    id: 'bill_02',
    title: 'Term Life Insurance Premium',
    amount: 8500,
    dueDate: `${currentMonthKey}-30`,
    category: 'Healthcare & Medical',
    isPaid: false,
    recurringFrequency: 'Quarterly',
    billType: 'bill',
    provider: 'Prudential Life Assurance',
    reminderDaysBefore: 5,
  },
  {
    id: 'bill_03',
    title: 'Fiber Internet 300 Mbps',
    amount: 1180,
    dueDate: `${currentMonthKey}-05`,
    category: 'Utilities & Bills',
    isPaid: true,
    paidDate: `${currentMonthKey}-05`,
    recurringFrequency: 'Monthly',
    billType: 'bill',
    provider: 'Airtel Broadband',
  },
  {
    id: 'bill_04',
    title: 'Digital Cloud Storage (2TB Google One)',
    amount: 390,
    dueDate: `${currentMonthKey}-26`,
    category: 'Utilities & Bills',
    isPaid: false,
    recurringFrequency: 'Monthly',
    billType: 'subscription',
    provider: 'Google Services',
    reminderDaysBefore: 2,
    autoRenew: true,
  },
  {
    id: 'bill_05',
    title: 'Spotify Family Audio Subscription',
    amount: 179,
    dueDate: `${currentMonthKey}-15`,
    category: 'Entertainment & Leisure',
    isPaid: true,
    paidDate: `${currentMonthKey}-15`,
    recurringFrequency: 'Monthly',
    billType: 'subscription',
    provider: 'Spotify AB',
    autoRenew: true,
  },
  {
    id: 'bill_06',
    title: 'Gym & Fitness Center Membership',
    amount: 2500,
    dueDate: `${currentMonthKey}-29`,
    category: 'Healthcare & Medical',
    isPaid: false,
    recurringFrequency: 'Monthly',
    billType: 'subscription',
    provider: 'Cult Fit Health',
    reminderDaysBefore: 3,
  },
];

// Local Storage Helper Methods
function loadItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error loading key "${key}" from localStorage:`, err);
    return defaultValue;
  }
}

function saveItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving key "${key}" to localStorage:`, err);
  }
}

export const StorageService = {
  getProfile: (): UserProfile => loadItem(STORAGE_KEYS.PROFILE, initialProfile),
  saveProfile: (p: UserProfile): void => saveItem(STORAGE_KEYS.PROFILE, p),

  getTransactions: (): Transaction[] => loadItem(STORAGE_KEYS.TRANSACTIONS, initialTransactions),
  saveTransactions: (txs: Transaction[]): void => saveItem(STORAGE_KEYS.TRANSACTIONS, txs),

  getBudgets: (): MonthlyBudget[] => loadItem(STORAGE_KEYS.BUDGETS, initialBudgets),
  saveBudgets: (b: MonthlyBudget[]): void => saveItem(STORAGE_KEYS.BUDGETS, b),

  getShoppingLists: (): ShoppingList[] => loadItem(STORAGE_KEYS.SHOPPING_LISTS, initialShoppingLists),
  saveShoppingLists: (s: ShoppingList[]): void => saveItem(STORAGE_KEYS.SHOPPING_LISTS, s),

  getPriceComparisons: (): PriceComparison[] => loadItem(STORAGE_KEYS.PRICE_COMPARISONS, initialPriceComparisons),
  savePriceComparisons: (p: PriceComparison[]): void => saveItem(STORAGE_KEYS.PRICE_COMPARISONS, p),

  getSavingsGoals: (): SavingsGoal[] => loadItem(STORAGE_KEYS.SAVINGS_GOALS, initialSavingsGoals),
  saveSavingsGoals: (g: SavingsGoal[]): void => saveItem(STORAGE_KEYS.SAVINGS_GOALS, g),

  getSavingChallenges: (): SavingChallenge[] => loadItem(STORAGE_KEYS.SAVING_CHALLENGES, initialSavingChallenges),
  saveSavingChallenges: (c: SavingChallenge[]): void => saveItem(STORAGE_KEYS.SAVING_CHALLENGES, c),

  getBills: (): Bill[] => loadItem(STORAGE_KEYS.BILLS, initialBills),
  saveBills: (b: Bill[]): void => saveItem(STORAGE_KEYS.BILLS, b),

  // Dedicated Theme Storage
  getTheme: (): 'light' | 'dark' => {
    try {
      const explicit = localStorage.getItem(STORAGE_KEYS.THEME);
      if (explicit === 'light' || explicit === 'dark') return explicit;
      const profile = StorageService.getProfile();
      if (profile?.theme === 'light' || profile?.theme === 'dark') return profile.theme;
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {
      // Fallback
    }
    return 'light';
  },

  saveTheme: (theme: 'light' | 'dark'): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (e) {
      console.error('Failed to store theme preference:', e);
    }
  },

  // Reset to initial demo data (preserves visual theme)
  resetToDemoData: (): void => {
    const currentTheme = StorageService.getTheme();
    saveItem(STORAGE_KEYS.PROFILE, { ...initialProfile, theme: currentTheme });
    saveItem(STORAGE_KEYS.TRANSACTIONS, initialTransactions);
    saveItem(STORAGE_KEYS.BUDGETS, initialBudgets);
    saveItem(STORAGE_KEYS.SHOPPING_LISTS, initialShoppingLists);
    saveItem(STORAGE_KEYS.PRICE_COMPARISONS, initialPriceComparisons);
    saveItem(STORAGE_KEYS.SAVINGS_GOALS, initialSavingsGoals);
    saveItem(STORAGE_KEYS.SAVING_CHALLENGES, initialSavingChallenges);
    saveItem(STORAGE_KEYS.BILLS, initialBills);
  },

  // Export all application data as JSON
  exportAllData: (): string => {
    const backup = {
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      profile: StorageService.getProfile(),
      transactions: StorageService.getTransactions(),
      budgets: StorageService.getBudgets(),
      shoppingLists: StorageService.getShoppingLists(),
      priceComparisons: StorageService.getPriceComparisons(),
      savingsGoals: StorageService.getSavingsGoals(),
      savingChallenges: StorageService.getSavingChallenges(),
      bills: StorageService.getBills(),
    };
    return JSON.stringify(backup, null, 2);
  },

  // Import JSON backup
  importData: (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.profile) StorageService.saveProfile(data.profile);
      if (Array.isArray(data.transactions)) StorageService.saveTransactions(data.transactions);
      if (Array.isArray(data.budgets)) StorageService.saveBudgets(data.budgets);
      if (Array.isArray(data.shoppingLists)) StorageService.saveShoppingLists(data.shoppingLists);
      if (Array.isArray(data.priceComparisons)) StorageService.savePriceComparisons(data.priceComparisons);
      if (Array.isArray(data.savingsGoals)) StorageService.saveSavingsGoals(data.savingsGoals);
      if (Array.isArray(data.savingChallenges)) StorageService.saveSavingChallenges(data.savingChallenges);
      if (Array.isArray(data.bills)) StorageService.saveBills(data.bills);
      return true;
    } catch (e) {
      console.error('Failed to import JSON data:', e);
      return false;
    }
  },
};
