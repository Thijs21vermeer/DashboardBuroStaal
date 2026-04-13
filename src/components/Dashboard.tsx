import React, { useState, useEffect } from 'react';
import { Sidebar } from './dashboard/Sidebar';
import { Overview } from './kennisbank/Overview';
import { KennisbankPage } from './kennisbank/KennisbankPage';
import { CasesPage } from './kennisbank/CasesPage';
import { TrendsPage } from './kennisbank/TrendsPage';
import { TeamPage } from './kennisbank/TeamPage';
import { NewsPage } from './kennisbank/NewsPage';
import ToolsPage from './kennisbank/ToolsPage';
import VideosPage from './kennisbank/VideosPage';
import { KennisItemDetail } from './kennisbank/KennisItemDetail';
import { TrendDetail } from './kennisbank/TrendDetail';
import { NewsDetail } from './kennisbank/NewsDetail';
import type { PageType } from '../types';
import KennisKoenWidget from './KennisKoenWidget';
import { baseUrl } from '../lib/base-url';

interface Props {
  children: React.ReactNode;
}

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState<PageType>('overzicht');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState<string>('');

  // Valideer Auth0 sessie bij mount
  useEffect(() => {
    const validateSession = async () => {
      try {
        // Check for error in URL parameters
        const params = new URLSearchParams(window.location.search);
        const errorParam = params.get('error');
        
        if (errorParam) {
          setLoginError(decodeURIComponent(errorParam));
          setIsLoading(false);
          // Clear error from URL without reload
          window.history.replaceState({}, '', window.location.pathname);
          return;
        }
        
        const response = await fetch(`${baseUrl}/api/auth0/me`, {
          credentials: 'include', // Stuurt cookies automatisch mee
        });

        if (response.ok) {
          const data = await response.json();
          setUserName(data.user.name || data.user.email || 'Gebruiker');
          setIsAuthenticated(true);
          setIsLoading(false);
        } else if (response.status === 401) {
          // Not authenticated - redirect to Auth0 login automatically
          if (!isAuthenticated) {
            window.location.href = `${baseUrl}/api/auth0/login`;
            return;
          }
        } else {
          // Server error (500, etc.)
          console.error('❌ Server error during session validation:', response.status);
          setLoginError('Er is een serverfout opgetreden. Probeer het later opnieuw.');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('❌ Network error during session validation:', error);
        setLoginError('Kan geen verbinding maken met de server. Controleer je internetverbinding.');
        setIsLoading(false);
      }
    };

    validateSession();
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserName('');
    // Redirect naar Auth0 logout endpoint
    window.location.href = `${baseUrl}/api/auth0/logout`;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600">Dashboard laden...</p>
        </div>
      </div>
    );
  }

  // Error state (only shown if there's an error from Auth0 callback)
  if (loginError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Login mislukt</h2>
            <p className="text-red-600 mb-6">{loginError}</p>
            <button
              onClick={() => {
                setLoginError(null);
                window.location.href = `${baseUrl}/api/auth0/login`;
              }}
              className="w-full bg-purple-600 text-white rounded-lg px-4 py-3 font-semibold hover:bg-purple-700 transition-colors"
            >
              Opnieuw proberen
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    // Check for detail pages
    if (currentPage.startsWith('kennisitem-')) {
      const itemId = parseInt(currentPage.replace('kennisitem-', ''));
      return <KennisItemDetail itemId={itemId} onBack={() => setCurrentPage('overzicht')} />;
    }
    
    if (currentPage.startsWith('trend-')) {
      const trendId = parseInt(currentPage.replace('trend-', ''));
      return <TrendDetail trendId={trendId} onBack={() => setCurrentPage('overzicht')} />;
    }
    
    if (currentPage.startsWith('nieuws-')) {
      const newsId = parseInt(currentPage.replace('nieuws-', ''));
      return <NewsDetail newsId={newsId} onBack={() => setCurrentPage('overzicht')} />;
    }

    switch (currentPage) {
      case 'overzicht':
        return <Overview onNavigate={(page) => setCurrentPage(page as PageType)} />;
      case 'kennisbank':
        return <KennisbankPage />;
      case 'cases':
        return <CasesPage />;
      case 'trends':
        return <TrendsPage />;
      case 'team':
        return <TeamPage />;
      case 'nieuws':
        return <NewsPage />;
      case 'tools':
        return <ToolsPage />;
      case 'videos':
        return <VideosPage />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white notranslate" translate="no">
      {/* Sidebar */}
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="w-full px-3 sm:px-4 md:px-[6%] lg:px-[8%] xl:px-[10%] 2xl:px-[12%] py-3 sm:py-4 md:py-6">
          {renderContent()}
        </div>
      </div>
      
      {/* Kennis Koen Widget - Floating AI Assistant (not on admin page) */}
      {currentPage !== 'admin' && <KennisKoenWidget />}
    </div>
  );
}




















































