import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <header className="bg-gray-800 text-white px-4 py-3 shadow-xl flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <img 
          src="/logo1.png" 
          alt="EzyInvoice Logo" 
          className="h-14 w-14 sm:h-16 sm:w-16 rounded-full" 
          loading="lazy"
        />
        <h1 className="text-lg sm:text-2xl md:text-3xl font-bold">EzyInvoice</h1>
      </div>

      <nav className="flex space-x-2 sm:space-x-4 text-sm sm:text-base">
        {!isAuthenticated ? (
          <>
            <Link to="/login" className="text-blue-300 hover:text-white">
              Login
            </Link>
            <Link to="/register" className="text-blue-300 hover:text-white">
              Register
            </Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className="text-blue-300 hover:text-white">
              Dashboard
            </Link>
            <button onClick={handleLogout} className="text-red-400 hover:text-white">
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;

