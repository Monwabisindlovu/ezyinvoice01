// utils/currency.ts

// Currency type definition
export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

// Predefined list of supported currencies
export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
];

// Simplified formatCurrency function
export function formatCurrency(amount: number, currencySymbol: string): string {
  return `${currencySymbol}${amount.toFixed(2)}`;
}
