import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getPool, sql } from "../lib/db";

// GET all or single kennisitem
async function getKennisitems(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const id = request.params.id;
    const pool = await getPool();

    if (id) {
      // Get single item
      const result = await pool.request()
        .input('id', sql.Int, parseInt(id))
        .query('SELECT * FROM KennisItems WHERE id = @id');
      
      if (result.recordset.length === 0) {
        return { status: 404, body: JSON.stringify({ error: 'Item niet gevonden' }) };
      }
      
      return {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.recordset[0])
      };
    } else {
      // Get all items
      const result = await pool.request().query('SELECT * FROM KennisItems ORDER BY datum_toegevoegd DESC');
      
      return {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.recordset)
      };
    }
  } catch (error) {
    context.error('Error fetching kennisitems:', error);
    return {
      status: 500,
      body: JSON.stringify({ error: 'Database error', details: error.message })
    };
  }
}

// POST new kennisitem
async function createKennisitem(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const body = await request.json() as any;
    const pool = await getPool();

    const result = await pool.request()
      .input('titel', sql.NVarChar(255), body.titel)
      .input('type', sql.NVarChar(50), body.type)
      .input('tags', sql.NVarChar(sql.MAX), JSON.stringify(body.tags || []))
      .input('gekoppeld_project', sql.NVarChar(255), body.gekoppeld_project || null)
      .input('eigenaar', sql.NVarChar(100), body.eigenaar)
      .input('samenvatting', sql.NVarChar(sql.MAX), body.samenvatting)
      .input('inhoud', sql.NVarChar(sql.MAX), body.inhoud)
      .query(`
        INSERT INTO KennisItems (titel, type, tags, gekoppeld_project, eigenaar, samenvatting, inhoud, datum_toegevoegd, laatst_bijgewerkt)
        OUTPUT INSERTED.*
        VALUES (@titel, @type, @tags, @gekoppeld_project, @eigenaar, @samenvatting, @inhoud, GETDATE(), GETDATE())
      `);

    return {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result.recordset[0])
    };
  } catch (error) {
    context.error('Error creating kennisitem:', error);
    return {
      status: 500,
      body: JSON.stringify({ error: 'Database error', details: error.message })
    };
  }
}

// Register HTTP trigger
app.http('kennisitems', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  route: 'kennisitems/{id?}',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    const method = request.method;
    
    if (method === 'GET') {
      return getKennisitems(request, context);
    } else if (method === 'POST') {
      return createKennisitem(request, context);
    }
    
    return { status: 405, body: 'Method not allowed' };
  }
});
