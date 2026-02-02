import axios from 'axios';
import API_URL from '../config';

// Robust normalization of API_URL
const getBaseURL = () => {
    try {
        const url = API_URL || (import.meta.env.PROD ? 'https://seaman-fresh-final.onrender.com' : 'http://localhost:5000');
        const normalized = url.toString().replace(/\/+$/, '');
        return normalized.endsWith('/api') ? normalized : `${normalized}/api`;
    } catch (e) {
        console.error('Error in axios baseURL normalization:', e);
        return 'http://localhost:5000/api';
    }
};

const api = axios.create({
    baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to include the auth token and normalize URLs
api.interceptors.request.use(
    (config) => {
        // Ensure URLs don't start with a slash to avoid bypassing baseURL subpath
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

// Response interceptor to handle authentication errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Only redirect if not already on login/signup to avoid loops
            if (!window.location.hash.includes('login') && !window.location.hash.includes('signup')) {
                window.location.href = '/#/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
