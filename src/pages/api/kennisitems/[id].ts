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

// GET - Haal één kennisitem op
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
      .query('SELECT * FROM KennisItems WHERE id = @id');

    if (result.recordset.length === 0) {
      return new Response(JSON.stringify({ error: 'Kennisitem not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const item = result.recordset[0];
    return new Response(JSON.stringify({
      ...item,
      tags: item.tags ? JSON.parse(item.tags) : [],
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching kennisitem:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch kennisitem' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
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
      .input('tags', sql.NVarChar, JSON.stringify(data.tags || []))
      .input('gekoppeld_project', sql.NVarChar, data.gekoppeldProject || null)
      .input('eigenaar', sql.NVarChar, data.eigenaar)
      .input('samenvatting', sql.NVarChar, data.samenvatting || null)
      .input('inhoud', sql.NVarChar(sql.MAX), data.inhoud || null)
      .input('media_type', sql.NVarChar, data.mediaType || null)
      .input('media_url', sql.NVarChar, data.mediaUrl || null)
      .query(`
        UPDATE KennisItems 
        SET 
          titel = @titel,
          type = @type,
          tags = @tags,
          gekoppeld_project = @gekoppeld_project,
          eigenaar = @eigenaar,
          samenvatting = @samenvatting,
          inhoud = @inhoud,
          media_type = @media_type,
          media_url = @media_url,
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

    const updatedItem = result.recordset[0];
    return new Response(JSON.stringify({
      ...updatedItem,
      tags: JSON.parse(updatedItem.tags || '[]')
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating kennisitem:', error);
    return new Response(JSON.stringify({ error: 'Failed to update kennisitem' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
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
    console.error('Error deleting kennisitem:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete kennisitem' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
