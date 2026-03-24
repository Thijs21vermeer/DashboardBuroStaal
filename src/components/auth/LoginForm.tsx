import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { baseUrl } from '../../lib/base-url';

interface LoginFormProps {
  onLogin: (token: string) => void;
  error?: string;
}

export function LoginForm({ onLogin, error }: LoginFormProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Ontvang en stuur cookies
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success && data.token) {
        // Token wordt nu opgeslagen in HttpOnly cookie door de server
        // We gebruiken de token alleen als signaal dat login succesvol was
        onLogin(data.token);
      } else {
        onLogin(''); // Empty string triggers error in parent
      }
    } catch (error) {
      console.error('Login error:', error);
      onLogin(''); // Trigger error in parent component
    } finally {
      setIsLoading(false);
    }
  };

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
            Log in - Buro Staal Dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="password">Wachtwoord</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Voer je wachtwoord in"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 border-[#7ef769]/30 focus:border-[#7ef769] focus:ring-[#7ef769]"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#7ef769] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#280bc4] hover:bg-[#280bc4]/90 !text-white font-semibold py-6 shadow-lg hover:shadow-xl transition-all"
              disabled={isLoading}
            >
              {isLoading ? 'Bezig met inloggen...' : 'Inloggen'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}





