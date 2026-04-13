import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Lock, AlertCircle } from 'lucide-react';
import { baseUrl } from '../../lib/base-url';

interface Auth0LoginFormProps {
  error?: string;
}

export function Auth0LoginForm({ error }: Auth0LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);

  // Check for errors in URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get('error');
    if (errorParam) {
      setUrlError(decodeURIComponent(errorParam));
      // Clear error from URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const handleLogin = () => {
    setIsLoading(true);
    // Redirect to Auth0 login
    window.location.href = `${baseUrl}/api/auth0/login`;
  };

  const displayError = error || urlError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#280bc4] via-[#280bc4]/90 to-[#280bc4]/80 flex items-center justify-center p-4">
      {/* Decoratieve achtergrond elementen */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#7ef769] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-[#7ef769] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-[#7ef769] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <Card className="w-full max-w-md relative z-10 shadow-2xl border-[#7ef769]/20">
        <CardHeader className="space-y-1 text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#7ef769] to-[#7ef769]/80 rounded-2xl flex items-center justify-center shadow-lg">
              <Lock className="w-8 h-8 text-black" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welkom terug</CardTitle>
          <CardDescription className="text-base">
            Log in met Auth0 - Buro Staal Dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          {displayError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{displayError}</span>
            </div>
          )}
          
          <Button 
            onClick={handleLogin}
            className="w-full bg-[#280bc4] hover:bg-[#280bc4]/90 !text-white font-semibold py-6 shadow-lg hover:shadow-xl transition-all"
            disabled={isLoading}
          >
            {isLoading ? 'Doorverwijzen naar Auth0...' : 'Inloggen met Auth0'}
          </Button>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Veilig inloggen via Auth0</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
