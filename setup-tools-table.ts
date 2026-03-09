import sql from 'mssql';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';

// Load environment variables
config();

const dbConfig = {
  server: process.env.AZURE_SQL_SERVER || '',
  database: process.env.AZURE_SQL_DATABASE || '',
  user: process.env.AZURE_SQL_USER || '',
  password: process.env.AZURE_SQL_PASSWORD || '',
  port: parseInt(process.env.AZURE_SQL_PORT || '1433'),
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

async function setupToolsTable() {
  try {
    console.log('🔌 Connecting to Azure SQL Database...');
    const pool = await sql.connect(dbConfig);
    console.log('✅ Connected successfully!');

    // Lees het schema bestand
    const schemaPath = path.join(process.cwd(), 'db', 'tools-schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf-8');
    
    console.log('\n📋 Creating tools table...');
    
    // Split op CREATE TABLE en CREATE INDEX statements
    const statements = schemaSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const statement of statements) {
      if (statement.includes('CREATE TABLE')) {
        try {
          await pool.request().query(statement);
          console.log('✅ Tools table created successfully!');
        } catch (error: any) {
          if (error.message.includes('already an object')) {
            console.log('ℹ️  Tools table already exists, skipping...');
          } else {
            throw error;
          }
        }
      } else if (statement.includes('CREATE INDEX')) {
        try {
          await pool.request().query(statement);
          console.log('✅ Index created successfully!');
        } catch (error: any) {
          if (error.message.includes('already an object')) {
            console.log('ℹ️  Index already exists, skipping...');
          } else {
            console.warn('⚠️  Warning creating index:', error.message);
          }
        }
      }
    }

    // Lees het seed bestand
    const seedPath = path.join(process.cwd(), 'db', 'tools-seed.sql');
    const seedSQL = fs.readFileSync(seedPath, 'utf-8');
    
    console.log('\n🌱 Seeding tools data...');
    
    // Split op INSERT statements
    const insertStatements = seedSQL
      .split(/INSERT INTO tools/i)
      .filter(s => s.trim().length > 0 && !s.trim().startsWith('--'));

    let successCount = 0;
    let skipCount = 0;

    for (let i = 0; i < insertStatements.length; i++) {
      const statement = 'INSERT INTO tools' + insertStatements[i];
      
      // Skip comments
      if (statement.trim().startsWith('--')) continue;
      
      try {
        await pool.request().query(statement);
        successCount++;
        console.log(`✅ Tool ${successCount} added successfully`);
      } catch (error: any) {
        if (error.message.includes('duplicate') || error.message.includes('UNIQUE')) {
          skipCount++;
          console.log(`ℹ️  Tool ${i + 1} already exists, skipping...`);
        } else {
          console.warn(`⚠️  Warning inserting tool ${i + 1}:`, error.message);
        }
      }
    }

    console.log('\n✨ Setup completed!');
    console.log(`📊 Summary:`);
    console.log(`   - ${successCount} tools added`);
    console.log(`   - ${skipCount} tools skipped (already exist)`);

    // Toon alle tools
    console.log('\n📚 Current tools in database:');
    const result = await pool.request().query('SELECT id, titel, categorie, taal FROM tools ORDER BY id');
    
    result.recordset.forEach((tool, index) => {
      console.log(`   ${index + 1}. [${tool.categorie}] ${tool.titel}${tool.taal ? ` (${tool.taal})` : ''}`);
    });

    await pool.close();
    console.log('\n✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

setupToolsTable();

