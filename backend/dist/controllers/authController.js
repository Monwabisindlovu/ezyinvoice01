"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const encryptUtils = __importStar(require("../utils/encrypt")); // Named import for encrypt utils
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // Import jwt
const User_1 = __importDefault(require("../models/User"));
const google_auth_library_1 = require("google-auth-library");
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const AuthController = {
    register: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, phone, password } = req.body;
            if (!email && !phone)
                return res.status(400).json({ message: 'Email or phone is required' });
            const existingUser = yield User_1.default.findOne({ $or: [{ email }, { phone }] });
            if (existingUser)
                return res.status(400).json({ message: 'User already exists' });
            const hashedPassword = yield encryptUtils.hashPassword(password);
            const newUser = new User_1.default({ email, phone, password: hashedPassword });
            yield newUser.save();
            res.status(201).json({ message: 'User registered successfully' });
        }
        catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }),
    login: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, phone, password } = req.body;
            const user = yield User_1.default.findOne({ $or: [{ email }, { phone }] });
            if (!user)
                return res.status(400).json({ message: 'User not found' });
            const isMatch = yield encryptUtils.comparePassword(password, user.password);
            if (!isMatch)
                return res.status(400).json({ message: 'Invalid credentials' });
            const accessToken = encryptUtils.generateRandomToken(); // Example of generating a random token
            const refreshToken = encryptUtils.generateRandomToken(); // Example of generating a random token
            res.json({ accessToken, refreshToken });
        }
        catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }),
    googleOAuth: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { token } = req.body;
            const ticket = yield client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const { email, name } = ticket.getPayload();
            let user = yield User_1.default.findOne({ email });
            if (!user) {
                user = new User_1.default({ email, name, googleAuth: true });
                yield user.save();
            }
            const accessToken = encryptUtils.generateRandomToken(); // Example of generating a random token
            res.json({ accessToken });
        }
        catch (error) {
            res.status(500).json({ message: 'Google authentication failed', error });
        }
    }),
    forgotPassword: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email } = req.body;
            const user = yield User_1.default.findOne({ email });
            if (!user)
                return res.status(400).json({ message: 'User not found' });
            const resetToken = encryptUtils.generateRandomToken(); // Example of generating a random token
            yield (0, sendEmail_1.default)(email, resetToken);
            res.json({ message: 'Password reset email sent' });
        }
        catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }),
    resetPassword: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { token, newPassword } = req.body;
            // Decoding the token
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const user = yield User_1.default.findById(decoded.id);
            if (!user)
                return res.status(400).json({ message: 'Invalid token' });
            user.password = yield encryptUtils.hashPassword(newPassword);
            yield user.save();
            res.json({ message: 'Password reset successfully' });
        }
        catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }),
};
exports.default = AuthController;
