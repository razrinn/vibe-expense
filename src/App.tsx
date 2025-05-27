import React, { Suspense, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
const HomePage = React.lazy(() => import('./pages/HomePage'));
const ExpensesPage = React.lazy(() => import('./pages/ExpensesPage'));
const AddExpensePage = React.lazy(() => import('./pages/AddExpensePage'));
const EditExpensePage = React.lazy(() => import('./pages/EditExpensePage'));
const AnalyticsPage = React.lazy(() => import('./pages/AnalyticsPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));
const PWAInstallationPage = React.lazy(
  () => import('./pages/PWAInstallationPage')
);
const CategoryManagementPage = React.lazy(
  () => import('./pages/CategoryManagementPage')
);

// Auth Components
import PinSetup from './components/auth/PinSetup';
import PinLogin from './components/auth/PinLogin';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import { ToastProvider } from './context/ToastContext';
import { SettingsProvider } from './context/SettingsContext';
import PageLayout from './components/layout/PageLayout';

// Add the following style to prevent content jump when scrollbar appears/disappears
const scrollbarStyle = `
  html {
    scrollbar-width: thin;
    overflow-y: scroll;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-8px); }
    75% { transform: translateX(8px); }
  }

  .animate-shake {
    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
  }

  .shadow-top {
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  }
`;

// Auth wrapper component
const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { auth } = useAuth();

  if (!auth.isInitialized) {
    return (
      <div className='flex items-center justify-center min-h-dvh'>
        <p className='text-gray-500 dark:text-gray-400'>Loading...</p>
      </div>
    );
  }

  if (!auth.hasPin) {
    return <PinSetup />;
  }

  if (!auth.isAuthenticated) {
    return <PinLogin />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<PageLayout />}>
          <Route
            index
            element={
              <Suspense>
                <HomePage />
              </Suspense>
            }
          />
          <Route
            path='/expenses'
            element={
              <Suspense>
                <ExpensesPage />
              </Suspense>
            }
          />
          <Route
            path='/add'
            element={
              <Suspense>
                <AddExpensePage />
              </Suspense>
            }
          />
          <Route
            path='/edit/:id'
            element={
              <Suspense>
                <EditExpensePage />
              </Suspense>
            }
          />
          <Route
            path='/analytics'
            element={
              <Suspense>
                <AnalyticsPage />
              </Suspense>
            }
          />
          <Route
            path='/settings'
            element={
              <Suspense>
                <SettingsPage />
              </Suspense>
            }
          />
          <Route
            path='/settings/installation'
            element={
              <Suspense>
                <PWAInstallationPage />
              </Suspense>
            }
          />
          <Route
            path='/settings/category'
            element={
              <Suspense>
                <CategoryManagementPage />
              </Suspense>
            }
          />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Route>
      </Routes>
    </Router>
  );
};

function App() {
  // Add the scrollbar style to prevent layout shift
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = scrollbarStyle;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <ThemeProvider>
      <ToastProvider>
        <SettingsProvider>
          <AuthProvider>
            <ExpenseProvider>
              <AuthWrapper>
                <AppRoutes />
              </AuthWrapper>
            </ExpenseProvider>
          </AuthProvider>
        </SettingsProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
