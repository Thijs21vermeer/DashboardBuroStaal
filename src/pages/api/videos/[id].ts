import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/api-auth';
import { getById, update, deleteById } from '../../../lib/turso-db';

export const GET: APIRoute = async ({ params, request, locals }) => {
  const authError = await requireAuth({ request, locals });
  if (authError) return authError;
  
  const { id } = params;
  
  try {
    const item = await getById('Videos', Number(id), locals);

    if (!item) {
      return new Response(JSON.stringify({ error: 'Video not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Parse tags properly
    let tags = [];
    if (item.tags) {
      try {
        tags = typeof item.tags === 'string' ? JSON.parse(item.tags) : item.tags;
      } catch {
        // Fallback for comma-separated strings
        tags = typeof item.tags === 'string' ? item.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [];
      }
    }

    // Map database fields to frontend expected fields
    const video = {
      ...item,
      youtube_url: item.videolink || item.youtube_url || '',
      tags: Array.isArray(tags) ? tags : [],
    };

    return new Response(JSON.stringify(video), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching video:', error);
    return new Response(JSON.stringify({ 
      error: 'Database fout',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ params, request, locals }) => {
  const authError = await requireAuth({ request, locals });
  if (authError) return authError;
  
  try {
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await request.json();
    
    // Ensure tags is an array before stringifying
    const tagsArray = Array.isArray(data.tags) ? data.tags : 
                     (typeof data.tags === 'string' ? data.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : []);

    const success = await update('Videos', Number(id), {
      titel: data.titel,
      beschrijving: data.beschrijving || '',
      videolink: data.videolink || data.youtube_url || '',
      categorie: data.categorie || '',
      afbeelding: data.afbeelding || data.thumbnail || null,
      tags: JSON.stringify(tagsArray),
    }, locals);

    if (!success) {
      return new Response(JSON.stringify({ error: 'Video not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updatedItem = await getById('Videos', Number(id), locals);
    
    // Parse tags properly
    let tags = [];
    if (updatedItem.tags) {
      try {
        tags = typeof updatedItem.tags === 'string' ? JSON.parse(updatedItem.tags) : updatedItem.tags;
      } catch {
        // Fallback for comma-separated strings
        tags = typeof updatedItem.tags === 'string' ? updatedItem.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [];
      }
    }
    
    // Map database fields to frontend expected fields
    const updatedVideo = {
      ...updatedItem,
      youtube_url: updatedItem.videolink || updatedItem.youtube_url || '',
      tags: Array.isArray(tags) ? tags : [],
    };

    return new Response(JSON.stringify(updatedVideo), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating video:', error);
    return new Response(JSON.stringify({ 
      error: 'Database fout',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ params, request, locals }) => {
  const authError = await requireAuth({ request, locals });
  if (authError) return authError;
  
  try {
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const success = await deleteById('Videos', Number(id), locals);

    if (!success) {
      return new Response(JSON.stringify({ error: 'Video not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ message: 'Video deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting video:', error);
    return new Response(JSON.stringify({ 
      error: 'Database fout',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};





