import type { APIRoute } from 'astro';
import { getPool } from '../../../lib/db-config';
import sql from 'mssql';
import { requireAuth } from '../../../lib/api-auth';
import type { Tool, ToolRequest } from '../../../types';

export const GET: APIRoute = async ({ request, locals }) => {
  // Check authentication
  const authError = await requireAuth({ request, locals });
  if (authError) return authError;

  try {
    const dbPool = await getPool(locals);
    const result = await dbPool.request().query(`
      SELECT 
        id,
        titel,
        categorie,
        beschrijving,
        code,
        taal,
        tags,
        eigenaar,
        datum_toegevoegd,
        laatst_bijgewerkt,
        gebruik_count,
        favoriet
      FROM tools
      ORDER BY favoriet DESC, laatst_bijgewerkt DESC
    `);

    const tools = result.recordset.map(row => ({
      ...row,
      favoriet: Boolean(row.favoriet),
      gebruik_count: row.gebruik_count || 0
    }));

    return new Response(JSON.stringify(tools), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ 
      error: 'Database error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// POST - Voeg een nieuwe tool toe
export const POST: APIRoute = async ({ request, locals }) => {
  // Check authentication
  const authError = await requireAuth({ request, locals });
  if (authError) return authError;
  
  try {
    const data = (await request.json()) as ToolRequest;
    const dbPool = await getPool(locals);
    const { titel, categorie, beschrijving, code, taal, tags, eigenaar, favoriet } = data;

    const dbRequest = dbPool.request();
    dbRequest.input('titel', sql.NVarChar, titel);
    dbRequest.input('categorie', sql.NVarChar, categorie);
    dbRequest.input('beschrijving', sql.NVarChar, beschrijving || null);
    dbRequest.input('code', sql.NVarChar, code);
    dbRequest.input('taal', sql.NVarChar, taal || null);
    dbRequest.input('tags', sql.NVarChar, tags || null);
    dbRequest.input('eigenaar', sql.NVarChar, eigenaar || null);
    dbRequest.input('favoriet', sql.Bit, favoriet ? 1 : 0);

    const result = await dbRequest.query(`
      INSERT INTO tools (titel, categorie, beschrijving, code, taal, tags, eigenaar, favoriet)
      OUTPUT INSERTED.*
      VALUES (@titel, @categorie, @beschrijving, @code, @taal, @tags, @eigenaar, @favoriet)
    `);

    return new Response(JSON.stringify(result.recordset[0]), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ 
      error: 'Database error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};






