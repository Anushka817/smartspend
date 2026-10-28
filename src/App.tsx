import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardOverview } from './pages/DashboardOverview';
import { TransactionsPage } from './pages/TransactionsPage';
import { BudgetsPage } from './pages/BudgetsPage';
import { ShoppingPlannerPage } from './pages/ShoppingPlannerPage';
import { PriceComparisonPage } from './pages/PriceComparisonPage';
import { SavingsGoalsPage } from './pages/SavingsGoalsPage';
import { BillsPage } from './pages/BillsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Marketing */}
          <Route path="/" element={<LandingPage />} />

          {/* Authentication & Onboarding */}
          <Route path="/auth/login" element={<AuthPage />} />
          <Route path="/auth/register" element={<AuthPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />

          {/* Authenticated Dashboard Core Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/app" element={<DashboardOverview />} />
            <Route path="/dashboard" element={<Navigate to="/app" replace />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/budgets" element={<BudgetsPage />} />
            <Route path="/shopping" element={<ShoppingPlannerPage />} />
            <Route path="/comparison" element={<PriceComparisonPage />} />
            <Route path="/savings" element={<SavingsGoalsPage />} />
            <Route path="/bills" element={<BillsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
