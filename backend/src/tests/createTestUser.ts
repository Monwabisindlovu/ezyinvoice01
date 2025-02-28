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

const createTestUser = async () => {
  try {
    const testUser = new User({
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123',
    });
    await testUser.save();
    console.log('Test User created successfully');
  } catch (error) {
    console.error('❌ Error creating test user:', error);
  }
};

const createTest = async () => {
  await connectDB();
  await createTestUser();
};

createTest();
