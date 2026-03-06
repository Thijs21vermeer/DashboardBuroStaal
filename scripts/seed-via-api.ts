// Script om seed data via API endpoints toe te voegen
import { baseUrl } from '../src/lib/base-url';

const API_BASE = 'http://localhost:3000';

const kennisitems = [
  {
    titel: 'Optimalisatie van productieprocessen',
    type: 'artikel',
    tags: ['productie', 'automatisering', 'efficiency'],
    gekoppeld_project: 'Project Alpha',
    eigenaar: 'Rick',
    samenvatting: 'Ontdek hoe moderne automatisering kan leiden tot 30% efficiëntieverbetering.',
    inhoud: 'Volledige inhoud over optimalisatie...',
    media_type: 'artikel',
    media_url: '',
    views: 245,
    featured: true
  },
  {
    titel: 'Digital Marketing voor B2B Maakindustrie',
    type: 'presentatie',
    tags: ['marketing', 'B2B', 'strategie'],
    gekoppeld_project: '',
    eigenaar: 'Rosanne',
    samenvatting: 'Een complete gids voor effectieve digital marketing in de maakindustrie.',
    inhoud: 'Presentatie content...',
    media_type: 'presentatie',
    media_url: '',
    views: 189,
    featured: true
  },
  {
    titel: 'Website Performance Optimization',
    type: 'video',
    tags: ['development', 'performance', 'UX'],
    gekoppeld_project: 'Project Beta',
    eigenaar: 'Kevin',
    samenvatting: 'Leer hoe je de laadtijd van een website met 50% kunt verbeteren.',
    inhoud: 'Video tutorial...',
    media_type: 'video',
    media_url: 'https://example.com/video',
    views: 167,
    featured: true
  },
  {
    titel: 'SEO Best Practices 2026',
    type: 'artikel',
    tags: ['SEO', 'marketing', 'content'],
    gekoppeld_project: '',
    eigenaar: 'Rosanne',
    samenvatting: 'De nieuwste SEO strategieën en technieken voor 2026.',
    inhoud: 'Artikel inhoud over SEO...',
    media_type: 'artikel',
    media_url: '',
    views: 312,
    featured: false
  },
  {
    titel: 'React 19 Nieuwe Features',
    type: 'artikel',
    tags: ['development', 'React', 'frontend'],
    gekoppeld_project: '',
    eigenaar: 'Rick',
    samenvatting: 'Ontdek de nieuwe features en verbeteringen in React 19.',
    inhoud: 'Technische details over React 19...',
    media_type: 'artikel',
    media_url: '',
    views: 98,
    featured: false
  }
];

const cases = [
  {
    titel: 'Website Redesign Metaalbewerking XYZ',
    klant: 'MetaalWerk BV',
    industrie: 'Metaalbewerking',
    uitdaging: 'Verouderde website met slechte gebruikerservaring en lage conversie.',
    oplossing: 'Volledig nieuwe website met moderne UX, responsive design en verbeterde SEO.',
    resultaten: ['50% meer conversies', '40% langere sessies', 'Top 3 ranking voor belangrijkste zoektermen'],
    tags: ['website', 'redesign', 'B2B'],
    eigenaar: 'Kevin',
    project_duur: '4 maanden',
    team_size: '4',
    featured: true,
    image_url: ''
  },
  {
    titel: 'E-commerce Platform voor Industriële Onderdelen',
    klant: 'TechParts NL',
    industrie: 'Industrie',
    uitdaging: 'Geen online verkoop mogelijkheid, klanten moesten bellen voor bestellingen.',
    oplossing: 'Custom e-commerce platform met product configurator en B2B prijsstructuur.',
    resultaten: ['200% omzetgroei online', '60% minder telefonische orders', '24/7 bestelmogelijkheid'],
    tags: ['e-commerce', 'B2B', 'webshop'],
    eigenaar: 'Rick',
    project_duur: '6 maanden',
    team_size: '5',
    featured: true,
    image_url: ''
  },
  {
    titel: 'Marketing Campagne Automatisering',
    klant: 'PrecisieTech',
    industrie: 'Precisie-engineering',
    uitdaging: 'Handmatige marketing processen, geen lead tracking.',
    oplossing: 'Implementatie van marketing automation met CRM integratie en lead scoring.',
    resultaten: ['150% meer gekwalificeerde leads', '70% tijdsbesparing marketing team', 'Verhoogde ROI van 180%'],
    tags: ['marketing', 'automation', 'CRM'],
    eigenaar: 'Rosanne',
    project_duur: '3 maanden',
    team_size: '3',
    featured: true,
    image_url: ''
  }
];

