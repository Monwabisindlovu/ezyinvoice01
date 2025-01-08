import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const registerUser = async (name: string, emailOrPhone: string, password: string, countryOfResidency: string, isEmail: boolean) => {
  // Check if the user already exists
  const userExists = await User.findOne({ emailOrPhone });
  if (userExists) {
    throw new Error('User already exists');
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = new User({
    name,
    emailOrPhone,
    password: hashedPassword,
    countryOfResidency,
    isEmail
  });

  await newUser.save();
};

const loginUser = async (emailOrPhone: string, password: string) => {
  // Find the user
  const user = await User.findOne({ emailOrPhone });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // Generate token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  return token;
};

export { registerUser, loginUser };
