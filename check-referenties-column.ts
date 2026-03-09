import sql from 'mssql';
import { getPool } from './src/lib/db-config';

async function checkColumn() {
  try {
    const pool = await getPool();
    
    const result = await pool.request().query(`
      SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'cases' AND COLUMN_NAME = 'referenties'
    `);
    
    if (result.recordset.length > 0) {
      console.log('✅ Referenties kolom bestaat:', result.recordset[0]);
    } else {
      console.log('❌ Referenties kolom bestaat NIET');
      console.log('📝 Voer het volgende SQL commando uit:');
      console.log('ALTER TABLE cases ADD referenties NVARCHAR(MAX);');
    }
    
    await pool.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkColumn();
