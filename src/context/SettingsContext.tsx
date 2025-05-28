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
  sessionExpirationMinutes: number;
  setSessionExpirationMinutes: (minutes: number) => void;
  enableSessionExpiration: boolean;
  setEnableSessionExpiration: (enabled: boolean) => void;
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

  const [sessionExpirationMinutes, setSessionExpirationMinutes] =
    useState<number>(() => {
      const storedExpiration = localStorage.getItem('sessionExpirationMinutes');
      return storedExpiration ? parseInt(storedExpiration, 10) : 15; // Default to 15 minutes
    });

  const [enableSessionExpiration, setEnableSessionExpiration] =
    useState<boolean>(() => {
      const storedEnable = localStorage.getItem('enableSessionExpiration');
      return storedEnable ? JSON.parse(storedEnable) : true; // Default to enabled
    });

  useEffect(() => {
    localStorage.setItem('userCurrency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem(
      'sessionExpirationMinutes',
      sessionExpirationMinutes.toString()
    );
  }, [sessionExpirationMinutes]);

  useEffect(() => {
    localStorage.setItem(
      'enableSessionExpiration',
      JSON.stringify(enableSessionExpiration)
    );
  }, [enableSessionExpiration]);

  return (
    <SettingsContext.Provider
      value={{
        currency,
        setCurrency,
        sessionExpirationMinutes,
        setSessionExpirationMinutes,
        enableSessionExpiration,
        setEnableSessionExpiration,
      }}
    >
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
