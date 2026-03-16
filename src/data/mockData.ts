import type { KennisItem, CaseStudy, Trend, NewsItem, TeamMember, AgendaItem, Priority } from '../types';

// Mock data voor de Buro Staal Kennisbank

export const mockKennisItems: KennisItem[] = [
  {
    id: 'k1',
    titel: 'Effectieve SEO strategieën voor productie bedrijven',
    type: 'Artikel',
    tags: ['SEO', 'Online Marketing', 'Maakindustrie'],
    gekoppeldProject: 'MetaalWorks Website',
    eigenaar: 'Rosanne',
    samenvatting: 'Een complete gids voor het optimaliseren van je website voor zoekmachines in de maakindustrie.',
    inhoud: 'SEO is cruciaal voor zichtbaarheid in de maakindustrie. Deze gids biedt praktische tips voor betere rankings...',
    datumToegevoegd: '2025-01-15',
    laatstBijgewerkt: '2025-02-01',
    views: 342,
  },
  {
    id: 'k2',
    titel: 'LinkedIn Advertising Best Practices',
    type: 'Video',
    tags: ['LinkedIn', 'B2B Marketing', 'Social Media'],
    eigenaar: 'Kevin',
    samenvatting: 'Leer hoe je effectieve LinkedIn campagnes opzet voor de maakindustrie.',
    inhoud: 'LinkedIn is het belangrijkste platform voor B2B marketing. In deze video leer je...',
    datumToegevoegd: '2025-01-20',
    laatstBijgewerkt: '2025-01-28',
    views: 287,
  },
  {
    id: 'k3',
    titel: 'Content Marketing Strategie Template',
    type: 'Template',
    tags: ['Content Marketing', 'Strategie', 'Planning'],
    eigenaar: 'Rosanne',
    samenvatting: 'Download ons template voor het opzetten van een effectieve content strategie.',
    inhoud: 'Een complete template met alle elementen voor een succesvolle content marketing strategie...',
    datumToegevoegd: '2025-01-25',
    laatstBijgewerkt: '2025-01-25',
    views: 156,
  },
  {
    id: 'k4',
    titel: 'Marketing Automation Checklist',
    type: 'Checklist',
    tags: ['Marketing Automation', 'HubSpot', 'Efficiency'],
    eigenaar: 'Rick',
    samenvatting: 'Stap voor stap checklist voor het implementeren van marketing automation.',
    inhoud: 'Marketing automation kan complexwezig, maar met deze checklist maak je het overzichtelijk...',
    datumToegevoegd: '2025-02-01',
    laatstBijgewerkt: '2025-02-03',
    views: 198,
  },
  {
    id: 'k5',
    titel: 'Webflow Development Guide',
    type: 'Document',
    tags: ['Webflow', 'Development', 'Technical'],
    eigenaar: 'Rick',
    samenvatting: 'Technische documentatie voor Webflow ontwikkeling.',
    inhoud: 'Een uitgebreide gids voor het bouwen van professionele websites in Webflow...',
    datumToegevoegd: '2025-01-18',
    laatstBijgewerkt: '2025-01-30',
    views: 224,
  },
];

export const mockCases: CaseStudy[] = [
  {
    id: 'c1',
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
    type: 'Website',
  },
  {
    id: 'c2',
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
    type: 'Content Marketing',
  },
  {
    id: 'c3',
    titel: 'Marketing Automation zorgt voor 40% efficiency verbetering',
    klant: 'SmartFactory Solutions',
    industrie: 'Industriële Automatisering',
    uitdaging: 'Sales en marketing werkten met losse systemen, geen inzicht in customer journey.',
    oplossing: 'HubSpot implementatie, lead scoring, geautomatiseerde nurture campaigns en sales enablement.',
    resultaten: [
      '40% minder tijd aan lead kwalificatie',
      '25% hogere conversie naar opportunity',
      'Volledige transparantie in marketing ROI',
      '60% van leads wordt nu automatisch gevoed',
    ],
    tags: ['Marketing Automation', 'HubSpot', 'Lead Generation', 'CRM'],
    eigenaar: 'Rick',
    datum: '2025-02-02',
    featured: true,
    type: 'Marketing Automation',
  },
];

