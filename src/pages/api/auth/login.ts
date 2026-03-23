import type { APIRoute } from 'astro';
import { generateToken } from '../../../lib/session-manager';
import { checkRateLimit, recordFailedAttempt, resetRateLimit } from '../../../lib/rate-limiter';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Check rate limit VOOR wachtwoord validatie
    const rateCheck = checkRateLimit(request);
    
    if (!rateCheck.allowed) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: rateCheck.reason,
          retryAfter: rateCheck.retryAfter 
        }),
        {
          status: 429, // Too Many Requests
          headers: { 
            'Content-Type': 'application/json',
            'Retry-After': String(rateCheck.retryAfter || 60)
          }
        }
      );
    }

    const { password } = await request.json();

    // Haal het wachtwoord op uit environment variables
    const correctPassword = import.meta.env.DASHBOARD_PASSWORD || process.env.DASHBOARD_PASSWORD;

    if (!correctPassword) {
      return new Response(
        JSON.stringify({ success: false, message: 'Server configuration error' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (password === correctPassword) {
      // Succesvol! Reset rate limit voor dit IP
      resetRateLimit(request);
      
      // Genereer een echte JWT token
      const token = await generateToken();
      
      return new Response(
        JSON.stringify({ success: true, token }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } else {
      // Verkeerd wachtwoord! Registreer mislukte poging
      recordFailedAttempt(request);
      
      // Haal nieuwe rate limit info op
      const newRateCheck = checkRateLimit(request);
      const remaining = newRateCheck.remaining ?? 0;
      
      let message = 'Ongeldig wachtwoord';
      if (remaining <= 3 && remaining > 0) {
        message += `. Nog ${remaining} ${remaining === 1 ? 'poging' : 'pogingen'} over.`;
      }
      
      return new Response(
        JSON.stringify({ success: false, message }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: 'Server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};


