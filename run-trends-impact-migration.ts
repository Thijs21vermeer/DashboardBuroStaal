import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN || '',
});

async function runMigration() {
  console.log('🚀 Starting Trends Impact Fields Migration...\n');

  try {
    // Define migrations manually
    const migrations = [
      { name: 'impact_beschrijving', sql: 'ALTER TABLE trends ADD COLUMN impact_beschrijving TEXT' },
      { name: 'aanbevelingen', sql: 'ALTER TABLE trends ADD COLUMN aanbevelingen TEXT' },
      { name: 'views', sql: 'ALTER TABLE trends ADD COLUMN views INTEGER DEFAULT 0' },
      { name: 'sector', sql: 'ALTER TABLE trends ADD COLUMN sector TEXT' },
    ];

    console.log(`📋 Running ${migrations.length} migrations...\n`);

    // Execute each statement
    for (let i = 0; i < migrations.length; i++) {
      const migration = migrations[i];
      
      try {
        console.log(`⚙️  Adding column: ${migration.name}...`);
        await turso.execute(migration.sql);
        console.log(`✅ Column ${migration.name} added successfully\n`);
      } catch (error: any) {
        // Check if column already exists
        if (error.message.includes('duplicate column name')) {
          console.log(`⚠️  Column ${migration.name} already exists (skipping)\n`);
          continue;
        }
        throw error;
      }
    }

    // Verify columns were added
    console.log('\n🔍 Verifying new columns...');
    const result = await turso.execute(`
      PRAGMA table_info(trends);
    `);

    const newColumns = ['impact_beschrijving', 'aanbevelingen', 'views', 'sector'];
    const foundColumns = result.rows.filter((row: any) => 
      newColumns.includes(row.name)
    );

    if (foundColumns.length > 0) {
      console.log('\n✅ New columns verified:');
      foundColumns.forEach((col: any) => {
        console.log(`   - ${col.name} (${col.type})`);
      });
    } else {
      console.log('\n⚠️  Warning: Could not find new columns');
    }

    // Show all trends columns
    console.log('\n📋 All trends table columns:');
    result.rows.forEach((col: any) => {
      console.log(`   - ${col.name} (${col.type})`);
    });

    console.log('\n✅ Migration completed successfully!');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();


