import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Register route handler
export const register = async (req: Request, res: Response): Promise<Response> => {
  const { name, emailOrPhone, password, countryOfResidency, isEmail } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ emailOrPhone });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      emailOrPhone,
      password: hashedPassword,
      countryOfResidency,
      isEmail,
    });

    // Save the user to the database
    await newUser.save();
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Login route handler
export const login = async (req: Request, res: Response): Promise<Response> => {
  const { emailOrPhone, password } = req.body;

  try {
    // Find user by email or phone
    const user = await User.findOne({ emailOrPhone });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    return res.json({ message: 'Login successful', token });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};
