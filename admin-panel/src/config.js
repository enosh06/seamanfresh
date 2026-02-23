// Use current hostname to determine API URL dynamically
const hostname = window.location.hostname;
const isLocalAddress =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('10.') ||
    hostname.startsWith('172.');

// FORCE LOCAL API URL TO 8000
const API_URL = import.meta.env.VITE_API_URL || (isLocalAddress
    ? "http://127.0.0.1:8000"
    : "https://seaman-fresh-api.onrender.com");

export const STORE_URL = import.meta.env.VITE_STORE_URL || (isLocalAddress
    ? `http://${hostname}:5173`
    : 'https://seaman-fresh-client.pages.dev');

console.log('--- ADMIN NETWORK DEBUG ---');
console.log('Hostname:', hostname);
console.log('Final API_URL:', API_URL);

export { API_URL };
export default API_URL;
