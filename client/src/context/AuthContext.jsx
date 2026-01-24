import React, { createContext, useState, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        return (token && savedUser) ? JSON.parse(savedUser) : null;
    });
    const [loading, setLoading] = useState(false);

    const login = async (email, password) => {
        // Errors are now thrown by axios and caught in the component
        const response = await api.post('/auth/login', { email, password });
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        return user;
    };

    const signup = async (userData) => {
        // Return response so component can react
        const response = await api.post('/auth/signup', userData);
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
