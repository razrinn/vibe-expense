import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import { AuthState } from '../types';
import { deleteCookie, getCookie, hashPin, setCookie } from '../utils/auth';
import { useToast } from './ToastContext';
import { useSettings } from './SettingsContext';

interface AuthContextType {
  auth: AuthState;
  setupPin: (pin: string) => void;
  verifyPin: (pin: string) => boolean;
  logout: () => void;
  resetPinAndLogout: () => void;
}

const SESSION_COOKIE_NAME = 'vibe_session';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    isInitialized: false,
    hasPin: false,
  });

  const { showToast } = useToast();
  const { sessionExpirationMinutes, enableSessionExpiration } = useSettings();

  const logout = useCallback(() => {
    deleteCookie(SESSION_COOKIE_NAME);
    setAuth((prev) => ({
      ...prev,
      isAuthenticated: false,
    }));
  }, []);

  const resetPinAndLogout = () => {
    localStorage.removeItem('userPin');
    deleteCookie(SESSION_COOKIE_NAME);
    setAuth((prev) => ({
      ...prev,
      isAuthenticated: false,
      hasPin: false,
    }));
  };

  const setupPin = (pin: string) => {
    const hashedPin = hashPin(pin);
    localStorage.setItem('userPin', hashedPin);
    const newSessionId = Date.now().toString(); // Simple session ID
    setCookie(
      SESSION_COOKIE_NAME,
      newSessionId,
      sessionExpirationMinutes,
      enableSessionExpiration
    );

    setAuth((prev) => ({
      ...prev,
      hasPin: true,
      isAuthenticated: true,
    }));
  };

  const verifyPin = (pin: string) => {
    const hashedPin = localStorage.getItem('userPin');
    const inputHashedPin = hashPin(pin);

    if (hashedPin === inputHashedPin) {
      const newSessionId = Date.now().toString(); // Simple session ID
      setCookie(
        SESSION_COOKIE_NAME,
        newSessionId,
        sessionExpirationMinutes,
        enableSessionExpiration
      );
      setAuth((prev) => ({
        ...prev,
        isAuthenticated: true,
      }));
      return true;
    }

    return false;
  };

  // Check for existing PIN and session cookie on mount
  useEffect(() => {
    const hashedPin = localStorage.getItem('userPin');
    const sessionId = getCookie(SESSION_COOKIE_NAME);

    setAuth({
      isAuthenticated: !!sessionId, // Authenticated if session cookie exists
      isInitialized: true,
      hasPin: !!hashedPin,
    });
  }, []);

  // Periodic check for session cookie expiration
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (auth.isAuthenticated) {
      intervalId = setInterval(() => {
        const sessionId = getCookie(SESSION_COOKIE_NAME);
        if (!sessionId) {
          showToast({
            message: 'Session expired. Please log in again.',
            type: 'error',
          });
          logout();
        }
      }, 30 * 1000); // Check every minute
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [auth.isAuthenticated, logout, showToast]);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setupPin,
        verifyPin,
        logout,
        resetPinAndLogout,
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
