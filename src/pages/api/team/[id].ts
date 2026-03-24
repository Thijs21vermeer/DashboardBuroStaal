import type { APIRoute } from 'astro';
import { getPool } from '../../../lib/db-config';
import sql from 'mssql';
import { requireAuth } from '../../../lib/api-auth';
import type { TeamMember, TeamMemberRequest } from '../../../types';

// GET - Haal een specifiek teamlid op
export const GET: APIRoute = async ({ params, request, locals }) => {
  // Check authentication
  const authError = await requireAuth({ request, locals });
  if (authError) return authError;

  try {
    const { id } = params;
    const dbPool = await getPool(locals);
    
    const dbRequest = dbPool.request();
    dbRequest.input('id', sql.Int, parseInt(id!));

    const result = await dbRequest.query(`
      SELECT 
        id,
        naam,
        rol,
        email,
        bio,
        expertise_gebieden as expertiseGebieden,
        is_eigenaar as isEigenaar,
        volgorde,
        created_at as createdAt,
        updated_at as updatedAt
      FROM team_members
      WHERE id = @id
    `);

    if (result.recordset.length === 0) {
      return new Response(JSON.stringify({ error: 'Team member not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const member = result.recordset[0];

    return new Response(JSON.stringify({
      ...member,
      expertiseGebieden: member.expertiseGebieden ? JSON.parse(member.expertiseGebieden) : [],
      isEigenaar: !!member.isEigenaar
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching team member:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch team member' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ params, request, locals }) => {
  // Check authentication
  const authError = await requireAuth({ request, locals });
  if (authError) return authError;
  
  try {
    const { id } = params;
    const body = (await request.json()) as TeamMemberRequest;
    const { naam, rol, email, bio, expertiseGebieden, isEigenaar, volgorde } = body;
    const dbPool = await getPool(locals);

    if (!naam || !rol || !email) {
      return new Response(JSON.stringify({ error: 'Naam, rol en email zijn verplicht' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const expertiseJson = JSON.stringify(expertiseGebieden || []);

    const dbRequest = dbPool.request();
    dbRequest.input('id', sql.Int, parseInt(id!));
    dbRequest.input('naam', sql.NVarChar, naam);
    dbRequest.input('rol', sql.NVarChar, rol);
    dbRequest.input('email', sql.NVarChar, email);
    dbRequest.input('bio', sql.NVarChar, bio || '');
    dbRequest.input('expertiseGebieden', sql.NVarChar, expertiseJson);
    dbRequest.input('isEigenaar', sql.Bit, isEigenaar ? 1 : 0);
    dbRequest.input('volgorde', sql.Int, volgorde || 0);

    await dbRequest.query(`
      UPDATE team_members
      SET naam = @naam,
          rol = @rol,
          email = @email,
          bio = @bio,
          expertise_gebieden = @expertiseGebieden,
          is_eigenaar = @isEigenaar,
          volgorde = @volgorde,
          updated_at = GETDATE()
      WHERE id = @id
    `);

    const dbRequest2 = dbPool.request();
    dbRequest2.input('id', sql.Int, parseInt(id!));
    const result = await dbRequest2.query(`
      SELECT 
        id,
        naam,
        rol,
        email,
        bio,
        expertise_gebieden as expertiseGebieden,
        is_eigenaar as isEigenaar,
        volgorde,
        created_at as createdAt,
        updated_at as updatedAt
      FROM team_members
      WHERE id = @id
    `);

    const updatedMember = result.recordset[0];

    return new Response(JSON.stringify({
      ...updatedMember,
      expertiseGebieden: JSON.parse(updatedMember.expertiseGebieden || '[]'),
      isEigenaar: !!updatedMember.isEigenaar
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating team member:', error);
    return new Response(JSON.stringify({ error: 'Failed to update team member' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ params, request, locals }) => {
  // Check authentication
  const authError = await requireAuth({ request, locals });
  if (authError) return authError;
  
  try {
    const { id } = params;
    const dbPool = await getPool(locals);

    const dbRequest = dbPool.request();
    dbRequest.input('id', sql.Int, parseInt(id!));
    await dbRequest.query(`DELETE FROM team_members WHERE id = @id`);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete team member' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
