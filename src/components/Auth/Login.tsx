// src/components/Auth/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/AuthService';

interface LoginProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous error message
    try {
      await authService.login(emailOrPhone, password, rememberMe); // Added rememberMe as the third argument
      setIsLoggedIn(true); // Set user as logged in
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = (err as Error).message || 'Login failed. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md flex flex-col space-y-4 w-1/3 mx-auto">
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <input
        type="text"
        placeholder="Email address / Phone number"
        value={emailOrPhone}
        onChange={(e) => setEmailOrPhone(e.target.value)}
        required
        className="border p-2 rounded w-full"
      />
      <input
        type={showPassword ? 'text' : 'password'}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="border p-2 rounded w-full"
      />
      <label className="flex items-center">
        <input
          type="checkbox"
          checked={showPassword}
          onChange={() => setShowPassword(!showPassword)}
          className="mr-2"
        />
        Show Password
      </label>
      <label className="flex items-center">
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={() => setRememberMe(!rememberMe)}
          className="mr-2"
        />
        Remember Me
      </label>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Login</button>
    </form>
  );
};

export default Login;