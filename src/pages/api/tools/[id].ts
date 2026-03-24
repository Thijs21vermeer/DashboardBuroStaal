import type { APIRoute } from 'astro';
import { getPool } from '../../../lib/db-config';
import sql from 'mssql';
import { requireAuth } from '../../../lib/api-auth';
import type { Tool, ToolRequest } from '../../../types';

// GET - Haal een specifieke tool op
export const GET: APIRoute = async ({ params, request, locals }) => {
  // Check authentication
  const authError = await requireAuth({ request, locals });
  if (authError) return authError;

  try {
    const { id } = params;
    const dbPool = await getPool(locals);
    const dbRequest = dbPool.request();
    dbRequest.input('id', sql.Int, parseInt(id || '0'));
    const result = await dbRequest.query('SELECT * FROM tools WHERE id = @id');

    if (!result.recordset || result.recordset.length === 0) {
      return new Response(JSON.stringify({ error: 'Tool not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const tool = {
      ...result.recordset[0],
      favoriet: Boolean(result.recordset[0].favoriet)
    };

    return new Response(JSON.stringify(tool), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ error: 'Database error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// PUT - Update een tool
export const PUT: APIRoute = async ({ params, request, locals }) => {
  // Check authentication
  const authError = await requireAuth({ request, locals });
  if (authError) return authError;
  
  try {
    const { id } = params;
    const body = (await request.json()) as ToolRequest;
    const { titel, categorie, beschrijving, code, taal, tags, eigenaar, favoriet } = body;
    const dbPool = await getPool(locals);

    const dbRequest = dbPool.request();
    dbRequest.input('id', sql.Int, parseInt(id || '0'));
    dbRequest.input('titel', sql.NVarChar, titel);
    dbRequest.input('categorie', sql.NVarChar, categorie);
    dbRequest.input('beschrijving', sql.NVarChar, beschrijving || null);
    dbRequest.input('code', sql.NVarChar, code);
    dbRequest.input('taal', sql.NVarChar, taal || null);
    dbRequest.input('tags', sql.NVarChar, tags || null);
    dbRequest.input('eigenaar', sql.NVarChar, eigenaar || null);
    dbRequest.input('favoriet', sql.Bit, favoriet ? 1 : 0);

    const result = await dbRequest.query(`
      UPDATE tools
      SET titel = @titel,
          categorie = @categorie,
          beschrijving = @beschrijving,
          code = @code,
          taal = @taal,
          tags = @tags,
          eigenaar = @eigenaar,
          favoriet = @favoriet,
          laatst_bijgewerkt = GETDATE()
      OUTPUT INSERTED.*
      WHERE id = @id
    `);

    if (result.recordset.length === 0) {
      return new Response(JSON.stringify({ error: 'Tool not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(result.recordset[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ error: 'Database error', details: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// DELETE - Verwijder een tool
export const DELETE: APIRoute = async ({ params, request, locals }) => {
  // Check authentication
  const authError = await requireAuth({ request, locals });
  if (authError) return authError;
  
  try {
    const { id } = params;
    const dbPool = await getPool(locals);
    const dbRequest = dbPool.request();
    dbRequest.input('id', sql.Int, parseInt(id || '0'));
    await dbRequest.query('DELETE FROM tools WHERE id = @id');

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ error: 'Database error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// Endpoint om gebruik_count te incrementeren bij kopiëren
export const PATCH: APIRoute = async ({ params, request, locals }) => {
  // Check authentication
  const authError = await requireAuth({ request, locals });
  if (authError) return authError;
  
  try {
    const { id } = params;
    const dbPool = await getPool(locals);
    const dbRequest = dbPool.request();
    dbRequest.input('id', sql.Int, parseInt(id || '0'));
    await dbRequest.query(
      'UPDATE tools SET gebruik_count = gebruik_count + 1, laatst_gebruikt = GETDATE() WHERE id = @id'
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ error: 'Database error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
