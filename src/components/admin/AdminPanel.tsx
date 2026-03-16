import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import KennisItemsManager from './KennisItemsManager';
import CasesManager from './CasesManager';
import TrendsManager from './TrendsManager';
import NewsManager from './NewsManager';
import TeamManager from './TeamManager';
import ToolsManager from './ToolsManager';
import VideosManager from './VideosManager';
import { LoginModal } from './LoginModal';
import { Settings, Database, ArrowLeft, Users, Code, Video, LogOut } from 'lucide-react';
import React from 'react';
import { baseUrl } from '../../lib/base-url';
import { isAuthenticated, verifyToken, clearAuthToken } from '../../lib/auth-client';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Admin Panel Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white p-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-red-800 mb-2">Er is een fout opgetreden</h2>
              <p className="text-red-600 mb-4">{this.state.error?.message}</p>
              <pre className="bg-red-100 p-4 rounded text-xs overflow-auto mb-4">
                {this.state.error?.stack}
              </pre>
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Herlaad pagina
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function AdminPanel() {
  const [error, setError] = React.useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [isAuthenticating, setIsAuthenticating] = React.useState(true);

  React.useEffect(() => {
    // Check authentication on mount
    const checkAuth = async () => {
      if (!isAuthenticated()) {
        setShowLoginModal(true);
        setIsAuthenticating(false);
        return;
      }

      // Verify token is still valid
      const valid = await verifyToken(baseUrl);
      if (!valid) {
        setShowLoginModal(true);
      }
      setIsAuthenticating(false);
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    setIsAuthenticating(false);
  };

  const handleLogout = () => {
    clearAuthToken();
    setShowLoginModal(true);
  };

  React.useEffect(() => {
    // Test if we can access the API
    const testAPI = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/kennisitems`);
        if (!response.ok) {
          console.warn('API test failed, will use mock data');
        }
      } catch (err) {
        console.error('API connection error:', err);
      }
    };
    testAPI();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-800 mb-2">Error</h2>
            <p className="text-red-600">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-red-600 hover:bg-red-700"
            >
              Herlaad pagina
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isAuthenticating) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#280bc4] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Bezig met laden...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <LoginModal isOpen={showLoginModal} onSuccess={handleLoginSuccess} />
      
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-black to-[#280bc4] text-white">
          <div className="w-full px-4 sm:px-[6%] lg:px-[8%] xl:px-[10%] 2xl:px-[12%] py-8 sm:py-12 md:py-16">
            <div className="flex justify-between items-start mb-4 sm:mb-6">
              <Button
                onClick={() => window.location.href = `${baseUrl}/`}
                className="bg-[#7ef769] hover:bg-[#6de659] text-black font-semibold text-sm sm:text-base"
                style={{ color: 'white' }}
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Terug naar Dashboard
              </Button>
              
              <Button
                onClick={handleLogout}
                variant="outline"
                className="text-sm sm:text-base text-white border-white hover:bg-white/10"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                <span className="hidden sm:inline">Uitloggen</span>
                <span className="sm:hidden">Uit</span>
              </Button>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-[#280bc4]" />
              <h1 className="text-2xl sm:text-3xl font-bold">Admin Panel</h1>
            </div>
            <p className="text-white/90 text-sm sm:text-base md:text-lg">
              Beheer de kennisbank, cases, trends en nieuws
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="w-full px-4 sm:px-[6%] lg:px-[8%] xl:px-[10%] 2xl:px-[12%] py-6 sm:py-8">
          <Tabs defaultValue="kennisitems" className="w-full">
            <div className="mb-6 sm:mb-8 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
              <TabsList className="inline-flex sm:grid sm:w-full sm:grid-cols-7 mb-0 min-w-max sm:min-w-0">
                <TabsTrigger value="kennisitems" className="text-xs sm:text-sm whitespace-nowrap">
                  <Database className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Kennisitems</span>
                  <span className="sm:hidden">Kennis</span>
                </TabsTrigger>
                <TabsTrigger value="cases" className="text-xs sm:text-sm whitespace-nowrap">
                  <Database className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Cases
                </TabsTrigger>
                <TabsTrigger value="trends" className="text-xs sm:text-sm whitespace-nowrap">
                  <Database className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Trends
                </TabsTrigger>
                <TabsTrigger value="nieuws" className="text-xs sm:text-sm whitespace-nowrap">
                  <Database className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Nieuws
                </TabsTrigger>
                <TabsTrigger value="team" className="text-xs sm:text-sm whitespace-nowrap">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Team
                </TabsTrigger>
                <TabsTrigger value="tools" className="text-xs sm:text-sm whitespace-nowrap">
                  <Code className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Tools
                </TabsTrigger>
                <TabsTrigger value="videos" className="text-xs sm:text-sm whitespace-nowrap">
                  <Video className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Video's
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="kennisitems">
              <KennisItemsManager />
            </TabsContent>

            <TabsContent value="cases">
              <CasesManager />
            </TabsContent>

            <TabsContent value="trends">
              <TrendsManager />
            </TabsContent>

            <TabsContent value="nieuws">
              <NewsManager />
            </TabsContent>

            <TabsContent value="team">
              <TeamManager />
            </TabsContent>

            <TabsContent value="tools">
              <ToolsManager />
            </TabsContent>

            <TabsContent value="videos">
              <VideosManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ErrorBoundary>
  );
}
























