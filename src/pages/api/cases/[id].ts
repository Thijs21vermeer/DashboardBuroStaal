import type { APIRoute } from 'astro';
import sql from 'mssql';
import { getPool, handleDbError } from '../../../lib/db-config';

// GET - Haal één case op
export const GET: APIRoute = async ({ params }) => {
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
      .query('SELECT * FROM Cases WHERE id = @id');

    if (result.recordset.length === 0) {
      return new Response(JSON.stringify({ error: 'Case not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const item = result.recordset[0];
    return new Response(JSON.stringify({
      ...item,
      resultaten: item.resultaten ? JSON.parse(item.resultaten) : [],
      tags: item.tags ? JSON.parse(item.tags) : [],
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return handleDbError(error, 'fetch case');
  }
};

// PUT - Update een case
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
      .input('klant', sql.NVarChar, data.klant)
      .input('industrie', sql.NVarChar, data.industrie || null)
      .input('uitdaging', sql.NVarChar(sql.MAX), data.uitdaging || null)
      .input('oplossing', sql.NVarChar(sql.MAX), data.oplossing || null)
      .input('resultaten', sql.NVarChar(sql.MAX), JSON.stringify(data.resultaten || []))
      .input('tags', sql.NVarChar, JSON.stringify(data.tags || []))
      .input('eigenaar', sql.NVarChar, data.eigenaar || null)
      .input('project_duur', sql.NVarChar, data.projectDuur || null)
      .input('team_size', sql.NVarChar, data.teamSize || null)
      .input('image_url', sql.NVarChar, data.imageUrl || null)
      .query(`
        UPDATE Cases 
        SET 
          titel = @titel,
          klant = @klant,
          industrie = @industrie,
          uitdaging = @uitdaging,
          oplossing = @oplossing,
          resultaten = @resultaten,
          tags = @tags,
          eigenaar = @eigenaar,
          project_duur = @project_duur,
          team_size = @team_size,
          image_url = @image_url,
          laatst_bijgewerkt = GETDATE()
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      return new Response(JSON.stringify({ error: 'Case not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updatedCase = result.recordset[0];
    return new Response(JSON.stringify({
      ...updatedCase,
      resultaten: JSON.parse(updatedCase.resultaten || '[]'),
      tags: JSON.parse(updatedCase.tags || '[]')
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return handleDbError(error, 'update case');
  }
};

// DELETE - Verwijder een case
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
      .query('DELETE FROM Cases WHERE id = @id');

    if (result.rowsAffected[0] === 0) {
      return new Response(JSON.stringify({ error: 'Case not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ message: 'Case deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return handleDbError(error, 'delete case');
  }
};

