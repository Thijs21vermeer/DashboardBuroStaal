// Load .env file synchronously in development
if (process.env.NODE_ENV !== 'production' && !process.env.CLOUDFLARE_ENV) {
  try {
    require('dotenv').config();
    console.log('✅ Environment variables loaded');
  } catch (err) {
    console.warn('⚠️ Could not load .env file');
  }
}

module.exports = {};
