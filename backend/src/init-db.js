const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function run() {
    try {
        console.log('Connecting to database...');
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASS || '',
            multipleStatements: true
        });

        console.log('Connected!');

        console.log('Reading schema.sql...');
        const schema = fs.readFileSync(path.join(__dirname, '../../database/schema.sql'), 'utf8');
        await connection.query(schema);
        console.log('Schema executed successfully!');

        console.log('Reading seed.sql...');
        const seed = fs.readFileSync(path.join(__dirname, '../../database/seed.sql'), 'utf8');
        await connection.query(seed);
        console.log('Seed data inserted successfully!');

        await connection.end();
        console.log('Database initialization complete!');
    } catch (err) {
        console.error('Error initializing database:', err.message);
    }
}

run();
