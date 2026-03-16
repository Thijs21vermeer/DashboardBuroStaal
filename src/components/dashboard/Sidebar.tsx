import React, { useState } from 'react';
import { Home, BookOpen, TrendingUp, Users, Newspaper, Settings, Briefcase, LogOut, Code, Video, ChevronDown, ChevronRight, Building2, Lightbulb, GraduationCap } from 'lucide-react';
import { baseUrl } from '../../lib/base-url';
import { 
  ChevronLeft
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
}

interface CategoryGroup {
  label: string;
  icon: React.ReactNode;
  items: NavItem[];
}

export function Sidebar({ currentPage, setCurrentPage, isOpen, setIsOpen, onLogout }: SidebarProps) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const categories: CategoryGroup[] = [
    {
      label: 'Kennis',
      icon: <GraduationCap className="w-5 h-5" />,
      items: [
        {
          id: 'kennisbank',
          label: 'Kennisbank',
          icon: <BookOpen className="w-4 h-4" />
        },
        {
          id: 'tools',
          label: 'Tools',
          icon: <Code className="w-4 h-4" />
        },
        {
          id: 'videos',
          label: "Video's",
          icon: <Video className="w-4 h-4" />
        }
      ]
    },
    {
      label: 'Bedrijf',
      icon: <Building2 className="w-5 h-5" />,
      items: [
        {
          id: 'team',
          label: 'Team',
          icon: <Users className="w-4 h-4" />
        },
        {
          id: 'nieuws',
          label: 'Nieuws',
          icon: <Newspaper className="w-4 h-4" />
        }
      ]
    },
    {
      label: 'Inzichten',
      icon: <Lightbulb className="w-5 h-5" />,
      items: [
        {
          id: 'trends',
          label: 'Trends',
          icon: <TrendingUp className="w-4 h-4" />
        },
        {
          id: 'cases',
          label: 'Cases',
          icon: <Briefcase className="w-4 h-4" />
        }
      ]
    }
  ];

  const toggleCategory = (categoryLabel: string) => {
    setOpenCategory(openCategory === categoryLabel ? null : categoryLabel);
  };

  return (
    <>
      {/* Toggle button when closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed left-2 top-2 sm:left-4 sm:top-4 z-50 p-2 sm:p-3 bg-gradient-to-br from-black to-[#280bc4] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          title="Open menu"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>
      )}

      {/* Sidebar */}
      {isOpen && (
        <aside className="fixed left-0 top-0 h-screen w-[280px] sm:w-64 bg-white border-r border-gray-200 z-40 shadow-xl">
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
                {/* Overzicht - standalone */}
                <button
                  onClick={() => {
                    setCurrentPage('overzicht');
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    currentPage === 'overzicht'
                      ? 'bg-gradient-to-r from-[#280bc4] to-[#280bc4]/80 shadow-md !text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  style={currentPage === 'overzicht' ? { color: 'white' } : {}}
                >
                  <Home className="w-5 h-5" style={currentPage === 'overzicht' ? { color: 'white' } : {}} />
                  <span className="font-medium text-sm" style={currentPage === 'overzicht' ? { color: 'white' } : {}}>Overzicht</span>
                </button>

                {/* Divider */}
                <div className="h-px bg-gray-200 my-2" />

                {/* Categories */}
                {categories.map((category) => {
                  const isOpen = openCategory === category.label;
                  return (
                    <div key={category.label}>
                      {/* Category Header */}
                      <button
                        onClick={() => toggleCategory(category.label)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-gray-700 hover:bg-gray-100"
                      >
                        <span className="text-gray-600">{category.icon}</span>
                        <span className="flex-1 text-left font-semibold text-sm text-gray-900">
                          {category.label}
                        </span>
                        {isOpen ? (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                        )}
                      </button>

                      {/* Category Items */}
                      {isOpen && (
                        <div className="ml-4 mt-1 space-y-1">
                          {category.items.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => {
                                setCurrentPage(item.id);
                                setIsOpen(false);
                              }}
                              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                                currentPage === item.id
                                  ? 'bg-gradient-to-r from-[#280bc4] to-[#280bc4]/80 shadow-md !text-white'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                              style={currentPage === item.id ? { color: 'white' } : {}}
                            >
                              <span className={currentPage === item.id ? '!text-white' : 'text-gray-600'} style={currentPage === item.id ? { color: 'white' } : {}}>
                                {item.icon}
                              </span>
                              <span className={`text-sm font-medium ${currentPage === item.id ? '!text-white' : ''}`} style={currentPage === item.id ? { color: 'white' } : {}}>
                                {item.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
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





































