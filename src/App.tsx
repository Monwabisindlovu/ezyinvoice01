import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

// Cast ThemeProvider to `any` to avoid JSX compatibility issues
const ThemeProvider: any = NextThemesProvider;

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  console.log('isLoggedIn:', isLoggedIn);

  return (
    <ThemeProvider attribute="class">
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          <main className="flex-grow">
            <Routes>
              <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
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
    </ThemeProvider>
  );
};

export default App;
