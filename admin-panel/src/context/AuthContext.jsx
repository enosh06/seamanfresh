import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('admin_token');
        if (token) {
            const userData = JSON.parse(localStorage.getItem('admin_user'));
            if (userData && userData.role === 'admin') {
                return userData;
            } else {
                return null;
            }
        }
        return null;
    });
    const [loading] = useState(false);

    useEffect(() => {
        // Cleanup invalid token if any.
        const token = localStorage.getItem('admin_token');
        const userData = JSON.parse(localStorage.getItem('admin_user'));
        if (token && (!userData || userData.role !== 'admin')) {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        setUser(null);
    };

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const { token, user } = response.data;

        if (user.role !== 'admin') {
            throw new Error('Access denied. Admin only.');
        }

        localStorage.setItem('admin_token', token);
        localStorage.setItem('admin_user', JSON.stringify(user));
        setUser(user);
        return user;
    };



    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
