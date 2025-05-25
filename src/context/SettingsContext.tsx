import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

interface SettingsContextType {
  currency: string;
  setCurrency: (currency: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currency, setCurrency] = useState<string>(() => {
    // Initialize currency from local storage or default to 'IDR'
    const storedCurrency = localStorage.getItem('userCurrency');
    return storedCurrency || 'IDR';
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
