"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User")); // Ensure IUser type is exported from your User model
const express_validator_1 = require("express-validator"); // Correct import
const authService_1 = __importDefault(require("../services/authService")); // Your auth service
const router = express_1.default.Router();
// Utility function to validate and send errors
const handleValidationErrors = (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }
};
// Registration Route
router.post('/register', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Please enter a valid email'),
    (0, express_validator_1.body)('password').isLength({ min: 7, max: 12 }).withMessage('Password must be between 7 to 12 characters'),
    (0, express_validator_1.body)('confirmPassword').custom((value, { req }) => value === req.body.password).withMessage('Passwords must match'),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    handleValidationErrors(req, res);
    const { email, phone, password } = req.body;
    try {
        const userExists = yield User_1.default.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
        const newUser = new User_1.default({
            email,
            phone,
            password: hashedPassword,
        });
        yield newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}));
// Login Route
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { emailOrPhone, password } = req.body;
    try {
        const user = yield User_1.default.findOne({
            $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
        });
        if (!user) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' });
        res.json({ token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}));
// Google OAuth Route
router.post('/google', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    try {
        const googleUser = yield authService_1.default.verifyGoogleToken(token);
        let user = yield User_1.default.findOne({ googleId: googleUser.id });
        if (!user) {
            user = new User_1.default({
                email: googleUser.email,
                googleId: googleUser.id,
                phone: googleUser.phone || '',
                password: '', // Google users might not have a password
            });
            yield user.save();
        }
        const jwtToken = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' });
        res.json({ token: jwtToken });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Google login failed' });
    }
}));
exports.default = router;
