import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getPool, sql } from "../lib/db";

async function getNieuws(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const id = request.params.id;
    const pool = await getPool();

    if (id) {
      const result = await pool.request()
        .input('id', sql.Int, parseInt(id))
        .query('SELECT * FROM Nieuws WHERE id = @id');
      
      if (result.recordset.length === 0) {
        return { status: 404, body: JSON.stringify({ error: 'Nieuwsitem niet gevonden' }) };
      }
      
      return {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.recordset[0])
      };
    } else {
      const result = await pool.request().query('SELECT * FROM Nieuws ORDER BY datum DESC');
      
      return {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.recordset)
      };
    }
  } catch (error) {
    context.error('Error fetching nieuws:', error);
    return {
      status: 500,
      body: JSON.stringify({ error: 'Database error', details: error.message })
    };
  }
}

async function createNieuws(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const body = await request.json() as any;
    const pool = await getPool();

    const result = await pool.request()
      .input('titel', sql.NVarChar(255), body.titel)
      .input('categorie', sql.NVarChar(100), body.categorie)
      .input('inhoud', sql.NVarChar(sql.MAX), body.inhoud)
      .input('auteur', sql.NVarChar(100), body.auteur)
      .query(`
        INSERT INTO Nieuws (titel, categorie, inhoud, auteur, datum)
        OUTPUT INSERTED.*
        VALUES (@titel, @categorie, @inhoud, @auteur, GETDATE())
      `);

    return {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result.recordset[0])
    };
  } catch (error) {
    context.error('Error creating nieuws:', error);
    return {
      status: 500,
      body: JSON.stringify({ error: 'Database error', details: error.message })
    };
  }
}

app.http('nieuws', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  route: 'nieuws/{id?}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    const method = request.method;
    
    if (method === 'GET') {
      return getNieuws(request, context);
    } else if (method === 'POST') {
      return createNieuws(request, context);
    }
    
    return { status: 405, body: 'Method not allowed' };
  }
});
