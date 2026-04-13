-- Migration: Add missing columns to Nieuws table

-- Add samenvatting (summary) column
ALTER TABLE Nieuws ADD COLUMN samenvatting TEXT;

-- Add categorie column
ALTER TABLE Nieuws ADD COLUMN categorie TEXT;

-- Add datum (date) column
ALTER TABLE Nieuws ADD COLUMN datum TEXT;

-- Add belangrijk (important flag) column
ALTER TABLE Nieuws ADD COLUMN belangrijk INTEGER DEFAULT 0;
