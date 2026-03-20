import 'dotenv/config';
import sql from 'mssql';

async function addCategorieColumn() {
  let pool: sql.ConnectionPool | null = null;
  
  try {
    console.log('🔧 Adding categorie column to KennisItems table...');
    
    // Create config using process.env
    const config: sql.config = {
      server: process.env.AZURE_SQL_SERVER || 'dashboardbs.database.windows.net',
      database: process.env.AZURE_SQL_DATABASE || 'dashboarddb',
      user: process.env.AZURE_SQL_USER || 'databasedashboard',
      password: process.env.AZURE_SQL_PASSWORD!,
      options: {
        encrypt: true,
        trustServerCertificate: false,
        connectTimeout: 30000,
        requestTimeout: 30000,
      }
    };
    
    console.log('🔌 Connecting to database...');
    console.log('Server:', config.server);
    console.log('Database:', config.database);
    console.log('User:', config.user);
    
    pool = await sql.connect(config);
    console.log('✅ Database connected successfully');
    
    // Check if column exists
    const checkResult = await pool.request().query(`
      SELECT COUNT(*) as count
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'KennisItems' AND COLUMN_NAME = 'categorie'
    `);
    
    if (checkResult.recordset[0].count > 0) {
      console.log('✅ Column "categorie" already exists');
    } else {
      // Add the column
      await pool.request().query(`
        ALTER TABLE KennisItems
        ADD categorie NVARCHAR(100) NULL
      `);
      
      console.log('✅ Successfully added categorie column');
    }
    
    // Update existing records to set categorie based on type
    const updateResult = await pool.request().query(`
      UPDATE KennisItems
      SET categorie = type
      WHERE categorie IS NULL
    `);
    
    console.log(`✅ Updated ${updateResult.rowsAffected[0]} existing records with default categorie values`);
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    if (pool) {
      await pool.close();
      console.log('🔌 Database connection closed');
    }
  }
}

addCategorieColumn()
  .then(() => {
    console.log('✅ Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  });

