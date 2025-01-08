import React, { createContext, useState, ReactNode } from 'react';

type AuthContextType = {
    user: any; // Replace with your user type
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
    children: ReactNode; // Specify children prop type
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<any>(null); // Replace with your user type

    const handleLogin = async (email: string, password: string) => {
        // Your login logic here
    };

    const handleRegister = async (username: string, email: string, password: string) => {
        // Your register logic here
    };

    const handleLogout = () => {
        // Your logout logic here
    };

    return (
        <AuthContext.Provider value={{ user, login: handleLogin, register: handleRegister, logout: handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
