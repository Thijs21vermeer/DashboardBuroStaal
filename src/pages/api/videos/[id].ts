import type { APIRoute } from 'astro';
import { getPool } from '../../../lib/azure-db';
import sql from 'mssql';
import { requireAuth } from '../../../lib/api-auth';
import type { Video, VideoRequest } from '../../../types';

// GET - Haal een specifieke video op
export const GET: APIRoute = async ({ params, request, locals }) => {
  const authError = await requireAuth({ request, locals });
  if (authError) return authError;
  
  try {
    const { id } = params;
    const dbPool = await getPool(locals);
    
    const result = await dbPool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM videos WHERE id = @id');
    
    if (result.recordset.length === 0) {
      return new Response(JSON.stringify({ error: 'Video not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Increment views
    await dbPool.request()
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

// PUT - Werk een video bij
export const PUT: APIRoute = async ({ params, request, locals }) => {
  const authError = await requireAuth({ request, locals });
  if (authError) return authError;
  
  const { id } = params;
  
  if (!id) {
    return new Response(JSON.stringify({ error: 'Video ID is verplicht' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const data = await request.json() as VideoRequest & { thumbnail_url?: string };
    const dbPool = await getPool(locals);
    
    if (!data.titel || !data.youtube_url || !data.categorie) {
      return new Response(JSON.stringify({ error: 'Titel, YouTube URL en categorie zijn verplicht' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log('Updating video:', { id, ...data });
    
    // Als youtube_url is gewijzigd, update ook de thumbnail
    let thumbnail_url = data.thumbnail_url;
    if (data.youtube_url) {
      const thumb = getYouTubeThumbnail(data.youtube_url);
      thumbnail_url = thumb ?? undefined;
    }
    
    const result = await dbPool.request()
      .input('id', sql.Int, parseInt(id))
      .input('titel', sql.NVarChar, data.titel)
      .input('beschrijving', sql.NVarChar, data.beschrijving || null)
      .input('youtube_url', sql.NVarChar, data.youtube_url)
      .input('thumbnail_url', sql.NVarChar, thumbnail_url)
      .input('categorie', sql.NVarChar, data.categorie)
      .input('tags', sql.NVarChar, data.tags || null)
      .input('eigenaar', sql.NVarChar, data.eigenaar || null)
      .input('featured', sql.Bit, data.featured ? 1 : 0)
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
        WHERE id = @id;
        
        SELECT * FROM videos WHERE id = @id;
      `);
    
    if (!result.recordset || result.recordset.length === 0) {
      return new Response(JSON.stringify({ error: 'Video not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const video = mapVideo(result.recordset[0]);
    console.log('Video updated successfully:', video.id);
    
    return new Response(JSON.stringify(video), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating video:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ 
      error: 'Failed to update video',
      details: errorMessage 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// DELETE - Verwijder een video
export const DELETE: APIRoute = async ({ params, request, locals }) => {
  const authError = await requireAuth({ request, locals });
  if (authError) return authError;
  
  try {
    const { id } = params;
    const dbPool = await getPool(locals);
    
    const result = await dbPool.request()
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








