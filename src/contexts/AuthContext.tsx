import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { User } from '../types/auth';

interface AuthContextType {
    token: string | null;
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const initAuth = async () => {
            if (token) {
                try {
                    const userData = await authService.getCurrentUser(token);
                    setUser(userData);
                } catch (error: any) {
                    if (error.response?.status === 401) {
                        // Token expired or invalid
                        handleLogout();
                    }
                }
            }
        };

        initAuth();
    }, [token]);

    const handleLogout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };

    const login = async (email: string, password: string) => {
        const response = await authService.login({ email, password });
        setToken(response.token);
        setUser(response.user);
        localStorage.setItem('token', response.token);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout: handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 