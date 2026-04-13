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
import { Auth0LoginForm } from './auth/Auth0LoginForm';
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
        const response = await fetch(`${baseUrl}/api/auth0/me`, {
          credentials: 'include', // Stuurt cookies automatisch mee
        });

        if (response.ok) {
          const data = await response.json();
          if (data.authenticated && data.user) {
            setIsAuthenticated(true);
            setUserName(data.user.name || data.user.email);
          }
        }
      } catch (error) {
        console.error('Session validation error:', error);
      } finally {
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

  // Toon niets tijdens het laden
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#280bc4]"></div>
          <p className="mt-4 text-gray-600">Laden...</p>
        </div>
      </div>
    );
  }

  // Toon login scherm als niet ingelogd
  if (!isAuthenticated) {
    return <Auth0LoginForm error={loginError} />;
  };

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















































