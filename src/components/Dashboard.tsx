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
import { AgendaPlanning } from './dashboard/AgendaPlanning';
import { ActionsPriorities } from './dashboard/ActionsPriorities';
import { ProjectProgress } from './dashboard/ProjectProgress';
import { RolesOwnership } from './dashboard/RolesOwnership';
import { KnowledgeHub } from './dashboard/KnowledgeHub';
import type { PageType } from '../types';
import { LoginForm } from './auth/LoginForm';
import KennisKoenWidget from './KennisKoenWidget';

interface Props {
  children: React.ReactNode;
}

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState<PageType>('overzicht');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Check localStorage bij mount
  useEffect(() => {
    const loggedIn = localStorage.getItem('burostaal_authenticated');
    if (loggedIn === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (password: string) => {
    // Verificatie gebeurt nu in de backend API
    if (password) {
      setIsAuthenticated(true);
      localStorage.setItem('burostaal_authenticated', 'true');
      setLoginError('');
    } else {
      setLoginError('Ongeldig wachtwoord');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('burostaal_authenticated');
    setCurrentPage('overzicht');
  };

  // Toon niets tijdens het laden
  if (isLoading) {
    return null;
  }

  // Toon login scherm als niet ingelogd
  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} error={loginError} />;
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








































