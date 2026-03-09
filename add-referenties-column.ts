import sql from 'mssql';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

async function addReferentiesColumn() {
  const config = {
    server: process.env.AZURE_SQL_SERVER || '',
    database: process.env.AZURE_SQL_DATABASE || '',
    user: process.env.AZURE_SQL_USER || '',
    password: process.env.AZURE_SQL_PASSWORD || '',
    options: {
      encrypt: true,
      trustServerCertificate: false,
    },
  };

  console.log('🔄 Verbinding maken met Azure SQL...');
  
  try {
    const pool = await sql.connect(config);
    
    console.log('✅ Verbonden met database');
    
    // Check if column exists
    const checkQuery = `
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'cases' AND COLUMN_NAME = 'referenties'
    `;
    
    const result = await pool.request().query(checkQuery);
    
    if (result.recordset.length === 0) {
      console.log('➕ Referenties kolom bestaat niet, wordt toegevoegd...');
      
      const alterQuery = `ALTER TABLE cases ADD referenties NVARCHAR(MAX)`;
      await pool.request().query(alterQuery);
      
      console.log('✅ Referenties kolom succesvol toegevoegd!');
    } else {
      console.log('ℹ️  Referenties kolom bestaat al');
    }
    
    // Verify
    const verifyResult = await pool.request().query(checkQuery);
    console.log('✅ Verificatie: kolom aanwezig:', verifyResult.recordset.length > 0);
    
    await pool.close();
    console.log('✅ Klaar!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

addReferentiesColumn().then(() => process.exit(0)).catch(() => process.exit(1));

