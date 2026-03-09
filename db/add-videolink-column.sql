-- Add videoLink column to kennisitems table
-- Run this in Azure Portal SQL Query Editor

-- Check if column exists, if not add it
IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'kennisitems' 
    AND COLUMN_NAME = 'video_link'
)
BEGIN
    ALTER TABLE kennisitems
    ADD video_link NVARCHAR(1000) NULL;
    
    PRINT 'Column video_link added successfully';
END
ELSE
BEGIN
    PRINT 'Column video_link already exists';
END
