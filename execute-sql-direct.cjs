#!/usr/bin/env node

const { Client } = require('pg');
const fs = require('fs');

// Connection string (vous devrez mettre le mot de passe)
const connectionString = 'postgresql://postgres.cwtoprbowdqcemdjrtir:Fqz3jZwuNPebqGJa@aws-0-eu-west-1.pooler.supabase.com:6543/postgres';

async function executeSQLFile() {
  const client = new Client({ connectionString });

  try {
    console.log('📝 Connexion à la base de données...');
    await client.connect();
    console.log('✅ Connecté!');

    console.log('📝 Lecture du fichier SQL...');
    const sqlContent = fs.readFileSync('FULL_DB_SETUP.sql', 'utf-8');

    console.log('📝 Exécution du SQL...');
    await client.query(sqlContent);

    console.log('✅ Migrations SQL exécutées avec succès!');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

executeSQLFile();
