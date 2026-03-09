import type { APIRoute } from 'astro';
import { getPool } from '../../../lib/db-config';
import type { Video } from '../../../types';
import sql from 'mssql';

// Helper: YouTube video ID extraheren
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Helper: YouTube thumbnail URL genereren
function getYouTubeThumbnail(url: string): string | null {
  const videoId = extractYouTubeId(url);
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

// Mapper functie
function mapVideo(row: any): Video {
  return {
    id: Number(row.id),
    titel: String(row.titel || ''),
    beschrijving: row.beschrijving ? String(row.beschrijving) : undefined,
    youtube_url: String(row.youtube_url || ''),
    thumbnail_url: row.thumbnail_url ? String(row.thumbnail_url) : undefined,
    categorie: String(row.categorie || ''),
    tags: row.tags ? String(row.tags) : undefined,
    eigenaar: row.eigenaar ? String(row.eigenaar) : undefined,
    datum_toegevoegd: row.datum_toegevoegd ? new Date(row.datum_toegevoegd).toISOString() : new Date().toISOString(),
    laatst_bijgewerkt: row.laatst_bijgewerkt ? new Date(row.laatst_bijgewerkt).toISOString() : new Date().toISOString(),
    views: Number(row.views || 0),
    featured: Boolean(row.featured)
  };
}

export const GET: APIRoute = async ({ params, locals }) => {
  try {
    const pool = await getPool();
    const { id } = params;
    
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM videos WHERE id = @id');
    
    if (result.recordset.length === 0) {
      return new Response(JSON.stringify({ error: 'Video not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Increment views
    await pool.request()
      .input('id', sql.Int, id)
      .query('UPDATE videos SET views = views + 1 WHERE id = @id');
    
    const video = mapVideo(result.recordset[0]);
    
    return new Response(JSON.stringify(video), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching video:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch video' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ params, request, locals }) => {
  try {
    const pool = await getPool();
    const { id } = params;
    
    const body = await request.json();
    const { titel, beschrijving, youtube_url, categorie, tags, eigenaar, featured } = body;
    
    // Als youtube_url is gewijzigd, update ook de thumbnail
    let thumbnail_url = body.thumbnail_url;
    if (youtube_url) {
      thumbnail_url = getYouTubeThumbnail(youtube_url);
    }
    
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('titel', sql.NVarChar, titel)
      .input('beschrijving', sql.NVarChar, beschrijving || null)
      .input('youtube_url', sql.NVarChar, youtube_url)
      .input('thumbnail_url', sql.NVarChar, thumbnail_url)
      .input('categorie', sql.NVarChar, categorie)
      .input('tags', sql.NVarChar, tags || null)
      .input('eigenaar', sql.NVarChar, eigenaar || null)
      .input('featured', sql.Bit, featured || false)
      .query(`
        UPDATE videos 
        SET titel = @titel,
            beschrijving = @beschrijving,
            youtube_url = @youtube_url,
            thumbnail_url = @thumbnail_url,
            categorie = @categorie,
            tags = @tags,
            eigenaar = @eigenaar,
            featured = @featured,
            laatst_bijgewerkt = GETDATE()
        OUTPUT INSERTED.*
        WHERE id = @id
      `);
    
    if (result.recordset.length === 0) {
      return new Response(JSON.stringify({ error: 'Video not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const video = mapVideo(result.recordset[0]);
    
    return new Response(JSON.stringify(video), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating video:', error);
    return new Response(JSON.stringify({ error: 'Failed to update video' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  try {
    const pool = await getPool();
    const { id } = params;
    
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM videos WHERE id = @id');
    
    if (result.rowsAffected[0] === 0) {
      return new Response(JSON.stringify({ error: 'Video not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ message: 'Video deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting video:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete video' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};


