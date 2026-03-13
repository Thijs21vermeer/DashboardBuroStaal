import type { APIRoute } from 'astro';
import sql from 'mssql';
import { getPool, handleDbError } from '../../../lib/db-config';
import type { KennisItem } from '../../../types';

// Helper functie om database records te mappen naar TypeScript types
function mapDbToKennisItem(dbRecord: any): KennisItem {
  // Parse tags safely
  let tags: string[] = [];
  if (dbRecord.tags) {
    if (typeof dbRecord.tags === 'string') {
      try {
        tags = JSON.parse(dbRecord.tags);
      } catch {
        tags = [];
      }
    } else if (Array.isArray(dbRecord.tags)) {
      tags = dbRecord.tags;
    }
  }

  return {
    id: dbRecord.id,
    titel: dbRecord.titel,
    type: dbRecord.type,
    categorie: dbRecord.categorie || dbRecord.type || 'Algemeen',
    tags,
    gekoppeldProject: dbRecord.gekoppeld_project || undefined,
    eigenaar: dbRecord.eigenaar,
    auteur: dbRecord.eigenaar, // Alias voor frontend compatibility
    samenvatting: dbRecord.samenvatting,
    inhoud: dbRecord.inhoud,
    datumToegevoegd: dbRecord.datum_toegevoegd,
    laatstBijgewerkt: dbRecord.laatst_bijgewerkt,
    views: dbRecord.views || 0,
    featured: dbRecord.featured || false,
    videoLink: dbRecord.video_link || undefined,
    afbeelding: dbRecord.afbeelding || undefined,
  };
}

// GET - Haal een specifiek kennisitem op
export const GET: APIRoute = async ({ params }) => {
  const { id } = params;
  
  try {
    const dbPool = await getPool();
    const result = await dbPool.request()
      .input('id', sql.Int, Number(id))
      .query('SELECT * FROM KennisItems WHERE id = @id');

    if (result.recordset.length === 0) {
      return new Response(JSON.stringify({ error: 'Item not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const item = mapDbToKennisItem(result.recordset[0]);
    return new Response(JSON.stringify(item), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return handleDbError(error, 'fetch kennisitem by id');
  }
};

// PUT - Update een kennisitem
export const PUT: APIRoute = async ({ params, request }) => {
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
      .input('type', sql.NVarChar, data.type)
      .input('categorie', sql.NVarChar, data.categorie || data.type || 'Algemeen')
      .input('tags', sql.NVarChar, JSON.stringify(data.tags || []))
      .input('gekoppeld_project', sql.NVarChar, data.gekoppeld_project || null)
      .input('eigenaar', sql.NVarChar, data.eigenaar)
      .input('samenvatting', sql.NVarChar, data.samenvatting || null)
      .input('inhoud', sql.NVarChar(sql.MAX), data.inhoud || null)
      .input('media_type', sql.NVarChar, data.media_type || null)
      .input('media_url', sql.NVarChar, data.media_url || null)
      .input('video_link', sql.NVarChar, data.video_link || null)
      .input('afbeelding', sql.NVarChar(sql.MAX), data.afbeelding || null)
      .query(`
        UPDATE KennisItems 
        SET 
          titel = @titel,
          type = @type,
          categorie = @categorie,
          tags = @tags,
          gekoppeld_project = @gekoppeld_project,
          eigenaar = @eigenaar,
          samenvatting = @samenvatting,
          inhoud = @inhoud,
          media_type = @media_type,
          media_url = @media_url,
          video_link = @video_link,
          afbeelding = @afbeelding,
          laatst_bijgewerkt = GETDATE()
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      return new Response(JSON.stringify({ error: 'Kennisitem not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updatedItem = mapDbToKennisItem(result.recordset[0]);
    return new Response(JSON.stringify(updatedItem), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return handleDbError(error, 'update kennisitem');
  }
};

// DELETE - Verwijder een kennisitem
export const DELETE: APIRoute = async ({ params }) => {
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
      .query('DELETE FROM KennisItems WHERE id = @id');

    if (result.rowsAffected[0] === 0) {
      return new Response(JSON.stringify({ error: 'Kennisitem not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ message: 'Kennisitem deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return handleDbError(error, 'delete kennisitem');
  }
};











