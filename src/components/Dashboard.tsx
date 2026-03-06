import React, { useState } from 'react';
import { Sidebar } from './dashboard/Sidebar';
import Overview from './kennisbank/Overview';
import KennisbankPage from './kennisbank/KennisbankPage';
import CasesPage from './kennisbank/CasesPage';
import TrendsPage from './kennisbank/TrendsPage';
import TeamPage from './kennisbank/TeamPage';
import NewsPage from './kennisbank/NewsPage';
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

  const handleLogin = (password: string) => {
    // Simpele authenticatie - in productie zou dit via een API gaan
    if (password === 'BurostaalDB') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Ongeldig wachtwoord');
    }
  };

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












