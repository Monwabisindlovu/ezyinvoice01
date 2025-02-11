import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import { AuthProvider } from './contexts/AuthContext';
import InvoiceForm from './components/Invoice/InvoiceForm'; // Ensure InvoiceForm is always available

// Theme provider to handle dark mode
import { ThemeProvider as NextThemesProvider } from 'next-themes';

// Cast ThemeProvider to any to avoid JSX compatibility issues
const ThemeProvider: any = NextThemesProvider;

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check if user is already logged in
  useEffect(() => {
    const userAuthStatus = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(userAuthStatus === 'true');
  }, []);

  return (
    <ThemeProvider attribute="class">
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            {/* Header with dynamic authentication state */}
            <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
            <main className="flex-grow p-6">
              <Routes>
                {/* Home route displays Template 01 by default */}
                <Route
                  path="/"
                  element={
                    <>
                      <h2 className="text-xl font-semibold mb-4">Welcome to EzyInvoice</h2>
                      <InvoiceForm isAuthenticated={isAuthenticated} promptLogin={() => alert('Please log in to generate PDFs.')} />
                    </>
                  }
                />

                {/* Authentication routes */}
                <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/register" element={<Register />} />

                {/* Dashboard is restricted to authenticated users */}
                <Route
                  path="/dashboard"
                  element={isAuthenticated ? (
                    <Dashboard isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
                  ) : (
                    <Navigate to="/" />
                  )}
                />

                {/* Other pages */}
                <Route path="/about" element={<About />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;