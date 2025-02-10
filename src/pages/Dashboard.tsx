import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InvoiceForm from '../components/Invoice/InvoiceForm';
import NewInvoiceTemplate from '../components/Invoice01/NewInvoiceTemplate';

const Dashboard: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<'template01' | 'template02'>('template01');
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication state
  const [isNewUser, setIsNewUser] = useState(false); // Track if user is newly registered
  const navigate = useNavigate();

  // Simulate checking if the user is authenticated (replace with actual logic)
  useEffect(() => {
    const userAuthStatus = localStorage.getItem('isAuthenticated');
    const userIsNew = localStorage.getItem('isNewUser') === 'true';

    if (userAuthStatus === 'true') {
      setIsAuthenticated(true);
      setIsNewUser(userIsNew);
    }
  }, []);

  const handleLogout = () => {
    // Simulate logging out (clear authentication data)
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('isNewUser');
    setIsAuthenticated(false);
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="p-6 space-y-4">
      {/* Post-login Behavior */}
      {isAuthenticated ? (
        <div className="flex justify-between mb-4">
          <div className="flex space-x-4">
            <button
              onClick={() => setSelectedTemplate('template01')}
              className={`${
                selectedTemplate === 'template01' ? 'text-blue-500' : 'text-gray-500'
              } hover:underline`}
            >
              Template 01
            </button>
            <button
              onClick={() => setSelectedTemplate('template02')}
              className={`${
                selectedTemplate === 'template02' ? 'text-blue-500' : 'text-gray-500'
              } hover:underline`}
            >
              Template 02
            </button>
          </div>

          {/* Display "My Account" link and "Logout" button */}
          <div className="flex space-x-4">
            <button className="text-gray-500 hover:underline">My Account</button>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        // Show Signup/Login links if not authenticated
        <div className="flex space-x-4 mb-4">
          {!isNewUser ? (
            <button
              onClick={() => navigate('/signup')}
              className="text-gray-500 hover:underline"
            >
              Sign Up
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="text-gray-500 hover:underline"
            >
              Login
            </button>
          )}
        </div>
      )}

      {/* Render the selected template */}
      {selectedTemplate === 'template01' ? <InvoiceForm /> : null}
      {selectedTemplate === 'template02' ? <NewInvoiceTemplate /> : null}
    </div>
  );
};

export default Dashboard;

