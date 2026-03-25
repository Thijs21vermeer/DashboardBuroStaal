import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/api-auth';
import { getAll, insert } from '../../../lib/turso-db';

export const GET: APIRoute = async ({ request, locals }) => {
  const authError = await requireAuth({ request, locals });
  if (authError) return authError;
  
  try {
    const rows = await getAll('Trends', {
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
    console.error('Error fetching trends:', error);
    return new Response(JSON.stringify({ 
      error: 'Database fout bij ophalen trends',
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
    
    const newId = await insert('Trends', {
      titel: data.titel,
      beschrijving: data.beschrijving || '',
      categorie: data.categorie || 'Algemeen',
      eigenaar: data.eigenaar || '',
      tags: JSON.stringify(data.tags || []),
      afbeelding: data.afbeelding || null,
    }, locals);

    const newTrend = {
      id: newId,
      ...data,
      tags: data.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return new Response(JSON.stringify(newTrend), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating trend:', error);
    return new Response(JSON.stringify({ 
      error: 'Database fout bij aanmaken trend',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
