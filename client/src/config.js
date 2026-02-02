const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://seaman-fresh-final.onrender.com' : 'http://localhost:5000');
export const ADMIN_URL = import.meta.env.VITE_ADMIN_URL || (import.meta.env.PROD ? 'https://admin-seaman-fresh.onrender.com' : 'http://localhost:5174');

console.log('API_URL initialized as:', API_URL);
export default API_URL;
