import type { APIRoute } from 'astro';
import sql from 'mssql';
import { getPool, handleDbError } from '../../../lib/db-config';

// GET - Haal alle trends op
export const GET: APIRoute = async () => {
  try {
    const dbPool = await getPool();
    const result = await dbPool.request().query('SELECT * FROM Trends ORDER BY datum_toegevoegd DESC');
    
    // Parse JSON fields
    const trends = result.recordset.map(item => ({
      ...item,
      bronnen: item.bronnen ? JSON.parse(item.bronnen) : [],
      tags: item.tags ? JSON.parse(item.tags) : [],
    }));

    return new Response(JSON.stringify(trends), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return handleDbError(error, 'fetch trends');
  }
};

// POST - Voeg een nieuwe trend toe
export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const dbPool = await getPool();
    
    const result = await dbPool.request()
      .input('titel', sql.NVarChar, data.titel)
      .input('categorie', sql.NVarChar, data.categorie)
      .input('beschrijving', sql.NVarChar(sql.MAX), data.beschrijving || null)
      .input('relevantie', sql.NVarChar, data.relevantie || null)
      .input('impact', sql.NVarChar(sql.MAX), data.impact || null)
      .input('bronnen', sql.NVarChar(sql.MAX), JSON.stringify(data.bronnen || []))
      .input('tags', sql.NVarChar, JSON.stringify(data.tags || []))
      .query(`
        INSERT INTO Trends 
        (titel, categorie, beschrijving, relevantie, impact, bronnen, tags, datum_toegevoegd, laatst_bijgewerkt, featured)
        OUTPUT INSERTED.*
        VALUES 
        (@titel, @categorie, @beschrijving, @relevantie, @impact, @bronnen, @tags, GETDATE(), GETDATE(), 0)
      `);

    const newTrend = result.recordset[0];
    return new Response(JSON.stringify({
      ...newTrend,
      bronnen: JSON.parse(newTrend.bronnen || '[]'),
      tags: JSON.parse(newTrend.tags || '[]')
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return handleDbError(error, 'create trend');
  }
};

