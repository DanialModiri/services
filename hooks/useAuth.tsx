import React, { createContext, useContext, useState, ReactNode, FC, useEffect, useCallback } from 'react';
import { User } from '../types';
import * as api from '../api/apiService';

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (username: string, password_sent: string) => Promise<User>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'authToken';

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    const currentUser = await api.getCurrentUser(token);
                    setUser(currentUser);
                } catch (error) {
                    console.error("Failed to fetch user with token", error);
                    setToken(null);
                    localStorage.removeItem(TOKEN_KEY);
                }
            }
            setIsLoading(false);
        };
        loadUser();
    }, [token]);

    const login = useCallback(async (username: string, password_sent: string): Promise<User> => {
        try {
            const { token: newToken, user: loggedInUser } = await api.login(username, password_sent);
            localStorage.setItem(TOKEN_KEY, newToken);
            setToken(newToken);
            setUser(loggedInUser);
            return loggedInUser;
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem(TOKEN_KEY);
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
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
