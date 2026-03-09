-- Videos tabel voor instructievideo catalogus
-- YouTube instructievideo's voor klanten over website beheer

CREATE TABLE videos (
    id INT IDENTITY(1,1) PRIMARY KEY,
    titel NVARCHAR(500) NOT NULL,
    beschrijving NVARCHAR(MAX),
    youtube_url NVARCHAR(500) NOT NULL,
    thumbnail_url NVARCHAR(500),
    categorie NVARCHAR(200) NOT NULL, -- bijv: 'CMS Instructies', 'Website Beheer', 'SEO Tools'
    tags NVARCHAR(MAX), -- JSON array of comma separated
    eigenaar NVARCHAR(200),
    datum_toegevoegd DATETIME2 DEFAULT GETDATE(),
    laatst_bijgewerkt DATETIME2 DEFAULT GETDATE(),
    views INT DEFAULT 0,
    featured BIT DEFAULT 0
);

-- Indices voor betere performance
CREATE INDEX idx_videos_categorie ON videos(categorie);
CREATE INDEX idx_videos_featured ON videos(featured);
CREATE INDEX idx_videos_datum ON videos(datum_toegevoegd);

-- Trigger voor laatst_bijgewerkt
CREATE TRIGGER trg_videos_update
ON videos
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE videos
    SET laatst_bijgewerkt = GETDATE()
    FROM videos v
    INNER JOIN inserted i ON v.id = i.id;
END;
GO