const trends = [
  {
    titel: 'AI in de Maakindustrie',
    categorie: 'Technologie',
    beschrijving: 'Kunstmatige intelligentie transformeert de manier waarop we produceren, van voorspellend onderhoud tot kwaliteitscontrole.',
    relevantie: 'Hoog',
    impact: 'Bedrijven die AI implementeren zien gemiddeld 25% efficiency verbetering en 30% minder uitval.',
    bronnen: ['McKinsey Industry 4.0 Report', 'MIT Technology Review'],
    tags: ['AI', 'automatisering', 'industrie 4.0'],
    featured: true
  },
  {
    titel: 'Duurzaamheid als Concurrentievoordeel',
    categorie: 'Duurzaamheid',
    beschrijving: 'Steeds meer B2B klanten eisen duurzame productieprocessen van hun leveranciers.',
    relevantie: 'Hoog',
    impact: '70% van B2B beslissers geeft aan dat duurzaamheid een belangrijke factor is bij leveranciersselectie.',
    bronnen: ['Gartner B2B Research', 'Sustainability Report 2026'],
    tags: ['duurzaamheid', 'ESG', 'B2B'],
    featured: true
  },
  {
    titel: 'Personalisatie in B2B Marketing',
    categorie: 'Marketing',
    beschrijving: 'B2B kopers verwachten steeds meer gepersonaliseerde experiences, vergelijkbaar met B2C.',
    relevantie: 'Middel',
    impact: 'Gepersonaliseerde content leidt tot 50% hogere engagement en 40% meer conversies.',
    bronnen: ['HubSpot State of Marketing', 'Forrester B2B Report'],
    tags: ['marketing', 'personalisatie', 'CX'],
    featured: false
  }
];

const nieuws = [
  {
    titel: 'Nieuw Project: Innovatieve Website voor TechPartners',
    categorie: 'Project Lancering',
    inhoud: 'We zijn gestart met een spannend nieuw project voor TechPartners, een innovatieve website met geavanceerde product configurator.',
    auteur: 'Rosanne',
    featured: true,
    tags: ['project', 'website', 'B2B']
  },
  {
    titel: 'Rick behaalt React Advanced Certificering',
    categorie: 'Team Update',
    inhoud: 'Gefeliciteerd aan Rick die zijn React Advanced certificering heeft behaald! Dit versterkt onze frontend development expertise.',
    auteur: 'Annemieke',
    featured: true,
    tags: ['team', 'training', 'development']
  },
  {
    titel: 'Q1 2026 Resultaten: 40% Groei',
    categorie: 'Bedrijfsnieuws',
    inhoud: 'We kijken terug op een fantastisch eerste kwartaal met 40% omzetgroei en 5 nieuwe klanten in de maakindustrie.',
    auteur: 'Annemieke',
    featured: true,
    tags: ['resultaten', 'groei', 'mijlpaal']
  },
  {
    titel: 'Nieuwe Partnership met AI Solutions',
    categorie: 'Bedrijfsnieuws',
    inhoud: 'Buro Staal gaat samenwerking aan met AI Solutions om onze klanten te helpen met AI-implementatie in hun marketing en websites.',
    auteur: 'Rosanne',
    featured: false,
    tags: ['partnership', 'AI', 'innovatie']
  },
  {
    titel: 'Team Uitje: Escape Room Challenge',
    categorie: 'Team Update',
    inhoud: 'Het hele team heeft genoten van een leuke middag tijdens de Escape Room Challenge. Goede teambuilding en veel gelachen!',
    auteur: 'Kevin',
    featured: false,
    tags: ['team', 'fun', 'teambuilding']
  }
];

async function seedData() {
  console.log('🌱 Starting seed process...\n');

  // Seed Kennisitems
  console.log('📚 Adding Kennisitems...');
  for (const item of kennisitems) {
    try {
      const response = await fetch(`${API_BASE}/api/kennisitems`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (response.ok) {
        console.log(`  ✅ ${item.titel}`);
      } else {
        console.log(`  ❌ ${item.titel} - ${response.statusText}`);
      }
    } catch (error) {
      console.log(`  ❌ ${item.titel} - ${error}`);
    }
  }

  // Seed Cases
  console.log('\n📊 Adding Cases...');
  for (const item of cases) {
    try {
      const response = await fetch(`${API_BASE}/api/cases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (response.ok) {
        console.log(`  ✅ ${item.titel}`);
      } else {
        console.log(`  ❌ ${item.titel} - ${response.statusText}`);
      }
    } catch (error) {
      console.log(`  ❌ ${item.titel} - ${error}`);
    }
  }

  // Seed Trends
  console.log('\n📈 Adding Trends...');
  for (const item of trends) {
    try {
      const response = await fetch(`${API_BASE}/api/trends`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (response.ok) {
        console.log(`  ✅ ${item.titel}`);
      } else {
        console.log(`  ❌ ${item.titel} - ${response.statusText}`);
      }
    } catch (error) {
      console.log(`  ❌ ${item.titel} - ${error}`);
    }
  }

  // Seed Nieuws
  console.log('\n📰 Adding Nieuws...');
  for (const item of nieuws) {
    try {
      const response = await fetch(`${API_BASE}/api/nieuws`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (response.ok) {
        console.log(`  ✅ ${item.titel}`);
      } else {
        console.log(`  ❌ ${item.titel} - ${response.statusText}`);
      }
    } catch (error) {
      console.log(`  ❌ ${item.titel} - ${error}`);
    }
  }

  console.log('\n✨ Seed process completed!');
}

seedData();
