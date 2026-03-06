import sql from 'mssql';

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

async function checkNews() {
  try {
    await sql.connect(config);
    console.log('✅ Connected to database');
    
    const result = await sql.query`SELECT * FROM Nieuws`;
    console.log('\n📰 Nieuws items in database:');
    console.log(JSON.stringify(result.recordset, null, 2));
    
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await sql.close();
  }
}

checkNews();
