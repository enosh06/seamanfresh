// Use current hostname to determine API URL
const isLocalhost =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.includes('192.168.') ||
    window.location.hostname.includes('10.');

// FORCE LOCALHOST FOR TESTING if the user is seeing production errors on a local machine
const FORCE_LOCAL = true; // Temporary force to ensure local development works

// On localhost, we ALWAYS want to use the local server
// On production (Netlify/Render/Cloudflare), we use the production URL
const API_URL = (isLocalhost || FORCE_LOCAL)
    ? 'http://localhost:5000'
    : 'https://seaman-fresh-final.onrender.com';

export const ADMIN_URL = (isLocalhost || FORCE_LOCAL)
    ? 'http://localhost:5174'
    : 'https://admin-seaman-fresh.onrender.com';

console.log('--- CRITICAL ENV DEBUG ---');
console.log('Hostname:', window.location.hostname);
console.log('Is Localhost Detected:', isLocalhost);
console.log('FORCE_LOCAL Active:', FORCE_LOCAL);
console.log('Final API_URL being used:', API_URL);

export default API_URL;
