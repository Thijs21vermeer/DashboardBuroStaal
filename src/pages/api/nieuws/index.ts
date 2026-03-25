import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/api-auth';
import { getAll, insert } from '../../../lib/turso-db';

export const GET: APIRoute = async ({ request, locals }) => {
  const authError = await requireAuth({ request, locals });
  if (authError) return authError;
  
  try {
    const rows = await getAll('Nieuws', {
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
    console.error('Error fetching nieuws:', error);
    return new Response(JSON.stringify({ 
      error: 'Database fout bij ophalen nieuws',
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
    
    const newId = await insert('Nieuws', {
      titel: data.titel,
      beschrijving: data.beschrijving || '',
      bron: data.bron || '',
      tags: JSON.stringify(data.tags || []),
      afbeelding: data.afbeelding || null,
    }, locals);

    const newNieuwsItem = {
      id: newId,
      ...data,
      tags: data.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return new Response(JSON.stringify(newNieuwsItem), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating nieuws:', error);
    return new Response(JSON.stringify({ 
      error: 'Database fout bij aanmaken nieuws',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
