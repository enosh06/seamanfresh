const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Load env
const envPath = path.join(__dirname, '.env');
dotenv.config({ path: envPath });

console.log('ENV PATH:', envPath);
console.log('DB_NAME:', process.env.DB_NAME);

(async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306
        });

        console.log('Connected!');
        const [columns] = await connection.execute('SHOW COLUMNS FROM users');
        console.log('User Columns:', columns.map(c => c.Field));
        const [rows] = await connection.execute('SELECT id, email, password, role FROM users');
        console.log('Users found:', rows.map(u => ({ ...u, password: u.password ? u.password.substring(0, 10) + '...' : 'NULL' })));

        await connection.end();
    } catch (err) {
        console.error('ERROR:', err);
    }
})();
