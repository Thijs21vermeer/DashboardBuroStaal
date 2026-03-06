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

// GET - Haal alle nieuwsitems op
export const GET: APIRoute = async () => {
  try {
    const dbPool = await getPool();
    const result = await dbPool.request().query('SELECT * FROM Nieuws ORDER BY datum DESC');
    
    // Parse JSON fields
    const nieuws = result.recordset.map(item => ({
      ...item,
      tags: item.tags ? JSON.parse(item.tags) : [],
    }));

    return new Response(JSON.stringify(nieuws), {
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

// POST - Voeg een nieuw nieuwsitem toe
export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const dbPool = await getPool();
    
    const result = await dbPool.request()
      .input('titel', sql.NVarChar, data.titel)
      .input('categorie', sql.NVarChar, data.categorie)
      .input('inhoud', sql.NVarChar(sql.MAX), data.inhoud || null)
      .input('auteur', sql.NVarChar, data.auteur || null)
      .input('tags', sql.NVarChar, JSON.stringify(data.tags || []))
      .query(`
        INSERT INTO Nieuws 
        (titel, categorie, inhoud, auteur, datum, featured, tags)
        OUTPUT INSERTED.*
        VALUES 
        (@titel, @categorie, @inhoud, @auteur, GETDATE(), 0, @tags)
      `);

    const newNieuws = result.recordset[0];
    return new Response(JSON.stringify({
      ...newNieuws,
      tags: JSON.parse(newNieuws.tags || '[]')
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating nieuws:', error);
    return new Response(JSON.stringify({ error: 'Failed to create nieuws' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
