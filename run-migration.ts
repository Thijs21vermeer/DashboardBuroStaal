/**
 * Run database migration to add missing columns
 * This script executes the migration SQL on Turso database
 */

import { createClient } from '@libsql/client';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function runMigration() {
  console.log('🚀 Starting database migration...\n');
  
  try {
    // Get Turso credentials from environment
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    
    if (!url || !authToken) {
      throw new Error('❌ Missing Turso credentials. Check .env file for TURSO_DATABASE_URL and TURSO_AUTH_TOKEN');
    }
    
    console.log('📡 Connecting to Turso database...');
    console.log(`   URL: ${url.substring(0, 30)}...`);
    
    const client = createClient({
      url,
      authToken,
    });
    
    // Test connection
    await client.execute('SELECT 1');
    console.log('✅ Connected to database\n');
    
    // Read migration SQL
    const migrationPath = path.join(process.cwd(), 'db', 'migrate-all-missing-fields.sql');
    const sql = fs.readFileSync(migrationPath, 'utf-8');
    
    // Split into individual statements (remove comments and empty lines)
    const statements = sql
      .split('\n')
      .filter(line => {
        const trimmed = line.trim();
        return trimmed && !trimmed.startsWith('--');
      })
      .join('\n')
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log(`📝 Found ${statements.length} SQL statements\n`);
    
    // Execute each statement
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      console.log(`\n[${i + 1}/${statements.length}] Executing:`);
      console.log(`   ${stmt.substring(0, 80)}${stmt.length > 80 ? '...' : ''}`);
      
      try {
        await client.execute(stmt);
        console.log(`   ✅ Success`);
        successCount++;
      } catch (error: any) {
        // Check if error is "duplicate column name" - that's OK
        if (error.message && error.message.includes('duplicate column')) {
          console.log(`   ⚠️  Column already exists (skipping)`);
          successCount++;
        } else {
          console.error(`   ❌ Error: ${error.message}`);
          errorCount++;
        }
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 Migration Summary:');
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log('='.repeat(60));
    
    if (errorCount === 0) {
      console.log('\n🎉 Migration completed successfully!');
      console.log('✨ All missing columns have been added to the database.');
      console.log('🔄 The application should now work correctly.\n');
    } else {
      console.log('\n⚠️  Migration completed with some errors.');
      console.log('   Please review the errors above.\n');
    }
    
    // Verify the migration by checking table schemas
    console.log('\n🔍 Verifying table schemas...\n');
    
    const tables = ['KennisItems', 'Cases', 'Trends', 'Nieuws'];
    
    for (const table of tables) {
      try {
        const result = await client.execute(`PRAGMA table_info(${table})`);
        console.log(`\n📋 ${table}:`);
        console.log(`   Columns: ${result.rows.length}`);
        
        // Show new columns
        const columnNames = result.rows.map((r: any) => r.name);
        const newColumns: { [key: string]: string[] } = {
          'KennisItems': ['eigenaar', 'gekoppeldProject', 'videoLink'],
          'Cases': ['industrie', 'uitdaging', 'oplossing', 'resultaten'],
          'Trends': ['bron', 'relevantie', 'samenvatting', 'inhoud'],
          'Nieuws': ['categorie', 'samenvatting']
        };
        
        if (newColumns[table]) {
          const found = newColumns[table].filter(col => columnNames.includes(col));
          const missing = newColumns[table].filter(col => !columnNames.includes(col));
          
          if (found.length > 0) {
            console.log(`   ✅ New columns: ${found.join(', ')}`);
          }
          if (missing.length > 0) {
            console.log(`   ❌ Missing: ${missing.join(', ')}`);
          }
        }
      } catch (error: any) {
        console.error(`   ❌ Error checking ${table}: ${error.message}`);
      }
    }
    
    console.log('\n✅ Migration verification complete!\n');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
runMigration()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

