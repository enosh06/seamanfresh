// Use current hostname to determine API URL dynamically
const hostname = window.location.hostname;
const isLocalAddress =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('10.') ||
    hostname.startsWith('172.');

// If we are on a local network, we want to talk to the local server on the SAME machine (IP)
// Otherwise, we talk to the production Render server
const API_URL = isLocalAddress
    ? `http://${hostname}:5000`
    : 'https://seaman-fresh-api.onrender.com';

export const ADMIN_URL = isLocalAddress
    ? `http://${hostname}:5174`
    : 'https://seaman-fresh-admin.pages.dev';

console.log('--- NETWORK DEBUG ---');
console.log('Current Hostname:', hostname);
console.log('Is Local Network:', isLocalAddress);
console.log('Final API_URL:', API_URL);

export default API_URL;
