/**
 * Client-side authentication utility
 * Manages auth token in localStorage and provides fetch with auth
 */

const TOKEN_KEY = 'buro_staal_auth_token';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}

/**
 * Fetch with automatic auth header
 */
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAuthToken();
  
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  // If 401, clear token (expired/invalid)
  if (response.status === 401) {
    clearAuthToken();
  }
  
  return response;
}

/**
 * Login en sla token op
 */
export async function login(baseUrl: string, password: string): Promise<boolean> {
  try {
    const response = await fetch(`${baseUrl}/api/auth/login-v2`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    
    if (!response.ok) {
      return false;
    }
    
    const data = await response.json();
    if (data.success && data.token) {
      setAuthToken(data.token);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
}

/**
 * Verifieer of de huidige token nog geldig is
 */
export async function verifyToken(baseUrl: string): Promise<boolean> {
  const token = getAuthToken();
  if (!token) return false;
  
  try {
    const response = await fetch(`${baseUrl}/api/auth/verify`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      clearAuthToken();
      return false;
    }
    
    const data = await response.json();
    return data.success === true;
  } catch (error) {
    clearAuthToken();
    return false;
  }
}
