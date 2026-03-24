import type { APIRoute } from 'astro';
import { getPool } from '../../../lib/azure-db';
import sql from 'mssql';
import { requireAuth } from '../../../lib/api-auth';
import type { Video, VideoRequest } from '../../../types';

// GET - Haal alle videos op
export const GET: APIRoute = async ({ request, locals }) => {
  const authError = await requireAuth({ request, locals });
  if (authError) return authError;
  
  try {
    const dbPool = await getPool(locals);
    const url = new URL(request.url);
    const categorie = url.searchParams.get('categorie');
    const featured = url.searchParams.get('featured');
    
    let query = 'SELECT * FROM videos WHERE 1=1';
    const inputs: any[] = [];
    
    if (categorie) {
      query += ' AND categorie = @categorie';
      inputs.push({ name: 'categorie', type: sql.NVarChar, value: categorie });
    }
    
    if (featured === 'true') {
      query += ' AND featured = 1';
    }
    
    query += ' ORDER BY datum_toegevoegd DESC';
    
    const requestObj = dbPool.request();
    inputs.forEach(input => {
      requestObj.input(input.name, input.type, input.value);
    });
    
    const result = await requestObj.query(query);
    const videos = result.recordset.map(mapVideo);
    
    return new Response(JSON.stringify(videos), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return new Response(JSON.stringify({ error: 'Failed to fetch videos', details: error instanceof Error ? error.message : String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// POST - Voeg een nieuwe video toe
export const POST: APIRoute = async ({ request, locals }) => {
  const authError = await requireAuth({ request, locals });
  if (authError) return authError;
  
  try {
    const data = await request.json() as VideoRequest;
    const dbPool = await getPool(locals);
    const { titel, beschrijving, youtube_url, categorie, tags, eigenaar, featured } = data;
    
    if (!titel || !youtube_url || !categorie) {
      return new Response(JSON.stringify({ error: 'Titel, YouTube URL en categorie zijn verplicht' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Automatisch thumbnail genereren
    const thumbnail_url = getYouTubeThumbnail(youtube_url);
    
    const result = await dbPool.request()
      .input('titel', sql.NVarChar, titel)
      .input('beschrijving', sql.NVarChar, beschrijving || null)
      .input('youtube_url', sql.NVarChar, youtube_url)
      .input('thumbnail_url', sql.NVarChar, thumbnail_url)
      .input('categorie', sql.NVarChar, categorie)
      .input('tags', sql.NVarChar, tags || null)
      .input('eigenaar', sql.NVarChar, eigenaar || null)
      .input('featured', sql.Bit, featured || false)
      .query(`
        INSERT INTO videos (titel, beschrijving, youtube_url, thumbnail_url, categorie, tags, eigenaar, featured)
        OUTPUT INSERTED.*
        VALUES (@titel, @beschrijving, @youtube_url, @thumbnail_url, @categorie, @tags, @eigenaar, @featured)
      `);
    
    const video = mapVideo(result.recordset[0]);
    
    return new Response(JSON.stringify(video), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating video:', error);
    return new Response(JSON.stringify({ error: 'Failed to create video' }), {
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

// Mapper functie voor consistente type conversie
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











