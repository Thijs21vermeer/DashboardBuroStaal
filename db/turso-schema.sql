-- Turso (SQLite) Schema for Buro Staal Dashboard
-- Converted from Azure SQL Server schema

-- KennisItems (Knowledge Items)
CREATE TABLE IF NOT EXISTS KennisItems (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titel TEXT NOT NULL,
    beschrijving TEXT,
    categorie TEXT,
    tags TEXT,
    mediaType TEXT,
    afbeelding TEXT,
    referenties TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Cases
CREATE TABLE IF NOT EXISTS Cases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titel TEXT NOT NULL,
    beschrijving TEXT,
    klant TEXT,
    resultaat TEXT,
    afbeelding TEXT,
    tags TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Trends
CREATE TABLE IF NOT EXISTS Trends (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titel TEXT NOT NULL,
    beschrijving TEXT,
    categorie TEXT,
    eigenaar TEXT,
    tags TEXT,
    afbeelding TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Nieuws (News)
CREATE TABLE IF NOT EXISTS Nieuws (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titel TEXT NOT NULL,
    beschrijving TEXT,
    inhoud TEXT,
    auteur TEXT,
    afbeelding TEXT,
    tags TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Tools
CREATE TABLE IF NOT EXISTS Tools (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    naam TEXT NOT NULL,
    categorie TEXT,
    beschrijving TEXT,
    link TEXT,
    afbeelding TEXT,
    tags TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Videos
CREATE TABLE IF NOT EXISTS Videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titel TEXT NOT NULL,
    beschrijving TEXT,
    videolink TEXT,
    categorie TEXT,
    afbeelding TEXT,
    tags TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Team
CREATE TABLE IF NOT EXISTS Team (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    naam TEXT NOT NULL,
    functie TEXT,
    bio TEXT,
    email TEXT,
    telefoon TEXT,
    afbeelding TEXT,
    linkedIn TEXT,
    specialisaties TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Partners (if exists)
CREATE TABLE IF NOT EXISTS Partners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    naam TEXT NOT NULL,
    beschrijving TEXT,
    website TEXT,
    logo TEXT,
    categorie TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_kennisitems_categorie ON KennisItems(categorie);
CREATE INDEX IF NOT EXISTS idx_kennisitems_created ON KennisItems(createdAt);
CREATE INDEX IF NOT EXISTS idx_cases_created ON Cases(createdAt);
CREATE INDEX IF NOT EXISTS idx_trends_categorie ON Trends(categorie);
CREATE INDEX IF NOT EXISTS idx_trends_created ON Trends(createdAt);
CREATE INDEX IF NOT EXISTS idx_nieuws_created ON Nieuws(createdAt);
CREATE INDEX IF NOT EXISTS idx_tools_categorie ON Tools(categorie);
CREATE INDEX IF NOT EXISTS idx_videos_categorie ON Videos(categorie);
CREATE INDEX IF NOT EXISTS idx_team_naam ON Team(naam);
