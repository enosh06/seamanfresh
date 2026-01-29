import axios from 'axios';
import API_URL from '../config';

const api = axios.create({
    baseURL: API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor for API calls
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('admin_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for API calls
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized errors globally
        if (error.response && error.response.status === 401) {
            // Only redirect if we are not already on the login page
            if (window.location.hash !== '#/login' && !window.location.pathname.includes('/login')) {
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_user');
                // Redirect using window.location since we're outside React Router context
                // Adjust path based on your routing strategy (hash or browser history)
                // Assuming standard router here, but admin-panel seems to not use HashRouter explicitly in App.jsx (it uses BrowserRouter as Router alias)
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
