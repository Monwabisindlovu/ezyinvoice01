import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import authService from '../../services/authService';

const ResetPassword: React.FC = () => {
  const [emailOrPhone, setEmailOrPhone] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const { token } = useParams<string>();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    if (!validatePassword(newPassword)) {
      setError('Password must be 7-12 characters long, include a letter, a number, and a special character.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = token
        ? await authService.resetPassword(newPassword, token)
        : await authService.resetPasswordWithCode(emailOrPhone, verificationCode, newPassword);

      if (response.status === 200) {
        setSuccessMessage('Password reset successful. Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordValidationMessage = (pwd: string) => {
    return (
      <div className="text-sm text-red-500 mb-4">
        <p className={pwd.length >= 7 && pwd.length <= 12 ? 'text-green-500' : 'text-red-500'}>
          {pwd.length >= 7 && pwd.length <= 12 ? '✅ Length is valid' : '❌ Password must be 7-12 characters long'}
        </p>
        <p className={/[A-Za-z]/.test(pwd) ? 'text-green-500' : 'text-red-500'}>
          {/[A-Za-z]/.test(pwd) ? '✅ Contains a letter' : '❌ Password must include at least one letter'}
        </p>
        <p className={/\d/.test(pwd) ? 'text-green-500' : 'text-red-500'}>
          {/\d/.test(pwd) ? '✅ Contains a number' : '❌ Password must include at least one number'}
        </p>
        <p className={/[!@#$%^&*(),.?":{}|<>]/.test(pwd) ? 'text-green-500' : 'text-red-500'}>
          {/[!@#$%^&*(),.?":{}|<>]/.test(pwd) ? '✅ Contains a special character' : '❌ Password must include a special character'}
        </p>
      </div>
    );
  };

  return (
    <div className="reset-password-container w-full max-w-sm mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
      {error && <div className="text-red-500">{error}</div>}
      {successMessage && <div className="text-green-500">{successMessage}</div>}

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

        {passwordValidationMessage(newPassword)}

        <div className="relative mb-4">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={`w-full p-2 border rounded ${
              newPassword === confirmPassword ? 'border-green-500' : 'border-red-500'
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

        {!validatePassword(newPassword) && newPassword && (
          <div className="text-sm text-red-500 mb-4">
            <p>❌ Password must be 7-12 characters long</p>
            <p>❌ Include at least one letter, one number, and one special character</p>
          </div>
        )}

        {newPassword !== confirmPassword && confirmPassword && (
          <div className="text-sm text-red-500 mb-4">❌ Passwords do not match</div>
        )}

        <button type="submit" disabled={isSubmitting} className="w-full bg-blue-500 text-white py-2 rounded">
          {isSubmitting ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
