import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/api-auth';
import { getAll, insert } from '../../../lib/turso-db';

export const GET: APIRoute = async ({ request, locals }) => {
  const authError = await requireAuth({ request, locals });
  if (authError) return authError;
  
  try {
    const rows = await getAll('Tools', {
      orderBy: 'createdAt DESC'
    }, locals);

    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    console.error('Error fetching tools:', error);
    return new Response(JSON.stringify({ 
      error: 'Database fout bij ophalen tools',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  const authError = await requireAuth({ request, locals });
  if (authError) return authError;
  
  try {
    const data = await request.json();
    
    const newId = await insert('Tools', {
      naam: data.naam,
      beschrijving: data.beschrijving || '',
      url: data.url || '',
      tags: JSON.stringify(data.tags || []),
      afbeelding: data.afbeelding || null,
    }, locals);

    const newTool = {
      id: newId,
      ...data,
      tags: data.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return new Response(JSON.stringify(newTool), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating tool:', error);
    return new Response(JSON.stringify({ 
      error: 'Database fout bij aanmaken tool',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
