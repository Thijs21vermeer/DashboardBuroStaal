import React, { useState, useEffect } from 'react';
import { Sidebar } from './dashboard/Sidebar';
import { Overview } from './kennisbank/Overview';
import { KennisbankPage } from './kennisbank/KennisbankPage';
import { CasesPage } from './kennisbank/CasesPage';
import { TrendsPage } from './kennisbank/TrendsPage';
import { TeamPage } from './kennisbank/TeamPage';
import { NewsPage } from './kennisbank/NewsPage';
import { AgendaPlanning } from './dashboard/AgendaPlanning';
import { ActionsPriorities } from './dashboard/ActionsPriorities';
import { ProjectProgress } from './dashboard/ProjectProgress';
import { RolesOwnership } from './dashboard/RolesOwnership';
import { KnowledgeHub } from './dashboard/KnowledgeHub';
import type { PageType } from '../types';
import { LoginForm } from './auth/LoginForm';

interface Props {
  children: React.ReactNode;
}

export default function Dashboard({ children }: Props) {
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
    // Simpele authenticatie - in productie zou dit via een API gaan
    if (password === 'BurostaalDB') {
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
  }

  const renderContent = () => {
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
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Sidebar */}
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 transition-all duration-300">
        <main className="max-w-[1600px] mx-auto px-6 py-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

















