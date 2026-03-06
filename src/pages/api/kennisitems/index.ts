import type { APIRoute } from 'astro';
import sql from 'mssql';
import { getPool, handleDbError } from '../../../lib/db-config';

// GET - Haal alle kennisitems op
export const GET: APIRoute = async () => {
  try {
    const dbPool = await getPool();
    const result = await dbPool.request().query('SELECT * FROM KennisItems ORDER BY datum_toegevoegd DESC');
    
    // Parse JSON fields
    const items = result.recordset.map(item => ({
      ...item,
      tags: item.tags ? JSON.parse(item.tags) : [],
    }));

    return new Response(JSON.stringify(items), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    return handleDbError(error, 'fetch kennisitems');
  }
};

// POST - Voeg een nieuw kennisitem toe
export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const dbPool = await getPool();
    
    const result = await dbPool.request()
      .input('titel', sql.NVarChar, data.titel)
      .input('type', sql.NVarChar, data.type)
      .input('tags', sql.NVarChar, JSON.stringify(data.tags || []))
      .input('gekoppeld_project', sql.NVarChar, data.gekoppeldProject || null)
      .input('eigenaar', sql.NVarChar, data.eigenaar)
      .input('samenvatting', sql.NVarChar, data.samenvatting || null)
      .input('inhoud', sql.NVarChar(sql.MAX), data.inhoud || null)
      .input('media_type', sql.NVarChar, data.mediaType || null)
      .input('media_url', sql.NVarChar, data.mediaUrl || null)
      .query(`
        INSERT INTO KennisItems 
        (titel, type, tags, gekoppeld_project, eigenaar, samenvatting, inhoud, media_type, media_url, datum_toegevoegd, laatst_bijgewerkt, views, featured)
        OUTPUT INSERTED.*
        VALUES 
        (@titel, @type, @tags, @gekoppeld_project, @eigenaar, @samenvatting, @inhoud, @media_type, @media_url, GETDATE(), GETDATE(), 0, 0)
      `);

    const newItem = result.recordset[0];
    return new Response(JSON.stringify({
      ...newItem,
      tags: JSON.parse(newItem.tags || '[]')
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return handleDbError(error, 'create kennisitem');
  }
};


