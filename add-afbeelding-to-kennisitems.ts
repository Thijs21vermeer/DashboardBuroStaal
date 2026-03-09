/**
 * Migratie Script: Voeg afbeelding kolom toe aan kennisitems tabel
 * 
 * Dit script voegt een 'afbeelding' kolom toe aan de kennisitems tabel.
 * De kolom kan een URL of base64 encoded afbeelding opslaan.
 * 
 * Gebruik: npx tsx add-afbeelding-to-kennisitems.ts
 */

import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config: sql.config = {
  server: process.env.AZURE_SQL_SERVER || '',
  database: process.env.AZURE_SQL_DATABASE || '',
  authentication: {
    type: 'default',
    options: {
      userName: process.env.AZURE_SQL_USER || '',
      password: process.env.AZURE_SQL_PASSWORD || '',
    }
  },
  options: {
    encrypt: true,
    trustServerCertificate: false,
  }
};

async function addAfbeeldingColumn() {
  console.log('🔄 Connecting to Azure SQL Database...');
  
  try {
    const pool = await sql.connect(config);
    console.log('✅ Connected to Azure SQL Database\n');

    // Check if column already exists
    console.log('🔍 Checking if afbeelding column already exists...');
    const checkResult = await pool.request().query(`
      SELECT COUNT(*) as count
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'kennisitems' 
      AND COLUMN_NAME = 'afbeelding'
    `);

    if (checkResult.recordset[0].count > 0) {
      console.log('⚠️  Column afbeelding already exists in kennisitems table');
      console.log('✅ Migration already applied, skipping...\n');
      await pool.close();
      return;
    }

    console.log('➕ Adding afbeelding column to kennisitems table...');
    
    // Add the column
    await pool.request().query(`
      ALTER TABLE kennisitems
      ADD afbeelding NVARCHAR(MAX)
    `);

    console.log('✅ Column afbeelding successfully added to kennisitems table\n');

    // Optionally add an index for better performance
    console.log('📊 Adding index for afbeelding column...');
    try {
      await pool.request().query(`
        CREATE INDEX idx_kennisitems_afbeelding 
        ON kennisitems(afbeelding) 
        WHERE afbeelding IS NOT NULL
      `);
      console.log('✅ Index created successfully\n');
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        console.log('⚠️  Index already exists, skipping...\n');
      } else {
        console.error('❌ Error creating index:', error.message);
      }
    }

    // Verify the column was added
    const verifyResult = await pool.request().query(`
      SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'kennisitems' 
      AND COLUMN_NAME = 'afbeelding'
    `);

    if (verifyResult.recordset.length > 0) {
      console.log('✅ Migration verified successfully:');
      console.log('   Column:', verifyResult.recordset[0].COLUMN_NAME);
      console.log('   Type:', verifyResult.recordset[0].DATA_TYPE);
      console.log('   Max Length:', verifyResult.recordset[0].CHARACTER_MAXIMUM_LENGTH || 'MAX');
      console.log('   Nullable:', verifyResult.recordset[0].IS_NULLABLE);
    }

    await pool.close();
    console.log('\n✅ Migration completed successfully!');
    console.log('\nJe kunt nu afbeeldingen uploaden bij kennisitems.');
    console.log('Afbeeldingen worden alleen getoond op de detailpagina.\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run the migration
addAfbeeldingColumn()
  .then(() => {
    console.log('🎉 All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
