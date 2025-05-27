import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import ExpensesPage from './pages/ExpensesPage';
import AddExpensePage from './pages/AddExpensePage';
import EditExpensePage from './pages/EditExpensePage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import PWAInstallationPage from './pages/PWAInstallationPage';
import CategoryManagementPage from './pages/CategoryManagementPage';

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
          <Route index element={<HomePage />} />
          <Route path='/expenses' element={<ExpensesPage />} />
          <Route path='/add' element={<AddExpensePage />} />
          <Route path='/edit/:id' element={<EditExpensePage />} />
          <Route path='/analytics' element={<AnalyticsPage />} />
          <Route path='/settings' element={<SettingsPage />} />
          <Route
            path='/settings/installation'
            element={<PWAInstallationPage />}
          />
          <Route
            path='/settings/category'
            element={<CategoryManagementPage />}
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
      <SettingsProvider>
        {' '}
        {/* Wrap with SettingsProvider */}
        <AuthProvider>
          <ToastProvider>
            <ExpenseProvider>
              <AuthWrapper>
                <AppRoutes />
              </AuthWrapper>
            </ExpenseProvider>
          </ToastProvider>
        </AuthProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;
