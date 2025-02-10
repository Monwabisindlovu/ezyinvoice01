import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import { AuthProvider } from './contexts/AuthContext'; // Import the Auth context provider

// Theme provider to handle dark mode
import { ThemeProvider as NextThemesProvider } from 'next-themes';

// Cast ThemeProvider to `any` to avoid JSX compatibility issues
const ThemeProvider: any = NextThemesProvider;

const App: React.FC = () => {
  return (
    <ThemeProvider attribute="class">
      {/* Wrap your application with AuthProvider to manage global authentication state */}
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Header isLoggedIn={false} setIsLoggedIn={function (value: React.SetStateAction<boolean>): void {
              throw new Error('Function not implemented.');
            } } />
            <main className="flex-grow">
              <Routes>
                {/* Define your routes with their respective components */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/about" element={<About />} /> {/* About route */}
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} /> {/* Terms route */}
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
