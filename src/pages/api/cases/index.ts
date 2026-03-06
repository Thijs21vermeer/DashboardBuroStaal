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

// GET - Haal alle cases op
export const GET: APIRoute = async () => {
  try {
    const dbPool = await getPool();
    const result = await dbPool.request().query('SELECT * FROM Cases ORDER BY datum_toegevoegd DESC');
    
    // Parse JSON fields
    const cases = result.recordset.map(item => ({
      ...item,
      resultaten: item.resultaten ? JSON.parse(item.resultaten) : [],
      tags: item.tags ? JSON.parse(item.tags) : [],
    }));

    return new Response(JSON.stringify(cases), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching cases:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch cases' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// POST - Voeg een nieuwe case toe
export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const dbPool = await getPool();
    
    const result = await dbPool.request()
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
        INSERT INTO Cases 
        (titel, klant, industrie, uitdaging, oplossing, resultaten, tags, eigenaar, project_duur, team_size, datum_toegevoegd, laatst_bijgewerkt, featured, image_url)
        OUTPUT INSERTED.*
        VALUES 
        (@titel, @klant, @industrie, @uitdaging, @oplossing, @resultaten, @tags, @eigenaar, @project_duur, @team_size, GETDATE(), GETDATE(), 0, @image_url)
      `);

    const newCase = result.recordset[0];
    return new Response(JSON.stringify({
      ...newCase,
      resultaten: JSON.parse(newCase.resultaten || '[]'),
      tags: JSON.parse(newCase.tags || '[]')
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating case:', error);
    return new Response(JSON.stringify({ error: 'Failed to create case' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
