import type { KennisItem, CaseStudy, Trend, NewsItem, TeamMember } from '../types';

// Mock data voor de Buro Staal Kennisbank

export const mockKennisItems: KennisItem[] = [
  {
    id: 1,
    titel: 'Effectieve SEO strategieën voor productie bedrijven',
    type: 'Artikel',
    categorie: 'SEO & Online Marketing',
    tags: ['SEO', 'Online Marketing', 'Maakindustrie'],
    gekoppeldProject: 'MetaalWorks Website',
    eigenaar: 'Rosanne',
    auteur: 'Rosanne',
    samenvatting: 'Een complete gids voor het optimaliseren van je website voor zoekmachines in de maakindustrie.',
    inhoud: 'SEO is cruciaal voor zichtbaarheid in de maakindustrie. Deze gids biedt praktische tips voor betere rankings...',
    datumToegevoegd: '2025-01-15',
    laatstBijgewerkt: '2025-02-01',
    views: 342,
    featured: false,
  },
  {
    id: 2,
    titel: 'LinkedIn Advertising Best Practices',
    type: 'Video',
    categorie: 'Social Media',
    tags: ['LinkedIn', 'B2B Marketing', 'Social Media'],
    eigenaar: 'Kevin',
    auteur: 'Kevin',
    samenvatting: 'Leer hoe je effectieve LinkedIn campagnes opzet voor de maakindustrie.',
    inhoud: 'LinkedIn is het belangrijkste platform voor B2B marketing. In deze video leer je...',
    datumToegevoegd: '2025-01-20',
    laatstBijgewerkt: '2025-01-28',
    views: 287,
    featured: false,
  },
  {
    id: 3,
    titel: 'Content Marketing Strategie Template',
    type: 'Template',
    categorie: 'Branding & Communicatie',
    tags: ['Content Marketing', 'Strategie', 'Planning'],
    eigenaar: 'Rosanne',
    auteur: 'Rosanne',
    samenvatting: 'Download ons template voor het opzetten van een effectieve content strategie.',
    inhoud: 'Een complete template met alle elementen voor een succesvolle content marketing strategie...',
    datumToegevoegd: '2025-01-25',
    laatstBijgewerkt: '2025-01-25',
    views: 156,
    featured: false,
  },
];

export const mockCases: CaseStudy[] = [
  {
    id: 1,
    titel: '300% meer leads via digitale strategie',
    klant: 'PrecisieTech BV',
    industrie: 'Metaalbewerking',
    uitdaging: 'PrecisieTech had nauwelijks online zichtbaarheid en miste kansen in de groeiende markt voor hightech metaalbewerking.',
    oplossing: 'Volledige rebranding, nieuwe website met focus op technische expertise, SEO optimalisatie en LinkedIn campagnes.',
    resultaten: [
      '300% toename in gekwalificeerde leads',
      '150% groei in organisch verkeer',
      '40% kortere sales cyclus',
      'Verdubbeling van website conversie ratio',
    ],
    tags: ['Website', 'SEO', 'LinkedIn', 'Rebranding'],
    eigenaar: 'Rosanne',
    datum: '2025-01-10',
    featured: true,
    referenties: [],
  },
  {
    id: 2,
    titel: 'Van onbekend naar thought leader in 12 maanden',
    klant: 'IndustrieGroep Noord',
    industrie: 'Machinebouw',
    uitdaging: 'IndustrieGroep was technisch sterk maar had geen merkbekendheid in de doelmarkt.',
    oplossing: 'Content marketing strategie, LinkedIn thought leadership, webinars en whitepapers over industrie trends.',
    resultaten: [
      '500+ nieuwe LinkedIn volgers (beslissers)',
      '25 nieuwe klanten via content marketing',
      'Uitgenodigd als spreker op 3 vakbeurzen',
      '200% toename in inbound aanvragen',
    ],
    tags: ['Content Marketing', 'Thought Leadership', 'LinkedIn', 'Webinars'],
    eigenaar: 'Kevin',
    datum: '2025-01-28',
    featured: false,
    referenties: [],
  },
];

