import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getPool, sql } from "../lib/db";

async function getCases(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const id = request.params.id;
    const pool = await getPool();

    if (id) {
      const result = await pool.request()
        .input('id', sql.Int, parseInt(id))
        .query('SELECT * FROM Cases WHERE id = @id');
      
      if (result.recordset.length === 0) {
        return { status: 404, body: JSON.stringify({ error: 'Case niet gevonden' }) };
      }
      
      return {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.recordset[0])
      };
    } else {
      const result = await pool.request().query('SELECT * FROM Cases ORDER BY datum DESC');
      
      return {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.recordset)
      };
    }
  } catch (error) {
    context.error('Error fetching cases:', error);
    return {
      status: 500,
      body: JSON.stringify({ error: 'Database error', details: error.message })
    };
  }
}

async function createCase(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const body = await request.json() as any;
    const pool = await getPool();

    const result = await pool.request()
      .input('titel', sql.NVarChar(255), body.titel)
      .input('klant', sql.NVarChar(255), body.klant)
      .input('branche', sql.NVarChar(100), body.branche)
      .input('uitdaging', sql.NVarChar(sql.MAX), body.uitdaging)
      .input('oplossing', sql.NVarChar(sql.MAX), body.oplossing)
      .input('resultaten', sql.NVarChar(sql.MAX), JSON.stringify(body.resultaten || []))
      .input('tags', sql.NVarChar(sql.MAX), JSON.stringify(body.tags || []))
      .input('projectduur', sql.NVarChar(100), body.projectduur || null)
      .input('eigenaar', sql.NVarChar(100), body.eigenaar)
      .query(`
        INSERT INTO Cases (titel, klant, branche, uitdaging, oplossing, resultaten, tags, projectduur, eigenaar, datum)
        OUTPUT INSERTED.*
        VALUES (@titel, @klant, @branche, @uitdaging, @oplossing, @resultaten, @tags, @projectduur, @eigenaar, GETDATE())
      `);

    return {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result.recordset[0])
    };
  } catch (error) {
    context.error('Error creating case:', error);
    return {
      status: 500,
      body: JSON.stringify({ error: 'Database error', details: error.message })
    };
  }
}

app.http('cases', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  route: 'cases/{id?}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    const method = request.method;
    
    if (method === 'GET') {
      return getCases(request, context);
    } else if (method === 'POST') {
      return createCase(request, context);
    }
    
    return { status: 405, body: 'Method not allowed' };
  }
});
