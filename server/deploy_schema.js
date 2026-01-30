const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const config = {};

// Simple argument parser
for (const arg of args) {
    if (arg.startsWith('--host=')) config.host = arg.split('=')[1];
    if (arg.startsWith('--user=')) config.user = arg.split('=')[1];
    if (arg.startsWith('--pass=')) config.password = arg.split('=')[1];
    if (arg.startsWith('--port=')) config.port = parseInt(arg.split('=')[1]);
}

if (!config.host || !config.user || !config.password) {
    console.log('Usage: node server/deploy_schema.js --host=<host> --user=<user> --pass=<pass> [--port=4000]');
    process.exit(1);
}

config.port = config.port || 4000;
config.multipleStatements = true;
config.ssl = { rejectUnauthorized: true }; // TiDB requires SSL

async function deploy() {
    try {
        console.log(`Connecting to ${config.host}:${config.port}...`);

        // Connect without database selected initially
        const connection = await mysql.createConnection(config);
        console.log('Connected successfully!');

        console.log('Reading schema.sql...');
        const schemaPath = path.join(__dirname, '../schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log('Executing schema...');
        // Execute the entire script
        await connection.query(schema);

        console.log('Schema deployed successfully!');
        console.log('IMPORTANT: Ensure your Render environment variable DB_NAME is set to "seaman_fresh"');

        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('Deployment failed:', error.message);
        process.exit(1);
    }
}

deploy();
