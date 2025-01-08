import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/AuthService';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [country, setCountry] = useState('');
    const [error, setError] = useState(''); 
    const [success, setSuccess] = useState(''); // Success message state
    const [passwordError, setPasswordError] = useState(''); 
    const [showPassword, setShowPassword] = useState(false);
    const [isEmail, setIsEmail] = useState(true); 

    useEffect(() => {
        setIsEmail(emailOrPhone.includes('@'));
    }, [emailOrPhone]); 

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setPasswordError('');
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
        setPasswordError(password !== e.target.value ? 'Passwords do not match' : '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }

        try {
            await authService.register(name, emailOrPhone, password, confirmPassword, country, isEmail);
            setSuccess('Registered successfully!');
            setTimeout(() => navigate('/login'), 1500); // Redirect to login after 1.5 seconds
        } catch (err) {
            const errorMessage = (err as Error).message || 'Registration failed. Please try again.';
            setError(errorMessage);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md flex flex-col space-y-4 w-1/3 mx-auto">
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border p-2 rounded w-full"
            />

            <input
                type={isEmail ? 'email' : 'tel'}
                placeholder="Email address / Phone number"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                required
                className="border p-2 rounded w-full"
            />

            <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                required
                className="border p-2 rounded w-full"
            />

            <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
                className="border p-2 rounded w-full"
            />

            {passwordError && <p className="text-red-500 text-sm w-full mt-1">{passwordError}</p>}

            <input
                type="text"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                className="border p-2 rounded w-full"
            />

            <label className="flex items-center w-full mx-auto">
                <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                    className="mr-2"
                />
                Show Password
            </label>

            <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
                Register
            </button>
        </form>
    );
};

export default Register;
