import { Request, Response } from 'express';
import { validateRegister, handleValidationErrors } from '../middleware/validationMiddleware';
import * as encryptUtils from '../utils/encrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/User';
import { OAuth2Client } from 'google-auth-library';
import sendResetEmail from '../utils/sendEmail';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const AuthController = {
  register: [
    ...validateRegister,
    handleValidationErrors,
    async (req: Request, res: Response) => {
      try {
        console.log('Incoming Request Body:', req.body); // Log the incoming request

        const { email, phone, password } = req.body;

        if (!email && !phone) {
          console.log('Validation Error: Email or phone is required');
          return res.status(400).json({ message: 'Email or phone is required' });
        }

        console.log('Checking for existing user...');
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
          console.log('Validation Error: User already exists');
          return res.status(400).json({ message: 'User already exists' });
        }

        console.log('Hashing password...');
        const hashedPassword = await encryptUtils.hashPassword(password);
        console.log('Password hashed successfully');

        console.log('Creating new user...');
        const newUser = new User({
          email,
          phone,
          password: hashedPassword,
        });

        await newUser.save();
        console.log('New user created and saved successfully');

        res.status(201).json({ message: 'User registered successfully' });
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes('E11000')) {
            console.log('Duplicate key error:', error.message);
            return res.status(400).json({ message: 'User with this email or phone already exists' });
          }

          console.error('Registration Server Error:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            error,
          }); // Log server errors in detail
          res.status(500).json({ message: 'Server error', error: error.message });
        } else {
          console.error('Unexpected error:', error);
          res.status(500).json({ message: 'Server error', error });
        }
      }
    }
  ],

  // Login handler with updated query
  login: [
    async (req: Request, res: Response) => {
      try {
        console.log('Login Request Body:', req.body); // Log the incoming request

        const { emailOrPhone, password } = req.body;

        let phone = emailOrPhone;

        // Check if the entered phone number starts with a country code, otherwise add +27 for South Africa
        if (phone && !phone.startsWith('+')) {
          phone = `+27${phone.substring(1)}`; // Add country code +27 for South Africa
        }

        // Find user by email or normalized phone number
        const user = await User.findOne({
          $or: [
            { email: emailOrPhone },
            { phone } // Compare with normalized phone number
          ]
        });

        if (!user) {
          console.log('Login Error: User not found');
          return res.status(404).json({ message: 'User not found' });
        }

        console.log('User found:', user);

        // Password validation using encryptUtils (assuming comparePassword function is defined there)
        const isPasswordValid = await encryptUtils.comparePassword(password, user.password);
        console.log('Password validation result:', isPasswordValid);
        if (!isPasswordValid) {
          console.log('Login Error: Invalid password');
          return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '1h' });

        console.log('Login successful, returning token');
        res.status(200).json({ message: 'Login successful', token });
      } catch (error) {
        if (error instanceof Error) {
          console.error('Login Server Error:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            error,
          }); // Log server errors in detail
          res.status(500).json({ message: 'Server error', error: error.message });
        } else {
          console.error('Unexpected error:', error);
          res.status(500).json({ message: 'Server error', error });
        }
      }
    }
  ],

  // Handle forgot password (send reset email)
  forgotPassword: async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'User not found' });

      const resetToken = encryptUtils.generateRandomToken();
      await sendResetEmail(email, resetToken);

      res.json({ message: 'Password reset email sent' });
    } catch (error) {
      if (error instanceof Error) {
        console.error('Forgot Password Server Error:', {
          message: error.message,
          stack: error.stack,
          name: error.name,
          error,
        }); // Log server errors in detail
        res.status(500).json({ message: 'Server error', error: error.message });
      } else {
        console.error('Unexpected error:', error);
        res.status(500).json({ message: 'Server error', error });
      }
    }
  },

  // Handle password reset
  resetPassword: async (req: Request, res: Response) => {
    try {
      const { token, newPassword } = req.body;
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      const user = await User.findById(decoded.id);
      if (!user) return res.status(400).json({ message: 'Invalid token' });

      user.password = await encryptUtils.hashPassword(newPassword);
      await user.save();

      res.json({ message: 'Password reset successfully' });
    } catch (error) {
      if (error instanceof Error) {
        console.error('Reset Password Server Error:', {
          message: error.message,
          stack: error.stack,
          name: error.name,
          error,
        }); // Log server errors in detail
        res.status(500).json({ message: 'Server error', error: error.message });
      } else {
        console.error('Unexpected error:', error);
        res.status(500).json({ message: 'Server error', error });
      }
    }
  },
};

export default AuthController;