export const mockTrends: Trend[] = [
  {
    id: 't1',
    titel: 'AI-gestuurde personalisatie in B2B marketing',
    categorie: 'Technologie',
    beschrijving: 'AI tools maken het mogelijk om B2B marketing te personaliseren op individueel niveau, vergelijkbaar met B2C.',
    relevantie: 'Hoog',
    bron: 'Gartner, HubSpot Research, LinkedIn Marketing',
    bronnen: ['Gartner', 'HubSpot Research', 'LinkedIn Marketing'],
    datum: '2025-02-01',
    tags: ['AI', 'Personalisatie', 'B2B Marketing'],
    impact: 'Bedrijven die AI-personalisatie inzetten zien 30-40% hogere engagement rates.',
  },
  {
    id: 't2',
    titel: 'Nearshoring als nieuwe norm in maakindustrie',
    categorie: 'Maakindustrie',
    beschrijving: 'Bedrijven verplaatsen productie terug naar Europa voor meer controle en kortere levertijden.',
    relevantie: 'Hoog',
    bron: 'CBS, FD, Techniek Nederland',
    bronnen: ['CBS', 'FD', 'Techniek Nederland'],
    datum: '2025-01-28',
    tags: ['Nearshoring', 'Productie', 'Supply Chain'],
    impact: 'Grote kansen voor Nederlandse toeleveranciers en producenten in de komende jaren.',
  },
  {
    id: 't3',
    titel: 'Video content domineert B2B decision making',
    categorie: 'Digital Marketing',
    beschrijving: 'B2B kopers kijken gemiddeld 3-5 uur video content voordat ze contact opnemen.',
    relevantie: 'Hoog',
    bron: 'Wyzowl, LinkedIn, Forrester',
    bronnen: ['Wyzowl', 'LinkedIn', 'Forrester'],
    datum: '2025-01-25',
    tags: ['Video', 'Content Marketing', 'B2B'],
    impact: 'Bedrijven zonder video strategie missen cruciale touchpoints in de customer journey.',
  },
  {
    id: 't4',
    titel: 'Duurzaamheid wordt unique selling point',
    categorie: 'Business',
    beschrijving: 'Klanten selecteren steeds vaker op basis van duurzaamheid en ESG criteria.',
    relevantie: 'Middel',
    bron: 'McKinsey, VNO-NCW',
    bronnen: ['McKinsey', 'VNO-NCW'],
    datum: '2025-01-20',
    tags: ['Duurzaamheid', 'ESG', 'USP'],
    impact: 'Transparante communicatie over duurzaamheid wordt competitive advantage.',
  },
];

