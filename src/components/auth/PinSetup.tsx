import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { validatePin } from '../../utils/auth';
import { useToast } from '../../context/ToastContext';
import { Shield, KeyRound } from 'lucide-react';

const PinSetup: React.FC = () => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const { setupPin } = useAuth();
  const { showToast } = useToast();

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (/^\d*$/.test(value) && value.length <= 6) {
      setPin(value);
      setError('');
    }
  };

  const handleConfirmPinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (/^\d*$/.test(value) && value.length <= 6) {
      setConfirmPin(value);
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate PIN
    if (!validatePin(pin)) {
      setError('PIN must be 4 or 6 digits');
      return;
    }
    
    // Check if PINs match
    if (pin !== confirmPin) {
      setError('PINs do not match');
      return;
    }
    
    // Set up PIN
    setupPin(pin);
    showToast({ 
      message: 'PIN set successfully!', 
      type: 'success' 
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 mb-4">
            <Shield className="h-8 w-8 text-green-600 dark:text-green-300" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome to ExpenseTrack</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Set up a PIN to secure your expense data
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="pin" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Create PIN (4 or 6 digits)
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyRound className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                id="pin"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-green-500 focus:border-green-500"
                value={pin}
                onChange={handlePinChange}
                inputMode="numeric"
                pattern="\d{4}|\d{6}"
                autoComplete="new-password"
                placeholder="Enter 4 or 6 digits"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="confirmPin" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Confirm PIN
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyRound className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                id="confirmPin"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-green-500 focus:border-green-500"
                value={confirmPin}
                onChange={handleConfirmPinChange}
                inputMode="numeric"
                pattern="\d{4}|\d{6}"
                autoComplete="new-password"
                placeholder="Confirm your PIN"
                required
              />
            </div>
          </div>
          
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
          
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            Set PIN
          </button>
        </form>
        
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          You'll need this PIN to access your expense data. Keep it safe and don't share it with others.
        </div>
      </div>
    </div>
  );
};

export default PinSetup;