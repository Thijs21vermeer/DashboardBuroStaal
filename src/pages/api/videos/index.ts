import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/api-auth';
import { getAll, insert } from '../../../lib/turso-db';

export const GET: APIRoute = async ({ request, locals }) => {
  const authError = await requireAuth({ request, locals });
  if (authError) return authError;
  
  try {
    const items = await getAll('Videos', locals);
    
    // Map database fields to frontend expected fields
    const videos = items.map((item: any) => {
      let tags = [];
      if (item.tags) {
        try {
          tags = typeof item.tags === 'string' ? JSON.parse(item.tags) : item.tags;
        } catch {
          // Fallback for comma-separated strings
          tags = typeof item.tags === 'string' ? item.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [];
        }
      }
      
      return {
        ...item,
        youtube_url: item.videolink || item.youtube_url || '',
        tags: Array.isArray(tags) ? tags : [],
      };
    });
    
    return new Response(JSON.stringify(videos), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return new Response(JSON.stringify({ 
      error: 'Database fout',
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
    
    // Ensure tags is an array before stringifying
    const tagsArray = Array.isArray(data.tags) ? data.tags : 
                     (typeof data.tags === 'string' ? data.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : []);
    
    const newId = await insert('Videos', {
      titel: data.titel,
      beschrijving: data.beschrijving || '',
      videolink: data.videolink || data.youtube_url || '',
      categorie: data.categorie || '',
      afbeelding: data.afbeelding || data.thumbnail || null,
      tags: JSON.stringify(tagsArray),
    }, locals);

    // Return with youtube_url for frontend compatibility
    const newVideo = {
      id: newId,
      titel: data.titel,
      beschrijving: data.beschrijving || '',
      youtube_url: data.videolink || data.youtube_url || '',
      categorie: data.categorie || '',
      tags: tagsArray,
      eigenaar: data.eigenaar || '',
      featured: data.featured || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return new Response(JSON.stringify(newVideo), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating video:', error);
    return new Response(JSON.stringify({ 
      error: 'Database fout bij aanmaken video',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};





