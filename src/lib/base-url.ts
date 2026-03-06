// Server-side base URL (for Astro components and API routes)
export const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');

// Client-side base URL (for React components in browser)
export const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    // In browser, check if we have a base path
    const base = import.meta.env.BASE_URL?.replace(/\/$/, '') || '';
    // Return the base path (e.g., '/kennisbank' in Netlify, or '' in dev)
    return base;
  }
  return import.meta.env.BASE_URL.replace(/\/$/, '');
};

