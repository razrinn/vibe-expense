import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  isVisible: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, type, isVisible }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/30 border-green-500';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/30 border-red-500';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-500';
      case 'info':
      default:
        return 'bg-blue-50 dark:bg-blue-900/30 border-blue-500';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800 dark:text-green-200';
      case 'error':
        return 'text-red-800 dark:text-red-200';
      case 'warning':
        return 'text-yellow-800 dark:text-yellow-200';
      case 'info':
      default:
        return 'text-blue-800 dark:text-blue-200';
    }
  };

  const visibilityClasses = isVisible
    ? 'translate-y-0 opacity-100'
    : 'translate-y-2 opacity-0 pointer-events-none';

  return (
    <div
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 ${visibilityClasses} transition-all duration-300 ease-in-out z-50 max-w-sm w-full`}
      role="alert"
    >
      <div className={`flex items-center p-4 rounded-lg shadow-lg border-l-4 ${getBackgroundColor()}`}>
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className={`ml-3 ${getTextColor()}`}>
          <p className="text-sm font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Toast;