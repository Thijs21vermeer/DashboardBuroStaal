import type { APIRoute } from 'astro';
import type { Partner, PartnerRequest } from '../../../types';
import sql from 'mssql';
import { getPool } from '../../../lib/db-config';
import { requireAuth } from '../../../lib/api-auth';

export const GET: APIRoute = async ({ request, locals }) => {
  // Check authentication
  const authError = await requireAuth({ request, locals });
  if (authError) return authError;

  try {
    const dbPool = await getPool(locals);
    const result = await dbPool.request().query(`
      SELECT 
        id,
        naam,
        bedrijf,
        specialisatie,
        email,
        telefoon,
        website,
        beschrijving,
        expertise_gebieden as expertiseGebieden,
        volgorde,
        created_at as createdAt,
        updated_at as updatedAt
      FROM externe_partners
      ORDER BY volgorde ASC, id ASC
    `);

    const partners = result.recordset.map((row: any) => ({
      ...row,
      expertiseGebieden: row.expertiseGebieden ? JSON.parse(row.expertiseGebieden) : []
    }));

    return new Response(JSON.stringify(partners), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching partners:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch partners' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  // Check authentication
  const authError = await requireAuth({ request, locals });
  if (authError) return authError;
  
  try {
    const data = (await request.json()) as PartnerRequest;
    const dbPool = await getPool(locals);
    const { naam, bedrijf, specialisatie, email, telefoon, website, beschrijving, expertiseGebieden, volgorde } = data;

    if (!naam || !specialisatie || !email) {
      return new Response(JSON.stringify({ error: 'Naam, specialisatie en email zijn verplicht' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const expertiseJson = JSON.stringify(expertiseGebieden || []);
    
    const dbRequest = dbPool.request();
    dbRequest.input('naam', sql.NVarChar, naam);
    dbRequest.input('bedrijf', sql.NVarChar, bedrijf || null);
    dbRequest.input('specialisatie', sql.NVarChar, specialisatie);
    dbRequest.input('email', sql.NVarChar, email);
    dbRequest.input('telefoon', sql.NVarChar, telefoon || null);
    dbRequest.input('website', sql.NVarChar, website || null);
    dbRequest.input('beschrijving', sql.NVarChar, beschrijving || '');
    dbRequest.input('expertiseGebieden', sql.NVarChar, expertiseJson);
    dbRequest.input('volgorde', sql.Int, volgorde || 0);

    const result = await dbRequest.query(`
      INSERT INTO externe_partners (naam, bedrijf, specialisatie, email, telefoon, website, beschrijving, expertise_gebieden, volgorde)
      OUTPUT INSERTED.*
      VALUES (@naam, @bedrijf, @specialisatie, @email, @telefoon, @website, @beschrijving, @expertiseGebieden, @volgorde)
    `);

    const newPartner = result.recordset[0];

    return new Response(JSON.stringify({
      ...newPartner,
      expertiseGebieden: JSON.parse(newPartner.expertise_gebieden || '[]')
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating partner:', error);
    return new Response(JSON.stringify({ error: 'Failed to create partner' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
