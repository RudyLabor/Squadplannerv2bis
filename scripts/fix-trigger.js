
import postgres from 'postgres';

// Supabase Connection Details
const DB_HOST = 'db.cwtoprbowdqcemdjrtir.supabase.co';
const DB_PORT = 5432;
const DB_NAME = 'postgres';
const DB_USER = 'postgres';
const DB_PASS = 'Ruudboy92600*';

async function fixTrigger() {
  console.log('🚀 Repairing Database Trigger...');

  const sql = postgres({
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    username: DB_USER,
    password: DB_PASS,
    ssl: { rejectUnauthorized: false },
  });

  try {
    // 1. Drop existing (if any)
    console.log('🗑️ Dropping old trigger/function...');
    await sql`DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users`;
    await sql`DROP FUNCTION IF EXISTS public.handle_new_user()`;

    // 2. Create Function (Atomic Block)
    console.log('🔧 Creating Function...');
    await sql`
      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS TRIGGER AS $$
      BEGIN
        INSERT INTO public.profiles (id, email, username, avatar_url)
        VALUES (
          new.id,
          new.email,
          new.raw_user_meta_data->>'name',
          new.raw_user_meta_data->>'avatar'
        );
        RETURN new;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;

    // 3. Create Trigger
    console.log('🔗 Creating Trigger...');
    await sql`
      CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
    `;

    console.log('✅ Trigger repaired successfully!');

  } catch (error) {
    console.error('❌ Repair failed:', error);
  } finally {
    await sql.end();
  }
}

fixTrigger();
