-- Voeg afbeelding kolom toe aan kennisitems tabel
-- Deze kolom slaat de URL of base64 string van de afbeelding op

ALTER TABLE kennisitems
ADD afbeelding NVARCHAR(MAX);

-- Optioneel: voeg een index toe voor betere performance
CREATE INDEX idx_kennisitems_afbeelding ON kennisitems(afbeelding) WHERE afbeelding IS NOT NULL;
