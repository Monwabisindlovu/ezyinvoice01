import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ReactTyped } from "react-typed";
import { Helmet, HelmetProvider } from "react-helmet-async"; // Helmet setup
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
  const [isTyped, setIsTyped] = useState<boolean>(false);
  const [color, setColor] = useState<string>("text-black");

  useEffect(() => {
    const userAuthStatus = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(userAuthStatus === "true");

    if (isTyped) {
      const colorChangeInterval = setInterval(() => {
        setColor(prevColor => {
          const colors = ["text-red-500", "text-blue-500", "text-green-500", "text-yellow-500"];
          const currentIndex = colors.indexOf(prevColor);
          return colors[(currentIndex + 1) % colors.length];
        });
      }, 1000);

      return () => clearInterval(colorChangeInterval);
    }
  }, [isTyped]);

  return (
    <HelmetProvider>
      <ThemeProvider attribute="class">
        <AuthProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
              <main className="flex-grow p-6 mt-10">

                {/* SEO and Welcome Message for Unauthenticated Users */}
                {!isAuthenticated && (
                  <>
                    <Helmet>
                      <title>Welcome to EzyInvoice</title>
                      <meta
                        name="description"
                        content="Smart invoicing solution for professionals and businesses. Create and manage invoices easily."
                      />
                    </Helmet>

                    <div className="flex items-center justify-start space-x-4">
                      <h2 className="text-xl font-semibold text-gray-800">Welcome to EzyInvoice</h2>
                      <h2 className="text-base font-normal">
                        <span className="disappearing-text">
                          <ReactTyped
                            strings={[
                              "Your Smart Invoicing Solution. Log in or sign up to access your dashboard and manage invoices with ease.",
                            ]}
                            typeSpeed={50}
                            backSpeed={30}
                            showCursor={false}
                            onComplete={() => setIsTyped(true)}
                            className={`${color} font-normal`}
                          />
                        </span>
                      </h2>
                    </div>
                  </>
                )}

                {/* App Routes */}
                <Routes>
                  <Route
                    path="/"
                    element={
                      <InvoiceForm
                        isAuthenticated={isAuthenticated}
                        promptLogin={() => alert("Please log in to generate PDFs.")}
                      />
                    }
                  />
                  <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                  <Route path="/verify-code/:verificationCode" element={<VerifyCode />} />
                  <Route
                    path="/dashboard"
                    element={
                      isAuthenticated ? (
                        <Dashboard isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
                      ) : (
                        <Navigate to="/" />
                      )
                    }
                  />
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
    </HelmetProvider>
  );
};

export default App;
