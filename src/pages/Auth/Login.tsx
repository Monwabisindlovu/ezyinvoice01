import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from 'services/authService';
import { FcGoogle } from 'react-icons/fc';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

interface LoginProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!emailOrPhone) {
      setError('Email or phone number is required.');
      return;
    }

    let normalizedEmailOrPhone = emailOrPhone;
    if (!isNaN(normalizedEmailOrPhone as any) && !normalizedEmailOrPhone.startsWith('+')) {
      normalizedEmailOrPhone = `+27${normalizedEmailOrPhone.replace(/^0/, '')}`;
    }

    const loginData = {
      emailOrPhone: normalizedEmailOrPhone,
      password,
    };

    try {
      const response = await authService.login(loginData);

      if (response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('isAuthenticated', 'true');
        setIsAuthenticated(true);
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred.');
    }
  };

  const handleGoogleLogin = useCallback(async () => {
    try {
      const googleToken = await new Promise<string>((resolve, reject) => {
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed()) {
            reject('Google login button not displayed');
          } else if (notification.isSkippedMoment()) {
            reject('Google login skipped');
          } else {
            // Ensure notification is available and check for granted scopes correctly
            const grantedScopes = notification.getGrantedScopes ? notification.getGrantedScopes() : null;
            if (grantedScopes) {
              resolve(grantedScopes); // This might be the actual token or required information, depending on your use case
            } else {
              reject('No scopes granted');
            }
          }
        });
      });
  
      if (googleToken) {
        const response = await authService.googleAuth(googleToken);
        if (response.token) {
          localStorage.setItem('authToken', response.token);
          setIsAuthenticated(true);
          navigate('/dashboard');
        } else {
          setError('Google login failed: No token returned.');
        }
      }
    } catch (error) {
      // Improved error handling
      setError('Google login failed: ' + (error instanceof Error ? error.message : error));
    }
  }, [navigate, setIsAuthenticated]);

  useEffect(() => {
    const initGoogleSignIn = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: '983836517699-4p2l7t8uuqfd6rrks5teprbioh599d35.apps.googleusercontent.com',
          callback: handleGoogleLogin,
        });
        window.google.accounts.id.renderButton(
          document.getElementById('google-login-btn') as HTMLElement,
          {
            theme: 'outline',
            size: 'large',
          }
        );
      }
    };

    if (window.google) {
      initGoogleSignIn();
    } else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = initGoogleSignIn;
      document.body.appendChild(script);
    }
  }, [handleGoogleLogin]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Email or Phone"
          value={emailOrPhone}
          onChange={(e) => setEmailOrPhone(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />

        <div className="relative mb-2">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-2 right-3 text-gray-500"
          >
            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </button>
        </div>

        {error && <div className="text-red-500 mb-2">{error}</div>}

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            className="mr-2"
          />
          <label>Remember Me</label>
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Login
        </button>
      </form>

      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-2 text-gray-500">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <div id="google-login-btn" className="w-full"></div> {/* Google login button container */}

      <div className="text-sm text-center mt-4">
        <a href="/forgot-password" className="text-blue-500 hover:underline">
          Forgot Password?
        </a>
      </div>
    </div>
  );
};

export default Login;
