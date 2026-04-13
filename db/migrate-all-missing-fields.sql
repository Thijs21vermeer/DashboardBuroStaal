-- ================================================
-- COMPLETE MIGRATION: Add all missing fields
-- ================================================
-- Run this against your database to add all missing columns
-- 
-- For Turso/SQLite: 
--   turso db shell your-db < db/migrate-all-missing-fields.sql
--
-- For Azure SQL:
--   Run manually in Azure Portal SQL Query Editor
-- ================================================

-- =====================================
-- 1. KENNISITEMS TABLE
-- =====================================
ALTER TABLE KennisItems ADD COLUMN eigenaar TEXT;
ALTER TABLE KennisItems ADD COLUMN gekoppeldProject TEXT;
ALTER TABLE KennisItems ADD COLUMN videoLink TEXT;

-- =====================================
-- 2. TRENDS TABLE
-- =====================================
ALTER TABLE Trends ADD COLUMN samenvatting TEXT;
ALTER TABLE Trends ADD COLUMN inhoud TEXT;
ALTER TABLE Trends ADD COLUMN bron TEXT;
ALTER TABLE Trends ADD COLUMN relevantie TEXT DEFAULT 'Middel';
ALTER TABLE Trends ADD COLUMN datum_gepubliceerd TEXT;

-- =====================================
-- 3. CASES TABLE
-- =====================================
ALTER TABLE Cases ADD COLUMN industrie TEXT;
ALTER TABLE Cases ADD COLUMN uitdaging TEXT;
ALTER TABLE Cases ADD COLUMN oplossing TEXT;
ALTER TABLE Cases ADD COLUMN resultaten TEXT;
ALTER TABLE Cases ADD COLUMN referenties TEXT;
ALTER TABLE Cases ADD COLUMN eigenaar TEXT;
ALTER TABLE Cases ADD COLUMN datum TEXT;
ALTER TABLE Cases ADD COLUMN featured INTEGER DEFAULT 0;

-- =====================================
-- 4. NIEUWS TABLE
-- =====================================
ALTER TABLE Nieuws ADD COLUMN samenvatting TEXT;
ALTER TABLE Nieuws ADD COLUMN categorie TEXT;
ALTER TABLE Nieuws ADD COLUMN datum TEXT;
ALTER TABLE Nieuws ADD COLUMN belangrijk INTEGER DEFAULT 0;

-- =====================================
-- MIGRATION COMPLETE
-- =====================================
-- After running this migration, restart your application
-- All admin panels should now save all fields correctly
