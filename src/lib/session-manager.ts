// Simple in-memory session management
// Voor productie zou je dit in een database willen opslaan

interface Session {
  token: string;
  createdAt: number;
  expiresAt: number;
}

// In-memory opslag van actieve sessies
const activeSessions = new Map<string, Session>();

// Sessie geldigheid: 24 uur
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 uur in milliseconden

/**
 * Genereer een nieuwe sessie token
 */
export function generateToken(): string {
  return crypto.randomUUID();
}

/**
 * Creëer een nieuwe sessie
 */
export function createSession(): string {
  const token = generateToken();
  const now = Date.now();
  
  const session: Session = {
    token,
    createdAt: now,
    expiresAt: now + SESSION_DURATION
  };
  
  activeSessions.set(token, session);
  
  // Cleanup oude sessies
  cleanupExpiredSessions();
  
  return token;
}

/**
 * Valideer of een token geldig is
 */
export function validateToken(token: string): boolean {
  if (!token) return false;
  
  const session = activeSessions.get(token);
  
  if (!session) return false;
  
  // Check of sessie verlopen is
  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return false;
  }
  
  return true;
}

/**
 * Verwijder een sessie (logout)
 */
export function deleteSession(token: string): void {
  activeSessions.delete(token);
}

/**
 * Verwijder verlopen sessies
 */
function cleanupExpiredSessions(): void {
  const now = Date.now();
  
  for (const [token, session] of activeSessions.entries()) {
    if (now > session.expiresAt) {
      activeSessions.delete(token);
    }
  }
}

/**
 * Get actieve sessie count (voor debugging)
 */
export function getActiveSessionCount(): number {
  cleanupExpiredSessions();
  return activeSessions.size;
}