export const mockNews: NewsItem[] = [
  {
    id: 'n1',
    titel: 'Nieuwe website TechForce live gegaan! 🚀',
    categorie: 'Project Lancering',
    inhoud: 'Super trots om te melden dat de nieuwe website voor TechForce vandaag live is gegaan. Het project liep als een trein en de klant is super enthousiast over het resultaat.',
    auteur: 'Rosanne',
    datum: '2026-03-01',
    tags: ['Website Launch', 'TechForce'],
  },
  {
    id: 'n2',
    titel: 'Coen officieel gestart als Support & Tech Specialist',
    categorie: 'Team Update',
    inhoud: 'Vanaf vandaag is Coen officieel onderdeel van het team! Hij gaat zich bezighouden met technical support en zorgt dat alle systemen blijven draaien. Welkom Coen! 👋',
    auteur: 'Annemieke',
    datum: '2026-02-28',
    tags: ['Nieuw Teamlid', 'Onboarding'],
  },
  {
    id: 'n3',
    titel: 'Q1 Targets bereikt - 25% groei!',
    categorie: 'Prestatie',
    inhoud: 'Wat een geweldig eerste kwartaal! We hebben onze targets niet alleen gehaald, maar zelfs met 25% overtroffen. Dit komt door de fantastische samenwerking en inzet van iedereen. Keep it up team! 💪',
    auteur: 'Rosanne',
    datum: '2026-02-25',
    tags: ['Groei', 'Targets', 'Q1 2026'],
  },
  {
    id: 'n4',
    titel: 'MetaalWorks project gestart',
    categorie: 'Project Lancering',
    inhoud: 'We zijn vandaag gestart met het MetaalWorks project. Dit wordt een uitgebreide website met productcatalogus en klantportaal. Timeline: 8 weken.',
    auteur: 'Rosanne',
    datum: '2026-02-20',
    tags: ['Nieuw Project', 'MetaalWorks'],
  },
  {
    id: 'n5',
    titel: 'Team Borrel vrijdag 7 maart',
    categorie: 'Algemeen',
    inhoud: 'Save the date! Vrijdag 7 maart gaan we met z\'n allen borrelen om de successen van afgelopen maand te vieren. Vanaf 17:00 bij Café de Beurs in het centrum. 🍻',
    auteur: 'Annemieke',
    datum: '2026-02-18',
    tags: ['Team Event', 'Borrel'],
  },
  {
    id: 'n6',
    titel: 'Nieuwe partnership met ContentPro',
    categorie: 'Bedrijfsnieuws',
    inhoud: 'We gaan samenwerken met Jan de Vries van ContentPro voor copywriting en SEO content. Dit betekent dat we nu ook hoogwaardige content kunnen aanbieden aan onze klanten.',
    auteur: 'Rosanne',
    datum: '2026-02-15',
    tags: ['Partnership', 'Content'],
  },
  {
    id: 'n7',
    titel: 'IndustriePro mega blij met nieuwe branding',
    categorie: 'Prestatie',
    inhoud: 'IndustriePro heeft hun nieuwe branding ontvangen en ze zijn er super enthousiast over! Ze hebben zelfs al nieuwe visitekaartjes en merchandise besteld. Great job Kevin! 🎨',
    auteur: 'Rosanne',
    datum: '2026-02-10',
    tags: ['Branding', 'IndustriePro'],
  },
  {
    id: 'n8',
    titel: 'Webflow Conf 2026 - wie gaat er mee?',
    categorie: 'Algemeen',
    inhoud: 'In mei is er weer de Webflow Conference in San Francisco. Wie heeft er zin om mee te gaan? We kunnen dit gebruiken als team outing en gelijk veel nieuwe kennis opdoen.',
    auteur: 'Rick',
    datum: '2026-02-05',
    tags: ['Conference', 'Webflow'],
  },
  {
    id: 'n9',
    titel: '100e LinkedIn post milestone bereikt! 📊',
    categorie: 'Prestatie',
    inhoud: 'We hebben zojuist onze 100e LinkedIn post gepubliceerd! Onze volgers groeien gestaag (nu 2.400+) en de engagement is super. Laten we dit momentum vasthouden.',
    auteur: 'Rosanne',
    datum: '2026-01-30',
    tags: ['Social Media', 'LinkedIn'],
  },
  {
    id: 'n10',
    titel: 'Nieuwe MacBook Pros binnen voor development',
    categorie: 'Team Update',
    inhoud: 'De nieuwe MacBook Pros zijn binnen! Rick en Kevin krijgen een upgrade naar de M3 Max voor betere performance bij design en development werk.',
    auteur: 'Annemieke',
    datum: '2026-01-25',
    tags: ['Hardware', 'Equipment'],
  },
];

