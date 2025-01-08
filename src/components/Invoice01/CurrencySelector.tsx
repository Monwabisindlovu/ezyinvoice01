import React, { useState, useEffect } from 'react';
import { CurrencyContext } from './CurrencyContext';

// Full currency data mapping: code, name, and symbol
const currencyMapping: { [key: string]: { name: string, symbol: string } } = {
  AFA: { name: 'Afghan Afghani', symbol: '؋' },
  ALL: { name: 'Albanian Lek', symbol: 'L' },
  DZD: { name: 'Algerian Dinar', symbol: 'د.ج' },
  AOA: { name: 'Angolan Kwanza', symbol: 'Kz' },
  ARS: { name: 'Argentine Peso', symbol: '$' },
  AUD: { name: 'Australian Dollar', symbol: 'A$' },
  // ... (include all currencies as before)
  ZAR: { name: 'South African Rand', symbol: 'R' },
  BTC: { name: 'Bitcoin', symbol: '₿' },
};

interface CurrencySelectorProps {
  selectedCurrency: string;
  onCurrencyChange: (currencyCode: string) => void;
  className?: string;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ selectedCurrency, onCurrencyChange, className }) => {
  const [currencyList, setCurrencyList] = useState<{ [key: string]: { name: string, symbol: string } } | null>(null);
  
  // Fetch currency data dynamically when the component mounts
  useEffect(() => {
    // Example API endpoint for currency data
    const fetchCurrencyData = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD'); // Or another currency API
        const data = await response.json();
        
        // Transform the fetched data to a format we can use (currency code to name and symbol)
        const fetchedCurrencies = Object.keys(data.rates).reduce((acc, code) => {
          acc[code] = { name: code, symbol: code }; // Customize as needed (e.g., map to country names)
          return acc;
        }, {} as { [key: string]: { name: string, symbol: string } });
        
        setCurrencyList(fetchedCurrencies);
      } catch (error) {
        console.error('Error fetching currency data:', error);
      }
    };

    fetchCurrencyData();
  }, []);

  // If the currency list hasn't loaded yet, show a loading indicator
  if (!currencyList) {
    return <div>Loading currencies...</div>;
  }

  return (
    <div className={`flex items-center bg-gray-800 text-white p-1 rounded shadow ${className}`} style={{ width: '100%' }}>
      {/* Display inline label */}
      <span className="text-xs font-semibold mr-2">Currency:</span>

      {/* Currency Dropdown */}
      <select
        id="currency"
        value={selectedCurrency}
        onChange={(e) => onCurrencyChange(e.target.value)}
        className="w-full p-0.5 bg-gray-800 border border-gray-700 text-xs text-white rounded"
        style={{ height: '24px' }} // Smaller height
      >
        {Object.keys(currencyMapping).map((currencyCode) => {
          const currencyData = currencyMapping[currencyCode]; // Get name and symbol from mapping

          return (
            <option key={currencyCode} value={currencyCode}>
              {currencyCode} - {currencyData.name} ({currencyData.symbol}) 
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default CurrencySelector;
