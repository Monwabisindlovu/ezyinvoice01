import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ReactTyped } from "react-typed";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import VerifyCode from "./pages/Auth/VerifyCode";
import { AuthProvider } from "./contexts/AuthContext";
import InvoiceForm from "./components/Invoice/InvoiceForm";
import { ThemeProvider as NextThemesProvider } from "next-themes";

const ThemeProvider: any = NextThemesProvider;

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isTyped, setIsTyped] = useState<boolean>(false); // To track when typing is done
  const [color, setColor] = useState<string>("text-black"); // State for color change

  useEffect(() => {
    const userAuthStatus = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(userAuthStatus === "true");

    if (isTyped) {
      // Change color every second after typing is done
      const colorChangeInterval = setInterval(() => {
        setColor(prevColor => {
          // Cycle through a set of colors
          const colors = ["text-red-500", "text-blue-500", "text-green-500", "text-yellow-500"];
          const currentIndex = colors.indexOf(prevColor);
          return colors[(currentIndex + 1) % colors.length];
        });
      }, 1000); // Change color every second

      return () => clearInterval(colorChangeInterval); // Clear the interval on unmount
    }
  }, [isTyped]);

  return (
    <ThemeProvider attribute="class">
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
            <main className="flex-grow p-6 mt-10">
              {/* Conditionally render the welcome text based on authentication */}
              {!isAuthenticated && (
                <div className="flex items-center justify-start space-x-4">
                  {/* Welcome Text with text-gray-800 */}
                  <h2 className="text-xl font-semibold text-gray-800">
                    Welcome to EzyInvoice
                  </h2>
                  {/* React Typed Text with typing and color change effect */}
                  <h2 className="text-base font-normal">
                    <span className="disappearing-text">
                      <ReactTyped 
                        strings={["Your Smart Invoicing Solution. Log in or sign up to access your dashboard and manage invoices with ease."]} 
                        typeSpeed={50} 
                        backSpeed={30} 
                        showCursor={false} 
                        onComplete={() => setIsTyped(true)} // Set typed flag on completion
                        className={`${color} font-normal`} // Apply color change during typing
                      />
                    </span>
                  </h2>
                </div>
              )}
              
              {/* Routes for authenticated users */}
              <Routes>
                <Route path="/" element={<InvoiceForm isAuthenticated={isAuthenticated} promptLogin={() => alert("Please log in to generate PDFs.")} />} />
                <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/verify-code/:verificationCode" element={<VerifyCode />} />
                <Route path="/dashboard" element={isAuthenticated ? <Dashboard isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />} />
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
