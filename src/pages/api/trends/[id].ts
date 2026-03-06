import type { APIRoute } from 'astro';
import sql from 'mssql';

const config: sql.config = {
  server: 'dashboardbs.database.windows.net',
  database: 'dashboarddb',
  user: 'databasedashboard',
  password: 'Knolpower05!',
  options: {
    encrypt: true,
    trustServerCertificate: false,
    connectTimeout: 30000,
    requestTimeout: 30000,
  }
};

let pool: sql.ConnectionPool | null = null;

async function getPool() {
  if (!pool) {
    pool = await sql.connect(config);
  }
  return pool;
}

// GET - Haal één trend op
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
      .query('SELECT * FROM Trends WHERE id = @id');

    if (result.recordset.length === 0) {
      return new Response(JSON.stringify({ error: 'Trend not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const item = result.recordset[0];
    return new Response(JSON.stringify({
      ...item,
      bronnen: item.bronnen ? JSON.parse(item.bronnen) : [],
      tags: item.tags ? JSON.parse(item.tags) : [],
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching trend:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch trend' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// PUT - Update een trend
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
      .input('categorie', sql.NVarChar, data.categorie)
      .input('beschrijving', sql.NVarChar(sql.MAX), data.beschrijving || null)
      .input('relevantie', sql.NVarChar, data.relevantie || null)
      .input('impact', sql.NVarChar(sql.MAX), data.impact || null)
      .input('bronnen', sql.NVarChar(sql.MAX), JSON.stringify(data.bronnen || []))
      .input('tags', sql.NVarChar, JSON.stringify(data.tags || []))
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

    const updatedTrend = result.recordset[0];
    return new Response(JSON.stringify({
      ...updatedTrend,
      bronnen: JSON.parse(updatedTrend.bronnen || '[]'),
      tags: JSON.parse(updatedTrend.tags || '[]')
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating trend:', error);
    return new Response(JSON.stringify({ error: 'Failed to update trend' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// DELETE - Verwijder een trend
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
    console.error('Error deleting trend:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete trend' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