export const mockTrends: Trend[] = [
  {
    id: 1,
    titel: 'AI-gestuurde personalisatie in B2B marketing',
    categorie: 'Technologie',
    samenvatting: 'AI tools maken het mogelijk om B2B marketing te personaliseren op individueel niveau, vergelijkbaar met B2C.',
    inhoud: 'AI tools maken het mogelijk om B2B marketing te personaliseren op individueel niveau. Bedrijven die AI-personalisatie inzetten zien 30-40% hogere engagement rates.',
    relevantie: 'Hoog',
    bron: 'Gartner, HubSpot Research, LinkedIn Marketing',
    tags: 'AI,Personalisatie,B2B Marketing',
    eigenaar: 'Rosanne',
    datum_gepubliceerd: '2025-02-01',
  },
  {
    id: 2,
    titel: 'Nearshoring als nieuwe norm in maakindustrie',
    categorie: 'Maakindustrie',
    samenvatting: 'Bedrijven verplaatsen productie terug naar Europa voor meer controle en kortere levertijden.',
    inhoud: 'Bedrijven verplaatsen productie terug naar Europa. Grote kansen voor Nederlandse toeleveranciers en producenten in de komende jaren.',
    relevantie: 'Hoog',
    bron: 'CBS, FD, Techniek Nederland',
    tags: 'Nearshoring,Productie,Supply Chain',
    eigenaar: 'Kevin',
    datum_gepubliceerd: '2025-01-28',
  },
];

export const mockNews: NewsItem[] = [
  {
    id: 1,
    titel: 'Nieuwe website TechForce live gegaan! 🚀',
    categorie: 'Project Lancering',
    inhoud: 'Super trots om te melden dat de nieuwe website voor TechForce vandaag live is gegaan. Het project liep als een trein en de klant is super enthousiast over het resultaat.',
    auteur: 'Rosanne',
    datum_gepubliceerd: '2026-03-01',
    datum: '2026-03-01',
    tags: 'Website Launch,TechForce',
    belangrijk: false,
    featured: false,
  },
  {
    id: 2,
    titel: 'Coen officieel gestart als Support & Tech Specialist',
    categorie: 'Team Update',
    inhoud: 'Vanaf vandaag is Coen officieel onderdeel van het team! Hij gaat zich bezighouden met technical support en zorgt dat alle systemen blijven draaien. Welkom Coen! 👋',
    auteur: 'Annemieke',
    datum_gepubliceerd: '2026-02-28',
    datum: '2026-02-28',
    tags: 'Nieuw Teamlid,Onboarding',
    belangrijk: false,
    featured: false,
  },
];

export const mockTeamMembers: TeamMember[] = [
  {
    id: 1,
    naam: 'Rosanne',
    rol: 'Eigenaar & Strategisch Adviseur',
    expertise: 'Strategie,Groeistrategieën,B2B Marketing,Maakindustrie',
    bio: 'Rosanne helpt bedrijven in de maakindustrie met hun digitale transformatie en groeistrategie.',
    email: 'rosanne@burostaal.nl',
    type: 'intern',
  },
  {
    id: 2,
    naam: 'Annemieke',
    rol: 'Eigenaar & Financieel Beheer',
    expertise: 'Financiën,Administratie,Bedrijfsvoering,Operations',
    bio: 'Annemieke zorgt voor de financiële administratie en zorgt dat alle bedrijfsprocessen soepel verlopen.',
    email: 'annemieke@burostaal.nl',
    type: 'intern',
  },
  {
    id: 3,
    naam: 'Kevin',
    rol: 'Design Lead',
    expertise: 'UI/UX Design,Brand Design,Webdesign,Visual Identity',
    bio: 'Kevin zorgt voor visueel sterke designs die de merkidentiteit van klanten versterken.',
    email: 'kevin@burostaal.nl',
    type: 'intern',
  },
  {
    id: 4,
    naam: 'Rick',
    rol: 'Lead Developer',
    expertise: 'Web Development,Webflow,Front-end,Technical SEO',
    bio: 'Rick bouwt technisch sterke websites en applicaties voor optimale performance.',
    email: 'rick@burostaal.nl',
    type: 'intern',
  },
  {
    id: 5,
    naam: 'Jan de Vries',
    rol: 'Externe Partner - Copywriting',
    expertise: 'SEO Copywriting,B2B Content,Technische Teksten,Whitepapers',
    bio: 'Gespecialiseerd in technische B2B content voor de maakindustrie.',
    email: 'jan@contentpro.nl',
    type: 'extern',
    bedrijf: 'ContentPro',
  },
];

// Additional exports for components
export const kennisCategorieen = [
  'SEO & Online Marketing',
  'Webdesign & Development',
  'Branding & Communicatie',
  'Social Media',
  'Analytics & Data',
  'Algemeen'
];

export const typeMedia = [
  'Artikel',
  'Video',
  'Presentatie',
  'Template',
  'Checklist',
  'Document',
  'Whitepaper'
];

export const mockInternNews = mockNews;

export const mockExternePartners = mockTeamMembers.filter(member => member.type === 'extern');
