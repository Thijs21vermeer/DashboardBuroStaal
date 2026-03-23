import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals }) => {
  try {
    // Check environment variables (without exposing sensitive data)
    const envCheck = {
      JWT_SECRET: !!import.meta.env.JWT_SECRET || !!(locals?.runtime?.env?.JWT_SECRET),
      AZURE_SQL_SERVER: !!import.meta.env.AZURE_SQL_SERVER || !!(locals?.runtime?.env?.AZURE_SQL_SERVER),
      AZURE_SQL_DATABASE: !!import.meta.env.AZURE_SQL_DATABASE || !!(locals?.runtime?.env?.AZURE_SQL_DATABASE),
      AZURE_SQL_USER: !!import.meta.env.AZURE_SQL_USER || !!(locals?.runtime?.env?.AZURE_SQL_USER),
      AZURE_SQL_PASSWORD: !!import.meta.env.AZURE_SQL_PASSWORD || !!(locals?.runtime?.env?.AZURE_SQL_PASSWORD),
      
      // Check sources
      fromImportMeta: !!import.meta.env.JWT_SECRET,
      fromLocalsRuntime: !!(locals?.runtime?.env?.JWT_SECRET),
      
      // Platform info
      platform: locals?.runtime?.cf ? 'cloudflare' : 'netlify',
      hasLocals: !!locals,
      hasRuntime: !!(locals?.runtime),
      hasEnv: !!(locals?.runtime?.env),
    };

    return new Response(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        environment: envCheck,
        nodeEnv: process.env.NODE_ENV,
      }, null, 2),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    const err = error as Error;
    return new Response(
      JSON.stringify({
        error: 'Diagnostics failed',
        message: err.message,
        stack: err.stack
      }, null, 2),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
