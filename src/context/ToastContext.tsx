import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ToastOptions } from '../types';
import Toast from '../components/ui/Toast';

interface ToastContextType {
  showToast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<ToastOptions | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showToast = useCallback((options: ToastOptions) => {
    setToast(options);
    setIsVisible(true);

    // Auto-hide the toast after the specified duration
    const duration = options.duration || 3000;
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => setToast(null), 300); // Remove after fade out animation
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && <Toast message={toast.message} type={toast.type} isVisible={isVisible} />}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};