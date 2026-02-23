import axios from 'axios';
import API_URL from '../config';

// Normalize API_URL and ensure it has /api suffix
const getBaseURL = () => {
    // FORCE 8000 NO MATTER WHAT if it looks like port 5000
    let base = (API_URL || 'http://127.0.0.1:8000').toString().replace(/\/+$/, '');

    if (base.includes(':5000')) {
        console.warn('[RECOVERY] Detected old port 5000 in customer config. Redirecting to 8000.');
        base = base.replace(':5000', ':8000');
    }

    return base.endsWith('/api') ? base : `${base}/api`;
};

const api = axios.create({
    baseURL: getBaseURL(),
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor: include auth token and normalize URLs
api.interceptors.request.use(
    (config) => {
        // Normalize URL
        if (config.url && config.url.startsWith('/')) {
            config.url = config.url.substring(1);
        }

        // Django (DRF) expects trailing slashes on URLs
        if (config.url && !config.url.endsWith('/') && !config.url.includes('?')) {
            config.url = `${config.url}/`;
        }

        // DEBUG: Log the full URL being called
        console.log(`[Customer API Call] Sending ${config.method.toUpperCase()} to: ${config.baseURL}/${config.url}`);

        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: handle session expiration and normalize data
api.interceptors.response.use(
    (response) => {
        // If it's a login response from Django, normalize it for the existing React code
        if (response.config.url.includes('auth/login') && response.data.access) {
            response.data.token = response.data.access;
            if (response.data.user) {
                response.data.user.email = response.data.user.email || response.data.user.username;
                response.data.user.name = response.data.user.first_name || response.data.user.username;
                // Add role mapping for Django users
                response.data.user.role = response.data.user.is_staff ? 'admin' : 'user';
            }
        }
        return response;
    },
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
