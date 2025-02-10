import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Function to generate an access token
export const generateAccessToken = (userId: string) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET!, { expiresIn: '15m' });
};

// Function to generate a refresh token
export const generateRefreshToken = (userId: string) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET!, { expiresIn: '7d' });
};

// Function to hash a password
export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Function to compare passwords
export const comparePassword = async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword);
};

// Default export containing all functions
export default {
    generateAccessToken,
    generateRefreshToken,
    hashPassword,
    comparePassword,
};
