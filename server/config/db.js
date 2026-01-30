const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Explicitly load .env from the server directory
const result = dotenv.config({ path: path.join(__dirname, '../.env') });

if (result.error) {
    console.error('Error loading .env file:', result.error);
}

console.log('Database Config:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    envPath: path.join(__dirname, '../.env')
});

const isTiDB = process.env.DB_HOST && process.env.DB_HOST.includes('tidbcloud.com');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME || (isTiDB ? 'test' : 'seaman_fresh'),
    port: process.env.DB_PORT || (isTiDB ? 4000 : 3306),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: (process.env.DB_SSL === 'true' || isTiDB) ? {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
    } : undefined
});

// Test connection
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Database connected successfully');
        connection.release();
    } catch (error) {
        console.error('Database connection failed:', error.message);
    }
})();

module.exports = pool;
