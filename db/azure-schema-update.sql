
-- Azure SQL Schema Update voor Buro Staal Kennisbank
-- Dit script voegt ontbrekende kolommen toe aan bestaande tabellen

-- Check en update Cases tabel
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'cases' AND COLUMN_NAME = 'uitdaging')
BEGIN
    ALTER TABLE cases ADD uitdaging NVARCHAR(MAX);
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'cases' AND COLUMN_NAME = 'oplossing')
BEGIN
    ALTER TABLE cases ADD oplossing NVARCHAR(MAX);
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'cases' AND COLUMN_NAME = 'resultaten')
BEGIN
    ALTER TABLE cases ADD resultaten NVARCHAR(MAX);
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'cases' AND COLUMN_NAME = 'eigenaar')
BEGIN
    ALTER TABLE cases ADD eigenaar NVARCHAR(200);
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'cases' AND COLUMN_NAME = 'project_duur')
BEGIN
    ALTER TABLE cases ADD project_duur NVARCHAR(100);
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'cases' AND COLUMN_NAME = 'team_size')
BEGIN
    ALTER TABLE cases ADD team_size NVARCHAR(100);
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'cases' AND COLUMN_NAME = 'image_url')
BEGIN
    ALTER TABLE cases ADD image_url NVARCHAR(500);
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'cases' AND COLUMN_NAME = 'featured')
BEGIN
    ALTER TABLE cases ADD featured BIT DEFAULT 0;
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'cases' AND COLUMN_NAME = 'laatst_bijgewerkt')
BEGIN
    ALTER TABLE cases ADD laatst_bijgewerkt DATETIME2 DEFAULT GETDATE();
END

-- Verwijder oude kolommen die niet meer nodig zijn
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'cases' AND COLUMN_NAME = 'challenge')
BEGIN
    -- Migreer data eerst als het bestaat
    EXEC sp_rename 'cases.challenge', 'uitdaging', 'COLUMN';
END

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'cases' AND COLUMN_NAME = 'solution')
BEGIN
    EXEC sp_rename 'cases.solution', 'oplossing', 'COLUMN';
END

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'cases' AND COLUMN_NAME = 'results')
BEGIN
    EXEC sp_rename 'cases.results', 'resultaten', 'COLUMN';
END

-- Check Kennisitems tabel
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'kennisitems' AND COLUMN_NAME = 'featured')
BEGIN
    ALTER TABLE kennisitems ADD featured BIT DEFAULT 0;
END

-- Check Trends tabel
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'trends' AND COLUMN_NAME = 'bronnen')
BEGIN
    ALTER TABLE trends ADD bronnen NVARCHAR(MAX);
END

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'trends' AND COLUMN_NAME = 'bron')
BEGIN
    -- Migreer data van bron naar bronnen (als JSON array)
    UPDATE trends SET bronnen = CONCAT('["', bron, '"]') WHERE bron IS NOT NULL;
    ALTER TABLE trends DROP COLUMN bron;
END

-- Add eigenaar column to trends table if it doesn't exist
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'trends' AND COLUMN_NAME = 'eigenaar')
    ALTER TABLE trends ADD eigenaar NVARCHAR(200);

PRINT 'Schema update voltooid!';
-- Add referenties column to cases table
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[cases]') AND name = 'referenties')
BEGIN
    ALTER TABLE cases ADD referenties NVARCHAR(MAX);
END
GO

