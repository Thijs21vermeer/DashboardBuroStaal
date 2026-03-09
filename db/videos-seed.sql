-- Seed data voor videos tabel
-- Voorbeeld instructievideo's

INSERT INTO videos (titel, beschrijving, youtube_url, thumbnail_url, categorie, tags, eigenaar, featured) VALUES
(
    'Webflow CMS: Je eerste collectie maken',
    'Leer hoe je een CMS collectie aanmaakt in Webflow en velden toevoegt voor dynamische content.',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    'CMS Instructies',
    'webflow,cms,collectie,beginners',
    'Rick',
    1
),
(
    'SEO Basics: Meta Descriptions Optimaliseren',
    'Korte uitleg over hoe je effectieve meta descriptions schrijft voor betere zoekresultaten.',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    'SEO & Analytics',
    'seo,meta,google,optimalisatie',
    'Rosanne',
    1
),
(
    'Website Backup: Hoe maak je een backup in Webflow',
    'Stap-voor-stap uitleg voor het maken van een volledige backup van je Webflow site.',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    'Website Beheer',
    'backup,webflow,beheer,veiligheid',
    'Coen',
    0
),
(
    'E-commerce: Producten toevoegen aan je webshop',
    'Leer hoe je producten toevoegt, prijzen instelt en voorraad beheert in je Webflow e-commerce site.',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    'E-commerce',
    'webshop,producten,e-commerce,verkoop',
    'Rick',
    1
),
(
    'Google Analytics Koppelen: Complete Setup',
    'Volledige handleiding voor het koppelen van Google Analytics aan je website.',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    'SEO & Analytics',
    'analytics,google,tracking,data',
    'Rosanne',
    0
),
(
    'Formulieren Beheren: E-mails en Notificaties',
    'Hoe stel je formulieren in en configureer je e-mail notificaties bij inzendingen.',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    'Website Beheer',
    'formulieren,email,notificaties,contact',
    'Kevin',
    0
);

GO
