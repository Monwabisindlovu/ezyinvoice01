import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const handleError = (error: any) => {
  if (error.response) {
    return error.response.data.message || error.message;
  }
  return 'An error occurred';
};

const authService = {
  // Signup (Registration)
  register: async (userData: { email?: string; phone?: string; password: string; confirmPassword: string }) => {
    try {
      const payload: Record<string, string> = { password: userData.password, confirmPassword: userData.confirmPassword };
      
      if (userData.email) payload.email = userData.email;
      if (userData.phone) payload.phone = userData.phone;

      const response = await axios.post(`${API_URL}/auth/register`, payload);
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

      const response = await axios.post(`${API_URL}/auth/login`, payload);
      const { token } = response.data;

      localStorage.setItem('accessToken', token); // Save JWT token to localStorage

      return response.data;
    } catch (error) {
      throw new Error(handleError(error));
    }
  },

  // Google OAuth Login
  googleLogin: async (token: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/google`, { token });
      localStorage.setItem('accessToken', response.data.token); // Store token
      return response.data;
    } catch (error) {
      throw new Error(handleError(error));
    }
  },

  // Forgot Password (Send Reset Link)
  forgotPassword: async (email: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      return response.data;
    } catch (error) {
      throw new Error(handleError(error));
    }
  },

  // Reset Password
  resetPassword: async (newPassword: string, token: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, {
        newPassword,
        token,
      });
      return response.data;
    } catch (error) {
      throw new Error(handleError(error));
    }
  }
};

export default authService;
