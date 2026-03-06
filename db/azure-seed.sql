-- Azure SQL Seed Data voor Buro Staal Kennisbank

-- Kennisitems
INSERT INTO kennisitems (titel, type, tags, gekoppeld_project, eigenaar, samenvatting, inhoud, categorie, media_type, views) VALUES
(N'SEO Strategie voor Maakindustrie', N'Artikel', N'SEO,Marketing,Maakindustrie', NULL, N'Rosanne', N'Uitgebreide gids voor SEO optimalisatie specifiek voor productiebedrijven', N'Complete SEO strategie voor maakindustrie bedrijven...', N'Marketing', N'Tekst', 145),
(N'Website Redesign Best Practices', N'Handleiding', N'Webdesign,UX,Conversie', N'Metaalbewerking XYZ', N'Kevin', N'Best practices voor het redesignen van industriële websites', N'Stap voor stap handleiding voor website redesign...', N'Design', N'Tekst', 98),
(N'E-commerce voor B2B Bedrijven', N'Whitepaper', N'E-commerce,B2B,Strategie', NULL, N'Rosanne', N'Hoe e-commerce platforms waarde toevoegen aan B2B bedrijven', N'Uitgebreide analyse van B2B e-commerce trends...', N'E-commerce', N'PDF', 203);

-- Cases
INSERT INTO cases (titel, klant, industrie, projectduur, team, tags, challenge, solution, results, status, budget, roi) VALUES
(N'Website Redesign Metaalbewerking XYZ', N'Metaalbewerking XYZ B.V.', N'Metaalbewerking', N'3 maanden', N'Kevin,Rick,Rosanne', N'Webdesign,UX,B2B', N'Verouderde website met lage conversie en moeilijke navigatie', N'Complete redesign met focus op gebruiksvriendelijkheid en conversie-optimalisatie', N'120% toename in leads, 45% lagere bounce rate', N'afgerond', N'€25.000', N'340%'),
(N'E-commerce Platform voor Industriële Onderdelen', N'TechParts Nederland', N'Technische handel', N'6 maanden', N'Rick,Coen,Rosanne', N'E-commerce,B2B,Platform', N'Geen online verkoopkanaal, handmatig orderproces', N'Custom B2B e-commerce platform met integratie ERP systeem', N'€500k online omzet eerste jaar, 60% reductie administratie', N'afgerond', N'€75.000', N'280%'),
(N'SEO Campagne Productie Bedrijf', N'Staal & Co Productie', N'Staalproductie', N'12 maanden', N'Rosanne,Jan de Vries', N'SEO,Content,Marketing', N'Niet vindbaar op Google, geen organisch verkeer', N'Uitgebreide SEO strategie met technische optimalisatie en content marketing', N'Top 3 posities voor 15 belangrijke zoektermen, 250% meer organisch verkeer', N'lopend', N'€18.000', N'420%');

-- Trends
INSERT INTO trends (titel, categorie, beschrijving, impact, bron, relevantie, tags) VALUES
(N'AI in de Maakindustrie', N'Technologie', N'Kunstmatige intelligentie transformeert productieprocessen en kwaliteitscontrole in de maakindustrie', N'hoog', N'McKinsey Industry Report 2024', N'zeer relevant', N'AI,Productie,Innovatie'),
(N'Duurzaamheid als Concurrentievoordeel', N'Duurzaamheid', N'Bedrijven die inzetten op duurzaamheid winnen marktaandeel en aantrekkelijkere opdrachten', N'hoog', N'Sustainability Index 2024', N'zeer relevant', N'Duurzaamheid,Marketing,ESG'),
(N'Personalisatie in B2B Marketing', N'Marketing', N'B2B kopers verwachten dezelfde gepersonaliseerde ervaring als B2C', N'gemiddeld', N'Gartner B2B Marketing Report', N'relevant', N'Marketing,Personalisatie,B2B');

-- Nieuws
INSERT INTO nieuws (titel, categorie, inhoud, auteur, tags, belangrijk) VALUES
(N'Nieuw Project: Website Redesign voor Machinebouw Leader', N'Projecten', N'We zijn gestart met een ambitieus redesign project voor een toonaangevende machinebouwer. Focus ligt op internationale uitstraling en lead generatie.', N'Rosanne', N'Projecten,Webdesign', 1),
(N'Rick Behaalt Google Cloud Certificering', N'Team', N'Rick heeft succesvol zijn Google Cloud Platform certificering behaald, waardoor we nu ook cloud hosting kunnen aanbieden.', N'Annemieke', N'Team,Certificering', 0),
(N'Buro Staal Partner van Webflow', N'Bedrijf', N'Trots om aan te kondigen dat we officieel Webflow Partner zijn geworden. Dit stelt ons in staat om nog betere websites te bouwen.', N'Rosanne', N'Partnerships,Webflow', 1),
(N'Case Study: 340% ROI voor Metaalbewerking XYZ', N'Cases', N'Onze website redesign voor Metaalbewerking XYZ heeft geleid tot 340% ROI binnen 6 maanden. Lees de volledige case study.', N'Kevin', N'Cases,Resultaten', 1),
(N'Teamuitje Q2: Brainstorm Sessie', N'Team', N'Afgelopen week hebben we een inspirerende brainstorm sessie gehad over de toekomst van digital marketing in de maakindustrie.', N'Annemieke', N'Team,Events', 0);
