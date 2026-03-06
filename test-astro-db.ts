import sql from 'mssql';

// Dezelfde config als in azure-db.ts
const config: sql.config = {
  server: 'dashboardbs.database.windows.net',
  database: 'dashboarddb',
  user: 'databasedashboard',
  password: 'Knolpower05!',
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

async function testAstroDbConnection() {
  try {
    console.log('🔌 Testen Astro DB verbinding...');
    console.log(`Server: ${config.server}`);
    console.log(`Database: ${config.database}`);
    
    const pool = await sql.connect(config);
    console.log('✅ Verbinding succesvol!\n');

    // Test kennisitems
    console.log('📊 Test kennisitems...');
    const kennisResult = await pool.request().query('SELECT TOP 3 * FROM KennisItems ORDER BY datum_toegevoegd DESC');
    console.log(`✅ ${kennisResult.recordset.length} kennisitems opgehaald`);
    kennisResult.recordset.forEach((item: any) => {
      console.log(`  - ${item.titel} (${item.type})`);
    });

    // Test cases
    console.log('\n📊 Test cases...');
    const casesResult = await pool.request().query('SELECT * FROM Cases ORDER BY datum_toegevoegd DESC');
    console.log(`✅ ${casesResult.recordset.length} cases opgehaald`);
    casesResult.recordset.forEach((item: any) => {
      console.log(`  - ${item.titel} voor ${item.klant}`);
    });

    // Test trends
    console.log('\n📊 Test trends...');
    const trendsResult = await pool.request().query('SELECT TOP 3 * FROM Trends ORDER BY datum_toegevoegd DESC');
    console.log(`✅ ${trendsResult.recordset.length} trends opgehaald`);
    trendsResult.recordset.forEach((item: any) => {
      console.log(`  - ${item.titel} (${item.relevantie})`);
    });

    // Test nieuws
    console.log('\n📊 Test nieuws...');
    const nieuwsResult = await pool.request().query('SELECT TOP 3 * FROM Nieuws ORDER BY datum DESC');
    console.log(`✅ ${nieuwsResult.recordset.length} nieuwsitems opgehaald`);
    nieuwsResult.recordset.forEach((item: any) => {
      console.log(`  - ${item.titel} (${item.categorie})`);
    });

    await pool.close();
    console.log('\n✅ Alle tests geslaagd! Database is klaar voor gebruik in Astro.');
    
  } catch (err) {
    console.error('❌ Fout:', err);
    process.exit(1);
  }
}

testAstroDbConnection();
