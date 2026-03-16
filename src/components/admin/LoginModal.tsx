import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { login } from '../../lib/auth-client';
import { getBaseUrl } from '../../lib/base-url';
import { Lock } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onSuccess: () => void;
}

export function LoginModal({ isOpen, onSuccess }: LoginModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const baseUrl = getBaseUrl();
      const success = await login(baseUrl, password);

      if (success) {
        onSuccess();
      } else {
        setError('Ongeldig wachtwoord');
      }
    } catch (error) {
      setError('Er is iets misgegaan. Probeer het opnieuw.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Admin Login
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="password">Wachtwoord</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Voer admin wachtwoord in"
              autoFocus
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full bg-[#280bc4] hover:bg-[#280bc4]/90"
            disabled={isLoading}
          >
            {isLoading ? 'Inloggen...' : 'Inloggen'}
          </Button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-4">
          Je moet ingelogd zijn om items te kunnen toevoegen, wijzigen of verwijderen
        </p>
      </DialogContent>
    </Dialog>
  );
}
