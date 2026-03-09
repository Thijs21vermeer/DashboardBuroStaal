import type { APIRoute } from 'astro';
import sql from 'mssql';

const dbConfig = {
  server: import.meta.env.AZURE_SQL_SERVER || '',
  database: import.meta.env.AZURE_SQL_DATABASE || '',
  user: import.meta.env.AZURE_SQL_USER || '',
  password: import.meta.env.AZURE_SQL_PASSWORD || '',
  port: parseInt(import.meta.env.AZURE_SQL_PORT || '1433'),
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

export const GET: APIRoute = async () => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query(`
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
    
    await pool.close();

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
    return new Response(JSON.stringify({ error: 'Database error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { titel, categorie, beschrijving, code, taal, tags, eigenaar } = body;

    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('titel', sql.NVarChar, titel)
      .input('categorie', sql.NVarChar, categorie)
      .input('beschrijving', sql.NVarChar, beschrijving || null)
      .input('code', sql.NVarChar, code)
      .input('taal', sql.NVarChar, taal || null)
      .input('tags', sql.NVarChar, tags || null)
      .input('eigenaar', sql.NVarChar, eigenaar || null)
      .query(`
        INSERT INTO tools (titel, categorie, beschrijving, code, taal, tags, eigenaar)
        OUTPUT INSERTED.*
        VALUES (@titel, @categorie, @beschrijving, @code, @taal, @tags, @eigenaar)
      `);

    await pool.close();

    return new Response(JSON.stringify(result.recordset[0]), {
      status: 201,
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
