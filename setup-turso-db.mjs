import { createClient } from '@libsql/client';
import fs from 'fs';
import 'dotenv/config';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function setupDatabase() {
  try {
    console.log('🔄 Verbinden met Turso database...');
    console.log(`📍 URL: ${process.env.TURSO_DATABASE_URL}`);
    
    // Lees schema
    const schema = fs.readFileSync('db/turso-schema.sql', 'utf8');
    
    // Gebruik regex om complete CREATE TABLE statements te vinden (inclusief multiline)
    const tableMatches = schema.matchAll(/CREATE TABLE IF NOT EXISTS[\s\S]*?\);/gi);
    const tableQueries = Array.from(tableMatches, m => m[0].trim());
    
    // Gebruik regex voor CREATE INDEX statements
    const indexMatches = schema.matchAll(/CREATE INDEX IF NOT EXISTS.*?;/gi);
    const indexQueries = Array.from(indexMatches, m => m[0].trim());
    
    console.log(`\n📝 Aanmaken van ${tableQueries.length} tabellen...`);
    
    for (let i = 0; i < tableQueries.length; i++) {
      const query = tableQueries[i];
      const tableName = query.match(/CREATE TABLE IF NOT EXISTS (\w+)/)?.[1] || 'unknown';
      try {
        await client.execute(query);
        console.log('     ✅ Aangemaakt');
      } catch (err) {
        if (err.message.includes('already exists')) {
          console.log('     ⚠️  Bestaat al');
        } else {
          console.error('     ❌ Fout:', err.message);
        }
      }
    }
    
    console.log(`\n📝 Aanmaken van ${indexQueries.length} indexes...`);
    
    for (let i = 0; i < indexQueries.length; i++) {
      const query = indexQueries[i];
      const indexName = query.match(/CREATE INDEX IF NOT EXISTS (\w+)/)?.[1] || 'unknown';
      try {
        await client.execute(query);
        console.log('     ✅ Aangemaakt');
      } catch (err) {
        if (err.message.includes('already exists')) {
          console.log('     ⚠️  Bestaat al');
        } else {
          console.error('     ❌ Fout:', err.message);
        }
      }
    }
    
    console.log('\n✅ Schema aangemaakt!');
    
    // Check tabellen
    const tables = await client.execute(
      "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
    );
    
    console.log('\n📊 Tabellen in database:');
    tables.rows.forEach(row => {
      console.log(`  - ${row.name}`);
    });
    
    // Check aantal records
    console.log('\n📈 Aantal records per tabel:');
    const tableNames = ['KennisItems', 'Cases', 'Trends', 'Nieuws', 'Team', 'Tools', 'Videos', 'Partners'];
    
    for (const tableName of tableNames) {
      try {
        const result = await client.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
        console.log(`  - ${tableName}: ${result.rows[0].count}`);
      } catch (err) {
        console.log(`  - ${tableName}: (tabel bestaat niet)`);
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Fout:', error.message);
    console.error(error);
    process.exit(1);
  }
}

setupDatabase();





