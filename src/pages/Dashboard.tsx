import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import InvoiceForm from '../components/Invoice/InvoiceForm';
import NewInvoiceTemplate from '../components/Invoice01/NewInvoiceTemplate';

interface DashboardProps {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const Dashboard: React.FC<DashboardProps> = ({ isAuthenticated, setIsAuthenticated }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<'template01' | 'template02'>('template01');
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');

    if (token) {
      localStorage.setItem('jwtToken', token);
      setIsAuthenticated(true);
      window.history.replaceState({}, document.title, '/dashboard');
    }
  }, [setIsAuthenticated]);

  const promptLogin = () => {
    alert('Please log in or sign up to use this feature.');
    navigate('/login');
  };

  const handleTemplateClick = (template: 'template01' | 'template02') => {
    setSelectedTemplate(template);
  };

  return (
    <main className="p-8 max-w-5xl mx-auto">
      {/* SEO Metadata */}
      <Helmet>
        <title>Dashboard | EzyInvoice</title>
        <meta
          name="description"
          content="Access the EzyInvoice dashboard to create and customize invoices with professional templates."
        />
      </Helmet>

      {/* SEO Headline */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
          Welcome to <span className="text-blue-600">EzyInvoice</span> Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300 text-center text-sm">
          Generate, customize, and download invoices quickly and easily with professional templates.
        </p>
      </header>

      {/* Template Selector */}
      <section aria-label="Invoice Template Selection" className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
          Choose Your <span className="text-blue-600">Invoice Template</span>
        </h2>

        <div className="flex flex-wrap gap-4">
          {/* InvoFlow Template */}
          <button
            className={`p-4 rounded-md shadow-md cursor-pointer transition w-full sm:w-60 h-20 flex flex-col items-center justify-center text-center ${
              selectedTemplate === 'template01'
                ? 'border-2 border-blue-600 bg-blue-50'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => handleTemplateClick('template01')}
          >
            <h3 className="text-sm font-semibold text-blue-700">InvoFlow</h3>
            <span className="text-xs text-gray-600">Sleek and simple invoicing</span>
          </button>

          {/* EquiBill Template (Requires Auth) */}
          <button
            className={`p-4 rounded-md shadow-md cursor-pointer transition w-full sm:w-60 h-20 flex flex-col items-center justify-center text-center ${
              selectedTemplate === 'template02'
                ? 'border-2 border-green-600 bg-green-50'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => handleTemplateClick('template02')}
          >
            <h3 className="text-sm font-semibold text-green-700">EquiBill</h3>
            <span className="text-xs text-gray-600">Professional and balanced billing</span>
          </button>
        </div>
      </section>

      {/* Render Selected Template */}
      <section className="mt-8">
        {selectedTemplate === 'template01' && (
          <InvoiceForm isAuthenticated={isAuthenticated} promptLogin={promptLogin} />
        )}
        {isAuthenticated && selectedTemplate === 'template02' && <NewInvoiceTemplate />}
      </section>
    </main>
  );
};

export default Dashboard;
