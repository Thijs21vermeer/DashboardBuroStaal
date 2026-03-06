-- Azure SQL Schema voor Buro Staal Kennisbank
-- Voer dit uit in Azure Portal SQL Query Editor

-- Kennisitems tabel
CREATE TABLE kennisitems (
    id INT IDENTITY(1,1) PRIMARY KEY,
    titel NVARCHAR(500) NOT NULL,
    type NVARCHAR(100) NOT NULL,
    tags NVARCHAR(MAX),
    gekoppeld_project NVARCHAR(500),
    eigenaar NVARCHAR(200),
    samenvatting NVARCHAR(MAX),
    inhoud NVARCHAR(MAX),
    datum_toegevoegd DATETIME2 DEFAULT GETDATE(),
    laatst_bijgewerkt DATETIME2 DEFAULT GETDATE(),
    views INT DEFAULT 0,
    categorie NVARCHAR(100),
    media_type NVARCHAR(50)
);

-- Cases tabel
CREATE TABLE cases (
    id INT IDENTITY(1,1) PRIMARY KEY,
    titel NVARCHAR(500) NOT NULL,
    klant NVARCHAR(300) NOT NULL,
    industrie NVARCHAR(200),
    projectduur NVARCHAR(100),
    team NVARCHAR(MAX),
    tags NVARCHAR(MAX),
    challenge NVARCHAR(MAX),
    solution NVARCHAR(MAX),
    results NVARCHAR(MAX),
    datum_toegevoegd DATETIME2 DEFAULT GETDATE(),
    status NVARCHAR(50) DEFAULT 'afgerond',
    budget NVARCHAR(100),
    roi NVARCHAR(100)
);

-- Trends tabel
CREATE TABLE trends (
    id INT IDENTITY(1,1) PRIMARY KEY,
    titel NVARCHAR(500) NOT NULL,
    categorie NVARCHAR(200),
    beschrijving NVARCHAR(MAX),
    impact NVARCHAR(50),
    datum_toegevoegd DATETIME2 DEFAULT GETDATE(),
    bron NVARCHAR(500),
    relevantie NVARCHAR(50),
    tags NVARCHAR(MAX)
);

-- Nieuws tabel
CREATE TABLE nieuws (
    id INT IDENTITY(1,1) PRIMARY KEY,
    titel NVARCHAR(500) NOT NULL,
    categorie NVARCHAR(200),
    inhoud NVARCHAR(MAX),
    auteur NVARCHAR(200),
    datum DATETIME2 DEFAULT GETDATE(),
    tags NVARCHAR(MAX),
    belangrijk BIT DEFAULT 0
);

-- Indexes voor betere performance
CREATE INDEX idx_kennisitems_type ON kennisitems(type);
CREATE INDEX idx_kennisitems_categorie ON kennisitems(categorie);
CREATE INDEX idx_kennisitems_datum ON kennisitems(datum_toegevoegd);
CREATE INDEX idx_cases_klant ON cases(klant);
CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_trends_categorie ON trends(categorie);
CREATE INDEX idx_trends_impact ON trends(impact);
CREATE INDEX idx_nieuws_categorie ON nieuws(categorie);
CREATE INDEX idx_nieuws_datum ON nieuws(datum);
