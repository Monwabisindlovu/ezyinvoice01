import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    // Extract token from URL and store in localStorage
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');

    if (token) {
      localStorage.setItem('jwtToken', token);
      setIsAuthenticated(true); // Update authentication state
      window.history.replaceState({}, document.title, '/dashboard'); // Clean URL
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
    <div className="p-8 max-w-5xl mx-auto">
      {/* Template Selection */}
      <div className="flex items-center space-x-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white" style={{ marginLeft: '-50px' }}>
          Choose Your <span className="text-blue-600">Invoice Template</span>
        </h2>

        <div className="flex space-x-4">
          {/* InvoFlow (Always Available) */}
          <button 
            className={`p-2 rounded-md shadow-md cursor-pointer transition w-48 h-14 flex flex-col items-center justify-center text-center ${
              selectedTemplate === 'template01' ? 'border-2 border-blue-600 bg-blue-50' : 'bg-gray-100 hover:bg-gray-200'
            }`} 
            onClick={() => handleTemplateClick('template01')}
          >
            <h3 className="text-sm font-semibold text-blue-700">InvoFlow</h3>
            <span className="text-xs text-gray-600">Sleek and simple invoicing</span>
          </button>

          {/* EquiBill (Requires Login) */}
          <button 
            className={`p-2 rounded-md shadow-md cursor-pointer transition w-48 h-14 flex flex-col items-center justify-center text-center ${
              selectedTemplate === 'template02' ? 'border-2 border-green-600 bg-green-50' : 'bg-gray-100 hover:bg-gray-200'
            }`} 
            onClick={() => handleTemplateClick('template02')}
          >
            <h3 className="text-sm font-semibold text-green-700">EquiBill</h3>
            <span className="text-xs text-gray-600">Professional and balanced billing</span>
          </button>
        </div>
      </div>

      {/* Template Rendering */}
      <div className="mt-6">
        {/* InvoFlow is always accessible */}
        {selectedTemplate === 'template01' && (
          <InvoiceForm isAuthenticated={isAuthenticated} promptLogin={promptLogin} />
        )}

        {/* EquiBill requires authentication */}
        {isAuthenticated && selectedTemplate === 'template02' && <NewInvoiceTemplate />}
      </div>
    </div>
  );
};

export default Dashboard;
