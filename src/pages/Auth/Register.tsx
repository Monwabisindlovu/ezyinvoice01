import React, { useState, useCallback, useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc'; // You can keep this import if you plan to use it later
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import authService from 'services/authService';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isValid, setIsValid] = useState({
    length: false,
    letter: false,
    number: false,
    special: false,
    email: false,
  });
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const validateEmail = useCallback((email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }, []);

  const validatePassword = useCallback((pwd: string) => {
    const lengthValid = pwd.length >= 7 && pwd.length <= 12;
    const letterValid = /[A-Za-z]/.test(pwd);
    const numberValid = /\d/.test(pwd);
    const specialValid = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);

    setIsValid((prev) => ({
      ...prev,
      length: lengthValid,
      letter: letterValid,
      number: numberValid,
      special: specialValid,
      email: validateEmail(email),
    }));
  }, [email, validateEmail]);

  const validatePasswordMatch = useCallback(() => {
    setPasswordMatch(password.trim() === confirmPassword.trim());
  }, [password, confirmPassword]);

  useEffect(() => {
    validatePassword(password);
    validatePasswordMatch();
  }, [password, confirmPassword, validatePassword, validatePasswordMatch]);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!passwordMatch) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (!email && !phone) {
      setErrorMessage("Email or phone number is required");
      return;
    }

    const payload: { email?: string; phone?: string; password: string; confirmPassword: string } = { password, confirmPassword };
    if (email) payload.email = email;
    if (phone) payload.phone = phone;

    try {
      await authService.register(payload);
      alert("Registration successful");
      navigate('/login'); // Redirect to login page
    } catch (error: any) {
      if (error.message.includes("already exists")) {
        setErrorMessage("User already exists. Please log in or use a different email/phone.");
      } else {
        setErrorMessage(error.message || "An error occurred during registration.");
      }
    }
  };

  // Commented out Google login functionality
  /*
  const googleLogin = async () => {
    const googleLoginURL = `${process.env.REACT_APP_API_URL}/auth/google`;
    window.location.href = googleLoginURL;
  };
  */
  
  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        {!isValid.email && email && (
          <div className="text-red-500 mb-2">Enter a valid email</div>
        )}

        <div className="mb-2">
          <PhoneInput
            international
            defaultCountry="ZA"
            value={phone}
            onChange={(value: string | undefined) => setPhone(value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="relative mb-2">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-2 right-3 text-gray-500"
          >
            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </button>
        </div>

        {password && (
          <div className="mb-2 text-sm text-gray-600">
            {!isValid.length && <p>❌ Password must be 7-12 characters long</p>}
            {!isValid.letter && <p>❌ Password must contain at least one letter</p>}
            {!isValid.number && <p>❌ Password must contain at least one number</p>}
            {!isValid.special && <p>❌ Password must contain at least one special character</p>}
          </div>
        )}

        <div className="relative mb-4">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute top-2 right-3 text-gray-500"
          >
            {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </button>
        </div>

        {!passwordMatch && (
          <div className="text-red-500 mb-4">Passwords do not match</div>
        )}

        {errorMessage && (
          <div className="text-red-500 mb-4">{errorMessage}</div>
        )}

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Sign Up
        </button>
      </form>
      {/* Removed the OR section
      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-2 text-gray-500">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      {/* Commented out Google login button
      <button
        onClick={googleLogin}
        className="w-full bg-red-500 text-white py-2 rounded mt-2 flex items-center justify-center"
      >
        <FcGoogle className="mr-2" /> Sign up with Google
      </button>
      */}
    </div>
  );
};

export default Register;