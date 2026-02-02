import axios from 'axios';
import API_URL from '../config';

// Normalize API_URL and ensure it has /api suffix
const getBaseURL = () => {
    const base = (API_URL || 'http://localhost:5000').toString().replace(/\/+$/, '');
    return base.endsWith('/api') ? base : `${base}/api`;
};

const api = axios.create({
    baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor: include auth token and normalize URLs
api.interceptors.request.use(
    (config) => {
        // Prevent leading slash from bypassing baseURL subpath
        if (config.url && config.url.startsWith('/')) {
            config.url = config.url.substring(1);
        }

        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: handle session expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (!window.location.hash.includes('login') && !window.location.hash.includes('signup')) {
                window.location.href = '/#/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
