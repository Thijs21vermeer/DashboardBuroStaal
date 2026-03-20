import type { APIRoute } from 'astro';
import { query, queryOne } from '../../../lib/azure-db';
import sql from 'mssql';
import { getPool, handleDbError } from '../../../lib/db-config';
import { requireAuth } from '../../../lib/api-auth';

export const GET: APIRoute = async ({ params, request, locals }) => {
  // Check authentication
  const authError = await requireAuth(request, locals);
  if (authError) return authError;

  try {
    const { id } = params;
    const result = await queryOne(
      'SELECT * FROM tools WHERE id = @id',
      { id: parseInt(id || '0') }
    );

    if (!result) {
      return new Response(JSON.stringify({ error: 'Tool not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const tool = {
      ...result,
      favoriet: Boolean(result.favoriet)
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
  const authError = await requireAuth(request, locals);
  if (authError) return authError;
  
  try {
    const { id } = params;
    const body = await request.json();
    const { titel, categorie, beschrijving, code, taal, tags, eigenaar, favoriet } = body;

    const result = await query(`
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
    `, {
      id: parseInt(id || '0'),
      titel,
      categorie,
      beschrijving: beschrijving || null,
      code,
      taal: taal || null,
      tags: tags || null,
      eigenaar: eigenaar || null,
      favoriet: favoriet ? 1 : 0
    });

    if (result.length === 0) {
      return new Response(JSON.stringify({ error: 'Tool not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(result[0]), {
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
  const authError = await requireAuth(request, locals);
  if (authError) return authError;
  
  try {
    const { id } = params;
    await query('DELETE FROM tools WHERE id = @id', { id: parseInt(id || '0') });

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
export const PATCH: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    await query(
      'UPDATE tools SET gebruik_count = gebruik_count + 1, laatst_gebruikt = GETDATE() WHERE id = @id',
      { id: parseInt(id || '0') }
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

