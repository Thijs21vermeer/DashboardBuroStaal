/**
 * Environment Initialization
 * Load .env file in development mode
 */

// Load dotenv in development/Node.js environment
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
  try {
    // Dynamic import to avoid issues in Cloudflare Workers
    await import('dotenv/config');
    console.log('✅ Environment variables loaded from .env');
  } catch (error) {
    console.warn('⚠️ Could not load dotenv (this is normal in production)');
  }
}

export {};