export const mockTeamMembers: TeamMember[] = [
  {
    id: 'tm1',
    naam: 'Rosanne',
    rol: 'Eigenaar & Strategisch Adviseur',
    specialisaties: ['Strategie', 'Groeistrategieën', 'B2B Marketing', 'Maakindustrie'],
    bio: 'Rosanne helpt bedrijven in de maakindustrie met hun digitale transformatie en groeistrategie.',
    email: 'rosanne@burostaal.nl',
  },
  {
    id: 'tm2',
    naam: 'Annemieke',
    rol: 'Eigenaar & Financieel Beheer',
    specialisaties: ['Financiën', 'Administratie', 'Bedrijfsvoering', 'Operations'],
    bio: 'Annemieke zorgt voor de financiële administratie en zorgt dat alle bedrijfsprocessen soepel verlopen.',
    email: 'annemieke@burostaal.nl',
  },
  {
    id: 'tm3',
    naam: 'Kevin',
    rol: 'Design Lead',
    specialisaties: ['UI/UX Design', 'Brand Design', 'Webdesign', 'Visual Identity'],
    bio: 'Kevin zorgt voor visueel sterke designs die de merkidentiteit van klanten versterken.',
    email: 'kevin@burostaal.nl',
  },
  {
    id: 'tm4',
    naam: 'Rick',
    rol: 'Lead Developer',
    specialisaties: ['Web Development', 'Webflow', 'Front-end', 'Technical SEO'],
    bio: 'Rick bouwt technisch sterke websites en applicaties voor optimale performance.',
    email: 'rick@burostaal.nl',
  },
  {
    id: 'tm5',
    naam: 'Coen',
    rol: 'Support & Tech Specialist',
    specialisaties: ['Technical Support', 'Website Maintenance', 'Troubleshooting', 'Customer Success'],
    bio: 'Coen zorgt voor technische ondersteuning en zorgt dat alle systemen blijven draaien.',
    email: 'coen@burostaal.nl',
  },
  {
    id: 'ep1',
    naam: 'Jan de Vries',
    rol: 'Externe Partner - Copywriting',
    specialisaties: ['SEO Copywriting', 'B2B Content', 'Technische Teksten', 'Whitepapers'],
    bio: 'Gespecialiseerd in technische B2B content voor de maakindustrie.',
    email: 'jan@contentpro.nl',
    isExternal: true,
    company: 'ContentPro',
  },
  {
    id: 'ep2',
    naam: 'Sarah Johnson',
    rol: 'Externe Partner - SEA',
    specialisaties: ['Google Ads', 'LinkedIn Ads', 'Campaign Management', 'Analytics'],
    bio: 'Expert in betaalde advertentiecampagnes met focus op B2B leadgeneratie.',
    email: 'sarah@digitalboost.nl',
    isExternal: true,
    company: 'Digital Boost',
  },
  {
    id: 'ep3',
    naam: 'Mark Peters',
    rol: 'Externe Partner - Video',
    specialisaties: ['Bedrijfsfilms', 'Product Videos', 'Animation', 'Post-productie'],
    bio: 'Creatieve videoproducties voor industriële bedrijven.',
    email: 'mark@videovision.nl',
    isExternal: true,
    company: 'Video Vision',
  },
  {
    id: 'ep4',
    naam: 'Lisa van der Berg',
    rol: 'Externe Partner - Fotografie',
    specialisaties: ['Product Fotografie', 'Industriële Fotografie', 'Team Fotografie', 'Stock'],
    bio: 'Professionele fotografie voor websites en marketingmateriaal.',
    email: 'lisa@fotofocus.nl',
    isExternal: true,
    company: 'FotoFocus',
  },
  {
    id: 'ep5',
    naam: 'Tom Bakker',
    rol: 'Externe Partner - CRM',
    specialisaties: ['HubSpot', 'Marketing Automation', 'CRM Implementatie', 'Workflows'],
    bio: 'Specialist in marketing automation en CRM systemen.',
    email: 'tom.bakker@crm-expert.nl',
    isExternal: true,
  },
];

