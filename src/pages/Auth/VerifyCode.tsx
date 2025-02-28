// src/pages/Auth/VerifyCode.tsx
import React, { useState } from 'react';

const VerifyCode: React.FC = () => {
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }

    setError(''); // Clear error if any
    // Call API or handle verification logic here
    // Example: verifyCode(verificationCode);
  };

  return (
    <div>
      <h2>Verify Code</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Verification Code:
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
        </label>
        <button type="submit">Verify</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default VerifyCode;
