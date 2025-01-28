// src/components/Header.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <header className="bg-gray-800 text-white p-4 shadow-xl flex items-center justify-between">
      <div className="flex items-center">
        <img src="/logo1.png" alt="EzyInvoice Logo" className="h-20 w-20 mr-4 rounded-full" />
        <h1 className="text-3xl font-bold">EzyInvoice</h1>
      </div>
      <nav className="flex space-x-4">
        {/* {!isLoggedIn ? (
          <>
            <Link to="/login" className="text-blue-300 hover:text-white">Login</Link>
            <Link to="/register" className="text-blue-300 hover:text-white">Register</Link>
          </>
        ) : (
          <>
            <button onClick={handleLogout} className="text-blue-300 hover:text-white">Logout</button>
          </>
        )} */}
        <Link to="/dashboard" className="text-blue-300 hover:text-white">Dashboard</Link>
      </nav>
    </header>
  );
};

export default Header;
