import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { Currency } from '../types';

interface SettingsContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currency, setCurrency] = useState<Currency>(() => {
    // Initialize currency from local storage with type safety
    const storedCurrency = localStorage.getItem('userCurrency');
    const validCurrencies: Currency[] = [
      'USD',
      'IDR',
      'EUR',
      'GBP',
      'JPY',
      'CNY',
      'INR',
      'KRW',
      'THB',
      'VND',
      'PHP',
      'MYR',
      'SGD',
      'AUD',
      'CAD',
      'CHF',
    ];
    return storedCurrency &&
      validCurrencies.includes(storedCurrency as Currency)
      ? (storedCurrency as Currency)
      : 'IDR';
  });

  useEffect(() => {
    // Save currency to local storage whenever it changes
    localStorage.setItem('userCurrency', currency);
  }, [currency]);

  return (
    <SettingsContext.Provider value={{ currency, setCurrency }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
