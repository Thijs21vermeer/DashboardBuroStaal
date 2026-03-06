import sql from 'mssql';

const config: sql.config = {
  server: process.env.AZURE_SQL_SERVER || 'dashboardbs.database.windows.net',
  database: process.env.AZURE_SQL_DATABASE || 'dashboarddb',
  user: process.env.AZURE_SQL_USER || 'databasedashboard',
  password: process.env.AZURE_SQL_PASSWORD || 'Knolpower05!',
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

async function testConnection() {
  try {
    console.log('🔌 Verbinding maken met Azure SQL Database...');
    console.log(`Server: ${config.server}`);
    console.log(`Database: ${config.database}`);
    console.log(`User: ${config.user}`);
    
    const pool = await sql.connect(config);
    console.log('✅ Verbinding succesvol!\n');

    // Test query: haal kennisitems op
    console.log('📊 Kennisitems ophalen...');
    const kennisResult = await pool.request().query('SELECT * FROM KennisItems');
    console.log(`Gevonden: ${kennisResult.recordset.length} kennisitems`);
    if (kennisResult.recordset.length > 0) {
      console.log('Eerste item:', kennisResult.recordset[0]);
    }

    // Test query: haal cases op
    console.log('\n📊 Cases ophalen...');
    const casesResult = await pool.request().query('SELECT * FROM Cases');
    console.log(`Gevonden: ${casesResult.recordset.length} cases`);
    if (casesResult.recordset.length > 0) {
      console.log('Eerste case:', casesResult.recordset[0]);
    }

    // Test query: haal trends op
    console.log('\n📊 Trends ophalen...');
    const trendsResult = await pool.request().query('SELECT * FROM Trends');
    console.log(`Gevonden: ${trendsResult.recordset.length} trends`);
    if (trendsResult.recordset.length > 0) {
      console.log('Eerste trend:', trendsResult.recordset[0]);
    }

    // Test query: haal nieuws op
    console.log('\n📊 Nieuws ophalen...');
    const nieuwsResult = await pool.request().query('SELECT * FROM Nieuws');
    console.log(`Gevonden: ${nieuwsResult.recordset.length} nieuwsitems`);
    if (nieuwsResult.recordset.length > 0) {
      console.log('Eerste nieuwsitem:', nieuwsResult.recordset[0]);
    }

    await pool.close();
    console.log('\n✅ Test voltooid!');
    
  } catch (err) {
    console.error('❌ Fout bij verbinding:', err);
    process.exit(1);
  }
}

testConnection();
