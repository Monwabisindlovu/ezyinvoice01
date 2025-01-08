import React, { createContext, useState, ReactNode } from 'react';

// Define the context types
interface CurrencyContextProps {
    selectedCurrency: string;
    setSelectedCurrency: (currency: string) => void;
}

// Create a context with default values
export const CurrencyContext = createContext<CurrencyContextProps>({
    selectedCurrency: 'USD',  // Default currency is USD
    setSelectedCurrency: () => {},  // Default function does nothing
});

// CurrencyProvider component to provide the context value
export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedCurrency, setSelectedCurrency] = useState('USD');  // Initial state of currency

    return (
        <CurrencyContext.Provider value={{ selectedCurrency, setSelectedCurrency }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export default CurrencyContext;