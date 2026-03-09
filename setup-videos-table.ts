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

async function setupVideosTable() {
  let pool: sql.ConnectionPool | null = null;
  
  try {
    console.log('Verbinden met Azure SQL Database...');
    pool = await sql.connect(config);
    console.log('✅ Verbonden!');

    // Check if table exists
    console.log('\nControleren of videos tabel al bestaat...');
    const checkTable = await pool.request().query(`
      SELECT COUNT(*) as count 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_NAME = 'videos'
    `);

    if (checkTable.recordset[0].count > 0) {
      console.log('⚠️  Videos tabel bestaat al. Overslaan...');
      return;
    }

    // Create table
    console.log('\n📦 Videos tabel aanmaken...');
    await pool.request().query(`
      CREATE TABLE videos (
          id INT IDENTITY(1,1) PRIMARY KEY,
          titel NVARCHAR(500) NOT NULL,
          beschrijving NVARCHAR(MAX),
          youtube_url NVARCHAR(500) NOT NULL,
          thumbnail_url NVARCHAR(500),
          categorie NVARCHAR(200) NOT NULL,
          tags NVARCHAR(MAX),
          eigenaar NVARCHAR(200),
          datum_toegevoegd DATETIME2 DEFAULT GETDATE(),
          laatst_bijgewerkt DATETIME2 DEFAULT GETDATE(),
          views INT DEFAULT 0,
          featured BIT DEFAULT 0
      );
    `);
    console.log('✅ Videos tabel succesvol aangemaakt!');

    // Create indices
    console.log('\n📑 Indices aanmaken...');
    await pool.request().query(`CREATE INDEX idx_videos_categorie ON videos(categorie);`);
    await pool.request().query(`CREATE INDEX idx_videos_featured ON videos(featured);`);
    await pool.request().query(`CREATE INDEX idx_videos_datum ON videos(datum_toegevoegd);`);
    console.log('✅ Indices succesvol aangemaakt!');

    // Create trigger
    console.log('\n⚡ Trigger aanmaken...');
    await pool.request().query(`
      CREATE TRIGGER trg_videos_update
      ON videos
      AFTER UPDATE
      AS
      BEGIN
          SET NOCOUNT ON;
          UPDATE videos
          SET laatst_bijgewerkt = GETDATE()
          FROM videos v
          INNER JOIN inserted i ON v.id = i.id;
      END;
    `);
    console.log('✅ Trigger succesvol aangemaakt!');

    // Insert seed data
    console.log('\n🌱 Seed data toevoegen...');
    const seedData = [
      {
        titel: 'Webflow CMS: Je eerste collectie maken',
        beschrijving: 'Leer hoe je een CMS collectie aanmaakt in Webflow en velden toevoegt voor dynamische content.',
        youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        categorie: 'CMS Instructies',
        tags: 'webflow,cms,collectie,beginners',
        eigenaar: 'Rick',
        featured: true
      },
      {
        titel: 'SEO Basics: Meta Descriptions Optimaliseren',
        beschrijving: 'Korte uitleg over hoe je effectieve meta descriptions schrijft voor betere zoekresultaten.',
        youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        categorie: 'SEO & Analytics',
        tags: 'seo,meta,google,optimalisatie',
        eigenaar: 'Rosanne',
        featured: true
      },
      {
        titel: 'Website Backup: Hoe maak je een backup in Webflow',
        beschrijving: 'Stap-voor-stap uitleg voor het maken van een volledige backup van je Webflow site.',
        youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        categorie: 'Website Beheer',
        tags: 'backup,webflow,beheer,veiligheid',
        eigenaar: 'Coen',
        featured: false
      },
      {
        titel: 'E-commerce: Producten toevoegen aan je webshop',
        beschrijving: 'Leer hoe je producten toevoegt, prijzen instelt en voorraad beheert in je Webflow e-commerce site.',
        youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        categorie: 'E-commerce',
        tags: 'webshop,producten,e-commerce,verkoop',
        eigenaar: 'Rick',
        featured: true
      },
      {
        titel: 'Google Analytics Koppelen: Complete Setup',
        beschrijving: 'Volledige handleiding voor het koppelen van Google Analytics aan je website.',
        youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        categorie: 'SEO & Analytics',
        tags: 'analytics,google,tracking,data',
        eigenaar: 'Rosanne',
        featured: false
      },
      {
        titel: 'Formulieren Beheren: E-mails en Notificaties',
        beschrijving: 'Hoe stel je formulieren in en configureer je e-mail notificaties bij inzendingen.',
        youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        categorie: 'Website Beheer',
        tags: 'formulieren,email,notificaties,contact',
        eigenaar: 'Kevin',
        featured: false
      }
    ];

    for (const video of seedData) {
      await pool.request()
        .input('titel', sql.NVarChar, video.titel)
        .input('beschrijving', sql.NVarChar, video.beschrijving)
        .input('youtube_url', sql.NVarChar, video.youtube_url)
        .input('thumbnail_url', sql.NVarChar, video.thumbnail_url)
        .input('categorie', sql.NVarChar, video.categorie)
        .input('tags', sql.NVarChar, video.tags)
        .input('eigenaar', sql.NVarChar, video.eigenaar)
        .input('featured', sql.Bit, video.featured)
        .query(`
          INSERT INTO videos (titel, beschrijving, youtube_url, thumbnail_url, categorie, tags, eigenaar, featured)
          VALUES (@titel, @beschrijving, @youtube_url, @thumbnail_url, @categorie, @tags, @eigenaar, @featured)
        `);
    }
    console.log('✅ Seed data succesvol toegevoegd!');

    // Verify
    console.log('\n🔍 Verifiëren...');
    const result = await pool.request().query('SELECT COUNT(*) as count FROM videos');
    console.log(`✅ Aantal video's in database: ${result.recordset[0].count}`);

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    if (pool) {
      await pool.close();
      console.log('\n✅ Database verbinding gesloten');
    }
  }
}

setupVideosTable()
  .then(() => {
    console.log('\n✨ Videos tabel setup compleet!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Setup mislukt:', error);
    process.exit(1);
  });
