const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

(async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });

        console.log('Connected to database.');

        // Add discount_percent column
        try {
            await connection.execute('ALTER TABLE products ADD COLUMN discount_percent INT DEFAULT 0');
            console.log('Added discount_percent column.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('discount_percent column already exists.');
            } else {
                console.error('Error adding discount_percent:', err.message);
            }
        }

        await connection.end();
    } catch (error) {
        console.error('Migration failed:', error);
    }
})();
