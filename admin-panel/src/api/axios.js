import axios from 'axios';
import API_URL from '../config';

// DEBUGGING: Log the value of API_URL imported from config.js
console.log('[DEBUG] API_URL imported into axios.js:', API_URL);

// Normalize API_URL and ensure it has /api suffix
const getBaseURL = () => {
    // FORCE 8000 NO MATTER WHAT if it looks like port 5000
    let base = (API_URL || 'http://127.0.0.1:8000').toString().replace(/\/+$/, '');

    if (base.includes(':5000')) {
        console.warn('[RECOVERY] Detected old port 5000 in config. Redirecting to 8000.');
        base = base.replace(':5000', ':8000');
    }

    return base.endsWith('/api') ? base : `${base}/api`;
};

const api = axios.create({
    baseURL: getBaseURL(),
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    (config) => {
        if (config.url && config.url.startsWith('/')) {
            config.url = config.url.substring(1);
        }

        if (config.url && !config.url.endsWith('/') && !config.url.includes('?')) {
            config.url = `${config.url}/`;
        }

        console.log(`[API Call] Sending ${config.method.toUpperCase()} to: ${config.baseURL}/${config.url}`);

        const token = localStorage.getItem('admin_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => {
        if (response.config.url.includes('auth/login') && response.data.access) {
            response.data.token = response.data.access;
            if (response.data.user) {
                response.data.user.role = response.data.user.is_staff ? 'admin' : 'user';
                response.data.user.name = response.data.user.first_name || response.data.user.username;
                response.data.user.email = response.data.user.email || response.data.user.username;
            }
        }
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
            const path = window.location.hash || window.location.pathname;
            if (!path.includes('login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
