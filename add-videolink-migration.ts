import sql from 'mssql';
import { config } from 'dotenv';

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

async function addVideoLinkColumn() {
  console.log('🚀 Starting videoLink column migration...');
  console.log('📊 Connecting to Azure SQL Database...');
  
  try {
    const pool = await sql.connect(dbConfig);
    console.log('✅ Connected to database');

    // Check if column exists
    const checkQuery = `
      SELECT COUNT(*) as columnExists
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'kennisitems' 
      AND COLUMN_NAME = 'video_link'
    `;
    
    const checkResult = await pool.request().query(checkQuery);
    const columnExists = checkResult.recordset[0].columnExists > 0;
    
    if (columnExists) {
      console.log('ℹ️  Column video_link already exists - skipping migration');
    } else {
      console.log('➕ Adding video_link column...');
      
      const alterQuery = `
        ALTER TABLE kennisitems
        ADD video_link NVARCHAR(1000) NULL;
      `;
      
      await pool.request().query(alterQuery);
      console.log('✅ Column video_link added successfully!');
    }

    // Verify the column was added
    const verifyQuery = `
      SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'kennisitems' 
      AND COLUMN_NAME = 'video_link'
    `;
    
    const verifyResult = await pool.request().query(verifyQuery);
    
    if (verifyResult.recordset.length > 0) {
      const col = verifyResult.recordset[0];
      console.log('✅ Column verification:');
      console.log(`   - Name: ${col.COLUMN_NAME}`);
      console.log(`   - Type: ${col.DATA_TYPE}(${col.CHARACTER_MAXIMUM_LENGTH})`);
      console.log(`   - Nullable: ${col.IS_NULLABLE}`);
    }

    await pool.close();
    console.log('🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

addVideoLinkColumn()
  .then(() => {
    console.log('✅ Script finished');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Script failed:', err);
    process.exit(1);
  });
