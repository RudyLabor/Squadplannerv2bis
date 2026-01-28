#!/usr/bin/env node

const { Client } = require('pg');

const DB_CONFIG = {
  host: 'db.cwtoprbowdqcemdjrtir.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'Ruudboy92600*',
  ssl: { rejectUnauthorized: false }
};

async function findAuthConfig() {
  const client = new Client(DB_CONFIG);

  try {
    await client.connect();
    console.log('✅ Connecté!\n');

    // Lister les tables du schema auth
    console.log('📋 Tables dans le schema auth:');
    const { rows: tables } = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'auth'
      ORDER BY table_name;
    `);

    tables.forEach(t => console.log(`   - ${t.table_name}`));

    // Chercher les configurations
    console.log('\n📋 Recherche de configurations auth...');

    // Essayer différentes tables
    const configTables = ['auth.config', 'supabase_auth.config', 'public.config', 'vault.secrets'];

    for (const table of configTables) {
      try {
        const { rows } = await client.query(`SELECT * FROM ${table} LIMIT 1`);
        console.log(`\n✅ Trouvé: ${table}`);
        console.log(rows);
      } catch (err) {
        // Table n'existe pas
      }
    }

    // Vérifier les variables système
    console.log('\n📋 Variables système GoTrue:');
    try {
      const { rows } = await client.query(`
        SELECT name, setting
        FROM pg_settings
        WHERE name LIKE '%gotrue%' OR name LIKE '%auth%'
        LIMIT 10;
      `);
      rows.forEach(r => console.log(`   ${r.name} = ${r.setting}`));
    } catch (err) {
      console.log('   Aucune variable trouvée');
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await client.end();
  }
}

findAuthConfig();
