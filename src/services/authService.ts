import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://ezyinvoice01-backend.onrender.com/api';
// Utility function to handle errors
const handleError = (error: any) => {
  if (error.response) {
    return error.response.data.message || error.message;
  }
  return 'An error occurred';
};

// Get the token from localStorage
const getToken = () => {
  return localStorage.getItem('accessToken');
};

// Create an axios instance with common headers (for authenticated requests)
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Authorization header to the axios instance if token exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const authService = {
  // Signup (Registration)
  register: async (userData: { email?: string; phone?: string; password: string; confirmPassword: string }) => {
    try {
      const payload: Record<string, string> = { password: userData.password, confirmPassword: userData.confirmPassword };

      if (userData.email) payload.email = userData.email;
      if (userData.phone) payload.phone = userData.phone;

      const response = await axiosInstance.post(`/auth/register`, payload);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  // Login (both email or phone supported)
  login: async (loginData: { emailOrPhone: string; password: string }) => {
    try {
      const payload = {
        emailOrPhone: loginData.emailOrPhone,
        password: loginData.password,
      };

      const response = await axiosInstance.post(`/auth/login`, payload);
      const { token } = response.data;

      localStorage.setItem('accessToken', token);
      return response.data;
    } catch (error) {
      throw new Error(handleError(error));
    }
  },

  // Google OAuth Login/Signup - updated to use /auth/login with googleToken
  googleAuth: async (googleToken: string) => {
    try {
      const response = await axiosInstance.post(`/auth/login`, { googleToken });
      if (response.data.token) {
        localStorage.setItem('accessToken', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw new Error(handleError(error));
    }
  },

  // Forgot Password (Send Reset Link via Email or Phone)
  forgotPassword: async (emailOrPhone: string) => {
    try {
      const response = await axiosInstance.post(`/auth/forgot-password`, { emailOrPhone });
      return response.data;
    } catch (error) {
      throw new Error(handleError(error));
    }
  },

  // Reset Password
  resetPassword: async (newPassword: string, token: string) => {
    try {
      const response = await axiosInstance.post(`/auth/reset-password`, {
        newPassword,
        token,
      });
      return response.data;
    } catch (error) {
      throw new Error(handleError(error));
    }
  },

  // Reset Password with Verification Code
  resetPasswordWithCode: async (emailOrPhone: string, verificationCode: string, newPassword: string) => {
    try {
      const response = await axiosInstance.post(`/auth/reset-password`, {
        emailOrPhone,
        verificationCode,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw new Error(handleError(error));
    }
  },
};

export default authService;
