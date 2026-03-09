import sql from 'mssql';
import * as dotenv from 'dotenv';

dotenv.config();

const config: sql.config = {
  server: process.env.AZURE_SQL_SERVER || '',
  database: process.env.AZURE_SQL_DATABASE || '',
  user: process.env.AZURE_SQL_USER || '',
  password: process.env.AZURE_SQL_PASSWORD || '',
  options: {
    encrypt: true,
    trustServerCertificate: false,
    connectTimeout: 30000,
    requestTimeout: 30000
  }
};

async function testVideos() {
  let pool: sql.ConnectionPool | null = null;
  
  try {
    console.log('Verbinden...');
    pool = await sql.connect(config);
    
    console.log('Videos ophalen...');
    const result = await pool.request().query('SELECT * FROM videos ORDER BY datum_toegevoegd DESC');
    
    console.log(`✅ ${result.recordset.length} video's gevonden:`);
    result.recordset.forEach(video => {
      console.log(`  - ${video.titel} (${video.categorie})`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (pool) await pool.close();
  }
}

testVideos();