export const mockPriorities: Priority[] = [
  {
    id: '1',
    titel: 'Website redesign afronden',
    categorie: 'Development',
    eigenaar: 'Rick',
    deadline: '2026-03-15',
    status: 'In Progress',
    project: 'BuroStaal.nl',
    notities: 'Laatste tests voordat we live gaan',
    priority: 'Hoog',
  },
  {
    id: '2',
    titel: 'Q1 Marketing campagne opzetten',
    categorie: 'Marketing',
    eigenaar: 'Rosanne',
    deadline: '2026-03-20',
    status: 'Open',
    project: 'Marketing 2026',
    notities: 'Focus op manufacturing sector',
    priority: 'Hoog',
  },
  {
    id: '3',
    titel: 'Nieuwe klant onboarding',
    categorie: 'Sales',
    eigenaar: 'Annemieke',
    deadline: '2026-03-10',
    status: 'In Progress',
    project: 'Klant XYZ',
    notities: 'Eerste kennismaking gepland',
    priority: 'Middel',
  },
  {
    id: '4',
    titel: 'Kennisbank content uitbreiden',
    categorie: 'Marketing',
    eigenaar: 'Kevin',
    deadline: '2026-03-25',
    status: 'Open',
    project: 'Content Strategy',
    notities: '10 nieuwe artikelen schrijven',
    priority: 'Middel',
  },
  {
    id: '5',
    titel: 'Server backup systeem updaten',
    categorie: 'Operations',
    eigenaar: 'Coen',
    deadline: '2026-03-12',
    status: 'Completed',
    project: 'IT Infrastructuur',
    notities: 'Backup getest en werkend',
    priority: 'Hoog',
  },
  {
    id: '6',
    titel: 'Social media strategie Q2',
    categorie: 'Marketing',
    eigenaar: 'Rosanne',
    deadline: '2026-03-30',
    status: 'Open',
    project: 'Social Media',
    notities: 'LinkedIn focus',
    priority: 'Laag',
  },
];

export const mockAgendaItems: AgendaItem[] = [
  {
    id: '1',
    titel: 'Wekelijkse standup',
    type: 'Vergadering',
    startdatum: '2026-03-05T09:00:00',
    einddatum: '2026-03-05T10:00:00',
    project: 'Intern',
    eigenaar: 'Rosanne',
    fase: 'Uitvoering',
    locatie: 'Kantoor',
    notities: 'Sprint planning en retrospective',
  },
  {
    id: '2',
    titel: 'Klant presentatie XYZ',
    type: 'Vergadering',
    startdatum: '2026-03-07T14:00:00',
    einddatum: '2026-03-07T15:30:00',
    project: 'XYZ Website',
    eigenaar: 'Rosanne',
    fase: 'Roadmap',
    locatie: 'Online - Teams',
    notities: 'Website ontwerp presenteren',
  },
  {
    id: '3',
    titel: 'Website launch BuroStaal.nl',
    type: 'Deadline',
    startdatum: '2026-03-15T10:00:00',
    project: 'BuroStaal.nl',
    eigenaar: 'Rick',
    fase: 'Uitvoering',
    notities: 'Go-live nieuwe website',
  },
  {
    id: '4',
    titel: 'Team lunch',
    type: 'Event',
    startdatum: '2026-03-14T12:30:00',
    einddatum: '2026-03-14T14:00:00',
    eigenaar: 'Annemieke',
    locatie: 'Restaurant De Brasserie',
    notities: 'Teambuilding activiteit',
  },
  {
    id: '5',
    titel: 'Marketing review Q1',
    type: 'Vergadering',
    startdatum: '2026-03-20T15:00:00',
    einddatum: '2026-03-20T16:00:00',
    project: 'Marketing 2026',
    eigenaar: 'Rosanne',
    fase: 'Optimalisatie',
    locatie: 'Kantoor',
    notities: 'Cijfers bespreken',
  },
  {
    id: '6',
    titel: 'Developer sync',
    type: 'Vergadering',
    startdatum: '2026-03-08T10:00:00',
    einddatum: '2026-03-08T11:00:00',
    project: 'Technische infrastructuur',
    eigenaar: 'Rick',
    fase: 'Uitvoering',
    locatie: 'Online - Teams',
    notities: 'Technische issues bespreken',
  },
  {
    id: '7',
    titel: 'Deadline offerteaanvraag MetaalWerken',
    type: 'Deadline',
    startdatum: '2026-03-10T17:00:00',
    project: 'MetaalWerken Offerte',
    eigenaar: 'Rosanne',
    fase: 'Diagnose',
    notities: 'Offerte moet binnen zijn',
  },
  {
    id: '8',
    titel: 'Webflow Conference prep',
    type: 'Vergadering',
    startdatum: '2026-03-12T14:00:00',
    einddatum: '2026-03-12T15:00:00',
    eigenaar: 'Rick',
    locatie: 'Kantoor',
    notities: 'Voorbereiden voor conference in mei',
  },
  {
    id: '9',
    titel: 'Q2 Planning sessie',
    type: 'Milestone',
    startdatum: '2026-03-25T09:00:00',
    einddatum: '2026-03-25T17:00:00',
    project: 'Strategie 2026',
    eigenaar: 'Rosanne',
    fase: 'Roadmap',
    locatie: 'Off-site locatie',
    notities: 'Hele dag plannen voor Q2',
  },
  {
    id: '10',
    titel: 'Content review sessie',
    type: 'Vergadering',
    startdatum: '2026-03-18T11:00:00',
    einddatum: '2026-03-18T12:00:00',
    project: 'Content Strategie',
    eigenaar: 'Kevin',
    fase: 'Uitvoering',
    locatie: 'Kantoor',
    notities: 'Laatste content items reviewen',
  },
];


