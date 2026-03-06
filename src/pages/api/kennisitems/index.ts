import type { APIRoute } from 'astro';
import { getPool } from '../../../lib/azure-db';
import type { KennisItem } from '../../../types';

interface KennisItemInput {
  titel: string;
  type: string;
  tags: string[];
  gekoppeldProject?: string;
  eigenaar: string;
  samenvatting: string;
  inhoud: string;
}

export const GET: APIRoute = async () => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
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
      ORDER BY datum_toegevoegd DESC
    `);

    const items: KennisItem[] = result.recordset.map((row: any) => ({
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
    }));

    return new Response(JSON.stringify(items), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error fetching kennisitems:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body: KennisItemInput = await request.json();
    const { titel, type, tags, gekoppeldProject, eigenaar, samenvatting, inhoud } = body;

    const pool = await getPool();
    const result = await pool.request()
      .input('titel', titel)
      .input('type', type)
      .input('tags', JSON.stringify(tags || []))
      .input('gekoppeld_project', gekoppeldProject || null)
      .input('eigenaar', eigenaar)
      .input('samenvatting', samenvatting || '')
      .input('inhoud', inhoud || '')
      .query(`
        INSERT INTO kennisitems (titel, type, tags, gekoppeld_project, eigenaar, samenvatting, inhoud)
        OUTPUT INSERTED.id, INSERTED.titel, INSERTED.type, INSERTED.tags, INSERTED.gekoppeld_project, 
               INSERTED.eigenaar, INSERTED.samenvatting, INSERTED.inhoud, 
               INSERTED.datum_toegevoegd, INSERTED.laatst_bijgewerkt, INSERTED.views
        VALUES (@titel, @type, @tags, @gekoppeld_project, @eigenaar, @samenvatting, @inhoud)
      `);

    const row = result.recordset[0];
    const newItem: KennisItem = {
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

    return new Response(JSON.stringify(newItem), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error creating kennisitem:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

