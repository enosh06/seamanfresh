const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

// Explicitly load .env from the server directory
const result = dotenv.config({ path: path.join(__dirname, '../.env') });

if (result.error) {
    console.error('Error loading .env file:', result.error);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Test connection
(async () => {
    try {
        const client = await pool.connect();
        console.log('PostgreSQL connected successfully to Neon');
        client.release();
    } catch (error) {
        console.error('PostgreSQL connection failed:', error.message);
    }
})();

// Helper to mimic mysql2 query/execute behavior (returns [rows, fields])
const db = {
    query: (text, params) => pool.query(text, params),
    execute: async (text, params) => {
        // Convert MySQL ? placeholders to PostgreSQL $1, $2, etc.
        let index = 1;
        const pgText = text.replace(/\?/g, () => `$${index++}`);
        const result = await pool.query(pgText, params);

        // Emulate mysql2 returning resultId for INSERTs
        // In PG we usually use RETURNING id, but to avoid changing all controllers,
        // we can try to guess or just return the rows.
        // If it's an INSERT and has rows, add insertId for compatibility.
        if (pgText.trim().toLowerCase().startsWith('insert') && result.rows.length > 0) {
            result.insertId = result.rows[0].id;
        } else if (pgText.trim().toLowerCase().startsWith('insert') && result.command === 'INSERT') {
            // If no RETURNING clause was used but we need insertId, 
            // this wrapper is limited. The controllers should be updated to use RETURNING id.
        }

        return [result.rows, result.fields];
    },
    // Compatibility for orderController which uses getConnection()
    getConnection: async () => {
        const client = await pool.connect();
        return {
            execute: async (text, params) => {
                let index = 1;
                // Add RETURNING id to INSERT statements to populate insertId
                let pgText = text.replace(/\?/g, () => `$${index++}`);
                if (pgText.trim().toLowerCase().startsWith('insert') && !pgText.toLowerCase().includes('returning')) {
                    pgText += ' RETURNING id';
                }
                const result = await client.query(pgText, params);
                const rows = result.rows;
                const insertId = (rows.length > 0) ? rows[0].id : null;
                return [{ insertId, ...rows[0] }, result.fields];
            },
            beginTransaction: () => client.query('BEGIN'),
            commit: () => client.query('COMMIT'),
            rollback: () => client.query('ROLLBACK'),
            release: () => client.release()
        };
    },
    pool
};

module.exports = db;
