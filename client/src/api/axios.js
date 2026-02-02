import axios from 'axios';
import API_URL from '../config';
// Normalize API_URL to not have a trailing slash
const normalizedApiUrl = API_URL.replace(/\/+$/, '');

const api = axios.create({
    baseURL: normalizedApiUrl.endsWith('/api') ? normalizedApiUrl : `${normalizedApiUrl}/api`,
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
