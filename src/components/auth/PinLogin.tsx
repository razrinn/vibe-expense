import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import Input from '../ui/forms/Input';

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
        type: 'success',
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
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-black-950 px-4'>
      <div
        className={`w-full max-w-md bg-white dark:bg-black-900 rounded-lg shadow-md p-6 transition-all ${
          isShaking ? 'animate-shake' : ''
        }`}
      >
        <div className='text-center mb-6'>
          <div className='mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100 dark:bg-black-800 mb-4'>
            <Lock className='h-8 w-8 text-green-600 dark:text-green-300' />
          </div>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
            Welcome Back
          </h1>
          <p className='mt-2 text-gray-600 dark:text-gray-300'>
            Enter your PIN to access your expenses
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <Input
              type='password'
              id='pin'
              className='text-center text-xl'
              value={pin}
              onChange={handlePinChange}
              inputMode='numeric'
              autoComplete='current-password'
              placeholder='• • • •'
              required
              error={error}
            />
          </div>

          <button
            type='submit'
            className='w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors'
          >
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
};

export default PinLogin;
