import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/auth'; // Ensure the URL is correct

const authService = {
  register: async (
    name: string,
    emailOrPhone: string,
    password: string,
    confirmPassword: string,
    countryOfResidency: string,
    isEmail: boolean // Flag to specify whether the input is email or phone
  ): Promise<void> => {
    // Check if the passwords match
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match.");
    }

    // Sending the registration request to the API
    const response = await axios.post(`${API_URL}/register`, {
      name,
      emailOrPhone,
      password,
      countryOfResidency,
      isEmail, // Send the flag to differentiate email from phone number
    });

    // Check if registration was successful
    if (response.status !== 201) {
      throw new Error("Registration failed. Please try again.");
    }
  },

  login: async (emailOrPhone: string, password: string, rememberMe: boolean): Promise<void> => {
    const response = await axios.post(`${API_URL}/login`, { emailOrPhone, password });

    if (response.status !== 200) {
      throw new Error("Login failed. Please check your credentials.");
    }

    const { token } = response.data;
    
    // Store token based on rememberMe preference
    if (rememberMe) {
      localStorage.setItem('token', token);
    } else {
      sessionStorage.setItem('token', token);
    }

    // Set authenticated status
    localStorage.setItem('isAuthenticated', 'true');
  },

  logout: (): void => {
    // Clear tokens and set authentication status
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
  },

  isLoggedIn: (): boolean => {
    // Check if the user is logged in by verifying if a token is stored
    return Boolean(localStorage.getItem('token') || sessionStorage.getItem('token'));
  },

  getCurrentUser: (): string | null => {
    // Retrieve the stored token
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  },
};

export { authService };
