import React, { useState } from 'react';
import { Home, BookOpen, TrendingUp, Users, Newspaper, Settings, Briefcase, LogOut, Code, Video } from 'lucide-react';
import { baseUrl } from '../../lib/base-url';
import { 
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import type { PageType } from '../../types';

interface SidebarProps {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onLogout: () => void;
}

interface NavItem {
  id: PageType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

export function Sidebar({ currentPage, setCurrentPage, isOpen, setIsOpen, onLogout }: SidebarProps) {
  const navItems: NavItem[] = [
    {
      id: 'overzicht',
      label: 'Home',
      icon: <Home className="w-5 h-5" />,
      description: 'Dashboard overzicht'
    },
    {
      id: 'kennisbank',
      label: 'Kennisbank',
      icon: <BookOpen className="w-5 h-5" />,
      description: 'Artikelen, whitepapers & presentaties'
    },
    {
      id: 'cases',
      label: 'Case Studies',
      icon: <Briefcase className="w-5 h-5" />,
      description: 'Succesvolle klantprojecten'
    },
    {
      id: 'trends',
      label: 'Trends & Inzichten',
      icon: <TrendingUp className="w-5 h-5" />,
      description: 'Maakindustrie ontwikkelingen'
    },
    {
      id: 'team',
      label: 'Team & Expertise',
      icon: <Users className="w-5 h-5" />,
      description: 'Wie doet wat?'
    },
    {
      id: 'nieuws',
      label: 'Intern Nieuws',
      icon: <Newspaper className="w-5 h-5" />,
      description: 'Bedrijfsupdates'
    },
    {
      id: 'tools',
      label: 'Developer Tools',
      icon: <Code className="w-5 h-5" />,
      description: 'Code snippets & commands'
    },
    {
      id: 'videos',
      label: 'Video Catalogus',
      icon: <Video className="w-5 h-5" />,
      description: 'Instructievideo\'s & tutorials'
    }
  ];

  return (
    <>
      {/* Toggle button when closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed left-4 top-4 z-50 p-3 bg-gradient-to-br from-black to-[#280bc4] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          title="Open menu"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Sidebar */}
      {isOpen && (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-40 shadow-xl">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="relative border-b border-gray-200 h-32 flex items-start justify-center pt-6">
              <div className="w-48 h-20">
                <img src={`${baseUrl}/logo.svg`} alt="Buro Staal Logo" className="w-full h-full object-contain" />
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-3">
              <div className="space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      currentPage === item.id
                        ? 'bg-gradient-to-r from-[#280bc4] to-[#280bc4]/80 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className={`${currentPage === item.id ? 'text-white' : 'text-gray-600'}`}>
                      {item.icon}
                    </span>
                    <div className="flex-1 text-left">
                      <div className={`font-medium text-sm ${
                        currentPage === item.id ? 'text-white' : 'text-gray-900'
                      }`}>
                        {item.label}
                      </div>
                      <div className={`text-xs ${
                        currentPage === item.id ? 'text-white/80' : 'text-gray-500'
                      }`}>
                        {item.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </nav>

            {/* Admin Button */}
            <div className="p-3 border-t border-gray-200 space-y-2">
              <a
                href={`${baseUrl}/admin`}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all bg-gradient-to-r from-black to-[#280bc4] text-white hover:shadow-lg hover:scale-[1.02]"
              >
                <Settings className="w-5 h-5" />
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm">Admin Panel</div>
                  <div className="text-xs text-white/80">Content beheren</div>
                </div>
              </a>

              <button
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all bg-red-500 text-white hover:bg-red-600 hover:shadow-lg hover:scale-[1.02]"
              >
                <LogOut className="w-5 h-5" />
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm">Uitloggen</div>
                  <div className="text-xs text-white/80">Veilig afsluiten</div>
                </div>
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 transition-opacity duration-1000 ease-in-out"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}




























