import type { APIRoute } from 'astro';
import sql from 'mssql';
import { getPool, handleDbError } from '../../../lib/db-config';
import { requireAuth } from '../../../lib/api-auth';
import type { Trend } from '../../../types';

// Helper functie om database records te mappen naar TypeScript types
function mapDbToTrend(dbRecord: any): Trend {
  return {
    id: String(dbRecord.id),
    titel: dbRecord.titel,
    categorie: dbRecord.categorie,
    beschrijving: dbRecord.beschrijving,
    relevantie: dbRecord.relevantie as 'Hoog' | 'Middel' | 'Laag',
    bronnen: dbRecord.bronnen ? JSON.parse(dbRecord.bronnen) : [],
    datum: dbRecord.datum_toegevoegd,
    tags: dbRecord.tags ? JSON.parse(dbRecord.tags) : [],
    impact: dbRecord.impact || '',
    eigenaar: dbRecord.eigenaar || 'Onbekend',
  };
}

// GET - Haal een specifieke trend op
export const GET: APIRoute = async ({ params, request, locals }) => {
  // Check authentication
  const authError = await requireAuth(request, locals);
  if (authError) return authError;

  const { id } = params;
  
  try {
    const dbPool = await getPool();
    const result = await dbPool.request()
      .input('id', sql.Int, Number(id))
      .query('SELECT * FROM Trends WHERE id = @id');

    if (result.recordset.length === 0) {
      return new Response(JSON.stringify({ error: 'Trend not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const trend = mapDbToTrend(result.recordset[0]);
    return new Response(JSON.stringify(trend), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return handleDbError(error, 'fetch trend by id');
  }
};

// PUT - Update een trend
export const PUT: APIRoute = async ({ params, request, locals }) => {
  // Check authentication
  const authError = await requireAuth(request, locals);
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
      .input('beschrijving', sql.NVarChar(sql.MAX), data.beschrijving || null)
      .input('relevantie', sql.NVarChar, data.relevantie || null)
      .input('impact', sql.NVarChar(sql.MAX), data.impact || null)
      .input('bronnen', sql.NVarChar(sql.MAX), JSON.stringify(data.bronnen || []))
      .input('tags', sql.NVarChar, JSON.stringify(data.tags || []))
      .input('eigenaar', sql.NVarChar, data.eigenaar || null)
      .query(`
        UPDATE Trends 
        SET 
          titel = @titel,
          categorie = @categorie,
          beschrijving = @beschrijving,
          relevantie = @relevantie,
          impact = @impact,
          bronnen = @bronnen,
          tags = @tags,
          eigenaar = @eigenaar,
          laatst_bijgewerkt = GETDATE()
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      return new Response(JSON.stringify({ error: 'Trend not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updatedTrend = mapDbToTrend(result.recordset[0]);
    return new Response(JSON.stringify(updatedTrend), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return handleDbError(error, 'update trend');
  }
};

// DELETE - Verwijder een trend
export const DELETE: APIRoute = async ({ params, request, locals }) => {
  // Check authentication
  const authError = await requireAuth(request, locals);
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
      .query('DELETE FROM Trends WHERE id = @id');

    if (result.rowsAffected[0] === 0) {
      return new Response(JSON.stringify({ error: 'Trend not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ message: 'Trend deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return handleDbError(error, 'delete trend');
  }
};







