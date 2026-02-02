import axios from 'axios';
// Normalize API_URL to not have a trailing slash
const normalizedApiUrl = API_URL.replace(/\/+$/, '');

const api = axios.create({
    baseURL: normalizedApiUrl.endsWith('/api') ? normalizedApiUrl : `${normalizedApiUrl}/api`,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor for API calls
api.interceptors.request.use(
    (config) => {
        // Ensure URLs don't start with a slash to avoid bypassing baseURL subpath
        if (config.url && config.url.startsWith('/')) {
            config.url = config.url.substring(1);
        }

        const token = localStorage.getItem('admin_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for API calls
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized errors globally
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
            // Only redirect if we are not already on the login page
            const path = window.location.hash || window.location.pathname;
            if (!path.includes('login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
