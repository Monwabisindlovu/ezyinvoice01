// App.tsx
import React from 'react';
import { CurrencyProvider } from './CurrencyContext';
import NewInvoiceTemplate from './NewInvoiceTemplate';

const App: React.FC = () => {
  return (
    <CurrencyProvider>
      <NewInvoiceTemplate />
    </CurrencyProvider>
  );
};

export default App;