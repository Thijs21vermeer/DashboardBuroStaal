import { createClient } from '@libsql/client';
import 'dotenv/config';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

const sampleData = {
  kennisItems: [
    {
      titel: 'Azure DevOps Best Practices',
      beschrijving: 'Een complete gids voor het opzetten van CI/CD pipelines in Azure DevOps.',
      categorie: 'DevOps',
      tags: JSON.stringify(['Azure', 'DevOps', 'CI/CD']),
      afbeelding: null
    },
    {
      titel: 'React Hooks Tutorial',
      beschrijving: 'Leer alles over React Hooks en hoe je ze effectief kunt gebruiken.',
      categorie: 'Development',
      tags: JSON.stringify(['React', 'JavaScript', 'Frontend']),
      afbeelding: null
    },
    {
      titel: 'Cloud Security Fundamentals',
      beschrijving: 'Essentiële security principes voor cloud infrastructuur.',
      categorie: 'Security',
      tags: JSON.stringify(['Security', 'Cloud', 'Azure']),
      afbeelding: null
    }
  ],
  
  cases: [
    {
      titel: 'Website Rebranding Project',
      beschrijving: 'Complete rebranding voor een internationale klant.',
      klant: 'TechCorp B.V.',
      resultaat: '50% meer traffic na lancering',
      tags: JSON.stringify(['Branding', 'Web', 'Design']),
      afbeelding: null
    },
    {
      titel: 'E-commerce Platform Migratie',
      beschrijving: 'Migratie van legacy systeem naar moderne e-commerce oplossing.',
      klant: 'RetailGiant',
      resultaat: '30% snellere checkout proces',
      tags: JSON.stringify(['E-commerce', 'Migration', 'Performance']),
      afbeelding: null
    }
  ],
  
  trends: [
    {
      titel: 'AI in Web Development',
      beschrijving: 'De opkomst van AI-geassisteerde development tools.',
      categorie: 'Technology',
      eigenaar: 'Tech Team',
      tags: JSON.stringify(['AI', 'Development', 'Future']),
      afbeelding: null
    },
    {
      titel: 'Sustainable Software Engineering',
      beschrijving: 'Hoe we kunnen bijdragen aan een duurzamere toekomst via software.',
      categorie: 'Sustainability',
      eigenaar: 'Innovation Team',
      tags: JSON.stringify(['Sustainability', 'Green IT']),
      afbeelding: null
    }
  ],
  
  nieuws: [
    {
      titel: 'Nieuwe Kantoor Opening',
      beschrijving: 'We openen een nieuw kantoor in Amsterdam!',
      inhoud: 'Na maanden voorbereiding zijn we trots om onze nieuwe locatie te presenteren...',
      auteur: 'Management',
      tags: JSON.stringify(['Bedrijf', 'Nieuws']),
      afbeelding: null
    }
  ],
  
  tools: [
    {
      naam: 'Figma',
      categorie: 'Design',
      beschrijving: 'Collaborative design tool voor UI/UX designers.',
      link: 'https://figma.com',
      tags: JSON.stringify(['Design', 'Collaboration']),
      afbeelding: null
    },
    {
      naam: 'Visual Studio Code',
      categorie: 'Development',
      beschrijving: 'Krachtige code editor met uitgebreide extensie support.',
      link: 'https://code.visualstudio.com',
      tags: JSON.stringify(['Development', 'IDE']),
      afbeelding: null
    }
  ],
  
  videos: [
    {
      titel: 'Introduction to Azure',
      beschrijving: 'Een beginner-friendly introductie tot Microsoft Azure.',
      videolink: 'https://youtube.com/watch?v=example',
      categorie: 'Cloud',
      tags: JSON.stringify(['Azure', 'Cloud', 'Tutorial']),
      afbeelding: null
    }
  ],
  
  team: [
    {
      naam: 'John Doe',
      functie: 'Senior Developer',
      bio: 'Gepassioneerd over clean code en moderne architectuur.',
      email: 'john@burostaal.nl',
      telefoon: '+31 6 12345678',
      linkedIn: 'https://linkedin.com/in/johndoe',
      specialisaties: JSON.stringify(['React', 'Node.js', 'Azure']),
      afbeelding: null
    },
    {
      naam: 'Jane Smith',
      functie: 'UX Designer',
      bio: 'User-first design thinking specialist.',
      email: 'jane@burostaal.nl',
      telefoon: '+31 6 87654321',
      linkedIn: 'https://linkedin.com/in/janesmith',
      specialisaties: JSON.stringify(['Figma', 'User Research', 'Prototyping']),
      afbeelding: null
    }
  ],
  
  partners: [
    {
      naam: 'Microsoft',
      beschrijving: 'Strategic technology partner.',
      website: 'https://microsoft.com',
      logo: null,
      categorie: 'Technology'
    }
  ]
};

