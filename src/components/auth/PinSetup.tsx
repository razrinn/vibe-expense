import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { validatePin } from '../../utils/auth';
import { useToast } from '../../context/ToastContext';
import { Shield, KeyRound } from 'lucide-react';
import Input from '../ui/forms/Input';

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
      type: 'success',
    });
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-black-950 px-4'>
      <div className='w-full max-w-md bg-white dark:bg-black-900 rounded-lg shadow-md p-6 space-y-6'>
        <div className='text-center'>
          <div className='mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100 dark:bg-black-800 mb-4'>
            <Shield className='h-8 w-8 text-green-600 dark:text-green-300' />
          </div>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
            Welcome to VibeExpense
          </h1>
          <p className='mt-2 text-gray-600 dark:text-gray-300'>
            Set up a PIN to secure your expense data
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <Input
            label='Create PIN (4 or 6 digits)'
            id='pin'
            type='password'
            value={pin}
            onChange={handlePinChange}
            inputMode='numeric'
            pattern='\d{4}|\d{6}'
            autoComplete='new-password'
            placeholder='Enter 4 or 6 digits'
            required
            error={error}
            icon={<KeyRound className='h-5 w-5 text-gray-400' />}
          />

          <Input
            label='Confirm PIN'
            id='confirmPin'
            type='password'
            value={confirmPin}
            onChange={handleConfirmPinChange}
            inputMode='numeric'
            pattern='\d{4}|\d{6}'
            autoComplete='new-password'
            placeholder='Confirm your PIN'
            required
            error={error}
            icon={<KeyRound className='h-5 w-5 text-gray-400' />}
          />

          {error && (
            <p className='text-sm text-red-600 dark:text-red-400'>{error}</p>
          )}

          <button
            type='submit'
            className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors'
          >
            Set PIN
          </button>
        </form>

        <div className='text-xs text-gray-500 dark:text-gray-400 text-center'>
          You'll need this PIN to access your expense data. Keep it safe and
          don't share it with others.
        </div>
      </div>
    </div>
  );
};

export default PinSetup;