interface Project {
  id: string;
  naam: string;
  klant: string;
  fase: 'Diagnose' | 'Roadmap' | 'Uitvoering' | 'Optimalisatie';
  eigenaar: string;
  blokkade?: string | boolean;
  startdatum: string;
  volgendeMijlpaal?: string;
  status?: string;
}

export const mockProjects: Project[] = [
  {
    id: '1',
    naam: 'Website redesign',
    klant: 'TechCorp B.V.',
    fase: 'Uitvoering',
    eigenaar: 'Rick',
    blokkade: false,
    startdatum: '2026-01-15',
    volgendeMijlpaal: 'Testing fase',
    status: 'Op schema',
  },
  {
    id: '2',
    naam: 'Marketing campagne Q1',
    klant: 'MetaalWerken NL',
    fase: 'Roadmap',
    eigenaar: 'Rosanne',
    blokkade: false,
    startdatum: '2026-02-01',
    volgendeMijlpaal: 'Content planning',
    status: 'Op schema',
  },
  {
    id: '3',
    naam: 'E-commerce platform',
    klant: 'IndustrieParts',
    fase: 'Diagnose',
    eigenaar: 'Kevin',
    blokkade: false,
    startdatum: '2026-02-15',
    volgendeMijlpaal: 'Design kick-off',
    status: 'Op schema',
  },
  {
    id: '4',
    naam: 'SEO optimalisatie',
    klant: 'BouwStaal',
    fase: 'Optimalisatie',
    eigenaar: 'Rosanne',
    blokkade: 'Wachten op content van klant',
    startdatum: '2026-01-10',
    volgendeMijlpaal: 'Content review',
    status: 'Geblokkeerd',
  },
  {
    id: '5',
    naam: 'CRM implementatie',
    klant: 'TechCorp B.V.',
    fase: 'Uitvoering',
    eigenaar: 'Coen',
    blokkade: false,
    startdatum: '2026-01-20',
    volgendeMijlpaal: 'Data migratie',
    status: 'Risico',
  },
];

