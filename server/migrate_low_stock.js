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

        // Add low_stock_threshold column
        try {
            await connection.execute('ALTER TABLE products ADD COLUMN low_stock_threshold INT DEFAULT 5');
            console.log('Added low_stock_threshold column.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('low_stock_threshold column already exists.');
            } else {
                console.error('Error adding low_stock_threshold:', err.message);
            }
        }

        await connection.end();
    } catch (error) {
        console.error('Migration failed:', error);
    }
})();
