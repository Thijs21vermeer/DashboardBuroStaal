import type { APIRoute } from 'astro';
import { generateToken } from '../../../lib/session-manager';
import { checkRateLimit, recordFailedAttempt, resetRateLimit } from '../../../lib/rate-limiter';
import { getDashboardPassword } from '../../../lib/config';

export const POST: APIRoute = async ({ request, locals }) => {
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

    // Haal het wachtwoord op uit environment variables (met locals support voor Netlify)
    const correctPassword = getDashboardPassword(locals);

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
      
      // Genereer een echte JWT token (met locals voor Netlify)
      const token = await generateToken(locals);
      
      // Set HttpOnly cookie (veilig tegen XSS)
      const cookieOptions = [
        `auth_token=${token}`,
        'HttpOnly',
        'Secure', // Only over HTTPS
        'SameSite=Strict',
        'Path=/',
        'Max-Age=86400' // 24 hours
      ];
      
      return new Response(
        JSON.stringify({ success: true }), // Token NIET meer in response!
        {
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            'Set-Cookie': cookieOptions.join('; ')
          }
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





