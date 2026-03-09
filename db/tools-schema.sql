-- Tools tabel voor developers
CREATE TABLE tools (
    id INT IDENTITY(1,1) PRIMARY KEY,
    titel NVARCHAR(500) NOT NULL,
    categorie NVARCHAR(200) NOT NULL, -- bijv: 'Command', 'Code Snippet', 'Configuration', 'Script'
    beschrijving NVARCHAR(MAX),
    code NVARCHAR(MAX) NOT NULL, -- De tool/snippet/command zelf
    taal NVARCHAR(100), -- bijv: 'bash', 'typescript', 'sql', 'json'
    tags NVARCHAR(MAX),
    eigenaar NVARCHAR(200),
    datum_toegevoegd DATETIME2 DEFAULT GETDATE(),
    laatst_bijgewerkt DATETIME2 DEFAULT GETDATE(),
    gebruik_count INT DEFAULT 0, -- Hoeveel keer gekopieerd
    favoriet BIT DEFAULT 0
);

-- Index voor betere performance
CREATE INDEX idx_tools_categorie ON tools(categorie);
CREATE INDEX idx_tools_taal ON tools(taal);
CREATE INDEX idx_tools_favoriet ON tools(favoriet);
