import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationMethod, setVerificationMethod] = useState('email'); // 'email' or 'sms'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); // Updated to useNavigate

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      // Validate password
      if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Call backend to verify email/phone and reset password
      const response = await axios.post('/api/auth/reset-password', {
        emailOrPhone,
        securityQuestion,
        securityAnswer,
        newPassword,
        verificationMethod,
      });

      if (response.status === 200) {
        setSuccessMessage('Password reset successful. You can now log in with your new password.');
        // Redirect to login after success
        setTimeout(() => {
          navigate('/login'); // Updated to use navigate
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      {error && <div className="error">{error}</div>}
      {successMessage && <div className="success">{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="emailOrPhone">Email or Phone</label>
          <input
            type="text"
            id="emailOrPhone"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            required
          />
        </div>

        {/* Display security question if enabled */}
        {securityQuestion && (
          <div className="input-group">
            <label htmlFor="securityAnswer">{securityQuestion}</label>
            <input
              type="text"
              id="securityAnswer"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              required
            />
          </div>
        )}

        <div className="input-group">
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
          />
        </div>

        <div className="input-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
