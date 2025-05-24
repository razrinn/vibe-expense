import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, AlertCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const PinLogin: React.FC = () => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const { verifyPin } = useAuth();
  const { showToast } = useToast();

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (/^\d*$/.test(value) && value.length <= 6) {
      setPin(value);
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verifyPin(pin)) {
      showToast({ 
        message: 'Login successful!', 
        type: 'success' 
      });
    } else {
      setError('Incorrect PIN. Please try again.');
      setIsShaking(true);
      setPin('');
      
      // Reset shaking animation after it completes
      setTimeout(() => {
        setIsShaking(false);
      }, 500);
    }
  };

  // Focus the input field when component mounts
  useEffect(() => {
    const inputElement = document.getElementById('pin');
    if (inputElement) {
      inputElement.focus();
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className={`w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all ${isShaking ? 'animate-shake' : ''}`}>
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 mb-4">
            <Lock className="h-8 w-8 text-green-600 dark:text-green-300" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Enter your PIN to access your expenses
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="password"
                id="pin"
                className="block w-full px-4 py-3 text-center text-xl border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-green-500 focus:border-green-500"
                value={pin}
                onChange={handlePinChange}
                inputMode="numeric"
                autoComplete="current-password"
                placeholder="• • • •"
                required
              />
            </div>
          </div>
          
          {error && (
            <div className="flex items-center text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span>{error}</span>
            </div>
          )}
          
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
};

export default PinLogin;