import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';  


const ResetPassword: React.FC = () => {
  const [emailOrPhone, setEmailOrPhone] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const { token } = useParams<string>(); // Extract token from URL params (if exists)
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    // Ensure passwords match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    try {
      // Handle token-based reset (from URL params) or standard email/phone reset
      const response = token
        ? await authService.resetPassword(newPassword, token)
        : await authService.resetPasswordWithCode(emailOrPhone, verificationCode, newPassword);

      if (response.status === 200) {
        setSuccessMessage('Password reset successful. You can now log in with your new password.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="reset-password-container w-full max-w-sm mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
      {error && <div className="error text-red-500">{error}</div>}
      {successMessage && <div className="success text-green-500">{successMessage}</div>}

      <form onSubmit={handleSubmit}>
        {/* Email or Phone Input (if no token) */}
        {!token && (
          <div className="input-group mb-4">
            <label htmlFor="emailOrPhone">Registered Email or Phone</label>
            <input
              type="text"
              id="emailOrPhone"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        )}

        {/* Verification Code (if no token) */}
        {!token && (
          <div className="input-group mb-4">
            <label htmlFor="verificationCode">Verification Code</label>
            <input
              type="text"
              id="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        )}

        {/* New Password */}
        <div className="input-group mb-4">
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={7}
            maxLength={12}
            pattern="(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,12}"
            title="Password must be 7-12 characters long, and contain at least one letter and one number"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Confirm New Password */}
        <div className="input-group mb-4">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full bg-blue-500 text-white py-2 rounded">
          {isSubmitting ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
