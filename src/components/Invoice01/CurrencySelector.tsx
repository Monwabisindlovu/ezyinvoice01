import React from "react";
import currencyCodes from "currency-codes";

// Define the Currency type
interface Currency {
  code: string;
  symbol: string;
  name: string;
}

// Manual symbol mapping for commonly used currencies
const SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  ZAR: "R",
  // Add more symbols as needed...
};

// Dynamically generate the list of currencies
const CURRENCIES: Currency[] = currencyCodes.codes().map((code) => {
  const currencyData = currencyCodes.code(code);

  if (!currencyData) {
    // Skip if currencyData is undefined
    return null;
  }

  return {
    code: currencyData.code,
    symbol: SYMBOLS[currencyData.code] || currencyData.code, // Use symbol mapping or fallback to code
    name: currencyData.currency,
  };
}).filter((currency): currency is Currency => currency !== null); // Remove any null values

interface CurrencySelectorProps {
  selectedCurrency: string; // The current currency code (string)
  onCurrencyChange: (currency: Currency) => void; // Function to pass the full Currency object
  className?: string; // Optional className for styling
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  selectedCurrency,
  onCurrencyChange,
  className,
}) => {
  // Handle when the selected currency changes
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // Find the full Currency object based on the selected code
    const selectedCurrencyObj = CURRENCIES.find(
      (currency) => currency.code === event.target.value
    );

    // If found, call onCurrencyChange with the full Currency object
    if (selectedCurrencyObj) {
      onCurrencyChange(selectedCurrencyObj);
    }
  };

  return (
    <div
      className={`flex items-center bg-gray-800 text-white p-1 rounded shadow ${className}`}
      style={{ width: "100%" }}
    >
      {/* Display inline label */}
      <span className="text-xs font-semibold mr-2">Currency:</span>

      {/* Currency Dropdown */}
      <select
        value={selectedCurrency} // Value is the code of the selected currency
        onChange={handleChange} // Handle the change event to update the currency
        className="w-full p-0.5 bg-gray-800 border border-gray-700 text-xs text-white rounded"
        style={{ height: "24px" }} // Smaller height
      >
        {CURRENCIES.map((currency) => (
          <option key={currency.code} value={currency.code}>
            {currency.symbol} {currency.name} ({currency.code}) {/* Display the symbol, name, and code */}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencySelector;
