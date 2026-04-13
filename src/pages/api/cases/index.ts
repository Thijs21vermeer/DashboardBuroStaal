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

    // Parse JSON fields
    const parsedRows = rows.map(row => {
      if (typeof row.tags === 'string') {
        try {
          row.tags = JSON.parse(row.tags);
        } catch {
          row.tags = [];
        }
      }
      // Map database fields to frontend fields
      return {
        ...row,
        uitdaging: row.beschrijving,
        oplossing: row.resultaat,
        resultaten: [],
      };
    });

    return new Response(JSON.stringify(parsedRows), {
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
      klant: data.klant,
      beschrijving: data.uitdaging || data.challenge || data.beschrijving,
      resultaat: data.oplossing || data.solution || data.resultaat,
      afbeelding: data.afbeelding || null,
      tags: JSON.stringify(data.tags || []),
    }, locals);

    const newCase = {
      id: newId,
      titel: data.titel,
      klant: data.klant,
      uitdaging: data.uitdaging,
      oplossing: data.oplossing,
      resultaten: [],
      tags: data.tags || [],
      afbeelding: data.afbeelding || null,
      createdAt: new Date().toISOString(),
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


