import type { APIRoute } from 'astro';
import sql from 'mssql';
import { getPool, handleDbError } from '../../../lib/db-config';
import { requireAuth } from '../../../lib/api-auth';
import { query } from '../../../lib/azure-db';

export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params;

    const result = await query(`
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
    `, { id: parseInt(id!) });

    if (result.length === 0) {
      return new Response(JSON.stringify({ error: 'Team member not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const member = result[0];

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
  const authError = requireAuth({ request, locals } as any);
  if (authError) return authError;
  
  try {
    const { id } = params;
    const body = await request.json();
    const { naam, rol, email, bio, expertiseGebieden, isEigenaar, volgorde } = body;

    if (!naam || !rol || !email) {
      return new Response(JSON.stringify({ error: 'Naam, rol en email zijn verplicht' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const expertiseJson = JSON.stringify(expertiseGebieden || []);

    await query(`
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
    `, {
      id: parseInt(id!),
      naam,
      rol,
      email,
      bio: bio || '',
      expertiseGebieden: expertiseJson,
      isEigenaar: isEigenaar ? 1 : 0,
      volgorde: volgorde || 0
    });

    const result = await query(`
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
    `, { id: parseInt(id!) });

    const updatedMember = result[0];

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
  const authError = requireAuth({ request, locals } as any);
  if (authError) return authError;
  
  try {
    const { id } = params;

    await query(`DELETE FROM team_members WHERE id = @id`, {
      id: parseInt(id!)
    });

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


