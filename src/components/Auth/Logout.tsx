import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/AuthService';

const Logout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout(); // Make sure this method exists
    navigate('/login');
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
