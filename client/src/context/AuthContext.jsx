import React, { createContext, useState, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (token && savedUser) {
            const parsedUser = JSON.parse(savedUser);
            // Ensure role is set even if it wasn't in local storage previously
            if (!parsedUser.role && parsedUser.is_staff) {
                parsedUser.role = 'admin';
            } else if (!parsedUser.role) {
                parsedUser.role = 'user';
            }
            return parsedUser;
        }
        return null;
    });
    const [loading, setLoading] = useState(false);

    const login = async (email, password) => {
        // Django expects 'username' but we use email, so we send it as both
        const response = await api.post('auth/login/', {
            username: email,
            email: email,
            password
        });
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        return user;
    };

    const signup = async (userData) => {
        // Map email to username for Django registration
        const payload = {
            ...userData,
            username: userData.email,
        };
        const response = await api.post('auth/register/', payload);
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
