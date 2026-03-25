import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/api-auth';
import { getAll, insert } from '../../../lib/turso-db';

// GET - Haal alle cases op
export const GET: APIRoute = async ({ request, locals }) => {
  const authError = await requireAuth({ request, locals });
  if (authError) return authError;
  
  try {
    const rows = await getAll('Cases', {
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
    console.error('Error fetching cases:', error);
    return new Response(JSON.stringify({ 
      error: 'Database fout bij ophalen cases',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// POST - Voeg een nieuwe case toe
export const POST: APIRoute = async ({ request, locals }) => {
  const authError = await requireAuth({ request, locals });
  if (authError) return authError;
  
  try {
    const data = await request.json();
    
    const newId = await insert('Cases', {
      titel: data.titel,
      beschrijving: data.beschrijving || '',
      klant: data.klant || '',
      resultaat: data.resultaat || '',
      afbeelding: data.afbeelding || null,
      tags: JSON.stringify(data.tags || []),
    }, locals);

    const newCase = {
      id: newId,
      ...data,
      tags: data.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return new Response(JSON.stringify(newCase), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating case:', error);
    return new Response(JSON.stringify({ 
      error: 'Database fout bij aanmaken case',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
