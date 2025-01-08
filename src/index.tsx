// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';  // Using React 18's createRoot method
import './index.css';  // Assuming this file exists
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
