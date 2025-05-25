import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { AuthState } from '../types';
import { hashPin } from '../utils/auth';

interface AuthContextType {
  auth: AuthState;
  setupPin: (pin: string) => void;
  verifyPin: (pin: string) => boolean;
  logout: () => void;
  resetPinAndLogout: () => void; // New function for resetting PIN and logging out
  updateActivity: () => void;
}

const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    isInitialized: false,
    hasPin: false,
    lastActivity: Date.now(),
  });

  // Check for existing PIN and initialize auth state
  useEffect(() => {
    const hashedPin = localStorage.getItem('userPin');

    setAuth({
      isAuthenticated: false,
      isInitialized: true,
      hasPin: !!hashedPin,
      lastActivity: Date.now(),
    });

    // Set up inactivity checker
    const interval = setInterval(() => {
      const lastActivity = auth.lastActivity;
      const now = Date.now();

      if (auth.isAuthenticated && now - lastActivity > SESSION_TIMEOUT) {
        logout();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Track user activity
  useEffect(() => {
    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll'];

    const handleActivity = () => {
      updateActivity();
    };

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, []);

  const setupPin = (pin: string) => {
    const hashedPin = hashPin(pin);
    localStorage.setItem('userPin', hashedPin);

    setAuth((prev) => ({
      ...prev,
      hasPin: true,
      isAuthenticated: true,
      lastActivity: Date.now(),
    }));
  };

  const verifyPin = (pin: string) => {
    const hashedPin = localStorage.getItem('userPin');
    const inputHashedPin = hashPin(pin);

    if (hashedPin === inputHashedPin) {
      setAuth((prev) => ({
        ...prev,
        isAuthenticated: true,
        lastActivity: Date.now(),
      }));
      return true;
    }

    return false;
  };

  const logout = () => {
    setAuth((prev) => ({
      ...prev,
      isAuthenticated: false,
      lastActivity: Date.now(),
    }));
  };

  const resetPinAndLogout = () => {
    localStorage.removeItem('userPin'); // Remove PIN from local storage
    setAuth((prev) => ({
      ...prev,
      isAuthenticated: false,
      hasPin: false, // Set hasPin to false
      lastActivity: Date.now(),
    }));
  };

  const updateActivity = () => {
    setAuth((prev) => ({
      ...prev,
      lastActivity: Date.now(),
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        setupPin,
        verifyPin,
        logout,
        resetPinAndLogout,
        updateActivity,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
