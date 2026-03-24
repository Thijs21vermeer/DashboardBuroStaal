
import 'dotenv/config';
import sql from 'mssql';

const config = {
  server: process.env.AZURE_SQL_SERVER!,
  database: process.env.AZURE_SQL_DATABASE!,
  user: process.env.AZURE_SQL_USER!,
  password: process.env.AZURE_SQL_PASSWORD!,
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

async function updateCategories() {
  try {
    console.log('Connecting to database...');
    await sql.connect(config);
    
    console.log('Updating categorie column to proper thematic categories...');
    
    // Update based on tags and content to assign proper categories
    const updates = [
      {
        query: `UPDATE KennisItems SET categorie = 'SEO & Online Marketing' 
                WHERE tags LIKE '%SEO%' OR tags LIKE '%marketing%' OR tags LIKE '%Google%'`,
        category: 'SEO & Online Marketing'
      },
      {
        query: `UPDATE KennisItems SET categorie = 'Webdesign & Development' 
                WHERE tags LIKE '%design%' OR tags LIKE '%website%' OR tags LIKE '%development%'`,
        category: 'Webdesign & Development'
      },
      {
        query: `UPDATE KennisItems SET categorie = 'Branding & Communicatie' 
                WHERE tags LIKE '%branding%' OR tags LIKE '%communicatie%' OR tags LIKE '%content%'`,
        category: 'Branding & Communicatie'
      },
      {
        query: `UPDATE KennisItems SET categorie = 'Social Media' 
                WHERE tags LIKE '%social%' OR tags LIKE '%LinkedIn%' OR tags LIKE '%Instagram%'`,
        category: 'Social Media'
      },
      {
        query: `UPDATE KennisItems SET categorie = 'Analytics & Data' 
                WHERE tags LIKE '%analytics%' OR tags LIKE '%data%' OR tags LIKE '%tracking%'`,
        category: 'Analytics & Data'
      }
    ];

    for (const update of updates) {
      const result = await sql.query(update.query);
      console.log(`✅ Updated ${result.rowsAffected[0]} items to category: ${update.category}`);
    }
    
    // Set default category for items that don't match any category
    const defaultResult = await sql.query(`
      UPDATE KennisItems 
      SET categorie = 'Algemeen' 
      WHERE categorie IN ('artikel', 'video', 'presentatie', 'Artikel', 'Video')
    `);
    console.log(`✅ Set ${defaultResult.rowsAffected[0]} remaining items to 'Algemeen'`);
    
    console.log('\n✅ Categories updated successfully!');
    
    // Show current distribution
    const distribution = await sql.query(`
      SELECT categorie, COUNT(*) as count 
      FROM KennisItems 
      GROUP BY categorie 
      ORDER BY count DESC
    `);
    
    console.log('\nCategory distribution:');
    distribution.recordset.forEach(row => {
      console.log(`  ${row.categorie}: ${row.count} items`);
    });
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await sql.close();
    // Close the global connection pool
    await (sql as any).globalPool?.close();
  }
}

updateCategories();

