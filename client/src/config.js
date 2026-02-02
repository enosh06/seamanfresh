const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const API_URL = import.meta.env.VITE_API_URL || (isLocalhost ? 'http://localhost:5000' : 'https://seaman-fresh-final.onrender.com');
export const ADMIN_URL = import.meta.env.VITE_ADMIN_URL || (isLocalhost ? 'http://localhost:5174' : 'https://admin-seaman-fresh.onrender.com');

console.log('API_URL initialized as:', API_URL);
export default API_URL;
