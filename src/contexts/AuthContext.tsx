import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the AuthContext and the values it provides
interface AuthContextType {
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode; // Specify children prop type
};

// Provider component to wrap the app and provide authentication state globally
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if a token exists in localStorage or sessionStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Handle login
  const login = (token: string) => {
    // Store token in localStorage or sessionStorage
    localStorage.setItem('token', token); // or use sessionStorage for temporary sessions
    setIsLoggedIn(true);
  };

  // Handle logout
  const logout = () => {
    // Remove token and update state
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context in components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
