import './src/lib/load-env.cjs';
import { getPool } from './src/lib/db-config';

async function testConnection() {
  console.log('🔍 Testing database connection...\n');
  
  console.log('Configuration:');
  console.log('- Server:', process.env.AZURE_SQL_SERVER);
  console.log('- Database:', process.env.AZURE_SQL_DATABASE);
  console.log('- User:', process.env.AZURE_SQL_USER);
  console.log('- Port:', process.env.AZURE_SQL_PORT);
  console.log('- Password:', process.env.AZURE_SQL_PASSWORD ? '***SET***' : '***NOT SET***');
  console.log('');
  
  try {
    console.log('📡 Attempting to connect...');
    const pool = await getPool();
    console.log('✅ Connection pool created');
    
    console.log('📊 Running test query...');
    const result = await pool.request().query('SELECT 1 AS test, GETDATE() AS currentTime');
    console.log('✅ Test query successful!');
    console.log('Result:', result.recordset[0]);
    console.log('');
    
    console.log('🎉 Database connection is working perfectly!');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Database connection failed!');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    console.error('');
    
    if (error.code === 'ELOGIN') {
      console.error('💡 This is a login error. Please check:');
      console.error('   - Username and password are correct');
      console.error('   - User has access to the database');
      console.error('   - Firewall rules allow this connection');
    } else if (error.code === 'ETIMEOUT') {
      console.error('💡 Connection timed out. Please check:');
      console.error('   - Server address is correct');
      console.error('   - Firewall rules allow this IP address');
      console.error('   - Network connectivity');
    } else if (error.code === 'ESOCKET') {
      console.error('💡 Socket error. Please check:');
      console.error('   - Server is online and reachable');
      console.error('   - Port 1433 is not blocked');
    }
    
    process.exit(1);
  }
}

testConnection();
