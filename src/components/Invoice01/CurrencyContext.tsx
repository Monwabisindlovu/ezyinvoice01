import React, { createContext, useContext, useState, ReactNode } from 'react';

// Example structure for your Currency type
export interface Currency {
  code: string;
  symbol: string;
}

const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
];

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

// Create a context with a default value (undefined for 'currency' and 'setCurrency')
const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// CurrencyProvider component to provide the context value
export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]); // Default to USD

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

// Custom hook to use the CurrencyContext
export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export default CurrencyContext;
