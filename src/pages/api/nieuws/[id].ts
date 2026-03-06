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

// GET - Haal één nieuwsitem op
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
      .query('SELECT * FROM Nieuws WHERE id = @id');

    if (result.recordset.length === 0) {
      return new Response(JSON.stringify({ error: 'Nieuws not found' }), {
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
    console.error('Error fetching nieuws:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch nieuws' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// PUT - Update een nieuwsitem
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
      .input('inhoud', sql.NVarChar(sql.MAX), data.inhoud || null)
      .input('auteur', sql.NVarChar, data.auteur || null)
      .input('tags', sql.NVarChar, JSON.stringify(data.tags || []))
      .query(`
        UPDATE Nieuws 
        SET 
          titel = @titel,
          categorie = @categorie,
          inhoud = @inhoud,
          auteur = @auteur,
          tags = @tags
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      return new Response(JSON.stringify({ error: 'Nieuws not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updatedNieuws = result.recordset[0];
    return new Response(JSON.stringify({
      ...updatedNieuws,
      tags: JSON.parse(updatedNieuws.tags || '[]')
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating nieuws:', error);
    return new Response(JSON.stringify({ error: 'Failed to update nieuws' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// DELETE - Verwijder een nieuwsitem
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
      .query('DELETE FROM Nieuws WHERE id = @id');

    if (result.rowsAffected[0] === 0) {
      return new Response(JSON.stringify({ error: 'Nieuws not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ message: 'Nieuws deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting nieuws:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete nieuws' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
