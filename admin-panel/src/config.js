const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const API_URL = import.meta.env.VITE_API_URL || (isLocalhost ? 'http://localhost:5000' : 'https://seaman-fresh-final.onrender.com');
export const STORE_URL = import.meta.env.VITE_STORE_URL || (isLocalhost ? 'http://localhost:5173' : 'https://seaman-fresh-final.netlify.app');

export default API_URL;
