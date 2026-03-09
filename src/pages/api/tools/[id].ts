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

export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM tools WHERE id = @id');
    
    await pool.close();

    if (result.recordset.length === 0) {
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

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;
    const body = await request.json();
    const { titel, categorie, beschrijving, code, taal, tags, eigenaar, favoriet } = body;

    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('titel', sql.NVarChar, titel)
      .input('categorie', sql.NVarChar, categorie)
      .input('beschrijving', sql.NVarChar, beschrijving || null)
      .input('code', sql.NVarChar, code)
      .input('taal', sql.NVarChar, taal || null)
      .input('tags', sql.NVarChar, tags || null)
      .input('eigenaar', sql.NVarChar, eigenaar || null)
      .input('favoriet', sql.Bit, favoriet ? 1 : 0)
      .query(`
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

    await pool.close();

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
    return new Response(JSON.stringify({ error: 'Database error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM tools WHERE id = @id');
    
    await pool.close();

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
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input('id', sql.Int, id)
      .query('UPDATE tools SET gebruik_count = gebruik_count + 1 WHERE id = @id');
    
    await pool.close();

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
