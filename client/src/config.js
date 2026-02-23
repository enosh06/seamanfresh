const hostname = window.location.hostname;
const isLocalAddress =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('10.') ||
    hostname.startsWith('172.');

// FORCE 8000 FOR LOCAL
const API_URL = import.meta.env.VITE_API_URL || (isLocalAddress
    ? "http://127.0.0.1:8000"
    : "https://seaman-fresh-api.onrender.com");

export const ADMIN_URL = import.meta.env.VITE_ADMIN_URL || (isLocalAddress
    ? `http://${hostname}:5174`
    : 'https://seaman-fresh-admin.pages.dev');

console.log('--- CUSTOMER NETWORK DEBUG ---');
console.log('Hostname:', hostname);
console.log('Final API_URL:', API_URL);

export { API_URL };
export default API_URL;
