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

// GET - Haal een specifiek nieuwsitem op
export const GET: APIRoute = async ({ params }) => {
  const { id } = params;
  
  try {
    const dbPool = await getPool();
    const result = await dbPool.request()
      .input('id', sql.Int, Number(id))
      .query('SELECT * FROM Nieuws WHERE id = @id');

    if (result.recordset.length === 0) {
      return new Response(JSON.stringify({ error: 'Nieuws not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const nieuws = mapDbToNewsItem(result.recordset[0]);
    return new Response(JSON.stringify(nieuws), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return handleDbError(error, 'fetch nieuws by id');
  }
};

// PUT - Update een nieuwsitem
export const PUT: APIRoute = async ({ params, request, locals }) => {
  // Check authentication
  const authError = await requireAuth({ request, locals } as any);
  if (authError) return authError;
  
  try {
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await request.json();
    const dbPool = await getPool();

    const result = await dbPool.request()
      .input('id', sql.Int, parseInt(id))
      .input('titel', sql.NVarChar, data.titel)
      .input('categorie', sql.NVarChar, data.categorie)
      .input('inhoud', sql.NVarChar(sql.MAX), data.inhoud || null)
      .input('auteur', sql.NVarChar, data.auteur || null)
      .input('tags', sql.NVarChar, JSON.stringify(data.tags || []))
      .query(`
        UPDATE Nieuws 
        SET 
          titel = @titel,
          categorie = @categorie,
          inhoud = @inhoud,
          auteur = @auteur,
          tags = @tags
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      return new Response(JSON.stringify({ error: 'Nieuws not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updatedNieuws = mapDbToNewsItem(result.recordset[0]);
    return new Response(JSON.stringify(updatedNieuws), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return handleDbError(error, 'update nieuws');
  }
};

// DELETE - Verwijder een nieuwsitem
export const DELETE: APIRoute = async ({ params, request, locals }) => {
  // Check authentication
  const authError = await requireAuth({ request, locals } as any);
  if (authError) return authError;
  
  try {
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const dbPool = await getPool();
    const result = await dbPool.request()
      .input('id', sql.Int, parseInt(id))
      .query('DELETE FROM Nieuws WHERE id = @id');

    if (result.rowsAffected[0] === 0) {
      return new Response(JSON.stringify({ error: 'Nieuws not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ message: 'Nieuws deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return handleDbError(error, 'delete nieuws');
  }
};





