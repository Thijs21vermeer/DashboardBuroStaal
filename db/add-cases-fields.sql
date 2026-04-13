-- Migration: Add missing columns to Cases table

-- Add industrie column
ALTER TABLE Cases ADD COLUMN industrie TEXT;

-- Add uitdaging (challenge) column
ALTER TABLE Cases ADD COLUMN uitdaging TEXT;

-- Add oplossing (solution) column
ALTER TABLE Cases ADD COLUMN oplossing TEXT;

-- Add resultaten (results array) column
ALTER TABLE Cases ADD COLUMN resultaten TEXT;

-- Add referenties (references/testimonials) column
ALTER TABLE Cases ADD COLUMN referenties TEXT;

-- Add eigenaar (owner) column
ALTER TABLE Cases ADD COLUMN eigenaar TEXT;

-- Add datum (date) column
ALTER TABLE Cases ADD COLUMN datum TEXT;

-- Add featured flag column
ALTER TABLE Cases ADD COLUMN featured INTEGER DEFAULT 0;
