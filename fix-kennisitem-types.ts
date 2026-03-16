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
  },
};

async function fixKennisItemTypes() {
  let pool: sql.ConnectionPool | null = null;

  try {
    console.log('🔌 Connecting to Azure SQL Database...');
    pool = await sql.connect(config);
    console.log('✅ Connected successfully');

    // Get all items with lowercase types
    console.log('\n📊 Checking current types...');
    const result = await pool.request().query(`
      SELECT id, titel, type 
      FROM KennisItems 
      WHERE type IS NOT NULL
      ORDER BY type
    `);

    console.log(`Found ${result.recordset.length} kennisitems total`);
    
    // Show current types
    const typeCount: { [key: string]: number } = {};
    result.recordset.forEach(item => {
      typeCount[item.type] = (typeCount[item.type] || 0) + 1;
    });
    
    console.log('\nCurrent type distribution:');
    Object.entries(typeCount).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });

    // Update types to have proper capitalization
    console.log('\n🔄 Updating types to proper capitalization...\n');

    const typeMapping: { [key: string]: string } = {
      'artikel': 'Artikel',
      'video': 'Video',
      'presentatie': 'Presentatie',
      'document': 'Document',
      'checklist': 'Checklist',
      'template': 'Template',
      'whitepaper': 'Whitepaper',
      // Also handle already capitalized versions (no change needed)
      'Artikel': 'Artikel',
      'Video': 'Video',
      'Presentatie': 'Presentatie',
      'Document': 'Document',
      'Checklist': 'Checklist',
      'Template': 'Template',
      'Whitepaper': 'Whitepaper',
    };

    let updatedCount = 0;

    for (const [oldType, newType] of Object.entries(typeMapping)) {
      if (oldType === newType) continue; // Skip if already capitalized
      
      const updateResult = await pool.request()
        .input('oldType', sql.NVarChar, oldType)
        .input('newType', sql.NVarChar, newType)
        .query(`
          UPDATE KennisItems 
          SET type = @newType,
              laatst_bijgewerkt = GETDATE()
          WHERE type = @oldType
        `);

      if (updateResult.rowsAffected[0] > 0) {
        console.log(`✅ Updated ${updateResult.rowsAffected[0]} item(s) from '${oldType}' to '${newType}'`);
        updatedCount += updateResult.rowsAffected[0];
      }
    }

    // Show updated results
    console.log('\n📊 Checking updated types...');
    const finalResult = await pool.request().query(`
      SELECT id, titel, type 
      FROM KennisItems 
      WHERE type IS NOT NULL
      ORDER BY type
    `);

    const finalTypeCount: { [key: string]: number } = {};
    finalResult.recordset.forEach(item => {
      finalTypeCount[item.type] = (finalTypeCount[item.type] || 0) + 1;
    });
    
    console.log('\nFinal type distribution:');
    Object.entries(finalTypeCount).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });

    console.log(`\n✅ Successfully updated ${updatedCount} kennisitem types!`);

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    if (pool) {
      await pool.close();
      console.log('\n🔌 Database connection closed');
    }
  }
}

fixKennisItemTypes()
  .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
