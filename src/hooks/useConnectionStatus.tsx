import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/button';

export type ConnectionStatus = 'connected' | 'mock' | 'error';

interface ConnectionStatusBannerProps {
  status: ConnectionStatus;
  onRetry: () => void;
}

export function ConnectionStatusBanner({ status, onRetry }: ConnectionStatusBannerProps) {
  if (status === 'connected') {
    return (
      <div className="mb-4 p-3 rounded-lg border bg-green-50 border-green-200">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-700 font-medium">
            ✅ Verbonden met database
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`mb-4 p-4 rounded-lg border ${
      status === 'mock' 
        ? 'bg-yellow-50 border-yellow-200' 
        : 'bg-red-50 border-red-200'
    }`}>
      <div className="flex items-start gap-3">
        <AlertCircle className={`w-5 h-5 mt-0.5 ${
          status === 'mock' ? 'text-yellow-600' : 'text-red-600'
        }`} />
        <div className="flex-1">
          <h3 className={`font-semibold ${
            status === 'mock' ? 'text-yellow-900' : 'text-red-900'
          }`}>
            {status === 'mock' 
              ? '⚠️ Gebruik Mock Data' 
              : '❌ Database Connectie Mislukt'}
          </h3>
          <p className={`text-sm mt-1 ${
            status === 'mock' ? 'text-yellow-700' : 'text-red-700'
          }`}>
            {status === 'mock'
              ? 'De database is bereikbaar maar leeg. Demo data wordt getoond. Wijzigingen worden niet opgeslagen.'
              : 'Kan geen verbinding maken met de database. Demo data wordt getoond. Check de Netlify environment variables en Azure firewall regels.'}
          </p>
          <Button
            onClick={onRetry}
            size="sm"
            variant="outline"
            className="mt-2"
          >
            <RefreshCw className="w-3 h-3 mr-2" />
            Opnieuw proberen
          </Button>
        </div>
      </div>
    </div>
  );
}
