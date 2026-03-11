import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals }) => {
  const env = locals?.runtime?.env || import.meta.env;
  
  return new Response(
    JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: {
        hasAzureServer: !!env.AZURE_SQL_SERVER,
        hasAzureDatabase: !!env.AZURE_SQL_DATABASE,
        hasAzureUser: !!env.AZURE_SQL_USER,
        hasAzurePassword: !!env.AZURE_SQL_PASSWORD,
        hasSlackWebhook: !!env.SLACK_WEBHOOK,
      },
      runtime: {
        node: process.version,
        platform: process.platform,
      },
    }),
    {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    }
  );
};

