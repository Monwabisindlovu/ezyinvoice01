import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import authService from '../../services/authService';

const ResetPassword: React.FC = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const validatePassword = (pwd: string) => {
    return (
      pwd.length >= 7 &&
      pwd.length <= 12 &&
      /[A-Za-z]/.test(pwd) &&
      /\d/.test(pwd) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    );
  };

  const getValidationMessages = (pwd: string) => (
    <div className="text-sm mb-4 space-y-1">
      <p className={pwd.length >= 7 && pwd.length <= 12 ? 'text-green-500' : 'text-red-500'}>
        {pwd.length >= 7 && pwd.length <= 12 ? '✅ Length is valid' : '❌ 7–12 characters required'}
      </p>
      <p className={/[A-Za-z]/.test(pwd) ? 'text-green-500' : 'text-red-500'}>
        {/[A-Za-z]/.test(pwd) ? '✅ Has a letter' : '❌ Include at least one letter'}
      </p>
      <p className={/\d/.test(pwd) ? 'text-green-500' : 'text-red-500'}>
        {/\d/.test(pwd) ? '✅ Has a number' : '❌ Include at least one number'}
      </p>
      <p className={/[!@#$%^&*(),.?":{}|<>]/.test(pwd) ? 'text-green-500' : 'text-red-500'}>
        {/[!@#$%^&*(),.?":{}|<>]/.test(pwd) ? '✅ Has a special character' : '❌ Include a special character'}
      </p>
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    if (newPassword !== confirmPassword) {
      setError('❌ Passwords do not match.');
      setIsSubmitting(false);
      return;
    }

    if (!validatePassword(newPassword)) {
      setError('❌ Password must meet all requirements.');
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = token
        ? { token, newPassword }
        : { emailOrPhone, verificationCode, newPassword };

      const response = await authService.resetPassword(payload);

      if (response.status === 200) {
        setSuccessMessage('✅ Password reset successful. Redirecting to login...');
        setTimeout(() => navigate('/login'), 2500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="reset-password-container w-full max-w-sm mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
      {error && <div className="text-red-500 mb-3">{error}</div>}
      {successMessage && <div className="text-green-600 font-medium mb-3">{successMessage}</div>}

      <form onSubmit={handleSubmit}>
        {!token && (
          <>
            <div className="mb-4">
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
            <div className="mb-4">
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
          </>
        )}

        <div className="relative mb-4">
          <label htmlFor="newPassword">New Password</label>
          <input
            type={showNewPassword ? 'text' : 'password'}
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute top-9 right-3 text-gray-500"
          >
            {showNewPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </button>
        </div>

        {getValidationMessages(newPassword)}

        <div className="relative mb-4">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={`w-full p-2 border rounded ${
              confirmPassword && newPassword !== confirmPassword ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute top-9 right-3 text-gray-500"
          >
            {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
        >
          {isSubmitting ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