async function seedDatabase() {
  try {
    console.log('🌱 Seeding Turso database...\n');
    
    // KennisItems
    console.log('📚 Seeding KennisItems...');
    for (const item of sampleData.kennisItems) {
      await client.execute({
        sql: `INSERT INTO KennisItems (titel, beschrijving, categorie, tags, afbeelding) 
              VALUES (?, ?, ?, ?, ?)`,
        args: [item.titel, item.beschrijving, item.categorie, item.tags, item.afbeelding]
      });
      console.log(`  ✓ ${item.titel}`);
    }
    
    // Cases
    console.log('\n💼 Seeding Cases...');
    for (const item of sampleData.cases) {
      await client.execute({
        sql: `INSERT INTO Cases (titel, beschrijving, klant, resultaat, tags, afbeelding) 
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [item.titel, item.beschrijving, item.klant, item.resultaat, item.tags, item.afbeelding]
      });
      console.log(`  ✓ ${item.titel}`);
    }
    
    // Trends
    console.log('\n📈 Seeding Trends...');
    for (const item of sampleData.trends) {
      await client.execute({
        sql: `INSERT INTO Trends (titel, beschrijving, categorie, eigenaar, tags, afbeelding) 
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [item.titel, item.beschrijving, item.categorie, item.eigenaar, item.tags, item.afbeelding]
      });
      console.log(`  ✓ ${item.titel}`);
    }
    
    // Nieuws
    console.log('\n📰 Seeding Nieuws...');
    for (const item of sampleData.nieuws) {
      await client.execute({
        sql: `INSERT INTO Nieuws (titel, beschrijving, inhoud, auteur, tags, afbeelding) 
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [item.titel, item.beschrijving, item.inhoud, item.auteur, item.tags, item.afbeelding]
      });
      console.log(`  ✓ ${item.titel}`);
    }
    
    // Tools
    console.log('\n🔧 Seeding Tools...');
    for (const item of sampleData.tools) {
      await client.execute({
        sql: `INSERT INTO Tools (naam, categorie, beschrijving, link, tags, afbeelding) 
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [item.naam, item.categorie, item.beschrijving, item.link, item.tags, item.afbeelding]
      });
      console.log(`  ✓ ${item.naam}`);
    }
    
    // Videos
    console.log('\n🎥 Seeding Videos...');
    for (const item of sampleData.videos) {
      await client.execute({
        sql: `INSERT INTO Videos (titel, beschrijving, videolink, categorie, tags, afbeelding) 
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [item.titel, item.beschrijving, item.videolink, item.categorie, item.tags, item.afbeelding]
      });
      console.log(`  ✓ ${item.titel}`);
    }
    
    // Team
    console.log('\n👥 Seeding Team...');
    for (const item of sampleData.team) {
      await client.execute({
        sql: `INSERT INTO Team (naam, functie, bio, email, telefoon, linkedIn, specialisaties, afbeelding) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [item.naam, item.functie, item.bio, item.email, item.telefoon, item.linkedIn, item.specialisaties, item.afbeelding]
      });
      console.log(`  ✓ ${item.naam}`);
    }
    
    // Partners
    console.log('\n🤝 Seeding Partners...');
    for (const item of sampleData.partners) {
      await client.execute({
        sql: `INSERT INTO Partners (naam, beschrijving, website, logo, categorie) 
              VALUES (?, ?, ?, ?, ?)`,
        args: [item.naam, item.beschrijving, item.website, item.logo, item.categorie]
      });
      console.log(`  ✓ ${item.naam}`);
    }
    
    // Show counts
    console.log('\n📊 Final counts:');
    const tables = ['KennisItems', 'Cases', 'Trends', 'Nieuws', 'Tools', 'Videos', 'Team', 'Partners'];
    for (const table of tables) {
      const result = await client.execute(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`  ${table}: ${result.rows[0].count}`);
    }
    
    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
