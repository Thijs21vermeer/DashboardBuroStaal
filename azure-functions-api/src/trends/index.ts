import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getPool, sql } from "../lib/db";

async function getTrends(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const id = request.params.id;
    const pool = await getPool();

    if (id) {
      const result = await pool.request()
        .input('id', sql.Int, parseInt(id))
        .query('SELECT * FROM Trends WHERE id = @id');
      
      if (result.recordset.length === 0) {
        return { status: 404, body: JSON.stringify({ error: 'Trend niet gevonden' }) };
      }
      
      return {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.recordset[0])
      };
    } else {
      const result = await pool.request().query('SELECT * FROM Trends ORDER BY datum DESC');
      
      return {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.recordset)
      };
    }
  } catch (error) {
    context.error('Error fetching trends:', error);
    return {
      status: 500,
      body: JSON.stringify({ error: 'Database error', details: error.message })
    };
  }
}

async function createTrend(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const body = await request.json() as any;
    const pool = await getPool();

    const result = await pool.request()
      .input('titel', sql.NVarChar(255), body.titel)
      .input('categorie', sql.NVarChar(100), body.categorie)
      .input('samenvatting', sql.NVarChar(sql.MAX), body.samenvatting)
      .input('impact', sql.NVarChar(50), body.impact)
      .input('relevantie', sql.NVarChar(50), body.relevantie)
      .input('bronnen', sql.NVarChar(sql.MAX), JSON.stringify(body.bronnen || []))
      .input('tags', sql.NVarChar(sql.MAX), JSON.stringify(body.tags || []))
      .input('eigenaar', sql.NVarChar(100), body.eigenaar)
      .query(`
        INSERT INTO Trends (titel, categorie, samenvatting, impact, relevantie, bronnen, tags, eigenaar, datum)
        OUTPUT INSERTED.*
        VALUES (@titel, @categorie, @samenvatting, @impact, @relevantie, @bronnen, @tags, @eigenaar, GETDATE())
      `);

    return {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result.recordset[0])
    };
  } catch (error) {
    context.error('Error creating trend:', error);
    return {
      status: 500,
      body: JSON.stringify({ error: 'Database error', details: error.message })
    };
  }
}

app.http('trends', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  route: 'trends/{id?}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    const method = request.method;
    
    if (method === 'GET') {
      return getTrends(request, context);
    } else if (method === 'POST') {
      return createTrend(request, context);
    }
    
    return { status: 405, body: 'Method not allowed' };
  }
});
