-- Migration: Add impact description and recommendations to Trends table
-- The old 'impact' column is a short enum-like field (hoog/middel/laag)
-- We need proper text fields for impact description and recommendations

-- Add impact_beschrijving (impact description) column
ALTER TABLE trends ADD COLUMN impact_beschrijving TEXT;

-- Add aanbevelingen (recommendations) column  
ALTER TABLE trends ADD COLUMN aanbevelingen TEXT;

-- Add eigenaar (owner) column
ALTER TABLE trends ADD COLUMN eigenaar TEXT;

-- Add views counter
ALTER TABLE trends ADD COLUMN views INTEGER DEFAULT 0;

-- Add sector field
ALTER TABLE trends ADD COLUMN sector TEXT;

