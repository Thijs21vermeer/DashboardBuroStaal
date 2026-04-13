-- Add missing fields to KennisItems table

-- Add eigenaar column
ALTER TABLE KennisItems ADD COLUMN eigenaar TEXT;

-- Add gekoppeldProject column  
ALTER TABLE KennisItems ADD COLUMN gekoppeldProject TEXT;

-- Add videoLink column
ALTER TABLE KennisItems ADD COLUMN videoLink TEXT;
