import type { APIRoute } from 'astro';
import { getPool } from '../../../lib/azure-db';
import type { KennisItem } from '../../../types';

interface KennisItemUpdate {
  titel?: string;
  type?: string;
  tags?: string[];
  gekoppeldProject?: string;
  eigenaar?: string;
  samenvatting?: string;
  inhoud?: string;
}

export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    const pool = await getPool();
    
    const result = await pool.request()
      .input('id', id)
      .query(`
        SELECT 
          CAST(id AS VARCHAR) as id,
          titel,
          type,
          tags,
          gekoppeld_project as gekoppeldProject,
          eigenaar,
          samenvatting,
          inhoud,
          CONVERT(VARCHAR, datum_toegevoegd, 23) as datumToegevoegd,
          CONVERT(VARCHAR, laatst_bijgewerkt, 23) as laatstBijgewerkt,
          views
        FROM kennisitems
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      return new Response(JSON.stringify({ error: 'Item not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const row = result.recordset[0];
    const item: KennisItem = {
      id: row.id,
      titel: row.titel,
      type: row.type,
      tags: row.tags ? JSON.parse(row.tags) : [],
      gekoppeldProject: row.gekoppeldProject,
      eigenaar: row.eigenaar,
      samenvatting: row.samenvatting || '',
      inhoud: row.inhoud || '',
      datumToegevoegd: row.datumToegevoegd,
      laatstBijgewerkt: row.laatstBijgewerkt,
      views: row.views || 0,
    };

    return new Response(JSON.stringify(item), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error fetching kennisitem:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;
    const body: KennisItemUpdate = await request.json();
    const { titel, type, tags, gekoppeldProject, eigenaar, samenvatting, inhoud } = body;

    const pool = await getPool();
    const result = await pool.request()
      .input('id', id)
      .input('titel', titel)
      .input('type', type)
      .input('tags', JSON.stringify(tags || []))
      .input('gekoppeld_project', gekoppeldProject || null)
      .input('eigenaar', eigenaar)
      .input('samenvatting', samenvatting || '')
      .input('inhoud', inhoud || '')
      .query(`
        UPDATE kennisitems
        SET titel = @titel,
            type = @type,
            tags = @tags,
            gekoppeld_project = @gekoppeld_project,
            eigenaar = @eigenaar,
            samenvatting = @samenvatting,
            inhoud = @inhoud,
            laatst_bijgewerkt = GETDATE()
        OUTPUT INSERTED.id, INSERTED.titel, INSERTED.type, INSERTED.tags, INSERTED.gekoppeld_project,
               INSERTED.eigenaar, INSERTED.samenvatting, INSERTED.inhoud,
               INSERTED.datum_toegevoegd, INSERTED.laatst_bijgewerkt, INSERTED.views
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      return new Response(JSON.stringify({ error: 'Item not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const row = result.recordset[0];
    const updatedItem: KennisItem = {
      id: String(row.id),
      titel: row.titel,
      type: row.type,
      tags: JSON.parse(row.tags),
      gekoppeldProject: row.gekoppeld_project,
      eigenaar: row.eigenaar,
      samenvatting: row.samenvatting,
      inhoud: row.inhoud,
      datumToegevoegd: row.datum_toegevoegd,
      laatstBijgewerkt: row.laatst_bijgewerkt,
      views: row.views,
    };

    return new Response(JSON.stringify(updatedItem), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error updating kennisitem:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    const pool = await getPool();
    
    await pool.request()
      .input('id', id)
      .query('DELETE FROM kennisitems WHERE id = @id');

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error deleting kennisitem:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

