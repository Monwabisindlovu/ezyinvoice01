// CurrencyApp.tsx
import React, { useState, useEffect } from 'react';
import currencyCodes from 'currency-codes';
import currencySymbolMap from 'currency-symbol-map';

const CurrencyApp: React.FC = () => {
  // Initialize the currency list and set default values
  const currencyList = currencyCodes.data.map((currency) => ({
    code: currency.code,
    name: currency.currency,
  }));

  const [currency, setCurrency] = useState<string>('USD');
  const [currencySymbol, setCurrencySymbol] = useState<string>('$');

  useEffect(() => {
    // Update the symbol whenever the currency changes
    const symbol = currencySymbolMap(currency) || currency;
    setCurrencySymbol(symbol);
  }, [currency]);

  const handleCurrencyChange = (currencyCode: string) => {
    setCurrency(currencyCode);
  };

  return (
    <div>
      <div className="currency-selection">
        <label>Currency:</label>
        <select value={currency} onChange={(e) => handleCurrencyChange(e.target.value)}>
          {currencyList.map((curr) => (
            <option key={curr.code} value={curr.code}>
              {curr.code} - {curr.name}
            </option>
          ))}
        </select>
      </div>

      {/* Return currency and symbol so other components can use them */}
      <div>{currencySymbol}</div>
    </div>
  );
};

export default CurrencyApp;