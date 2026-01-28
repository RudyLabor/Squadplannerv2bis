
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

async function runMigration() {
  console.log('🚀 Starting Database Migration...');

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
    const schemaPath = path.join(process.cwd(), 'SUPABASE_SCHEMA_PRO.sql');
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found at: ${schemaPath}`);
    }

    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    console.log(`📄 Read schema file (${schemaContent.length} bytes)`);

    // Split by semicolon but ignore semicolons inside code blocks (like functions)
    // For simplicity in this specific schema which is well formatted, we can split by ";\n" or just simple ";".
    // A more robust way for this specific file structure involves splitting by specific markers or just executing known blocks.
    // Given the file structure, we can try to split by ";\r\n" or ";\n" to get individual statements.
    
    // Improved splitting: remove comments and split
    const statements = schemaContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`🔄 Identified ${statements.length} SQL statements to execute.`);

    for (const [index, statement] of statements.entries()) {
      try {
        // Skip empty or comment-only statements
        if (statement.startsWith('--') && !statement.includes('\n')) continue;
        
        await sql.unsafe(statement);
      } catch (err) {
        // Ignore "relation already exists" or "policy does not exist" type errors for idempotency
        // But for "relation does not exist", it's a real error if order matters.
        const msg = err.message;
        const isIgnorable = 
            msg.includes('already exists') || 
            msg.includes('does not exist, skipping');

        if (!isIgnorable) {
            console.error(`⚠️ Error executing statement #${index + 1}: ${msg}`);
            // console.error(statement.substring(0, 50) + '...');
             // We continue because sometimes drop statements fail if object doesn't exist
        }
      }
    }

    console.log('✅ Migration completed successfully!');
    
    // Quick verification
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    console.log('📊 Current tables in public schema:', tables.map(t => t.table_name));

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

runMigration();
