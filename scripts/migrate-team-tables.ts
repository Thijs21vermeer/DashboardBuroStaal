import sql from 'mssql';

const config = {
  server: process.env.AZURE_SQL_SERVER || 'dashboardbs.database.windows.net',
  database: process.env.AZURE_SQL_DATABASE || 'dashboarddb',
  user: process.env.AZURE_SQL_USER || 'databasedashboard',
  password: process.env.AZURE_SQL_PASSWORD || 'Knolpower05!',
  port: parseInt(process.env.AZURE_SQL_PORT || '1433'),
  options: {
    encrypt: true,
    trustServerCertificate: false,
    enableArithAbort: true,
    connectTimeout: 30000,
    requestTimeout: 30000,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

async function runMigration() {
  let pool: sql.ConnectionPool | null = null;
  
  try {
    console.log('🔄 Verbinden met Azure SQL Database...');
    pool = await sql.connect(config);
    console.log('✅ Verbonden met database');

    // Check if tables already exist
    const checkTeam = await pool.request().query(`
      SELECT COUNT(*) as count 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_NAME = 'team_members'
    `);

    const checkPartners = await pool.request().query(`
      SELECT COUNT(*) as count 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_NAME = 'externe_partners'
    `);

    if (checkTeam.recordset[0].count > 0) {
      console.log('ℹ️  team_members tabel bestaat al, wordt overgeslagen');
    } else {
      console.log('📦 Aanmaken team_members tabel...');
      await pool.request().query(`
        CREATE TABLE team_members (
          id INT IDENTITY(1,1) PRIMARY KEY,
          naam NVARCHAR(100) NOT NULL,
          rol NVARCHAR(100) NOT NULL,
          email NVARCHAR(255) NOT NULL,
          bio NVARCHAR(MAX),
          expertise_gebieden NVARCHAR(MAX),
          is_eigenaar BIT DEFAULT 0,
          volgorde INT DEFAULT 0,
          created_at DATETIME2 DEFAULT GETDATE(),
          updated_at DATETIME2 DEFAULT GETDATE()
        )
      `);
      console.log('✅ team_members tabel aangemaakt');

      console.log('📝 Toevoegen team members...');
      await pool.request().query(`
        INSERT INTO team_members (naam, rol, email, bio, expertise_gebieden, is_eigenaar, volgorde) VALUES
        ('Rosanne', 'Eigenaar & Strategisch/Marketing', 'rosanne@burostaal.nl', 'Rosanne is medeoprichter van Buro Staal en leidt de strategische richting en marketing van het bedrijf. Met jaren ervaring in digitale marketing helpt zij bedrijven hun online aanwezigheid te versterken.', '["Strategie", "Marketing", "Business Development", "Klantrelaties"]', 1, 1),
        ('Annemieke', 'Eigenaar & Financieel Beheer', 'annemieke@burostaal.nl', 'Annemieke is medeoprichter van Buro Staal en zorgt voor het financiële beheer en de bedrijfsvoering. Haar focus ligt op duurzame groei en efficiënte processen.', '["Financiën", "Bedrijfsvoering", "Procesoptimalisatie", "HR"]', 1, 2),
        ('Kevin', 'Design Lead', 'kevin@burostaal.nl', 'Kevin leidt het designteam en zorgt voor visueel aantrekkelijke websites en applicaties die gebruiksvriendelijk en on-brand zijn.', '["UX/UI Design", "Webdesign", "Branding", "Grafisch ontwerp"]', 0, 3),
        ('Rick', 'Lead Developer', 'rick@burostaal.nl', 'Rick is onze lead developer en bouwt robuuste webapplicaties met moderne technologieën. Hij zorgt voor technische excellentie in elk project.', '["Full-stack Development", "React", "Node.js", "API Development"]', 0, 4),
        ('Coen', 'Support & Tech', 'coen@burostaal.nl', 'Coen ondersteunt onze klanten met technische vragen en zorgt ervoor dat alle systemen soepel blijven draaien.', '["Technical Support", "DevOps", "Onderhoud", "Troubleshooting"]', 0, 5)
      `);
      console.log('✅ Team members toegevoegd');
    }

    if (checkPartners.recordset[0].count > 0) {
      console.log('ℹ️  externe_partners tabel bestaat al, wordt overgeslagen');
    } else {
      console.log('📦 Aanmaken externe_partners tabel...');
      await pool.request().query(`
        CREATE TABLE externe_partners (
          id INT IDENTITY(1,1) PRIMARY KEY,
          naam NVARCHAR(100) NOT NULL,
          bedrijf NVARCHAR(200),
          specialisatie NVARCHAR(200) NOT NULL,
          email NVARCHAR(255) NOT NULL,
          telefoon NVARCHAR(50),
          website NVARCHAR(255),
          beschrijving NVARCHAR(MAX),
          expertise_gebieden NVARCHAR(MAX),
          volgorde INT DEFAULT 0,
          created_at DATETIME2 DEFAULT GETDATE(),
          updated_at DATETIME2 DEFAULT GETDATE()
        )
      `);
      console.log('✅ externe_partners tabel aangemaakt');

      console.log('📝 Toevoegen externe partners...');
      await pool.request().query(`
        INSERT INTO externe_partners (naam, bedrijf, specialisatie, email, telefoon, website, beschrijving, expertise_gebieden, volgorde) VALUES
        ('Jan de Vries', 'ContentPro', 'Copywriting & SEO Content', 'jan@contentpro.nl', '06-12345678', 'contentpro.nl', 'Jan schrijft overtuigende SEO-geoptimaliseerde content die bezoekers converteert naar klanten.', '["SEO Copywriting", "Content Marketing", "Blog Writing"]', 1),
        ('Sarah Johnson', 'Digital Boost', 'SEA & Google Ads', 'sarah@digitalboost.nl', '06-23456789', 'digitalboost.nl', 'Sarah is expert in Google Ads en zorgt voor effectieve advertentiecampagnes met hoge ROI.', '["Google Ads", "SEA", "PPC Campaigns", "Analytics"]', 2),
        ('Mark Peters', 'Video Vision', 'Videoproductie', 'mark@videovision.nl', '06-34567890', 'videovision.nl', 'Mark produceert professionele bedrijfsvideo''s en promotiemateriaal die je merk naar een hoger niveau tillen.', '["Videoproductie", "Editing", "Motion Graphics"]', 3),
        ('Lisa van der Berg', 'FotoFocus', 'Fotografie', 'lisa@fotofocus.nl', '06-45678901', 'fotofocus.nl', 'Lisa maakt hoogwaardige bedrijfsfoto''s en productfotografie voor websites en marketingmateriaal.', '["Bedrijfsfotografie", "Productfotografie", "Portretfotografie"]', 4),
        ('Tom Bakker', 'Automation Pro', 'CRM & Marketing Automation', 'tom@automationpro.nl', '06-56789012', 'automationpro.nl', 'Tom implementeert CRM-systemen en marketing automation die bedrijfsprocessen stroomlijnen.', '["CRM", "Marketing Automation", "HubSpot", "ActiveCampaign"]', 5)
      `);
      console.log('✅ Externe partners toegevoegd');
    }

    // Verify data
    const teamCount = await pool.request().query('SELECT COUNT(*) as count FROM team_members');
    const partnersCount = await pool.request().query('SELECT COUNT(*) as count FROM externe_partners');

    console.log('\n📊 Database status:');
    console.log(`   Team members: ${teamCount.recordset[0].count}`);
    console.log(`   Externe partners: ${partnersCount.recordset[0].count}`);
    console.log('\n✅ Team & Partners migratie succesvol afgerond!');

  } catch (error) {
    console.error('❌ Fout tijdens migratie:', error);
    throw error;
  } finally {
    if (pool) {
      await pool.close();
      console.log('🔌 Database verbinding gesloten');
    }
  }
}

runMigration().catch(console.error);

