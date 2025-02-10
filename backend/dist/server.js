"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// CORS Middleware: Allow requests from frontend
const corsOptions = {
    origin: 'http://localhost:3000', // Allow your React frontend domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
    credentials: true, // Allow credentials (cookies, etc.)
};
app.use((0, cors_1.default)(corsOptions)); // Applying CORS middleware with options
// Body parser middleware to parse JSON data
app.use(express_1.default.json());
// Routes
app.use('/api/auth', authRoutes_1.default);
// MongoDB Connection
mongoose_1.default.connect(process.env.MONGO_URI || 'mongodb://localhost/ezyinvoice')
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error:', err));
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
