import React, { useState } from 'react';
import authService from '../../services/authService'; // Import your auth service functions

const ForgotPassword: React.FC = () => {
  const [emailOrPhone, setEmailOrPhone] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      // Backend expects either email or phone
      const response = await authService.forgotPassword(emailOrPhone);
      setMessage(response.message);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
      <form onSubmit={handleForgotPassword}>
        <input
          type="text"
          placeholder="Enter your email or phone"
          value={emailOrPhone}
          onChange={(e) => setEmailOrPhone(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />

        {error && <p className="text-red-500 mb-2">{error}</p>}
        {message && <p className="text-green-500 mb-2">{message}</p>}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
