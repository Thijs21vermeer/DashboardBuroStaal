import sql from 'mssql';
import { getPool } from './src/lib/db-config';

async function fixReferentiesColumn() {
  try {
    const pool = await getPool();
    
    // Check if column exists
    const checkResult = await pool.request().query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'cases' AND COLUMN_NAME = 'referenties'
    `);
    
    if (checkResult.recordset.length === 0) {
      console.log('❌ Referenties kolom bestaat niet - wordt toegevoegd...');
      
      await pool.request().query(`
        ALTER TABLE cases ADD referenties NVARCHAR(MAX)
      `);
      
      console.log('✅ Referenties kolom succesvol toegevoegd!');
    } else {
      console.log('✅ Referenties kolom bestaat al');
    }
    
    await pool.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixReferentiesColumn();
