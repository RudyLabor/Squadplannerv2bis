
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Credentials recovered from migrate-db.js
const DB_HOST = 'db.cwtoprbowdqcemdjrtir.supabase.co';
const DB_PORT = 5432;
const DB_NAME = 'postgres';
const DB_USER = 'postgres';
const DB_PASS = 'Ruudboy92600*';

async function deploySchema() {
  console.log('🔄 Connecting to database...');
  
  const client = new Client({
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASS,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected.');

    const sqlPath = path.join(__dirname, '../FULL_DB_SETUP.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log(`📜 Executing FULL_DB_SETUP.sql (${sql.length} bytes)...`);
    
    // PG client allows multiple statements in one query
    await client.query(sql);

    console.log('✅ Base de données déployée avec succès !');
  } catch (err) {
    console.error('❌ Error deploying schema:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

deploySchema();
