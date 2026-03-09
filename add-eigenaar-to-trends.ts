import sql from 'mssql';

const config: sql.config = {
  user: process.env.AZURE_SQL_USER || '',
  password: process.env.AZURE_SQL_PASSWORD || '',
  server: process.env.AZURE_SQL_SERVER || '',
  database: process.env.AZURE_SQL_DATABASE || '',
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

async function addEigenaarColumn() {
  console.log('🔄 Connecting to Azure SQL Database...');
  
  try {
    const pool = await sql.connect(config);
    console.log('✅ Connected to Azure SQL Database');

    // Check if column exists
    console.log('\n📋 Checking if eigenaar column exists in trends table...');
    const checkResult = await pool.request().query(`
      SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'trends' AND COLUMN_NAME = 'eigenaar'
    `);

    if (checkResult.recordset.length > 0) {
      console.log('ℹ️  Column eigenaar already exists in trends table');
    } else {
      console.log('➕ Adding eigenaar column to trends table...');
      await pool.request().query(`
        ALTER TABLE trends ADD eigenaar NVARCHAR(200)
      `);
      console.log('✅ eigenaar column added successfully');
    }

    // Optional: Update existing records with a default value
    console.log('\n📝 Updating existing trends with default eigenaar...');
    const updateResult = await pool.request().query(`
      UPDATE trends 
      SET eigenaar = 'Buro Staal'
      WHERE eigenaar IS NULL
    `);
    console.log(`✅ Updated ${updateResult.rowsAffected[0]} records`);

    console.log('\n✨ Database update completed successfully!');
    
    await pool.close();
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

addEigenaarColumn();
