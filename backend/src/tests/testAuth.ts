import mongoose from 'mongoose';
import User from '../models/User';  // Update path based on folder structure

// MongoDB connection setup
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/yourDatabase');  // Removed old options
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
  }
};

const loginUser = async () => {
  try {
    const user = await User.findOne({ email: 'test@example.com' });
    if (!user) throw new Error('User not found');

    console.log('User found:', user);  // Log user instance for debugging

    const token = user.generateJwtToken();  // Make sure this is called on the user instance
    console.log('✅ JWT Token:', token);
  } catch (error) {
    console.error('❌ Error during authentication:', error instanceof Error ? error.message : 'Unknown error');
  }
};

// Connect to DB and test user login
const testAuth = async () => {
  await connectDB();
  await loginUser();
};

testAuth();
