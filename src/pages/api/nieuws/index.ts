import type { APIRoute } from 'astro';
import sql from 'mssql';
import { getPool, handleDbError } from '../../../lib/db-config';
import { requireAuth } from '../../../lib/api-auth';
import type { NewsItem } from '../../../types';

// Helper functie om database records te mappen naar TypeScript types
function mapDbToNewsItem(dbRecord: any): NewsItem {
  let tags: string[] = [];
  
  if (dbRecord.tags) {
    try {
      // Probeer te parsen als JSON
      const parsed = JSON.parse(dbRecord.tags);
      tags = Array.isArray(parsed) ? parsed : [];
    } catch {
      // Als het geen JSON is, splits de string op komma's
      if (typeof dbRecord.tags === 'string') {
        tags = dbRecord.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag);
      }
    }
  }
  
  return {
    id: String(dbRecord.id),
    titel: dbRecord.titel,
    categorie: dbRecord.categorie as 'Bedrijfsnieuws' | 'Team Update' | 'Project Lancering' | 'Prestatie' | 'Algemeen',
    inhoud: dbRecord.inhoud,
    auteur: dbRecord.auteur,
    datum: dbRecord.datum,
    tags,
  };
}

// GET - Haal alle nieuwsitems op
export const GET: APIRoute = async () => {
  try {
    const dbPool = await getPool();
    const result = await dbPool.request().query('SELECT * FROM Nieuws ORDER BY datum DESC');
    
    // Map database records to TypeScript types
    const news = result.recordset.map(mapDbToNewsItem);

    return new Response(JSON.stringify(news), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    return handleDbError(error, 'fetch nieuws');
  }
};

// POST - Voeg een nieuw nieuwsitem toe
export const POST: APIRoute = async ({ request, locals }) => {
  // Check authentication
  const authError = requireAuth({ request, locals } as any);
  if (authError) return authError;
  
  try {
    const data = await request.json();
    const dbPool = await getPool();
    
    const result = await dbPool.request()
      .input('titel', sql.NVarChar, data.titel)
      .input('categorie', sql.NVarChar, data.categorie)
      .input('inhoud', sql.NVarChar(sql.MAX), data.inhoud || null)
      .input('auteur', sql.NVarChar, data.auteur || null)
      .input('tags', sql.NVarChar, JSON.stringify(data.tags || []))
      .query(`
        INSERT INTO Nieuws 
        (titel, categorie, inhoud, auteur, datum, featured, tags)
        OUTPUT INSERTED.*
        VALUES 
        (@titel, @categorie, @inhoud, @auteur, GETDATE(), 0, @tags)
      `);

    const newNieuws = mapDbToNewsItem(result.recordset[0]);
    return new Response(JSON.stringify(newNieuws), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return handleDbError(error, 'create nieuws');
  }
};





