import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals }) => {
  // Check multiple sources for environment variables
  const getEnvValue = (key: string) => {
    return locals?.runtime?.env?.[key] || import.meta.env[key] || process.env[key];
  };
  
  return new Response(
    JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: {
        hasAzureServer: !!getEnvValue('AZURE_SQL_SERVER'),
        hasAzureDatabase: !!getEnvValue('AZURE_SQL_DATABASE'),
        hasAzureUser: !!getEnvValue('AZURE_SQL_USER'),
        hasAzurePassword: !!getEnvValue('AZURE_SQL_PASSWORD'),
        hasSlackWebhook: !!getEnvValue('SLACK_WEBHOOK'),
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


