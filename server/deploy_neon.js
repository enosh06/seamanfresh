const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('DATABASE_URL not found in .env');
    process.exit(1);
}

const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
});

async function deploy() {
    try {
        console.log('Connecting to Neon PostgreSQL...');
        const client = await pool.connect();
        console.log('Connected successfully!');

        console.log('Reading schema_postgres.sql...');
        const schemaPath = path.join(__dirname, '../schema_postgres.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log('Executing schema...');
        await client.query(schema);

        console.log('Schema deployed successfully to Neon!');
        client.release();
        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('Deployment failed:', error.message);
        process.exit(1);
    }
}

deploy();