// Phase Matrix voor Rollen & Eigenaarschap
export const phaseMatrix = {
  'Diagnose': {
    fase: 'Diagnose',
    beschrijving: 'Analyse en strategie bepalen',
    verantwoordelijkheden: [
      'Intake gesprek voeren',
      'Doelstellingen in kaart brengen',
      'Marktanalyse uitvoeren',
      'Strategisch advies opstellen'
    ],
    hoofdverantwoordelijke: 'Rosanne',
    primaireEigenaar: 'Rosanne',
    teamleden: ['Rosanne', 'Annemieke'],
    betrokkenRollen: ['Strategist', 'Business Owner']
  },
  'Roadmap': {
    fase: 'Roadmap',
    beschrijving: 'Planning en ontwerp',
    verantwoordelijkheden: [
      'Projectplanning opstellen',
      'Design concepten maken',
      'Content strategie bepalen',
      'Timeline en budget vastleggen'
    ],
    hoofdverantwoordelijke: 'Kevin',
    primaireEigenaar: 'Kevin',
    teamleden: ['Kevin', 'Rosanne', 'Rick'],
    betrokkenRollen: ['Designer', 'Strategist', 'Developer']
  },
  'Uitvoering': {
    fase: 'Uitvoering',
    beschrijving: 'Bouwen en implementeren',
    verantwoordelijkheden: [
      'Website/platform bouwen',
      'Content produceren',
      'Campagnes opzetten',
      'Testen en optimaliseren'
    ],
    hoofdverantwoordelijke: 'Rick',
    primaireEigenaar: 'Rick',
    teamleden: ['Rick', 'Kevin', 'Coen'],
    betrokkenRollen: ['Developer', 'Designer', 'Support']
  },
  'Optimalisatie': {
    fase: 'Optimalisatie',
    beschrijving: 'Meten en verbeteren',
    verantwoordelijkheden: [
      'Performance monitoren',
      'Data analyseren',
      'Optimalisaties doorvoeren',
      'Rapportages opstellen'
    ],
    hoofdverantwoordelijke: 'Coen',
    primaireEigenaar: 'Coen',
    teamleden: ['Coen', 'Rosanne', 'Rick'],
    betrokkenRollen: ['Support', 'Strategist', 'Developer']
  }
};

interface ActionItem {
  id: string;
  titel: string;
  taak?: string;
  fase: 'Diagnose' | 'Roadmap' | 'Uitvoering' | 'Optimalisatie';
  verantwoordelijke: string;
  deadline: string;
  status: 'Open' | 'In Progress' | 'Completed' | 'Bezig';
  project: string;
  prioriteit?: 'Hoog' | 'Middel' | 'Laag';
}

export const mockActions: ActionItem[] = [
  {
    id: 'a1',
    titel: 'Intake gesprek TechCorp',
    fase: 'Diagnose',
    verantwoordelijke: 'Rosanne',
    deadline: '2026-03-08',
    status: 'Completed',
    project: 'TechCorp Website'
  },
  {
    id: 'a2',
    titel: 'Design concepts maken',
    fase: 'Roadmap',
    verantwoordelijke: 'Kevin',
    deadline: '2026-03-12',
    status: 'In Progress',
    project: 'MetaalWerken'
  },
  {
    id: 'a3',
    titel: 'Website bouwen',
    fase: 'Uitvoering',
    verantwoordelijke: 'Rick',
    deadline: '2026-03-15',
    status: 'In Progress',
    project: 'BuroStaal.nl'
  },
  {
    id: 'a4',
    titel: 'Performance monitoring setup',
    fase: 'Optimalisatie',
    verantwoordelijke: 'Coen',
    deadline: '2026-03-20',
    status: 'Open',
    project: 'IndustrieParts'
  },
  {
    id: 'a5',
    titel: 'Marktanalyse uitvoeren',
    fase: 'Diagnose',
    verantwoordelijke: 'Rosanne',
    deadline: '2026-03-10',
    status: 'In Progress',
    project: 'BouwStaal'
  },
  {
    id: 'a6',
    titel: 'Content strategie',
    fase: 'Roadmap',
    verantwoordelijke: 'Kevin',
    deadline: '2026-03-14',
    status: 'Open',
    project: 'TechCorp Website'
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

export const mockExternePartners = mockTeamMembers.filter(member => member.isExternal);











