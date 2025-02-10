import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User'; // Ensure IUser type is exported from your User model
import { body, validationResult } from 'express-validator'; // Correct import
import authService from '../services/authService'; // Your auth service
import { UserSignup, UserLogin, UserResponse, UserTokenPayload } from '../types/userTypes'; // Import user types

const router = express.Router();

// Utility function to validate and send errors
const handleValidationErrors = (req: Request, res: Response): boolean => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return true; // Return true to indicate errors were found
  }
  return false; // Return false if no errors
};

// Registration Route
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 7, max: 12 }).withMessage('Password must be between 7 to 12 characters'),
    body('confirmPassword').custom((value: string, { req }) => value === req.body.password).withMessage('Passwords must match'),
  ],
  async (req: Request, res: Response): Promise<void> => {
    // Stop execution if validation errors exist
    if (handleValidationErrors(req, res)) return;

    const { email, phone, password }: UserSignup = req.body;

    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({
        email,
        phone,
        password: hashedPassword,
      });

      await newUser.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Login Route (Updated)
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { emailOrPhone, password }: UserLogin = req.body;

  try {
    // Log incoming request
    console.log('Login Request Body:', req.body);

    // Check if the user exists using email or phone
    const user: IUser | null = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    if (!user) {
      console.log('Login Error: User not found');
      res.status(400).json({ message: 'Invalid credentials' }); // Change return type to void
      return;
    }

    // Log user found
    console.log('User found:', user);

    // Check if password matches using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid password');
      res.status(400).json({ message: 'Invalid credentials' }); // Change return type to void
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email } as UserTokenPayload,
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    // Send success response with token
    console.log('Login successful, returning token');
    res.json({ token }); // Change return type to void
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' }); // Change return type to void
  }
});

// Google OAuth Route
router.post('/google', async (req: Request, res: Response): Promise<void> => {
  const { token } = req.body;

  try {
    // Ensure authService.verifyGoogleToken returns a valid user or throws an error
    const googleUser = await authService.verifyGoogleToken(token);

    let user = await User.findOne({ googleId: googleUser.id });

    if (!user) {
      user = new User({
        email: googleUser.email,
        googleId: googleUser.id,
        phone: googleUser.phone || '',
        password: '', // Google users might not have a password
      });

      await user.save();
    }

    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email } as UserTokenPayload,
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    res.json({ token: jwtToken }); // Change return type to void
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Google login failed' }); // Change return type to void
  }
});

export default router;
