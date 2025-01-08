import React, { ChangeEvent } from 'react';
import { formatCurrency } from '../../utils/currency';

interface Currency {
    code: string;
    name: string;
}

interface ItemData {
    showTax: boolean;
}

interface InvoiceTotalsProps {
    subtotal: number;
    vat: number;
    total: number;
    vatPercentage: number;
    currency: string;
    currencySymbol: string;
    currencyList: Currency[];
    onCurrencyChange: (currencyCode: string) => void;
    items: ItemData[];
}

const InvoiceTotals: React.FC<InvoiceTotalsProps> = ({
  subtotal,
  vat,
  total,
  vatPercentage,
  currency,
  currencySymbol,
  currencyList,
  onCurrencyChange,
  items,
}) => {
  return (
    <div className="flex flex-col space-y-4 flex-1">
      <div className="flex flex-col space-y-2 amount-details mt-4">
        <div className="subtotal flex justify-between">
          <span>Subtotal:</span>
          <span className="ml-4">{formatCurrency(subtotal, currencySymbol)}</span>
        </div>

        {/* Conditionally show VAT if vat > 0 */}
        <div
          className="vat flex justify-between"
          style={{ display: vat > 0 ? 'flex' : 'none' }}
        >
          <span>
            {items.some((item) => item.showTax)
              ? `VAT ${vatPercentage.toFixed(2)}%`
              : ''}
            :
          </span>
          <span className="ml-4">{formatCurrency(vat, currencySymbol)}</span>
        </div>

        {/* TOTAL section with aligned spacing */}
        <div className="total flex justify-between items-center">
          {/* TOTAL with currency dropdown */}
          <div className="flex items-center space-x-2">
            <span className="flex-none">TOTAL: {currency}</span>

            {/* Currency Dropdown */}
            <div className="flex items-center space-x-2">
              <span className="flex-none">Currency:</span>
              <select
                className="px-1 py-0.5 text-xs max-w-20 bg-white border border-gray-300 rounded-md"
                value={currency}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  onCurrencyChange(e.target.value)
                }
              >
                {currencyList.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code} - {curr.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Total Amount */}
          <span className="ml-4 flex-none">{formatCurrency(total, currencySymbol)}</span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTotals;
