export const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://seaman-fresh-final.onrender.com' : 'http://localhost:5000');
export const STORE_URL = import.meta.env.VITE_STORE_URL || (import.meta.env.PROD ? 'https://your-client-site.netlify.app' : 'http://localhost:5174');

export default API_URL;
