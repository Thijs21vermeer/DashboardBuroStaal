// Server-side base URL (for Astro components and API routes)
export const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');

// Client-side base URL (for React components in browser)
export const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    // In browser, use empty string for relative URLs
    return '';
  }
  return import.meta.env.BASE_URL.replace(/\/$/, '');
};
