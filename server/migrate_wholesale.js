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

        // Add wholesale_price column
        try {
            await connection.execute('ALTER TABLE products ADD COLUMN wholesale_price DECIMAL(10, 2)');
            console.log('Added wholesale_price column.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('wholesale_price column already exists.');
            } else {
                console.error('Error adding wholesale_price:', err.message);
            }
        }

        // Add wholesale_moq column
        try {
            await connection.execute('ALTER TABLE products ADD COLUMN wholesale_moq INT DEFAULT 0');
            console.log('Added wholesale_moq column.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('wholesale_moq column already exists.');
            } else {
                console.error('Error adding wholesale_moq:', err.message);
            }
        }

        await connection.end();
    } catch (error) {
        console.error('Migration failed:', error);
    }
})();
