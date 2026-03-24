import type { APIRoute } from 'astro';
import { getPool } from '../../../lib/azure-db';
import sql from 'mssql';
import { requireAuth } from '../../../lib/api-auth';
import type { TeamMember, TeamMemberRequest } from '../../../types';

// GET - Haal alle teamleden op
export const GET: APIRoute = async ({ request, locals }) => {
  // Check authentication
  const authError = await requireAuth({ request, locals });
  if (authError) return authError;

  try {
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
      ORDER BY volgorde ASC, id ASC
    `, undefined, locals);

    const members = result.map((row: any) => ({
      ...row,
      expertiseGebieden: row.expertiseGebieden ? JSON.parse(row.expertiseGebieden) : [],
      isEigenaar: !!row.isEigenaar
    }));

    return new Response(JSON.stringify(members), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch team members' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// POST - Voeg een nieuw teamlid toe
export const POST: APIRoute = async ({ request, locals }) => {
  // Check authentication
  const authError = await requireAuth({ request, locals });
  if (authError) return authError;
  
  try {
    const body = (await request.json()) as TeamRequest;
    const { naam, rol, email, bio, expertiseGebieden, isEigenaar, volgorde } = body;

    if (!naam || !rol || !email) {
      return new Response(JSON.stringify({ error: 'Naam, rol en email zijn verplicht' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const expertiseJson = JSON.stringify(expertiseGebieden || []);

    const result = await query(`
      INSERT INTO team_members (naam, rol, email, bio, expertise_gebieden, is_eigenaar, volgorde)
      OUTPUT INSERTED.*
      VALUES (@naam, @rol, @email, @bio, @expertiseGebieden, @isEigenaar, @volgorde)
    `, {
      naam,
      rol,
      email,
      bio: bio || '',
      expertiseGebieden: expertiseJson,
      isEigenaar: isEigenaar ? 1 : 0,
      volgorde: volgorde || 0
    }, locals);

    const newMember = result[0];

    return new Response(JSON.stringify({
      ...newMember,
      expertiseGebieden: JSON.parse(newMember.expertise_gebieden || '[]'),
      isEigenaar: !!newMember.is_eigenaar
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating team member:', error);
    return new Response(JSON.stringify({ error: 'Failed to create team member' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};







