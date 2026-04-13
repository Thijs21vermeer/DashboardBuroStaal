-- Migration: Add missing columns to Trends table

-- Add samenvatting (summary) column
ALTER TABLE Trends ADD COLUMN samenvatting TEXT;

-- Add inhoud (full content) column
ALTER TABLE Trends ADD COLUMN inhoud TEXT;

-- Add bron (source) column
ALTER TABLE Trends ADD COLUMN bron TEXT;

-- Add relevantie (relevance) column
ALTER TABLE Trends ADD COLUMN relevantie TEXT DEFAULT 'Middel';

-- Add datum_gepubliceerd (publish date) column
ALTER TABLE Trends ADD COLUMN datum_gepubliceerd TEXT;
