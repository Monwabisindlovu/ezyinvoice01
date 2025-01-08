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
exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const registerUser = (name, emailOrPhone, password, countryOfResidency, isEmail) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the user already exists
    const userExists = yield User_1.default.findOne({ emailOrPhone });
    if (userExists) {
        throw new Error('User already exists');
    }
    // Hash the password
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    // Create new user
    const newUser = new User_1.default({
        name,
        emailOrPhone,
        password: hashedPassword,
        countryOfResidency,
        isEmail
    });
    yield newUser.save();
});
exports.registerUser = registerUser;
const loginUser = (emailOrPhone, password) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the user
    const user = yield User_1.default.findOne({ emailOrPhone });
    if (!user) {
        throw new Error('Invalid credentials');
    }
    // Compare password
    const isMatch = yield bcryptjs_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }
    // Generate token
    const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
});
exports.loginUser = loginUser;
