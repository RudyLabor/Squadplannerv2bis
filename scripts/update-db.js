
import postgres from 'postgres';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase Connection Details
const DB_HOST = 'db.cwtoprbowdqcemdjrtir.supabase.co';
const DB_PORT = 5432;
const DB_NAME = 'postgres';
const DB_USER = 'postgres';
const DB_PASS = 'Ruudboy92600*';

async function runUpdate() {
  console.log('🚀 Starting Database Update...');

  const sql = postgres({
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    username: DB_USER,
    password: DB_PASS,
    ssl: { rejectUnauthorized: false }, // Supabase requires SSL
  });

  try {
    // Read the SQL schema file
    const schemaPath = path.join(process.cwd(), 'UPDATE_SCHEMA.sql');
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found at: ${schemaPath}`);
    }

    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    console.log(`📄 Read update file (${schemaContent.length} bytes)`);

    const statements = schemaContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`🔄 Identified ${statements.length} SQL statements to execute.`);

    for (const [index, statement] of statements.entries()) {
      try {
        if (statement.startsWith('--') && !statement.includes('\n')) continue;
        console.log(`Running: ${statement.substring(0, 50)}...`);
        await sql.unsafe(statement);
      } catch (err) {
            console.error(`⚠️ Error executing statement #${index + 1}: ${err.message}`);
      }
    }

    console.log('✅ Update completed successfully!');

  } catch (error) {
    console.error('❌ Update failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

runUpdate();
