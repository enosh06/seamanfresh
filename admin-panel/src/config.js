// Use current hostname to determine API URL
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const API_URL = isLocalhost
    ? (import.meta.env.VITE_API_URL || 'http://localhost:5000')
    : 'https://seaman-fresh-final.onrender.com';

export const STORE_URL = isLocalhost
    ? 'http://localhost:5173'
    : 'https://seaman-fresh-final.netlify.app';

console.log('--- ADMIN ENV DEBUG ---');
console.log('Hostname:', window.location.hostname);
console.log('Is Localhost:', isLocalhost);
console.log('Final API_URL:', API_URL);

export default API_URL;
