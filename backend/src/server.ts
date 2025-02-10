import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes'; // Corrected path for authRoutes

dotenv.config();

const app = express();

// CORS Middleware: Allow requests from frontend
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Adjust the URL to your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
  credentials: true, // Allow credentials (cookies, etc.)
};

app.use(cors(corsOptions)); // Applying CORS middleware with options

// Body parser middleware to parse JSON data
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); // Use the auth routes

// Test route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/ezyinvoice', {
  // Removed useNewUrlParser and useUnifiedTopology, as they are not required in the latest Mongoose versions
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
